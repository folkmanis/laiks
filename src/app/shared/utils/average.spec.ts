import { average } from "./average";

describe('average', () => {

    it('should return null on empty', () => {
        expect(average([])).toBeNull();
    });

    it('should calculate natural number value', () => {
        expect(average([1, 1, 1, 1])).toBe(1);
    });

    it('should calculate real number', () => {
        expect(average([1, 3, 7])).toBeCloseTo(3.67, 1);
    });
});