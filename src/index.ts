import path from 'path';

import { KartRunDataProcessor } from './services/kartRunDataProcessor';
import { ConsoleSender } from './view/consoleSender';
import { FileParser } from './fileParser';

if (!process.version.includes('v11')) {
	console.error('\x1b[31m');
	console.error('ERROR');
	console.error('#########################################################');
	console.error('# Esse script necessita do NodeJS v11.0.0 para executar #');
	console.error('#########################################################');
	console.error('\x1b[0m');
	process.exit(0);
}

const nomeDoArquivo = path.join(path.dirname(__dirname), 'logs', 'log.txt');
const numeroTotalDeVoltas = 4;

// Transforma o arquivo texto em objeto reconhecível pelo Typescript
const dadosDaCorrida = new FileParser().parse(nomeDoArquivo, 'utf-8');

// Processa os dados de entrada
const resultadoDaCorrida = new KartRunDataProcessor(numeroTotalDeVoltas).processaDados(dadosDaCorrida);

// Printa o resultado no console
new ConsoleSender().output(resultadoDaCorrida);
