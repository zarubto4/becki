/**
 * Created by davidhradek on 07.09.16.
 */

/// <reference path="../typings/index.d.ts" />

import * as program from "commander";
import {readFileSync, writeFileSync} from "fs";
import * as moment from "moment";
import * as chalk from "chalk";

var request = require('sync-request');

program
    .version('0.0.1')
    .option('-i, --input [input]', 'Input Swagger file or url (default: http://127.0.0.1:9000/api-docs)', "http://127.0.0.1:9000/api-docs")
    .option('-o, --output [output]', 'Output TypeScript file (default: ../app/backend/TyrionAPI.ts)', "../app/backend/TyrionAPI.ts")
    .option('-c, --className [className]', 'Output TypeScript class name (default: TyrionAPI)', "TyrionAPI")
    .option('-p, --prefixInterfaces [prefixInterfaces]', 'Prefix for all TypeScript interfaces (default: I)', "I")
    .option('-d, --debug', 'More output informations')
    .parse(process.argv);

if (!program["input"]) {
    console.log(chalk.red('Missing input parameter'));
    process.exit();
}
if (!program["output"]) {
    console.log(chalk.red('Missing output parameter'));
    process.exit();
}
if (!program["className"]) {
    console.log(chalk.red('Missing className parameter'));
    process.exit();
}

var DEBUG = false;
if (program["debug"] == true) {
    DEBUG = true;
}

// CONFIG

var CONFIG = {
    definitionsRefPrefix: "#/definitions/",
    ignoredDefinitions: [],
    methodsReplace: {
        // "" for ignore
        "get:/test1": "",
        "get:/websocket/becki/{secure_token}": "",
        "get:/websocket/blocko_server/{identificator}": "",
        "get:/websocket/compilation_server/{identificator}": "",
        "get:/websocket/mobile/{m_project_id}/{mac_adress}": "",
        "put:/websocket/terminal/identificator": "",
        "put:/websocket/terminal/identificator/{terminal_id}": "",
        "post:/notification/test/{mail}": "",
        // normal replaces
        "post:/c_program/version/compile": "compileCProgram",
        "put:/c_program/version/compile/{version_id}": "compileCProgramVersion",
        "post:/login": "__login",
        "post:/logout": "__logout",
        "get:/file/listOfFiles/{version_id}": "getLibraryGroupVersionLibraries",
        "get:/grid/m_program/app/m_programs": "getAllMPrograms",
        "get:/grid/m_project/person": "getAllMProjects",
        "get:/login/facebook": "__loginFacebook",
        "get:/login/github": "__loginGitHub",
        "get:/login/person": "getLoggedInPerson",
        "put:/notification/confirm/{notification_id}": "confirmNotification",
        "put:/notification/read": "markNotificationRead",
        "get:/notification/unconfirmed": "getAllUnconfirmedNotifications",
        "put:/overflow/typeOfConfirm/{post_id}/{type_of_confirm_id}": "setOverflowTypeOfConfirm",
        "delete:/overflow/typeOfConfirm/{post_id}/{type_of_confirm_id}": "unsetOverflowTypeOfConfirm",
        "put:/overflow/hashTag/{post_id}/{hashTag}": "setOverflowHashTag",
        "delete:/overflow/hashTag/{post_id}/{hashTag}": "unsetOverflowHashTag",
        "put:/overflow/likeMinus/{post_id}": "touchOverflowLikeMinus",
        "put:/overflow/likePlus/{post_id}": "touchOverflowLikePlus",
        "put:/b_program/version/{b_program_id}": "createBProgramVersion",
        "put:/instance/uploadToCloud/{version_id}": "cloudInstanceUpload",
        "put:/instance/shut_down/{instance_name}": "cloudInstanceShutDown",
        "put:/b_program/uploadToHomer/{b_program_id}/{version_id}/{homer_id}": "uploadBProgramToHomer",
        "put:/project/addParticipant/{invitation_id}/{decision}": "addProjectParticipant",
        "put:/project/shareProject/{project_id}": "shareProject",
        "put:/project/unshareProject/{project_id}": "unshareProject",
        "get:/websocket/access_token": "getWebsocketAccessToken",
        "put:/product/activate/{product_id}": "productActivate",
        "put:/product/deactivate/{product_id}": "productDeactivate",
        "put:/invoice/send_remainder/{invoice_id}": "sendInvoiceRemainder",
        "get:/instance/project/{project_id}": "getAllInstancesForProject",
    },
    methodsIgnoreParts: ["coreClient", "compilation", "grid", "get", "filter", "list", "deactivateBoard", "create", "edit", "upload", "update", "all", "validate", "recovery", "connect", "disconnect"],
    methodsOkCodes: [200, 201],
};

var throwError = (msg) => {
    console.log(chalk.red(msg + ""));
    process.exit();
};

var argInput = program["input"];
var argOutput = program["output"];
var className = program["className"];

var prefixInterfaces = program["prefixInterfaces"] || "";

var swaggerFile = null;
if (argInput.toLocaleLowerCase().indexOf("http") == 0) {

    console.log(chalk.magenta("Going download file " + argInput + ""));

    try {
        var res = request("GET", argInput);
        swaggerFile = res.getBody();
    } catch (e) {
        throwError("Cannot download Swagger JSON from URL " + argInput + " (error: " + e.toString() + ")");
    }

} else {
    console.log(chalk.magenta("Going open file " + argInput + ""));

    try {
        swaggerFile = readFileSync(argInput, {encoding: "utf8"});
    } catch (e) {
        throwError("Cannot open Swagger JSON file from " + argInput + " (error: " + e.toString() + ")");
    }
}


var swaggerObject = JSON.parse(swaggerFile);


// FILE methods:
var outFileContent = "";

var fileWriteLine = (line = "") => {
    outFileContent += line + "\n";
};

// HEAD:

var version = swaggerObject["info"]["version"];

fileWriteLine("/**************************************************************/");
fileWriteLine("/*                                                            */");
fileWriteLine("/*   Generated Tyrion API backend file                        */");
fileWriteLine("/*   © 2015-2016 Becki Authors.                               */");
fileWriteLine("/*                                                            */");
fileWriteLine("/*   Build date: " + moment().format("YYYY-MM-DD HH:mm:ss") + "                          */");
fileWriteLine("/*   Tyrion version: " + version + "                                         */".substr(version.length));
fileWriteLine("/*                                                            */");
fileWriteLine("/*   Generated by automated script from Swagger JSON.         */");
fileWriteLine("/*   Script author: David Hrádek (david@hradyho.net)          */");
fileWriteLine("/*                                                            */");
fileWriteLine("/**************************************************************/");

fileWriteLine();
fileWriteLine();

// DEFINITIONS:

var validateDefName = (name) => {
    var defNameValidated = name.replace(/[ ]/g, "_"); // replaces spaces
    if (defNameValidated == "boolean") return defNameValidated;

    var out = "";
    var parts = defNameValidated.split("_");
    parts.forEach((part) => {
        out += part.substr(0, 1).toLocaleUpperCase() + part.substr(1);
    });

    return prefixInterfaces + out;
};

var solveType = (prop: any): string => {

    var type = prop["type"];
    // basic types:
    switch (type) {
        case "string":
        case "boolean":
        case "number":
            break;
        case "integer":
            type = "number";
            break;
        case "array":

            type = null;
            if (prop["items"]) {
                type = solveType(prop["items"]);
                if (type) {
                    type += "[]";
                }
            }

            break;
        default:
            type = null;
            break;
    }

    // ref types:
    if (!type) {
        if (prop["$ref"]) {
            var ref = prop["$ref"];
            if (ref.indexOf(CONFIG.definitionsRefPrefix) == 0) {
                type = validateDefName(ref.substr(CONFIG.definitionsRefPrefix.length));
            }
        }
    }
    if (!type) {
        if (prop["schema"]) {
            type = solveType(prop["schema"]);
        }
    }

    if (prop["enum"] && type == "string") {
        type = "(\"" + prop["enum"].join("\"|\"") + "\")";
    }
    return type
};

var definitions = swaggerObject["definitions"];

var definitionsKeys = [];
var usedDefs = {};

for (var defName in definitions) {
    if (!definitions.hasOwnProperty(defName)) continue;

    var defNameValidated = validateDefName(defName);

    if (definitionsKeys.indexOf(defName) > -1) throwError("Duplicate definition name (" + defName + ")");
    if (usedDefs[defNameValidated]) throwError("Duplicate validated definition name (" + defNameValidated + ")");

    if (CONFIG.ignoredDefinitions.indexOf(defName) > -1) {
        console.log(chalk.yellow("Ignore definition \"" + defName + "\" because config."));
        continue;
    }

    definitionsKeys.push(defName);
    usedDefs[defNameValidated] = {};
}

definitionsKeys.sort();

definitionsKeys.forEach((defName) => {

    console.log(chalk.green("Generate interface for definition \"" + defName + "\"."));

    var def = definitions[defName];
    if (def["type"] != "object") throwError("Unknown type of definition (" + def["type"] + ")");

    var defNameValidated = validateDefName(defName);


    var desc = "Interface " + defNameValidated + " definition";
    if (def["description"]) desc = def["description"];

    fileWriteLine("/**");
    fileWriteLine(" * @name " + defNameValidated);
    if (desc) {
        fileWriteLine(" * @description: " + desc.split("\n").join("\n     *    "));
    }
    fileWriteLine(" */");

    fileWriteLine("export interface " + defNameValidated + " {");

    var propsRequired = def["required"] || [];

    var props = def["properties"];

    if (props) {

        var propKeys = Object.keys(props);

        propKeys.sort();

        propKeys.forEach((propKey) => {

            var prop = props[propKey];
            var required = (propsRequired.indexOf(propKey) > -1) ? "" : "?";

            //TODO: check if this is okay!
            if (prop["readOnly"] == true) {
                required = "";
            }

            var type = solveType(prop);

            if (!type) {
                throwError("Missing type for key " + propKey + " in definition (" + defName + ")");
            }

            if (!propKey.match(/^([a-z0-9_])+$/g)) {
                console.log(chalk.yellow("Something is wrong with property name \"" + propKey + "\" of definition \"" + defName + "\" .. property name don't contain only a-z 0-9 and _ characters."));
            }

            fileWriteLine("    /**");
            fileWriteLine("     * @name " + propKey);
            fileWriteLine("     * @type " + type);
            if (prop["description"])        fileWriteLine("     * @description " + prop["description"].split("\n").join("\n     *    "));
            if (prop["example"])            fileWriteLine("     * @example " + prop["example"]);
            if (prop["format"])             fileWriteLine("     * @format " + prop["format"]);
            if (prop["default"])            fileWriteLine("     * @default " + prop["default"]);
            if (prop["readOnly"] == true)   fileWriteLine("     * @readonly");
            if (required == "")             fileWriteLine("     * @required");
            fileWriteLine("     */");

            fileWriteLine("    " + propKey + required + ": " + type + ";")

        });

    } else {
        console.log(chalk.yellow("Missing properties in definition (" + defName + ")"));
    }

    fileWriteLine("}");

    fileWriteLine();
    fileWriteLine();

});

fileWriteLine();
fileWriteLine();

// Methods:

var makeReadableMethodName = (method: string, url: string, pathObj: string) => {

    method = method.toLocaleLowerCase();

    if (CONFIG.methodsReplace[method + ":" + url]) {
        return CONFIG.methodsReplace[method + ":" + url];
    }

    if (CONFIG.methodsReplace[method + ":" + url] == "") {
        return null;
    }

    var prefix = "";

    switch (method) {
        case "post":
            if (pathObj["summary"] && pathObj["summary"].toLocaleLowerCase().trim().indexOf("update") == 0) {
                prefix = "edit";
            } else if (pathObj["operationId"] && pathObj["operationId"].toLocaleLowerCase().trim().indexOf("update") == 0) {
                prefix = "edit";
            } else {
                prefix = "create";
            }
            break;
        case "put":
            if (pathObj["summary"] && pathObj["summary"].toLocaleLowerCase().trim().indexOf("update") == 0) {
                prefix = "edit";
            } else if (pathObj["operationId"] && pathObj["operationId"].toLocaleLowerCase().trim().indexOf("update") == 0) {
                prefix = "edit";
            } else if (pathObj["summary"] && pathObj["summary"].toLocaleLowerCase().trim().indexOf("edit") == 0) {
                prefix = "edit";
            } else if (pathObj["operationId"] && pathObj["operationId"].toLocaleLowerCase().trim().indexOf("edit") == 0) {
                prefix = "edit";
            } else if (pathObj["summary"] && pathObj["summary"].toLocaleLowerCase().trim().indexOf("connect") == 0) {
                prefix = "connect";
            } else if (pathObj["operationId"] && pathObj["operationId"].toLocaleLowerCase().trim().indexOf("connect") == 0) {
                prefix = "connect";
            } else if (pathObj["summary"] && pathObj["summary"].toLocaleLowerCase().trim().indexOf("disconnect") == 0) {
                prefix = "disconnect";
            } else if (pathObj["operationId"] && pathObj["operationId"].toLocaleLowerCase().trim().indexOf("disconnect") == 0) {
                prefix = "disconnect";
            } else {
                prefix = "put";
            }
            break;
        case "delete":
            if (pathObj["summary"] && pathObj["summary"].toLocaleLowerCase().trim().indexOf("disconnect") == 0) {
                prefix = "disconnect";
            } else if (pathObj["operationId"] && pathObj["operationId"].toLocaleLowerCase().trim().indexOf("disconnect") == 0) {
                prefix = "disconnect";
            } else {
                prefix = "delete";
            }
            break;
        default:
            prefix = method;
            break;
    }

    var urlNoParams = url.replace(/{[a-zA-Z0-9_-]+}/g, "");

    urlNoParams = urlNoParams.replace("compilation/server", "compilationServer"); // fixes only Server because removing compilation word
    urlNoParams = urlNoParams.replace("/project/b_program", "/b_program");
    urlNoParams = urlNoParams.replace("/project/blocko", "/blocko");
    urlNoParams = urlNoParams.replace("/project/board", "/board");
    urlNoParams = urlNoParams.replace("/project/homer", "/homer");
    urlNoParams = urlNoParams.replace("/project/typeOfBlock", "/typeOfBlock");

    var partsAll = urlNoParams.split(/[ \/,_]/);

    var parts = partsAll.filter((value, index, self) => self.indexOf(value) === index); // unique

    if (parts.indexOf("filter") > 0) {
        prefix = "list";
    }

    if (parts.indexOf("list") > 0) {
        prefix = "list";
    }

    if (parts.indexOf("upload") > 0) {
        prefix = "upload";
    }

    if (parts.indexOf("validate") > 0) {
        prefix = "validate";
    }

    if (parts.indexOf("recovery") > 0) {
        prefix = "recovery";
    }

    if (prefix == "get") {
        if (url.substr(url.length - 1) != "}") {
            prefix = "getAll";
        }
        if (parts.indexOf("all") > 0) {
            prefix = "getAll";
        }
    }


    var out = prefix;

    parts.forEach((part) => {
        if (CONFIG.methodsIgnoreParts.indexOf(part) > -1) return;
        if (part != "") {
            out += part.substr(0, 1).toLocaleUpperCase() + part.substr(1);
        }
    });

    if (prefix == "getAll" || prefix == "list") { // add množné číslo
        var lastchar = out.substr(out.length - 1);
        if (lastchar != "s") {
            var lasttwochar = out.substr(out.length - 2);
            if (lastchar == "y") {
                out = out.substr(0, out.length - 1) + "i";
            }
            if (lastchar == "y" || /*lastchar == "s" ||*/ lastchar == "x" || lasttwochar == "sh" || lasttwochar == "ch") {
                out += "es";
            } else {
                out += "s";
            }
        }
    }

    if (DEBUG) {
        console.log(url);
        console.log(chalk.gray(parts.toString()));
    }

    return out;
};

var paths = swaggerObject["paths"];

var methodsParams = {};
var methodsNames = [];

for (var pathUrl in paths) {
    if (!paths.hasOwnProperty(pathUrl)) continue;

    for (var pathMethod in paths[pathUrl]) {
        if (!paths[pathUrl].hasOwnProperty(pathMethod)) continue;

        var path = paths[pathUrl][pathMethod];

        if (DEBUG) {
            console.log();
            console.log(path["description"]);
        }
        var m = makeReadableMethodName(pathMethod, pathUrl, path);

        if (!m) {
            console.log(chalk.yellow("Skip generation method for endpoint " + pathMethod + ":" + pathUrl));
            continue;
        }

        if (methodsParams[m]) {
            throwError("Duplicate name of method \"" + m + "\" (" + pathMethod + ":" + pathUrl + ")");
        } else {
            console.log(chalk.green("Adding method \"" + m + "\" to list."));
            methodsParams[m] = {
                pathUrl: pathUrl,
                pathMethod: pathMethod,
            };
            methodsNames.push(m);
        }

    }

}

methodsNames.sort();

fileWriteLine("export abstract class " + className + " {");
fileWriteLine();
fileWriteLine("    protected abstract requestRestPath<T>(method:string, path:string, body:Object, success:number[]):Promise<T>;");
fileWriteLine();

methodsNames.forEach((methodName) => {

    var pathUrl = methodsParams[methodName]["pathUrl"];
    var pathMethod = methodsParams[methodName]["pathMethod"];
    var pathInfo = paths[pathUrl][pathMethod];

    console.log(chalk.green("Generating method \"" + methodName + "\" (" + pathMethod + ":" + pathUrl + ")"));


    var outParameters = [];
    var outParametersComment = [];
    var bodyParams = [];

    var queryParameters = [];

    var params = pathInfo["parameters"];

    var encodeQueries = [];

    if (params) {
        params.forEach((param) => {
            if (param["in"] == "path") {

                var type = solveType(param);

                if (!type) {
                    throwError("Missing type for key " + param["name"] + " in method (" + methodName + ")");
                }

                var req = (param["required"] == true) ? "" : "?";

                outParameters.push(param["name"] + req + ":" + type);
                outParametersComment.push("@param {" + type + "} " + param["name"] + (param["description"] ? " - " + param["description"] : ""));
            }
        });
        params.forEach((param) => {
            if (param["in"] == "query") {

                var type = solveType(param);

                if (!type) {
                    throwError("Missing type for key " + param["name"] + " in method (" + methodName + ")");
                }

                encodeQueries.push("        " + param["name"] + " = encodeURIComponent(" + param["name"] + ");");

                outParameters.push(param["name"] + ":" + type);
                outParametersComment.push("@param {" + type + "} " + param["name"] + (param["description"] ? " - " + param["description"] : ""));

                queryParameters.push(param["name"] + "=${" + param["name"] + "}");

            }
        });
        params.forEach((param) => {
            if (param["in"] == "body") {

                var type = solveType(param);

                if (!type) {
                    throwError("Missing type for key " + param["name"] + " in method (" + methodName + ")");
                }

                var req = (param["required"] == true) ? "" : "?";

                outParameters.push(param["name"] + req + ":" + type);
                bodyParams.push(param["name"]);
                outParametersComment.push("@param {" + type + "} " + param["name"] + (param["description"] ? " - " + param["description"] : ""));
            }
        });
    }


    if (bodyParams.length > 1) {
        throwError("More than 1 body method (" + methodName + ")");
    }

    var body = "{}";
    if (bodyParams.length == 1) {
        body = bodyParams[0];
    }

    var pathUrlVariables = pathUrl.replace(/\{/g, "${");

    var okResponses = [];
    var errorResponses = [];

    var responses = pathInfo["responses"];
    if (responses) {
        for (var code in responses) {
            if (!responses.hasOwnProperty(code)) continue;

            var codeInt = parseInt(code);

            var response = responses[code];

            var type = solveType(response);

            if (!type && codeInt != 500) {
                console.log(chalk.yellow("Missing type for reponse code " + code + " in method (" + methodName + ")"));
            }

            var description = response["description"];

            var res = {
                code: codeInt,
                type: type,
                description: description
            };

            if (DEBUG) {
                console.log("Found response: " + JSON.stringify(res));
            }

            if (CONFIG.methodsOkCodes.indexOf(codeInt) > -1) {
                okResponses.push(res)
            } else {
                errorResponses.push(res);
            }

        }
    }

    var returnTypes = ["any"];
    var returnCodes = [200];
    var returnDescriptions = [];

    if (okResponses.length > 0) {
        returnTypes = [];
        returnCodes = [];

        okResponses.forEach((okRes) => {
            if (okRes.type) {
                returnTypes.push(okRes.type);
            }
            if (okRes.description) {
                returnDescriptions.push(okRes.description);
            }
            returnCodes.push(okRes.code);
        });

    } else {
        console.log(chalk.yellow("Missing ok response in method (" + methodName + ")"));
    }

    if (returnTypes.length == 0) returnTypes.push("any");

    fileWriteLine("    /**");
    fileWriteLine("     * @name " + methodName);
    if (pathInfo["summary"])        fileWriteLine("     * @summary " + pathInfo["summary"]);
    if (pathInfo["operationId"])    fileWriteLine("     * @operationId " + pathInfo["operationId"]);
    if (pathInfo["tags"])           fileWriteLine("     * @tags " + pathInfo["tags"].join(", "));
    if (pathInfo["description"]) {
        fileWriteLine("     *");
        fileWriteLine("     * @description " + pathInfo["description"].split("\n").join("\n     *    "));
    }
    fileWriteLine("     *");
    if (outParametersComment.length) fileWriteLine("     * " + outParametersComment.join("\n     * "));
    fileWriteLine("     *");
    fileWriteLine("     * @returns {" + returnTypes.join("|") + "} [code " + returnCodes.join("|") + "] " + returnDescriptions.join("|"));
    fileWriteLine("     *");
    errorResponses.forEach((errorRes) => {
        fileWriteLine("     * @throws " + (errorRes.type ? "{" + errorRes.type + "} " : "") + "[code " + errorRes.code + "]" + (errorRes.description ? " " + errorRes.description : ""));
    });
    fileWriteLine("     */");

    fileWriteLine("    public " + methodName + "(" + outParameters.join(", ") + "):Promise<" + returnTypes.join("|") + "> {");
    if (encodeQueries.length) {
        fileWriteLine(encodeQueries.join("\n"));
    }
    fileWriteLine("        return this.requestRestPath(\"" + pathMethod.toLocaleUpperCase() + "\", `" + pathUrlVariables + (queryParameters.length ? "?" + queryParameters.join("&") : "") + "`, " + body + ", [" + returnCodes.join(",") + "]);");
    fileWriteLine("    }");
    fileWriteLine();

});

fileWriteLine("}");


console.log(chalk.yellow('Go to write out file.'));
writeFileSync(argOutput, outFileContent, {encoding: "utf8"});
console.log();
console.log(chalk.magenta('██████╗  ██████╗ ███╗   ██╗███████╗██╗'));
console.log(chalk.magenta('██╔══██╗██╔═══██╗████╗  ██║██╔════╝██║'));
console.log(chalk.magenta('██║  ██║██║   ██║██╔██╗ ██║█████╗  ██║'));
console.log(chalk.magenta('██║  ██║██║   ██║██║╚██╗██║██╔══╝  ╚═╝'));
console.log(chalk.magenta('██████╔╝╚██████╔╝██║ ╚████║███████╗██╗'));
console.log(chalk.magenta('╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝'));
console.log();