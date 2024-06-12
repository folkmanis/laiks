import { colorDensity } from './color-density';

describe('colorDensity', () => {
  it('should black be 0', () => {
    expect(colorDensity('#000000')).toBe(0);
  });

  it('should white be 1', () => {
    expect(colorDensity('#FFFFFF')).toBe(1);
  });

  it('should calculate simple value', () => {
    expect(colorDensity('#323232')).toBeCloseTo(50 / 255, 5); // 0x32 = 50
  });

  it('should calculate exact value', () => {
    expect(colorDensity('#11A353')).toBeCloseTo(0.43225882, 5); // 17,163,83  0.299 * r + 0.587 * g + 0.114 * b
  });
});
