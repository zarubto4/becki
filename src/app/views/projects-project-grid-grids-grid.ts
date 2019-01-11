/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import { Component, OnInit, Injector, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs';
import {
    IWidget, IProject, IGridProgram, IGridProject, IGridProgramVersion,
    IGridWidgetList
} from '../backend/TyrionAPI';
import { GridViewComponent } from '../components/GridViewComponent';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
declare let $: JQueryStatic;
import moment = require('moment/moment');
import { ModalsConfirmModel } from '../modals/confirm';
import { NullSafe } from '../helpers/NullSafe';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ConsoleLogComponent, ConsoleLogType } from '../components/ConsoleLogComponent';
import { Core, EditorRenderer } from 'the-grid';
import { ExitConfirmationService } from '../services/ExitConfirmationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsGridProgramPropertiesModel } from '../modals/grid-program-properties';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-projects-project-grid-grids-grid',
    templateUrl: './projects-project-grid-grids-grid.html',
})
export class ProjectsProjectGridGridsGridComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    @ViewChild('editor')
    editorElement: ElementRef;

    projectId: string;
    gridProjectId: string;
    gridProgramId: string;

    routeParamsSubscription: Subscription;

    // project: IProject = null;
    gridProject: IGridProject = null;
    gridProgram: IGridProgram = null;
    selectedProgramVersion: IGridProgramVersion = null;

    gridDeviceProfile: string = 'mobile';

    projectSubscription: Subscription;

    widgets: IGridWidgetList = null;
    // widgetGroupsOpenToggle: { [id: string]: boolean } = {};
    // widgetSourceCache: { [versionId: string]: string } = {};

    trashPosition: { x: number, y: number, visible: boolean } = { x: 0, y: 0, visible: false };

    @ViewChild(GridViewComponent)
    gridView: GridViewComponent;

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    widgetDragHandler: EditorRenderer.WidgetDragHandler = null;
    widgetDragStatus: Core.WidgetDragHandlerStatus = null;

    unsavedChanges: boolean = false;

    draggableOptions: JQueryUI.DraggableOptions = {
        helper: 'clone',
        containment: 'document',
        cursor: 'move',
        cursorAt: { left: 35, top: 35 }
    };

    tab: string = 'ide';

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent
    protected afterLoadSelectedVersionId: string = null;
    protected exitConfirmationService: ExitConfirmationService = null;

    constructor(injector: Injector) {
        super(injector);

        this.exitConfirmationService = injector.get(ExitConfirmationService);
        this.unsavedChanges = false;
        this.exitConfirmationService.setConfirmationEnabled(false);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.gridProjectId = params['grids'];
            this.gridProgramId = params['grid'];

            /*
                this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                    this.gridProject = project.p.find((mp) => mp.id === this.gridProgramId);
                });
                if (params['version']) {

                    this.router.navigate(['/projects', this.projectId, 'grid', this.gridProgramId, this.gridProjectId]);
                    this.selectVersionByVersionId(params['version']);
                }
            */

            this.refresh();
            this.onWidgetFilter();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onPortletClick(action: string): void {
        if (action === 'edit_program') {
            this.onProgramEditClick();
        }
        if (action === 'delete_program') {
            this.onProgramDeleteClick();
        }
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onWidgetDragMoveEvent = (e: any) => {
        if (e.outside && e.e) {
            const bound = (<HTMLElement>this.editorElement.nativeElement).getBoundingClientRect();
            this.trashPosition = { x: e.e.x - bound.left, y: e.e.y - bound.top, visible: true };
        } else {
            this.trashPosition.visible = false;
        }
    }

    selectVersionByVersionId(versionId: string) {
        if (this.gridProgram && !(this.gridProgram.program_versions.length === 0)) {
            let version = null;
            if (versionId) {
                version = this.gridProgram.program_versions.find((bpv) => bpv.id === versionId);
            }

            if (version) {
                this.selectProgramVersion(version);
            }
        } else {
            this.afterLoadSelectedVersionId = versionId;
        }
    }

    onGridProjectClick(gridProjectId: string) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'grid', gridProjectId]);
    }

    onRemoveVersionClick(version: IGridProgramVersion): void {
        this.modalService.showModal(new ModalsRemovalModel(version.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.gridProgramVersionDelete(version.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_remove')));
                        this.refresh();
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
                        this.refresh();
                    });
            }
        });
    }

    onEditVersionClick(version: IGridProgramVersion): void {
        let model = new ModalsVersionDialogModel(this.gridProgram.id, 'GridProgramVersion', version);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.gridProgramVersionEdit(version.id, {
                    name: model.object.name,
                    description: model.object.description,
                    tags: model.object.tags,
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_change', model.object.name)));
                        this.refresh();
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
                        this.refresh();
                    });
            }
        });
    }

    refresh(): void {

        this.blockUI();
        this.tyrionBackendService.gridProgramGet(this.gridProgramId)
            .then((program: IGridProgram) => {
                this.gridProgram = program;

                let version = null;
                if (this.afterLoadSelectedVersionId) {
                    version = this.gridProgram.program_versions.find((bpv) => bpv.id === this.afterLoadSelectedVersionId);
                }

                if (version) {
                    this.selectProgramVersion(version);
                } else if (this.gridProgram.program_versions.length) {
                    this.selectProgramVersion(this.gridProgram.program_versions[0]);
                }

                this.unblockUI();

            }).catch((reason: IError) => {
                this.fmError(reason);
                this.unblockUI();
            });

    }

    onWidgetFilter(page: number = 0): void {
        this.tyrionBackendService.widgetGetListByFilter(page, {
            project_id: this.projectId,
        })
            .then((widgets) => {
                this.widgets = widgets;
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.unblockUI();
            });
    }

    onAddPageClick(): void {
        this.gridView.addPage();
    }

    onProgramVersionClick(programVersion: IGridProgramVersion): void {
        this.selectProgramVersion(programVersion);
    }

    selectProgramVersion(programVersion: IGridProgramVersion): void { // TODO [permission]: M_Program.read_permission
        if (!this.gridProgram) {
            return;
        }
        if (this.gridProgram.program_versions.indexOf(programVersion) === -1) {
            return;
        }

        this.blockUI();
        this.tyrionBackendService.gridProgramVersionGet(programVersion.id)
            .then((programVersionFull) => {
                this.unblockUI();
                this.selectedProgramVersion = programVersionFull;

                // TODO run update fo grid widgets version, then setDataJson ...
                // console.log('selectProgramVersion: ', this.selectedProgramVersion.program_version);
                this.gridView.setDataJson(this.selectedProgramVersion.program_version);

                this.gridDeviceProfile = this.gridView.getDeviceProfile();

                this.unsavedChanges = false;
                this.exitConfirmationService.setConfirmationEnabled(false);
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                this.unblockUI();
            });
    }

    onChangeGridDeviceProfile(newValue: string): void {
        let oldValue = this.gridDeviceProfile;
        this.gridDeviceProfile = newValue;
        let m = new ModalsConfirmModel(this.translate('modal_label_grid_size_change'), this.translate('modal_text_grid_size_change'));
        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.gridView.setDeviceProfile(this.gridDeviceProfile);
                } else {
                    this.gridDeviceProfile = oldValue;
                }
            });
    }

    onProgramEditClick(): void {
        let model = new ModalsGridProgramPropertiesModel(this.gridProject.id, this.gridProgram);

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.gridProgramUpdate(this.gridProgram.id, {
                    name: model.program.name,
                    description: model.program.description,
                    tags: model.program.tags
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_edit')));
                        this.refresh();
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
                        this.refresh();
                    });
            }
        });
    }

    onProgramDeleteClick(): void {

        this.modalService.showModal(new ModalsRemovalModel(this.gridProgram.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.gridProgramDelete(this.gridProgram.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_remove')));
                        this.navigate(['/projects', this.currentParamsService.get('project'), 'grid', this.gridProgramId]);
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
                        this.refresh();
                    });
            }
        });

    }

    isSelected(version: IGridProgramVersion): boolean {
        return NullSafe(() => this.selectedProgramVersion.id) === version.id;
    }

    onSaveClick(): void {
        let model = new ModalsVersionDialogModel(this.gridProgram.id, 'GridProgramVersion');
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.gridProgramVersionCreate(this.gridProgramId, { // TODO [permission]: M_Program.create_permission
                    name: model.object.name,
                    description: model.object.description,
                    tags: model.object.tags,
                    m_code: this.gridView.getDataJson(),
                    virtual_input_output: this.gridView.getInterfaceJson()
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_save', model.object.name)));
                        this.refresh(); // also unblockUI

                        this.unsavedChanges = false;
                        this.exitConfirmationService.setConfirmationEnabled(false);
                    })
                    .catch((reason: IError) => {
                        this.fmError(reason);
                        this.unblockUI();
                    });
            }
        });
    }

    onWidgetDown(e: MouseEvent, widget: IWidget): void {
        this.widgetDragHandler = this.gridView.requestCreateWidget({
            name: widget.name,
            id: widget.id,
            version_id: widget.versions[0].id
        }, e);

        this.widgetDragHandler.addCallback(this.dragWidgetStatusCallback);
    }

    dragWidgetStatusCallback = (status: Core.WidgetDragHandlerStatus) => {
        this.widgetDragStatus = status;
        this.unsavedChanges = true;
        this.exitConfirmationService.setConfirmationEnabled(true);
    }

    onWidgetRequestingSource(event: any) {
        // console.log('onWidgetRequestingSource', event.type);
        this.tyrionBackendService.widgetVersionGet(event.type.version_id)
            .then((widgetVersion) => {
                // this.widgetSourceCache[event.type.id] = widgetVersion.id;
                event.resolve(widgetVersion.logic_json);
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.fmError(reason);
                event.resolve(null);
                this.unblockUI();
            });
    }

    onClearConsoleClick() {
        if (this.consoleLog) {
            this.consoleLog.clear();
        }
    }

    onWidgetDrag = (e: any) => {
        if (this.widgetDragStatus === Core.WidgetDragHandlerStatus.OnScreen) {
            (<HTMLElement>e.ui.helper[0]).style.transform = 'scale(0)';
            (<HTMLElement>e.ui.helper[0]).style.opacity = '0';
        } else {
            (<HTMLElement>e.ui.helper[0]).style.transform = 'scale(1)';
            (<HTMLElement>e.ui.helper[0]).style.opacity = '0.7';
        }
    }

    onWidgetLog(e: any) {
        this.zone.run(() => {
            this.consoleLog.add(<ConsoleLogType>e.type, e.message, 'W-' + e.id);
        });
    }

    onWidgetMessage(e: any) {
        this.zone.run(() => {
            this.consoleLog.addFromMessage(e.message, 'W-' + e.id, moment().format('HH:mm:ss.SSS'));
        });
    }

    onWidgetError(e: any) {
        this.zone.run(() => {
            this.consoleLog.addFromError(e.error, 'W-' + e.id, moment().format('HH:mm:ss.SSS'));
        });
    }

    onAnyChange() {
        this.unsavedChanges = true;
        this.exitConfirmationService.setConfirmationEnabled(true);
    }

    onDrobDownEmiter(action: string, version: IGridProgramVersion): void {
        if (action === 'remove_version') {
            this.onEditVersionClick(version);
        }

        if (action === 'remove_version') {
            this.onRemoveVersionClick(version);
        }
    }

}
