/**
 * Created by davidhradek on 08.08.16.
 */

import {EventEmitter, Injectable, NgZone} from "@angular/core";

export abstract class ModalModel {
    modalWide:boolean = false;
}

@Injectable()
export class ModalService {

    // this is needed for animations
    modalDisplay:boolean = false;
    modalIn:boolean = false;

    private animationTimeout:any = null;

    private modalModel:ModalModel;
    private modalClosed:EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(protected ngZone:NgZone) {
        console.log("ModalService init");
    }

    getModalType():string {
        if (this.modalModel) {
            return (<any>this.modalModel.constructor).name; // Maybe this can be do better
        }
        return null;
    }

    onModalCloseClick(result:boolean):void {
        this.closeModal(result);
    }

    showModal(modalModel:ModalModel):Promise<boolean> {
        if (this.modalModel) {
            throw "only one modal supported yet";
        }
        this.modalModel = modalModel;

        clearTimeout(this.animationTimeout);
        this.modalDisplay = true;
        this.modalIn = false;
        this.animationTimeout = setTimeout(() => {
            this.modalIn=true;
            this.ngZone.run(()=>{}); // this is needed to reload state of modal when call from blocko ... I don't know why...
        }, 5);

        this.ngZone.run(()=>{}); // this is needed to reload state of modal when call from blocko ... I don't know why...

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