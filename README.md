# Codify (Codon Language Server)

<p align="center">
  <img src="packages/vscode-pyright/images/codon.svg" width="100" alt="Codon Logo">
</p>

Codify is a full-featured, standards-based static type checker and Language Server Protocol (LSP) for **Codon**, a high-performance, strictly typed Python compiler. Built as a fork of Microsoft's Pyright, Codify is heavily modified to enforce Codon's zero-overhead static typing regime, C-FFI layers, and parallel loop architectures.

## Core Features

- **Strict Type Mutation Enforcement**: Unlike standard Python, Codon variables cannot change their type once initialized. Codify enforces this by injecting a global, unsuppressible compilation error into the analyzer whenever a user attempts to reassign a variable's type (e.g., `i = 3` followed by `i = "5.7"`).
- **Predictable Multithreading Restrictions**: Codify actively rejects implicit mutations of global, outer-scope data structures and strictly forbids the `global` keyword. This guarantees safety during implicit concurrent execution passes, such as Codon's `@par` multithreading loops.
- **Native Codon Diagnostics**: Emits tailored, educational compiler warnings specific to Codon's syntax and built-ins.
- **Experimental Native LSP (`lsp/`)**: Exploring the future of the language server, we've initialized a natively implemented, strictly-typed LSP architecture built from the ground up natively in Codon. This experimental core enforces immutability and precise error tracking using a strict `Result[T, E]` pattern for total type safety.

## Using Codify

This repository provides the modified VS Code extension (`vscode-pyright`) tuned for `.codon` file integration.

1. Navigate to the extension package: `cd packages/vscode-pyright`
2. Build the extension bundle: `npx webpack --mode development`
3. Install the resulting VSIX or launch it securely via the VS Code Extension Development Host.

## Documentation Reference

- For information about the Codon language compiler, see the [Codon Documentation](https://docs.exaloop.io/codon/).
- For legacy Pyright settings (which Codify inherits), see the [Original Docs](docs/README.md).
