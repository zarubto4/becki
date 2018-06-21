import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { BugsComponent } from './admin-bugs';
import { BugsBugComponent } from './admin-bugs-bug';


// routes
export const ADMIN_BUGS_ROUTES: Routes = [

    { path: '', component: BugsComponent, canActivate: [AuthGuard]},
    { path: ':bug', data: {breadName: ':bug'}, component: BugsBugComponent, canActivate: [AuthGuard]},

];


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(ADMIN_BUGS_ROUTES)
    ],
    declarations: [
        BugsComponent,
        BugsBugComponent
    ],
    exports: [ RouterModule ]
})

export class AdminBugsModule { }
