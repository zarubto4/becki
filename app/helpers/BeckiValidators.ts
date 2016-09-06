/**
 * Created by davidhradek on 03.08.16.
 */

import {AbstractControl, ValidatorFn} from "@angular/forms";

export class BeckiValidators {

    public static email:ValidatorFn = (c: AbstractControl) => {
        if (c.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
            return null; // valid
        }
        return {"email": true}; // invalid
    }
    public static passwordConfirm:ValidatorFn = (a:AbstractControl/*,b:AbstractControl*/) => {
        if (a.value /*== b.value*/) { //TODO dodělat zítra validátor na confirm password //a.value.match??
            return null; // valid
        }
        return {"password": true}; // invalid
    }

    public static filename:ValidatorFn = (c: AbstractControl) => {
        // http://stackoverflow.com/questions/11100821/javascript-regex-for-validating-filenames
        if (c.value.match(/^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/)) {
            return null; // valid
        }
        return {"filename": true}; // invalid
    }

}