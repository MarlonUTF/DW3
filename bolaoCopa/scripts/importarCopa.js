// scripts/importarCopa.js
import pool from '../src/database/pool.js'

// Slugs corretos da ESPN
const TEAMS_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams'
const SCOREBOARD_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard'

// ============================================================
// 1. Importar grupos e países
// ============================================================
async function importarGruposEPaises() {
  console.log('🔄 Buscando seleções da Copa...')

  const res = await fetch(TEAMS_URL)
  const data = await res.json()

  const teams = data?.sports?.[0]?.leagues?.[0]?.teams
  if (!teams) throw new Error('Estrutura de dados inesperada (teams)')

  // 1a. Extrair grupos únicos
  const gruposUnicos = new Set()
  for (const t of teams) {
    const grupoNome = t.team?.groups?.[0] // ex: "A", "B", etc.
    if (grupoNome) gruposUnicos.add(grupoNome)
  }

  // 1b. Inserir grupos no banco
  const grupoParaId = {} // mapeia letra -> id no banco
  for (const nome of [...gruposUnicos].sort()) {
    const { rows } = await pool.query(
      'INSERT INTO grupos (nome) VALUES ($1) ON CONFLICT (nome) DO UPDATE SET nome=$1 RETURNING id',
      [nome]
    )
    grupoParaId[nome] = rows[0].id
    console.log(`  ✅ Grupo ${nome} inserido (id=${rows[0].id})`)
  }

  // 1c. Inserir países com grupo_id
  let contador = 0
  for (const t of teams) {
    const { displayName, abbreviation, logos, groups } = t.team || {}
    if (!displayName || !abbreviation) {
      console.warn(`  ⚠️ Time incompleto: ${displayName || '???'}. Pulando.`)
      continue
    }
    const grupoNome = groups?.[0] || null
    const grupoId = grupoNome ? grupoParaId[grupoNome] : null
    const bandeiraUrl = logos?.[0]?.href || null

    await pool.query(
      `INSERT INTO paises (nome, sigla_fifa, bandeira_url, grupo_id)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (sigla_fifa) DO UPDATE
       SET nome=$1, bandeira_url=$3, grupo_id=$4`,
      [displayName, abbreviation.toUpperCase(), bandeiraUrl, grupoId]
    )
    contador++
  }
  console.log(`  ✅ ${contador} países importados/atualizados`)
}

// ============================================================
// 2. Importar jogos (com chaveamento)
// ============================================================
async function importarJogos() {
  console.log('🔄 Buscando jogos da Copa...')

  const res = await fetch(SCOREBOARD_URL)
  const data = await res.json()

  const events = data?.events
  if (!events || !Array.isArray(events)) throw new Error('Estrutura de dados inesperada (events)')

  let inseridos = 0

  for (const evt of events) {
    const comp = evt.competitions?.[0]
    if (!comp) continue

    const home = comp.competitors?.find(c => c.homeAway === 'home')
    const away = comp.competitors?.find(c => c.homeAway === 'away')
    if (!home || !away) continue

    // Determinar a fase a partir do campo season.type.name
    const nomeFase = evt.season?.type?.name || ''
    const fase = mapearFase(nomeFase)

    // Se não tem fase definida, usar 'Grupos' como fallback
    if (!fase) {
      console.warn(`  ⚠️ Fase desconhecida '${nomeFase}' para jogo ${evt.id}. Pulando.`)
      continue
    }

    const dataHora = evt.date
    const estadio = comp.venue?.fullName || null

    // Buscar IDs dos países
    const paisCasaId = await buscarPaisIdPorNome(home.team?.displayName)
    const paisForaId = await buscarPaisIdPorNome(away.team?.displayName)

    if (!paisCasaId || !paisForaId) {
      console.warn(`  ⚠️ País não encontrado para ${home.team?.displayName} ou ${away.team?.displayName}. Pulando.`)
      continue
    }

    // Número do jogo: usar o id da ESPN ou uma sequência? Vamos usar o id da ESPN como referência, mas salvar em um campo separado se quiser. Como temos a UNIQUE em numero_jogo, podemos usar o próprio id do evento.
    const numeroJogo = parseInt(evt.id) // ou gerar sequencial se preferir

    // Inserir ou ignorar se já existir
    await pool.query(
      `INSERT INTO jogos (numero_jogo, fase, data_hora, estadio, pais_casa_id, pais_fora_id)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (numero_jogo) DO NOTHING`,
      [numeroJogo, fase, dataHora, estadio, paisCasaId, paisForaId]
    )
    inseridos++
  }
  console.log(`  ✅ ${inseridos} jogos importados`)
}

// Mapeia o nome da fase (em inglês) para o ENUM do banco
function mapearFase(nome) {
  const mapa = {
    'Group': 'Grupos',
    'Round of 32': 'Dezesseis avos',
    'Rd of 16': 'Oitavas',
    'Quarterfinals': 'Quartas',
    'Semifinals': 'Semifinal',
    '3rd-Place Match': 'Terceiro Lugar',
    'Final': 'Final'
  }
  for (const [chave, valor] of Object.entries(mapa)) {
    if (nome.toLowerCase().includes(chave.toLowerCase())) return valor
  }
  return null
}
// ============================================================
// Funções auxiliares
// ============================================================

// Mapeia o nome do evento (ex: "1A vs 2B", "Winner Match 49 vs ...") para fase e origens
async function interpretarNomeEvento(nome, nomeCasa, nomeFora) {
  let fase = 'Grupos' // padrão
  let paisCasaId = null, paisForaId = null
  let origCasaJogo = null, origForaJogo = null
  let origCasaGrupo = null, origCasaPos = null, origForaGrupo = null, origForaPos = null

  // Padrão: "Winner Match X" ou "Winner X"
  const winnerMatchRegex = /Winner\s*(?:Match)?\s*(\d+)/i
  // Padrão: "1A", "2B", "1st Group A", etc.
  const grupoPosRegex = /(\d)(?:st|nd|rd|th)?\s*(?:Group\s*)?([A-Z])/i

  const partes = nome.split(/\s+vs\.?\s+/i)
  if (partes.length === 2) {
    const [parteCasa, parteFora] = partes

    // Tenta extrair "Winner Match X" para cada lado
    const matchCasa = parteCasa.match(winnerMatchRegex)
    const matchFora = parteFora.match(winnerMatchRegex)

    if (matchCasa || matchFora) {
      // Fase eliminatória baseada em origens de jogos
      if (matchCasa) origCasaJogo = parseInt(matchCasa[1])
      if (matchFora) origForaJogo = parseInt(matchFora[1])
      // Determinar fase pelo número de times restantes (aproximado)
      if (origCasaJogo && origCasaJogo >= 57) fase = 'Quartas'
      else if (origCasaJogo && origCasaJogo >= 49) fase = 'Oitavas'
      else fase = 'Dezesseis avos' // Copa 2026 começa nas 16 avos
    } else {
      // Tenta extrair posição + grupo (ex: "1A")
      const grupoPosCasa = parteCasa.match(grupoPosRegex)
      const grupoPosFora = parteFora.match(grupoPosRegex)

      if (grupoPosCasa) {
        origCasaPos = parseInt(grupoPosCasa[1])
        origCasaGrupo = await buscarGrupoIdPorNome(grupoPosCasa[2].toUpperCase())
        // Se for 3º colocado, é 16 avos
        if (origCasaPos === 3) fase = 'Dezesseis avos'
        else fase = 'Oitavas' // 1º e 2º normalmente vão direto pras oitavas? Depende do formato 2026
      }
      if (grupoPosFora) {
        origForaPos = parseInt(grupoPosFora[1])
        origForaGrupo = await buscarGrupoIdPorNome(grupoPosFora[2].toUpperCase())
        if (origForaPos === 3) fase = 'Dezesseis avos'
      }
    }
  }

  // Se não encontrou padrão de origem, mas temos nomes de times → fase de grupos
  if (!origCasaJogo && !origCasaGrupo && nomeCasa && nomeFora) {
    fase = 'Grupos'
    paisCasaId = await buscarPaisIdPorNome(nomeCasa)
    paisForaId = await buscarPaisIdPorNome(nomeFora)
  }

  return { fase, paisCasaId, paisForaId, origCasaJogo, origForaJogo, origCasaGrupo, origCasaPos, origForaGrupo, origForaPos }
}

async function buscarPaisIdPorNome(nome) {
  if (!nome) return null
  const { rows } = await pool.query(
    'SELECT id FROM paises WHERE nome ILIKE $1 OR sigla_fifa ILIKE $1',
    [nome]
  )
  return rows[0]?.id || null
}

async function buscarGrupoIdPorNome(nome) {
  if (!nome) return null
  const { rows } = await pool.query('SELECT id FROM grupos WHERE nome = $1', [nome])
  return rows[0]?.id || null
}

// ============================================================
// Execução principal
// ============================================================
async function main() {
  try {
    console.log('🚀 Iniciando importação da Copa do Mundo...\n')
    await importarGruposEPaises()
    console.log('')
    await importarJogos()
    console.log('\n🎉 Importação concluída com sucesso!')
    await pool.end()
  } catch (err) {
    console.error('❌ Erro na importação:', err.message)
    await pool.end()
    process.exit(1)
  }
}

main()