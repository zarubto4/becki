
/**
 * Created by davidhradek on 01.12.16.
 */

/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import { IHomerInstanceRecord, IInstanceGridAppSettings } from './../backend/TyrionAPI';
import { Component, OnInit, Injector, OnDestroy, AfterContentChecked, ViewChild, ElementRef } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import { IBProgram, IHomerInstance, IMProgramInstanceParameter } from '../backend/TyrionAPI';
import { NullSafe, NullSafeDefault } from '../helpers/NullSafe';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { BlockoViewComponent } from '../components/BlockoViewComponent';
import { HomerService, HomerDao } from '../services/HomerService';
import { ModalsConfirmModel } from '../modals/confirm';
import { InstanceHistoryTimelineComponent } from '../components/InstanceHistoryTimelineComponent';
import { ConsoleLogComponent, ConsoleLogType } from '../components/ConsoleLogComponent';
import { QRCodeComponent } from '../components/QRCodeComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsInstanceEditDescriptionModel } from '../modals/instance-edit-description';
import { ModalsBlockoVersionSelectModel } from '../modals/blocko-version-select';
import { ProjectsProjectBlockoBlockoComponent } from './projects-project-blocko-blocko';
import { OnlineChangeStatus } from '../backend/BeckiBackend';

@Component({
    selector: 'bk-view-projects-project-instances-instance',
    templateUrl: './projects-project-instances-instance.html',
})
export class ProjectsProjectInstancesInstanceComponent extends BaseMainComponent implements OnInit, OnDestroy, AfterContentChecked {

    projectId: string;
    instanceId: string;
    routeParamsSubscription: Subscription;

    instance: IHomerInstance = null;

    gridUrl: string = '';

    instanceStatus: OnlineChangeStatus;

    currentHistoricInstance: IHomerInstanceRecord;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    @ViewChild(BlockoViewComponent)
    blockoView: BlockoViewComponent;

    @ViewChild(InstanceHistoryTimelineComponent)

    @ViewChild('historyEventsList')
    historyEventsList: ElementRef;

    @ViewChild('historyEvents')
    historyEvents: ElementRef;

    @ViewChild(ConsoleLogComponent)
    consoleLog: ConsoleLogComponent;

    homerDao: HomerDao;

    instanceTab: string = 'overview';

    private homerService: HomerService = null;
    private liveViewLoaded: boolean = false;

    constructor(injector: Injector) {
        super(injector);
        this.homerService = injector.get(HomerService);

        this.backendService.onlineStatus.subscribe((status) => {
            if (status.model === 'HomerInstance' && this.instanceId === status.model_id) {
                this.instance.online_state = status.online_status;
            }
        });

    };



    onInstanceEditClick() {
        let model = new ModalsInstanceEditDescriptionModel(this.instance.id, this.instance.name, this.instance.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.instanceEdit(this.instance.id, { name: model.name, description: model.description })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_instance_edit_success')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_instance_edit_fail', reason)));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                    });
            }
        });
    }

    ngOnInit(): void {

        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.instanceId = params['instance'];
            this.refresh();
        });

        /** Supported by Tyrion
            if (location.hostname.indexOf('portal.stage.') === 0) {
                this.gridUrl = 'https://app.stage.byzance.cz/program/';
            } else {
                this.gridUrl = 'http://localhost:8888/program/';
            }
        */
    }

    ngAfterContentChecked() {
        if (this.instanceTab === 'view') {
            if (!this.liveViewLoaded && this.blockoView) {
                this.loadBlockoLiveView();
                this.liveViewLoaded = true;
            }
        } else {
            if (this.liveViewLoaded) {
                this.liveViewLoaded = false;
                if (this.homerDao) {
                    this.homerDao.close();
                    this.homerDao = null;
                }
            }
        }

        if (this.instanceTab !== 'history') {
            this.currentHistoricInstance = null;
        }
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();

        if (this.homerDao) {
            this.homerDao.close();
            this.homerDao = null;
        }
    }

    refresh(): void {
        this.blockUI();
        // this.instance.actual_instance.procedures.forEach(proc => proc.updates.forEach(update => update.));
        this.backendService.instanceGet(this.instanceId) // TODO [permission]: "B_program.update_permission"
            .then((instance) => {

                this.instance = instance;
                this.loadBlockoLiveView();
                this.currentHistoricInstance = this.instance.instance_history.pop();
                this.unblockUI();

                this.backendService.onlineStatus.subscribe((status) => {
                    if (status.model === 'HomerServer' && this.instance.server_id === status.model_id) {
                        this.instance.server_online_state = status.online_status;
                    }
                });

                if (!this.instance.actual_instance) {

                    this.router.navigate(['/', 'projects', this.projectId, 'instances', this.instanceId]);

                    this.instance.actual_instance.hardware_group.forEach((deviceGroup, index, obj) => {

                        this.backendService.onlineStatus.subscribe((status) => {
                            if (status.model === 'Board' && deviceGroup.main_board_pair.board_id === status.model_id) {
                                deviceGroup.main_board_pair.online_state = status.online_status;
                            }
                        });
                    });
                }
            })
            .catch(reason => {
                this.fmError(`Instances ${this.projectId} cannot be loaded.`, reason);
                this.router.navigate(['/', 'projects', this.projectId, 'instances', this.instanceId]);
                this.unblockUI();
            });
    }

    onToggleinstanceTab(tab: string) {
        this.instanceTab = tab;
    }

    onBlockoProgramClick(bProgramId: string) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'blocko', bProgramId]);
    }

    onBlockoProgramVersionClick(bProgramId: string, bProgramVersionId: string) {
        this.router.navigate(['/projects', this.projectId, 'blocko', bProgramId]);
    }

    onGridProgramPublishClick(gridProgram: IMProgramInstanceParameter) {
        this.blockUI();
        this.backendService.instanceUpdateGridSettings({
            m_program_parameter_id: gridProgram.id,
            snapshot_settings: gridProgram.snapshot_settings === 'absolutely_public' ? 'only_for_project_members' : 'absolutely_public'
        })
            .then(() => {
                this.refresh();
            })
            .catch((reason) => {
                this.fmError(this.translate('label_cannot_change_version', reason));
                this.unblockUI();
            });
    }

    connectionsHwCount() {
        let yodaCount = NullSafeDefault(() => this.instance.actual_instance.hardware_group, []).length;
        let padawansCount = 0;
        NullSafeDefault(() => this.instance.actual_instance.hardware_group, []).forEach((sh) => {
            padawansCount += sh.device_board_pairs.length;
        });
        return yodaCount + ' + ' + padawansCount;

    }

    onChangeVersionClick(): void {
        /**if (!this. || !this.blockoProgramVersions.length) {
            this.fmWarning('Must create some version first.');  // TODO domimplementovat
            return;
        }*/
        if (this.instance.online_state === 'online') {
            let mConfirm = new ModalsConfirmModel(this.translate('label_modal_change_instance_version'), this.translate('label_modal_change_running_instance_version'));
            this.modalService.showModal(mConfirm)
                .then((success) => {
                    if (success) {
                        this.changeVersionAction();
                    }
                });
        } else {
            this.changeVersionAction();
        }
    }

    changeVersionAction() {

        this.backendService.bProgramGet(this.instance.actual_instance.b_program_id).then((blocko) => {
            let m = new ModalsBlockoVersionSelectModel(blocko.program_versions, NullSafe(() => this.instance.actual_instance.b_program_version_id));
            this.modalService.showModal(m)
                .then((success) => {
                    if (success) {
                        this.blockUI();
                        this.backendService.bProgramVersionUploadToCloud(m.programVersion, {}) // TODO [permission]: B_program.update_permission
                            .then(() => {
                                this.storageService.projectRefresh(this.projectId);
                                this.refresh();
                            })
                            .catch((err) => {
                                this.unblockUI();
                                this.fmError(this.translate('label_cannot_change_version', err));
                            });
                    }
                });
        });
    }

    selectedHistoryItem(event: { index: number, item: IHomerInstanceRecord }) {
        this.currentHistoricInstance = event.item;
    }

    connectionsGridCount() {
        return NullSafeDefault(() => this.instance.actual_instance.m_project_snapshot, []).length;
    }

    onEditClick() {
        // TODO
    }

    onProcedureClick() {
        // TODO
    }


    onInstanceStartOrShutdownClick(start: boolean) { // start (True) for Start or (False) for Shutdown
        let m = null;

        if (start) {  // start (True) for Start or (False) for Shutdown
            m = new ModalsConfirmModel(this.translate('label_modal_shutdown_instance'), this.translate('label_modal_confirm_run_latest_version'));
        } else {
            m = new ModalsConfirmModel(this.translate('label_modal_shutdown_instance'), this.translate('label_modal_confirm_shutdown_instance'));
        }

        this.modalService.showModal(m)
            .then((success) => {
                if (success) {
                    this.blockUI();
                    this.backendService.instanceSetStartOrShutDown(this.instanceId)
                        .then(() => {
                            this.storageService.projectRefresh(this.projectId);
                            this.unblockUI();
                            this.refresh();
                        })
                        .catch((err) => {
                            this.unblockUI();
                            this.fmError(this.translate('label_cannot_execute', err));
                        });
                }
            });
    }

    onBlockoClick() {

    }

    onBoardTypeClick(boardTypeId: string): void {
        this.navigate(['/hardware', boardTypeId]);
    }


    onGridProjectClick(projectId: string) {
        this.router.navigate(['projects', this.projectId, 'grid', projectId]);
    }

    onGridProgramClick(projectId: string, programId: string) {
        this.router.navigate(['projects', this.projectId, 'grid', projectId, programId]);
    }

    onGridProgramVersionClick(projectId: string, programId: string, versionId: string) {
        this.router.navigate(['projects', this.projectId, 'grid', projectId, programId, { version: versionId }]);
    }

    onHardwareClick(hardwareId: string) {
        this.router.navigate(['projects', this.projectId, 'hardware', hardwareId]);
    }

    onCProgramClick(programId: string) {
        this.router.navigate(['projects', this.projectId, 'code', programId]);
    }

    onCProgramVersionClick(programId: string, versionId: string) {
        this.router.navigate(['projects', this.projectId, 'code', programId, { version: versionId }]);
    }

    loadBlockoLiveView() {
        this.zone.runOutsideAngular(() => {
            if (this.blockoView && this.instance.actual_instance && this.instance.actual_instance.b_program_version_id) {
                this.backendService.bProgramVersionGet(this.instance.actual_instance.b_program_version_id) // TODO [permission]: B_program.read_permission
                    .then((programVersionFull) => {
                        const selectedProgramVersion = programVersionFull;
                        this.blockoView.setDataJson(selectedProgramVersion.program);

                        if (this.instance.instance_remote_url) {
                            const authToken = this.backendService.getToken();
                            this.homerDao = this.homerService.connectToHomer(this.instance.instance_remote_url, authToken);

                            this.homerDao.onOpenCallback = (e) => {
                                this.homerDao.sendMessage({
                                    message_type: 'getValues'
                                });

                                this.homerDao.sendMessage({
                                    message_type: 'getLogs'
                                });
                            };

                            this.homerDao.onMessageCallback = (m: any) => this.homerMessageReceived(m);
                        }
                    })
                    .catch((err) => {
                        this.zone.run(() => {
                            this.fmError(this.translate('flash_cant_load_verion', this.instance.actual_instance.b_program_version_name, err));
                        });
                    });
            }
        });
    }

    homerMessageReceived(m: any) {
        this.zone.runOutsideAngular(() => {
            const controller = this.blockoView.getBlockoController();

            if (m.message_type === 'new_input_connector_value') {
                controller.setInputConnectorValue(m.block_id, m.interface_name, m.value);
                return;
            }

            if (m.message_type === 'new_output_connector_value') {
                controller.setOutputConnectorValue(m.block_id, m.interface_name, m.value);
                return;
            }

            /* tslint:disable */

            console.log("homerMessageReceived:: m.message_type =  ", m.message_type);

            /* tslint:enable */


            // According Blocko-core its Deprecated????

            if (m.message_type === 'new_external_input_connector_value') {
                /* tslint:disable */
                    console.error("homerMessageReceived:: new_external_input_connector_value - unsopported!!! ", m.message_type);
                /* tslint:enable */
                return;
            }

            if (m.message_type === 'new_external_output_connector_value') {
                /* tslint:disable */
                console.error("homerMessageReceived:: new_external_output_connector_value - unsopported!!! ", m.message_type);
                /* tslint:enable */
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
