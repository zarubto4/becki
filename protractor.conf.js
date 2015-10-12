/**
 * A configuration file used by Protractor.
 */
/*eslint-env node*/
/*jshint node: true*/
/*jslint node: true*/

exports.config = {
  framework: 'jasmine2',
  specs: ['spec/**/*_spec.js'],
  // see https://github.com/angular/protractor/blob/645133d557f1059d9e885f2566fc4c29ce7c19cc/spec/angular2Conf.js
  useAllAngular2AppRoots: true
};
