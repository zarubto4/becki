import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { ProjectsProjectWidgetsComponent } from './projects-project-widgets';
import { ProjectsProjectWidgetsWidgetComponent } from './projects-project-widgets-widget';

// routes
export const ADMIN_WIDGETS_ROUTES: Routes = [

    { path: '', component: ProjectsProjectWidgetsComponent, canActivate: [AuthGuard]},
    { path: ':widget', data: {breadName: ':widget'}, component: ProjectsProjectWidgetsWidgetComponent, canActivate: [AuthGuard]}// Only for community decisions - Link without project path

];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(ADMIN_WIDGETS_ROUTES)
    ],
    exports: [ RouterModule ]
})

export class AdminWidgetsModule { }
