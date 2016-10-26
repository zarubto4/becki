/**
 * Created by davidhradek on 03.08.16.
 */

import {AbstractControl, ValidatorFn, FormGroup} from "@angular/forms";

export class BeckiValidators {

    public static email: ValidatorFn = (c: AbstractControl) => {
        if (c.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)) {
            return null; // valid
        }
        return {"email": true}; // invalid
    };

    public static number: ValidatorFn = (c: AbstractControl) => {
        if (c.value.match(/^[0-9]/)) {
            return null; // valid
        }
        return {"number": true}; // invalid
    };

    public static condition(conditionCallback: ()=>boolean, validator: ValidatorFn): ValidatorFn {
        return (a: AbstractControl) => {
            if (conditionCallback) {
                var f = conditionCallback();
                if (f) {
                    return validator(a);
                }
            }
            return null; // valid
        };
    }

    public static passwordSame(form: ()=>FormGroup, fieldName: string): ValidatorFn {
        return (a: AbstractControl) => {
            if (form) {
                var f = form();
                if (f && f.controls[fieldName]) {
                    if (a.value == f.controls[fieldName].value) {
                        return null; // valid
                    }
                }
            }
            return {"passwordSame": true}; // invalid
        };
    }


    public static filename: ValidatorFn = (c: AbstractControl) => {
        // http://stackoverflow.com/questions/11100821/javascript-regex-for-validating-filenames
        if (c.value.match(/^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/)) {
            return null; // valid
        }
        return {"filename": true}; // invalid
    }

}