// Minimal TS test runner for chatSmoke.ts
require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'commonjs' } });
require('./chatSmoke.ts');