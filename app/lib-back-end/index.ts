/*
 * © 2015-2016 Becki Authors. See the AUTHORS file found in the top-level
 * directory of this distribution.
 */

import "rxjs/add/observable/fromEvent";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";

import * as _ from "underscore";
import * as Rx from "rxjs";
import * as uuid from "node-uuid";

export function composeUserString(user:User, showEmail = false):string {
    return user.nick_name || user.full_name || showEmail && user.mail || null;
}

export class RestRequest {

    method:string;

    url:string;

    headers:{[name:string]:string};

    body:Object;

    constructor(method:string, url:string, headers:{[name:string]:string} = {}, body?:Object) {
        this.method = method;
        this.url = url;
        this.headers = {};
        for (let header in headers) {
            if (headers.hasOwnProperty(header)) {
                this.headers[header] = headers[header];
            }
        }
        this.headers["Accept"] = "application/json";
        this.headers["Content-Type"] = "application/json";
        this.body = body;
    }
}

export class RestResponse {

    status:number;

    body:Object;

    constructor(status:number, body:Object) {
        this.status = status;
        this.body = body;
    }
}

interface WebSocketMessage {

    messageId:string;

    messageChannel:string;

    messageType:string;
}

interface WebSocketErrorMessage extends WebSocketMessage {

    status:string;

    error:string;
}

export class BugFoundError extends Error {

    name = "bug found error";

    adminMessage:string;

    userMessage:string;

    constructor(adminMessage:string, userMessage?:string) {
        super(BugFoundError.composeMessage(adminMessage));
        // TODO: https://github.com/Microsoft/TypeScript/issues/1168#issuecomment-107756133
        this.message = BugFoundError.composeMessage(adminMessage);
        this.adminMessage = adminMessage;
        this.userMessage = userMessage;
    }

    static fromRestResponse(response:RestResponse):BugFoundError {
        let content = response.body;
        let message:string;
        if (response.status == 400) {
            content = (<{exception:Object}>response.body).exception;
            message = (<{message:string}>response.body).message;
        }
        return new BugFoundError(`response ${response.status}: ${JSON.stringify(content)}`, message);
    }

    static fromWsResponse(response:WebSocketErrorMessage):BugFoundError {
        return new BugFoundError(`response ${JSON.stringify(response)}`, response.error);
    }

    static composeMessage(adminMessage:string):string {
        return `bug found in client or server: ${adminMessage}`;
    }
}

export class UnauthorizedError extends Error {

    name = "request unauthorized error";

    userMessage:string;

    constructor(userMessage:string, message = "authorized authentication token required") {
        super(message);
        // TODO: https://github.com/Microsoft/TypeScript/issues/1168#issuecomment-107756133
        this.message = message;
        this.userMessage = userMessage;
    }

    static fromRestResponse(response:RestResponse):UnauthorizedError {
        return new UnauthorizedError((<{message:string}>response.body).message);
    }
}

export class PermissionMissingError extends UnauthorizedError {

    static MESSAGE = "permission required";

    name = "permission missing error";

    userMessage:string;

    constructor(userMessage:string) {
        super(PermissionMissingError.MESSAGE);
        // TODO: https://github.com/Microsoft/TypeScript/issues/1168#issuecomment-107756133
        this.message = PermissionMissingError.MESSAGE;
        this.userMessage = userMessage;
    }

    static fromRestResponse(response:RestResponse):PermissionMissingError {
        return new PermissionMissingError((<{message:string}>response.body).message);
    }
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface User {

    id:string;

    mail:string;

    nick_name:string;

    full_name:string;

    last_title:string;

    edit_permission:boolean;

    delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Connection {

    connection_id:string;

    // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-217
    created:number;

    access_age:number;

    user_agent:string;

    typeOfConnection:string;

    notification_subscriber:boolean;

    providerUserId:string;

    providerKey:string;

    returnUrl:string;

    social_tokenVerified:boolean;

    read_permission:boolean;

    delete_permission:boolean;
}

export interface NotificationBody {

    type:string;

    value:string;
}

export interface Notification {
    //rest-api
    id:string;

    level:string;// ['info', 'success', 'warning', 'error', 'question'],

    confirmation_required : boolean;

    was_read:boolean;

    created:number;


    //websocket
    messageType:string;

    messageChannel:string;

    notification_level:string;

    notification_body:NotificationBody[];

    messageId:string;

    status:string;

    reason:string;
}

export interface NotificationList {
    
    content : Notification[];
    
    from :number; // value position from all subjects. Minimum is 0. ,
    
    to: number; // Minimum is "from" Maximum is "total" ,
    
    total :number;// Total subjects ,
    
    pages:number[];// Numbers of pages, which you can call ,
    
    unread_total:number // Total unread subjects
}



// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Role {

    id:string;

    name:string;

    description:string;

    person_permissions_id:string[];

    persons_id:string[];

    update_permission:boolean;

    delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Permission {

    value:string;

    description:string;

    edit_permission:boolean;

    edit_person_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface RolesAndPermissions {

    roles:Role[];

    permissions:Permission[];
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface ScreenSizeType {

    id:string;

    name:string;

    portrait_width:number;

    portrait_height:number;

    landscape_width:number;

    landscape_height:number;

    portrait_square_width:number;

    portrait_square_height:number;

    landscape_square_width:number;

    landscape_square_height:number;

    width_lock:boolean;

    height_lock:boolean;

    portrait_min_screens:number;

    portrait_max_screens:number;

    landscape_min_screens:number;

    landscape_max_screens:number;

    touch_screen:boolean;

    edit_permission:boolean;

    delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface ScreenSizeTypeCombination {

    public_types:ScreenSizeType[];

    private_types:ScreenSizeType[];
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface MProject {

    id:string;

    program_name:string;

    program_description:string;

    date_of_create:number;

    project_id:string;

    m_programs:MProgram[];

    b_program_id:string;

    auto_incrementing:boolean;

    b_progam_connected_version_id:string;

    edit_permission:boolean;

    update_permission:boolean;

    delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface MProgram {

    id:string;

    program_name:string;

    program_description:string;

    screen_size_type_id:string;

    m_code?:string;

    m_code_id:string;

    date_of_create:number;

    last_update:number;

    height_lock:boolean;

    width_lock:boolean;

    qr_token:string;

    websocket_address:string;

    m_project_id:string;

    read_qrToken_permission:boolean;

    edit_permission:boolean;

    delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Producer {

    id:string;

    name:string;

    description:string;

    type_of_boards_id:string[];

    edit_permission:boolean;

    delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Version {

    id:string;

    version_name:string;

    version_description:string;

    date_of_create:number;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Library {

    id:string;

    library_name:string;

    description:string;

    versions_id:string[];

    edit_permission:boolean;

    update_permission:boolean;

    delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface LibrariesPage {

    content:Library[];

    from:number;

    to:number;

    total:number;

    pages:number[];
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface LibraryGroup {

    id:string;

    group_name:string;

    description:string;

    versions_id:string;

    processors_id:string[];

    edit_permission:boolean;

    update_permission:boolean;

    delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface LibraryGroupsPage {

    content:LibraryGroup[];

    from:number;

    to:number;

    total:number;

    pages:number[];
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Processor {

    id:string;

    processor_name:string;

    processor_code:string;

    description:string;

    speed:number;

    singleLibraries:string[];

    libraryGroups:string[];

    edit_permission:boolean;

    delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface TypeOfBoard { //Type of board

    id:string;

    name:string;

    producer_id:string;

    producer_name:string; //Tyrion Verze 1.06.6.4

    description:string;

    processor_id:string;

    processor_name:string; //Tyrion Verze 1.06.6.4

    connectible_to_internet:boolean;

    edit_permission:boolean;

    register_new_device_permission:boolean;

    delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface DeviceProgramVersion {

    version_code:string;

    version_object:Version;

    virtual_input_output:string;

    compilable:boolean;

    compilation_restored:boolean;

    compilation_in_progress:boolean;

    successfully_compiled:boolean;

    runing_on_board:boolean;
}

export interface BProgramList {

    content:BProgramLight[];

    from:number;

    to:number;

    total:number;

    pages:number[];
}

export interface BProgramLight {

    b_program_id:string;

    b_program_name:string;

    b_program_description:string;

    b_program_version_id:string;

    b_program_version_name:string;

    b_program_version_description:string;
}

export interface BlockoBlockList {
    content:BlockoBlockLight[];

    from:number;

    to:number;

    total:number;

    pages:number[];
}

export interface BlockoBlockLight {

    blocko_block_id:string;

    blocko_block_name:string;

    blocko_block_description:string;

    blocko_block_version_id:string;

    blocko_block_version_name:string;

    blocko_block_version_description:string;

    blocko_block_type_of_block_name:string;

    blocko_block_type_of_block_id:string;

    blocko_block_type_of_block_description:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface CProgram { //C_programs

    id:string;

    program_name:string;

    program_description:string;

    dateOfCreate:number;

    edit_permission:boolean;

    delete_permission:boolean;

    project_name:string;


    update_permission:boolean;

    type_of_board_id:string;

    type_of_board_name:string;

    project_id:string;

    program_versions:CProgramVersion[];
}

export interface CProgramVersion {

    version_object:VersionObject;

    successfully_compiled:boolean;

    compilation_in_progress:boolean;

    compilable:boolean;

    main:JsonNode;

    user_files:JsonNode;

    external_libraries:JsonNode;

    virtual_input_output:string;

    compilation_restored:boolean;

    runing_on_board:string[];
}

export interface VersionObject {

    id:string;

    version_name:string;

    version_description:string;

    date_of_create:number;
}

export interface JsonNode {
    valueNode:boolean;

    containerNode:boolean;

    missingNode:boolean;

    nodeType:string[];

    pojo:boolean;

    number:boolean;

    integralNumber:boolean;

    floatingPointNumber:boolean;

    short:boolean;

    int:boolean;

    double:boolean;

    bigDecimal:boolean;

    bigInteger:boolean;

    textual:boolean;

    boolean:boolean;

    float:boolean;

    binary:boolean;

    object:boolean;

    long:boolean;

    array:boolean;

    null:boolean;
}

export interface CProgramList {

    content:CProgramLight[];

    from:number;

    to:number;

    total:number;

    pages:number[];
}

export interface CProgramLight {

    c_program_id:string;

    c_program_name:string;

    c_program_version_id:string;

    c_program_version_name:string;

    type_of_board_id:string;

    type_of_board_name:string;
}

export interface TypeOfBlockList {

    content:TypeOfBlockLight[]

    from:number;

    to:number;

    total:number;

    pages:number[];
}

export interface TypeOfBlockLight {
    type_of_block_id:string;

    type_of_block_name:string;

    type_of_block_description:string;
}

export interface BoardList {

    content:Board[];

    from:number;

    to:number;

    total:number;

    pages:number[];
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Board {

    id:string;

    type_of_board_id:string;

    isActive:boolean;

    status:Object;

    up_to_date:boolean;

    personal_description:any;

    project_id:string;

    read_permission:boolean;

    edit_permission:boolean;

    update_permission:boolean;

    first_connect_permission:boolean;

    delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface CompilationServer {


    id:string;

    server_name:string;

    destination_address:string;

    hash_certificate:string;

    server_is_online:boolean;

    edit_permission:boolean;

    delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface TypeOfBlock {

    id:string;

    name:string;

    general_description:string;

    blockoBlocks:BlockoBlock[];

    project_id:string;

    edit_permission:boolean;

    update_permission:boolean;

    delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface BlockoBlock {

    id:string;

    name:string;

    author_id:string;

    general_description:string;

    type_of_block_id:string;

    versions:string[];

    edit_permission:boolean;

    update_permission:boolean;

    delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface BProgramVersion {

    program:string;

    version_Object:Version;

    connected_boards:Object;

    master_board:Object;
}

export interface OkResult{
    state: string;
    code: number;
    message: string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface BProgramState {

    uploaded:boolean;

    online:boolean;

    version_id?:string;

    where?:string;

    cloud?:Object;

    local?:Object;

    online_boards:Board[];

    m_project_id:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface BProgram {

    id:string;

    name:string;

    program_description:string;

    program_versions:BProgramVersion[];

    program_state:BProgramState;

    dateOfCreate:number;

    lastUpdate:number;

    project_id:string;

    edit_permission:boolean;

    update_permission:boolean;

    delete_permission:boolean;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface InteractionsModerator {

    id:string;

    mac_address:string;

    type_of_device:string;

    online:boolean;

    version:string;

    project_id:string;

    edit_permission:boolean;

    update_permission:boolean;

    delete_permission:boolean;
}

export interface BProgramValues {

    digital:{[hwId:string]:boolean};

    analog:{[hwId:string]:number};

    connector:{[id:string]:{inputs:{[name:string]:number}, outputs:{[name:string]:number}}};
}

export interface BprogramValue<T> {

    hwId:string;

    value:T;
}

export interface BProgramConnectorValue {

    blockId:string;

    connectorName:string;

    value:number;
}

export interface ApplicableProduct { //napíše typ produktu/tarifu jenž vlastní uživatel, může jich být více než jeden
    product_id:number;

    product_individual_name:string;

    product_type:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface CloudHomerServer { //Cloud_Homer_Server??
    id:string;

    server_name:string;

    hash_certificate:string;

    destination_address:string;

    server_is_online:string;

    edit_permission:boolean;

    delete_permission:boolean;
}

export interface TariffLabel {//Tyrion Verze 1.06.6.4
    label:string;
    descrioption:string;
}


export interface TariffPrice {//Tyrion Verze 1.06.6.4
    CZK:string;
    EUR:string;
}

export interface UserTariff {//Tyrion Verze 1.06.6.4
    id:string;
    product_individual_name:string;
    paid_until_the_day:string;
    remaining_credit:string;
    currency:string;
    invoices:Object[]; //?? objekt popisující fakturu - Ta může nabívat několik stavů. To je vesměs zatím jedno jakých.
    payment_details:PaymentDetails;
    product_type:string;
    payment_mode:string;
    payment_method:string;
}

export interface PaymentDetails { //Tyrion Verze 1.06.6.4
    id:string;
    company_account:boolean;
    street:string;
    street_number:string;
    city:string;
    zip_code:string;
    country:string;
    edit_permission:boolean;
}

export interface Tariff {//Tyrion Verze 1.06.6.4

    tariff_name:string;

    identificator:string;

    company_details_required:boolean;   //(pokud true tak je nutné v obejtku Payment_Details uvést values s prefixem comapny_ (jako je danové číslo atd...))

    required_payment_mode:boolean;   //(Slouží do budoucna - asi třeba ke zobrazení obrázku kreditní karty?)

    price:TariffPrice;

    labels:TariffLabel[];

}

export interface ProjectParticipant { //Tyrion Verze 1.06.6.4

    full_name:string;

    user_mail:string;

    user_id:string;

    state:string;
}

// see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
export interface Project { //Tyrion Verze 1.06.6.4 předěláno

    id:string;

    project_name:string;

    project_description:string;

    edit_permission:boolean;

    delete_permission:boolean;

    homers_id:string[];

    boards_id:string[];

    b_programs:{name:string,id:string}[];

    c_programs:{name:string,id:string}[];

    m_projects_id:string[];

    type_of_blocks_id:string[],

    screen_size_types_id:string[];

    actual_procedures_id:string[];

    product_individual_name:string;

    product_id:number;

    tier_name:string;

    bugs:number;

    participants:ProjectParticipant[];

    update_permission:boolean ;

    unshare_permission:boolean;

    share_permission:boolean;

    errors:number;
}

//ACTUALIZATION PROCEDURE START
export interface ActualizationProcedure {
    id?:string;

    state:string;

    state_fraction:string;//Tyrion Verze 1.06.6.4

    state_percentage:number;//Tyrion Verze 1.06.6.4

    updates:CProgramUpdatePlan[];

    date_of_create:string;

    date_of_finish:string;

    b_program_actualization:ProgramActualization;
}

export interface CProgramUpdatePlan { //C_Program_Update_Plan
    id:string;

    state:string;

    board_id:string;

    Server_detail:string;//Tyrion Verze 1.06.6.4

    Board_detail:string;//Tyrion Verze 1.06.6.4

    c_program_detail?:CProgramUpdateProgram;

    binary_file_detail?:FileRecord;
}

export interface ProgramActualization {
    b_program_id:string;

    b_program_version_id:string;

    b_program_name:string;

    b_program_version_name:string;
}

export interface CProgramUpdateProgram {
    c_program_id:string;

    c_program_version_id:string;

    c_program_program_name:string;

    c_program_version_name:string;
}

export interface FileRecord {
    id?:string;

    file_name?:string;
}

//ACTUALIZATION PROCEDURE END


export interface PersonInfo {
    id:string,
    mail:string,
    nick_name:string,
    full_name:string,
    last_title:string,
    edit_permission:boolean,
    delete_permission:boolean
}

export interface PersonRole {
    id:string,
    name:string,
    description:string,
    delete_permission:boolean,
    update_permission:boolean,
    persons_id:string [],
    person_permissions_id:string []
}

export interface PersonBundle {
    person:PersonInfo;
    roles:PersonRole;
    permissions:string[];
}

export interface WebSocketAuth {
    websocket_token:string;
}

export abstract class BackEnd {

    public static REST_SCHEME = "http";

    public static WS_SCHEME = "ws";

    public static HOST = "127.0.0.1:9000";

    public static ACTUALIZATION_PROCEDURE_PATH = "/project/actualization_procedure";

    public static SCREEN_SIZE_TYPE_PATH = "/grid/screen_type";

    public static M_PROJECT_PATH = "/grid/m_project";

    public static M_PROGRAM_PATH/*APPLICATION_PATH*/ = "/grid/m_program";

    public static EXTERNAL_SERVER_PATH/*COMPILATION_SERVER_PATH*/ = "/compilation/server";

    public static BOARD_PATH/*DEVICE_PATH*/ = "/compilation/board";

    public static C_PROGRAM_COMPILATION_PATH/*DEVICE_PROGRAM_PATH*/ = "/compilation/c_program/c_program";

    public static C_PROGRAM_VERSION_PATH/*DEVICE_PROGRAM_VERSION_PATH*/ = `/compilation/c_program/version`;

    public static C_PROGRAM_LIST/*DEVICE_PROGRAM_LIST*/ = `/compilation/c_program/list`; //Tyrion Verze 1.06.6.4

    public static TYPE_OF_BOARD_PATH/*DEVICE_TYPE_PATH*/ = "/compilation/typeOfBoard";

    public static TYPE_OF_BLOCK_PATH/*INTERACTIONS_BLOCK_GROUP_PATH*/ = "/project/typeOfBlock";

    public static BLOCKOBLOCK_PATH/*INTERACTIONS_BLOCK_PATH*/ = "/project/blockoBlock";

    public static HOMER_PATH/*INTERACTIONS_MODERATOR_PATH*/ = "/project/homer";

    public static B_PROGRAM_PATH/*INTERACTIONS_SCHEME_PATH*/ = "/project/b_program";

    public static CLOUD_HOMER_SERVER_PATH/*INTERACTIONS_SERVER_PATH*/ = "/project/blocko/server";

    public static LIBRARY_GROUP_PATH/**/ = "/compilation/libraryGroup";

    public static LIBRARY_PATH = "/compilation/library";

    public static NOTIFICATION_PATH = "/notification";

    public static PERMISSION_PATH = "/secure/permission";

    public static PROCESSOR_PATH = "/compilation/processor";

    public static PRODUCER_PATH = "/compilation/producer";

    public static PROJECT_PATH = "/project/project";

    public static ROLE_PATH = "/secure/role";

    public static TOKEN_PATH = "/coreClient/person/permission";

    public static PASSWORD_RECOVERY_PATH = "/coreClient/mail_person_password_recovery";

    public static PASSWORD_RECOVERY_CHANGE_PATH = "/coreClient/person_password_recovery";

    public static USER_PATH = "/coreClient/person/person";

    public static VALIDATION_PATH = "/coreClient/person/valid";

    public static WS_CHANNEL = "becki";

    public static LOGIN_PERSON_PATH = "/login/person";

    public static PERSON_PATH = "/coreClient/person/person";

    public static TARIF_PATH = "/product/tarifs";

    public static UNCONFIRMED_NOTIFICATION_PATH = "/notification/unconfirmed";

    private webSocket:WebSocket;

    private webSocketMessageQueue:WebSocketMessage[];

    private webSocketReconnectTimeout:number;

    public notificationReceived:Rx.Subject<Notification>;

    public webSocketErrorOccurred:Rx.Subject<any>;

    public interactionsOpened:Rx.Subject<void>;

    public interactionsSchemeSubscribed:Rx.Subject<void>;

    public BProgramValuesReceived:Rx.Subject<BProgramValues>;

    public BProgramAnalogValueReceived:Rx.Subject<BprogramValue<number>>;

    public BProgramDigitalValueReceived:Rx.Subject<BprogramValue<boolean>>;

    public BProgramInputConnectorValueReceived:Rx.Subject<BProgramConnectorValue>;

    public BProgramOutputConnectorValueReceived:Rx.Subject<BProgramConnectorValue>;

    public tasks:number;


    protected personInfoSnapshotDirty:boolean = true;
    public personInfoSnapshot:PersonInfo = null;
    public personInfo:Rx.Subject<PersonInfo> = null;

    public constructor() {
        this.webSocket = null;
        this.webSocketMessageQueue = [];
        this.webSocketReconnectTimeout = null;
        this.notificationReceived = new Rx.Subject<Notification>();
        this.webSocketErrorOccurred = new Rx.Subject<any>();
        this.interactionsOpened = new Rx.Subject<void>();
        this.interactionsSchemeSubscribed = new Rx.Subject<void>();
        this.BProgramValuesReceived = new Rx.Subject<BProgramValues>();
        this.BProgramAnalogValueReceived = new Rx.Subject<BprogramValue<number>>();
        this.BProgramDigitalValueReceived = new Rx.Subject<BprogramValue<boolean>>();
        this.BProgramInputConnectorValueReceived = new Rx.Subject<BProgramConnectorValue>();
        this.BProgramOutputConnectorValueReceived = new Rx.Subject<BProgramConnectorValue>();
        this.personInfo = new Rx.Subject<PersonInfo>();
        this.tasks = 0;
    }

    protected refreshPersonInfo():void {
        this.personInfoSnapshotDirty = true;
        if (this.tokenExist()) {
            this.getPersonInfo()
                .then((pi) => {
                    this.personInfoSnapshotDirty = false;
                    this.personInfoSnapshot = pi.person;
                    this.personInfo.next(this.personInfoSnapshot);
                    this.connectWebSocket();
                })
                .catch((error) => {
                    console.log(error);
                    this.unsetToken(); // TODO: maybe check error type before force logout user
                    this.personInfoSnapshotDirty = false;
                    this.personInfoSnapshot = null;
                    this.personInfo.next(this.personInfoSnapshot);
                    this.disconnectWebSocket();
                });
        } else {
            this.personInfoSnapshotDirty = false;
            this.personInfoSnapshot = null;
            this.personInfo.next(this.personInfoSnapshot);
            this.disconnectWebSocket();
        }
    }

    private getToken():string {
        return window.localStorage.getItem("authToken");
    }

    private setToken(token:string):void {
        window.localStorage.setItem("authToken", token);
        this.refreshPersonInfo();
    }

    public tokenExist():boolean {
        return window.localStorage.getItem("authToken") ? true : false;
    }

    private unsetToken():void {
        window.localStorage.removeItem("authToken");
        this.refreshPersonInfo();
    }

    private getWebSocketToken():Promise<WebSocketAuth> {
        return this.requestRestPath("GET", "/websocket/access_token", "{}", 200);
    }

    private findEnqueuedWebSocketMessage(original:WebSocketMessage, ...keys:string[]):WebSocketMessage {
        return this.webSocketMessageQueue.find(message => _.isMatch(message, _.pick(original, keys)));
    }

    protected abstract requestRestGeneral(request:RestRequest):Rx.Observable<RestResponse>;

    public requestRestPath<T>(method:string, path:string, body?:Object, success = 200):Promise<T> {
        return this.requestRest(method, `${BackEnd.REST_SCHEME}://${BackEnd.HOST}${path}`, body, success).toPromise();
    }

    public requestRest<T>(method:string, url:string, body?:Object, success = 200):Rx.Observable<T> {
        let request = new RestRequest(method, url, {}, body);
        // TODO: https://github.com/angular/angular/issues/7438
        if (this.tokenExist()) {
            request.headers["X-AUTH-TOKEN"] = this.getToken();
        }
        this.tasks += 1;
        return this.requestRestGeneral(request)
            .map(response => {
                if (response.status == success) {
                    return response.body;
                }
                switch (response.status) {
                    case 401:
                        throw UnauthorizedError.fromRestResponse(response);
                    case 403:
                        throw PermissionMissingError.fromRestResponse(response);
                    default:
                        throw BugFoundError.fromRestResponse(response);
                }
            })
            .finally<T>(() => {
                this.tasks -= 1;
            });
    }

    private sendWebSocketMessageQueue():void {
        if (this.webSocket) {
            this.webSocketMessageQueue.slice().forEach(message => {
                try {
                    this.webSocket.send(JSON.stringify(message));
                    var i = this.webSocketMessageQueue.indexOf(message);
                    if (i > -1) {
                        this.webSocketMessageQueue.splice(i);
                    }
                } catch (err) {
                    console.log("ERR"+err);
                }
            });
        }
    }

    public sendWebSocketMessage(message:WebSocketMessage):void {
        this.webSocketMessageQueue.push(message);
        this.sendWebSocketMessageQueue();
    }

    // define function as property is needed to can set it as event listener (class methods is called with wrong this)
    protected reconnectWebSocketAfterTimeout = () => {
        console.log("reconnectWebSocketAfterTimeout()");
        clearTimeout(this.webSocketReconnectTimeout);
        this.webSocketReconnectTimeout = setTimeout(() => {
            this.connectWebSocket()
        }, 5000);
    };

    protected disconnectWebSocket():void {
        console.log("disconnectWebSocket()");
        if (this.webSocket) {
            this.webSocket.removeEventListener("close", this.reconnectWebSocketAfterTimeout);
            this.webSocket.close();
        }
        this.webSocket = null;
    }

    protected connectWebSocket():void {
        if (!this.tokenExist()) {
            console.log("connectWebSocket() :: cannot connect now, user token doesn't exists.");
            return;
        }
        this.disconnectWebSocket();

        this.getWebSocketToken()
            .then((webSocketToken) => {

                console.log("connectWebSocket() :: webSocketToken = "+webSocketToken.websocket_token);

                this.webSocket = new WebSocket(`${BackEnd.WS_SCHEME}://${BackEnd.HOST}/websocket/becki/${webSocketToken.websocket_token}`);
                this.webSocket.addEventListener("close", this.reconnectWebSocketAfterTimeout);

                let opened = Rx.Observable
                    .fromEvent<void>(this.webSocket, "open");
                let channelReceived = Rx.Observable
                    .fromEvent<MessageEvent>(this.webSocket, "message")
                    .map(event => { //TODO: think why is this triggered 8 times (for 8 subscribes)
                        try {
                            return JSON.parse(event.data);
                        } catch (e) {
                            console.log("parse: "+e);
                        }
                        return null;
                    })
                    .filter(message => (message && message.messageChannel == BackEnd.WS_CHANNEL));
                let errorOccurred = Rx.Observable
                    .fromEvent(this.webSocket, "error");

                opened.
                subscribe(() => {
                    this.requestNotificationsSubscribe();
                });
                opened
                    .subscribe(() => this.sendWebSocketMessageQueue());
                opened
                    .subscribe(this.interactionsOpened);

                channelReceived
                    .filter(message => message.status == "error")
                    .map(message => BugFoundError.fromWsResponse(message))
                    .subscribe(this.webSocketErrorOccurred);
                channelReceived
                    .filter(message => message.messageType == "subscribe_instace" && message.status == "success")
                    .subscribe(this.interactionsSchemeSubscribed);
                channelReceived
                    .filter(message => message.messageType == "subscribe_notification" || message.messageType == "unsubscribe_notification" || message.messageType == "notification")
                    .subscribe(this.notificationReceived);
                channelReceived
                    .filter(message => message.messageType == "getValues" && message.status == "success")
                    .subscribe(this.BProgramValuesReceived);
                channelReceived
                    .filter(message => message.messageType == "newAnalogValue")
                    .subscribe(this.BProgramAnalogValueReceived);
                channelReceived
                    .filter(message => message.messageType == "newDigitalValue")
                    .subscribe(this.BProgramDigitalValueReceived);
                channelReceived
                    .filter(message => message.messageType == "newInputConnectorValue")
                    .subscribe(this.BProgramInputConnectorValueReceived);
                channelReceived
                    .filter(message => message.messageType == "newOutputConnectorValue")
                    .subscribe(this.BProgramOutputConnectorValueReceived);
                errorOccurred
                    .subscribe(this.webSocketErrorOccurred);

            })
            .catch((error) => {
                this.webSocketErrorOccurred.next(error);
            });
    }

    public createUser(mail:string, password:string, nick_name:string):Promise<any> {
        if (!mail || password.length < 8 || nick_name.length < 8) {
            throw "password >= 8 and username >= 8 and email required";
        }

        return this.requestRestPath("POST", BackEnd.USER_PATH, {nick_name, mail, password}, 201);
    }

    public getUser(id:string):Promise<User> {
        return this.requestRestPath("GET", `${BackEnd.USER_PATH}/${id}`);
    }

    public getUserEmailUsed(email:string):Promise<boolean> {
        return this.requestRestPath<{valid:boolean}>("GET", `${BackEnd.VALIDATION_PATH}/mail/${email}`).then(body => body.valid);
    }

    public getUsernameUsed(username:string):Promise<boolean> {
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-187
        return this.requestRestPath<{code:number}>("GET", `${BackEnd.VALIDATION_PATH}/nicknamewe/${username}`).then(body => body.code == 200);
    }

    public getUserRolesAndPermissions(id:string):Promise<RolesAndPermissions> {
        return this.requestRestPath("GET", `/secure/person/system_acces/${id}`);
    }

    public getSignedUser():Promise<User> {
        return this.requestRestPath<{person:User}>("GET", "/login/person").then(result => result.person);
    }

    public getUsers():Promise<User[]> {
        return this.requestRestPath("GET", `${BackEnd.USER_PATH}/all`);
    }

    public updateUser(id:string, full_name:string, nick_name:string, first_title:string, last_title:string):Promise<any> {
        if (!full_name || !nick_name) {
            throw "name and username required";
        }

        return this.requestRestPath("PUT", `${BackEnd.USER_PATH}/${id}`, {
            nick_name,
            full_name,
            first_title,
            last_title
        });
    }

    public addRoleToUser(role:string, user:string):Promise<any> {
        return this.requestRestPath("PUT", `${BackEnd.ROLE_PATH}/person/${user}/${role}`, {});
    }

    public removeRoleFromUser(role:string, user:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.ROLE_PATH}/person/${user}/${role}`);
    }

    public addPermissionToUser(permission:string, user:string):Promise<any> {
        return this.requestRestPath("PUT", `${BackEnd.PERMISSION_PATH}/person/${user}/${permission}`, {});
    }

    public removePermissionFromUser(permission:string, user:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.PERMISSION_PATH}/person/${user}/${permission}`);
    }

    public deleteUser(user:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.USER_PATH}/${user}`);
    }

    public createToken(mail:string, password:string):Promise<any> {
        if (!mail || !password) {
            throw "email and password required";
        }

        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
        return this.requestRestPath<{authToken:string}>("POST", `${BackEnd.TOKEN_PATH}/login`, {
            mail,
            password
        }).then((body) => {
            // TODO: https://github.com/angular/angular/issues/7438
            this.setToken(body.authToken);
            return body;
        }).then(body => {
            return JSON.stringify(body);
        })
    }

    public createFacebookToken(redirectUrl:string):Promise<string> {
        redirectUrl = encodeURIComponent(redirectUrl);
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
        return this.requestRestPath<{authToken:string, redirect_url:string}>("GET", `/login/facebook?return_link=${redirectUrl}`).then(body => {
            // TODO: https://github.com/angular/angular/issues/7438
            this.setToken(body.authToken);
            return body.redirect_url;
        });
    }

    public createGitHubToken(redirectUrl:string):Promise<string> {
        redirectUrl = encodeURIComponent(redirectUrl);
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-105#comment=109-253
        return this.requestRestPath<{authToken:string, redirect_url:string}>("GET", `/login/github?return_link=${redirectUrl}`).then(body => {
            // TODO: https://github.com/angular/angular/issues/7438
            this.setToken(body.authToken);
            return body.redirect_url;
        });
    }

    public deleteToken():Promise<any> {
        return this.requestRestPath("POST", `${BackEnd.TOKEN_PATH}/logout`, {}).then((body) => {
            // TODO: https://github.com/angular/angular/issues/7438
            this.unsetToken();
            return body;
        });
    }

    public getConnections():Promise<Connection[]> {
        return this.requestRestPath("GET", "/coreClient/connections");
    }

    public removeConnection(id:string):Promise<any> {
        return this.requestRestPath("DELETE", `/coreClient/connection/${id}`);
    }


     public getNotificationsByPage(page:number):Promise<NotificationList> {
     return this.requestRestPath("GET", `${BackEnd.NOTIFICATION_PATH}/list/${page}`);
     }

    public sendPasswordRecovery(mail:string):Promise<string> {
        //TODO https://youtrack.byzance.cz/youtrack/issue/TYRION-325
        return this.requestRestPath("POST", `${BackEnd.PASSWORD_RECOVERY_PATH}`, {mail}, 200).then(JSON.stringify);
    }

    public PasswordRecovery(mail:string, password_recovery_token:string, password:string):Promise<string> {
        //TODO http://youtrack.byzance.cz/youtrack/issue/TYRION-326
        return this.requestRestPath("PUT", `${BackEnd.PASSWORD_RECOVERY_CHANGE_PATH}`, {
            mail,
            password,
            password_recovery_token
        }, 200).then(json => console.log(json)).then(JSON.stringify);
    }

    public requestNotificationsSubscribe():void {
        let message = {
            messageId: uuid.v4(),
            messageChannel: BackEnd.WS_CHANNEL,
            messageType: "subscribe_notification"
        };
        if (!this.findEnqueuedWebSocketMessage(message, 'messageChannel', 'messageType')) {
            this.sendWebSocketMessage(message);
        }
    }

    public requestNotificationsUnsubscribe():void {
        let message = {
            messageId: uuid.v4(),
            messageChannel: BackEnd.WS_CHANNEL,
            messageType: "unsubscribe_notification"
        };
        if (!this.findEnqueuedWebSocketMessage(message, 'messageChannel', 'messageType')) {
            this.sendWebSocketMessage(message);
        }
    }

    public getRoles():Promise<Role[]> {
        return this.requestRestPath("GET", `${BackEnd.ROLE_PATH}/all`);
    }

    public getPermissions():Promise<Permission[]> {
        return this.requestRestPath("GET", BackEnd.PERMISSION_PATH);
    }

    public createScreenType(name:string, width:number, height:number, columns:number, rows:number, project_id:string):Promise<any> {
        if (name.length < 3 || !Number.isInteger(width) || !Number.isInteger(height) || !Number.isInteger(columns) || !Number.isInteger(rows)) {
            throw "name >= 3, integer width, integer height, integer columns and integer rows required";
        }

        return this.requestRestPath("POST", BackEnd.SCREEN_SIZE_TYPE_PATH, {
            name,
            height_lock: false,
            width_lock: false,
            touch_screen: false,
            project_id,
            landscape_height: width,
            landscape_width: height,
            landscape_square_height: columns,
            landscape_square_width: rows,
            landscape_max_screens: 10,
            landscape_min_screens: 1,
            portrait_height: height,
            portrait_width: width,
            portrait_square_height: rows,
            portrait_square_width: columns,
            portrait_max_screens: 10,
            portrait_min_screens: 1
        }, 201);
    }

    public getScreenType(id:string):Promise<ScreenSizeType> {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", `${BackEnd.SCREEN_SIZE_TYPE_PATH}/${id}`);
    }

    public getScreenTypes():Promise<ScreenSizeTypeCombination> {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", `${BackEnd.SCREEN_SIZE_TYPE_PATH}/all`);
    }

    public getFilteredCProgramList(page_number:string, project_id:string):Promise<CProgramList> { //Tyrion Verze 1.06.6.4 //C_program //^^
        return this.requestRestPath("PUT", `${BackEnd.C_PROGRAM_LIST}/${page_number}`, {project_id});
    }

    public getFilteredBProgramList(page_number:string, project_id:string):Promise<BProgramList> { //Tyrion Verze 1.06.6.4
        return this.requestRestPath("PUT", `${BackEnd.B_PROGRAM_PATH}/list/${page_number}`, {project_id});
    }

    public getFilteredBlockoBlockProgramList(page_number:string, project_id:string):Promise<BlockoBlockList> { //Tyrion Verze 1.06.6.4
        return this.requestRestPath("PUT", `${BackEnd.BLOCKOBLOCK_PATH}/list/${page_number}`, {project_id});
    }

    public getFilteredTypeOfBlockList(page_number:string, project_id:string, private_type:boolean):Promise<TypeOfBlockList> { //Tyrion Verze 1.06.6.4
        return this.requestRestPath("PUT", `${BackEnd.TYPE_OF_BLOCK_PATH}/list/${page_number}`, {
            project_id,
            private_type
        });
    }

    public getUnconfirmedNotification():Promise<OkResult> { //Tyrion Verze 1.06.6.4 //TODO zjistit co dělá a co s ní
        return this.requestRestPath("GET", `${BackEnd.UNCONFIRMED_NOTIFICATION_PATH}`);
    }

    public updateScreenType(id:string, name:string, width:number, height:number, columns:number, rows:number, width_lock:boolean, height_lock:boolean, portrait_min_screens:number, portrait_max_screens:number, landscape_min_screens:number, landscape_max_screens:number, touch_screen:boolean, project_id:string):Promise<any> {
        if (name.length < 3 || !Number.isInteger(width) || !Number.isInteger(height) || !Number.isInteger(columns) || !Number.isInteger(rows) || !Number.isInteger(portrait_min_screens) || !Number.isInteger(portrait_max_screens) || !Number.isInteger(landscape_min_screens) || !Number.isInteger(landscape_max_screens)) {
            throw "name >= 3, integer width, integer height, integer columns, integer rows and integer screen counts required";
        }

        return this.requestRestPath("PUT", `${BackEnd.SCREEN_SIZE_TYPE_PATH}/${id}`, {
            name,
            height_lock,
            width_lock,
            touch_screen,
            project_id,
            landscape_height: width,
            landscape_width: height,
            landscape_square_height: columns,
            landscape_square_width: rows,
            landscape_max_screens,
            landscape_min_screens,
            portrait_height: height,
            portrait_width: width,
            portrait_square_height: rows,
            portrait_square_width: columns,
            portrait_max_screens,
            portrait_min_screens
        });
    }

    public deleteScreenType(id:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.SCREEN_SIZE_TYPE_PATH}/${id}`);
    }

    public createMProject(program_name:string, program_description:string, projectId:string):Promise<MProject> {
        if (program_name.length < 4) {
            throw "name >= 4 required";
        }

        return this.requestRestPath("POST", `${BackEnd.M_PROJECT_PATH}/${projectId}`, {
            program_description,
            program_name
        }, 201);
    }

    public getMProject(id:string):Promise<MProject> {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", `${BackEnd.M_PROJECT_PATH}/${id}`);
    }

    public updateMProject(id:string, program_name:string, program_description:string):Promise<any> {
        if (program_name.length < 4) {
            throw "name >= 4 required";
        }

        return this.requestRestPath("PUT", `${BackEnd.M_PROJECT_PATH}/${id}`, {program_description, program_name});
    }

    public deleteMProject(id:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.M_PROJECT_PATH}/${id}`);
    }

    public createMProgram(program_name:string, program_description:string, screen_type_id:string, m_code:string, groupId:string):Promise<any> {
        if (program_name.length < 8 || !m_code) {
            throw "name >= 8 and code required";
        }

        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-302
        return this.requestRestPath("POST", `${BackEnd.M_PROGRAM_PATH}/${groupId}`, {
            screen_type_id,
            program_name,
            program_description,
            m_code,
            height_lock: false,
            width_lock: false
        }, 201);
    }

    public getMProgram(id:string):Promise<MProgram> {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", `${BackEnd.M_PROGRAM_PATH}/${id}`);
    }

    public getMPrograms():Promise<MProgram[]> {
        return this.requestRestPath("GET", `${BackEnd.M_PROGRAM_PATH}/app/m_programs`);

    }

    public updateMProgram(id:string, program_name:string, program_description:string, screen_type_id:string, m_code:string):Promise<any> {
        if (program_name.length < 8 || !m_code) {
            throw "name >= 8 and code required";
        }

        return this.requestRestPath("PUT", `${BackEnd.M_PROGRAM_PATH}/${id}`, {
            screen_type_id,
            program_name,
            program_description,
            m_code,
            height_lock: false,
            width_lock: false
        });
    }

    public deleteMProgram(id:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.M_PROGRAM_PATH}/${id}`);
    }

    /* //tyrion verze 1.06.6.4, odebraná API pro Becki
     public createProducer(name:string, description:string):Promise<any> {
     if (name.length < 4 || description.length < 8) {
     throw "name >= 4 and description >= 8 required";
     }

     return this.requestRestPath("POST", BackEnd.PRODUCER_PATH, {name, description}, 201);
     }
     */
    public getProducer(id:string):Promise<Producer> {
        return this.requestRestPath("GET", `${BackEnd.PRODUCER_PATH}/${id}`);
    }

    public getProducers():Promise<Producer[]> {
        return this.requestRestPath("GET", `${BackEnd.PRODUCER_PATH}/all`);
    }

    /*
     public updateProducer(id:string, name:string, description:string):Promise<any> {
     if (name.length < 8 || description.length < 24) {
     throw "name >= 8 and description >= 24 required";
     }

     return this.requestRestPath("PUT", `${BackEnd.PRODUCER_PATH}/${id}`, {name, description});
     }*/
    /*
     public deleteProducer(id:string):Promise<any> {
     return this.requestRestPath("DELETE", `${BackEnd.PRODUCER_PATH}/${id}`);
     }
     */
    public createLibrary(library_name:string, description:string):Promise<any> {
        if (library_name.length < 8 || description.length < 8) {
            throw "name >= 8 and description >= 8 required";
        }

        return this.requestRestPath("POST", BackEnd.LIBRARY_PATH, {library_name, description}, 201);
    }

    public getLibrary(id:string):Promise<Library> {
        return this.requestRestPath("GET", `${BackEnd.LIBRARY_PATH}/${id}`);
    }

    public getLibraries(page:number):Promise<LibrariesPage> {
        if (page < 1) {
            throw "page >= 1 required";
        }

        return this.requestRestPath("PUT", `${BackEnd.LIBRARY_PATH}/filter/${page}`, {});
    }

    public updateLibrary(id:string, library_name:string, description:string):Promise<any> {
        if (library_name.length < 8 || description.length < 8) {
            throw "name >= 8 and description >= 8 required";
        }

        return this.requestRestPath("PUT", `${BackEnd.LIBRARY_PATH}/${id}`, {library_name, description});
    }

    public addVersionToLibrary(version_name:string, version_description:string, id:string):Promise<Version> {
        if (version_name.length < 8 || version_description.length < 8) {
            throw "name >= 8 and description >= 8 required";
        }

        return this.requestRestPath("POST", `${BackEnd.LIBRARY_PATH}/version/${id}`, {
            version_name,
            version_description
        }, 201);
    }

    public updateFileOfLibrary(content:string, version:string):Promise<any> {
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-305
        return this.requestRestPath("POST", `${BackEnd.LIBRARY_PATH}/upload/${version}`, content);
    }

    public deleteLibrary(id:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.LIBRARY_PATH}/${id}`);
    }

    public createLibraryGroup(group_name:string, description:string):Promise<any> {
        if (group_name.length < 8 || description.length < 24) {
            throw "name >= 8 and description >= 24 required";
        }

        return this.requestRestPath("POST", BackEnd.LIBRARY_GROUP_PATH, {description, group_name}, 201);
    }

    public getLibraryGroup(id:string):Promise<LibraryGroup> {
        return this.requestRestPath("GET", `${BackEnd.LIBRARY_GROUP_PATH}/${id}`);
    }

    public getLibraryGroups(page:number):Promise<LibraryGroupsPage> {
        if (page < 1) {
            throw "page >= 1 required";
        }

        return this.requestRestPath("PUT", `${BackEnd.LIBRARY_GROUP_PATH}/filter/${page}`, {});
    }

    public updateLibraryGroup(id:string, group_name:string, description:string):Promise<any> {
        if (group_name.length < 8 || description.length < 24) {
            throw "name >= 8 and description >= 24 required";
        }

        return this.requestRestPath("PUT", `${BackEnd.LIBRARY_GROUP_PATH}/${id}`, {description, group_name}, 200);
    }

    public deleteLibraryGroup(id:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.LIBRARY_GROUP_PATH}/${id}`);
    }

    /*public createProcessor(processor_name:string, processor_code:string, description:string, speed:number):Promise<any> {
     if (processor_name.length < 4 || processor_code.length < 4 || description.length < 24 || !Number.isInteger(speed)) {
     throw "name >= 4, code >= 4 and description >= 24 required";
     }

     return this.requestRestPath("POST", BackEnd.PROCESSOR_PATH, {processor_name, description, processor_code, speed}, 201);
     }*/

    public getProcessor(id:string):Promise<Processor> {
        return this.requestRestPath("GET", `${BackEnd.PROCESSOR_PATH}/${id}`);
    }

    public getProcessors():Promise<Processor[]> {
        return this.requestRestPath("GET", BackEnd.PROCESSOR_PATH);
    }

    /*
     public updateProcessor(id:string, processor_name:string, processor_code:string, description:string, speed:number):Promise<any> {
     if (processor_name.length < 4 || processor_code.length < 4 || description.length < 24 || !Number.isInteger(speed)) {
     throw "name >= 4, code >= 4 and description >= 24 required";
     }

     return this.requestRestPath("PUT", `${BackEnd.PROCESSOR_PATH}/${id}`, {processor_name, description, processor_code, speed});
     }
     */
    /*
     public deleteProcessor(id:string):Promise<any> {
     return this.requestRestPath("DELETE", `${BackEnd.PROCESSOR_PATH}/${id}`);
     }
     */
    /*
     public createDeviceType(name:string, producer_id:string, processor_id:string, connectible_to_internet:boolean, description:string):Promise<any> {
     if (name.length < 8 || description.length < 10) {
     throw "name >= 8 and description >= 10 required";
     }

     return this.requestRestPath("POST", BackEnd.TYPE_OF_BOARD_PATH, {name, description, producer_id, processor_id, connectible_to_internet}, 201);
     }
     */


    public getTypeOfBoard(id:string):Promise<TypeOfBoard> {
        return this.requestRestPath("GET", `${BackEnd.TYPE_OF_BOARD_PATH}/${id}`);
    }

    public getAllTypeOfBoard():Promise<TypeOfBoard[]> {
        return this.requestRestPath("GET", `${BackEnd.TYPE_OF_BOARD_PATH}/all`);
    }

    /*
     public updateDeviceType(id:string, name:string, producer_id:string, processor_id:string, connectible_to_internet:boolean, description:string):Promise<any> {
     if (name.length < 8 || description.length < 10) {
     throw "name >= 8 and description >= 10 required";
     }

     return this.requestRestPath("PUT", `${BackEnd.TYPE_OF_BOARD_PATH}/${id}`, {name, description, producer_id, processor_id, connectible_to_internet});
     }
     */
    /*
     public deleteDeviceType(id:string):Promise<any> {
     return this.requestRestPath("DELETE", `${BackEnd.TYPE_OF_BOARD_PATH}/${id}`);
     }

     */
    public createCProgram(program_name:string, program_description:string, type_of_board_id:string, projectId:string):Promise<CProgram> {
        if (program_name.length < 8 || !type_of_board_id) {
            throw "name >= 8 and device type required";
        }

        return this.requestRestPath("POST", `${BackEnd.C_PROGRAM_COMPILATION_PATH}/${projectId}`, {
            program_name,
            program_description,
            type_of_board_id
        }, 201);
    }

    public getCProgram(id:string):Promise<CProgram> {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", `${BackEnd.C_PROGRAM_COMPILATION_PATH}/${id}`);
    }

    public updateCProgram(id:string, program_name:string, program_description:string, type_of_board_id:string):Promise<any> {
        if (program_name.length < 8 || !type_of_board_id) {
            throw "name >= 8 and device type required";
        }

        return this.requestRestPath("PUT", `${BackEnd.C_PROGRAM_COMPILATION_PATH}/${id}`, {
            program_name,
            program_description,
            type_of_board_id
        });
    }

    public addVersionToCProgram(version_name:string, version_description:string, files:{[name:string]:string}, program:string):Promise<any> {
        if (version_name.length < 8) {
            throw "name >= 8 required";
        }
        let user_files = Object.keys(files).map(file_name => ({file_name, code: files[file_name]}));

        return this.requestRestPath("POST", `${BackEnd.C_PROGRAM_VERSION_PATH}/create/${program}`, {
            version_name,
            version_description,
            user_files
        }, 201);
    }

    public buildCProgram(files:{[name:string]:string}, type_of_board_id:string):Promise<any> {
        if (!type_of_board_id) {
            throw "target required";
        }
        let user_files = Object.keys(files).map(file_name => ({file_name, code: files[file_name]}));

        return this.requestRestPath("POST", `${BackEnd.C_PROGRAM_VERSION_PATH}/compile`, {
            type_of_board_id,
            code: " ",
            user_files
        });
    }

    public deleteCProgram(id:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.C_PROGRAM_COMPILATION_PATH}/${id}`);
    }

    public createBoard(id:string, type_of_board_id:string):Promise<any> {
        if (!/^[0-9a-f]{8}$/.test(id)) {
            throw "ID = 8 hex chars required";
        }

        return this.requestRestPath("POST", BackEnd.BOARD_PATH, {type_of_board_id, hardware_unique_ids: [id]}, 201);
    }

    public getBoard(id:string):Promise<Board> {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", `${BackEnd.BOARD_PATH}/${id}`);
    }

    public getBoards(page:number):Promise<BoardList> {
        if (page < 1) {
            throw "page >= 1 required";
        }

        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("PUT", `${BackEnd.BOARD_PATH}/filter/${page}`, {});
    }

    public addBoardToProject(board:string, project:string):Promise<any> {
        return this.requestRestPath("PUT", `${BackEnd.BOARD_PATH}//${board}/${project}`, {});
    }

    public removeBoardFromProject(board:string):Promise<any> {
         return this.requestRestPath("DELETE", `${BackEnd.BOARD_PATH}/${board}`);
    }

    public updateBoardWithCProgram(versionId:string, board_id:string[]):Promise<any> {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("POST", `${BackEnd.C_PROGRAM_VERSION_PATH}/upload/${versionId}`, {board_id});
    }

    public postCompilationServer(server_name:string):Promise<any> {
        if (server_name.length < 6) {
            throw "name >= 6 required";
        }

        return this.requestRestPath("POST", BackEnd.EXTERNAL_SERVER_PATH, {server_name}, 201);
    }

    public getCompilationServers():Promise<CompilationServer[]> {
        return this.requestRestPath("GET", BackEnd.EXTERNAL_SERVER_PATH);
    }

    public editCompilationServer(id:string, server_name:string):Promise<any> {
        if (server_name.length < 6) {
            throw "name >= 6 required";
        }

        return this.requestRestPath("PUT", `${BackEnd.EXTERNAL_SERVER_PATH}/${id}`, {server_name});
    }

    public deleteCompilationServer(id:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.EXTERNAL_SERVER_PATH}/${id}`);
    }

    public getTypeOfBlock(id:string):Promise<TypeOfBlock> {
        return this.requestRestPath("GET", `${BackEnd.TYPE_OF_BLOCK_PATH}/${id}`);
    }

    public createTypeOfBlock(name:string, general_description:string, project_id:string):Promise<TypeOfBlock> {
        return this.requestRestPath("POST", `${BackEnd.TYPE_OF_BLOCK_PATH}`, {
            name,
            general_description,
            project_id
        }, 201);

    }

    public getAllTypeOfBlock():Promise<TypeOfBlock[]> {
        return this.requestRestPath("GET", BackEnd.TYPE_OF_BLOCK_PATH);
    }

    public updateTypeOfBlock(id:string, name:string, general_description:string, project_id:string):Promise<any> {

        return this.requestRestPath("PUT", `${BackEnd.TYPE_OF_BLOCK_PATH}/${id}`, {
            name,
            general_description,
            project_id
        });


    }

    public deleteTypeOfBlock(TypeOfBlockid:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.TYPE_OF_BLOCK_PATH}/${TypeOfBlockid}`, {});
    }

    public createBlockoBlock(name:string, type_of_block_id:string, general_description:string):Promise<BlockoBlock> {
        if (name.length < 8 || general_description.length < 24) {
            throw "name >= 8 and description >= 24 required";
        }

        return this.requestRestPath("POST", BackEnd.BLOCKOBLOCK_PATH, {
            general_description,
            name,
            type_of_block_id
        }, 201);
    }

    public getBlockoBlock(id:string):Promise<BlockoBlock> {
        // TODO: http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", `${BackEnd.BLOCKOBLOCK_PATH}/${id}`);
    }

    public updateBlockoBlock(id:string, name:string, general_description:string, type_of_block_id:string):Promise<any> {
        if (name.length < 8 || general_description.length < 24) {
            throw "name >= 8 and description >= 24 required";
        }

        return this.requestRestPath("PUT", `${BackEnd.BLOCKOBLOCK_PATH}/${id}`, {
            general_description,
            name,
            type_of_block_id
        });
    }

    public addVersionToBlockoBlock(version_name:string, version_description:string, logic_json:string, program:string):Promise<any> {
        if (!version_name || !version_description || !logic_json) {
            throw "name, description and code required";
        }

        return this.requestRestPath("POST", `${BackEnd.BLOCKOBLOCK_PATH}/version/${program}`, {
            version_name,
            version_description,
            design_json: "-",
            logic_json
        }, 201);
    }

    public deleteBlockoBlock(id:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.BLOCKOBLOCK_PATH}/${id}`);
    }

    public createBProgram(name:string, program_description:string, projectId:string):Promise<BProgram> {
        if (name.length < 8) {
            throw "name >= 8 required";
        }

        return this.requestRestPath("POST", `${BackEnd.B_PROGRAM_PATH}/${projectId}`, {program_description, name}, 201);
    }

    public getBProgram(id:string):Promise<BProgram> {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", `${BackEnd.B_PROGRAM_PATH}/${id}`);
    }

    public  subscribeBProgram(version_id:string):void {
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-262
        let message = {
            messageId: uuid.v4(),
            messageChannel: BackEnd.WS_CHANNEL,
            messageType: "subscribe_instace",
            version_id
        };
        if (!this.findEnqueuedWebSocketMessage(message, 'messageChannel', 'messageType', 'version_id')) {
            this.sendWebSocketMessage(message);
        }
    }

    public requestBProgramValues/*requestInteractionsSchemeValues*/(version_id:string):void {
        let message = {messageId: uuid.v4(), messageChannel: BackEnd.WS_CHANNEL, messageType: "getValues", version_id};
        if (!this.findEnqueuedWebSocketMessage(message, 'messageChannel', 'messageType', 'version_id')) {
            this.sendWebSocketMessage(message);
        }
    }

    public updateBProgram(id:string, name:string, program_description:string):Promise<any> {
        if (name.length < 8) {
            throw "name >= 8 required";
        }

        return this.requestRestPath("PUT", `${BackEnd.B_PROGRAM_PATH}/${id}`, {program_description, name});
    }

    public addMProjectConnection(group:string, version:string, autoupdate:boolean):Promise<any> {
        return this.requestRestPath("PUT", `${BackEnd.M_PROJECT_PATH}/connect/${group}/${version}/${autoupdate}`, {});
    }

    public addVersionToBProgram(version_name:string, version_description:string, program:string, boards:{board_id:string, c_program_version_id:string}[], main_board:{board_id:string, c_program_version_id:string}, programId:string):Promise<BProgramVersion> {
        if (!version_name || !program || !main_board) {
            throw "name, scheme and gateway required";
        }

        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-284
        return this.requestRestPath("PUT", `${BackEnd.B_PROGRAM_PATH}/update/${programId}`, {
            version_name,
            version_description,
            program,
            main_board,
            boards
        });
    }

    public deleteBProgram(id:string):Promise<any> {
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-185
        return this.requestRestPath("DELETE", `${BackEnd.B_PROGRAM_PATH}/${id}`);
    }

    public createHomer(mac_address:string, type_of_device:string, project_id?:string):Promise<any> {
        if (!mac_address) {
            throw "ID required";
        }

        return this.requestRestPath("POST", BackEnd.HOMER_PATH, {mac_address, type_of_device, project_id}, 201);
    }

    public getHomer(id:string):Promise<InteractionsModerator> {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", `${BackEnd.HOMER_PATH}/${id}`);
    }

    public uploadBProgramToHomer(versionId:string, HomerId:string, B_ProgramId:string):Promise<any> {
        return this.requestRestPath("PUT", `${BackEnd.B_PROGRAM_PATH}/uploadToHomer/${B_ProgramId}/${versionId}/${HomerId}`, {});
    }

    public deleteHomer(id:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.HOMER_PATH}/${id}`);
    }

    public createCloudHomerServer(server_name:string):Promise<any> {
        if (!server_name) {
            throw "name required";
        }
        // TODO: https://youtrack.byzance.cz/youtrack/issue/TYRION-281
        return this.requestRestPath("POST", BackEnd.CLOUD_HOMER_SERVER_PATH, {server_name}, 201);
    }

    public getCloudHomerServers():Promise<CloudHomerServer[]> {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath("GET", BackEnd.CLOUD_HOMER_SERVER_PATH);
    }

    public editCloudHomerServer(id:string, server_name:string):Promise<any> {
        if (!server_name) {
            throw "name required";
        }

        return this.requestRestPath("PUT", `${BackEnd.CLOUD_HOMER_SERVER_PATH}/${id}`, {server_name});
    }

    public deleteCloudHomerServer(id:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.CLOUD_HOMER_SERVER_PATH}/${id}`);
    }

    public getUserProduct():Promise<ApplicableProduct[]> { // tyrion Verze 1.06.6.4
        return this.requestRestPath("GET", `${BackEnd.TARIF_PATH}/user_applicable`);
    }

    public getRegistrationProducts(tariff_type:string, product_individual_name:string, payment_mode:string, currency_type:string, city:string, country:string, street_number:string, company_details_required:boolean, street:string, zip_code:string, registration_no:string, vat_number:string, company_name:string, company_authorized_email:string, company_authorized_phone:string, company_web:string, company_invoice_email:string, payment_method:string):Promise<UserTariff> {// tyrion Verze 1.06.6.4 //zařizuje a posílá becki nějaké informace o platbě Tyrionovi? všechny?
        if (!company_details_required) { //podle toho jestli jsou potřeba compady details, pokud ne, jedná se o zákazníka thus tato zkrácená volba
            return this.requestRestPath("GET", `${BackEnd.TARIF_PATH}/for_registration`, {
                tariff_type,
                product_individual_name,
                payment_mode,
                currency_type,
                city,
                country,
                street_number,
                street,
                zip_code
            });// tyrion Verze 1.06.6.4 //zařizuje a posílá becki nějaké informace o platbě Tyrionovi? všechny?
        } else {
            return this.requestRestPath("GET", `${BackEnd.TARIF_PATH}/for_registration`, {
                tariff_type,
                product_individual_name,
                currency_type,
                city,
                country,
                street_number,
                street,
                zip_code,
                registration_no,
                vat_number,
                company_name,
                company_authorized_email,
                company_authorized_phone,
                company_web,
                company_invoice_email,
                payment_mode,
                payment_method
            });
        }
    }

    public createProject(project_name:string, project_description:string, product_id:string):Promise<Project> {
        if (project_name.length < 8 || project_description.length < 24) {
            throw "name >= 8 and description >= 24 required";
        }

        return this.requestRestPath("POST", BackEnd.PROJECT_PATH, {project_name, project_description, product_id}, 201);
    }

    public createDefaultProject():Promise<Project> {
        return this.createProject("Default project", "An automatically created project. It can be edited or removed like any other project.", "1");
    }

    public getProject(id:string):Promise<Project> {
        // see http://youtrack.byzance.cz/youtrack/issue/TYRION-219#comment=109-417
        return this.requestRestPath<Project>("GET", `${BackEnd.PROJECT_PATH}/${id}`);
    }

    public getProjects():Promise<Project[]> {
        return this.requestRestPath("GET", BackEnd.PROJECT_PATH);
    }

    public updateProject(id:string, project_name:string, project_description:string,product_id:string):Promise<any> {
        if (project_name.length < 8 || project_description.length < 24) {
            throw "name >= 8 and description >= 24 required";
        }

        return this.requestRestPath<Project>("PUT", `${BackEnd.PROJECT_PATH}/${id}`, {
            project_name,
            project_description,
            product_id
        });
    }

    public removeHomerFromProject(homer:string, project:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.HOMER_PATH}/${project}/${homer}`);
    }

    public addCollaboratorToProject(collaborator:string, project:string):Promise<any> {
        return this.requestRestPath("PUT", `${BackEnd.PROJECT_PATH}/shareProject/${project}`, {persons_id: [collaborator]});
    }

    public removeCollaboratorsFromProject(persons_id:string[], project:string):Promise<any> {
        return this.requestRestPath("PUT", `${BackEnd.PROJECT_PATH}/unshareProject/${project}`, {persons_id});
    }

    public deleteProject(id:string):Promise<any> {
        return this.requestRestPath("DELETE", `${BackEnd.PROJECT_PATH}/${id}`);
    }

    public getPersonInfo():Promise<PersonBundle> {
        return this.requestRestPath<PersonBundle>("GET", BackEnd.LOGIN_PERSON_PATH);
    }

    public updatePersonInfo(id:string, nick:string, name:string, ftitle:string, ltitle:string) {
        return this.requestRestPath("PUT", `${BackEnd.PERSON_PATH}/${id}`, {
            nick_name: nick,
            full_name: name,
            first_title: ftitle,
            last_title: ltitle
        });
    }

    public getActualizationProcedureInfo(actualization_procedure_id:string):Promise<ActualizationProcedure> {
        return this.requestRestPath<ActualizationProcedure>("GET", `${BackEnd.ACTUALIZATION_PROCEDURE_PATH}/${actualization_procedure_id}`);
    }

}
