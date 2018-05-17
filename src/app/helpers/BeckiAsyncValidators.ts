/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { FormControl, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs/Rx';
import { TyrionBackendService } from '../services/BackendService';
import { IBProgram } from '../backend/TyrionAPI';

export class AsyncValidatorDebounce {
    _validate: (x: any) => any;

    static debounce(validator: (control: FormControl) => any, debounceTime = 400) {
        let asyncValidator = new this(validator, debounceTime);
        return asyncValidator._getValidator();
    }

    constructor(validator: (control: FormControl) => any, debounceTime = 1000) {
        let source: any = new Observable((observer: Observer<FormControl>) => {
            this._validate = (control) => observer.next(control);
        });

        source.debounceTime(debounceTime)
            .distinctUntilChanged(null, (x: any) => x.control.value)
            .map((x: any) => {
                return {promise: validator(x.control), resolver: x.promiseResolver};
            })
            .subscribe((x: any) => {
                x.promise
                    .then((resultValue: any) => {
                        x.resolver(resultValue);
                    })
                    .catch((e: any) => {
                        console.error('async validator error: %s', e);
                    });
            });
    }

    private _getValidator() {
        return (control: FormControl) => {
            let promiseResolver: any;
            let p = new Promise((resolve) => {
                promiseResolver = resolve;
            });
            this._validate({control: control, promiseResolver: promiseResolver});
            return p;
        };
    }

}

export class BeckiAsyncValidators {

    public static validateEntity(backEnd: TyrionBackendService, inputKey: ('email'|'nick_name'|'vat_number')): AsyncValidatorFn {
        return AsyncValidatorDebounce.debounce((control: FormControl) => {
            return new Promise<any>((resolve) => {
                backEnd.entityValidation({
                    key: inputKey,
                    value: control.value
                })
                    .then(entity => {
                        // console.log(entity);
                        if (entity.valid) {
                            resolve(null); // valid
                        } else {
                            let out: any = {'entityNotValid': inputKey};
                            if (entity.message) {
                                out['entityMessage'] = entity.message;
                            }
                            resolve(out); // invalid
                        }
                    })
                    .catch(() => {
                        resolve({'entityNotValid': inputKey}); // invalid
                    });

            });
        });

    }

    public static projectNameTaken(backEnd: TyrionBackendService): AsyncValidatorFn {
        return AsyncValidatorDebounce.debounce((control: FormControl) => {
            return new Promise<any>((resolve) => {
                backEnd.projectGetByLoggedPerson()
                    .then((projects) => {
                        if (projects.find(project => project.name === control.value)) {
                            resolve({'projectNameTaken': true}); // invalid
                        } else {
                            resolve(null); // valid
                        }
                    })
                    .catch(() => {
                        resolve({'projectNameTaken': true}); // invalid
                    });
            });
        });
    }

    // blockoNameTaken validator is not used
    /*
        public static blockoNameTaken(backEnd: TyrionBackendService, projectId: string|(() => string)): AsyncValidatorFn {
            return AsyncValidatorDebounce.debounce((control: FormControl) => {
                return new Promise<any>((resolve) => {
                    let projId: string = null;
                    if (typeof projectId === 'string') {
                        projId = <string>projectId;
                    }
                    if (typeof projectId === 'function') {
                        projId = (<() => string>projectId)();
                    }
                    if (!projId) {
                        resolve({'blockoNameTaken': true}); // invalid
                        return;
                    }
                    backEnd.getProject(projId)
                        .then((project) => {
                            Promise.all<IBProgram>(project.b_programs.map((b_program) => {
                                return backEnd.getBProgram(b_program.id); // TODO [permission]: Project.read_permission
                            }))
                                .then((blockoPrograms: IBProgram[]) => {
                                    if (blockoPrograms.find((blockoProgram: IBProgram) => blockoProgram.name === control.value)) {
                                        resolve({'blockoNameTaken': true}); // invalid
                                    } else {
                                        resolve(null); // valid
                                    }
                                });
                        })
                        .catch(() => {
                            resolve({'blockoNameTaken': true}); // invalid
                        });
                });
            });
        }
    */

    public static condition(conditionCallback: (value: string) => boolean, validator: AsyncValidatorFn) {
        return (control: AbstractControl) => {
            return new Promise<any>((resolve, reject) => {
                if (conditionCallback(control.value)) {

                    let validation = validator(control);

                    if (validation instanceof Promise) {
                        validation
                            .then((out: any) => {
                                resolve(out);
                            })
                            .catch((out: any) => {
                                reject(out);
                            });
                    }
                } else {
                    resolve(null); // valid
                }

            });
        };
    }

}
