// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
//
// import { SharedModule } from '../../shared';
//
// import { AuthGuard } from '../services/AuthGuard';
// import { ExitConfirmGuard } from '../services/ExitConfirmGuard';
//
// import { ProjectsProjectBlocksComponent } from './projects-project-blocks';
// import { ProjectsProjectBlocksBlockComponent } from './projects-project-blocks-block';
//
//
// // routes
// export const PROJECT_BLOCKO_BLOCKS_ROUTES: Routes = [
//
//     { path: '', data: { breadName: 'BLOCKO blocks' }, component: ProjectsProjectBlocksComponent, canActivate: [AuthGuard] },
//     { path: ':block', data: { breadName: ':block' }, component: ProjectsProjectBlocksBlockComponent, canActivate: [AuthGuard], canDeactivate: [ExitConfirmGuard] },
// ];
//
// @NgModule({
//     imports: [
//         CommonModule,
//         SharedModule,
//         RouterModule.forChild(PROJECT_BLOCKO_BLOCKS_ROUTES)
//     ],
//     declarations: [
//
//         ProjectsProjectBlocksComponent,
//         ProjectsProjectBlocksBlockComponent
//     ],
//     exports: [ RouterModule ]
// })
//
// export class ProjectBlockoBlocksModule { }
