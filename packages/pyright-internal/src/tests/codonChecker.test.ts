/*
 * codonChecker.test.ts
 * Copyright (c) Codify Contributors.
 * Licensed under the MIT license.
 *
 * Unit tests for Codon type checker utilities.
 */
import * as assert from 'assert';

import {
    getCanonicalCodonType,
    isCodonDynamicType,
    shouldPromoteToOptional,
    validateCodonIntType,
    validateFFITypeSignature,
    validateGenericTypeParam,
} from '../analyzer/codonChecker';

test('validateCodonIntType accepts valid bit widths', () => {
    const validWidths = [8, 16, 32, 64, 128, 256, 512, 1024, 2048];
    for (const bits of validWidths) {
        const result = validateCodonIntType(`Int[${bits}]`);
        assert.ok(result.isValid, `Should accept Int[${bits}]`);

        const unsignedResult = validateCodonIntType(`UInt[${bits}]`);
        assert.ok(unsignedResult.isValid, `Should accept UInt[${bits}]`);
    }
});

test('validateCodonIntType rejects invalid bit widths', () => {
    // Note: parseIntType rejects bits < 8, but accepts any bits >= 8
    // validateCodonIntType additionally checks for valid widths
    const invalidWidths = [7, 15, 100, 3000];
    for (const bits of invalidWidths) {
        const result = validateCodonIntType(`Int[${bits}]`);
        assert.ok(!result.isValid, `Should reject Int[${bits}]`);
        assert.ok(result.errorMessage, 'Should have error message');
    }
});

test('validateCodonIntType passes through non-Int types', () => {
    const result = validateCodonIntType('str');
    assert.ok(result.isValid, 'Non-Int types should pass through');
});

test('validateFFITypeSignature accepts valid types', () => {
    // Basic FFI types
    const result1 = validateFFITypeSignature(['int', 'float'], 'cobj');
    assert.ok(result1.isValid);

    // Sized integers
    const result2 = validateFFITypeSignature(['Int[64]', 'UInt[8]'], 'Int[32]');
    assert.ok(result2.isValid);

    // cobj (void pointer)
    const result3 = validateFFITypeSignature(['cobj'], 'int');
    assert.ok(result3.isValid);

    // No return type
    const result4 = validateFFITypeSignature(['cobj'], undefined);
    assert.ok(result4.isValid);
});

test('validateFFITypeSignature rejects invalid types', () => {
    const result = validateFFITypeSignature(['InvalidType'], 'int');
    assert.ok(!result.isValid);
    assert.ok(result.errorMessage?.includes('InvalidType'));
});

test('getCanonicalCodonType expands aliases', () => {
    assert.strictEqual(getCanonicalCodonType('int'), 'Int[64]');
    assert.strictEqual(getCanonicalCodonType('byte'), 'Int[8]');
    assert.strictEqual(getCanonicalCodonType('cobj'), 'cobj');
});

test('shouldPromoteToOptional returns correct values', () => {
    // Has default None and type annotation -> promote
    assert.ok(shouldPromoteToOptional(true, true));

    // No default None -> don't promote
    assert.ok(!shouldPromoteToOptional(false, true));

    // No type annotation -> don't promote
    assert.ok(!shouldPromoteToOptional(true, false));

    // Neither -> don't promote
    assert.ok(!shouldPromoteToOptional(false, false));
});

test('isCodonDynamicType identifies dynamic types', () => {
    assert.ok(isCodonDynamicType('Any'));
    assert.ok(isCodonDynamicType('object'));

    assert.ok(!isCodonDynamicType('int'));
    assert.ok(!isCodonDynamicType('Int[64]'));
    assert.ok(!isCodonDynamicType('str'));
});

test('validateGenericTypeParam validates type constraint', () => {
    assert.ok(validateGenericTypeParam('T', 'type'));
    assert.ok(!validateGenericTypeParam('T', 'int'));
});
