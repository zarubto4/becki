import { Injectable } from '@angular/core';
import { TranslationService } from '../services/TranslationService';
import { BackendService } from './BackendService';
import * as Rx from 'rxjs';
import { IWebSocketMessage } from '../backend/BeckiBackend';


@Injectable()
export class GarfieldService {

    garfieldSocket: Rx.Subject<any> = new Rx.Subject<any>();

    constructor(private translationService: TranslationService, private backendService: BackendService) {

        this.garfieldSocket = backendService.garfieldWebsocketRecived;
        this.garfieldSocket.subscribe(msg => (this.getMesseage(msg)));
    }


    handShake(): void {
        let sendObj = { handshake: 'ready' };

        let message = {
            message_id: this.backendService.uuid(),
            message_channel: BackendService.WS_CHANNEL,
            message_type: 'garfield',
        };
        this.backendService.sendWebSocketMessage(message);
    }


    getMesseage(messeage: any) {
        console.info(messeage);
    }










}
