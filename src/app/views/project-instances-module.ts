import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';

import { ProjectsProjectInstancesComponent } from './projects-project-instances';
import { ProjectsProjectInstancesInstanceComponent } from './projects-project-instances-instance';

// routes
export const PROJECT_INSTANCES_ROUTES: Routes = [

    { path: '', data: { breadName: 'CLOUD instances' }, component: ProjectsProjectInstancesComponent, canActivate: [AuthGuard] },
    { path: ':instance', data: { breadName: ':instance' }, component: ProjectsProjectInstancesInstanceComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECT_INSTANCES_ROUTES)
    ],
    declarations: [
        ProjectsProjectInstancesComponent,
        ProjectsProjectInstancesInstanceComponent
    ],
    exports: [ RouterModule ]
})

export class ProjectInstancesModule { }
