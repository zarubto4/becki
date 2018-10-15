import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { ExitConfirmGuard } from '../services/ExitConfirmGuard';
import { ProjectsProjectCodeComponent } from './projects-project-code';
import { ProjectsProjectCodeCodeComponent } from './projects-project-code-code';

// routes
export const PROJECT_CODE_ROUTES: Routes = [

    { path: '', data: { breadName: 'CODE programs' }, component: ProjectsProjectCodeComponent, canActivate: [AuthGuard] },
    { path: ':code', data: { breadName: ':code' }, component: ProjectsProjectCodeCodeComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECT_CODE_ROUTES)
    ],
    declarations: [
        ProjectsProjectCodeComponent
    ],
    exports: [ RouterModule ]
})

export class ProjectCodeModule { }
