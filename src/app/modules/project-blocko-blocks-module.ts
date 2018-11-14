import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from './shared';

import { AuthGuard } from '../services/AuthGuard';
import { ExitConfirmGuard } from '../services/ExitConfirmGuard';

import { ProjectsProjectBlocksComponent } from '../views/projects-project-blocks';
import { ProjectsProjectBlocksBlockComponent } from '../views/projects-project-blocks-block';


// routes
export const PROJECT_BLOCKO_BLOCKS_ROUTES: Routes = [

    { path: '', data: { breadName: 'BLOCKO blocks' }, component: ProjectsProjectBlocksComponent, canActivate: [AuthGuard] },
    { path: ':block', data: { breadName: ':block' }, component: ProjectsProjectBlocksBlockComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(PROJECT_BLOCKO_BLOCKS_ROUTES)
    ],
    exports: [ RouterModule ]
})

export class ProjectBlockoBlocksModule { }
