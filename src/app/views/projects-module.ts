import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';
import {ProjectsComponent} from "./projects";
import {ProjectsProjectComponent} from "./projects-project";
import {ProjectsProjectLibrariesComponent} from "./projects-project-libraries";
import {ProjectsProjectCodeComponent} from "./projects-project-code";
import {ProjectsProjectCodeCodeComponent} from "./projects-project-code-code";
import {ProjectsProjectBlockoComponent} from "./projects-project-blocko";
import {ProjectsProjectBlockoBlockoComponent} from "./projects-project-blocko-blocko";
import {ProjectsProjectBlocksComponent} from "./projects-project-blocks";
import {ProjectsProjectBlocksBlockComponent} from "./projects-project-blocks-block";
import {AuthGuard} from "../services/AuthGuard";
import {ExitConfirmGuard} from "../services/ExitConfirmGuard";




// routes
export const PROJECT_ROUTES: Routes = [

    { path: '', data: { breadName: 'Projects' }, component: ProjectsComponent, canActivate: [AuthGuard] },
    { path: ':project', data: { breadName: ':project' }, component: ProjectsProjectComponent, canActivate: [AuthGuard] },
    { path: ':project/libraries', data: { breadName: 'CODE libraries' }, component: ProjectsProjectLibrariesComponent, canActivate: [AuthGuard] },


];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECT_ROUTES)
    ],
    declarations: [
        ProjectsComponent,
        ProjectsProjectComponent,
        ProjectsProjectLibrariesComponent
    ],
    exports: [ RouterModule ]
})

export class ProjectModule { }

// routes
export const PROJECT_CODE_ROUTES: Routes = [

    { path: '', data: { breadName: 'CODE programs' }, component: ProjectsProjectCodeComponent, canActivate: [AuthGuard] },
    { path: ':code', data: { breadName: ':code' }, component: ProjectsProjectCodeCodeComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] }
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECT_CODE_ROUTES)
    ],
    declarations: [
        ProjectsProjectCodeComponent,
        ProjectsProjectCodeCodeComponent,
    ],
    exports: [ RouterModule ]
})

export class ProjectCodeModule { }

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
