require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'commonjs' } });
require('tsconfig-paths/register');
require('./chatSmoke.ts');