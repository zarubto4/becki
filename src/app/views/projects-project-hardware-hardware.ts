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
                // console.log(board);
                return this.backendService.getTypeOfBoard(board.type_of_board_id);
            })
            .then((typeOfBoard) => {
                this.typeOfBoard = typeOfBoard;
                // console.log(typeOfBoard);
                this.unblockUI();
            })
            .catch((reason) => {
                this.fmError('Project cannot be loaded.', reason);
                this.unblockUI();
            });
    }

    onBoardTypeClick(boardTypeId: string): void {
        this.navigate(['/hardware', boardTypeId]);
    }

    onProducerClick(producerId: string): void {
        this.navigate(['/producers', producerId]);
    }
}
