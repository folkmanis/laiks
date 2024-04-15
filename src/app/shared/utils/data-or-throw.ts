
export interface Snapshot<T> {
    exists(): boolean;
    data(): T | undefined;
}

export function dataOrThrow<D extends Record<string, any>>(snapshot: Snapshot<D>, id?: string): D {
    if (snapshot.exists() === false) {
        throw new Error(`Not found ${id || ''}`);
    }
    return snapshot.data()!;
}