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
    IProject, ITypeOfBlock, IBlockoBlock, ITypeOfBlockShortDetail,
    IBlockoBlockShortDetail
} from '../backend/TyrionAPI';
import { ModalsBlocksTypePropertiesModel } from '../modals/blocks-type-properties';
import { ModalsBlocksBlockPropertiesModel } from '../modals/blocks-block-properties';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsBlockoBlockCopyModel } from '../modals/blocko-block-copy';

@Component({
    selector: 'bk-view-projects-project-blocks-blocks',
    templateUrl: './projects-project-blocks-blocks.html',
})
export class ProjectsProjectBlocksBlocksComponent extends BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    typeOfBlockId: string;
    project: IProject = null;

    group: ITypeOfBlockShortDetail | ITypeOfBlock = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.typeOfBlockId = params['blocks'];

            if (this.projectId) {
                this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                    this.project = project;
                    this.group = project.type_of_blocks.find((tb) => tb.id === this.typeOfBlockId);

                    if (!this.group) {
                        this.refresh();
                    }
                });
            } else {
                this.refresh();
            }
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    refresh(): void {
        this.blockUI();
        Promise.all<any>([this.backendService.typeOfBlockGet(this.typeOfBlockId)])
            .then((values: [ITypeOfBlock]) => {
                this.group = values[0];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Block Group cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onBlockClick(block: IBlockoBlockShortDetail): void {
        if (this.projectId) {
            this.navigate(['/projects', this.currentParamsService.get('project'), 'blocks', this.typeOfBlockId, block.id]);
        } else {
            this.navigate(['/admin/blocks/', this.typeOfBlockId, block.id]);
        }
    }

    onMakeClone(block: IBlockoBlockShortDetail): void {
        let model = new ModalsBlockoBlockCopyModel(block.name, block.description, this.project.type_of_blocks);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.blockoBlockMakeClone({
                    blocko_block_id: block.id,
                    type_of_blocks_id: model.type_of_blocks,
                    project_id: this.projectId,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_copy_success')));
                        this.unblockUI();

                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_copy_fail'), reason));
                        this.unblockUI();
                    });
            }
        });
    }

    onGroupEditClick(): void {
        let model = new ModalsBlocksTypePropertiesModel(this.group.name, this.group.description, true, this.group.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfBlockEdit(this.group.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_block_groups_edit')));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_edit_block_groups'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    });
            }
        });
    }

    onGroupDeleteClick(): void {
        this.modalService.showModal(new ModalsRemovalModel(this.group.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.typeOfBlockDelete(this.group.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_block_groups_remove')));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_block_groups.'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    });
            }
        });

    }


    onBlockAddClick(group: ITypeOfBlockShortDetail): void {

        let model = new ModalsBlocksBlockPropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.blockoBlockCreate({
                    type_of_block_id: group.id,
                    name: model.name,
                    general_description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_block_add')));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add_block'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    });
            }
        });

    }

    onBlockEditClick(block: IBlockoBlockShortDetail): void {

        let model = new ModalsBlocksBlockPropertiesModel(block.name, block.description, true, block.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.blockoBlockEdit(block.id, {
                    name: model.name,
                    general_description: model.description,
                    type_of_block_id: this.typeOfBlockId // tohle je trochu divný ne?
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_block_edit')));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_edit_block'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    });
            }
        });

    }

    onBlockDeleteClick(block: IBlockoBlockShortDetail): void {

        this.modalService.showModal(new ModalsRemovalModel(block.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.blockoBlockDelete(block.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_block_remove')));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_block'), reason));
                        if (this.projectId) {
                            this.storageService.projectRefresh(this.projectId).then(() => this.unblockUI());
                        } else {
                            this.refresh();
                        }
                    });
            }
        });
    }

    onBlockActivateClick(block: IBlockoBlockShortDetail): void {
        this.blockUI();
        this.backendService.blockoBlockActivate(block.id)
            .then(() => {
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error'), reason));
                this.refresh();
            });
    }

    onBlockDeactivateClick(block: IBlockoBlockShortDetail): void {
        this.blockUI();
        this.backendService.blockoBlockDeactivate(block.id)
            .then(() => {
                this.refresh();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error'), reason));
                this.refresh();
            });
    }

}
