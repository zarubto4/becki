/*
* Created by DominikKrisztof 13.3.2017
*/

export class StaticTranslation {
    public static translate: { [lang: string]: { [key: string]: string } } = {
        'en': {
            'hello_world': 'Hello world!'
        },
        'cz': {
            'hello_world': 'Ahoj světe!'
        }
    };

    public static translateTables: { [lang: string]: { [key: string]: { [key: string]: string } } } = {
        'en': {
            'board_state': {
                'UNKNOWN': 'unknown',
                'NO_COLLISION': 'We are not found any collisions',
                'ALREADY_IN_INSTANCE': 'Attention! Hardware is already running in the Instance',
                'PLANNED_UPDATE': 'the update is planned',
            },
            'device_alerts': {
                'BOOTLOADER_REQUIRED': 'Bootloader update is required',
                'RESTART_REQUIRED': 'Device restart is required'
            }
        },
        'cz': {
            'board_state': {
                'UNKNOWN': 'neznámé',
                'NO_COLLISION': 'Nenašli jsme žádné konflikty',
                'ALREADY_IN_INSTANCE': 'Pozor! Daný hardware je již v instanci',
                'PLANNED_UPDATE': 'naplánovaná aktualizace',
            }
        }
    };
}
