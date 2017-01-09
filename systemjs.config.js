/**
 * Created by davidhradek on 13.09.16.
 */
/**
 * System configuration for Angular 2
 *
 */
(function (global) {
    System.config({
        paths: {
            'npm:': 'node_modules/'
        },
        map: {
            "app": "./app",
            // Angular
            '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
            '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
            '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
            // Other
            "ace": "./node_modules/ace-builds/src-min-noconflict",
            "blocko": "./node_modules/blocko",
            "node-uuid": "./node_modules/node-uuid",
            "rxjs": "./node_modules/rxjs",
            "the-grid": "./node_modules/the-grid",
            "underscore": "./node_modules/underscore",
            "crypto-js": "./node_modules/crypto-js",
            "moment": "./node_modules/moment",
            "watchjs": "./node_modules/watchjs",
            "acorn": "./node_modules/acorn",
            "estraverse": "./node_modules/estraverse",
            "esprima": "./node_modules/esprima",
            "esutils": "./node_modules/esutils",
            "optionator": "./node_modules/optionator",
            "source-map": "./node_modules/source-map",
            "escodegen": "./node_modules/escodegen"
        },
        packages: {
            "ace": {main: "ace"},
            "app": {main: "main", defaultExtension: "js"},
            "blocko": {main: "js/index"},
            "node-uuid": {main: "uuid"},
            "node_modules": {defaultExtension: "js"},
            "rxjs": {main: "Rx"},
            "the-grid": {main: "js/index"},
            "underscore": {main: "underscore"},
            "crypto-js": {main: 'index'},
            "moment": {main: 'moment'},
            "watchjs": {main: "src/watch"},
            "acorn": {main: "dist/acorn"},
            "estraverse": {main: "estraverse"},
            "esprima": {main: "esprima"},
            "esutils": {main: "lib/utils"},
            "optionator": {main: "lib/index"},
            "source-map": {main: "source-map"},
            "escodegen": {
                main: "escodegen", 
                map: {"./package.json": "./../../assets/fake-package.js"} // kokoti jsou to
            }
        }
    });
})(this);