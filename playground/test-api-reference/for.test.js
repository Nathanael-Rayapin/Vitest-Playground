import { describe, test, expect } from 'vitest';

function isAdult(user) {
    return user.age >= 18;
}

function canAccessAdmin(user) {
    return user.role === 'admin' && user.active === true;
}

function getDiscountRate(user) {
    if (!user.active) return 0;

    if (user.role === 'vip') return 0.2;
    if (user.age >= 60) return 0.15;
    if (user.age < 18) return 0.1;

    return 0.05;
}

function formatFullName([firstName, lastName]) {
    return `${firstName} ${lastName}`.trim();
}

describe('isAdult', () => {
    test.for([
        { age: 17, expected: false },
        { age: 18, expected: true },
        { age: 30, expected: true },
    ])('should return $expected for age $age', (user) => {
        expect(isAdult(user)).toBe(user.expected);
    });
});

describe('canAccessAdmin', () => {
    test.for([
        { role: 'admin', active: true, expected: true },
        { role: 'admin', active: false, expected: false },
        { role: 'user', active: true, expected: false },
    ])('access check for role=$role active=$active', (user) => {
        expect(canAccessAdmin(user)).toBe(user.expected);
    });
});

describe('getDiscountRate', () => {
    test.for([
        { role: 'vip', age: 25, active: true, expected: 0.2 },
        { role: 'user', age: 65, active: true, expected: 0.15 },
        { role: 'user', age: 16, active: true, expected: 0.1 },
        { role: 'user', age: 30, active: true, expected: 0.05 },
        { role: 'vip', age: 40, active: false, expected: 0 },
    ])('discount for $role (age=$age, active=$active)', (user) => {
        expect(getDiscountRate(user)).toBe(user.expected);
    });
});

describe('formatFullName (array usage without spreading)', () => {
    test.for([
        [['John', 'Doe'], 'John Doe'],
        [['Jane', ''], 'Jane'],
        [['', 'Smith'], 'Smith'],
    ])('should format name correctly', ([input, expected]) => {
        expect(formatFullName(input)).toBe(expected);
    });
});