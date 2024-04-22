import { map, OperatorFunction } from 'rxjs';


export function throwIfNull<T>(id?: string | number): OperatorFunction<T, T extends null | undefined ? never : T> {
    const msg = `Not found ${id || ''}`.trim();
    return map(data => {
        if (data === undefined || data === null) {
            throw new Error(msg);
        }
        return data as T extends null | undefined ? never : T;
    });
}
