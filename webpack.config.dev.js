const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');
// const autoprefixer = require('autoprefixer');

const devConfig = {

    mode: 'development',

    devtool: 'eval',

    devServer: {
        host: '0.0.0.0',
        port: 8080,
        contentBase: './src/public',
        historyApiFallback: true,
        quiet: true,
        stats: true, // none (or false), errors-only, minimal, normal (or true) and verbose
    },

    module: {
        rules: [
            // all css required in src/app files will be merged in js files
            {
                test: /\.css$/,
                include: root('src', 'app'),
                use: ['raw-loader', 'postcss-loader']
            },

            // all css required in src/app files will be merged in js files
            {
                test: /\.(scss|sass)$/,
                exclude: root('src', 'style'),
                use: ['raw-loader', 'postcss-loader', 'sass-loader']
            },
        ]
    },

    optimization: {

        namedModules: true

    }


};


function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}

module.exports = merge(common, devConfig);
