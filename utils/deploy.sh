#!/bin/bash
# Print a trace of commands
set -x
# Exit immediately if a command exits with a non-zero status
set -e

# Clean lib folder
rm -rf lib
mkdir lib

# Remove flow types
./node_modules/.bin/flow-remove-types src/index.js --pretty --out-file lib/index.js
./node_modules/.bin/flow-remove-types src/RNPDFView.js --pretty --out-file lib/RNPDFView.js

# TypeScript
cp ./index.d.ts ./lib

# FlowType
./node_modules/.bin/flow-copy-source --ignore __tests__/* --verbose src lib
