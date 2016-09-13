/**
 * Created by davidhradek on 13.09.16.
 */
/**
 * System configuration for Angular 2
 *
 */
(function (global) {
    System.config({
        map: {
            "app": "./app",
            "@angular": "./node_modules/@angular",
            "ace": "./node_modules/ace-builds/src-min-noconflict",
            "blocko": "./node_modules/blocko",
            "node-uuid": "./node_modules/node-uuid",
            "rxjs": "./node_modules/rxjs",
            "the-grid": "./node_modules/the-grid",
            "underscore": "./node_modules/underscore",
            "crypto-js": "./node_modules/crypto-js",
            "moment": "./node_modules/moment"
        },
        packages: {
            "@angular/common": {main: "index"},
            "@angular/compiler": {main: "index"},
            "@angular/core": {main: "index"},
            "@angular/forms": {main: "index"},
            "@angular/http": {main: "index"},
            "@angular/platform-browser": {main: "index"},
            "@angular/platform-browser-dynamic": {main: "index"},
            "@angular/router": {main: "index"},
            "ace": {main: "ace"},
            "app": {main: "main", defaultExtension: "js"},
            "blocko": {main: "js/index"},
            "node-uuid": {main: "uuid"},
            "node_modules": {defaultExtension: "js"},
            "rxjs": {main: "Rx"},
            "the-grid": {main: "js/index"},
            "underscore": {main: "underscore"},
            "crypto-js": {main: 'index'},
            "moment": {main: 'moment'}
        }
    });
})(this);