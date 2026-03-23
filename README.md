# Codon Language Server

<p align="center">
  <img src="packages/vscode-pyright/images/codonimagelogo.png" width="128" alt="Codon Logo">
</p>

## Overview

**Codon Language Server (CLS)** is a high-performance, standards-based static type checker and Language Server Protocol (LSP) implementation for the **Codon** programming language.

Codon is a high-performance Python compiler that generates native machine code without runtime overhead. This project, built as a deeply modified fork of Microsoft's **Pyright**, is specifically engineered to enforce Codon's zero-overhead static typing regime, handle its C-FFI layers, and analyze its parallel loop architectures.

## Core Features

This repository provides the modified VS Code extension (`vscode-pyright`) tuned for `.codon` file integration.

1. Navigate to the extension package: `cd packages/vscode-pyright`
2. Build the extension bundle: `npx webpack --mode development`
3. Install the resulting VSIX or launch it securely via the VS Code Extension Development Host.

## Documentation Reference

- For information about the Codon language compiler, see the [Codon Documentation](https://docs.exaloop.io/codon/).
- For legacy Pyright settings (which Codify inherits), see the [Original Docs](docs/README.md).
