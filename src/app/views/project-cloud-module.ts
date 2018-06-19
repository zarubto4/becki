import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';

import { ProjectsProjectServersComponent } from './projects-project-servers';
import { ProjectsProjectInstancesComponent } from './projects-project-instances';
import { ProjectsProjectInstancesInstanceComponent } from './projects-project-instances-instance';

// routes
export const PROJECT_CODE_ROUTES: Routes = [

    { path: 'servers', data: { breadName: 'CLOUD servers' }, component: ProjectsProjectServersComponent, canActivate: [AuthGuard] },
    { path: 'instances', data: { breadName: 'CLOUD instances' }, component: ProjectsProjectInstancesComponent, canActivate: [AuthGuard] },
    { path: 'instances/:instance', data: { breadName: ':instance' }, component: ProjectsProjectInstancesInstanceComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECT_CODE_ROUTES)
    ],
    declarations: [
        ProjectsProjectServersComponent,
        ProjectsProjectInstancesComponent,
        ProjectsProjectInstancesInstanceComponent
    ],
    exports: [ RouterModule ]
})

export class ProjectCloudModule { }
