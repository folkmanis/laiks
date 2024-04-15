import { stDev } from "./st-dev";

describe('stDev', () => {

    it('should be 0 on empty', () => {
        expect(stDev([])).toBe(0);
    });

    it('should be 0 with one value', () => {
        expect(stDev([1])).toBe(0);
    });

    it('should be 0 with identical values', () => {
        expect(stDev([1.1, 1.1, 1.1, 1.1])).toBe(0);
    });

    it('should calculate sample data', () => {
        expect(stDev([1, 1, 2])).toBeCloseTo(0.47140452, 5);
    });

});