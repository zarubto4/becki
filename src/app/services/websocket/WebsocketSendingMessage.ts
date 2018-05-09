import { WebsocketMessage } from './WebsocketMessage';
import { WebsocketMessageBuffer } from './WebsocketMessageBuffer';
import { WebsocketClientAbstract } from './Websocket_Client_Abstract';

export class WebsocketSendingMessage {
    private _timeout: any = null; // Storing Timeout ID - to clear it - if needed

    constructor(
        protected websocket: WebsocketClientAbstract,
        protected message: WebsocketMessage,
        protected buffer: WebsocketMessageBuffer,
        protected time_out: number,
        protected delay: number,
        protected numberOfRetries: number,
        protected callback: (message: WebsocketMessage, error: any) => void) {

        if (delay > 0) {
            this._timeout = setTimeout(() => this.send_first_time(time_out), delay);
        } else {
            this.send_first_time(time_out);
        }
    }

    public send_first_time(time: number) {

        this.buffer.message_in_buffer[this.message.message_id] = this;

        // Send on first time immidietly
        this.websocket.send_without_callback(this.message);
        this._timeout = setInterval(() => this.send_message_again(), time);

    }


    public send_message_again() {

        console.info('send_message_again: ');

        if (this.numberOfRetries < 1) { // Počítám do 1 - protože jeden pokus už je vyplítván v konstrukoru.
            this.destroy();
            this.callCallback(null, 'Websocket numberOfRetries is done');
            // Zabij odesílání a informuj o nedoručitelnosti
        }

        this.numberOfRetries += -1;

        if (!this.websocket.send_without_callback(this.message)) {

            console.info('send_message_again: send_without_callback - return false ');

            this.destroy();
            this.callCallback(null, 'Web Socket is offline');

            return;
        }
    }

    // Zabití z venčí
    public destroy() {
        clearTimeout(this._timeout);
        this.buffer.removeSendingMessageById(this.message.message_id);
    }

    public callCallback(message: WebsocketMessage, error: any) {
        if (this.callback) {
            this.callback(message, error);
        }
    }
}
