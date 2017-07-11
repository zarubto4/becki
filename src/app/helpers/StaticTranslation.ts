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
                'title': 'Add a Device',
                'label_device_id': 'Hardware Device ID',

            }, 'ModalsBlockoAddGridEmptyComponent': {
                'title': 'Unable to add GRID project.',
                'body_text': 'No existing GRID program found, let\'s create one!',
                'btn_redirect': 'Create GRID',

            }, 'ModalsBlockoAddGridComponent': {
                'title': 'New GRID Project',
                'label_grid_project': 'GRID Project',
                'placeholder_grid_project': 'Select a GRID Project',

            }, 'ModalsBlockoAddHardwareComponent': {
                'title': 'Add HARDWARE',
                'label_hardware': 'Hardware',
                'placeholder_select_hardware': 'Select Hardware',

            }, 'ModalsBlockoBlockCodeEditorComponent': {
                'title': 'JS Code Editor - block',
                'label_block_color': 'Colour',
                'label_block_icon': 'Icon',
                'label_block_description': 'Description',
                'label_block_code': 'Code',

            }, 'ModalsBlockoConfigPropertieComponent': {
                'title': 'Config Editor - block',

            }, 'ModalsBlockoPropertiesComponent': {
                'title_edit': 'BLOCKO Program Properties',
                'title_add': 'New BLOCKO Program',
                'label_blocko_program_name': 'Name',
                'label_blocko_program_description': 'Description',

            }, 'ModalsBlockoVersionSelectComponent': {
                'title': 'Change Version',
                'label_program_version': 'Program Version',

            }, 'ModalsBlocksBlockPropertiesComponent': {
                'title_edit': 'BLOCK Properties',
                'title_add': 'Add BLOCKO',
                'label_block_name': 'name',
                'label_block_description': 'description',


            }, 'ModalsBlocksTypePropertiesComponent': {
                'title_edit': 'BLOCKs Group Properties',
                'title_add': 'New Group',
                'label_blocks_group_name': 'Name',
                'label_block_description': 'Description',

            }, 'ModalsCodeAddLibraryComponent': {
                'title': 'New CODE Library',
                'body_text': 'Displaying <b>{}0</b> out of <b>{1}</b> Libraries',
                'label_load_more': 'Load More Libraries',
                'label_no_more': 'All libraries displayed.',
                'btn_select_library': 'Add',

            }, 'ModalsCodeFileDialogComponent': {
                'label_into_directory': 'Add to Directory',

                'text_add_file': 'New File',
                'btn_add_directory': 'New Directory',
                'btn_move': 'Move',

                'text_add_file_name': 'Name',
                'text_directory_name': 'Name',
                'text_move_file': 'Move File <b> {0}</b>',
                'text_move_directory': 'Move Directory <b> {0} </b>',
                'text_rename_file': 'Rename File <b> {0}</b>',
                'text_rename_directory': 'Rename Directory <b> {0}</b>',
                'text_remove_file': 'Are you sure to remove File <b> {0} </b>?',
                'text_remove_library': 'Are you sure to remove Library <b> {0} </b>?',
                'text_remove_directory': 'Are you sure to remove Directory <b> {0} </b> with all it`s Subdirectories?',
                'text_file_name': 'Name',

            }, 'ModalsCodeLibraryVersionComponent': {
                'title': 'Select Library Version',
                'label_no_library': 'No versions found in Library',
                'btn_select_library': 'Select',

            }, 'ModalsCodePropertiesComponent': {
                'title_edit': 'CODE Program Properties',
                'title_add': 'New Program',
                'label_program_name': 'Name',
                'label_program_description': 'Description',
                'label_device_type': 'Hardware Device Type',

            }, 'ModalsDeactivateComponent': {
                'title': 'Confirm',
                'body_text': 'Are you sure to',
                'label_deactivate': 'deactivate',
                'label_activate': 'activate',
                'label_attention': 'Warning',


            }, 'ModalsDeviceEditDescriptionComponent': {
                'title': 'Hardware Device Properties',
                'label_hardware_device': 'Name (private)',
                'label_device_description': 'Description (private)',

            }, 'ModalsSendInvoiceComponent': {
                'checkbox_email': 'E-mail',
                'label_email': 'Enter E-mail Address',

            }, 'ModalsGridConfigPropertiesComponent': {
                'title': 'Widget Config',
                'label_widget_code_version': 'Version',
                'label_select_widget_version': 'Select Version',
                'label_interface': 'Interface',
                'label_inputs': 'Inputs',
                'label_output': 'Output',

            }, 'ModalsGridProgramPropertiesComponent': {
                'title_edit': 'GRID Program Properties',
                'title_add': 'New Program',
                'label_grid_program_name': 'Name',
                'label_grid_program_description': 'Description',

            }, 'ModalsGridProjectPropertiesComponent': {
                'title_edit': 'GRID Project Properties',
                'title_add': 'New Project',
                'label_grid_name': 'Name',
                'label_grid_description': 'Description',

            }, 'ModalsHardwareBootloaderUpdateComponent': {
                'title': 'Hardware ID',
                'label_attention': 'Warning!',
                'body_text': '<p>We have to update a critical software component on your Hardware Device. The update transfer should last a couple of seconds.</p><p>The update process itself takes around 200 ms. If the Device is shut down, restarted or disconnected</p><p>during this procedure, the Device could be damaged!</p><p> In case that happens, you will have to repair the firmware on the Device manually by connecting it to your computer.</p><p>You can find more information about this topic in the documentation or in the “Ask” section of our website.</p>',

            }, 'ModalsHardwareCodeProgramVersionSelectComponent': {
                'title': 'Select CODE Program Version',
                'label_program': 'Program',
                'label_no_code': 'No CODE programs found.',
                'label_select_program': 'Select Program',
                'label_no_version': 'No versions found.',
                'label_not_compiled': 'Compilation failed',
                'btn_select_version': 'Select',

            }, 'ModalsInstanceEditDescriptionComponent': {
                'title': 'CLOUD Instance Properties',

            }, 'ModalsLibraryPropertiesComponent': {
                'title_edit': 'CODE Library Properties',
                'title_add': 'New Library',
                'label_library_name': 'Name',
                'label_library_description': 'Description',

            }, 'ModalsMembersAddComponent': {
                'title': 'Add Members',
                'label_member_email': 'New member E-Mail ',
                'btn_add_more': 'Add another member',

            }, 'ModalsProjectPropertiesComponent': {
                'title_edit': 'Project Properties',
                'title_add': 'New Project',
                'label_project_name': 'Name',
                'label_project_description ': 'Description',
                'label_product_type': 'Select an existing Financial Product',

            }, 'ModalsRemovalComponent': {
                'title': 'Confirm',
                'body_text': 'Are you sure to irreversibly remove',

            }, 'ModalsSelectHardwareComponent': {
                'title': 'Select Hardware Device',
                'label_hardware': 'Hardware Device',
                'placeholder_hardware': 'Select',

            }, 'ModalsVersionDialogComponent': {
                'title_edit': 'Edit Version',
                'title_save': 'Save Version',
                'label_version_name': 'Name',
                'label_version_description': 'Description',

            }, 'ModalsWidgetsTypePropertiesComponent': {
                'title_add': 'New Group',
                'title_edit': 'Widget Group Properties',
                'label_widget_group_name': 'Name ',
                'label_widget_group_description': 'Description',

            }, 'ModalsWidgetsWidgetPropertiesComponent': {
                'title_edit': 'Widget Properties',
                'title_add': 'New Widget',
                'label_widget_name': 'Name',
                'label_widget_description': 'Description',

            }, 'RedirectOkComponent': {
                'title': 'Success!',
                'label_can_login': 'now you can login!',
            },

            'DashboardComponent': {
                'title_first_steps': 'First steps',
                'main_title': 'Dashboard',
                'title': 'Welcome to Byzance <strong style="color: #36c6d3;"> PORTAL </strong> ',
                'dashboard_info_text': 'We are Byzance – a technological laboratory of advanced automatization developing a toolkit for design, development and managing the \'Internet of Things\' (IoT) for industrial uses. We do not create smart washing machines, nor smart city furniture. We develop everything for our customers to let them do it themselves, easily and without any problems.',
                'step_one': '<strong class="font-grey" style="font-size: 1.5em;">1.</strong> Select best matching <strong>tariff</strong> for you and create your <strong>product</strong> in <a onclick="ngNavigate([\'/financial\'])">Financial section</a>',
                'step_two': '<strong class="font-grey" style="font-size: 1.5em;">2.</strong> Create your first <strong>project</strong> in <a onclick="ngNavigate([\'/projects\'])">Projects section</a>',
                'step_three': '<strong class="font-grey" style="font-size: 1.5em;">3.</strong> Create your own Byzance<strong class="font-color-code">CODE</strong>, Byzance<strong class="font-color-grid">GRID</strong> and Byzance<strong class="font-color-blocko">BLOCKO</strong> programs',
                'step_four': '<strong class="font-grey" style="font-size: 1.5em;">4.</strong> Run it on Byzance<strong class="font-color-hardware">HARDWARE</strong> and in Byzance<strong class="font-color-cloud">CLOUD</strong>.',

            }, 'ProjectsComponent': {
                'main_title': 'Projects',
                'title': 'Projects',
                'btn_add_project': 'Add project',
                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'label_deactivated_under': 'Deactivated under',
                'label_project_properties': 'Project properties',
                'label_Remove_project': 'Remove project',
                'label_no_projects': 'There is not any projects',
                'label_no_product': 'if you want to add project, you must have any <span class="bold">product</span>. For add product click the link below.',
                'label_create_product_below': 'You can create it by click on button bellow.',

            }, 'CreateUserComponent': {
                'title': 'Create an account',
                'info_text': 'Enter your E-mail address, nickname, full name and password.',
                'label_nick_name': 'Nickname',
                'label_full_name': 'Full Name',
                'label_password_again': 'Re-enter Password',
                'flash_email_was_send': 'Confirmation E-mail with further instructions was sent to your address.',
                'flash_email_cant_be_sent': 'Confirmation E-mail could not be sent, {0}',

            }, 'Error404Component': {
                'title': 'Oops! You\'re lost.',
                'info_text': 'We cannot find the page you\'re looking for.',
                'btn_return': 'Return Home',
                'btn_back': 'Go Back',

            }, 'FinancialProductBillingComponent': {
                'title': 'Billings',

            }, 'FinancialProductExtensionsComponent': {
                'title': 'Extensions',
                'label_average_monthly_cost': 'Average monthly cost',
                'label_no_extensions': 'No Extensions found.',

            }, 'FinancialProductInvoicesInvoiceComponent': {
                'title': 'Invoice {0}',
                'label_id_subscription': 'Subscription ID',
                'label_payment_mode': 'Payment Type',
                'label_status': 'Status',
                'label_paid_in': 'Paid in',
                'label_total': 'Total',
                'table_name': 'Name',
                'table_guid': 'GUID',
                'table_billable_units': 'Billable units',
                'table_unite': 'Unite',
                'table_total_cost': 'Total cost',

            }, 'ProjectsProjectComponent': {
                'title': 'PROJECT DASHBOARD',
                'label_project_properities': 'Project properties',
                'label_project_remove': 'Remove project',
                'label_name': 'Project Name',
                'label_description': 'Project Description',
                'label_product': 'Financial Product',
                'label_byzance_hardware': 'Byzance<strong class="font-color-hardware">HARDWARE</strong>',
                'label_byzance_blocko': 'Byzance<strong class="font-color-blocko">BLOCKO</strong>',
                'label_devices_count': 'Devices count',
                'label_Status': 'Status',
                'label_online': 'online',
                'label_offline': 'offline',
                'label_byzance_cloud': 'Byzance<strong class="font-color-cloud">CLOUD</strong>',
                'label_instances_count': 'Instances count',
                'label_byzance_code': 'Byzance<strong class="font-color-code">CODE</strong>',
                'label_programs_count': 'Programs count',
                'label_libraries_count': 'Libraries count',
                'label_blocks_count': 'Blocks count',
                'label_in_blocks_group': ' in<strong> {0} </strong>group(s)',
                'label_byzance_grid': 'Byzance<strong class="font-color-grid">GRID</strong>',
                'label_in_projects': 'in <strong> {0} </strong> group(s)',
                'label_widgets_count': 'Widgets count',
                'label_in_group': 'in <strong> {0} </strong>group(s)'

            }, 'FinancialProductInvoicesComponent': {
                'title': 'Invoice',
                'btn_add_credits': 'Add credits',
                'table_invoice_id': 'Invoice ID',
                'table_date_of_pay': 'Date of payment',
                'table_date_of_create': 'Date of creation',
                'table_paid': 'Paid',
                'table_actions': 'Actions',
                'payment_required': 'Payment required',
                'no_invoice': 'No Invoices found.',
                'flash_invoice_been_resend': 'The invoice has been resent to your general invoice E-mail.',
                'flash_invoice_cant_be_resend': 'The invoice could not be sent!',

            }, 'ProductRegistrationComponent': {
                'main_title': 'Product Registration',
                'nav_step_one_title': 'Tariff',
                'nav_step_one_text': 'Select the right tariff for you',
                'nav_step_two_title': 'Packages',
                'nav_step_two_text': 'Choose your desired expansions',
                'nav_step_three_title': 'Information',
                'nav_step_three_text': 'Fill additional information',
                'nav_step_four_title': 'Summary',
                'nav_step_four_text': 'Check your order and confirm',
                'step_one_title': 'Tariff',
                'step_two_title': 'Packages',
                'step_two_no_expansions': 'There are no expansions packages, click Continue.',
                'step_three_title': 'Information',
                'step_three_product_info': 'Product information',
                'step_three_billing_info': 'Billing information',
                'step_three_label_product_name': 'Product name (your unique name for this tariff order)',

                'label_invoice_email': 'Invoice E-mail',
                'label_payment_method': 'Payment method',
                'label_personal_info': 'Personal information',
                'label_company_info': 'Company information',
                'label_full_name': 'Full name',
                'label_company_name': 'Company name',
                'label_street': 'Street name',
                'label_street_number': 'Street number',
                'label_city': 'City',
                'label_zip_code': 'Zip code',
                'label_country': 'Country',
                'label_registration_number': 'Registration number',
                'label_vat_number': 'VAT number (with country code)',
                'label_company_web': 'Company website',
                'label_company_email': 'Company authorised contact E-mail',
                'label_company_phone': 'Company authorised contact Phone number',

                'step_four_title': 'Summary',
                'label_registration_info': 'Registration information',
                'label_product_info': 'Product information',
                'label_product_name': 'Product name',
                'label_billing_info': 'Billing information',
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
                'btn_included': 'Included',
                'ribbon_selected': 'Selected',
                'flash_product_created_prepaid': 'Financial Product was created, you are using your pre-paid credit',
                'flash_product_created': 'Financial Product was created, now you can create a new project',

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
                'flash_products_cant_load': 'Products cannot be loaded, {0}.'

            }, 'HardwareHardwareTypeComponent': {
                'main_title': 'Hardware types',
                'label_name': 'Name',
                'label_description': 'Description',
                'label_producer': 'Manufacturer',
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
                'flash_project_cant_load': 'Projects could not be loaded, {0}.'

            }, 'ForgotPasswordComponent': {
                'title': 'Forgot your password?',
                'info_text': 'Enter your E-mail address below to reset your password.',
                'flash_email_sent': 'E-mail with instructions for password reset was sent.',
                'flash_email_not_sent': 'E-mail could not be sent, {0}.',

            }, 'PasswordRestartComponent': {
                'title': 'Reset password',
                'info_text': 'Enter your E-mail address and new password.',
                'label_confirm_password': 'Confirm password',

                'flash_password_change_fail': 'Password could not be changed, {0}.',
                'flash_password_change_success': 'Password was successfully changed.',

            }, 'LoginComponent': {
                'label_log_in': 'Log In',
                'label_forget_password': 'Forgot password?',
                'label_login_social': 'Log in or Sign up with',
                'btn_create_account': 'Create an account',
                'btn_login': 'Log in',
                'btn_resend': 'Resend',
                'msg_login_user_cant_login': 'The user could not be logged in.\n {0}',
                'msg_login_resend_vertification': '{0} \n Press the resend button to send verification E-mail again',
                'msg_login_error': 'Error has occurred, when trying to log in.',
                'msg_login_email_sent': 'Verification E-mail was sent',

            }, 'LogoutComponent': {
                'label_log_out': 'Log out',
                'label_log_in': 'Log in',
                'msg_logout_cant_log_out': 'Current user could not be logged out.\n {0}',

            }, 'NotificationsComponent': {
                'main_title': 'Notifications',
                'title': 'Notifications',
                'label_load_older': 'Load older notifications',
                'label_displaying_notif': 'Displaying <b>{0}</b> notification(s). Total Unread notifications: <b>{1}</b>',
                'label_notif_undead': '(<b>{0}</b> unread notofications)',
                'flash_cant_load': 'Could not load notifications',

            }, 'ProducersProducerComponent': {
                'main_title': 'Producers',
                'title': 'Producer',
                'label_available_devices': 'Available devices',
                'label_no_device': 'No devices available.',
                'flash_project_cant_load': 'Project could not be loaded, {0}.',

            }, 'ProducersComponent': {
                'main_title': 'Manufacturers',
                'title': 'Manufacturers',
                'table_name': 'Name',
                'table_description': 'Description',
                'label_no_producer': 'No manufacturers available.',
                'flash_project_cant_load': 'Project could not be loaded, {0}.',

            }, 'ProfileComponent': {
                'main_title': 'Profile',
                'title': 'Your profile',
                'nav_personal_info': 'Personal information',
                'nav_avatar': 'Change avatar',
                'nav_password': 'Change password',
                'nav_email': 'Change E-mail',

                'label_full_name': 'Full Name',
                'label_nick_name': 'Nickname',
                'label_gender': 'Gender',
                'label_state': 'Country',
                'label_avatar': 'Avatar',
                'label_unsaved': '(Unsaved)',
                'label_select_avatar': 'Select another avatar',
                'label_current_password': 'Current password',
                'label_new_password': 'New password',
                'label_new_password_again': 'Re-enter new password',
                'label_current_email': 'Current E-mail',
                'label_new_email': 'New E-mail',
                'label_new_email_again': 'Re-enter new E-mail',

                'btn_change_password': 'Change password',
                'btn_change_email': 'Change E-mail',

                'flash_cant_change_password': 'Could not change password, {0}.',
                'flash_email_was_send': 'E-mail with instructions was sent.',
                'flash_user_cant_log_out': 'This user could not be logged out, {0}.',
                'flash_cant_change_email': 'Could not change email, {0}.',
                'flash_image_too_small': 'Image is too small, minimal dimensions are 50x50px.',
                'flash_new_avatar_saved': 'New avatar saved successfully.',
                'flash_cant_save_avatar': 'Could not save new avatar, {0}.',
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
                'tab_saved_versions': 'Saved Versions',
                'btn_add_slave': 'Add Slave Device',
                'btn_add_master': 'Add Master Device',
                'btn_add_grid': 'Add GRID project',
                'btn_clear_program': 'Clear Program',
                'btn_clear_console': 'Clear Console',
                'btn_upload_on_cloud': 'Upload program to Cloud',
                'btn_turn_off_instance': 'Shut Down',
                'btn_change_cloud_version': 'Change Version',
                'label_no_devices_added': 'No devices added in this BLOCKO program.',
                'label_select_version': 'Select Version',
                'label_no_program_version': 'No program versions.',
                'label_modal_change_instance_version': 'Change Instance Version',
                'label_modal_change_running_instance_version': 'Are you sure to change the running instance version?',
                'label_modal_ok': 'OK',
                'label_modal_error': 'ERROR',
                'label_modal_no_main_boards': 'No available Master Devices.',
                'label_modal_shutdown_instance': 'Shut Down',
                'label_modal_confirm_shutdown_instance': 'Are you sure to shutdown the running instance?',
                'label_no_grid_in_blocko': 'No GRID projects added in this BLOCKO program',
                'label_modal_cant_save_blocko_hw_without_version': 'Unable to save BLOCKO, you have <b>hardware devices</b> without program <b>versions selected</b>.',
                'label_modal_clear_program': 'Clear Program',
                'label_modal_confirm_clear_blocko_program': 'Are you sure to clear the BLOCKO program?',
                'label_modal_cant_save_grid_hw_without_version': 'Unable to save BLOCKO, you have <b>grid programs</b>, without program <b>versions selected</b>.',
                'checkbox_advanced_mode': 'Advanced Mode',
                'label_no_blocks_in_group': 'No BLOCKs in this group',

                'table_name': 'Name',
                'table_in_cloud': 'In CLOUD',
                'table_description': 'Description',
                'table_author': 'Author',
                'table_actions': 'Actions',

                'label_cloud': 'CLOUD',
                'label_blocko': 'BLOCKO',
                'label_server': 'Server:',
                'label_instance': 'Instance:',
                'label_status': 'Status:',
                'label_version': 'Version:',
                'label_none': 'None',
                'label_program_version': 'Program version',

                'flash_cant_load_version': 'Unable to load version <b>{0}</b>`, {1}.',
                'flash_cant_save_version': 'Unable to save version <b> {0} </b>, {1}.',
                'flash_version_saved': 'Version <b> {0} </b> saved successfully.',
                'flash_cant_change_version': 'Unable change version, {0}.',
                'flash_cant_load_blocko_block': 'Unable to load this BLOCK version, {0}.',
                'flash_cant_add_blocko_block': 'Unable to add this BLOCK.',
                'flash_cant_load_blocko_version': 'Unable to load this BLOCKO version, {0}.',
                'flash_cant_update_blocko': 'Unable to update BLOCKO, {0}.',
                'flash_blocko_updated': 'BLOCKO updated successfully.',
                'flash_cant_remove_blocko': 'Unable to remove BLOCKO, {0}.',
                'flash_blocko_removed': 'BLOCKO removed successfully.',
                'flash_cant_change_information': 'Unable to change this information, {0}.',
                'flash_version_removed': 'Version removed successfully.',
                'flash_cant_remove_version': 'Could not remove version.',
                'flash_cant_find_program_version': 'Program version not found.',
                'flash_edit_version_been_changed': 'Version {0} has been changed.',
                'flash_edit_cant_change_version': 'Version {0} could not be changed, {1}.',
                'flash_cant_turn_instance_on': 'Could not turn on this instance, {0}.',
                'flash_cant_turn_instance_off': 'Could not turn off this instance, {0}.',

            }, 'ProjectsProjectHardwareComponent': {

                'title': 'all devices',
                'label_name': 'Name',
                'label_id': 'ID',
                'label_description': 'Description',
                'label_type': 'Type',
                'label_status': 'Status',
                'label_actions': 'Actions',
                'btn_add_hardware': ' Add a Device',
                'label_online': 'online',
                'label_offline': 'offline',
                'label_no_hardware': 'No history for this instance.',
                'label_no_hardware_comment': 'Click on the button bellow to add a new device.',

                'flash_add_device_success': 'Device {0} has been added to your project.',
                'flash_add_device_fail': 'Device {0} could not be added to your project, {1}.',
                'flash_edit_device_success': 'Device information was updated.',
                'flash_edit_device_fail': 'Device information could not be updated. {0}',
                'flash_remove_device_success': 'Device has been removed.',
                'flash_remove_device_fail': 'Device could not be removed, {0}.',

            }, 'ProjectsProjectHardwareHardwareComponent': {

                'title': 'Byzance<strong class="font-color-hardware">HARDWARE</strong> - DEVICE <strong>{0}</strong>',

                'label_byzance_code': 'Byzance<strong class="font-color-code">CODE </strong>',

                'tab_overview': 'Overview',
                'tab_update': 'Update progress',

                'label_name': 'Name',
                'label_version': 'Version',
                'label_description': 'Description',
                'label_type': 'Type',
                'label_producer': 'Manufacturer',
                'label_revision': 'Revision',
                'label_id': 'ID',
                'label_ethernet_address': 'Ethernet MAC address',
                'label_wifi_address': 'Wi-Fi MAC address',
                'label_device_status': 'Device status',
                'label_device_last_seen': 'Last seen',
                'label_bootloader_version': 'Version',
                'label_unknow': '(Unknown)',
                'label_update_to': 'Update to',
                'label_alerts': 'Alerts',
                'label_main_server': 'Main Server',
                'label_instance': 'Instance ID',
                'label_not_in_instance': 'Device is not assigned to an instance.',
                'label_online': 'online',
                'label_offline': 'offline',
                'label_none': 'none',

                'label_actual_program_name': 'Current program name',
                'label_actual_program_version': 'Current program version',
                'label_actual_backup_program_name': 'Current backup program name',
                'label_actual_backup_program_version': 'Current backup program version',
                'label_backup_mode': 'Backup mode',
                'label_backup_static': 'Manual',
                'label_backup_automatic': 'Automatic',
                'label_switch_to_automatic': 'switch to <strong>Automatic</strong>',
                'label_switch_to_static': 'switch to <strong>Manual</strong>',
                'label_time_missing_in_json': 'Not yet (Unknown)',
                'label_not_set_none': 'none',

                'table_id': 'ID',
                'table_finished': 'Finished',
                'table_started': 'Started',
                'table_program': 'Program',
                'table_version': 'Version',
                'table_status': 'Status',
                'table_type': 'Type',


                'flash_edit_device_success': 'Device information was updated.',
                'flash_edit_device_fail': 'Device information could not be updated, {0}.',
                'flash_remove_device_success': 'Device has been removed.',
                'flash_remove_device_fail': 'Device could not be removed, {0}.',
                'flash_cant_update_bootloader': 'Unable to update Bootloader, {0}.',
                'flash_cant_edit_backup_mode': 'Device backup mode could not be changed, {0}.',

            }, 'ProjectsProjectInstancesComponent': {

                'title': 'Byzance<strong class="font-color-cloud">CLOUD</strong> - all instances',

                'table_name': 'Name',
                'table_id': 'ID',
                'table_description': 'Description',
                'table_blocko_program': 'Program',
                'table_status': 'Status',
                'table_actions': 'Actions',

                'flash_instance_edit_success': 'Instance information has been updated.',
                'flash_instance_edit_fail': 'Instance information could not be updated. {0}',

                'label_shut_down_instance_modal': 'Shutdown instance',
                'label_shut_down_instance_modal_comment': 'Are you sure to shutdown the running instance?',
                'label_upload_instance_modal': 'Deploy to Cloud',
                'label_upload_instance_modal_comment': 'No instance in Cloud found.',
                'label_upload_error': 'Unable to shutdown this instance, {0}.',
                'label_no_item': 'No instance in Cloud found.',
                'label_you_can_create': 'Are you sure to upload BLOCKO and deploy instance to the Cloud?',

            }, 'ProjectsProjectInstancesInstanceComponent': {

                'title': 'Byzance<strong class="font-color-cloud">CLOUD</strong> - instance <strong>{0}</strong>',

                'tab_name_overview': 'Overview',
                'tab_name_hardware': 'Devices',
                'tab_name_grid': 'GRID Apps',
                'tab_name_history': 'History',
                'tab_name_update_progress': 'Update Progress',
                'tab_name_update_view': 'Realtime Overview',

                'table_name': 'Name',
                'table_id': 'ID',
                'table_hardware_type': 'Device Type',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'table_project': 'Project',
                'table_program': 'Program',

                'btn_change_version_in_cloud': 'Change version in Cloud',
                'label_instance_name': 'Instance Name',
                'label_instance_description': 'Instance Description',
                'label_instance_id': 'Instance ID',
                'label_server_name': 'Server Name',
                'label_instance_status': 'Instance Status',
                'label_status': 'Status:',
                'label_info': 'Info',
                'label_instance_info_is_offline': 'This instance is offline',
                'label_instance_type': 'Instance Type',
                'label_created': 'Created',
                'label_running_from': 'Running from',
                'label_running_to': 'Running until',
                'label_running_status': 'Running status',
                'label_planned': 'Planned',
                'label_progress': 'Progress',
                'label_project': 'Project',
                'label_program': 'Program',
                'label_finished': 'Finished',
                'label_firmware_type': 'Firmware Type',
                'label_version': 'Version',
                'label_description': 'Description',
                'label_no_history_in_instance': 'No history for this instance',
                'label_hardware_actual_in_instance': 'Current in this instance',
                'label_hardware_no_hardware_in_instance': 'No devices in this instance.',
                'label_grid_no_grid_in_instance': 'No apps in this instance.',

                'label_modal_shutdown_instance': 'Shutdown instance',
                'label_modal_confirm_shutdown_instance': 'Are you sure to shutdown the running instance?',
                'label_modal_run_latest_version': 'Deploy to CLOUD in the latest version',
                'label_modal_confirm_run_latest_version': 'Are you sure to deploy BLOCKO and instance to CLOUD?',
                'label_cannot_execute': 'Unable to execute command, {0}.',
                'label_cannot_change_version': 'Unable to change version, {0}.',
                'label_cannot_change_program_publicity': 'Unable to change program privacy setting, {0}.',
                'label_modal_change_instance_version': 'Change instance version',
                'label_modal_change_running_instance_version': 'Are you sure to change the running instance version?',

                'flash_instance_edit_success': 'Instance information was changed.',
                'flash_instance_edit_fail': 'Unable to change instance information, {0}.',

            }, 'ProjectsProjectLibrariesComponent': {

                'title': 'Byzance<strong class="font-color-code">CODE</strong> - ALL LIBRARIES',

                'label_program_properities': 'CODE program properties',
                'label_remove_program': 'Remove CODE program',

                'btn_add_library': 'New Library',

                'flash_library_add_success': 'Library has been created.',
                'flash_library_add_fail': 'Unable to create library {0}, {1}.',
                'flash_library_edit_success': 'Library has been updated.',
                'flash_library_edit_fail': 'Unable to update library, {0}.',
                'flash_library_removed_success': 'Library has been removed.',
                'flash_library_removed_fail': 'Unable to remove library, {0}.',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',

            }, 'ProjectsProjectLibrariesLibraryComponent': {

                'title': 'Byzance<strong class="font-color-code">CODE</strong> - LIBRARY <strong>{0}</strong>',

                'label_library_properties': 'CODE library properties',
                'label_delete_library': 'Delete',

                'flash_library_edit_success': 'Library has been updated.',
                'flash_library_edit_fail': 'Unable to update library, {0}.',
                'flash_library_removed_success': 'Library has been removed.',
                'flash_library_removed_fail': 'Unable to remove library, {0}.',
                'flash_version_save_success': 'Version <b> {0} </b> saved successfully.',
                'flash_version_save_fail': 'Unable to save version <b> {0} </b>, {1}.',
                'flash_version_edit_success': 'Version <b> {0} </b> saved successfully.',
                'flash_version_edit_fail': 'Unable to save version <b> {0} </b>, {1}.',
                'flash_version_removed_success': 'Version has been removed.',
                'flash_version_removed_fail': 'Unable to remove library, {0}.',
                'flash_cannot_load_library': 'Unable to load library.',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',

                'label_version_properties': 'Version properties',
                'label_remove_version': 'Remove version',
                'label_save': 'SAVED VERSIONS',
                'label_name': 'Name',
                'label_description': 'Description',
                'label_version': 'Version',

            }, 'ProjectsProjectMembersComponent': {

                'project_members_title': 'Project members',

                'btn_add_members': 'Add collaborators',

                'table_name': 'Name',
                'table_state': 'Description',
                'table_actions': 'Actions',

                'no_persons_in_this_projects': 'No collaborators in this project.',

                'modal_label_invitation': 'Invitation',
                'modal_label_invitation_send': 'Invitation E-mail was sent to {0}.',
                'modal_title_remove_member': 'Remove member',
                'modal_text_remove_member': 'Do you really want to remove this member?',

                'label_cannot_remove_yourself': 'You can`t remove yourself from your project.',
                'label_cannot_add_member': 'Unable to add collaborators. {0}',
                'label_cannot_delete_person': 'Unable to remove collaborator, {0}.',
                'label_cannot_resend_invitation': 'Unable to re-send invitation, {0}.',
                'label_invitation_sent': 'Invitation(s) sent.',

            }, 'ProjectsProjectWidgetsComponent': {

                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - ALL WIDGET GROUPS',

                'btn_add_widget_group': 'Create GRID widget group',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',

                'flash_grid_group_add_success': 'Version has been successfully created.',
                'flash_grid_group_add_fail': 'Unable to create version, {0}.',
                'flash_grid_group_edit_success': 'Version has been changed.',
                'flash_grid_group_edit_fail': 'Unable to change version, {0}.',
                'flash_grid_group_remove_success': 'Version has been removed.',
                'flash_grid_group_remove_fail': 'Unable to remove version, {0}.',

                'label_no_item': 'No widget groups in this project.',
                'label_you_can_create': 'Click on the button bellow to create a group.',

            }, 'ProjectsProjectWidgetsWidgetsComponent': {

                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - WIDGET GROUP <strong>{0}</strong>',

                'btn_add_widget': 'Create GRID widget',
                'widget_group_name': 'Group Name',
                'widget_group_description': 'Description',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',

                'label_group_properities': 'Group properties',
                'label_remove_group': 'Remove group',
                'label_widget_properties': 'GRID widget properties',
                'label_remove_widget': 'Remove GRID widget',

                'flash_grid_group_add_fail': 'Version cannot be created. {0}',
                'flash_grid_group_edit_success': 'Version has been changed.',
                'flash_grid_group_edit_fail': 'Unable to change version, {0}.',
                'flash_grid_group_remove_success': 'Version has been removed.',
                'flash_grid_group_remove_fail': 'Unable to remove version, {0}.',
                'flash_widget_add_success': 'Version has been successfully created.',
                'flash_widget_add_fail': 'Unable to create version, {0}.',
                'flash_widget_removed_success': 'Widget has been removed.',
                'flash_widget_removed_fail': 'Unable to remove widget, {0}.',
                'flash_widget_edit_success': 'Widget has been edited.',
                'flash_widget_edit_fail': 'Unable to edit widget, {0}.',

                'label_no_item': 'No widgets in this group.',
                'label_you_can_create': 'Click on the button bellow to create a widget.',

            }, 'ProjectsProjectWidgetsWidgetsWidgetComponent': {

                'flash_version_save_success': 'Version <b>{0}</b> saved successfully.',
                'flash_version_save_fail': 'Unable to save version <b>{0}</b>, {1}.',
                'flash_version_removed_success': 'Version has been removed.',
                'flash_version_removed_fail': 'Unable to remove version, {0}.',
                'flash_version_changed_success': 'Version {0} has been changed.',
                'flash_version_changed_fail': 'Unable to change version <b>{0}</b>, {1}.',
                'flash_version_load_fail': 'Unable to load version <b>{0}</b>, {1}.',
                'flash_widget_removed_success': 'Widget has been removed.',
                'flash_widget_removed_fail': 'Unable to remove widget, {0}.',
                'flash_widget_edit_success': 'Widget has been edited.',
                'flash_widget_edit_fail': 'Unable to edit widget, {0}.',

                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - WIDGET <strong>{0}</strong>',

                'label_widget_properities': 'GRID widget properties',
                'label_remove_widget': 'GRID widget properties',
                'label_widget_code': 'Widget Code',
                'label_name': 'Name',
                'label_description': 'Description',
                'label_grid_group_name': 'Widget Group',
                'label_version': 'Version',
                'label_ide': 'IDE',
                'label_build_errors': 'Build Errors',
                'label_save':'SAVED VERSIONS',
                'label_version_properities':'Version properties',
                'label_remove_version':'Remove version',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_author': 'Author',
                'table_actions': 'Actions',

            }, 'ProjectsProjectBlockoComponent': {
                'title': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> - all programs',

                'label_blocko_remove': 'Remove BLOCKO program',
                'label_blocko_program_properties': 'BLOCKO program properties',
                'label_no_blocko_program': 'No BLOCKO programs available.',
                'label_create_blocko_text': 'Click on the button bellow to create a program.',
                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'btn_add_blocko_program': 'New Program',

                'flash_blocko_remove': 'Program has been removed.',
                'flash_blocko_cant_remove': 'Unable to remove program, {0}.',
                'flash_blocko_add_to_project': 'BLOCKO program {0} has been added to your project.',
                'flash_blocko_cant_add_to_project': 'Unable to add BLOCKO program {0} to your project, {1}.',
                'flash_blocko_update': 'Program has been updated.',
                'flash_blocko_cant_update': 'Unable to update program, {0}.',

            }, 'ProjectsProjectBlocksBlocksBlockComponent': {
                'title': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> - block <strong>{0}</strong>',

                'label_group_properties': 'Group properties',
                'label_group_remove': 'Remove Group',
                'label_code': 'Code',
                'label_version': 'Version',
                'label_block_color': 'Colour',
                'label_block_icon': 'Icon',
                'label_block_description': 'Description',
                'label_block_code': 'Code',
                'label_test': 'Test',
                'label_press_test_button': 'To perform a test, press this button.',
                'label_imputs_simulator': 'Inputs simulator',
                'label_value': 'Value',
                'label_datatype_boolean': 'boolean <strong>Arg #{0}</strong>',
                'label_datatype_float': 'float <strong>Arg #{0}</strong>',
                'label_datatype_integer': 'integer <strong>Arg #{0}</strong>',
                'label_datatype_string': 'string <strong>Arg #{0}</strong>',
                'label_block': 'block',
                'label_saved_versions': 'Saved versions',
                'label_device_properties': 'Device properties',
                'label_remove_device': 'Remove device',

                'table_version_name': 'Name',
                'table_description': 'Description',
                'table_author': 'Author',
                'table_actions': 'Actions',


                'ts_error_typescript_error': 'TypeScript Error',
                'ts_error_block_error': 'Block Error',
                'ts_error_block_error_code_empty': 'Block code cannot be empty',

                'bool_true': 'true',
                'bool_false': 'false',

                'flash_cant_save_version': 'Unable to save version <b>{0}</b >, {1}.',
                'flash_version_save': 'Version <b> {0} </b> saved successfully.',
                'flash_block_code_empty': 'Block code cannot be empty! Block error, {1}.',
                'flash_cant_load_block': 'Unable to load block, {0}.',
                'flash_blocko_edit': 'Block has been edited.',
                'flash_cant_edit_block': 'Unable to edit block, {0}.',
                'flash_block_remove': 'Block has been removed.',
                'flash_cant_remove_block': 'Unable to remove block, {0}.',
                'flash_version_remove': 'Version has been removed.',
                'flash_cant_remove_version': 'Unable to remove version, {0}.',
                'flash_version_change': 'Version {0} has been changed.',
                'flash_cant_change_version': 'Unable to change version {0}, {1}',
                'flash_cant_load_block_version': 'Unable to load block version, {0}.',

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
                'label_no_block_program': 'No blocks in this group',
                'label_create_block_text': 'Click on the button bellow to create a block.',

                'btn_add_block': 'New Block',

                'flash_block_groups_edit': 'Block group has been edited.',
                'flash_cant_edit_block_groups': 'Unable to edit block group, {0}.',
                'flash_block_groups_remove': 'Block group has been removed.',
                'flash_cant_remove_block_groups': 'Unable to remove block group, {0}.',
                'flash_block_add': 'Block has been created.',
                'flash_cant_add_block': 'Unable to create block, {0}.',
                'flash_block_edit': 'Block has been edited.',
                'flash_cant_edit_block': 'Unable to edit block, {0}.',
                'flash_block_remove': 'Block has been removed.',
                'flash_cant_remove_block': 'Unable to remove block, {0}.',

            }, 'ProjectsProjectBlocksComponent': {
                'title': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> - all block groups',
                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'label_group_properties': 'Group properties',
                'label_group_remove': 'Remove group',

                'btn_add_blocks_group': 'New Group',
                'flash_block_group_add': 'Block group has been created.',
                'flash_cant_add_block_group': 'Unable to create block group, {0}.',
                'flash_block_group_edit': 'Block group has been edited.',
                'flash_cant_edit_block_group': 'Unable to edit block group, {0}.',
                'flash_block_group_remove': 'Block group has been removed.',
                'flash_cant_remove_block_group': 'Unable to remove block group, {0}.',
                'label_no_blocko_group': 'No block group available.',
                'label_create_blocko_group_text': 'Click on the button bellow to create a group.',

            }, 'ProjectsProjectCodeCodeComponent': {

                'title': 'Byzance<strong class="font-color-code">CODE</strong> - PROGRAM <strong>{0}</strong>',

                'label_program_properities': 'CODE program properties',
                'label_remove_program': 'Remove CODE program',
                'label_version_properities': 'Version properties',
                'label_remove_version': 'Remove CODE version',
                'label_code_name': '<strong class="font-color-code">CODE</strong> Program Name: <strong>{0}</strong>',
                'label_code_description': '<strong class="font-color-code">CODE</strong> Program Description: <strong>{0}</strong>',
                'label_hardware_type': '<strong class="font-color-hardware">Hardware</strong> Device Type',
                'label_ide': 'IDE',
                'label_version': 'Version',
                'label_build_error': 'Build Errors',
                'label_file_and_line': 'File: <b>{0}</b> Line: <b>{1}</b>',
                'label_blocko_interface_preview': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> INTERFACE PREVIEW',
                'label_saved_versions': 'SAVED VERSIONS',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_author': 'Author',
                'table_status': 'Status',
                'table_actions': 'Actions',

                'btn_build': 'Build',
                'btn_upload_to_hardware': 'Deploy to HARDWARE',

                'codefile_library_version_dont_have_readme': '{0} ({1}), # Library {2}\n\nVersion: {3}\n\nLooks like this library doesn\'t have README.md file.',
                'codefile_library_version_short_dont_have_readme': '# Library {0}\n\nVersion: {1}\n\nLooks like this library doesn\'t have README.md file.',
                'text_unsaved_change_reload': 'You have <b> unsaved changes</b> in version <b> {0} </b>, are you sure to reload this version?',
                'text_unsaved_change_switch': 'You have <b> unsaved changes</b> in version <b> {0} </b>, are you sure to switch to version <b> {1} </b>?',
                'text_changed_files': '<h5>Changed files:</h5>',

                'modal_label_save_same_code': 'Save identical code?',
                'modal_text_no_change': 'No changes have been made, are you sure to save this code?',
                'modal_label_error': 'Error',
                'modal_text_no_yoda': 'No available devices.',

                'flash_update_success': 'Deployed successfully',
                'flash_cant_upload_code': 'Deployment failed.',
                'flash_code_version_build_success': 'Built successfully.',
                'flash_code_version_save': 'Version <b> {0} </b> saved successfully.',
                'flash_cant_save_code_version': 'Unable to save version <b>{0}</b>, {1}',
                'flash_code_remove': 'Program has been removed.',
                'flash_cant_remove_code': 'Unable to remove program, {0}.',
                'flash_code_update': 'Program has been updated.',
                'flash_cant_update_code': 'Unable to update program, {0}.',
                'flash_code_version_remove': 'Version has been removed.',
                'flash_cant_remove_code_version': 'Unable to remove version, {0}.',
                'flash_code_version_change': 'Version {0} has been changed.',
                'flash_cant_change_code_version': 'Unable to change version {0}, {1}.',
                'flash_cant_load_code_types': 'Unable to load code types, {0}.',
                'flash_cant_load_version': 'Unable to load version <b>{0}</b>, {1}.',

            }, 'ProjectsProjectCodeComponent': {
                'title': 'Byzance<strong class="font-color-code">CODE</strong> - ALL PROGRAMS',
                'btn_add_code_program': 'New Program',
                'label_code_program_properties': 'CODE program properties',
                'label_remove_code_program': 'Remove CODE program',

                'label_no_code': 'No CODE program available.',
                'label_create_code_text': 'Click on the button bellow to create a program.',

                'table_name': 'Name',
                'table_hardware_type': '<strong class="font-color-hardware">Hardware</strong> device type',
                'table_description': 'Description',
                'table_actions': 'Actions',

                'flash_cant_update_code': 'Unable to update program, {0}.',
                'flash_code_update': 'Program has been updated.',
                'flash_cant_add_code_to_project_with_reason': 'Unable to add CODE program {0} to your project, {1}.',
                'flash_code_add_to_project': 'CODE program {0} has been added to your project.',
                'flash_cant_add_code_to_project': 'Unable to add CODE program to your project.',
                'flash_code_remove': 'Program has been removed.',
                'flash_cant_remove_code': 'Unable to remove program, {0}.',

            }, 'ProjectsProjectGridGridsGridComponent': {
                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - PROGRAM <strong>{0}</strong>',

                'label_program_properties': 'GRID Program properties',
                'label_program_delete': 'Remove GRID program',
                'label_version_properties': 'Version properties',
                'label_version_remove': 'Remove version',
                'label_version': 'Version',
                'label_grid_size_class': 'GRID size class',
                'label_saved_versions': 'Saved versions',
                'label_grid_program_name': '<strong class="font-color-grid" > GRID </strong> Program Name: <strong>{0}</strong>',
                'label_grid_description': '<strong class="font-color-grid" > GRID </strong> Program Description: <strong>{0}</strong>',
                'label_grid_grid_project': '<strong class="font-color-grid" > GRID </strong> Program Group Name',
                'label_grid': 'GRID',
                'label_widgets': 'Widgets',
                'label_no_widgets': 'No widgets in this group',
                'label_device_properties': 'Device properties',
                'label_device_remove': 'Remove Device',
                'label_version_name': 'Name',
                'label_description': 'Description',
                'label_author': 'Author',
                'label_actions': 'Actions',

                'option_mobile': 'Mobile',
                'option_tablet': 'Tablet',
                'option_desktop': 'Desktop',

                'btn_add_page': 'New Page',
                'btn_clear_console': 'Clear Console',
                'modal_label_grid_size_change': 'Change GRID size class',
                'modal_text_grid_size_change': 'Changing GRID size class <strong>will delete all your pages</strong>, are you sure?',

                'flash_cant_load_widget_version': 'Unable to load widget version, {0}.',
                'flash_cant_save_version': 'Unable to save version <b>{0}</b >, {1}.',
                'flash_version_save': 'Version <b>{0}</b> saved successfully.',
                'flash_cant_remove_grid': 'Unable to remove program, {0}.',
                'flash_grid_remove': 'Program has been removed.',
                'flash_grid_edit': 'Program has been edited.',
                'flash_cant_edit_grid': 'TUnable to edit program, {0}.',
                'flash_cant_load_version': 'Unable to load version <b>{0}</b>, {1}.',
                'flash_cant_load_grid': 'Unable to load GRID, {0}.',
                'flash_cant_change_version': 'Unable to change version {0}, {1}',
                'flash_version_change': 'Version {0} has been changed.',
                'flash_version_remove': 'Version has been removed.',
                'flash_cant_remove_version': 'Unable to remove version, {0}.',

            }, 'ProjectsProjectGridGridsComponent': {
                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - PROGRAM GROUP <strong>{0}</strong>',
                'label_device_properties': 'GRID group properties',
                'label_device_remove': 'Remove GRID group',
                'label_program_properties': 'GRID program properties',
                'label_program_remove': 'Remove GRID program',
                'label_no_grid': 'No GRID program available.',
                'label_create_grid_text': 'Click on the button bellow to create a program.',

                'btn_add_grid_program': 'Create GRID Program',
                'label_grid_project_name': '<strong class="font-color-grid">GRID</strong> Project Name: <strong>{0}</strong>',
                'label_grid_project_description': '<strong class="font-color-grid">GRID</strong> Description: <strong>{0}</strong>',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'flash_grid_project_remove': 'Project has been removed.',
                'flash_cant_remove_grid_project': 'Unable to remove project, {0}.',
                'flash_grid_project_edit': 'Project has been edited.',
                'flash_cant_edit_grid_project': 'Unable to edit project, {0}.',
                'flash_grid_program_add': 'Program has been created.',
                'flash_cant_add_grid_program': 'Unable to create program, {0}.',
                'flash_grid_program_edit': 'Program has been edited.',
                'flash_cant_edit_grid_program': 'TUnable to edit program, {0}.',
                'flash_grid_program_remove': 'Program has been removed.',
                'flash_cant_remove_grid_program': 'Unable to remove program, {0}.',

            }, 'ProjectsProjectGridComponent': {

                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - ALL PROGRAM GROUPS',
                'btn_add_grid_project': 'Create GRID program group',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',

                'label_group_properties': 'Group properties',
                'label_group_remove': 'Remove group',
                'label_no_grid': 'No GRID projects available.',
                'label_create_grid_text': 'Click on the button bellow to create a project.',

                'flash_grid_project_add': 'Project has been created.',
                'flash_cant_add_grid_project': 'Unable to create project, {0}.',
                'flash_grid_project_edit': 'Project has been edited.',
                'flash_cant_edit_grid_project': 'Unable to edit project, {0}.',
                'flash_grid_project_remove': 'Project has been removed.',
                'flash_cant_remove_grid_project': 'Unable to remove project, {0}.',

            }, 'ValidatorErrorsService': {
                'label_field_required': 'This field is required.',
                'label_minimal_length': 'Minimal length of this field is {0} characters.',
                'label_name_taken': 'This name is already in use.',
                'label_project_name_taken': 'This project name is already in use.',
                'label_blocko_name_taken': 'This program name is already in use.',
                'label_invalid_email': 'Invalid E-mail address.',
                'label_different_password': 'Passwords do not match.',
                'label_invalid_file_name': 'Invalid file/directory name.',
                'label_field_only_number': 'This field only accepts numbers.',
                'label_unknown_error': 'Unknown error, {0}.',

            }, 'TabMenuService': {
                'label_tab_menu_not_found': 'Unable to find TabMenu named {0}.',

            }, 'NotificationService': {
                'flash_communication_failed': 'Communication with the server failed, {0}.',
                'flash_cant_confirm_notification': 'Unable to confirm notification, {0}.',
                'flash_cant_remove_notification': 'Unable to remove notification, {0}.',

            }, 'ModalService': {
                'error_missing_modal': 'Missing modal model.',
                'error_modal_already_open': 'This modal model instanace is already open.',

            }, 'ExitConfirmationService': {
                'dialog_discard_changes': 'Discard changes and leave?',
                'confirm_discard_changes': 'Are you sure to leave your unfinished work unsaved?',

            }, 'BackendService': {
                'error_content_not_supported': 'Content type not supported.',

            }, 'LayoutNotLoggedComponent': {
                'label_becki_version': 'Version: {0} ID: {1} Date: {2}',
                'label_byzance': 'Byzance',
            },

            'LayoutMainComponent': {
                'label_number_of_unread': '{0} unread',
                'label_notifications': 'notifications',
                'label_profile': 'Profile',
                'label_log_out': 'Log out',
                'label_view_all': 'view all',
                'label_with_love': '2017 © ',
                'label_byzance': 'Byzance',

            }, 'MonacoEditorComponent': {
                'error_cant_change_editor_language': 'Unable to change editor language.',

            }, 'NotificationsListComponent': {
                'label_no_notifications': 'No notifications.',
            },
            'BlockoViewComponent': {
                'error_execution_cant_change': 'Unable to change execution status.',
                'error_cant_change_readability': 'Unable to change readability.',
                'error_configuration_cant_change': 'Unable to change configuration status.',
                'error_read_only': 'read only',
                'error_block_not_found': 'block {0} not found',

            }, 'FormFAIconSelectComponent': {
                'label_unknown_label': 'Unknown label',
                'error_readonly_not_support': 'Read-only is not supported.',

            }, 'FormColorPickerComponent': {
                'error_readonly_not_support': 'Read-only is not supported.',

            }, 'ConsoleLogComponent': {
                'label_console_is_empty': 'Console is empty.',
                'label_position_and_line': '<strong>Position:</strong> line',
                'label_column': 'column',
                'label_line': 'line',
                'label_typescript_error': 'TypeScript Error',
            }, 'CodeIDEComponent': {
                'label_error_not_selected_library': 'No selected <b>library</b> in file tree.',
                'error_missing_folder': 'Missing folder {0} in path {1}',
                'modal_label_error': 'Error',
                'modal_label_cant_add_file_at_path': 'Unable to create file in <b>/{0}</b>. File with the same name already exists.',
                'modal_label_cant_move_directory_at_path': 'Unable to move directory to <b>/{0}</b>. Directory with the same name already exists.',
                'modal_label_cant_move_base_directory': 'Unable to move <b>/</b> directory.',
                'modal_label_cant_move_file_already_exist': 'Unable to move file to <b>/{0}</b>. File with the same name already exists.',
                'modal_label_cant_add_directory_at_path': 'Unable to create directory in <b>/{0}</b>. Directory with the same name already exists.',
                'modal_label_cant_move_directory_to_childern': 'Unable to move directory to it\'s own <b>sub-directory</b>. ',
                'modal_label_cant_rename_directory': 'Unable to rename rename <b>/</b> directory.',
                'modal_label_cant_rename': 'Unable to rename <b>/{0} </b>.',
                'modal_label_cant_remove_base_directory': 'Unable to remove <b>/</b> directory.',
                'modal_label_cant_remove_file': 'Unable to remove <b>/{0} </b> file.',
                'modal_label_cant_rename_file_already_exist': 'Unable to rename file in <b>/{0}</b>. File with the same name already exists.',
                'modal_label_cant_rename_directory_already_exist': 'Unable to rename directory in <b>/{0}</b>. Directory with the same name already exists.',
                'modal_label_cant_move_file': 'Unable to move <b>/{0}</b>.',

                'label_library': ' library',
                'label_file': ' file',

                'btn_add_file': 'New File',
                'btn_add_directory': 'New Directory',
                'btn_add_library': 'New Library',
                'btn_change_library_version': 'Change Library Version',
                'btn_move': 'Move',

                'label_open_file_browser': 'Open file in file browser',
            },

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
                'NO_COLLISION': 'No collisions found.',
                'ALREADY_IN_INSTANCE': 'Warning! Device is already running in this instance.',
                'PLANNED_UPDATE': 'Update is scheduled in the future.',
            },
            'device_alerts': {
                'BOOTLOADER_REQUIRED': 'Bootloader update is required.',
                'RESTART_REQUIRED': 'Device restart is required.'
            },
            'instance_type': {
                'VIRTUAL': 'Virtual Instance only for ',
                'INDIVIDUAL': 'Instance is set individually.'
            },
            'instance_status': {
                'FUTURE': 'Scheduled',
                'NOW': 'Running now',
                'HISTORY': 'No longer running'
            },
            'snapshot_settings': {
                'only_for_project_members': 'Only for project members',
                'absolutely_public': 'Public',
                'private': 'Private',
                'not_in_instance': 'Not present instance.',
            },
            'type_of_update': {
                'MANUALLY_BY_USER_INDIVIDUAL': 'Manually (Individual Update)',
                'MANUALLY_BY_USER_BLOCKO_GROUP': 'Manually through BLOCKO',
                'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME': 'Scheduled through BLOCKO',
                'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE': 'System update setting - Always up-to-date',
                'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE': 'System update by central server - Critical patch',
            },
            'version_status': {
                'compilation_in_progress': 'Compilation is in progress.',
                'successfully_compiled_and_restored': 'Successfully compiled.',
                'server_was_offline': 'Server error (offline). The server can fix bugs in a short while. We know about this issue and we\'re working on it. Please be patient.',
                'successfully_compiled_not_restored': 'Compilation server error. The server can fix bugs in a short while. We know about this issue and we\'re working on it. Please be patient.',
                'compiled_with_code_errors': 'Code compilation finished with errors.',
                'file_with_code_not_found': 'Code file not found. The server can fix bugs in a short while. We know about this issue and we\'re working on it. Please be patient.',
                'compilation_server_error': 'Compilation server error. The server can fix bugs in a short while. We know about this issue and we\'re working on it. Please be patient.',
                'json_code_is_broken': 'Json Code is Broken. Please try again later.',
                'hardware_unstable': 'Some of your devices with this version of the program had a critical error and had to be restored from a backup. This version is not recommended to use in production until you have solved the cause for the error.',
                'undefined': 'Version status is unknown.'
            },

            'update_state': {
                'complete': 'Complete',
                'canceled': 'Cancelled',
                'not_start_yet': 'Waiting in que (In Progress).',
                'in_progress': 'Update is in progress',
                'overwritten': 'Skipped',
                'not_updated': 'Updated to wrong version.',
                'waiting_for_device': 'Waiting for the device to reconnect.',
                'bin_file_not_found': 'Bin file not found.',
                'critical_error': 'Critical error.',
                'homer_server_is_offline': 'Server is offline.',
                'instance_inaccessible': 'Instance is not accessible.',

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
                'ALREADY_REGISTERED_IN_YOUR_ACCOUNT': 'Device is already registered with your account.',
                'ALREADY_REGISTERED': 'Device is already registered.',
                'PERMANENTLY_DISABLED': 'This device is permanently disabled.',
                'BROKEN_DEVICE': 'This device is broken.',
                'NOT_EXIST': 'Device doesn\'t exist.',
                'default': 'There is a problem with this device.',

            }, 'entity_not_valid': {
                'mail': 'E-mail address is already taken.',
                'nick_name': 'Nickname is already taken.',
                'vat_number': 'Wrong VAT number (type it without spaces, dashes etc.).',
                'default': 'Unknown error, {0}.',

            }, 'regexp_not_valid': {
                'street_number': 'Wrong street number format. "Number" or "number/number" is the correct format.',
            }
        },
        'cz': {
            // TODO
        }
    };
};
