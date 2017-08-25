/**
 * Created by dominikkrisztof on 24/08/16.
 */

import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { NotificationService, Notification, FlashMessage } from '../services/NotificationService';
import { BackendService } from '../services/BackendService';
import { FlashMessageSuccess, FlashMessageError } from '../services/NotificationService';
import { FormGroup, Validators } from '@angular/forms';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { StaticOptionLists } from '../helpers/StaticOptionLists';
import { ModalsPictureUploadModel } from '../modals/picture-upload';
import { IPerson, ISecurityRole } from '../backend/TyrionAPI';

@Component({
    selector: 'bk-view-profile',
    templateUrl: './profile.html'
})
export class ProfileComponent extends BaseMainComponent implements OnInit {

    emailForm: FormGroup;
    passwordForm: FormGroup;
    infoForm: FormGroup;

    personId: string;

    person: IPerson = null;
    roles: ISecurityRole[] = null;

    email: string;

    countryList: FormSelectComponentOption[] = StaticOptionLists.countryList;
    genderList: FormSelectComponentOption[] = StaticOptionLists.genderList;

    openTabName = 'personal';

    constructor(injector: Injector, public backendService: BackendService, protected notificationService: NotificationService) {
        super(injector);

        this.emailForm = this.formBuilder.group({
            'currentEmail': ['', [Validators.required, Validators.minLength(8), BeckiValidators.email]], // TODO kontrola zda sedí s původním emailem
            'newEmail': ['', [Validators.required, BeckiValidators.email]],
            'newEmailConfirm': ['', [Validators.required, BeckiValidators.email, BeckiValidators.passwordSame(() => this.emailForm, 'newEmail')]],
        });

        this.passwordForm = this.formBuilder.group({
            'currentPassword': ['', [Validators.required, Validators.minLength(8)]], // TODO kontrola zda sedí s původním heslem
            'newPassword': ['', [Validators.required, Validators.minLength(8)]],
            'newPasswordConfirm': ['', [Validators.required, Validators.minLength(8), BeckiValidators.passwordSame(() => this.passwordForm, 'newPassword')]],
        });

        this.infoForm = this.formBuilder.group({
            'fullName': ['', [Validators.required, Validators.minLength(8)]],
            'nickName': ['', [Validators.required, Validators.minLength(4)]],
            'interests': ['', [Validators.required, Validators.minLength(8)]],
            'state': ['', [Validators.required, Validators.minLength(4)]],
            'gender': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]]
        });

    };

    onTabClick(tabName: string) {
        this.openTabName = tabName;
    }

    ngOnInit(): void {

        let personObject = this.backendService.personInfoSnapshot;

        this.personId = personObject.id;

        this.refresh();
    }


    refresh(): void {
        this.blockUI();
        this.backendService.personGetByToken() // TODO [permission]: Project.read_permission
            .then((iLoginResult) => {

                this.person = iLoginResult.person;
                this.roles  = iLoginResult.roles;

                this.infoForm.controls['fullName'].setValue(this.person.full_name);
                this.infoForm.controls['nickName'].setValue(this.person.nick_name);
                this.infoForm.controls['state'].setValue(this.person.country);
                this.infoForm.controls['gender'].setValue(this.person.gender);

                this.backendService.refreshPersonInfo();

                this.unblockUI();

            })
            .catch((reason) => {
                this.fmError(this.translate('label_cant_load_device'));
                this.unblockUI();
            });
    }


    changePassword(): void {
        this.blockUI();
        this.backendService.personEditProperty({
            property: 'password',
            password: this.passwordForm.controls['newPassword'].value
        })
            .then(ok => {
                this.unblockUI();
                this.backendService.logout()
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_email_was_send')));
                        this.navigate(['/login']);
                    })
                    .catch((error) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_user_cant_log_out')));
                    });
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_email_was_send')));
            })
            .catch(error => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_change_password', error)));
            });
    }

    updatePictureClick(): void {
        let model = new ModalsPictureUploadModel(null, this.person.picture_link, true);

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.personUploadPicture({ // TODO [permission]: version.update_permission
                    file: model.file
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_picture_uploaded')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_picture_upload', reason)));
                        this.refresh();
                    });
            }
        });
    }

    changeEmail(): void {
        this.blockUI();
        this.backendService.entityValidation({ key: 'mail', value: this.emailForm.controls['newEmail'].value }).then(response => {
            if (response.valid) {
                this.backendService.personEditProperty({
                    property: 'email',
                    email: this.emailForm.controls['newEmail'].value
                })
                    .then(ok => {
                        this.unblockUI();
                        this.backendService.logout()
                            .then(() => {
                                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_email_was_send')));
                                this.navigate(['/login']);
                            })
                            .catch((error) => {
                                this.addFlashMessage(new FlashMessageError(this.translate('flash_user_cant_log_out', error)));
                            });
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_email_was_send')));
                    })
                    .catch(error => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_change_email', error)));
                    });
            } else {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_change_email, ', response.message)));
            }
        });
    }

    changeInfo(): void {
        this.blockUI();
        this.backendService.personEdit(this.personId, {
            nick_name: this.infoForm.controls['nickName'].value,
            country: this.infoForm.controls['state'].value,
            full_name: this.infoForm.controls['fullName'].value,
            gender: this.infoForm.controls['gender'].value
        })
            .then((ok) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_information_updated')));
                this.refresh();
            })
            .catch((error) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_change_information', error)));
            });
    }
}
