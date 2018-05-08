/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */


import { BlockoCore, BlockoPaperRenderer, BlockoBasicBlocks, BlockoTargetInterface, Blocks } from 'blocko';
import { Component, AfterViewInit, OnChanges, OnDestroy, Input, ViewChild, ElementRef,
    SimpleChanges, Output, EventEmitter, NgZone } from '@angular/core';
import { ModalService } from '../services/ModalService';
import { TyrionBackendService } from '../services/BackendService';
import { ModalsBlockoConfigPropertiesModel } from '../modals/blocko-config-properties';
import { ModalsBlockoBlockCodeEditorModel } from '../modals/blocko-block-code-editor';
import { IBlockVersion } from '../backend/TyrionAPI';
import { TranslationService } from '../services/TranslationService';
import { TyrionApiBackend } from '../backend/BeckiBackend';


@Component({
    selector: 'bk-blocko-view',
    template: `
        <div #field class="blocko-view"></div>
    `
})
export class BlockoViewComponent implements AfterViewInit, OnChanges, OnDestroy {

    @Input()
    id: string = '';

    @Input()
    singleBlockView: boolean = false;

    @Input()
    disableExecution: boolean = false;

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

    @Input()
    tags: string[] = null;

    @Input()
    scale: number = 1;

    @Output()
    onError: EventEmitter<{ block: BlockoCore.Block, error: any }> = new EventEmitter<{ block: BlockoCore.Block, error: any }>();

    @Output()
    onChange: EventEmitter<{}> = new EventEmitter<{}>();

    @Output()
    onLog: EventEmitter<{ block: BlockoCore.Block, type: string, message: string }> = new EventEmitter<{ block: BlockoCore.Block, type: string, message: string }>();

    protected blocko: BlockoPaperRenderer.Controller;

    @ViewChild('field')
    field: ElementRef;

    groupRemovedCallback: (boundInterface: BlockoCore.BoundInterface) => void;

    constructor(protected modalService: ModalService, protected zone: NgZone, protected backendService: TyrionBackendService, private translationService: TranslationService) {
    }

    public get serviceHandler(): Blocks.ServicesHandler {
        return this.zone.runOutsideAngular(() => {
            return this.blocko.core.servicesHandler;
        });
    }

    translate(key: string, ...args: any[]): string {
        return this.translationService.translate(key, this, null, args);
    }

    ngOnChanges(changes: SimpleChanges): void {
        /*this.zone.runOutsideAngular(() => {

            let canConfig = changes['canConfig'];
            if (canConfig) {
                if (!canConfig.isFirstChange()) {
                    throw new Error(this.translate('error_configuration_cant_change'));
                }
                this.blocko.canConfigInReadonly = canConfig.currentValue;
            }

            let showBlockNames = changes['showBlockNames'];
            if (showBlockNames) {
                this.blocko.showBlockNames = showBlockNames.currentValue;
            }

            let safeRun = changes['safeRun'];
            if (safeRun) {
                this.blockoController.safeRun = safeRun.currentValue;
            }
        });*/
    }

    ngAfterViewInit(): void {
        this.zone.runOutsideAngular(() => {

            this.blocko = new BlockoPaperRenderer.Controller({
                editorElement: this.field.nativeElement,
                singleBlockView: this.singleBlockView
            });
            this.blocko.registerOpenConfigCallback((block) => {
                let versions: IBlockVersion[] =  null;

                // TODO Tady evidentně něco chybí! ?? Odstranil jsem jen Groupy ale nezdá se mi to

                this.zone.run(() => {
                    this.modalService.showModal(new ModalsBlockoConfigPropertiesModel(block, versions, this.blockChangeVersion));
                });

            });
            this.blocko.registerOpenCodeEditCallback((block) => {
                this.zone.run(() => {
                    this.modalService.showModal(new ModalsBlockoBlockCodeEditorModel(block));
                });
            });
            this.blocko.anyChangeCallback = () => {
                this.onChange.emit({});
            };

            this.blocko.showBlockNames = this.showBlockNames;
            this.blocko.simpleMode = this.simpleMode;
            this.blocko.canConfigInReadonly = this.canConfig;

            if (this.disableExecution) {
                this.blocko.core.configuration.asyncEventsEnabled = false;
                this.blocko.core.configuration.inputEnabled = false;
                this.blocko.core.configuration.outputEnabled = true;
            }

            /*
             *
             * TODO !!!
             *
             * Set url of proxy server
             * Set auth token and instance id? (something like testing enviroment id...)
             */
            const serviceConfiguration = {
                fetchParameters: {
                    auth_token: TyrionApiBackend.getToken()
                },
                proxyServerUrl: this.backendService.requestProxyServerUrl
            };

            this.blocko.core.registerService(new Blocks.FetchService());
            this.blocko.core.registerService(new Blocks.XmlApiService());
            this.blocko.core.registerService(new Blocks.RestApiService());
            this.blocko.core.registerService(new Blocks.CronService());
            this.blocko.core.registerService(new Blocks.DatabaseService());

            /*
             *
             *  Sets new configuration for all services
             *
             */
            this.blocko.core.servicesHandler.configuration = serviceConfiguration;
            this.blocko.core.safeRun = this.safeRun;
            /*this.blockoController.registerDataChangedCallback(() => {
             // TODO: why? [DH]
             // modalComponent.closeModal(false);
             // console.log("CHANGED!!!!!!");
             // this.dataChange.emit(this.blockoController.getDataJson());
             });*/
            this.blocko.core.registerErrorCallback((block: BlockoCore.Block, error: any) => {
                this.zone.run(() => {
                    this.onError.emit({ block: block, error: error });
                });
            });
            this.blocko.core.registerLogCallback((block: BlockoCore.Block, type: string, message: string) => {
                this.zone.run(() => {
                    this.onLog.emit({ block: block, type: type, message: message });
                });
            });
            this.blocko.core.registerInterfaceBoundCallback((boundInterface: BlockoCore.BoundInterface) => {
                if (this.groupRemovedCallback) {
                    this.groupRemovedCallback(boundInterface);
                }
            });
            this.blocko.core.registerBlocks(BlockoBasicBlocks.Manager.getAllBlocks());

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
            this.blocko.core.removeAllBlocks();
        });
    }

    setSingleBlock() {
        // this.blocko.setBlockView()
    }

    getCoreBlock(block: IBlockVersion|string): BlockoCore.Block {
        if (typeof block === 'string') {
            return this.getStaticBlock(block);
        } else {
            return this.getTSBlock(block);
        }
    }

    getStaticBlock(blockName: string): BlockoCore.Block {
        let b: BlockoCore.Block = null;
        this.zone.runOutsideAngular(() => {

            if (this.readonly) {
                throw new Error(this.translate('error_read_only'));
            }

            let bc: BlockoCore.BlockClass = this.blocko.core.getBlockClassByVisualType(blockName);
            if (!bc) {
                throw new Error(this.translate('error_block_not_found', blockName));
            }

            b = new bc(null);
        });
        return b;
    }

    getTSBlock(block: IBlockVersion) {
        let b: BlockoBasicBlocks.TSBlock = null;
        this.zone.runOutsideAngular(() => {
            const json = JSON.parse(block.design_json);

            json['block_version'] = block.id;

            b = new BlockoBasicBlocks.TSBlock(null, block.logic_json, JSON.stringify(json));
        });
        this.onChange.emit({});
        return b;
    }

    addTsBlock(tsCode: string, designJson: string, x: number = 0, y: number = 0, typeOfBlock: string = null, version: string = null): BlockoBasicBlocks.TSBlock {
        if (this.readonly) {
            throw new Error(this.translate('error_read_only'));
        }
        return this.addTsBlockWithoutReadonlyCheck(tsCode, designJson, x, y, typeOfBlock, version);
    }

    addTsBlockWithoutReadonlyCheck(tsCode: string, designJson: string, x: number = 0, y: number = 0, typeOfBlock: string = null, version: string = null): BlockoBasicBlocks.TSBlock {
        let b: BlockoBasicBlocks.TSBlock = null;
        this.zone.runOutsideAngular(() => {

            if (typeOfBlock) {
                const json = JSON.parse(designJson);

                if (version) {
                    json['block_version'] = version;
                }

                designJson = JSON.stringify(json);
            }

            b = new BlockoBasicBlocks.TSBlock(this.blocko.core.getFreeBlockId(), '', designJson);
            b.x = Math.round(x / 22) * 22; // TODO: move this to blocko
            b.y = Math.round(y / 22) * 22;
            this.blocko.core.addBlock(b);
            b.setCode(tsCode);
        });
        this.onChange.emit({});
        return b;
    }

    addBlock(cls: BlockoCore.BlockClass): BlockoCore.Block {
        let b: BlockoCore.Block = null;
        this.zone.runOutsideAngular(() => {
            if (this.readonly) {
                throw new Error(this.translate('error_read_only'));
            }
            b = new cls(this.blocko.core.getFreeBlockId());
            this.blocko.core.addBlock(b);
        });
        return b;
    }

    removeAllBlocks(): void {
        this.zone.runOutsideAngular(() => {
            if (this.readonly) {
                throw new Error(this.translate('error_read_only'));
            }
            this.removeAllBlocksWithoutReadonlyCheck();
        });
    }

    removeAllBlocksWithoutReadonlyCheck(): void {
        this.zone.runOutsideAngular(() => {
            this.blocko.core.removeAllBlocks();
        });
    }

    setDataJson(json: string): string {
        let s: string = null;
        this.zone.runOutsideAngular(() => {
            s = this.blocko.core.setDataJson(json);
        });
        return s;
    }

    getDataJson(): string {
        let s: string = null;
        this.zone.runOutsideAngular(() => {
            s = this.blocko.core.getDataJson();
        });
        return s;
    }

    addInterface(iface: BlockoTargetInterface): void {
        this.zone.runOutsideAngular(() => {
            this.blocko.core.addInterface(iface);
        });
    }

    getBindings(): Array<BlockoCore.BoundInterface> {
        return this.blocko.core.getBindings();
    }

    isDeployable() {
        return this.blocko.core.isDeployable();
    }

    getBlockoController(): BlockoCore.Controller {
        return this.blocko.core;
    }

    blockChangeVersion = (block: Blocks.TSBlock, version_id: string) => {
        this.backendService.blockVersionGet(version_id)
            .then((versionObject) => {
                block.blockVersion = version_id;
                block.setCode(versionObject.logic_json);
            });
        /*.catch((reason) => {
            console.log("fail loading blocko version", reason);
        });*/
    }

    registerAddBlockCallback(callback: (callback: (block: BlockoCore.Block) => void) => void): void {
        this.blocko.registerAddBlockCallback(callback);
    }

    registerAddGridCallback(callback: (callback: (iface: Blocks.BlockoTargetInterface) => void) => void): void {
        this.blocko.registerAddGridCallback(callback);
    }

    registerAddHardwareCallback(callback: (callback: (iface: Blocks.BlockoTargetInterface) => void) => void): void {
        this.blocko.registerAddHardwareCallback(callback);
    }
}
