# Becki

Becki is a front end of the IoT connectivity solution developed by Byzance.

It integrates all the back end services and provides a nice portable interface
for users as well as for administrators.

## License

For the time being, we retain all rights. That means that you are not allowed to
distribute, reproduce or modify this project.

## Requirements

In order to serve the front end through HTTP, an HTTP server is required because
current web browsers implement a variety of safety measures that may prevent the
front end from functioning if accessed otherwise. Server-side dependencies can
be installed using [npm][]. Install it and see the installation instructions
below.

On the other side, clients must support [HTML5][], a JavaScript based on
[ECMAScript 5][] and [Web Storage 2][].

And on top of that an instance of the back end has to be
available at same address as you have in browser and port 9000.

## Installation

* `npm instal` to install all dependencies needed for develop

## Commands

* `npm start` (or `npm run start` or `npm run server`) to start *webpack-dev-server*
  and auto recompile the sources into JavaScript and to start an HTTP server
  that serves the application at <http://localhost:8080>

* `npm run lint` to start linter

* `npm run docs` to generate documentation into *doc* folder

* `npm run generator` to start generator for TyrionAPI.ts file from currently running Tyrion

* `npm run build` to start *webpack* and create build of Becki into *dist* folder

* `npm run watch` to start *webpack* and create build of Becki into *dist* folder and watch changes

* `npm run clean` to clean all not-source-code directories *node_modules*, *doc*, *dist* and clean npm cache

* `npm run clean-install` to run clean and after `npm install`



[ecmascript 5]: http://www.ecma-international.org/publications/files/ECMA-ST-ARCH/ECMA-262%205th%20edition%20December%202009.pdf
[html5]: http://www.w3.org/TR/2014/REC-html5-20141028/
[npm]: http://www.npmjs.com/
[web storage 2]: http://www.w3.org/TR/2015/PR-webstorage-20151126/

