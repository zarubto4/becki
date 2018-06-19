import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { ExitConfirmGuard } from '../services/ExitConfirmGuard';

import { ProjectsProjectBlockoComponent } from './projects-project-blocko';
import { ProjectsProjectBlockoBlockoComponent } from './projects-project-blocko-blocko';
import { ProjectsProjectBlocksComponent } from './projects-project-blocks';
import { ProjectsProjectBlocksBlockComponent } from './projects-project-blocks-block';


// routes
export const PROJECT_BLOCKO_ROUTES: Routes = [

    { path: 'blocko', data: { breadName: 'BLOCKO programs' }, component: ProjectsProjectBlockoComponent, canActivate: [AuthGuard] },
    { path: 'blocko/:blocko', data: { breadName: ':blocko' }, component: ProjectsProjectBlockoBlockoComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard]  },
    { path: 'blocks', data: { breadName: 'BLOCKO blocks' }, component: ProjectsProjectBlocksComponent, canActivate: [AuthGuard] },
    { path: 'blocks/:block', data: { breadName: ':block' }, component: ProjectsProjectBlocksBlockComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECT_BLOCKO_ROUTES)
    ],
    declarations: [
        ProjectsProjectBlockoComponent,
        ProjectsProjectBlockoBlockoComponent,
        ProjectsProjectBlocksComponent,
        ProjectsProjectBlocksBlockComponent
    ],
    exports: [ RouterModule ]
})

export class ProjectBlockoModule { }
