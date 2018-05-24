console.log('GET SARTED WITH DEVELOPMENT FILE');

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.config.common.js');
// const autoprefixer = require('autoprefixer');

var ENV = process.env.npm_lifecycle_event;
var isTestWatch = ENV === 'test-watch';
var isTest = ENV === 'test' || isTestWatch;


console.log('Imorts were imported');

const devConfig = {

    mode: 'development',


    devtool: 'eval',

    output: {
        path: root('dist'),
        publicPath: '/',
        filename: 'js/[name].js',
        chunkFilename: '[id].chunk.js'
    },

    devServer: {
        host: '0.0.0.0',
        port: 8080,
        contentBase: './src/public',
        historyApiFallback: true,
        quiet: true,
        stats: true// none (or false), errors-only, minimal, normal (or true) and verbose
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

console.log('END OF CONFIG');

console.log('BEFORE ROOT FUNCTION');


function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}

console.log('AFTER ROOT FUNCTION');



module.exports = merge(common, devConfig);
console.log(' module.exports after merging', module.exports);

console.log('THE END OF DEV CONFIG');
