import { assertNotNull } from "./assert-not-null";

describe('assertNotNull', () => {

    it('should throw on null', () => {
        expect(() => assertNotNull(null)).toThrow();
    });

    it('should throw on undefined', () => {
        expect(() => assertNotNull(undefined)).toThrow();
    });

    it('should not throw on object', () => {
        expect(assertNotNull({})).toBeUndefined();
    });
});