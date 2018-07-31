/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import {
    IInstanceSnapshot, IInstance, IBProgram,
    IActualizationProcedureTaskList, IHardwareGroupList, IHardwareList, IBProgramVersion,
    IInstanceSnapshotJsonFileInterface, IHardwareGroup, ISwaggerInstanceSnapShotConfigurationFile,
    ISwaggerInstanceSnapShotConfigurationProgram,
    IBProgramVersionSnapGridProjectProgram, IBProgramVersionSnapGridProject,
    IUpdateProcedure, ISwaggerInstanceSnapShotConfigurationApiKeys
} from '../backend/TyrionAPI';
import { BlockoCore } from 'blocko';
import {
    Component, OnInit, Injector, OnDestroy, AfterContentChecked, ViewChild, ElementRef, ViewChildren, QueryList,
    AfterViewInit
} from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { ModalsConfirmModel } from '../modals/confirm';
import { ConsoleLogComponent } from '../components/ConsoleLogComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsInstanceEditDescriptionModel } from '../modals/instance-edit-description';
import { InstanceHistoryTimeLineComponent } from '../components/InstanceHistoryTimeLineComponent';
import { ModalsSelectVersionModel } from '../modals/version-select';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
import moment = require('moment/moment');
import { ModalsSnapShotInstanceModel } from '../modals/snapshot-properties';
import { ModalsSnapShotDeployModel } from '../modals/snapshot-deploy';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsShowQRModel } from '../modals/show_QR';
import { ModalsGridProgramSettingsModel } from '../modals/instance-grid-program-settings';
import { ModalsSelectHardwareModel } from '../modals/select-hardware';
import { ModalsInstanceApiPropertiesModel } from '../modals/instance-api-properties';
import { WebSocketClientBlocko } from '../services/websocket/WebSocketClientBlocko';
import { IWebSocketMessage } from '../services/websocket/WebSocketMessage';


@Component({
    selector: 'bk-view-projects-project-instances-instance',
    templateUrl: './projects-project-instances-instance.html',
})
export class ProjectsProjectInstancesInstanceComponent extends _BaseMainComponent implements OnInit, OnDestroy, AfterContentChecked, AfterViewInit {

    projectId: string;
    instanceId: string;
    routeParamsSubscription: Subscription;

    instance: IInstance = null;
    bProgram: IBProgram = null;
    bProgramVersion: IBProgramVersion = null;
    actualizationTaskFilter: IActualizationProcedureTaskList = null;
    devicesFilter: IHardwareList = null;
    deviceGroupFilter: IHardwareGroupList = null;

    bindings: BlockoCore.BoundInterface[] = [];

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent
    currentHistoricInstance: IInstanceSnapshot = null;


    @ViewChildren(BlockoViewComponent)
    blockoViews: QueryList<BlockoViewComponent>;

    editorView: BlockoViewComponent;

    liveView: BlockoViewComponent;

    @ViewChild(InstanceHistoryTimeLineComponent)

    @ViewChild('historyEventsList')
    historyEventsList: ElementRef;

    @ViewChild('historyEvents')
    historyEvents: ElementRef;

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    homerDao: WebSocketClientBlocko;

    tab: string = 'overview';

    private liveViewLoaded: boolean = false;

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {

        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.instanceId = params['instance'];
            this.refresh();
        });

        this.tyrionBackendService.objectUpdateTyrionEcho.subscribe((status) => {
            if (status.model === 'Instance' && this.instanceId === status.model_id) {
                this.refresh();
            }
        });
    }

    ngAfterViewInit() {

        this.blockoViews.changes.subscribe((views: QueryList<BlockoViewComponent>) => {

            this.editorView = views.find((view) => {
                return view.id === 'snapshot_editor';
            });

            if (this.editorView) {

                this.editorView.registerBindInterfaceCallback(this.onSetHardwareByInterfaceClick.bind(this));

                if (this.instance && this.instance.current_snapshot) {
                    this.editorView.setDataJson(this.instance.current_snapshot.program.snapshot);
                } else if (this.bProgramVersion) {
                    this.editorView.setDataJson(this.bProgramVersion.program);
                }

                setTimeout(() => { // Must load bindings with little delay
                    this.bindings = this.editorView.getBindings();
                }, 100);
            }

            this.liveView = views.find((view) => {
                return view.id === 'liveview';
            });
        });
    }

    ngAfterContentChecked() {
        if (this.tab === 'view') {
            if (!this.liveViewLoaded && this.liveView) {
                this.loadBlockoLiveView();
                this.liveViewLoaded = true;
            }
        } else {
            if (this.liveViewLoaded) {
                this.liveViewLoaded = false;
                if (this.homerDao) {
                    this.homerDao.disconnect();
                    this.homerDao = null;
                }
            }
        }
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();

        if (this.homerDao) {
            this.homerDao.disconnect();
            this.homerDao = null;
        }
    }

    refresh(): void {
        this.blockUI();
        // this.instance.actual_instance.procedures.forEach(proc => proc.updates.forEach(update => update.));
        this.tyrionBackendService.instanceGet(this.instanceId)
            .then((instance) => {

                this.instance = instance;

                this.loadBlockoLiveView();
                this.unblockUI();

                this.tyrionBackendService.bProgramGet(this.instance.b_program.id)
                    .then((bp) => {
                        this.bProgram = bp;
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('flash_bprogram_load_fail'), reason);
                    });

                this.tyrionBackendService.onlineStatus.subscribe((status) => {
                    if (status.model === 'HomerServer' && this.instance.server.id === status.model_id) {
                        this.instance.server.online_state = status.online_state;
                    }
                });

                this.tyrionBackendService.onlineStatus.subscribe((status) => {
                    if (status.model === 'Instance' && this.instance.id === status.model_id) {
                        this.instance.online_state = status.online_state;
                    }
                });

            })
            .catch(reason => {
                this.fmError(`Instances ${this.projectId} cannot be loaded.`, reason);
                this.unblockUI();
            });
    }

    onPortletClick(action: string): void {
        switch (action) {
            case 'change_version_instance': {
                this.onCreateNewSnapshotSelectBProgramVersion();
                break;
            }
            case 'edit_Instance': {
                this.onEditClick();
                break;
            }
            case 'deploy_snapshot': {
                this.onInstanceDeployClick();
                break;
            }
            case 'deactivate_instance': {
                this.onInstanceShutdownClick();
                break;
            }
            case 'active_instance': {
                this.onInstanceDeployClick();
                break;
            }
            case 'save_snapshot': {
                this.onSaveSnapshotClick();
                break;
            }
            case 'save_deploy_snapshot': {
                this.onSaveSnapshotClick(true);
                break;
            }
            case 'change_version': {
                this.onChangeVersion();
                break;
            }
            case 'add_api_key': {
                this.onAddApiKey();
                break;
            }
            case 'add_mesh_key': {
                this.onAddMeshNetworkKey();
                break;
            }
            default: {
                console.warn('TODO action for:', action);
            }
        }
    }

    onToggleTab(tab: string) {
        this.tab = tab;

        if (tab === 'update' && !this.actualizationTaskFilter) {
            this.onFilterActualizationProcedureTask();
        }

        if (tab === 'hardware' && !this.deviceGroupFilter) {
            this.onFilterHardwareGroup();
        }

        // Set latest used Blocko program
        if (tab === 'editor') {

            if (this.bProgram == null) {
                return;
            }

            let that = this;
            setTimeout(function() {

                if (that.instance.current_snapshot) {
                    that.editorView.setDataJson(that.instance.current_snapshot.program.snapshot);
                    that.bindings = that.editorView.getBindings();

                    let version = that.bProgram.program_versions.find( vrs => vrs.id === that.instance.current_snapshot.b_program_version.id);

                    if (version != null ) {
                        that.bProgramVersion = version;
                    } else if (that.bProgram.program_versions.length > 0) {
                        that.onChangeVersion(that.bProgram.program_versions[0]);
                    }

                } else if (that.bProgram.program_versions.length > 0) {
                    that.onChangeVersion(that.bProgram.program_versions[0]);
                } else {
                    that.fmError(this.translate('flash_bprogram_no_versions'));
                }
            }, 300);


        }

    }

    onCreateNewSnapshotSelectBProgramVersion() {
        let m: ModalsSelectVersionModel = new ModalsSelectVersionModel(this.bProgram.program_versions);
        this.modalService.showModal(m)
            .then((success) => {
                if (success && m.selectedId) {
                    this.tyrionBackendService.bProgramVersionGet(m.selectedId)
                        .then((bpv) => {
                            this.bProgramVersion = bpv;
                            this.tab = 'editor';
                            if (this.editorView) {
                                this.editorView.setDataJson(this.bProgramVersion.program);
                            }
                        })
                        .catch((reason) => {
                            this.fmError(this.translate('flash_bprogram_version_load_fail'), reason);
                        });
                }
            });
    }

    onSaveSnapshotClick(deploy_immediately: boolean = false): void {

        if (this.editorView == null) {
            console.info('onSaveSnapshotClick: this.editorView');
        }
        if (this.editorView.isDeployable()) {
            let m = new ModalsVersionDialogModel(moment().format('YYYY-MM-DD HH:mm:ss'));
            this.modalService.showModal(m).then((success) => {
                if (success) {
                    this.blockUI();

                    let version_id = this.bProgramVersion.id;
                    let interfaces: IInstanceSnapshotJsonFileInterface[] = [];

                    this.bindings.forEach((binding) => {
                        interfaces.push({
                            target_id: binding.targetId,       // hardware.id or group.id
                            interface_id: binding.interfaceId, // cprogram_version
                            type: binding.group ? 'group' : 'hardware'  // type
                        });
                    });

                    this.tyrionBackendService.instanceSnapshotCreate(this.instanceId, {
                        name: m.name,
                        description: m.description,
                        version_id: version_id,
                        interfaces: interfaces,
                        snapshot: this.editorView.getDataJson()
                    }).then((snapshot) => {

                        if (deploy_immediately) {
                            this.onInstanceDeployClick(snapshot);
                        }

                        this.unblockUI();
                        this.refresh();
                    }).catch((reason) => {
                        this.fmError(this.translate('flash_snapshot_save_fail'), reason);
                        this.unblockUI();
                    });
                }
            });

        } else {
            this.fmError(this.translate('flash_not_deployable'));
        }
    }

    // API KEY
    onAddApiKey(): void {
        let model = new ModalsInstanceApiPropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.tyrionBackendService.instanceAddApiKey(this.instanceId, {
                    description: model.description
                })
                    .then((bpv) => {
                        this.refresh();
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('flash_bprogram_version_load_fail'), reason);
                        this.refresh();
                    });
            }
        });
    }

    onRemoveApiKey(token: ISwaggerInstanceSnapShotConfigurationApiKeys): void {
        this.modalService.showModal(new ModalsRemovalModel(token.description)).then((success) => {
            if (success) {
                this.tyrionBackendService.instanceRemoveApiKey(this.instance.id, token.token)
                    .then((sanpshot) => {
                        this.refresh();
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('flash_cannot_remove_api_token'), reason);
                        this.refresh();
                    });
            }
        });
    }

    onEditApiKey(token: ISwaggerInstanceSnapShotConfigurationApiKeys): void {
        let model = new ModalsInstanceApiPropertiesModel(token.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.tyrionBackendService.instanceUpdateApiKey(this.instanceId, token.token, {
                    description: model.description
                })
                    .then((bpv) => {
                        this.refresh();
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('flash_bprogram_version_load_fail'), reason);
                        this.refresh();
                    });
            }
        });
    }


    onAddMeshNetworkKey(): void {
        let model = new ModalsInstanceApiPropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.tyrionBackendService.instanceAddMeshNetworkKey(this.instanceId, {
                    description: model.description
                })
                    .then((bpv) => {
                        this.refresh();
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('flash_bprogram_version_load_fail'), reason);
                        this.refresh();
                    });
            }
        });
    }

    onRemoveMeshNetworkKey(token: ISwaggerInstanceSnapShotConfigurationApiKeys): void {
        this.modalService.showModal(new ModalsRemovalModel(token.description)).then((success) => {
            if (success) {
                this.tyrionBackendService.instanceRemoveMeshNetworkKey(this.instance.id, token.token)
                    .then((sanpshot) => {
                        this.refresh();
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('flash_cannot_remove_api_token'), reason);
                        this.refresh();
                    });
            }
        });
    }

    onEditMeshNetworkKey(token: ISwaggerInstanceSnapShotConfigurationApiKeys): void {
        let model = new ModalsInstanceApiPropertiesModel(token.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.tyrionBackendService.instanceUpdateMeshNetworkKey(this.instanceId, token.token, {
                    description: model.description
                })
                    .then((bpv) => {
                        this.refresh();
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('flash_bprogram_version_load_fail'), reason);
                        this.refresh();
                    });
            }
        });
    }



    onChangeVersion(version: IBProgramVersion = null): void {
        if (version == null) {
            let m: ModalsSelectVersionModel = new ModalsSelectVersionModel(this.bProgram.program_versions);
            this.modalService.showModal(m)
                .then((success) => {
                    if (success && m.selectedId) {
                        this.tyrionBackendService.bProgramVersionGet(m.selectedId)
                            .then((bpv) => {
                                this.bProgramVersion = bpv;
                                this.tab = 'editor';
                                if (this.editorView) {
                                    this.editorView.setDataJson(this.bProgramVersion.program);
                                    this.bindings = this.editorView.getBindings();
                                }
                            })
                            .catch((reason) => {
                                this.fmError(this.translate('flash_bprogram_version_load_fail'), reason);
                            });
                    }
                });
        } else {
            this.bProgramVersion = version;
            this.editorView.setDataJson(this.bProgramVersion.program);
            this.bindings = this.editorView.getBindings();
        }
    }

    isBound(targetId: string): boolean {
        return this.bindings.findIndex((binding) => {
            return binding.targetId === targetId;
        }) > -1;
    }

    onGridProgramPublishClick(project: IBProgramVersionSnapGridProject, program: IBProgramVersionSnapGridProjectProgram) {
        let model = new ModalsGridProgramSettingsModel(project, program, this.instance.current_snapshot.settings);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.instanceUpdateGridSettings(this.instance.current_snapshot.id, model.settings)
                    .then(() => {
                        this.refresh();
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('label_cannot_change_version', reason));
                        this.unblockUI();
                    });
            }
        });
    }

    selectedHistoryItem(event: { index: number, item: IInstanceSnapshot }) {
        this.currentHistoricInstance = event.item;
    }

    onEditClick() {
        let model = new ModalsInstanceEditDescriptionModel(this.instance.id, this.instance.name, this.instance.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.instanceEdit(this.instance.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_instance_edit_success')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_instance_edit_fail'), reason));
                    });
            }
        });
    }

    onEditSnapShotClick(snapShot: IInstanceSnapshot) {
        let model = new ModalsSnapShotInstanceModel(snapShot.name, snapShot.description, snapShot.tags, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.instanceSnapshotEdit(snapShot.id, {
                    name: model.name,
                    description: model.description
                })
                    .then((snapShotResponse: IInstanceSnapshot) => {
                        this.unblockUI();
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_snapshot_cant_update'), reason));
                    });
            }
        });
    }

    onRemoveSnapShotClick(snapShot: IInstanceSnapshot) {
        this.modalService.showModal(new ModalsRemovalModel(snapShot.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.instanceSnapshotDelete(this.instance.current_snapshot.id)
                    .then(() => {
                        this.unblockUI();
                        this.refresh();
                    }).catch((err) => {
                        this.unblockUI();
                        this.fmError(this.translate('label_upload_error', err));
                    });
            }
        });
    }

    onInstanceShutdownClick() { // start (True) for Start or (False) for Shutdown
        let model = new ModalsConfirmModel(this.translate('label_shut_down_instance_modal'), this.translate('label_shut_down_instance_modal_comment'));
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.instanceShutdown(this.instance.id)
                    .then(() => {
                        this.unblockUI();
                        this.refresh();
                    })
                    .catch((err) => {
                        this.unblockUI();
                        this.fmError(this.translate('label_upload_error', err));
                    });
            }
        });
    }

    onInstanceDeployClick(snapshot?: IInstanceSnapshot) {

        if (snapshot == null) {
            let model = new ModalsSnapShotDeployModel(this.instance.snapshots);
            this.modalService.showModal(model).then((success) => {
                if (success) {
                    this.blockUI();
                    this.tyrionBackendService.instanceSnapshotDeploy({
                        snapshot_id: model.selected_snapshot_id,
                        upload_time: model.time
                    })
                        .then(() => {
                            this.unblockUI();
                            this.refresh();
                        })
                        .catch((err) => {
                            this.unblockUI();
                            this.fmError(this.translate('label_upload_error', err));
                        });
                }
            });
        } else {
            this.tyrionBackendService.instanceSnapshotDeploy({
                snapshot_id: snapshot.id,
                upload_time: 0
            })
                .then(() => {
                    this.unblockUI();
                    this.refresh();
                })
                .catch((err) => {
                    this.unblockUI();
                    this.fmError(this.translate('label_upload_error', err));
                });
        }
    }

    getGridConfig(project_id: string, program_id: string): ISwaggerInstanceSnapShotConfigurationProgram {

        if (this.instance.current_snapshot.settings.grids_collections == null || this.instance.current_snapshot.settings.grids_collections.length === 0) {
            return null;
        }
        let program_project: ISwaggerInstanceSnapShotConfigurationFile = this.instance.current_snapshot.settings.grids_collections.find((gr) => {
            return gr.grid_project_id === project_id;
        });
        let program: ISwaggerInstanceSnapShotConfigurationProgram = program_project.grid_programs.find((gpr) => {
            return gpr.grid_program_id === program_id;
        });

        return program;
    }

    showGrid(project_id: string, program_id: string) {

        let conf = this.getGridConfig(project_id, program_id);
        let model = new ModalsShowQRModel(conf.connection_url);
        this.modalService.showModal(model).then((success) => {

        });
    }

    onFilterHardwareGroup(pageNumber: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.hardwareGroupGetListByFilter(pageNumber, {
            project_id: this.projectId,
            instance_snapshots: [this.instance.current_snapshot.id],

        })
            .then((values) => {
                this.deviceGroupFilter = values;

                if (this.deviceGroupFilter.content.length > 0) {
                    this.onFilterHardware(0, this.deviceGroupFilter.content);
                } else {
                    this.onFilterHardware(0, []);
                }

                this.unblockUI();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    onFilterHardware(pageNumber: number = 0, groups: IHardwareGroup[] = []): void {

        // Set groupd if we he it
        if (groups.length > 0 && this.deviceGroupFilter != null) {
            groups = this.deviceGroupFilter.content;
        }

        this.blockUI();
        this.tyrionBackendService.boardsGetListByFilter(pageNumber, {
            projects: [this.projectId],
            instance_snapshots: groups.length > 0 ? [] : [this.instance.current_snapshot.id],
            hardware_groups_id: groups.map(group => group.id)
        })
            .then((values) => {
                this.devicesFilter = values;

                this.devicesFilter.content.forEach((device, index, obj) => {
                    this.tyrionBackendService.onlineStatus.subscribe((status) => {
                        if (status.model === 'Hardware' && device.id === status.model_id) {
                            device.online_state = status.online_state;
                        }
                    });
                });

                this.unblockUI();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    /* tslint:disable:max-line-length ter-indent */
    onFilterActualizationProcedureTask(pageNumber: number = 0,
                                       status: ('SUCCESSFULLY_COMPLETE' | 'COMPLETE' | 'COMPLETE_WITH_ERROR' | 'CANCELED' | 'IN_PROGRESS' | 'NOT_START_YET')[] = ['SUCCESSFULLY_COMPLETE', 'COMPLETE', 'COMPLETE_WITH_ERROR', 'CANCELED', 'IN_PROGRESS', 'NOT_START_YET']): void {
        this.blockUI();

        this.tyrionBackendService.actualizationTaskGetByFilter(pageNumber, {
            actualization_procedure_ids: null,
            instance_snapshot_ids: [this.instance.current_snapshot.id],
            hardware_ids: null,
            instance_ids: null,
            update_status: status,
            update_states: []
        })
            .then((values) => {

                this.actualizationTaskFilter = values;
                this.unblockUI();

                this.actualizationTaskFilter.content.forEach((task, index, obj) => {
                    this.tyrionBackendService.objectUpdateTyrionEcho.subscribe((online_status) => {
                        if (online_status.model === 'CProgramUpdatePlan' && task.id === online_status.model_id) {

                            this.tyrionBackendService.actualizationTaskGet(task.id)
                                .then((value) => {
                                    task.state = value.state;
                                    task.date_of_finish = value.date_of_finish;
                                })
                                .catch((reason) => {
                                    this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
                                });

                        }
                    });
                });

            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    /* tslint:disable:max-line-length ter-indent*/

    loadBlockoLiveView() {
        this.zone.runOutsideAngular(() => {
            if (this.liveView && this.instance.current_snapshot) {
                console.info(JSON.stringify(this.instance.current_snapshot.program));
                this.liveView.setDataJson(this.instance.current_snapshot.program.snapshot);

                if (this.instance.instance_remote_url) {
                    this.tyrionBackendService.getWebsocketService().connectBlockoInstanceWebSocket(this.instance.instance_remote_url, this.instanceId, (socket: WebSocketClientBlocko, error: any) => {

                        if (socket) {
                            this.homerDao = socket;
                            this.homerDao.messages.subscribe((m: IWebSocketMessage) => this.homerMessageReceived(m));

                        } else {
                            console.error('ProjectsProjectInstancesInstanceComponent:connectBlockoInstanceWebSocket:: ', error);
                        }
                    });
                }
            }
        });
    }

    homerMessageReceived(m: any) {
        this.zone.runOutsideAngular(() => {

            const controller = this.liveView.getBlockoController();

            if (m.message_type === 'new_input_connector_value') {
                controller.setInputConnectorValue(m.data.block_id, m.data.interface_name, typeof m.data.value === 'object' ? new BlockoCore.Message(m.data.value) : m.data.value);
                return;
            }

            if (m.message_type === 'new_output_connector_value') {
                controller.setOutputConnectorValue(m.data.block_id, m.data.interface_name, typeof m.data.value === 'object' ? new BlockoCore.Message(m.data.value) : m.data.value);
                return;
            }

            if (m.message_type === 'new_external_input_connector_value') {
                controller.setInputConnectorValue(m.data.block_id, m.data.interface_name, m.data.value);
                return;
            }

            if (m.message_type === 'new_external_output_connector_value') {
                controller.setOutputConnectorValue(m.data.block_id, m.data.interface_name, m.data.value);
                return;
            }

            if (m.message_type === 'new_console_event') {
                console.info('homerMessageReceived:: new_console_event:: ', m);
                this.zone.run(() => {
                    this.consoleLog.add(
                        m.data['console_message_type'],
                        JSON.stringify(m.data['console_message'], null, 4).toString(), // message
                        m.data['block_id'], // source
                        'Block ' + m.data['block_id'],
                        new Date(m.data['console_message_time']).toLocaleString()
                    ); // TimaStamp
                });
                return;
            }

            if (m.message_type === 'new_error_event') {
                console.info('homerMessageReceived:: new_error_event:: ', JSON.stringify(m.data['error_message'], null, 4));
                controller.setError(m.data.block_id, true);
                this.zone.run(() => {
                    this.consoleLog.add(
                        'error', // type
                        JSON.stringify(m.data['error_message'], null, 4).toString(), // message
                        m.data['block_id'], // source
                        'Block ' + m.data['block_id'], // alias
                        new Date(m.data['error_time']).toLocaleString() // TimaStamp
                    );
                });
                return;
            }

            if (m.message_type === 'get_values') {

                for (let block in m.connector) {
                    if (!m.connector.hasOwnProperty(block)) {
                        continue;
                    }

                    for (let input in m.connector[block].inputs) {
                        if (!m.connector[block].inputs.hasOwnProperty(input)) {
                            continue;
                        }
                        controller.setInputConnectorValue(block, input, m.connector[block].inputs[input]);
                    }

                    for (let output in m.connector[block].outputs) {
                        if (!m.connector[block].outputs.hasOwnProperty(output)) {
                            continue;
                        }
                        controller.setOutputConnectorValue(block, output, m.connector[block].outputs[output]);
                    }

                    for (let targetType in m.externalConnector) {

                        if (!m.externalConnector.hasOwnProperty(targetType)) {
                            continue;
                        }

                        for (let targetId in m.externalConnector[targetType]) {
                            if (!m.externalConnector[targetType].hasOwnProperty(targetId)) {
                                continue;
                            }

                            for (let input in m.externalConnector[targetType][targetId].inputs) {
                                if (m.externalConnector[targetType][targetId].inputs.hasOwnProperty(input)) {
                                    continue;
                                }
                            }

                            for (let output in m.externalConnector[targetType][targetId].outputs) {
                                if (!m.externalConnector[targetType][targetId].outputs.hasOwnProperty(output)) {
                                    continue;
                                }
                            }
                        }
                    }
                }
            }

            if (m.message_type === 'get_logs') {
                this.zone.run(() => {
                    if (m.data.logs) {
                        for (let i = 0; i < m.data.logs.length; i++) {
                            const log = m.logs[i];
                            this.consoleLog.add(log.type, log.message, 'Block ' + log.block_id, new Date(log.time).toLocaleString());
                        }
                    }

                    if (m.errors) {
                        for (let i in m.errors) {
                            if (m.errors.hasOwnProperty(i)) {
                                controller.setError(i, true);
                            }
                        }
                    }
                });
            }
        });
    }


    onSetHardwareByInterfaceClick(callback: (targetId: string, group?: boolean) => BlockoCore.BoundInterface): void {
        let model = new ModalsSelectHardwareModel(this.projectId, null, false, true, true);
        this.modalService.showModal(model)
            .then((success) => {
                let binding: BlockoCore.BoundInterface;
                this.zone.runOutsideAngular(() => {
                    if (model.selected_hardware.length > 0) {
                        binding = callback(model.selected_hardware[0].id);
                    } else if (model.selected_hardware_groups.length > 0) {
                        binding = callback(model.selected_hardware_groups[0].id, true);
                    }
                });

                if (binding) {
                    let index = this.bindings.findIndex((i) => {
                        return i.targetId === binding.targetId;
                    });

                    if (index === -1) {
                        this.bindings.push(binding);
                    } else {
                        this.bindings[index] = binding;
                    }
                }
            })
            .catch((err) => {

            });
    }

    onDrobDownEmiter(action: string, object: any): void {

        if (action === 'edit_snapshot') {
            this.onEditSnapShotClick(object);
        }

        if (action === 'remove_snapshot') {
            this.onRemoveSnapShotClick(object);
        }

        if (action === 'cancel_update_procedure') {
            this.onUpdateProcedureCancelClick(object);
        }

        if (action === 'deploy_selected_snapshot') {
            this.onInstanceDeployClick(object);
        }

        if (action === 'remove_api_token') {
            this.onRemoveApiKey(object);
        }

        if (action === 'edit_api_token') {
            this.onEditApiKey(object);
        }

        if (action === 'remove_mesh_network_token') {
            this.onRemoveMeshNetworkKey(object);
        }

        if (action === 'edit_mesh_network_token') {
            this.onEditMeshNetworkKey(object);
        }



    }

    onUpdateProcedureCancelClick(procedure: IUpdateProcedure): void {
        this.blockUI();
        this.tyrionBackendService.actualizationProcedureCancel(procedure.id)
            .then(() => {
                this.unblockUI();
                this.refresh();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }



    onDrobDownEmiterProgram(action: string, m_project: IBProgramVersionSnapGridProject, program: IBProgramVersionSnapGridProjectProgram) {

        if (action === 'edit_grid_app') {
            this.onGridProgramPublishClick(m_project, program);
        }
    }
}

