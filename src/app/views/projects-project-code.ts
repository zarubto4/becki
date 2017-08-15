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
        if (this.typeOfBoardsSubscription) {
            this.typeOfBoardsSubscription.unsubscribe();
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
                this.backendService.cProgramDelete(code.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_remove')));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_code', reason)));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onAddClick(): void {
        if (!this.typeOfBoards) {
            this.fmError(this.translate('flash_cant_add_code_to_project'));
        }
        let model = new ModalsCodePropertiesModel(this.typeOfBoards);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.cProgramCreate({ // TODO [permission]: C_program.create_permission (Project.update_permission)
                    project_id: this.id,
                    name: model.name,
                    description: model.description,
                    type_of_board_id: model.deviceType
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_add_to_project', model.name)));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add_code_to_project_with_reason', model.name, reason)));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onEditClick(code: ICProgramShortDetail): void {
        if (!this.typeOfBoards) {
            this.fmError(this.translate('flash_cant_add_code_to_project'));
        }

        let model = new ModalsCodePropertiesModel(this.typeOfBoards, code.name, code.description, '', true, code.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.cProgramEdit(code.id, {
                    project_id: this.id,
                    name: model.name,
                    description: model.description,
                    type_of_board_id: code.type_of_board_id
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_update')));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code', reason)));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

}
