// Angular 2
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@angular/router';

import 'rxjs';

// node_modules
const w = <any>window;
w['$'] = w['jquery'] = w['jQuery'] = require('jquery');
require('jquery-ui-bundle');
w['ts'] = require('imports-loader?require=>undefined!typescript');
require('imports-loader?this=>window,fix=>module.exports=0!snapsvg');

// fix for Snap urls for Safari
(<any>Snap).url = function (url: string) {
    return 'url(\'' + window.location.pathname + '#' + url + '\')';
};

// Fonts
import 'font-awesome/css/font-awesome.min.css';
import 'font-roboto/dist/styles/roboto.min.css';
import 'open-sans-fontface/open-sans.css';

// Style folder
// == Fonts
import './style/assets/global/plugins/simple-line-icons/simple-line-icons.min.css';
// == CSS
import './style/assets/global/plugins/bootstrap/css/bootstrap.min.css';
import './style/assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css';
import './style/assets/global/plugins/jstree/dist/themes/default/style.min.css';
import './style/assets/global/plugins/jquery-minicolors/jquery.minicolors.css';
import './style/assets/global/css/components.css';
// import './public/assets/global/css/plugins.css';
import './style/assets/layouts/layout/css/layout.css';
import './style/assets/layouts/layout/css/themes/darkblue.css';
import './style/assets/layouts/layout/css/custom.css';
import './style/assets/pages/css/login.min.css';
import './style/assets/pages/css/error.min.css';
import './style/assets/pages/css/pricing.css';
// == Byzance style
import './style/byzance.scss';
// == JS
import './style/assets/global/plugins/jquery-minicolors/jquery.minicolors.min.js';
