/**
 * Created by davidhradek on 15.08.16.
 */
/**
 * Created by davidhradek on 10.08.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/NotificationService";
import {Subscription} from "rxjs/Rx";
import {ModalsRemovalModel} from "../modals/removal";
import {ModalsBlockoPropertiesModel} from "../modals/blocko-properties";
import {IProject, IBProgramShortDetail} from "../backend/TyrionAPI";

@Component({
    selector: "view-projects-project-blocko",
    templateUrl: "app/views/projects-project-blocko.html",
})
export class ProjectsProjectBlockoComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;

    blockoPrograms: IBProgramShortDetail[] = null;

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params["project"];
            this.projectSubscription = this.storageService.project(this.id).subscribe((project) => {
                this.project = project;
                this.blockoPrograms = project.b_programs;
            });
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) this.projectSubscription.unsubscribe();
    }

    onBlockoClick(blocko: IBProgramShortDetail): void {
        this.navigate(["/projects", this.currentParamsService.get("project"), "blocko", blocko.id]);
    }

    onRemoveClick(blocko: IBProgramShortDetail): void {
        this.modalService.showModal(new ModalsRemovalModel(blocko.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteBProgram(blocko.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The blocko has been removed."));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The blocko cannot be removed.", reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onAddClick(): void {
        let model = new ModalsBlockoPropertiesModel(this.id);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createBProgram(this.id, {name: model.name, description: model.description})
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(`The blocko ${model.name} has been added to project.`));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(`The blocko ${model.name} cannot be added to project.`, reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

    onEditClick(blocko: IBProgramShortDetail): void {
        let model = new ModalsBlockoPropertiesModel(this.id, blocko.name, blocko.description, true, blocko.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editBProgram(blocko.id, {name: model.name, description: model.description})
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The blocko has been updated."));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The blocko cannot be updated.", reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });
    }

}
