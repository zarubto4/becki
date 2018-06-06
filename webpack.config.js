// Helper: root() is defined at the bottom
const path = require('path');
const webpack = require('webpack');

// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
const ENV = process.env.npm_lifecycle_event;
const isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    const config = {};

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if (isProd) {
        config.devtool = 'cheap-module-source-map';
    }
    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     */
    config.entry = {
        polyfills: './src/polyfills.ts',
        vendor: './src/vendor.ts',
        app: './src/main' // our angular app
    };

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     */

    config.output = {
        path: root('dist'),
        publicPath: '/',
        filename: isProd ? 'js/[name].[chunkhash].js' : 'js/[name].js',
        chunkFilename: isProd ? '[id].[chunkhash].chunk.js' : '[id].chunk.js'

    };

    /**
     * Resolve
     * Reference: http://webpack.github.io/docs/configuration.html#resolve
     */
    config.resolve = {
        // only discover files that have those extensions
        extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html'],
    };

    var atlOptions = 'inlineSourceMap=true&sourceMap=false';
    // if (isTest && !isTestWatch) {
    //     // awesome-typescript-loader needs to output inlineSourceMap for code coverage to work with source maps.
    //     atlOptions = 'inlineSourceMap=true&sourceMap=false';
    // }

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    config.module = {
        rules: [

            // Support for .ts files.
            {
                test: /\.ts$/,
                use: ['awesome-typescript-loader?' + atlOptions, 'angular2-template-loader'],
                exclude: [/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/, /node_modules/]
            },

            // copy those assets to output
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]?'
            },

            // support for .xml files
            {
                test: /\.xml$/,
                loader: 'xml-loader'
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
            },

            // support for .html as raw text
            // todo: change the loader to something that adds a hash to images
            {
                test: /\.html$/,
                exclude: root('src', 'public'),
                loader: 'raw-loader'

            },

            // tslint support
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                enforce: 'pre',
                loader: 'tslint-loader'
            }

        ]
    };

    // if (!isTest || !isTestWatch) {
    //     // tslint support
    //     config.module.rules.push({
    //         test: /\.ts$/,
    //         exclude: /node_modules/,
    //         enforce: 'pre',
    //         loader: 'tslint-loader'
    //     });
    // }

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [

        // Define env variables to help with builds
        // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
        new webpack.DefinePlugin({
            // Environment helpers
            'process.env': {
                ENV: JSON.stringify(ENV)
            }
        }),

        new webpack.ContextReplacementPlugin( /(.+)?angular([\\\/])core(.+)?/, root('./src'), {} ),

        // new webpack.DllReferencePlugin({
        //     context: '.',
        //     manifest: require('./build/library/polyfills.json')&&require('./build/library/vendor.json')
        // }),

        new HtmlWebpackPlugin({
            template: './src/public/index.html',
            chunksSortMode: 'dependency'
        }),

        new CopyWebpackPlugin([
            {
                from: root('node_modules/monaco-editor/min/vs'),
                to: 'libs/monaco-editor/vs'
            }
        ]),


        new webpack.IgnorePlugin(/mongodb/)
    ];

    // if (!isTest && !isTestWatch) {
    //     config.plugins.push(
    //         // Inject script and link tags into html files
    //         // Reference: https://github.com/ampedandwired/html-webpack-plugin
    //         new HtmlWebpackPlugin({
    //             template: './src/public/index.html',
    //             chunksSortMode: 'dependency'
    //         })
    //     );
    // }

    // Add build specific plugins
    if (isProd) {

        config.plugins.push(
            new CopyWebpackPlugin([{
                from: root('src','public')
            }]),

            // Extract css files
            // Reference: https://github.com/webpack/extract-text-webpack-plugin
            // Disabled when in test mode or not in build mode
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: '[name].[contenthash].css',
                chunkFilename: '[id].[contenthash].css'
            })
        );
    }

    // config.plugins.push(
    //     new CopyWebpackPlugin([
    //         {
    //             from: root('node_modules/monaco-editor/min/vs'),
    //             to: 'libs/monaco-editor/vs'
    //         }
    //     ])
    // );

    // config.plugins.push(
    //     new webpack.IgnorePlugin(/mongodb/)
    // );

    if (isProd) {
        config.optimization = {
            // // Turn off default Uglify plugin
            minimize: false,
            noEmitOnErrors: true

        };
    }

    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */

    if(!isProd) {

        config.devServer = {
            host: '0.0.0.0',
            port: 8080,
            contentBase: './src/public',
            historyApiFallback: true,
            quiet: true,
            stats: true // none (or false), errors-only, minimal, normal (or true) and verbose
        };
    }

    return config;

}();

// Helper functions
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}

console.log(module.exports);

