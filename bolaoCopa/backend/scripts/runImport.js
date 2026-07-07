import { importarDadosESPN } from './importarCopa.js'
import pool from '../src/database/pool.js'

async function run() {
  try {
    await importarDadosESPN()
    console.log('Importação concluída.')
    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('Falha na importação:', error)
    await pool.end()
    process.exit(1)
  }
}

run()
