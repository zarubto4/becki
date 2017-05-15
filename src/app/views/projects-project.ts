/**
 * Created by davidhradek on 09.08.16.
 */

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { BaseMainComponent } from './BaseMainComponent';
import { FlashMessageError } from '../services/NotificationService';
import { Subscription } from 'rxjs/Rx';
import { IProject } from '../backend/TyrionAPI';
import { CurrentParamsService } from '../services/CurrentParamsService';

@Component({
    selector: 'bk-view-projects-project',
    templateUrl: './projects-project.html',
})
export class ProjectsProjectComponent extends BaseMainComponent implements OnInit, OnDestroy {

    id: string;

    routeParamsSubscription: Subscription;
    projectSubscription: Subscription;

    project: IProject = null;

    currentParamsService: CurrentParamsService; // exposed for template - filled by BaseMainComponent

    constructor(injector: Injector) {
        super(injector);
    };

    ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe(params => {
            this.id = params['project'];
            this.projectSubscription = this.storageService.project(this.id).subscribe((project) => {
                this.project = project;
            });
            this.refresh();
        });
    }

    ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        if (this.projectSubscription) {
            this.projectSubscription.unsubscribe();
        }
    }

    count(status: 'grid_widgets'|'grid_programs'|'blocko_blocks'|'devices_online'|'devices_offline'|'instances_online'|'instances_offline'): number {
        if (!this.project) {
            return 0;
        }
        let count = 0;
        if (status === 'devices_online' && this.project.boards) {
            this.project.boards.forEach((b) => {
                if (b.board_online_status) {
                    count++;
                }
            });
        }
        if (status === 'devices_offline' && this.project.boards) {
            this.project.boards.forEach((b) => {
                if (!b.board_online_status) {
                    count++;
                }
            });
        }
        if (status === 'instances_online' && this.project.boards) {
            this.project.instancies.forEach((i) => {
                if (i.instance_is_online) {
                    count++;
                }
            });
        }
        if (status === 'instances_offline' && this.project.boards) {
            this.project.instancies.forEach((i) => {
                if (!i.instance_is_online) {
                    count++;
                }
            });
        }
        if (status === 'grid_widgets' && this.project.type_of_widgets) {
            this.project.type_of_widgets.forEach((tw) => {
                count += tw.grid_widgets.length;
            });
        }
        if (status === 'grid_programs' && this.project.m_projects) {
            this.project.m_projects.forEach((mp) => {
                count += mp.programs.length;
            });
        }
        if (status === 'blocko_blocks' && this.project.type_of_blocks) {
            this.project.type_of_blocks.forEach((tb) => {
                count += tb.blocko_blocks.length;
            });
        }
        return count;
    }


    refresh(): void {
        this.storageService.projectRefresh(this.id);
        /*
        this.blockUI();
        this.backendService.getProject(this.id)
            .then(project => {
                this.project = project;
                this.unblockUI();
            })
            .catch(reason => {
                this.addFlashMessage(new FlashMessageError(`The project ${this.id} cannot be loaded.`, reason));
                this.unblockUI();
            });
        */
    }
}
