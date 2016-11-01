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
    selector: "view-projects-project-blocks",
    templateUrl: "app/views/projects-project-blocks.html",
})
export class ProjectsProjectBlocksComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    project: IProject = null;

    groups: ITypeOfBlock[] = [];

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params["project"];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    onGroupAddClick(): void {
        var model = new ModalsBlocksTypePropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createTypeOfBlock({
                    project_id: this.id,
                    name: model.name,
                    general_description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The blocks group has been added."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The blocks group cannot be added.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onGroupEditClick(group: ITypeOfBlock): void {
        var model = new ModalsBlocksTypePropertiesModel(group.name, group.general_description, true, group.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editTypeOfBlock(group.id, {
                    name: model.name,
                    general_description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The blocks group has been edited."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The blocks group cannot be edited.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onGroupDeleteClick(group: ITypeOfBlock): void {

        this.modalService.showModal(new ModalsRemovalModel(group.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteTypeOfBlock(group.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The blocks group has been removed."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The blocks group cannot be removed.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });

    }

    onGroupClick(group: ITypeOfBlock): void {
        this.navigate(["/projects", this.currentParamsService.get("project"), "blocks", group.id]);
    }

    refresh(): void {
        this.blockUI();
        this.backendService.getProject(this.id)
            .then((project) => {
                this.project = project;
                console.log(this.project);

                return Promise.all<ITypeOfBlock>(project.type_of_blocks_id.map((typeOfBlockId) => {
                    return this.backendService.getTypeOfBlock(typeOfBlockId);
                }));
            })
            .then((typeOfBlocks) => {
                console.log(typeOfBlocks);
                this.groups = typeOfBlocks;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
                this.unblockUI();
            });

    }

}
