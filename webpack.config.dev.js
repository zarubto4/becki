const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');
const autoprefixer = require('autoprefixer');

const devConfig = {

    mode: 'development',

    devServer: {
        host: '0.0.0.0',
        port: 8080,
        contentBase: './src/public',
        historyApiFallback: true,
        quiet: true,
        stats: true, // none (or false), errors-only, minimal, normal (or true) and verbose
        hot: true
    },

    devtool: 'eval',

    output: {
        filename: 'js/[name].js',
        chunkFilename: '[id].chunk.js'
    },

    module: {
        rules: [
            // css
            {
                test: /\.css$/,
                include: root('src', 'app'),
                loader: 'raw-loader!postcss-loader'
            },
            // sass
            {
                test: /\.scss$/,
                exclude: root('src', 'style'),
                loader: 'raw-loader!postcss-loader!sass-loader'
            }

        ]
    },


    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    optimization: {

        namedModules: true

    }


};


function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}

module.exports = merge(common, devConfig);
