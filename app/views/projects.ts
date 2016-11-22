/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {Component, OnInit, Injector} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {ModalsRemovalModel} from "../modals/removal";
import {ModalsProjectPropertiesModel} from "../modals/project-properties";
import {IProject, IProductsAllApplicable, IProductDetail} from "../backend/TyrionAPI";


@Component({
    selector: "view-dashboard",
    templateUrl: "app/views/projects.html",
})
export class ProjectsComponent extends BaseMainComponent implements OnInit {

    constructor(injector: Injector) {
        super(injector)
    };

    projects: IProject[];

    products: IProductsAllApplicable;

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        this.blockUI();
        Promise.all<any>([this.backendService.getAllProjects(), this.backendService.getAllProductUserApplicables()])
            .then((values:[IProject[], IProductsAllApplicable]) => {
                this.projects = values[0];
                this.products = values[1];
                this.unblockUI();
            })
            .catch((reason) => {
                this.addFlashMessage(new FlashMessageError("Projects cannot be loaded.", reason));
                this.unblockUI();
            });
    }

    onProjectClick(project: IProject): void {
        this.navigate(["/projects", project.id])
    }

    onTestClick(): void {
        this.blockUIService.blockUI();

        setTimeout(() => {
            this.blockUIService.unblockUI();
        }, 5000);
    }

    onAddClick(): void {
        if (!this.products) this.addFlashMessage(new FlashMessageError("Cannot add project now."));

        var model = new ModalsProjectPropertiesModel(this.products.list);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createProject({
                    project_name: model.name,
                    project_description: model.description,
                    product_id: parseInt(model.product)
                }) //TODO:add tarrif nebo produkt či jak se to bude jmenovat
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(`The project ${model.name} has been created.`));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(`The project ${model.name} cannot be created.`, reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onEditClick(project: IProject): void {
        if (!this.products) this.addFlashMessage(new FlashMessageError("Cannot add project now."));

        var model = new ModalsProjectPropertiesModel(this.products.list, project.name, project.description, "" + project.product_id, true, project.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editProject(project.id, {
                    project_name: model.name,
                    project_description: model.description,
                    product_id: parseInt(model.product)
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The project has been updated."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The project cannot be updated.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }

    onRemoveClick(project: IProject): void {
        this.modalService.showModal(new ModalsRemovalModel(project.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteProject(project.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The project has been removed."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The project cannot be removed.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });
    }
}
