-- ============================================================================
-- TIPO ENUM (com a nova fase Dezesseis avos)
-- ============================================================================
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fase_jogo') THEN
        CREATE TYPE fase_jogo AS ENUM (
            'Grupos',
            'Dezesseis avos',
            'Oitavas',
            'Quartas',
            'Semifinal',
            'Terceiro Lugar',
            'Final'
        );
    END IF;
END $$;

-- ============================================================================
-- 1. GRUPOS DA COPA
-- ============================================================================
CREATE TABLE IF NOT EXISTS grupos (
    id SERIAL,
    nome VARCHAR(1) NOT NULL,
    CONSTRAINT pk_grupos PRIMARY KEY (id),
    CONSTRAINT uq_grupos_nome UNIQUE (nome)
);

-- ============================================================================
-- 2. PAÍSES
-- ============================================================================
CREATE TABLE IF NOT EXISTS paises (
    id SERIAL,
    nome VARCHAR(100) NOT NULL,
    sigla_fifa VARCHAR(3) NOT NULL,
    bandeira_url TEXT,
    grupo_id INT,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT pk_paises PRIMARY KEY (id),
    CONSTRAINT uq_paises_sigla_fifa UNIQUE (sigla_fifa),
    CONSTRAINT fk_paises_grupo FOREIGN KEY (grupo_id)
        REFERENCES grupos(id) ON DELETE SET NULL
);

-- ============================================================================
-- 3. PERFIS (jogadores do bolão)
-- ============================================================================
CREATE TABLE IF NOT EXISTS perfis (
    id SERIAL,
    nome VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT pk_perfis PRIMARY KEY (id)
);

-- ============================================================================
-- 4. JOGOS E CHAVEAMENTO
-- ============================================================================
CREATE TABLE IF NOT EXISTS jogos (
    id SERIAL,
    numero_jogo INT NOT NULL,
    fase fase_jogo NOT NULL,
    data_hora TIMESTAMPTZ NOT NULL,
    estadio VARCHAR(100),
    encerrado BOOLEAN DEFAULT FALSE,

    pais_casa_id INT,
    pais_fora_id INT,

    origem_casa_jogo_id INT,
    origem_fora_jogo_id INT,

    origem_casa_grupo_id INT,
    origem_casa_grupo_posicao INT,
    origem_fora_grupo_id INT,
    origem_fora_grupo_posicao INT,

    created_at TIMESTAMPTZ DEFAULT now(),

    CONSTRAINT pk_jogos PRIMARY KEY (id),
    CONSTRAINT uq_jogos_numero UNIQUE (numero_jogo),
    CONSTRAINT fk_jogos_casa FOREIGN KEY (pais_casa_id)
        REFERENCES paises(id) ON DELETE RESTRICT,
    CONSTRAINT fk_jogos_fora FOREIGN KEY (pais_fora_id)
        REFERENCES paises(id) ON DELETE RESTRICT,
    CONSTRAINT fk_jogos_origem_casa FOREIGN KEY (origem_casa_jogo_id)
        REFERENCES jogos(id) ON DELETE SET NULL,
    CONSTRAINT fk_jogos_origem_fora FOREIGN KEY (origem_fora_jogo_id)
        REFERENCES jogos(id) ON DELETE SET NULL,
    CONSTRAINT fk_jogos_origem_casa_grupo FOREIGN KEY (origem_casa_grupo_id)
        REFERENCES grupos(id) ON DELETE SET NULL,
    CONSTRAINT fk_jogos_origem_fora_grupo FOREIGN KEY (origem_fora_grupo_id)
        REFERENCES grupos(id) ON DELETE SET NULL,
    CONSTRAINT ck_grupo_posicao_casa CHECK (origem_casa_grupo_posicao IN (1, 2)),
    CONSTRAINT ck_grupo_posicao_fora CHECK (origem_fora_grupo_posicao IN (1, 2))
);

-- ============================================================================
-- 5. RESULTADOS (1:1 com jogos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS resultados (
    id SERIAL,
    jogo_id INT NOT NULL,
    gols_casa INT NOT NULL,
    gols_fora INT NOT NULL,
    vencedor_id INT,
    atualizado_em TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT pk_resultados PRIMARY KEY (id),
    CONSTRAINT uq_resultados_jogo UNIQUE (jogo_id),
    CONSTRAINT fk_resultados_jogo FOREIGN KEY (jogo_id)
        REFERENCES jogos(id) ON DELETE CASCADE,
    CONSTRAINT fk_resultados_vencedor FOREIGN KEY (vencedor_id)
        REFERENCES paises(id) ON DELETE SET NULL
);

-- ============================================================================
-- 6. BOLÕES
-- ============================================================================
CREATE TABLE IF NOT EXISTS boloes (
    id SERIAL,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    criador_perfil_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT pk_boloes PRIMARY KEY (id),
    CONSTRAINT fk_boloes_criador FOREIGN KEY (criador_perfil_id)
        REFERENCES perfis(id) ON DELETE CASCADE
);

-- ============================================================================
-- 7. PARTICIPANTES DO BOLÃO (N:N, com pontuação total)
-- ============================================================================
CREATE TABLE IF NOT EXISTS participantes_bolao (
    perfil_id INT NOT NULL,
    bolao_id INT NOT NULL,
    pontuacao_total INT DEFAULT 0,
    data_entrada TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT pk_participantes_bolao PRIMARY KEY (perfil_id, bolao_id),
    CONSTRAINT fk_participantes_perfil FOREIGN KEY (perfil_id)
        REFERENCES perfis(id) ON DELETE CASCADE,
    CONSTRAINT fk_participantes_bolao FOREIGN KEY (bolao_id)
        REFERENCES boloes(id) ON DELETE CASCADE
);

-- ============================================================================
-- 8. PALPITES (por perfil, dentro de um bolão, para um jogo)
-- ============================================================================
CREATE TABLE IF NOT EXISTS palpites (
    id SERIAL,
    perfil_id INT NOT NULL,
    bolao_id INT NOT NULL,
    jogo_id INT NOT NULL,
    gols_casa INT NOT NULL,
    gols_fora INT NOT NULL,
    pontuacao_obtida INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT pk_palpites PRIMARY KEY (id),
    CONSTRAINT uq_palpites_perfil_bolao_jogo UNIQUE (perfil_id, bolao_id, jogo_id),
    CONSTRAINT fk_palpites_perfil FOREIGN KEY (perfil_id)
        REFERENCES perfis(id) ON DELETE CASCADE,
    CONSTRAINT fk_palpites_bolao FOREIGN KEY (bolao_id)
        REFERENCES boloes(id) ON DELETE CASCADE,
    CONSTRAINT fk_palpites_jogo FOREIGN KEY (jogo_id)
        REFERENCES jogos(id) ON DELETE CASCADE
);

-- ============================================================================
-- ÍNDICES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_jogos_numero_jogo ON jogos(numero_jogo);
CREATE INDEX IF NOT EXISTS idx_jogos_fase ON jogos(fase);
CREATE INDEX IF NOT EXISTS idx_jogos_data_hora ON jogos(data_hora);
CREATE INDEX IF NOT EXISTS idx_palpites_perfil_id ON palpites(perfil_id);
CREATE INDEX IF NOT EXISTS idx_palpites_jogo_id ON palpites(jogo_id);
CREATE INDEX IF NOT EXISTS idx_palpites_bolao_id ON palpites(bolao_id);
CREATE INDEX IF NOT EXISTS idx_participantes_bolao_bolao_id ON participantes_bolao(bolao_id);