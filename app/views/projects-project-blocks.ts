/**
 * Created by davidhradek on 21.09.16.
 */


import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {LayoutMain} from "../layouts/main";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {ModalsRemovalModel} from "../modals/removal";
import {ModalsCodePropertiesModel} from "../modals/code-properties";
import {IProject, ICProgram, ITypeOfBoard, ITypeOfBlock, IBlockoBlock} from "../backend/TyrionAPI";
import {ModalsBlocksTypePropertiesModel} from "../modals/blocks-type-properties";
import {ModalsBlocksBlockPropertiesModel} from "../modals/blocks-block-properties";

@Component({
    selector: "view-projects-project-blocks",
    templateUrl: "app/views/projects-project-blocks.html",
    directives: [ROUTER_DIRECTIVES, LayoutMain],
})
export class ProjectsProjectBlocksComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription:Subscription;

    project:IProject = null;

    groups:ITypeOfBlock[] = [];

    constructor(injector:Injector) {super(injector)};

    ngOnInit():void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params["project"];
            this.refresh();
        });
    }

    ngOnDestroy():void {
        this.routeParamsSubscription.unsubscribe();
    }

    onGroupAddClick():void {
        var model = new ModalsBlocksTypePropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backendService.createTypeOfBlock({
                    project_id: this.id,
                    name: model.name,
                    general_description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The blocks group has been added."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The blocks group cannot be added.", reason));
                        this.refresh();
                    });
            }
        });
    }

    onGroupEditClick(group:ITypeOfBlock):void {
        var model = new ModalsBlocksTypePropertiesModel(group.name, group.general_description, true, group.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backendService.editTypeOfBlock(group.id, {
                    name: model.name,
                    general_description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The blocks group has been edited."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The blocks group cannot be edited.", reason));
                        this.refresh();
                    });
            }
        });
    }

    onGroupDeleteClick(group:ITypeOfBlock):void {

        this.modalService.showModal(new ModalsRemovalModel(group.name)).then((success) => {
            if (success) {
                this.backendService.deleteTypeOfBlock(group.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The blocks group has been removed."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The blocks group cannot be removed.", reason));
                        this.refresh();
                    });
            }
        });

    }

    onBlockClick(block:IBlockoBlock):void {
        this.navigate(["/projects", this.currentParamsService.get("project"), "blocks", block.id]);
    }

    onBlockAddClick(group:ITypeOfBlock):void {

        var model = new ModalsBlocksBlockPropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backendService.createBlockoBlock({
                    type_of_block_id: group.id,
                    name: model.name,
                    general_description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The block has been added."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The block cannot be added.", reason));
                        this.refresh();
                    });
            }
        });

    }

    onBlockEditClick(block:IBlockoBlock):void {

        var model = new ModalsBlocksBlockPropertiesModel(block.name, block.general_description, true, block.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backendService.editBlockoBlock(block.id, {
                    name: model.name,
                    general_description: model.description,
                    type_of_block_id: block.type_of_block_id // tohle je trochu divný ne?
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The block has been edited."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The block cannot be edited.", reason));
                        this.refresh();
                    });
            }
        });

    }

    onBlockDeleteClick(block:IBlockoBlock):void {

        this.modalService.showModal(new ModalsRemovalModel(block.name)).then((success) => {
            if (success) {
                this.backendService.deleteBlockoBlock(block.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The block has been removed."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The block cannot be removed.", reason));
                        this.refresh();
                    });
            }
        });

    }


    refresh():void {
        this.backendService.getProject(this.id)
            .then((project:IProject) => {
                this.project = project;
                console.log(this.project);

                return Promise.all<ITypeOfBlock>(project.type_of_blocks_id.map((typeOfBlockId) => {
                    return this.backendService.getTypeOfBlock(typeOfBlockId);
                }));
            })
            .then((typeOfBlocks:ITypeOfBlock[]) => {
                console.log(typeOfBlocks);
                this.groups = typeOfBlocks;
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
            });

    }

}
