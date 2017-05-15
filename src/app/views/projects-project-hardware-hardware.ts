/**
 * Created by Tomas Kupcek on 12.01.2017.
 */

import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { IBoard, ITypeOfBoard } from '../backend/TyrionAPI';
import { Subscription } from 'rxjs';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-projects-project-hardware-hardware',
    templateUrl: './projects-project-hardware-hardware.html'
})
export class ProjectsProjectHardwareHardwareComponent extends BaseMainComponent implements OnInit, OnDestroy {

    device: IBoard = null;
    typeOfBoard: ITypeOfBoard = null;

    hardwareId: string;
    routeParamsSubscription: Subscription;

    timelinePosition: number;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.hardwareId = params['hardware'];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh(): void {
        this.blockUI();
        this.backendService.getBoard(this.hardwareId)
            .then((board) => {
                this.device = board;
                /*this.device.mac_address = '21:23:43:45:34';
                this.device.wifi_mac_address = '11:45:ab:4c:37';
                this.device.personal_description = 'Muj device na stole.';
                this.device.status.status = 'online';
                this.device.status.actual_c_program_id = '32135234j2345h2343454k524';
                this.device.status.actual_c_program_name = 'Program s boilerem';
                this.device.status.actual_c_program_version_name = '1.23.3';
                this.device.status.b_program_id = '32135234j2345h2343454jk524';
                this.device.status.b_program_name = 'Program s boilerem';
                this.device.status.b_program_version_name = '1.2.3';
                this.device.status.instance_id = '6342849583943n343kjc';
                this.device.actual_bootloader_id = '6342849583943n343kjc';
                this.device.actual_bootloader_version_name = 'Karel';
                this.device.avaible_bootloader_id = 'gfgfdgtrf';
                this.device.avaible_bootloader_version_name = 'Opaleny Karel';*/
                // console.log(this.device);
                if (this.device && this.device.status) {
                    this.timelinePosition = (this.device.status.required_c_programs.length * -200) + 800;
                } else {
                    this.timelinePosition = 0;
                }

                // console.log(board);
                return this.backendService.getTypeOfBoard(board.type_of_board_id);

            })
            .then((typeOfBoard) => {
                this.typeOfBoard = typeOfBoard;
                // this.typeOfBoard.picture_link = 'https://static.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg';
                // console.log(this.typeOfBoard);
                this.unblockUI();

            })
            .catch((reason) => {
                this.fmError('Device cannot be loaded.', reason);
                this.unblockUI();
            });
    }

    onBoardTypeClick(boardTypeId: string): void {
        this.navigate(['/hardware', boardTypeId]);
    }

    onProducerClick(producerId: string): void {
        if (producerId) {
            this.navigate(['/producers', producerId]);
        }
    }

    onServerClick(): void {
        alert('TODO');
    }

    onInstanceClick(instanceId: string): void {
        if (instanceId) {
            this.navigate(['/projects', this.device.project_id, 'instances', instanceId]);
        }
    }

    timelineMove(position: number): void {

        this.timelinePosition += position;

        if (this.timelinePosition > 0 || this.timelinePosition < (-this.device.status.required_c_programs.length * 200) + 800) {
            this.timelinePosition = 0;
        }
    }

    onUpdateBootloaderClick(): void {
    }

    onAutobackupSwitchClick(): void {
        if (!this.device) {
            return;
        }
        this.blockUI();
        this.backendService.editBoardBackup({
            board_backup_pair_list: [
                    {board_id: this.device.id, backup_mode: !this.device.backup_mode}
            ]
        })
            .then(() => {
                this.refresh();
            })
            .catch((reason) => {
                this.fmError('Device backup mode cannot be saved.', reason);
                this.unblockUI();
            });
    }


    onCProgramClick(CProgramId: string): void {
        if (CProgramId) {
            this.navigate(['/projects', this.device.project_id, 'code', CProgramId]);
        }
    }

    onBProgramClick(BProgramId: string): void {
        if (BProgramId) {
            this.navigate(['/projects', this.device.project_id, 'blocko', BProgramId]);
        }
    }

    onBProgramVersionClick(BProgramId: string, BProgramVersionId: string) {
        if (BProgramId && BProgramVersionId) {
            this.router.navigate(['projects', this.device.project_id, 'blocko', BProgramId, { version: BProgramVersionId }]);

        }
    }
}
