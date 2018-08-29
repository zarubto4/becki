import { TyrionApiBackend } from '../../backend/BeckiBackend';

export interface IWebSocketMessage {
    message_id: string;
    message_channel: string;
    message_type: string;
    status?: string;
    error?: string;
    data?: any;

    isSuccessful(): boolean;
    stringify(): string;
}

export class WebSocketMessage implements IWebSocketMessage {

    public message_id: string;
    public message_channel: string;
    public message_type: string;
    public status: string;
    public error: string;
    public data: any;

    constructor(dataOrType?: object|string) {
        if (typeof dataOrType === 'object') {

            if (dataOrType['message_id']) {
                this.message_id = dataOrType['message_id'];
            }

            if (dataOrType['message_channel']) {
                this.message_channel = dataOrType['message_channel'];
            }

            if (dataOrType['message_type']) {
                this.message_type = dataOrType['message_type'];
            }

            if (dataOrType['status']) {
                this.status = dataOrType['status'];
            }

            if (dataOrType['error']) {
                this.error = dataOrType['error'];
            }

            if (dataOrType['data']) {
                this.data = dataOrType['data'];
            }

            Object.keys(dataOrType).filter(this.rootFilter).forEach((key) => {
                if (dataOrType.hasOwnProperty(key)) {
                    this.setData(key, dataOrType[key]);
                }
            });

        } else if (typeof dataOrType === 'string') {
            this.message_type = dataOrType;
        }

        if (!this.message_id) {
            this.message_id = TyrionApiBackend.uuid();
        }
    }

    public setData(key: string, value: any) {
        if (!this.data) {
            this.data = {};
        }

        this.data[key] = value;
    }

    public isSuccessful(): boolean {
        return this.status && this.status === 'success';
    }

    public stringify(): string {
        let data: object = this.data || {};
        data['message_id'] = this.message_id;
        data['message_type'] = this.message_type;
        data['message_channel'] = this.message_channel;

        if (this.status) {
            data['status'] = this.status;
        }

        return JSON.stringify(data);
    }

    protected rootFilter(key: string): boolean {
        return key !== 'message_id'
            && key !== 'message_channel'
            && key !== 'message_type'
            && key !== 'status'
            && key !== 'error'
            && key !== 'data';
    }
}
