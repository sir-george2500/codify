# Codon Language Server

<p align="center">
  <img src="https://raw.githubusercontent.com/sir-george2500/codify/main/packages/vscode-pyright/images/codonimagelogo.png" width="128" alt="Codon Logo">
</p>

## Overview

**Codon Language Server (CLS)** is the official Visual Studio Code extension for the **Codon** programming language. Codon is a high-performance Python compiler that generates native machine code without any runtime overhead, often matching or exceeding the speed of C/C++.

CLS is built as a deeply modified fork of Microsoft's **Pyright**, specifically engineered to support Codon's unique static typing regime and high-performance features.

## Key Features

### 🚀 Performance Oriented

* **Static Type Enforcement**: Unlike standard Python, Codon is strictly typed. CLS enforces these types in real-time, catching errors before they hit the compiler.
* **Native Integration**: Understands Codon's specific compilation targets and library structures.

### 🛡️ Type Safety

* **Strict Type Mutation Check**: Catches cases where variable types are inadvertently changed, ensuring compatibility with Codon's native code generation.
* **C-FFI Support**: Intelligent suggestions and type checking when interacting with C libraries via Codon's foreign function interface.

### 🧵 Parallelism & Metaprogramming

* **Safe Concurrent Loops**: Provides analysis for `@par` loops, ensuring thread safety by tracking global state usage and mutation.
* **Macro & Attribute Support**: High-level support for Codon's metaprogramming features.

### 🛠️ IDE Essentials

* **Intelligent Auto-completion**: Context-aware suggestions tailored to Codon's standard library.
* **Real-time Diagnostics**: Quick feedback on syntax and type errors.
* **Go to Definition / Find References**: Navigate complex Codon codebases with ease.
* **Hover Information**: Instant documentation for functions, classes, and types.

## Installation

1. Install the **Codon** compiler on your system ([Installation Guide](https://docs.exaloop.io/codon/getting-started/installation)).
2. Install this extension from the VS Code Marketplace.
3. Open a `.codon` or `.py` file and the language server will activate automatically.

## Configuration

CLS can be configured using a `pyrightconfig.json` file in your project root. This allows you to specify:

* `include` / `exclude` paths
* `executionEnvironments`
* Strictness levels for various type checks

For a full list of configuration options, see the [Pyright Configuration Guide](https://microsoft.github.io/pyright/#/configuration).

## Resources

* [Official Codon Documentation](https://docs.exaloop.io/codon/)
* [Codon GitHub Repository](https://github.com/exaloop/codon)
* [Pyright Documentation](https://github.com/microsoft/pyright)

---
*Built with ❤️ for the Codon community.*
