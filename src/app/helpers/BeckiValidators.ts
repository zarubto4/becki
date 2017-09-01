/**
 * Created by davidhradek on 03.08.16.
 */

import { AbstractControl, ValidatorFn, FormGroup } from '@angular/forms';

export class BeckiValidators {

    public static regExp(name: string, regExp: RegExp): ValidatorFn {
        return (a: AbstractControl) => {
            if (a.value.match(regExp)) {
                return null; // valid
            }
            return {regExp: name}; // invalid
        };
    }

    public static email: ValidatorFn = (c: AbstractControl) => {
        if (c.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            return null; // valid
        }
        return {'email': true}; // invalid
    }

    public static url: ValidatorFn = (c: AbstractControl) => {

        if (c.value.indexOf('.') === -1) {
            return {'url': true}; // invalid
        }

        if (c.value.match('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$')) {
            return null; // valid
        }
        return {'url': true}; // invalid
    }

    public static number: ValidatorFn = (c: AbstractControl) => {
        try {

            if (c === null ) {
                return {'number': true}; // invalid
            }

            if (c.value.match(/^[0-9]+([\/][0-9]+)?$/)) {
                return null; // valid
            }

            return {'number': true}; // invalid

        } catch (e) {
            return {'number': true}; // invalid
        }
    }

    public static condition(conditionCallback: (value: string) => boolean, validator: ValidatorFn): ValidatorFn {
        return (a: AbstractControl) => {
            if (conditionCallback) {
                let f = conditionCallback(a.value);
                if (f) {
                    return validator(a);
                }
            }
            return null; // valid
        };
    }

    public static passwordSame(form: () => FormGroup, fieldName: string): ValidatorFn {
        return (a: AbstractControl) => {
            if (form) {
                let f = form();
                if (f && f.controls[fieldName]) {
                    if (a.value === f.controls[fieldName].value) {
                        return null; // valid
                    }
                }
            }
            return {'passwordSame': true}; // invalid
        };
    }


    public static filename: ValidatorFn = (c: AbstractControl) => {
        // http://stackoverflow.com/questions/11100821/javascript-regex-for-validating-filenames
        if (c.value.match(/^(?!\.)(?!com[0-9]$)(?!con$)(?!lpt[0-9]$)(?!nul$)(?!prn$)[^\|\*\?\\:<>/$"]*[^\.\|\*\?\\:<>/$"]+$/)) {
            return null; // valid
        }
        return {'filename': true}; // invalid
    }

}
