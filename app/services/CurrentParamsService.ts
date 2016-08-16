/**
 * Created by davidhradek on 16.08.16.
 */

import {Injectable} from "@angular/core";
import {Router, RoutesRecognized, ActivatedRouteSnapshot, Params} from "@angular/router";
import {Project} from "../lib-back-end/index";
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



    constructor(protected router:Router, protected backEndService:BackEndService) {
        console.log("BreadcrumbsService init");

        this.currentParams = this.currentParamsSubject = new Subject<Params>();
        this.currentProjectName = this.currentProjectNameSubject = new  Subject<string>();

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

        this.currentParamsSnapshot = params;
        this.currentParamsSubject.next(this.currentParamsSnapshot);
    }

}