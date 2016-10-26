/**
 * Created by davidhradek on 08.08.16.
 */

import {EventEmitter, Injectable, NgZone} from "@angular/core";

export abstract class ModalModel {
    modalWide:boolean = false;
}

export class ModalWrapper {

    // this is needed for animations
    modalDisplay:boolean = false;
    modalIn:boolean = false;

    private animationTimeout:any = null;

    public modalClosed:EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor (public modalModel:ModalModel) {
    }

    getModalType():string {
        if (this.modalModel) {
            return (<any>this.modalModel.constructor).name; // Maybe this can be do better
        }
        return null;
    }

    showModal(ngZone:NgZone):Promise<boolean> {
        clearTimeout(this.animationTimeout);
        this.modalDisplay = true;
        this.modalIn = false;
        this.animationTimeout = setTimeout(() => {
            this.modalIn=true;
            ngZone.run(()=>{}); // this is needed to reload state of modal when call from blocko ... I don't know why...
        }, 5);

        ngZone.run(()=>{}); // this is needed to reload state of modal when call from blocko ... I don't know why...

        return new Promise(resolve => this.modalClosed.subscribe(resolve));
    }

    closeModal(result:boolean):void {
        clearTimeout(this.animationTimeout);
        this.modalDisplay = true;
        this.modalIn = false;
        this.animationTimeout = setTimeout(() => this.modalDisplay=false, 250);

        this.modalModel = null;
        this.modalClosed.emit(result);
    }

}

@Injectable()
export class ModalService {

    private modalWrappers:ModalWrapper[] = [];

    constructor(protected ngZone:NgZone) {
        console.log("ModalService init");
    }

    showModal(modalModel:ModalModel):Promise<boolean> {
        if (!modalModel) {
            throw new Error("Missing modalModel");
        }
        var wrapper = this.modalWrappers.find((mw) => mw.modalModel == modalModel);
        if (wrapper) {
            throw new Error("This modalModel instanace is already open");
        }
        var wrapper = new ModalWrapper(modalModel);
        this.modalWrappers.push(wrapper);
        return wrapper.showModal(this.ngZone);
    }

    closeModal(modalModel:ModalModel, result:boolean = false):void {
        var wrapper = this.modalWrappers.find((mw) => mw.modalModel == modalModel);
        if (wrapper) {
            wrapper.closeModal(result);
            var i = this.modalWrappers.indexOf(wrapper);
            if (i > -1) {
                this.modalWrappers.splice(i, 1);
            }
        }
    }

}