module.exports = {
  entry:  {
    index: './main.tsx'
  },
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx']
  },
  output: {
    path: './dist',
    filename: '[name].js'
  },
  module: {
    //noParse: [ /sinon/],
    loaders: [
      { test: /\.less$/, loader: "style!css!less" },
      { test: /\.css$/, loader:"stsyle!css"},
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ]
  },
  // This is listed in the 'enzyme' getting started details for making webpack work well with that library
  externals: {
    'cheerio': 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  }
}
