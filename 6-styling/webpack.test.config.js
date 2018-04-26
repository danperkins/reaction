module.exports = {
  entry:  {
    test: './testConfig/testList.ts'
  },
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx'],
    alias: {
      //'sinon': 'sinon/pkg/sinon'
    }
  },
  output: {
    path: './dist',
    filename: '[name].js'
  },
  module: {
    //noParse: [ /sinon/],
    loaders: [
      { test: /\.less$/, loader: "ignore-loader" },
      { test: /\.css$/, loader:"ignore-loader"},
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
