import pool from '../../database/pool.js'

class TarefaRepository {
  async buscarTodos() {
    const resultado = await pool.query(`
      SELECT id, descricao, concluido, criada_em
      FROM tarefas
      ORDER BY id
    `)
    return resultado.rows
  }

  async buscarPorId(id) {
    const resultado = await pool.query(
      `
      SELECT id, descricao, concluido, criada_em
      FROM tarefas
      WHERE id = $1
      `,
      [id]
    )
    return resultado.rows[0] ?? null
  }

  async salvar(tarefa) {
    const resultado = await pool.query(
      `
      INSERT INTO tarefas (descricao, concluido)
      VALUES ($1, $2)
      RETURNING id, descricao, concluido, criada_em
      `,
      [tarefa.descricao, tarefa.concluido]
    )
    return resultado.rows[0]
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
      RETURNING id, descricao, concluido, criada_em
      `,
      [tarefaFinal.descricao, tarefaFinal.concluido, id]
    )
    return resultado.rows[0] ?? null
  }

  async remover(id) {
    const resultado = await pool.query(
      `
      DELETE FROM tarefas
      WHERE id = $1
      `,
      [id]
    )
    return resultado.rowCount > 0
  }
}

export default TarefaRepository