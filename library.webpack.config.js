const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ENV = process.env.npm_lifecycle_event;

module.exports = {

    context: process.cwd(),

    resolve: {
        extensions: ['.js', '.jsx', '.json', '.less', '.css','.ts', '.scss', '.html'],
        modules: [__dirname, 'node_modules']
    },

    entry: {
        polyfills: ['./src/polyfills.ts'],
        vendor: ['./src/vendor.ts']
    },

    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, './library'),
        library: '[name]'
    },

    module: {
        rules: [

            // copy those assets to output
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]?'
            },

            // Support for CSS as raw text
            // use 'null' loader in test mode (https://github.com/webpack/null-loader)
            // all css in src/style  will be bundled in an external css file
            {
                test: /\.css$/,
                exclude: root('src', 'app'),
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader' ]
            },

            // all css required in src/app files will be merged in js files
            {
                test: /\.css$/,
                include: root('src', 'app'),
                loader: 'raw-loader!postcss-loader'
            },

            // support for .scss files
            // use 'null' loader in test mode (https://github.com/webpack/null-loader)
            // all css in src/style will be bundled in an external css file
            {
                test: /\.(scss|sass)$/,
                exclude: root('src', 'app'),
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader' ]
            },
            // all css required in src/app files will be merged in js files
            {
                test: /\.(scss|sass)$/,
                exclude: root('src', 'style'),
                loader: 'raw-loader!postcss-loader!sass-loader'
            }
        ]
    },


    plugins: [

        new webpack.DllPlugin({
            name: '[name]',
            path: './build/library/[name].json'
        }),

        // Extract css files
        // Reference: https://github.com/webpack/extract-text-webpack-plugin
        // Disabled when in test mode or not in build mode
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css'
        })
    ]
};

// Helper functions
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}
