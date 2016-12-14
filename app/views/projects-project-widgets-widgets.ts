/**
 * Created by davidhradek on 01.11.16.
 */

/**
 * Created by davidhradek on 21.09.16.
 */


import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/NotificationService";
import {Subscription} from "rxjs/Rx";
import {ModalsRemovalModel} from "../modals/removal";
import { IProject, ITypeOfWidget, IGridWidget } from '../backend/TyrionAPI';
import {ModalsWidgetsWidgetPropertiesModel} from "../modals/widgets-widget-properties";

@Component({
    selector: "view-projects-project-widgets-widgets",
    templateUrl: "app/views/projects-project-widgets-widgets.html",
})
export class ProjectsProjectWidgetsWidgetsComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;
    widgetsId: string;

    routeParamsSubscription: Subscription;

    //project: IProject = null;

    group: ITypeOfWidget = null;

    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params["project"];
            this.widgetsId = params["widgets"];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    onWidgetClick(widget: IGridWidget): void {
        this.navigate(["/projects", this.currentParamsService.get("project"), "widgets", this.widgetsId, widget.id]);
    }

    onWidgetAddClick(group: ITypeOfWidget): void {

        var model = new ModalsWidgetsWidgetPropertiesModel();
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
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The widget cannot be added.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });

    }

    onWidgetEditClick(widget: IGridWidget): void {

        var model = new ModalsWidgetsWidgetPropertiesModel(widget.name, widget.description, true, widget.name);
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.editWidget(widget.id, {
                    name: model.name,
                    description: model.description,
                    type_of_widget_id: widget.type_of_widget_id // tohle je trochu divný ne? ... možná kdyby jsi chtěl přesunout widget mezi groupama? [DU]
                })
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The widget has been edited."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The widget cannot be edited.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });

    }

    onWidgetDeleteClick(widget: IGridWidget): void {

        this.modalService.showModal(new ModalsRemovalModel(widget.name)).then((success) => {
            if (success) {
                this.blockUI();
                this.backendService.deleteWidget(widget.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The widget has been removed."));
                        this.refresh(); // also unblockUI
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The widget cannot be removed.", reason));
                        this.refresh(); // also unblockUI
                    });
            }
        });

    }


    refresh(): void {
        this.blockUI();
        this.backendService.getTypeOfWidget(this.widgetsId)
            .then((typeOfWidget) => {
                this.group = typeOfWidget;
                console.log(this.group);
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
                this.unblockUI();
            });

    }

}
