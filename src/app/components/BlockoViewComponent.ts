/**
 * Created by davidhradek on 14.09.16.
 */
/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import { BlockoCore, BlockoPaperRenderer, BlockoBasicBlocks, BlockoTargetInterface, Blocks } from 'blocko';
import {
    Component,
    AfterViewInit,
    OnChanges,
    OnDestroy,
    Input,
    ViewChild,
    ElementRef,
    SimpleChanges, Output, EventEmitter, NgZone
} from '@angular/core';
import { ModalService } from '../services/ModalService';
import { ModalsBlockoConfigPropertiesModel } from '../modals/blocko-config-properties';
import { ModalsBlockoBlockCodeEditorModel } from '../modals/blocko-block-code-editor';

@Component({
    selector: 'bk-blocko-view',
    templateUrl: './BlockoViewComponent.html'
})
export class BlockoViewComponent implements AfterViewInit, OnChanges, OnDestroy {

    @Input()
    readonly: boolean = false;

    @Input()
    canConfig: boolean = true;

    @Input()
    simpleMode: boolean = false;

    @Input()
    showBlockNames: boolean = true;

    @Input()
    safeRun: boolean = false;

    @Input()
    spy: string;

    @Input()
    autosize: boolean = false;

    @Output()
    onError: EventEmitter<{block: BlockoCore.Block, error: any}> = new EventEmitter<{block: BlockoCore.Block, error: any}>();

    @Output()
    onLog: EventEmitter<{block: BlockoCore.Block, type: string, message: string}> = new EventEmitter<{block: BlockoCore.Block, type: string, message: string}>();

    protected blockoController: BlockoCore.Controller;

    protected blockoRenderer: BlockoPaperRenderer.RendererController;

    @ViewChild('field')
    field: ElementRef;

    constructor(protected modalService: ModalService, protected zone: NgZone) {
        this.zone.runOutsideAngular(() => {

            this.blockoRenderer = new BlockoPaperRenderer.RendererController();
            this.blockoRenderer.registerOpenConfigCallback((block) => {
                this.zone.run(() => {
                    this.modalService.showModal(new ModalsBlockoConfigPropertiesModel(block));
                });
            });
            this.blockoRenderer.registerOpenCodeEditCallback((block) => {
                this.zone.run(() => {
                    this.modalService.showModal(new ModalsBlockoBlockCodeEditorModel(block));
                });
            });

            this.blockoRenderer.showBlockNames = this.showBlockNames;
            this.blockoRenderer.simpleMode = this.simpleMode;
            this.blockoRenderer.canConfigInReadonly = true;
            this.blockoRenderer.autosize = this.autosize;

            this.blockoController = new BlockoCore.Controller();

            this.blockoController.registerService(new Blocks.FetchService());
            this.blockoController.registerService(new Blocks.XmlApiService());
            this.blockoController.registerService(new Blocks.RestApiService());

            this.blockoController.safeRun = this.safeRun;
            this.blockoController.rendererFactory = this.blockoRenderer;
            /*this.blockoController.registerDataChangedCallback(() => {
             // TODO: why? [DH]
             // modalComponent.closeModal(false);
             // console.log("CHANGED!!!!!!");
             // this.dataChange.emit(this.blockoController.getDataJson());
             });*/
            this.blockoController.registerErrorCallback((block: BlockoCore.Block, error: any) => {
                this.zone.run(() => {
                    this.onError.emit({block: block, error: error});
                });
            });
            this.blockoController.registerLogCallback((block: BlockoCore.Block, type: string, message: string) => {
                this.zone.run(() => {
                    this.onLog.emit({block: block, type: type, message: message});
                });
            });
            this.blockoController.registerBlocks(BlockoBasicBlocks.Manager.getAllBlocks());

        });
    }

    public get serviceHandler(): Blocks.ServicesHandler {
        let sh: Blocks.ServicesHandler = null;
        this.zone.runOutsideAngular(() => {
            sh = this.blockoController.servicesHandler;
        });
        return sh;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.zone.runOutsideAngular(() => {

            let readonly = changes['readonly'];
            if (readonly) {
                if (!readonly.isFirstChange()) {
                    throw new Error('The readability cannot be changed.');
                }
                this.blockoRenderer.readonly = readonly.currentValue;
            }

            let simpleMode = changes['simpleMode'];
            if (simpleMode) {
                this.blockoRenderer.simpleMode = simpleMode.currentValue;
            }

            let canConfig = changes['canConfig'];
            if (canConfig) {
                if (!canConfig.isFirstChange()) {
                    throw new Error('Configuration enabled cannot be changed.');
                }
                this.blockoRenderer.canConfigInReadonly = canConfig.currentValue;
            }

            let showBlockNames = changes['showBlockNames'];
            if (showBlockNames) {
                this.blockoRenderer.showBlockNames = showBlockNames.currentValue;
            }

            let safeRun = changes['safeRun'];
            if (safeRun) {
                this.blockoController.safeRun = safeRun.currentValue;
            }
            // TODO:
            /*
            let spy = changes["spy"];
            if (spy && !spy.isFirstChange()) {
                if (spy.previousValue) {
                    this.unsubscribeSpy(spy.previousValue);
                }
                if (spy.currentValue) {
                    this.subscribeSpy(spy.currentValue);
                }
            }
            */

        });
    }

    ngAfterViewInit(): void {
        this.zone.runOutsideAngular(() => {
            // TODO:
            if (this.canConfig) {
                new BlockoBasicBlocks.ExecutionController(this.blockoController);
            }
            // TODO:
            /*
            if (this.spy) {
                this.subscribeSpy(this.spy);
            }
            */
            this.blockoRenderer.setEditorElement(this.field.nativeElement);
        });
    }

    ngOnDestroy(): void {
        // TODO:
        /*
        if (this.spy) {
            this.unsubscribeSpy(this.spy);
        }
        */
        this.zone.runOutsideAngular(() => {
            this.blockoController.removeAllBlocks();
        });
    }

    addStaticBlock(blockName: string, x: number = 0, y: number = 0): BlockoCore.Block {
        let b: BlockoCore.Block = null;
        this.zone.runOutsideAngular(() => {

            if (this.readonly) {
                throw new Error('read only');
            }

            let bc: BlockoCore.BlockClass = this.blockoController.getBlockClassByVisutalType(blockName);
            if (!bc) {
                throw new Error('block ' + blockName + ' not found');
            }

            b = new bc(this.blockoController.getFreeBlockId());
            b.x = Math.round(x / 15) * 15; // TODO: move this to blocko
            b.y = Math.round(y / 15) * 15;
            this.blockoController.addBlock(b);
        });
        return b;
    }

    addTsBlock(tsCode: string, designJson: string, x: number = 0, y: number = 0): BlockoBasicBlocks.TSBlock {
        if (this.readonly) {
            throw new Error('read only');
        }
        return this.addTsBlockWithoutReadonlyCheck(tsCode, designJson, x, y);
    }

    addTsBlockWithoutReadonlyCheck(tsCode: string, designJson: string, x: number = 0, y: number = 0): BlockoBasicBlocks.TSBlock {
        let b: BlockoBasicBlocks.TSBlock = null;
        this.zone.runOutsideAngular(() => {
            b = new BlockoBasicBlocks.TSBlock(this.blockoController.getFreeBlockId(), '', designJson);
            b.x = Math.round(x / 22) * 22; // TODO: move this to blocko
            b.y = Math.round(y / 22) * 22;
            this.blockoController.addBlock(b);
            b.setCode(tsCode);
        });
        return b;
    }

    addBlock(cls: BlockoCore.BlockClass): BlockoCore.Block {
        let b: BlockoCore.Block = null;
        this.zone.runOutsideAngular(() => {
            if (this.readonly) {
                throw new Error('read only');
            }
            b = new cls(this.blockoController.getFreeBlockId());
            this.blockoController.addBlock(b);
        });
        return b;
    }

    removeAllBlocks(): void {
        this.zone.runOutsideAngular(() => {
            if (this.readonly) {
                throw new Error('read only');
            }
            this.removeAllBlocksWithoutReadonlyCheck();
        });
    }

    removeAllBlocksWithoutReadonlyCheck(): void {
        this.zone.runOutsideAngular(() => {
            this.blockoController.removeAllBlocks();
        });
    }

    setDataJson(json: string): string {
        let s: string = null;
        this.zone.runOutsideAngular(() => {
            s = this.blockoController.setDataJson(json);
        });
        return s;
    }

    getDataJson(): string {
        let s: string = null;
        this.zone.runOutsideAngular(() => {
            s = this.blockoController.getDataJson();
        });
        return s;
    }

    setInterfaces(ifaces: BlockoTargetInterface[]): void {
        this.zone.runOutsideAngular(() => {
            this.blockoController.setInterfaces(ifaces);
        });
    }

    getBlockoController(): BlockoCore.Controller {
        return this.blockoController;
    }
}
