/**
 * Created by davidhradek on 21.09.16.
 */


import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/NotificationService";
import {Subscription} from "rxjs/Rx";
import {ModalsRemovalModel} from "../modals/removal";
import {IProject, ITypeOfBlock, ITypeOfBlockShortDetail} from "../backend/TyrionAPI";
import {ModalsBlocksTypePropertiesModel} from "../modals/blocks-type-properties";

@Component({
    selector: "view-projects-project-blocks",
    templateUrl: "app/views/projects-project-blocks.html",
})
export class ProjectsProjectBlocksComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;

    groups: ITypeOfBlockShortDetail[] = [];

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params["project"];
            this.projectSubscription = this.storageService.project(this.id).subscribe((project) => {
                this.project = project;
                this.groups = this.project.type_of_blocks;
            });
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) this.projectSubscription.unsubscribe();
    }

    onGroupAddClick(): void {
        let model = new ModalsBlocksTypePropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createTypeOfBlock({
                    project_id: this.id,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The blocks group has been added."));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The blocks group cannot be added.", reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onGroupEditClick(group: ITypeOfBlock): void {
        let model = new ModalsBlocksTypePropertiesModel(group.name, group.description, true, group.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editTypeOfBlock(group.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The blocks group has been edited."));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The blocks group cannot be edited.", reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
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
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The blocks group cannot be removed.", reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });

    }

    onGroupClick(group: ITypeOfBlock): void {
        this.navigate(["/projects", this.currentParamsService.get("project"), "blocks", group.id]);
    }

}
