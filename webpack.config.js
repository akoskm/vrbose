const path = require('path');
const webpack = require('webpack');
const babelSettings = {
  presets: ['react', 'es2015'],
  env: {
    development: {
      plugins: [
        ['react-transform', {
          transforms: [
            {
              transform: 'react-transform-hmr',
              imports: ['react'],
              locals: ['module']
            }
          ]
        }]
      ]
    }
  }
};

module.exports = {
  debug: true,
  // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  // eval cuts size to 50%, alternative is cheap-module-eval-source-map
  devtool: 'cheap-module-eval-source-map',
  noInfo: true, // set to false to see a list of every file being bundled.
  entry: [
    `webpack-hot-middleware/client`,
    './src/client-render.js'
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        query: babelSettings,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(less)$/,
        loaders: ['style', 'css', 'less']
      },
      {
        test: /\.(scss)$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        test: /\.(css)$/,
        loaders: ['style', 'css']
      },
      {
        test: /\.(png|jpe?g)(\?.*)?$/,
        loader: 'url?limit=8182'
      },
      {
        test: /\.(svg|ttf|woff2?|eot)(\?.*)?$/,
        loader: 'file'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
