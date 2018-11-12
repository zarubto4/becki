import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { ProjectsProjectHardwareComponent } from './projects-project-hardware';
import { ProjectsProjectHardwareHardwareComponent } from './projects-project-hardware-hardware';

// routes
export const PROJECT_HARDWARE_ROUTES: Routes = [

    { path: '', data: { breadName: 'HARDWARE devices' }, component: ProjectsProjectHardwareComponent, canActivate: [AuthGuard] },
    { path: ':hardware', data: { breadName: ':hardware' }, component: ProjectsProjectHardwareHardwareComponent, canActivate: [AuthGuard] },

];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECT_HARDWARE_ROUTES)
    ],
    declarations: [
        ProjectsProjectHardwareComponent,
        ProjectsProjectHardwareHardwareComponent
    ],
    exports: [ RouterModule ]
})

export class ProjectHardwareModule { }
