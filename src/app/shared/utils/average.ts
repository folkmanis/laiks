export function average(arr: number[]): number | null {
  if (!arr || arr.length == 0) {
    return null;
  }

  return arr.reduce((acc, curr) => acc + curr, 0) / arr.length;
}
