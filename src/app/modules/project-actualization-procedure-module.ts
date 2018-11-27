import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared';

import { AuthGuard } from '../services/AuthGuard';
import { ProjectsProjectActualizationProceduresComponent } from '../views/projects-project-actualization-procedures';
import { ProjectsProjectActualizationProceduresProcedureComponent } from '../views/projects-project-actualization-procedures-procedure';

// routes
export const PROJECT_ACTUALIZATION_ROUTES: Routes = [

    { path: '', data: { breadName: 'Actualization procedures' }, component: ProjectsProjectActualizationProceduresComponent, canActivate: [AuthGuard]},
    { path: ':procedure', data: { breadName: ':last' }, component: ProjectsProjectActualizationProceduresProcedureComponent, canActivate: [AuthGuard]},

];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECT_ACTUALIZATION_ROUTES)
    ],
    declarations: [
        ProjectsProjectActualizationProceduresComponent,
        ProjectsProjectActualizationProceduresProcedureComponent
    ],
    exports: [ RouterModule ]
})

export class ProjectActualizationProcedureModule { }

