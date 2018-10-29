import { duration, Duration, utc } from 'moment';

export abstract class MomentFormatter {
	public static format(dur: Duration | number, format: string) {
		return utc(duration(dur).asMilliseconds()).format(format);
	}
}
