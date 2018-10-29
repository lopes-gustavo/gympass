import fs from 'fs';
import { duration } from 'moment';

import { DadosDeUmaVolta, Voltas } from '../definitions/dadosDeUmaVolta';

/**
 * @class
 *
 * Parse a file into {@link DadosDeUmaVolta} structure
 */
export class FileParser {

	public parse(fileName: string, encoding: string): Voltas {
		const file = this.readDataFromFile(fileName, encoding);
		const lines = this.parseFile(file);

		return lines;
	}

	private readDataFromFile(fileName: string, encoding: string): string {
		return fs.readFileSync(fileName, encoding);
	}

	private parseFile(file: string): Voltas {
		const lines: Voltas = file
			.split(/\r?\n/) // Get each line of the file
			.map(line => line.match(new RegExp('[^\\s*]*[^\\s*]', 'g')) as string[]) // Transform each line into an array
			.reduce((acc: Voltas, line: string[]) => {

				if (!line) { return acc; }

				const lapLog: DadosDeUmaVolta = {
					horarioRegistrado: duration(line[0]),
					codigoPiloto: line[1],
					nomePiloto: line[3],
					numVolta: Number(line[4]),
					tempoVolta: duration(`0:${line[5]}`),
					velMediaVolta: Number(line[6].replace(',', '.')),
				};

				return [...acc, lapLog];

			}, [] as Voltas); // Transform each array line into an object

		return lines;
	}

}
