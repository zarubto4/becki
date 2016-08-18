/**
 * Created by davidhradek on 16.08.16.
 */

import {Injectable} from "@angular/core";
import {Router, RoutesRecognized, ActivatedRouteSnapshot, Params} from "@angular/router";
import {Project, CProgram, BProgram} from "../lib-back-end/index";
import {BackEndService} from "./BackEndService";
import {Observable, Observer, Subject} from "rxjs/Rx";

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



    constructor(protected router:Router, protected backEndService:BackEndService) {
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
                this.backEndService.getProject(params["project"]).then((project:Project) => {
                    this.currentProjectNameSnapshot = project.project_name;
                    this.currentProjectNameSubject.next(this.currentProjectNameSnapshot);
                });
            }

        }

        if (this.currentParamsSnapshot["blocko"] != params["blocko"]) {

            if (!params["blocko"]) {
                this.currentBlockoNameSnapshot = null;
                this.currentBlockoNameSubject.next(this.currentBlockoNameSnapshot);
            } else {
                this.backEndService.getBProgram(params["blocko"]).then((blocko:BProgram) => {
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
                this.backEndService.getCProgram(params["code"]).then((code:CProgram) => {
                    this.currentCodeNameSnapshot = code.program_name;
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