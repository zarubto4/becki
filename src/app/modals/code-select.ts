/**
 * Created by Alexandr Tylš on 03.01.18.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { Input, Output, EventEmitter, Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { TranslationService } from '../services/TranslationService';
import { ICProgram, ICProgramList, ICProgramVersion, IHardwareType } from '../backend/TyrionAPI';
import { ProgramVersionSelectorComponent } from '../components/VersionSelectorComponent';
import { FlashMessageError, NotificationService } from '../services/NotificationService';
import { IError } from '../services/_backend_class/Responses';

export class ModalsSelectCodeModel extends ModalModel {
    public selected_c_program_version: ICProgramVersion = null;
    public selected_c_program: ICProgram = null;
    public file: any = null;

    constructor(
        public project_id: string = null,
        public hardware_type_id: string = null,
        public already_selected_code_for_version_change: {
            c_program_id: string,
            c_program_version_id: string
        } = null) {
        super();
        this.modalLarge = true;
    }
}

@Component({
    selector: 'bk-modals-code-select',
    templateUrl: './code-select.html'
})
export class ModalsCodeSelectComponent implements OnInit {

    @Input()
    modalModel: ModalsSelectCodeModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    @ViewChild(ProgramVersionSelectorComponent)
    versionSelector: ProgramVersionSelectorComponent;

    programs: ICProgramList = null;
    errorMessage: string = null;


    // For Filter parameters
    hardware_type_option: {
        label: string,
        value: string
    }[] = null;

    // Filter parameters
    page: number = 0;
    hardware_type_id: string  = null;
    public_programs: boolean = false;
    private_programs: boolean = true;

    // File Support
    data: any = null;

    constructor(private tyrionBackendService: TyrionBackendService, private formBuilder: FormBuilder, private translationService: TranslationService, protected notificationService: NotificationService) {
        console.info('ModalsCodeSelectComponent: created');
    }

    ngOnInit(): void {

        console.info('onSelectCProgramVersion: ngOnInit modalModel', this.modalModel);

        if (this.modalModel.hardware_type_id) {
            this.hardware_type_id = this.modalModel.hardware_type_id;
        }

        // Expression has changed after it was checked -  setTimeout is protection
        if (!this.modalModel.already_selected_code_for_version_change) {

            // Get All Prerequsities
            Promise.all<any>([
                this.tyrionBackendService.hardwareTypesGetAll()
            ])
                .then((values: [IHardwareType[]]) => {

                    this.hardware_type_option = values[0].map((pv) => {
                        return {
                            label: pv.name,
                            value: pv.id,
                        };
                    });
                    this.onFilterPrograms(0);
                });

        } else {
            this.tyrionBackendService.cProgramGet(this.modalModel.already_selected_code_for_version_change.c_program_id)
                .then((program) => {
                    this.onSelectProgramClick(program);
                })
                .catch((reason: IError) => {
                    this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
                    this.errorMessage = reason.message;
                });
        }
    }

    onSubmitClick(): void {
        if (!this.modalModel.selected_c_program_version && !this.modalModel.file) {
            this.errorMessage = this.translationService.translate('label_no_file_or_version_selected', this) ; // There is no version selected. ;
        } else {
            this.modalClose.emit(true);
        }
    }

    onSelectProgramClick(cprogram: ICProgram): void {
        this.modalModel.selected_c_program = cprogram;
    }

    onSelectProgramVersionClick(version: ICProgramVersion): void {
        this.modalModel.selected_c_program_version = version;
    }

    onBack(cprogram: ICProgram): void {
        this.modalModel.selected_c_program = null;
    }

    onDrobDownEmiter(action: string, object: any): void {
        if (action === 'label_select_code') {
            this.onSelectProgramClick(object);
        }
    }

    onFilterChange(filter: {key: string, value: any}) {
        console.info('onFilterChange: Key', filter.key, 'value', filter.value);

        if (filter.key === 'public_programs') {
            this.public_programs = filter.value;
        }

        if (filter.key === 'private_programs') {
            this.private_programs = filter.value;
        }

        if (filter.key === 'hardware_type_id') {
            this.hardware_type_id = filter.value;
        }

        this.onFilterPrograms();
    }

    fileChangeListener($event: any) {
        let file: File = $event.target.files[0];
        if (file) {
            let myReader: FileReader = new FileReader();
            myReader.addEventListener('load', () => {
                this.data = myReader.result;
                this.modalModel.file = this.data;
            }, false);

            myReader.readAsDataURL(file);
        }


    }

    onFilterPrograms(page?: number): void {

        if (page != null) {
            this.page = page;
        }

        this.programs = null;

        this.tyrionBackendService.cProgramGetListByFilter(this.page, {
            project_id: this.private_programs ? this.modalModel.project_id : null,
            public_programs: this.public_programs,
            hardware_type_ids: [this.hardware_type_id],
            count_on_page: 10
        })
            .then((iCProgramList) => {
                this.programs = iCProgramList;
            })
            .catch((reason: IError) => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
            });
    }


    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
