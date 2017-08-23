/**
 * Created by davidhradek on 05.12.16.
 */

import { Component, Injector, OnInit } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import {
    ICProgram, ICProgramFilter, ICProgramList, ICProgramShortDetail, IRoleShortDetai,
    ITypeOfBoard
} from '../backend/TyrionAPI';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsPermissionGroupModel } from '../modals/permission-group';
import { ModalsCodePropertiesModel } from '../modals/code-properties';

@Component({
    selector: 'bk-view-admin-cprograms',
    templateUrl: './admin-cprograms.html'
})
export class CommunityCProgramComponent extends BaseMainComponent implements OnInit {

    cPrograms: ICProgramList = null;
    cProgramsNotApproved: ICProgramList = null;
    typeOfBoards: ITypeOfBoard[] = null;

    tab: string = 'public_c_programs';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.blockUI();

        Promise.all<any>([this.backendService.typeOfBoardsGetAll()])
            .then((values: [ITypeOfBoard[]]) => {
                this.typeOfBoards = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Roles cannot be loaded.', reason));
                this.unblockUI();
            });

        // Find first 25 objects
        this.onShowPublicProgramByFilter();
        this.onShowForDecisionsProgramByFilter();
    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }


    onShowPublicProgramByFilter(page: number = 0): void {
        Promise.all<any>([this.backendService.cProgramGetListByFilter(page, {
            project_id: null,
            public_programs: true,       // For public its required
            public_states: ['approved']  //  Only Aproved
        })
        ])
            .then((values: [ICProgramList]) => {
                this.cPrograms = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('C Programs cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onShowForDecisionsProgramByFilter(page: number = 0): void {
        Promise.all<any>([this.backendService.cProgramGetListByFilter(page, {
            project_id: null,
            public_programs: true,       // For public its required
            public_states: ['pending']  //  Only Approved
        })
        ])
            .then((values: [ICProgramList]) => {
                this.cProgramsNotApproved = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('C Programs cannot be loaded.', reason));
                this.unblockUI();
            });
    }


    onCProgramRemoveClick(code: ICProgramShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(code.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.cProgramDelete(code.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_remove')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_code', reason)));
                        this.refresh();
                    });
            }
        });
    }

    onCProgramAddClick(): void {
        if (!this.typeOfBoards) {
            this.fmError(this.translate('flash_cant_add_code'));
        }
        let model = new ModalsCodePropertiesModel(this.typeOfBoards);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.cProgramCreate({ // TODO [permission]: C_program.create_permission (Project.update_permission)
                    project_id: null,
                    name: model.name,
                    description: model.description,
                    type_of_board_id: model.deviceType
                })
                    .then((program: ICProgram) => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_add', model.name)));
                        this.router.navigate(['/admin/hardware/code/', program.id]);
                        // this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add_code_reason', model.name, reason)));
                        this.refresh();
                    });
            }
        });
    }

    onCProgramEditClick(code: ICProgramShortDetail): void {
        if (!this.typeOfBoards) {
            this.fmError(this.translate('flash_cant_add_code_to_project'));
        }

        let model = new ModalsCodePropertiesModel(this.typeOfBoards, code.name, code.description, '', true, code.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.cProgramEdit(code.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_update')));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code', reason)));
                        this.refresh();
                    });
            }
        });
    }
    // localhost:8080/admin/hardware/code/5661957-83e0-476d-a9ec-16404bb4cc8e

    onCProgramPublish(cprogram: ICProgramShortDetail): void {
        // TODO
    }

    onCProgramUnPublish(cprogram: ICProgramShortDetail): void {
        // TODO
    }

    onCProgramClick(cProgram: ICProgramShortDetail): void {
        this.router.navigate(['/admin/hardware/code', cProgram.id]);
    }

    onTypeOfBoardTypeClick(boardTypeId: string): void {
        this.router.navigate(['/hardware', boardTypeId]);
    }


}




