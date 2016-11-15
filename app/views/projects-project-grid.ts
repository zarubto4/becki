/**
 * Created by davidhradek on 18.10.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {Subscription} from "rxjs/Rx";
import {ModalsRemovalModel} from "../modals/removal";
import {IProject, IMProject} from "../backend/TyrionAPI";
import {ModalsGridProjectPropertiesModel} from "../modals/grid-project-properties";

@Component({
    selector: "view-projects-project-grid",
    templateUrl: "app/views/projects-project-grid.html",
})
export class ProjectsProjectGridComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    project: IProject = null;

    gridProjects: IMProject[] = null;

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

    refresh(): void {
        this.blockUI();
        this.backendService.getProject(this.id)
            .then((project) => {
                this.project = project;
                return Promise.all<IMProject>(project.m_projects.map((m_project) => {
                    return this.backendService.getMProject(m_project.id);
                }));
            })
            .then((gridProjects) => {
                console.log(gridProjects);
                this.gridProjects = gridProjects;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
                this.unblockUI();
            });

    }

    onProjectClick(project: IMProject): void {
        this.navigate(["/projects", this.currentParamsService.get("project"), "grid", project.id]);
    }

    onProjectAddClick(): void {
        var model = new ModalsGridProjectPropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createMProject(this.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The grid project has been added."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The grid project cannot be added.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onProjectEditClick(project: IMProject): void {
        var model = new ModalsGridProjectPropertiesModel(project.name, project.description, true, project.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                console.log(model);
                this.blockUI();
                this.backendService.editMProject(project.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The grid project has been edited."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The grid project cannot be edited.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onProjectDeleteClick(project: IMProject): void {

        this.modalService.showModal(new ModalsRemovalModel(project.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteMProject(project.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The grid project has been removed."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The grid project cannot be removed.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });

    }

}
