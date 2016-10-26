/**
 * Created by davidhradek on 10.08.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError, FlashMessageSuccess} from "../services/FlashMessagesService";
import {Subscription} from "rxjs/Rx";
import {ModalsAddHardwareModel} from "../modals/add-hardware";
import {ModalsRemovalModel} from "../modals/removal";
import {IProject, IBoard} from "../backend/TyrionAPI";

@Component({
    selector: "view-projects-project-hardware",
    templateUrl: "app/views/projects-project-hardware.html",
})
export class ProjectsProjectHardwareComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    project: IProject = null;
    devices: IBoard[] = null;

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
                return Promise.all<IBoard>(project.boards_id.map((board_id) => {
                    return this.backendService.getBoard(board_id);
                }));
            })
            .then((devices: IBoard[]) => {
                console.log(devices);
                this.devices = devices;
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
            });
    }

    onDeviceClick(device: IBoard): void {
        //TODO
        alert("TODO!!! Board object: " + JSON.stringify(device));
    }

    onRemoveClick(device: IBoard): void {
        this.modalService.showModal(new ModalsRemovalModel(device.id)).then((success) => {
            if (success) {
                this.backendService.disconnectBoard(device.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess("The hardware has been removed."));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError("The hardware cannot be removed.", reason));
                        this.refresh();
                    });
            }
        });
    }

    onAddClick(): void {
        var model = new ModalsAddHardwareModel();
        this.modalService.showModal(model).then((success) => {
            if (success) {
                this.backendService.connectBoard(model.id, this.id)
                    .then(() => {
                        this.addFlashMessage(new FlashMessageSuccess(`The hardware ${model.id} has been added to project.`));
                        this.refresh();
                    })
                    .catch(reason => {
                        this.addFlashMessage(new FlashMessageError(`The hardware ${model.id} cannot be added to project.`, reason));
                        this.refresh();
                    });
            }
        });
    }

}
