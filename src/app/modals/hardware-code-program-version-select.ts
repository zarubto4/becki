/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
import {
    ICProgram, ICProgramFilter, ICProgramList, ICProgramVersion, ILibrary, ILibraryVersion
} from '../backend/TyrionAPI';
import { FlashMessageError, NotificationService } from '../services/NotificationService';
import { TranslationService } from '../services/TranslationService';


export class ModalsHardwareCodeProgramVersionSelectModel extends ModalModel {
    constructor(public projectId: string, public hardwareTypeId: string, public selectedProgramVersion: ICProgramVersion = null) {
        super();
    }
}

@Component({
    selector: 'bk-modals-hardware-code-program-version-select',
    templateUrl: './hardware-code-program-version-select.html'
})
export class ModalsHardwareCodeProgramVersionSelectComponent implements OnInit {

    @Input()
    modalModel: ModalsHardwareCodeProgramVersionSelectModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    codePrograms: ICProgramList = null;

    selectedProgram: ICProgram = null;

    programVersions: ICProgramVersion[] = null;

    selectedProgramVersion: ICProgramVersion = null;

    constructor(private backendService: TyrionBackendService, private translationService: TranslationService, protected notificationService: NotificationService) {
    }

    loadProject() {

        this.backendService.cProgramGetListByFilter( 0, {
            project_id :  this.modalModel.projectId,
            hardware_type_ids : [this.modalModel.hardwareTypeId]
        }).then((p) => {
            this.codePrograms = p;
        }).catch(reason => {
            this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
        });
    }

    onBackClick() {
        this.selectedProgram = null;
        this.programVersions = null;
        this.selectedProgramVersion = null;
    }

    onProgramClick(program: ICProgram) {
        this.selectedProgram = program;
        this.programVersions = null;
        this.selectedProgramVersion = null;
        this.codePrograms = null;
        this.backendService.cProgramGet(program.id)
            .then((p) => {
                this.programVersions = p.program_versions;
            })
            .catch(reason => {
                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_fail', this), reason));
            });
    }

    onProgramVersionClick(programVersion: ICProgramVersion) {
        if (programVersion.status !== 'SUCCESS') {
            return;
        }
        this.selectedProgramVersion = programVersion;
    }

    ngOnInit() {
        setTimeout(() => {
            this.loadProject();
        }, 1);
    }

    onSubmitClick(): void {
        if (this.selectedProgramVersion) {
            this.modalModel.selectedProgramVersion = this.selectedProgramVersion;
        }
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
