/*
* Created by DominikKrisztof 13.3.2017
*/

export class StaticTranslation {
    public static translate: { [lang: string]: { [keyOrEnv: string]: ( string | { [key: string]: string } ) } } = {
        'en': {
            'DashboardComponent': {
                'hello_world': 'Welcome {0}!',
                'btn_save': 'Save it!',
            },
            'btn_save': 'Save',
            'hello_world': 'Hello {0}! {1}?',
        },
        'cz': {
            'hello_world': 'Ahoj {0}! {1}?',
        }
    };

    public static translateTables: { [lang: string]: { [tableOrEnv: string]: { [keyOrTable: string]: ( string |  { [key: string]: string } ) } } } = {
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
