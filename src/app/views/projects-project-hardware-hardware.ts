/**
 * Created by Tomas Kupcek on 12.01.2017.
 */

import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IBoard, IBoardShortDetail, ITypeOfBoard } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsHardwareBootloaderUpdateModel } from '../modals/hardware-bootloader-update';
import { ModalsHardwareCodeProgramVersionSelectModel } from '../modals/hardware-code-program-version-select';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsDeviceEditDescriptionModel } from '../modals/device-edit-description';
import { ModalsRemovalModel } from '../modals/removal';

@Component({
    selector: 'bk-view-projects-project-hardware-hardware',
    templateUrl: './projects-project-hardware-hardware.html'
})
export class ProjectsProjectHardwareHardwareComponent extends BaseMainComponent implements OnInit, OnDestroy {

    device: IBoard = null;
    typeOfBoard: ITypeOfBoard = null;

    projectId: string;
    hardwareId: string;
    routeParamsSubscription: Subscription;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    hardwareTab: string = 'overview';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.hardwareId = params['hardware'];
            this.projectId = params['project'];
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
        this.backendService.getBoard(this.hardwareId) // TODO [permission]: Project.read_permission
            .then((board) => {
                this.device = board;
                // console.log(board);
                return this.backendService.getTypeOfBoard(board.type_of_board_id);
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

    onEditClick(device: IBoardShortDetail): void {
        let model = new ModalsDeviceEditDescriptionModel(device.id, device.name, device.description);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editBoardUserDescription(device.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_device_success')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_edit_device_fail', reason)));
                        this.refresh();
                    });
            }
        });
    }

    onRemoveClick(device: IBoardShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(device.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.disconnectBoard(device.id) // TODO [permission]: Project.update_permission (probably implemented as device.delete_permission)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_edit_device_success')));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        this.router.navigate(['/projects/' + this.projectId + '/hardware']);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_remove_device_fail', reason)));
                        this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
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
                    this.backendService.bootloaderUpdateList({
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

    onDeveloperKitClick(): void {
        // TODO
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
                        this.backendService.editBoardBackup({ // TODO [permission]: Board.edit_permission
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
            this.backendService.editBoardBackup({ // TODO [permission]: Board.edit_permission
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
