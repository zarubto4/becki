/**
 * Created by davidhradek on 08.12.16.
 */

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { IProject, ITypeOfBoard } from '../backend/TyrionAPI';
import { BackendService } from './BackendService';

@Injectable()
export class StorageService {

    protected projectsSubjects: { [id: string]: ReplaySubject<IProject> } = {};
    protected projectsCache: { [id: string]: IProject } = {};
    protected projectsLastTouch: { [id: string]: number } = {};
    protected projectsInProgress: { [id: string]: boolean } = {};

    protected typeOfBoardsSubject: ReplaySubject<ITypeOfBoard[]> = null;
    protected typeOfBoardsCache: ITypeOfBoard[] = null;
    protected typeOfBoardsLastTouch: number = 0;
    protected typeOfBoardsInProgress: boolean = false;

    constructor(protected backendService: BackendService, protected router: Router) {
        console.info('StorageService init');
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
            this.backendService.getProject(id)
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

    // typeOfBoards

    public typeOfBoards(): Observable<ITypeOfBoard[]> {
        this.typeOfBoardsRefreshSoft();
        if (this.typeOfBoardsSubject) {
            return this.typeOfBoardsSubject;
        }
        this.typeOfBoardsSubject = new ReplaySubject<ITypeOfBoard[]>(1);
        return this.typeOfBoardsSubject;
    }

    public typeOfBoardsRefreshSoft(): void {
        if (!this.typeOfBoardsCache) {
            // not in cache
            this.typeOfBoardsRefresh();
        } else {
            // too old
            if (this.typeOfBoardsLastTouch < (Date.now() - 30 * 1000)) {
                this.typeOfBoardsRefresh();
            }
        }
    }

    public typeOfBoardsRefresh(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (this.typeOfBoardsInProgress) {
                return;
            }
            this.typeOfBoardsInProgress = true;
            this.backendService.getAllTypeOfBoards()
                .then((typeOfBoards) => {
                    this.typeOfBoardsCache = typeOfBoards;
                    this.typeOfBoardsLastTouch = Date.now();
                    this.typeOfBoardsInProgress = false;
                    if (this.typeOfBoardsSubject) {
                        this.typeOfBoardsSubject.next(this.typeOfBoardsCache);
                    }
                    resolve(true);
                })
                .catch((err) => {
                    // TODO: error
                    this.typeOfBoardsInProgress = false;
                    resolve(false);
                });
        });
    }

}
