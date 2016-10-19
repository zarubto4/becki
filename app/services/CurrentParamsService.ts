/**
 * Created by davidhradek on 16.08.16.
 */

import {Injectable} from "@angular/core";
import {Router, RoutesRecognized, ActivatedRouteSnapshot, Params} from "@angular/router";
import {BackendService} from "./BackendService";
import {Observable, Subject} from "rxjs/Rx";
import {IProject, IBProgram, ICProgram} from "../backend/TyrionAPI";

@Injectable()
export class CurrentParamsService {

    public currentParams:Observable<Params> = null;
    protected currentParamsSubject:Subject<Params> = null;
    public currentParamsSnapshot:Params = {};

    public currentProjectName:Observable<string> = null;
    protected currentProjectNameSubject:Subject<string> = null;
    public currentProjectNameSnapshot:string = null;

    public currentBlockoName:Observable<string> = null;
    protected currentBlockoNameSubject:Subject<string> = null;
    public currentBlockoNameSnapshot:string = null;

    public currentCodeName:Observable<string> = null;
    protected currentCodeNameSubject:Subject<string> = null;
    public currentCodeNameSnapshot:string = null;



    constructor(protected router:Router, protected backendService:BackendService) {
        console.log("BreadcrumbsService init");

        this.currentParams = this.currentParamsSubject = new Subject<Params>();
        this.currentProjectName = this.currentProjectNameSubject = new Subject<string>();
        this.currentBlockoName = this.currentBlockoNameSubject = new Subject<string>();
        this.currentCodeName = this.currentCodeNameSubject = new Subject<string>();

        router.events.subscribe(event => {
            if (event instanceof RoutesRecognized) {
                var e = <RoutesRecognized>event;
                if (e.state && e.state.root) {
                    this.newParams(this.getParamsRecursive(e.state.root));
                }
            }
        });
    }

    protected getParamsRecursive(activatedRouteSnapshot:ActivatedRouteSnapshot):Params {
        var p:Params = {};
        if (activatedRouteSnapshot.params) {
            for (var k in activatedRouteSnapshot.params) {
                if (activatedRouteSnapshot.params.hasOwnProperty(k)) p[k] = activatedRouteSnapshot.params[k];
            }
        }
        if (activatedRouteSnapshot.children) {
            activatedRouteSnapshot.children.forEach((ars:ActivatedRouteSnapshot) => {
                var pp = this.getParamsRecursive(ars);
                for (var k in pp) {
                    if (pp.hasOwnProperty(k)) p[k] = pp[k];
                }
            })
        }
        return p;
    }

    protected newParams(params:Params) {

        if (this.currentParamsSnapshot["project"] != params["project"]) {

            if (!params["project"]) {
                this.currentProjectNameSnapshot = null;
                this.currentProjectNameSubject.next(this.currentProjectNameSnapshot);
            } else {
                this.backendService.getProject(params["project"]).then((project:IProject) => {
                    this.currentProjectNameSnapshot = project.name;
                    this.currentProjectNameSubject.next(this.currentProjectNameSnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot["blocko"] != params["blocko"]) {

            if (!params["blocko"]) {
                this.currentBlockoNameSnapshot = null;
                this.currentBlockoNameSubject.next(this.currentBlockoNameSnapshot);
            } else {
                this.backendService.getBProgram(params["blocko"]).then((blocko:IBProgram) => {
                    this.currentBlockoNameSnapshot = blocko.name;
                    this.currentBlockoNameSubject.next(this.currentBlockoNameSnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot["code"] != params["code"]) {

            if (!params["code"]) {
                this.currentCodeNameSnapshot = null;
                this.currentCodeNameSubject.next(this.currentCodeNameSnapshot);
            } else {
                this.backendService.getCProgram(params["code"]).then((code:ICProgram) => {
                    this.currentCodeNameSnapshot = code.name;
                    this.currentCodeNameSubject.next(this.currentCodeNameSnapshot);
                });
            }

        }

        this.currentParamsSnapshot = params;
        this.currentParamsSubject.next(this.currentParamsSnapshot);
    }

    public get(paramName:string):any {
        if (this.currentParamsSnapshot[paramName])
            return this.currentParamsSnapshot[paramName];
        return null;
    }

}