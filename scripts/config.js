import {nodeResolve} from '@rollup/plugin-node-resolve';

export default [
    {
        input: 'src/index.js',
        output: {
            file: 'dist/index.esm.js',
            format: 'esm',
        },
        external: ['vue'],
        plugins: [nodeResolve()],
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/index.js',
            format: 'cjs',
        },
        external: ['vue'],
        plugins: [nodeResolve()],
    },
];
