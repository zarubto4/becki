/**
 * Created by davidhradek on 04.08.16.
 */

import {FormControl, AsyncValidatorFn} from "@angular/forms";
import {Observable, Observer} from "rxjs/Rx";
import {BackendService} from "../services/BackendService";
import {IBProgram} from "../backend/TyrionAPI";

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

    public static projectNameTaken(backEnd:BackendService):AsyncValidatorFn {
        return AsyncValidatorDebounce.debounce((control:FormControl) => {
            return new Promise<any>((resolve, reject) => {
                backEnd.getAllProjects()
                    .then((projects) => {
                        if (projects.find(project => project.name == control.value)) {
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

    public static blockoNameTaken(backEnd:BackendService, projectId:string|(()=>string)):AsyncValidatorFn {
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
                    .then((project) => {
                        Promise.all<IBProgram>(project.b_programs.map((b_program) => {
                            return backEnd.getBProgram(b_program.id);
                        }))
                            .then((blockoPrograms:IBProgram[]) => {
                                if (blockoPrograms.find((blockoProgram:IBProgram) => blockoProgram.name == control.value)) {
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