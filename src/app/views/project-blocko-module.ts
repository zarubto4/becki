import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { ExitConfirmGuard } from '../services/ExitConfirmGuard';

import { ProjectsProjectBlockoComponent } from './projects-project-blocko';
import { ProjectsProjectBlockoBlockoComponent } from './projects-project-blocko-blocko';

// routes
export const PROJECT_BLOCKO_ROUTES: Routes = [

    { path: '', data: { breadName: 'BLOCKO programs' }, component: ProjectsProjectBlockoComponent, canActivate: [AuthGuard] },
    { path: ':blocko', data: { breadName: ':blocko' }, component: ProjectsProjectBlockoBlockoComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard]  },
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECT_BLOCKO_ROUTES)
    ],
    declarations: [
        ProjectsProjectBlockoComponent,
        ProjectsProjectBlockoBlockoComponent
    ],
    exports: [ RouterModule ]
})

export class ProjectBlockoModule { }
