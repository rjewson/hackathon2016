var path = require("path");
module.exports = {
    entry: {
        app: ["./main.js"]
    },
    output: {
        path: __dirname,
        filename: "bundle.js"
    }
};