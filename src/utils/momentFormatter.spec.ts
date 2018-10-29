import { expect } from 'chai';
import { duration } from 'moment';
import { MomentFormatter } from './momentFormatter';

describe('MomentFormatter', () => {
	it('should return a "duration" formatted properly', () => {

		const out = MomentFormatter.format(duration(1500), 'ss[s] SSS[ms]');
		expect(out).to.be.eq('01s 500ms');

	});
});
