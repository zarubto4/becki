/**
 * Created by davidhradek on 15.08.16.
 */

import {Injectable} from "@angular/core";

@Injectable()
export class ValidatorErrorsService {

    constructor() {
        console.log("ValidatorErrorsService init");
    }

    getMessageForErrors(errors: any) {
        if (errors) {
            if (errors["required"]) return "This field is required.";
            if (errors["minlength"]) return "Minimal length of this field is " + errors["minlength"]["requiredLength"] + " characters.";
            if (errors["nameTaken"]) return "This name is already taken.";
            if (errors["projectNameTaken"]) return "This project name is already taken.";
            if (errors["blockoNameTaken"]) return "This blocko name is already taken.";
            if (errors["email"]) return "Invalid email.";
            if (errors["passwordSame"]) return "Passwords are different.";
            if (errors["filename"]) return "Invalid file/directory name.";
            if (errors["number"]) return "This field only accept numbers.";
            if (errors["generalVATnumber"]) return "Invalid VATnumber format.";
        }
        return "Unknown error (" + Object.keys(errors) + ").";
    }

}