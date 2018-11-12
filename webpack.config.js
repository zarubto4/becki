// Helper: root() is defined at the bottom
const path = require('path');
const webpack = require('webpack');
const glob = require('glob');

// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


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
    config.entry = isTest ? {} : {
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
     * Optimization
     * Reference: https://webpack.js.org/configuration/optimization/
     */
    config.optimization = {
        // minimize: false,          // Uncomment it to disable optimizations and speed up building.
        minimizer: [
            // A Webpack plugin to cut unused CSS selectors.
            new PurifyCSSPlugin({
                styleExtensions: ['.css', '.scss', '.min.css'],
                moduleExtensions: ['.html'],
                minimize: true,
                paths: glob.sync(root('src', 'app', '**', '*.html')),
                // purifyOptions: {
                //     rejected: true
                // },
                // verbose: true
            }),

            // A Webpack plugin to optimize \ minimize CSS assets.
            // It will search for CSS assets during the Webpack build and will optimize \ minimize the CSS.
            // Reference: https://github.com/NMFR/optimize-css-assets-webpack-plugin
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.(css|sass|scss)$/g,
                cssProcessor: require('cssnano'),
                cssProcessorOptions: {discardComments: {removeAll: true}},
            }),

            new UglifyWebpackPlugin({
                parallel: true,
                cache: true,
                sourceMap: true,
                uglifyOptions: {
                    keep_fnames: true
                }
            })
        ],
        noEmitOnErrors: true
    };

    /**
     * Resolve
     * Reference: http://webpack.github.io/docs/configuration.html#resolve
     */
    config.resolve = {
        // only discover files that have those extensions
        extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html']
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
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader?' + atlOptions, 'angular-router-loader', 'angular2-template-loader'],
                exclude: [isTest ? /\.(e2e)\.ts$/ : /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/, /node_modules/]
            },

            // Transpile module 'blocko' to es5.
            {
                test: /\.m?js$/,
                include: root('node_modules', 'blocko'),
                use: 'babel-loader',
            },

            // Minimize images.
            {
                test: /\.(jpg|png|gif|svg)$/,
                loader: 'image-webpack-loader',
                enforce: 'pre'
            },

            // Copy those assets to output.
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=assets/[name].[hash].[ext]?'
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
                use: isTest ? 'null-loader' : [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: {minimize: true}},
                    'postcss-loader'
                ]
            },

            // All CSS files required in src/app files will be merged in JS files.
            {
                test: /\.css$/,
                include: root('src', 'app'),
                loader: 'raw-loader!postcss-loader'
            },

            // Support for SCSS files.
            // Use 'null' loader in test mode. Reference: https://github.com/webpack/null-loader
            // All CSS files in src/style will be bundled in an external CSS file.
            {
                test: /\.(scss|sass)$/,
                exclude: root('src', 'app'),
                use: isTest ? 'null-loader' : [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: {minimize: true}},
                    'postcss-loader',
                    'fast-sass-loader'
                ]
            },

            // All CSS files required in src/app files will be merged in JS files.
            {
                test: /\.(scss|sass)$/,
                exclude: root('src', 'style'),
                loader: 'raw-loader!postcss-loader!fast-sass-loader'
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
        //     analyzerPort: 444
        // }),

        // HardSourceWebpackPlugin is a plugin for Webpack
        // to provide an intermediate caching step for modules.
        // Reference: https://github.com/mzgoddard/hard-source-webpack-plugin
        new HardSourceWebpackPlugin(),

        new webpack.ContextReplacementPlugin(/(.+)?angular([\\\/])core(.+)?/, root('./src'), {})
    ];

    config.plugins.push(

        // Inject script and link tags into html files.
        // Reference: https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            inject: false,
            template: root('src', 'public', 'index.html'),
            chunksSortMode: 'dependency',
        }),

        // This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS.
        // Reference: https://github.com/webpack-contrib/mini-css-extract-plugin
        // Disabled when in test mode.
        new MiniCssExtractPlugin({
            filename: !isProd ? '[name].css' : 'css/[name].[hash].css',
            chunkFilename: !isProd ? '[id].css' : 'css/[id].[hash].css',
            hash: true
        })
    );

    // Add build(production mode) specific plugins.
    if (isProd) {
        config.plugins.push(
            new CopyWebpackPlugin([{
                from: root('src', 'public'),
                // To avoid duplicity.
                ignore: ['*.svg', '*.png', '*.json', '*.xml', '*.ico']
            }])
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

    config.plugins.push(
        new webpack.IgnorePlugin(/mongodb/)
    );


    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */

    if (!isProd) {
        config.devServer = {
            host: 'localhost',
            port: 8080,
            contentBase: './src/public',
            historyApiFallback: true,
            stats: true, // none (or false), errors-only, minimal, normal (or true) and verbose
            open: true
        };
    }

    return config;

}();

// Helper function
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}
