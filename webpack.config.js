const webpack = require("webpack")

module.exports = {
  context: __dirname + "/scripts",
  entry: {
    game: "./index.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{loader: "babel-loader",options: {presets: ["es2015"]}}]
      },
      {
        test: /\.less$/,
        use: ["less","style-loader"]
      },
      {
        test: /\.gif$/,
        use: ["url-loader"]
      }
    ]
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
  },
}
