import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from './shared';

import { AuthGuard } from '../services/AuthGuard';
import { ProjectsProjectHardwareComponent } from '../views/projects-project-hardware';
import { ProjectsProjectHardwareHardwareComponent } from '../views/projects-project-hardware-hardware';
import { ProjectsProjectHardwareAddWithQrComponent } from '../views/projects-project-hardware-scan';

// routes
export const PROJECT_HARDWARE_ROUTES: Routes = [

    { path: '', data: { breadName: 'HARDWARE devices' }, component: ProjectsProjectHardwareComponent, canActivate: [AuthGuard] },
    { path: ':hardware', data: { breadName: ':hardware' }, component: ProjectsProjectHardwareHarrdwareComponent, canActivate: [AuthGuard] },
    { path: 'scanHardware', data: {breadName: 'Add hardware with QR code', component: ProjectsProjectHardwareAddWithQrComponent, canActivate: [AuthGuard]}}
];
@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECT_HARDWARE_ROUTES)
    ],
    declarations: [
        ProjectsProjectHardwareComponent,
        ProjectsProjectHardwareAddWithQrComponent,
    ],
    exports: [ RouterModule ]
})

export class ProjectHardwareModule { }

// http://localhost:8080/projects/a3f142a3-91a4-4a6d-b8c1-6771641854ad/actualization_procedures
// http://localhost:8080/projects/a3f142a3-91a4-4a6d-b8c1-6771641854ad/actualization-procedures
