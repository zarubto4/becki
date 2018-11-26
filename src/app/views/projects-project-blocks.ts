/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { FlashMessageError, FlashMessageSuccess } from '../services/NotificationService';
import { Subscription } from 'rxjs';
import { ModalsRemovalModel } from '../modals/removal';
import { IProject, IBlock, IBlockList } from '../backend/TyrionAPI';
import { ModalsBlocksBlockPropertiesModel } from '../modals/blocks-block-properties';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { ModalsBlockoBlockCopyModel } from '../modals/blocko-block-copy';

@Component({
    selector: 'bk-view-projects-project-blocks',
    templateUrl: './projects-project-blocks.html',
})
export class ProjectsProjectBlocksComponent extends _BaseMainComponent implements OnInit, OnDestroy {

    projectId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;

    blockList: IBlockList = null;
    blockPublicList: IBlockList = null;
    blockListNotApproved: IBlockList = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    tab: string = 'my_blocks';

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            if (this.projectId) {
                this.onShowProgramPrivateBlocksFilter();
            } else {
                this.tab = 'public_blocks';
                this.onShowProgramPublicBlocksFilter();
            }
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    onToggleTab(tab: string) {
        this.tab = tab;

        if (tab === 'my_blocks' && this.blockList == null) {
            this.onShowProgramPrivateBlocksFilter();
        }

        if (tab === 'public_blocks' && this.blockPublicList == null) {
            this.onShowProgramPublicBlocksFilter();
        }

        if (tab === 'admin_blocks' && this.blockListNotApproved == null) {
            this.onShowProgramPendingBlocksFilter();
        }
    }

    onPortletClick(action: string): void {
        if (action === 'add_block') {
            this.onBlockAddClick();
        }
    }

    onMakeClone(block: IBlock): void {
        let model = new ModalsBlockoBlockCopyModel(block.name, block.description, this.project.tags);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.blockClone({
                    block_id: block.id,
                   // tags: model.tags,
                    project_id: this.projectId,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_copy_success')));
                        this.unblockUI();
                        this.onShowProgramPrivateBlocksFilter();
                        this.tab = 'my_blocks';

                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_copy_fail'), reason));
                        this.unblockUI();
                    });
            }
        });
    }

    onBlockAddClick(): void {

        let model = new ModalsBlocksBlockPropertiesModel(this.projectId);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.blockCreate({
                    name: model.block.name,
                    description: model.block.description,
                    project_id: this.projectId
                })
                    .then(block => {
                        this.unblockUI();
                        this.onBlockClick(block.id);
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add_block'), reason));
                        this.onShowProgramPrivateBlocksFilter();
                    });
            }
        });
    }

    onBlockEditClick(block: IBlock): void {

        let model = new ModalsBlocksBlockPropertiesModel(this.projectId, block);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.blockEdit(block.id, {
                    name: model.block.name,
                    description: model.block.description,
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_block_edit')));
                        if (block.publish_type === 'PRIVATE') {
                            this.onShowProgramPrivateBlocksFilter();
                        } else {
                            this.onShowProgramPublicBlocksFilter();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_edit_block'), reason));
                        if (block.publish_type === 'PRIVATE') {
                            this.onShowProgramPrivateBlocksFilter();
                        } else {
                            this.onShowProgramPublicBlocksFilter();
                        }
                    });
            }
        });

    }

    onBlockDeleteClick(block: IBlock): void {

        this.modalService.showModal(new ModalsRemovalModel(block.id)).then((success) => {
            if (success) {
                this.blockUI();
                this.tyrionBackendService.blockDelete(block.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_block_remove')));
                        if (block.publish_type === 'PRIVATE') {
                            this.onShowProgramPrivateBlocksFilter();
                        } else {
                            this.onShowProgramPublicBlocksFilter();
                        }
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_block'), reason));
                        if (block.publish_type === 'PRIVATE') {
                            this.onShowProgramPrivateBlocksFilter();
                        } else {
                            this.onShowProgramPublicBlocksFilter();
                        }
                    });
            }
        });
    }

    onBlockActivateClick(block: IBlock): void {
        this.blockUI();
        this.tyrionBackendService.blockActivate(block.id)
            .then(() => {
                if (block.publish_type === 'PRIVATE') {
                    this.onShowProgramPrivateBlocksFilter();
                } else {
                    this.onShowProgramPublicBlocksFilter();
                }
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error'), reason));
                if (block.publish_type === 'PRIVATE') {
                    this.onShowProgramPrivateBlocksFilter();
                } else {
                    this.onShowProgramPublicBlocksFilter();
                }
            });
    }

    onBlockDeactivateClick(block: IBlock): void {
        this.blockUI();
        this.tyrionBackendService.blockDeactivate(block.id)
            .then(() => {
                if (block.publish_type === 'PRIVATE') {
                    this.onShowProgramPrivateBlocksFilter();
                } else {
                    this.onShowProgramPublicBlocksFilter();
                }
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_extension_deactived_error'), reason));
                if (block.publish_type === 'PRIVATE') {
                    this.onShowProgramPrivateBlocksFilter();
                } else {
                    this.onShowProgramPublicBlocksFilter();
                }
            });
    }

    onShowProgramPrivateBlocksFilter(page: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.blockGetListByFilter(page, {
            project_id: this.projectId,
        })
            .then((list) => {
                this.blockList = list;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_code'), reason));
                this.unblockUI();
            });
    }

    onShowProgramPublicBlocksFilter(page: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.blockGetListByFilter(page, {
            public_programs: true
        })
            .then((list) => {
                this.blockPublicList = list;
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Blocko cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onShowProgramPendingBlocksFilter(page: number = 0): void {
        this.blockUI();
        this.tyrionBackendService.blockGetListByFilter(page, {
            pending_blocks: true,       // For public its required
        })
            .then((list) => {
                this.blockListNotApproved = list;
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError('Blocko cannot be loaded.', reason));
                this.unblockUI();
            });
    }

    onDrobDownEmiter(action: string, object: any): void {

        if (action === 'block_copy') {
            this.onMakeClone(object);
        }

        if (action === 'block_properties') {
            this.onBlockEditClick(object);
        }

        if (action === 'block_remove') {
            this.onBlockDeleteClick(object);
        }

        if (action === 'make_decision') {
            this.onBlockAdminClick(object.id);
        }

        if (action === 'activate_block') {
            this.onBlockActivateClick(object);
        }

        if (action === 'deactivate_block') {
            this.onBlockDeactivateClick(object);
        }
    }

}
