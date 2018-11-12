/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { IProject, IHardwareType } from '../backend/TyrionAPI';
import { TyrionBackendService } from './BackendService';

@Injectable()
export class StorageService {

    protected projectsSubjects: { [id: string]: ReplaySubject<IProject> } = {};
    protected projectsCache: { [id: string]: IProject } = {};
    protected projectsLastTouch: { [id: string]: number } = {};
    protected projectsInProgress: { [id: string]: boolean } = {};

    protected hardwareTypesSubject: ReplaySubject<IHardwareType[]> = null;
    protected hardwareTypesCache: IHardwareType[] = null;
    protected hardwareTypesLastTouch: number = 0;
    protected hardwareTypesInProgress: boolean = false;

    constructor(protected backendService: TyrionBackendService, protected router: Router) {
        // console.info('StorageService init');
    }

    // project

    public project(id: string): Observable<IProject> {
        this.projectRefreshSoft(id);
        if (this.projectsSubjects[id]) {
            return this.projectsSubjects[id];
        }
        this.projectsSubjects[id] = new ReplaySubject<IProject>(1);
        return this.projectsSubjects[id];
    }

    public projectRefreshSoft(id: string): void {
        if (!this.projectsCache[id]) {
            // not in cache
            this.projectRefresh(id);
        } else {
            // too old
            if (this.projectsLastTouch[id] < (Date.now() - 30 * 1000)) {
                this.projectRefresh(id);
            }
        }
    }

    public projectRefresh(id: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (this.projectsInProgress[id]) {
                return;
            }
            this.projectsInProgress[id] = true;
            this.backendService.projectGet(id)
                .then((proj) => {
                    this.projectsCache[id] = proj;
                    this.projectsLastTouch[id] = Date.now();
                    this.projectsInProgress[id] = false;
                    if (this.projectsSubjects[id]) {
                        this.projectsSubjects[id].next(this.projectsCache[id]);
                    }
                    resolve(true);
                })
                .catch((err) => {
                    // TODO: error
                    this.projectsInProgress[id] = false;
                    resolve(false);
                });
        });
    }

    // hardwareTypes

    public hardwareTypes(): Observable<IHardwareType[]> {
        this.hardwareTypesRefreshSoft();
        if (this.hardwareTypesSubject) {
            return this.hardwareTypesSubject;
        }
        this.hardwareTypesSubject = new ReplaySubject<IHardwareType[]>(1);
        return this.hardwareTypesSubject;
    }

    public hardwareTypesRefreshSoft(): void {
        if (!this.hardwareTypesCache) {
            // not in cache
            this.hardwareTypesRefresh();
        } else {
            // too old
            if (this.hardwareTypesLastTouch < (Date.now() - 30 * 1000)) {
                this.hardwareTypesRefresh();
            }
        }
    }

    public hardwareTypesRefresh(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (this.hardwareTypesInProgress) {
                return;
            }
            this.hardwareTypesInProgress = true;
            this.backendService.hardwareTypesGetAll()
                .then((hardwareTypes) => {
                    this.hardwareTypesCache = hardwareTypes;
                    this.hardwareTypesLastTouch = Date.now();
                    this.hardwareTypesInProgress = false;
                    if (this.hardwareTypesSubject) {
                        this.hardwareTypesSubject.next(this.hardwareTypesCache);
                    }
                    resolve(true);
                })
                .catch((err) => {
                    // TODO: error
                    this.hardwareTypesInProgress = false;
                    resolve(false);
                });
        });
    }

}
