export namespace CometChat {
    let isNative: boolean;

    let MESSAGE_TYPE: {
        TEXT: string;
        MEDIA: string;
        IMAGE: string;
        VIDEO: string;
        AUDIO: string;
        FILE: string;
        CUSTOM: string;
    };
    let CATEGORY_MESSAGE: string;
    let CATEGORY_ACTION: string;
    let CATEGORY_CALL: string;
    let ACTION_TYPE: {
        MEMBER_JOINED: string;
        MEMBER_LEFT: string;
        MEMBER_KICKED: string;
        MEMBER_BANNED: string;
        MEMBER_UNBANNED: string;
        MEMBER_INVITED: string;
        MEMBER_SCOPE_CHANGED: string;
    };
    let CALL_TYPE: {
        AUDIO: string;
        VIDEO: string;
    };
    let RECEIVER_TYPE: {
        USER: string;
        GROUP: string;
    };
    let CALL_STATUS: {
        INITIATED: string;
        ONGOING: string;
        UNANSWERED: string;
        REJECTED: string;
        BUSY: string;
        CANCELLED: string;
        ENDED: string;
    };

    let GROUP_MEMBER_SCOPE: {
        ADMIN: string;
        MODERATOR: string;
        PARTICIPANT: string;
    };
    let GROUP_TYPE: {
        PUBLIC: string;
        PRIVATE: string;
        PROTECTED: string;
        PASSWORD: string;
    };
    let MESSAGE_REQUEST: {
        ID: string;
        SENT_AT: string;
    };


    /**
        *Setter method for CometChat authToken.
        *
        * @export
        * @param {string} authToken
        * @memberof CometChat
        **/
    export function setAuthToken(authToken: string): void;
    /**
        *Getter method for CometChat authToken.
        * @returns
        * @memberof CometChat
        **/
    export function getAuthToken(): string;
    /**
        * Getter for appId.
        *
        * @export
        * @returns
        * @memberof CometChat
        */
    export function getAppId(): string;
    /**
        *Getter for apiKey.
        *
        * @returns
        * @memberof CometChat
        */
    export function getApiKey(): string;
    /**------------------------------------*
        * Core apis     					   *
        *-------------------------------------**/
    /**
        * Initialize the CometChat app with the current appId provided as an argument.
        *
        * @export
        * @param {string} appId
        * @returns {CometChat}
        * @memberof CometChat
        */
    export function init(appId?: any): Promise<boolean>;
    /**
        *function to check whether CometChat class initialized before.
        *
        * @export
        * @returns
        * @memberof CometChat
        */
    export function isInitialized(): boolean;
    /**
        * Returns the singleton object of CometChat class.
        * if CometChat object is not created yet? it will create and returns it.
        *
        * @param appId Optional an argument needed for first time initialization.
        */
    export function getInstance(appId?: string);
    /**
        *	login funtion will authenticate user provided as an argument.
        *	two ways to login
        *	1. with uid and apiKey (unsecure way), double arguments.
        *  2. with authetoken (secure Way),single argument.
        * @export
        * @param {...string[]} args
        * @returns
        * @memberof CometChat
        */
    export function login(...args: any): Promise<{}>;
    /**-------------------------------------------------------------------*
        * Message related functions provided by CometChat class              *
        *--------------------------------------------------------------------**/
    /**
        * function will cosume the api to send TextMessage and on success it will add the message to local storage.
        *
        * @export
        * @param {(TextMessage | MediaMessage)} message
        * @returns
        * @memberof CometChat
        */
    export function sendMessage(message: TextMessage | MediaMessage | CustomMessage | any): Promise<{}>;
    /**
        * Send direct message to user
        *
        * @export
        * @param {*} message Object
        * @returns
        * @memberof CometChat
        */
    export function sendDirectMessage(message: Object): Promise<{}>;
    /**
        * send message to group.
        *
        * @export
        * @param {*} message
        * @returns
        * @memberof CometChat
        */
    export function sendGroupMessage(message: any): Promise<{}>;
    /**
        * function will cosume the api to send MediaMessage and on success it will add the message to local storage.
        *
        * @export
        * @param {MediaMessage} message
        * @returns
        * @memberof CometChat
        */
    export function sendMediaMessage(message: Object): Promise<{}>;
    /**
        *
        *function will cosume the api to send CustomMessage and on success it will add the message to local storage.
        * @export
        * @param {CustomMessage} message
        * @returns
        * @memberof CometChat
        */
    export function sendCustomMessage(message: CustomMessage): Promise<{}>;
    export function getLastDeliveredMessageId(listId: any): Promise<any>;
    /**
        * Sending the isTyping notification to provided uid/ guid.
        *
        * @export
        * @param {string} uid
        * @param {string} receiverType
        * @memberof CometChat
        */
    export function startTyping(typingNotification: TypingIndicator | any): void;
    /**
        * Sending the typing paused notification to provided uid/ guid.
        *
        * @export
        * @param {string} receiverId
        * @param {string} receiverType
        * @memberof CometChat
        */
    export function endTyping(typingNotification: TypingIndicator | any): void;
    export function markMessageAsRead(baseMessage: BaseMessage): void;
    /**
        * get the message Information wi
        *
        * @export
        * @param {(string|any)} messageId
        * @returns
        * @memberof CometChat
        */
    export function getMessageDetails(messageId: string | any): any;
    /**
        * function will accept the limit and timestamp as params and return the promise with array of message.
        *
        * @export
        * @param {number} [limit]
        * @param {number} [timestamp]
        * @returns
        * @memberof CometChat
        */
    export function getPreviousMessagesByTimestamp(limit?: number, timestamp?: number): Promise<{}>;
    /**
        * function will accept the limit and id as params and return the promise with array of message.
        *
        * @export
        * @param {number} [limit]
        * @param {number} [id]
        * @returns
        * @memberof CometChat
        */
    export function getPreviousMessagesById(limit?: number, id?: number): Promise<{}>;
    /**
        * function will accept the limit and timestamp as params and return the promise with array of message.
        *
        * @export
        * @param {number} [limit]
        * @param {number} [timestamp]
        * @returns
        * @memberof CometChat
        */
    export function getNextMessagesByTimestamp(limit?: number, timestamp?: number): Promise<{}>;
    /**
        * function will accept the limit and id as params and return the promise with array of message.
        *
        * @export
        * @param {number} [limit]
        * @param {number} [id]
        * @returns
        * @memberof CometChat
        */
    export function getNextMessagesById(limit?: number, id?: number): Promise<{}>;
    /**-------------------------------------------------------------------*
        * User related functions provided by CometChat class                 *
        *--------------------------------------------------------------------**/
    /**
        * function to get the information for the uid provided as an argument
        * @export
        * @param {string} uid
        * @returns {(Promise<AppUser | Error>)}
        * @memberof CometChat
        */
    export function getUser(uid: any): Promise<User | Error>;
    /**
        * This function will returnms
        *
        * @returns {Promise<any>}
        * @memberof CometChat
        */
    export function getLoggedinUser(): Promise<any | CometChatException>;
    /**-------------------------------------------------------------------*
        * Group related functions provided by CometChat class                *
        *--------------------------------------------------------------------**/
    /**
        * function to create group and will also join the XMPP_MUC on success from the create group REST API.
        *
        * @export function
        * @param {Group} group
        * @returns Promise<Group|CometChatException>
        * @memberof CometChat
        */
    export function createGroup(group: any): Promise<{}>;
    /**
        * function to get the information for the group id provided as an argument
        *
        * @export function
        * @param {string} guid
        * @returns Promise<Group|CustomError>
        * @memberof CometChat
        */
    export function getGroup(guid: any): Promise<{}>;
    /**
        * function to join the exiting group group.
        * can be use to join the public,private and password groups.
        *
        * @export function
        * @param {guid} guid
        * @param {GroupType} type
        * @param {string} password
        * @returns {(Promise<Group>)}
        * @memberof CometChat
        */
    export function joinGroup(grp: any, type?: GroupType, password?: string): Promise<Group>;
    /**
        *
        * function update the already existing group and returns the result with updated group
        * @param {Group} group
        * @returns
        * @memberof CometChat
        */
    export function updateGroup(group: any): Promise<{}>;
    /**
        * function to delete the exiting group.
        *
        * @param {string} guid
        * @returns
        * @memberof CometChat
        */
    export function deleteGroup(guid: string): Promise<{}>;
    /**
        * function to leave the exiting group.
        *
        * @export function
        * @param {string} guid
        * @returns
        * @memberof CometChat
        */
    export function leaveGroup(guid: string): Promise<{}>;
    /**
        * function to kick the member from existing group.
        *
        * @export function
        * @param {*} guid
        * @param {*} uid
        * @returns
        * @memberof CometChat
        */
    export function kickGroupMember(guid: any, uid: any): Promise<{}>;
    /**
        * function to change the scope of the existing group.
        *
        * @export function
        * @param {string} guid
        * @param {string} uid
        * @param {GroupMemberScope} scope
        * @returns
        * @memberof CometChat
        */
    export function updateGroupMemberScope(guid: string, uid: string, scope: GroupMemberScope): Promise<{}>;
    /**
        * function to ban the group member. this method will add the member to list of banned members.
        *
        * @export function
        * @param {string} guid
        * @param {string} uid
        * @returns
        * @memberof CometChat
        */
    export function banGroupMember(guid: string, uid: string): Promise<{}>;
    /**
        * function to unban the member to chat in group propvided as an argument
        *
        * @export function
        * @param {string} guid
        * @param {string} uid
        * @returns
        * @memberof CometChat
        */
    export function unbanGroupMember(guid: string, uid: string): Promise<{}>;
    /**
        *Function will return list of added GroupMembers.
        *
        * @export function
        * @param {string} guid
        * @param {Array<GroupMember>} groupMembers
        * @param {Array<GroupMember>} [bannedMembersList]
        * @returns {Promise<Object>}
        * @memberof CometChat
        */
    export function addMembersToGroup(guid: string, groupMembers: Array<GroupMember>, bannedMembersList?: Array<GroupMember>): Promise<Object>;
    /**-------------------------------------------------------------------*
        * Call related functions provided by CometChat class                 *
        *--------------------------------------------------------------------**/
    /**
        * function to call the api to initiated outgoing call session with another user or group.
        *
        * @export function
        * @param {Call} call
        * @returns
        * @memberof CometChat
        */
    export function initiateCall(call: Call): Promise<{}>;
    /**
        * function to accept the incoming call from user to group.
        *
        * @export function
        * @param {string} sessionid
        * @param {HTMLElement} view
        * @returns
        * @memberof CometChat
        */
    export function acceptCall(sessionid: string): Promise<{}>;
    /**
        * function to reject the incoming call,cancle the outgoing call or to end the ongoing call.
        * @export function
        * @param {string} sessionId
        * @param {*} status
        * @returns
        * @memberof CometChat
        */
    export function rejectCall(sessionId: string, status: any): Promise<{}>;
    /**
        * function will inform the server to end the ongoing call with the session id provided as an argument.
        * clears the session for the provided (ongoing) call.
        * and will also add the same in localstorage on success.
        * @private
        * @export function
        * @param {string} sessionid
        * @returns
        * @memberof CometChat
        */
    export function endCall(sessionid: string): Promise<{}>;
    /**
        * function will return the active `Call` from `CallManager`
        *
        * @export function
        * @returns
        * @memberof CometChat
        */
    export function getActiveCall(): Call;
    /**
        * functiom to start the jitsi view in iframe.
        *
        * @export function
        * @param {string} sessionId
        * @param {HTMLElement} view
        * @param {UserCallEventListener} [callEventHandler]
        * @memberof CometChat
        */
    export function startCall(sessionId: string, view: HTMLElement, callEventHandler?: UserCallEventListener, context?: any): void;
    export function createCallView(context: any): {
        prop1: typeof CometChat.makeCall;
        onMessage: (event: any) => void;
    };
    export function makeCall(context: any, uri: string): void;
    /**
        * function will inform the server that current outgoing call is timedout for the call with the session id provided as an argument.
        * and will also add the same in localstorage on success.
        * @export function
        * @param {string} sessionid
        * @returns
        * @memberof CometChat
        */
    export function sendUnansweredResponse(sessionid: string): Promise<{}>;
    /**-------------------------------------------------------------------------------------------------------*
        * Events listeners setting and removing	.																  *
        *--------------------------------------------------------------------------------------------------------**/
    /**
        * It will add the MessgeEventListener to list of the MessageEventListeners.
        *
        * @param {string} name
        * @param {Function} callback
        * @memberof CometChat
        */
    export function addMessageListener(name: string, messageEventListener): void;
    /**
        * It will remove the MessgeEventListener from the list of the MessageEventListeners.
        *
        * @param {string} name
        * @memberof CometChat
        */
    export function removeMessageListener(name: string): void;
    /**
        * It will add the CallEventListener to list of the CallEventListeners.
        *
        * @param {string} name
        * @param {Function} callback
        * @memberof CometChat
        */
    export function addCallListener(name: string, callEventListener: CallEventListener): void;
    /**
        * It will remove the CallEventListener from the list of the CallEventListeners
        *
        * @param {string} name
        * @memberof CometChat
        */
    export function removeCallListener(name: string): void;
    /**
        * It will add the UserEventListener to list of the UserEventListeners.
        *
        * @param {string} name
        * @param {Function} callback
        * @memberof CometChat
        */
    export function addUserListener(name: string, userEventListener: UserEventListener): void;
    /**
        * It will remove the UserEventListener from the list of the UserEventListener.
        *
        * @param {string} name
        * @memberof CometChat
        */
    export function removeUserListener(name: string): void;
    /**
        * It will add the GroupEventListener to list of the GroupEventListeners.
        *
        * @param {string} name
        * @param {Function} callback
        * @memberof CometChat
        */
    export function addGroupListener(name: string, groupEventListenerHandler: GroupEventListener): void;
    /**
        * It will remove the GroupEventListener from the list of the GroupEventListeners.
        *
        * @param {string} name
        * @memberof CometChat
        */
    export function removeGroupListener(name: string): void;
    /**
        * Get the XMPP/ WEBRTC details from the servers
        *
        * @returns
        * @memberof CometChat
        */
    export function getAppSettings(): Promise<{}>;
    /**
        * Clears the authtoken from server and clears the local cache.
        *
        * @export function
        * @memberof CometChat
        */
    export function logout(): Promise<{}>;
export function clearCache(): void;
    export function typingTimer(): void;
    /**
        * add the CometChat Extetion to be executed in proper order
        *
        * @export function
        * @param {CometChatExtension} cometChatExtension
        * @memberof CometChat
        */
    export function addExtension(cometChatExtension: CometChatExtension): void;


    /**
      *
      *
      * @export
      * @class Error
      * @implements {ErrorModel}
      */
    export class CometChatException implements ErrorModel {
        code?: string | number;
        name?: string;
        message?: string;
        details?: string;
        constructor(errorModel: ErrorModel);
    }

    export interface UserObj {
        uid: string;
        name: string;
        authToken: string;
        avatar: string;
        credits: number;
        email: string;
        lastActiveAt: number;
        link: string;
        metadata: string;
        role: string;
        status: string;
        statusMessage: string;
    }
    /**
        * Implementation of UserObject
        */
    export class User {
        /**
            * Returns unique uid of the user.
            *
            * @returns {string}
            * @memberof AppUser
            */
        getUid(): string;
        setUid(uid: string): void;
        getName(): string;
        setName(name: string): void;
        getAuthToken(): string;
        setAuthToken(authToken: string): void;
        getAvatar(): string;
        setAvatar(avatar: string): void;
        getCredits(): number;
        setCredits(credits: number): void;
        getEmail(): string;
        setEmail(email: string): void;
        getLastActiveAt(): number;
        setLastActiveAt(lastActiveAt: number): void;
        getLink(): string;
        setLink(link: string): string;
        getMetadata(): string;
        setMetadata(metadata: string): void;
        getRole(): string;
        setRole(role: string): void;
        getStatus(): string;
        setStatus(status: string): void;
        getStatusMessage(): string;
        setStatusMessage(statusMessage: string): void;
        constructor(userObj: UserObj | any);
    }
    export class Me extends User {
        constructor(userObj: UserObj | any);
        getWsChannel(): any;
    }

    export class MediaMessage extends BaseMessage implements Message {
        static readonly TYPE: {
            TEXT: string;
            MEDIA: string;
            IMAGE: string;
            VIDEO: string;
            AUDIO: string;
            FILE: string;
            CUSTOM: string;
        };
        static readonly RECEIVER_TYPE: {
            USER: string;
            GROUP: string;
        };
        static readonly CATEGORY: {
            MESSAGE: string;
            ACTION: string;
            CALL: string;
        };
        protected data?: any;
        constructor(receiver: string, file: File | string, type: string, receiverType: string);
        setCaption(text: string): void;
        getCaption(): any;
        getSender(): User;
        getUrl(): string;
        setUrl(value: string): void;
        getMetadata(): Object;
        setMetadata(metadata: Object): void;
        getData(): Object;
        setData(value: Object): void;
        getAttachment(): Attachment;
        setAttachment(attachment: Attachment): void;
    }

    export interface Message {
    }
    /**
      *Basic Message Object
      *
      * @export
      * @class BaseMessage
      */
    export class BaseMessage implements Message {
        protected id?: number;
        protected muid?: string;
        protected sender?: Me | any;
        protected receiver?: string;
        protected type?: string;
        protected category?: MessageCategory;
        protected receiverType?: string;
        protected sentAt?: number;
        protected deliveredAt?: number;
        protected readAt?: string;
        protected metadata: Object;
        protected status?: string;
        protected receipts?: any[];
        protected readReceipts?: MessageReceipt[];
        protected deliveryReceipts?: MessageReceipt[];
        constructor(receiver: string, messageType: string, receiverType: string, category: MessageCategory);
        getId(): number;
        setId(value: number): void;
        getMuid(): string;
        setMuid(value: string): void;
        getSender(): User;
        setSender(value: User): void;
        getReceiver(): string;
        setReceiver(value: string): void;
        getType(): string;
        setType(value: string): void;
        get(): number;
        setReceiverType(value: string): void;
        getReceiverType(): string;
        setSentAt(value: number): void;
        getSentAt(): number;
        getStatus(): string;
        setStatus(value: string): void;
        getDeliveredAt(): number;
        setDeliveredAt?(deliveredAt: number): void;
        getReadAt?(): string;
        setReadAt?(readAt: string): void;
        getCategory(): MessageCategory;
        setCategory(category: MessageCategory): void;
    }

    export class TextMessage extends BaseMessage {
        static readonly TYPE: string;
        static readonly RECEIVER_TYPE: {
            USER: string;
            GROUP: string;
        };
        static readonly CATEGORY: string;
        /**
          *Creates an instance of TextMessage.
          * @param {string} receiverUid
          * @param {string} text
          * @param {string} senderUid
          * @param {string} receiverType
          * @memberof TextMessage
          */
        constructor(receiver: string, text: string, type: string, receiverType: string);
        getSender(): User;
        getMetadata(): Object;
        setMetadata(value: Object): void;
        getData(): any;
        setData(value: string): void;
        getText(): string;
        setText(text: string): void;
        setProcessedText(text: string): void;
        getProcessedText(): string;
    }

    export const constants: {
        DEFAULT_STORE: string;
        MSG_VER_PRE: string;
        MSG_VER_POST: string;
    };
    export const DEFAULT_VALUES: {
        MSGS_LIMIT: number;
        MSGS_MAX_LIMIT: number;
        CALL_TIMEOUT: number;
        DEFAULT_MSG_ID: number;
        DEFAULT_MAX_TYPING_INDICATOR_LIMIT: number;
    };
    export enum GroupType {
        Public = "public",
        Private = "private",
        Protected = "protected",
        Password = "password"
    }

    export enum GroupMemberScope {
        Admin = "admin",
        Moderator = "moderator",
        Member = "member"
    }

    export const XMPP: {
        host: string;
        port: number;
        bind_url: string;
        deafult_password: string;
        jid_string: string;
        bare_jid_string: string;
        username_string: string;
        muc_jid_string: string;
        xmpp_resource: string;
        CONVERSATION: {
            TYPE: {
                CHAT: string;
                GROUP_CHAT: string;
            };
        };
    };
    export const LOCAL_STORE: {
        COMMON_STORE: string;
        MESSAGE_LISTENERS_LIST: string;
        USERS_STORE: string;
        MESSAGES_STORE: string;
        STORE_STRING: string;
    };
    export const ResponseConstants: {
        RESPONSE_KEYS: {
            KEY_DATA: string;
            KEY_META: string;
            KEY_CURSOR: string;
            KEY_ACTION: string;
            KEY_MESSAGE: string;
            KEY_ERROR: string;
            KEY_ERROR_DETAILS: string;
            KEY_ERROR_CODE: string;
            KEY_ERROR_MESSAGE: string;
            KEY_AUTH_TOKEN: string;
            KEY_WS_CHANNEL: string;
            KEY_IDENTITY: string;
            KEY_SERVICE: string;
            KEY_ENTITIES: string;
            KEY_ENTITITY: string;
            KEY_ATTACHMENTS: string;
            CODE_REQUEST_OK: number;
            CODE_BAD_REQUEST: number;
        };
    };
    export const DELIVERY_RECEIPTS: {
        RECEIVER_ID: string;
        RECEIVER_TYPE: string;
        RECIPIENT: string;
        MESSAGE_ID: string;
        RECEIVED: string;
        DELIVERED_AT: string;
        ID: string;
        TIME: string;
    };
    export const READ_RECEIPTS: {
        RECEIVER_ID: string;
        RECEIVER_TYPE: string;
        RECIPIENT: string;
        MESSAGE_ID: string;
        READ: string;
        READ_AT: string;
        ID: string;
        TIME: string;
    };
    export const MessageConstatnts: {
        XMPP_KEYS: {
            FROM: string;
            TO: string;
            TYPE: string;
            TYPE_USER: string;
            TYPE_GROUP: string;
        };
        TYPE: {
            TEXT: string;
            MEDIA: string;
            IMAGE: string;
            VIDEO: string;
            AUDIO: string;
            FILE: string;
            CUSTOM: string;
        };
        CATEGORY: {
            MESSAGE: string;
            ACTION: string;
            CALL: string;
        };
        RECEIVER_TYPE: {
            USER: string;
            GROUP: string;
        };
        KEYS: {
            ATTATCHMENT: string;
            ATTATCHMENTS: string;
            ACTION: string;
            TYPE: string;
            DATA: string;
            ID: string;
            MUID: string;
            SENDER: string;
            RECEIVER: string;
            CATEGORY: string;
            RECEIVER_TYPE: string;
            SENT_AT: string;
            STATUS: string;
            TEXT: string;
            URL: string;
            METADATA: string;
            RECEIPTS: string;
            CUSTOM_DATA: string;
            CUSTOM_SUB_TYPE: string;
        };
        KNOWN_MEDIA_TYPE: {
            IMAGE: any[];
            VIDEO: any[];
            AUDIO: any[];
            FILE: any[];
        };
        PAGINATION: {
            AFFIX: {
                APPEND: string;
                PREPEND: string;
            };
            CURSOR_FILEDS: {
                ID: string;
                SENT_AT: string;
            };
            CURSOR_AFFIX_DEFAULT: string;
            CURSOR_FIELD_DEFAULT: string;
            KEYS: {
                PER_PAGE: string;
                CURSOR_AFFIX: string;
                AFFIX: string;
                CURSOR_FIELD: string;
                CURSOR_VALUE: string;
                UID: string;
                SENT_AT: string;
                ID: string;
                CURRENT_PAGE: string;
            };
        };
    };
    export const ATTACHMENTS_CONSTANTS: {
        KEYS: {
            EXTENSION: string;
            MIME_TYPE: string;
            NAME: string;
            SIZE: string;
            URL: string;
        };
    };
    export enum MessageCategory {
        ACTION = "action",
        MESSAGE = "message",
        CALL = "call"
    }
    export const TYPING_NOTIFICATION: {
        RECEIVER_ID: string;
        RECEIVER_TYPE: string;
        META: string;
        KEYS: {
            TYPING_NOTIFICATION: string;
            TIMESTAMP: string;
        };
        ACTIONS: {
            STARTED: string;
            ENDED: string;
        };
    };
    export const ActionConstatnts: {
        ACTION_SUBJECTS: {
            ACTION_ON: string;
            ACTION_BY: string;
            ACTION_FOR: string;
        };
        ACTION_ENTITY_TYPE: {
            GROUP_USER: string;
            USER: string;
            GROUP: string;
        };
        ACTION_KEYS: {
            ACTION_CREATED: string;
            ACTION_UPDATED: string;
            ACTION_DELETED: string;
            ENTITY: string;
            ENTITY_TYPE: string;
            TYPE_MEMBER_JOINED: string;
            TYPE_MEMBER_LEFT: string;
            TYPE_MEMBER_KICKED: string;
            TYPE_MEMBER_BANNED: string;
            TYPE_MEMBER_UNBANNED: string;
            TYPE_MEMBER_INVITED: string;
            ACTION_SCOPE_CHANGED: string;
            ACTION_TYPE_USER: string;
            ACTION_TYPE_GROUP: string;
            ACTION_TYPE_GROUP_MEMBER: string;
            ACTION_TYPE_CALL: string;
        };
        ActionMessages: {
            ACTION_GROUP_JOINED_MESSAGE: string;
            ACTION_GROUP_LEFT_MESSAGE: string;
            ACTION_MEMBER_KICKED_MESSAGE: string;
            ACTION_MEMBER_BANNED_MESSAGE: string;
            ACTION_MEMBER_UNBANNED_MESSAGE: string;
            ACTION_MEMBER_INVITED_MESSAGE: string;
        };
        ACTION_TYPE: {
            TYPE_MEMBER_JOINED: string;
            TYPE_MEMBER_LEFT: string;
            TYPE_MEMBER_KICKED: string;
            TYPE_MEMBER_BANNED: string;
            TYPE_MEMBER_UNBANNED: string;
            TYPE_MEMBER_INVITED: string;
            TYPE_MEMBER_SCOPE_CHANGED: string;
        };
        ACTIONS: {
            MEMBER_JOINED: string;
            MEMBER_LEFT: string;
            MEMBER_KICKED: string;
            MEMBER_BANNED: string;
            MEMBER_UNBANNED: string;
            MEMBER_INVITED: string;
            MEMBER_SCOPE_CHANGED: string;
        };
    };
    export const CallConstants: {
        CALL_TYPE_AUDIO: string;
        CALL_TYPE_VIDEO: string;
        CALL_TYPE: {
            AUDIO: string;
            VIDEO: string;
        };
        RECEIVER_TYPE_GROUP: string;
        RECEIVER_TYPE_USER: string;
        CALL_KEYS: {
            CALL_DATA: string;
            CALL_ID: string;
            CALL_SESSION_ID: string;
            CALL_RECEIVER: string;
            CALL_SENDER: string;
            CALL_RECEIVER_TYPE: string;
            CALL_STATUS: string;
            CALL_TYPE: string;
            CALL_INITIATED_AT: string;
            CALL_JOINED_AT: string;
            CALL_LEFT_AT: string;
            CALL_METADATA: string;
            CALL_ENTITIES: string;
            CALL_ENTITY_TYPE: string;
            CALL_ENTITY: string;
            CALL_ENTITY_USER: string;
            CALL_ENTITY_GROUP: string;
        };
        CALL_STATUS: {
            INITIATED: string;
            ONGOING: string;
            UNANSWERED: string;
            REJECTED: string;
            BUSY: string;
            CANCELLED: string;
            ENDED: string;
        };
    };
    export const GroupConstants: {
        KEYS: {
            NAME: string;
            GUID: string;
            TYPE: string;
            PASSWORD: string;
            ICON: string;
            DESCRIPTION: string;
            OWNER: string;
            METADATA: string;
            CREATED_AT: string;
            UPDATED_AT: string;
            HAS_JOINED: string;
            WS_CHANNEL: string;
        };
    };
    export const GroupMemersConstans: {
        KEYS: {
            SCOPE: string;
            UID: string;
            GUID: string;
            USER: string;
        };
    };
    export const UserConstants: {
        UID: string;
        NAME: string;
        AUTH_TOKEN: string;
        AVATAR: string;
        CREDITS: string;
        EMAIL: string;
        LAST_ACTIVE_AT: string;
        LINK: string;
        META_DATA: string;
        ROLE: string;
        STATUS: string;
        STATUS_MESSAGE: string;
        USER_NAME: string;
    };
    export const Errors: {
        ERROR_IO_EXCEPTION: string;
        ERROR_JSON_EXCEPTION: string;
        ERROR_PASSWORD_MISSING: string;
        ERROR_LIMIT_EXCEEDED: string;
        ERROR_USER_NOT_LOGGED_IN: string;
        ERROR_INVALID_GUID: string;
        ERROR_PASSWORD_MISSING_MESSAGE: string;
        ERROR_LIMIT_EXCEEDED_MESSAGE: string;
        ERROR_USER_NOT_LOGGED_IN_MESSAGE: string;
        ERROR_INVALID_GUID_MESSAGE: string;
        ERROR_DEFAULT_MESSAGE: string;
    };
    export const CALL_ERROR: {
        CALL_ALREADY_INITIATED: {
            code: string;
            name: string;
            message: string;
            details: {};
        };
        ERROR_IN_CALLING: {
            code: string;
            name: string;
            message: string;
            details: {};
        };
    };
    export const PARAMETER_ERROR: {
        PARAMETER_REQUIRED: {
            code: string;
            name: string;
            message: string;
            details: {};
        };
    };
    export const GroupErrors: {
        NOT_A_GROUP: CometChatException;
    };
    export const PresenceConstatnts: {
        XMPP_KEYS: {
            FROM: string;
            STATUS: string;
            LAST_ACTIVE_AT: string;
            TYPE: string;
        };
        STATUS: {
            ONLINE: string;
            OFFLINE: string;
            JOINED: string;
            LEFT: string;
        };
    };
    export const APP_SETTINGS: {
        APP_SETTINGS: string;
        KEYS: {
            CHAT_HOST: string;
            CHAT_USE_SSL: string;
            GROUP_SERVICE: string;
            CALL_SERVICE: string;
            CHAT_WS_PORT: string;
            CHAT_WSS_PORT: string;
            CHAT_HTTP_BIND_PORT: string;
            CHAT_HTTPS_BIND_PORT: string;
            ADMIN_API_HOST: string;
            CLIENT_API_HOST: string;
            WEBRTC_HOST: string;
            WEBRTC_USE_SSL: string;
            WEBRTC_WS_PORT: string;
            WEBRTC_WSS_PORT: string;
            WEBRTC_HTTP_BIND_PORT: string;
            WEBRTC_HTTPS_BIND_PORT: string;
        };
    };

    export class Group {
        static readonly TYPE: typeof GroupType;
        static readonly Type: typeof GroupType;
        /**
          * Creates an instance of Group.
          * @param {string} guid
          * @param {string} name
          * @param {GroupType} type
          * @param {string} [passsword]
          * @param {string} [icon]
          * @param {string} [description]
          * @memberof Group
          */
        constructor(guid: string, name: string, type: GroupType | string, passsword?: string, icon?: string, description?: string, hasJoined?: boolean);
        getGuid(): string;
        setGuid(guid: string): void;
        getName(): string;
        setName(name: string): void;
        getType(): GroupType | string;
        setType(type: GroupType | string): void;
        setPassword(password: string): void;
        getIcon(): string;
        setIcon(icon: string): void;
        getDescription(): string;
        setDescription(description: string): void;
        getOwner(): string;
        setOwner(owner: string): void;
        getMetadata(): string;
        setMetadata(metadata: string): void;
        getCreatedAt(): number;
        setCreatedAt(createdAt: number): void;
        getUpdatedAt(): number;
        setUpdatedAt(updatedAt: number): void;
        getHasJoined(): boolean;
        setHasJoined(hasJoined: boolean): void;
        getWsChannel(): any;
        setWsChannel(wsChannel: any): void;
        setScope(scope: string): void;
        getScope(): string;
        getJoinedAt(): string;
        setJoinedAt(joinedAt: string): void;
    }

    export class MessageListener {
        onAction?: Function;
        onTextMessageReceived?: Function;
        onMediaMessageReceived?: Function;
        onCustomMessageReceived?: Function;
        onCall?: Function;
        onTypingStarted?: Function;
        onTypingEnded?: Function;
        onMessageDelivered?: Function;
        onMessageRead?: Function;
        constructor(...args);
    }
    export class CallEventListener {
        onIncomingCallReceived?: Function;
        onOutgoingCallAccepted?: Function;
        onOutgoingCallRejected?: Function;
        onIncomingCallCancelled?: Function;
        constructor(...args: any[]);
    }
    export class UserEventListener {
        onUserOnline?: Function;
        onUserOffline?: Function;
        constructor(...args: any[]);
    }
    export class GroupEventListener {
        onUserJoined?: Function;
        onUserLeft?: Function;
        onUserKicked?: Function;
        onUserBanned?: Function;
        onUserUnbanned?: Function;
        onMemberScopeChanged?: Function;
        constructor(...args: any[]);
    }
    export class UserCallEventListener {
        onYouLeft?: Function;
        onYouJoined?: Function;
        onUserJoined?: Function;
        onUserLeft?: Function;
        onCallEnded?: Function;
        onError?: Function;
        constructor(...args: any[]);
    }
    export interface EventListener {
        _name: string;
        _callback: Function;
        _eventListener?: UserEventListener | UserCallEventListener | CallEventListener | GroupEventListener;
    }
    export class Listener implements EventListener {
        _name: string;
        _callback: Function;
        constructor(name: string, callback: Function);
    }
    export class MessageEventListener extends Listener implements EventListener {
        _cursor?: number;
        _eventListener;
        constructor(name: string, messageEventListener?, cursor?: number, callback?: Function);
    }
    export class UserListener extends Listener implements EventListener {
        _cursor?: number;
        _eventListener: UserEventListener;
        constructor(name: string, userEventHandler?: UserEventListener, cursor?: number, callback?: Function);
    }
    export class GroupListener extends Listener implements EventListener {
        _cursor?: number;
        _eventListener: GroupEventListener;
        constructor(name: string, groupEventHandler?: GroupEventListener, cursor?: number, callback?: Function);
    }
    export class UserCallListener extends Listener implements EventListener {
        _cursor?: number;
        _eventListener: UserCallEventListener;
        constructor(callEventHandler?: UserCallEventListener, cursor?: number, callback?: Function);
    }
    export class CallListener extends Listener implements EventListener {
        _cursor?: number;
        _eventListener: CallEventListener;
        constructor(name: string, callEventListner?: CallEventListener, cursor?: number, callback?: Function);
    }

    export class Call extends BaseMessage implements Message {
        static readonly TYPE: {
            TEXT: string;
            MEDIA: string;
            IMAGE: string;
            VIDEO: string;
            AUDIO: string;
            FILE: string;
            CUSTOM: string;
        };
        static readonly RECEIVER_TYPE: {
            USER: string;
            GROUP: string;
        };
        readonly CATEGORY: {
            MESSAGE: string;
            ACTION: string;
            CALL: string;
        };
        readonly ACTION_TYPE: {
            TYPE_MEMBER_JOINED: string;
            TYPE_MEMBER_LEFT: string;
            TYPE_MEMBER_KICKED: string;
            TYPE_MEMBER_BANNED: string;
            TYPE_MEMBER_UNBANNED: string;
            TYPE_MEMBER_INVITED: string;
            TYPE_MEMBER_SCOPE_CHANGED: string;
        };
        protected metadata: any;
        protected action: string;
        protected rawData: string;
        protected initiatedAt: number;
        protected joinedAt: number;
        protected data: any;
        protected callInitiator: object;
        protected callReceiver: object;
        constructor(receiver: any, type: any, receiverType: any, category?: any);
        getCallInitiator(): User;
        getCallReceiver(): User;
        setCallInitiator(user: any): void;
        setCallReceiver(user: any): void;
        getData(): object;
        setData(data: object): void;
        getSessionId(): string;
        setSessionId(sessionId: string): void;
        getMetadata(): any;
        getSender(): User;
        setMetadata(metadata: any): void;
        getAction(): string;
        setAction(action: string): void;
        getInitiatedAt(): number;
        setInitiatedAt(initiatedAt: number): void;
        getJoinedAt(): number;
        setJoinedAt(joinedAt: number): void;
        setRawData(rawData: any): void;
        getRawData(): any;
        setSender(sender: any): void;
        /**
         *Creates an instance of TextMessage.
         * @param {string} receiverUid
         * @param {string} text
         * @param {string} senderUid
         * @param {string} receiverType
         * @memberof Actions
         */
        callFromJSON(rawMessage: any): Call | Message;
    }

    export class CallController {
        TAG: string;
        static callController: CallController;
        scrollHight: number;
        getCallListner(): UserCallListener;
        getInstance(): CallController;
        /**
         * returns the ongoing call object or null|undefined
         *
         * @returns {Call}
         * @memberof CallController
         */
        getActiveCall(): Call;
        /**
         * Initialize the call.
         *
         * @param {Call} call
         * @returns
         * @memberof CallController
         */
        initiateCall(call: Call): Promise<{}>;
        /**
         * Called when Incoming call initialized.
         *
         * @memberof CallController
         */
        onCallInitialized(): void;
        /**
         * Joining the outgoing call
         *
         * @param {*} call
         * @memberof CallController
         */
        joinCall(call: any): void;
        /**
         *Canceling dialed call.
         *
         * @memberof CallController
         */
        cancelCall(): void;
        /**
         *Reject the call
         *
         * @memberof CallController
         */
        rejectCall(): void;
        /**
         *Sending the busy reponce.
         *
         * @memberof CallController
         */
        sendBusyResponse(): void;
        /**
         *End the onGoin call
         *
         * @param {boolean} [isInternal]
         * @memberof CallController
         */
        endCall(isInternal?: boolean): void;
        onCallEnded(): void;
        /**
         * UnAnswer the Call.
         *
         * @memberof CallController
         */
        unAnswerCall(): void;
        onCallStarted(call: Call): Promise<{}>;
        endCallSession(): void;
        startCall(view: HTMLElement, callEventHandler?: UserCallEventListener, context?: any): void;
        destroy(): void;
    }

    export class Action extends BaseMessage implements Message {
        static readonly TYPE: {
            TEXT: string;
            MEDIA: string;
            IMAGE: string;
            VIDEO: string;
            AUDIO: string;
            FILE: string;
            CUSTOM: string;
        };
        static readonly RECEIVER_TYPE: {
            USER: string;
            GROUP: string;
        };
        static readonly CATEGORY: {
            MESSAGE: string;
            ACTION: string;
            CALL: string;
        };
        readonly ACTION_TYPE: {
            TYPE_MEMBER_JOINED: string;
            TYPE_MEMBER_LEFT: string;
            TYPE_MEMBER_KICKED: string;
            TYPE_MEMBER_BANNED: string;
            TYPE_MEMBER_UNBANNED: string;
            TYPE_MEMBER_INVITED: string;
            TYPE_MEMBER_SCOPE_CHANGED: string;
        };
        protected actionBy: User | Group;
        protected actionFor: User | Group;
        protected actionOn: User | Group;
        protected message: string;
        protected rawData: any;
        protected action: string;
        /**
         *Creates an instance of TextMessage.
         * @param {string} receiverUid
         * @param {string} text
         * @param {string} senderUid
         * @param {string} receiverType
         * @memberof Actions
         */
        actionFromJSON(rawMessage: any): Action | Message;
        setRawData(rawData: any): void;
        getRawData(): any;
        setMessage(message: string): void;
        getMessage(): string;
        setAction(action: string): void;
        getAction(): string;
        getSender(): User;
        setActionBy(by: User | Group): void;
        getActionBy(): User | Group;
        setActionOn(on: User | Group): void;
        getActionOn(): User | Group;
        setActionFor(actionFor: User | Group): void;
        getActionFor(): User | Group;
        getMetadata(): any;
        setMetadata(metadata: any): void;
    }

    export class GroupsRequest {
        constructor(builder?: GroupsRequestBuilder);
        fetchPrevious(): Promise<Group[] | CometChatException>;
        fetchNext(): Promise<Group[] | CometChatException>;
        /**
            * Create the pagination data to send with each request.
            *
            * @returns {*}
            * @memberof GroupsRequest
            */
        getNextData(): any;
    }
    export class GroupsRequestBuilder {
        limit: number;
        searchKeyWord: string;
        setLimit(limit: number): this;
        setSearchKeyWord(searchKeyWord: string): this;
        build(): GroupsRequest;
    }

    export class GroupMembersRequest {
        constructor(builder?: GroupMembersRequestBuilder | GroupOutCastMembersRequestBuilder);
        fetchPrevious(): Promise<GroupMember[] | CometChatException>;
        fetchNext(): Promise<GroupMember[] | CometChatException>;
        getNextData(): any;
        getPreData(): any;
    }
    export class GroupMembersRequestBuilder {
        limit: number;
        searchKeyWord: string;
        guid: string;
        constructor(guid: string);
        setLimit(limit: number): this;
        setSearchKeyWord(searchKeyWord: string): this;
        build(): GroupMembersRequest;
    }
    export class GroupOutCastMembersRequestBuilder extends GroupMembersRequestBuilder {
        isOutCastReq: boolean;
        constructor(guid: string);
        build(): GroupMembersRequest;
    }

    export class UsersRequest {
        constructor(builder?: UsersRequestBuilder);
        fetchPrevious(): Promise<User[] | CometChatException>;
        fetchNext(): Promise<User[] | CometChatException>;
        getNextData(): any;
        getPreData(): any;
    }
    export class UsersRequestBuilder {
        limit: number;
        searchKeyWord: string;
        setLimit(limit: number): this;
        setSearchKeyWord(searchKeyWord: string): this;
        build(): UsersRequest;
    }

    export class MessagesRequest {
        constructor(builder?: MessagesRequestBuilder);
        fetchNext(): Promise<{}>;
        fetchPrevious(): Promise<{}>;
    }
    export class MessagesRequestBuilder {
        limit?: number;
        maxLimit: number;
        uid?: string;
        guid?: string;
        timestamp?: number;
        id?: number;
        setLimit(limit?: number): this;
        setGUID(guid: string): this;
        setUID(uid: string): this;
        setTimestamp(timestamp?: number): this;
        setMessageId(id?: number): this;
        /**
          *Built the DefaultMessagesRequest
          *
          * @returns {DefaultMessagesRequest}
          * @memberof DefaultMessagesRequestBuilder
          */
        build(): MessagesRequest;
    }

    export class TypingIndicator {
        constructor(receiverId?: string, receiverType?: string, meta?: any);
        getReceiverType(): string;
        setReceiverType(receiverType: string): void;
        getReceiverId(): string;
        setReceiverId(receiverId: string): void;
        getMetadata(): string;
        setMetadata(meta: string): void;
        getSender(): User;
        setSender(sender: User): void;
    }

    export class CustomMessage extends BaseMessage implements Message {
        constructor(receiver: string, customData: Object, receiverType: string);
        getCustomData(): Object;
        setCustomData(customData: Object): void;
        getSender(): User;
        getSubType(): string;
        setSubType(subType: string): void;
        getMetadata(): Object;
        setMetadata(metadata: Object): void;
        getData(): any;
    }

    export class GroupMember {
        constructor(uid: string, scope?: string);
        getName(): string;
        setName(name: string): void;
        getAvatar(): string;
        setAvatar(avatar: string): void;
        getCredits(): number;
        setCredits(credits: number): void;
        getEmail(): string;
        setEmail(email: string): void;
        getLastActiveAt(): number;
        setLastActiveAt(lastActiveAt: number): void;
        getLink(): string;
        setLink(link: string): void;
        getMetadata(): string;
        setMetadata(metadata: string): void;
        getRole(): string;
        setRole(role: string): void;
        getStatus(): string;
        setStatus?(status: string): void;
        getStatusMessage(): string;
        setStatusMessage(statusMessage: string): void;
        setGuid(guid: string): void;
        setUid(uid: string): void;
        setScope(scope: GroupMemberScope): void;
        setJoinedAt(joinedAt: number): void;
        setIsBanned(isBanned: number): void;
        setUser(user: User): void;
        getGuid(): string;
        getUid(): string;
        getuser(): User;
        getScope(): string;
        getJoinedAt(): number;
        getIsBanned(): number;
    }

    export abstract class CometChatExtension {
        abstract onInit(appId: string, user?: Me): void;
        abstract onLogin(user: Me): void;
        abstract beforeMessageSent(message: BaseMessage): Promise<BaseMessage>;
        abstract afterMessageSent(message: BaseMessage): Promise<BaseMessage>;
        abstract onMessageReceived(message: BaseMessage): Promise<BaseMessage>;
        abstract onMessageListFetched(messages: BaseMessage[]): Promise<BaseMessage[]>;
        abstract onLogout(): void;
    }


    /**
      *
      *
      * @export
      * @interface ErrorModel
      */
    export interface ErrorModel {
        code?: string | number;
        name?: string;
        message?: string;
        details?: string;
    }

    export class Attachment {
        constructor(file: Object);
        /**
            *Create the file object from the provided JSON Object.
            *
            * @param {Object} file
            * @returns {FileObject}
            * @memberof FileObject
            */
        createFileFromJSON(file: Object): Attachment;
        /**
            * Converts the FileObject to JSON Object.
            *
            * @param {FileObject} fileObject
            * @returns {Object}
            * @memberof FileObject
            */
        toJSON(fileObject: Attachment): Object;
        getFileExtension(): string;
        setFileExtension(extension: string): void;
        getFileMimeType(): string;
        setFileMimeType(mimeType: string): void;
        getFileName(): string;
        setFileName(name: string): void;
        getFileSize(): number;
        setFileSize(size: number): void;
        getFileUrl(): string;
        setFileUrl(url: string): void;
    }
    export class ExtensionManager {
        static cometChatExtensionList: CometChatExtension[];
        static addCometChatExtension(cometchatExtension: CometChatExtension): void;
    }

    export class MessageReceipt {
        RECEIPT_TYPE: {
            READ_RECEIPT: string;
            DELIVERY_RECEIPT: string;
        };
        getReceiverType(): string;
        setReceiverType(receiverType: string): void;
        getSender(): User;
        setSender(sender: User): void;
        getReceiver(): string;
        setReceiver(receiver: string): void;
        getTimestamp(): string;
        setTimestamp(timestamp: string): void;
        getMessageId(): string;
        setMessageId(messageId: string): void;
        getReceiptType(): string;
        setReceiptType(receiptType?: string): void;
    }

}