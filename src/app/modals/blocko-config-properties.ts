/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import { Input, Output, EventEmitter, Component, OnInit, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalModel } from '../services/ModalService';
import { Core, Blocks } from 'blocko';
import { Types } from 'common-lib';
import { IBlockVersion } from '../backend/TyrionAPI';

export class ModalsBlockoConfigPropertiesModel extends ModalModel {
    constructor(public block: Core.Block, public versions?: IBlockVersion[], public changeVersionCallback?: ((block: Blocks.TSBlock, versionId: string) => void)) {
        super();
    }
}

@Component({
    selector: 'bk-modals-blocko-config-properties',
    templateUrl: './blocko-config-properties.html'
})
export class ModalsBlockoConfigPropertiesComponent implements OnInit {

    @Input()
    modalModel: ModalsBlockoConfigPropertiesModel;

    @Output()
    modalClose = new EventEmitter<boolean>();

    configProperties: Core.ConfigProperty[];

    description: string = null;

    form: FormGroup;

    formModel: {[key: string]: any} = {};
    formModelVersion: string = null;

    configPropertyType = Types.ConfigPropertyType;
    blockVersions: IBlockVersion[] = [];

    constructor(protected zone: NgZone) {

    }

    ngOnInit() {

        this.configProperties = this.modalModel.block.getConfigProperties();
        this.description = this.modalModel.block.configPropertiesDescription;

        this.configProperties.forEach((cp) => {
            this.formModel[cp.name] = cp.value;
        });

        if (this.modalModel.versions) {
            this.blockVersions = this.modalModel.versions;
        }

        if (this.modalModel.block.codeBlock && (<Blocks.TSBlock>this.modalModel.block).versionId) {
            this.formModelVersion = (<Blocks.TSBlock>this.modalModel.block).versionId;
        }
    }

    onSubmitClick(): void {

        this.zone.runOutsideAngular(() => {
            this.configProperties.forEach((configProperty) => {

                if (configProperty.type === Types.ConfigPropertyType.Integer) {
                    let num = parseInt(this.formModel[configProperty.name], 10);
                    configProperty.value = isNaN(num) ? 0 : num;
                }
                if (configProperty.type === Types.ConfigPropertyType.Float) {
                    let num = parseFloat(this.formModel[configProperty.name]);
                    configProperty.value = isNaN(num) ? 0 : num;
                }
                if (configProperty.type === Types.ConfigPropertyType.String) {
                    configProperty.value = this.formModel[configProperty.name];
                }
                if (configProperty.type === Types.ConfigPropertyType.Boolean) {
                    configProperty.value = !!this.formModel[configProperty.name];
                }

            });

            this.modalModel.block.emitConfigChanged();
        });

        if (this.modalModel.block instanceof Blocks.TSBlock) {
            const tsBlock = <Blocks.TSBlock>this.modalModel.block;
            if (tsBlock.versionId !== this.formModelVersion) {
                if (this.formModelVersion && this.modalModel.changeVersionCallback) {
                    this.modalModel.changeVersionCallback(tsBlock, this.formModelVersion);
                }
            }
        }

        this.modalClose.emit(true);
    }

    onCloseClick(): void {
        this.modalClose.emit(false);
    }

    onCancelClick(): void {
        this.modalClose.emit(false);
    }
}
