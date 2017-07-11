/*
* Created by DominikKrisztof 13.3.2017
*/

export class StaticTranslation {
    /* tslint:disable:max-line-length */
    /* <!-- <br><br><b>TODO: DELETE ME! -></b> {{'hello_world'|bkTranslate:this:'Becki':55}} -->*/
    // TODO: delete me! -> alert(this.translate('hello_world', 'Pepa', 66))

    public static translate: { [lang: string]: { [keyOrEnv: string]: (string | { [key: string]: string }) } } = {
        'en': {
            'ModalsAddHardwareComponent': {
                'title': 'Add hardware device',
                'label_device_id': 'Hardware device ID',

            }, 'ModalsBlockoAddGridEmptyComponent': {
                'title': 'Cannot add grid project',
                'body_text': 'There is not grid program yet, let`s create it!',
                'btn_redirect': 'Redirect me to create a Grid',

            }, 'ModalsBlockoAddGridComponent': {
                'title': 'Add grid project',
                'label_grid_project': 'Grid project',
                'placeholder_grid_project': 'Select grid project',

            }, 'ModalsBlockoAddHardwareComponent': {
                'title': 'Add hardware',
                'label_hardware': 'Hardware',
                'placeholder_select_hardware': 'Select hardware',

            }, 'ModalsBlockoBlockCodeEditorComponent': {
                'title': 'Edit JS code for block',
                'label_block_color': 'Block color',
                'label_block_icon': 'Block icon',
                'label_block_description': 'Block description',
                'label_block_code': 'Block code',

            }, 'ModalsBlockoConfigPropertieComponent': {
                'title': 'Edit config for block',
                'label_configuration': 'Configuration',

            }, 'ModalsBlockoPropertiesComponent': {
                'title_edit': 'Edit blocko program properties',
                'title_add': 'Add blocko program',
                'label_blocko_program_name': 'Blocko program name',
                'label_blocko_program_description': 'Blocko program description',

            }, 'ModalsBlockoVersionSelectComponent': {
                'title': 'Change Blocko program version in cloud',
                'label_program_version': 'Program version',

            }, 'ModalsBlocksBlockPropertieComponent': {
                'title_edit': 'Edit block properties',
                'title_add': 'Add block',
                'label_block_name': 'Block name',
                'label_block_description': 'Block description',

            }, 'ModalsBlocksTypePropertiesComponent': {
                'title_edit': 'Edit blocks group properties',
                'title_add': 'Add blocks group',
                'label_blocks_group_name': 'Blocks group name',
                'Block group description': 'Block group description',

            }, 'ModalsCodeAddLibraryComponent': {
                'title': 'Add CODE library',
                'body_text': 'Displaying <b>{}0</b> of total <b>{1}</b> libraries',
                'label_load_more': 'Load more libraries',
                'label_no_more': 'No more libraries',
                'btn_select_library': '',

            }, 'ModalsCodeFileDialogComponent': {
                'label_into_directory': 'Into directory',

                'text_add_file': 'Add file',
                'btn_add_directory': 'Add directory',
                'btn_move': 'Move',

                'text_add_file_name': 'File name',
                'text_directory_name': 'Directory name',
                'text_move_file': 'Move file <b> {0}</b>',
                'text_move_directory': 'Move directory <b> {0} </b>',
                'text_rename_file': 'Rename file <b> {0}</b>',
                'text_rename_directory': 'Rename directory <b> {0 }</b>',
                'text_remove_file': 'Really want remove file <b> {0} </b> ?',
                'text_remove_library': 'Really want remove library <b> {0} </b> ?',
                'text_remove_directory': 'Really want remove directory <b> {0} </b> with all children ?',
                'text_file_name': 'File name',

            }, 'ModalsCodeLibraryVersionComponent': {
                'title': 'CODE library version',
                'label_no_library': 'No versions in library',
                'btn_select_library': 'Select library version',

            }, 'ModalsCodePropertiesComponent': {
                'title_edit': 'Edit code program properies',
                'title_add': 'Add code program',
                'label_program_name': 'Program name',
                'label_program_description': 'Program description',
                'label_device_type': 'Device type',

            }, 'ModalsDeactivateComponent': {
                'title': 'Confirm an action',
                'body_text': 'Do you really want to',
                'label_deactivate': 'deactivate',
                'label_activate': 'activate',
                'label_attention': 'Attention',


            }, 'ModalsDeviceEditDescriptionComponent': {
                'title': 'Edit hardware device properties',
                'label_hardware_device': 'Hardware device name (Your private Tag name)',
                'label_device_description': 'Device description (Your private description)',

            }, 'ModalsSendInvoiceComponent': {
                'checkbox_email': 'Specify email',
                'label_email': 'Specify email',

            }, 'ModalsGridConfigPropertiesComponent': {
                'title': 'Configuration of widget',
                'label_widget_code_version': 'Widget code version',
                'label_select_widget_version': 'widgetVersion',
                'label_interface': 'Interface',
                'label_inputs': 'Inputs',
                'label_output': 'Output',
                'label_configuration': 'Configuration',

            }, 'ModalsGridProgramPropertiesComponent': {
                'title_edit': 'Edit grid program properties',
                'title_add': 'Add grid program',
                'label_grid_program_name': 'Grid program name',
                'label_grid_program_description': 'Grid program description',

            }, 'ModalsGridProjectPropertiesComponent': {
                'title_edit': 'Edit grid project properties',
                'title_add': 'Add grid project',
                'label_grid_name': 'Grid project name',
                'label_grid_description': 'Grid project description',

            }, 'ModalsHardwareBootloaderUpdateComponent': {
                'title': 'Hardware ID',
                'label_attention': 'Attention!',
                'body_text': ' < p > We must update critical software component on your board.Program transfer takes a few seconds to Board Memory - which is safe.</p>< p > But rewriting the program in Memmory lasts 0.2 seconds. And during this time the device may not be shut down,</p>< p > restart or disconnected from the power supply etc. You risk damaging the device.</p>< p > If all our security measures fail, you must connect the device by cable to a computer and load the program manually.</p>< p > If you have any questions, please read the documentation, or visit our website at Ask.</p>',

            }, 'ModalsHardwareCodeProgramVersionSelectComponent': {
                'title': 'Select CODE program version',
                'label_program': 'Program',
                'label_no_code': 'No CODE programs',
                'label_select_program': 'Select program',
                'label_no_version': 'No versions',
                'label_not_compiled': 'Not successfully compiled',
                'btn_select_version': 'Select program version',

            }, 'ModalsInstanceEditDescriptionComponent': {
                'title': 'Edit Cloud instance properties',

            }, 'ModalsLibraryPropertiesComponent': {
                'title_edit': 'Edit code library properies',
                'title_add': 'Add code library',
                'label_library_name': 'Library name',
                'label_library_description': 'Library description',

            }, 'ModalsMembersAddComponent': {
                'title': 'Add members',
                'label_member_email': ' Member e-mail #',
                'btn_add_more': 'Add more members',

            }, 'ModalsProjectPropertiesComponent': {
                'title_edit': 'Edit project properties',
                'title_add': 'Add project',
                'label_project_name': 'Project name',
                'label_project_description ': ' Project description',
                'label_product_type': 'Product type',

            }, 'ModalsRemovalComponent': {
                'title': 'Confirm an irreversible action',
                'body_text': 'Do you really want to remove',

            }, 'ModalsSelectHardwareComponent': {
                'title': 'Select hardware',
                'label_hardware': 'Hardware',
                'placeholder_hardware': 'Select hardware',

            }, 'ModalsVersionDialogComponent': {
                'title_edit': 'Edit version',
                'title_save': 'Save version',
                'label_version_name': 'Version name',
                'label_version_description': 'Version description',

            }, 'ModalsWidgetsTypePropertiesComponent': {
                'title_add': 'Add widgets group',
                'title_edit': 'Edit widgets group properties',
                'label_widget_group_name': 'Widgets group name ',
                'label_widget_group_description': 'Widgets group description',

            }, 'ModalsWidgetsWidgetPropertiesComponent': {
                'title_edit': 'Edit widget properties',
                'title_add': 'Add widget',
                'label_widget_name': 'Widget name',
                'label_widget_description': 'Widget description',

            },

            'DashboardComponent': {
                'btn_save': 'Save it!',
                'title_first_steps': 'First steps',
                'main_title': 'Dashboard',
                'title': 'Welcome to Byzance <strong style="color: #36c6d3;"> PORTAL </strong> ',
                'dashboard_info_text': 'We are Byzance – a technological laboratory of advanced automatization developing a toolkit for design, development and managing the ‘Internet of Things’ (IoT) for industrial uses. We do not create smart washing machines, nor smart city furniture. We develop everything for our customers to let them do it themselves, easily and without any problems.',
                'step_one': '<strong class="font-grey" style="font-size: 1.5em;">1.</strong> Select best matching <strong>tariff</strong> for you and create your <strong>product</strong> in <a onclick="ngNavigate([\'/financial\'])">Financial section</a>',
                'step_two': '<strong class="font-grey" style="font-size: 1.5em;">2.</strong> Create your first <strong>project</strong> in <a onclick="ngNavigate([\'/projects\'])">Projects section</a>',
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
                'label_displaying_notif': 'Displaying <b>{0}</b> notification. Total Unread notifications: <b>{1}</b>',
                'label_notif_undead': '(<b>{0}</b> unread)',
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
                'label_avatar': 'Avatar',
                'label_unsaved': '(Unsaved)',
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
                'label_program_version': 'Program version',
                'label_console': 'Console',

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

            }, 'ProjectsProjectHardwareComponent': {

                'title': 'Byzance<strong class="font-color-hardware">HARDWARE</strong> - all devices',
                'label_name': 'Name',
                'label_id': 'ID',
                'label_description': 'Description',
                'label_type': 'Type',
                'label_status': 'Status',
                'label_actions': 'Actions',
                'btn_add_hardware': ' Add hardware device',
                'label_online': 'online',
                'label_offline': 'offline',
                'label_no_hardware': 'There is no history for this instance',
                'label_no_hardware_comment': 'You can add it by click on button bellow.',

                'flash_add_device_success': 'The hardware {0} has been added to project.',
                'flash_add_device_fail': 'The hardware {0} cannot be added to project, {1}',
                'flash_edit_device_success': 'The device description was updated.',
                'flash_edit_device_fail': 'The device cannot be updated. {0}',
                'flash_remove_device_success': 'The hardware has been removed.',
                'flash_remove_device_fail': 'The hardware cannot be removed. {0}',

            }, 'ProjectsProjectHardwareHardwareComponent': {

                'title': 'Byzance<strong class="font-color-hardware">HARDWARE</strong> - device <strong>{0}</strong>',

                'tab_overview': 'Overview',
                'tab_update': 'Update progress',

                'label_name': 'Name',
                'label_version': 'Version',
                'label_description': 'Description',
                'label_type': 'Type',
                'label_producer': 'Producer',
                'label_revision': 'Revision',
                'label_id': 'ID',
                'label_ethernet_address': 'Ethernet MAC address',
                'label_wifi_address': 'Wi-Fi MAC address',
                'label_device_status': 'Device status',
                'label_device_last_seen': 'Last seen',
                'label_bootloader_version': 'Bootloader version',
                'label_unknow': '(Unknown)',
                'label_update_to': 'Update to',
                'label_alerts': 'Alerts',
                'label_main_server': 'Main Server',
                'label_main_server_not_found': 'Device not connected to Server yet',
                'label_instance': 'Instance',
                'label_not_in_instance': 'Device is not connected to an instance',
                'label_online': 'online',
                'label_offline': 'offline',
                'label_none': 'none',

                'label_actual_program_name': 'Actual program name',
                'label_actual_program_version': 'Actual Program version',
                'label_actual_backup_program_name': 'Actual Backup program name',
                'label_actual_backup_program_version': 'Actual Backup program version',
                'label_backup_mode': 'Backup mode',
                'label_backup_static': 'Static Backup',
                'label_backup_automatic': 'Automatic Backup',
                'label_switch_to_automatic': 'switch to <strong>Automatic</strong>',
                'label_switch_to_static': 'switch to <strong>Static</strong>',
                'label_time_missing_in_json': 'Not yet (Unknown)',
                'label_not_set_none': 'none',

                'table_id': 'ID',
                'table_finished': 'Finished',
                'table_started': 'Started',
                'table_program': 'Program',
                'table_version': 'Version',
                'table_status': 'Status',
                'table_type': 'Type',


                'flash_edit_device_success': 'The device description was updated.',
                'flash_edit_device_fail': 'The device cannot be updated. {0}',
                'flash_remove_device_success': 'The hardware has been removed.',
                'flash_remove_device_fail': 'The hardware cannot be removed. {0}',
                'flash_cant_update_bootloader': 'Cannot update Bootloader now. {0}',
                'flash_cant_edit_backup_mode': 'Device backup mode cannot be saved. {0}',

            }, 'ProjectsProjectInstancesComponent': {

                'title': 'Byzance<strong class="font-color-cloud">CLOUD</strong> - all instances',

                'table_name': 'Instance name',
                'table_id': 'Instance Id',
                'table_description': 'Description',
                'table_blocko_program': 'Program',
                'table_status': 'Status',
                'table_actions': 'Actions',

                'flash_instance_edit_success': 'The Instance description was updated.',
                'flash_instance_edit_fail': 'The Instance cannot be updated. {0}',

                'label_shut_down_instance_modal': 'Shutdown instance',
                'label_shut_down_instance_modal_comment': 'Do you want to shutdown running instance?',
                'label_upload_instance_modal': 'Upload and run into cloud',
                'label_upload_instance_modal_comment': 'There is not any instance in cloud.',
                'label_upload_error': 'Cannot turn instance off. {0}',
                'label_no_item': 'There is not any instance in cloud.',
                'label_you_can_create': 'Do you want to upload Blocko and running instance in Cloud?',

            }, 'ProjectsProjectInstancesInstanceComponent': {

                'title': 'Byzance<strong class="font-color-cloud">CLOUD</strong> - instance <strong>{0}</strong>',

                'tab_name_overview': 'Overview',
                'tab_name_hardware': 'Integrated Hardware',
                'tab_name_grid': 'Integrated Apps',
                'tab_name_history': 'History',
                'tab_name_update_progress': 'Update Progress',
                'tab_name_update_view': 'Realtime View',

                'table_name': 'Name',
                'table_id': 'Id',
                'table_hardware_type': 'Device Type',
                'table_description': 'Description',
                'table_actions': 'Actions',

                'btn_change_version_in_cloud': 'Change version in Cloud',
                'label_instance_name': 'Instance Name',
                'label_instance_description': 'Instance Description',
                'label_instance_id': 'Instance Id',
                'label_server_name': 'Server Name',
                'label_instance_status': 'Instance Status',
                'label_status': 'Status:',
                'label_info': 'Info',
                'label_instance_info_is_offline': 'This instance is offline',
                'label_instance_type': 'Instance Type',
                'label_created': 'Created',
                'label_running_from': 'Running from',
                'label_running_to': 'Running to',
                'label_running_status': 'Running status',
                'label_planned': 'Planned',
                'label_progress': 'Progress',
                'label_project': 'Project',
                'label_program': 'Program',
                'label_finished': 'Finished',
                'label_firmware_type': 'Firmware Type',
                'label_version': 'Version',
                'label_description': 'Description',
                'label_no_history_in_instance': 'There is no history for this instance',
                'label_hardware_actual_in_instance': 'Actual in Instance',
                'label_hardware_no_hardware_in_instance': 'No Hardware projects in this instance',
                'label_grid_no_grid_in_instance': 'No Grid projects in this instance',

                'label_modal_shutdown_instance': 'Shutdown instance',
                'label_modal_confirm_shutdown_instance': 'Do you want to shutdown running instance?',
                'label_modal_run_latest_version': 'Upload and run into cloud in latest running version',
                'label_modal_confirm_run_latest_version': 'Do you want to upload Blocko and running instance in Cloud?',
                'label_cannot_execute': 'Can not execute the command. {0}',
                'label_cannot_change_version': 'Cannot change version. {0}',
                'label_cannot_change_program_publicity': 'Cannot change program publicity. {0}',
                'label_modal_change_instance_version': 'Change instance version',
                'label_modal_change_running_instance_version': 'Do you want to change running instance version?',

                'flash_instance_edit_success': 'The Instance description was updated.',
                'flash_instance_edit_fail': 'The Instance cannot be updated. {0}',

            }, 'ProjectsProjectLibrariesComponent': {

                'title': 'Byzance<strong class="font-color-code">CODE</strong> - all libraries',

                'btn_add_library': 'Add <strong class="font-color-grid">CODE</strong> Library',

                'flash_library_add_success': 'The Code Library has been created.',
                'flash_library_add_fail': 'The Code Library {0} cannot be created. {0}',
                'flash_library_edit_success': 'The Library has been updated.',
                'flash_library_edit_fail': 'The Library cannot be updated. {0}',
                'flash_library_removed_success': 'The Library has been removed.',
                'flash_library_removed_fail': 'The Library cannot be removed. {0}',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',

            }, 'ProjectsProjectLibrariesLibraryComponent': {

                'title': 'Byzance<strong class="font-color-code">CODE</strong> - library <strong>{0}</strong>',

                'flash_library_edit_success': 'The Library has been updated.',
                'flash_library_edit_fail': 'The Library cannot be updated. {0}',
                'flash_library_removed_success': 'The Library has been removed.',
                'flash_library_removed_fail': 'The Library cannot be removed. {0}',
                'flash_version_save_success': 'The version <b> {0} </b> saved successfully.',
                'flash_version_save_fail': 'Failed saving version <b> {0} </b>. {1}',
                'flash_version_edit_success': 'The version <b> {0} </b> saved successfully.',
                'flash_version_edit_fail': 'Failed saving version <b> {0} </b>. {1}',
                'flash_version_removed_success': 'The version has been removed.',
                'flash_version_removed_fail': 'The version cannot be removed. {0}',
                'flash_cannot_load_library': 'The Library cannot be loaded.',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',

                'label_name': 'Library Name',
                'label_description': 'Description',
                'label_version': 'Version',

            }, 'ProjectsProjectMembersComponent': {

                'project_members_title': 'Project members',

                'btn_add_members': 'Add members',

                'table_name': 'Name',
                'table_state': 'Description',
                'table_actions': 'Actions',

                'no_persons_in_this_projects': 'No members in this project',

                'label_cannot_remove_yourself': 'Cannot remove yourself from project.',
                'label_cannot_add_member': 'Cannot add members. {0}',
                'label_cannot_delete_person': 'Cannot delete member. {0}',
                'label_cannot_resend_invitation': 'Cannot resend invitation. {0}',
                'label_invitation_sent': 'Invitation sent',

            }, 'ProjectsProjectWidgetsComponent': {

                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - all widgets groups',

                'btn_add_widget_group': 'Add widgets group',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',

                'flash_grid_group_add_success': 'The version has been successfully created.',
                'flash_grid_group_add_fail': 'The version cannot be created. {0}',
                'flash_grid_group_edit_success': 'The version has been changed.',
                'flash_grid_group_edit_fail': 'The version cannot be changed. {0}',
                'flash_grid_group_remove_success': 'The version has been removed.',
                'flash_grid_group_remove_fail': 'The version cannot be removed. {0}',

                'label_no_item': 'There is not any widgets group in this project',
                'label_you_can_create': 'You can create it by click on button bellow.',

            }, 'ProjectsProjectWidgetsWidgetsComponent': {

                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - widgets group <strong>{0}</strong>',

                'btn_add_widget': 'Add widget',
                'widget_group_name': 'Widget Collection Name',
                'widget_group_description': 'Description',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',

                'flash_grid_group_add_fail': 'The version cannot be created. {0}',
                'flash_grid_group_edit_success': 'The version has been changed.',
                'flash_grid_group_edit_fail': 'The version cannot be changed. {0}',
                'flash_grid_group_remove_success': 'The version has been removed.',
                'flash_grid_group_remove_fail': 'The version cannot be removed. {0}',
                'flash_widget_add_success': 'The version has been successfully created.',
                'flash_widget_add_fail': 'The version cannot be created. {0}',
                'flash_widget_removed_success': 'The widget has been removed.',
                'flash_widget_removed_fail': 'The widget cannot be removed. {0}',
                'flash_widget_edit_success': 'The widget has been edited.',
                'flash_widget_edit_fail': 'The widget cannot be edited. {0}',

                'label_no_item': 'There is not any widget in this group',
                'label_you_can_create': 'You can create it by click on button bellow.',

            }, 'ProjectsProjectWidgetsWidgetsWidgetComponent': {

                'flash_version_save_success': 'The version <b> {0} </b> saved successfully.',
                'flash_version_save_fail': 'Failed saving version <b> {0} </b>. {1}',
                'flash_version_removed_success': 'The version has been removed.',
                'flash_version_removed_fail': 'The version cannot be removed. {0}',
                'flash_version_changed_success': 'The version {0} has been changed.',
                'flash_version_changed_fail': 'The version {0} cannot be changed. {1}',
                'flash_version_load_fail': 'The version {0} cannot be loaded. {1}',
                'flash_widget_removed_success': 'The widget has been removed.',
                'flash_widget_removed_fail': 'The widget cannot be removed. {}',
                'flash_widget_edit_success': 'The widget has been edited.',
                'flash_widget_edit_fail': 'The widget cannot be edited. {0}',

                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - widget <strong>{0}</strong>',

                'label_widget_code': 'Widget Code',
                'label_name': 'Name',
                'label_description': 'Description',
                'label_grid_group_name': 'Widget Collection',
                'label_version': 'Version:',
                'label_code': 'Code',
                'label_build_errors': 'Build Errors',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_author': 'Author',
                'table_actions': 'Actions',

            }, 'ProjectsProjectBlockoComponent': {
                'title': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> - all programs',

                'label_blocko_remove': 'Remove blocko program',
                'label_blocko_program_properties': 'Blocko program properties',
                'label_no_blocko_program': 'There is not any blocko program',
                'label_create_blocko_text': 'You can create it by click on button bellow.',
                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'btn_add_blocko_program': 'Add blocko program',

                'flash_blocko_remove': 'The blocko has been removed.',
                'flash_blocko_cant_remove': 'The blocko cannot be removed. {0}',
                'flash_blocko_add_to_project': 'The blocko {0} has been added to project.',
                'flash_blocko_cant_add_to_project': 'The blocko {0} cannot be added to project.`, {1}',
                'flash_blocko_update': 'The blocko has been updated.',
                'flash_blocko_cant_update': 'The blocko cannot be updated. {0}',

            }, 'ProjectsProjectBlocksBlocksBlockComponent': {
                'title': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> - block <strong>{0}</strong>',

                'label_group_properties': 'Group properties',
                'label_group_remove': 'Remove Group',
                'label_code': 'Code',
                'label_version': 'Version',
                'label_block_color': 'Block color',
                'label_block_icon': 'Block icon',
                'label_block_description': 'Block description',
                'label_block_code': 'Block code',
                'label_test': 'Test',
                'label_press_test_button': 'For test press button here',
                'label_imputs_simulator': 'Inputs simulator',
                'label_value': 'Value',
                'label_datatype_boolean': 'boolean <strong>Arg #{0}</strong>',
                'label_datatype_float': 'float <strong>Arg #{0}</strong>',
                'label_datatype_integer': 'integer <strong>Arg #{0}</strong>',
                'label_datatype_string': 'string <strong>Arg #{0}</strong>',
                'label_block': 'block',
                'label_console': 'Console',
                'label_saved_versions': 'Saved versions',
                'label_device_properties': 'Device properties',
                'label_remove_device': 'Remove device',

                'table_version_name': 'Version Name',
                'table_description': 'Description',
                'table_author': 'Author',
                'table_actions': 'Actions',


                'ts_error_typescript_error': 'TypeScript Error',
                'ts_error_block_error': 'Block Error',
                'ts_error_block_error_code_empty': 'Block code cannot be empty',

                'bool_true': 'true',
                'bool_false': 'false',
                'btn_test': 'Test',


                'flash_cant_save_version': 'Failed saving version <b> {0} </b >, {1}',
                'flash_version_save': 'Version <b> {0} </b> saved successfully.',
                'flash_block_code_empty': '{0}: Block Error, {1}: Block code cannot be empty',
                'flash_cant_load_block': 'The block cannot be loaded. {0}',
                'flash_blocko_edit': 'The block has been edited.',
                'flash_cant_edit_block': 'The block cannot be edited. {0}',
                'flash_block_remove': 'The block has been removed.',
                'flash_cant_remove_block': 'The block cannot be removed. {0}',
                'flash_version_remove': 'The version has been removed.',
                'flash_cant_remove_version': 'The version cannot be removed. {0}',
                'flash_version_change': 'The version {0} has been changed.',
                'flash_cant_change_version': 'The version {0} cannot be changed. {1}',
                'flash_cant_load_block_version': 'The block version cannot be loaded. {0}',

            }, 'ProjectsProjectBlocksBlocksComponent': {
                'title': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> - blocks group: <strong>{0}</strong>',
                'label_group_properties': 'Group properties',
                'label_group_remove': 'Remove Group',
                'label_block_properties': 'Block properties',
                'label_block_remove': 'Remove block',

                'label_blocko_name': '<strong class="font-color-blocko">BLOCKO</strong> Name: <strong>{0}</strong>',
                'label_blocko_description': '<strong class="font-color-blocko">BLOCKO</strong> Description: <strong>{0}</strong>',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'label_no_block_program': 'There is not any blocks in this group',
                'label_create_block_text': 'You can create it by click on button bellow.',

                'btn_add_block': 'Add block',

                'flash_block_groups_edit': 'The blocks group has been edited.',
                'flash_cant_edit_block_groups': 'The blocks group cannot be edited. {0}',
                'flash_block_groups_remove': 'The blocks group has been removed.',
                'flash_cant_remove_block_groups': 'The blocks group cannot be removed. {0}',
                'flash_block_add': 'The block has been added.',
                'flash_cant_add_block': 'The block cannot be added. {0}',
                'flash_block_edit': 'The block has been edited.',
                'flash_cant_edit_block': 'The block cannot be edited. {0}',
                'flash_block_remove': 'The block has been removed.',
                'flash_cant_remove_block': 'The block cannot be removed. {0}',

            }, 'ProjectsProjectBlocksComponent': {
                'title': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> - all blocks groups',
                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'label_group_properties': 'Group properties',
                'label_group_remove': 'Remove Group',

                'btn_add_blocks_group': 'Add blocks group',
                'flash_block_group_add': 'The blocks group has been added.',
                'flash_cant_add_block_group': 'The blocks group cannot be added. {0}',
                'flash_block_group_edit': 'The blocks group has been edited.',
                'flash_cant_edit_block_group': 'The blocks group cannot be edited. {0}',
                'flash_block_group_remove': 'The blocks group has been removed.',
                'flash_cant_remove_block_group': 'The blocks group cannot be removed. {0}',
                'label_no_blocko_group': 'There is not any group of blocks',
                'label_create_blocko_group_text': 'You can create it by click on button bellow.',

            }, 'ProjectsProjectCodeCodeComponent': {

                'title': 'Byzance<strong class="font-color-code">CODE</strong> - program <strong>{0}</strong>',

                'label_device_properities': 'Device properties',
                'label_remove_device': 'Remove device',
                'label_code_name': '<strong class="font-color-code">CODE</strong> Name: <strong>{0}</strong>',
                'label_code_description': '<strong class="font-color-code">CODE</strong> Description: <strong>{0}</strong>',
                'label_hardware_type': '<strong class="font-color-hardware">Hardware</strong> Type',
                'label_ide': 'IDE',
                'label_version': 'Version',
                'label_build_error': 'Build errors',
                'label_file_and_line': 'File: <b>{0}</b> Line: <b>{1}</b>',
                'label_blocko_interface_preview': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> interface preview',
                'label_saved_versions': 'Saved versions',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_author': 'Author',
                'table_status': 'Status',
                'table_actions': 'Actions',

                'btn_build': 'Build',
                'btn_upload_to_hardware': 'Upload to Hardware',

                'codefile_library_version_dont_have_readme': '{0} ({1}), # Library {2}\n\nVersion: {3}\n\nLooks like this library doesn\'t have README.md file.',
                'codefile_library_version_short_dont_have_readme': '# Library {0}\n\nVersion: {1}\n\nLooks like this library doesn\'t have README.md file.',
                'text_unsaved_change_reload': 'You have <b> unsaved changes</b> in version <b> {0} </b>, do you really want reload this version?',
                'text_unsaved_change_switch': 'You have <b> unsaved changes</b> in version <b> {0} </b>, do you really want switch to version <b> {1} </b>?',
                'text_changed_files': '<h5>Changed files:</h5>',

                'modal_label_save_same_code': 'Save same code?',
                'modal_text_no_change': 'No changes have been made, are you sure you want to save this code?',
                'modal_label_error': 'Error',
                'modal_text_no_yoda': 'No available yoda G2 boards hardware.',

                'flash_update_success': 'Uploading was done successfully',
                'flash_cant_upload_code': 'Uploading code failed',
                'flash_code_version_build_success': 'Build successfully.',
                'flash_code_version_save': 'Version <b> {0} </b> saved successfully.',
                'flash_cant_save_code_version': 'Failed saving version <b> {0} </b> {1}',
                'flash_code_remove': 'The code has been removed.',
                'flash_cant_remove_code': 'The code cannot be removed. {0}',
                'flash_code_update': 'The code has been updated.',
                'flash_cant_update_code': 'The code cannot be updated. {0}',
                'flash_code_version_remove': 'The version has been removed.',
                'flash_cant_remove_code_version': 'The version cannot be removed. {0}',
                'flash_code_version_change': 'The version {0} has been changed.',
                'flash_cant_change_code_version': 'The version {0} cannot be changed. {1}',
                'flash_cant_load_code_types': 'The code types cannot be loaded. {0}',
                'flash_cant_load_version': 'Cannot load version <b>{0}</b>, {1}',

            }, 'ProjectsProjectCodeComponent': {
                'title': 'Byzance<strong class="font-color-code">CODE</strong> - all programs',
                'btn_add_code_program': 'Add code program',
                'label_code_program_properties': 'Code program properties',
                'label_remove_code_program': 'Remove code program',

                'label_no_code': 'There is not any code program',
                'label_create_code_text': 'You can create it by click on button bellow.',

                'table_name': 'Name',
                'table_hardware_type': '<strong class="font-color-hardware">Hardware</strong> type',
                'table_description': 'Description',
                'table_actions': 'Actions',

                'flash_cant_update_code': 'The code cannot be updated. {0}',
                'flash_code_update': 'The code has been updated.',
                'flash_cant_add_code_to_project_with_reason': 'The code {0} cannot be added to project. {1}',
                'flash_code_add_to_project': 'The code {0} has been added to project.',
                'flash_cant_add_code_to_project': 'The code cannot be added to project.',
                'flash_code_remove': 'The code has been removed.',
                'flash_cant_remove_code': 'The code cannot be removed. {0}',

            }, 'ProjectsProjectGridGridsGridComponent': {
                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - program <strong>{0}</strong>',

                'label_program_properties': 'Program properties',
                'label_program_delete': 'Delete Program',
                'label_version': 'Version',
                'label_grid_size_class': 'Grid size class',
                'label_console': 'Console',
                'label_saved_versions': 'Saved versions',
                'label_grid_program_name': '<strong class="font-color-grid" > GRID </strong> Program Name: <strong>{0}</strong>',
                'label_grid_description': '<strong class="font-color-grid" > GRID </strong> Description: <strong>{0}</strong>',
                'label_grid_grid_project': '<strong class="font-color-grid" > GRID </strong> Grid project',
                'label_grid': 'Grid',
                'label_widgets': 'Widgets',
                'label_no_widgets': 'No widgets in this group',
                'label_device_properties': 'Device properties',
                'label_device_remove': 'Remove device',
                'label_version_name': 'Version Name',
                'label_description': 'Description',
                'label_author': 'Author',
                'label_actions': 'Actions',

                'option_mobile': 'Mobile',
                'option_tablet': 'Tablet',
                'option_desktop': 'Desktop',

                'btn_add_page': 'Add page',
                'btn_clear_console': 'Clear console',
                'modal_label_grid_size_change': 'Grid size class change',
                'modal_text_grid_size_change': 'Changing grid size class <strong>delete all your pages</strong>, are you sure?',

                'flash_cant_load_widget_version': 'Cannot load widget version, {0}',
                'flash_cant_save_version': 'Failed saving version <b>{0}</b >, {1}',
                'flash_version_save': 'Version <b> {0} </b> saved successfully.',
                'flash_cant_remove_grid': 'The grid program cannot be removed. {0}',
                'flash_grid_remove': 'The grid program has been removed.',
                'flash_grid_edit': 'The grid program has been edited.',
                'flash_cant_edit_grid': 'The grid program cannot be edited. {0}',
                'flash_cant_load_version': 'Cannot load version <b>{0}</b> {1}',
                'flash_cant_load_grid': 'The grid cannot be loaded. {0}',
                'flash_cant_change_version': 'The version {0} cannot be changed. {1}',
                'flash_version_change': 'The version {0} has been changed.',
                'flash_version_remove': 'The version has been removed.',
                'flash_cant_remove_version': 'The version cannot be removed. {0}',

            }, 'ProjectsProjectGridGridsComponent': {
                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - project <strong>{0}</strong>',
                'label_device_properties': 'Device properties',
                'label_device_remove': 'Remove device',
                'label_program_properties': 'Program properties',
                'label_program_remove': 'Remove program',
                'label_no_grid': 'There is not any grid program',
                'label_create_grid_text': 'You can create it by click on button bellow.',

                'btn_add_grid_program': 'Add grid program',
                'label_grid_project_name': '<strong class="font-color-grid">GRID</strong> Project Name: <strong>{0}</strong>',
                'label_grid_project_description': '<strong class="font-color-grid">GRID</strong> Description: <strong>{0}</strong>',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'flash_grid_project_remove': 'The grid project has been removed.',
                'flash_cant_remove_grid_project': 'The grid project cannot be removed. {0}',
                'flash_grid_project_edit': 'The grid project has been edited.',
                'flash_cant_edit_grid_project': 'The grid project cannot be edited. {0}',
                'flash_grid_program_add': 'The grid program has been added.',
                'flash_cant_add_grid_program': 'The grid program cannot be added. {0}',
                'flash_grid_program_edit': 'The grid program has been edited.',
                'flash_cant_edit_grid_program': 'The grid program cannot be edited. {0}',
                'flash_grid_program_remove': 'The grid program has been removed.',
                'flash_cant_remove_grid_program': 'The grid program cannot be removed. {0}',

            }, 'ProjectsProjectGridComponent': {

                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - all projects',
                'btn_add_grid_project': 'Add grid project',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',

                'label_group_properties': 'Group properties',
                'label_group_remove': 'Remove group',
                'label_no_grid': 'There is not any grid project',
                'label_create_grid_text': 'You can create it by click on button bellow.',

                'flash_grid_project_add': 'The grid project has been added.',
                'flash_cant_add_grid_project': 'The grid project cannot be added. {0}',
                'flash_grid_project_edit': 'The grid project has been edited.',
                'flash_cant_edit_grid_project': 'The grid project cannot be edited. {0}',
                'flash_grid_project_remove': 'The grid project has been removed.',
                'flash_cant_remove_grid_project': 'The grid project cannot be removed. {0}',

            }, 'ValidatorErrorsService': {
                'label_field_required': 'This field is required.',
                'label_minimal_length': 'Minimal length of this field is {0} characters.',
                'label_name_taken': 'This name is already taken.',
                'label_project_name_taken': 'This project name is already taken.',
                'label_blocko_name_taken': 'This blocko name is already taken.',
                'label_invalid_email': 'Invalid email.',
                'label_different_password': 'Passwords are different.',
                'label_invalid_file_name': 'Invalid file/directory name.',
                'label_field_only_number': 'This field only accept numbers.',
                'label_unknown_error': 'Unknown error ( {0} ).',

            }, 'TabMenuService': {
                'label_tab_menu_not_found': 'TabMenu with name {0} not found in tabMenus!',

            }, 'NotificationService': {
                'flash_communication_failed': 'Communication with the back end have failed. {0}',
                'flash_cant_confirm_notification': 'Cannot confirm notification. {0}',
                'flash_cant_remove_notification': 'The Notification cannot be removed. {0}',

            }, 'ModalService': {
                'error_missing_modal': 'Missing modalModel',
                'error_modal_already_open': 'This modalModel instanace is already open',

            }, 'ExitConfirmationService': {
                'dialog_discard_changes': 'Discard changes and exit?',
                'confirm_discard_changes': 'Discard changes and exit?',

            }, 'BackendService': {
                'error_content_not_supported': 'content type not supported',

            }, 'LayoutNotLoggedComponent': {
                'label_becki_version': '{0} BECKI_VERSION {1} BECKI_VERSION_ID {2} BECKI_VERSION_DATE',
                'label_byzance': 'Byzance',
            },

            'LayoutMainComponent': {
                'label_number_of_unread': '{0} unread',
                'label_notifications': 'notifications',
                'label_profile': 'Profile',
                'label_log_out': 'Log out',
                'label_view_all': 'view all',
                'label_with_love': '2017 © With Love by',
                'label_byzance': 'Byzance',

            }, 'MonacoEditorComponent': {
                'error_cant_change_editor_language': 'Cannot change editor language after init.',

            }, 'BlockoViewComponent': {
                'error_execution_cant_change': 'Execution enabled cannot be changed.',
                'error_cant_change_readability': 'The readability cannot be changed.',
                'error_configuration_cant_change': 'Configuration enabled cannot be changed.',
                'error_read_only': 'read only',
                'error_block_not_found': 'block {0} not found',

            }, 'FormFAIconSelectComponent': {
                'label_unknown_label': 'Unknown label',
                'error_readonly_not_support': 'Readonly is not support now in component FormFAIconSelectComponent!',

            }, 'FormColorPickerComponent': {
                'error_readonly_not_support': 'Readonly is not support now in component FormColorPickerComponent!',

            }, 'ConsoleLogComponent': {
                'label_console_is_empty': 'Console is empty',
                'label_position_and_line': '<strong>Position:</strong> line',
                'label_column': 'column',
                'label_line': 'line',
                'label_typescript_error': 'TypeScript Error',
            }, 'CodeIDEComponent': {
                'label_error_not_selected_library': 'Not selected <b>library</b> in file tree.',
                'error_missing_folder': 'Missing folder {0} in path {1}',
                'modal_label_error': 'Error',
                'modal_label_cant_add_file_at_path': 'Cannot add, file at path <b> /{0} </b> already exist.',
                'modal_label_cant_move_directory_at_path': 'Cannot move, directory at path <b>/{0}</b> already exist',
                'modal_label_cant_move_base_directory': 'Cannot move <b>/</b> directory.',
                'modal_label_cant_move_file_already_exist': 'Cannot move, file at path <b>/{0}</b> already exist.',
                'modal_label_cant_add_directory_at_path': 'Cannot add, directory at path <b>/{0}</b> already exist.',
                'modal_label_cant_move_directory_to_childern': 'Cannot move directory to it\'s <b>children</b>. ',
                'modal_label_cant_rename_directory': 'Cannot rename <b>/</b> directory.',
                'modal_label_cant_rename': 'Cannot rename <b>/{0} </b>',
                'modal_label_cant_remove_base_directory': 'Cannot remove <b>/</b> directory',
                'modal_label_cant_remove_file': 'Cannot remove <b>/{0} </b> file.',
                'modal_label_cant_rename_file_already_exist': 'Cannot rename, file at path <b>/{0} </b> already exist.',
                'modal_label_cant_rename_directory_already_exist': 'Cannot rename, directory at path <b>/{0} </b> already exist.',
                'modal_label_cant_move_file': 'Cannot move <b>/{0} </b>',

                'label_library': ' library',
                'label_file': ' file',

                'btn_add_file': 'Add file',
                'btn_add_directory': 'Add directory',
                'btn_add_library': 'Add library',
                'btn_change_library_version': 'Change library version',
                'btn_move': 'Move',
                'btn_rename': 'Rename',
                'btn_remove': 'Remove',

                'label_open_file_browser': 'Open file in file browser',











            },



            'label_online': 'Online',
            'label_offline': 'Offline',
            'label_project_owner': 'Project owner',
            'label_project_admin': 'Project admin',
            'label_project_member': 'Project member',
            'label_email': 'E-mail',
            'label_password': 'Password',
            'label_console': 'Console',
            'label_configuration': 'Configuration',
            'btn_save': 'Save',
            'btn_test': 'Test',
            'btn_back': 'Back',
            'btn_send': 'Send',
            'btn_submit': 'Submit',
            'btn_add': 'Add',
            'btn_edit': 'Edit',
            'btn_remove': 'Remove',
            'btn_continue': 'Continue',
            'btn_cancel': 'Cancel',
            'btn_change': 'Change',
            'btn_confirm': 'Confirm',
            'loading': 'Loading...',
            'btn_done': 'Done',
            'btn_rename': 'Rename',
            'btn_yes': 'Yes',
            'btn_no': 'No',
            'btn_update': 'Update',
            'btn_ok': 'OK',

            'hello_world': 'Hello {0}! {1}?',
        },
        'cz': {
            // TODO
        }
    };

    public static translateTables: { [lang: string]: { [tableOrEnv: string]: { [keyOrTable: string]: (string | { [key: string]: string }) } } } = {
        'en': {
            'board_state': {
                'UNKNOWN': 'unknown',
                'NO_COLLISION': 'We are not found any collisions',
                'ALREADY_IN_INSTANCE': 'Attention! Hardware is already running in the Instance',
                'PLANNED_UPDATE': 'There is scheduled update in future',
            },
            'board_online_status': {
                'unknown_lost_connection_with_server': 'unknown',
                'online': 'unknown',
                'offline': 'We are not found any collisions',
                'synchronization_in_progress': 'Attention! Hardware is already running in the Instance',
                'not_yet_first_connected': 'There is scheduled update in future',
            },
            'device_alerts': {
                'BOOTLOADER_REQUIRED': 'Bootloader update is required',
                'RESTART_REQUIRED': 'Device restart is required'
            },
            'instance_type': {
                'VIRTUAL': 'Virtual Instance only for ',
                'INDIVIDUAL': 'Individual set Instance'
            },
            'instance_status': {
                'FUTURE': 'Scheduled',
                'NOW': 'Running now',
                'HISTORY': 'Ran in Cloud'
            },
            'snapshot_settings': {
                'absolutely_public': 'Public',
                'private': 'Private',
            },
            'type_of_update': {
                'MANUALLY_BY_USER_INDIVIDUAL': 'Manually (Individual Update) by User',
                'MANUALLY_BY_USER_BLOCKO_GROUP': 'Manually according Blocko by User',
                'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME': 'Scheduled according Blocko by User',
                'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE': 'System update by user setting - Always up to date',
                'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE': 'System update by central server - Critical patch',
            },
            'version_status': {
                'compilation_in_progress': 'Compilation is in progress',
                'successfully_compiled_and_restored': 'Successfully compiled',
                'server_was_offline': 'Server error (offline) The server can fix bugs after a while. We know about this error immediately and we\'re working on it. Please be patient.',
                'successfully_compiled_not_restored': 'Compilation server error. But the server can fix bugs after a while. We know about this error immediately and we\'re working on it. Please be patient.',
                'compiled_with_code_errors': 'Code compilation finished with errors.',
                'file_with_code_not_found': 'Code file not found. But the server can fix bugs after a while. We know about this error immediately and we\'re working on it. Please be patient.',
                'compilation_server_error': 'Compilation server error. But the server can fix bugs after a while. We know about this error immediately and we\'re working on it. Please be patient.',
                'json_code_is_broken': 'Json Code is Broken. Please Try it again.',
                'hardware_unstable': 'Some of your devices with this version of the program had a critical error and had to be restored from a backup. This version is not recommended to use in production until you have solved the reason for the fall.',
                'undefined': 'Status of version is not known'
            },

            'update_state': {
                'complete': 'Complete',
                'canceled': 'Canceled',
                'not_start_yet': 'Waiting in Update Que (In Progress)',
                'in_progress': 'Update is in progress',
                'overwritten': 'Skipped',
                'not_updated': 'Not updated to right version',
                'waiting_for_device': 'Waiting for Device Reconnection',
                'bin_file_not_found': 'Bin File not Found',
                'critical_error': 'Critical Error',
                'homer_server_is_offline': 'Server is (was) Offline',
                'instance_inaccessible': 'Instance is (was) not accessible',

                // This description is used for Additional comment after mouseover. Information specifies a brief enum description
                'complete_description': 'TODO', // TODO navázat na text po najetí myšky chci informační bublinu
                'canceled_description': 'TODO',
                'not_start_yet_description': 'TODO',
                'in_progress_description': 'TODO',
                'overwritten_description': 'TODO',
                'not_updated_description': 'TODO',
                'waiting_for_device_description': 'TODO',
                'bin_file_not_found_description': 'TODO',
                'critical_error_description': 'TODO',
                'homer_server_is_offline_description': 'TODO',
                'instance_inaccessible_description': 'TODO',

            }, 'hardware_device_id': {
                'ALREADY_REGISTERED_IN_YOUR_ACCOUNT': 'The hardware is already registered in your account.',
                'ALREADY_REGISTERED': 'The hardware is already registered.',
                'PERMANENTLY_DISABLED': 'The hardware is permanently disabled.',
                'BROKEN_DEVICE': 'The hardware is broken.',
                'NOT_EXIST': 'The hardware doesn\'t exist.',
                'default': 'The hardware throws a unexepted exeption',

            }, 'entity_not_valid': {
                'mail': 'Email is already taken',
                'nick_name': 'Nick name is already taken',
                'vat_number': 'Wrong VAT number (type it without spaces, dashes etc.)',
                'default': 'Entity unknown error. {0}',

            }, 'regexp_not_valid': {
                'street_number': 'Wrong street number format, valid is "number" or "number/number" format.',
            }
        },
        'cz': {
            // TODO
        }
    };
};
