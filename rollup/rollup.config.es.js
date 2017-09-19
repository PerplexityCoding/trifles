// rollup.config.js
import rollupTypescript from "rollup-plugin-typescript";
//import resolve from "rollup-plugin-node-resolve";
import typescript from "typescript";
import less from 'rollup-plugin-less';

export default {
    input: "src/trifles.tsx",
    output: {
        file: "dist/trifles.es.js",
        format: "es"
    },
    plugins: [
        rollupTypescript({
            typescript: typescript
        }),
        less({
            output: "dist/styles.css"
        })
    ]
};
