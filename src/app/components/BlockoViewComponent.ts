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
import { FlashMessageError, NotificationService } from '../services/NotificationService';


@Component({
    selector: 'bk-blocko-view',
    template: `
        <div [class.blocko-single-view]="singleBlockView">
            <div #field class="blocko-view"></div>
        </div>
    `
})
export class BlockoViewComponent implements AfterViewInit, OnChanges, OnDestroy {

    @Input()
    id: string = '';

    @Input()
    full_page: boolean = false;

    @Input()
    square_size: number = 200;

    @Input()
    singleBlockView: boolean = false;

    @Input()
    bindInterfaceEnabled: boolean = false;

    @Input()
    disableExecution: boolean = false;

    @Input()
    readonly: boolean = false;

    @Input()
    showBlockNames: boolean = true;

    @Input()
    safeRun: boolean = false;

    @Input()
    spy: string;

    @Input()
    tags: string[] = null;

    @Input()
    scale: number = 1;

    fullScreen: boolean = false;

    @Output()
    onError: EventEmitter<{ block: BlockoCore.Block, error: any }> = new EventEmitter<{ block: BlockoCore.Block, error: any }>();

    @Output()
    onChange: EventEmitter<{}> = new EventEmitter<{}>();

    @Output()
    onLog: EventEmitter<{ block: BlockoCore.Block, type: string, message: string }> = new EventEmitter<{ block: BlockoCore.Block, type: string, message: string }>();

    protected blocko: BlockoPaperRenderer.Controller;

    @ViewChild('field')
    field: ElementRef;

    constructor(protected modalService: ModalService, protected zone: NgZone, protected backendService: TyrionBackendService, protected translationService: TranslationService, protected notificationService: NotificationService,  ) {
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

    onFullscreenClick(): void {
        this.fullScreen = !this.fullScreen;
    }

    ngAfterViewInit(): void {
        this.zone.runOutsideAngular(() => {

            this.blocko = new BlockoPaperRenderer.Controller({
                editorElement: this.field.nativeElement,
                singleBlockView: this.singleBlockView,
                readonly: this.readonly,
                bindHardwareEnabled: this.bindInterfaceEnabled
            });
            this.blocko.registerOpenConfigCallback((block) => {
                this.zone.run(() => {
                    if (block.blockId) {
                        this.backendService.blockGet(block.blockId)
                            .then((b: IBlock) => {
                                this.modalService.showModal(new ModalsBlockoConfigPropertiesModel(block, b.versions, this.blockChangeVersion));
                            })
                            .catch((error) => {
                                this.notificationService.addFlashMessage(new FlashMessageError(this.translationService.translate('flash_cannot_load_versions', this)));
                            });
                    } else {
                        this.modalService.showModal(new ModalsBlockoConfigPropertiesModel(block));
                    }
                });

            });
            this.blocko.registerOpenCodeEditCallback((block) => {
                this.zone.run(() => {
                    this.modalService.showModal(new ModalsBlockoBlockCodeEditorModel(block));
                });
            });
            this.blocko.registerAnyChangeCallback(() => {
                this.onChange.emit({});
            });

            this.blocko.showBlockNames = this.showBlockNames;

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

    getCoreBlock(version: IBlockVersion|string, block?: IBlock): BlockoCore.Block {
        if (typeof version === 'string') {
            return this.getStaticBlock(version);
        } else {
            return this.getTSBlock(version, block);
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

    getTSBlock(version: IBlockVersion, block?: IBlock) {
        let b: BlockoBasicBlocks.TSBlock = null;
        this.zone.runOutsideAngular(() => {
            const json = JSON.parse(version.design_json);

            json['version_id'] = version.id;
            json['block_id'] = block.id;

            b = new BlockoBasicBlocks.TSBlock(null, version.logic_json, JSON.stringify(json));
        });
        this.onChange.emit({});
        return b;
    }

    centerView() {
        this.zone.runOutsideAngular(() => {
            this.blocko.centerView();
        });
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

    setSingleBlock(logic: string, design: string): BlockoBasicBlocks.TSBlock {
        let tsBlock: BlockoBasicBlocks.TSBlock;
        this.zone.runOutsideAngular(() => {
            tsBlock = new BlockoBasicBlocks.TSBlock(null, logic, design);
            this.blocko.setBlockView(tsBlock);
        });
        return tsBlock;
    }

    setSingleInterface(iface: Blocks.BlockoTargetInterface) {
        this.zone.runOutsideAngular(() => {
            this.blocko.setBlockView(iface);
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
                block.versionId = version_id;
                block.setCode(versionObject.logic_json);
            });
        /*.catch((reason) => {
            console.log("fail loading blocko version", reason);
        });*/
    }

    registerBlockRemovedCallback(callback: (block: BlockoCore.Block) => void): void {
        this.blocko.core.registerBlockRemovedCallback(callback);
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

    registerChangeGridCallback(callback: (iface: Blocks.BlockoTargetInterface, callback: (iface: Blocks.BlockoTargetInterface) => void) => void): void {
        this.blocko.registerChangeGridCallback(callback);
    }

    registerChangeHardwareCallback(callback: (iface: Blocks.BlockoTargetInterface, callback: (iface: Blocks.BlockoTargetInterface) => void) => void): void {
        this.blocko.registerChangeHardwareCallback(callback);
    }

    registerBindInterfaceCallback(callback: (callback: (targetId: string, group?: boolean) => BlockoCore.BoundInterface) => void): void {
        this.blocko.registerBindInterfaceCallback(callback);
    }
}
