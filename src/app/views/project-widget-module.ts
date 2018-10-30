// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
//
// import { SharedModule } from '../../shared';
//
// import { AuthGuard } from '../services/AuthGuard';
// import { ExitConfirmGuard } from '../services/ExitConfirmGuard';
// import { ProjectsProjectWidgetsComponent } from './projects-project-widgets';
// import { ProjectsProjectWidgetsWidgetComponent } from './projects-project-widgets-widget';
//
// // routes
// export const PROJECT_WIDGET_ROUTES: Routes = [
//
//     { path: '', data: { breadName: 'GRID widgets' }, component: ProjectsProjectWidgetsComponent, canActivate: [AuthGuard] },
//     { path: ':widget', data: { breadName: ':widget' }, component: ProjectsProjectWidgetsWidgetComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },
// ];
//
// @NgModule({
//     imports: [
//         CommonModule,
//         SharedModule,
//         RouterModule.forChild(PROJECT_WIDGET_ROUTES)
//     ],
//     declarations: [
//         ProjectsProjectWidgetsComponent,
//         ProjectsProjectWidgetsWidgetComponent
//     ],
//     exports: [ RouterModule ]
// })
//
// export class ProjectWidgetModule { }
