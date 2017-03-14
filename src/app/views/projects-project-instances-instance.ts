import { IBProgram, IInstanceShortDetail } from './../backend/TyrionAPI';
/**
 * Created by davidhradek on 01.12.16.
 */

/*
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */
import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { Subscription } from 'rxjs/Rx';
import { IHomerInstance } from '../backend/TyrionAPI';
import { NullSafe, NullSafeDefault } from '../helpers/NullSafe';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-projects-project-instances-instance',
    templateUrl: './projects-project-instances-instance.html',
})
export class ProjectsProjectInstancesInstanceComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;
    instanceId: string;

    routeParamsSubscription: Subscription;

    instance: IHomerInstance = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['project'];
            this.instanceId = params['instance'];
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
    }

    refresh(): void {
        this.blockUI();
        this.backendService.getInstance(this.instanceId)
            .then((instance) => {
                this.instance = instance;
                this.unblockUI();
            })
            .catch(reason => {
                this.fmError(`Instances ${this.id} cannot be loaded.`, reason);
                this.unblockUI();
            });
    }

    onBlockoProgramClick(bProgramId: string) {
        this.navigate(['/projects', this.currentParamsService.get('project'), 'blocko', bProgramId]);
    }

    connectionsHwCount() {
        let yodaCount = NullSafeDefault(() => this.instance.actual_instance.hardware_group, []).length;
        let padawansCount = 0;
        NullSafeDefault(() => this.instance.actual_instance.hardware_group, []).forEach((sh) => {
            padawansCount += sh.device_board_pairs.length;
        });
        return yodaCount + ' + ' + padawansCount;
    }

    connectionsGridCount() {
        return NullSafeDefault(() => this.instance.actual_instance.m_project_snapshot, []).length;
    }

    onBlockoProgramVersionClick(instance: IHomerInstance) {
        console.log(instance);
        this.router.navigate(['/projects', this.id, 'blocko', instance.b_program_id , {version: instance.actual_instance.b_program_version_id}]);

    }

}
