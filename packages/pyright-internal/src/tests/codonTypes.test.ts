/*
 * codonTypes.test.ts
 * Copyright (c) Codify Contributors.
 * Licensed under the MIT license.
 *
 * Unit tests for Codon type utilities.
 */
import * as assert from 'assert';

import {
    areCodonTypesCompatible,
    CodonBuiltinTypes,
    getCanonicalCodonType,
    isCodonSizedIntType,
    isCodonType,
    parseFloatType,
    parseIntType,
} from '../analyzer/codonTypes';

test('parseIntType parses signed integers', () => {
    const result = parseIntType('Int[64]');
    assert.ok(result);
    assert.strictEqual(result.signed, true);
    assert.strictEqual(result.bits, 64);
});

test('parseIntType parses unsigned integers', () => {
    const result = parseIntType('UInt[8]');
    assert.ok(result);
    assert.strictEqual(result.signed, false);
    assert.strictEqual(result.bits, 8);
});

test('parseIntType handles various bit widths', () => {
    const widths = [8, 16, 32, 64, 128, 256];
    for (const bits of widths) {
        const signed = parseIntType(`Int[${bits}]`);
        assert.ok(signed, `Should parse Int[${bits}]`);
        assert.strictEqual(signed.bits, bits);

        const unsigned = parseIntType(`UInt[${bits}]`);
        assert.ok(unsigned, `Should parse UInt[${bits}]`);
        assert.strictEqual(unsigned.bits, bits);
    }
});

test('parseIntType returns undefined for invalid types', () => {
    assert.strictEqual(parseIntType('int'), undefined);
    assert.strictEqual(parseIntType('Int'), undefined);
    assert.strictEqual(parseIntType('Int[]'), undefined);
    assert.strictEqual(parseIntType('Int[abc]'), undefined);
    assert.strictEqual(parseIntType('Int[-1]'), undefined);
    assert.strictEqual(parseIntType('UInt[0]'), undefined);
});

test('isCodonSizedIntType identifies valid sized integers', () => {
    assert.ok(isCodonSizedIntType('Int[64]'));
    assert.ok(isCodonSizedIntType('UInt[32]'));
    assert.ok(!isCodonSizedIntType('int'));
    assert.ok(!isCodonSizedIntType('cobj'));
});

test('parseFloatType parses valid float types', () => {
    assert.strictEqual(parseFloatType('Float[32]'), 32);
    assert.strictEqual(parseFloatType('Float[64]'), 64);
});

test('parseFloatType returns undefined for invalid floats', () => {
    assert.strictEqual(parseFloatType('float'), undefined);
    assert.strictEqual(parseFloatType('Float[16]'), undefined);
    assert.strictEqual(parseFloatType('Float[128]'), undefined);
});

test('isCodonType identifies Codon-specific types', () => {
    // Sized integers
    assert.ok(isCodonType('Int[64]'));
    assert.ok(isCodonType('UInt[8]'));

    // Floats
    assert.ok(isCodonType('Float[32]'));
    assert.ok(isCodonType('Float[64]'));

    // C object
    assert.ok(isCodonType('cobj'));

    // Not Codon-specific
    assert.ok(!isCodonType('str'));
    assert.ok(!isCodonType('list'));
    assert.ok(!isCodonType('int'));
});

test('CodonBuiltinTypes has correct mappings', () => {
    assert.strictEqual(CodonBuiltinTypes.int, 'Int[64]');
    assert.strictEqual(CodonBuiltinTypes.byte, 'Int[8]');
    assert.strictEqual(CodonBuiltinTypes.uint, 'UInt[64]');
    assert.strictEqual(CodonBuiltinTypes.float, 'Float[64]');
    assert.strictEqual(CodonBuiltinTypes.cobj, 'cobj');
});

test('getCanonicalCodonType expands type aliases', () => {
    assert.strictEqual(getCanonicalCodonType('int'), 'Int[64]');
    assert.strictEqual(getCanonicalCodonType('byte'), 'Int[8]');
    assert.strictEqual(getCanonicalCodonType('uint'), 'UInt[64]');
    assert.strictEqual(getCanonicalCodonType('cobj'), 'cobj');
    // Unknown types pass through unchanged
    assert.strictEqual(getCanonicalCodonType('List[int]'), 'List[int]');
});

test('areCodonTypesCompatible checks type compatibility', () => {
    // Same types
    assert.ok(areCodonTypesCompatible('Int[64]', 'Int[64]'));
    assert.ok(areCodonTypesCompatible('cobj', 'cobj'));

    // Alias expansion
    assert.ok(areCodonTypesCompatible('int', 'Int[64]'));
    assert.ok(areCodonTypesCompatible('byte', 'Int[8]'));

    // Incompatible types
    assert.ok(!areCodonTypesCompatible('Int[32]', 'Int[64]'));
    assert.ok(!areCodonTypesCompatible('Int[64]', 'UInt[64]'));
});
