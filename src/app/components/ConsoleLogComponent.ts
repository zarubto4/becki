/**
 * Created by davidhradek on 18.01.17.
 */

import moment = require('moment/moment');

import { Component, Input } from '@angular/core';
import { SafeMachineError, TypescriptBuildError, MachineMessage, SafeMachineMessage } from 'script-engine';

export interface ConsoleLogItem {
    timestamp: string;
    type: string;
    message: string;
    source?: string;
}

export type ConsoleLogType = 'log' | 'error' | 'output' | 'info' | 'warn';

@Component({
    selector: 'bk-console-log',
/* tslint:disable:max-line-length */
    template: `
<div class="console-log-table-wrapper" [style.max-height]="maxHeight">
    <table class="table table-fixed table-hover table-light">
        <tbody>
            <tr *ngFor="let log of items;" class="console-log-tr log-{{log.type}}">
                <td>
                    <div class="console-log-head">
                        <span class="console-log-timestamp">{{log.timestamp}}</span>
                        <i class="console-log-icon fa fa-fw fa-angle-double-right" *ngIf="log.type == 'log'"></i>
                        <i class="console-log-icon fa fa-fw fa-times-circle font-red" *ngIf="log.type == 'error'"></i>
                        <i class="console-log-icon fa fa-fw fa-sign-out font-green-jungle" *ngIf="log.type == 'output'"></i>
                        <i class="console-log-icon fa fa-fw fa-info-circle font-blue" *ngIf="log.type == 'info'"></i>
                        <i class="console-log-icon fa fa-fw fa-exclamation-triangle font-yellow-saffron" *ngIf="log.type == 'warn'"></i>
                    </div>
                    <div class="console-log-message"><span *ngIf="log.source" class="console-log-source">{{log.source}}<i class="fa fa-fw fa-angle-right"></i></span><span [innerHTML]="log.message"></span></div>
                </td>
            </tr>
            <tr *ngIf="items.length == 0">
                <td class="text-center">
                    <i>Console is empty</i>
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

    items: ConsoleLogItem[] = [];

    constructor() {
    }

    clear() {
        this.items = [];
    }

    add(type: ConsoleLogType, message: string, source?: string, timestamp?: string) {
        if (!timestamp) {
            timestamp = moment().format('HH:mm:ss.SSS');
        }
        this.items.unshift({
            timestamp: timestamp,
            type: type,
            message: message.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;'),
            source: source
        });
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
                    posInfo = '<br><strong>Position:</strong> line <strong>'
                        + message.position.lineA
                        + '</strong> column <strong>'
                        + message.position.columnA
                        + '</strong> - <strong>'
                        + message.position.columnB
                        + '</strong>';
                } else {
                    posInfo = '<br><strong>Position:</strong> line <strong>'
                        + message.position.lineA
                        + '</strong> column <strong>'
                        + message.position.columnA
                        + '</strong> - line <strong>'
                        + message.position.lineB
                        + '</strong> column <strong>'
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
                    posInfo = '<br><strong>Position:</strong> line <strong>'
                        + error.position.lineA
                        + '</strong> column <strong>'
                        + error.position.columnA
                        + '</strong> - <strong>'
                        + error.position.columnB
                        + '</strong>';
                } else {
                    posInfo = '<br><strong>Position:</strong> line <strong>'
                        + error.position.lineA
                        + '</strong> column <strong>'
                        + error.position.columnA
                        + '</strong> - line <strong>'
                        + error.position.lineB
                        + '</strong> column <strong>'
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
                    message: '<strong>TypeScript Error</strong>: ' + (<Error>error).message,
                    source: source
                });
            } else {
                error.diagnostics.forEach((d) => {
                    this.items.unshift({
                        timestamp: timestamp,
                        type: 'error',
                        message: '<strong>TypeScript Error #' + d.code + '</strong>: ' + d.messageText,
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
