import {parseWeight} from "../../src/utils/utils";

describe('parseWeight', () => {
    test('should return empty string when input is empty', () => {
        expect(parseWeight('')).toBe('');
    });

    test('should return same value when input only contains digits', () => {
        expect(parseWeight('123')).toBe('123');
    });

    test('should remove non-digit characters at the end of the string', () => {
        expect(parseWeight('123k')).toBe('123');
        expect(parseWeight('12')).toBe('12');
        expect(parseWeight('12/')).toBe('12');
        expect(parseWeight('.')).toBe('');
        expect(parseWeight(',')).toBe('');
    });
});
