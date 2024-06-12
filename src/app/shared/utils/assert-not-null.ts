export function assertNotNull<T>(
  data: T | undefined | null,
  id?: string,
): asserts data is T {
  if (data === undefined || data === null) {
    throw new Error(`Not found ${id || ''}`);
  }
}
