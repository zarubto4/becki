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

}