import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from './shared';

import { AuthGuard } from '../services/AuthGuard';

import { ProjectsProjectServersComponent } from '../views/projects-project-servers';

// routes
export const PROJECT_CLOUD_ROUTES: Routes = [

    { path: '', data: { breadName: 'CLOUD instances' }, component: ProjectsProjectServersComponent, canActivate: [AuthGuard] },
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECT_CLOUD_ROUTES)
    ],
    declarations: [
        ProjectsProjectServersComponent
    ],
    exports: [ RouterModule ]
})

export class ProjectCloudModule { }
