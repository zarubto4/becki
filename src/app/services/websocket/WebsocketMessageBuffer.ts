/**
 * Slouží k ukládání zpráv a řízení odesílání.
 *
 * Tento Buffer je jen jednou v závislosti na připojení k Tyrironovi
 *
 */
import { WebsocketSendingMessage } from './WebsocketSendingMessage';
import { WebsocketMessage } from './WebsocketMessage';
import { WebsocketClientAbstract } from './Websocket_Client_Abstract';

export class WebsocketMessageBuffer {

    public message_in_buffer: { [msgId: string]: WebsocketSendingMessage } = {};

    constructor() {
        // Nothing
    }

    public sendMessage(websocket: WebsocketClientAbstract, message: WebsocketMessage, time: number, delay: number, numberOfRetries: number, callback: (message: WebsocketMessage, error: any) => void) {
        new WebsocketSendingMessage(websocket, message, this, time, delay, numberOfRetries, callback);
    }

    public parseAnswer(message: WebsocketMessage): boolean {

       // console.log('WebsocketMessageBuffer: parseAnswer:: ', message);

        if (this.message_in_buffer[message.message_id]) {

            // Zpráva obsahuje Error Code
            if (message.data['error_code'] != null || message.data['error_code']) {

                /* tslint:disable */
                 console.log('WebsocketMessageBuffer: Incoming Message contains  error_code');
                console.log('Code:: ' , message.data['error_code']);
                console.log('Message:: ' , message.data['error_message']);
                /* tslint:enable */

                let status: {} = {};
                status['error_code'] =  message.data['error_code'];
                status['error_message'] =  message.data['error_message'];
                status['status'] =  'error';

                this.message_in_buffer[message.message_id].callCallback(null, status);
                this.message_in_buffer[message.message_id].destroy();
                return true;
            }

            // Zpráva neobsahuje Error code a je asi v pořádku
            this.message_in_buffer[message.message_id].callCallback(message, null);
            this.message_in_buffer[message.message_id].destroy();

            return true;

        }

        return false;
    }

    public removeSendingMessageById(msgId: string) {
        delete this.message_in_buffer[msgId];
    }

}
