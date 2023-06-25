import {describe, test, expect, it} from '@jest/globals';
import {
    validateBirthDate,
    validateEmail,
    validateGoalTitle,
    validateGoalDescription,
    validateGoalObjective,
    validateHeight,
    validateHeightCentimeters,
    validateHeightMeters,
    validateLocation,
    validateName,
    validateNameLength,
    validatePassword,
    validateUsername,
    validateUsernameLength,
    validateWeight
} from "../../src/utils/validations";

describe('validateName', () => {
    test('should return true when name length is between 2 and 40', () => {
        expect(validateNameLength('John Doe')).toBe(true);
        expect(validateNameLength('A')).toBe(false);
        expect(validateNameLength('This is a long name that exceeds 40 characters')).toBe(false);
    });

    test('should return false when name is an empty string', () => {
        expect(validateNameLength('')).toBe(false);
    });

    it('returns true when name is empty', () => {
        const name = '';
        const result = validateName(name);
        expect(result).toBe(true);
    });

    it('returns true when name only contains letters', () => {
        const name = 'John';
        const result = validateName(name);
        expect(result).toBe(true);
    });

    it('returns true when name contains accented letters', () => {
        const name = 'María';
        const result = validateName(name);
        expect(result).toBe(true);
    });

    it('returns false when name contains special characters', () => {
        const name = 'John123';
        const result = validateName(name);
        expect(result).toBe(false);
    });

    it('returns true when name contains spaces', () => {
        const name = 'John Smith';
        const result = validateName(name);
        expect(result).toBe(true);
    });

    it('returns false when name contains non-letter characters', () => {
        const name = 'John$';
        const result = validateName(name);
        expect(result).toBe(false);
    });
});

describe('validateEmail', () => {
    test('valid email returns true', () => {
        const validEmail = 'test@example.com';
        const isValid = validateEmail(validEmail);
        expect(isValid).toBe(true);
    });

    test('invalid email returns false', () => {
        const invalidEmail = 'testexample.com';
        const isValid = validateEmail(invalidEmail);
        expect(isValid).toBe(false);
    });

    test('email with leading/trailing whitespace returns false', () => {
        const whitespaceEmail = '  test@example.com  ';
        const isValid = validateEmail(whitespaceEmail);
        expect(isValid).toBe(false);
    });

    test('empty string returns false', () => {
        const emptyEmail = '';
        const isValid = validateEmail(emptyEmail);
        expect(isValid).toBe(false);
    });
});

describe("validatePassword", () => {
    test("returns true when the password has 6 or more characters", () => {
        expect(validatePassword("123456")).toBe(true);
        expect(validatePassword("abcdef")).toBe(true);
        expect(validatePassword("a1b2c3")).toBe(true);
        expect(validatePassword("1234567")).toBe(true);
        expect(validatePassword("abcdefg")).toBe(true);
        expect(validatePassword("a1b2c3d")).toBe(true);
    });

    test("returns false when the password has less than 6 characters", () => {
        expect(validatePassword("12345")).toBe(false);
        expect(validatePassword("abcde")).toBe(false);
        expect(validatePassword("a1b2c")).toBe(false);
        expect(validatePassword("")).toBe(false);
        expect(validatePassword("a")).toBe(false);
        expect(validatePassword("1")).toBe(false);
    });
});

describe('validate username', () => {
    it('should return true if the username length is between 4 and 20', () => {
        expect(validateUsernameLength('abcd')).toBe(true);
        expect(validateUsernameLength('abcdefg')).toBe(true);
        expect(validateUsernameLength('abcdefghijklmnopqrst')).toBe(true);
    });

    it('should return false if the username length is less than 4', () => {
        expect(validateUsernameLength('abc')).toBe(false);
        expect(validateUsernameLength('a')).toBe(false);
        expect(validateUsernameLength('')).toBe(false);
    });

    it('should return false if the username length is greater than 20', () => {
        expect(validateUsernameLength('abcdefghijklmnopqrstu')).toBe(false);
        expect(validateUsernameLength('abcdefghijklmnopqrstuvwxyz')).toBe(false);
        expect(validateUsernameLength('123456789012345678901')).toBe(false);
    });

    describe('validateUsername', () => {
        test('should return true for valid usernames', () => {
            expect(validateUsername('user1234')).toBe(true);
            expect(validateUsername('User_12')).toBe(true);
            expect(validateUsername('user-name')).toBe(true);
        });

        test('should return false for invalid usernames', () => {
            expect(validateUsername('us')).toBe(false);
            expect(validateUsername('user name')).toBe(false);
            expect(validateUsername('user@name')).toBe(false);
            expect(validateUsername('user/name')).toBe(false);
            expect(validateUsername('user?name')).toBe(false);
            expect(validateUsername('user&name')).toBe(false);
            expect(validateUsername('user*name')).toBe(false);
            expect(validateUsername('user!name')).toBe(false);
            expect(validateUsername('user#name')).toBe(false);
            expect(validateUsername('user%name')).toBe(false);
            expect(validateUsername('user+name')).toBe(false);
            expect(validateUsername('user=name')).toBe(false);
            expect(validateUsername('user|name')).toBe(false);
            expect(validateUsername('user~name')).toBe(false);
            expect(validateUsername('user`name')).toBe(false);
            expect(validateUsername('user^name')).toBe(false);
            expect(validateUsername('user{name')).toBe(false);
            expect(validateUsername('user}name')).toBe(false);
            expect(validateUsername('user[name')).toBe(false);
            expect(validateUsername('user]name')).toBe(false);
            expect(validateUsername('user/name')).toBe(false);
            expect(validateUsername('user\\name')).toBe(false);
        });
    });
});

describe('validate height', () => {
    test('should return true for valid height (0)', () => {
        expect(validateHeightMeters('0')).toBe(true);
    });

    test('should return true for valid height (1)', () => {
        expect(validateHeightMeters('1')).toBe(true);
    });

    test('should return true for valid height (2)', () => {
        expect(validateHeightMeters('2')).toBe(true);
    });

    test('should return false for invalid height (-1)', () => {
        expect(validateHeightMeters('-1')).toBe(false);
    });

    test('should return false for invalid height (3)', () => {
        expect(validateHeightMeters('3')).toBe(false);
    });

    test('should return false for invalid height (empty string)', () => {
        expect(validateHeightMeters('')).toBe(false);
    });

    test('should return false for invalid height (null)', () => {
        expect(validateHeightMeters(null)).toBe(false);
    });

    test("valid centimeters should return true", () => {
        expect(validateHeightCentimeters("0")).toBe(true);
        expect(validateHeightCentimeters("1")).toBe(true);
        expect(validateHeightCentimeters("10")).toBe(true);
        expect(validateHeightCentimeters("99")).toBe(true);
    });

    test("invalid centimeters should return false", () => {
        expect(validateHeightCentimeters("")).toBe(false);
        expect(validateHeightCentimeters("00")).toBe(false);
        expect(validateHeightCentimeters("100")).toBe(false);
        expect(validateHeightCentimeters("abc")).toBe(false);
    });

    it("returns true for valid height between 0.5 and 2.5 meters", () => {
        expect(validateHeight("1.75")).toBe(true);
    });

    it("returns false for height less than 0.5 meters", () => {
        expect(validateHeight("0.4")).toBe(false);
    });

    it("returns false for height greater than 2.5 meters", () => {
        expect(validateHeight("3")).toBe(false);
    });

    it("returns false for negative height", () => {
        expect(validateHeight("-1")).toBe(false);
    });

    it("returns false for non-numeric input", () => {
        expect(validateHeight("abc")).toBe(false);
    });
});

describe('validateWeight', () => {
    it('should return true for valid weight', () => {
        expect(validateWeight('50')).toBe(true);
        expect(validateWeight('100')).toBe(true);
        expect(validateWeight('200')).toBe(true);
        expect(validateWeight('400')).toBe(true);
    });

    it('should return false for invalid weight', () => {
        expect(validateWeight('0')).toBe(false);
        expect(validateWeight('1')).toBe(false);
        expect(validateWeight('10')).toBe(false);
        expect(validateWeight('500')).toBe(false);
        expect(validateWeight('1000')).toBe(false);
        expect(validateWeight('abc')).toBe(false);
        expect(validateWeight('1a2b3c')).toBe(false);
    });
});

describe('validateBirthDate', () => {
    test('should return false for empty string', () => {
        expect(validateBirthDate('')).toBe(false);
    });

    test('should return false for future date', () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);

        expect(validateBirthDate(futureDate.toISOString())).toBe(false);
    });

    test('should return false for birth date earlier than 1940', () => {
        const minBirthDate = new Date(1940, 0, 1);

        expect(validateBirthDate(minBirthDate.toISOString())).toBe(true);
        expect(validateBirthDate(new Date(1939, 11, 31).toISOString())).toBe(false);
    });

    test('should return true for birth date between 1940 and today', () => {
        const birthDate = new Date(1980, 5, 15);

        expect(validateBirthDate(birthDate.toISOString())).toBe(true);
    });
});

describe("validateLocation", () => {
    test("should return true for valid location with only letters and special characters", () => {
        expect(validateLocation("San José, Costa Rica")).toBe(true);
    });

    test("should return true for valid location with only letters, digits and spaces", () => {
        expect(validateLocation("123 Main St, Apt 4B")).toBe(true);
    });

    test("should return false for location with only numbers and spaces", () => {
        expect(validateLocation("12345")).toBe(false);
    });

    test("should return false for location with invalid characters", () => {
        expect(validateLocation("San José, Costa Rica!")).toBe(false);
    });

    test("should return true for empty string", () => {
        expect(validateLocation("")).toBe(true);
    });
});

describe("validateNewGoalTitle", () => {
    test("returns true when title is between 1 and 15 characters", () => {
        const result = validateGoalTitle("Learn React");
        expect(result).toBe(true);
    });

    test("returns true when title is 1 character long", () => {
        const result = validateGoalTitle("a");
        expect(result).toBe(true);
    });

    test("returns true when title is 15 characters long", () => {
        const result = validateGoalTitle("Learn HTML/CSS");
        expect(result).toBe(true);
    });

    test("returns false when title is shorter than 1 character", () => {
        const result = validateGoalTitle("");
        expect(result).toBe(false);
    });

    test("returns false when title is longer than 15 characters", () => {
        const result = validateGoalTitle("Learn React and Redux");
        expect(result).toBe(false);
    });
});

describe("validateNewGoalDescription", () => {
    test("returns true when description is between 1 and 30 characters", () => {
        const result = validateGoalDescription("Learn JavaScript");
        expect(result).toBe(true);
    });

    test("returns true when description is 1 character long", () => {
        const result = validateGoalDescription("a");
        expect(result).toBe(true);
    });

    test("returns true when description is 30 characters long", () => {
        const result = validateGoalDescription("Learn HTML/CSS/JavaScript");
        expect(result).toBe(true);
    });

    test("returns false when description is shorter than 1 character", () => {
        const result = validateGoalDescription("");
        expect(result).toBe(false);
    });

    test("returns false when description is longer than 30 characters", () => {
        const result = validateGoalDescription("Learn React, Redux, and Node.js");
        expect(result).toBe(false);
    });
});

describe("validateNewGoalObjective", () => {
    test("returns true when objective is a positive integer", () => {
        const result = validateGoalObjective("10");
        expect(result).toBe(true);
    });

    test("returns true when objective is zero", () => {
        const result = validateGoalObjective("0");
        expect(result).toBe(true);
    });

    test("returns false when objective is a negative integer", () => {
        const result = validateGoalObjective("-5");
        expect(result).toBe(false);
    });

    test("returns false when objective is a non-integer string", () => {
        const result = validateGoalObjective("1.5");
        expect(result).toBe(false);
    });

    test("returns false when objective is an empty string", () => {
        const result = validateGoalObjective("");
        expect(result).toBe(false);
    });
});
