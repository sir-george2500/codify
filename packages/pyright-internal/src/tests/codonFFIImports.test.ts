/*
 * codonFFIImports.test.ts
 * Copyright (c) Codify Contributors.
 * Licensed under the MIT license.
 *
 * Unit tests for Codon FFI import parsing.
 */
import * as assert from 'assert';

import { DiagnosticSink } from '../common/diagnosticSink';
import { ImportFromNode, ParseNodeType } from '../parser/parseNodes';
import { ParseOptions, Parser } from '../parser/parser';

function parseCode(code: string): ImportFromNode | undefined {
    const parser = new Parser();
    const parseOptions = new ParseOptions();
    const diagSink = new DiagnosticSink();

    const result = parser.parseSourceFile(code, parseOptions, diagSink);

    // Find the first ImportFromNode in the parse tree
    for (const stmt of result.parserOutput.parseTree.d.statements) {
        // Check if it's a StatementList (which is the common case)
        if (stmt.nodeType === ParseNodeType.StatementList) {
            for (const s of stmt.d.statements) {
                if ('nodeType' in s && s.nodeType === ParseNodeType.ImportFrom) {
                    return s as ImportFromNode;
                }
            }
        }
    }
    return undefined;
}

test('Regular from import has no ffiSource', () => {
    const code = 'from math import sqrt';
    const importNode = parseCode(code);

    assert.ok(importNode, 'Should parse import statement');
    assert.strictEqual(importNode.d.ffiSource, undefined, 'Regular import should not have ffiSource');
    assert.strictEqual(importNode.d.imports.length, 1, 'Should have one import');
    assert.strictEqual(importNode.d.imports[0].d.name.d.value, 'sqrt');
});

test('from C import sets ffiSource to C', () => {
    const code = 'from C import malloc';
    const importNode = parseCode(code);

    assert.ok(importNode, 'Should parse import statement');
    assert.strictEqual(importNode.d.ffiSource, 'C', 'ffiSource should be "C"');
    assert.strictEqual(importNode.d.imports.length, 1, 'Should have one import');
    assert.strictEqual(importNode.d.imports[0].d.name.d.value, 'malloc');
});

test('from python import sets ffiSource to python', () => {
    const code = 'from python import os';
    const importNode = parseCode(code);

    assert.ok(importNode, 'Should parse import statement');
    assert.strictEqual(importNode.d.ffiSource, 'python', 'ffiSource should be "python"');
});

test('C FFI import parses type signature', () => {
    const code = 'from C import malloc(int) -> cobj';
    const importNode = parseCode(code);

    assert.ok(importNode, 'Should parse import statement');
    assert.strictEqual(importNode.d.ffiSource, 'C');
    assert.strictEqual(importNode.d.imports.length, 1);

    const ffiImport = importNode.d.imports[0];
    assert.strictEqual(ffiImport.d.name.d.value, 'malloc');

    // Check argument types
    assert.ok(ffiImport.d.ffiArgTypes, 'Should have ffiArgTypes');
    assert.strictEqual(ffiImport.d.ffiArgTypes.length, 1, 'Should have one arg type');

    // Check return type
    assert.ok(ffiImport.d.ffiReturnType, 'Should have ffiReturnType');
});

test('C FFI import with multiple arg types', () => {
    const code = 'from C import printf(cobj, int, float) -> int';
    const importNode = parseCode(code);

    assert.ok(importNode, 'Should parse import statement');
    assert.strictEqual(importNode.d.ffiSource, 'C');

    const ffiImport = importNode.d.imports[0];
    assert.strictEqual(ffiImport.d.name.d.value, 'printf');

    // Check argument types
    assert.ok(ffiImport.d.ffiArgTypes, 'Should have ffiArgTypes');
    assert.strictEqual(ffiImport.d.ffiArgTypes.length, 3, 'Should have three arg types');

    // Check return type
    assert.ok(ffiImport.d.ffiReturnType, 'Should have ffiReturnType');
});

test('C FFI import with no return type', () => {
    const code = 'from C import free(cobj)';
    const importNode = parseCode(code);

    assert.ok(importNode, 'Should parse import statement');
    assert.strictEqual(importNode.d.ffiSource, 'C');

    const ffiImport = importNode.d.imports[0];
    assert.strictEqual(ffiImport.d.name.d.value, 'free');

    // Check argument types
    assert.ok(ffiImport.d.ffiArgTypes, 'Should have ffiArgTypes');
    assert.strictEqual(ffiImport.d.ffiArgTypes.length, 1);

    // No return type
    assert.strictEqual(ffiImport.d.ffiReturnType, undefined, 'Should not have ffiReturnType');
});

test('C FFI import with no args', () => {
    const code = 'from C import getpid() -> int';
    const importNode = parseCode(code);

    assert.ok(importNode, 'Should parse import statement');
    assert.strictEqual(importNode.d.ffiSource, 'C');

    const ffiImport = importNode.d.imports[0];
    assert.strictEqual(ffiImport.d.name.d.value, 'getpid');

    // Empty args
    assert.ok(ffiImport.d.ffiArgTypes, 'Should have ffiArgTypes');
    assert.strictEqual(ffiImport.d.ffiArgTypes.length, 0, 'Should have zero arg types');

    // Has return type
    assert.ok(ffiImport.d.ffiReturnType, 'Should have ffiReturnType');
});

test('Python FFI import with module path', () => {
    const code = 'from python import math.sqrt(float) -> float';
    const importNode = parseCode(code);

    assert.ok(importNode, 'Should parse import statement');
    assert.strictEqual(importNode.d.ffiSource, 'python');

    // The import name should be 'math' (the first part)
    // and it parses "math.sqrt(float)" as an expression
    assert.strictEqual(importNode.d.imports.length, 1);
});

test('FFI import with alias', () => {
    const code = 'from C import malloc(int) -> cobj as c_malloc';
    const importNode = parseCode(code);

    assert.ok(importNode, 'Should parse import statement');
    assert.strictEqual(importNode.d.ffiSource, 'C');

    const ffiImport = importNode.d.imports[0];
    assert.strictEqual(ffiImport.d.name.d.value, 'malloc');
    assert.ok(ffiImport.d.alias, 'Should have alias');
    assert.strictEqual(ffiImport.d.alias.d.value, 'c_malloc');

    // Check FFI signature
    assert.ok(ffiImport.d.ffiArgTypes);
    assert.ok(ffiImport.d.ffiReturnType);
});

test('Regular import has no FFI signature', () => {
    const code = 'from math import sqrt';
    const importNode = parseCode(code);

    assert.ok(importNode, 'Should parse import statement');
    assert.strictEqual(importNode.d.ffiSource, undefined);

    const import1 = importNode.d.imports[0];
    assert.strictEqual(import1.d.ffiArgTypes, undefined, 'Should not have ffiArgTypes');
    assert.strictEqual(import1.d.ffiReturnType, undefined, 'Should not have ffiReturnType');
});
