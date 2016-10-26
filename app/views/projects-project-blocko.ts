/**
 * Created by davidhradek on 15.08.16.
 */
/**
 * Created by davidhradek on 10.08.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {Subscription} from "rxjs/Rx";
import {ModalsRemovalModel} from "../modals/removal";
import {ModalsBlockoPropertiesModel} from "../modals/blocko-properties";
import {IBProgram, IProject} from "../backend/TyrionAPI";

@Component({
    selector: "view-projects-project-blocko",
    templateUrl: "app/views/projects-project-blocko.html",
})
export class ProjectsProjectBlockoComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    project: IProject = null;

    blockoPrograms: IBProgram[] = null;

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
                return Promise.all<IBProgram>(project.b_programs.map((b_program) => {
                    return this.backendService.getBProgram(b_program.id);
                }));
            })
            .then((blockoPrograms: IBProgram[]) => {
                console.log(blockoPrograms);
                this.blockoPrograms = blockoPrograms;
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
            });

    }

    onBlockoClick(blocko: IBProgram): void {
        this.navigate(["/projects", this.currentParamsService.get("project"), "blocko", blocko.id]);
    }

    onRemoveClick(blocko: IBProgram): void {
        this.modalService.showModal(new ModalsRemovalModel(blocko.name)).then((success) => {
            if (success) {
                this.backendService.deleteBProgram(blocko.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The blocko has been removed."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The blocko cannot be removed.", reason));
                        this.refresh();
                    });
            }
        });
    }

    onAddClick(): void {
        var model = new ModalsBlockoPropertiesModel(this.id);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backendService.createBProgram(this.id, {name: model.name, description: model.description})
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(`The blocko ${model.name} has been added to project.`));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(`The blocko ${model.name} cannot be added to project.`, reason));
                        this.refresh();
                    });
            }
        });
    }

    onEditClick(blocko: IBProgram): void {
        var model = new ModalsBlockoPropertiesModel(this.id, blocko.name, blocko.description, true, blocko.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backendService.editBProgram(blocko.id, {name: model.name, description: model.description})
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The blocko has been updated."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The blocko cannot be updated.", reason));
                        this.refresh();
                    });
            }
        });
    }

}
