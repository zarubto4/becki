import { ICProgramFilter } from './../backend/TyrionAPI';
import { Component, Input, Output, EventEmitter, OnInit, NgZone, OnChanges, SimpleChanges, ViewChildren } from '@angular/core';
import {
    IBlock, IBlockVersion, ICProgram, ICProgramVersion, IGridProgram, IGridProgramVersion,
    IGridProject, IShortReference, IWidget, IWidgetVersion
} from '../backend/TyrionAPI';
import { _BaseMainComponent } from '../views/_BaseMainComponent';
import { TyrionBackendService } from '../services/BackendService';
import { TranslationService } from '../services/TranslationService';
import { ModalService } from '../services/ModalService';
import { FlashMessageError, NotificationService } from '../services/NotificationService';
import { CodeFile } from './CodeIDEComponent';
import { FormSelectComponentOption, FormSelectComponent } from './FormSelectComponent';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileTreeRootComponent } from './FileTreeRootComponent';


@Component({
    selector: 'bk-program-version-diff',
    /* tslint:disable:max-line-length */
    template: `
        <div>
            <bk-form-select [options]="versionsListAsOptions"
                            [control]="form.controls['version']"
                            [label]="'label_source_version'|bkTranslate:this"
                            #sourceVersion > </bk-form-select>
            <bk-form-select [options]="versionsListAsOptions"
                            [control]="form.controls['version']"
                            [label]="'label_target_version'|bkTranslate:this"
                            #targetVersion > </bk-form-select>
            <div>
            <bk-file-tree-root *ngIf="codeFilesSource" [files]="codeFilesSource"></bk-file-tree-root>
            </div>
        </div>
    `
    /* tslint:enable */
})
export class ProgramVersionDiffComponent implements OnInit, OnChanges {

    @Input()
    versionList: ICProgramVersion[];

    @ViewChildren('sourceVersion')
    sourceVersion: FormSelectComponent;

    @ViewChildren('targetVersion')
    targetVersion: FormSelectComponent;


    codeFilesSource: CodeFile[];
    codeFilesTarget: CodeFile[];

    versionsListAsOptions: FormSelectComponentOption[];

    form: FormGroup;

    constructor(private formBuilder: FormBuilder, private translationService: TranslationService) {

    }

    ngOnInit() {

        this.form = this.formBuilder.group({
            'version': ['', [Validators.required]]
        });
        if (this.versionList) {
            this.versionsListAsOptions = this.versionList.map((version) => {
                const s = {
                    label: version.id,
                    value: version.id,
                    data: version
                } as FormSelectComponentOption;
                return s;
            });
            let selectedSource = this.versionList.find((version) => {
                return version.id === this.sourceVersion.selectedValue;
            })
            let selectedTarget = this.versionList.find((version) => {
                return version.id === this.targetVersion.selectedValue;
            })

            this.codeFilesSource = selectedSource.program.files.map((file) => {
                return new CodeFile(file.file_name, file.content)
            })
            this.codeFilesTarget = selectedTarget.program.files.map((file) => {
                return new CodeFile(file.file_name, file.content)
            })
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        let versions = changes['versionList'];
        if (versions && versions.currentValue) {
            console.log(versions.currentValue);
            this.versionsListAsOptions = versions.currentValue.map((version) => {
                const s = {
                    label: version.id,
                    value: version.id,
                    data: version
                } as FormSelectComponentOption;
                return s;
            });
            if ( versions.currentValue ) {
                console.log(this.sourceVersion.selectedValue);
                let selectedSource = versions.currentValue.find((version) => {
                    return version.id === this.sourceVersion.selectedValue;
                })
                let selectedTarget = versions.currentValue.find((version) => {
                    return version.id === this.targetVersion.selectedValue;
                })

                this.codeFilesSource = selectedSource.program.files.map((file) => {
                    return new CodeFile(file.file_name, file.content)
                })
                this.codeFilesTarget = selectedTarget.program.files.map((file) => {
                    return new CodeFile(file.file_name, file.content)
                })
            }
        }
    }

    onSelectionChanges() {

    }
}
