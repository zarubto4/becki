/**
 * © 2016 Becki Authors. See the AUTHORS file found in the top-level directory
 * of this distribution.
 */

import moment = require('moment/moment');

import { Component, Input } from '@angular/core';
import { SafeMachineError, TypescriptBuildError, MachineMessage, SafeMachineMessage } from 'script-engine';
import { TranslationService } from '../services/TranslationService';


export interface ConsoleLogItem {
    timestamp: string;
    type: string;
    message: string;
    alias?: string;
    source?: string;
    color?: string;
}

export interface ConsoleSourceColor {
    id: string;
    color: string;
}

export type ConsoleLogType = 'log' | 'error' | 'output' | 'info' | 'warn' | 'debug' | 'trace';

@Component({
    selector: 'bk-console-log',
    /* tslint:disable:max-line-length */
    template: `
<div class="console-log-table-wrapper" [style.min-height]="(startOnMaxHeight?maxHeight:'20px')" [style.max-height]="maxHeight">
    <table class="table table-fixed table-hover table-light">
        <tbody>
            <tr *ngFor="let log of items;" class="console-log-tr">
                <td>
                    <div class="console-log-head">
                        <span class="console-log-timestamp">{{log.timestamp}}&nbsp;</span>
                        <span *ngIf="log.type == 'error'" class="font-red">[Error]</span>
                        <span *ngIf="log.type == 'warn'"  class="font-yellow">[Warn]</span>
                        <span *ngIf="log.type == 'debug'" class="font-purple">[Debug]</span>
                        <span *ngIf="log.type == 'trace'" class="font-grey-salsa">[Trace]</span>
                        <span *ngIf="log.type == 'info'"  class="font-color-byzance-blue">[Info]&nbsp;&nbsp;</span>
                        <span *ngIf="log.type == 'log'"   class="font-grey-salsae">[Info]</span>
                    </div>
                    <div class="console-log-message">
                        
                        <template [ngIf]="log.source || log.alias">
                            <span [style.color]="sourceColor[log.source] ? sourceColor[log.source].color : ''" class="bold">{{log.alias?log.alias:log.source}}</span>
                            <i class="fa fa-fw fa-angle-right"></i>
                        </template>
                        
                        <span 
                            [class.font-red]="log.type == 'error'"
                            [class.font-yellow]="log.type == 'warn'"
                            [class.font-grey-salsa]="log.type == 'debug'"
                            [class.font-grey-salsa]="log.type == 'trace'"
                            [class.font-grey-salsa]="log.type == 'info'"
                            [class.font-grey-salsa]="log.type == 'log'"
                            [innerHTML]="log.message"></span>
                    </div>
                </td>
            </tr>
            <tr *ngIf="items.length == 0">
                <td class="text-center">
                    <i>{{'label_console_is_empty'|bkTranslate:this}}</i>
                </td>
            </tr>
        </tbody>
    </table>
</div>
`
    /* tslint:enable */
})
export class ConsoleLogComponent {

    @Input()
    maxHeight: string = null;

    @Input()
    startOnMaxHeight: boolean = true;

    items: ConsoleLogItem[] = [];

    sourceColor: {[source_id: string]: {
        color: string
    }} = {};

    constructor(private translationService: TranslationService) {
    }

    clear() {
        this.items = [];
    }

    translate(key: string, ...args: any[]): string {
        return this.translationService.translate(key, this, null, args);
    }

    set_color(source: string, color: string) {
        // console.log('set_Color: source', source, 'color', color);
        if (!this.sourceColor[source]) {
            this.sourceColor[source] = {
                color: color
            };
        } else {
            this.sourceColor[source].color = color;
        }
    }

    /**
     *
     * @param {ConsoleLogType} type
     * @param {string} message
     * @param {string} source
     * @param {string} alias
     * @param {string} timestamp
     */
    add(type: ConsoleLogType, message: string, source?: string, alias?: string, timestamp?: string) {
        try {
            if (!timestamp) {
                timestamp = moment().format('HH:mm:ss.SSS');
            }
            this.items.unshift({
                timestamp: timestamp,
                type: type,
                message: message.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;'),
                source: source,
                alias: alias
            });
        } catch (exc) {
            console.error('ConsoleLogComponent:: add', exc);
        }
    }

    addFromMessage(message: MachineMessage, source?: string, timestamp?: string) {
        if (!timestamp) {
            timestamp = moment().format('HH:mm:ss.SSS');
        }

        let msg = '<strong>' + message.message + '</strong>';
        let posInfo = '';
        if (message instanceof SafeMachineMessage) {
            if (message.position && message.position.lineA != null) {
                if (message.position.lineA === message.position.lineB) {
                    posInfo = '<br>' + this.translate('label_position_and_line') + ' <strong>'
                        + message.position.lineA
                        + '</strong> ' + this.translate('label_column') + ' <strong>'
                        + message.position.columnA
                        + '</strong> - <strong>'
                        + message.position.columnB
                        + '</strong>';
                } else {
                    posInfo = '<br>+ ' + this.translate('label_position_and_line') + ' + <strong>'
                        + message.position.lineA
                        + '</strong> ' + this.translate('label_column') + ' <strong>'
                        + message.position.columnA
                        + '</strong> - ' + this.translate('label_line') + ' <strong>'
                        + message.position.lineB
                        + '</strong> ' + this.translate('label_column') + ' <strong>'
                        + message.position.columnB
                        + '</strong>';
                }
            }
        }

        this.items.unshift({
            timestamp: timestamp,
            type: 'warn',
            message: msg + posInfo,
            source: source
        });
    }

    addFromError(error: Error, source?: string, timestamp?: string) {
        if (!timestamp) {
            timestamp = moment().format('HH:mm:ss.SSS');
        }
        if (error instanceof SafeMachineError) {
            let msg = '<strong>' + error.message + '</strong>';
            if (typeof error.original === 'object' && error.original instanceof Error) {
                msg = '<strong>' + (<Error>error.original).name + '</strong>: ' + (<Error>error.original).message;
            }

            let posInfo = '';
            if (error.position) {
                if (error.position.lineA === error.position.lineB) {
                    posInfo = '<br>' + this.translate('label_position_and_line') + ' <strong>'
                        + error.position.lineA
                        + '</strong> ' + this.translate('label_column') + ' <strong>'
                        + error.position.columnA
                        + '</strong> - <strong>'
                        + error.position.columnB
                        + '</strong>';
                } else {
                    posInfo = '<br><strong>Position:</strong> line <strong>'
                        + error.position.lineA
                        + '</strong> ' + this.translate('label_column') + ' <strong>'
                        + error.position.columnA
                        + '</strong> - ' + this.translate('label_line') + ' <strong>'
                        + error.position.lineB
                        + '</strong> ' + this.translate('label_column') + ' <strong>'
                        + error.position.columnB
                        + '</strong>';
                }
            }

            /*
            let stackInfo = "";
            if (error.safeMachineStack) {
                console.log(error.safeMachineStack);
                stackInfo = "<br><strong>Stack:</strong> ";
                error.safeMachineStack.forEach((sms) => {
                    stackInfo += "<br>&nbsp;&nbsp;&nbsp;&nbsp;" + sms.deepDir + " " + sms.lineA + ":" + sms.columnA + " - " + sms.lineB + ":" + sms.columnB;
                });
            }
            */

            this.items.unshift({
                timestamp: timestamp,
                type: 'error',
                message: msg + posInfo,
                source: source
            });
        } else if (error instanceof TypescriptBuildError) {
            if (!error.diagnostics) {
                this.items.unshift({
                    timestamp: timestamp,
                    type: 'error',
                    message: '<strong>' + this.translate('label_typescript_error') + '</strong>: ' + (<Error>error).message,
                    source: source
                });
            } else {
                error.diagnostics.forEach((d) => {
                    this.items.unshift({
                        timestamp: timestamp,
                        type: 'error',
                        message: '<strong>' + this.translate('label_typescript_error') + ' #' + d.code + '</strong>: ' + d.messageText,
                        source: source
                    });
                });
            }
        } else if (error instanceof Error) {
            let msg = '<strong>' + (<Error>error).name + '</strong>: ' + (<Error>error).message;
            this.items.unshift({
                timestamp: timestamp,
                type: 'error',
                message: msg,
                source: source
            });
        } else {
            this.items.unshift({
                timestamp: timestamp,
                type: 'error',
                message: '' + error,
                source: source
            });
        }
    }

}
