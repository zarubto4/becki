/**
 * Created by davidhradek on 18.10.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {Subscription} from "rxjs/Rx";
import {ModalsRemovalModel} from "../modals/removal";
import {IProject, IMProgram, IMProject} from "../backend/TyrionAPI";
import {ModalsGridProgramPropertiesModel} from "../modals/grid-program-properties";

@Component({
    selector: "view-projects-project-grid-grids",
    templateUrl: "app/views/projects-project-grid-grids.html",
})
export class ProjectsProjectGridGridsComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;
    gridsId: string;

    routeParamsSubscription: Subscription;

    //project: IProject = null;

    gridProject: IMProject = null;

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params["project"];
            this.gridsId = params["grids"];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh(): void {
        this.blockUI();
        this.backendService.getMProject(this.gridsId)
            .then((gridProject) => {
                console.log(gridProject);
                this.gridProject = gridProject;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
                this.unblockUI();
            });

    }

    onProgramClick(grid: IMProgram): void {
        this.navigate(["/projects", this.currentParamsService.get("project"), "grid", this.gridsId, grid.id]);
    }

    onProgramAddClick(project: IMProject): void {
        var model = new ModalsGridProgramPropertiesModel();

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createMProgram(project.id, {
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The grid program has been added."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The grid program cannot be added.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onProgramEditClick(program: IMProgram): void {
        var model = new ModalsGridProgramPropertiesModel(program.name, program.description, true);

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editMProgram(program.id, {
                    name: model.name,
                    description: model.description,
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The grid program has been edited."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The grid program cannot be edited.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onProgramDeleteClick(program: IMProgram): void {

        this.modalService.showModal(new ModalsRemovalModel(program.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteMProgram(program.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The grid program has been removed."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The grid program cannot be removed.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });

    }


}
