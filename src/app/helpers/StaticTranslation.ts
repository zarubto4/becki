/*
* Created by DominikKrisztof 13.3.2017
*/

export class StaticTranslation {
    /* tslint:disable:max-line-length */
    /* <!-- <br><br><b>TODO: DELETE ME! -></b> {{'hello_world'|bkTranslate:this:'Becki':55}} -->*/
    public static translate: { [lang: string]: { [keyOrEnv: string]: (string | { [key: string]: string }) } } = {
        'en': {
            'DashboardComponent': {
                'hello_world': 'Welcome {0}!',
                'btn_save': 'Save it!',
                'title_first_steps': 'First steps',
                'title_welcome_dashboard': 'Welcome to Byzance',
                'portal': 'PORTAL',
                'dashboard_info_text': 'We are Byzance – a technological laboratory of advanced automatization developing a toolkit for design, development and managing the ‘Internet of Things’ (IoT) for industrial uses. We do not create smart washing machines, nor smart city furniture. We develop everything for our customers to let them do it themselves, easily and without any problems.',
                'step_one': '<strong class="font-grey" style="font-size: 1.5em;">1.</strong> Select best matching <strong>tariff</strong> for you and create your <strong>product</strong> in <a [routerLink]="[\'/financial\']\">Financial section</a>',
                'step_two': '<strong class="font-grey" style="font-size: 1.5em;">2.</strong> Create your first <strong>project</strong> in <a [routerLink]="[\'/projects\']">Projects section</a>',
                'step_three': '<strong class="font-grey" style="font-size: 1.5em;">3.</strong> Create your own Byzance<strong class="font-color-code">CODE</strong>, Byzance<strong class="font-color-grid">GRID</strong> and Byzance<strong class="font-color-blocko">BLOCKO</strong> programs',
                'step_four': '<strong class="font-grey" style="font-size: 1.5em;">4.</strong> Run it on Byzance<strong class="font-color-hardware">HARDWARE</strong> and in Byzance<strong class="font-color-cloud">CLOUD</strong>.',

            }, 'CreateUserComponent': {
                'title': 'Create new user',
                'email': 'E-mail',
                'info_text': 'Enter your e-mail address, nickname, name and password.',
                'nick_name': 'Nick name',
                'full_name': 'Full name',
                'password': 'Password',
                'password_again': 'Password again',

            }, 'Error404Component': {
                'title': 'Oops! You\'re lost.',
                'info_text': 'We can not find the page you\'re looking for.',
                'btn_return': 'Return home',
                'btn_back': 'Go back',
            }, 'FinancialProductBillingComponent': {
                'title': 'Billings',
            }, 'FinancialProductExtensionsComponent': {
                'title': 'Extensions',
                'average_monthly_cost': 'Average monthly cost',
                'no_extensions': 'No extensions',
            }, 'FinancialProductInvoicesInvoiceComponent': {
                'title': 'Invoice {0}',
                'label_id_subscription': 'ID Subscription',
                'label_payment_mode': 'Payment Mode',
                'label_status': 'Status',
                'label_paid_in': 'Paid in',
                'label_total': 'Total',
                'table_name': 'Name',
                'table_guid': 'GUID',
                'table_billable_units': 'Billable units',
                'table_unite': 'Unite',
                'table_total_cost': 'Total cost',
            },
            'btn_save': 'Save',
            'btn_back': 'Back',
            'btn_send': 'Send',
            'hello_world': 'Hello {0}! {1}?',
        },
        'cz': {
            'hello_world': 'Ahoj {0}! {1}?',
        }
    };

    public static translateTables: { [lang: string]: { [tableOrEnv: string]: { [keyOrTable: string]: (string | { [key: string]: string }) } } } = {
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
