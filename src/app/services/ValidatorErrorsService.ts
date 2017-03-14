/**
 * Created by davidhradek on 15.08.16.
 */

import { Injectable } from '@angular/core';

@Injectable()
export class ValidatorErrorsService {

    constructor() {
        console.info('ValidatorErrorsService init');
    }

    getMessageForErrors(errors: any) {
        if (errors) {
            if (errors['required']) {
                return 'This field is required.';
            }
            if (errors['minlength']) {
                return 'Minimal length of this field is ' + errors['minlength']['requiredLength'] + ' characters.';
            }
            if (errors['nameTaken']) {
                return 'This name is already taken.';
            }
            if (errors['projectNameTaken']) {
                return 'This project name is already taken.';
            }
            if (errors['blockoNameTaken']) {
                return 'This blocko name is already taken.';
            }
            if (errors['hardwareDeviceId']) {
                switch (errors['hardwareDeviceId']) {
                    case 'ALREADY_REGISTERED_IN_YOUR_ACCOUNT':
                        return 'The hardware is already registered in your ACC.';
                    case 'ALREADY_REGISTERED':
                        return 'The hardware is already registered.';
                    case 'PERMANENTLY_DISABLED':
                        return 'The hardware is permanently disabled.';
                    case 'BROKEN_DEVICE':
                        return 'The hardware is broken.';
                    case 'NOT_EXIST':
                        return 'The hardware doesn\'t exist.';
                    default:
                        return 'The hardware throws a unexepted state';
                }
            }
            if (errors['email']) {
                return 'Invalid email.';
            }
            if (errors['passwordSame']) {
                return 'Passwords are different.';
            }
            if (errors['filename']) {
                return 'Invalid file/directory name.';
            }
            if (errors['number']) {
                return 'This field only accept numbers.';
            }
            if (errors['entityNotValid']) {
                if (errors['entityNotValid'] === 'mail') {
                    return 'Email is already taken';
                } else if (errors['entityNotValid'] === 'nick_name') {
                    return 'Nick name is already taken';
                } else if (errors['entityNotValid'] === 'vat_number') {
                    return 'Wrong VAT number (type it without spaces, dashes etc.)';
                } else {
                    return 'Entity unknown error.' + (errors['entityMessage'] ? ' (' + errors['entityMessage'] + ')' : '');
                }
            }
            if (errors['regExp']) {
                if (errors['regExp'] === 'street_number') {
                    return 'Wrong street number format, valid is "number" or "number/number" format.';
                }
            }
        }
        return 'Unknown error (' + Object.keys(errors) + ').';
    }

}
