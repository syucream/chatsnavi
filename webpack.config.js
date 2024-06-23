const path = require("path");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    background: path.join(__dirname, "src", "background.ts"),
    options: path.join(__dirname, "src", "options.ts"),
    popup: path.join(__dirname, "src", "popup.ts"),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    // ...
    new CopyPlugin({
      patterns: [
        { from: '.', to: '.', context: 'public' },
      ],
    }),
  ],
};
