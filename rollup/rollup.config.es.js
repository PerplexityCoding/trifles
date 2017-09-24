import resolve from "rollup-plugin-node-resolve";

export default {
    input: "src/trifles.js",
    output: {
        file: "dist/trifles.esm.js",
        format: "es"
    },
    plugins: [
        resolve()
    ],
    external: [ "preact", "whatwg-fetch" ]
};
