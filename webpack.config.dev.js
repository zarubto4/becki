const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');
var autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const devMode = process.env.NODE_ENV !== 'production'

var ENV = process.env.npm_lifecycle_event;
var isTestWatch = ENV === 'test-watch';
var isTest = ENV === 'test' || isTestWatch;

module.exports = merge(common, {

    mode: 'development',

    devtool: 'eval',

    plugin: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        })
    ],

    module:{
        rule: [

            // all css required in src/app files will be merged in js files
            {
                test: /\.css$/,
                include: root('src', 'app'),
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'raw-loader!postcss-loader'
                ]
            },

            // support for .scss files
            // use 'null' loader in test mode (https://github.com/webpack/null-loader)
            // all css in src/style will be bundled in an external css file
            {
                test: /\.s?[ac]ss$/,
                exclude: root('src', 'style'),
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'raw-loader!postcss-loader!sass-loader'
                ]
            }
        ]
    },

    devServer: {
        host: '0.0.0.0',
        port: 8080,
        contentBase: './src/public',
        historyApiFallback: true,
        quiet: true,
        stats: true, // none (or false), errors-only, minimal, normal (or true) and verbose
        hot: true
    },

    output: {
        filename: 'js/[name].js',
        chunkFilename: '[id].chunk.js'
    }
});
