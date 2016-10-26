/**
 * Created by davidhradek on 18.10.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {Subscription} from "rxjs/Rx";
import {ModalsRemovalModel} from "../modals/removal";
import {IProject, IMProgram, IMProject, IScreenSizeTypeCombination} from "../backend/TyrionAPI";
import {ModalsGridProjectPropertiesModel} from "../modals/grid-project-properties";
import {ModalsGridProgramPropertiesModel} from "../modals/grid-program-properties";

@Component({
    selector: "view-projects-project-grid",
    templateUrl: "app/views/projects-project-grid.html",
})
export class ProjectsProjectGridComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    project: IProject = null;

    gridProjects: IMProject[] = null;

    screenTypes: IScreenSizeTypeCombination = null;

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
        this.backendService.getProject(this.id)
            .then((project: IProject) => {
                this.project = project;
                return Promise.all<IMProject>(project.m_projects.map((m_project) => {
                    return this.backendService.getMProject(m_project.id);
                }));
            })
            .then((gridProjects: IMProject[]) => {
                console.log(gridProjects);
                this.gridProjects = gridProjects;
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
            });

        this.backendService.getAllScreenTypes()
            .then((st) => {
                this.screenTypes = st;
            });

    }

    onProgramClick(grid: IMProgram): void {
        this.navigate(["/projects", this.currentParamsService.get("project"), "grid", grid.id]);
    }

    getScreenTypeName(screenTypeId: string): string {
        if (this.screenTypes && this.screenTypes.private_types) {
            var screen = this.screenTypes.private_types.find((t)=>t.id == screenTypeId);
            if (screen) {
                return screen.name;
            }
        }
        if (this.screenTypes && this.screenTypes.public_types) {
            var screen = this.screenTypes.public_types.find((t)=>t.id == screenTypeId);
            if (screen) {
                return screen.name;
            }
        }
        return "";
    }

    onProjectAddClick(): void {
        var model = new ModalsGridProjectPropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backendService.createMProject(this.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The grid project has been added."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The grid project cannot be added.", reason));
                        this.refresh();
                    });
            }
        });
    }

    onProjectEditClick(project: IMProject): void {
        var model = new ModalsGridProjectPropertiesModel(project.name, project.description, true, project.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                console.log(model);
                this.backendService.editMProject(project.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The grid project has been edited."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The grid project cannot be edited.", reason));
                        this.refresh();
                    });
            }
        });
    }

    onProjectDeleteClick(project: IMProject): void {

        this.modalService.showModal(new ModalsRemovalModel(project.name)).then((success) => {
            if (success) {
                this.backendService.deleteMProject(project.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The grid project has been removed."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The grid project cannot be removed.", reason));
                        this.refresh();
                    });
            }
        });

    }

    onProgramAddClick(project: IMProject): void {
        if (!this.screenTypes) return;

        var model = new ModalsGridProgramPropertiesModel(this.screenTypes);

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backendService.createMProgram(project.id, {
                    name: model.name,
                    description: model.description,
                    screen_size_type_id: model.screenTypeId
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The grid program has been added."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The grid program cannot be added.", reason));
                        this.refresh();
                    });
            }
        });
    }

    onProgramEditClick(program: IMProgram): void {
        if (!this.screenTypes) return;

        var model = new ModalsGridProgramPropertiesModel(this.screenTypes, program.name, program.description, program.screen_size_type_id, true);

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backendService.editMProgram(program.id, {
                    name: model.name,
                    description: model.description,
                    screen_size_type_id: model.screenTypeId
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The grid program has been edited."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The grid program cannot be edited.", reason));
                        this.refresh();
                    });
            }
        });
    }

    onProgramDeleteClick(program: IMProgram): void {

        this.modalService.showModal(new ModalsRemovalModel(program.name)).then((success) => {
            if (success) {
                this.backendService.deleteMProgram(program.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The grid program has been removed."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The grid program cannot be removed.", reason));
                        this.refresh();
                    });
            }
        });

    }


}
