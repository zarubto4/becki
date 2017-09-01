/**
 * Created by davidhradek on 15.08.16.
 */

import { Injectable } from '@angular/core';
import { TranslationService } from './TranslationService';


@Injectable()
export class ValidatorErrorsService {

    constructor(private translationService: TranslationService) {
        console.info('ValidatorErrorsService init');
    }
    translate(key: string, ...args: any[]): string {
        return this.translationService.translate(key, this, null, args);
    }

    translateTable(key: string, table: string, ...args: any[]): string {
        return this.translationService.translateTable(key, this, table, null, args);
    }

    getMessageForErrors(errors: any) {
        if (errors) {
            if (errors['required']) {
                return this.translate('label_field_required');
            }
            if (errors['minlength']) {
                return this.translate('label_minimal_length', errors['minlength']['requiredLength']);
            }
            if (errors['maxlength']) {
                return this.translate('label_maximal_length', errors['maxlength']['requiredLength']);
            }
            if (errors['nameTaken']) {
                return this.translate('label_name_taken');
            }
            if (errors['projectNameTaken']) {
                return this.translate('label_project_name_taken');
            }
            if (errors['blockoNameTaken']) {
                return this.translate('label_blocko_name_taken');
            }
            if (errors['hardwareDeviceId']) {
                return this.translateTable(errors['hardwareDeviceId'], 'hardware_device_id');
            }
            if (errors['email']) {
                return this.translate('label_invalid_email');
            }
            if (errors['passwordSame']) {
                return this.translate('label_different_password');
            }
            if (errors['filename']) {
                return this.translate('label_invalid_file_name');
            }
            if (errors['number']) {
                return this.translate('label_field_only_number');
            }
            if (errors['url']) {
                return this.translate('label_field_invalid_url');
            }
            if (errors['entityNotValid']) {
                return this.translateTable(errors['entityNotValid'], 'entity_not_valid', (errors['entityMessage'] ? ' (' + errors['entityMessage'] + ')' : ''));
            }
            if (errors['regExp']) {
                return this.translateTable(errors['regExp'], 'regexp_not_valid');
            }
        }
        return this.translate('label_unknown_error');
    }

}
