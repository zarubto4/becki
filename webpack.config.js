// Helper: root() is defined at the bottom
const path = require('path');
const webpack = require('webpack');

// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const PurifyCSSPlugin = require('purifycss-webpack');
const glob = require('glob');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
const ENV = process.env.npm_lifecycle_event;
const isTestWatch = ENV === 'test-watch';
const isTest = ENV === 'test' || isTestWatch;
const isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets setnom i
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
        filename: isProd ? 'js/[name].[chunkhash].js' : 'js/[name].js',
        chunkFilename: isProd ? '[id].[chunkhash].chunk.js' : '[id].chunk.js'
    };

    if (isProd) {
        config.optimization = {
            noEmitOnErrors: true
        };
    }

    /**
     * Resolve
     * Reference: http://webpack.github.io/docs/configuration.html#resolve
     */
    config.resolve = {
        // only discover files that have those extensions
        extensions: ['.ts', '.tsx', '.js', '.json', '.css', '.scss', '.html']
    };

    let atlOptions = '';
    if (isTest && !isTestWatch) {
        // awesome-typescript-loader needs to output inlineSourceMap for code coverage to work with source maps.
        atlOptions = 'inlineSourceMap=true&sourceMap=false';
    }

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    config.module = {
        rules: [

            // Support for TS files.
            {
                test: /\.tsx?$/,
                loaders: ['awesome-typescript-loader?' + atlOptions, 'angular-router-loader', 'angular2-template-loader'],
                exclude: [/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/, /node_modules/]
            },

            {
                test: /\.(gif|png|jpe?g|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                use: [
                    'file-loader?name=assets/[name].[hash].[ext]?',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            disable: true // webpack@2.x and newer
                        }
                    }
                ],
            },

            // Copy those assets to output.
            {
                test: /\.(woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: ['file-loader?name=assets/[name].[hash].[ext]?']
            },

            // Support for XML files.
            {
                test: /\.xml$/,
                loader: 'xml-loader'
            },

            // Support for CSS as raw text.
            // Use 'null' loader in test mode. Reference: https://github.com/webpack/null-loader
            // All CSS files in src/style  will be bundled in an external CSS file.
            {
                test: /\.css$/,
                exclude: root('src', 'app'),
                use: isTest ? ['null-loader'] : [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            },

            // All CSS files required in src/app files will be merged in JS files.
            {
                test: /\.css$/,
                include: root('src', 'app'),
                loader: 'raw!postcss'
            },

            // Support for SCSS files.
            // Use 'null' loader in test mode. Reference: https://github.com/webpack/null-loader
            // All CSS files in src/style will be bundled in an external CSS file.
            {
                test: /\.(scss|sass)$/,
                exclude: root('src', 'app'),
                use: isTest ? ['null-loader'] : [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'fast-sass-loader']
            },

            // All CSS files required in src/app files will be merged in JS files.
            {
                test: /\.(scss|sass)$/,
                exclude: root('src', 'style'),
                loader: 'raw!postcss!fast-sass'
            },

            // Support for HTML files as raw text.
            // TODO: change the loader to something that adds a hash to images.
            {
                test: /\.html$/,
                exclude: root('src', 'public'),
                loader: 'raw-loader'

            }
        ]
    };

    if (!isTest || !isTestWatch) {
        // Supprt for tslint.
        config.module.rules.push({
            test: /\.ts$/,
            exclude: /node_modules/,
            enforce: 'pre',
            loader: 'tslint-loader'
        });
    }

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [

        // new BundleAnalyzerPlugin({
        //     analyzerPort:3333
        // }),

        new HardSourceWebpackPlugin(),

        new webpack.ContextReplacementPlugin(/(.+)?angular([\\\/])core(.+)?/, root('./src'), {})
    ];

    if (!isTest && !isTestWatch) {
        config.plugins.push(
            // Inject script and link tags into html files.
            // Reference: https://github.com/ampedandwired/html-webpack-plugin
            new HtmlWebpackPlugin({
                inject: false,
                template: './src/public/index.html',
                chunksSortMode: 'dependency',
            }),

            // This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS.
            // Reference: https://github.com/webpack-contrib/mini-css-extract-plugin
            // Disabled when in test mode.
            new MiniCssExtractPlugin({
                filename: !isProd ? '[name].css' : 'css/[name].[contenthash:8].css',
                chunkFilename: !isProd ? '[id].css' : 'css/[id].[hash].css',
                hash: true
            }),

            new PurifyCSSPlugin({
                minimize: true,
                moduleExtensions: ['.html'],
                // Give paths to parse for rules. These should be absolute!
                paths: glob.sync(`**/*.html`, {nodir: true}),
                purifyOptions: {
                    whitelist: []
                }
            })
        );
    }

    // Add build(production mode) specific plugins.
    if (isProd) {
        config.plugins.push(
            new CopyWebpackPlugin([{
                from: root('src', 'public')
            }]),

            // new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),

            // A Webpack plugin to optimize \ minimize CSS assets.
            // It will search for CSS assets during the Webpack build and will optimize \ minimize the CSS.
            // Reference: https://github.com/NMFR/optimize-css-assets-webpack-plugin
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.optimize\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {discardComments: {removeAll: true}},
                canPrint: true
            })
        );
    }

    config.plugins.push(
        new CopyWebpackPlugin([
            {
                from: root('node_modules/monaco-editor/min/vs'),
                to: 'libs/monaco-editor/vs'
            }
        ])
    );

    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */

    config.devServer = {
        host: '0.0.0.0',
        port: 8080,
        contentBase: './src/public',
        historyApiFallback: true,
        quiet: true,
        stats: true // none (or false), errors-only, minimal, normal (or true) and verbose
    };

    return config;

}();

// Helper function
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}

