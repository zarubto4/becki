/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs';
import { ModalsRemovalModel } from '../modals/removal';
import { ModalsCodePropertiesModel } from '../modals/code-properties';
import { IProject, IHardwareType, ICProgram, ICProgramList } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { IError } from '../services/_backend_class/Responses';

@Component({
    selector: 'bk-view-projects-project-code',
    templateUrl: './projects-project-code.html',
})
export class ProjectsProjectCodeComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    project_id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;
    hardwareTypesSubscription: Subscription;

    project: IProject = null;

    privatePrograms: ICProgramList = null;
    publicPrograms: ICProgramList = null;
    adminForDecisionsPrograms: ICProgramList = null;

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
                this.onFilterPrivatePrograms();
            });
        });
    }

    onPortletClick(action: string): void {
        if (action === 'add_code') {
            this.onAddClick();
        }
    }

    onToggleTab(tab: string) {
        this.tab = tab;
        if (this.publicPrograms == null && tab === 'public_c_programs') {
            this.onFilterPublicPrograms(null);
        }
        if (this.adminForDecisionsPrograms == null && tab === 'admin_c_programs') {
            this.onShowProgramPendingCodeFilter(null);
        }
    }


    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }


    onRemoveClick(code: ICProgram): void {
        this.modalService.showModal(new ModalsRemovalModel(code.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramDelete(code.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_remove')));
                        this.unblockUI();
                        if (code.publish_type === 'PRIVATE') {
                            this.onFilterPrivatePrograms();
                        } else {
                            this.onFilterPublicPrograms();
                        }
                    })
                    .catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_code'), reason));
                        if (code.publish_type === 'PRIVATE') {
                            this.onFilterPrivatePrograms();
                        } else {
                            this.onFilterPublicPrograms();
                        }
                    });
            }
        });
    }

    onAddClick(): void {
        this.blockUI();
        this.tyrionBackendService.hardwareTypesGetAll()
            .then( (types: IHardwareType[]) => {
                this.unblockUI();
                let model = new ModalsCodePropertiesModel(types, this.project_id);
                this.modalService.showModal(model).then((success) => {
                    if (success) {
                        this.blockUI();
                        this.tyrionBackendService.cProgramCreate({
                            project_id: this.project_id,
                            hardware_type_id: model.hardware_type_id,
                            name: model.program.name,
                            description: model.program.description,
                            tags: model.program.tags
                        })
                            .then(cProgram => {
                                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_add_to_project', model.program.name)));
                                this.unblockUI();
                                this.onCProgramClick(cProgram.id);
                            })
                            .catch((reason: IError) => {
                                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add_code_to_project_with_reason', model.program.name, reason)));
                                this.unblockUI();
                                this.onFilterPrivatePrograms();
                            });
                    }
                });
            });
    }

    onEditClick(code: ICProgram): void {
        this.blockUI();
        this.tyrionBackendService.hardwareTypesGetAll()
            .then( (types: IHardwareType[]) => {
                this.unblockUI();
                let model = new ModalsCodePropertiesModel(types, this.project_id, code);
                this.modalService.showModal(model).then((success) => {
                    if (success) {
                        this.blockUI();
                        this.tyrionBackendService.cProgramEdit(code.id, {
                            name: model.program.name,
                            description: model.program.description,
                            tags: model.program.tags
                        })
                            .then(() => {
                                this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_update')));
                                if (code.publish_type === 'PRIVATE') {
                                    this.onFilterPrivatePrograms();
                                } else {
                                    this.onFilterPublicPrograms();
                                }
                            })
                            .catch((reason: IError) => {
                                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                                if (code.publish_type === 'PRIVATE') {
                                    this.onFilterPrivatePrograms();
                                } else {
                                    this.onFilterPublicPrograms();
                                }
                            });
                    }
                });
            });
    }

    onMakeClone(code: ICProgram): void {
        let model = new ModalsCodePropertiesModel(null, this.project_id, code);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.cProgramMakeClone({
                    c_program_id: code.id,
                    project_id: this.project_id,
                    name: model.program.name,
                    description: model.program.description,
                    tags: model.program.tags
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_code_update')));
                        this.onFilterPrivatePrograms();
                        this.tab = 'my_programs';
                    })
                    .catch((reason: IError) => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                        this.onFilterPrivatePrograms();
                        this.onFilterPublicPrograms();
                    });
            }
        });
    }

    onFilterPrivatePrograms(page: number = 0): void {
        // Only for first page load - its not neccesery block page - user saw private programs first - soo api have time to load
        if (page != null) {
            this.blockUI();
        } else {
            page = 1;
        }

        this.tyrionBackendService.cProgramGetListByFilter(page, {
            project_id: this.project_id
        })
            .then((iCProgramList) => {
                this.privatePrograms = iCProgramList;
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.unblockUI();
            });
    }

    onFilterPublicPrograms(page: number = 0): void {

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
            .catch((reason: IError) => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.unblockUI();
            });
    }

    onShowProgramPendingCodeFilter(page: number = 0): void {

        // Only for first page load - its not neccesery block page - user saw private programs first - soo api have time to load
        if (page != null) {
            this.blockUI();
        } else {
            page = 1;
        }

        this.tyrionBackendService.cProgramGetListByFilter(page, {
            pending_programs: true,
        })
            .then((iCProgramList) => {
                this.publicPrograms = iCProgramList;
                this.unblockUI();
            })
            .catch((reason: IError) => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_code'), reason));
                this.unblockUI();
            });
    }

    onDrobDownEmiter(action: string, object: any): void {

        if (action === 'code_program_clone') {
            this.onMakeClone(object);
        }

        if (action === 'code_program_properties') {
            this.onEditClick(object);
        }

        if (action === 'remove_code_program') {
            this.onRemoveClick(object);
        }

    }

}
