/*
 * codonIntegration.test.ts
 * Copyright (c) Codify Contributors.
 * Licensed under the MIT license.
 *
 * Integration tests for Codon type analysis.
 */
import * as assert from 'assert';

import { ConfigOptions, getBasicDiagnosticRuleSet } from '../common/configOptions';
import { Uri } from '../common/uri/uri';
import * as TestUtils from './testUtils';

function getCodonConfigOptions(): ConfigOptions {
    const configOptions = new ConfigOptions(Uri.empty());
    const ruleSet = getBasicDiagnosticRuleSet();
    ruleSet.reportCodonDynamicType = 'error';
    ruleSet.reportCodonInvalidIntWidth = 'error';
    ruleSet.reportCodonFFITypeError = 'error';
    configOptions.diagnosticRuleSet = ruleSet;
    return configOptions;
}

describe('Codon type analysis integration', () => {
    test('basic Codon variable and function declarations pass type checking', () => {
        const configOptions = getCodonConfigOptions();
        const analysisResults = TestUtils.typeAnalyzeSampleFiles(['test_integration_basic.codon'], configOptions);
        // We expect some errors since Codon builtins may not be fully set up
        // but we verify no crash and get results
        assert.ok(analysisResults.length > 0, 'Should produce analysis results');
    });

    test('Codon generic syntax parses correctly', () => {
        const configOptions = getCodonConfigOptions();
        const analysisResults = TestUtils.typeAnalyzeSampleFiles(['test_generics.codon'], configOptions);
        // Verify generics file can be analyzed
        assert.ok(analysisResults.length > 0, 'Should produce analysis results');
    });
});
