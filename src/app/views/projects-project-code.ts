/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsCodePropertiesModel } from '../modals/code-properties';
import { IProject, IHardwareType, ICProgramShortDetail, ICProgramList } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-projects-project-code',
    templateUrl: './projects-project-code.html',
})
export class ProjectsProjectCodeComponent extends BaseMainComponent implements OnInit, OnDestroy {

    project_id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;
    hardwareTypesSubscription: Subscription;

    project: IProject = null;

    codePrograms: ICProgramShortDetail[] = null;
    publicPrograms: ICProgramList = null;

    hardwareTypes: IHardwareType[] = null;

    tab: string = 'my_programs';

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.project_id = params['project'];
            this.projectSubscription = this.storageService.project(this.project_id).subscribe((project) => {
                this.project = project;
                this.codePrograms = project.c_programs;
            });
            this.hardwareTypesSubscription = this.storageService.hardwareTypes().subscribe((hardwareTypes) => {
                this.hardwareTypes = hardwareTypes;
            });
        });

    }

    onToggleTab(tab: string) {
        this.tab = tab;

        if (this.publicPrograms == null && tab === 'public_c_programs') {
            this.onFilterPublicPrograms(null);
        }
    }


    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
        if (this.hardwareTypesSubscription) {
            this.hardwareTypesSubscription.unsubscribe();
        }
    }

    onCodeClick(code: ICProgramShortDetail): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'code', code.id]);
    }


    onRemoveClick(code: ICProgramShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(code.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramDelete(code.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_remove')));
                        this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_code'), reason));
                        this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onAddClick(): void {
        if (!this.hardwareTypes) {
            this.fmError(this.translate('flash_cant_add_code_to_project'));
        }
        let model = new ModalsCodePropertiesModel(this.hardwareTypes);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramCreate({ // TODO [permission]: C_program.create_permission (Project.update_permission)
                    project_id: this.project_id,
                    name: model.name,
                    description: model.description,
                    type_of_board_id: model.deviceType
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_add_to_project', model.name)));
                        this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add_code_to_project_with_reason', model.name, reason)));
                        this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onEditClick(code: ICProgramShortDetail): void {
        if (!this.hardwareTypes) {
            this.fmError(this.translate('flash_cant_add_code_to_project'));
        }

        let model = new ModalsCodePropertiesModel(this.hardwareTypes, code.name, code.description, '', true, code.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramEdit(code.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_update')));
                        this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                        this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onMakeClone(code: ICProgramShortDetail): void {
        let model = new ModalsCodePropertiesModel(null, code.name, code.description, '', true, code.name, true);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramMakeClone({
                    c_program_id: code.id,
                    project_id: this.project_id,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_update')));
                        this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                        this.storageService.projectRefresh(this.project_id).then(() => this.unblockUI());
                    });
            }
        });
    }

    selectedFilterPagePublic(event: { index: number }) {
        this.onFilterPublicPrograms(event.index);
    }

    onFilterPublicPrograms(page: number): void {

        // Only for first page load - its not neccesery block page - user saw private programs first - soo api have time to load
        if (page != null) {
            this.blockUI();
        } else {
            page = 1;
        }

        this.tyrionBackendService.cProgramGetListByFilter(page, {
            public_programs: true,
        })
            .then((iCProgramList) => {
                this.publicPrograms = iCProgramList;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.unblockUI();
            });
    }

}
