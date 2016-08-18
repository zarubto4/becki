/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Component, OnInit, Injector} from "@angular/core";
import {LayoutMain} from "../layouts/main";
import {Project} from "../lib-back-end/index";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {ModalsRemovalModel} from "../modals/removal";
import {ModalsProjectPropertiesModel} from "../modals/project-properties";


@Component({
    selector: "view-dashboard",
    templateUrl: "app/views/projects.html",
    directives: [LayoutMain],
})
export class ProjectsComponent extends BaseMainComponent implements OnInit {

    constructor(injector:Injector) {super(injector)};

    projects:Project[];

    ngOnInit():void {
        this.refresh();
    }

    refresh():void {
        this.backEndService.getProjects()
            .then(projects => this.projects = projects)
            .catch(reason => this.addFlashMessage(new FlashMessageError("Projects cannot be loaded.", reason)));
    }

    onProjectClick(project:Project):void {
        this.navigate(["/projects", project.id])
    }

    onAddClick():void {
        console.log("ADDDD!!!!");
        var model = new ModalsProjectPropertiesModel([]);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backEndService.createProject(model.name, model.description, model.product) //TODO:add tarrif nebo produkt či jak se to bude jmenovat
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(`The project ${model.name} has been created.`));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(`The project ${model.name} cannot be created.`, reason));
                        this.refresh();
                    });
            }
            this.refresh();
        });
    }

    onEditClick(project:Project):void {
        var model = new ModalsProjectPropertiesModel([],project.project_name, project.project_description, project.product_id, true, project.project_name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backEndService.updateProject(project.id, model.name, model.description,model.product)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The project has been updated."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The project cannot be updated.", reason));
                        this.refresh();
                    });
            }
        });
    }

    onRemoveClick(project:Project):void {
        this.modalService.showModal(new ModalsRemovalModel(project.project_name)).then((success) => {
            if (success) {
                this.backEndService.deleteProject(project.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The project has been removed."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The project cannot be removed.", reason));
                        this.refresh();
                    });
            }
        });
    }
}
