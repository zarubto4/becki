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
                'NO_COLLISION': 'ok',
                'ALREADY_IN_INSTANCE': 'already inside',
                'PLANNED_UPDATE': 'planned update',
            },
            'foo': {
                'bar': 'a',
                'foo': 'b',
            }
        },
        'cz': {
            'board_state': {
                'UNKNOWN': 'neznámé',
                'NO_COLLISION': 'ok',
                'ALREADY_IN_INSTANCE': 'již v instaci',
                'PLANNED_UPDATE': 'naplánovaná aktualizace',
            }
        }
    };
}
