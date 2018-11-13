/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { IGSM, IResultBadRequest, IResultInvalidBody } from '../backend/TyrionAPI';
import { MultiSelectComponent } from '../components/MultiSelectComponent';
import { FlashMessage, FlashMessageError, NotificationService } from '../services/NotificationService';
import { TranslationService } from '../services/TranslationService';


export class ModalsAddGSMModel extends ModalModel {
    constructor(
        public project_id: string
    ) {
        super();
    }
}

@Component({
    selector: 'bk-modals-add-gsm',
    templateUrl: './add-gsm.html'
})
export class ModalsAddGSMComponent  implements OnInit {

    @Input()
    modalModel: ModalsAddGSMModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    @Output()
    flashMesseage = new EventEmitter<FlashMessage>();

    form: FormGroup;

    multiForm: FormGroup;

    deviceInfoTextForm: FormGroup;

    registeredGSMs: string[] = [];
    failedGSMs: string[] = [];

    afterFirstConfirm: boolean = false;

    step: string = null;

    @ViewChild('groupList')
    listGroup: MultiSelectComponent;

    single_error_status: string = null;
    single_error_message: string = null;


    GSMsForRegistration: string[] = null;
    inprogress: boolean = false;
    list_finish: boolean = false;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder, private translationService: TranslationService, protected notificationService: NotificationService
    ) {
        this.form = this.formBuilder.group({
            'id' : ['', [Validators.required]]
        });

        this.multiForm = this.formBuilder.group({
            'listOfIds': ['', [Validators.required]]
        });

        this.deviceInfoTextForm = this.formBuilder.group({
            'successfulGSMs': ['', []],
            'failedGSMs': ['', []],
        });
    }

    set_multipleRegistration() {
        this.step = 'multipleRegistration';
    }

    set_singleRegistration() {
        this.step = 'singleRegistration';
    }

    ngOnInit() {

        (<FormControl>(this.form.controls['id'])).setValue('');
        (<FormControl>(this.multiForm.controls['listOfIds'])).setValue('');

    }

    /**
     * Only for Individual HW registration
     * @param hw_value
     * @returns {(control:FormControl)=>Promise<T>}
     */
    onChangeIndividualHashValue(value: string) {
        this.single_error_status = null;
        this.backendService.simCheckRegistrationStatus(value, this.modalModel.project_id)
            .then((result) => {
                // CAN_REGISTER, ALREADY_REGISTERED_IN_YOUR_ACCOUNT, ALREADY_REGISTERED, PERMANENTLY_DISABLED, BROKEN_DEVICE
                this.single_error_status = result.status;
            })
            .catch(() => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_cant_change_hash', this)));
            });
    }

    sequenceRegistration() {

        console.info('Console Registration');
        this.GSMsForRegistration = null;

        this.registeredGSMs = [];
        this.failedGSMs = [];

        this.inprogress = true;

        let data: string = this.multiForm.controls['listOfIds'].value;

        data = data.replace(',', ';');
        data = data.replace(/\s+/g, '');
        data = data.replace(/(\r?\n|\r)*(\s)*/g, '');


        console.info('Result Pred splitem: ', data);
        let GSMsForRegistration: string[] = data.split(';');

        console.info('Result list:', GSMsForRegistration);

        this.GSMsForRegistration = GSMsForRegistration;
        console.info('Result list:',  this.GSMsForRegistration);


        this.sequenceRegistrationPromise(0);

    }


    sequenceRegistrationPromise(pointer: number) {

        if (pointer >= this.GSMsForRegistration.length) {
            console.info('GSMsForRegistration už je empty');
            this.inprogress = false;
            this.list_finish = true;
            return;
        }

        this.backendService.simRegister({
            registration_hash: this.GSMsForRegistration[pointer],
            project_id: this.modalModel.project_id
        })
            .then((gsm: IGSM) => {

                console.error('Podařilo se ', gsm.id );

                this.registeredGSMs.push(gsm.msi_number + ' - Success');
                this.deviceInfoTextForm.controls['successfulGSMs'].setValue(this.registeredGSMs.join(',  \n'));

                this.sequenceRegistrationPromise(++pointer);

            })
            .catch((reason: IResultBadRequest|IResultInvalidBody) => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
                console.error('Nepodařilo se pro ', this.GSMsForRegistration[pointer], ' důvod?', reason.message);
                console.error('Nepodařilo se pro ', this.GSMsForRegistration[pointer], ' důvod?', reason.state);

                if (reason.state === 'invalid_body') {
                    this.failedGSMs.push(this.GSMsForRegistration[pointer] + ': ' + 'Invalid Hash');
                    this.deviceInfoTextForm.controls['failedGSMs'].setValue(this.failedGSMs.join(',  \n'));
                } else {
                    this.failedGSMs.push(this.GSMsForRegistration[pointer] + ': ' + reason.message);
                    this.deviceInfoTextForm.controls['failedGSMs'].setValue(this.failedGSMs.join(',  \n'));
                }

                this.sequenceRegistrationPromise(++pointer);
            });
    }



    singleRegistration() {

        this.single_error_message = null;

        this.backendService.simRegister({
            registration_hash: this.form.controls['id'].value,
            project_id: this.modalModel.project_id
        })
            .then(() => {
                this.modalClose.emit(true);
            })
            .catch(reason => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
                this.single_error_message = reason.body.message;
            });
    }

    onSubmitClick(): void {
        this.afterFirstConfirm = true;
        if (this.step === 'singleRegistration') {
            this.singleRegistration();
        } else {
            this.sequenceRegistration();
        }
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
