/*
 * codonDecorators.ts
 * Copyright (c) Codify Contributors.
 * Licensed under the MIT license.
 *
 * Defines Codon-specific decorators and their semantics.
 */

/**
 * Codon-specific decorator types.
 * These decorators have special meaning in Codon and affect code generation.
 */
export enum CodonDecoratorType {
    // Not a Codon decorator
    None = 'none',

    // @python - The function body contains Python code
    // Used for interoperability with Python
    Python = 'python',

    // @tuple - Makes a class behave like a value-type tuple
    // Class instances are passed by value, not reference
    Tuple = 'tuple',

    // @extend - Extends an existing type with new methods
    // Similar to extension methods in other languages
    Extend = 'extend',

    // @par - Parallelizes a for loop using OpenMP
    // Can have optional parameters like num_threads, schedule
    Par = 'par',

    // @codon.jit - JIT compile a Python function with Codon
    // Used in Codon's Python interop mode
    CodonJit = 'codon.jit',

    // @property - Standard Python property decorator (supported in Codon)
    Property = 'property',

    // @staticmethod - Standard Python staticmethod (supported in Codon)
    StaticMethod = 'staticmethod',

    // @classmethod - Standard Python classmethod (supported in Codon)
    ClassMethod = 'classmethod',

    // @overload - Used for function overloading in Codon
    Overload = 'overload',

    // @llvm - Inline LLVM IR (advanced usage)
    LLVM = 'llvm',

    // @__internal__ - Internal use decorators
    Internal = '__internal__',
}

/**
 * Map of decorator names to their types.
 * Supports both simple names ('python') and qualified names ('codon.jit').
 */
const CODON_DECORATOR_MAP: Map<string, CodonDecoratorType> = new Map([
    ['python', CodonDecoratorType.Python],
    ['tuple', CodonDecoratorType.Tuple],
    ['extend', CodonDecoratorType.Extend],
    ['par', CodonDecoratorType.Par],
    ['codon.jit', CodonDecoratorType.CodonJit],
    ['property', CodonDecoratorType.Property],
    ['staticmethod', CodonDecoratorType.StaticMethod],
    ['classmethod', CodonDecoratorType.ClassMethod],
    ['overload', CodonDecoratorType.Overload],
    ['llvm', CodonDecoratorType.LLVM],
    ['__internal__', CodonDecoratorType.Internal],
]);

/**
 * Decorators that can only be applied to functions.
 */
export const FUNCTION_ONLY_DECORATORS = new Set<CodonDecoratorType>([
    CodonDecoratorType.Python,
    CodonDecoratorType.Par,
    CodonDecoratorType.CodonJit,
    CodonDecoratorType.Property,
    CodonDecoratorType.StaticMethod,
    CodonDecoratorType.ClassMethod,
    CodonDecoratorType.Overload,
    CodonDecoratorType.LLVM,
]);

/**
 * Decorators that can only be applied to classes.
 */
export const CLASS_ONLY_DECORATORS = new Set<CodonDecoratorType>([CodonDecoratorType.Tuple, CodonDecoratorType.Extend]);

/**
 * Decorators that can have arguments.
 */
export const DECORATORS_WITH_ARGS = new Set<CodonDecoratorType>([
    CodonDecoratorType.Par,
    CodonDecoratorType.Extend,
    CodonDecoratorType.CodonJit,
]);

/**
 * Get the Codon decorator type for a given decorator name.
 * @param name The decorator name (e.g., 'python', 'codon.jit', 'par')
 * @returns The CodonDecoratorType, or None if not a Codon decorator
 */
export function getCodonDecoratorType(name: string): CodonDecoratorType {
    return CODON_DECORATOR_MAP.get(name) ?? CodonDecoratorType.None;
}

/**
 * Check if a decorator name is a known Codon decorator.
 */
export function isCodonDecorator(name: string): boolean {
    return CODON_DECORATOR_MAP.has(name);
}

/**
 * Get all known Codon decorator names.
 */
export function getCodonDecoratorNames(): string[] {
    return Array.from(CODON_DECORATOR_MAP.keys());
}

/**
 * Extract the decorator name from a decorator expression.
 * Handles:
 *   - Simple names: @python -> 'python'
 *   - Member access: @codon.jit -> 'codon.jit'
 *   - Calls: @par(num_threads=4) -> 'par'
 *
 * @param exprText The text of the decorator expression
 * @returns The decorator name
 */
export function extractDecoratorName(exprText: string): string {
    // Remove leading @ if present
    let name = exprText.startsWith('@') ? exprText.slice(1) : exprText;

    // Handle calls: @par(...) -> 'par'
    const parenIndex = name.indexOf('(');
    if (parenIndex !== -1) {
        name = name.slice(0, parenIndex);
    }

    return name.trim();
}
