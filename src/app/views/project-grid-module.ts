// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
//
// import { SharedModule } from '../../shared';
//
// import { AuthGuard } from '../services/AuthGuard';
// import { ProjectsProjectGridComponent } from './projects-project-grid';
// import { ProjectsProjectGridGridsComponent } from './projects-project-grid-grids';
// import { ProjectsProjectGridGridsGridComponent } from './projects-project-grid-grids-grid';
// import { ExitConfirmGuard } from '../services/ExitConfirmGuard';
//
// // routes
// export const PROJECT_GRID_ROUTES: Routes = [
//
//     { path: '', data: { breadName: 'GRID projects' }, component: ProjectsProjectGridComponent, canActivate: [AuthGuard]},
//     { path: ':grids', data: { breadName: ':grids' }, component: ProjectsProjectGridGridsComponent, canActivate: [AuthGuard]},
//     { path: ':grids/:grid', data: { breadName: ':grid' }, component: ProjectsProjectGridGridsGridComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },
//
// ];
//
// @NgModule({
//     imports: [
//         CommonModule,
//         SharedModule,
//         RouterModule.forChild(PROJECT_GRID_ROUTES)
//     ],
//     declarations: [
//         ProjectsProjectGridComponent,
//         ProjectsProjectGridGridsComponent,
//         ProjectsProjectGridGridsGridComponent
//     ],
//     exports: [ RouterModule ]
// })
//
// export class ProjectGridModule { }
