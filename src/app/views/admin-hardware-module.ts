import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { AdminHardwareComponent } from './admin-hardware-type';
import { ProjectsProjectCodeCodeComponent } from './projects-project-code-code';
// routes
export const ADMIN_HARDWARE_ROUTES: Routes = [

    { path: '', component: AdminHardwareComponent, canActivate: [AuthGuard] },
    { path: 'code/:code', data: { breadName: ':code' }, component: ProjectsProjectCodeCodeComponent, canActivate: [AuthGuard] },
    // { path: 'libraries/:library', data: { breadName: ':library' }, component: ProjectsProjectLibrariesLibraryComponent, canActivate: [AuthGuard] },

];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(ADMIN_HARDWARE_ROUTES)
    ],
    declarations: [
        AdminHardwareComponent,
        // ProjectsProjectLibrariesLibraryComponent
    ],
    exports: [ RouterModule ]
})

export class AdminHardwareModule { }
