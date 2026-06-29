import { importarDadosESPN } from './importarCopa.js';

async function run() {
  try {
    await importarDadosESPN();
    console.log('Importação concluída.');
    process.exit(0);
  } catch (error) {
    console.error('Falha na importação:', error);
    process.exit(1);
  }
}

run();
