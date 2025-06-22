const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: '/'
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@core': path.resolve(__dirname, 'src/core'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@ui': path.resolve(__dirname, 'src/ui'),
        '@data': path.resolve(__dirname, 'src/data'),
        '@types': path.resolve(__dirname, 'src/types')
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              configFile: path.resolve(__dirname, 'tsconfig.json')
            }
          },
          exclude: /node_modules/
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        inject: 'body'
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public')
      },
      compress: true,
      port: 3000,
      open: false,
      hot: true,
      historyApiFallback: true,
      client: {
        overlay: {
          errors: true,
          warnings: false
        }
      }
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map'
  };
};