import { map, OperatorFunction } from 'rxjs';


export function throwIfNull<T>(id?: any): OperatorFunction<T, T extends null | undefined ? never : T> {
    const msg = `Not found ${id || ''}`;
    return map(data => {
        if (data === undefined || data === null) {
            throw new Error(msg);
        }
        return data as T extends null | undefined ? never : T;
    });
}
