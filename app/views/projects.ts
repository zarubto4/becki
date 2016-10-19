/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Component, OnInit, Injector} from "@angular/core";
import {LayoutMain} from "../layouts/main";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {ModalsRemovalModel} from "../modals/removal";
import {ModalsProjectPropertiesModel} from "../modals/project-properties";
import {IApplicableProduct, IProject} from "../backend/TyrionAPI";


@Component({
    selector: "view-dashboard",
    templateUrl: "app/views/projects.html",
    directives: [LayoutMain],
})
export class ProjectsComponent extends BaseMainComponent implements OnInit {

    constructor(injector:Injector) {super(injector)};

    projects:IProject[];

    products:IApplicableProduct[];

    ngOnInit():void {
        this.refresh();
    }

    refresh():void {
        this.backendService.getAllProjects()
            .then(projects => this.projects = projects)
            .catch(reason => this.addFlashMessage(new FlashMessageError("Projects cannot be loaded.", reason)));
        this.backendService.getAllTarifsUserApplicables()
            .then(products => this.products = products)
            .catch(reason => this.addFlashMessage(new FlashMessageError("Products cannot be loaded.", reason)));
    }

    onProjectClick(project:IProject):void {
        this.navigate(["/projects", project.id])
    }

    onAddClick():void {
        if (!this.products) this.addFlashMessage(new FlashMessageError("Cannot add project now."));

        var model = new ModalsProjectPropertiesModel(this.products);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backendService.createProject({project_name: model.name, project_description: model.description, product_id: parseInt(model.product)}) //TODO:add tarrif nebo produkt či jak se to bude jmenovat
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

    onEditClick(project:IProject):void {
        if (!this.products) this.addFlashMessage(new FlashMessageError("Cannot add project now."));

        var model = new ModalsProjectPropertiesModel(this.products, project.name, project.description, ""+project.product_id, true, project.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backendService.editProject(project.id, {project_name: model.name, project_description: model.description, product_id: parseInt(model.product)})
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

    onRemoveClick(project:IProject):void {
        this.modalService.showModal(new ModalsRemovalModel(project.name)).then((success) => {
            if (success) {
                this.backendService.deleteProject(project.id)
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
