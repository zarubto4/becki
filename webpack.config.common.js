const webpack = require('webpack');
const path = require('path');
const xmlConfig = require('xml-loader');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');


var ENV = process.env.npm_lifecycle_event;
var isTestWatch = ENV === 'test-watch';
var isTest = ENV === 'test' || isTestWatch;

module.exports = function makeWebpackConfig() {

    console.log('Entered in function');

    const config = {};

    console.log('Created variable config ', config);


    // config.stats = {
    //     errorDetails: true
    // };

    config.entry = isTest ? {} : {
        'polyfills': './src/polyfills.ts',
        'vendor': './src/vendor.ts',
        'app': './src/main.ts'
    };
    console.log('Created entry ', config.entry);


    console.log('test');

    config.resolve = {
        extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html']
    };

    console.log('after extensions ', config.extensions);

    var atlOptions = '';
    if (isTest && !isTestWatch) {
        // awesome-typescript-loader needs to output inlineSourceMap for code coverage to work with source maps.
        atlOptions = 'inlineSourceMap=true&sourceMap=false';
    }
    console.log('atlOptions CREATED ', atlOptions);

    config.module = {
        rules: [
            // Support for .ts files.
            {
                test: /\.ts$/,
                use: ['awesome-typescript-loader?' + atlOptions, 'angular2-template-loader'],
                exclude: [isTest ? /\.(e2e)\.ts$/ : /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/],
            },

            // Support for images and fonts
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'file-loader?name=assets/[name].[hash].[ext]?'
            },

            // Support for xml files
            {test: /\.xml$/, loader: 'xml-loader'},

            // support for .html as raw text
            // todo: change the loader to something that adds a hash to images
            {
                test: /\.html$/,
                use: 'raw-loader',
                exclude: root('src', 'public')
            },

            // support for .scss files
            // use 'null' loader in test mode (https://github.com/webpack/null-loader)
            // all css in src/style will be bundled in an external css file
            {
                test: /\.(scss|sass)$/,
                exclude: root('src', 'app'),
                use: isTest ? 'null-loader' : [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
            },

            // Support for CSS as raw text
            // use 'null' loader in test mode (https://github.com/webpack/null-loader)
            // all css in src/style will be bundled in an external css file
            {
                test: /\.css$/,
                exclude: root('src', 'app'),
                use: isTest ? 'null-loader' : [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            }
        ]
    }

};

console.log('Module rules was Created ', config.module.rules);


if (!isTest || !isTestWatch) {
    // tslint support
    config.module.rules.push({
        test: /\.ts$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'tslint-loader'
    });
}

console.log('Module rules after condition on the test ', config.module.rules);


config.plugins = [

    // Clean output directory before evey build
    // new CleanWebpackPlugin(['dist']),

    new webpack.DefinePlugin({
        // Environment helpers
        'process.env': {
            ENV: JSON.stringify(ENV)
        }
    }),
    new CleanWebpackPlugin(['dist']),

    // Inject script and link tags into html files
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
        template: './src/public/index.html',
        chunksSortMode: 'dependency'
    }),

    new webpack.LoaderOptionsPlugin({
        options: {
            /**
             * Apply the tslint loader as pre/postLoader
             * Reference: https://github.com/wbuchwalter/tslint-loader
             */
            tslint: {
                emitErrors: false,
                failOnHint: false
            },
            /**
             * Sass
             * Reference: https://github.com/jtangelder/sass-loader
             * Transforms .scss files to .css
             */
            sassLoader: {
                //includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss")]
            },
            /**
             * PostCSS
             * Reference: https://github.com/postcss/autoprefixer-core
             * Add vendor prefixes to your css
             */
            postcss: [
                autoprefixer({
                    browsers: ['last 2 version']
                })
            ]
        }
    })
];

console.log('Plugins was created ', config.plugins);


config.plugins.push(
    new CopyWebpackPlugin([
        {
            from: root('node_modules/monaco-editor/min/vs'),
            to: 'libs/monaco-editor/vs'
        }
    ])
);

console.log('Plugins was pushed ', config.plugins);


config.plugins.push(
    new webpack.IgnorePlugin(/mongodb/)
);
console.log('Plugins was pushed 2 ', config.plugins);

console.log('Before RETURN ');

return config;

}
();


console.log('Before ROOT FUNCTION ');

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}

console.log('After root function!! ');

console.log('THE END OF COMMON CONFIG');
