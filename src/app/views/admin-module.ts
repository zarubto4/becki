import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';
import { AuthGuard } from '../services/AuthGuard';
import { ExitConfirmGuard } from '../services/ExitConfirmGuard';

import { AdminDashboardComponent } from './admin';
import { ProjectsProjectWidgetsWidgetComponent } from './projects-project-widgets-widget';
import { ProjectsProjectBlocksBlockComponent } from './projects-project-blocks-block';
import { ServerComponent } from './admin-server';
import { TyrionComponent } from './admin-tyrion';
import { CommunityCProgramComponent } from './admin-cprograms';
import { RoleGroupComponent } from './admin-permission-group';
import { RoleGroupGroupComponent } from './admin-permission-group-group';
import { AdminFinancialComponent } from './admin-financial';
import { AdminFinancialTariffComponent } from './admin-financial-tariff';
import { GarfieldGarfieldComponent } from './garfield-garfield';
import { GarfieldComponent } from './garfield';
import { BugsBugComponent } from './admin-bugs-bug';
import { BugsComponent } from './admin-bugs';
import { ProjectsProjectBlocksComponent } from './projects-project-blocks';
import { ProjectsProjectWidgetsComponent } from './projects-project-widgets';
import { ProjectsProjectCodeCodeComponent } from './projects-project-code-code';
import { AdminHardwareComponent } from './admin-hardware-type';


// routes



// routes
export const ADMIN_ROUTES: Routes = [

    { path: '', component: AdminDashboardComponent, canActivate: [AuthGuard] },

    // Admin HARDWARE
    { path: 'hardware', data: { breadName: 'Hardware' }, component: AdminHardwareComponent, canActivate: [AuthGuard] },
    { path: 'hardware/code/:code', data: { breadName: ':code' }, component: ProjectsProjectCodeCodeComponent, canActivate: [AuthGuard] },
    // { path: 'hardware/libraries/:library', data: { breadName: ':library' }, component: ProjectsProjectLibrariesLibraryComponent, canActivate: [AuthGuard] },

    { path: 'widgets', data: {breadName: 'Community Grid Widgets Group'}, component: ProjectsProjectWidgetsComponent, canActivate: [AuthGuard]},
    { path: 'widgets/:widget', data: {breadName: ':widget'}, component: ProjectsProjectWidgetsWidgetComponent, canActivate: [AuthGuard]},          // Only for community decisions - Link without project path
    { path: 'widget/:widget', data: { breadName: ':widget' }, component: ProjectsProjectWidgetsWidgetComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },

    { path: 'blocks', data: {breadName: 'Blocko Blocks'}, component: ProjectsProjectBlocksComponent, canActivate: [AuthGuard]},
    { path: 'blocks/:block', data: {breadName: ':block'}, component: ProjectsProjectBlocksBlockComponent, canActivate: [AuthGuard]},             // Only for community decisions - Link without project path
    { path: 'block/:block', data: { breadName: ':block' }, component: ProjectsProjectBlocksBlockComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },

    { path: 'bugs', data: {breadName: 'Bugs'}, component: BugsComponent, canActivate: [AuthGuard]},
    { path: 'bugs/:bug', data: {breadName: ':bug'}, component: BugsBugComponent, canActivate: [AuthGuard]},

    { path: 'garfield', data: {breadName: 'Garfield'}, component: GarfieldComponent, canActivate: [AuthGuard]},
    { path: 'garfield/:garfield', data: {breadName: ':garfield'}, component: GarfieldGarfieldComponent, canActivate: [AuthGuard]},

    { path: 'tyrion', data: { breadName: 'Tyrion' }, component: TyrionComponent, canActivate: [AuthGuard] },
    { path: 'server', data: { breadName: 'Servers' }, component: ServerComponent, canActivate: [AuthGuard] },

    { path: 'financial', data: { breadName: 'Tariff' }, component: AdminFinancialComponent, canActivate: [AuthGuard] },
    { path: 'financial/:tariff', data: { breadName: ':tariff' }, component: AdminFinancialTariffComponent, canActivate: [AuthGuard] },

    { path: 'permission-group', data: { breadName: 'Permission Group' }, component: RoleGroupComponent, canActivate: [AuthGuard] },
    { path: 'permission-group/:group', data: { breadName: ':group' }, component: RoleGroupGroupComponent, canActivate: [AuthGuard] },

    { path: 'c-program/c-program', data: { breadName: 'Community Management Code' }, component: CommunityCProgramComponent, canActivate: [AuthGuard] },



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
        CommunityCProgramComponent,
        AdminHardwareComponent,
        BugsComponent,
        BugsBugComponent,
        GarfieldComponent,
        GarfieldGarfieldComponent,
        AdminFinancialTariffComponent,
        AdminFinancialComponent,
        RoleGroupGroupComponent,
        RoleGroupComponent

    ],
    exports: [ RouterModule ]
})

export class AdminModule { }

