/*
 * codonChecker.ts
 * Copyright (c) Codify Contributors.
 * Licensed under the MIT license.
 *
 * Codon-specific type checking utilities.
 * These functions help validate Codon-specific constructs like:
 * - Sized integer types (Int[N], UInt[N])
 * - FFI type signatures
 * - Static type requirements
 */

import { CodonBuiltinTypes, isCodonSizedIntType } from './codonTypes';

/**
 * Result of validating a Codon type annotation.
 */
export interface CodonTypeValidationResult {
    isValid: boolean;
    errorMessage?: string;
    canonicalType?: string;
}

/**
 * Validate a sized integer type annotation like Int[64] or UInt[8].
 * Returns an error if the bit width is invalid.
 */
export function validateCodonIntType(typeStr: string): CodonTypeValidationResult {
    // First check if it looks like an Int[N] pattern
    const match = typeStr.match(/^(U)?Int\[(\d+)\]$/);
    if (!match) {
        // Not an Int[N] type, might be valid as something else
        return { isValid: true };
    }

    // Parse the bit width
    const bits = parseInt(match[2], 10);
    if (isNaN(bits)) {
        return {
            isValid: false,
            errorMessage: `Invalid bit width in ${typeStr}`,
        };
    }

    // Validate bit width against allowed values
    const validWidths = [8, 16, 32, 64, 128, 256, 512, 1024, 2048];
    if (!validWidths.includes(bits)) {
        return {
            isValid: false,
            errorMessage: `Invalid bit width ${bits} for ${typeStr}. Valid widths are: ${validWidths.join(', ')}`,
        };
    }

    return {
        isValid: true,
        canonicalType: typeStr,
    };
}

/**
 * Validate an FFI type signature for C or Python interop.
 */
export function validateFFITypeSignature(
    argTypes: string[],
    returnType: string | undefined,
): CodonTypeValidationResult {
    // Validate each argument type
    for (const argType of argTypes) {
        if (!isValidFFIType(argType)) {
            return {
                isValid: false,
                errorMessage: `Invalid FFI argument type: ${argType}`,
            };
        }
    }

    // Validate return type if present
    if (returnType && !isValidFFIType(returnType)) {
        return {
            isValid: false,
            errorMessage: `Invalid FFI return type: ${returnType}`,
        };
    }

    return { isValid: true };
}

/**
 * Check if a type is valid for FFI (C interop).
 */
function isValidFFIType(typeStr: string): boolean {
    // cobj is always valid
    if (typeStr === 'cobj') {
        return true;
    }

    // Sized integers are valid
    if (isCodonSizedIntType(typeStr)) {
        return true;
    }

    // Basic types are valid
    const basicTypes = ['int', 'float', 'bool', 'str', 'byte', 'void'];
    if (basicTypes.includes(typeStr)) {
        return true;
    }

    // Float types
    if (typeStr === 'Float[32]' || typeStr === 'Float[64]') {
        return true;
    }

    return false;
}

/**
 * Get the canonical Codon type for a type annotation.
 * This expands aliases like 'int' -> 'Int[64]'.
 */
export function getCanonicalCodonType(typeStr: string): string {
    const builtin = CodonBuiltinTypes[typeStr as keyof typeof CodonBuiltinTypes];
    return builtin ?? typeStr;
}

/**
 * Check if Optional promotion should apply to a parameter.
 * In Codon, a parameter with default None gets promoted to Optional[T].
 */
export function shouldPromoteToOptional(hasDefaultNone: boolean, hasTypeAnnotation: boolean): boolean {
    // If parameter has = None default and a type annotation,
    // Codon automatically promotes the type to Optional[T]
    return hasDefaultNone && hasTypeAnnotation;
}

/**
 * Check if a type annotation represents a dynamic/Any type.
 * Codon requires static types, so this should be flagged.
 */
export function isCodonDynamicType(typeStr: string): boolean {
    const dynamicTypes = ['Any', 'object', 'type'];
    return dynamicTypes.includes(typeStr);
}

/**
 * Validate a generic type parameter syntax.
 * Codon uses `T: type` for generic type parameters.
 */
export function validateGenericTypeParam(paramName: string, constraint: string): boolean {
    // In Codon, the constraint should be 'type' for generic type parameters
    return constraint === 'type';
}
