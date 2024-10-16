// INTERFACES - Compiler

import { IWebSocketMessage } from '../websocket/WebSocketMessage';

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
    state: string;

    constructor(status: number, body: Object) {
        this.status = status;
        this.body = body;
        this.state = body['state'];
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

        /**
        if (response.status === 400) {
            content = (<{ exception: Object }>response.body).exception;
            message = (<{ message: string }>response.body).message;
            if (!message) {
                message = (<{ error: string }>response.body).error;
            }
        }
        */
        return new BugFoundError(response.body, `response ${response.status}: ${JSON.stringify(content)}`, message);
    }

    static fromWsResponse(response: IWebSocketMessage): BugFoundError {
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


export abstract class IError {
    public code: number = null;
    public state: string = null;
    public message: string = null;

    constructor(public response: RestResponse, public name: string) {

        if (!response) {
            return;
        }

        this.state = response.state;
        this.code = response.body['code'];
        this.message = response.body['message'];
    }

}

/**
 * Default Error Response From Tyrion
 */

export class LostConnectionError extends IError {

    constructor() {
        super(null, 'Lost_Connection' );
        this.code = 0;
        this.name = 'Response_BadRequest';
        this.message = 'Request failed, please check your internet connection.';
    }
}

// 400 - Something is wrong
export class BadRequest extends IError {

    public static fromRestResponse(response: RestResponse): BadRequest {
        return new BadRequest(response);
    }

    constructor(response: RestResponse) {
        super(response, 'Response_BadRequest' );
    }
}

// 400 - InvalidBody - Probably Message only for developers
export class InvalidBody extends IError {

    public static fromRestResponse(response: RestResponse): InvalidBody {
        return new InvalidBody(response);
    }

    constructor(response: RestResponse) {
        super(response, 'Response_InvalidBody' );
    }
}

// 400 - InvalidBody - Probably Message only for developers
export class UnsupportedException extends IError {

    public static fromRestResponse(response: RestResponse): UnsupportedException {
        return new UnsupportedException(response);
    }

    constructor(response: RestResponse) {
        super(response, 'Unsupported_exception');
    }
}

// 401
export class UnauthorizedError extends IError {


    static fromRestResponse(response: RestResponse): UnauthorizedError {
        return new UnauthorizedError(response);
    }

    constructor(response: RestResponse) {
        super(response, 'Response_Unauthorized');
    }
}

// 403
export class PermissionMissingError extends IError {

    static fromRestResponse(response: RestResponse): PermissionMissingError {
        return new PermissionMissingError(response);
    }

    constructor(response: RestResponse) {
        super(response, 'Response_Forbidden');
    }
}

// 404
export class ObjectNotFound extends IError {

    static fromRestResponse(response: RestResponse): ObjectNotFound {
        return new ObjectNotFound(response);
    }

    constructor(response: RestResponse) {
        super(response, 'Response_NotFound');
    }
}

// 500
export class InternalServerError extends IError {

    static fromRestResponse(response: RestResponse): InternalServerError {
        return new InternalServerError(response);
    }

    constructor(response: RestResponse) {
        super(response, 'Response_CriticalError');
        this.code = 500;
        this.state = response.state;
        if ( response.body['message']) {
            this.message = response.body['message'];
        } else {
            this.message = 'Critical Server Side Error!';
        }
    }

}

// 705 - User has not validated email yet! - Byzance private token head
export class UserNotValidatedError extends IError {

    static fromRestResponse(response: RestResponse): UserNotValidatedError {
        return new UserNotValidatedError(response);
    }

    constructor(response: RestResponse) {
        super(response, 'Response_ValidationRequired');
        this.message = 'Email Validation is Required';
        this.code = 705;
        this.state = response.state;
        this.name = 'Response_ValidationRequired';
    }
}


/**
 * Special Response From Tyrion Server about Compilation
 */
// 477
export class CodeError extends IError {

    static fromRestResponse(response: RestResponse): CodeError {
        let content = response.body;
        if ((<any>content).message) {
            return new CodeError(response.status, (<any>content).message);
        }
        if (response.status === 477) {
            return new CodeError(477, `External server is offline: ${JSON.stringify(content)}`);
        }
        if (response.status === 478) {
            return new CodeError(478, `External server side error: ${JSON.stringify(content)}`);
        }
        return new CodeError(478, 'Unknown error');
    }

    constructor(code: number, msg: string) {
        super(null, 'CodeError');
        this.name = 'CodeError';
        this.message = msg;
        this.code = code;

        Object.setPrototypeOf(this, CodeError.prototype);
    }

}
// 478
export class CodeCompileError extends IError {

    errors: ICodeCompileErrorMessage[] = [];

    static fromRestResponse(response: RestResponse): CodeCompileError {
        let cce = new CodeCompileError(`Compile error.`);
        if (Array.isArray(response.body)) {
            cce.errors = <ICodeCompileErrorMessage[]>response.body;
        }
        return cce;
    }

    constructor(msg: string) {
        super(null, 'CodeError');
        this.name = 'CodeCompileError';
        this.message = msg;
        this.code = 478;
        Object.setPrototypeOf(this, CodeCompileError.prototype);
    }

}



