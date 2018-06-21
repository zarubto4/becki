import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';
import { AuthGuard } from '../services/AuthGuard';
import { ExitConfirmGuard } from '../services/ExitConfirmGuard';

import { AdminDashboardComponent } from './admin';
import { ProjectsProjectWidgetsWidgetComponent } from './projects-project-widgets-widget';
import { ProjectsProjectBlocksBlockComponent } from './projects-project-blocks-block';
import { TyrionComponent } from './admin-tyrion';
import { ServerComponent } from './admin-server';
import { CommunityCProgramComponent } from './admin-cprograms';


// routes
export const ADMIN_ROUTES: Routes = [

    { path: '', component: AdminDashboardComponent, canActivate: [AuthGuard] },

    // Admin HARDWARE
    { path: 'hardware', data: { breadName: 'Hardware' }, loadChildren: './admin-hardware-module#AdminHardwareModule' },

    // Admin WIDGETS
    { path: 'widgets', data: {breadName: 'Community Grid Widgets Group'}, loadChildren: './admin-widgets-module#AdminWidgetsModule' },
    { path: 'widget/:widget', data: { breadName: ':widget' }, component: ProjectsProjectWidgetsWidgetComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },

    // Admin BLOCKS & BLOCK
    { path: 'blocks', data: {breadName: 'Blocko Blocks'}, loadChildren: './admin-blocks-module#AdminBlocksModule' }, // Only for community decisions - Link without project path

    { path: 'block/:block', data: { breadName: ':block' }, component: ProjectsProjectBlocksBlockComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },

    // Admin BUGS
    { path: 'bugs', data: {breadName: 'Bugs'}, loadChildren: './admin-bugs-module#AdminBugsModule'},

    // Admin GARFIELD
    { path: 'garfield', data: {breadName: 'Garfield'}, loadChildren: './admin-garfield-module.ts'},

    // Admin FINANCIAL
    { path: 'financial', data: { breadName: 'Tariff' }, loadChildren: './admin-financial-module#AdminFinancialModule' },

    { path: 'tyrion', data: { breadName: 'Tyrion' }, component: TyrionComponent, canActivate: [AuthGuard] },

    { path: 'server', data: { breadName: 'Servers' }, component: ServerComponent, canActivate: [AuthGuard] },

    // Admin PERMISSION GROUP
    { path: 'permission-group', data: { breadName: 'Permission Group' }, loadChildren: './admin-permission-group-module#AdminPermissionGroupModule' },

    { path: 'c-program/c-program', data: { breadName: 'Community Management Code' }, component: CommunityCProgramComponent, canActivate: [AuthGuard] }

];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(ADMIN_ROUTES)
    ],
    declarations: [
        AdminDashboardComponent,
        TyrionComponent,
        ServerComponent,
        CommunityCProgramComponent
    ],
    exports: [ RouterModule ]
})

export class AdminModule { }

