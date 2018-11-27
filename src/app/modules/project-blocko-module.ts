import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from './shared';
import { AuthGuard } from '../services/AuthGuard';
import { ExitConfirmGuard } from '../services/ExitConfirmGuard';
import { ProjectsProjectBlockoComponent } from '../views/projects-project-blocko';
import { ProjectsProjectBlockoBlockoComponent } from '../views/projects-project-blocko-blocko';

// routes
export const PROJECT_BLOCKO_ROUTES: Routes = [

    { path: '', data: { breadName: 'BLOCKO programs' }, component: ProjectsProjectBlockoComponent, canActivate: [AuthGuard] },
    { path: ':blocko', data: { breadName: ':blocko' }, component: ProjectsProjectBlockoBlockoComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard]  },
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(PROJECT_BLOCKO_ROUTES)
    ],
    declarations: [
        ProjectsProjectBlockoComponent,
        ProjectsProjectBlockoBlockoComponent
    ],
    exports: [ RouterModule ]
})

export class ProjectBlockoModule { }
