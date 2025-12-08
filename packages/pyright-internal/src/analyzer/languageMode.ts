/*
 * languageMode.ts
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT license.
 *
 * Defines the language mode enum for distinguishing between Python and Codon files.
 * Extracted to separate file to avoid circular dependencies between sourceFile and parser.
 */

/**
 * Indicates the language mode for a source file.
 *
 * - Python: Standard Python source files (.py, .pyi)
 * - Codon: Codon source files (.codon)
 */
export enum LanguageMode {
    Python = 'Python',
    Codon = 'Codon',
}
