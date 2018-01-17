/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var fs_1 = require("fs");
var moment = require("moment");
var chalk = require("chalk");
var request = require('sync-request');
/* tslint:disable:no-console max-line-length */
program
    .version('0.0.1')
    .option('-i, --input [input]', 'Input Swagger file or url  (default: http://127.0.0.1:3000/api-docs)', 'http://127.0.0.1:3000/api-docs')
    .option('-o, --output [output]', 'Output TypeScript file (default: ' + __dirname + '/../src/app/backend/HomerAPI.ts)', __dirname + '/../src/app/backend/HomerAPI.ts')
    .option('-c, --className [className]', 'Output TypeScript class name (default: HomerAPI)', 'HomerAPI')
    .option('-p, --prefixInterfaces [prefixInterfaces]', 'Prefix for all TypeScript interfaces (default: I)', 'I')
    .option('-d, --debug', 'More output informations')
    .parse(process.argv);
if (!program['input']) {
    console.log(chalk.red('Missing input parameter'));
    process.exit();
}
if (!program['output']) {
    console.log(chalk.red('Missing output parameter'));
    process.exit();
}
if (!program['className']) {
    console.log(chalk.red('Missing className parameter'));
    process.exit();
}
var DEBUG = false;
if (program['debug'] === true) {
    DEBUG = true;
}
// CONFIG
var CONFIG = {
    definitionsRefPrefix: '#/definitions/',
    ignoredDefinitions: ['EntityBean', 'EntityBeanIntercept', 'ValuePair'],
    methodsReplace: {
        // "" for ignore
        // like 'get:/websocket/becki/{secure_token}': '',
        // normal replaces
        'post:/login': '__login',
        'post:/logout': '__logout',
    },
    methodsOkCodes: [200, 201, 202],
};
var throwError = function (msg) {
    console.log(chalk.red(msg + ''));
    process.exit();
};
var argInput = program['input'];
var argOutput = program['output'];
var className = program['className'];
var prefixInterfaces = program['prefixInterfaces'] || '';
var swaggerFile = null;
if (argInput.toLocaleLowerCase().indexOf('http') === 0) {
    console.log(chalk.magenta('Going download file ' + argInput + ''));
    try {
        var res = request('GET', argInput);
        swaggerFile = res.getBody();
    }
    catch (e) {
        throwError('Cannot download Swagger JSON from URL ' + argInput + ' (error: ' + e.toString() + ')');
    }
}
else {
    console.log(chalk.magenta('Going open file ' + argInput + ''));
    try {
        swaggerFile = fs_1.readFileSync(argInput, { encoding: 'utf8' });
    }
    catch (e) {
        throwError('Cannot open Swagger JSON file from ' + argInput + ' (error: ' + e.toString() + ')');
    }
}
var swaggerObject = JSON.parse(swaggerFile);
// FILE methods:
var outFileContent = '';
var fileWriteLine = function (line) {
    if (line === void 0) { line = ''; }
    outFileContent += line + '\n';
};
// HEAD:
var version = swaggerObject['info']['version'];
fileWriteLine('/**************************************************************/');
fileWriteLine('/*                                                            */');
fileWriteLine('/*   Generated Homer API backend file                        */');
fileWriteLine('/*   © 2015-2016 Becki Authors.                               */');
fileWriteLine('/*                                                            */');
fileWriteLine('/*   Build date: ' + moment().format('YYYY-MM-DD HH:mm:ss') + '                          */');
fileWriteLine('/*   Homer  version: ' + version + '                                         */'.substr(version.length));
fileWriteLine('/*                                                            */');
fileWriteLine('/*   Generated by automated script from Swagger JSON.         */');
fileWriteLine('/*   Script author: Byzance          */');
fileWriteLine('/*                                                            */');
fileWriteLine('/**************************************************************/');
fileWriteLine();
fileWriteLine('/* tslint:disable */');
fileWriteLine();
fileWriteLine();
// DEFINITIONS:
var validateDefName = function (name) {
    var defNameValidated = name.replace(/[ ]/g, '_'); // replaces spaces
    defNameValidated = defNameValidated.replace(/'/g, ''); // replaces special char
    if (defNameValidated === 'boolean') {
        return defNameValidated;
    }
    var out = '';
    var parts = defNameValidated.split('_');
    parts.forEach(function (part) {
        out += part.substr(0, 1).toLocaleUpperCase() + part.substr(1);
    });
    return prefixInterfaces + out;
};
var solveType = function (prop) {
    var type = prop['type'];
    // basic types:
    switch (type) {
        case 'string':
        case 'boolean':
        case 'number':
            break;
        case 'integer':
            type = 'number';
            break;
        case 'array':
            type = null;
            if (prop['items']) {
                type = solveType(prop['items']);
                if (type) {
                    type += '[]';
                }
            }
            break;
        default:
            type = null;
            break;
    }
    // ref types:
    if (!type) {
        if (prop['$ref']) {
            var ref = prop['$ref'];
            if (ref.indexOf(CONFIG.definitionsRefPrefix) === 0) {
                type = validateDefName(ref.substr(CONFIG.definitionsRefPrefix.length));
            }
        }
    }
    if (!type) {
        if (prop['schema']) {
            type = solveType(prop['schema']);
        }
    }
    if (prop['enum'] && type === 'string') {
        type = '(\"' + prop['enum'].join('\"|\"') + '\")';
    }
    return type;
};
var definitions = swaggerObject['definitions'];
var definitionsKeys = [];
var usedDefs = {};
for (var defName in definitions) {
    if (!definitions.hasOwnProperty(defName)) {
        continue;
    }
    var defNameValidated = validateDefName(defName);
    if (definitionsKeys.indexOf(defName) > -1) {
        throwError('Duplicate definition name (' + defName + ')');
    }
    if (usedDefs[defNameValidated]) {
        throwError('Duplicate validated definition name (' + defNameValidated + ')');
    }
    if (CONFIG.ignoredDefinitions.indexOf(defName) > -1) {
        console.log(chalk.yellow('Ignore definition \"' + defName + '\" because config.'));
        continue;
    }
    definitionsKeys.push(defName);
    usedDefs[defNameValidated] = {};
}
definitionsKeys.sort();
definitionsKeys.forEach(function (defName) {
    console.log(chalk.green('Generate interface for definition \"' + defName + '\".'));
    var def = definitions[defName];
    if (def['type'] !== 'object') {
        throwError('Unknown type of definition (' + def['type'] + ')');
    }
    var defNameValidated = validateDefName(defName);
    var desc = 'Interface ' + defNameValidated + ' definition';
    if (def['description']) {
        desc = def['description'];
    }
    fileWriteLine('/**');
    fileWriteLine(' * @name ' + defNameValidated);
    if (desc) {
        fileWriteLine(' * @description: ' + desc.split('\n').join('\n     *    '));
    }
    fileWriteLine(' */');
    fileWriteLine('export interface ' + defNameValidated + ' {');
    var propsRequired = def['required'] || [];
    var props = def['properties'];
    if (props) {
        var propKeys = Object.keys(props);
        propKeys.sort();
        propKeys.forEach(function (propKey) {
            var prop = props[propKey];
            var required = (propsRequired.indexOf(propKey) > -1) ? '' : '?';
            // TODO: check if this is okay!
            if (prop['readOnly'] === true) {
                required = '';
            }
            var type = solveType(prop);
            if (!type) {
                throwError('Missing type for key ' + propKey + ' in definition (' + defName + ')');
            }
            if (!propKey.match(/^([a-z0-9_])+$/g)) {
                console.log(chalk.yellow('Something is wrong with property name \"' + propKey + '\" of definition \"' + defName + '\" .. property name don\'t contain only a-z 0-9 and _ characters.'));
            }
            fileWriteLine('    /**');
            fileWriteLine('     * @name ' + propKey);
            fileWriteLine('     * @type ' + type);
            if (prop['description']) {
                fileWriteLine('     * @description ' + prop['description'].split('\n').join('\n     *    '));
            }
            if (prop['example']) {
                fileWriteLine('     * @example ' + prop['example']);
            }
            if (prop['format']) {
                fileWriteLine('     * @format ' + prop['format']);
            }
            if (prop['default']) {
                fileWriteLine('     * @default ' + prop['default']);
            }
            if (prop['readOnly'] === true) {
                fileWriteLine('     * @readonly');
            }
            if (required === '') {
                fileWriteLine('     * @required');
            }
            fileWriteLine('     */');
            fileWriteLine('    ' + propKey + required + ': ' + type + ';');
        });
    }
    else {
        console.log(chalk.yellow('Missing properties in definition (' + defName + ')'));
    }
    fileWriteLine('}');
    fileWriteLine();
    fileWriteLine();
});
fileWriteLine();
fileWriteLine();
// Methods:
var makeReadableMethodName = function (method, url, pathObj) {
    method = method.toLocaleLowerCase();
    if (CONFIG.methodsReplace[method + ':' + url]) {
        return CONFIG.methodsReplace[method + ':' + url];
    }
    if (CONFIG.methodsReplace[method + ':' + url] === '') {
        return null;
    }
    var prefix = '';
    console.log('method:: ', url);
    console.log('method:: ', pathObj);
    console.log('method:: ', method);
    var partsAll = pathObj['summary'].replace(/{[a-zA-Z0-9_-]+}/g, '').split(/[ \/,]/);
    var parts = partsAll.filter(function (value, index, self) { return self.indexOf(value) === index; }); // unique
    console.log('parts:', parts);
    var out = prefix;
    var first_prefix = null;
    var second_prefix = null;
    // All Parters first letter to upperCase
    parts.forEach(function (part) {
        if (part !== '') {
            /* tslint:disable:quotemark */
            part = part.replace(/'/g, '');
            part = part.replace("'", '');
            part = part.replace("_", '');
            part = part.replace("_", '');
            part = part.replace("_", '');
            part = part.replace(")", '');
            part = part.replace("(", '');
            part = part.replace("[", '');
            part = part.replace("]", '');
            part = part.replace("-", '');
            part = part.replace(":", '');
            part = part.replace(".", '');
            part = part.replace(",", '');
            part = part.replace('\/', '');
            part = part.replace('\\', '');
            part = part.replace('>', '');
            part = part.replace('<', '');
            part = part.replace('=', '');
            part = part.replace('&', 'And');
            /* tslint:enable:quotemark */
            part = part.substr(0, 1).toLocaleUpperCase() + part.substr(1);
            if (part.length !== 0) {
                if (first_prefix === null) {
                    first_prefix = part;
                    return;
                }
                if (second_prefix === null) {
                    second_prefix = part;
                    return;
                }
                out += part;
            }
        }
    });
    if (first_prefix === null || second_prefix === null) {
        throwError('Missing fist or second Parameter');
    }
    // But first part to lowecase
    out = second_prefix + first_prefix + out;
    out = out.substr(0, 1).toLocaleLowerCase() + out.substr(1);
    if (DEBUG) {
        console.log(url);
        console.log(chalk.gray(parts.toString()));
    }
    return out;
};
var paths = swaggerObject['paths'];
var methodsParams = {};
var methodsNames = [];
for (var pathUrl in paths) {
    if (!paths.hasOwnProperty(pathUrl)) {
        continue;
    }
    for (var pathMethod in paths[pathUrl]) {
        if (!paths[pathUrl].hasOwnProperty(pathMethod)) {
            continue;
        }
        var path = paths[pathUrl][pathMethod];
        if (DEBUG) {
            console.log();
            console.log(path['description']);
        }
        var m = makeReadableMethodName(pathMethod, pathUrl, path);
        if (!m) {
            console.log(chalk.yellow('Skip generation method for endpoint ' + pathMethod + ':' + pathUrl));
            continue;
        }
        if (methodsParams[m]) {
            throwError('Duplicate name of method \"' + m + '\" (' + pathMethod + ':' + pathUrl + ')');
        }
        else {
            console.log(chalk.green('Adding method \"' + m + '\" to list.', ' path Method:: (' + pathMethod + ':' + pathUrl + ')'));
            methodsParams[m] = {
                pathUrl: pathUrl,
                pathMethod: pathMethod,
            };
            methodsNames.push(m);
        }
    }
}
methodsNames.sort();
fileWriteLine('export abstract class ' + className + ' {');
fileWriteLine();
fileWriteLine('    protected abstract requestRestPath<T>(method:string, path:string, body:Object, success:number[]):Promise<T>;');
fileWriteLine();
methodsNames.forEach(function (methodName) {
    var pathUrl = methodsParams[methodName]['pathUrl'];
    var pathMethod = methodsParams[methodName]['pathMethod'];
    var pathInfo = paths[pathUrl][pathMethod];
    console.log(chalk.green('Generating method \"' + methodName + '\" (' + pathMethod + ':' + pathUrl + ')'));
    var outParameters = [];
    var outParametersComment = [];
    var bodyParams = [];
    var queryParameters = [];
    var params = pathInfo['parameters'];
    var encodeQueries = [];
    if (params) {
        params.forEach(function (param) {
            if (param['in'] === 'path') {
                var type = solveType(param);
                if (!type) {
                    throwError('Missing type for key ' + param['name'] + ' in method (' + methodName + ')');
                }
                var req = (param['required'] === true) ? '' : '?';
                outParameters.push(param['name'] + req + ':' + type);
                outParametersComment.push('@param {' + type + '} ' + param['name'] + (param['description'] ? ' - ' + param['description'] : ''));
            }
        });
        params.forEach(function (param) {
            if (param['in'] === 'query') {
                var type = solveType(param);
                if (!type) {
                    throwError('Missing type for key ' + param['name'] + ' in method (' + methodName + ')');
                }
                encodeQueries.push('        ' + param['name'] + ' = encodeURIComponent(' + param['name'] + ');');
                outParameters.push(param['name'] + ':' + type);
                outParametersComment.push('@param {' + type + '} ' + param['name'] + (param['description'] ? ' - ' + param['description'] : ''));
                queryParameters.push(param['name'] + '=${' + param['name'] + '}');
            }
        });
        params.forEach(function (param) {
            if (param['in'] === 'body') {
                var type = solveType(param);
                if (!type) {
                    throwError('Missing type for key ' + param['name'] + ' in method (' + methodName + ')');
                }
                var req = (param['required'] === true) ? '' : '?';
                outParameters.push(param['name'] + req + ':' + type);
                bodyParams.push(param['name']);
                outParametersComment.push('@param {' + type + '} ' + param['name'] + (param['description'] ? ' - ' + param['description'] : ''));
            }
        });
    }
    if (bodyParams.length > 1) {
        throwError('More than 1 body method (' + methodName + ')');
    }
    var body = '{}';
    if (bodyParams.length === 1) {
        body = bodyParams[0];
    }
    var pathUrlVariables = pathUrl.replace(/\{/g, '${');
    var okResponses = [];
    var errorResponses = [];
    var responses = pathInfo['responses'];
    if (responses) {
        for (var code in responses) {
            if (!responses.hasOwnProperty(code)) {
                continue;
            }
            var codeInt = parseInt(code, 10);
            var response = responses[code];
            var type = solveType(response);
            if (!type && codeInt !== 500) {
                console.log(chalk.yellow('Missing type for reponse code ' + code + ' in method (' + methodName + ')'));
            }
            var description = response['description'];
            var res = {
                code: codeInt,
                type: type,
                description: description
            };
            if (DEBUG) {
                console.log('Found response: ' + JSON.stringify(res));
            }
            if (CONFIG.methodsOkCodes.indexOf(codeInt) > -1) {
                okResponses.push(res);
            }
            else {
                errorResponses.push(res);
            }
        }
    }
    var returnTypes = ['any'];
    var returnCodes = [200];
    var returnDescriptions = [];
    if (okResponses.length > 0) {
        returnTypes = [];
        returnCodes = [];
        okResponses.forEach(function (okRes) {
            if (okRes.type) {
                returnTypes.push(okRes.type);
            }
            if (okRes.description) {
                returnDescriptions.push(okRes.description);
            }
            returnCodes.push(okRes.code);
        });
    }
    else {
        console.log(chalk.yellow('Missing ok response in method (' + methodName + ')'));
    }
    if (returnTypes.length === 0) {
        returnTypes.push('any');
    }
    fileWriteLine('    /**');
    fileWriteLine('     * @name ' + methodName);
    if (pathInfo['summary']) {
        fileWriteLine('     * @summary ' + pathInfo['summary']);
    }
    if (pathInfo['operationId']) {
        fileWriteLine('     * @operationId ' + pathInfo['operationId']);
    }
    if (pathInfo['tags']) {
        fileWriteLine('     * @tags ' + pathInfo['tags'].join(', '));
    }
    if (pathInfo['description']) {
        fileWriteLine('     *');
        fileWriteLine('     * @description ' + pathInfo['description'].split('\n').join('\n     *    '));
    }
    fileWriteLine('     *');
    if (outParametersComment.length) {
        fileWriteLine('     * ' + outParametersComment.join('\n     * '));
    }
    fileWriteLine('     *');
    fileWriteLine('     * @returns {' + returnTypes.join('|') + '} [code ' + returnCodes.join('|') + '] ' + returnDescriptions.join('|'));
    fileWriteLine('     *');
    errorResponses.forEach(function (errorRes) {
        fileWriteLine('     * @throws ' + (errorRes.type ? '{' + errorRes.type + '} ' : '') + '[code ' + errorRes.code + ']' + (errorRes.description ? ' ' + errorRes.description : ''));
    });
    fileWriteLine('     */');
    fileWriteLine('    public ' + methodName + '(' + outParameters.join(', ') + '):Promise<' + returnTypes.join('|') + '> {');
    if (encodeQueries.length) {
        fileWriteLine(encodeQueries.join('\n'));
    }
    fileWriteLine('        return this.requestRestPath(\"' + pathMethod.toLocaleUpperCase() + '\", `' + pathUrlVariables + (queryParameters.length ? '?' + queryParameters.join('&') : '') + '`, ' + body + ', [' + returnCodes.join(',') + ']);');
    fileWriteLine('    }');
    fileWriteLine();
});
fileWriteLine('}');
console.log(chalk.yellow('Go to write out file.'));
fs_1.writeFileSync(argOutput, outFileContent, { encoding: 'utf8' });
console.log();
console.log(chalk.magenta('██████╗  ██████╗ ███╗   ██╗███████╗██╗'));
console.log(chalk.magenta('██╔══██╗██╔═══██╗████╗  ██║██╔════╝██║'));
console.log(chalk.magenta('██║  ██║██║   ██║██╔██╗ ██║█████╗  ██║'));
console.log(chalk.magenta('██║  ██║██║   ██║██║╚██╗██║██╔══╝  ╚═╝'));
console.log(chalk.magenta('██████╔╝╚██████╔╝██║ ╚████║███████╗██╗'));
console.log(chalk.magenta('╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝'));
console.log();
/* tslint:enable */
