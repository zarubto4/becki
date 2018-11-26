/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { FormControl, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { TyrionBackendService } from '../services/BackendService';
import { IBProgramFilter, IBProgramList, ICProgramList, IGridProjectList, IHardwareList, IProject } from '../backend/TyrionAPI';
import { t } from '@angular/core/src/render3';
import { IResultOK } from '../backend/HomerAPI';

export class AsyncValidatorDebounce {
    _validate: (x: any) => any;

    static debounce(validator: (control: FormControl) => any, db_time = 400) {
        let asyncValidator = new this(validator, db_time);
        return asyncValidator._getValidator();
    }

    constructor(validator: (control: FormControl) => any, db_time = 1000) {

        /**

        let source: any = new Observable((observer: Observer<FormControl>) => {
            this._validate = (control) => observer.next(control);
        });

        source.debounceTime(db_time)
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
        */

        let source: Observable<FormControl> = new Observable((observer: Observer<FormControl>) => {
            this._validate = (control) => observer.next(control);
        });


        source
            .pipe( debounceTime(db_time))
            .pipe( distinctUntilChanged(null, (x: any) => x.control.value))
            .pipe( map((x: any) => {
                return {promise: validator(x.control), resolver: x.promiseResolver};
            }))
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

    public static nameTaken(
        backEnd: TyrionBackendService,
        type: ('Project'|'BProgram'|'BProgramVersion'|'CProgram'|'CProgramVersion'|
            'GridProgram'|'GridProgramVersion'|'GridProject'|'Hardware'|'HardwareGroup'|
            'GSM'|'Role'|'Widget'|'WidgetVersion'|'Block'| 'BlockVersion' |'Instance'|'Snapshot'|'Database'|'CLibrary'|
            'CLibraryVersion'),
        project_id?: string, object_id?: string): AsyncValidatorFn {

        return AsyncValidatorDebounce.debounce((control: FormControl) => {
            return new Promise<any>((resolve) => {

                if (control == null) {
                    resolve();
                }

                backEnd.projectValidObjectUniqueName({
                    name:  control.value,
                    project_id: project_id,
                    object_id: object_id,
                    object_type: type
                }).then((result: IResultOK) => {

                    // console.log('Mám odpověď že jméno zabráno nebylo');
                    resolve();

                }).catch(() => {

                    const key_name: string = type + 'NameTaken';

                    let error: {} = {};
                    error[key_name] = true;


                    console.info('Object: ', error);

                    resolve(error);
                });
            });
        });
    }


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
