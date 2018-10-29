import { Duration } from 'moment';

/**
 * @interface
 * Handle a single line from {@link KartRunDataProcessor}
 */
export interface ResultadoDoPiloto {
	posicaoChegada: number;
	codigoPiloto: string;
	nomePiloto: string;
	qntdVoltasCompletadas: number;
	tempoTotalDeProva: Duration;
	melhorVolta: {volta: number, tempo: Duration};
	piorVolta: {volta: number, tempo: Duration};
	velocidadeMedia: number;
	tempoAposVencedor?: Duration;
}

export type ResultadoDaProva = ResultadoDoPiloto[];
