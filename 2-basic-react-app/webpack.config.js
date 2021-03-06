module.exports = {
  entry: './main.tsx',
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx']
  },
  output: {
    path: './',
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
