import resolve from "rollup-plugin-node-resolve";

export default {
    input: "src/trifles.js",
    output: {
        name: "Trifles",
        file: "dist/trifles.js",
        format: "iife"
    },
    moduleContext: {
        [require.resolve('whatwg-fetch')]: 'window'
    },
    plugins: [
        resolve()
    ]
};
