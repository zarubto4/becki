/**
 * Created by zaruba on 14.03.18.
 */

/* tslint:disable */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ValidatorErrorsService } from '../services/ValidatorErrorsService';
import { TranslationService } from '../services/TranslationService';
import { ConsoleLogType, ConsoleLogComponent} from './ConsoleLogComponent';
import { IHardware } from '../backend/TyrionAPI';
import { ITerminalWebsocketMessage, IWebsocketTerminalState } from '../backend/BeckiBackend';
import { FlashMessageError } from '../services/NotificationService';
import { ModalsLogLevelModel } from '../modals/hardware-terminal-logLevel';
import { TyrionBackendService } from '../services/BackendService';
import * as Rx from 'rxjs';
import { ModalService } from "../services/ModalService";
import { FormSelectComponentOption } from "./FormSelectComponent";
import { ModalsSelectHardwareModel } from "../modals/select-hardware";
@Component({
    selector: 'bk-terminal-log-component',
    template: `

        <!-- Portlet - Basic Title of Panel with Buttons on right side -- START -->
        <bk-portlet-title [title_name]="'title'|bkTranslate:this"
                          [icon]="'fa-microchip'"
                          (onClick)="onPortletClick($event)"
                          [btns]="[
                              {
                                  condition: (tab == 'settings'),
                                  btn_label_for_person: ('btn_add_hardware'|bkTranslate:this),
                                  icon: 'fa-plus-circle',
                                  colorType: 'ADD',
                                  btn_tag: 'add_hardware'
                              }

                          ]"
                          (onTabClick)="onToggleTab($event)"
                          [tab_selected_name]="tab"
                          [tabBtns]="[
                            {
                                tab_name: 'terminal',
                                condition: (true),
                                tab_color: 'HARDWARE',
                                tab_label: ('label_terminal'|bkTranslate:this)
                            },
                            {
                                tab_name: 'settings',
                                condition: (show_settings_panel),
                                tab_color: 'HARDWARE',
                                tab_label: ('label_settings_terminal'|bkTranslate:this)
                            }
                          
                    ]"
        >
        </bk-portlet-title>
        <!-- Portlet - Basic Title of Panel with Buttons on right side --- END -->

        <!-- Terminal -->
        <div *ngIf="tab == 'terminal'">
            <bk-console-log maxHeight="400px" #console></bk-console-log>
            <br>
            <button class="btn blue" (click)="consoleLog.clear()">
                <i class="fa fa-times-circle"></i> {{'btn_clear_console' | bkTranslate:this}}
            </button>
        </div>
        <!-- Terminal END -->

        <div *ngIf="tab == 'settings'">

            <table *ngIf="selected_hw_for_subscribe && selected_hw_for_subscribe.length >= 1" class="table table-hover">
                <thead>
                <tr>
                    <th class="">{{'table_id' | bkTranslate:this}}</th>
                    <th class="text-center">{{'table_logLevel' | bkTranslate:this}}</th>
                    <th class="text-center">{{'table_state' | bkTranslate:this}}</th>
                    <th class="text-center">{{'table_logLevel' | bkTranslate:this}}</th>
                    <th class="text-center">{{'table_connection' | bkTranslate:this}}</th>
                    <th class="text-center">{{'table_color' | bkTranslate:this}}</th>
                    <th class="text-right no-wrap">{{'table_actions' | bkTranslate:this}}</th>
                </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let hardware of selected_hw_for_subscribe">
                        <td class="vert-align">
                            {{(hardware.name ? hardware.name : hardware.id)}}
                        </td>

                        <!-- Log Level !-->
                        <td class="vert-align text-center">
                            <bk-log-level [log_level]="logLevel[hardware.id].log"></bk-log-level>
                        </td>
                        
                        <!-- Subsrcibe Statel !-->
                        <td class="text-center vert-align">
                            <span *ngIf="logLevel[hardware.id].subscribed" class="font-green-jungle" >Subscribing</span>
                            <span *ngIf="!logLevel[hardware.id].subscribed" class="font-yellow-casablanca" >Not subscribing</span>
                            <span *ngIf="(!hardware.server)" class="font-red">Not Assigned to server</span>
                            <span *ngIf="(hardware.server && !hardware.server.server_url)" class="font-red">Missing Server URL</span>
                            <span *ngIf="(hardware.server && !hardware.server.hardware_logger_port)" class="font-red">Missing Server Port</span>
                        </td>

                        <!-- Log Selector !-->
                        <td class="text-center vert-align"> 
                            <bk-form-select [control]="colorForm.controls['log_' + hardware.id]"  
                                            [label]="'label_select_logLevel'|bkTranslate:this" 
                                            [placeholder]="'placeholder_info_level'|bkTranslate:this"
                                            [regexFirstOption]="logLevel[hardware.id].log"
                                            (valueChanged)="onUserChangeLogLevelClick($event, hardware)"
                                            [options]="logLevelOptions"></bk-form-select>
                            
                        </td>
                        
                        <!-- Online State !-->
                        <td class="vert-align  text-center">
                            <bk-online-state [online_state]="hardware.online_state"></bk-online-state>
                        </td>
                        
                        <!-- Color !-->
                        <td class="vert-align  text-center">
                            <bk-form-color-picker [control]="colorForm.controls['color_' + hardware.id]"  
                                                  [label]="'label_select_color'|bkTranslate:this"
                                                  (valueChange)="onUserChangeColorClick($event, hardware)"
                                                  [waitForTouch]="false"></bk-form-color-picker>
                        </td>
    
                        <td class="no-wrap text-right vert-align">
                            
                            <button *ngIf="logLevel[hardware.id].subscribed" title="{{'label_unsubscribe_hardware'|bkTranslate:this}}" class="btn btn-icon-only orange"
                                    (click)="onHardwareUnSubscribeClick(hardware)">
                                <i class="fa fa-times"></i>
                            </button>
                            
                            <button *ngIf="hardware.online_state == 'ONLINE' && !logLevel[hardware.id].subscribed" title="{{'label_subscribe_hardware'|bkTranslate:this}}" class="btn btn-icon-only blue"
                                    (click)="onHardwareSubscribeClick(hardware)">
                                <i class="fa fa-check"></i>
                            </button>

                            <button title="{{'label_subscribe_hardware'|bkTranslate:this}}" class="btn btn-icon-only red"
                                    (click)="removeHardwareFromSubscribeList(hardware)">
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Temporary page content if content is being loaded or if there is no content -- START -->
            <bk-nothing-to-show [condition_loading]="(selected_hw_for_subscribe == null)"
                                [condition_empty]="(selected_hw_for_subscribe != null && selected_hw_for_subscribe.length == 0)"
                                [main_message_link]="'label_no_hardware_to_show'|bkTranslate:this"
                                [main_message_comment_link]="'label_no_hardware_to_show_comment'|bkTranslate:this"
                                [btn_label]="'btn_add_hardware'|bkTranslate:this"
                                (onButtonClick)="addNewHardwareToSubscribeModal()">
            </bk-nothing-to-show>
            <!-- Temporary page content if content is being loaded or if there is no content -- END -->

        </div>

    `
})
export class TerminalLogSubscriberComponent implements OnInit, OnDestroy {

    // Project Id for Filter Parameters
    @Input()
    project_id: string = null;

    @Input()
    readonly: boolean = false;

    // Allow Settings
    show_settings_panel: boolean = true;

    // Subscribe Logs
    @Input()
    preselected_hardware: IHardware[] = null;

    selected_hw_for_subscribe: IHardware[] = null;

    // Array With Log Type Parameters
    logLevel: { [hardware_id: string]: {
        log: ('error' | 'warn' | 'info' | 'log'),
        subscribed: boolean
    }} = {};

    // First Preselect Tab
    tab: string = 'terminal';



    // Form For Color Selector
    colorForm: FormGroup;
    availableColors = ['#0082c8', '#e6194b', '#3cb44b', '#ffe119', '#f58231', '#911eb4', '#46f0f0', '#008080', '#aa6e28', '#ffd8b1']; // předdefinované barvy pro terminál

    WSinit: boolean = false;

    @ViewChild('console')
    consoleLog: ConsoleLogComponent;

    hardwareTerminalWS: Rx.Subscription = null; // objekt pro subscribe websocketu (a práci s pouze s touto instancí, takže ve chvíli co použiju  unsubscribe, tak se zruší toto a né Rx.subject v beckibackend)
    hardwareTerminalStateWS: Rx.Subscription = null; // stejně jako nahoře, more info:   http://reactivex.io/rxjs/manual/overview.html#subscription

    lastColorInstance: number = 0; // kvůli barvám sledujeme poslední přidanou instanci

    logLevelOptions: FormSelectComponentOption[] = [
        { value: 'log', label: 'log' },
        { value: 'info', label: 'info' },
        { value: 'warn', label: 'warn' },
        { value: 'error', label: 'error' }
    ];

    constructor(public modalService: ModalService, public tyrionBackendService: TyrionBackendService, public validatorErrorsService: ValidatorErrorsService, public formBuilder: FormBuilder, public translationService: TranslationService) {
    }

    ngOnInit() {

        this.hardwareTerminalWS = this.tyrionBackendService.hardwareTerminal.subscribe(msg => this.onMessage(msg));
        this.hardwareTerminalStateWS = this.tyrionBackendService.hardwareTerminalState.subscribe(msg => this.onStateMessage(msg));

        this.colorForm = this.formBuilder.group({
        }); // inicializace prázdného formu pro barvy

        this.colorForm.valueChanges.subscribe(value => {
            if (this.consoleLog) {
                Object.keys(value).forEach( // pro každej prvek colorform
                    colorKey => {
                        this.consoleLog.addSourceColor(colorKey.substr(5), value[colorKey]); // přidáme jeden sourceColor kterej měníme při jakékoliv změně barvy
                    });
            }
        });

        new Promise<any>((resolve) => {
            // todle je takovej "oblouk", protože nevíme kdy se console.log inicializuje, vytvoříme si interval kterej se každejch 100 ms ptá, zda již consoleLog existuje
            // pokud kohokoliv napadne lepší řešení, tohoto, feel free to do it
            let checker = setInterval(() => {
                if (this.consoleLog) {
                    clearInterval(checker);

                    // Inicializace pole
                    this.selected_hw_for_subscribe = [];

                    // Pokud pole obsahuje už nějaký prvek na začátku inicializace
                    if(this.preselected_hardware && this.preselected_hardware.length > 0) {
                        this.preselected_hardware.forEach((hw) => {
                            this.addNewHardwareToSubscribeList(hw);
                        })
                    }
                }
            }, 100);

        }).then(() => {

        });

    }

    ngOnDestroy() {
        if (this.hardwareTerminalWS) {
            this.hardwareTerminalWS.unsubscribe();
        }
        if (this.hardwareTerminalStateWS) {
            this.hardwareTerminalStateWS.unsubscribe(); // unsubscribe toho neposedného subscribera, takže se nestane že přijde stejná flash messeage 5x za sebou
        }

        this.selected_hw_for_subscribe.forEach(hardware => {
            this.onHardwareUnSubscribeClick(hardware);
        }); // odhlásíme každej HW co byl připojen


        this.tyrionBackendService.closeHardwareTerminalWebsocket('all'); // zavřeme všechny HW websockety na backednu

    }

    onToggleTab(tab: string) {
        this.tab = tab;
    }

    onPortletClick(action: string): void {
        if (action === 'add_hardware') {
            this.addNewHardwareToSubscribeModal();
        }
    }



    onMessage(msg: ITerminalWebsocketMessage) {
        let hardware = this.selected_hw_for_subscribe.find(device => device.id === msg.hardware_id); // najdeme hardware, kterého se zpráva týká
        if (hardware) {

            if (!this.logLevel[hardware.id].subscribed && msg.message_type === 'subscribe_hardware') {
                console.log('onMessage: subscribe_hardware response - Success: ', msg);
                this.logLevel[hardware.id].subscribed = true;
            }

            if (this.consoleLog) {
                console.log('onMessage: some message from Hardware', msg);
                this.consoleLog.add(msg.level, msg.message, (hardware.name ? hardware.name : msg.hardware_id), msg.hardware_id); // přidání zprávy do consoleComponent

            }
        }
    }

    onStateMessage(msg: IWebsocketTerminalState) {
        let terminalDevice;
        if (this.selected_hw_for_subscribe) {
            terminalDevice = this.selected_hw_for_subscribe.find(hardware => {
                if (msg.websocketUrl && msg.websocketUrl.includes(hardware.server.server_url + ':' + hardware.server.hardware_logger_port)) {
                    return true;
                }
            });
        }

        switch (msg.reason) { // pro případné samosté obstarávání každého problému co nastane na websocketu
            case 'cantConnect':
                this.consoleLog.add('error', 'Shit Happens!!! ', 'Server', 'e6194b', new Date().toDateString());
                break;

            case 'conectionFailed':
                terminalDevice.connected = msg.isConnected;
                break;

            case 'dissconected':
                terminalDevice.connected = msg.isConnected;
                break;

            case 'opened':
                terminalDevice.connected = msg.isConnected; // najdeme odebíraný HW kterého se status update týká a upravíme ho (pokud se nenajde, prostě se to přeskočí)
                break;
        }
    }



    /**
     * Odlášení odběru, ale nikoliv odstranění ze seznamu
     * @param hardware
     */
    onHardwareUnSubscribeClick(hardware: IHardware): void {
        this.tyrionBackendService.requestDeviceTerminalUnsubcribe(hardware.id, hardware.server.server_url + ':' + hardware.server.hardware_logger_port); // pošleme unsubscribe request na WS
    }

    /**
     * Odlášení odběru, ale nikoliv odstranění ze seznamu
     * @param hardware
     * @param logLevel
     */
    onHardwareSubscribeClick(hardware: IHardware, logLevel: ('error' | 'warn' | 'info' | 'log')): void {
        this.tyrionBackendService.requestDeviceTerminalSubcribe(hardware.id, hardware.server.server_url + ':' + hardware.server.hardware_logger_port, logLevel); // pošleme unsubscribe request na WS
    }

    /**
     * Změna Log Levelu
     * @param logLevel
     * @param hardware
     */
    onUserChangeLogLevelClick(logLevel: ('error' | 'warn' | 'info' | 'log'), hardware: IHardware): void { // změna log levelu

        console.log('onUserChangeLogLevelClick:: Hardware', hardware.id, 'LogLevel', logLevel);

        // Set New Default Values
        this.logLevel[hardware.id].log = logLevel;


        // Zde se odhlásíme a příhlásíme k s novým loglevelem
        this.onHardwareUnSubscribeClick(hardware);
        this.onHardwareSubscribeClick(hardware, this.logLevel[hardware.id].log);

    }

    /**
     * Změna Log Levelu
     * @param color
     * @param hardware
     */
    onUserChangeColorClick(color: string, hardware: IHardware): void { // změna log levelu

        console.log('onUserChangeColorClick:: Hardware', hardware.id, 'Color', color);

        // Set New Default Values
        // TODO změna barvy v tewrminálu
    }

    /**
     * Odstraníme Hardware úplně ze seznamu
     * @param hardware
     */
    removeHardwareFromSubscribeList(hardware: IHardware): void {
        this.onHardwareUnSubscribeClick(hardware);
        for(let i = this.selected_hw_for_subscribe.length - 1; i >= 0; i--) {
            if(this.selected_hw_for_subscribe[i].id === hardware.id) {
                this.selected_hw_for_subscribe.splice(i, 1);
            }
        }
    }


    addNewHardwareToSubscribeModal(): void {
        let m = new ModalsSelectHardwareModel(this.project_id);
        this.modalService.showModal(m)
            .then((success) => {
                m.selected_hardware.forEach((hw) => {

                    if (!this.selected_hw_for_subscribe.find(filter_hw => {
                            if (filter_hw.id == hw.id) {
                                return true;
                            }
                    })) {
                        if (this.lastColorInstance < 7) {
                            this.addNewHardwareToSubscribeList(hw, this.availableColors[this.lastColorInstance++]);
                        } else {
                            this.addNewHardwareToSubscribeList(hw);
                        }
                    }
                });
            });
    }

    /**
     * Přidáme Hardware do seznamu a přihlásíme k odběru na default log level
     */
    public addNewHardwareToSubscribeList(hardware: IHardware, color: string = '#0082c8'): void {

        this.colorForm.addControl('color_' + hardware.id, new FormControl('color_' + hardware.id));
        this.colorForm.addControl('log_' + hardware.id, new FormControl('log_' + hardware.id));

        this.colorForm.controls['color_' + hardware.id].setValue(color);
        this.colorForm.controls['log_' + hardware.id].setValue('info');

        if (this.selected_hw_for_subscribe.find(hw => {
                // Pokud nenajdeme HW, se stejným portem nebo server URL, pošleme novej pořadavek na připojení HW
                if (hw.server.id !== hardware.server.id) {
                    return true;
                }
            })) {
            this.tyrionBackendService.connectDeviceTerminalWebSocket(hardware.server.server_url, hardware.server.hardware_logger_port.toString());
        }


        // Set Default Values
        this.logLevel[hardware.id] = {
            log: 'info',
            subscribed: false
        };

        this.selected_hw_for_subscribe.push(hardware);

        this.onHardwareSubscribeClick(hardware, this.logLevel[hardware.id].log);
        // this.colorForm.controls['color' + board.id].setValue('#0000FF'); // přidáme do console.log barvu
        this.consoleLog.add('output', 'Initializing the device, more info in settings', hardware.id, hardware.id);

    }

}
/* tslint:enable */
