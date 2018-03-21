import { WebsocketMessage } from './WebsocketMessage';
import { WebsocketMessageBuffer } from './WebsocketMessageBuffer';


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

    protected _websocket: WebSocket = null;                      // JS knihovna s Websocketem
    protected _messageBuffer = new WebsocketMessageBuffer();    // Buffer na odeslané zprávy, na které je vyžadovaný callback
    protected _websocketReconnectTime: number = 5000;           // Čas k obnovovení v ms
    protected _webSocketReconnectTimeout: any;
    protected _onMessageCallback: ((m: WebsocketMessage) => void);
    protected _onOpenCallback: ((e: any) => void);

    protected _messageCallbacks: ((message: WebsocketMessage, websocket: WebSocket) => boolean)[] = [];
    protected _notCaughtReplyMessageCallback: (message: string|WebsocketMessage) => string|WebsocketMessage = null;

    /**
     * @param url: Adresa  -  bez wss Portu pokud je vyžadován (Nepřekryt C_Name doménou)
     * @param wss: true pokud je wss požadováno
     */
    constructor(public url: string, public wss: boolean = false) {

        if (!wss) {
            this.url = 'ws://' + url;
        }else {
            this.url = 'wss://' + url;
        }
    }

    public setNotCaughtReply(messageCallback: (message: string|WebsocketMessage) => string|WebsocketMessage): void {
        this._notCaughtReplyMessageCallback = messageCallback;
    }

    public registerMessageCallback(cb: (message: WebsocketMessage, websocket: WebSocket) => boolean): void {
        this._messageCallbacks.push(cb);
    }

    public unregisterMessageCallback(cb: (message: WebsocketMessage, websocket: WebSocket) => boolean): void {
        let i = this._messageCallbacks.indexOf(cb);
        if (i > -1) {
            this._messageCallbacks.splice(i, 1);
        }
    }

    public disconnectWebSocket(): void {
        console.error('disconnectWebSocket()');
        if (this._websocket) {
            this._websocket.removeEventListener('close', this.reconnectWebSocketAfterTimeout);
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
     * Obsluha Knihovny Websocketu.
     * Obnova / Odesílání dat / Příjem Zpráv (Přesměrovány do this.processData(..))
     */
    public connectWs() {
        // Logger.info('TyrionWebsocketClient:: MainServer Connection:: reconnect to Main server url:: ',this.websocketUrl);
        this._websocket = new WebSocket(this.url);
        this._websocket.addEventListener('close', this.reconnectWebSocketAfterTimeout);
        this._websocket.addEventListener('open', (e) => this.onOpen(e));
        this._websocket.addEventListener('message', (e) => this.onMessageParse(e));

    }

    // define function as property is needed to can set it as event listener (class methods is called with wrong this)
    protected reconnectWebSocketAfterTimeout = (e) => {

        /* tslint:disable */
        console.log('WebsocketClientAbstract::reconnectWebSocketAfterTimeout()');
        console.log(e);
        /* tslint:enable */

        clearTimeout( this._webSocketReconnectTimeout );
        this._webSocketReconnectTimeout = setTimeout(() => {
            this.connectWs();
        }, this._websocketReconnectTime);
    }

    /**\
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

            // console.info('WebsocketClientAbstract:: onMessageParse:', e);

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
