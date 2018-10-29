import { Duration, duration } from 'moment';
import { expect } from 'chai';
import { KartRunDataProcessor } from './kartRunDataProcessor';
import { Voltas } from '../definitions/dadosDeUmaVolta';

describe('KartRunDataProcessor', () => {
	it('should process run data with only 1 runner and 1 lap', () => {
		const dataProcessor = new KartRunDataProcessor(1);
		const result = dataProcessor.processaDados([{
			velMediaVolta: 15.5,
			numVolta: 1,
			tempoVolta: duration(1500),
			codigoPiloto: 'codigoPiloto1',
			nomePiloto: 'nomePiloto1',
			horarioRegistrado: duration(1500),
		}]);

		expect(result).to.be.an('array');
		expect(result).to.have.property('length', 1);
		expect(result[0]).to.have.property('posicaoChegada', 1);
		expect(result[0]).to.have.property('codigoPiloto', 'codigoPiloto1');
		expect(result[0]).to.have.property('nomePiloto', 'nomePiloto1');
		expect(result[0]).to.have.property('qntdVoltasCompletadas', 1);
		expect(result[0]).to.have.property('tempoTotalDeProva');
		expect(result[0].tempoTotalDeProva.asMilliseconds()).to.be.eq(1500);
		expect(result[0]).to.have.property('melhorVolta');
		expect(result[0].melhorVolta).to.have.property('volta', 1);
		expect(result[0].melhorVolta.tempo.asMilliseconds()).to.be.eq(1500);
		expect(result[0]).to.have.property('piorVolta');
		expect(result[0].piorVolta).to.have.property('volta', 1);
		expect(result[0].piorVolta.tempo.asMilliseconds()).to.be.eq(1500);
		expect(result[0]).to.have.property('velocidadeMedia', 15.5);
		expect(result[0]).to.have.property('tempoAposVencedor');
		expect((result[0].tempoAposVencedor as Duration).asMilliseconds()).to.be.eq(0);

	});

	it('should process run data with 2 runners and 1 lap, both finishing the run', () => {
		// Corrida de 1 volta

		const dataProcessor = new KartRunDataProcessor(1);
		const data: Voltas = [
			{
				velMediaVolta: 15.5,
				numVolta: 1,
				tempoVolta: duration(1500),
				codigoPiloto: 'codigoPiloto1',
				nomePiloto: 'nomePiloto1',
				horarioRegistrado: duration(1500),
			},
			{
				velMediaVolta: 15.4,
				numVolta: 1,
				tempoVolta: duration(1550),
				codigoPiloto: 'codigoPiloto2',
				nomePiloto: 'nomePiloto2',
				horarioRegistrado: duration(1600),
			}
		];
		const result = dataProcessor.processaDados(data);

		expect(result).to.be.an('array');
		expect(result).to.have.property('length', 2);
		expect(result[0]).to.have.property('posicaoChegada', 1);
		expect(result[0]).to.have.property('codigoPiloto', 'codigoPiloto1');
		expect(result[0]).to.have.property('nomePiloto', 'nomePiloto1');
		expect(result[0]).to.have.property('qntdVoltasCompletadas', 1);
		expect(result[0]).to.have.property('tempoTotalDeProva');
		expect(result[0].tempoTotalDeProva.asMilliseconds()).to.be.eq(1500);
		expect(result[0]).to.have.property('melhorVolta');
		expect(result[0].melhorVolta).to.have.property('volta', 1);
		expect(result[0].melhorVolta.tempo.asMilliseconds()).to.be.eq(1500);
		expect(result[0]).to.have.property('piorVolta');
		expect(result[0].piorVolta).to.have.property('volta', 1);
		expect(result[0].piorVolta.tempo.asMilliseconds()).to.be.eq(1500);
		expect(result[0]).to.have.property('velocidadeMedia', 15.5);
		expect(result[0]).to.have.property('tempoAposVencedor');
		expect((result[0].tempoAposVencedor as Duration).asMilliseconds()).to.be.eq(0);

		expect(result[1]).to.have.property('posicaoChegada', 2);
		expect(result[1]).to.have.property('codigoPiloto', 'codigoPiloto2');
		expect(result[1]).to.have.property('nomePiloto', 'nomePiloto2');
		expect(result[1]).to.have.property('qntdVoltasCompletadas', 0);
		expect(result[1]).to.have.property('tempoTotalDeProva');
		expect(result[1].tempoTotalDeProva.asMilliseconds()).to.be.eq(1600);
		expect(result[1]).to.have.property('melhorVolta');
		expect(result[1].melhorVolta).to.have.property('volta', 1);
		expect(result[1].melhorVolta.tempo.asMilliseconds()).to.be.eq(1550);
		expect(result[1]).to.have.property('piorVolta');
		expect(result[1].piorVolta).to.have.property('volta', 1);
		expect(result[1].piorVolta.tempo.asMilliseconds()).to.be.eq(1550);
		expect(result[1]).to.have.property('velocidadeMedia', 15.4);
		expect(result[1]).to.have.property('tempoAposVencedor');
		expect((result[1].tempoAposVencedor as Duration).asMilliseconds()).to.be.eq(100);

	});

	it('should process run data with 2 runners and 2 laps, both finishing the run', () => {
		const dataProcessor = new KartRunDataProcessor(2);
		const data: Voltas = [
			{
				numVolta: 1,
				velMediaVolta: 15.5,
				tempoVolta: duration(1500),
				codigoPiloto: 'codigoPiloto1',
				nomePiloto: 'nomePiloto1',
				horarioRegistrado: duration(1500),
			},
			{
				velMediaVolta: 15.4,
				numVolta: 1,
				tempoVolta: duration(1600),
				codigoPiloto: 'codigoPiloto2',
				nomePiloto: 'nomePiloto2',
				horarioRegistrado: duration(1600),
			},
			{
				velMediaVolta: 15.6,
				numVolta: 2,
				tempoVolta: duration(1400),
				codigoPiloto: 'codigoPiloto2',
				nomePiloto: 'nomePiloto2',
				horarioRegistrado: duration(1600).add(1400),
			},
			{
				velMediaVolta: 15.4,
				numVolta: 2,
				tempoVolta: duration(1600),
				codigoPiloto: 'codigoPiloto1',
				nomePiloto: 'nomePiloto1',
				horarioRegistrado: duration(1500).add(1600),
			}
		];
		const result = dataProcessor.processaDados(data);

		expect(result).to.be.an('array');
		expect(result).to.have.property('length', 2);
		expect(result[0]).to.have.property('posicaoChegada', 1);
		expect(result[0]).to.have.property('codigoPiloto', 'codigoPiloto2');
		expect(result[0]).to.have.property('nomePiloto', 'nomePiloto2');
		expect(result[0]).to.have.property('qntdVoltasCompletadas', 2);
		expect(result[0]).to.have.property('tempoTotalDeProva');
		expect(result[0].tempoTotalDeProva.asMilliseconds()).to.be.eq(3000);
		expect(result[0]).to.have.property('melhorVolta');
		expect(result[0].melhorVolta).to.have.property('volta', 2);
		expect(result[0].melhorVolta.tempo.asMilliseconds()).to.be.eq(1400);
		expect(result[0]).to.have.property('piorVolta');
		expect(result[0].piorVolta).to.have.property('volta', 1);
		expect(result[0].piorVolta.tempo.asMilliseconds()).to.be.eq(1600);
		expect(result[0]).to.have.property('velocidadeMedia', 15.5);
		expect(result[0]).to.have.property('tempoAposVencedor');
		expect((result[0].tempoAposVencedor as Duration).asMilliseconds()).to.be.eq(0);

		expect(result[1]).to.have.property('posicaoChegada', 2);
		expect(result[1]).to.have.property('codigoPiloto', 'codigoPiloto1');
		expect(result[1]).to.have.property('nomePiloto', 'nomePiloto1');
		expect(result[1]).to.have.property('qntdVoltasCompletadas', 1);
		expect(result[1]).to.have.property('tempoTotalDeProva');
		expect(result[1].tempoTotalDeProva.asMilliseconds()).to.be.eq(3100);
		expect(result[1]).to.have.property('melhorVolta');
		expect(result[1].melhorVolta).to.have.property('volta', 1);
		expect(result[1].melhorVolta.tempo.asMilliseconds()).to.be.eq(1500);
		expect(result[1]).to.have.property('piorVolta');
		expect(result[1].piorVolta).to.have.property('volta', 2);
		expect(result[1].piorVolta.tempo.asMilliseconds()).to.be.eq(1600);
		expect(result[1]).to.have.property('velocidadeMedia', 15.45);
		expect(result[1]).to.have.property('tempoAposVencedor');
		expect((result[1].tempoAposVencedor as Duration).asMilliseconds()).to.be.eq(100);

	});

	it('should process run data with 3 runners and 2 laps, but only 2 finishing the run', () => {
		const dataProcessor = new KartRunDataProcessor(2);
		const data = [
			{
				numVolta: 1,
				codigoPiloto: 'codigoPiloto1',
				nomePiloto: 'nomePiloto1',
				velMediaVolta: 15.5,
				tempoVolta: duration(1500),
				horarioRegistrado: duration(23, 'h').add(1500),
			},
			{
				numVolta: 1,
				codigoPiloto: 'codigoPiloto2',
				nomePiloto: 'nomePiloto2',
				velMediaVolta: 15.4,
				tempoVolta: duration(1600),
				horarioRegistrado: duration(23, 'h').add(1600),
			},
			{
				numVolta: 1,
				codigoPiloto: 'codigoPiloto3',
				nomePiloto: 'nomePiloto3',
				velMediaVolta: 16.0,
				tempoVolta: duration(1300),
				horarioRegistrado: duration(23, 'h').add(1300),
			},
			{
				numVolta: 2,
				codigoPiloto: 'codigoPiloto2',
				nomePiloto: 'nomePiloto2',
				velMediaVolta: 15.6,
				horarioRegistrado: duration(23, 'h').add(1600).add(1400),
				tempoVolta: duration(1400),
			},
			{
				numVolta: 2,
				codigoPiloto: 'codigoPiloto1',
				nomePiloto: 'nomePiloto1',
				velMediaVolta: 15.4,
				tempoVolta: duration(1600),
				horarioRegistrado: duration(23, 'h').add(1500).add(1600),
			}
		];
		const result = dataProcessor.processaDados(data);

		expect(result).to.be.an('array');
		expect(result).to.have.property('length', 3);
		expect(result[0]).to.have.property('posicaoChegada', 1);
		expect(result[0]).to.have.property('codigoPiloto', 'codigoPiloto2');
		expect(result[0]).to.have.property('nomePiloto', 'nomePiloto2');
		expect(result[0]).to.have.property('qntdVoltasCompletadas', 2);
		expect(result[0]).to.have.property('tempoTotalDeProva');
		expect(result[0].tempoTotalDeProva.asMilliseconds()).to.be.eq(3000);
		expect(result[0]).to.have.property('melhorVolta');
		expect(result[0].melhorVolta).to.have.property('volta', 2);
		expect(result[0].melhorVolta.tempo.asMilliseconds()).to.be.eq(1400);
		expect(result[0]).to.have.property('piorVolta');
		expect(result[0].piorVolta).to.have.property('volta', 1);
		expect(result[0].piorVolta.tempo.asMilliseconds()).to.be.eq(1600);
		expect(result[0]).to.have.property('velocidadeMedia', 15.5);
		expect(result[0]).to.have.property('tempoAposVencedor');
		expect((result[0].tempoAposVencedor as Duration).asMilliseconds()).to.be.eq(0);

		expect(result[1]).to.have.property('posicaoChegada', 2);
		expect(result[1]).to.have.property('codigoPiloto', 'codigoPiloto1');
		expect(result[1]).to.have.property('nomePiloto', 'nomePiloto1');
		expect(result[1]).to.have.property('qntdVoltasCompletadas', 1);
		expect(result[1]).to.have.property('tempoTotalDeProva');
		expect(result[1].tempoTotalDeProva.asMilliseconds()).to.be.eq(3100);
		expect(result[1]).to.have.property('melhorVolta');
		expect(result[1].melhorVolta).to.have.property('volta', 1);
		expect(result[1].melhorVolta.tempo.asMilliseconds()).to.be.eq(1500);
		expect(result[1]).to.have.property('piorVolta');
		expect(result[1].piorVolta).to.have.property('volta', 2);
		expect(result[1].piorVolta.tempo.asMilliseconds()).to.be.eq(1600);
		expect(result[1]).to.have.property('velocidadeMedia', 15.45);
		expect(result[1]).to.have.property('tempoAposVencedor');
		expect((result[1].tempoAposVencedor as Duration).asMilliseconds()).to.be.eq(100);

		expect(result[2]).to.have.property('posicaoChegada', 3);
		expect(result[2]).to.have.property('codigoPiloto', 'codigoPiloto3');
		expect(result[2]).to.have.property('nomePiloto', 'nomePiloto3');
		expect(result[2]).to.have.property('qntdVoltasCompletadas', 1);
		expect(result[2]).to.have.property('tempoTotalDeProva');
		expect(result[2].tempoTotalDeProva.asMilliseconds()).to.be.eq(1300);
		expect(result[2]).to.have.property('melhorVolta');
		expect(result[2].melhorVolta).to.have.property('volta', 1);
		expect(result[2].melhorVolta.tempo.asMilliseconds()).to.be.eq(1300);
		expect(result[2]).to.have.property('piorVolta');
		expect(result[2].piorVolta).to.have.property('volta', 1);
		expect(result[2].piorVolta.tempo.asMilliseconds()).to.be.eq(1300);
		expect(result[2]).to.have.property('velocidadeMedia', 16);
		expect(result[2]).to.have.property('tempoAposVencedor');
		expect(result[2].tempoAposVencedor).to.be.eq(undefined);

	});

});
