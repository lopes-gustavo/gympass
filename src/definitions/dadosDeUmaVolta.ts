import { Duration } from 'moment';

/**
 * @interface
 * Interface para volta
 */
export interface DadosDeUmaVolta {
	horarioRegistrado: Duration;
	codigoPiloto: string;
	nomePiloto: string;
	numVolta: number;
	tempoVolta: Duration;
	velMediaVolta: number;
}

/**
 * @interface
 * Interface para um array de voltas
 */
export type Voltas = DadosDeUmaVolta[];
