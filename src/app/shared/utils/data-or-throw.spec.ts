import { dataOrThrow } from "./data-or-throw";

describe('dataOrThrow', () => {

    it('should return data', () => {
        const snapshot = {
            exists: () => true,
            data: () => ({})
        };
        expect(dataOrThrow(snapshot)).toBeDefined();
    });

    it('should throw', () => {
        const snapshot = {
            exists: () => false,
            data: () => undefined
        };
        expect(() => dataOrThrow(snapshot)).toThrowError();
    });
});