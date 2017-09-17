// rollup.config.js
import rollupTypescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import typescript from "typescript";
import uglify from "rollup-plugin-uglify";
import less from 'rollup-plugin-less';
import strip from 'rollup-plugin-strip';

export default {
    input: "src/index.tsx",
    output: {
        name: "Trifles",
        file: "dist/bundle.min.js",
        format: "iife"
    },
    plugins: [
        rollupTypescript({
            typescript: typescript
        }),
        resolve(),
        less({
            output: "dist/styles.css"
        }),
        strip({
            debugger: true,
            functions: [ 'console.log', 'assert.*', 'debug', 'alert' ],
            sourceMap: true,
            include: ['**/*.js', '**/*.ts', , '**/*.tsx']
        }),
        uglify()
    ]

};
