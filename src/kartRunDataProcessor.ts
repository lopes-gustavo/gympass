import { Duration, duration } from 'moment';

import { DadosDeUmaVolta, Voltas } from './definitions/dadosDeUmaVolta';
import { ResultadoDaProva } from './definitions/resultadoDaProva';

export class KartRunDataProcessor {

	constructor(private readonly numeroTotalDeVoltas: number) {
	}

	/**
	 * Processa os dados da corrida
	 * @param voltas
	 */
	public processaDados(voltas: Voltas) {
		const {voltasOrdenadasPeloHorario, voltaDoVencedor, horarioDeInicioDaCorrida} = this.buscaDadosDaCorrida(voltas);

		const resultadoDaCorrida: ResultadoDaProva = [];
		let posicao = 1;
		let contadorDeVoltas = this.numeroTotalDeVoltas;

		/**
		 * O algoritmo a seguir é dado da seguinte forma:
		 * Percorre o array, já ordenado pela horário da volta, e:
		 * 1. Busca o melhor piloto (maior quantidade de voltas e menor tempo) no array.
		 * 2. Preenche os dados desse piloto, como "melhor tempo", "pior tempo", etc
		 * 3. Remove todos os dados desse piloto do array
		 * 4. Reinicia o processo até que não tenha nenhum dado a mais no array
		 */
		while (voltasOrdenadasPeloHorario.length) {

			// Busca o index do melhor piloto dada as condições de maior quantidade de voltas completadas e menor tempo
			// Como o array já está ordenado por tempo, pega o primeiro que está na volta em questão
			const melhorPilotoNaVolta = voltasOrdenadasPeloHorario.find(volta => volta.numVolta === contadorDeVoltas);

			// Se não encontrou nenhum piloto nessa volta, tenta na volta anterior
			if (!melhorPilotoNaVolta) {
				contadorDeVoltas--;
				continue;
			}

			// Preenche os dados desse piloto
			const posicaoChegada = posicao;
			const codigoPiloto = melhorPilotoNaVolta.codigoPiloto;
			const nomePiloto = melhorPilotoNaVolta.nomePiloto;
			const quantidadeVoltasCompletadas = this.buscaQuantidadeVoltasCompletadas(voltasOrdenadasPeloHorario, melhorPilotoNaVolta, voltaDoVencedor);
			const dadosDoPiloto = this.processaTemposDoPiloto(voltasOrdenadasPeloHorario, melhorPilotoNaVolta, voltaDoVencedor, horarioDeInicioDaCorrida);

			// Adiciona dados do piloto no array de resultados
			resultadoDaCorrida.push({
				posicaoChegada: posicaoChegada,
				codigoPiloto: codigoPiloto,
				nomePiloto: nomePiloto,
				qntdVoltasCompletadas: quantidadeVoltasCompletadas,
				tempoTotalDeProva: dadosDoPiloto.tempoTotalDeProva,
				melhorVolta: dadosDoPiloto.melhorVolta,
				piorVolta: dadosDoPiloto.piorVolta,
				velocidadeMedia: dadosDoPiloto.velocidadeMedia,
				tempoAposVencedor: dadosDoPiloto.tempoAposVencedor,
			});

			// Remove todos os registros desse piloto no array de voltas
			while (true) {
				const index = voltasOrdenadasPeloHorario.findIndex(volta => volta.codigoPiloto === melhorPilotoNaVolta.codigoPiloto);
				if (index < 0) { break; }

				voltasOrdenadasPeloHorario.splice(index, 1);
			}

			// Posição já preenchida, adiciona 1 no contador
			posicao++;

		}

		return resultadoDaCorrida;
	}

	/**
	 * Prepara e retorna algumas informações sobre a corrida
	 * @param voltas
	 */
	private buscaDadosDaCorrida(voltas: Voltas) {
		const voltasOrdenadasPeloHorario = this.ordenaVoltasPeloHorario(voltas);
		const voltaDoVencedor = this.buscaVoltaDoVencedor(voltasOrdenadasPeloHorario);
		const horarioDeInicioDaCorrida = this.buscaHorarioDeInicioDaCorrida(voltasOrdenadasPeloHorario);

		return {voltasOrdenadasPeloHorario, voltaDoVencedor, horarioDeInicioDaCorrida};
	}

	/**
	 * Ordena as voltas pelo horário registrado
	 * @param voltas
	 */
	private ordenaVoltasPeloHorario(voltas: Voltas) {
		return voltas.sort(((a, b) => a.horarioRegistrado.asMilliseconds() - b.horarioRegistrado.asMilliseconds()));
	}

	/**
	 * Retorna o registro da volta que originou o vencedor da corrida
	 * @param voltasOrdenadasPeloHorario
	 */
	private buscaVoltaDoVencedor(voltasOrdenadasPeloHorario: Voltas) {
		return voltasOrdenadasPeloHorario.find(volta => volta.numVolta === this.numeroTotalDeVoltas) as DadosDeUmaVolta;
	}

	/**
	 * Retorna o horário de início da corrida
	 * Parte da premissa que o piloto na pole position não gasta tempo para cruzar a linha de início
	 * @param voltasOrdenadasPeloHorario
	 */
	private buscaHorarioDeInicioDaCorrida(voltasOrdenadasPeloHorario: Voltas) {

		const momentos = voltasOrdenadasPeloHorario
			.filter(volta => volta.numVolta === 1) // Filtra todos os registros de primeira volta
			.map(volta => volta.horarioRegistrado.clone().subtract(volta.tempoVolta)) // Subtrai o tempo da primeira volta do horário
																					  // registrado
			// dessa volta (pega quando cruzou a linha de início da
			// corrida)
			.sort((a, b) => a.asMilliseconds() - b.asMilliseconds()); // Ordena pelo horários registrados de cruzamento da linha de início

		// Retorna o menor horário (significa que foi o horário de início da corrida, já que o piloto na pole position não gasta tempo para
		// cruzar a linha de início
		return momentos[0];

	}

	/**
	 * Busca a última volta completada antes do vencedor cruzar a linha de chegada
	 *
	 * @param voltasOrdenadasPeloHorario
	 * @param melhorCorredor
	 * @param voltaDoVencedor
	 */
	private buscaQuantidadeVoltasCompletadas(voltasOrdenadasPeloHorario: Voltas, melhorCorredor: DadosDeUmaVolta, voltaDoVencedor: DadosDeUmaVolta) {
		const voltaCompletaAntesDoTerminoDaProva = voltasOrdenadasPeloHorario
			.filter(volta => volta.codigoPiloto === melhorCorredor.codigoPiloto) // Filtra todas as voltas do piloto
			.reverse() // Inverte a ordem do array (última volta completada está no início do array agora)
			.find(volta => volta.horarioRegistrado <= voltaDoVencedor.horarioRegistrado) as DadosDeUmaVolta; // Busca a primeira
		// volta completada antes do término da corrida

		if (!voltaCompletaAntesDoTerminoDaProva) { return 0; } else { return voltaCompletaAntesDoTerminoDaProva.numVolta; }
	}

	/**
	 * Retorna os tempos do piloto, como melhor/pior volta, velocidade média, tempo de chegada após vencedor e tempo total de prova
	 *
	 * @param voltasOrdenadasPeloHorario
	 * @param piloto
	 * @param voltaDoVencedor
	 * @param horarioDeInicioDaCorrida
	 */
	private processaTemposDoPiloto(voltasOrdenadasPeloHorario: Voltas, piloto: DadosDeUmaVolta, voltaDoVencedor: DadosDeUmaVolta, horarioDeInicioDaCorrida: Duration) {

		const melhorVolta = {tempo: duration(99999999999999), volta: 0};
		const piorVolta = {tempo: duration(0), volta: 0};
		let tempoAposVencedor: Duration | undefined = piloto.horarioRegistrado.clone().subtract(voltaDoVencedor.horarioRegistrado);
		let velocidadeMediaAccumulator = 0;
		let ultimaVolta = 1;

		// Inicia o tempo total da prova com o tempo gasto para cruzar a linha de início
		const tempoTotalDeProva = this.buscaTempoParaCruzarALinhaDeInicio(voltasOrdenadasPeloHorario, piloto.codigoPiloto, horarioDeInicioDaCorrida);

		voltasOrdenadasPeloHorario.forEach(volta => {
			// Ignora dados que não são referente ao piloto
			if (volta.codigoPiloto !== piloto.codigoPiloto) { return; }

			// Atualiza a melhor volta caso a volta analisada tenha um tempo menor que a atual
			if (volta.tempoVolta < melhorVolta.tempo) {
				melhorVolta.tempo = volta.tempoVolta;
				melhorVolta.volta = volta.numVolta;
			}

			// Atualiza a pior volta caso a volta analisada tenha um tempo maior que a atual
			if (volta.tempoVolta > piorVolta.tempo) {
				piorVolta.tempo = volta.tempoVolta;
				piorVolta.volta = volta.numVolta;
			}

			// Adiciona o tempo da volta ao tempo total da prova
			tempoTotalDeProva.add(volta.tempoVolta);

			// Adiciona a velocidade média da volta no acumulador para computar a velocidade média final
			velocidadeMediaAccumulator += volta.velMediaVolta;

			// Salva o número da última volta completada para computar a velocidade média final
			ultimaVolta = volta.numVolta;
		});

		const velocidadeMedia = velocidadeMediaAccumulator / ultimaVolta;

		// Se o piloto não completou a prova, ele não tem tempo após o vencedor, já que este só é computado quando o piloto completa todas
		// as voltas
		if (ultimaVolta !== this.numeroTotalDeVoltas) { tempoAposVencedor = undefined; }

		return {melhorVolta, piorVolta, tempoAposVencedor, velocidadeMedia, tempoTotalDeProva};
	}

	/**
	 * Retorna o tempo que o piloto levou para cruzar a linha de chegada e, consequentemente, o tempo até começar a contar a primeira volta
	 *
	 * @param voltasOrdenadasPeloHorario
	 * @param codigoDoPiloto
	 * @param horarioDeInicioDaCorrida
	 */
	private buscaTempoParaCruzarALinhaDeInicio(voltasOrdenadasPeloHorario: Voltas, codigoDoPiloto: string, horarioDeInicioDaCorrida: Duration) {

		const primeiraVoltaDoPiloto = voltasOrdenadasPeloHorario.find(volta => volta.codigoPiloto === codigoDoPiloto) as DadosDeUmaVolta;
		return primeiraVoltaDoPiloto.horarioRegistrado.clone().subtract(primeiraVoltaDoPiloto.tempoVolta).subtract(horarioDeInicioDaCorrida);

	}

}
