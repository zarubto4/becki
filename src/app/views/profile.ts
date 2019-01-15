/**
 * Created by dominikkrisztof on 24/08/16.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { NotificationService } from '../services/NotificationService';
import { TyrionBackendService } from '../services/BackendService';
import { FlashMessageSuccess, FlashMessageError } from '../services/NotificationService';
import { FormGroup, Validators } from '@angular/forms';
import { BeckiValidators } from '../helpers/BeckiValidators';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { StaticOptionLists } from '../helpers/StaticOptionLists';
import { ModalsPictureUploadModel } from '../modals/picture-upload';
import { IAuthorizationToken, ILoginToken, IPerson, IRole } from '../backend/TyrionAPI';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-profile',
    templateUrl: './profile.html'
})
export class ProfileComponent extends _BaseMainComponent implements OnInit {

    emailForm: FormGroup;
    passwordForm: FormGroup;
    infoForm: FormGroup;

    personId: string;

    person: IPerson = null;
    roles: IRole[] = null;

    email: string;
    login_tokens: IAuthorizationToken[] = null;
    permanent_tokens: Array<IAuthorizationToken>;

    countryList: FormSelectComponentOption[] = StaticOptionLists.countryList;
    genderList: FormSelectComponentOption[] = StaticOptionLists.genderList;

    tab = 'personal';

    constructor(injector: Injector, public backendService: TyrionBackendService, protected notificationService: NotificationService) {
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
            'first_name': ['', [Validators.required, Validators.minLength(2)]],
            'last_name': ['', [Validators.required, Validators.minLength(2)]],
            'nickName': ['', [Validators.required, Validators.minLength(4)]],
            'interests': ['', [Validators.required, Validators.minLength(8)]],
            'country': ['', [Validators.required, Validators.minLength(4)]],
            'gender': ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]]
        });

    };

    ngOnInit(): void {

        let personObject = this.backendService.personInfoSnapshot;


        this.personId = personObject.id;

        this.refresh();
    }


    onToggleTab(tab: string) {
        this.tab = tab;

        if (tab === 'logins' && !this.login_tokens) {
            this.refresh_login_tokens();
        }
    }

    onPortletClick(btn: string) {
        if (btn === 'add_apikey') {
            this.addApiKey();
        }
    }

    refresh(): void {
        this.blockUI();
        this.backendService.personGetByToken() // TODO [permission]: Project.read_permission
            .then((iLoginResult) => {

                this.person = iLoginResult.person;
                this.roles = iLoginResult.roles;

                this.infoForm.controls['first_name'].setValue(this.person.first_name);
                this.infoForm.controls['last_name'].setValue(this.person.last_name);
                this.infoForm.controls['nickName'].setValue(this.person.nick_name);
                this.infoForm.controls['country'].setValue(this.person.country);
                this.infoForm.controls['gender'].setValue(this.person.gender);
                this.emailForm.controls['currentEmail'].setValue(this.person.email);

                this.backendService.refreshPersonInfo();

                this.unblockUI();

            })
            .catch((reason: IError) => {
                this.fmError(this.translate('label_cant_load_device'));
                this.unblockUI();
            });
    }

    refresh_login_tokens(): void {
        this.blockUI();
        this.backendService.personGetLoggedConnections()
            .then((tokens) => {

                this.login_tokens = tokens.filter(t => !!t.access_age);
                this.permanent_tokens = tokens.filter(t => !t.access_age);
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.fmError(this.translate('label_cannot_load_tokens'));
                this.unblockUI();
            });
    }

    addApiKey() {
        this.blockUI();
        this.tyrionBackendService.apikeyAdd()
            .then((token: ILoginToken) => {
                this.refresh_login_tokens();
                this.unblockUI();
                this.fmSuccess(this.translate('flash_token_added'));
            })
            .catch((reason: IError) => {
                this.fmError(this.translate('flash_cannot_add_token'), reason);
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
                        let message = new FlashMessageSuccess(this.translate('flash_email_was_send'), null);
                        message.closeTime = 10000;

                        this.addFlashMessage(message);
                        this.navigate(['/login']);
                    })
                    .catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_user_cant_log_out')));
                    });
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_email_was_send')));
            })
            .catch((reason: IError) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_change_password'), reason));
            });
    }

    onLoginTokenDeleteClick(token: IAuthorizationToken): void {
        this.backendService.personDeleteLoggedConnections(token.id)
            .then(() => {
                this.refresh_login_tokens();
            })
            .catch((reason: IError) => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_picture_upload'), reason));
                this.refresh();
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
                    .catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_picture_upload'), reason));
                        this.refresh();
                    });
            }
        });
    }

    changeEmail(): void {
        this.blockUI();
        this.backendService.entityValidation({
            key: 'email',
            value: this.emailForm.controls['newEmail'].value
        }).then(response => {
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
                            .catch((reason: IError) => {
                                this.addFlashMessage(new FlashMessageError(this.translate('flash_user_cant_log_out'), reason));
                            });
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_email_was_send')));
                    })
                    .catch((reason: IError) => {
                        this.unblockUI();
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_change_email'), reason));
                    });
            } else {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_change_email'), response.message));
            }
        });
    }

    changeInfo(): void {
        this.blockUI();
        this.backendService.personEdit(this.personId, {
            nick_name: this.infoForm.controls['nickName'].value,
            country: this.infoForm.controls['country'].value,
            first_name: this.infoForm.controls['first_name'].value,
            last_name: this.infoForm.controls['last_name'].value,
            gender: this.infoForm.controls['gender'].value
        })
            .then((ok) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_information_updated')));
                this.refresh();
            })
            .catch((reason: IError) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_change_information', reason)));
            });
    }

    onDrobDownEmiter(action: string, login_token: IAuthorizationToken): void {

        if (action === 'login_token_delete') {
            this.onLoginTokenDeleteClick(login_token);
        }
    }
}
