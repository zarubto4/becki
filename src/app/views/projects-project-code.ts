/**
 * Created by davidhradek on 15.08.16.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsCodePropertiesModel } from '../modals/code-properties';
import { IProject, ITypeOfBoard, ICProgramShortDetail } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-projects-project-code',
    templateUrl: './projects-project-code.html',
})
export class ProjectsProjectCodeComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;
    typeOfBoardsSubscription: Subscription;

    project: IProject = null;

    codePrograms: ICProgramShortDetail[] = null;

    typeOfBoards: ITypeOfBoard[] = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['project'];
            this.projectSubscription = this.storageService.project(this.id).subscribe((project) => {
                this.project = project;
                this.codePrograms = project.c_programs;
            });
            this.typeOfBoardsSubscription = this.storageService.typeOfBoards().subscribe((typeOfBoards) => {
                this.typeOfBoards = typeOfBoards;
            });
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onCodeClick(code: ICProgramShortDetail): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'code', code.id]);
    }

    onBoardTypeClick(boardTypeId: string): void {
        this.navigate(['/hardware', boardTypeId]);
    }

    onRemoveClick(code: ICProgramShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(code.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteCProgram(code.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The code has been removed.'));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The code cannot be removed.', reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onAddClick(): void {
        if (!this.typeOfBoards) {
            this.fmError(`The code cannot be added to project.`);
        }
        let model = new ModalsCodePropertiesModel(this.typeOfBoards);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createCProgram({
                    project_id: this.id,
                    name: model.name,
                    description: model.description,
                    type_of_board_id: model.deviceType
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(`The code ${model.name} has been added to project.`));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(`The code ${model.name} cannot be added to project.`, reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onEditClick(code: ICProgramShortDetail): void {
        if (!this.typeOfBoards) {
            this.fmError(`The code cannot be added to project.`);
        }

        let model = new ModalsCodePropertiesModel(this.typeOfBoards, code.name, code.description, '', true, code.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editCProgram(code.id, {
                    project_id: this.id,
                    name: model.name,
                    description: model.description,
                    type_of_board_id: code.type_of_board_id
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('The code has been updated.'));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError('The code cannot be updated.', reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

}
