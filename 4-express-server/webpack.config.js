module.exports = {
  entry: './main.tsx',
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js']
  },
  output: {
    path: './dist',
    filename: 'index.js'
  },
  module: {
    loaders: [
      { test: /\.less$/, loader: "style!css!less" },
      { test: /\.css$/, loader:"stsyle!css"},
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ]
  }
}
