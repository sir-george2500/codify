/*
 * languageMode.ts
 * Copyright (c) Codify Contributors.
 * Licensed under the MIT license.
 *
 * Since Codify is exclusively for Codon, this file is simplified.
 * All files are treated as Codon source files.
 */

/**
 * Language mode for source files.
 * Codify only supports Codon.
 *
 * Note: Python is included as an alias for backward compatibility during
 * the migration period. It maps to Codon since Codify is Codon-only.
 */
export enum LanguageMode {
    Codon = 'Codon',
    // Python is kept as an alias to Codon for backward compatibility
    // This allows existing code that references LanguageMode.Python to still compile
    Python = 'Codon',
}
