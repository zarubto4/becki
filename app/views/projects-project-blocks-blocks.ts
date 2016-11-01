/**
 * Created by davidhradek on 01.11.16.
 */

/**
 * Created by davidhradek on 21.09.16.
 */


import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {Subscription} from "rxjs/Rx";
import {ModalsRemovalModel} from "../modals/removal";
import {IProject, ITypeOfBlock, IBlockoBlock} from "../backend/TyrionAPI";
import {ModalsBlocksTypePropertiesModel} from "../modals/blocks-type-properties";
import {ModalsBlocksBlockPropertiesModel} from "../modals/blocks-block-properties";

@Component({
    selector: "view-projects-project-blocks-blocks",
    templateUrl: "app/views/projects-project-blocks-blocks.html",
})
export class ProjectsProjectBlocksBlocksComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;
    blocksId: string;

    routeParamsSubscription: Subscription;

    //project: IProject = null;

    group: ITypeOfBlock = null;

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params["project"];
            this.blocksId = params["blocks"];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    onBlockClick(block: IBlockoBlock): void {
        this.navigate(["/projects", this.currentParamsService.get("project"), "blocks", this.blocksId, block.id]);
    }

    onBlockAddClick(group: ITypeOfBlock): void {

        var model = new ModalsBlocksBlockPropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createBlockoBlock({
                    type_of_block_id: group.id,
                    name: model.name,
                    general_description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The block has been added."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The block cannot be added.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });

    }

    onBlockEditClick(block: IBlockoBlock): void {

        var model = new ModalsBlocksBlockPropertiesModel(block.name, block.general_description, true, block.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editBlockoBlock(block.id, {
                    name: model.name,
                    general_description: model.description,
                    type_of_block_id: block.type_of_block_id // tohle je trochu divný ne?
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The block has been edited."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The block cannot be edited.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });

    }

    onBlockDeleteClick(block: IBlockoBlock): void {

        this.modalService.showModal(new ModalsRemovalModel(block.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteBlockoBlock(block.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The block has been removed."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The block cannot be removed.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });

    }


    refresh(): void {
        this.blockUI();
        this.backendService.getTypeOfBlock(this.blocksId)
            .then((typeOfBlock) => {
                this.group = typeOfBlock;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
                this.unblockUI();
            });

    }

}
