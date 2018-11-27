import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './shared';
import { AuthGuard } from '../services/AuthGuard';
import { ExitConfirmGuard } from '../services/ExitConfirmGuard';
import { ProjectsProjectCodeComponent } from '../views/projects-project-code';
import { ProjectsProjectCodeCodeComponent } from '../views/projects-project-code-code';

// routes
export const PROJECT_CODE_ROUTES: Routes = [

    { path: '', component: ProjectsProjectCodeComponent, canActivate: [AuthGuard] },
    { path: ':code', data: { breadName: ':code' }, component: ProjectsProjectCodeCodeComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(PROJECT_CODE_ROUTES)
    ],
    declarations: [
        ProjectsProjectCodeComponent
    ],
    exports: [ RouterModule ]
})

export class ProjectCodeModule { }
