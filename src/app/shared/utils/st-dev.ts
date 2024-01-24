import { average } from './average';

export function stDev(arr: number[]): number {
  const avg = average(arr);
  if (!arr || arr.length < 2 || avg == null) {
    return 0;
  }

  const sum = arr.reduce((acc, curr) => acc + Math.pow(curr - avg, 2), 0);

  return Math.sqrt(sum / arr.length);
}
