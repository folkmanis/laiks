import { MinutesToHoursPipe } from './minutes-to-hours.pipe';

describe('MinutesToHoursPipe', () => {
  let pipe: MinutesToHoursPipe;

  beforeEach(() => {
    pipe = new MinutesToHoursPipe();
  });

  it('should not change non-string values', () => {
    expect(pipe.transform(undefined)).withContext('undefined').toBeUndefined();
    expect(pipe.transform(null)).withContext('null').toBeNull();
    const obj = {};
    expect(pipe.transform(obj)).withContext('object').toBe(obj);
    expect(pipe.transform('0')).withContext('number').toBe('0');
  });

  it('should format exact hours', () => {
    expect(pipe.transform(60 * 2)).toBe('2 h, 0 min');
  });

  it('should format hours with minutes', () => {
    expect(pipe.transform(60 * 2 + 25.8)).toBe('2 h, 26 min');
  });
});
