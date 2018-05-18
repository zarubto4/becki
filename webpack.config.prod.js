const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const common = require('./webpack.config.common.js');

var ENV = process.env.npm_lifecycle_event;
var isTestWatch = ENV === 'test-watch';
var isTest = ENV === 'test' || isTestWatch;


const prodConfig = {

    mode: 'production',

    devtool: 'source-map',

    plugins: [
        new CleanWebpackPlugin(['dist']),

        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),

        new CopyWebpackPlugin([{
            from: root('src/public')
        }])

    ],

    module: {
        rules: [
            // support for .scss files
            // use 'null' loader in test mode (https://github.com/webpack/null-loader)
            // all css in src/style will be bundled in an external css file
            {
                test: /\.(scss|sass)$/,
                exclude: root('src', 'app'),
                use: isTest ? 'null-loader' : {
                    fallback: 'style-loader',
                    use: [ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'] }
            },

            // Support for CSS as raw text
            // use 'null' loader in test mode (https://github.com/webpack/null-loader)
            // all css in src/style will be bundled in an external css file
            {
                test: /\.css$/,
                exclude: root('src', 'app'),
                use: isTest ? 'null-loader' :
                    {
                        fallback: 'style-loader',
                        use: [ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
                    }
            }
        ]
    },

    plugins: [

        new CleanWebpackPlugin(['dist']),

        new MiniCssExtractPlugin({
            filename: "[name].css",
        })

    ],

    // optimization: {
    //     runtimeChunk: false,
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: 'vendors',
    //                 chunks: 'all',
    //             },
    //             cacheGroups: {
    //                 styles: {
    //                     name: 'styles',
    //                     test: /\.css$/,
    //                     chunks: 'all',
    //                     enforce: true
    //                 }
    //             }
    //         }
    //     },


        minimizer: [
            new UglifyJSPlugin({
                usourceMap: true,
                mangle: {
                    keep_fnames: true
                }
            }),
            new OptimizeCSSAssetsPlugin({})

        ]
    },

    output: {
        filename: 'js/[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    }
};



module.exports = merge(common, prodConfig);
