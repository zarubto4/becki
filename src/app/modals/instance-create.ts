/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { IBProgramList, IHomerServerList, IInstance } from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import { TranslationService } from '../services/TranslationService';
import { FlashMessageError, NotificationService } from '../services/NotificationService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import { Instance } from 'awesome-typescript-loader/dist/instance';
import { BeckiValidators } from '../helpers/BeckiValidators';



export class ModalsInstanceCreateModel extends ModalModel {
    public b_program_id: string;
    public main_server_id: string;
    public backup_server_id: string;
    constructor(public project_id: string, public instance?: IInstance) {
        super();
    }
}

@Component({
    selector: 'bk-modals-instance-create',
    templateUrl: './instance-create.html'
})
export class ModalsInstanceCreateComponent implements OnInit {

    @Input()
    modalModel: ModalsInstanceCreateModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;

    public homerList: IHomerServerList = null;
    public bProgram: IBProgramList = null;

    servers_options: FormSelectComponentOption[] = null;
    bProgram_options: FormSelectComponentOption[] = null;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder, public translationService: TranslationService, protected notificationService: NotificationService, ) {
    }

    ngOnInit() {

        this.form = this.formBuilder.group({
            'name': [this.modalModel.instance != null ? this.modalModel.instance.name : '',
                [
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(32)
                ],
                BeckiAsyncValidators.condition(
                    (value) => {
                        return !(this.modalModel && this.modalModel.instance && this.modalModel.instance.name.length > 3 && this.modalModel.instance.name === value);
                    },
                    BeckiAsyncValidators.nameTaken(this.backendService, 'Instance',  this.modalModel.project_id)
                )
            ],
            'description': [this.modalModel.instance != null ? this.modalModel.instance.description : '', [Validators.maxLength(255)]],
            'tags': [this.modalModel.instance != null ? this.modalModel.instance.tags : []],
            'b_program_id': ['',  [BeckiValidators.condition(() => ( !this.modalModel.instance), Validators.required)]],
            'main_server_id': ['',  [BeckiValidators.condition(() => ( !this.modalModel.instance), Validators.required)]],
            'backup_server_id': ['']
        });


        if (!this.modalModel.instance) {
            // Find Homer Server
            setTimeout(() => {
                this.backendService.homerServersGetList(0, {
                    server_types: ['PRIVATE', 'PUBLIC'],
                    project_id: this.modalModel.project_id
                })
                    .then((value) => {
                        this.homerList = value;
                        this.servers_options = this.homerList.content.map((pv) => {

                            let status = this.translationService.translateTable(pv.server_type, this, 'server_type');
                            return {
                                label: pv.name + ' (' + status + ')',
                                value: pv.id,
                            };
                        });
                    })
                    .catch(reason => {
                        this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
                    });

                // Find B_Programs
                this.backendService.bProgramGetListByFilter(0, {
                    project_id: this.modalModel.project_id
                })
                    .then((value) => {
                        this.bProgram = value;
                        this.bProgram_options = this.bProgram.content.map((pv) => {
                            return {
                                label: pv.name + ' ' + pv.description,
                                value: pv.id,
                            };
                        });
                    })
                    .catch(reason => {
                        this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
                    });
            }, 100);

        }
    }


    onSubmitClick(): void {

        if (this.modalModel.instance == null) {
            // @ts-ignore
            this.modalModel.instance = {};
        }

        this.modalModel.instance.name = this.form.controls['name'].value;
        this.modalModel.instance.description = this.form.controls['description'].value;
        this.modalModel.instance.tags = this.form.controls['tags'].value;

        this.modalModel.b_program_id = this.form.controls['b_program_id'].value;
        this.modalModel.main_server_id = this.form.controls['main_server_id'].value;
        this.modalModel.backup_server_id = this.form.controls['backup_server_id'].value;

        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
