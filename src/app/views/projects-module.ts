import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';
import { AuthGuard } from '../services/AuthGuard';

import { ProjectsComponent } from './projects';
import { ProjectsProjectComponent } from './projects-project';
import { ProjectsProjectMembersComponent } from './projects-project-members';
import { ProjectsProjectActualizationProcedureComponent } from './projects-project-actualization-procedure';


// routes
export const PROJECT_ROUTES: Routes = [

    { path: '', data: { breadName: 'Projects' }, component: ProjectsComponent, canActivate: [AuthGuard] },
    { path: ':project', data: { breadName: ':project' }, component: ProjectsProjectComponent, canActivate: [AuthGuard] },
    { path: 'actualization_procedure/:procedure', data: { breadName: ':last' }, component: ProjectsProjectActualizationProcedureComponent, canActivate: [AuthGuard]},
    { path: 'members', data: { breadName: 'Members' }, component: ProjectsProjectMembersComponent, canActivate: [AuthGuard] },


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
        ProjectsProjectMembersComponent
    ],
    exports: [ RouterModule ]
})

export class ProjectsModule { }

