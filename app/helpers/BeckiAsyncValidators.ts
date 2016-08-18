/**
 * Created by davidhradek on 04.08.16.
 */

import {FormControl, AsyncValidatorFn} from "@angular/forms";
import {Observable, Observer} from "rxjs/Rx";
import {BackEndService} from "../services/BackEndService";
import {BProgram, Project} from "../lib-back-end/index";

export class AsyncValidatorDebounce {
    _validate:(x: any) => any;

    constructor(validator: (control: FormControl) => any, debounceTime = 1000) {
        let source: any = new Observable((observer: Observer<FormControl>) => {
            this._validate = (control) => observer.next(control);
        });

        source.debounceTime(debounceTime)
            .distinctUntilChanged(null, (x:any) => x.control.value)
            .map((x:any) => { return { promise: validator(x.control), resolver: x.promiseResolver }; })
            .subscribe(
                (x:any) => x.promise.then((resultValue:any) => x.resolver(resultValue),
                    (e:any) => { console.log('async validator error: %s', e); }));
    }

    private _getValidator() {
        return (control: FormControl) => {
            let promiseResolver:any;
            let p = new Promise((resolve) => {
                promiseResolver = resolve;
            });
            this._validate({ control: control, promiseResolver: promiseResolver });
            return p;
        };
    }

    static debounce(validator: (control: FormControl) => any, debounceTime = 400) {
        var asyncValidator = new this(validator, debounceTime);
        return asyncValidator._getValidator();
    }
}

export class BeckiAsyncValidators {

    public static projectNameTaken(backEnd:BackEndService):AsyncValidatorFn {
        return AsyncValidatorDebounce.debounce((control:FormControl) => {
            return new Promise<any>((resolve, reject) => {
                backEnd.getProjects()
                    .then((projects) => {
                        if (projects.find(project => project.project_name == control.value)) {
                            resolve({"projectNameTaken": true}); // invalid
                        } else {
                            resolve(null); // valid
                        }
                    })
                    .catch(reason => {
                        resolve({"projectNameTaken": true}); // invalid
                    });
            });
        });
    }

    public static blockoNameTaken(backEnd:BackEndService, projectId:string|(()=>string)):AsyncValidatorFn {
        return AsyncValidatorDebounce.debounce((control:FormControl) => {
            return new Promise<any>((resolve, reject) => {
                var projId:string = null;
                if (typeof projectId == "string") projId = <string>projectId;
                if (typeof projectId == "function") projId = (<()=>string>projectId)();
                if (!projId) {
                    resolve({"blockoNameTaken": true}); // invalid
                    return;
                }
                backEnd.getProject(projId)
                    .then((project:Project) => {
                        Promise.all<BProgram>(project.b_programs_id.map((b_program_id) => {
                            return backEnd.getBProgram(b_program_id);
                        }))
                            .then((blockoPrograms:BProgram[]) => {
                                if (blockoPrograms.find((blockoProgram:BProgram) => blockoProgram.name == control.value)) {
                                    resolve({"blockoNameTaken": true}); // invalid
                                } else {
                                    resolve(null); // valid
                                }
                            });
                    })
                    .catch(reason => {
                        resolve({"blockoNameTaken": true}); // invalid
                    });
            });
        });
    }

    public static ifValidator(ifFunction:(value:string)=>boolean, validator:AsyncValidatorFn) {
        return (control:FormControl) => {
            return new Promise<any>((resolve, reject) => {
                if (ifFunction(control.value)) {
                    validator(control) // do validation
                        .then((out:any) => {
                            resolve(out);
                        })
                        .catch((out:any) => {
                            reject(out);
                        });
                } else {
                    resolve(null); // valid
                }
            });
        };
    }

}