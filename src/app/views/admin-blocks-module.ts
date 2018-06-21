
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { ProjectsProjectBlocksComponent } from './projects-project-blocks';
import { ProjectsProjectBlocksBlockComponent } from './projects-project-blocks-block';


// routes
export const ADMIN_BLOCKS_ROUTES: Routes = [

    { path: '', component: ProjectsProjectBlocksComponent, canActivate: [AuthGuard]},
    { path: ':block', data: {breadName: ':block'}, component: ProjectsProjectBlocksBlockComponent, canActivate: [AuthGuard]},
];



@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(ADMIN_BLOCKS_ROUTES)
    ],
    exports: [ RouterModule ]
})

export class AdminBlocksModule { }
