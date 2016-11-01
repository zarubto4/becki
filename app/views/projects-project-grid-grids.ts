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
    selector: "view-projects-project-grid-grids",
    templateUrl: "app/views/projects-project-grid-grids.html",
})
export class ProjectsProjectGridGridsComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;
    gridsId: string;

    routeParamsSubscription: Subscription;

    //project: IProject = null;

    gridProject: IMProject = null;

    screenTypes: IScreenSizeTypeCombination = null;

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
                return this.backendService.getAllScreenTypes();
            })
            .then((st) => {
                this.screenTypes = st;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
            });

    }

    onProgramClick(grid: IMProgram): void {
        this.navigate(["/projects", this.currentParamsService.get("project"), "grid", this.gridsId, grid.id]);
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

    onProgramAddClick(project: IMProject): void {
        if (!this.screenTypes) return;

        var model = new ModalsGridProgramPropertiesModel(this.screenTypes);

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createMProgram(project.id, {
                    name: model.name,
                    description: model.description,
                    screen_size_type_id: model.screenTypeId
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
        if (!this.screenTypes) return;

        var model = new ModalsGridProgramPropertiesModel(this.screenTypes, program.name, program.description, program.screen_size_type_id, true);

        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editMProgram(program.id, {
                    name: model.name,
                    description: model.description,
                    screen_size_type_id: model.screenTypeId
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
