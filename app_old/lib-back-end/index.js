/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
require("rxjs/add/observable/fromEvent");
require("rxjs/add/operator/filter");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toPromise");
var _ = require("underscore");
var Rx = require("rxjs");
var uuid = require("node-uuid");
function composeUserString(user, showEmail) {
    if (showEmail === void 0) { showEmail = false; }
    return user.nick_name || user.full_name || showEmail && user.mail || null;
}
exports.composeUserString = composeUserString;
var RestRequest = (function () {
    function RestRequest(method, url, headers, body) {
        if (headers === void 0) { headers = {}; }
        this.method = method;
        this.url = url;
        this.headers = {};
        for (var header in headers) {
            if (headers.hasOwnProperty(header)) {
                this.headers[header] = headers[header];
            }
        }
        this.headers["Accept"] = "application/json";
        this.headers["Content-Type"] = "application/json";
        this.body = body;
    }
    return RestRequest;
}());
exports.RestRequest = RestRequest;
var RestResponse = (function () {
    function RestResponse(status, body) {
        this.status = status;
        this.body = body;
    }
    return RestResponse;
}());
exports.RestResponse = RestResponse;
var BugFoundError = (function (_super) {
    __extends(BugFoundError, _super);
    function BugFoundError(adminMessage, userMessage) {
        _super.call(this, BugFoundError.composeMessage(adminMessage));
        this.name = "bug found error";
        // TODO: https://github.com/Microsoft/TypeScript/issues/1168#issuecomment-107756133
        this.message = BugFoundError.composeMessage(adminMessage);
        this.adminMessage = adminMessage;
        this.userMessage = userMessage;
    }
    BugFoundError.fromRestResponse = function (response) {
        var content = response.body;
        var message;
        if (response.status == 400) {
            content = response.body.exception;
            message = response.body.message;
        }
        return new BugFoundError("response " + response.status + ": " + JSON.stringify(content), message);
    };
    BugFoundError.fromWsResponse = function (response) {
        return new BugFoundError("response " + JSON.stringify(response), response.error);
    };
    BugFoundError.composeMessage = function (adminMessage) {
        return "bug found in client or server: " + adminMessage;
    };
    return BugFoundError;
}(Error));
exports.BugFoundError = BugFoundError;
var CodeError = (function (_super) {
    __extends(CodeError, _super);
    function CodeError(msg) {
        _super.call(this, msg);
        this.message = msg;
    }
    CodeError.fromRestResponse = function (response) {
        var content = response.body;
        if (response.status == 477) {
            return new CodeError("External server is offline: " + JSON.stringify(content));
        }
        if (response.status == 478) {
            return new CodeError("External server side error: " + JSON.stringify(content));
        }
        return new CodeError("Unknown error");
    };
    return CodeError;
}(Error));
exports.CodeError = CodeError;
var CodeCompileError = (function (_super) {
    __extends(CodeCompileError, _super);
    function CodeCompileError(msg) {
        _super.call(this, msg);
        this.errors = [];
        this.message = msg;
    }
    CodeCompileError.fromRestResponse = function (response) {
        var cce = new CodeCompileError("Compile error.");
        if (Array.isArray(response.body)) {
            cce.errors = response.body;
        }
        return cce;
    };
    return CodeCompileError;
}(Error));
exports.CodeCompileError = CodeCompileError;
var UnauthorizedError = (function (_super) {
    __extends(UnauthorizedError, _super);
    function UnauthorizedError(userMessage, message) {
        if (message === void 0) { message = "authorized authentication token required"; }
        _super.call(this, message);
        this.name = "request unauthorized error";
        // TODO: https://github.com/Microsoft/TypeScript/issues/1168#issuecomment-107756133
        this.message = message;
        this.userMessage = userMessage;
    }
    UnauthorizedError.fromRestResponse = function (response) {
        return new UnauthorizedError(response.body.message);
    };
    return UnauthorizedError;
}(Error));
exports.UnauthorizedError = UnauthorizedError;
var PermissionMissingError = (function (_super) {
    __extends(PermissionMissingError, _super);
    function PermissionMissingError(userMessage) {
        _super.call(this, PermissionMissingError.MESSAGE);
        this.name = "permission missing error";
        // TODO: https://github.com/Microsoft/TypeScript/issues/1168#issuecomment-107756133
        this.message = PermissionMissingError.MESSAGE;
        this.userMessage = userMessage;
    }
    PermissionMissingError.fromRestResponse = function (response) {
        return new PermissionMissingError(response.body.message);
    };
    PermissionMissingError.MESSAGE = "permission required";
    return PermissionMissingError;
}(UnauthorizedError));
exports.PermissionMissingError = PermissionMissingError;
var BackEnd = (function () {
    function BackEnd() {
        var _this = this;
        this.personInfoSnapshotDirty = true;
        this.personInfoSnapshot = null;
        this.personInfo = null;
        // define function as property is needed to can set it as event listener (class methods is called with wrong this)
        this.reconnectWebSocketAfterTimeout = function () {
            console.log("reconnectWebSocketAfterTimeout()");
            clearTimeout(_this.webSocketReconnectTimeout);
            _this.webSocketReconnectTimeout = setTimeout(function () {
                _this.connectWebSocket();
            }, 5000);
        };
        this.webSocket = null;
        this.webSocketMessageQueue = [];
        this.webSocketReconnectTimeout = null;
        this.notificationReceived = new Rx.Subject();
        this.webSocketErrorOccurred = new Rx.Subject();
        this.interactionsOpened = new Rx.Subject();
        this.interactionsSchemeSubscribed = new Rx.Subject();
        this.BProgramValuesReceived = new Rx.Subject();
        this.BProgramAnalogValueReceived = new Rx.Subject();
        this.BProgramDigitalValueReceived = new Rx.Subject();
        this.BProgramInputConnectorValueReceived = new Rx.Subject();
        this.BProgramOutputConnectorValueReceived = new Rx.Subject();
        this.personInfo = new Rx.Subject();
        this.tasks = 0;
    }
    BackEnd.prototype.refreshPersonInfo = function () {
        var _this = this;
        this.personInfoSnapshotDirty = true;
        if (this.tokenExist()) {
            this.getPersonInfo()
                .then(function (pi) {
                _this.personInfoSnapshotDirty = false;
                _this.personInfoSnapshot = pi.person;
                _this.personInfo.next(_this.personInfoSnapshot);
                _this.connectWebSocket();
            })
                .catch(function (error) {
                console.log(error);
                _this.unsetToken(); // TODO: maybe check error type before force logout user
                _this.personInfoSnapshotDirty = false;
                _this.personInfoSnapshot = null;
                _this.personInfo.next(_this.personInfoSnapshot);
                _this.disconnectWebSocket();
            });
        }
        else {
            this.personInfoSnapshotDirty = false;
            this.personInfoSnapshot = null;
            this.personInfo.next(this.personInfoSnapshot);
            this.disconnectWebSocket();
        }
    };
    BackEnd.prototype.getToken = function () {
        return window.localStorage.getItem("authToken");
    };
    BackEnd.prototype.setToken = function (token) {
        window.localStorage.setItem("authToken", token);
        this.refreshPersonInfo();
    };
    BackEnd.prototype.tokenExist = function () {
        return window.localStorage.getItem("authToken") ? true : false;
    };
    BackEnd.prototype.unsetToken = function () {
        window.localStorage.removeItem("authToken");
        this.refreshPersonInfo();
    };
    BackEnd.prototype.getWebSocketToken = function () {
        return this.requestRestPath("GET", "/websocket/access_token", "{}", 200);
    };
    BackEnd.prototype.findEnqueuedWebSocketMessage = function (original) {
        var keys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            keys[_i - 1] = arguments[_i];
        }
        return this.webSocketMessageQueue.find(function (message) { return _.isMatch(message, _.pick(original, keys)); });
    };
    BackEnd.prototype.requestRestPath = function (method, path, body, success) {
        if (success === void 0) { success = 200; }
        return this.requestRest(method, BackEnd.REST_SCHEME + "://" + BackEnd.HOST + path, body, success).toPromise();
    };
    BackEnd.prototype.requestRest = function (method, url, body, success) {
        var _this = this;
        if (success === void 0) { success = 200; }
        var request = new RestRequest(method, url, {}, body);
        // TODO: https://github.com/angular/angular/issues/7438
        if (this.tokenExist()) {
            request.headers["X-AUTH-TOKEN"] = this.getToken();
        }
        this.tasks += 1;
        return this.requestRestGeneral(request)
            .map(function (response) {
            if (response.status == success) {
                return response.body;
            }
            switch (response.status) {
                case 401:
                    throw UnauthorizedError.fromRestResponse(response);
                case 403:
                    throw PermissionMissingError.fromRestResponse(response);
                case 422:
                    throw CodeCompileError.fromRestResponse(response);
                case 477:
                    throw CodeError.fromRestResponse(response);
                case 478:
                    throw CodeError.fromRestResponse(response);
                default:
                    throw BugFoundError.fromRestResponse(response);
            }
        })
            .finally(function () {
            _this.tasks -= 1;
        });
    };
    BackEnd.prototype.sendWebSocketMessageQueue = function () {
        var _this = this;
        if (this.webSocket) {
            this.webSocketMessageQueue.slice().forEach(function (message) {
                try {
                    _this.webSocket.send(JSON.stringify(message));
                    var i = _this.webSocketMessageQueue.indexOf(message);
                    if (i > -1) {
                        _this.webSocketMessageQueue.splice(i);
                    }
                }
                catch (err) {
                    console.log("ERR" + err);
                }
            });
        }
    };
    BackEnd.prototype.sendWebSocketMessage = function (message) {
        this.webSocketMessageQueue.push(message);
        this.sendWebSocketMessageQueue();
    };
    BackEnd.prototype.disconnectWebSocket = function () {
        console.log("disconnectWebSocket()");
        if (this.webSocket) {
            this.webSocket.removeEventListener("close", this.reconnectWebSocketAfterTimeout);
            this.webSocket.close();
        }
        this.webSocket = null;
    };
    BackEnd.prototype.connectWebSocket = function () {
        var _this = this;
        if (!this.tokenExist()) {
            console.log("connectWebSocket() :: cannot connect now, user token doesn't exists.");
            return;
        }
        this.disconnectWebSocket();
        this.getWebSocketToken()
            .then(function (webSocketToken) {
            console.log("connectWebSocket() :: webSocketToken = " + webSocketToken.websocket_token);
            _this.webSocket = new WebSocket(BackEnd.WS_SCHEME + "://" + BackEnd.HOST + "/websocket/becki/" + webSocketToken.websocket_token);
            _this.webSocket.addEventListener("close", _this.reconnectWebSocketAfterTimeout);
            var opened = Rx.Observable
                .fromEvent(_this.webSocket, "open");
            var channelReceived = Rx.Observable
                .fromEvent(_this.webSocket, "message")
                .map(function (event) {
                try {
                    return JSON.parse(event.data);
                }
                catch (e) {
                    console.log("parse: " + e);
                }
                return null;
            })
                .filter(function (message) { return (message && message.messageChannel == BackEnd.WS_CHANNEL); });
            var errorOccurred = Rx.Observable
                .fromEvent(_this.webSocket, "error");
            opened.
                subscribe(function () {
                _this.requestNotificationsSubscribe();
            });
            opened
                .subscribe(function () { return _this.sendWebSocketMessageQueue(); });
            opened
                .subscribe(_this.interactionsOpened);
            channelReceived
                .filter(function (message) { return message.status == "error"; })
                .map(function (message) { return BugFoundError.fromWsResponse(message); })
                .subscribe(_this.webSocketErrorOccurred);
            channelReceived
                .filter(function (message) { return message.messageType == "subscribe_instace" && message.status == "success"; })
                .subscribe(_this.interactionsSchemeSubscribed);
            channelReceived
                .filter(function (message) { return message.messageType == "subscribe_notification" || message.messageType == "unsubscribe_notification" || message.messageType == "notification"; })
                .subscribe(_this.notificationReceived);
            channelReceived
                .filter(function (message) { return message.messageType == "getValues" && message.status == "success"; })
                .subscribe(_this.BProgramValuesReceived);
            channelReceived
                .filter(function (message) { return message.messageType == "newAnalogValue"; })
                .subscribe(_this.BProgramAnalogValueReceived);
            channelReceived
                .filter(function (message) { return message.messageType == "newDigitalValue"; })
                .subscribe(_this.BProgramDigitalValueReceived);
            channelReceived
                .filter(function (message) { return message.messageType == "newInputConnectorValue"; })
                .subscribe(_this.BProgramInputConnectorValueReceived);
            channelReceived
                .filter(function (message) { return message.messageType == "newOutputConnectorValue"; })
                .subscribe(_this.BProgramOutputConnectorValueReceived);
            errorOccurred
                .subscribe(_this.webSocketErrorOccurred);
        })
            .catch(function (error) {
            _this.webSocketErrorOccurred.next(error);
        });
    };
    BackEnd.prototype.createUser = function (mail, password, nick_name) {
        if (!mail || password.length < 8 || nick_name.length < 8) {
            throw "password >= 8 and username >= 8 and email required";
        }
        return this.requestRestPath("POST", BackEnd.USER_PATH, { nick_name: nick_name, mail: mail, password: password }, 201);
    };
    BackEnd.prototype.getUser = function (id) {
        return this.requestRestPath("GET", BackEnd.USER_PATH + "/" + id);
    };
    BackEnd.prototype.getUserEmailUsed = function (email) {
        return this.requestRestPath("GET", BackEnd.VALIDATION_PATH + "/mail/" + email).then(function (body) { return body.valid; });
    };
    BackEnd.prototype.getUsernameUsed = function (username) {
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-187
        return this.requestRestPath("GET", BackEnd.VALIDATION_PATH + "/nicknamewe/" + username).then(function (body) { return body.code == 200; });
    };
    BackEnd.prototype.getUserRolesAndPermissions = function (id) {
        return this.requestRestPath("GET", "/secure/person/system_acces/" + id);
    };
    BackEnd.prototype.getSignedUser = function () {
        return this.requestRestPath("GET", "/login/person").then(function (result) { return result.person; });
    };
    BackEnd.prototype.getUsers = function () {
        return this.requestRestPath("GET", BackEnd.USER_PATH + "/all");
    };
    BackEnd.prototype.updateUser = function (id, full_name, nick_name, first_title, last_title) {
        if (!full_name || !nick_name) {
            throw "name and username required";
        }
        return this.requestRestPath("PUT", BackEnd.USER_PATH + "/" + id, {
            nick_name: nick_name,
            full_name: full_name,
            first_title: first_title,
            last_title: last_title
        });
    };
    BackEnd.prototype.addRoleToUser = function (role, user) {
        return this.requestRestPath("PUT", BackEnd.ROLE_PATH + "/person/" + user + "/" + role, {});
    };
    BackEnd.prototype.removeRoleFromUser = function (role, user) {
        return this.requestRestPath("DELETE", BackEnd.ROLE_PATH + "/person/" + user + "/" + role);
    };
    BackEnd.prototype.addPermissionToUser = function (permission, user) {
        return this.requestRestPath("PUT", BackEnd.PERMISSION_PATH + "/person/" + user + "/" + permission, {});
    };
    BackEnd.prototype.removePermissionFromUser = function (permission, user) {
        return this.requestRestPath("DELETE", BackEnd.PERMISSION_PATH + "/person/" + user + "/" + permission);
    };
    BackEnd.prototype.deleteUser = function (user) {
        return this.requestRestPath("DELETE", BackEnd.USER_PATH + "/" + user);
    };
    BackEnd.prototype.createToken = function (mail, password) {
        var _this = this;
        if (!mail || !password) {
            throw "email and password required";
        }
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
        return this.requestRestPath("POST", BackEnd.TOKEN_PATH + "/login", {
            mail: mail,
            password: password
        }).then(function (body) {
            // TODO: https://github.com/angular/angular/issues/7438
            _this.setToken(body.authToken);
            return body;
        }).then(function (body) {
            return JSON.stringify(body);
        });
    };
    BackEnd.prototype.createFacebookToken = function (redirectUrl) {
        var _this = this;
        redirectUrl = encodeURIComponent(redirectUrl);
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
        return this.requestRestPath("GET", "/login/facebook?return_link=" + redirectUrl).then(function (body) {
            // TODO: https://github.com/angular/angular/issues/7438
            _this.setToken(body.authToken);
            return body.redirect_url;
        });
    };
    BackEnd.prototype.createGitHubToken = function (redirectUrl) {
        var _this = this;
        redirectUrl = encodeURIComponent(redirectUrl);
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
        return this.requestRestPath("GET", "/login/github?return_link=" + redirectUrl).then(function (body) {
            // TODO: https://github.com/angular/angular/issues/7438
            _this.setToken(body.authToken);
            return body.redirect_url;
        });
    };
    BackEnd.prototype.deleteToken = function () {
        var _this = this;
        return this.requestRestPath("POST", BackEnd.TOKEN_PATH + "/logout", {}).then(function (body) {
            // TODO: https://github.com/angular/angular/issues/7438
            _this.unsetToken();
            return body;
        });
    };
    BackEnd.prototype.getConnections = function () {
        return this.requestRestPath("GET", "/coreClient/connections");
    };
    BackEnd.prototype.removeConnection = function (id) {
        return this.requestRestPath("DELETE", "/coreClient/connection/" + id);
    };
    BackEnd.prototype.getNotificationsByPage = function (page) {
        return this.requestRestPath("GET", BackEnd.NOTIFICATION_PATH + "/list/" + page);
    };
    BackEnd.prototype.sendPasswordRecovery = function (mail) {
        return this.requestRestPath("POST", "" + BackEnd.PASSWORD_RECOVERY_PATH, { mail: mail }, 200).then(JSON.stringify);
    };
    BackEnd.prototype.PasswordRecovery = function (mail, password_recovery_token, password) {
        return this.requestRestPath("PUT", "" + BackEnd.PASSWORD_RECOVERY_CHANGE_PATH, {
            mail: mail,
            password: password,
            password_recovery_token: password_recovery_token
        }, 200).then(function (json) { return console.log(json); }).then(JSON.stringify);
    };
    BackEnd.prototype.requestNotificationsSubscribe = function () {
        var message = {
            messageId: uuid.v4(),
            messageChannel: BackEnd.WS_CHANNEL,
            messageType: "subscribe_notification"
        };
        if (!this.findEnqueuedWebSocketMessage(message, 'messageChannel', 'messageType')) {
            this.sendWebSocketMessage(message);
        }
    };
    BackEnd.prototype.requestNotificationsUnsubscribe = function () {
        var message = {
            messageId: uuid.v4(),
            messageChannel: BackEnd.WS_CHANNEL,
            messageType: "unsubscribe_notification"
        };
        if (!this.findEnqueuedWebSocketMessage(message, 'messageChannel', 'messageType')) {
            this.sendWebSocketMessage(message);
        }
    };
    BackEnd.prototype.getRoles = function () {
        return this.requestRestPath("GET", BackEnd.ROLE_PATH + "/all");
    };
    BackEnd.prototype.getPermissions = function () {
        return this.requestRestPath("GET", BackEnd.PERMISSION_PATH);
    };
    BackEnd.prototype.createScreenType = function (name, width, height, columns, rows, project_id) {
        if (name.length < 3 || !Number.isInteger(width) || !Number.isInteger(height) || !Number.isInteger(columns) || !Number.isInteger(rows)) {
            throw "name >= 3, integer width, integer height, integer columns and integer rows required";
        }
        return this.requestRestPath("POST", BackEnd.SCREEN_SIZE_TYPE_PATH, {
            name: name,
            height_lock: false,
            width_lock: false,
            touch_screen: false,
            project_id: project_id,
            landscape_height: width,
            landscape_width: height,
            landscape_square_height: columns,
            landscape_square_width: rows,
            landscape_max_screens: 10,
            landscape_min_screens: 1,
            portrait_height: height,
            portrait_width: width,
            portrait_square_height: rows,
            portrait_square_width: columns,
            portrait_max_screens: 10,
            portrait_min_screens: 1
        }, 201);
    };
    BackEnd.prototype.getScreenType = function (id) {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", BackEnd.SCREEN_SIZE_TYPE_PATH + "/" + id);
    };
    BackEnd.prototype.getScreenTypes = function () {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", BackEnd.SCREEN_SIZE_TYPE_PATH + "/all");
    };
    BackEnd.prototype.getFilteredCProgramList = function (page_number, project_id) {
        return this.requestRestPath("PUT", BackEnd.C_PROGRAM_LIST + "/" + page_number, { project_id: project_id });
    };
    BackEnd.prototype.getFilteredBProgramList = function (page_number, project_id) {
        return this.requestRestPath("PUT", BackEnd.B_PROGRAM_PATH + "/list/" + page_number, { project_id: project_id });
    };
    BackEnd.prototype.getFilteredBlockoBlockProgramList = function (page_number, project_id) {
        return this.requestRestPath("PUT", BackEnd.BLOCKOBLOCK_PATH + "/list/" + page_number, { project_id: project_id });
    };
    BackEnd.prototype.getFilteredTypeOfBlockList = function (page_number, project_id, private_type) {
        return this.requestRestPath("PUT", BackEnd.TYPE_OF_BLOCK_PATH + "/list/" + page_number, {
            project_id: project_id,
            private_type: private_type
        });
    };
    BackEnd.prototype.getUnconfirmedNotification = function () {
        return this.requestRestPath("GET", "" + BackEnd.UNCONFIRMED_NOTIFICATION_PATH);
    };
    BackEnd.prototype.updateScreenType = function (id, name, width, height, columns, rows, width_lock, height_lock, portrait_min_screens, portrait_max_screens, landscape_min_screens, landscape_max_screens, touch_screen, project_id) {
        if (name.length < 3 || !Number.isInteger(width) || !Number.isInteger(height) || !Number.isInteger(columns) || !Number.isInteger(rows) || !Number.isInteger(portrait_min_screens) || !Number.isInteger(portrait_max_screens) || !Number.isInteger(landscape_min_screens) || !Number.isInteger(landscape_max_screens)) {
            throw "name >= 3, integer width, integer height, integer columns, integer rows and integer screen counts required";
        }
        return this.requestRestPath("PUT", BackEnd.SCREEN_SIZE_TYPE_PATH + "/" + id, {
            name: name,
            height_lock: height_lock,
            width_lock: width_lock,
            touch_screen: touch_screen,
            project_id: project_id,
            landscape_height: width,
            landscape_width: height,
            landscape_square_height: columns,
            landscape_square_width: rows,
            landscape_max_screens: landscape_max_screens,
            landscape_min_screens: landscape_min_screens,
            portrait_height: height,
            portrait_width: width,
            portrait_square_height: rows,
            portrait_square_width: columns,
            portrait_max_screens: portrait_max_screens,
            portrait_min_screens: portrait_min_screens
        });
    };
    BackEnd.prototype.deleteScreenType = function (id) {
        return this.requestRestPath("DELETE", BackEnd.SCREEN_SIZE_TYPE_PATH + "/" + id);
    };
    BackEnd.prototype.createMProject = function (program_name, program_description, projectId) {
        if (program_name.length < 4) {
            throw "name >= 4 required";
        }
        return this.requestRestPath("POST", BackEnd.M_PROJECT_PATH + "/" + projectId, {
            program_description: program_description,
            program_name: program_name
        }, 201);
    };
    BackEnd.prototype.getMProject = function (id) {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", BackEnd.M_PROJECT_PATH + "/" + id);
    };
    BackEnd.prototype.updateMProject = function (id, program_name, program_description) {
        if (program_name.length < 4) {
            throw "name >= 4 required";
        }
        return this.requestRestPath("PUT", BackEnd.M_PROJECT_PATH + "/" + id, { program_description: program_description, program_name: program_name });
    };
    BackEnd.prototype.deleteMProject = function (id) {
        return this.requestRestPath("DELETE", BackEnd.M_PROJECT_PATH + "/" + id);
    };
    BackEnd.prototype.createMProgram = function (program_name, program_description, screen_type_id, m_code, groupId) {
        if (program_name.length < 8 || !m_code) {
            throw "name >= 8 and code required";
        }
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-302
        return this.requestRestPath("POST", BackEnd.M_PROGRAM_PATH + "/" + groupId, {
            screen_type_id: screen_type_id,
            program_name: program_name,
            program_description: program_description,
            m_code: m_code,
            height_lock: false,
            width_lock: false
        }, 201);
    };
    BackEnd.prototype.getMProgram = function (id) {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", BackEnd.M_PROGRAM_PATH + "/" + id);
    };
    BackEnd.prototype.getMPrograms = function () {
        return this.requestRestPath("GET", BackEnd.M_PROGRAM_PATH + "/app/m_programs");
    };
    BackEnd.prototype.updateMProgram = function (id, program_name, program_description, screen_type_id, m_code) {
        if (program_name.length < 8 || !m_code) {
            throw "name >= 8 and code required";
        }
        return this.requestRestPath("PUT", BackEnd.M_PROGRAM_PATH + "/" + id, {
            screen_type_id: screen_type_id,
            program_name: program_name,
            program_description: program_description,
            m_code: m_code,
            height_lock: false,
            width_lock: false
        });
    };
    BackEnd.prototype.deleteMProgram = function (id) {
        return this.requestRestPath("DELETE", BackEnd.M_PROGRAM_PATH + "/" + id);
    };
    /* //tyrion verze 1.06.6.4, odebraná API pro Becki
     public createProducer(name:string, description:string):Promise<any> {
     if (name.length < 4 || description.length < 8) {
     throw "name >= 4 and description >= 8 required";
     }

     return this.requestRestPath("POST", BackEnd.PRODUCER_PATH, {name, description}, 201);
     }
     */
    BackEnd.prototype.getProducer = function (id) {
        return this.requestRestPath("GET", BackEnd.PRODUCER_PATH + "/" + id);
    };
    BackEnd.prototype.getProducers = function () {
        return this.requestRestPath("GET", BackEnd.PRODUCER_PATH + "/all");
    };
    /*
     public updateProducer(id:string, name:string, description:string):Promise<any> {
     if (name.length < 8 || description.length < 24) {
     throw "name >= 8 and description >= 24 required";
     }

     return this.requestRestPath("PUT", `${BackEnd.PRODUCER_PATH}/${id}`, {name, description});
     }*/
    /*
     public deleteProducer(id:string):Promise<any> {
     return this.requestRestPath("DELETE", `${BackEnd.PRODUCER_PATH}/${id}`);
     }
     */
    BackEnd.prototype.createLibrary = function (library_name, description) {
        if (library_name.length < 8 || description.length < 8) {
            throw "name >= 8 and description >= 8 required";
        }
        return this.requestRestPath("POST", BackEnd.LIBRARY_PATH, { library_name: library_name, description: description }, 201);
    };
    BackEnd.prototype.getLibrary = function (id) {
        return this.requestRestPath("GET", BackEnd.LIBRARY_PATH + "/" + id);
    };
    BackEnd.prototype.getLibraries = function (page) {
        if (page < 1) {
            throw "page >= 1 required";
        }
        return this.requestRestPath("PUT", BackEnd.LIBRARY_PATH + "/filter/" + page, {});
    };
    BackEnd.prototype.updateLibrary = function (id, library_name, description) {
        if (library_name.length < 8 || description.length < 8) {
            throw "name >= 8 and description >= 8 required";
        }
        return this.requestRestPath("PUT", BackEnd.LIBRARY_PATH + "/" + id, { library_name: library_name, description: description });
    };
    BackEnd.prototype.addVersionToLibrary = function (version_name, version_description, id) {
        if (version_name.length < 8 || version_description.length < 8) {
            throw "name >= 8 and description >= 8 required";
        }
        return this.requestRestPath("POST", BackEnd.LIBRARY_PATH + "/version/" + id, {
            version_name: version_name,
            version_description: version_description
        }, 201);
    };
    BackEnd.prototype.updateFileOfLibrary = function (content, version) {
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-305
        return this.requestRestPath("POST", BackEnd.LIBRARY_PATH + "/upload/" + version, content);
    };
    BackEnd.prototype.deleteLibrary = function (id) {
        return this.requestRestPath("DELETE", BackEnd.LIBRARY_PATH + "/" + id);
    };
    BackEnd.prototype.createLibraryGroup = function (group_name, description) {
        if (group_name.length < 8 || description.length < 24) {
            throw "name >= 8 and description >= 24 required";
        }
        return this.requestRestPath("POST", BackEnd.LIBRARY_GROUP_PATH, { description: description, group_name: group_name }, 201);
    };
    BackEnd.prototype.getLibraryGroup = function (id) {
        return this.requestRestPath("GET", BackEnd.LIBRARY_GROUP_PATH + "/" + id);
    };
    BackEnd.prototype.getLibraryGroups = function (page) {
        if (page < 1) {
            throw "page >= 1 required";
        }
        return this.requestRestPath("PUT", BackEnd.LIBRARY_GROUP_PATH + "/filter/" + page, {});
    };
    BackEnd.prototype.updateLibraryGroup = function (id, group_name, description) {
        if (group_name.length < 8 || description.length < 24) {
            throw "name >= 8 and description >= 24 required";
        }
        return this.requestRestPath("PUT", BackEnd.LIBRARY_GROUP_PATH + "/" + id, { description: description, group_name: group_name }, 200);
    };
    BackEnd.prototype.deleteLibraryGroup = function (id) {
        return this.requestRestPath("DELETE", BackEnd.LIBRARY_GROUP_PATH + "/" + id);
    };
    /*public createProcessor(processor_name:string, processor_code:string, description:string, speed:number):Promise<any> {
     if (processor_name.length < 4 || processor_code.length < 4 || description.length < 24 || !Number.isInteger(speed)) {
     throw "name >= 4, code >= 4 and description >= 24 required";
     }

     return this.requestRestPath("POST", BackEnd.PROCESSOR_PATH, {processor_name, description, processor_code, speed}, 201);
     }*/
    BackEnd.prototype.getProcessor = function (id) {
        return this.requestRestPath("GET", BackEnd.PROCESSOR_PATH + "/" + id);
    };
    BackEnd.prototype.getProcessors = function () {
        return this.requestRestPath("GET", BackEnd.PROCESSOR_PATH);
    };
    /*
     public updateProcessor(id:string, processor_name:string, processor_code:string, description:string, speed:number):Promise<any> {
     if (processor_name.length < 4 || processor_code.length < 4 || description.length < 24 || !Number.isInteger(speed)) {
     throw "name >= 4, code >= 4 and description >= 24 required";
     }

     return this.requestRestPath("PUT", `${BackEnd.PROCESSOR_PATH}/${id}`, {processor_name, description, processor_code, speed});
     }
     */
    /*
     public deleteProcessor(id:string):Promise<any> {
     return this.requestRestPath("DELETE", `${BackEnd.PROCESSOR_PATH}/${id}`);
     }
     */
    /*
     public createDeviceType(name:string, producer_id:string, processor_id:string, connectible_to_internet:boolean, description:string):Promise<any> {
     if (name.length < 8 || description.length < 10) {
     throw "name >= 8 and description >= 10 required";
     }

     return this.requestRestPath("POST", BackEnd.TYPE_OF_BOARD_PATH, {name, description, producer_id, processor_id, connectible_to_internet}, 201);
     }
     */
    BackEnd.prototype.getTypeOfBoard = function (id) {
        return this.requestRestPath("GET", BackEnd.TYPE_OF_BOARD_PATH + "/" + id);
    };
    BackEnd.prototype.getAllTypeOfBoard = function () {
        return this.requestRestPath("GET", BackEnd.TYPE_OF_BOARD_PATH + "/all");
    };
    /*
     public updateDeviceType(id:string, name:string, producer_id:string, processor_id:string, connectible_to_internet:boolean, description:string):Promise<any> {
     if (name.length < 8 || description.length < 10) {
     throw "name >= 8 and description >= 10 required";
     }

     return this.requestRestPath("PUT", `${BackEnd.TYPE_OF_BOARD_PATH}/${id}`, {name, description, producer_id, processor_id, connectible_to_internet});
     }
     */
    /*
     public deleteDeviceType(id:string):Promise<any> {
     return this.requestRestPath("DELETE", `${BackEnd.TYPE_OF_BOARD_PATH}/${id}`);
     }

     */
    BackEnd.prototype.createCProgram = function (program_name, program_description, type_of_board_id, projectId) {
        if (program_name.length < 8 || !type_of_board_id) {
            throw "name >= 8 and device type required";
        }
        return this.requestRestPath("POST", BackEnd.C_PROGRAM_COMPILATION_PATH + "/" + projectId, {
            program_name: program_name,
            program_description: program_description,
            type_of_board_id: type_of_board_id
        }, 201);
    };
    BackEnd.prototype.getCProgram = function (id) {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", BackEnd.C_PROGRAM_COMPILATION_PATH + "/" + id);
    };
    BackEnd.prototype.updateCProgram = function (id, program_name, program_description, type_of_board_id) {
        if (program_name.length < 8 || !type_of_board_id) {
            throw "name >= 8 and device type required";
        }
        return this.requestRestPath("PUT", BackEnd.C_PROGRAM_COMPILATION_PATH + "/" + id, {
            program_name: program_name,
            program_description: program_description,
            type_of_board_id: type_of_board_id
        });
    };
    BackEnd.prototype.addVersionToCProgram = function (version_name, version_description, main, files, program) {
        if (version_name.length < 8) {
            throw "name >= 8 required";
        }
        var user_files = Object.keys(files).map(function (file_name) { return ({ file_name: file_name, code: files[file_name] }); });
        return this.requestRestPath("POST", BackEnd.C_PROGRAM_VERSION_PATH + "/create/" + program, {
            version_name: version_name,
            version_description: version_description,
            main: main,
            user_files: user_files
        }, 201);
    };
    BackEnd.prototype.buildCProgram = function (main, files, type_of_board_id) {
        if (!type_of_board_id) {
            throw "target required";
        }
        var user_files = Object.keys(files).map(function (file_name) { return ({ file_name: file_name, code: files[file_name] }); });
        return this.requestRestPath("POST", BackEnd.C_PROGRAM_VERSION_PATH + "/compile", {
            type_of_board_id: type_of_board_id,
            main: main,
            user_files: user_files
        });
    };
    BackEnd.prototype.deleteCProgram = function (id) {
        return this.requestRestPath("DELETE", BackEnd.C_PROGRAM_COMPILATION_PATH + "/" + id);
    };
    BackEnd.prototype.createBoard = function (id, type_of_board_id) {
        if (!/^[0-9a-f]{8}$/.test(id)) {
            throw "ID = 8 hex chars required";
        }
        return this.requestRestPath("POST", BackEnd.BOARD_PATH, { type_of_board_id: type_of_board_id, hardware_unique_ids: [id] }, 201);
    };
    BackEnd.prototype.getBoard = function (id) {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", BackEnd.BOARD_PATH + "/" + id);
    };
    BackEnd.prototype.getBoards = function (page) {
        if (page < 1) {
            throw "page >= 1 required";
        }
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("PUT", BackEnd.BOARD_PATH + "/filter/" + page, {});
    };
    BackEnd.prototype.addBoardToProject = function (board, project) {
        return this.requestRestPath("PUT", BackEnd.BOARD_PATH + "//" + board + "/" + project, {});
    };
    BackEnd.prototype.removeBoardFromProject = function (board) {
        return this.requestRestPath("DELETE", BackEnd.BOARD_PATH + "/" + board);
    };
    BackEnd.prototype.updateBoardWithCProgram = function (versionId, board_id) {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("POST", BackEnd.C_PROGRAM_VERSION_PATH + "/upload/" + versionId, { board_id: board_id });
    };
    BackEnd.prototype.postCompilationServer = function (server_name) {
        if (server_name.length < 6) {
            throw "name >= 6 required";
        }
        return this.requestRestPath("POST", BackEnd.EXTERNAL_SERVER_PATH, { server_name: server_name }, 201);
    };
    BackEnd.prototype.getCompilationServers = function () {
        return this.requestRestPath("GET", BackEnd.EXTERNAL_SERVER_PATH);
    };
    BackEnd.prototype.editCompilationServer = function (id, server_name) {
        if (server_name.length < 6) {
            throw "name >= 6 required";
        }
        return this.requestRestPath("PUT", BackEnd.EXTERNAL_SERVER_PATH + "/" + id, { server_name: server_name });
    };
    BackEnd.prototype.deleteCompilationServer = function (id) {
        return this.requestRestPath("DELETE", BackEnd.EXTERNAL_SERVER_PATH + "/" + id);
    };
    BackEnd.prototype.getTypeOfBlock = function (id) {
        return this.requestRestPath("GET", BackEnd.TYPE_OF_BLOCK_PATH + "/" + id);
    };
    BackEnd.prototype.createTypeOfBlock = function (name, general_description, project_id) {
        return this.requestRestPath("POST", "" + BackEnd.TYPE_OF_BLOCK_PATH, {
            name: name,
            general_description: general_description,
            project_id: project_id
        }, 201);
    };
    BackEnd.prototype.getAllTypeOfBlock = function () {
        return this.requestRestPath("GET", BackEnd.TYPE_OF_BLOCK_PATH);
    };
    BackEnd.prototype.updateTypeOfBlock = function (id, name, general_description, project_id) {
        return this.requestRestPath("PUT", BackEnd.TYPE_OF_BLOCK_PATH + "/" + id, {
            name: name,
            general_description: general_description,
            project_id: project_id
        });
    };
    BackEnd.prototype.deleteTypeOfBlock = function (TypeOfBlockid) {
        return this.requestRestPath("DELETE", BackEnd.TYPE_OF_BLOCK_PATH + "/" + TypeOfBlockid, {});
    };
    BackEnd.prototype.createBlockoBlock = function (name, type_of_block_id, general_description) {
        if (name.length < 8 || general_description.length < 24) {
            throw "name >= 8 and description >= 24 required";
        }
        return this.requestRestPath("POST", BackEnd.BLOCKOBLOCK_PATH, {
            general_description: general_description,
            name: name,
            type_of_block_id: type_of_block_id
        }, 201);
    };
    BackEnd.prototype.getBlockoBlock = function (id) {
        // TODO: http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", BackEnd.BLOCKOBLOCK_PATH + "/" + id);
    };
    BackEnd.prototype.updateBlockoBlock = function (id, name, general_description, type_of_block_id) {
        if (name.length < 8 || general_description.length < 24) {
            throw "name >= 8 and description >= 24 required";
        }
        return this.requestRestPath("PUT", BackEnd.BLOCKOBLOCK_PATH + "/" + id, {
            general_description: general_description,
            name: name,
            type_of_block_id: type_of_block_id
        });
    };
    BackEnd.prototype.addVersionToBlockoBlock = function (version_name, version_description, logic_json, program) {
        if (!version_name || !version_description || !logic_json) {
            throw "name, description and code required";
        }
        return this.requestRestPath("POST", BackEnd.BLOCKOBLOCK_PATH + "/version/" + program, {
            version_name: version_name,
            version_description: version_description,
            design_json: "-",
            logic_json: logic_json
        }, 201);
    };
    BackEnd.prototype.deleteBlockoBlock = function (id) {
        return this.requestRestPath("DELETE", BackEnd.BLOCKOBLOCK_PATH + "/" + id);
    };
    BackEnd.prototype.createBProgram = function (name, program_description, projectId) {
        if (name.length < 8) {
            throw "name >= 8 required";
        }
        return this.requestRestPath("POST", BackEnd.B_PROGRAM_PATH + "/" + projectId, { program_description: program_description, name: name }, 201);
    };
    BackEnd.prototype.getBProgram = function (id) {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", BackEnd.B_PROGRAM_PATH + "/" + id);
    };
    BackEnd.prototype.subscribeBProgram = function (version_id) {
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-262
        var message = {
            messageId: uuid.v4(),
            messageChannel: BackEnd.WS_CHANNEL,
            messageType: "subscribe_instace",
            version_id: version_id
        };
        if (!this.findEnqueuedWebSocketMessage(message, 'messageChannel', 'messageType', 'version_id')) {
            this.sendWebSocketMessage(message);
        }
    };
    BackEnd.prototype.requestBProgramValues /*requestInteractionsSchemeValues*/ = function (version_id) {
        var message = { messageId: uuid.v4(), messageChannel: BackEnd.WS_CHANNEL, messageType: "getValues", version_id: version_id };
        if (!this.findEnqueuedWebSocketMessage(message, 'messageChannel', 'messageType', 'version_id')) {
            this.sendWebSocketMessage(message);
        }
    };
    BackEnd.prototype.updateBProgram = function (id, name, program_description) {
        if (name.length < 8) {
            throw "name >= 8 required";
        }
        return this.requestRestPath("PUT", BackEnd.B_PROGRAM_PATH + "/" + id, { program_description: program_description, name: name });
    };
    BackEnd.prototype.addMProjectConnection = function (group, version, autoupdate) {
        return this.requestRestPath("PUT", BackEnd.M_PROJECT_PATH + "/connect/" + group + "/" + version + "/" + autoupdate, {});
    };
    BackEnd.prototype.addVersionToBProgram = function (version_name, version_description, program, boards, main_board, programId) {
        if (!version_name || !program || !main_board) {
            throw "name, scheme and gateway required";
        }
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-284
        return this.requestRestPath("PUT", BackEnd.B_PROGRAM_PATH + "/update/" + programId, {
            version_name: version_name,
            version_description: version_description,
            program: program,
            main_board: main_board,
            boards: boards
        });
    };
    BackEnd.prototype.deleteBProgram = function (id) {
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-185
        return this.requestRestPath("DELETE", BackEnd.B_PROGRAM_PATH + "/" + id);
    };
    BackEnd.prototype.createHomer = function (mac_address, type_of_device, project_id) {
        if (!mac_address) {
            throw "ID required";
        }
        return this.requestRestPath("POST", BackEnd.HOMER_PATH, { mac_address: mac_address, type_of_device: type_of_device, project_id: project_id }, 201);
    };
    BackEnd.prototype.getHomer = function (id) {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", BackEnd.HOMER_PATH + "/" + id);
    };
    BackEnd.prototype.uploadBProgramToHomer = function (versionId, HomerId, B_ProgramId) {
        return this.requestRestPath("PUT", BackEnd.B_PROGRAM_PATH + "/uploadToHomer/" + B_ProgramId + "/" + versionId + "/" + HomerId, {});
    };
    BackEnd.prototype.deleteHomer = function (id) {
        return this.requestRestPath("DELETE", BackEnd.HOMER_PATH + "/" + id);
    };
    BackEnd.prototype.createCloudHomerServer = function (server_name) {
        if (!server_name) {
            throw "name required";
        }
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-281
        return this.requestRestPath("POST", BackEnd.CLOUD_HOMER_SERVER_PATH, { server_name: server_name }, 201);
    };
    BackEnd.prototype.getCloudHomerServers = function () {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", BackEnd.CLOUD_HOMER_SERVER_PATH);
    };
    BackEnd.prototype.editCloudHomerServer = function (id, server_name) {
        if (!server_name) {
            throw "name required";
        }
        return this.requestRestPath("PUT", BackEnd.CLOUD_HOMER_SERVER_PATH + "/" + id, { server_name: server_name });
    };
    BackEnd.prototype.deleteCloudHomerServer = function (id) {
        return this.requestRestPath("DELETE", BackEnd.CLOUD_HOMER_SERVER_PATH + "/" + id);
    };
    BackEnd.prototype.getUserProduct = function () {
        return this.requestRestPath("GET", BackEnd.TARIF_PATH + "/user_applicable");
    };
    BackEnd.prototype.getRegistrationProducts = function (tariff_type, product_individual_name, payment_mode, currency_type, city, country, street_number, company_details_required, street, zip_code, registration_no, vat_number, company_name, company_authorized_email, company_authorized_phone, company_web, company_invoice_email, payment_method) {
        if (!company_details_required) {
            return this.requestRestPath("GET", BackEnd.TARIF_PATH + "/for_registration", {
                tariff_type: tariff_type,
                product_individual_name: product_individual_name,
                payment_mode: payment_mode,
                currency_type: currency_type,
                city: city,
                country: country,
                street_number: street_number,
                street: street,
                zip_code: zip_code
            }); // tyrion Verze 1.06.6.4 //zařizuje a posílá becki nějaké informace o platbě Tyrionovi? všechny?
        }
        else {
            return this.requestRestPath("GET", BackEnd.TARIF_PATH + "/for_registration", {
                tariff_type: tariff_type,
                product_individual_name: product_individual_name,
                currency_type: currency_type,
                city: city,
                country: country,
                street_number: street_number,
                street: street,
                zip_code: zip_code,
                registration_no: registration_no,
                vat_number: vat_number,
                company_name: company_name,
                company_authorized_email: company_authorized_email,
                company_authorized_phone: company_authorized_phone,
                company_web: company_web,
                company_invoice_email: company_invoice_email,
                payment_mode: payment_mode,
                payment_method: payment_method
            });
        }
    };
    BackEnd.prototype.createProject = function (project_name, project_description, product_id) {
        if (project_name.length < 8 || project_description.length < 24) {
            throw "name >= 8 and description >= 24 required";
        }
        return this.requestRestPath("POST", BackEnd.PROJECT_PATH, { project_name: project_name, project_description: project_description, product_id: product_id }, 201);
    };
    BackEnd.prototype.createDefaultProject = function () {
        return this.createProject("Default project", "An automatically created project. It can be edited or removed like any other project.", "1");
    };
    BackEnd.prototype.getProject = function (id) {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", BackEnd.PROJECT_PATH + "/" + id);
    };
    BackEnd.prototype.getProjects = function () {
        return this.requestRestPath("GET", BackEnd.PROJECT_PATH);
    };
    BackEnd.prototype.updateProject = function (id, project_name, project_description, product_id) {
        if (project_name.length < 8 || project_description.length < 24) {
            throw "name >= 8 and description >= 24 required";
        }
        return this.requestRestPath("PUT", BackEnd.PROJECT_PATH + "/" + id, {
            project_name: project_name,
            project_description: project_description,
            product_id: product_id
        });
    };
    BackEnd.prototype.removeHomerFromProject = function (homer, project) {
        return this.requestRestPath("DELETE", BackEnd.HOMER_PATH + "/" + project + "/" + homer);
    };
    BackEnd.prototype.addCollaboratorToProject = function (collaborator, project) {
        return this.requestRestPath("PUT", BackEnd.PROJECT_PATH + "/shareProject/" + project, { persons_id: [collaborator] });
    };
    BackEnd.prototype.removeCollaboratorsFromProject = function (persons_id, project) {
        return this.requestRestPath("PUT", BackEnd.PROJECT_PATH + "/unshareProject/" + project, { persons_id: persons_id });
    };
    BackEnd.prototype.deleteProject = function (id) {
        return this.requestRestPath("DELETE", BackEnd.PROJECT_PATH + "/" + id);
    };
    BackEnd.prototype.getPersonInfo = function () {
        return this.requestRestPath("GET", BackEnd.LOGIN_PERSON_PATH);
    };
    BackEnd.prototype.updatePersonInfo = function (id, nick, name, ftitle, ltitle) {
        return this.requestRestPath("PUT", BackEnd.PERSON_PATH + "/" + id, {
            nick_name: nick,
            full_name: name,
            first_title: ftitle,
            last_title: ltitle
        });
    };
    BackEnd.prototype.getActualizationProcedureInfo = function (actualization_procedure_id) {
        return this.requestRestPath("GET", BackEnd.ACTUALIZATION_PROCEDURE_PATH + "/" + actualization_procedure_id);
    };
    BackEnd.REST_SCHEME = "http";
    BackEnd.WS_SCHEME = "ws";
    BackEnd.HOST = "127.0.0.1:9000";
    BackEnd.ACTUALIZATION_PROCEDURE_PATH = "/project/actualization_procedure";
    BackEnd.SCREEN_SIZE_TYPE_PATH = "/grid/screen_type";
    BackEnd.M_PROJECT_PATH = "/grid/m_project";
    BackEnd.M_PROGRAM_PATH /*APPLICATION_PATH*/ = "/grid/m_program";
    BackEnd.EXTERNAL_SERVER_PATH /*COMPILATION_SERVER_PATH*/ = "/compilation/server";
    BackEnd.BOARD_PATH /*DEVICE_PATH*/ = "/compilation/board";
    BackEnd.C_PROGRAM_COMPILATION_PATH /*DEVICE_PROGRAM_PATH*/ = "/compilation/c_program/c_program";
    BackEnd.C_PROGRAM_VERSION_PATH /*DEVICE_PROGRAM_VERSION_PATH*/ = "/compilation/c_program/version";
    BackEnd.C_PROGRAM_LIST /*DEVICE_PROGRAM_LIST*/ = "/compilation/c_program/list"; //Tyrion Verze 1.06.6.4
    BackEnd.TYPE_OF_BOARD_PATH /*DEVICE_TYPE_PATH*/ = "/compilation/typeOfBoard";
    BackEnd.TYPE_OF_BLOCK_PATH /*INTERACTIONS_BLOCK_GROUP_PATH*/ = "/project/typeOfBlock";
    BackEnd.BLOCKOBLOCK_PATH /*INTERACTIONS_BLOCK_PATH*/ = "/project/blockoBlock";
    BackEnd.HOMER_PATH /*INTERACTIONS_MODERATOR_PATH*/ = "/project/homer";
    BackEnd.B_PROGRAM_PATH /*INTERACTIONS_SCHEME_PATH*/ = "/project/b_program";
    BackEnd.CLOUD_HOMER_SERVER_PATH /*INTERACTIONS_SERVER_PATH*/ = "/project/blocko/server";
    BackEnd.LIBRARY_GROUP_PATH /**/ = "/compilation/libraryGroup";
    BackEnd.LIBRARY_PATH = "/compilation/library";
    BackEnd.NOTIFICATION_PATH = "/notification";
    BackEnd.PERMISSION_PATH = "/secure/permission";
    BackEnd.PROCESSOR_PATH = "/compilation/processor";
    BackEnd.PRODUCER_PATH = "/compilation/producer";
    BackEnd.PROJECT_PATH = "/project/project";
    BackEnd.ROLE_PATH = "/secure/role";
    BackEnd.TOKEN_PATH = "/coreClient/person/permission";
    BackEnd.PASSWORD_RECOVERY_PATH = "/coreClient/mail_person_password_recovery";
    BackEnd.PASSWORD_RECOVERY_CHANGE_PATH = "/coreClient/person_password_recovery";
    BackEnd.USER_PATH = "/coreClient/person/person";
    BackEnd.VALIDATION_PATH = "/coreClient/person/valid";
    BackEnd.WS_CHANNEL = "becki";
    BackEnd.LOGIN_PERSON_PATH = "/login/person";
    BackEnd.PERSON_PATH = "/coreClient/person/person";
    BackEnd.TARIF_PATH = "/product/tarifs";
    BackEnd.UNCONFIRMED_NOTIFICATION_PATH = "/notification/unconfirmed";
    return BackEnd;
}());
exports.BackEnd = BackEnd;
//# sourceMappingURL=index.js.map