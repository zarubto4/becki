/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */
import {
    IInstanceSnapshot, IInstance, IBProgram,
    IActualizationProcedureTaskList, IHardwareGroupList, IHardwareList, ITerminalConnectionSummary, IBProgramVersion,
    IInstanceSnapshotJsonFileInterface, IHardwareGroup, ISwaggerInstanceSnapShotConfigurationFile,
    ISwaggerInstanceSnapShotConfigurationProgram, ISwaggerInstanceSnapShotConfiguration,
    IBProgramVersionSnapGridProjectProgram, IBProgramVersionSnapGridProject,
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
import { OnlineChangeStatus, TyrionApiBackend } from '../backend/BeckiBackend';
import { InstanceHistoryTimeLineComponent } from '../components/InstanceHistoryTimeLineComponent';
import { ModalsSelectVersionModel } from '../modals/version-select';
import { DraggableEventParams } from '../components/DraggableDirective';
import { WebsocketClientBlockoView } from '../services/websocket/Websocket_Client_BlockoView';
import { WebsocketMessage } from '../services/websocket/WebsocketMessage';
import { ModalsVersionDialogModel } from '../modals/version-dialog';
import moment = require('moment/moment');
import { ModalsSnapShotInstanceModel } from '../modals/snapshot-properties';
import { ModalsSnapShotDeployModel } from '../modals/snapshot-deploy';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsShowQRModel } from '../modals/show_QR';
import { ModalsGridProgramSettingsModel } from '../modals/instance-grid-program-settings';

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

    allHw: IHardwareList = null;
    allHwGroups: IHardwareGroupList = null;

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

    homerDao: WebsocketClientBlockoView;

    tab: string = 'overview';

    draggableOptions: JQueryUI.DraggableOptions = {
        helper: 'clone',
        containment: 'document',
        cursor: 'move',
        cursorAt: { left: -5, top: -5 }
    };

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
    }

    ngAfterViewInit() {
        this.blockoViews.changes.subscribe((views: QueryList<BlockoViewComponent>) => {

            this.editorView = views.find((view) => {
                return view.id === 'snapshot_editor';
            });

            if (this.editorView) {

                if (this.instance && this.instance.current_snapshot) {
                    this.editorView.setDataJson(this.instance.current_snapshot.program.snapshot);
                } else if (this.bProgramVersion) {
                    console.info('ngAfterViewInit::this.bProgramVersion', this.bProgramVersion);
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
                    this.homerDao.disconnectWebSocket();
                    this.homerDao = null;
                }
            }
        }
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();

        if (this.homerDao) {
            this.homerDao.disconnectWebSocket();
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

        if (tab === 'editor' && ( !this.allHw || !this.allHwGroups)) {
            this.onFilterForBlockoSelectHardware();
            this.onFilterForBlockoSelectHardwareGroup();
        }

        if (tab === 'hardware' && !this.deviceGroupFilter) {
            this.onFilterHardwareGroup();
        }

    }

    onDragStop(params: DraggableEventParams) {
        console.info('onDragStop::homerMessageReceived params:', params);
        switch (params.type) {
            case 'hardware': {

                let controller = this.editorView.getBlockoController();

                let iface = controller.bindInterface(params.data.id, params.data.group);
                console.info('onDragStop::homerMessageReceived iface:', iface);

                let index = this.bindings.findIndex((i) => {
                    return i.targetId === iface.targetId;
                });

                if (index === -1) {
                    this.bindings.push(iface);
                } else {
                    this.bindings[index] = iface;
                }

                break;
            }

            default: this.fmError(this.translate('flash_cant_add_blocko_block'));
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

    onEditorPortletClick(action: string) {
        switch (action) {
            case 'save_snapshot': {
                this.onSaveSnapshotClick();
                break;
            }
            case 'change_version': {
                this.onChangeVersion();
                break;
            }
            default: console.warn('undefined for:', action);
        }
    }

    onSaveSnapshotClick = () => {
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

                    this.tyrionBackendService.instanceSnapshotCreate( this.instanceId, {
                        name: m.name,
                        description: m.description,
                        version_id: version_id,
                        interfaces: interfaces,
                        snapshot: this.editorView.getDataJson()
                    }).then((snapshot) => {
                        this.unblockUI();
                        this.refresh();
                    }).catch((reason) => {
                        this.fmError(this.translate('flash_snapshot_save_fail'), reason);
                    });
                }
            });

        } else {
            this.fmError(this.translate('flash_not_deployable'));
        }
    }

    onChangeVersion = () => {
        let m: ModalsSelectVersionModel = new ModalsSelectVersionModel(this.bProgram.program_versions);
        this.modalService.showModal(m)
            .then((success) => {
                if (success && m.selectedId) {
                    this.tyrionBackendService.bProgramVersionGet(m.selectedId)
                        .then((bpv) => {
                            this.bProgramVersion = bpv;
                            this.tab = 'editor';
                            if (this.editorView) {
                                console.info('ProjectsProjectInstancesInstanceComponent:: onChangeVersion:: Version::', this.bProgramVersion);
                                this.editorView.setDataJson(this.bProgramVersion.program);
                                this.bindings = this.editorView.getBindings();
                            }
                        })
                        .catch((reason) => {
                            this.fmError(this.translate('flash_bprogram_version_load_fail'), reason);
                        });
                }
            });
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
                this.tyrionBackendService.instanceEdit(this.instance.id, { name: model.name, description: model.description })
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

    onInstanceDeployClick() {
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
            project_id : this.projectId,
            instance_snapshots: [this.instance.current_snapshot.id],

        })
            .then((values) => {
                this.deviceGroupFilter = values;

                if (this.deviceGroupFilter.content.length > 0 ) {
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
        this.tyrionBackendService.boardsGetWithFilterParameters(pageNumber, {
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

    onFilterForBlockoSelectHardware(pageNumber: number = 0): void {

        this.blockUI();
        this.tyrionBackendService.boardsGetWithFilterParameters(pageNumber, {
            projects: [this.projectId]
        })
            .then((values) => {
                this.allHw = values;

                this.unblockUI();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }

    onFilterForBlockoSelectHardwareGroup(pageNumber: number = 0): void {

        this.blockUI();
        this.tyrionBackendService.hardwareGroupGetListByFilter(pageNumber, {
            project_id : this.projectId
        })
            .then((values) => {
                this.allHwGroups = values;

                this.unblockUI();
            })
            .catch((reason) => {
                this.unblockUI();
                this.addFlashMessage(new FlashMessageError('Cannot be loaded.', reason));
            });
    }


    /* tslint:disable:max-line-length ter-indent */
    onFilterActualizationProcedureTask(pageNumber: number = 0,
                                       status: ('SUCCESSFULLY_COMPLETE' | 'COMPLETE' | 'COMPLETE_WITH_ERROR' | 'CANCELED' | 'IN_PROGRESS' | 'NOT_START_YET')[] = ['SUCCESSFULLY_COMPLETE', 'COMPLETE' , 'COMPLETE_WITH_ERROR' , 'CANCELED' , 'IN_PROGRESS' , 'NOT_START_YET'],
                                      ): void {
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
        console.info('ProjectsProjectInstancesInstanceComponent::loadBlockoLiveView start');
        this.zone.runOutsideAngular(() => {
            if (this.liveView && this.instance.current_snapshot) {
                console.info(JSON.stringify(this.instance.current_snapshot.program));
                this.liveView.setDataJson(this.instance.current_snapshot.program.snapshot);

                if (this.instance.instance_remote_url) {
                    console.info('ProjectsProjectInstancesInstanceComponent::loadBlockoLiveView instance_remote_url', this.instance.instance_remote_url);
                    this.tyrionBackendService.getWebsocketService().connectBlockoInstanceWebSocket(this.instance.instance_remote_url, (socket: WebsocketClientBlockoView, error: any) => {

                        if (socket) {
                            this.homerDao = socket;

                            this.homerDao.onOpenCallback = (e) => {
                                console.error('ProjectsProjectInstancesInstanceComponent: Instance WebSocket WebView is open ');

                                this.homerDao.requestGetValues(this.instanceId, (response_message: WebsocketMessage, error_response: any) => {
                                    console.info('ProjectsProjectInstancesInstanceComponent::loadBlockoLiveView requestGetValues: response', response_message);
                                    if (response_message) {
                                        this.homerMessageReceived(response_message);
                                    } else {
                                        console.error('this.homerDao.requestGetValues Error: ', error_response);
                                    }
                                });

                                this.homerDao.requestGetLogs(this.instanceId, (response_message: WebsocketMessage, error_response: any) => {
                                    console.info('ProjectsProjectInstancesInstanceComponent::loadBlockoLiveView requestGetLogs: response', response_message);
                                    if (response_message) {
                                        this.homerMessageReceived(response_message);
                                    } else {
                                        console.error('this.homerDao.requestGetValues Error: ', error_response);
                                    }
                                });

                                this.homerDao.onMessageCallback = (m: WebsocketMessage) => this.homerMessageReceived(m);
                            };



                        } else {
                            console.error('ProjectsProjectInstancesInstanceComponent:connectBlockoInstanceWebSocket:: ', error);
                        }

                    });
                }
            }
        });
    }

    homerMessageReceived(m: any) {
        console.info('ProjectsProjectInstancesInstanceComponent::homerMessageReceived m:', m);
        this.zone.runOutsideAngular(() => {

            const controller = this.liveView.getBlockoController();

            if (m.message_type === 'new_input_connector_value') {
                controller.setInputConnectorValue(m.block_id, m.interface_name, typeof m.value === 'object' ? new BlockoCore.Message(m.value) : m.value);
                return;
            }

            if (m.message_type === 'new_output_connector_value') {
                controller.setOutputConnectorValue(m.block_id, m.interface_name, typeof m.value === 'object' ? new BlockoCore.Message(m.value) : m.value);
                return;
            }

            if (m.message_type === 'new_external_input_connector_value') {
                  controller.setInputConnectorValue(m.block_id, m.interface_name, m.value);
                return;
            }

            if (m.message_type === 'new_external_output_connector_value') {
                 controller.setOutputConnectorValue(m.block_id, m.interface_name, m.value);
                return;
            }

            if (m.message_type === 'new_console_event') {
                this.zone.run(() => {
                    this.consoleLog.add(m.console_message_type, m.console_message, 'Block ' + m.block_id, new Date(m.console_message_time).toLocaleString());
                });
                return;
            }

            if (m.message_type === 'new_error_event') {
                controller.setError(m.block_id, true);
                this.zone.run(() => {
                    this.consoleLog.add('error', m.error_message, 'Block ' + m.block_id, new Date(m.error_time).toLocaleString());
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

                    /* tslint:disable */

                    console.log("homerMessageReceived:: .message_type === 'getValues', for:   ", m);

                    /* tslint:enable */

                    for (let targetType in m.externalConnector) {

                        if (!m.externalConnector.hasOwnProperty(targetType)) {
                            continue;
                        }

                        /* tslint:disable */

                        console.log("homerMessageReceived:: .message_type === 'getValues', for:   ", targetType);

                        /* tslint:enable */

                        for (let targetId in m.externalConnector[targetType]) {
                            if (!m.externalConnector[targetType].hasOwnProperty(targetId)) {
                                continue;
                            }


                            /* tslint:disable */

                            console.log("homerMessageReceived:: m.message_type =  ", m.message_type);

                            /* tslint:enable */

                            for (let input in m.externalConnector[targetType][targetId].inputs) {
                                if (m.externalConnector[targetType][targetId].inputs.hasOwnProperty(input)) {
                                    continue;
                                }
                                // controller.set
                                // controller.setInputExternalConnectorValue(targetType, targetId, input, m.externalConnector[targetType][targetId].inputs[input]);

                                /* tslint:disable */
                                console.log("homerMessageReceived:: setInputExternalConnectorValue, for: ", targetType, targetId, input, m.externalConnector[targetType][targetId].inputs[input]);
                                /* tslint:enable */
                            }

                            for (let output in m.externalConnector[targetType][targetId].outputs) {
                                if (!m.externalConnector[targetType][targetId].outputs.hasOwnProperty(output)) {
                                    continue;
                                }
                                /* tslint:disable */
                                console.log("homerMessageReceived:: setOutputExternalConnectorValue, for: ", targetType, targetId, output, m.externalConnector[targetType][targetId].outputs[output]);
                                /* tslint:enable */
                                // controller.setOutputExternalConnectorValue(targetType, targetId, output, m.externalConnector[targetType][targetId].outputs[output]);
                            }
                        }
                    }
                }
            }

            if (m.message_type === 'get_logs') {
                this.zone.run(() => {
                    if (m.logs) {
                        for (let i = 0; i < m.logs.length; i++) {
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
}

