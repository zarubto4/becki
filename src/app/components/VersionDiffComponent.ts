import { ICProgramFilter } from './../backend/TyrionAPI';
import { Component, Input, Output, EventEmitter, OnInit, NgZone, OnChanges, SimpleChanges, ViewChildren, AfterViewInit } from '@angular/core';
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
import { MonacoDiffComponent } from './MonacoDiffComponent';

@Component({
    selector: 'bk-program-version-diff',
    /* tslint:disable:max-line-length */
    template: `
        <div>
            <bk-form-select [options]="versionsListAsOptions"
                            [control]="form.controls['versionSource']"
                            [label]="'label_source_version'|bkTranslate:this"
                            (valueChanged)="onSourceSelectionChanges($event)"
                            #sourceVersion > </bk-form-select>
            <bk-form-select [options]="versionsListAsOptions"
                            [control]="form.controls['versionTarget']"
                            (valueChanged)="onTargetSelectionChanges($event)"
                            [label]="'label_target_version'|bkTranslate:this"
                            #targetVersion > </bk-form-select>
            <div>
            <bk-file-tree-root *ngIf="codeFilesTarget"
                              [files]="codeFilesTarget"
                              (newPathSelected)="onFileSelected($event)" ></bk-file-tree-root>
            <bk-monaco-diff [originalCode] = "sourceFileContent"
                            [code] = "targetFileContent"
            > </bk-monaco-diff>
            </div>
        </div>
    `
    /* tslint:enable */
})
export class ProgramVersionDiffComponent implements OnInit, OnChanges, AfterViewInit {

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

    sourceFileContent: string;
    targetFileContent: string;

    constructor(private formBuilder: FormBuilder, private translationService: TranslationService) {
        this.form = this.formBuilder.group({
            'versionTarget': ['', [Validators.required]],
            'versionSource': ['', [Validators.required]]
        });
    }

    ngOnInit() {

    }

    ngAfterViewInit(): void {
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
                return version.id === this.form.controls['versionSource'].value;
            })
            let selectedTarget = this.versionList.find((version) => {
                return version.id === this.form.controls['versionTarget'].value;
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
        }
    }

    onSourceSelectionChanges(value: String) {
        const selectedVersion =  this.versionList.find((version) => {
            return version.id === value;
        })
        let files = selectedVersion.program.files.map((file) => {
            return new CodeFile(file.file_name, file.content)
        })
        files.push(new CodeFile('main.cpp', selectedVersion.program.main));
        this.codeFilesSource = files;
    }

    onTargetSelectionChanges(value: String) {
        const selectedVersion =  this.versionList.find((version) => {
            return version.id === value;
        })
        let files = selectedVersion.program.files.map((file) => {
            return new CodeFile(file.file_name, file.content)
        })
        files.push(new CodeFile('main.cpp', selectedVersion.program.main));
        this.codeFilesTarget = files;
    }

    onFileSelected(path: string) {
        console.log('daasdasdasdasdASDHAKJSFHKLASJFHJKLASFHKLASHFJK')
        console.log(this.codeFilesSource);
        console.log(this.codeFilesTarget);
        console.log(path);

        const originalFile = this.codeFilesSource.find((f: CodeFile) => {
            return f.objectFullPath === path;
        })
        if (originalFile) {
            this.sourceFileContent = originalFile.content;
        } else {
            this.sourceFileContent = '';
        }


        const changedFile = this.codeFilesTarget.find((f: CodeFile) => {
            return f.objectFullPath === path;
        })
        if (changedFile) {
            this.targetFileContent = changedFile.content;
        } else {
            this.targetFileContent = '';
        }


        console.log('==============================');
        console.log(this.sourceFileContent);
        console.log(this.targetFileContent);

    }
}
