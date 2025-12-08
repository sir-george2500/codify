/*
 * codonLanguageMode.test.ts
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT license.
 *
 * Unit tests for Codon language mode detection.
 */
import * as assert from 'assert';

import { supportedSourceFileExtensions } from '../analyzer/importResolver';
import { LanguageMode, SourceFile } from '../analyzer/sourceFile';
import { combinePaths } from '../common/pathUtils';
import { RealTempFile, createFromRealFileSystem } from '../common/realFileSystem';
import { createServiceProvider } from '../common/serviceProviderExtensions';
import { Uri } from '../common/uri/uri';

test('Codon file extension is supported', () => {
    // Test that .codon is in the list of supported source file extensions
    assert.ok(
        supportedSourceFileExtensions.includes('.codon'),
        'Expected .codon to be in supportedSourceFileExtensions',
    );
});

test('Python file has Python language mode', () => {
    const filePath = combinePaths(process.cwd(), 'test_python.py');
    const tempFile = new RealTempFile();
    const fs = createFromRealFileSystem(tempFile);
    const serviceProvider = createServiceProvider(tempFile, fs);

    const sourceFile = new SourceFile(
        serviceProvider,
        Uri.file(filePath, serviceProvider),
        () => 'test_python',
        false,
        false,
        { isEditMode: false },
    );

    assert.strictEqual(
        sourceFile.getLanguageMode(),
        LanguageMode.Python,
        'Expected Python file to have Python language mode',
    );

    serviceProvider.dispose();
});

test('Codon file has Codon language mode', () => {
    const filePath = combinePaths(process.cwd(), 'test_codon.codon');
    const tempFile = new RealTempFile();
    const fs = createFromRealFileSystem(tempFile);
    const serviceProvider = createServiceProvider(tempFile, fs);

    const sourceFile = new SourceFile(
        serviceProvider,
        Uri.file(filePath, serviceProvider),
        () => 'test_codon',
        false,
        false,
        { isEditMode: false },
    );

    assert.strictEqual(
        sourceFile.getLanguageMode(),
        LanguageMode.Codon,
        'Expected Codon file to have Codon language mode',
    );

    serviceProvider.dispose();
});

test('Stub file (.pyi) has Python language mode', () => {
    const filePath = combinePaths(process.cwd(), 'test_stub.pyi');
    const tempFile = new RealTempFile();
    const fs = createFromRealFileSystem(tempFile);
    const serviceProvider = createServiceProvider(tempFile, fs);

    const sourceFile = new SourceFile(
        serviceProvider,
        Uri.file(filePath, serviceProvider),
        () => 'test_stub',
        false,
        false,
        { isEditMode: false },
    );

    assert.strictEqual(
        sourceFile.getLanguageMode(),
        LanguageMode.Python,
        'Expected stub file to have Python language mode',
    );

    serviceProvider.dispose();
});

test('LanguageMode enum values', () => {
    // Test that the LanguageMode enum has the expected values
    assert.strictEqual(LanguageMode.Python, 'Python');
    assert.strictEqual(LanguageMode.Codon, 'Codon');
});
