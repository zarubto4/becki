import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';
import { AuthGuard } from '../services/AuthGuard';

import { ProjectsComponent } from './projects';
import { ProjectsProjectComponent } from './projects-project';
import { ProjectsProjectMembersComponent } from './projects-project-members';
import { ProjectsProjectActualizationProcedureComponent } from './projects-project-actualization-procedure';
import { ProjectsProjectLibrariesComponent } from './projects-project-libraries';


// routes
export const PROJECT_ROUTES: Routes = [

    { path: '', data: { breadName: 'Projects' }, component: ProjectsComponent, canActivate: [AuthGuard] },
    { path: ':project', data: { breadName: ':project' }, component: ProjectsProjectComponent, canActivate: [AuthGuard] },

    { path: 'actualization_procedure/:procedure', data: { breadName: ':last' }, component: ProjectsProjectActualizationProcedureComponent, canActivate: [AuthGuard]},

    { path: ':project/members', data: { breadName: 'Members' }, component: ProjectsProjectMembersComponent, canActivate: [AuthGuard] },

    { path: ':project/libraries', data: { breadName: 'CODE libraries' }, component: ProjectsProjectLibrariesComponent, canActivate: [AuthGuard] },

    // Project HARDWARE
    { path: ':project/hardware', data: { breadName: 'HARDWARE devices' }, loadChildren: './project-hardware-module#ProjectHardwareModule' },

    // Project CODE
    { path: ':project/code', data: { breadName: 'CODE programs' }, loadChildren: './project-code-module#ProjectCodeModule' },

    // Project GRID
    { path: ':project/grid', data: { breadName: 'GRID projects' }, loadChildren: './project-grid-module#ProjectGridModule' },

    // Project WIDGET
    { path: ':project/widgets', data: { breadName: 'WIDGET projects' }, loadChildren: './project-widget-module#ProjectWidgetModule' },

    // Project BLOCKO
    { path: ':project/blocko', data: { breadName: 'BLOCKO programs' }, loadChildren: './project-blocko-module#ProjectBlockoModule' },

    // Project BLOCKO - BLOCKS
    { path: ':project/blocks', data: { breadName: 'BLOCKO blocks' }, loadChildren: './project-blocko-blocks-module#ProjectBlockoBlocksModule'},

    // Project CLOUD - SERVERS
    { path: ':project/servers', data: { breadName: 'CLOUD servers' }, loadChildren: './project-cloud-module#ProjectCloudModule' },

    // Project CLOUD - INSTANCES
    { path: ':project/instances', data: { breadName: 'CLOUD instances' }, loadChildren: './project-instances-module#ProjectInstancesModule'},
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
        ProjectsProjectActualizationProcedureComponent,
        ProjectsProjectMembersComponent,
        ProjectsProjectLibrariesComponent
    ],
    exports: [ RouterModule ]
})

export class ProjectsModule { }

