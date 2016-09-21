/**
 * Created by davidhradek on 14.09.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import {BlockoCore, BlockoSnapRenderer, BlockoBasicBlocks} from "blocko";
import {
    Component, AfterViewInit, OnChanges, OnDestroy, Input, Output, ViewChild, ElementRef,
    EventEmitter, SimpleChanges
} from "@angular/core";
import {CORE_DIRECTIVES} from "@angular/common";
import {ModalService} from "../services/ModalService";
import {ModalsBlockoJsEditorModel} from "../modals/blocko-js-editor";
import {ModalsBlockoConfigPropertiesModel} from "../modals/blocko-config-properties";
import {BlockoTargetInterface} from "blocko";

@Component({
    selector: "blocko-view",
    templateUrl: "app/components/BlockoView.html",
    directives: [CORE_DIRECTIVES]
})
export class BlockoView implements AfterViewInit, OnChanges, OnDestroy {

    @Input()
    readonly:boolean = false;

    @Input()
    spy:string;

    protected blockoController:BlockoCore.Controller;

    protected blockoRenderer:BlockoSnapRenderer.RendererController;

    @ViewChild("field")
    field:ElementRef;

    constructor(protected modalService:ModalService) {
        this.blockoRenderer = new BlockoSnapRenderer.RendererController();
        this.blockoRenderer.registerOpenConfigCallback((block) => {
            this.modalService.showModal(new ModalsBlockoConfigPropertiesModel(block));
        });
        this.blockoRenderer.registerOpenJsEditCallback((block) => {
            this.modalService.showModal(new ModalsBlockoJsEditorModel(block));
        });

        this.blockoController = new BlockoCore.Controller();
        this.blockoController.rendererFactory = this.blockoRenderer;
        this.blockoController.registerDataChangedCallback(() => {
            //TODO: why? modalComponent.closeModal(false);
            console.log("CHANGED!!!!!!");
            //this.dataChange.emit(this.blockoController.getDataJson());
        });
        this.blockoController.registerBlocks(BlockoBasicBlocks.Manager.getAllBlocks());
    }

    ngOnChanges(changes:SimpleChanges):void {

        let readonly = changes["readonly"];
        if (readonly && !readonly.isFirstChange()) {
            throw new Error("The readability cannot be changed.");
        }
        //TODO:
        /*let spy = changes["spy"];
        if (spy && !spy.isFirstChange()) {
            if (spy.previousValue) {
                this.unsubscribeSpy(spy.previousValue);
            }
            if (spy.currentValue) {
                this.subscribeSpy(spy.currentValue);
            }
        }*/
    }

    ngAfterViewInit():void {
        if (!this.readonly) {
            new BlockoBasicBlocks.ExecutionController(this.blockoController);
        }
        //TODO:
        /*
        if (this.spy) {
            this.subscribeSpy(this.spy);
        }*/
        this.blockoRenderer.setEditorElement(this.field.nativeElement);
    }

    ngOnDestroy():void {
        //TODO:
        /*
        if (this.spy) {
            this.unsubscribeSpy(this.spy);
        }
        */
    }

    addStaticBlock(blockName:string, x:number = 0, y:number = 0):void {

        if (this.readonly) {
            throw new Error("read only");
        }

        var bc:BlockoCore.BlockClass = this.blockoController.getBlockClassByVisutalType(blockName);
        if (!bc) throw new Error("block "+blockName+" not found");

        var b:BlockoCore.Block = new bc(this.blockoController.getFreeBlockId());
        b.x = Math.round(x/10)*10; //TODO: move this to blocko
        b.y = Math.round(y/10)*10;
        this.blockoController.addBlock(b);
    }

    addJsBlock(jsCode:string, x:number = 0, y:number = 0):void {

        if (this.readonly) {
            throw new Error("read only");
        }

        var b = new BlockoBasicBlocks.JSBlock(this.blockoController.getFreeBlockId(), jsCode);
        b.x = Math.round(x/10)*10; //TODO: move this to blocko
        b.y = Math.round(y/10)*10;
        this.blockoController.addBlock(b);
    }


    addBlock(cls:BlockoCore.BlockClass):void {
        if (this.readonly) {
            throw new Error("read only");
        }
        this.blockoController.addBlock(new cls(this.blockoController.getFreeBlockId()));
    }

    removeAllBlocks():void {
        if (this.readonly) {
            throw new Error("read only");
        }
        this.blockoController.removeAllBlocks();
    }

    setDataJson(json:string):string {
        return this.blockoController.setDataJson(json);
    }

    getDataJson():string {
        return this.blockoController.getDataJson();
    }

    setInterfaces(ifaces:BlockoTargetInterface[]):void {
        this.blockoController.setInterfaces(ifaces);
    }
}
