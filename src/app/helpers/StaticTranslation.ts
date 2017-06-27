/*
* Created by DominikKrisztof 13.3.2017
*/

export class StaticTranslation {
    /* tslint:disable:max-line-length */
    /* <!-- <br><br><b>TODO: DELETE ME! -></b> {{'hello_world'|bkTranslate:this:'Becki':55}} -->*/
    // TODO: delete me! -> alert(this.translate('hello_world', 'Pepa', 66))

    public static translate: { [lang: string]: { [keyOrEnv: string]: (string | { [key: string]: string }) } } = {
        'en': {
            'DashboardComponent': {

                'hello_world': 'Welcome {0}!',

                'btn_save': 'Save it!',
                'title_first_steps': 'First steps',
                'main_title': 'Dashboard',
                'title': 'Welcome to Byzance <strong style="color: #36c6d3;"> PORTAL </strong> ',
                'dashboard_info_text': 'We are Byzance – a technological laboratory of advanced automatization developing a toolkit for design, development and managing the ‘Internet of Things’ (IoT) for industrial uses. We do not create smart washing machines, nor smart city furniture. We develop everything for our customers to let them do it themselves, easily and without any problems.',
                'step_one': '<strong class="font-grey" style="font-size: 1.5em;">1.</strong> Select best matching <strong>tariff</strong> for you and create your <strong>product</strong> in <a [routerLink]="[\'/financial\']\">Financial section</a>',
                'step_two': '<strong class="font-grey" style="font-size: 1.5em;">2.</strong> Create your first <strong>project</strong> in <a [routerLink]="[\'/projects\']">Projects section</a>',
                'step_three': '<strong class="font-grey" style="font-size: 1.5em;">3.</strong> Create your own Byzance<strong class="font-color-code">CODE</strong>, Byzance<strong class="font-color-grid">GRID</strong> and Byzance<strong class="font-color-blocko">BLOCKO</strong> programs',
                'step_four': '<strong class="font-grey" style="font-size: 1.5em;">4.</strong> Run it on Byzance<strong class="font-color-hardware">HARDWARE</strong> and in Byzance<strong class="font-color-cloud">CLOUD</strong>.',

            }, 'CreateUserComponent': {
                'title': 'Create new user',
                'info_text': 'Enter your e-mail address, nickname, name and password.',
                'label_nick_name': 'Nick name',
                'label_full_name': 'Full name',
                'label_password_again': 'Password again',
                'flash_email_was_send': 'email with instructions was sent',
                'flash_email_cant_be_sent': 'email cannot be sent, {0}',

            }, 'Error404Component': {
                'title': 'Oops! You\'re lost.',
                'info_text': 'We can not find the page you\'re looking for.',
                'btn_return': 'Return home',
                'btn_back': 'Go back',

            }, 'FinancialProductBillingComponent': {
                'title': 'Billings',

            }, 'FinancialProductExtensionsComponent': {
                'title': 'Extensions',
                'label_average_monthly_cost': 'Average monthly cost',
                'label_no_extensions': 'No extensions',

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
                'no_invoice': 'No invoice',
                'flash_invoice_been_resend': 'The invoice has been resended on general invoice email.',
                'flash_invoice_cant_be_resend': 'The invoice can not been resend',

            }, 'ProductRegistrationComponent': {
                'main_title': 'product registration',
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


                'text_unknown': 'Unknown',
                'label_free': 'Free',
                'average_monthly_cost': 'Average monthly cost',
                'btn_select': 'Select',
                'btn_confirm': 'Confirm',
                'btn_included': 'Included',
                'ribbon_selected': 'Selected',
                'flash_product_created_prepaid': 'Product was created, you are now on pre-paid credit',
                'flash_product_created': 'Product was created, now you can create a new project',

            }, 'FinancialProductComponent': {
                'main_title': 'Financial',
                'title': 'Dashboard',
                'btn_add_credit': 'Add credit',
                'label_core_details': 'Core details',
                'label_id_subscription': 'ID Subscription',
                'label_country': 'Country',
                'label_plan': 'Plan',
                'label_status': 'Status',
                'option_active': 'active',
                'option_hibernation': 'hibernation',
                'label_financial_status': 'Financial status',
                'label_created': 'Created',
                'label_remaining_credit': 'Remaining credit',
                'label_other_details': 'Other details',
                'label_contacts_details': 'Contacts details',


            }, 'FinancialComponent': {
                'main_title': 'Hardware types',
                'title': 'Products',
                'btn_add_product': 'Add product',
                'table_name': 'Name',
                'table_type': 'Type',
                'table_subscription_id': 'Subscription id',
                'label_bank_transfer': 'Bank transfer',
                'label_credits': 'Credits',
                'label_credit_card': 'Credit Card',
                'label_free': 'Free',
                'label_not_set_yet': 'Not set yet',
                'label_no_product': 'No product',
                'flash_products_cant_load': 'Products cannot be loaded {0}'

            }, 'HardwareHardwareTypeComponent': {
                'main_title': 'Hardware types',
                'label_name': 'Name',
                'label_description': 'Description',
                'label_producer': 'Producer',
                'label_processor': 'Processor',
                'label_target_name': 'Target name',
                'label_abilities': 'Abilities',
                'label_ethernet': 'Ethernet',
                'label_wifi': 'Wi-Fi',
                'text_ethernet_with_poe': 'Ethernet with PoE',
                'label_bootloader': 'Bootlader',
                'label_bootloader_name': 'Name',
                'label_bootloader_description': 'Description',
                'label_bootlaoder_date': 'Date',

            }, 'HardwareComponent': {
                'main_title': 'Hardware types',
                'flash_project_cant_load': 'Projects cannot be loaded {0} '

            }, 'ForgotPasswordComponent': {
                'title': 'Forget Password ?',
                'info_text': 'Enter your e-mail address below to reset your password.',
                'flash_email_sent': 'email with instructions was sent',
                'flash_email_not_sent': 'email cannot be sent, {0}',

            }, 'PasswordRestartComponent': {
                'title': 'Restart password',
                'info_text': 'Enter your e-mail address and new password',
                'label_confirm_password': 'confirm password',

                'flash_password_change_fail': 'password cannot be changed, {0}',
                'flash_password_change_success': 'password was successfully changed',

            }, 'LoginComponent': {
                'label_log_in': 'Log In',
                'label_forget_password': 'Forgot Password?',
                'label_login_social': 'Login or sign up with',
                'btn_create_account': 'Create an account',
                'btn_login': 'Login',
                'btn_resend': 'Resend',
                'msg_login_user_cant_login': 'The user cannot be logged in.\n {0}',
                'msg_login_resend_vertification': '{0} \n press resend button to send vertifiaction Email again',
                'msg_login_error': 'Error was occurred, when trying to login.',
                'msg_login_email_sent': 'Email with vertifiaction was sent',

            }, 'LogoutComponent': {
                'label_log_out': 'Log Out',
                'label_log_in': 'Log In',
                'msg_logout_cant_log_out': 'Current user cannot be logged out.\n {0}',

            }, 'NotificationsComponent': {
                'main_title': 'Notifications',
                'title': 'Notifications',
                'label_load_older': 'Load older notifications',
                'label_displaying_notif': 'Displaying <b>{0}</b> of total <b>{1}</b> notifications',
                'label_notif_undead': '(<b>{{0}}</b> unread)',
                'flash_cant_load': 'Cannot load notifications',

            }, 'ProducersProducerComponent': {
                'main_title': 'Producers',
                'title': 'Producer',
                'label_available_devices': 'Available devices',
                'label_no_device': 'No device is available.',
                'flash_project_cant_load': 'Project cannot be loaded, {0}',

            }, 'ProducersComponent': {
                'main_title': 'Producers',
                'title': 'Producers',
                'table_name': 'Name',
                'table_description': 'Description',
                'label_no_producer': 'No producer is available.',
                'flash_project_cant_load': 'Project cannot be loaded. {0}',

            }, 'ProfileComponent': {
                'main_title': 'Profile',
                'title': 'Profile account',
                'nav_personal_info': 'Personal info',
                'nav_avatar': 'Change avatar  ',
                'nav_password': 'Change password',
                'nav_email': 'Change e-mail',

                'label_full_name': 'Full Name',
                'label_nick_name': 'Nick Name',
                'label_gender': 'Gender',
                'label_state': 'State',
                'label_avatar_unsaved': '<h4>Avatar<span *ngIf="cropperLoaded" class="font-red"> (Unsaved)</span></h4>',
                'label_select_avatar': 'Select another avatar',
                'label_current_password': 'Current password   ',
                'label_new_password': 'New password',
                'label_new_password_again': 'New password again',
                'label_current_email': 'Current e-mail',
                'label_new_email': 'New e-mail',
                'label_new_email_again': 'New e-mail again',

                'btn_change_password': 'Change password',
                'btn_change_email': 'Change e-mail',

                'flash_cant_change_password': 'Cannot change password {0}',
                'flash_email_was_send': 'Email with instructions was sent.',
                'flash_user_cant_log_out': 'This user cannot be log out {0}',
                'flash_cant_change_email': 'Cannot change email {0}',
                'flash_image_too_small': 'Image is too small, minimal dimensions is 50x50px.',
                'flash_new_avatar_saved': 'New avatar saved successfully.',
                'flash_cant_save_avatar': 'Cannot save new avatar. {0}',
                'flash_information_updated': 'Your information was updated.',

            }, 'ProjectsProjectBlockoBlockoComponent': {

                'title': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> - program <strong>{0}</strong>',

                'label_blocko_name': '<strong class="font-color-blocko" > BLOCKO </strong> Name: <strong>{0}</strong >',
                'label_blocko_description': '<strong class="font-color-blocko">BLOCKO </strong> Description: <strong>{0}</strong >',
                'label_connections': 'Connections',
                'tab_hardware': 'Hardware',
                'tab_grid': 'Grid',
                'tab_blocko': 'Blocko',
                'tab_blocks': 'Blocks',
                'tab_instance_in_cloud': 'Instance in cloud',
                'tab_saved_versions': 'Saved versions',
                'btn_add_slave': 'Add slave device',
                'btn_add_master': 'Add master device',
                'btn_add_grid': 'Add grid project',
                'btn_clear_program': 'Clear program',
                'btn_clear_console': 'Clear console',
                'btn_upload_on_cloud': 'Upload program to Cloud',
                'btn_turn_off_instance': 'Turn off Instance',
                'btn_change_cloud_version': 'Change version in Cloud',
                'label_no_devices_added': 'No devices added in this Blocko program',
                'label_select_version': 'Select version',
                'label_no_program_version': 'No program versions',
                'label_modal_change_instance_version': 'Change instance version',
                'label_modal_change_running_instance_version': 'Do you want to change running instance version?',
                'label_modal_ok': 'OK',
                'label_modal_error': 'Error',
                'label_modal_no_main_boards': 'No available main boards hardware.',
                'label_modal_shutdown_instance': 'Shutdown instance',
                'label_modal_confirm_shutdown_instance': 'Do you want to shutdown running instance?',
                'label_no_grid_in_blocko': 'No grid projects added in this Blocko program',
                'label_modal_cant_save_blocko_hw_without_version': 'Cannot save blocko now, you have <b>hardware devices</b>, without program <b>version selected</b>.',
                'label_modal_clear_program': 'Clear program',
                'label_modal_confirm_clear_blocko_program': 'Really want clear Blocko program?',
                'label_modal_cant_save_grid_hw_without_version': 'Cannot save blocko now, you have <b>grid programs</b>, without program <b>version selected</b>.',
                'checkbox_advanced_mode': 'Advanced mode',
                'label_no_blocks_in_group': 'No blocks in this group',

                'table_name': 'Name',
                'table_in_cloud': 'In cloud',
                'table_description': 'Description',
                'table_author': 'Author',
                'table_actions': 'Actions',

                'label_cloud': 'CLOUD',
                'label_blocko': 'BLOCKO',
                'label_server': 'Server:',
                'label_instance': 'Instance:',
                'label_status': 'Status:',
                'label_version': 'Version:',
                'label_online': 'Online',
                'label_offline': 'Offline',
                'label_none': 'None',
                'label_program_version':'Program version',
                'label_console':'Console',

                'flash_cant_load_version': 'Cannot load version <b>{0}</b>`, {1}',
                'flash_cant_save_version': 'Failed saving version <b> {0} </b>, {1}',
                'flash_version_saved': 'Version <b> {0} </b> saved successfully.',
                'flash_cant_change_version': 'Cannot change version. {0}',
                'flash_cant_load_blocko_block': 'The blocko block version cannot be loaded. {0}',
                'flash_cant_add_blocko_block': 'The blocko block cannot be added.',
                'flash_cant_load_blocko_version': 'The blocko block version cannot be loaded. {0}',
                'flash_cant_update_blocko': 'The blocko cannot be updated. {0}',
                'flash_blocko_updated': 'The blocko has been updated.',
                'flash_cant_remove_blocko': 'The blocko cannot be removed. {0}',
                'flash_blocko_removed': 'The blocko has been removed',
                'flash_cant_change_information': 'Cannot change information. {0}',
                'flash_version_removed': 'The version has been removed.',
                'flash_cant_remove_version': 'The version cannot be removed.',
                'flash_cant_find_program_version': 'Program version not found',
                'flash_edit_version_been_changed': 'The version {0} has been changed.',
                'flash_edit_cant_change_version': 'The version {0} cannot be changed. {1}',
                'flash_cant_turn_instance_on': 'Cannot turn instance on. {0}',
                'flash_cant_turn_instance_off': 'Cannot turn instance off. {0}',


            },

            'label_email': 'E-mail',
            'label_password': 'Password',

            'btn_save': 'Save',
            'btn_back': 'Back',
            'btn_send': 'Send',
            'btn_submit': 'Submit',
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
