/*
 * codonDiagnostics.test.ts
 * Copyright (c) Codify Contributors.
 * Licensed under the MIT license.
 *
 * Tests for Codon-specific diagnostic rules.
 */
import * as assert from 'assert';

import { ConfigOptions, DiagnosticRuleSet, getBasicDiagnosticRuleSet } from '../common/configOptions';
import { Uri } from '../common/uri/uri';
import * as TestUtils from './testUtils';

function getCodonConfigOptions(): ConfigOptions {
    const configOptions = new ConfigOptions(Uri.empty());
    // Enable Codon diagnostic rules
    const ruleSet: DiagnosticRuleSet = getBasicDiagnosticRuleSet();
    ruleSet.reportCodonDynamicType = 'error';
    ruleSet.reportCodonInvalidIntWidth = 'error';
    ruleSet.reportCodonFFITypeError = 'error';
    configOptions.diagnosticRuleSet = ruleSet;
    return configOptions;
}

test('codon diagnostic rules exist in config', () => {
    const ruleSet = getBasicDiagnosticRuleSet();
    // Verify Codon rules exist
    assert.ok('reportCodonDynamicType' in ruleSet);
    assert.ok('reportCodonInvalidIntWidth' in ruleSet);
    assert.ok('reportCodonFFITypeError' in ruleSet);
});

test('codon diagnostic rules have correct default values', () => {
    const ruleSet = getBasicDiagnosticRuleSet();
    // In basic mode, dynamic type is warning, others are error
    assert.strictEqual(ruleSet.reportCodonDynamicType, 'warning');
    assert.strictEqual(ruleSet.reportCodonInvalidIntWidth, 'error');
    assert.strictEqual(ruleSet.reportCodonFFITypeError, 'error');
});

test('codon config options can be customized', () => {
    const config = getCodonConfigOptions();
    assert.strictEqual(config.diagnosticRuleSet.reportCodonDynamicType, 'error');
});

test('codon reassignments correctly fail', () => {
    const config = getCodonConfigOptions();
    const analysisResults = TestUtils.typeAnalyzeSampleFiles(['codon_reassign.codon'], config);
    // Even if it fails, our trace statements will be printed via console.error
    console.warn('DIAGNOSTICS EMITTED: ', JSON.stringify(analysisResults[0].errors, null, 2));
    TestUtils.validateResults(analysisResults, 1);
});
