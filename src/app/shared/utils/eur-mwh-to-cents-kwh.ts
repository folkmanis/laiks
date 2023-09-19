export function eurMwhToCentsKwh<T extends { value: number }>(arr: T[]): T[] {
  return arr.map((obj) => ({ ...obj, value: obj.value / 10 }));
}
