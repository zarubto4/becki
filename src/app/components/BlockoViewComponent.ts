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
import { IBlock, IBlockVersion } from '../backend/TyrionAPI';
import { TranslationService } from '../services/TranslationService';
import { TyrionApiBackend } from '../backend/BeckiBackend';


@Component({
    selector: 'bk-blocko-view',
    templateUrl: './BlockoViewComponent.html'
})
export class BlockoViewComponent implements AfterViewInit, OnChanges, OnDestroy {

    @Input()
    id: string = '';

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

    protected blockoController: BlockoCore.Controller;

    protected blockoRenderer: BlockoPaperRenderer.RendererController;

    @ViewChild('field')
    field: ElementRef;

    groupRemovedCallback: (boundInterface: BlockoCore.BoundInterface) => void;

    constructor(protected modalService: ModalService, protected zone: NgZone, protected backendService: TyrionBackendService, private translationService: TranslationService) {
        this.zone.runOutsideAngular(() => {

            this.blockoRenderer = new BlockoPaperRenderer.RendererController();
            this.blockoRenderer.registerOpenConfigCallback((block) => {
                let versions: IBlockVersion[] =  null;

                // TODO Tady evidentně něco chybí! ?? Odstranil jsem jen Groupy ale nezdá se mi to

                this.zone.run(() => {
                    this.modalService.showModal(new ModalsBlockoConfigPropertiesModel(block, versions, this.blockChangeVersion));
                });
            });
            this.blockoRenderer.registerOpenCodeEditCallback((block) => {
                this.zone.run(() => {
                    this.modalService.showModal(new ModalsBlockoBlockCodeEditorModel(block));
                });
            });
            this.blockoRenderer.anyChangeCallback = () => {
                this.onChange.emit({});
            };

            this.blockoRenderer.showBlockNames = this.showBlockNames;
            this.blockoRenderer.simpleMode = this.simpleMode;
            this.blockoRenderer.canConfigInReadonly = this.canConfig;
            this.blockoRenderer.autosize = this.autosize;

            this.blockoController = new BlockoCore.Controller();

            if (this.disableExecution) {
                this.blockoController.configuration.asyncEventsEnabled = false;
                this.blockoController.configuration.inputEnabled = false;
                this.blockoController.configuration.outputEnabled = true;
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

            this.blockoController.registerService(new Blocks.FetchService());
            this.blockoController.registerService(new Blocks.XmlApiService());
            this.blockoController.registerService(new Blocks.RestApiService());
            this.blockoController.registerService(new Blocks.CronService());

            /*
             *
             *  Sets new configuration for all services
             *
             */
            this.blockoController.servicesHandler.configuration = serviceConfiguration;


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
                    this.onError.emit({ block: block, error: error });
                });
            });
            this.blockoController.registerLogCallback((block: BlockoCore.Block, type: string, message: string) => {
                this.zone.run(() => {
                    this.onLog.emit({ block: block, type: type, message: message });
                });
            });
            this.blockoController.registerInterfaceBoundCallback((boundInterface: BlockoCore.BoundInterface) => {
                if (this.groupRemovedCallback) {
                    this.groupRemovedCallback(boundInterface);
                }
            });
            this.blockoController.registerBlocks(BlockoBasicBlocks.Manager.getAllBlocks());

        });
    }

    public get serviceHandler(): Blocks.ServicesHandler {
        return this.zone.runOutsideAngular(() => {
            return this.blockoController.servicesHandler;
        });
    }

    translate(key: string, ...args: any[]): string {
        return this.translationService.translate(key, this, null, args);
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.zone.runOutsideAngular(() => {

            let disableExecution = changes['disableExecution'];
            if (disableExecution) {
                if (!disableExecution.isFirstChange()) {
                    throw new Error(this.translate('error_execution_cant_change'));
                }

                if (disableExecution.currentValue) {
                    this.blockoController.configuration.asyncEventsEnabled = false;
                    this.blockoController.configuration.inputEnabled = false;
                    this.blockoController.configuration.outputEnabled = true;
                }
            }

            let readonly = changes['readonly'];
            if (readonly) {
                if (!readonly.isFirstChange()) {
                    throw new Error(this.translate('error_cant_change_readability'));
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
                    throw new Error(this.translate('error_configuration_cant_change'));
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

            let scale = changes['scale'];
            if (scale) {
                this.blockoRenderer.scale = scale.currentValue;
            }

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
                throw new Error(this.translate('error_read_only'));
            }

            let bc: BlockoCore.BlockClass = this.blockoController.getBlockClassByVisualType(blockName);
            if (!bc) {
                throw new Error(this.translate('error_block_not_found', blockName));
            }

            b = new bc(this.blockoController.getFreeBlockId());
            b.x = Math.round(x / 15) * 15; // TODO: move this to blocko
            b.y = Math.round(y / 15) * 15;
            this.blockoController.addBlock(b);
        });
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
                json['type_of_block'] = typeOfBlock;

                if (version) {
                    json['block_version'] = version;
                }

                designJson = JSON.stringify(json);
            }

            b = new BlockoBasicBlocks.TSBlock(this.blockoController.getFreeBlockId(), '', designJson);
            b.x = Math.round(x / 22) * 22; // TODO: move this to blocko
            b.y = Math.round(y / 22) * 22;
            this.blockoController.addBlock(b);
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
            b = new cls(this.blockoController.getFreeBlockId());
            this.blockoController.addBlock(b);
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

    addInterface(iface: BlockoTargetInterface): void {
        this.zone.runOutsideAngular(() => {
            this.blockoController.addInterface(iface);
        });
    }

    getBindings(): Array<BlockoCore.BoundInterface> {
        return this.blockoController.getBindings();
    }

    isDeployable() {
        return this.blockoController.isDeployable();
    }

    getBlockoController(): BlockoCore.Controller {
        return this.blockoController;
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

    registerInterfaceBoundCallback(callback: (boundInterface: BlockoCore.BoundInterface) => void) {
        this.groupRemovedCallback = callback;
    }
}
