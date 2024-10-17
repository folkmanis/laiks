import { NpPrice } from './dto/np-price';

export function average(npPrices: NpPrice[]): number {
  if (npPrices.length === 0) {
    return 0;
  }
  const sum = npPrices.reduce((acc, curr) => acc + curr.value, 0);
  return sum / npPrices.length;
}

export function stDev(npPrices: NpPrice[]) {
  if (npPrices.length < 2) {
    return 0;
  }
  const avg = average(npPrices);
  const sum = npPrices.reduce(
    (acc, curr) => acc + Math.pow(curr.value - avg, 2),
    0,
  );
  return Math.sqrt(sum / npPrices.length);
}
