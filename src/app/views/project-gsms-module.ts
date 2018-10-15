import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { ProjectsProjectGSMSComponent } from './projects-project-gsms';
import { ProjectsProjectGSMSGSMComponent } from './projects-project-gsms-gsm';



// routes
export const PROJECT_GSMS_ROUTES: Routes = [

    { path: '', data: { breadName: 'CELLULAR modules' }, component: ProjectsProjectGSMSComponent, canActivate: [AuthGuard]},
    { path: ':gsm',  data: { breadName: ':last' }, component: ProjectsProjectGSMSGSMComponent, canActivate: [AuthGuard]},

];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECT_GSMS_ROUTES)
    ],
    declarations: [
        ProjectsProjectGSMSComponent,
        ProjectsProjectGSMSGSMComponent
    ],
    exports: [ RouterModule ]
})

export class ProjectGSMSModule { }
