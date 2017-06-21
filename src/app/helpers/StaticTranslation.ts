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
            }, 'FinancialProductInvoicesComponent': {
                'title': 'Invoice',
                'btn_add_credits': 'Add credits',
                'table_invoice_id': 'Invoice ID',
                'table_total_cost': 'Total cost',
                'table_date_of_create': 'Date of create',
                'table_paid': 'Paid',
                'table_actions': 'Actions',
                'payment_required': 'Payment required',
                'no_invoice': 'No invoice'
            }, 'ProductRegistrationComponent': {
                'nav_step_one_title': 'Tariffs',
                'nav_step_one_text': 'Select a right tariffs',
                'nav_step_two_title': 'Packages',
                'nav_step_two_text': 'Choose an expansions',
                'nav_step_three_title': 'Registration info',
                'nav_step_three_text': 'Fill the necessary info',
                'nav_step_four_title': 'Summary',
                'nav_step_four_text': 'Check your order and confirm',
                'step_one_title': 'Tariffs',
                'step_two_title': 'Packages',
                'step_two_no_expansions': 'There is no expansions packages, click Continue.',


                'step_three_title': 'Registration info',
                'step_three_product_info': 'Product info',
                'step_three_billing_info': 'Billing info',
                'step_three_label_product_name': 'Product name (Your unique name for this tariff order)',

                'label_invoice_email': 'Invoice e-mail',
                'label_payment_method': 'Payment method',
                'label_personal_info': 'Personal info',
                'label_company_info': 'Company info',
                'label_full_name': 'Full name',
                'label_company_name': 'Company name',
                'label_street': 'Street',
                'label_street_number': 'Street number',
                'label_city': 'City',
                'label_zip_code': 'Zip code',
                'label_country': 'Country',
                'label_registration_number': 'Registration number',
                'label_vat_number': 'VAT number (with with country code)',
                'label_company_web': 'Company web',
                'label_company_email': 'Company authorized contact e-mail',
                'label_company_phone': 'Company authorized contact phone',

                'step_four_title': 'Summary',
                'label_registration_info': 'Registration info',
                'label_product_info': 'Product info',
                'label_product_name': 'Product name',
                'label_billing_info': 'Billing info',
                'label_your_product': 'Your product',
                'label_included': 'Included',
                'table_tarrif': 'Tariff',
                'table_description': 'Description',
                'table_price': 'Price',
                'table_packages': 'Packages',
                'table_total': 'Total',

                'label_free': 'Free',
                'average_monthly_cost': 'Average monthly cost',
                'btn_select': 'Select',
                'btn_confirm': 'Confirm',
                'btn_included': 'Included',
                'ribbon_selected': 'Selected',
            },
            'btn_save': 'Save',
            'btn_back': 'Back',
            'btn_send': 'Send',
            'btn_add': 'Add',
            'btn_edit': 'Back',
            'btn_remove': 'Remove',
            'btn_continue': 'Continue',

            'loading': 'Loading...',
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
