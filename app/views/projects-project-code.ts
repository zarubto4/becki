/**
 * Created by davidhradek on 15.08.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {LayoutMain} from "../layouts/main";
import {Project, DeviceProgram} from "../lib-back-end/index";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {ModalsRemovalModel} from "../modals/removal";

@Component({
    selector: "view-projects-project-code",
    templateUrl: "app/views/projects-project-code.html",
    directives: [ROUTER_DIRECTIVES, LayoutMain],
})
export class ProjectsProjectCodeComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription:Subscription;

    project:Project = null;

    codePrograms:DeviceProgram[] = null;

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

    refresh():void {
        this.backEndService.getProject(this.id)
            .then((project:Project) => {
                this.project = project;
                return Promise.all<DeviceProgram>(project.c_programs_id.map((c_program_id) => {
                    return this.backEndService.getDeviceProgram(c_program_id);
                }));
            })
            .then((codePrograms:DeviceProgram[]) => {
                this.codePrograms = codePrograms;
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
            });

    }

    onCodeClick(code:DeviceProgram):void {
        //TODO
        alert("TODO!!! Code object: "+JSON.stringify(code));
    }

    onRemoveClick(code:DeviceProgram):void {
        this.modalService.showModal(new ModalsRemovalModel(code.program_name)).then((success) => {
            if (success) {
                this.backEndService.deleteDeviceProgram(code.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The code has been removed."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The code cannot be removed.", reason));
                        this.refresh();
                    });
            }
        });
    }

    onAddClick():void {
        /*var model = new ModalsBlockoPropertiesModel(this.id);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backEndService.createInteractionsScheme(model.name, model.description, this.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(`The blocko ${model.name} has been added to project.`));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(`The blocko ${model.name} cannot be added to project.`, reason));
                        this.refresh();
                    });
            }
        });*/
    }

    onEditClick(code:DeviceProgram):void {
        /*var model = new ModalsBlockoPropertiesModel(this.id, blocko.name, blocko.program_description, true, blocko.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backEndService.updateInteractionsScheme(blocko.id, model.name, model.description)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The blocko has been updated."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The blocko cannot be updated.", reason));
                        this.refresh();
                    });
            }
        });*/
    }

}
