import { duration } from 'moment';
import { stub } from 'sinon';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { ConsoleSender } from './consoleSender';

chai.use(sinonChai);

describe('ConsoleSender', () => {
	const consoleStub = stub(console, 'table');

	it('should invoke console.table if "tempoAposVencedor" is undefined with "Não completou a prova"', () => {

		new ConsoleSender().output([{
			codigoPiloto: 'codigoPiloto',
			melhorVolta: {tempo: duration(100), volta: 1},
			nomePiloto: 'nomePiloto',
			piorVolta: {tempo: duration(100), volta: 1},
			posicaoChegada: 0,
			qntdVoltasCompletadas: 0,
			tempoAposVencedor: undefined,
			tempoTotalDeProva: duration(100),
			velocidadeMedia: 0
		}]);

		expect(consoleStub).to.be.calledWith([{
			codigoPiloto: 'codigoPiloto',
			melhorVolta: '1 (0m 00s 100ms)',
			nomePiloto: 'nomePiloto',
			piorVolta: '1 (0m 00s 100ms)',
			posicaoChegada: 0,
			qntdVoltasCompletadas: 0,
			tempoAposVencedor: 'Não completou a prova',
			tempoTotalDeProva: '0m 00s 100ms',
			velocidadeMedia: '0.000'
		}]);

	});

	it('should invoke console.table if "tempoAposVencedor" is not undefined', () => {


		new ConsoleSender().output([{
			codigoPiloto: 'codigoPiloto',
			melhorVolta: {tempo: duration(100), volta: 1},
			nomePiloto: 'nomePiloto',
			piorVolta: {tempo: duration(100), volta: 1},
			posicaoChegada: 0,
			qntdVoltasCompletadas: 0,
			tempoAposVencedor: duration(100),
			tempoTotalDeProva: duration(100),
			velocidadeMedia: 0
		}]);

		expect(consoleStub).to.be.calledWith([{
			codigoPiloto: 'codigoPiloto',
			melhorVolta: '1 (0m 00s 100ms)',
			nomePiloto: 'nomePiloto',
			piorVolta: '1 (0m 00s 100ms)',
			posicaoChegada: 0,
			qntdVoltasCompletadas: 0,
			tempoAposVencedor: '+0s 100ms',
			tempoTotalDeProva: '0m 00s 100ms',
			velocidadeMedia: '0.000'
		}]);

	});

});
