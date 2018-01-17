/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { ModalsRemovalModel } from '../modals/removal';
import {
    IBlockoBlockFilterDetail,
    IBlockoBlockList, IBlockoBlockShortDetail, IProject, ITypeOfBlock, ITypeOfBlockList,
    ITypeOfBlockShortDetail
} from '../backend/TyrionAPI';
import { ModalsBlocksTypePropertiesModel } from '../modals/blocks-type-properties';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-projects-project-blocks',
    templateUrl: './projects-project-blocks.html',
})
export class ProjectsProjectBlocksComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;
    privateGroups: ITypeOfBlockShortDetail[] = [];
    publicGroups: ITypeOfBlockList = null;

    blocksNotApproved: IBlockoBlockList = null; // Only if user is Admin and there is no project

    tab: string = 'public_groups';

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    onToggleTab(tab: string) {
        this.tab = tab;

        if (tab === 'public_groups' && this.publicGroups == null) {
            this.onShowPublicBlockoGroupsByFilter();
        }

        if (tab === 'admin_programs_for_decisions' && this.blocksNotApproved == null) {
            this.onShowProgramForDecisionsByFilter();
        }
    }

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];

            if (this.projectId) {
                this.tab = 'private_groups';
                this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                    this.project = project;
                    this.onShowPrivateBlockoGroupsByFilter();
                });
            } else {
                this.onShowPublicBlockoGroupsByFilter();
            }
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onGroupAddClick(): void {
        let model = new ModalsBlocksTypePropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfBlockCreate({
                    project_id: this.projectId ? this.projectId : null,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_block_group_add')));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.onShowPublicBlockoGroupsByFilter();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add_block_group'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.onShowPublicBlockoGroupsByFilter();
                        }
                    });
            }
        });
    }

    onGroupEditClick(group: ITypeOfBlock): void {
        let model = new ModalsBlocksTypePropertiesModel(group.name, group.description, true, group.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfBlockEdit(group.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_block_group_edit')));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.onShowPublicBlockoGroupsByFilter();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_edit_block_group'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.onShowPublicBlockoGroupsByFilter();
                        }
                    });
            }
        });
    }

    onGroupDeleteClick(group: ITypeOfBlock): void {
        this.modalService.showModal(new ModalsRemovalModel(group.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfBlockDelete(group.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess('flash_block_group_remove'));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.onShowPublicBlockoGroupsByFilter();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_block_group'), reason));
                        this.unblockUI();
                    });
            }
        });

    }

    onShowPrivateBlockoGroupsByFilter(page: number = 0): void {
        this.privateGroups = this.project.type_of_blocks;
    }

    onShowPublicBlockoGroupsByFilter(page: number = 0): void {
        this.blockUI();
        Promise.all<any>([this.backendService.typeOfBlocksGetByFilter(page, {
            public_programs: true,       // For public its required
        })
        ])
            .then((values: [ITypeOfBlockList]) => {
                this.publicGroups = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('C Programs cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onShowProgramForDecisionsByFilter(page: number = 0): void {
        this.blockUI();
        Promise.all<any>([this.backendService.blockoBlockGetByFilter(page, {
            pending_blocks: true,       // For public its required
        })
        ])
            .then((values: [IBlockoBlockList]) => {
                this.blocksNotApproved = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('C Programs cannot be loaded.', reason));
                this.unblockUI();
            });
    }


    onGroupShiftUpClick(group: ITypeOfBlockShortDetail): void {
        this.backendService.typeOfBlockOrderUp(group.id)
            .then(() => {
                this.onShowPublicBlockoGroupsByFilter();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_label'), reason));
                this.onShowPublicBlockoGroupsByFilter();
            });
    }

    onGroupShiftDownClick(group: ITypeOfBlockShortDetail): void {
        this.backendService.typeOfBlockOrderDown(group.id)
            .then(() => {
                this.onShowPublicBlockoGroupsByFilter();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_update_label'), reason));
                this.onShowPublicBlockoGroupsByFilter();
            });
    }

    onGroupActivateClick(group: ITypeOfBlockShortDetail): void {
        this.blockUI();
        this.backendService.typeOfBlocksActivate(group.id)
            .then(() => {
                this.onShowPublicBlockoGroupsByFilter();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error'), reason));
                this.onShowPublicBlockoGroupsByFilter();
            });
    }

    onGroupDeactivateClick(group: ITypeOfBlockShortDetail): void {
        this.blockUI();
        this.backendService.typeOfBlocksDeactivate(group.id)
            .then(() => {
                this.onShowPublicBlockoGroupsByFilter();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error'), reason));
                this.onShowPublicBlockoGroupsByFilter();
            });
    }

    onGroupClick(group: ITypeOfBlock): void {
        if (this.project) {
            this.navigate(['/projects', this.currentParamsService.get('project'), 'blocks', group.id]);
        } else {
            this.router.navigate(['/admin/blocks/', group.id]);
        }
    }

    onBlockForDecisionClick(block: IBlockoBlockFilterDetail): void {
        this.router.navigate(['/admin/block/', block.blocko_block_id]);
    }

}
