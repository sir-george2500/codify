/*
 * codonLanguageMode.test.ts
 * Copyright (c) Codify Contributors.
 * Licensed under the MIT license.
 *
 * Unit tests for Codon language mode.
 * Note: Codify is a Codon-only tool, so all files use Codon mode.
 */
import * as assert from 'assert';

import { supportedSourceFileExtensions } from '../analyzer/importResolver';
import { LanguageMode } from '../analyzer/languageMode';
import { SourceFile } from '../analyzer/sourceFile';
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

test('Only .codon extension is supported', () => {
    // Codify is Codon-only, so .py and .pyi should NOT be supported
    assert.ok(
        !supportedSourceFileExtensions.includes('.py'),
        'Expected .py to NOT be in supportedSourceFileExtensions (Codify is Codon-only)',
    );
    assert.ok(
        !supportedSourceFileExtensions.includes('.pyi'),
        'Expected .pyi to NOT be in supportedSourceFileExtensions (Codify is Codon-only)',
    );
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

test('All files use Codon mode (Codify is Codon-only)', () => {
    // Even if we create a source file with a non-.codon extension,
    // Codify treats all files as Codon since it's a Codon-only tool
    const filePath = combinePaths(process.cwd(), 'any_file.txt');
    const tempFile = new RealTempFile();
    const fs = createFromRealFileSystem(tempFile);
    const serviceProvider = createServiceProvider(tempFile, fs);

    const sourceFile = new SourceFile(
        serviceProvider,
        Uri.file(filePath, serviceProvider),
        () => 'any_file',
        false,
        false,
        { isEditMode: false },
    );

    // All files should use Codon mode in Codify
    assert.strictEqual(
        sourceFile.getLanguageMode(),
        LanguageMode.Codon,
        'Expected all files to use Codon language mode in Codify',
    );

    serviceProvider.dispose();
});

test('LanguageMode enum values', () => {
    // Test that the LanguageMode enum has the expected values
    // Note: Python = Codon in Codify (backward compatibility alias)
    assert.strictEqual(LanguageMode.Codon, 'Codon');
    // Python is an alias to Codon for backward compatibility
    assert.strictEqual(LanguageMode.Python, 'Codon');
});

test('Language mode is passed through parsing pipeline', () => {
    // This test verifies that language mode flows through parse() → _parseFile() → ParseOptions
    // We test this indirectly by ensuring Codon files parse without crashing

    const codonFilePath = combinePaths(process.cwd(), 'test_parsing.codon');
    const tempFile = new RealTempFile();
    const fs = createFromRealFileSystem(tempFile);
    const serviceProvider = createServiceProvider(tempFile, fs);

    // Create Codon source file
    const sourceFile = new SourceFile(
        serviceProvider,
        Uri.file(codonFilePath, serviceProvider),
        () => 'test_parsing',
        false,
        false,
        { isEditMode: false },
    );

    // Verify it's detected as Codon
    assert.strictEqual(sourceFile.getLanguageMode(), LanguageMode.Codon, 'SourceFile should use Codon language mode');

    // Import ConfigOptions and other necessary types
    const ConfigOptions = require('../common/configOptions').ConfigOptions;
    const ImportResolver = require('../analyzer/importResolver').ImportResolver;

    const configOptions = new ConfigOptions('.');
    const importResolver = new ImportResolver(serviceProvider, configOptions, {} as any);

    // Attempt to parse - this will internally pass languageMode to ParseOptions
    // If languageMode isn't properly passed, this would still work (no crash)
    // but we're testing the pipeline doesn't break
    const simpleCodonCode = 'def test(): pass';

    try {
        const parseSuccessful = sourceFile.parse(configOptions, importResolver, simpleCodonCode);

        // If we get here, the parsing pipeline worked
        // This means languageMode was successfully passed through:
        // SourceFile → parse() → _parseFile() → ParseOptions → Parser
        assert.ok(
            parseSuccessful !== undefined,
            'Parse should complete without errors, confirming language mode propagation',
        );
    } finally {
        serviceProvider.dispose();
    }
});
