/**
 * Created by davidhradek on 20.09.16.
 */

import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import {ICProgram, ISwaggerCProgramShortDetailForBlocko} from "../backend/TyrionAPI";

@Component({
    selector: "c-program-version-selector",
    template: `
<div>
    <div class="form-group col-md-6" [class.has-error]="!selectedProgramId">
        <label>Program</label>
        <select class="form-control" [ngModel]="selectedProgramId" (ngModelChange)="onSelectedProgramIdChange($event)">
            <option [value]="null" disabled>Select program</option>
            <option *ngFor="let cProgram of cPrograms" [value]="cProgram.id">{{cProgram.name}}</option>
        </select>
    </div>
    <div class="form-group col-md-6" [class.has-error]="selectedProgramId && !selectedProgramVersionId">
        <label>Program version</label>
        <select *ngIf="!selectedProgram" class="form-control" disabled>
            <option [value]="null" disabled>&lt; Select program first</option>
        </select>
        <select *ngIf="selectedProgram" class="form-control" [ngModel]="selectedProgramVersionId" (ngModelChange)="onSelectedProgramVersionIdChange($event)">
            <option [value]="null" disabled>Select version</option>
            <option *ngFor="let cProgramVersion of selectedProgram.versions" [value]="cProgramVersion.id">{{cProgramVersion.version_name}}</option>
        </select>
    </div>
    <div class="clearfix"></div>
</div>
`
})
export class CProgramVersionSelector implements OnInit {

    @Input()
    cPrograms: ISwaggerCProgramShortDetailForBlocko[] = null;

    @Input()
    value: string = null;

    @Output()
    valueChanged: EventEmitter<string> = new EventEmitter<string>();

    selectedProgram: ISwaggerCProgramShortDetailForBlocko = null;
    selectedProgramId: string = null;
    selectedProgramVersionId: string = null;

    constructor() {
    }

    ngOnInit(): void {
        if (this.value) {

            if (this.cPrograms) {
                this.cPrograms.forEach((cp) => {

                    var isThis = false;
                    cp.versions.forEach((pv) => {
                        if (pv.id == this.value) {
                            isThis = true;
                        }
                    });
                    if (isThis) {
                        this.selectedProgram = cp;
                        this.selectedProgramId = cp.id;
                    }

                });

                if (this.selectedProgram) {
                    this.selectedProgramVersionId = this.value
                } else {
                    this.value = null;
                    this.valueChanged.emit(this.value);
                }
            } else {
                this.value = null;
                this.valueChanged.emit(this.value);
            }

        }
    }

    onSelectedProgramIdChange(newValue: string) {
        if (this.selectedProgramId == newValue) return;
        this.selectedProgramId = newValue;
        this.selectedProgram = this.cPrograms.find((cp) => (cp.id == this.selectedProgramId));
        this.selectedProgramVersionId = null;
        this.value = null;
        this.valueChanged.emit(this.value);
    }

    onSelectedProgramVersionIdChange(newValue: string) {
        if (this.selectedProgramVersionId == newValue) return;
        this.selectedProgramVersionId = newValue;
        this.value = this.selectedProgramVersionId;
        this.valueChanged.emit(this.value);
    }

}