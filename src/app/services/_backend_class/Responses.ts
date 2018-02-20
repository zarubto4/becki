import { IWebSocketErrorMessage } from '../../backend/BeckiBackend';
/**
 * Created by zaruba on 19.02.18.
 */


// INTERFACES - Compiler
export interface ICodeCompileErrorMessage {
    filename: string;
    type: string;
    text: string;
    codeWhitespace: string;
    code: string;

    line: number;
    column: number;
    adjustedColumn: number;
    startIndex: number;
    endIndex: number;
}


// Request
export class RestRequest {

    method: string;

    url: string;

    headers: { [name: string]: string };

    body: Object;

    constructor(method: string, url: string, headers: { [name: string]: string } = {}, body?: Object) {
        this.method = method;
        this.url = url;
        this.headers = {};
        for (let header in headers) {
            if (headers.hasOwnProperty(header)) {
                this.headers[header] = headers[header];
            }
        }
        this.headers['Accept'] = 'application/json';
        this.headers['Content-Type'] = 'application/json';
        this.body = body;
    }
}

// Response
export class RestResponse {

    status: number;
    body: Object;

    constructor(status: number, body: Object) {
        this.status = status;
        this.body = body;
    }
}

// ERROR CLASSES

export class BugFoundError extends Error {

    name = 'bug found error';

    adminMessage: string;

    userMessage: string;

    body: any;

    static fromRestResponse(response: RestResponse): BugFoundError {
        let content = response.body;
        let message: string;
        if (response.status === 400) {
            content = (<{ exception: Object }>response.body).exception;
            message = (<{ message: string }>response.body).message;
            if (!message) {
                message = (<{ error: string }>response.body).error;
            }
        }
        return new BugFoundError(response.body, `response ${response.status}: ${JSON.stringify(content)}`, message);
    }

    static fromWsResponse(response: IWebSocketErrorMessage): BugFoundError {
        return new BugFoundError(null, `response ${JSON.stringify(response)}`, response.error);
    }

    static composeMessage(adminMessage: string): string {
        return 'Bug found in client or server:' + adminMessage;
    }

    constructor(body: any, adminMessage: string, userMessage?: string) {
        super(BugFoundError.composeMessage(adminMessage));
        this.name = 'BugFoundError';
        this.message = BugFoundError.composeMessage(adminMessage);
        this.adminMessage = adminMessage;
        this.userMessage = userMessage;
        this.body = body;

        Object.setPrototypeOf(this, BugFoundError.prototype);
    }
}


/**
 * Default Error Response From Tyrion
 */

export class LostConnectionError extends Error {

    code: number = 0;
    name = 'Response_BadRequest';
    message: string = 'Request failed, please check your internet connection.';

    constructor() {
        super();
        super.message = this.message;
    }
}



// 400 - Something is wrong
export class BadRequest extends Error {

    code: number = 400;
    name = 'Response_BadRequest';
    message: string = null;

    public static fromRestResponse(response: RestResponse): BadRequest {
        return new BadRequest(response);
    }

    constructor(response: RestResponse) {
        super(response.body['message']);
        this.message = response.body['message'];
    }
}

// 400 - InvalidBody - Probably Message only for developers
export class InvalidBody extends Error {

    code: number = 400;
    name = 'Response_InvalidBody';
    message: string = null;

    public static fromRestResponse(response: RestResponse): BadRequest {
        return new BadRequest(response);
    }

    constructor(response: RestResponse) {
        super(response.body['message']);
        this.message = response.body['message'];
    }
}

// 401
export class UnauthorizedError extends Error {

    code: number = 401;
    name = 'Response_Unauthorized';
    message: string = null;

    static fromRestResponse(response: RestResponse): UnauthorizedError {
        return new UnauthorizedError(response);
    }

    constructor(response: RestResponse) {
        super(response.body['message']);
        this.message = response.body['message'];
    }
}

// 403
export class PermissionMissingError extends Error {

    code: number = 403;
    name = 'Response_Forbidden';
    message: string = null;

    static fromRestResponse(response: RestResponse): PermissionMissingError {
        return new PermissionMissingError(response);
    }

    constructor(response: RestResponse) {
        super(response.body['message']);
        this.message = response.body['message'];
    }
}

// 404
export class ObjectNotFound extends Error {

    code: number = 404;
    name = 'Response_NotFound';
    message: string = null;

    static fromRestResponse(response: RestResponse): ObjectNotFound {
        return new ObjectNotFound(response);
    }

    constructor(response: RestResponse) {
        super(response.body['message']);
        this.message = response.body['message'];
    }
}

// 500
export class InternalServerError extends Error {

    code: number = 500;
    name = 'Response_CriticalError';
    message: string = null;

    static fromRestResponse(response: RestResponse): InternalServerError {
        return new InternalServerError(response);
    }

    constructor(response: RestResponse) {
        super('Critical Server Side Error!');
        this.message = 'Critical Server Side Error!';
    }

}

// 705 - User has not validated email yet! - Byzance private token head
export class UserNotValidatedError extends Error {

    code: number = 705;
    name = 'Response_ValidationRequired';
    message: string = null;

    static fromRestResponse(response: RestResponse): UserNotValidatedError {
        return new InternalServerError(response);
    }

    constructor(response: RestResponse) {
        super('Email Validation is Required');
        this.message = 'Email Validation is Required';
    }
}


/**
 * Special Response From Tyrion Server about Compilation
 */
// 477
export class CodeError extends Error {

    static fromRestResponse(response: RestResponse): CodeError {
        let content = response.body;
        if ((<any>content).message) {
            return new CodeError((<any>content).message);
        }
        if (response.status === 477) {
            return new CodeError(`External server is offline: ${JSON.stringify(content)}`);
        }
        if (response.status === 478) {
            return new CodeError(`External server side error: ${JSON.stringify(content)}`);
        }
        return new CodeError('Unknown error');
    }

    constructor(msg: string) {
        super(msg);
        this.name = 'CodeError';
        this.message = msg;

        Object.setPrototypeOf(this, CodeError.prototype);
    }

}
// 478
export class CodeCompileError extends Error {

    errors: ICodeCompileErrorMessage[] = [];

    static fromRestResponse(response: RestResponse): CodeCompileError {
        let cce = new CodeCompileError(`Compile error.`);
        if (Array.isArray(response.body)) {
            cce.errors = <ICodeCompileErrorMessage[]>response.body;
        }
        return cce;
    }

    constructor(msg: string) {
        super(msg);
        this.name = 'CodeCompileError';
        this.message = msg;

        Object.setPrototypeOf(this, CodeCompileError.prototype);
    }

}



