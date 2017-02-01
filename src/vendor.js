"use strict";
// Angular 2
require("@angular/platform-browser");
require("@angular/platform-browser-dynamic");
require("@angular/core");
require("@angular/common");
require("@angular/http");
require("@angular/router");
require("rxjs");
// node_modules
var w = window;
w['$'] = w['jquery'] = w['jQuery'] = require('jquery');
require('jquery-ui-bundle');
w['ts'] = require('imports-loader?require=>undefined!typescript');
require('imports-loader?this=>window,fix=>module.exports=0!snapsvg');
// Fonts
require("font-awesome/css/font-awesome.min.css");
require("font-roboto/dist/styles/roboto.min.css");
require("open-sans-fontface/open-sans.css");
// Style folder
// == Fonts
require("./style/assets/global/plugins/simple-line-icons/simple-line-icons.min.css");
// == CSS
require("./style/assets/global/plugins/bootstrap/css/bootstrap.min.css");
require("./style/assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css");
require("./style/assets/global/plugins/jstree/dist/themes/default/style.min.css");
require("./style/assets/global/plugins/jquery-minicolors/jquery.minicolors.css");
require("./style/assets/global/css/components.css");
// import './public/assets/global/css/plugins.css';
require("./style/assets/layouts/layout/css/layout.css");
require("./style/assets/layouts/layout/css/themes/darkblue.css");
require("./style/assets/layouts/layout/css/custom.css");
require("./style/assets/pages/css/login.min.css");
require("./style/assets/pages/css/error.min.css");
require("./style/assets/pages/css/pricing.css");
// == Byzance style
require("./style/byzance.scss");
// == JS
require("./style/assets/global/plugins/jquery-minicolors/jquery.minicolors.min.js");
//# sourceMappingURL=vendor.js.map