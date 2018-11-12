/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, Input, Output, EventEmitter, OnInit, NgZone } from '@angular/core';
import {
    IBlock, IBlockVersion, ICProgram, ICProgramVersion, IGridProgram, IGridProgramVersion,
    IGridProject, IShortReference, IWidget, IWidgetVersion
} from '../backend/TyrionAPI';
import { _BaseMainComponent } from '../views/_BaseMainComponent';
import { TyrionBackendService } from '../services/BackendService';
import { TranslationService } from '../services/TranslationService';
import { ModalService } from '../services/ModalService';
import { FlashMessageError, NotificationService } from '../services/NotificationService';

@Component({
    selector: 'bk-program-version-selector',
    /* tslint:disable:max-line-length */
    template: `
        <div>
            <div class="form-group" [class.col-md-6]="align_horizontal && show_program_selector" [class.has-error]="!selectedProgramId">
                <label *ngIf="show_program_selector && show_labels_selector">Program</label>
                <select *ngIf="show_program_selector" class="form-control" [ngModel]="selectedProgramId" (ngModelChange)="onSelectedProgramIdChange($event)">
                    <option [value]="null" disabled>Select program</option>
                    <option *ngFor="let program of programs" [value]="program.id">{{program.name}}</option>
                </select>
            </div>
            <div class="form-group" [class.col-md-6]="align_horizontal && show_program_selector" [class.has-error]="selectedProgramId && !selectedProgramVersionId">
                <label *ngIf="show_labels_selector"> Program version</label>
                <select class="form-control" *ngIf="selectedProgram && !(selectedVersions && selectedVersions.length)" disabled>
                    <option [value]="null" disabled>No program versions</option>
                </select>
                <select *ngIf="!selectedProgram" class="form-control" disabled>
                    <option [value]="null" disabled>&lt; Select program first</option>
                </select>
                <select *ngIf="selectedProgram && (selectedVersions && selectedVersions.length)" class="form-control" [ngModel]="selectedProgramVersionId" (ngModelChange)="onSelectedProgramVersionIdChange($event)">
                    <option [value]="null" disabled>Select version</option>
                    <option *ngFor="let programVersion of selectedVersions" [value]="programVersion.id">{{programVersion.name}}{{programVersion.description ? " - " + programVersion.description : ""}}</option>
                </select>
            </div>
            <div class="clearfix"></div>
        </div>
    `
    /* tslint:enable */
})

export class ProgramVersionSelectorComponent implements OnInit {

    @Input() programs: (ICProgram | IGridProgram | IBlock | IWidget)[] = null;
    @Input() type: 'ICProgram' | 'IGridProgram' | 'IBlock' | 'IWidget' = 'ICProgram';

    @Input()
    show_program_selector: boolean = true;

    @Input()
    show_labels_selector: boolean = true;

    // Fill after select Program
    selectedVersions: (ICProgramVersion | IGridProgramVersion | IBlockVersion | IWidgetVersion)[] = null;

    @Input()
    already_selected_program_id: string = null;

    @Input()
    already_selected_program_version_id: string = null;

    @Input()
    align_horizontal: boolean = true;

    @Output()
    valueChanged: EventEmitter<any> = new EventEmitter<any>();

    selectedProgram: ICProgram | IGridProgram | IBlock | IWidget = null;
    selectedVersion: ICProgramVersion | IGridProgramVersion | IBlockVersion | IWidgetVersion = null;
    selectedProgramId: string = null;
    selectedProgramVersionId: string = null;

    constructor(protected modalService: ModalService, protected zone: NgZone, protected backendService: TyrionBackendService, private translationService: TranslationService, protected notificationService: NotificationService) {

    }

    ngOnInit(): void {
        setTimeout(() => {
            if (this.already_selected_program_id) {

                if (this.programs) {

                    this.programs.forEach((cp) => {

                        if (cp.id === this.already_selected_program_id) {
                            this.selectedProgram = cp;
                            this.selectedProgramId = cp.id;
                        }

                    });

                    if (this.selectedProgram && this.already_selected_program_id) {

                        if (this.type === 'ICProgram') {
                            this.backendService.cProgramGet(this.selectedProgramId)
                                .then((program) => {
                                    this.selectedVersions = program.program_versions.filter((version) => {
                                        return version.status === 'SUCCESS';
                                    });
                                    program.program_versions.forEach((cp) => {
                                        if (cp.id === this.already_selected_program_version_id) {
                                            this.selectedProgramVersionId = cp.id;
                                            this.selectedVersion = cp;
                                        }
                                    });
                                    if (this.selectedProgramVersionId == null) {
                                        console.info('Nevybraná žádná verze - raději vyberu první!');
                                        this.onSelectedProgramVersionIdChange(program.program_versions[0].id);
                                    }
                                })
                                .catch(reason => {
                                    this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_cannot_load_versions', this)));
                                });
                        }

                        if (this.type === 'IGridProgram') {
                            this.backendService.gridProgramGet(this.selectedProgramId)
                                .then((program) => {
                                    this.selectedVersions = program.program_versions;
                                    program.program_versions.forEach((cp) => {
                                        if (cp.id === this.already_selected_program_version_id) {
                                            this.selectedProgramVersionId = cp.id;
                                            this.selectedVersion = cp;
                                        }
                                    });
                                    if (this.selectedProgramVersionId == null) {
                                        console.info('Nevybraná žádná verze - raději vyberu první!');
                                        this.onSelectedProgramVersionIdChange(program.program_versions[0].id);
                                    }
                                })
                                .catch(reason => {
                                    this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_cannot_load_versions', this), reason));

                                });
                        }

                        if (this.type === 'IBlock') {
                            this.backendService.blockGet(this.selectedProgramId)
                                .then((program) => {
                                    this.selectedVersions = program.versions;
                                    program.versions.forEach((cp) => {
                                        if (cp.id === this.already_selected_program_version_id) {
                                            this.selectedProgramVersionId = cp.id;
                                            this.selectedVersion = cp;
                                        }
                                    });
                                    if (this.selectedProgramVersionId == null) {
                                        console.info('Nevybraná žádná verze - raději vyberu první!');
                                        this.onSelectedProgramVersionIdChange(program.versions[0].id);
                                    }
                                })
                                .catch(reason => {
                                    this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_cannot_load_versions', this), reason));
                                });
                        }

                        if (this.type === 'IWidget') {
                            this.backendService.widgetGet(this.selectedProgramId)
                                .then((program) => {
                                    this.selectedVersions = program.versions;
                                    program.versions.forEach((cp) => {
                                        if (cp.id === this.already_selected_program_version_id) {
                                            this.selectedProgramVersionId = cp.id;
                                            this.selectedVersion = cp;
                                        }
                                    });
                                    if (this.selectedProgramVersionId == null) {
                                        console.info('Nevybraná žádná verze - raději vyberu první!');
                                        this.onSelectedProgramVersionIdChange(program.versions[0].id);
                                    }
                                })
                                .catch(reason => {
                                    this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_cannot_load_versions', this), reason));
                                });
                        }

                    } else {
                        setTimeout(() => {
                            this.onSelectedProgramIdChange(this.already_selected_program_id);
                            this.onSelectedProgramGetVersion();
                        }, 0); // Think about better solution [DH]
                    }
                } else {
                    setTimeout(() => {
                        this.already_selected_program_id = null;
                        this.valueChanged.emit(this.already_selected_program_id);
                    }, 0);
                }

            }
        });
    }

    public onSelectedProgramGetVersion() {
        console.info('onSelectedProgramGetVersion');
        if (this.type === 'ICProgram') {
            this.backendService.cProgramGet(this.selectedProgramId)
                .then((program) => {
                    this.selectedVersions = program.program_versions.filter((version) => {
                        return version.status === 'SUCCESS';
                    });
                    program.program_versions.forEach((cp) => {
                        if (cp.id === this.already_selected_program_version_id) {
                            this.selectedProgramVersionId = cp.id;
                            this.selectedVersion = cp;
                        }
                    });

                    if (this.selectedProgramVersionId == null) {
                        console.info('Nevybraná žádná verze - raději vyberu první!');
                    }
                })
                .catch(reason => {
                    this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_cannot_load_versions', this), reason));
                });
        }

        if (this.type === 'IGridProgram') {
            this.backendService.gridProgramGet(this.selectedProgramId)
                .then((program) => {
                    this.selectedVersions = program.program_versions;
                    program.program_versions.forEach((cp) => {
                        if (cp.id === this.already_selected_program_version_id) {
                            this.selectedProgramVersionId = cp.id;
                            this.selectedVersion = cp;
                        }
                    });

                    if (this.selectedProgramVersionId == null) {
                        console.info('Nevybraná žádná verze - raději vyberu první!');
                    }
                })
                .catch(reason => {
                    this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_cannot_load_versions', this), reason));
                });
        }

        if (this.type === 'IBlock') {
            this.backendService.blockGet(this.selectedProgramId)
                .then((program) => {
                    this.selectedVersions = program.versions;
                    program.versions.forEach((cp) => {
                        if (cp.id === this.already_selected_program_version_id) {
                            this.selectedProgramVersionId = cp.id;
                            this.selectedVersion = cp;
                        }
                    });

                    if (this.selectedProgramVersionId == null) {
                        console.info('Nevybraná žádná verze - raději vyberu první!');
                    }
                })
                .catch(reason => {
                    this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_cannot_load_versions', this), reason));
                });
        }

        if (this.type === 'IWidget') {
            this.backendService.widgetGet(this.selectedProgramId)
                .then((program) => {
                    this.selectedVersions = program.versions;
                    program.versions.forEach((cp) => {
                        if (cp.id === this.already_selected_program_version_id) {
                            this.selectedProgramVersionId = cp.id;
                            this.selectedVersion = cp;
                        }
                    });

                    if (this.selectedProgramVersionId == null) {
                        console.info('Nevybraná žádná verze - raději vyberu první!');
                    }
                })
                .catch(reason => {
                    this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_cannot_load_versions', this), reason));
                });
        }
    }

    onSelectedProgramIdChange(newValue: string) {
        console.info('onSelectedProgramIdChange:: value', newValue);

        if (newValue === null) {
            console.error('onSelectedProgramIdChange:: value is null!');
            return;
        }

        if (this.selectedProgramId === newValue && this.selectedProgram !== null) {
            console.info('onSelectedProgramIdChange:: this.selectedProgramId === newValue && this.selectedProgramVersionId !== null) RETUR NULL');
            return;
        }

        this.selectedProgramId = newValue;
        this.onSelectedProgramGetVersion();

        this.selectedProgram = this.programs.find((cp) => (cp.id === this.selectedProgramId));
        this.selectedProgramVersionId = null;

        this.already_selected_program_id = null;
        this.valueChanged.emit(this.already_selected_program_version_id);
    }

    onSelectedProgramVersionIdChange(newValue: string) {

        console.info('onSelectedProgramVersionIdChange newValue:', newValue);
        if (this.selectedProgramVersionId === newValue) {
            return;
        }
        this.selectedProgramVersionId = newValue;
        this.already_selected_program_version_id = this.selectedProgramVersionId;


        this.valueChanged.emit(this.selectedVersions.find((cp) => (cp.id === this.already_selected_program_version_id)));
    }

}
