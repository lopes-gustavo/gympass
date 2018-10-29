import { MomentFormatter } from './utils/momentFormatter';
import { ResultadoDaProva } from './definitions/resultadoDaProva';

/**
 * @class
 *
 * Display data into console
 */
export class ConsoleSender {
	output(resultado: ResultadoDaProva): void {

		const resultadoFormatado = resultado.map(volta => {

			const tempoAposVencedor = volta.tempoAposVencedor ? `+${MomentFormatter.format(volta.tempoAposVencedor, `s[s] SSS[ms]`)}` : 'Não completou a prova';
			const tempoTotalDeProva = MomentFormatter.format(volta.tempoTotalDeProva, 'm[m] ss[s] SSS[ms]');
			const melhorVolta = `${volta.melhorVolta.volta} (${MomentFormatter.format(volta.melhorVolta.tempo, 'm[m] ss[s] SSS[ms]')})`;
			const piorVolta = `${volta.piorVolta.volta} (${MomentFormatter.format(volta.piorVolta.tempo, 'm[m] ss[s] SSS[ms]')})`;
			const velocidadeMedia = (volta.velocidadeMedia).toFixed(3);

			return {
				posicaoChegada: volta.posicaoChegada,
				codigoPiloto: volta.codigoPiloto,
				nomePiloto: volta.nomePiloto,
				qntdVoltasCompletadas: volta.qntdVoltasCompletadas,
				tempoTotalDeProva: tempoTotalDeProva,
				melhorVolta: melhorVolta,
				piorVolta: piorVolta,
				velocidadeMedia: velocidadeMedia,
				tempoAposVencedor: tempoAposVencedor,
			};
		});

		console.table(resultadoFormatado);
	}
}
