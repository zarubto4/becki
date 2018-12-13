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
            <div style="max-width:100%; display: flex; flex-direction: row; justify-content: space-between;">
                <bk-form-select style="flex-grow: 1; margin: 10px;"
                                [options]="versionsListAsOptions"
                                [control]="form.controls['versionSource']"
                                [label]="'label_source_version'|bkTranslate:this"
                                (valueChanged)="onSourceSelectionChanges($event)"
                                #sourceVersion > </bk-form-select>
                <bk-form-select style="flex-grow: 1; margin: 10px;"
                                [options]="versionsListAsOptions"
                                [control]="form.controls['versionTarget']"
                                (valueChanged)="onTargetSelectionChanges($event)"
                                [label]="'label_target_version'|bkTranslate:this"
                                #targetVersion > </bk-form-select>
             </div>
            <div style="max-width:100%; display: flex; flex-direction: row;">
                <bk-file-tree-root style="min-width: 250px;"
                                   *ngIf="codeFilesTarget"
                                   [files]="codeFilesTarget"
                                   (newPathSelected)="onFileSelected($event)" ></bk-file-tree-root>
                <bk-monaco-diff style="flex-grow: 1"
                                *ngIf="selectedFilePath"
                                [originalCode] = "sourceFileContent"
                                [code] = "targetFileContent"> </bk-monaco-diff>
            </div>
        </div>
    `
    /* tslint:enable */
})
export class ProgramVersionDiffComponent implements  OnChanges, AfterViewInit {

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

    selectedFilePath: string = null;

    constructor(private formBuilder: FormBuilder, private translationService: TranslationService) {
        this.form = this.formBuilder.group({
            'versionTarget': ['', [Validators.required]],
            'versionSource': ['', [Validators.required]]
        });
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
            this.onSourceSelectionChanges(this.form.controls['versionSource'].value)
            this.onTargetSelectionChanges(this.form.controls['versionTarget'].value)
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        let versions = changes['versionList'];
        if (versions && versions.currentValue) {
            this.versionsListAsOptions = versions.currentValue.map((version) => {
                const s = {
                    label: version.id,
                    value: version.id,
                    data: version
                } as FormSelectComponentOption;
                return s;
            });
        }
        this.onSourceSelectionChanges(this.form.controls['versionSource'].value)
        this.onTargetSelectionChanges(this.form.controls['versionTarget'].value)
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
        if (this.selectedFilePath) {
            this.onFileSelected(this.selectedFilePath);
        }
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
        if (this.selectedFilePath) {
            this.onFileSelected(this.selectedFilePath);
        }
    }

    onFileSelected(path: string) {
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

        this.selectedFilePath = path;
    }
}
