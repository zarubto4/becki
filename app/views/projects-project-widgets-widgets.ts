/**
 * Created by davidhradek on 01.11.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/NotificationService";
import {Subscription} from "rxjs/Rx";
import {ModalsRemovalModel} from "../modals/removal";
import {IProject, ITypeOfWidget, IGridWidget, ITypeOfWidgetShortDetail, IGridWidgetShortDetail} from '../backend/TyrionAPI';
import {ModalsWidgetsWidgetPropertiesModel} from "../modals/widgets-widget-properties";

@Component({
    selector: "view-projects-project-widgets-widgets",
    templateUrl: "app/views/projects-project-widgets-widgets.html",
})
export class ProjectsProjectWidgetsWidgetsComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;
    widgetsId: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    //project: IProject = null;

    group: ITypeOfWidgetShortDetail = null;

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params["project"];
            this.widgetsId = params["widgets"];
            this.projectSubscription = this.storageService.project(this.id).subscribe((project) => {
                this.group = project.type_of_widgets.find((tw) => tw.id == this.widgetsId);
            });
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) this.projectSubscription.unsubscribe();
    }

    onWidgetClick(widget: IGridWidgetShortDetail): void {
        this.navigate(["/projects", this.currentParamsService.get("project"), "widgets", this.widgetsId, widget.id]);
    }

    onWidgetAddClick(group: ITypeOfWidgetShortDetail): void {

        let model = new ModalsWidgetsWidgetPropertiesModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.createWidget({
                    type_of_widget_id: group.id,
                    name: model.name,
                    description: model.description
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The widget has been added."));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The widget cannot be added.", reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });

    }

    onWidgetEditClick(widget: IGridWidgetShortDetail): void {

        let model = new ModalsWidgetsWidgetPropertiesModel(widget.name, widget.description, true, widget.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editWidget(widget.id, {
                    name: model.name,
                    description: model.description,
                    type_of_widget_id: this.widgetsId // tohle je trochu divný ne? ... možná kdyby jsi chtěl přesunout widget mezi groupama? [DU]
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The widget has been edited."));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The widget cannot be edited.", reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });

    }

    onWidgetDeleteClick(widget: IGridWidgetShortDetail): void {

        this.modalService.showModal(new ModalsRemovalModel(widget.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteWidget(widget.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The widget has been removed."));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The widget cannot be removed.", reason));
                        this.storageService.projectRefresh(this.id).then(() => this.unblockUI());
                    });
            }
        });

    }

}
