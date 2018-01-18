/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Input, Output, EventEmitter, OnInit, NgZone } from '@angular/core';
import { ICProgramShortDetail, ICProgramShortDetailForBlocko, ICProgramVersionShortDetail } from '../backend/TyrionAPI';
import { BaseMainComponent } from '../views/BaseMainComponent';
import { TyrionBackendService } from '../services/BackendService';
import { TranslationService } from '../services/TranslationService';
import { ModalService } from '../services/ModalService';

@Component({
    selector: 'bk-c-program-version-selector',
/* tslint:disable:max-line-length */
    template: `
<div>
    <div class="form-group" [class.col-md-6]="align_horizontal" [class.has-error]="!selectedProgramId">
        <label>Program</label>
        <select class="form-control" [ngModel]="selectedProgramId" (ngModelChange)="onSelectedProgramIdChange($event)">
            <option [value]="null" disabled>Select program</option>
            <option *ngFor="let cProgram of cPrograms" [value]="cProgram.id">{{cProgram.name}}</option>
        </select>
    </div>
    <div class="form-group" [class.col-md-6]="align_horizontal"  [class.has-error]="selectedProgramId && !selectedProgramVersionId">
        <label>Program version</label>
        <select class="form-control" *ngIf="selectedProgram && !(selectedVersions && selectedVersions.length)" disabled>
            <option [value]="null" disabled>No program versions</option>
        </select>
        <select *ngIf="!selectedProgram" class="form-control" disabled>
            <option [value]="null" disabled>&lt; Select program first</option>
        </select>
        <select *ngIf="selectedProgram && (selectedVersions && selectedVersions.length)" class="form-control" [ngModel]="selectedProgramVersionId" (ngModelChange)="onSelectedProgramVersionIdChange($event)">
            <option [value]="null" disabled>Select version</option>
            <option *ngFor="let cProgramVersion of selectedVersions" [value]="cProgramVersion.version_id">{{cProgramVersion.version_name}}{{cProgramVersion.version_description?" - " + cProgramVersion.version_description:""}}</option>
        </select>
    </div>
    <div class="clearfix"></div>
</div>
`
/* tslint:enable */
})

export class CProgramVersionSelectorComponent implements OnInit {

    @Input()
    cPrograms: ICProgramShortDetail[] = null;

    // Fill after select Program
    selectedVersions: ICProgramVersionShortDetail[] = null;

    @Input()
    already_selected_c_program_id: string = null;

    @Input()
    already_selected_c_program_version_id: string = null;

    @Input()
    align_horizontal: boolean = true;

    @Output()
    valueChanged: EventEmitter<string> = new EventEmitter<string>();

    selectedProgram: ICProgramShortDetail = null;
    selectedVersion: ICProgramVersionShortDetail = null;
    selectedProgramId: string = null;
    selectedProgramVersionId: string = null;

    constructor(protected modalService: ModalService, protected zone: NgZone, protected backendService: TyrionBackendService, private translationService: TranslationService) {

    }

    ngOnInit(): void {
        if (this.already_selected_c_program_id) {

            if (this.cPrograms) {

                this.cPrograms.forEach((cp) => {

                    if (cp.id === this.already_selected_c_program_id) {
                        this.selectedProgram = cp;
                        this.selectedProgramId = cp.id;
                    }

                });

                if (this.selectedProgram && this.already_selected_c_program_version_id) {

                    this.backendService.cProgramGet(this.selectedProgramId)
                        .then((program) => {
                            this.selectedVersions = program.program_versions;
                            program.program_versions.forEach((cp) => {
                                if (cp.version_id === this.already_selected_c_program_version_id) {
                                    this.selectedProgramVersionId = cp.version_id;
                                    this.selectedVersion = cp;
                                }
                            });
                        })
                        .catch(reason => {
                        });

                } else {
                    setTimeout(() => {
                        this.already_selected_c_program_version_id = null;
                        this.valueChanged.emit(this.already_selected_c_program_version_id);
                    }, 0); // Think about better solution [DH]
                }
            } else {
                setTimeout(() => {
                    this.already_selected_c_program_id = null;
                    this.valueChanged.emit(this.already_selected_c_program_id);
                }, 0); // Think about better solution [DH]
            }

        }
    }

    public onSelectedProgramGetVersion() {
        this.backendService.cProgramGet(this.selectedProgramId)
            .then((program) => {
                this.selectedVersions = program.program_versions;
            })
            .catch(reason => {
            });
    }

    onSelectedProgramIdChange(newValue: string) {
        if (this.selectedProgramId === newValue) {
            return;
        }
        this.selectedProgramId = newValue;
        this.onSelectedProgramGetVersion();
        this.selectedProgram = this.cPrograms.find((cp) => (cp.id === this.selectedProgramId));
        this.selectedProgramVersionId = null;
        this.already_selected_c_program_version_id = null;
        this.valueChanged.emit(this.already_selected_c_program_version_id);
    }

    onSelectedProgramVersionIdChange(newValue: string) {
        if (this.selectedProgramVersionId === newValue) {
            return;
        }
        this.selectedProgramVersionId = newValue;
        this.already_selected_c_program_version_id = this.selectedProgramVersionId;
        this.valueChanged.emit(this.already_selected_c_program_version_id);
    }

}
