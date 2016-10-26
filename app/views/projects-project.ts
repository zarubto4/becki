/**
 * Created by davidhradek on 09.08.16.
 */

import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {FlashMessageError} from "../services/FlashMessagesService";
import {Subscription} from "rxjs/Rx";
import {IProject} from "../backend/TyrionAPI";

@Component({
    selector: "view-projects-project",
    templateUrl: "app/views/projects-project.html",
})
export class ProjectsProjectComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    project: IProject = null;

    constructor(injector: Injector) {
        super(injector);
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
            .then(project => {
                this.project = project;
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
            });
    }
}
