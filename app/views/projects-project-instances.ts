/**
 * Created by davidhradek on 01.12.16.
 */
/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import {Component, OnInit, Injector, OnDestroy} from "@angular/core";
import {BaseMainComponent} from "./BaseMainComponent";
import {Subscription} from "rxjs/Rx";
import {IHomerInstance} from "../backend/TyrionAPI";

@Component({
    selector: "view-projects-project-instances",
    templateUrl: "app/views/projects-project-instances.html",
})
export class ProjectsProjectInstancesComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;

    instances: IHomerInstance[] = null;

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
        this.blockUI();
        this.backendService.getAllInstancesForProject(this.id)
            .then((instances) => {
                console.log(instances);
                this.instances = instances;
                this.unblockUI();
            })
            .catch(reason => {
                this.fmError(`Instances ${this.id} cannot be loaded.`, reason);
                this.unblockUI();
            });
    }

    onInstanceClick(instance:IHomerInstance) {
        this.navigate(["/projects", this.currentParamsService.get("project"), "instances", instance.blocko_instance_name]);
    }

    onBlockoProgramClick(bProgramId:string) {
        this.navigate(["/projects", this.currentParamsService.get("project"), "blocko", bProgramId]);
    }

}
