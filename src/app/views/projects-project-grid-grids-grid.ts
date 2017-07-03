/**
 * Created by davidhradek on 10.10.16.
 */

import { Component, OnInit, Injector, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import {
    IGridWidget, IProject, IMProgram, IMProgramVersion, IMProject, IMProgramVersionShortDetail,
    ITypeOfWidgetShortDetail, ITypeOfWidget, IMProjectShortDetail
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

@Component({
    selector: 'bk-view-projects-project-grid-grids-grid',
    templateUrl: './projects-project-grid-grids-grid.html',
})
export class ProjectsProjectGridGridsGridComponent extends BaseMainComponent implements OnInit, OnDestroy {

    @ViewChild('editor')
    editorElement: ElementRef;

    projectId: string;
    gridId: string;
    gridsId: string;

    routeParamsSubscription: Subscription;

    // project: IProject = null;
    gridProject: IMProjectShortDetail = null;
    gridProgram: IMProgram = null;
    gridProgramVersions: IMProgramVersionShortDetail[] = [];
    selectedProgramVersion: IMProgramVersion = null;

    gridDeviceProfile: string = 'mobile';

    projectSubscription: Subscription;
    // project: IProject = null;

    widgetGroups: ITypeOfWidget[];

    widgetGroupsOpenToggle: { [id: string]: boolean } = {};

    widgetSourceCache: { [versionId: string]: string } = {};

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
            this.gridsId = params['grids'];
            this.gridId = params['grid'];
            this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                this.gridProject = project.m_projects.find((mp) => mp.id === this.gridsId);
            });
            if (params['version']) {

                this.router.navigate(['/projects', this.projectId, 'grid', this.gridsId, this.gridId]);
                this.selectVersionByVersionId(params['version']);
            }
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
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
        if (this.gridProgramVersions && !(this.gridProgramVersions.length === 0)) {
            let version = null;
            if (versionId) {
                version = this.gridProgramVersions.find((bpv) => bpv.version_id === versionId);
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

    onRemoveVersionClick(version: IMProgramVersionShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(version.version_name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteMProgramVersion(version.version_id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_remove')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_version', reason)));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.refresh();
                    });
            }
        });
    }

    onEditVersionClick(version: IMProgramVersionShortDetail): void {
        let model = new ModalsVersionDialogModel(version.version_name, version.version_description, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editMProgramVersion(version.version_id, { // TODO [permission]: version.update_permission
                    version_name: model.name,
                    version_description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_change', model.name)));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_change_version', model.name, reason)));
                        this.refresh();
                    });
            }
        });
    }

    refresh(): void {
        this.blockUI();

        Promise.all<any>([
            this.backendService.getAllTypeOfWidgets(),
            this.backendService.getMProgram(this.gridId)// TODO [permission]: M_Program.read_permission
        ])
            .then((values: [ITypeOfWidget[], IMProgram]) => {
                let typesOfWidgets: ITypeOfWidget[] = values[0];
                let gridProgram: IMProgram = values[1];

                this.widgetGroups = typesOfWidgets;

                this.gridProgram = gridProgram;

                this.gridProgramVersions = this.gridProgram.program_versions || [];

                let version = null;
                if (this.afterLoadSelectedVersionId) {
                    version = this.gridProgramVersions.find((bpv) => bpv.version_id === this.afterLoadSelectedVersionId);
                }

                if (version) {
                    this.selectProgramVersion(version);
                } else if (this.gridProgramVersions.length) {
                    this.selectProgramVersion(this.gridProgramVersions[0]);
                }

                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_load_grid', reason)));
                this.unblockUI();
            });
    }

    onAddPageClick(): void {
        this.gridView.addPage();
    }

    onProgramVersionClick(programVersion: IMProgramVersionShortDetail): void {
        this.selectProgramVersion(programVersion);
    }

    selectProgramVersion(programVersion: IMProgramVersionShortDetail): void { // TODO [permission]: M_Program.read_permission
        if (!this.gridProgramVersions) {
            return;
        }
        if (this.gridProgramVersions.indexOf(programVersion) === -1) {
            return;
        }

        this.blockUI();
        this.backendService.getMProgramVersion(programVersion.version_id)
            .then((programVersionFull) => {
                this.unblockUI();
                this.selectedProgramVersion = programVersionFull;

                // TODO run update fo grid widgets version, then setDataJson ...
                this.gridView.setDataJson(this.selectedProgramVersion.m_code);

                this.gridDeviceProfile = this.gridView.getDeviceProfile();

                this.unsavedChanges = false;
                this.exitConfirmationService.setConfirmationEnabled(false);
            })
            .catch((err) => {
                this.unblockUI();
                this.fmError(this.translate('flash_cant_load_version', programVersion.version_name, err));
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
        let model = new ModalsGridProgramPropertiesModel(this.gridProgram.name, this.gridProgram.description, true);

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editMProgram(this.gridProgram.id, {
                    name: model.name,
                    description: model.description,
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_edit')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_edit_grid', reason)));
                        this.refresh();
                    });
            }
        });
    }

    onProgramDeleteClick(): void {

        this.modalService.showModal(new ModalsRemovalModel(this.gridProgram.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteMProgram(this.gridProgram.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_grid_remove')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.navigate(['/projects', this.currentParamsService.get('project'), 'grid', this.gridsId]);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_grid', reason)));
                        this.refresh();
                    });
            }
        });

    }

    isSelected(version: IMProgramVersionShortDetail): boolean {
        return NullSafe(() => this.selectedProgramVersion.version_object.id) === version.version_id;
    }

    onSaveClick(): void {
        let m = new ModalsVersionDialogModel(moment().format('YYYY-MM-DD HH:mm:ss'));
        this.modalService.showModal(m).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createMProgramVersion(this.gridId, { // TODO [permission]: M_Program.create_permission
                    version_name: m.name,
                    version_description: m.description,
                    m_code: this.gridView.getDataJson(),
                    virtual_input_output: this.gridView.getInterfaceJson()
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_version_save', m.name)));
                        this.refresh(); // also unblockUI

                        this.unsavedChanges = false;
                        this.exitConfirmationService.setConfirmationEnabled(false);
                    })
                    .catch((err) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_save_version', m.name , err)));
                        this.unblockUI();
                    });
            }
        });
    }

    onToggleGroup(groupId: string) {
        this.widgetGroupsOpenToggle[groupId] = !this.widgetGroupsOpenToggle[groupId];
    }

    onWidgetDown(e: MouseEvent, widget: IGridWidget): void {
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
        if (this.widgetSourceCache[event.type.version_id]) {
            event.resolve(this.widgetSourceCache[event.type.version_id]);
            this.unblockUI();
            return;
        }

        this.backendService.getWidgetVersion(event.type.version_id) // TODO [permission]: GridWidgetVersion_read_permission
            .then((widgetVersion) => {
                this.widgetSourceCache[event.type.version_id] = widgetVersion.logic_json;
                event.resolve(widgetVersion.logic_json);
                this.unblockUI();
            })
            .catch((err) => {
                event.resolve(null);
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_load_widget_version', err)));
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

}
