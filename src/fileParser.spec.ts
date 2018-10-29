import path from 'path';
import { expect } from 'chai';

import { FileParser } from './fileParser';

describe('FileParser', () => {
	it('should parse a file', () => {
		const nomeDoArquivo = path.join(path.dirname(__dirname), 'logs', 'log.txt');

		const parser = new FileParser();
		const result = parser.parse(nomeDoArquivo, 'utf-8');

		expect(result).to.be.an('array');
		expect(result[0]).to.have.property('horarioRegistrado');
		expect(result[0]).to.have.property('codigoPiloto');
		expect(result[0]).to.have.property('nomePiloto');
		expect(result[0]).to.have.property('numVolta');
		expect(result[0]).to.have.property('tempoVolta');
		expect(result[0]).to.have.property('velMediaVolta');
	});
});
