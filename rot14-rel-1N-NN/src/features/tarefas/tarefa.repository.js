import pool from '../../database/pool.js'

class TarefaRepository {
  async buscarTodos(projetoId = null) {
    let query = `
      SELECT
        t.id,
        t.descricao,
        t.concluido,
        t.criada_em,
        t.projeto_id,
        p.nome AS projeto_nome
      FROM tarefas t
      LEFT JOIN projetos p ON p.id = t.projeto_id
    `
    const params = []

    if (projetoId) {
      query += ' WHERE t.projeto_id = $1'
      params.push(projetoId)
      // Troca para INNER JOIN quando filtramos por um projeto específico,
      // pois tarefas sem projeto não pertencem a esse filtro.
      query = query.replace('LEFT JOIN', 'INNER JOIN')
    }

    query += ' ORDER BY t.id'

    const resultado = await pool.query(query, params)
    return resultado.rows
  }

  async buscarPorId(id) {
    // 1. Consulta a tarefa e o projeto (igual ao que já existia)
    const resultado = await pool.query(
      `
      SELECT
        t.id,
        t.descricao,
        t.concluido,
        t.criada_em,
        t.projeto_id,
        p.nome AS projeto_nome
      FROM tarefas t
      LEFT JOIN projetos p ON p.id = t.projeto_id
      WHERE t.id = $1
      `,
      [id]
    )

    const tarefa = resultado.rows[0] ?? null
    if (!tarefa) return null

    // 2. Busca as tags associadas a essa tarefa
    const tagsResult = await pool.query(
      `
      SELECT tg.id, tg.nome
      FROM tags tg
      INNER JOIN tarefas_tags tt ON tt.tag_id = tg.id
      WHERE tt.tarefa_id = $1
      ORDER BY tg.nome
      `,
      [id]
    )

    // 3. Anexa as tags ao objeto da tarefa
    tarefa.tags = tagsResult.rows   // array de {id, nome}

    return tarefa
  }

  async salvar(tarefa) {
    // Insere a tarefa e retorna os dados básicos
    const insertResult = await pool.query(
      `
      INSERT INTO tarefas (descricao, concluido, projeto_id)
      VALUES ($1, $2, $3)
      RETURNING id, descricao, concluido, criada_em, projeto_id
      `,
      [tarefa.descricao, tarefa.concluido, tarefa.projetoId]
    )

    const novaTarefa = insertResult.rows[0]

    // Busca o nome do projeto para manter a resposta consistente
    const projetoResult = await pool.query(
      'SELECT nome FROM projetos WHERE id = $1',
      [novaTarefa.projeto_id]
    )
    novaTarefa.projeto_nome = projetoResult.rows[0]?.nome ?? null

    return novaTarefa
  }

  async atualizar(id, dadosAtualizados) {
    const tarefaAtual = await this.buscarPorId(id)
    if (!tarefaAtual) return null

    const tarefaFinal = { ...tarefaAtual, ...dadosAtualizados, id: tarefaAtual.id }

    const resultado = await pool.query(
      `
      UPDATE tarefas
      SET descricao = $1,
          concluido = $2
      WHERE id = $3
      RETURNING id, descricao, concluido, criada_em, projeto_id
      `,
      [tarefaFinal.descricao, tarefaFinal.concluido, id]
    )

    const atualizada = resultado.rows[0]
    if (!atualizada) return null

    // Complementa com o nome do projeto
    const projetoResult = await pool.query(
      'SELECT nome FROM projetos WHERE id = $1',
      [atualizada.projeto_id]
    )
    atualizada.projeto_nome = projetoResult.rows[0]?.nome ?? null

    return atualizada
  }

  async remover(id) {
    const resultado = await pool.query(
      'DELETE FROM tarefas WHERE id = $1',
      [id]
    )
    return resultado.rowCount > 0
  }
}

export default TarefaRepository