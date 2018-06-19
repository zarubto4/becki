import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { ProjectsProjectGridComponent } from './projects-project-grid';
import { ProjectsProjectGridGridsComponent } from './projects-project-grid-grids';
import { ProjectsProjectGridGridsGridComponent } from './projects-project-grid-grids-grid';
import { ExitConfirmGuard } from '../services/ExitConfirmGuard';
import { ProjectsProjectWidgetsComponent } from './projects-project-widgets';
import { ProjectsProjectWidgetsWidgetComponent } from './projects-project-widgets-widget';

// routes
export const PROJECT_GRID_WIDGET_ROUTES: Routes = [

    { path: 'grid', data: { breadName: 'GRID projects' }, component: ProjectsProjectGridComponent, canActivate: [AuthGuard]},
    { path: 'grid/:grids', data: { breadName: ':grids' }, component: ProjectsProjectGridGridsComponent, canActivate: [AuthGuard]},
    { path: 'grid/:grids/:grid', data: { breadName: ':grid' }, component: ProjectsProjectGridGridsGridComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },

    { path: 'widgets', data: { breadName: 'GRID widgets' }, component: ProjectsProjectWidgetsComponent, canActivate: [AuthGuard] },
    { path: 'widgets/:widget', data: { breadName: ':widget' }, component: ProjectsProjectWidgetsWidgetComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },
];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(PROJECT_GRID_WIDGET_ROUTES)
    ],
    declarations: [
        ProjectsProjectGridComponent,
        ProjectsProjectGridGridsComponent,
        ProjectsProjectGridGridsGridComponent,
        ProjectsProjectWidgetsComponent,
        ProjectsProjectWidgetsWidgetComponent
    ],
    exports: [ RouterModule ]
})

export class ProjectGridWidgetModule { }
