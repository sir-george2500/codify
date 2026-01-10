/*
 * codonDecorators.test.ts
 * Copyright (c) Codify Contributors.
 * Licensed under the MIT license.
 *
 * Unit tests for Codon decorator recognition.
 */
import * as assert from 'assert';

import {
    CLASS_ONLY_DECORATORS,
    CodonDecoratorType,
    FUNCTION_ONLY_DECORATORS,
    getCodonDecoratorNames,
    getCodonDecoratorType,
    isCodonDecorator,
} from '../analyzer/codonDecorators';

test('getCodonDecoratorType returns correct types', () => {
    assert.strictEqual(getCodonDecoratorType('python'), CodonDecoratorType.Python);
    assert.strictEqual(getCodonDecoratorType('tuple'), CodonDecoratorType.Tuple);
    assert.strictEqual(getCodonDecoratorType('extend'), CodonDecoratorType.Extend);
    assert.strictEqual(getCodonDecoratorType('par'), CodonDecoratorType.Par);
    assert.strictEqual(getCodonDecoratorType('codon.jit'), CodonDecoratorType.CodonJit);
    assert.strictEqual(getCodonDecoratorType('property'), CodonDecoratorType.Property);
    assert.strictEqual(getCodonDecoratorType('staticmethod'), CodonDecoratorType.StaticMethod);
    assert.strictEqual(getCodonDecoratorType('classmethod'), CodonDecoratorType.ClassMethod);
    assert.strictEqual(getCodonDecoratorType('overload'), CodonDecoratorType.Overload);
    assert.strictEqual(getCodonDecoratorType('llvm'), CodonDecoratorType.LLVM);
});

test('getCodonDecoratorType returns None for unknown decorators', () => {
    assert.strictEqual(getCodonDecoratorType('unknown'), CodonDecoratorType.None);
    assert.strictEqual(getCodonDecoratorType('dataclass'), CodonDecoratorType.None);
    assert.strictEqual(getCodonDecoratorType('abc.abstractmethod'), CodonDecoratorType.None);
});

test('isCodonDecorator correctly identifies Codon decorators', () => {
    assert.ok(isCodonDecorator('python'));
    assert.ok(isCodonDecorator('tuple'));
    assert.ok(isCodonDecorator('extend'));
    assert.ok(isCodonDecorator('par'));
    assert.ok(isCodonDecorator('codon.jit'));

    assert.ok(!isCodonDecorator('unknown'));
    assert.ok(!isCodonDecorator('dataclass'));
});

test('getCodonDecoratorNames returns all known decorators', () => {
    const names = getCodonDecoratorNames();

    assert.ok(names.includes('python'));
    assert.ok(names.includes('tuple'));
    assert.ok(names.includes('extend'));
    assert.ok(names.includes('par'));
    assert.ok(names.includes('codon.jit'));
    assert.ok(names.includes('property'));
    assert.ok(names.includes('staticmethod'));
    assert.ok(names.includes('classmethod'));
});

test('FUNCTION_ONLY_DECORATORS contains correct decorators', () => {
    assert.ok(FUNCTION_ONLY_DECORATORS.has(CodonDecoratorType.Python));
    assert.ok(FUNCTION_ONLY_DECORATORS.has(CodonDecoratorType.Par));
    assert.ok(FUNCTION_ONLY_DECORATORS.has(CodonDecoratorType.CodonJit));
    assert.ok(FUNCTION_ONLY_DECORATORS.has(CodonDecoratorType.Property));
    assert.ok(FUNCTION_ONLY_DECORATORS.has(CodonDecoratorType.StaticMethod));
    assert.ok(FUNCTION_ONLY_DECORATORS.has(CodonDecoratorType.ClassMethod));

    assert.ok(!FUNCTION_ONLY_DECORATORS.has(CodonDecoratorType.Tuple));
    assert.ok(!FUNCTION_ONLY_DECORATORS.has(CodonDecoratorType.Extend));
});

test('CLASS_ONLY_DECORATORS contains correct decorators', () => {
    assert.ok(CLASS_ONLY_DECORATORS.has(CodonDecoratorType.Tuple));
    assert.ok(CLASS_ONLY_DECORATORS.has(CodonDecoratorType.Extend));

    assert.ok(!CLASS_ONLY_DECORATORS.has(CodonDecoratorType.Python));
    assert.ok(!CLASS_ONLY_DECORATORS.has(CodonDecoratorType.Par));
});

test('CodonDecoratorType enum values are correct strings', () => {
    assert.strictEqual(CodonDecoratorType.None, 'none');
    assert.strictEqual(CodonDecoratorType.Python, 'python');
    assert.strictEqual(CodonDecoratorType.Tuple, 'tuple');
    assert.strictEqual(CodonDecoratorType.Extend, 'extend');
    assert.strictEqual(CodonDecoratorType.Par, 'par');
    assert.strictEqual(CodonDecoratorType.CodonJit, 'codon.jit');
});
