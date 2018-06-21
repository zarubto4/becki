import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared';

import { AuthGuard } from '../services/AuthGuard';
import { GarfieldComponent } from './garfield';
import { GarfieldGarfieldComponent } from './garfield-garfield';


// routes
export const ADMIN_GARFIELD_ROUTES: Routes = [

    { path: '', component: GarfieldComponent, canActivate: [AuthGuard]},
    { path: ':garfield', data: {breadName: ':garfield'}, component: GarfieldGarfieldComponent, canActivate: [AuthGuard]}

];

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild(ADMIN_GARFIELD_ROUTES)
    ],
    declarations: [

    ],
    exports: [ RouterModule ]
})

export class Module { }
