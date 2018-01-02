/*
 * Created by DominikKrisztof 13.3.2017
 */

export class StaticTranslation {
    /* tslint:disable:max-line-length */
    /* <!-- <br><br><b>TODO: DELETE ME! -></b> {{'hello_world'|bkTranslate:this:'Becki':55}} -->*/
    // TODO: delete me! -> alert(this.translate('hello_world', 'Pepa', 66))

    public static translate: { [lang: string]: { [keyOrEnv: string]: (string | { [key: string]: string }) } } = {
        'en': {
            'ModalsTariffComponent': {
                'title': 'Financial \"First Kick\" Tariff',
                'label_name': 'Name',
                'label_description': 'Description',
                'label_identifier': 'Unique Identifier',
                'label_color': 'Color in Template. Please use color from http://keenthemes.com/preview/metronic/theme/admin_1/ui_colors.html',
                'label_company_details_required': 'Company details required',
                'label_payment_details_required': 'Payment details required (Full registration)',
                'label_payment_method_required': 'Payment mode required (User have to select a mode.)',
                'label_credit_for_beginning': 'Pre-Paid Credit for user at the beginning 1USD == 1000 !!!!!',
                'label_icon': 'FA-ICON (http://fontawesome.io/)',
            }, 'ModalsAddHardwareComponent': {
                'title': '<strong class="font-color-hardware">Hardware</strong> registration',
                'label_successfully_registered': '2. Successfully registred',
                'label_failed_to_register': '3. Failed to register',
                'label_hash_token': 'Hash Token',
                'label_hash_tokens': '1. Hash Tokens',
                'label_hardware_groups': 'Available <strong class="font-color-hardware">Hardware Groups</strong>',
                'label_no_hardware_groups': 'Not Available any <strong class="font-color-hardware">Hardware Groups</strong>',
                'label_hash_token_label': 'Hash Token from Label',
                'label_multiple_registration': 'Multiple Registration <br> (From B2B Invoices, Files etc.)',
                'label_single_registration': 'Single Registration (QR)',
                'label_little_advice': 'Little Advice',
                'label_advice_single_registration': '<p><strong>You will find HashToken on the sticker on Hardware</strong></p> <br> <p> If you own a smart-phone with camera <strong>(That\'s the thing that girls do with selfie. True gourmets can also use tablet.)</strong>, you can sign in to the portal and quickly and easily capture the QR code sticker on the Hardware.</p> <br> <p> Trust us, it\'s much more comfortable...</p>',
                'label_advice_multiple_registration': '<p> For register new <strong class="font-color-hardware">Hardware</strong> to this project, upload a text file below or insert text. The file or text should contain a list of device registration hash, where each key is separated by a semicolon. The spaces will be ignored. </p> <br><p><strong>Example: </strong> XXXXXXX; YYYYYYY;BBBBBB;  CCCCCC;DDDDD;</p><br><p> Each hash is sequentially registered. If a problem occurs - we\'ll show you which key is not valid and why. Attention - Multiple <strong>unsuccessful</strong> registration is flagged as a security breach attempt and your account may be blocked.</p><p>HASH keys are remove from list number 1, and registered one by one. If Registration is <strong>successful</strong> - HASH key will be entered in list number 2. If an <span class="font-red-flamingo bold">error has occurred</span> - the HASH key is not removed from list 1 and a reason "why" is entered in list number 3.</p>',
                'label_advice_no_group': '<p>We strongly recommend to register <strong class="font-color-hardware">Hardware</strong> into <strong class="font-color-hardware">Hardware Groups</strong>. We\'ve found that you do not have any yet. Groups are available in Release Manager to update more than one hardware. You can see progress and etc.</p> <br><p>You can use the <strong class="font-color-hardware">Hardware Groups</strong> to develop. For example, <strong>Beta</strong>, <strong>Dev HW</strong> or <strong>My Little Pony</strong>, and for production deployments where you can use an industrial registration API,for example <strong>Smart Fridge - Europe</strong> or <strong>Tracking equipment used in North Korea</strong>.</p>',
                'flash_add_device_fail': 'Adding device {0} failed',
                'flash_add_device_success': 'Device add success',
                'flash_cant_add_hardware': 'Cant add device, ',
            }, 'ModalsBillingInformationComponent': {
                'title': 'Information details',
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
            }, 'ModalsFinancialProductComponent': {
                'title': 'Change Basic Product information',
                'label_name': 'Product name',
            }, 'ModalsPublicShareResponseComponent': {
                'title': 'Publishing decisions',
                'label_program_additional_comment': 'If the user shares a new version of the same program as before, the program (not version) will be named the same as the one which has already been used since the previous approval.',
                'label_program_name': 'Program name in the public list',
                'label_program_description': 'Program description in the public list',
                'label_version_name': 'Version name in the public list',
                'label_version_description': 'Version description in the public list',
                'label_group_select': 'Group / Type where it will be registered',
                'label_approve': 'The program will be published',
                'label_reason': 'If not - there is a place for comment for the author.',
                'btn_decide': 'Make decision',
            }, 'ModalsExtensionComponent': {
                'title': 'Add a Device',
                'label_color': 'Color in Template. Please use color from http://keenthemes.com/preview/metronic/theme/admin_1/ui_colors.html',
                'label_name': 'Name',
                'label_description': 'Description',
                'label_price': 'Price  1USD == 1000 !!!!!',
                'label_config': 'Config in JSON',
                'label_optional_included': 'Optional in Tariff',
                'label_extension_type': 'Extension type',
            }, 'ModalsAdminCreateHardwareComponent': {
                'title': 'Manual Hardware registration',
                'label_processor_id': 'Processor Id',
                'label_type_of_board': 'Board Type'
            }, 'ModalsCreateCompilationServerComponent': {
                'title': 'Create new Server',
                'label_personal_server_name': 'Server name',
                'label_server_url': 'Server url (without http..)'
            }, 'ModalsCreateProducerComponent': {
                'title': 'Producer',
                'label_name': 'Name',
                'label_description': 'Description'
            }, 'ModalsPermissionGroupComponent': {
                'title': 'Create new Permission Group',
                'label_name': 'Group Name',
                'label_description': 'Description'
            }, 'ModalsBootloaderPropertyComponent': {
                'title': 'Create new Bootloader',
                'label_name': 'Name',
                'label_description': 'Description',
                'label_version_identificator': 'Version Hardware Identification',
                'label_changing_note': 'Changing Note (Markdown)'
            }, 'ModalsCreateTypeOfBoardBatchComponent': {
                'title': 'Create new Production Batch or Revision',
                'label_product_revision': 'Revision Code',
                'label_product_batch': 'Production Batch',
                'label_pcb_product_manufacture': 'PCB Producer Name',
                'label_pcb_product_manufacture_id': 'PCB Producer ID (VAT, IČO, etc)',
                'label_assembly_product_manufacture': 'Assemble Manufacture Name',
                'label_assembly_product_manufacture_id': 'Assemble Manufacture ID (VAT, IČO, etc)',
                'label_mac_address_start': 'Mac Address start position (decimal numbers - 187723572641792)',
                'label_mac_address_end': 'Mac Address End position (decimal numbers - 187723572641800)',
                'label_ean_number': 'EAN Number (13 digits)',
                'label_customer_product_name': 'Product name - For Label Print',
                'label_customer_company_name': 'Producer Company name - For Label Print',
                'label_customer_company_made_description': 'Made in Description - For Label Print',
                'label_date_of_assembly': 'Date of Assembly'
            }, 'ModalsCreateTypeOfBoardComponent': {
                'title': 'Create new Board Type',
                'label_name': 'Name',
                'label_description': 'Description',
                'label_processor': 'Processor',
                'label_producer': 'Producer',
                'label_connectible_to_internet': 'Connectable to Internet (Wifi, Ethernet)',
                'label_compiler_target_name': 'Target name for Compiler server'
            }, 'ModalsCreateProcessorComponent': {
                'title': 'Create new Processor',
                'label_name': 'Name',
                'label_description': 'Description',
                'label_code': 'Processor Code',
                'label_speed': 'Hz'
            }, 'ModalsPermissionPermissionPropertyComponent': {
                'title': 'Edit Permission property',
                'label_description': 'Description'
            }, 'ModalsRolePermissionAddComponent': {
                'title': 'Add Permissions',
                'label_name': 'Permission Name',
                'label_description': 'Description',
                'label_action': 'Processor Code',
                'label_key_remove': 'Remove key',
                'btn_add_more': 'Add Selected Permission',
                'label_permission': 'Permission Key',
            }, 'ModalsCreateHomerServerComponent': {
                'title': 'Create new Server',
                'label_personal_server_name': 'Server name',
                'label_server_url_comment': 'URL Address without port & schema (ftp, ws, http etc ..) When entering an IP address, it is necessary to specify the correct format according to ISO standard.',
                'label_server_url': 'Server url (without http..)',
                'label_mqtt_username': 'Mqtt user name',
                'label_mqtt_port': 'Mqtt port',
                'label_mqtt_password': 'Mqtt password',
                'label_grid_port': 'Grid port',
                'label_web_view_port': 'Web View port',
                'label_hardware_log_port': 'Hardware Logger Stream port',
                'label_hash_certificate': 'Hash',
                'label_connection_identifier': 'Connection Token',
            }, 'ModalsGarfieldComponent': {
                'title': 'Garfield',
                'label_name': 'Garfield Identification',
                'label_description': 'Description',
                'label_printer_settings': 'Printer Settings',
                'label_printer_setting_description': 'Register & Get Printer IDs from www.printnode.com',
                'label_printer_label_12': 'Label Printer 1 (12 mm)',
                'label_printer_label_24': 'Label Printer 2 (24 mm)',
                'label_printer_sticker': 'Package Sticker printer (65mm)',
                'label_hardware_tester_label': 'Garfield Hardware Identification (for autodetect)',
                'label_type_of_board': 'Tester for Device Type',
                'label_producer': 'Producer',

            }, 'ModalsBlockoAddGridEmptyComponent': {
                'title': 'Unable to add <strong class="font-color-grid">GRID</strong> project.',
                'body_text': 'No existing <strong class="font-color-grid">GRID</strong> program found, let\'s create one!',
                'btn_redirect': 'Create GRID',

            }, 'ModalsBlockoAddGridComponent': {
                'title': 'New <strong class="font-color-grid">GRID</strong> Project',
                'label_grid_project': '<strong class="font-color-grid">GRID</strong> Project',
                'placeholder_grid_project': 'Select a GRID Project',

            }, 'ModalsBlockoAddHardwareComponent': {
                'title': 'Add <strong class="font-color-hardware">HARDWARE</strong>',
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
                'title_edit': '<strong class="font-color-blocko">BLOCKO</strong> Program Properties',
                'title_add': 'New <strong class="font-color-blocko">BLOCKO</strong> Program',
                'label_blocko_program_name': 'Name',
                'label_blocko_program_description': 'Description',

            }, 'ModalsBlockoVersionSelectComponent': {
                'title': 'Change Version',
                'label_program_version': 'Program Version',

            }, 'ModalsBlocksBlockPropertiesComponent': {
                'title_edit': '<strong class="font-color-blocko">BLOCKO</strong> Properties',
                'title_add': 'Add <strong class="font-color-blocko">BLOCKO</strong>',
                'label_block_name': 'Name',
                'label_block_description': 'Description',

            }, 'ModalsBlockoConfigPropertiesComponent': {
                'title': 'blocko Confurigation',
                'label_block_code_version': 'Block code version',
                'label_detached_version': 'detached version'

            }, 'ModalsBlocksTypePropertiesComponent': {
                'title_edit': 'BLOCKs Group Properties',
                'title_add': 'New Group',
                'label_blocks_group_name': 'Name',
                'label_block_description': 'Description',

            }, 'ModalsCodeAddLibraryComponent': {
                'title': 'New <strong class="font-color-code">CODE</strong> Library',
                'body_text': 'Displaying <b>{}0</b> out of <b>{1}</b> Libraries',
                'label_load_more': 'Load More Libraries',
                'label_no_more': 'All libraries displayed.',
                'btn_select_library': 'Add',

            }, 'ModalsLogLevelComponent': {

                'title': 'Change terminal log level',
                'label_logLevel': 'Log Level',
                'label_choosen': '(chosen)',
            },
            'ModalsCodeFileDialogComponent': {
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
                'text_remove_directory': 'Are you sure to remove Directory <b> {0} </b> with all its Subdirectories?',
                'text_file_name': 'Name',

            },
            'ModalPickHardwareTerminalComponent': {
                'description_logLevel': 'Choose a maximal logLevel. The higer ones automaticly subscribe all logs under itself',
                'title': 'Subscribe a new terminal data',
                'label_logLevel': 'Maximal logLevel',
                'label_block_color': 'Terminal color',
                'label_hardware': 'Hardware',

            }, 'ModalsCodeLibraryVersionComponent': {
                'title': 'Select Library Version',
                'label_no_library': 'No version found in Library',
                'btn_select_library': 'Select',

            }, 'ModalsCodePropertiesComponent': {
                'title_edit': '<strong class="font-color-code">CODE</strong> Program Properties',
                'title_add': '<strong class="font-color-code">CODE</strong>New Program',
                'title_copy': '<strong class="font-color-code">CODE</strong> Copy Program',
                'label_program_name': 'Name',
                'label_program_description': 'Description',
                'label_device_type': 'Hardware Device Type',

            }, 'ModalsDeactivateComponent': {
                'title': 'Confirm',
                'body_text': 'Are you sure to',
                'label_deactivate': 'deactivate',
                'label_activate': 'activate',
                'label_attention': 'Warning',

            }, 'ModalsHardwareRestartMQTTPassComponent': {
                'title': 'Generate new MQTT Connection Secrets',
                'label_attention': 'Warning!',
                'body_text': '<p>MQTT <strong>Password</strong> and <strong>Name</strong> is stored in device memory as a <a href="https://en.wikipedia.org/wiki/Universally_unique_identifier" target="_blank">UUID</a> . And it is not distributed online or inside the firmware update. </p> <p><strong>Password</strong> and <strong>Name</strong> were created and uploaded during production in our factory. But in some case, for example, when you changing server hierarchy (Developer, Stage or Production Servers), you have to change security tokens.</p><p>Changing your password on Hardware within maximum security can <strong>only be done physically in Bootloader mode via USB Cable!</strong></p><p>If you are generating new access data, the previous ones will automatically be irreversibly removed. Also, it is not possible to show the original or new generated access data again because <strong>we have only HASH, not the original value.</strong></p><p>So you can only see the password in the original form once!</p>',
                'btn_generate': 'Generate New Password',
                'body_password_message': '<p> <strong>Warning!</strong> It is not possible to show access data again because <strong>we store all information only in HASH, not the original value. </p> <p>You can see the password and name in the original form once! </p>',


            }, 'ModalsHardwareChangeServerComponent': {
                'title': 'Change <strong class="font-color-cloud">CLOUD</strong> IoT Server',
                'label_attention': 'Warning!',
                'label_select_description_attention': '<p>You can redirect the hardware to another server if there is a geolocation in the preference. For public servers, the system can automatically make adjustments to increase stability and performance. If the server is overloaded, it can redirect the hardware itself to less busy servers.</p> <p>Additionally, the server measures latency and approximate hardware location at daily intervals. When it finds a better server with better latency, it automatically redirects the hardware. These features are also used when we updating our servers. Before update and restart of server, the hardware is redirected to another temporary server. We update at weekly intervals. This guarantees 100% reliability.</p>',
                'label_manual_description_attention': '<p> Manual redirection of hardware to another server can have fatal consequences. Use this feature only if you know what you are doing.</p><p><strong> There is a backup server where the hardware redirects if an unsuccessful connection to a new server, we cover your back</strong>, but we want to inform you that there may be unexpected complications. Hardware may "lose" on the Internet. </p> <p> Hardware can always be repaired by connecting a USB cable and by using manual settings in Bootloader. </p>',
                'label_select': 'Select Server',
                'label_manually': 'Manual Redirection',
                'label_url_description': '<p>The address can not contain http, https, ws, and others. The address may look like <strong>8.8.8.8</strong> or <strong>my-server.my_domain.com</strong>. Please note that Cloud server does not have the url directory.</p> <p>For example <strong>my_server.com/and_my_stupid_idea/yeah</strong>.</p>',
                'label_url': 'Url',
                'label_port': 'Port',
                'btn_redirect': 'Redirect',

            }, 'ModalsFileUploadComponent': {
                'title': 'Upload File',
                'label_file_type': 'File Type',
                'label_file_description': 'Description',
                'label_accept_file_type': 'Required File type',

            }, 'ModalsPictureUploadComponent': {
                'title': 'Upload Picture',
                'label_picture': 'Picture',
                'label_unsaved': '(not saved)',
                'label_select_avatar': 'Select file',

            }, 'ModalsDeviceEditDescriptionComponent': {
                'title': 'Hardware Device basic Properties',
                'label_hardware_device': 'Name (private)',
                'label_device_description': 'Description (private)',

            }, 'ModalsDeviceEditDeveloperParameterValueComponent': {
                'title': 'Set Developer Properties',

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
                'title_edit': '<strong class="font-color-grid">GRID</strong> Program Properties',
                'title_add': 'New Program',
                'label_grid_program_name': 'Name',
                'label_grid_program_description': 'Description',

            }, 'ModalsGridProjectPropertiesComponent': {
                'title_edit': '<strong class="font-color-grid">GRID</strong> Project Properties',
                'title_add': 'New Project',
                'label_grid_name': 'Name',
                'label_grid_description': 'Description',

            }, 'ModalsHardwareBootloaderUpdateComponent': {
                'title': 'Hardware ID',
                'label_attention': 'Warning!',
                'body_text': 'We have to update a critical software component on your Hardware Device. The update transfer should last a couple of seconds. The update process itself takes around 200 ms. If the Device is shut down, restarted or disconnected during this procedure, the Device could be damaged! In case that happens, you will have to repair the firmware on the Device manually by connecting it to your computer. You can find more information about this topic in the documentation or in the “Ask” section of our website.',

            }, 'ModalsHardwareCodeProgramVersionSelectComponent': {
                'title': 'Select <strong class="font-color-code">CODE</strong> Program Version',
                'label_program': 'Program',
                'label_no_code': 'No <strong class="font-color-code">CODE</strong> programs found.',
                'label_select_program': 'Select Program',
                'label_no_version': 'No versions found.',
                'label_not_compiled': 'Compilation failed',
                'btn_select_version': 'Select',

            }, 'ModalsInstanceEditDescriptionComponent': {
                'title': 'CLOUD Instance Properties',

            }, 'ModalsLibraryPropertiesComponent': {
                'title_edit': '<strong class="font-color-code">CODE</strong> Library Properties',
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
                'label_project_description': 'Description',
                'label_product_type': 'Select an existing Financial Product',

            }, 'ModalsRemovalComponent': {
                'title': 'Community publishing request',
                'body_text': 'Are you sure to irreversibly remove',

            }, 'ModalsPublicShareRequestComponent': {
                'title': 'Set as ',
                'body_text': '<p>Are you sure you want to publish the program? Is it properly named? Does it include quality documentation?</p><p> Your request will be immediately forwarded to the administrators for review. It may take a few days. <strong>Please be patient.</strong> The code may be modified or you will be asked to make revision.</p>',

            }, 'ModalsSetAsMainComponent': {
                'title': 'Set as default',
                'body_text': 'Some settings may have fatal consequences. Please reconsider what you are doing! Are you sure that you want to set the parameter as a default?',

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
                'label_widget_description': 'Description'

            }, 'ModalsHardwareGroupPropertiesComponent': {
                'title_edit': 'Hardware Group Properties',
                'title_add': 'New Group',
                'label_group_name': 'Name',
                'label_group_description': 'Description',

            }, 'RedirectOkComponent': {
                'title': 'Success!',
                'label_can_login': 'Now you can login!',
            },

            'ReaderQrComponent': {
                'not_valid_byzance_qr_code': 'not valid Byzance QRcode',
                'byzance_qr_code_found': 'Byzance QR code found',
                'btn_rescan': 'Scan again',
                'btn_confirm_scan': 'Confirm Scan',
            },

            'MobileAddHardwareComponent': {
                'main_title': 'QR Hardware registration',
                'btn_add_hardware_qrcode': 'Insert Hardware ID by QR',
                'label_add_hardware': 'Add hardware',
                'title': 'Add hardware',
                'label_project': 'Selected Project',
                'placeholder_project': 'select project',
                'flash_add_device_success': 'Device {0} has been added to your project',
                'flash_add_device_fail': 'Device {0} can not be added to your project',
                'label_hardware_groups': 'hardware groups',
            },

            'DashboardComponent': {
                'title_first_steps': 'FIRST STEPS',
                'main_title': 'Dashboard',
                'btn_qrcode': 'Scan a QR code',
                'title': 'Welcome to Byzance <strong style="color: #36c6d3;"> PORTAL </strong> ',
                'dashboard_info_text': 'We are Byzance – a technological laboratory of advanced automatization developing a toolkit for design, development and managing the \'Internet of Things\' (IoT) for industrial uses. We do not create smart washing machines, nor smart city furniture. We develop everything for our customers to let them do it themselves, easily and without any problems.',
                'step_one': '<strong class="font-grey" style="font-size: 1.5em;">1.</strong> Select best matching <strong>tariff</strong> for you and create your <strong>product</strong> in <a onclick="ngNavigate([\'/financial\'])">Financial section</a>',
                'step_two': '<strong class="font-grey" style="font-size: 1.5em;">2.</strong> Create your first <strong>project</strong> in <a onclick="ngNavigate([\'/projects\'])">Projects section</a>',
                'step_three': '<strong class="font-grey" style="font-size: 1.5em;">3.</strong> Create your own Byzance<strong class="font-color-code">CODE</strong>, Byzance<strong class="font-color-grid">GRID</strong> and Byzance<strong class="font-color-blocko">BLOCKO</strong> programs',
                'step_four': '<strong class="font-grey" style="font-size: 1.5em;">4.</strong> Run it on Byzance<strong class="font-color-hardware">HARDWARE</strong> and in Byzance<strong class="font-color-cloud">CLOUD</strong>.',

            }, 'ProjectsComponent': {
                'main_title': 'Projects',
                'title': 'Projects',
                'btn_add_project': 'New project',
                'btn_new_subscription': 'New Financial Product',
                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'table_product': 'Product',
                'label_deactivated_under': 'Deactivated under',
                'label_project_properties': 'Project properties',
                'label_Remove_project': 'Remove project',
                'label_no_projects': 'There is not any project',
                'label_no_projects_comment': 'Create your first project, program, connect hardware and start slowly control the world. <br> Step by step.',
                'label_no_product': 'Mr. Salieri likes things in order and leads an accounting book...',
                'label_no_product_comment': 'If you want to create a project, you must have a <span class="bold"> financial product</span>. For add product click the link below.',
                'label_create_product_below': 'You can create it by click on button bellow.',


                'flash_project_create': 'The project {0} has been created.',
                'flash_cant_create_project': 'The project {0} cannot be created. {1}',
                'flash_cant_add_project': 'Cannot add project now.',
                'flash_project_update': 'The project has been updated.',
                'flash_cant_update_project': 'The project cannot be updated.',
                'flash_project_remove': 'The project has been removed.',
                'flash_cant_remove_project': 'The project cannot be removed.',

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
                'label_owner': 'Product Owner',
                'label_billing_info': 'Billing Info',
                'label_payment_detail_owner': 'Billing Details (Who Manage this Financial Product)',
                'label_payment_detail_invoice_target': 'Who is being invoiced',
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

            }, 'FinancialProductExtensionsComponent': {
                'title': 'Extensions',
                'label_average_monthly_cost': 'Average monthly cost',
                'label_no_extensions': 'No Extensions found.',
                'label_free': 'Free',
                'no_extension': 'No Extensions',
                'no_extension_comment': '<p>No extensions? No additional tuning? Let\'s just tell us that you\'re not making selfie to the instagram... </p> <p> Or are you Scrooge McDuck?!? </p>',

            }, 'RoleGroupComponent': {
                'main_title': 'Platform administration',
                'main_subtitle': 'Permission Roles',

                'title': 'List of Roles',
                'label_create_role': 'Create new Role',
                'label_name': 'Name',
                'label_description': 'Description',
                'label_actions': 'Action',
                'label_role_properties': 'Edit Role properties',
                'label_role_remove': 'Remove Role',
                'label_no_role': 'No Roles',
                'label_no_role_comment': 'We didn\'t find any roles. Create new one',

            }, 'GarfieldComponent': {
                'main_title': 'Platform administration',
                'main_subtitle': 'Garfield - Test & Burn Kits',

                'title': 'List of Roles',
                'label_create_role': 'Create new Role',

                'label_name': 'Name',
                'label_description': 'Description',
                'label_actions': 'Action',
                'label_type_of_board': 'Device Type',
                'label_producer': 'Producer',
                'label_test_kit_id': 'Tester Kit ID',

                'flash_cant_load': 'Cannot Load Garfields',
                'label_garfield_properties': 'Edit Garfield',
                'label_garfield_remove': 'Remove Garfield',

                'label_no_garfield_s': 'No Garfields',
                'label_no_garfield_s_comment': 'We didn\'t find any gafields. Create new one',

            }, 'FinancialProductInvoicesInvoiceComponent': {
                'title': 'Invoice {0}',
                'label_id_subscription': 'Subscription ID',
                'label_payment_mode': 'Payment Type',
                'label_status': 'Status',
                'label_paid_in': 'Paid in',
                'label_total': 'Total',
                'label_download_as_pdf': 'Download as PDF',
                'label_send': 'Send',
                'table_name': 'Name',
                'table_guid': 'GUID',
                'table_billable_units': 'Billable units',
                'table_unite': 'Unite',
                'table_total_cost': 'Total cost',

            }, 'AdminFinancialComponent': {
                'main_title': 'Platform administration',
                'main_subtitle': 'Financial Management - Tariffs',
                'title': 'List of All Tariffs',
                'label_tariff_create': 'Create new Tariff',
                'table_icon': 'Icon',
                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'label_tariff_edit_properties': 'Edit Tariff Properties',
                'label_change_order': 'Change Order',
                'label_active_tariff': 'Active tariff for platform',
                'label_deactive_tariff': 'Deactivate tariff for platform',
                'label_delete_tariff': 'Permanently remove tariff',
                'label_no_tariffs': 'No Tariffs',
                'label_no_tariffs_comment': 'We didn\'t find any tariffs. Create new one',

                'tab_tariffs': 'All Tariffs',
                'tab_extensions': 'All Independent Extensions',
                'flash_tariff_edit_success': 'Successfully updated',


            }, 'AdminFinancialTariffComponent': {
                'main_title': 'Platform administration',
                'main_subtitle': 'Tariff Management',
                'title': 'Tariff Settings',
                'tab_tariffs': 'Settings',
                'tab_extensions_optional': 'Optional Extensions',
                'tab_extensions_include': 'Included Extensions',
                'label_no_expansions': 'No Extensions in Tariff',
                'label_average_monthly_cost': 'Average monthly cost',
                'label_tariff_name': 'Tariff Name',
                'label_tariff_description': 'Long Text description',
                'label_tariff_identifier': 'Api identifier',
                'label_credit_for_beginning': 'Free Credit for beginning',
                'label_tariff_color': 'Background Color',
                'label_tariff_no_company_details_required': 'Company Details are NOT required',
                'label_tariff_company_details_required': 'Company Details are required',
                'label_tariff_no_payment_details_required': 'Payment Details are NOT required',
                'label_tariff_payment_details_required': 'Payment Details are required',
                'label_tariff_no_payment_method_required': 'Payment Method are NOT required',
                'label_tariff_payment_method_required': 'Payment Method are required',
                'flash_tariff_edit_success': 'Tariff Edit was successful',
                'ribbon_selected': 'Selected',
                'label_included': 'Included',
                'label_extension_price': 'Price (Average per month)',
                'label_extension_color': 'Color',
                'label_extension_type': 'Tyrion Extension Type',
                'label_extension_description': 'Description',
                'label_extension_name': 'Name',
                'label_free': 'Free',
                'label_change_order': 'Change order',
                'btn_select': 'Select',
                'btn_included': 'Include',

            }, 'ProjectsProjectComponent': {
                'title': 'PROJECT {0} DASHBOARD',
                'label_project_properities': 'Project properties',
                'label_project_remove': 'Remove project',
                'label_name': 'Name',
                'label_description': 'Description',
                'label_product': 'Financial Product',
                'label_byzance_hardware': 'Byzance<strong class="font-color-hardware">HARDWARE</strong>',
                'label_byzance_hardware_update': 'Byzance<strong class="font-color-hardware">HARDWARE</strong> Updates',
                'label_byzance_blocko': 'Byzance<strong class="font-color-blocko">BLOCKO</strong>',
                'label_devices_count': 'Devices count',
                'label_Status': 'Status',
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
                'label_in_group': 'in <strong> {0} </strong>group(s)',

                'flash_project_update': 'The project has been updated.',
                'flash_cant_update_project': 'The project cannot be updated.',
                'flash_project_remove': 'The project has been removed.',
                'flash_cant_remove_project': 'The project cannot be removed.',

            }, 'FinancialProductInvoicesComponent': {
                'title': 'Invoice',
                'label_downoload_pro_forma_pdf': 'Download Pro forma invoice as PDF',
                'label_download_pdf': 'Download invoice as PDF',
                'label_send': 'Send',
                'btn_add_credits': 'Add credits',
                'table_invoice_id': 'Invoice ID',
                'table_date_of_pay': 'Date of payment',
                'table_date_of_create': 'Date of creation',
                'table_paid': 'Paid',
                'table_actions': 'Actions',
                'no_invoice': 'No invoices',
                'payment_required': 'Payment required',
                'no_invoice_comment': ' <p>We did not find any financial records... which means you did not even start to spend money. </p> <p> Maybe Mr.Salieri should send his regards. </p>',
                'flash_invoice_been_resend': 'The invoice has been resent to your general invoice E-mail.',
                'flash_invoice_cant_be_resend': 'The invoice could not be sent!',


            }, 'ProductRegistrationComponent': {
                'main_title': 'Product subscribtion',
                'nav_step_one_title': 'Tariff',
                'nav_step_one_text': 'Select the right tariff for you',
                'nav_step_two_title': 'Packages',
                'nav_step_two_text': 'Choose your desired expansion',
                'nav_step_three_title': 'Information',
                'nav_step_three_text': 'Fill additional information',
                'nav_step_four_title': 'Summary',
                'nav_step_four_text': 'Check your order and confirm',
                'financial_monologue': '<p> The financial plan - or the package you can see here is only the starting state at the beginning. ' +
                'You can see estimated monthly costs and recommended customer type. ' +
                'Each tariff includes a group of extensions at the beginning, such as number of co-workers, storage size, technical support, etc., but you can remove or add, increase, or change extensions anytime later. ' +
                'All tariffs and extensions are based on SaaS (Software as a Service) and Haas (Hardware as a Service). ' +
                'You can pay by card or set up automatic email billing alerts to be notified to your account department, which will be sent by bank transfer. ' +
                '<strong> For each tariff, we give you free credit that should be enough for the first month for free. </strong></p>' +
                '<p>For <strong>large or individual customers</strong>, we have a special tariff by the business contract with technical support, dedicated developers in your office etc. </p>' +
                '<p> For more details please visit <a href="http://byzance.cz/financial" target="_blank">Financial Site</a> </p>',
                'step_one_title': 'Tariff',
                'step_two_title': 'Packages',
                'label_companies': 'Which company will be the owner?',
                'label_select_company': 'Select Company',
                'tab_extensions_optional': 'Voluntary enlargement right from the start',
                'tab_extensions_include': 'Already in the package',
                'step_two_no_expansions': 'There are no expansions packages, click Continue.',
                'step_three_title': 'Information',
                'step_three_product_info': 'Product information',
                'step_three_billing_info': 'Billing information',
                'step_three_label_product_name': 'Product name (your unique name for this tariff order)',
                'label_average_monthly_cost': 'Average monthly cost',
                'label_no_optional_extensions': 'No available optional extensions',
                'label_no_optional_extensions_comment': 'We did not find the available extensions for this tariff. But do not be afraid -  Everything comes to him who waits... In the future there will surely be an opportunity to spend more money with us :P',
                'label_create_new_company': 'Or Create new Absolutely independent Account (Company)',

                'label_invoice_email': 'Invoice E-mail',
                'label_payment_method': 'Payment method',
                'label_company_info': 'Billing information',
                'label_customer_info': 'My Customer Info',
                'step_three_my_company': 'My Company Info',
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
                'label_want_tariff_not_found': 'Wanted tariff not found.',
                'label_free': 'Free',
                'label_cant_load_tariff': 'Cannot load tariffs. {0}',
                'label_finance_model': 'Billing model',
                'label_finance_model_integrator': 'I am an integrator and I will manage the finances for my customer',
                'label_finance_model_do_it_yourself': 'Finance will be charged to me',

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
                'table_total': 'Monthly estimated cost',

                'text_unknown': 'Unknown',
                'average_monthly_cost': 'Average monthly cost',
                'btn_select': 'Select',
                'btn_create_new_company': 'Create new Financial Account',
                'btn_included': 'Included',
                'ribbon_selected': 'Selected',
                'flash_cant_buy_product': 'The product cannot be bought.',
                'flash_product_created_prepaid': 'Financial Product was created, you are using your pre-paid credit',
                'flash_product_created': 'Financial Product was created, now you can create a new project',

            }, 'FinancialProductComponent': {
                'main_title': 'Financial',
                'title': 'Dashboard',
                'btn_add_credit': 'Add credit',
                'label_instance_properties': 'instance properties',
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
                'label_billing_mode': 'Billing Mode',
                'label_contacts_details': 'Contacts details',
                'label_financial_product_properties': 'Financial product properties',
                'label_deactivate_product': 'Deactivate product',
                'label_activate_product': 'Activate product',
                'label_modal_body_text': 'By deactivating, you disable instances in the cloud and disconnect hardware from our servers. Remote administration will stop working. But All data and settings will be saved and you can reactivate the product at any time.',
                'flash_cant_deactivate_product': 'The product cannot be deactivated.',
                'flash_product_activated': 'The product has been activated.',
                'flash_cant_activate_product': 'The product cannot be activated.',
                'flash_product_deactivated': 'The product has been deactivated.',

            }, 'FinancialComponent': {
                'main_title': 'Financial',
                'title': 'Products',
                'btn_new_subscription': 'New Subscription',
                'label_product_list': 'Products list',
                'label_title_bank_transfer': 'Bank transfer',
                'label_title_credits': 'Credits',
                'label_title_credit_card': 'Credit Card',
                'label_title_free': 'Free',
                'label_active': 'active',
                'label_actions': 'Actions',
                'label_subscription_id': 'ID',
                'label_hibernation': 'hibernation',
                'label_modal_body_text': 'By deactivating, you disable instances in the cloud and disconnect hardware from our servers. Remote administration will stop working. But All data and settings will be saved and you can reactivate the product at any time.',

                'label_financial_product_properties': 'Financial product properties',
                'label_deactivate_product': 'Deactivate product',
                'label_activate_product': 'Activate product',


                'table_name': 'Name',
                'table_type': 'Type',
                'label_client_billing': 'Client Billing',
                'label_client_private': 'Private',
                'table_payment_type': 'Payment',
                'table_subscription_id': 'Subscription id',
                'label_bank_transfer': 'Bank transfer',
                'label_credits': 'Credits',
                'label_credit_card': 'Credit Card',
                'label_free': 'Free',
                'label_not_set_yet': 'Not set yet',
                'label_no_product': 'No product',
                'label_no_product_comment': 'First create a financial entity under which all your content will be registered. You can add hardware, run cloud applications, deploy own servers, pay invoices :P and of course go safely from prototype to mass IoT production. <br><br> We wish you much luck with the ideas that dominate the world.',
                'flash_cant_deactivate_product': 'The product cannot be deactivated. ',
                'flash_product_activated': 'The product has been activated.',
                'flash_cant_activate_product': 'The product cannot be activated. ',
                'flash_product_deactivated': 'The product has been deactivated.',
                'flash_products_cant_load': 'Products cannot be loaded, {0}.'

            }, 'HardwareHardwareTypeComponent': {
                'main_administration_title': 'Platform administration',
                'main_title': 'Hardware Type',
                'main_subtitle': 'Board Type Management',
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
                'label_bootloader_remove': 'Remove bootloader',
                'label_bootloader_set_as_main': 'Set bootloader as main',
                'label_bootloader_download_file': 'Download bootloader for manual restore',
                'label_type_of_board_properties': 'Change bootloader properties',
                'label_main_bootloader': 'Main bootloader',
                'label_bootloader_settings': 'Bootloader settings',
                'label_set_own_picture': 'Set own picture',
                'label_bootloader_comment': 'Bootloader file must be compatible with unique bootloader object identification',
                'label_bootloader_upload_file': 'Upload Bootloader file first',

                'label_type_of_boards_properties': 'Edit basic description',
                'label_type_of_boards_remove': 'Remove this Board type',
                'label_no_bootloaders': 'No Nootloaders',
                'label_no_bootloaders_comment': 'We didn\'t find any Bootloaders, please set new one',
                'label_bootloader_create_description': 'Create Bootloader',
                'label_default_c_program_setting': 'Default C Program',
                'label_default_test_c_program_setting': 'Default Test C Program',
                'label_main_c_program_version_set_as_main': 'Set this version as Main',

                'label_revisions': 'Revisions & Production Batches',
                'label_revision_create_description': 'Create new Revisions or Production Batch',
                'table_revision': 'Revision',
                'table_production_batch': 'Production Batch',
                'table_mac_range': 'MacAddress Range',
                'table_latest_used': 'Latest Used',
                'table_ean': 'Ean Code',
                'table_assembly_time': 'Assembly Date',

                'label_c_program_version_set_as_main': 'Set this version as a main',
                'label_no_c_program_versions': 'No version found',
                'label_no_c_program_versions_comment': 'We didn\'t find any versions, please create new one',
                'label_no_batch': 'No Revisions or Batches',
                'label_no_batch_comment': 'We didn\'t find any revisions or production batches, please create new one',

                'flash_successfully_set_as_default': 'Successfully set as default',
                'flash_file_uploaded': 'File successfully uploaded',
                'flash_successfully_set_main': 'Successfully set as main',
                'flash_cant_set_main': 'Cannot mark as main',

                'table_id': 'Id',
                'table_name': 'Name',
                'table_identifier': 'Version Identification',
                'table_description': 'Description',
                'table_change_notes': 'Change notes',
                'table_author': 'Author',
                'table_status': 'Status',
                'table_actions': 'Actions',

                'btn_create_c_program_version': 'Create new Version',
                'btn_create_bootloader': 'Create first Bootloader',

            }, 'HardwareComponent': {
                'main_title': 'Hardware Types',
                'flash_project_cant_load': 'Projects could not be loaded, {0}.'

            }, 'ModalsHardwareGroupDeviceSettingsComponent': {
                'main_title': 'Hardware Groups Device Settings',
                'label_available': 'Available Groups',
                'title_in_group': 'In Groups'

            }, 'PictureUploadComponent': {
                'flash_image_too_small': 'image is too small',
                'label_unsaved': 'unsaved',
                'label_select_avatar': 'select avatar',
                'label_avatar': 'avatar',
                'flash_image_changed': 'image has been changed',
            },

            'ForgotPasswordComponent': {
                'title': 'Forgot your password?',
                'info_text': 'Enter your E-mail address below to reset your password.',
                'flash_email_sent': 'E-mail with instructions for password reset was sent.',
                'flash_email_not_sent': 'E-mail could not be sent, {0}.',

            }, 'PasswordRestartComponent': {
                'title': 'Reset password',
                'info_text': 'Enter your E-mail address and new password.',
                'label_confirm_password': 'Confirm password',

                'placeholder_password': 'Password',
                'placeholder_confirm_password': 'Confirm password',
                'flash_password_change_fail': 'Password could not be changed, {0}.',
                'flash_password_change_success': 'Password was successfully changed.',

            }, 'LoginComponent': {
                'label_log_in': 'Log In',
                'label_forget_password': 'Forgot password?',
                'label_login_social': 'Log in or Sign up with',
                'btn_create_account': 'Create an account',
                'btn_login': 'Login',
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
                'label_notif_undead': '(<b>{0}</b> unread notifications)',
                'flash_cant_load': 'Could not load notifications',

            }, 'ProducersProducerComponent': {
                'main_title': 'Producers',
                'title': 'Producer',
                'label_available_devices': 'Available devices',
                'label_no_device': 'No devices available.',
                'flash_project_cant_load': 'Project could not be loaded, {0}.',

            }, 'ModalsUpdateReleaseFirmwareComponent': {
                'title': 'Firmware Release Settings',
                'label_hw_group_title': '<strong class="font-color-hardware">HARDWARE</strong> Groups',
                'label_select': 'Select',
                'label_hardware_group': 'Hardware Group',
                'label_firmware_title': '<span class="font-color-code">FIRMWARE</span>',
                'label_bootloader_title': '<span class="font-color-code">BOOTLOADER</span>',
                'label_no_firmware_warning': 'Sorry, but you haven\'t owned <strong class="font-color-code">FIRMWARE CODE</strong> (program) yet.',
                'label_no_groups_warning': 'Sorry, but you haven\'t owned <br><strong class="font-color-hardware">HARDWARE</strong> groups yet.',
                'label_no_hw_types_in_group': 'Sorry, but this <strong class="font-color-hardware">HARDWARE</strong> groups probably not contains any Hardware',
                'label_firmware_type': 'Firmware Type',
                'label_select_bootloader_version': 'Select Bootloader version',
                'label_select_time': 'Select Time',
                'label_select_date': 'Select Date',
                'label_when': 'When',
                'label_immediately': 'Immediately',
                'label_on_time': 'At a set time',

            }, 'ProducersComponent': {
                'main_title': 'Manufacturers',
                'title': 'Manufacturers',
                'table_name': 'Name',
                'table_description': 'Description',
                'label_no_producer': 'No manufacturers available.',
                'flash_project_cant_load': 'Project could not be loaded, {0}.',

            }, 'ProfileComponent': {
                'main_title': 'Account Settings',
                'title': 'Your profile',
                'nav_personal_info': 'Personal Information',
                'nav_avatar': 'Avatar',
                'nav_password': 'Password',
                'nav_email': 'E-mail Settings',
                'nav_logins': 'Login Management',

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
                'label_set_own_picture': 'Set profile picture',
                'table_system_component': 'System Component',
                'table_user_agent': 'User Agent',
                'table_created': 'Created',
                'table_access_age': 'Expiration',
                'table_actions': 'Actions',

                'flash_cant_change_password': 'Could not change password, ',
                'flash_email_was_send': 'E-mail with instructions was sent.',
                'flash_user_cant_log_out': 'This user could not be logged out, ',
                'flash_cant_change_email': 'Could not change email, ',
                'flash_image_too_small': 'Image is too small, minimal dimensions are 50x50px.',
                'flash_new_avatar_saved': 'New avatar saved successfully.',
                'flash_cant_save_avatar': 'Could not save new avatar, ',
                'flash_information_updated': 'Your information was updated.',

            }, 'ProjectsProjectBlockoBlockoComponent': {
                'title': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> - PROGRAM <strong>{0}</strong>',

                'label_blocko_name': '<strong class="font-color-blocko" > BLOCKO </strong> Program Name: <strong>{0}</strong >',
                'label_blocko_description': '<strong class="font-color-blocko">BLOCKO </strong> Program Description: <strong>{0}</strong >',
                'label_connections': 'Connections',
                'label_blocko_program_properities': 'BLOCKO program properties',
                'label_remove_blocko_program': 'Remove BLOCKO program',
                'label_modal_no_padavan': 'No available padavan boards hardware.',
                'label_used_in_cloud': 'Latest Used in Cloud',
                'tab_hardware': 'Hardware',
                'tab_grid': 'Grid',
                'tab_blocko': 'Blocko',
                'tab_blocks': 'Blocks',
                'tab_hw_groups': 'HW Groups',
                'tab_instance_in_cloud': 'Instance in cloud',
                'tab_saved_versions': 'Saved Versions',
                'btn_add_slave': 'Add Slave Device',
                'btn_add_master': 'Add Master Device',
                'btn_add_grid': 'Add GRID project',
                'btn_clear_program': 'Clear Program',
                'btn_clear_console': 'Clear Console',
                'btn_upload_on_cloud': 'Upload Latest Configuration to Cloud',
                'btn_turn_off_instance': 'Shutdown instance',
                'btn_change_cloud_version': 'Change Version',
                'btn_first_deploy_cloud_version': 'Deploy to cloud',
                'btn_select_cloud_version': 'Select & Upload Version to Cloud',
                'label_no_devices_added': 'No devices added in this <strong class="font-color-blocko">BLOCKO</strong> program.',
                'label_select_version': 'Select Version',
                'label_no_program_version': 'No program version.',
                'label_modal_change_instance_version': 'Change Instance Version',
                'label_modal_change_running_instance_version': 'Are you sure to change the running instance version?',
                'label_modal_ok': 'OK',
                'label_modal_error': 'ERROR',
                'label_modal_no_main_boards': 'No available Master Devices.',
                'label_modal_shutdown_instance': 'Shutdown instance',
                'label_modal_confirm_shutdown_instance': 'Are you sure to shutdown the running instance?',
                'label_no_grid_in_blocko': 'No <strong class="font-color-grid">GRID</strong> projects added in this <strong class="font-color-blocko">BLOCKO</strong> program',
                'label_modal_cant_save_blocko_hw_without_version': 'Unable to save <strong class="font-color-blocko">BLOCKO</strong>, you have <b>hardware devices</b> without program <b>versions selected</b>.',
                'label_modal_clear_program': 'Clear Program',
                'label_modal_confirm_clear_blocko_program': 'Are you sure to clear the <strong class="font-color-blocko">BLOCKO</strong> program?',
                'label_modal_cant_save_grid_hw_without_version': 'Unable to save <strong class="font-color-blocko">BLOCKO</strong>, you have <b>grid programs</b>, without program <b>versions selected</b>.',
                'checkbox_advanced_mode': 'Advanced Mode',
                'label_no_blocks_in_group': 'No BLOCKs in this group',

                'table_name': 'Name',
                'table_in_cloud': 'In Cloud',
                'table_description': 'Description',
                'table_author': 'Author',
                'table_actions': 'Actions',

                'label_cloud': 'CLOUD',
                'label_blocko': 'BLOCKO',
                'label_server': 'Server Name',
                'label_instance': 'Instance ID',
                'label_status': 'Status:',
                'label_version': 'Version:',
                'label_none': 'None',
                'label_program_version': 'Program version',
                'label_version_properties': 'Version properties',
                'label_remove_version': 'Remove version',
                'label_remove_device': 'Remove device',
                'label_remove_grid': 'Remove grid project',

                'flash_cant_load_blocko': 'The blocko cannot be loaded. ',
                'flash_cant_load_version': 'Unable to load version <b>{0}</b>`, {1}.',
                'flash_cant_save_version': 'Unable to save version <b> {0} </b>, {1}.',
                'flash_version_saved': 'Version <b> {0} </b> saved successfully.',
                'flash_cant_change_version': 'Unable to change version, {0}.',
                'flash_cant_load_blocko_block': 'Unable to load this BLOCK version, ',
                'flash_cant_add_blocko_block': 'Unable to add this BLOCK.',
                'flash_cant_load_blocko_version': 'Unable to load this BLOCKO version, ',
                'flash_cant_update_blocko': 'Unable to update BLOCKO, ',
                'flash_blocko_updated': 'BLOCKO updated successfully.',
                'flash_cant_remove_blocko': 'Unable to remove BLOCKO, ',
                'flash_blocko_removed': 'BLOCKO removed successfully.',
                'flash_cant_change_information': 'Unable to change this information, {0}.',
                'flash_version_removed': 'Version removed successfully.',
                'flash_cant_remove_version': 'Could not remove version.',
                'flash_cant_find_program_version': 'Program version is not found.',
                'flash_edit_version_been_changed': 'Version {0} has been changed.',
                'flash_edit_cant_change_version': 'Version {0} could not be changed, {1}.',
                'flash_cant_turn_instance_on': 'Could not turn on this instance, {0}.',
                'flash_cant_turn_instance_off': 'Could not turn off this instance, {0}.',

            }, 'ProjectsProjectHardwareComponent': {

                'title': 'Project <strong class="font-color-hardware">HARDWARE</strong> Overview',
                'label_loading': 'Loading',
                'label_name': 'Name',
                'label_id': 'Full ID',
                'label_description': 'Description',
                'label_type': 'Type',
                'label_status': 'Status',
                'label_actions': 'Actions',
                'btn_add_hardware': 'Add a Device',
                'btn_add_hardware_group': 'Create a Group',
                'btn_add_new_update': 'Release Firmware',
                'label_no_hardware': 'No <strong class="font-color-hardware">HARDWARE</strong> in this project.',
                'label_no_hardware_comment': 'Click on the button bellow to add a new device.',
                'label_no_hardware_group': 'No <strong class="font-color-hardware">HARDWARE GROUP</strong> in this project.',
                'label_no_hardware_group_comment': 'Click on the button bellow to add a new group for hardware.',
                'label_no_updates': 'No <strong class="font-color-code">FIRMWARE </strong> release',
                'label_no_updates_comment': 'Click on the button bellow to update <strong class="font-color-hardware">HARDWARE</strong>, or <strong class="font-color-hardware">Hardware Groups</strong>.',
                'label_device_properties': 'Device properties',
                'label_remove_device': 'Remove device',
                'label_time_missing_in_json': 'Not Yet',

                'tab_hardware_list': 'Hardware List',
                'tab_hardware_groups': 'Hardware Groups',
                'tab_updates': 'Updates',

                'table_description': 'Description',
                'table_id': 'Updates',
                'table_update_id': 'Update HASH',
                'table_finished': 'Finished',
                'table_created': 'Created',
                'table_planed': 'Planed',
                'table_program': 'Program',
                'table_version': 'Version',
                'table_status': 'Status',
                'table_details': 'Details',
                'table_update_type': 'Update Type',
                'table_firmware_type': 'Type',
                'table_update_progress': 'Progress',
                'table_update_state': 'State',
                'table_hardware_id': 'Hardware ID',
                'table_name': 'Alias Name',
                'table_groups': 'Groups',
                'table_actions': 'Actions',
                'table_size': 'Size []',

                'flash_add_device_success': 'Device {0} has been added to your project.',
                'flash_add_device_fail': 'Device {0} could not be added to your project, {1}.',
                'flash_edit_device_success': 'Device information was updated.',
                'flash_edit_device_fail': 'Device information could not be updated. ',
                'flash_remove_device_success': 'Device has been removed.',
                'flash_remove_device_fail': 'Device could not be removed, ',

            }, 'ProjectsProjectHardwareHardwareComponent': {

                'title': 'Byzance<strong class="font-color-hardware">HARDWARE</strong> - DEVICE <strong>{0}</strong>',
                'main_administration_title': 'Platform administration',
                'main_subtitle': 'Embedded Hardware Settings',
                'tab_overview': 'Overview',
                'tab_update': 'Update progress',
                'tab_developer': 'Developer Settings',
                'tab_advance_command_center': 'Advance Command center',

                'label_name': 'Name',
                'label_version': 'Version',
                'label_description': 'Description',
                'label_type': 'Type',
                'label_producer': 'Manufacturer',
                'label_revision': 'Revision',
                'label_id': 'ID',
                'label_web_link': 'Hardware Web view',
                'label_ethernet_address': 'Ethernet MAC address',
                'label_wifi_address': 'Wi-Fi MAC address',
                'label_device_status': 'Device status',
                'label_server': 'Server Name',
                'label_device_last_seen': 'Last seen',
                'label_bootloader_version': 'Version',
                'label_last_seen_unknow': '(Unknown)',
                'label_update_to': 'Update to',
                'label_update_in_que': 'Update in Que',
                'label_developer_settings': 'Developer settings',
                'label_port': 'Port',
                'label_alerts': 'Alerts',
                'label_overview': 'Overview',
                'label_settings': 'Settings & Developers',
                'label_core_configuration': 'Core Bootloader Configuration',
                'label_core_configuration_comment': '<p>Please keep in mind that you have God\'s power. You can remotely change anything out of common flow. Please change key configuration parameters only if you know what you are doing.</p>',
                'label_core_registers': 'Registers',
                'label_restart_device': 'Restart Device',
                'label_restart_to_bootloader': 'Restart to Bootloader',
                'label_change_mqtt_pass': 'Restart MQTT Password',
                'label_change_server': 'Change Server',
                'label_info': 'Basic System Info',
                'label_image': 'Image',
                'label_set_own_picture': 'Set your own photo',
                'label_no_running_update_on_hardware': 'No <strong class="font-color-code">FIRMWARE </strong> release',
                'label_no_running_update_on_hardware_comment': 'There is no update for this device yet. Create new Code program orr set new release',
                'label_main_server': 'Main Server',
                'label_instance': 'Instance ID',
                'label_main_server_not_found': 'Device is not connected to Server yet',
                'label_not_in_instance': 'Device is not connected to an instance',
                'label_online': 'online',
                'label_offline': 'offline',
                'label_none': 'none',
                'label_unknown_value': 'none',
                'label_cant_load_device': 'Device cannot be loaded. {0}',
                'label_no_hardware_to_show_comment': 'There are no devices to show, but you can add some',

                'label_actual_program_name': 'Current <strong class="font-color-code">FIRMWARE </strong> name',
                'label_actual_program_version': 'Current <strong class="font-color-code">FIRMWARE </strong> version name',
                'label_actual_backup_program_name': 'Current <strong class="font-color-code">BACKUP </strong> program name',
                'label_actual_backup_program_version': 'Current <strong class="font-color-code">BACKUP </strong> version name',
                'label_backup_mode': 'Backup mode',
                'label_backup_static': 'Manual',
                'label_backup_automatic': 'Automatic',
                'label_switch_to_automatic': 'switch to <strong>Automatic</strong>',
                'label_switch_to_static': 'switch to <strong>Manual</strong>',
                'label_time_missing_in_json': 'Not yet (Unknown)',
                'label_not_set_none': 'none',
                'label_you_can_set': '(You can set that)',
                'label_bootloader_not_supported': 'Backend has not set Bootloader for this type od Board',
                'label_bootloader_database_not_recognize': 'No available record about actual Bootloader version on Hardware ',
                'label_bootloader_up_to_date': 'Hardware has latest version',
                'label_firmware': 'Firmware',
                'label_backup': 'Backup',
                'label_bootloader': 'Bootloader',
                'label_code': 'CODE',
                'label_blocko': 'BLOCKO',
                'label_cloud': 'CLOUD',
                'label_remove_device': 'Remove device',
                'label_device_properties': 'Device properties',
                'label_terminal': 'terminal',
                'label_settings_terminal': 'settings',
                'label_unsubscribe': 'unsubscribe',
                'label_no_hardware_to_show': 'No hardware to show',
                'label_change_log_level': 'Change log level',
                'btn_add_hardware': 'Add hardware',
                'btn_clear_console': 'clear console',

                'table_id': 'Update ID',
                'table_program': 'Program',
                'table_started': 'Created',
                'table_planed': 'Planed',
                'table_finished': 'Finished',
                'table_type': 'Update type',
                'table_progress': 'Progress',
                'table_state': 'Status',
                'table_version': 'Version',
                'table_status': 'Status',
                'table_color': 'Terminal color',
                'table_actions': 'Actions',
                'table_logLevel': 'Log Level',
                'table_connection': 'Connection status',

                'flash_cant_add_hardware': 'Unable to add hardware ',
                'flash_no_more_device': 'No more Device to add',
                'flash_edit_device_success': 'Device information was updated.',
                'flash_edit_device_fail': 'Device information could not be updated, ',
                'flash_device_restart_success': 'Restart command was successful',
                'flash_remove_device_success': 'Device has been removed.',
                'flash_remove_device_fail': 'Device could not be removed, ',
                'flash_cant_update_bootloader': 'Unable to update Bootloader, {0}.',
                'flash_cant_edit_backup_mode': 'Device backup mode could not be changed, {0}.',

            }, 'ProjectsProjectInstancesComponent': {

                'title': 'Byzance<strong class="font-color-cloud">CLOUD</strong> - ALL INSTANCES',

                'table_name': 'Name',
                'table_id': 'ID',
                'table_description': 'Description',
                'table_blocko_program': 'Program',
                'table_status': 'Status',
                'table_actions': 'Actions',

                'flash_instance_edit_success': 'Instance information has been updated.',
                'flash_instance_edit_fail': 'Instance information could not be updated. ',

                'label_shut_down_instance_modal': 'Shutdown instance',
                'label_shut_down_instance_modal_comment': 'Are you sure to shutdown the running instance?',
                'label_upload_instance_modal': 'Deploy to Cloud',
                'label_upload_instance_modal_comment': 'The last used <strong class="font-color-blocko">BLOCKO</strong> configuration will be uploaded to the server.',
                'label_upload_error': 'Unable to shutdown this instance, {0}.',
                'label_no_item': 'No instances found in <strong class="font-color-cloud">CLOUD</strong>.',
                'label_you_can_create': 'Are you sure to upload <strong class="font-color-blocko">BLOCKO</strong> and deploy instance to the Cloud?',
                'label_shutdown_instance': 'Shutdown instance',
                'label_upload_latest_used_version': 'Upload Latest Configuration to Cloud',
                'label_start': 'Start instance',
                'label_instance_properties': 'Instance properties',
                'label_own_name_and_description': 'You can set your own name and description',

            }, 'ProjectsProjectInstancesInstanceComponent': {

                'title': 'Byzance<strong class="font-color-cloud">CLOUD</strong> - instance <strong>{0}</strong>',

                'tab_name_overview': 'Overview',
                'tab_name_hardware': '<strong class="font-color-hardware">HARDWARE</strong>',
                'tab_name_grid': '<strong class="font-color-grid">GRID</strong> Apps',
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
                'table_started': 'Created',
                'table_planed': 'Planed',
                'table_finished': 'Finished',
                'table_type': 'Update type',
                'table_progress': 'Progress',
                'table_state': 'Status',

                'btn_change_version_in_cloud': 'Change version in Cloud',
                'btn_upload_on_cloud': 'Upload Latest Configuration to Cloud',
                'btn_select_cloud_version': 'Select & Upload Version to Cloud',
                'btn_turn_off_instance': 'Shut Down',
                'label_instance_properties': 'properties',
                'label_instance_name': 'Name',
                'label_instance_description': 'Description',
                'label_instance_id': 'ID',
                'label_server_name': 'Server',
                'label_instance_status': 'Status',
                'label_status': 'Status',
                'label_info': 'Info',
                'label_instance_info_is_offline': 'This instance is offline',
                'label_instance_type': 'Instance Type',
                'label_created': 'Created',
                'label_running_from': 'Running from',
                'label_running_to': 'Running until',
                'label_running_status': 'Status',
                'label_planned': 'Planned',
                'label_progress': 'Progress',
                'label_update_state': 'Update state',
                'label_no_updates_title': 'No updates',
                'label_no_update_text': 'Set instance to cloud does not require any updates of firmware on hardware',
                'label_project': 'Project',
                'label_program': 'Program',
                'label_finished': 'Finished',
                'label_firmware_type': 'Firmware Type',
                'label_version': 'Version',
                'label_description': 'Description',
                'label_no_history_in_instance': 'There is no history for this instance',
                'label_no_history_in_instance_comments': 'After you upload Instance to Cloud, you will see a miracle. If it does not meet your expectations, try Pornhub',
                'label_hardware_actual_in_instance': 'Currently in Instance',
                'label_hardware_no_hardware_in_instance': 'No assigned Hardware in currently running instance',
                'label_hardware_no_hardware_in_instance_comments': 'Create a new <strong class="font-color-blocko">BLOCKO</strong> version and assign the hardware. Or shift the <strong class="font-color-hardware">Hardware groups</strong> that are assigned to this instance.',
                'label_grid_no_grid_in_instance': 'No apps in this instance.',
                'label_grid_no_grid_in_instance_comments': 'Create a new <strong class="font-color-blocko">BLOCKO</strong> version and assign the <strong class="font-color-grid">GRID</strong> Apps.',
                'label_remove_device': 'Remove device',
                'label_device_type': 'Device type',
                'label_no_running_update_on_instance': 'There is no running updates in this instance',
                'label_no_running_update_on_instance_comments': 'There are no records of the required <strong class="font-color-hardware">Hardware</strong> update',
                'label_online_status': 'online status',
                'label_instance_not_running_in_cloud': 'Instance is not running in Cloud.',

                'label_cloud': 'CLOUD',
                'label_blocko': 'BLOCKO',
                'label_grid': 'GRID',
                'label_code': 'CODE',
                'label_hardware': 'Hardware',
                'label_bootloader': 'Bootloader',
                'label_backup': 'Backup',
                'label_firmware': 'Firmware',
                'label_unknown_date': 'Not yet (Unknown)',
                'label_hardware_caps': 'HARDWARE',
                'label_select_version_for_details': 'Select version to see details',

                'label_modal_shutdown_instance': 'Shutdown instance',
                'label_modal_confirm_shutdown_instance': 'Are you sure to shutdown the running instance?',
                'label_modal_run_latest_version': 'Deploy to CLOUD in the latest version',
                'label_modal_confirm_run_latest_version': 'Are you sure to deploy <strong class="font-color-blocko">BLOCKO</strong> and instance to CLOUD?',
                'label_cannot_execute': 'Unable to execute command, {0}.',
                'label_cannot_change_version': 'Unable to change version, {0}',
                'flash_cannot_change_developer_parameter': 'Unable to change parameter, ',
                'flash_picture_updated': 'Picture updated successfully.',
                'flash_cant_picture_update': 'Cannot update picture, ',
                'label_cannot_change_program_publicity': 'Unable to change program privacy setting, ',
                'label_modal_change_instance_version': 'Change instance version',
                'label_modal_change_running_instance_version': 'Are you sure to change the running instance version?',
                'label_time_missing_in_json': 'Time is missing in Json',

                'flash_cant_load_version': 'Cannot load version <b>{0}</b>, {1}',
                'flash_instance_edit_success': 'Instance information was changed.',
                'flash_instance_edit_fail': 'Unable to change instance information, ',

            }, 'ProjectsProjectLibrariesComponent': {

                'title': 'Byzance<strong class="font-color-code">CODE</strong> - ALL LIBRARIES',

                'label_program_properties': 'CODE program properties',
                'label_remove_program': 'Remove CODE program',
                'label_list_no_item_main': 'There is not any code library in this project',
                'label_list_no_item_sub': 'You can create it by click on the button bellow.',
                'label_no_public_library': 'No public <strong class="font-color-code">CODE</strong> Libraries',
                'label_create_public_library_comment': 'If you do not see your dream library, create it and share it with others.',

                'btn_add_library': 'New Library',

                'tab_my_libraries': 'Private Libraries',
                'tab_public_libraries': 'Public Libraries',

                'flash_library_add_success': 'Library has been created.',
                'flash_library_add_fail': 'Unable to create library {0}, {1}.',
                'flash_library_edit_success': 'Library has been updated.',
                'flash_library_edit_fail': 'Unable to update library, ',
                'flash_library_removed_success': 'Library has been removed.',
                'flash_library_removed_fail': 'Unable to remove library, ',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_hardware_type': 'Only compatible with',
                'table_actions': 'Actions',

            }, 'ProjectsProjectLibrariesLibraryComponent': {

                'title': 'Byzance<strong class="font-color-code">CODE</strong> - LIBRARY <strong>{0}</strong>',

                'label_library_properties': 'CODE library properties',
                'label_delete_library': 'Delete',

                'flash_version_saved': 'Version <b>{0}</b> saved successfully.',
                'flash_cant_save_version': 'Failed saving version <b>{0}</b>. {1}',
                'flash_unsaved_changes_version_change': 'You have <b> unsaved changes</b> in version <b> {0} </b>, do you really want switch to version <b>{1}</b>?',
                'flash_unsaved_changes_version_reload': 'You have <b>unsaved changes</b> in version <b>{0}</b>, do you really want reload this version?',
                'flash_cant_load_version': 'Cannot load version <b>{0}</b>`, {1}',
                'flash_library_edit_success': 'Library has been updated.',
                'flash_library_edit_fail': 'Unable to update library, ',
                'flash_library_removed_success': 'Library has been removed.',
                'flash_library_removed_fail': 'Unable to remove library, ',
                'flash_version_save_success': 'Version <b> {0} </b> saved successfully.',
                'flash_version_save_fail': 'Unable to save version <b> {0} </b>, {1}.',
                'flash_version_edit_success': 'Version <b> {0} </b> saved successfully.',
                'flash_version_edit_fail': 'Unable to save version <b> {0} </b>, {1}.',
                'flash_version_removed_success': 'Version has been removed.',
                'flash_version_removed_fail': 'Unable to remove library, ',
                'flash_cannot_load_library': 'Unable to load library.',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_author': 'Author',
                'table_actions': 'Actions',

                'label_ide': 'IDE',
                'label_code': 'CODE',
                'label_version_properties': 'Version properties',
                'label_remove_version': 'Remove version',
                'label_save': 'SAVED VERSIONS',
                'label_name': '<strong class="font-color-code">CODE</strong>Library Name',
                'label_description': '<strong class="font-color-code">CODE</strong>Library Description',
                'label_version': 'Version',
                'label_no_library_version': 'There are no libraries yet.',
                'label_library_make_copy': 'Make a copy of Library.',
                'label_public_comment': 'This is public Library, you can only test it or make a copy.'

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

                'label_remove_member': 'Remove member',
                'label_send_invitation': 'Send invitation again',

                'label_cannot_remove_yourself': 'You can`t remove yourself from your project.',
                'label_cannot_add_member': 'Unable to add collaborators. {0}',
                'label_cannot_delete_person': 'Unable to remove collaborator, {0}.',
                'label_cannot_resend_invitation': 'Unable to re-send invitation, {0}.',
                'label_invitation_sent': 'Invitation(s) sent.',

            }, 'ProjectsProjectWidgetsComponent': {
                'main_title': 'Platform administration',
                'main_subtitle': 'Community Grid Administration',
                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - ALL WIDGET GROUPS',
                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'btn_add_widget_group': 'Create GRID widget group',
                'tab_public_groups': 'Public Groups',
                'tab_private_groups': 'Private Groups',
                'tab_programs_for_decisions': 'Widgets waiting for decision',
                'table_group_size': 'Number of Widgets',

                'label_no_programs': 'No Widgets',
                'label_no_program_comment': 'No widgets for community administrator decision',
                'label_no_groups': 'No public <strong class="font-color-grid">GRID</strong> widgets available',
                'label_no_groups_comment': 'If you do not see your dream widget, create it and share it with others.',
                'btn_create_group': 'Create Group',

                'flash_grid_group_add_success': 'Group has been successfully created.',
                'flash_grid_group_add_fail': 'Unable to create group, ',
                'flash_grid_group_edit_success': 'Group has been changed.',
                'flash_grid_group_edit_fail': 'Unable to edit group, ',
                'flash_grid_group_remove_success': 'Group has been removed.',
                'flash_grid_group_remove_fail': 'Unable to remove group, ',

                'label_no_item': 'No <strong class="font-color-grid">GRID</strong> widget groups in this project.',
                'label_you_can_create': 'Click on the button bellow to create a group to collect your own widgets',
                'label_group_properities': 'Group properties',
                'label_remove_group': 'Remove group',

            }, 'ProjectsProjectWidgetsWidgetsComponent': {
                'main_title': 'Platform administration',
                'main_subtitle': 'Community Widget Group',
                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - WIDGET GROUP <strong>{0}</strong>',

                'btn_add_widget': 'Create GRID widget',
                'widget_group_name': 'Group Name',
                'widget_group_description': '<strong class="font-color-grid">GRID</strong> Widget Group Description: <strong>{0}</strong>',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',

                'label_group_properities': 'Group properties',
                'label_remove_group': 'Remove group',
                'label_widget_properties': 'GRID widget properties',
                'label_remove_widget': 'Remove GRID widget',

                'flash_grid_group_add_fail': 'Version cannot be created. ',
                'flash_grid_group_edit_success': 'Version has been changed.',
                'flash_grid_group_edit_fail': 'Unable to change version, ',
                'flash_grid_group_remove_success': 'Version has been removed.',
                'flash_grid_group_remove_fail': 'Unable to remove version, ',
                'flash_widget_add_success': 'Version has been successfully created.',
                'flash_widget_add_fail': 'Unable to create version, ',
                'flash_widget_removed_success': 'Widget has been removed.',
                'flash_widget_removed_fail': 'Unable to remove widget, ',
                'flash_widget_edit_success': 'Widget has been edited.',
                'flash_widget_edit_fail': 'Unable to edit widget, ',

                'label_no_item': 'No <strong class="font-color-grid">GRID</strong> widgets in this group.',
                'label_you_can_create': 'Click on the button bellow to create a widget.',

            }, 'ProjectsProjectWidgetsWidgetsWidgetComponent': {

                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - WIDGET <strong>{0}</strong>',
                'main_title': 'Platform administration',
                'main_subtitle': 'Widget Editor',

                'flash_version_save_success': 'Version <b>{0}</b> saved successfully.',
                'flash_version_save_fail': 'Unable to save version <b>{0}</b>, {1}.',
                'flash_version_removed_success': 'Version has been removed.',
                'flash_version_removed_fail': 'Unable to remove version, ',
                'flash_version_changed_success': 'Version {0} has been changed.',
                'flash_version_changed_fail': 'Unable to change version <b>{0}</b>, {1}.',
                'flash_version_load_fail': 'Unable to load version <b>{0}</b>, {1}.',
                'flash_widget_removed_success': 'Widget has been removed.',
                'flash_widget_removed_fail': 'Unable to remove widget, ',
                'flash_widget_edit_success': 'Widget has been edited.',
                'flash_widget_edit_fail': 'Unable to edit widget, ',

                'label_console_cant_crate_widget': '<strong>Cannot create widget:</strong> Make sure, that you specified size profiles for widget',
                'label_widget_properties': 'GRID widget properties',
                'label_remove_widget': 'GRID widget properties',
                'label_widget_code': 'Widget Code',
                'label_name': 'Name',
                'label_description': 'Description',
                'label_grid_group_name': '<strong class="font-color-grid">GRID</strong> Widget Group',
                'label_version': 'Version',
                'label_ide': 'IDE',
                'label_build_errors': 'Build Errors',
                'label_save': 'SAVED VERSIONS',
                'label_version_properties': 'Version properties',
                'label_remove_version': 'Remove version',
                'label_console_output': 'Output <strong> {0} </strong> = {1}',
                'label_console_true': '<span class="bold font-red">true</span>',
                'label_console_false': '<span class="bold font-blue"> false </span>',
                'label_grid': 'GRID',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_author': 'Author',
                'table_actions': 'Actions',

            }, 'ProjectsProjectActualizationProcedureComponent': {
                'title': 'Actualization Procedure',
                'table_finished': 'Finished',
                'table_created': 'Created',
                'table_id': 'Task ID',
                'table_planed': 'Planed',
                'table_hardware': '<strong class="font-color-hardware">Hardware</strong>',
                'table_program': 'Program',
                'table_version': 'Version',
                'table_status': 'Status',
                'table_update_type': 'Update Type',
                'table_firmware_type': 'Type',
                'table_update_progress': 'Progress',
                'table_update_state': 'State',
                'table_hardware_id': 'Hardware ID',
                'label_code': 'CODE',
                'table_actions': 'Actions',
                'table_project': 'Project',
                'table_started': 'Created',
                'table_type': 'Update type',
                'label_finished': 'Finished',
                'label_time_missing_in_json': 'Not Yet',
                'label_created': 'Created',
                'label_planed': 'Planed',
                'label_type_of_update': 'Planed',
                'label_firmware': 'FIRMWARE',
                'label_bootloader': 'BOOTLOADER',
                'label_backup': 'BACKUP',

            }, 'ProjectsProjectBlockoComponent': {
                'title': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> - ALL PROGRAMS',

                'label_blocko_remove': 'Remove BLOCKO program',
                'label_blocko_program_properties': 'BLOCKO program properties',
                'label_no_blocko_program': 'No <strong class="font-color-blocko">BLOCKO</strong> programs available.',
                'label_create_blocko_text': 'Click on the button bellow to create your first a program or use public one.',
                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'btn_add_blocko_program': 'New Program',

                'flash_blocko_remove': 'Program has been removed.',
                'flash_blocko_cant_remove': 'Unable to remove program, ',
                'flash_blocko_add_to_project': 'BLOCKO program {0} has been added to your project.',
                'flash_blocko_cant_add_to_project': 'Unable to add BLOCKO program {0} to your project, {1}.',
                'flash_blocko_update': 'Program has been updated.',
                'flash_blocko_cant_update': 'Unable to update program, ',

            }, 'ProjectsProjectBlocksBlocksBlockComponent': {
                'title': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> - BLOCK <strong>{0}</strong>',
                'label_name': '<strong class="font-color-blocko">BLOCKO</strong> Block Name:',
                'label_description': '<strong class="font-color-blocko">BLOCKO</strong> Block Description:',
                'label_group': '<strong class="font-color-blocko">BLOCKO</strong> Block Group Name',
                'label_console_output': 'Output <strong>{0}</strong> = {1}',

                'label_group_properties': 'BLOCKO block properties',
                'label_group_remove': 'Remove BLOCKO block',
                'label_code': 'IDE',
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
                'label_block_code_change': 'Block code has been changed, you must test the program first, then save it.',

                'table_version_name': 'Name',
                'table_description': 'Description',
                'table_author': 'Author',
                'table_actions': 'Actions',
                'label_version_properties': 'Version properties',
                'label_remove_version': 'Remove version',

                'ts_error_typescript_error': 'TypeScript Error',
                'ts_error_block_error': 'Block Error',
                'ts_error_block_error_code_empty': 'Block code cannot be empty',

                'bool_true': 'true',
                'bool_false': 'false',

                'flash_cant_save_version': 'Unable to save version <b>{0}</b>, {1}.',
                'flash_version_save': 'Version <b> {0} </b> saved successfully.',
                'flash_block_code_empty': 'Block code cannot be empty! Block error, {0}.',
                'flash_cant_load_block': 'Unable to load block, ',
                'flash_blocko_edit': 'Block has been edited.',
                'flash_cant_edit_block': 'Unable to edit block, ',
                'flash_block_remove': 'Block has been removed.',
                'flash_cant_remove_block': 'Unable to remove block, ',
                'flash_version_remove': 'Version has been removed.',
                'flash_cant_remove_version': 'Unable to remove version, ',
                'flash_version_change': 'Version {0} has been changed.',
                'flash_cant_change_version': 'Unable to change version {0}, {1}',
                'flash_cant_load_block_version': 'Unable to load block version, ',

            }, 'ProjectsProjectBlocksBlocksComponent': {
                'title': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> - BLOCK GROUP <strong>{0}</strong>',
                'label_group_properties': 'Group properties',
                'label_group_remove': 'Remove group',
                'label_block_properties': 'BLOCKO block properties',
                'label_block_remove': 'Remove BLOCKO block',

                'label_blocko_name': '<strong class="font-color-blocko">BLOCKO</strong> Block Group Name: <strong>{0}</strong>',
                'label_blocko_description': '<strong class="font-color-blocko">BLOCKO</strong> Block Group Description: <strong>{0}</strong>',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'label_no_block_program': 'No <strong class="font-color-blocko">BLOCKO</strong> Block in this group',
                'label_create_block_text': 'Click on the button bellow to create a Blocko Block.',

                'btn_add_block': 'New Block',

                'flash_block_groups_edit': 'Block group has been edited.',
                'flash_cant_edit_block_groups': 'Unable to edit block group, ',
                'flash_block_groups_remove': 'Block group has been removed.',
                'flash_cant_remove_block_groups': 'Unable to remove block group, ',
                'flash_block_add': 'Block has been created.',
                'flash_cant_add_block': 'Unable to create block, ',
                'flash_block_edit': 'Block has been edited.',
                'flash_cant_edit_block': 'Unable to edit block, ',
                'flash_block_remove': 'Block has been removed.',
                'flash_cant_remove_block': 'Unable to remove block, ',

            }, 'ProjectsProjectBlocksComponent': {
                'title': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> - ALL BLOCK GROUPS',
                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'label_group_properties': 'Group properties',
                'label_group_remove': 'Remove group',
                'tab_private_groups': 'Private group',
                'tab_public_groups': 'Public group',
                'tab_programs_for_decisions': 'Publishing requirements',
                'label_no_groups': 'No public <strong class="font-color-blocko">BLOCKO</strong> Blocks groups',
                'label_no_groups_comment': 'If you do not see your dream program, create it and share it with others.',

                'btn_add_blocks_group': 'New Group',
                'flash_block_group_add': 'Block group has been created.',
                'flash_cant_add_block_group': 'Unable to create block group,',
                'flash_block_group_edit': 'Block group has been edited.',
                'flash_cant_edit_block_group': 'Unable to edit block group,',
                'flash_block_group_remove': 'Block group has been removed.',
                'flash_cant_remove_block_group': 'Unable to remove block group,',
                'label_no_blocko_group': 'No <strong class="font-color-blocko">BLOCKO</strong> Blocks group available',
                'label_create_blocko_group_text': 'Click on the button bellow to create your first group of Blocko Blocks.',

            }, 'ProjectsProjectCodeCodeComponent': {

                'title': 'Byzance<strong class="font-color-code">CODE</strong> - PROGRAM <strong>{0}</strong>',
                'main_title': 'Platform administration',
                'main_subtitle': 'Code Editor',

                'label_library_version': 'Library Version',
                'label_program_properties': 'CODE program properties',
                'label_remove_program': 'Remove CODE program',
                'label_version_properties': 'Version properties',
                'label_remove_version': 'Remove CODE version',
                'label_code_name': '<strong class="font-color-code">CODE</strong> Program Name: <strong>{0}</strong>',
                'label_code_description': '<strong class="font-color-code">CODE</strong> Program Description: <strong>{0}</strong>',
                'label_hardware_type': '<strong class="font-color-hardware">Hardware</strong> Type',
                'label_ide': 'IDE',
                'label_version': 'Version',
                'label_build_error': 'Build Errors',
                'label_file_and_line': 'File: <b>{0}</b> Line: <b>{1}</b>',
                'label_blocko_interface_preview': 'Byzance<strong class="font-color-blocko">BLOCKO</strong> INTERFACE PREVIEW',
                'label_saved_versions': 'SAVED VERSIONS',
                'label_public_comment': 'This is public Program, you can only test program or make a copy.',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_lib_version': 'Library Version',
                'table_author': 'Author',
                'table_status': 'Status',
                'table_actions': 'Actions',

                'btn_build': 'Build',
                'btn_upload_to_hardware': 'Deploy to HARDWARE',

                'codefile_library_version_dont_have_readme': '{0} ({1}), # Library {2}\n\nVersion: {3}\n\nLooks like this library doesn\'t have README.md file.',
                'codefile_library_version_short_dont_have_readme': '# Library {0}\n\nVersion: {1}\n\nLooks like this library doesn\'t have README.md file.',
                'text_unsaved_change_reload': 'You have <b> unsaved changes</b> in this version <b> {0} </b>, are you sure to reload this version?',
                'text_unsaved_change_switch': 'You have <b> unsaved changes</b> in this version <b> {0} </b>, are you sure to switch to version <b> {1} </b>?',
                'text_changed_files': '<h5>Changed files:</h5>',

                'modal_label_save_same_code': 'Save identical code?',
                'modal_text_no_change': 'No changes have been made, are you sure to save this code?',
                'modal_label_error': 'Error',
                'modal_text_no_yoda': 'No available devices.',

                'label_main_c_program_version_set_as_main': 'Set this version as Main',
                'label_publish': 'Accept publication',
                'label_unpublish': 'Refused to Publish',

                'flash_update_success': 'Deployed successfully',
                'flash_cant_upload_code': 'Deployment failed.',
                'flash_code_was_publisher': 'Your Community publish request was successful!.',
                'flash_code_publish_error': 'Deployment failed.',
                'flash_code_version_build_success': 'Built successfully.',
                'flash_code_version_save': 'Version <b> {0} </b> saved successfully.',
                'flash_cant_save_code_version': 'Unable to save version <b>{0}</b>, {1}',
                'flash_code_remove': 'Program has been removed.',
                'flash_cant_remove_code': 'Unable to remove program, {0}.',
                'flash_code_update': 'Program has been updated.',
                'flash_cant_update_code': 'Unable to update program, {0}.',
                'flash_code_version_remove': 'Version has been removed.',
                'flash_cant_remove_code_version': 'Unable to remove version, {0}.',
                'flash_file_uploaded': 'File successfully uploaded',
                'flash_cant_file_upload': 'Can\'t upload file, reason {0}',
                'flash_cant_change_code_version': 'Unable to change version {0}, {1}.',
                'flash_cant_load_code_types': 'Unable to load code types, {0}.',
                'flash_cant_load_version': 'Unable to load version <b>{0}</b>, {1}.',

            }, 'ProjectsProjectCodeComponent': {
                'title': 'Byzance<strong class="font-color-code">CODE</strong> - ALL PROGRAMS',
                'btn_add_code_program': 'New Program',
                'label_code_program_properties': 'CODE program properties',
                'label_remove_code_program': 'Remove CODE program',

                'label_no_code': 'No <strong class="font-color-code">CODE</strong> program available.',
                'label_create_code_text': 'Click on the button bellow to create a program.',

                'label_no_public_code': 'No <strong class="font-color-code">CODE</strong> program available.',
                'label_create_public_code_text': 'If you do not see your dream program, create it and share it with others.',

                'table_name': 'Name',
                'table_hardware_type': '<strong class="font-color-hardware">Hardware</strong> device type',
                'table_description': 'Description',
                'table_actions': 'Actions',

                'tab_my_programs': 'My Program',
                'tab_public_c_programs': 'Public Programs',

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
                'label_no_widgets': 'No <strong class="font-color-grid" > GRID </strong> widgets in this group',
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
                'modal_label_grid_size_change': 'Change <strong class="font-color-grid">GRID</strong> size class',
                'modal_text_grid_size_change': 'Changing <strong class="font-color-grid">GRID</strong> size class <strong>will delete all your pages</strong>, are you sure?',

                'flash_cant_load_widget_version': 'Unable to load widget version,',
                'flash_cant_save_version': 'Unable to save version <b>{0}</b >, {1}.',
                'flash_version_save': 'Version <b>{0}</b> saved successfully.',
                'flash_cant_remove_grid': 'Unable to remove program,',
                'flash_grid_remove': 'Program has been removed.',
                'flash_grid_edit': 'Program has been edited.',
                'flash_cant_edit_grid': 'Unable to edit program, {0}.',
                'flash_cant_load_version': 'Unable to load version <b>{0}</b>, {1}.',
                'flash_cant_load_grid': 'Unable to load GRID, {0}.',
                'flash_cant_change_version': 'Unable to change version {0}, {1}',
                'flash_version_change': 'Version {0} has been changed.',
                'flash_version_remove': 'Version has been removed.',
                'flash_cant_remove_version': 'Unable to remove version,',

            }, 'ProjectsProjectGridGridsComponent': {
                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - PROGRAM GROUP <strong>{0}</strong>',
                'label_device_properties': 'GRID group properties',
                'label_device_remove': 'Remove GRID group',
                'label_program_properties': 'GRID program properties',
                'label_program_remove': 'Remove GRID program',
                'label_no_grid': 'No <strong class="font-color-grid">GRID</strong> program available',
                'label_create_grid_text': 'Click on the button bellow to create a program.',

                'btn_add_grid_program': 'Create GRID Program',
                'label_grid_project_name': '<strong class="font-color-grid">GRID</strong> Project Name: <strong>{0}</strong>',
                'label_grid_project_description': '<strong class="font-color-grid">GRID</strong> Description: <strong>{0}</strong>',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',
                'flash_grid_project_remove': 'Project has been removed.',
                'flash_cant_remove_grid_project': 'Unable to remove project,',
                'flash_grid_project_edit': 'Project has been edited.',
                'flash_cant_edit_grid_project': 'Unable to edit project,',
                'flash_grid_program_add': 'Program has been created.',
                'flash_cant_add_grid_program': 'Unable to create program,',
                'flash_grid_program_edit': 'Program has been edited.',
                'flash_cant_edit_grid_program': 'Unable to edit program,',
                'flash_grid_program_remove': 'Program has been removed.',
                'flash_cant_remove_grid_program': 'Unable to remove program,',

            }, 'ProjectsProjectGridComponent': {

                'title': 'Byzance<strong class="font-color-grid">GRID</strong> - ALL PROGRAM GROUPS',
                'btn_add_grid_project': 'Create GRID program group',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_actions': 'Actions',

                'label_group_properties': 'Group properties',
                'label_group_remove': 'Remove group',
                'label_no_grid': 'No <strong class="font-color-grid">GRID</strong> projects available.',
                'label_create_grid_text': 'Click on the button bellow to create a project.',

                'flash_grid_project_add': 'Project has been created.',
                'flash_cant_add_grid_project': 'Unable to create project.',
                'flash_grid_project_edit': 'Project has been edited.',
                'flash_cant_edit_grid_project': 'Unable to edit project, .',
                'flash_grid_project_remove': 'Project has been removed.',
                'flash_cant_remove_grid_project': 'Unable to remove project.',

            }, 'SupportComponent': {

                'main_title': 'Support',
                'tab_knowledge_base': 'Knowledge Base',
                'tab_tickets': 'My Tickets',
                'label_faq': 'FAQ',
                'label_documentation': 'Documentation',
                'label_open_ticket': 'Open Ticket',

            }, 'ValidatorErrorsService': {
                'label_field_required': 'This field is required.',
                'label_minimal_length': 'Minimal length of this field is {0} characters.',
                'label_maximal_length': 'Maximal length of this field is {0} characters.',
                'label_name_taken': 'This name is already in use.',
                'label_project_name_taken': 'This project name is already in use.',
                'label_blocko_name_taken': 'This program name is already in use.',
                'label_invalid_email': 'Invalid E-mail address.',
                'label_invalid_time': 'Invalid Time, please write time in XY:YX format',
                'label_different_password': 'Passwords do not match.',
                'label_invalid_file_name': 'Invalid file/directory name.',
                'label_field_only_number': 'This field only accepts numbers.',
                'label_field_invalid_url': 'Invalid URL.',
                'label_unknown_error': 'Unknown error.',

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

            }, 'RoleGroupGroupComponent': {
                'main_title': 'Platform administration',
                'main_subtitle': 'Role Settings',

                'title': 'Role settings',

                'tab_permissions': 'Permissions',
                'tab_persons': 'Users',

                'label_permission': 'Permission',
                'label_person': 'Person',

                'label_no_person': 'No Users',
                'label_no_person_comment': 'We didn\'t find any users, add new one (already remigrated)',
                'label_no_permission': 'No Permissions',
                'label_no_permission_comment': 'We didn\'t find any permision, add new one (already generated by system)',

                'label_name': 'Name',
                'label_email': 'Email',
                'label_description': 'Description',
                'label_actions': 'Actions',
                'label_person_remove': 'Remove Person from Role',

                'btn_add_person': 'Add Person',
                'btn_add_permission': 'Add Permission',
            },

            'LayoutMainComponent': {
                'label_number_of_unread': '{0} unread',
                'label_notifications': 'notifications',
                'label_profile': 'Account Settings',
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
                'modal_label_cant_move_directory_to_childern': 'Unable to move directory to its own <b>sub-directory</b>. ',
                'modal_label_cant_rename_directory': 'Unable to rename <b>/</b> directory.',
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

            }, 'TableListComponent': {
                'type_of_board_name': 'Type of board',
                'table_name': 'name',
                'table_description': 'description',
                'table_product': 'product',
                'table_actions': 'actions',
            }, 'VersionListComponent': {
                'table_name': 'Name',
                'table_description': 'Description',
                'table_product': 'Product',
                'table_actions': 'Actions',
            }, 'ServerComponent': {
                'main_title': 'Platform administration',
                'main_subtitle': 'Server Management',

                'title': 'List of Servers',
                'tab_homer_server': 'Homer Servers',
                'tab_compilation_server': 'Compilation Servers',
                'label_server_name': 'Server Name',
                'label_server_type': 'Server Type',
                'label_id': 'Id',
                'label_status': 'Status',
                'label_actions': 'Actions',
                'label_no_servers': 'No servers',
                'label_no_servers_comment': 'We did not find any server that we could show you',
                'label_loading': 'Loading',
                'btn_create_server': 'Create server',

            }, 'AdminDashboardComponent': {
                'main_title': 'Platform administration',
                'main_subtitle': 'Admin Dashboard',

                'title': 'Basic Overview',
                'dashboard_info_text': 'TODO NECO DOPSAT??? [TZ]',

                'label_homer_server': 'Homer servers',
                'label_compilation_server': 'Compilation Servers',
                'label_person_registered': 'Person registered',
                'label_project_registered': 'Project registered',
                'label_bug_registered': 'Bugs auto cached',
                'label_hardware_registered': 'Hardware registered',

            }, 'AdminHardwareComponent': {
                'main_title': 'Platform administration',
                'main_subtitle': 'Hardware Management',

                'title': 'Basic Overview of components',
                'label_name': 'Name',
                'label_description': 'Description',

                'label_target_name': 'Target',
                'label_bootloader': 'Bootloader',
                'label_default_firmware': 'Default Firmware',
                'label_test_firmware': 'Test firmware',

                'tab_hardware_list': 'Hardware List (Filter)',
                'tab_hardware_type': 'Hardware Types',
                'tab_processor': 'Processors',
                'tab_producers': 'Producers',
                'label_producer': 'Producer',
                'label_processor': 'Processor',
                'label_actions': 'Actions',

                'label_table_id': 'Processor ID',
                'label_table_type': 'Type',
                'label_hash': 'Hash Token',
                'label_table_status': 'Online status',

                'label_no_type_of_boards': 'No Boards Types',
                'label_no_type_of_boards_comment': 'No accessible Boards Type, create new one. You have to create Processor and Producer',
                'label_no_boards': 'There is no Hardware',
                'label_no_boards_comment': 'Change filter parameters to find more items',
                'label_no_producer': 'No Producers',
                'label_no_producer_comment': 'You can create new Producer, it can by your client or you!',
                'label_no_processor': 'No Processors',
                'label_no_processor_comment': 'You can create new Processor',

            }, 'CommunityCProgramComponent': {
                'main_title': 'Platform administration',
                'main_subtitle': 'Community C# management (decision tool)',
                'title': 'Community Content',

                'tab_public_c_programs': 'Public Code Program',
                'tab_public_c_libraries': 'Public Code Libraries',
                'tab_c_programs_for_decisions': 'Community Code Requests',
                'tab_c_libraries_for_decisions': 'Community Libraries Requests',

                'table_name': 'Name',
                'table_description': 'Description',
                'table_hardware_type': 'HardwareType',
                'table_actions': 'Actions',

                'flash_code_add': 'Community Code Add. Don\'t forget to set first Version and publish program',

                'label_no_c_programs': 'No Programs',
                'label_no_c_programs_comment': 'Create new Program, or change Filter property',

                'label_no_c_library': 'No Libraries',
                'label_no_c_library_comment': 'Create new Library, or change Filter property',

            }, 'GarfieldGarfieldComponent': {
                'main_title': 'Platform administration',
                'main_subtitle': 'Garfield Test & Burn Utility',

                'label_general_description': 'The Garfield Test Tool is designed for testing and burning the default settings. Moreover, it is designed ' +
                'for tagging the new hardware and flow for hardware registration into the system. For the successful start of the procedure, ' +
                'it is necessary that all fields in the "prerequisite" are green.',

                'modal_title_new_device': 'New device',
                'modal_text_new_device': 'There was new device detected on TestKit. Do you wish to start the registration process?',
                'modal_text_repeat': 'Do you wish to continue the process from the failed step? Pressing \'No\' will start the process from the beginning.',

                'label_name': 'Name',
                'label_description': 'Description',
                'label_hardware_type': 'Hardware type',
                'label_producer': 'Production Batch of this Collection (required)',
                'label_main_test_version': 'Test version:',
                'label_main_version': 'Production version',
                'label_main_bootloader': 'Main bootloader',
                'label_printer_label_1': 'Printer Label 12mm',
                'label_printer_label_2': 'Printer Label 22mm',
                'label_print_sticker': 'Printer sticker 62 mm',
                'label_hardware_tester': 'Hardware tester Kit:',
                'label_prerequisites': 'Prerequisite',
                'label_prerequisites_not_complete': 'Prerequisites (incomplete)',
                'label_prerequisites_not_met': 'Prerequisite are not met',
                'label_test_firmware': 'Test Firmware',
                'label_default_firmware': 'Production Firmware',
                'label_c_programs': 'Code Programs',
                'label_printers': ' Printers',
                'label_printers_not_valid': '(Not set!)',
                'label_garfield_desktop': 'Garfield Desktop',
                'label_garfield_app': 'Garfield Desktop App',
                'label_garfield_tester': 'Garfield Tester',
                'label_server_settings': 'Server Settings',
                'label_main_server': 'Main Server',
                'label_backup_server': 'Backup Server',
                'label_server_not_set': 'Server is not Set!',

                'label_burn_settings': 'Burn settings',
                'label_burn_settings_incomplete': 'Burn settings (incomplete)',
                'label_product_revision': 'Product Revision',
                'label_assembly_product_manufacture': 'Assembly Manufacture Company Name',
                'label_assembly_product_manufacture_id': 'Assembly Manufacture Identification',
                'label_pcb_product_manufacture': 'PCB Manufacture Company Name',
                'label_pcb_product_manufacture_id': 'PCB Manufacture Identification',
                'label_product_name': 'Product Name (For customers)',
                'label_company_name': 'Company Name (For customers)',
                'label_company_made_description': 'Made Description for ex. \"Made in USA\"',
                'label_who_testing': 'Tester Operator',
                'label_garfield_station': 'Garfield Station',
                'label_printer_not_found': 'Printer not found!',
                'label_config': 'Configuration of Hardware',
                'label_test_config': 'Configuration of Test',


                'nav_step_one_title': 'Attach Hardware',
                'nav_step_one_text': 'Tested HW connected',
                'nav_step_two_title': 'File Transfer',
                'nav_step_two_text': 'BootLoader & Test Firmware',
                'nav_step_three_title': 'Making Test',
                'nav_step_three_text': 'Testing procedure on tester Hardware',
                'nav_step_four_title': 'File Transfer',
                'nav_step_four_text': 'Default firmware',
                'nav_step_five_title': 'Settings',
                'nav_step_five_text': 'Default settings',
                'nav_step_six_title': 'Connection',
                'nav_step_six_text': 'Connection to Cloud',


                'flash_code_add': 'Community Code Add. Don\'t forget to set first Version and publish program',
                'flash_cant_load_bootloader_file': 'Cannot load Bootloader File to Cache Memory',
                'flash_tester_connected': 'TestKit connected',
                'flash_tester_disconnected': 'TestKit disconnected',
                'flash_garfield_connected': 'Garfield App connected',
                'flash_garfield_disconnected': 'Garfield App disconnected',
                'flash_device_connected': 'Device connected',
                'flash_device_dead_connected': 'Device connected but dead',
                'flash_device_disconnected': 'Device disconnected',
                'flash_prerequisite_not_met': 'All prerequisites have to be met to start procedure',
                'flash_registration_fail': 'Registration of device failed',

                'label_no_c_programs': 'No Programs',
                'label_no_c_programs_comment': 'Create new Program, or change Filter property',

                'label_no_c_library': 'No Libraries',
                'label_no_c_library_comment': 'Create new Library, or change Filter property',

            }, 'BugsComponent': {
                'main_title': 'Platform administration',
                'main_subtitle': 'Caught Bugs',

                'label_general_description': 'Bugs that occurred on the backend server. You can browse bugs or report them on YouTrack',
                'label_delete_bugs_all': 'Delete all bugs',
                'label_report_bug': 'Report to YouTrack',
                'label_remove_bug': 'Remove bug',

                'table_summary': 'Summary',
                'table_date': 'Date',
                'table_repetition': 'Occurrences',
                'table_actions': 'Actions'

            }, 'BugsBugComponent': {
                'main_title': 'Platform administration',
                'main_subtitle': 'Bug',

                'label_report_bug': 'Report to YouTrack',
                'label_view_bug': 'View on YouTrack',
                'label_remove_bug': 'Remove bug',
                'label_repetition': 'Occurrences',
                'label_stack_trace': 'Stack Trace',
                'label_cause': 'Cause',
                'label_type': 'Exception type',
                'label_server': 'Server version',
                'label_cause_type': 'Cause type',
                'label_cause_message': 'Cause message',
                'label_request': 'Request'
            }, 'TyrionComponent': {
                'main_title': 'Platform administration',
                'main_subtitle': 'Tyrion management',

                'title': 'Updates',
                'label_current_version': 'Current version',
                'label_general_description': 'You can schedule an update of Tyrion server. Select a version from available updates for the current mode of the server.',
                'flash_cannot_load_updates': 'Cannot load available updates',
                'btn_schedule_update': 'Schedule',
            },


            'label_byzance_hardware': 'Byzance<strong class="font-color-hardware">HARDWARE</strong>',
            'label_byzance_blocko': 'Byzance<strong class="font-color-blocko">BLOCKO</strong>',
            'label_byzance_cloud': 'Byzance<strong class="font-color-cloud">CLOUD</strong>',
            'label_byzance_code': 'Byzance<strong class="font-color-code">CODE</strong>',
            'label_project_owner': 'Project owner',
            'label_project_admin': 'Project admin',
            'label_project_member': 'Project member',
            'label_email': 'E-mail',
            'label_password': 'Password',
            'label_console': 'Console',
            'label_configuration': 'Configuration',
            'label_offline': 'offline',
            'label_online': 'online',
            'label_date': 'Date',
            'label_time': 'Time',
            'label_version': 'Version',
            'label_message': 'Message',
            'label_description': 'Description',
            'label_user': 'User',
            'btn_save': 'Save',
            'btn_test': 'Test',
            'btn_close': 'Close',
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
            'btn_clear': 'Clear',
            'label_loading': 'Loading...',
            'loading': 'Loading...',
            'btn_done': 'Done',
            'btn_rename': 'Rename',
            'btn_yes': 'Yes',
            'btn_no': 'No',
            'btn_update': 'Update',
            'btn_ok': 'OK',
            'btn_create': 'Create',
            'btn_copy': 'Copy',
            'flash_fail': 'Something is wrong',
            'flash_successfully_edit': 'Successfully edit',
            'flash_successfully_remove': 'Successfully removed',
            'flash_cant_add': 'Cannot Add. Reason:',
            'flash_cant_remove': 'Cannot removed. Reason:',

            'hello_world': 'Hello {0}! {1}?',
        },
        'cz': {
            // TODO
        }
    };

    public static translateTables: {
        [lang: string]: {
            [tableOrEnv: string]: {
                [keyOrTable: string]: (
                    string
                    | { [key: string]: string })
            }
        }
    } = {
        'en': {
            'board_state': {
                'UNKNOWN': 'unknown',
                'NO_COLLISION': 'No collisions found.',
                'ALREADY_IN_INSTANCE': 'Warning! Device is already running in this instance.',
                'PLANNED_UPDATE': 'Update is scheduled in the future.',
            },
            'online_status': {
                'online': 'online',
                'offline': 'offline',
                'synchronization_in_progress': 'Synchronizing',
                'not_yet_first_connected': 'We have no idea - (never logged before)',
                'unknown_lost_connection_with_server': 'Lost connection with external server',
                'shut_down': 'Shut Downed',
            },
            'server_type': {
                'public_server': 'Public Byzance Server',
                'private_server': 'Private Server',
                'backup_server': 'Public Byzance Backup Server',
                'main_server': 'Public Byzance Main Server',
                'test_server': 'Test Server',
                'already_on': 'Already on',
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
                'MANUALLY_BY_USER_INDIVIDUAL': 'Individual Update',
                'MANUALLY_RELEASE_MANAGER': 'Release Manager',
                'MANUALLY_BY_USER_BLOCKO_GROUP': 'Manually through <strong class="font-color-blocko">BLOCKO</strong>',
                'MANUALLY_BY_USER_BLOCKO_GROUP_ON_TIME': 'Scheduled through <strong class="font-color-blocko">BLOCKO</strong>',
                'AUTOMATICALLY_BY_USER_ALWAYS_UP_TO_DATE': 'System up-to-date',
                'AUTOMATICALLY_BY_SERVER_ALWAYS_UP_TO_DATE': 'Critical patch',
            },
            'firmware_type': {
                'FIRMWARE': 'Firmware',
                'BOOTLOADER': 'Boot-Loader',
                'BACKUP': 'Firmware - Backup',
                'WIFI': 'Wi-Fi '
            },
            'publish_status': {
                'pending': 'Your request has been submitted, <br> please wait for the administrator\'s decision.',
                'approved': 'Your program has been approved. <br> You can find it with a slight modification in the list of public programs. <strong>Thank you!</strong>',
                'disapproved': 'We apologize, but the administrator did not approve your program. More information was sent to you by email and notification.',
                'edited': 'The program has been edited for another iteraction. ',
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
                'hardware_unstable': 'Some of your devices with this version of the program had a critical error and had to be restored from a backup. This version is not recommended to use in production until you have solved the cause of the error.',
                'undefined': 'Version status is unknown.',
                'main_version': 'Version is set as Main or Default'
            },
            'error_code': {
                '1': 'Missing Label in update procedure - probably incompatible previous firmware'

            },
            'update_state': {
                'complete': 'Completed',
                'canceled': 'Cancelled',
                'not_start_yet': 'Waiting in que',
                'in_progress': 'Update is in progress',
                'overwritten': 'Skipped',
                'not_updated': 'Updated to wrong version.',
                'waiting_for_device': 'Waiting for the device to reconnect.',
                'bin_file_not_found': 'Bin file not found.',
                'critical_error': 'Critical error',
                'homer_server_is_offline': 'Server is offline.',
                'instance_inaccessible': 'Instance is not accessible.',
                'homer_server_never_connected': 'Never connected',
                'complete_with_error': 'Complete with error',
                'successful_complete': 'Successfully completed',

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
            }, 'productStatusTranslate': {
                'false': 'All activities such as running instances in cloud or hardware data services are temporarily suspended. During the inactivity, no fees are charged. This product can not be removed by user. Only by technical support. After six months of inactivity, it will be archived.',
                'true': 'The financial product is activated. '
            }

        },
        'cz': {
            // TODO
        }
    };
}
;
