process.argv.splice(2, 0, '--typeshed-path', '/home/delta-x/codify/packages/pyright-internal/out/typeshed-fallback');
require('./out/src/pyright.js').main();
