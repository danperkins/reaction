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
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },

    ]
  }
}
