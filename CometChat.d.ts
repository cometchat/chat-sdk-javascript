export namespace CometChat {
    let isNative: boolean;

    let USER_STATUS: {
        ONLINE: string;
        OFFLINE: string;
    };
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



    let MESSAGE_REQUEST: {
        ID: string;
        SENT_AT: string;
    };

    let appSettings: AppSettings;
    /**
        *Setter method for CometChat authToken.
        *
        * @static
        * @param {string} authToken
        * @memberof CometChat
        **/

    /**
        *Getter method for CometChat authToken.
        * @returns
        * @memberof CometChat
        **/

    /**
        * Getter for appId.
        *
        * @static
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
        * @static
        * @param {string} appId
        * @returns {CometChat}
        * @memberof CometChat
        */
    export function init(appId?: any, appSettings?: AppSettings | any): Promise<boolean>;
    /**
        *function to check whether CometChat class initialized before.
        *
        * @static
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
        * @static
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
        * @static
        * @param {(TextMessage | MediaMessage)} message
        * @returns
        * @memberof CometChat
        */
    export function sendMessage(message: TextMessage | MediaMessage | CustomMessage | any): Promise<{}>;
    /**
        * Send direct message to user
        *
        * @static
        * @param {*} message Object
        * @returns
        * @memberof CometChat
        */
    export function sendDirectMessage(message: Object): Promise<{}>;
    /**
        * send message to group.
        *
        * @static
        * @param {*} message
        * @returns
        * @memberof CometChat
        */
    export function sendGroupMessage(message: any): Promise<{}>;
    /**
        * function will cosume the api to send MediaMessage and on success it will add the message to local storage.
        *
        * @static
        * @param {MediaMessage} message
        * @returns
        * @memberof CometChat
        */
    export function sendMediaMessage(message: Object): Promise<{}>;
    /**
        *
        *function will cosume the api to send CustomMessage and on success it will add the message to local storage.
        * @static
        * @param {CustomMessage} message
        * @returns
        * @memberof CometChat
        */
    export function sendCustomMessage(message: CustomMessage): Promise<{}>;
    export function getLastDeliveredMessageId(): Promise<any>;
    /**
        * Sending the isTyping notification to provided uid/ guid.
        *
        * @static
        * @param {string} uid
        * @param {string} receiverType
        * @memberof CometChat
        */
    export function startTyping(typingNotification: TypingIndicator | any): void;
    /**
        * Sending the typing paused notification to provided uid/ guid.
        *
        * @static
        * @param {string} receiverId
        * @param {string} receiverType
        * @memberof CometChat
        */
    export function endTyping(typingNotification: TypingIndicator | any): void;
    /**
        * Mark all messages upto a specifeied message id as read
        *
        * @static
        * @param {string} messageId
        * @param {string} receiverId
        * @param {string} receiverType
        * @memberof CometChat
        */
    export function markAsRead(messageId: string, receiverId: string, receiverType: string): void;
    /**
        * Mark all messages upto a specifeied message id as delivered
        *
        * @static
        * @param {string} messageId
        * @param {string} receiverId
        * @param {string} receiverType
        * @memberof CometChat
        */
    export function markAsDelivered(messageId: string, receiverId: string, receiverType: string): void;
    /**
        * get the message Information with the help of message id
        *
        * @static
        * @param {(string|any)} messageId
        * @returns
        * @memberof CometChat
        */
    export function getMessageDetails(messageId: string | any): Promise<{}>;
    /**
* get the message Information with the help of message id
*
* @static
* @param {(string|any)} messageId
* @returns
* @memberof CometChat
*/
    export function getMessageReceipts(messageId: string | any): Promise<{}>;
    /**
        *
        *
        * @static
        * @returns
        * @memberof CometChat
        */
    export function getUnreadMessageCount(doHideMessages?: boolean): Promise<{}>;
    export function getUnreadMessageCountForAllUsers(doHideMessages?: boolean): Promise<{}>;
    export function getUnreadMessageCountForAllGroups(doHideMessages?: boolean): Promise<{}>;
    export function getUnreadMessageCountForUser(UID: string, doHideMessages?: boolean): Promise<{}>;
    export function getUnreadMessageCountForGroup(GUID: string, doHideMessages?: boolean): Promise<{}>;
    export function getUndeliveredMessageCount(doHideMessages?: boolean): Promise<{}>;
    export function getUndeliveredMessageCountForAllUsers(doHideMessages?: boolean): Promise<{}>;
    export function getUndeliveredMessageCountForAllGroups(doHideMessages?: boolean): Promise<{}>;
    export function getUndeliveredMessageCountForUser(UID: string, doHideMessages?: boolean): Promise<{}>;
    export function getUndeliveredMessageCountForGroup(GUID: string, doHideMessages?: boolean): Promise<{}>;
    /**
        *
        *
        * @static
        * @param {BaseMessage} message
        * @returns {Promise<BaseMessage>}
        * @memberof CometChat
        */
    export function editMessage(message: BaseMessage): Promise<BaseMessage>;
    export function deleteMessage(messageId: string | number): Promise<BaseMessage>;
    /**
        * function will accept the limit and timestamp as params and return the promise with array of message.
        *
        * @static
        * @param {number} [limit]
        * @param {number} [timestamp]
        * @returns
        * @memberof CometChat
        */
    export function getPreviousMessagesByTimestamp(limit?: number, timestamp?: number): Promise<{}>;
    /**
        * function will accept the limit and id as params and return the promise with array of message.
        *
        * @static
        * @param {number} [limit]
        * @param {number} [id]
        * @returns
        * @memberof CometChat
        */
    export function getPreviousMessagesById(limit?: number, id?: number): Promise<{}>;
    /**
        * function will accept the limit and timestamp as params and return the promise with array of message.
        *
        * @static
        * @param {number} [limit]
        * @param {number} [timestamp]
        * @returns
        * @memberof CometChat
        */
    export function getNextMessagesByTimestamp(limit?: number, timestamp?: number): Promise<{}>;
    /**
        * function will accept the limit and id as params and return the promise with array of message.
        *
        * @static
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
        * @static
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
    /**
        * block the users.
        *
        * @static
        * @param {String[]} blockedUids
        * @returns
        * @memberof CometChat
        */
    export function blockUsers(blockedUids: String[]): Promise<{}>;
    export function unblockUsers(blockedUids: String[]): Promise<{}>;
    /**-------------------------------------------------------------------*
        * Group related functions provided by CometChat class                *
        *--------------------------------------------------------------------**/
    /**
        * function to create group and will also join the XMPP_MUC on success from the create group REST API.
        *
        * @static
        * @param {Group} group
        * @returns Promise<Group|CometChatException>
        * @memberof CometChat
        */
    export function createGroup(group: any): Promise<{}>;
    /**
        * function to get the information for the group id provided as an argument
        *
        * @static
        * @param {string} guid
        * @returns Promise<Group|CustomError>
        * @memberof CometChat
        */
    export function getGroup(guid: any): Promise<{}>;
    /**
        * function to join the exiting group group.
        * can be use to join the public,private and password groups.
        *
        * @static
        * @param {guid} guid
        * @param {GroupType} type
        * @param {string} password
        * @returns {(Promise<Group>)}
        * @memberof CometChat
        */
    export function joinGroup(grp: any, type?: string, password?: string): Promise<Group>;
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
        * @static
        * @param {string} guid
        * @returns
        * @memberof CometChat
        */
    export function leaveGroup(guid: string): Promise<{}>;
    /**
        * function to kick the member from existing group.
        *
        * @static
        * @param {*} guid
        * @param {*} uid
        * @returns
        * @memberof CometChat
        */
    export function kickGroupMember(guid: string, uid: string): Promise<{}>;
    /**
        * function to change the scope of the existing group.
        *
        * @static
        * @param {string} guid
        * @param {string} uid
        * @param {GroupMemberScope} scope
        * @returns
        * @memberof CometChat
        */
    export function updateGroupMemberScope(guid: string, uid: string, scope: string): Promise<{}>;
    /**
        * function to ban the group member. this method will add the member to list of banned members.
        *
        * @static
        * @param {string} guid
        * @param {string} uid
        * @returns
        * @memberof CometChat
        */
    export function banGroupMember(guid: string, uid: string): Promise<{}>;
    /**
        * function to unban the member to chat in group propvided as an argument
        *
        * @static
        * @param {string} guid
        * @param {string} uid
        * @returns
        * @memberof CometChat
        */
    export function unbanGroupMember(guid: string, uid: string): Promise<{}>;
    /**
        *Function will return list of added GroupMembers.
        *
        * @static
        * @param {string} guid
        * @param {Array<GroupMember>} groupMembers
        * @param {Array<GroupMember>} [bannedMembersList]
        * @returns {Promise<Object>}
        * @memberof CometChat
        */
    export function addMembersToGroup(guid: string, groupMembers: Array<GroupMember>, bannedMembersList?: Array<string>): Promise<Object>;
    /**-------------------------------------------------------------------*
        * Call related functions provided by CometChat class                 *
        *--------------------------------------------------------------------**/
    /**
        * function to call the api to initiated outgoing call session with another user or group.
        *
        * @static
        * @param {Call} call
        * @returns
        * @memberof CometChat
        */
    export function initiateCall(call: Call): Promise<{}>;
    /**
        * function to accept the incoming call from user to group.
        *
        * @static
        * @param {string} sessionid
        * @param {HTMLElement} view
        * @returns
        * @memberof CometChat
        */
    export function acceptCall(sessionid: string): Promise<{}>;
    /**
        * function to reject the incoming call,cancle the outgoing call or to end the ongoing call.
        * @static
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
        * @static
        * @param {string} sessionid
        * @returns
        * @memberof CometChat
        */
    export function endCall(sessionid: string): Promise<{}>;
    /**
        * function will return the active `Call` from `CallManager`
        *
        * @static
        * @returns
        * @memberof CometChat
        */
    export function getActiveCall(): Call;
    /**
        * functiom to start the jitsi view in iframe.
        *
        * @static
        * @param {string} sessionId
        * @param {HTMLElement} view
        * @param {UserCallEventListener} [callEventHandler]
        * @memberof CometChat
        */
    export function startCall(sessionId: string, view: HTMLElement, callEventHandler?: OngoingCallListener, context?: any): void;
    export function toggleAudio(): void;
    export function toggleVideo(): void;
    export function leaveCall(): void;
    export function createCallView(context: any): {
        prop1: typeof CometChat.makeCall;
        onMessage: (event: any) => void;
    };
    export function makeCall(context: any, uri: string): void;
    /**
        * function will inform the server that current outgoing call is timedout for the call with the session id provided as an argument.
        * and will also add the same in localstorage on success.
        * @static
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
    export function addMessageListener(name: string, messageEventListener: MessageListener): void;
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
    export function addCallListener(name: string, callEventListener: CallListener): void;
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
    export function addUserListener(name: string, userEventListener: UserListener): void;
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
    export function addGroupListener(name: string, groupEventListenerHandler: GroupListener): void;
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
        * @static
        * @memberof CometChat
        */
    export function logout(): Promise<{}>;
    export function isExtensionEnabled(extensionId: string): Promise<{}>;
    export function clearCache(): void;
    export function typingTimer(): void;


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
        setBlockedByMe(blockedByMe: boolean): void;
        getBlockedByMe(): boolean;
        setJasBlockedMe(hasBlockedMe: boolean): void;
        getHasBlockedMeMe(): boolean;
        constructor(userObj: UserObj | any);
    }
    export class Me extends User {
        constructor(userObj: UserObj | any);
        getWsChannel(): any;
    }

    export class Conversation {
        setConversationId(conversationId: string): void;
        setConversationType(conversationType: string): void;
        setLastMessage(lastMessage: TextMessage | MediaMessage | CustomMessage | any): void;
        setConversationWith(conversationWith: User|Group): void;
        setUnreadMessageCount(unreadMessageCount: number | any): void;
        getConversationId() : string;
        getConversationType() : string;
        getLastMessage() : TextMessage | MediaMessage | CustomMessage | any;
        getConversationWith() : User | Group;
        getUnreadMessageCount() : number | any;
        constructor(conversationId: string, conversationType: string, lastMessage: TextMessage | MediaMessage | CustomMessage | any, conversationWith: User|Group, unreadMessageCount: number | any)
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
            CUSTOM: string;
        };
        protected data?: any;
        constructor(receiver: string, file: object | string, type: string, receiverType: string);
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
        protected category?: string;
        protected receiverType?: string;
        protected sentAt?: number;
        protected deliveredAt?: number;
        protected readAt?: string;
        protected deliveredToMeAt?: string;
        protected readByMeAt?: string;
        protected metadata: Object;
        protected status?: string;
        protected receipts?: any[];
        protected readReceipts?: MessageReceipt[];
        protected deliveryReceipts?: MessageReceipt[];
        protected editedAt: number;
        protected editedBy: string;
        protected deletedAt: number;
        protected deletedBy: String;
        constructor(receiver: string, messageType: string, receiverType: string, category: string);
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
        getDeliveredToMeAt(): string;
        setDeliveredToMeAt?(deliveredToMeAt: string): void;
        getReadAt?(): string;
        setReadAt?(readAt: string): void;
        getReadByMeAt?(): string;
        setReadByMeAt?(readByMeAt: string): void;
        getCategory(): string;
        setCategory(category: string): void;
        setEditedAt(editedAt: number): void;
        getEditedAt(): number;
        setEditedBy(editedBy: string): void;
        getEditedBy(): void;
        setDeletedAt(): number;
    }

    export class TextMessage extends BaseMessage implements Message {
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
        constructor(receiver: string, text: string, receiverType: string);
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
        ZERO: number;
        MSGS_LIMIT: number;
        MSGS_MAX_LIMIT: number;
        USERS_LIMIT: number;
        USERS_MAX_LIMIT: number;
        GROUPS_LIMIT: number;
        GROUPS_MAX_LIMIT: number;
        CALL_TIMEOUT: number;
        DEFAULT_MSG_ID: number;
        DEFAULT_MAX_TYPING_INDICATOR_LIMIT: number;
        REGION_DEFAULT: string;
        REGION_DEFAULT_EU: string;
        REGION_DEFAULT_US: string;
        REGION_DEFAULT_IN: string;
        REGION_DEFAULT_PRIVATE: string;
    };
    export const GROUP_TYPE: {
        PUBLIC: string;
        PRIVATE: string;
        PROTECTED: string;
        PASSWORD: string;
    };
    export const GROUP_MEMBER_SCOPE: {
        ADMIN: string;
        MODERATOR: string;
        PARTICIPANT: string;
    };
    export const APPINFO: {
        platform: string;
        sdkVersion: string;
        apiVersion: string;
    };
    export const XMPP: {
        host: string;
        port: number;
        bind_url: string;
        deafult_password: string;
        PUBSUB_CHANNEL: string;
        jid_string: string;
        bare_jid_string: string;
        username_string: string;
        muc_jid_string: string;
        pubsub_global_string: string;
        pubsub_default_string: string;
        pubsub_role_string: string;
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
            UNREAD_UNDELIVERED_KEYS: {
                ENTITY: string;
                ENTITY_TYPE: string;
                ENTITY_Id: string;
                COUNT: string;
            };
            GROUP_MEMBERS_RESPONSE: {
                SUCCESS: string;
                ERROR: string;
                MESSAGE: string;
            };
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
        DELIVERED_TO_ME_AT: string;
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
        READ_BY_ME_AT: string;
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
            CUSTOM: string;
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
            MY_RECEIPTS: string;
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
                UNREAD: string;
                UNDELIVERED: string;
                HIDE_MESSAGES_FROM_BLOCKED_USER: string;
                SEARCH_KEY: string;
                ONLY_UPDATES: string;
                UPDATED_AT: string;
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
            MESSAGE: string;
        };
        ACTION_KEYS: {
            ACTION_CREATED: string;
            ACTION_UPDATED: string;
            ACTION_DELETED: string;
            ENTITIES: string;
            ENTITY: string;
            ENTITY_TYPE: string;
            TYPE_MEMBER_JOINED: string;
            TYPE_MEMBER_LEFT: string;
            TYPE_MEMBER_KICKED: string;
            TYPE_MEMBER_BANNED: string;
            TYPE_MEMBER_UNBANNED: string;
            TYPE_MEMBER_INVITED: string;
            TYPE_MEMBER_ADDED: string;
            ACTION_SCOPE_CHANGED: string;
            ACTION_TYPE_USER: string;
            ACTION_TYPE_GROUP: string;
            ACTION_TYPE_GROUP_MEMBER: string;
            TYPE_MESSAGE_EDITED: string;
            TYPE_MESSAGE_DELETED: string;
            ACTION_TYPE_CALL: string;
            EXTRAS: string;
            SCOPE: string;
            NEW: string;
            OLD: string;
        };
        ActionMessages: {
            ACTION_GROUP_JOINED_MESSAGE: string;
            ACTION_GROUP_LEFT_MESSAGE: string;
            ACTION_MEMBER_KICKED_MESSAGE: string;
            ACTION_MEMBER_BANNED_MESSAGE: string;
            ACTION_MEMBER_UNBANNED_MESSAGE: string;
            ACTION_MEMBER_INVITED_MESSAGE: string;
            ACTION_MESSAGE_EDITED_MESSAGE: string;
            ACTION_MESSAGE_DELETED_MESSAGE: string;
            ACTION_MEMBER_SCOPE_CHANGED: string;
            ACTION_MEMBER_ADDED_TO_GROUP: string;
        };
        ACTION_TYPE: {
            TYPE_MEMBER_JOINED: string;
            TYPE_MEMBER_LEFT: string;
            TYPE_MEMBER_KICKED: string;
            TYPE_MEMBER_BANNED: string;
            TYPE_MEMBER_UNBANNED: string;
            TYPE_MEMBER_INVITED: string;
            TYPE_MEMBER_SCOPE_CHANGED: string;
            TYPE_MESSAGE: string;
            TYPE_MESSAGE_EDITED: string;
            TYPE_MESSAGE_DELETED: string;
            TYPE_MEMBER_ADDED: string;
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
    export const BlockedUsersConstants: {
        REQUEST_KEYS: {
            DIRECTIONS: {
                BOTH: string;
                HAS_BLOCKED_ME: string;
                BLOCKED_BY_ME: string;
            };
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
    export const GENERAL_ERROR: {
        MUST_BE_A_STRING: {
            code: string;
            name: string;
            message: string;
            details: {};
        };
        MUST_BE_A_NUMBER: {
            code: string;
            name: string;
            message: string;
            details: {};
        };
        MUST_BE_A_OBJECT: {
            code: string;
            name: string;
            message: string;
            details: {};
        };
        MUST_BE_AN_ARRAY: {
            code: string;
            name: string;
            message: string;
            details: {};
        };
        MUST_BE_A_BOOLEAN: {
            code: string;
            name: string;
            message: string;
            details: {};
        };
        MUST_BE_A_BLOB: {
            code: string;
            name: string;
            message: string;
            details: {};
        };
        INVALID: {
            code: string;
            name: string;
            message: string;
            details: {};
        };
        COMPULSORY: {
            code: string;
            name: string;
            message: string;
            details: {};
        };
        LIMIT_EXCEEDED: {
            code: string;
            name: string;
            message: string;
            details: {};
        };
        MUST_BE_A_POSITIVE_NUMBER: {
            code: string;
            name: string;
            message: string;
            details: {};
        };
    };
    export const UserErrors: {
        INVALID_STATUS: CometChatException;
        INVALID_DIRECTION: CometChatException;
    };
    export const GroupErrors: {
        NOT_A_GROUP: CometChatException;
        INVALID_SCOPE: CometChatException;
        INVALID_GROUP_TYPE: CometChatException;
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
            AVAILABLE: string;
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
            EXTENSION_LIST: string;
            EXTENSION_KEYS: {
                ID: string;
                NAME: string;
            };
        };
    };
    export const COMMON_UTILITY_CONSTANTS: {
        TYPE_CONSTANTS: {
            BOOLEAN: string;
            STRING: string;
            OBJECT: string;
            NUMBER: string;
        };
    };

    export class Group {
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
        constructor(guid: string, name: string, type: string, passsword?: string, icon?: string, description?: string, hasJoined?: boolean);
        getGuid(): string;
        setGuid(guid: string): void;
        getName(): string;
        setName(name: string): void;
        getType(): string;
        setType(type: string): void;
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
        onMessagesDelivered?: Function;
        onMessagesRead?: Function;
        onMessageEdited?: Function;
        onMessageDeleted?: Function;
        constructor(...args: any[]);
    }
    export class CallListener {
        onIncomingCallReceived?: Function;
        onOutgoingCallAccepted?: Function;
        onOutgoingCallRejected?: Function;
        onIncomingCallCancelled?: Function;
        constructor(...args: any[]);
    }
    export class UserListener {
        onUserOnline?: Function;
        onUserOffline?: Function;
        constructor(...args: any[]);
    }
    export class GroupListener {
        onUserJoined?: Function;
        onUserLeft?: Function;
        onUserKicked?: Function;
        onUserBanned?: Function;
        onUserUnbanned?: Function;
        onMemberScopeChanged?: Function;
        onMemberAddedToGroup: Function;
        onAddedToGroup: Function;
        constructor(...args: any[]);
    }
    export class OngoingCallListener {
        onYouLeft?: Function;
        onYouJoined?: Function;
        onUserJoined?: Function;
        onUserLeft?: Function;
        onCallEnded?: Function;
        onError?: Function;
        constructor(...args: any[]);
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
        static readonly CATEGORY: {
            MESSAGE: string;
            ACTION: string;
            CALL: string;
            CUSTOM: string;
        };
        static readonly ACTION_TYPE: {
            TYPE_MEMBER_JOINED: string;
            TYPE_MEMBER_LEFT: string;
            TYPE_MEMBER_KICKED: string;
            TYPE_MEMBER_BANNED: string;
            TYPE_MEMBER_UNBANNED: string;
            TYPE_MEMBER_INVITED: string;
            TYPE_MEMBER_SCOPE_CHANGED: string;
            TYPE_MESSAGE: string;
            TYPE_MESSAGE_EDITED: string;
            TYPE_MESSAGE_DELETED: string;
            TYPE_MEMBER_ADDED: string;
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
        getCallReceiver(): Group | User;
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
        static callFromJSON(rawMessage: any): Call | Message;
    }

    export class CallController {
        TAG: string;
        static callController: CallController;
        scrollHight: number;
        getCallListner(): OngoingCallListener;
        static getInstance(): CallController;
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
        startCall(view: HTMLElement, callEventHandler?: OngoingCallListener, context?: any): void;
        static toggleAudio(): void;
        static toggleVideo(): void;
        static leave(): void;
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
            CUSTOM: string;
        };
        static readonly ACTION_TYPE: {
            TYPE_MEMBER_JOINED: string;
            TYPE_MEMBER_LEFT: string;
            TYPE_MEMBER_KICKED: string;
            TYPE_MEMBER_BANNED: string;
            TYPE_MEMBER_UNBANNED: string;
            TYPE_MEMBER_INVITED: string;
            TYPE_MEMBER_SCOPE_CHANGED: string;
            TYPE_MESSAGE: string;
            TYPE_MESSAGE_EDITED: string;
            TYPE_MESSAGE_DELETED: string;
            TYPE_MEMBER_ADDED: string;
        };
        protected actionBy: User | Group | BaseMessage;
        protected actionFor: User | Group | BaseMessage;
        protected actionOn: User | Group | BaseMessage;
        protected message: string;
        protected rawData: any;
        protected action: string;
        protected oldScope: string;
        protected newScope: string;
        /**
            *Creates an instance of TextMessage.
            * @param {string} receiverUid
            * @param {string} text
            * @param {string} senderUid
            * @param {string} receiverType
            * @memberof Actions
            */
        static actionFromJSON(rawMessage: any): Action | Message;
        getOldScope(): string;
        getNewScope(): string;
        setNewScope(newScope: string): void;
        setOldScope(oldScope: string): void;
        setRawData(rawData: any): void;
        getRawData(): any;
        setMessage(message: string): void;
        getMessage(): string;
        setAction(action: string): void;
        getAction(): string;
        getSender(): User;
        setActionBy(by: User | Group | BaseMessage): void;
        getActionBy(): User | Group | BaseMessage;
        setActionOn(on: User | Group | BaseMessage): void;
        getActionOn(): User | Group | BaseMessage;
        setActionFor(actionFor: User | Group | BaseMessage): void;
        getActionFor(): User | Group | BaseMessage;
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
        searchKeyword: string;
        hasJoined: boolean;
        setLimit(limit: number): this;
        setSearchKeyword(searchKeyword: string): this;
        joinedOnly(hasJoined: boolean): this;
        build(): GroupsRequest;
    }

    export class BannedMembersRequest {
        constructor(builder?: BannedMembersRequestBuilder);
        setGUID
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
    export class BannedMembersRequestBuilder {
        constructor(guid: string);
        limit: number;
        searchKeyword: string;
        hasJoined: boolean;
        setLimit(limit: number): this;
        setSearchKeyword(searchKeyword: string): this;
        joinedOnly(hasJoined: boolean): this;
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
        searchKeyword: string;
        guid: string;
        constructor(guid: string);
        setLimit(limit: number): this;
        setSearchKeyword(searchKeyword: string): this;
        build(): GroupMembersRequest;
    }
    export class GroupOutCastMembersRequestBuilder extends GroupMembersRequestBuilder {
        isOutCastReq: boolean;
        constructor(guid: string);
        build(): GroupMembersRequest;
    }

    export class UsersRequest {
        static USER_STATUS: {
            ONLINE: string;
            OFFLINE: string;
        };
        constructor(builder?: UsersRequestBuilder);
        fetchPrevious(): Promise<User[] | CometChatException>;
        fetchNext(): Promise<User[] | CometChatException>;
        getNextData(): any;
        getPreData(): any;
    }
    export class UsersRequestBuilder {
        limit: number;
        status: string;
        searchKeyword: string;
        shouldHideBlockedUsers: boolean;
        role: string;
        showFriendsOnly: boolean;
        setLimit(limit: number): this;
        setStatus(status: string): this;
        setSearchKeyword(searchKeyword: string): this;
        hideBlockedUsers(hideBlockedUsers: boolean): this;
        setRole(role: string): this;
        friendsOnly(friendsOnly: boolean): this;
        build(): UsersRequest;
    }

    export class ConversationsRequest {
        constructor(builder?: ConversationsRequestBuilder);
        fetchNext(): Promise<Conversation[] | CometChatException>;
        getNextData(): any;
    }
    export class ConversationsRequestBuilder {
        conversationType: string;
        limit: number;
        setLimit(limit: number): this;
        setConversationType(conversationType: string): this;
        build(): ConversationsRequest;
    }

    export class CometChatHelper {
        static getConversationFromMessage(message: TextMessage | MediaMessage | CustomMessage | any): Promise<Conversation>;
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
        unread?: boolean;
        undelivered?: boolean;
        HideMessagesFromBlockedUsers?: boolean;
        searchKey?: string;
        updatedAt?: string;
        onlyUpdate?: number;
        category?: string;
        type?: string; 
        setLimit(limit: number): this;
        setGUID(guid: string): this;
        setUID(uid: string): this;
        setTimestamp(timestamp?: number): this;
        setMessageId(id?: number): this;
        setUnread(unread?: boolean): this;
        setUndelivered(undelivered?: boolean): this;
        hideMessagesFromBlockedUsers(hideMessagesFromBlockedUsers?: boolean): this;
        setSearchKeyword(searchKey: string): this;
        setUpdatedAfter(updatedAt: string): this;
        updatesOnly(onlyUpdate: boolean): this;
        setCategory(category: string): this;
        setType(type: string): this;
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
        constructor(...args: any[]);
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
        setScope(scope: string): void;
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
        constructor(extensionId: any);
        abstract extensionId: string;
        abstract getExtensionId(): string;
        abstract onInit(appId: string, user?: Me): Promise<void>;
        abstract onLogin(user: Me): Promise<void>;
        abstract beforeMessageSent(message: BaseMessage): Promise<BaseMessage>;
        abstract afterMessageSent(message: BaseMessage): Promise<BaseMessage>;
        abstract onMessageReceived(message: BaseMessage): Promise<BaseMessage>;
        abstract onMessageListFetched(messages: BaseMessage[]): Promise<BaseMessage[]>;
        abstract onLogout(): void;
    }

    export class ExtensionManager {
        static cometChatExtensionList: CometChatExtension[];
        static addCometChatExtension(cometchatExtension: CometChatExtension): Promise<void>;
    }

    export class BlockedUsersRequest {
        static DIRECTIONS: {
            BOTH: string;
            HAS_BLOCKED_ME: string;
            BLOCKED_BY_ME: string;
        };
        constructor(builder?: BlockedUsersRequestBuilder);
        fetchPrevious(): Promise<User[] | CometChatException>;
        fetchNext(): Promise<User[] | CometChatException>;
        getNextData(): any;
        getPreData(): any;
    }
    export class BlockedUsersRequestBuilder {
        limit: number;
        searchKeyword: string;
        direction: string;
        setLimit(limit: number): this;
        setSearchKeyWord(searchKeyword: string): this;
        setDirection(direction: string): this;
        blockedByMe(): this;
        hasBlockedMe(): this;
        build(): BlockedUsersRequest;
    }

    export class AppSettings {
        static SUBSCRIPTION_TYPE_NONE: string;
        static SUBSCRIPTION_TYPE_ALL_USERS: string;
        static SUBSCRIPTION_TYPE_ROLES: string;
        static SUBSCRIPTION_TYPE_FRIENDS: string;
        static REGION_EU: string;
        static REGION_US: string;
        static REGION_IN: string;
        static REGION_PRIVATE: string;
        subscriptionType: string;
        roles: string[];
        region: string;
        constructor(builder: AppSettingsBuilder);
        getSubscriptionType(): string;
        getRoles(): string[];
        getRegion(): string;
    }
    export class AppSettingsBuilder {
        subscriptionType: string;
        roles: string[];
        region: string;
        subscribePresenceForAllUsers(): this;
        subscribePresenceForRoles(roles: string[]): this;
        subscribePresenceForFriends(): this;
        setRegion(region?: string): this;
        build(): AppSettings;
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
        setReadAt(readAt: string): void;
        getReceivedAt(): string;
        setDeliveredAt(deliveredAt: string): void;
        getDeliveredAt(): string;
        getMessageId(): string;
        setMessageId(messageId: string): void;
        getReceiptType(): string;
        setReceiptType(receiptType?: string): void;
    }
}

