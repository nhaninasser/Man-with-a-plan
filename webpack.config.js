const path = require("path");

module.exports = {
    entry: "./Develop/public/js/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    mode: "development",
}