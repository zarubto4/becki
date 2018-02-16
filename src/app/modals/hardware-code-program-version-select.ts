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
    ICProgramShortDetail, ICProgramVersionShortDetail,
    ILibrary, ILibraryShortDetail, IMProgramShortDetailForBlocko,
    IMProjectShortDetailForBlocko
} from '../backend/TyrionAPI';


export class ModalsHardwareCodeProgramVersionSelectModel extends ModalModel {
    constructor(public projectId: string, public hardwareTypeId: string, public selectedProgramVersion: ICProgramVersionShortDetail = null) {
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

    codePrograms: ICProgramShortDetail[] = null;

    selectedProgram: ICProgramShortDetail = null;

    programVersions: ICProgramVersionShortDetail[] = null;

    selectedProgramVersion: ICProgramVersionShortDetail = null;

    loading = false;

    constructor(private backendService: TyrionBackendService) {
    }

    loadProject() {

        this.loading = true;
        this.backendService.projectGet(this.modalModel.projectId)
            .then((p) => {
                this.loading = false;
                this.codePrograms = p.c_programs.filter((cp) => cp.type_of_board_id === this.modalModel.hardwareTypeId);

            })
            .catch((e) => {
                this.loading = false;
            });

    }

    onBackClick() {
        this.selectedProgram = null;
        this.programVersions = null;
        this.selectedProgramVersion = null;
    }

    onProgramClick(program: ICProgramShortDetail) {
        this.selectedProgram = program;
        this.programVersions = null;
        this.selectedProgramVersion = null;
        this.loading = true;
        this.backendService.cProgramGet(program.id)
            .then((p) => {
                this.loading = false;
                this.programVersions = p.program_versions;
            })
            .catch((e) => {
                this.loading = false;
            });
    }

    onProgramVersionClick(programVersion: ICProgramVersionShortDetail) {
        if (programVersion.status !== 'successfully_compiled_and_restored') {
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
