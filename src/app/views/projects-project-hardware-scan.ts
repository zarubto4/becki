import { TyrionBackendService } from './../services/BackendService';
import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { _BaseMainComponent } from './_BaseMainComponent';
import { Subscription } from 'rxjs';
import { IProject, IHardware, IHardwareList, IHardwareGroupList, IHardwareGroup } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';
import { FormSelectComponentOption } from '../components/FormSelectComponent';
@Component({
    selector: 'bk-view-projects-project-harware-scan',
    templateUrl: './projects-project-hardware-scan.html'
})
export class ProjectsProjectHardwareAddWithQrComponent extends _BaseMainComponent implements OnInit {

    projectId: string = null;
    project: IProject = null;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    currentParamsService: CurrentParamsService; // exposed for template - filled by _BaseMainComponent

    scanedCodes = new Set<string>();
    waiting = new Set<string>();
    added = new Map<string, IHardware>();
    failed = new Map<string, string>();

    groups: FormSelectComponentOption[] = [];



    constructor(injector: Injector) {
        super(injector)
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.projectId = params['project'];
            this.projectSubscription = this.storageService.project(this.projectId).subscribe((project) => {
                this.project = project;
                this.refresh();
            });
        });
    }

    refresh(): void {
        this.scanedCodes = new Set<string>();
        this.added = new Map<string, IHardware>();
        this.failed = new Map<string, string>();
        this.tyrionBackendService.hardwareGroupGetListByFilter(0, {
            project_id: this.projectId
        }).then((hardwareGroups) => {
            this.groups = hardwareGroups.content.map((group) => {
                let wrappedGroup: FormSelectComponentOption = {
                    value: group.name,
                    label: group.name,
                    data: group
                }
                return wrappedGroup
            })
        }).catch(() => {

        })
    }

    qrCodeSent(code: string) {
        this.add(code);
    }

    add(code: string) {
        code =  code.replace(/ /g, '');
        if (!this.scanedCodes.has(code)) {
            this.scanedCodes.add(code);
            this.waiting.add(code);

            // this.tyrionBackendService.projectAddHW({
            //     registration_hash: code,
            //     project_id: this.projectId
            // }).then((iHardware) => {
            //     this.waiting.delete(code);
            //     this.added.set(code, iHardware);
            // }).catch((reason) => {
            //     this.waiting.delete(code);
            //     this.failed.set(code, reason.message);
            // });
        }
    }

}
