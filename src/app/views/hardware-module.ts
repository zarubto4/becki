import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { ProjectsProjectCodeCodeComponent } from './projects-project-code-code';
import { HardwareComponent } from './hardware';
import { HardwareHardwareTypeComponent } from './hardware-hardware_type';

// routes
export const PROJECT_HARDWARE_ROUTES: Routes = [

    { path: '', component: HardwareComponent, canActivate: [AuthGuard] },

    { path: ':hardware_type', data: { breadName: ':last' }, component: HardwareHardwareTypeComponent, canActivate: [AuthGuard] },

    { path: ':hardware_type/:code', data: { breadName: ':code' }, component: ProjectsProjectCodeCodeComponent, canActivate: [AuthGuard] }

];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECT_HARDWARE_ROUTES)
    ],
    declarations: [
        HardwareComponent,
        HardwareHardwareTypeComponent
    ],
    exports: [ RouterModule ]
})

export class HardwareModule { }
