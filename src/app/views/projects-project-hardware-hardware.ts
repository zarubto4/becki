/**
 * Created by Tomas Kupcek on 12.01.2017.
 */

import { Component, Injector, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IBoard, IBoardShortDetail, ITypeOfBoard } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsHardwareBootloaderUpdateModel } from '../modals/hardware-bootloader-update';
import { ModalsHardwareCodeProgramVersionSelectModel } from '../modals/hardware-code-program-version-select';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsDeviceEditDescriptionModel } from '../modals/device-edit-description';
import { ModalsRemovalModel } from '../modals/removal';
import { OnlineChangeStatus } from '../backend/BeckiBackend';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { ModalsDeviceEditDeveloperParameterValueModel } from '../modals/device-edit-developer-parameter-value';
import { ModalsPictureUploadModel } from '../modals/picture-upload';

export interface ConfigParameters {
    key: string;
    value: any;
    type: any;
}

@Component({
    selector: 'bk-view-projects-project-hardware-hardware',
    templateUrl: './projects-project-hardware-hardware.html'
})
export class ProjectsProjectHardwareHardwareComponent extends BaseMainComponent implements OnInit, OnDestroy {

    init: boolean = false;  // Only for title and sutitle menu (for slow internet there was sometimes
    // issue with no project for admin view or for project view but with slow
    // ngOnInit method
    device: IBoard = null;
    typeOfBoard: ITypeOfBoard = null;
    projectId: string;
    hardwareId: string;
    routeParamsSubscription: Subscription;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    hardwareTab: string = 'overview';
    configParameters: ConfigParameters[];

    constructor(injector: Injector) {
        super(injector);

        this.backendService.onlineStatus.subscribe(status => {
            if (status.model === 'Board' && this.hardwareId === status.model_id) {
                this.device.online_state = status.online_status;
            }
        });
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.hardwareId = params['hardware'];
            this.projectId = params['project'];
            this.init = true;
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    onToggleHardwareTab(tab: string) {
        this.hardwareTab = tab;
    }

    refresh(): void {
        this.blockUI();
        this.backendService.boardGet(this.hardwareId) // TODO [permission]: Project.read_permission
            .then((board) => {
                this.device = board;
                this.config_array();

                this.backendService.onlineStatus.subscribe(status => {
                    if (status.model === 'HomerServer' && this.device.server.id === status.model_id) {
                        this.device.server.online_state = status.online_status;
                    }
                });

                return this.backendService.typeOfBoardGet(board.type_of_board_id);

            })
            .then((typeOfBoard) => {
                this.typeOfBoard = typeOfBoard;
                this.unblockUI();
            })
            .catch((reason) => {
                this.fmError(this.translate('label_cant_load_device'));
                this.unblockUI();
            });
    }

    config_array(): void {

        let configs: ConfigParameters[] = [];
        for (let key in this.device.bootloader_core_configuration) {
            if (true) {
                configs.push({
                    key: key,
                    value: (<any>this.device.bootloader_core_configuration)[key],
                    type: typeof ((<any>this.device.bootloader_core_configuration)[key])
                });
            }
        }

        this.configParameters = configs;

    }

    onEditClick(device: IBoardShortDetail): void {
        let model = new ModalsDeviceEditDescriptionModel(device.id, device.name, device.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.boardEditPersonalDescription(device.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_device_success')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_edit_device_fail'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onRemoveClick(device: IBoardShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(device.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.boardDisconnectFromProject(device.id) // TODO [permission]: Project.update_permission (probably implemented as device.delete_permission)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_device_success')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.router.navigate(['/projects/' + this.projectId + '/hardware']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_remove_device_fail'), reason));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                    });
            }
        });
    }

    updatePictureClick(): void {
        let model = new ModalsPictureUploadModel(null, this.device.picture_link, false);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.boardUploadPicture(this.device.id, { // TODO [permission]: edit_permission
                    file: model.file
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_picture_updated')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_picture_update'), reason));
                        this.refresh();
                    });
            }
        });
    }

    onEditParameterValue_Boolean_Click(parameter_type: string, value: boolean): void {
        this.blockUI();
        this.backendService.boardEditDevelopersParameters(this.device.id, {
            parameter_type: parameter_type,
            boolean_value: value
        })
            .then(() => {
                this.refresh();
            })
            .catch((reason) => {
                this.fmError(this.translate('flash_cannot_change_developer_parameter', reason));
                this.unblockUI();
            });
    }

    /**
     * Edit onEditParameterValue_Number_Click
     * @param parameter_user_description
     * @param parameter_type
     * @param value
     */
    onEditParameterValue_Number_Click(parameter_user_description: string, parameter_type: string, value: number): void {

        let model = new ModalsDeviceEditDeveloperParameterValueModel(this.device.id, parameter_user_description, value);

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.boardEditDevelopersParameters(this.device.id, {
                    parameter_type: parameter_type,
                    integer_value: model.value
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_device_success')));
                        this.refresh();
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('flash_cannot_change_developer_parameter', reason));
                        this.unblockUI();
                    });
            }
        });
    }

    onRestartDeviceClick(): void {
        console.info('Device Restart command');
        this.backendService.boardCommandExecution({
            board_id: this.device.id,
            command: 'RESTART'
        })
            .then(() => {
                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_device_restart_success')));
                this.refresh();
            })
            .catch((reason) => {
                this.fmError(this.translate('flash_device_restart_success_fail', reason));
                this.unblockUI();
            });
    }

    /**
     * Edit onEditParameterValue_Number_Click
     * @param parameter_user_description
     * @param parameter_type
     * @param value
     */
    onEditParameterValue_String_Click(parameter_user_description: string, parameter_type: string, value: string): void {

        let model = new ModalsDeviceEditDeveloperParameterValueModel(this.device.id, parameter_user_description, value);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.boardEditDevelopersParameters(this.device.id, {
                    parameter_type: parameter_type,
                    string_value: model.value
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_device_success')));
                        this.refresh();
                    })
                    .catch((reason) => {
                        this.fmError(this.translate('flash_cannot_change_developer_parameter', reason));
                        this.unblockUI();
                    });
            }
        });
    }

    onUpdateBootloaderClick(): void {
        if (!this.device) {
            return;
        }

        let mConfirm = new ModalsHardwareBootloaderUpdateModel(this.device.name ? this.device.name : this.device.id);
        this.modalService.showModal(mConfirm)
            .then((success) => {
                if (success) {
                    this.blockUI();
                    this.backendService.hardwareUpdateBootloader({
                        device_ids: [this.device.id]
                    })
                        .then(() => {
                            this.refresh();
                        })
                        .catch((reason) => {
                            this.fmError(this.translate('flash_cant_update_bootloader', reason));
                            this.unblockUI();
                        });
                }
            });
    }



    onAutobackupSwitchClick(backup_mode: string): void {
        if (!this.device) {
            return;
        }

        if (backup_mode === 'STATIC_BACKUP') {
            let m = new ModalsHardwareCodeProgramVersionSelectModel(this.projectId, this.device.type_of_board_id);
            this.modalService.showModal(m)
                .then((success) => {
                    if (success) {
                        this.blockUI();
                        this.backendService.boardUpdateBackup({ // TODO [permission]: Board.edit_permission
                            board_backup_pair_list: [
                                {
                                    board_id: this.device.id,
                                    backup_mode: false,
                                    c_program_version_id: m.selectedProgramVersion.version_id
                                }
                            ]
                        })
                            .then(() => {
                                this.refresh();
                            })
                            .catch((reason) => {
                                this.fmError(this.translate('flash_cant_edit_backup_mode', reason));
                                this.unblockUI();
                            });
                    }
                });
        } else {
            this.blockUI();
            this.backendService.boardUpdateBackup({ // TODO [permission]: Board.edit_permission
                board_backup_pair_list: [
                    {
                        board_id: this.device.id,
                        backup_mode: true
                    }
                ]
            })
                .then(() => {
                    this.refresh();
                })
                .catch((reason) => {
                    this.fmError(this.translate('flash_cant_edit_backup_mode', reason));
                    this.unblockUI();
                });
        }
    }
}
