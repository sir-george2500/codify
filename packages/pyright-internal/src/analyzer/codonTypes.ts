/*
 * codonTypes.ts
 * Copyright (c) Codify Contributors.
 * Licensed under the MIT license.
 *
 * Defines Codon-specific types and type utilities.
 * Codon has a static type system with fixed-width integers and specific built-in types.
 */

/**
 * Information about a parsed sized integer type.
 */
export interface IntTypeInfo {
    signed: boolean;
    bits: number;
}

/**
 * Codon's built-in type mappings.
 * These are the default types in Codon, which differ from Python:
 * - int is 64-bit signed (not arbitrary precision)
 * - float is 64-bit (same as Python)
 * - cobj is a C pointer type (void*)
 */
export const CodonBuiltinTypes = {
    // Signed integers
    int: 'Int[64]', // Default int is 64-bit signed
    byte: 'Int[8]', // Same as C char, 8-bit signed

    // Unsigned integers
    uint: 'UInt[64]', // 64-bit unsigned

    // Floating point
    float: 'Float[64]', // 64-bit float (same as Python)
    float32: 'Float[32]', // 32-bit float

    // C interop types
    cobj: 'cobj', // C pointer (void*)

    // String types
    str: 'str', // ASCII string (not Unicode like Python)
} as const;

/**
 * Valid bit widths for sized integer types.
 * Codon supports Int[N] and UInt[N] where N is a power of 2 from 8 to 2048,
 * or specific common sizes.
 */
export const VALID_INT_BIT_WIDTHS = new Set<number>([8, 16, 32, 64, 128, 256, 512, 1024, 2048]);

/**
 * Parse a sized integer type string like "Int[64]" or "UInt[8]".
 *
 * @param typeStr The type string to parse
 * @returns IntTypeInfo if valid, undefined otherwise
 *
 * @example
 * parseIntType("Int[64]")  // { signed: true, bits: 64 }
 * parseIntType("UInt[8]")  // { signed: false, bits: 8 }
 * parseIntType("int")      // undefined (use CodonBuiltinTypes for aliases)
 */
export function parseIntType(typeStr: string): IntTypeInfo | undefined {
    // Match Int[N] or UInt[N] pattern
    const match = typeStr.match(/^(U)?Int\[(\d+)\]$/);
    if (!match) {
        return undefined;
    }

    const signed = match[1] !== 'U';
    const bits = parseInt(match[2], 10);

    // Validate bit width
    if (isNaN(bits) || bits < 8 || bits > 2048) {
        return undefined;
    }

    return { signed, bits };
}

/**
 * Check if a type string is a valid Codon sized integer type.
 */
export function isCodonSizedIntType(typeStr: string): boolean {
    return parseIntType(typeStr) !== undefined;
}

/**
 * Parse a sized float type string like "Float[32]" or "Float[64]".
 *
 * @param typeStr The type string to parse
 * @returns The bit width if valid, undefined otherwise
 */
export function parseFloatType(typeStr: string): number | undefined {
    const match = typeStr.match(/^Float\[(\d+)\]$/);
    if (!match) {
        return undefined;
    }

    const bits = parseInt(match[1], 10);

    // Codon supports 32-bit and 64-bit floats
    if (bits !== 32 && bits !== 64) {
        return undefined;
    }

    return bits;
}

/**
 * Check if a type string is a Codon-specific type.
 * This includes sized integers, cobj, and other Codon-specific types.
 */
export function isCodonType(typeStr: string): boolean {
    // Check if it's a sized integer
    if (isCodonSizedIntType(typeStr)) {
        return true;
    }

    // Check if it's a sized float
    if (parseFloatType(typeStr) !== undefined) {
        return true;
    }

    // Check if it's cobj
    if (typeStr === 'cobj') {
        return true;
    }

    return false;
}

/**
 * Get the canonical form of a Codon type.
 * For example, "int" -> "Int[64]", "byte" -> "Int[8]".
 */
export function getCanonicalCodonType(typeStr: string): string {
    const builtin = CodonBuiltinTypes[typeStr as keyof typeof CodonBuiltinTypes];
    return builtin ?? typeStr;
}

/**
 * Check if two Codon types are compatible.
 * This is a basic implementation that checks for exact matches
 * or known type aliases.
 */
export function areCodonTypesCompatible(type1: string, type2: string): boolean {
    const canonical1 = getCanonicalCodonType(type1);
    const canonical2 = getCanonicalCodonType(type2);
    return canonical1 === canonical2;
}
