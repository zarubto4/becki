/**
 * Created by davidhradek on 01.11.16.
 */

/**
 * Created by davidhradek on 21.09.16.
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

@Component({
    selector: 'bk-view-projects-project-blocks-blocks',
    templateUrl: './projects-project-blocks-blocks.html',
})
export class ProjectsProjectBlocksBlocksComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;
    blocksId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    // project: IProject = null;

    group: ITypeOfBlockShortDetail = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['project'];
            this.blocksId = params['blocks'];
            this.projectSubscription = this.storageService.project(this.id).subscribe((project) => {
                this.group = project.type_of_blocks.find((tb) => tb.id === this.blocksId);
            });
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
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
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_edit_block_groups', reason)));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
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
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_block_groups.', reason)));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });

    }

    onBlockClick(block: IBlockoBlockShortDetail): void {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'blocks', this.blocksId, block.id]);
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
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_add_block', reason)));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
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
                    type_of_block_id: this.blocksId // tohle je trochu divný ne?
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(this.translate('flash_block_edit')));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_edit_block', reason)));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
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
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(this.translate('flash_cant_remove_block', reason)));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });

    }

}
