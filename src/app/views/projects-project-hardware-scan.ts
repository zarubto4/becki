import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs';
import {IProject, IHardware, IHardwareList, IHardwareGroupList, IHardwareGroup } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-projects-project-harware-scan',
    templateUrl: './projects-project-hardware-scan.html'
})
export class ProjectsProjectHardwareAddWithQrComponent extends _BaseMainComponent implements OnInit {

    projectId: string = null;
    project: IProject = null;

    // routeParamsSubscription: Subscription;
    // projectSubscription: Subscription;

   // currentParamsService: CurrentParamsService; // exposed for template - filled by _BaseMainComponent

    codes: String[] = [];
    constructor(injector:Injector) {
        super(injector)
    };
    ngOnInit(): void {
        // this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
        //     this.projectId = params['project'];
        //     this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
        //         this.project = project;
        //         this.refresh();
        //     });
        // });
    }

    refresh(): void {

    }

    add(code: String) {
        this.codes.push(code);
    }

}
