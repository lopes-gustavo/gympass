import moment from 'moment';
import fs from 'fs';
import path from 'path';

export class App {
	public run(): void {
		const kartData = this.getKartDataFromFile();

		const result: KartRunResult = this.createResultFromData(kartData);
		console.table(result.out);

	}

	private getKartDataFromFile(): LapLog[] {
		const file = this.readDataFromFile();
		const lines = this.parseFile(file);

		return lines;
	}

	private readDataFromFile(): string {
		return fs.readFileSync(path.join(path.dirname(__dirname), 'logs', 'log.txt'), 'utf-8');
	}

	private parseFile(file: string): LapLog[] {
		const lines: LapLog[] = file
			.split(/\r?\n/) // Get each line of the file
			.map(line => line.match(new RegExp('[^\\s*]*[^\\s*]', 'g')) as string[]) // Transform each line into an array
			.reduce((acc: LapLog[], line: string[]) => {

				// [ [ '23:54:57.757', '011', '–', 'S.VETTEL', '3', '1:18.097', '35,633' ] ]

				if (!line) {
					return acc;
				}

				const lapLog: LapLog = {
					time: moment.duration(line[0]),
					pilotCode: line[1],
					pilotName: line[3],
					lapNumber: Number(line[4]),
					lapTime: moment.duration(`0:${line[5]}`),
					lapMeanSpeed: Number(line[6].replace(',', '.')),
				};

				return [...acc, lapLog];

			}, [] as LapLog[]); // Transform each array line into an object

		return lines;
	}

	private createResultFromData(kartData: LapLog[]): KartRunResult {
		return new KartRunResult(kartData);
	}
}

class KartRunResult {
	private readonly lastLap = 4;
	public out: KartRunResultLine[] = [];

	constructor(rawData: LapLog[]) {
		this.processData(rawData);
	}

	private processData(data: LapLog[]): void {
		const sortedData = data.sort(((a, b) => a.time.asMilliseconds() - b.time.asMilliseconds())); // Order data by time
		// const winnerIndex = sortedData.findIndex((lap) => lap.lapNumber === this.lastLap); // Get the index of the winner
		const winner = sortedData.find(lap => lap.lapNumber === this.lastLap) as LapLog;

		let rank = 1;
		let lastLap = this.lastLap;
		while (sortedData.length) {
			// Find the index of the best runner given the condition: last lap and smaller time (the array will shrink every time it finds
			// someone)
			const indexOfFirstInData = sortedData.findIndex((lap) => lap.lapNumber === lastLap);

			// If there is no runner in this lap, search on the previous lap
			if (indexOfFirstInData < 0) {
				lastLap--;
				continue;
			}

			// Get the data of the best runner
			const firstInData = sortedData[indexOfFirstInData];

			const posicaoChegada = rank;
			const codigoPiloto = firstInData.pilotCode;
			const nomePiloto = firstInData.pilotName;
			const quantidadeVoltasCompletadas = lastLap;
			const melhorVolta = {tempo: moment.duration(99999999999999), volta: 0};
			const piorVolta = {tempo: moment.duration(0), volta: 0};
			const tempoAposVencedor = firstInData.time.asMilliseconds() - winner.time.asMilliseconds();
			let velocidadeMediaAccumulator = 0;
			const tempoTotalDeProva = sortedData.reduce((acc, line) => {
				if (line.pilotCode !== firstInData.pilotCode) {
					return acc;
				}

				if (line.lapTime < melhorVolta.tempo) {
					melhorVolta.tempo = line.lapTime;
					melhorVolta.volta = line.lapNumber;
				}

				if (line.lapTime > piorVolta.tempo) {
					piorVolta.tempo = line.lapTime;
					piorVolta.volta = line.lapNumber;
				}

				velocidadeMediaAccumulator += line.lapMeanSpeed;

				return line.lapTime.asMilliseconds() + acc;
			}, 0);

			this.out.push({
				posicaoChegada: posicaoChegada,
				codigoPiloto: codigoPiloto,
				nomePiloto: nomePiloto,
				qntdVoltasCompletadas: quantidadeVoltasCompletadas,
				tempoTotalDeProva: moment.utc(moment.duration(tempoTotalDeProva).asMilliseconds()).format('m[m] ss[s] SSS[ms]'),
				melhorVolta: `${melhorVolta.volta} (${moment.utc(moment.duration(melhorVolta.tempo).asMilliseconds()).format('m[m] ss[s] SSS[ms]')})`,
				piorVolta: `${piorVolta.volta} (${moment.utc(moment.duration(piorVolta.tempo).asMilliseconds()).format('m[m] ss[s] SSS[ms]')})`,
				velocidadeMedia: (velocidadeMediaAccumulator / quantidadeVoltasCompletadas).toFixed(3),
				tempoAposVencedor: `+${moment.utc(moment.duration(tempoAposVencedor).asMilliseconds()).format(`s[s] SSS[ms]`)}`,
			});

			// Remove every record of the runner from the sortedData array
			while (true) {
				const index = sortedData.findIndex(lap => lap.pilotCode === firstInData.pilotCode);
				if (index < 0) {
					break;
				}

				sortedData.splice(index, 1);
			}

			rank++;

		}
	}

}

interface KartRunResultLine {
	posicaoChegada: number;
	codigoPiloto: string;
	nomePiloto: string;
	qntdVoltasCompletadas: number;
	tempoTotalDeProva: string;
	melhorVolta: string;
	piorVolta: string;
	velocidadeMedia: string;
	tempoAposVencedor: string;
}

interface LapLog {
	time: moment.Duration;
	pilotCode: string;
	pilotName: string;
	lapNumber: number;
	lapTime: moment.Duration;
	lapMeanSpeed: number;
}
