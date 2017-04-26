import { Injectable, NgZone } from '@angular/core';

export enum HomerCloseReason {
    CalledClose = 0,
    CloseEvent = 1
}

export enum HomerOpenSource {
    CalledOpen = 0,
    Reconnect = 1,
    External = 2
}

/*
 *
 * Class for communication between becki and homer
 *
 */
export class HomerDao {

    private _webSocket: WebSocket = null;
    private _url: string = null;
    private _webSocketReconnectTimeout: any;
    private _onMessageCallback: ((m: any) => void);
    private _onOpenCallback: ((e: any) => void);

    protected _closed: boolean;

    /**
     *
     * Generate random uuid
     *
     */
    public static uuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            // tslint:disable-next-line:no-bitwise
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     *
     * Creates dao with websocket url
     *
     */
    constructor(url: string) {
        this._url = url;
        this._closed = false;
        this.connectWebSocket();
    }

    /**
     *
     * Reconect, when connection fails
     *
     */
    protected reconnectWebSocketAfterTimeout(e: any, reason: HomerCloseReason = HomerCloseReason.CalledClose) {
        if (this._webSocket) {
            console.info('homer_service:', 'connection_closed (', reason, '): ', this._url, ' original event: ', e);
        }
        clearTimeout(this._webSocketReconnectTimeout);
        this._webSocketReconnectTimeout = setTimeout(() => {
            this.connectWebSocket(HomerOpenSource.Reconnect);
        }, 5000);
    }

    /**
     *
     * Connect to websocket on url
     *
     */
    public connectWebSocket(callSource: HomerOpenSource = HomerOpenSource.CalledOpen) {
        if (this._closed && callSource !== HomerOpenSource.CalledOpen) {
            return;
        }

        this._closed = false;

        console.info('homer_service:', 'connecting: ', this._url);
        this._webSocket = new WebSocket(this._url);
        this._webSocket.addEventListener('close', (e) => this.reconnectWebSocketAfterTimeout(e, HomerCloseReason.CloseEvent));
        this._webSocket.addEventListener('open', (e) => this.onOpen(e));
        this._webSocket.addEventListener('message', (e) => this.onMessage(e));
    }

    /**
     *
     * Connection opened event
     *
     */
    protected onOpen(e: any) {
        console.info('homer_service:', 'connection_opened');
        this.sendMessage({
            messageType: 'subscribeChannel'
        });

        if (this._onOpenCallback) {
            this._onOpenCallback(e);
        }
    }

    /**
     *
     * Message received event
     *
     */
    protected onMessage(e: any) {
        if (e && e.data) {
            let data = null;

            try {
                data = JSON.parse(e.data);
            } catch ( e ) {
                console.info('homer_service:', 'message_error:', 'can not parse message');
                return;
            }

            if (data) {
                if (this._onMessageCallback) {
                    this._onMessageCallback(data);
                }
            }
        }
    }

    /**
     *
     *
     * Close connection
     *
     */
    public close(reason: HomerCloseReason = HomerCloseReason.CalledClose) {
        if (this._webSocket) {
            console.info('homer_service:', 'closing_connection (', reason, '): ', this._url);
        }
        this._webSocket.close();
        this._webSocket = null;
        clearTimeout(this._webSocketReconnectTimeout);
        this._webSocketReconnectTimeout = null;

        if (reason === HomerCloseReason.CalledClose) {
            this._closed = true;
        }
    }

    /**
     *
     * Send message to homer
     *
     */
    public sendMessage(message: any) {
        let messageCopy = JSON.parse(JSON.stringify(message));
        messageCopy['messageChannel'] = 'becki';
        messageCopy['messageId'] = HomerDao.uuid();
        this._webSocket.send(JSON.stringify(messageCopy));
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
     * Returns true, if websocket is still connected
     *
     */
    public get connected(): boolean {
        return !this._closed;
    }
}

/**
 *
 * Homer service
 *
 * This service can create homer dao for communication with homer server
 *
 */
@Injectable()
export class HomerService {

    protected _cache: {[url: string]: HomerDao};

    constructor(protected ngZone: NgZone) {
        console.info('Homer service init');
        this._cache = {};
    }

    public connectToHomer(url: string, token: string): HomerDao {
        const finalUrl = url.replace('#token', token);

        if (this._cache.hasOwnProperty(finalUrl)) {
            if (!this._cache[finalUrl].connected) {
                this._cache[finalUrl].connectWebSocket(HomerOpenSource.External);
            }

            return this._cache[finalUrl];
        }

        const homerDao = new HomerDao(finalUrl);
        this._cache[finalUrl] = homerDao;
        return homerDao;
    }
}
