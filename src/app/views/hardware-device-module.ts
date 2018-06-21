import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { ProjectsProjectHardwareHardwareComponent } from './projects-project-hardware-hardware';

// routes
export const PROJECT_HARDWARE_DEVICE_ROUTES: Routes = [

    { path: '', component: ProjectsProjectHardwareHardwareComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECT_HARDWARE_DEVICE_ROUTES)
    ],
    declarations: [
        ProjectsProjectHardwareHardwareComponent
    ],
    exports: [ RouterModule ]
})

export class HardwareDeviceModule { }
