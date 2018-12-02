import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './shared';
import { AuthGuard } from '../services/AuthGuard';
import { ProjectsComponent } from '../views/projects';
import { ProjectsProjectComponent } from '../views/projects-project';
import { ProjectsProjectMembersComponent } from '../views/projects-project-members';
import { ProjectsProjectLibrariesComponent } from '../views/projects-project-libraries';
import { ProjectsProjectDatabasesComponent } from '../views/projects-project-databases';
import { RoleGroupComponent } from '../views/admin-permission-group';
import { RoleGroupGroupComponent } from '../views/admin-permission-group-group';
import { ProjectsProjectHardwareAddWithQrComponent } from '../views/projects-project-hardware-scan';

// routes
export const PROJECTS_ROUTES: Routes = [

    { path: '', component: ProjectsComponent, canActivate: [AuthGuard] },
    { path: ':project', data: { breadName: ':project' }, component: ProjectsProjectComponent, canActivate: [AuthGuard] },
    { path: ':project/members', data: { breadName: 'Members' }, component: ProjectsProjectMembersComponent, canActivate: [AuthGuard] },
    { path: ':project/roles', data: { breadName: 'Roles' }, component: RoleGroupComponent, canActivate: [AuthGuard] },
    { path: ':project/roles/:group', data: { breadName: ':group' }, component: RoleGroupGroupComponent, canActivate: [AuthGuard] },
    { path: ':project/libraries', data: { breadName: 'CODE libraries' }, component: ProjectsProjectLibrariesComponent, canActivate: [AuthGuard] },
    { path: ':project/databases', data: { breadName: 'CLOUD databases' }, component: ProjectsProjectDatabasesComponent, canActivate: [AuthGuard] },
    { path: ':project/actualization-procedures', data: { breadName: 'Actualization Procedures' }, loadChildren: './project-actualization-procedure-module#ProjectActualizationProcedureModule' },
    { path: ':project/gsm', data: { breadName: 'CELLULAR modules' }, loadChildren: './project-gsms-module#ProjectGSMSModule' },
    { path: ':project/hardware', data: { breadName: 'HARDWARE devices' }, loadChildren: './project-hardware-module#ProjectHardwareModule' },
    { path: ':project/code', data: { breadName: 'CODE programs' }, loadChildren: './project-code-module#ProjectCodeModule' },
    { path: ':project/grid', data: { breadName: 'GRID projects' }, loadChildren: './project-grid-module#ProjectGridModule' },
    { path: ':project/widgets', data: { breadName: 'WIDGET projects' }, loadChildren: './project-widget-module#ProjectWidgetModule' },
    { path: ':project/blocko', data: { breadName: 'BLOCKO programs' }, loadChildren: './project-blocko-module#ProjectBlockoModule' },
    { path: ':project/blocks', data: { breadName: 'BLOCKO blocks' }, loadChildren: './project-blocko-blocks-module#ProjectBlockoBlocksModule'},
    { path: ':project/servers', data: { breadName: 'CLOUD servers' }, loadChildren: './project-cloud-module#ProjectCloudModule' },
    { path: ':project/instances', data: { breadName: 'CLOUD instances' }, loadChildren: './project-instances-module#ProjectInstancesModule'},
    { path: ':project/scanHardware', data: {breadName: 'Add hardware with QR code', component: ProjectsProjectHardwareAddWithQrComponent, canActivate: [AuthGuard]}}
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(PROJECTS_ROUTES)
    ],
    declarations: [
        ProjectsComponent,
        ProjectsProjectComponent,
        ProjectsProjectMembersComponent,
        ProjectsProjectLibrariesComponent,
        ProjectsProjectDatabasesComponent,
        ProjectsProjectHardwareAddWithQrComponent,
    ],
    exports: [ RouterModule ]
})

export class ProjectsModule { }

