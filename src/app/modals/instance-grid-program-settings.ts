/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TyrionBackendService } from '../services/BackendService';
import { ModalModel } from '../services/ModalService';
import { BeckiAsyncValidators } from '../helpers/BeckiAsyncValidators';
import {
    IBProgramVersionSnapGridProject,
    IBProgramVersionSnapGridProjectProgram, ISwaggerInstanceSnapShotConfiguration,
    ISwaggerInstanceSnapShotConfigurationFile,
    ISwaggerInstanceSnapShotConfigurationProgram
} from '../backend/TyrionAPI';
import { FormSelectComponentOption } from '../components/FormSelectComponent';


export class ModalsGridProgramSettingsModel extends ModalModel {
    constructor(public project: IBProgramVersionSnapGridProject = null, public program: IBProgramVersionSnapGridProjectProgram = null, public settings: ISwaggerInstanceSnapShotConfiguration = null) {
        super();
    }
}

@Component({
    selector: 'bk-modals-instance-grid-program-settings',
    templateUrl: './instance-grid-program-settings.html'
})
export class ModalsGridProgramSettingsComponent implements OnInit {

    @Input()
    modalModel: ModalsGridProgramSettingsModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    form: FormGroup;
    access_option: FormSelectComponentOption[] = null;
    settings_copy: ISwaggerInstanceSnapShotConfiguration = null;

    constructor(private backendService: TyrionBackendService, private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            'selected_access': ['', [Validators.required]],
        });

        this.access_option = [
            {
                label: 'Project Members Access',
                value: 'PROJECT',
            },
            {
                label: 'Absolutely public',
                value: 'PUBLIC',
            }
        ];
    }

    ngOnInit() {
        this.settings_copy = JSON.parse(JSON.stringify(this.modalModel.settings));
        this.form.controls['selected_access'].setValue(this.getGridConfig(this.modalModel.project.grid_project.id, this.modalModel.program.grid_program.id).snapshot_settings);
    }

    getGridConfig(project_id: string, program_id: string): ISwaggerInstanceSnapShotConfigurationProgram {

        if (this.settings_copy.grids_collections == null || this.settings_copy.grids_collections.length === 0) {
            return null;
        }
        let program_project: ISwaggerInstanceSnapShotConfigurationFile = this.settings_copy.grids_collections.find((gr) => {
            return gr.grid_project_id === project_id;
        });
        return program_project.grid_programs.find((gpr) => {
            return gpr.grid_program_id === program_id;
        });
    }


    onSubmitClick(): void {
        this.getGridConfig(this.modalModel.project.grid_project.id, this.modalModel.program.grid_program.id).snapshot_settings =  this.form.controls['selected_access'].value;
        this.modalModel.settings = this.settings_copy;
        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
