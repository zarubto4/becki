import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { ProjectsProjectHardwareHardwareComponent } from './projects-project-hardware-hardware';

// routes
export const HARDWARE_DEVICE_ROUTES: Routes = [

    { path: '', component: ProjectsProjectHardwareHardwareComponent, canActivate: [AuthGuard] }
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(HARDWARE_DEVICE_ROUTES)
    ],
    exports: [ RouterModule ]
})

export class HardwareDeviceModule { }
