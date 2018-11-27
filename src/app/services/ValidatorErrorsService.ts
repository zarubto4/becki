/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Injectable } from '@angular/core';
import { TranslationService } from './TranslationService';


@Injectable()
export class ValidatorErrorsService {

    constructor(private translationService: TranslationService) {
        // console.info('ValidatorErrorsService init');
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

            // -- Name taken ------------------------------------------------------------------------------------------
            if (errors['ProjectNameTaken']) {
                return this.translate('label_project_name_taken');
            }
            if (errors['BProgramNameTaken']) {
                return this.translate('label_bprogram_name_taken');
            }
            if (errors['BProgramVersionNameTaken']) {
                return this.translate('label_bprogram_version_name_taken');
            }
            if (errors['CProgramNameTaken']) {
                return this.translate('label_cprogram_name_taken');
            }
            if (errors['CProgramVersionNameTaken']) {
                return this.translate('label_cprogram_version_name_taken');
            }
            if (errors['GridProgramNameTaken']) {
                return this.translate('label_grid_program_name_taken');
            }
            if (errors['GridProgramVersionNameTaken']) {
                return this.translate('label_grid_program_version_name_taken');
            }
            if (errors['GridProjectNameTaken']) {
                return this.translate('label_grid_project_name_taken');
            }
            if (errors['HardwareNameTaken']) {
                return this.translate('label_hardware_name_taken');
            }
            if (errors['GSMNameTaken']) {
                return this.translate('label_gsm_name_taken');
            }
            if (errors['RoleNameTaken']) {
                return this.translate('label_role_name_taken');
            }
            if (errors['BlockNameTaken']) {
                return this.translate('label_block_name_taken');
            }
            if (errors['WidgetNameTaken']) {
                return this.translate('label_widget_name_taken');
            }
            if (errors['InstanceNameTaken']) {
                return this.translate('label_instance_name_taken');
            }
            if (errors['SnapShotNameTaken']) {
                return this.translate('label_snapshot_name_taken');
            }
            // -- Name taken ------------------------------------------------------------------------------------------

            if (errors['hardwareDeviceId']) {
                return this.translateTable(errors['hardwareDeviceId'], 'hardware_device_id');
            }
            if (errors['email']) {
                return this.translate('label_invalid_email');
            }
            if (errors['time']) {
                return this.translate('label_invalid_time');
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
        console.info(errors);
        return this.translate('label_unknown_error');
    }

}
