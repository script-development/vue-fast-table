import vue from 'rollup-plugin-vue';
import ts from 'rollup-plugin-typescript2';
import pkg from '../package.json';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                // SSR build.
                file: pkg.main,
                format: 'cjs',
                exports: 'named',
            },
            {
                // ESM build to be used with webpack/rollup.
                file: pkg.module,
                format: 'esm',
            },
        ],
        plugins: [
            ts({
                tsconfig: './tsconfig.json',
                declarationDir: './dist',
            }),
            vue(),
        ],
        external: Object.keys(pkg.devDependencies || {}),
    },
];
