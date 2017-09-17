// rollup.config.js
import rollupTypescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import typescript from "typescript";
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import less from 'rollup-plugin-less';

export default {
    input: "src/index.tsx",
    output: {
        name: "Trifles",
        file: "dist/bundle.js",
        format: "iife"
    },
    watch: {
        include: "src/**"
    },
    plugins: [
        rollupTypescript({
            typescript: typescript
        }),
        resolve(),
        serve({
            contentBase: ['demo', 'dist']
        }),
        livereload('demo'),
        less({
            output: "dist/styles.css"
        })
    ]

};
