const path = require('path');
const webpack = require('webpack');
const xmlConfig = require('xml-loader');

var ENV = process.env.npm_lifecycle_event;
var isTestWatch = ENV === 'test-watch';
var isTest = ENV === 'test' || isTestWatch;


var atlOptions = '';
if (isTest && !isTestWatch) {
    // awesome-typescript-loader needs to output inlineSourceMap for code coverage to work with source maps.
    atlOptions = 'inlineSourceMap=true&sourceMap=false';
}

module.exports = {

    entry: {
        polyfills: './src/polyfills.ts',
        vendor: './src/vendor.ts',
        app: './src/main.ts'
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },

    resolve: {
        extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html']
    },

    module: {
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
            { test: /\.xml$/, loader: 'xml-loader' },

            // support for .html as raw text
            // todo: change the loader to something that adds a hash to images
            {
                test: /\.html$/,
                use: 'raw-loader',
                exclude: root('src', 'public')
            },

            // support for .xml files
            { test: /\.xml$/, loader: 'xml-loader' }

        ]
    },

    plugins: [

        // Clean output directory before evey build
        // new CleanWebpackPlugin(['dist']),

        new webpack.DefinePlugin({
            // Environment helpers
            'process.env': {
                ENV: JSON.stringify(ENV)
            }
        })

    ]

};

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}





// optimization: {
//     splitChunks: {
//         cacheGroups: {
//             vendors: {
//                 name: 'vendors',
//                 chunks: 'all',
//                 reuseExistingChunk: true,
//                 priority: 1,
//                 enforce: true,
//                 test(module, chunks) {
//                     const name = module.nameForCondition && module.nameForCondition();
//                     return chunks.some(chunk => {
//                         return chunk.name === 'main' && /[\\/]node_modules[\\/]/.test(name);
//                 });
//                 }
//             },
//             polyfills: {
//                 name: 'secondary',
//                 chunks: 'all',
//                 priority: 2,
//                 enforce: true,
//                 test(module, chunks) {
//                     return chunks.some(chunk => chunk.name === 'secondary');
//                 }
//             },
//             secondary: {
//                 name: 'secondary',
//                 chunks: 'all',
//                 priority: 2,
//                 enforce: true,
//                 test(module, chunks) {
//                     return chunks.some(chunk => chunk.name === 'secondary');
//                 }
//             }
//         }
//     }
// }

