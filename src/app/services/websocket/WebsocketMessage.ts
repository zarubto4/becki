import { TyrionApiBackend } from '../../backend/BeckiBackend';
import { IndividualWebSocketOutComingMessage } from './Websocket_Client_Abstract';


export class WebsocketMessage {

    public static KEY_MESSAGE_TYPE = 'message_type';
    public static KEY_MESSAGE_ID = 'message_id';
    public static KEY_MESSAGE_CHANNEL = 'message_channel';
    public static KEY_STATUS = 'status';
    public static DATA_KEY_ERROR = 'error';
    public static STATUS_SUCCESS = 'success';
    public static STATUS_ERROR = 'error';

    public message_type: string = null;              // Typ Zprávy
    public message_id: string = null;                // MessageID
    public message_channel: string = null;           // Channel
    public status: string = null;            // Status
    public data: { [key: string]: any } = {};  // data v poli vše co není přímo definované

    protected static serializeOutComingMessage(object: IndividualWebSocketOutComingMessage): { [key: string]: any } {

        let out: { [key: string]: any } = {};

        for (let key in object) {

            if (!object.hasOwnProperty(key)) {
                continue;
            }
            if (key === 'type' || key === 'channel') {
                continue;
            }
            if (key === 'error' && object[key] === null) {
                continue;
            }
            if (key === 'errorCode' && object[key] === null) {
                continue;
            }
            if (object[key] === null || object[key] === '') {
                continue;
            }

            let type = typeof object[key];

            if (Array.isArray(object[key])) {
                out[key] = [];
                object[key].forEach((val) => {
                    let arrType = typeof val;
                    if (arrType === 'string' || arrType === 'number' || arrType === 'boolean') {
                        out[key].push(val);
                    }
                });
            } else if (type === 'string' || type === 'number' || type === 'boolean' || type === 'object') {
                out[key] = object[key];
            }
        }

        return out;
    }


    public static fromOutComingMessage(object: IndividualWebSocketOutComingMessage): WebsocketMessage {

        let m = new WebsocketMessage();

        m.message_type = object.getType();
        m.message_channel = object.getChannel();
        m.message_id = WebsocketMessage.getUUID();
        m.data = WebsocketMessage.serializeOutComingMessage(object);

        return m;
    }

    public static fromJson(json: string | any): WebsocketMessage {
        if (typeof json === 'string') {
            try {
                json = JSON.parse(<string>json);
            } catch (e) {
                console.log('WebsocketMessage :: error parsing JSON : error: ' + e);
                return null;
            }
        }

        let m = new WebsocketMessage();

        try {

            m.message_type = json[WebsocketMessage.KEY_MESSAGE_TYPE];
            m.message_id = json[WebsocketMessage.KEY_MESSAGE_ID];
            m.message_channel = json[WebsocketMessage.KEY_MESSAGE_CHANNEL];
            m.status = json[WebsocketMessage.KEY_STATUS];

            // Cyklus do zprávy pro odpověd doplní všechny parametry, které nejsou type, id, channel atd..
            for (let k in json) {
                if (!json.hasOwnProperty(k)) {
                    continue;
                }
                if (
                    k !== WebsocketMessage.KEY_MESSAGE_TYPE &&
                    k !== WebsocketMessage.KEY_MESSAGE_ID &&
                    k !== WebsocketMessage.KEY_MESSAGE_CHANNEL &&
                    k !== WebsocketMessage.KEY_STATUS
                ) {
                    m.data[k] = json[k];
                }
            }
        } catch (e) {
            console.log('WebsocketMessage :: error reading JSON : error: ' + e);
            return null;
        }
        return m;
    }

    public static getUUID(): string {
        return TyrionApiBackend.uuid();
    }

    public toJson(): { [key: string]: any } {

        if (this.message_id === null) {
            console.log('WebSocketMessage Id zprávy bylo null - generuji nové!!');
            this.message_id = WebsocketMessage.getUUID();
        }

        let out = this.data || {};
        out[WebsocketMessage.KEY_MESSAGE_TYPE] = this.message_type;
        out[WebsocketMessage.KEY_MESSAGE_ID] = this.message_id;

        if (this.message_channel) {
            out[WebsocketMessage.KEY_MESSAGE_CHANNEL] = this.message_channel;
        }

        if (this.status) {
            out[WebsocketMessage.KEY_STATUS] = this.status;
        }

        return out;
    }

    public toJsonString(): string {
        return JSON.stringify(this.toJson());
    }

    public copy(removeId: boolean = false): WebsocketMessage {
        let m = new WebsocketMessage();
        m.message_type = this.message_type;
        m.message_id = (removeId) ? null : this.message_id;
        m.message_channel = this.message_channel;
        m.status = this.status;
        m.data = JSON.parse(JSON.stringify(this.data));
        return m;
    }
}
