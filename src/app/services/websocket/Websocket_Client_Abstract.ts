import { WebsocketMessage } from './WebsocketMessage';
import { WebsocketMessageBuffer } from './WebsocketMessageBuffer';
import {TyrionBackendService} from "../BackendService";
import {TyrionApiBackend} from "../../backend/BeckiBackend";


export abstract class IndividualWebSocketOutComingMessage {
    abstract getType(): string;          // Identifikace zprávy například getState
    abstract getChannel(): string;       // Osběrný Kanál (tyrion, homer-serve, instance atd..)
}

/**
 * Zprávy jsou odesílány přímo Tyrionovi.
 *
 * Pokud na Tyriona získá se do Jsonu Typ Jsonu a channel (kanál) - například do Becki, Mezi instancemi.
 * Mezi Tyrionem a Homer serverem atd..¨
 *
 */
export abstract class WebsocketClientAbstract {

    // Static parameters
    public static HOMER_CHANNEL_NAME = 'homer';
    public static HOMER_HARDWARE_SUBSCRIBER = 'hardware-logger';
    public static GARFIELD_CHANNEL_NAME = 'garfield';
    public static TYRION_CHANNEL_NAME = 'tyrion';
    public static BECKI_CHANNEL_NAME = 'becki';

    protected _websocket: WebSocket = null;                      // JS knihovna s Websocketem
    protected _messageBuffer = new WebsocketMessageBuffer();    // Buffer na odeslané zprávy, na které je vyžadovaný callback
    protected _websocketReconnectTime: number = 5000;           // Čas k obnovovení v ms
    protected _webSocketReconnectTimeout: any;

    // Callbacks
    protected _onMessageCallback: ((m: WebsocketMessage) => void);
    protected _onOpenCallback: ((e: any) => void);
    protected _onErrorCallback: ((e: any) => void);

    /**
     * @param url: Adresa  -  bez wss Portu pokud je vyžadován (Nepřekryt C_Name doménou)
     * @param backendService: TyrionApiBackend
     */
    constructor(public url: string) {
        if (!(url.includes('ws://') || this.url.includes('wss://'))) {
            if (TyrionApiBackend.protocol == 'http') {
                this.url = 'ws://' + url;
            } else {
                this.url = 'wss://' + url;
            }
        }

        console.info('Konečná podoba URL: ',  this.url);
    }

    public disconnectWebSocket(): void {
        console.error('disconnectWebSocket()');
        if (this._websocket) {
            this._websocket.removeEventListener('close', (e) => this.onError(e));
            this._websocket.removeEventListener('onerror', (e) => this.onError(e));
            this._websocket.removeEventListener('onclose', (e) => this.onError(e));
            this._websocket.close();
        }
        this._websocket = null;
    }

    /**
     * Kontrola zda je otevřený a aktivní tunel websocketu do Tyriona
     * @returns {boolean}
     */
    public isWebSocketOpen(): boolean {
        if (this._websocket) {
            if (this._websocket.readyState === WebSocket.OPEN) {
                return true;
            }
            return false;
        }
    }

    /**
     * ODeslání zprávy na Tyriona s registrací Callbacku
     * @param message
     * @param time
     * @param delay
     * @param numberOfRetries
     * @param callback
     */
    public send_with_callback(message: WebsocketMessage, time: number, delay: number, numberOfRetries: number, callback: (message: WebsocketMessage, error: any) => void) {
        this._messageBuffer.sendMessage(this, message, time, delay, numberOfRetries, callback);
    }


    /**
     * Zpráva na kterou není očekáváaná odpověď
     */
    public send_without_callback(message: WebsocketMessage): boolean {
        if (this._websocket) {
            if (this._websocket.readyState === WebSocket.OPEN) {
                this._websocket.send(message.toJsonString());
                return true;
            }else {
                console.error('WebsocketClientAbstract:: send_without_callback this._websocket.readyState !== WebSocket.OPEN');
                return false;
            }
        } else {
            console.error('WebsocketClientAbstract:: this._websocket is null');
            return false;
        }
    }

    /**
     *
     * Set callback to on message event, "m" is parsed message as object
     *
     */
    public set onMessageCallback(callback: ((m: any) => void)) {
        this._onMessageCallback = callback;
    }

    /**
     *
     * Set callback to on open event
     *
     */
    public set onOpenCallback(callback: ((e: any) => void)) {
        this._onOpenCallback = callback;
    }


    /**
     *
     * Set callback to on open event
     *
     */
    public set onErrorCallback(callback: ((e: any) => void)) {
        this._onErrorCallback = callback;
    }
    /**
     * Obsluha Knihovny Websocketu.
     * Obnova / Odesílání dat / Příjem Zpráv (Přesměrovány do this.processData(..))
     */
    public connectWs() {
        if (!(this.url.includes('ws://') || this.url.includes('wss://'))) {
            if (TyrionApiBackend.protocol == 'http') {
                this.url = 'ws://' + this.url;
            } else {
                this.url = 'wss://' + this.url;
            }
        }

        console.info('Adresa Pro připojení: ',  this.url);
        // Logger.info('TyrionWebsocketClient:: MainServer Connection:: reconnect to Main server url:: ',this.websocketUrl);
        this._websocket = new WebSocket(this.url);
        this._websocket.addEventListener('close', (e) => this.onError(e));
        this._websocket.addEventListener('open', (e) => this.onOpen(e));
        this._websocket.addEventListener('message', (e) => this.onMessageParse(e));
        this._websocket.addEventListener('onerror', (e) => this.onError(e));
        this._websocket.addEventListener('onclose', (e) => this.onError(e));
    }

    protected onError = (e) => {
        console.error('WebsocketClientAbstract::onError or Close::', e);
        console.error('WebsocketClientAbstract::onError or Close::', e);
        console.error('WebsocketClientAbstract::onError or Close::', e);
        console.error('WebsocketClientAbstract::onError or Close::', e);
        if (this._onErrorCallback) {
            this._onErrorCallback(e);
        }
    }


    /**
     *
     * Connection opened event
     *
     */
    protected onOpen(e: any) {
        console.info('WebsocketClientAbstract:', 'connection_opened');

        if (this._onOpenCallback) {
            this._onOpenCallback(e);
        }
    }

    protected onMessageParse(e: any): void {
        try {

            console.info('WebsocketClientAbstract:: onMessageParse:', e);

            if (e && e.data) {

                /* tslint:disable */
                let message: WebsocketMessage = WebsocketMessage.fromJson(e.data);

                // console.log('WebsocketClientAbstract:: processData:: Message:: ' + e.data);
                // console.log('WebsocketClientAbstract:: processData:: Message:: ' + message.toJsonString());

                // pokud se vrátí true - Parser si zprávu odchytil a odesílá na registrovaný callback!
                if (this._messageBuffer.parseAnswer(message)) {
                   //  console.log('WebsocketClientAbstract:: processData:: MessageBuffer Contain this Message');
                    return;
                }


                if (message) {
                    if (this._onMessageCallback) {
                        this._onMessageCallback(message);
                    }
                }
            }

            /* tslint:enable */
        } catch (e) {
            console.error('WebsocketClientAbstract:: processData:: error reading JSON : error: ', e);
            return;
        }
    }


}
