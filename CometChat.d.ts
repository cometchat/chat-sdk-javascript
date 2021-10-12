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
    let CATEGORY_CUSTOM : string;
    let ACTION_TYPE: {
        MEMBER_ADDED: string;
        MEMBER_JOINED: string;
        MEMBER_LEFT: string;
        MEMBER_KICKED: string;
        MEMBER_BANNED: string;
        MEMBER_UNBANNED: string;
        MEMBER_INVITED: string;
        MEMBER_SCOPE_CHANGED: string;
        MESSAGE_EDITED: string;
        MESSSAGE_DELETED: string;
        TYPE_USER: string;
        TYPE_GROUP: string;
        TYPE_GROUP_MEMBER: string;
    };
    let CALL_MODE: {
        DEFAULT: string,
		SPOTLIGHT: string,
		SINGLE: string,
        TILE: string,
        GRID: string
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
        * function to register the FCM token for Push Notification.
        * @static
        * @param {string} token
        * @param {JSON Object} Settings
        * @returns {Promise<string>}
        * @memberof CometChat
        */
    export function registerTokenForPushNotification(token: string, settings?: {}): Promise<string>;

    /**
        *	login funtion will authenticate user provided as an argument.
        *	two ways to login
        *	1. with uid and apiKey (unsecure way), double arguments.
        *   2. with authetoken (secure Way),single argument.
        * @static
        * @param {...string[]} args
        * @returns
        * @memberof CometChat
        */
    export function login(...args: any): Promise<User>;

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
    export function sendMessage(message: TextMessage | MediaMessage | CustomMessage | any): Promise<BaseMessage>;

    /**
        * Send direct message to user
        *
        * @static
        * @param {*} message Object
        * @returns
        * @memberof CometChat
        */
    export function sendDirectMessage(message: Object): Promise<BaseMessage>;

    /**
        * send message to group.
        *
        * @static
        * @param {*} message
        * @returns
        * @memberof CometChat
        */
    export function sendGroupMessage(message: any): Promise<BaseMessage>;

    /**
        * function will cosume the api to send MediaMessage and on success it will add the message to local storage.
        *
        * @static
        * @param {MediaMessage} message
        * @returns
        * @memberof CometChat
        */
    export function sendMediaMessage(message: Object): Promise<MediaMessage>;

    /**
        *
        *function will cosume the api to send CustomMessage and on success it will add the message to local storage.
        * @static
        * @param {CustomMessage} message
        * @returns
        * @memberof CometChat
        */
    export function sendCustomMessage(message: CustomMessage): Promise<CustomMessage>;

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
        * Mark all messages upto a specified message id as read
        *
        * @static
        * @param { ...string[] | (BaseMessage | TextMessage | MediaMessage | CustomMessage | any)  } args
        * @memberof CometChat
        */
     export function markAsRead(...args: any): any;

     /**
        * Mark all messages upto a specified message id as delivered
        *
        * @static
        * @param { ...string[] | (BaseMessage | TextMessage | MediaMessage | CustomMessage | any)  } args
        * @memberof CometChat
        */
    export function markAsDelivered(...args: any): any;

    /**
	 * Triggers the onTextMessageReceived event.
	 *
	 * @static
	 * @param {any} message
	 * @memberof CometChat
	 */
    export function sendTestMessage(message: any): void;

    /**
	 * Send a transient message.
	 *
	 * @static
	 * @param {TransientMessage} transientMessage
	 * @memberof CometChat
	 */
    export function sendTransientMessage(transientMessage: TransientMessage | any): void;
    
    /**
        * get the message Information with the help of message id
        *
        * @static
        * @param {(string|any)} messageId
        * @returns
        * @memberof CometChat
        */
    export function getMessageDetails(messageId: string | any): Promise<TextMessage | MediaMessage | CustomMessage | BaseMessage | null>;

    /**
        * get the message Information with the help of message id
        *
        * @static
        * @param {(string|any)} messageId
        * @returns
        * @memberof CometChat
        */
    export function getMessageReceipts(messageId: string | any): Promise<Object>;
    export function getUnreadMessageCount(doHideMessages?: boolean): Promise<Object>;
    export function getUnreadMessageCountForAllUsers(doHideMessages?: boolean): Promise<Object>;
    export function getUnreadMessageCountForAllGroups(doHideMessages?: boolean): Promise<Object>;
    export function getUnreadMessageCountForUser(UID: string, doHideMessages?: boolean): Promise<Object>;
    export function getUnreadMessageCountForGroup(GUID: string, doHideMessages?: boolean): Promise<Object>;
    export function editMessage(message: BaseMessage): Promise<BaseMessage>;
    export function deleteMessage(messageId: number): Promise<BaseMessage>;
    
    /**---------------------------------------------------------------------------------------*
     * Online User/Group Member count related functions provided by CometChat class           *
     *----------------------------------------------------------------------------------------**/
    
    /**
	 * This function will return online user count
	 *
	 * @returns {Promise<number>}
	 * @memberof CometChat
	 */
    export function getOnlineUserCount(): Promise<number>;

    /**
	 * This function will return online group members count for given GUIDs
	 *
	 * @param {String[]} groups
	 * @returns {Promise<number>}
	 * @memberof CometChat
	 */
    export function getOnlineGroupMemberCount(groups: String[]): Promise<Object>;
    
    /**-------------------------------------------------------------------*
        * User related functions provided by CometChat class                 *
        *--------------------------------------------------------------------**/
    /**
	 * function to create user.
	 *
	 * @static
	 * @param {User} user, authOnly apiKey
	 * @returns Promise<User>
	 * @memberof CometChat
	 */
    export function createUser(user: User | any, apiKey: string): Promise<User>;

    /**
	 *
	 * function to update the already existing user and returns the result with updated user
	 * @param {User} user, authOnly apiKey
	 * @returns Promise<User>
	 * @memberof CometChat
	 */
    export function updateUser(user: User | any, apiKey: string): Promise<User>;
    
    /**
	 *
	 * function to update the logged-in user and returns the result with updated user
	 * @param {User} user
	 * @returns Promise<User>
	 * @memberof CometChat
	 */
    export function updateCurrentUserDetails(user: User | any): Promise<User>

    /**
        * function to get the information for the uid provided as an argument
        * @static
        * @param {string} uid
        * @returns {(Promise<AppUser | Error>)}
        * @memberof CometChat
        */
    export function getUser(uid: any): Promise<User>;

    /**
        * This function will return logged in user
        *
        * @returns {Promise<User>}
        * @memberof CometChat
        */
    export function getLoggedinUser(): Promise<User | null>;

    export function blockUsers(blockedUids: String[]): Promise<Object>;
    export function unblockUsers(blockedUids: String[]): Promise<Object>;

    /**-------------------------------------------------------------------*
	 * Conversation related functions provided by CometChat class         *
	 *--------------------------------------------------------------------**/

	/**
	 * function to fetch conversation for a specific user/group.
	 *
	 * @static
	 * @param {string} conversationWith
	 * @param {string} conversationType
	 * @returns Promise<Conversation>
	 * @memberof CometChat
	 */

    export function getConversation(conversationWith: string, conversationType: string): Promise<Conversation>;

    /**
	 * function to delete conversation of a specific user/group.
	 *
	 * @static
	 * @param {string} conversationWith
	 * @param {string} conversationType
	 * @returns Promise<string>
	 * @memberof CometChat
	 */

    export function deleteConversation(conversationWith: string, conversationType: string): Promise<string>;

    /**-------------------------------------------------------------------*
        * Group related functions provided by CometChat class                *
        *--------------------------------------------------------------------**/

    /**
        * function to create group and will also join the XMPP_MUC on success from the create group REST API.
        *
        * @static
        * @param {Group} group
        * @returns Promise<Group>
        * @memberof CometChat
        */
    export function createGroup(group: any): Promise<Group>;

    /**
        * function to get the information for the group id provided as an argument
        *
        * @static
        * @param {string} guid
        * @returns Promise<Group>
        * @memberof CometChat
        */
    export function getGroup(guid: any): Promise<Group>;
    /**
        * function to get all the joined groups of logged in User
        *
        * @static
        * @returns Promise<Object>
        * @memberof CometChat
        */
    export function getJoinedGroups(): Promise<Object>;

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
    export function updateGroup(group: any): Promise<Group>;

    /**
        * function to delete the exiting group.
        *
        * @param {string} guid
        * @returns
        * @memberof CometChat
        */
    export function deleteGroup(guid: string): Promise<boolean>;

    /**
        * function to leave the exiting group.
        *
        * @static
        * @param {string} guid
        * @returns
        * @memberof CometChat
        */
    export function leaveGroup(guid: string): Promise<boolean>;

    /**
        * function to kick the member from existing group.
        *
        * @static
        * @param {*} guid
        * @param {*} uid
        * @returns
        * @memberof CometChat
        */
    export function kickGroupMember(guid: string, uid: string): Promise<boolean>;

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
    export function updateGroupMemberScope(guid: string, uid: string, scope: string): Promise<boolean>;

    /**
        * function to ban the group member. this method will add the member to list of banned members.
        *
        * @static
        * @param {string} guid
        * @param {string} uid
        * @returns
        * @memberof CometChat
        */
    export function banGroupMember(guid: string, uid: string): Promise<boolean>;

    /**
        * function to unban the member to chat in group propvided as an argument
        *
        * @static
        * @param {string} guid
        * @param {string} uid
        * @returns
        * @memberof CometChat
        */
    export function unbanGroupMember(guid: string, uid: string): Promise<boolean>;

    /**
        *Function will return list of added GroupMembers.
        *
        * @static
        * @param {string} guid
        * @param {Array<GroupMember>} groupMembers
        * @param {Array<String>} bannedMembersList
        * @returns {Promise<Object>}
        * @memberof CometChat
        */
    export function addMembersToGroup(guid: string, groupMembers: Array<GroupMember>, bannedMembersList: Array<string>): Promise<Object>;

    /**
        * function to transfer the ownership of the group.
        *
        * @static
        * @param {string} guid
        * @param {string} uid
        * @returns {Promise<string>}
        * @memberof CometChat
        */
    export function transferGroupOwnership(guid: string, uid: string): Promise<string>;

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
    export function initiateCall(call: Call): Promise<Call>;

    /**
        * function to accept the incoming call from user to group.
        *
        * @static
        * @param {string} sessionid
        * @param {HTMLElement} view
        * @returns
        * @memberof CometChat
        */
    export function acceptCall(sessionid: string): Promise<Call>;

    /**
        * function to reject the incoming call,cancle the outgoing call or to end the ongoing call.
        * @static
        * @param {string} sessionId
        * @param {*} status
        * @returns
        * @memberof CometChat
        */
    export function rejectCall(sessionId: string, status: any): Promise<Call>;

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
    export function endCall(sessionid: string): Promise<Call>;

    /**
        * function will return the active `Call` from `CallManager`
        *
        * @static
        * @returns
        * @memberof CometChat
        */
    export function getActiveCall(): Call;

    /**
        * function to start the jitsi view in iframe.
        *
        * @static
        * @param {CallSettings | string} callSettings
        * @param {HTMLElement} view
        * @param {UserCallEventListener} [callEventHandler]
        * @memberof CometChat
        */
    export function startCall(callSettings: CallSettings | string, view: HTMLElement, callEventHandler?: OngoingCallListener, context?: any): void;
    /**
        * function to fetch participant count of an ongoing call.
        *
        * @static
        * @param {string} sessionId
        * @param {string} type
        * @returns {Promise<number>}
        * @memberof CometChat
        */
    export function getCallParticipantCount(sessionId: string, type: string): Promise<number>;
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
    export function sendUnansweredResponse(sessionid: string): Promise<Call>;
    /**-------------------------------------------------------------------------------------------------------*
        * Events listeners setting and removing	.																  *
        *--------------------------------------------------------------------------------------------------------**/
    
    /**
        * It will add the ConnectionEventListner.
        *
        * @param {string} name
        * @param {Function} callback
        * @memberof CometChat
        */
       export function addConnectionListener(name: string, connectionEventListener: ConnectionListener): void;
       /**
            * It will remove the ConnectionEventListner.
            *
            * @param {string} name
            * @memberof CometChat
            */
       export function removeConnectionListener(name: string): void;

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
        * It will add the LoginEventListener to list of the LoginEventListeners.
        *
        * @param {string} name
        * @param {Function} callback
        * @memberof CometChat
        */
    export function addLoginListener(name: string, loginEventListenerHandler: LoginListener): void;
    /**
        * It will remove the LoginEventListener from the list of the LoginEventListeners.
        *
        * @param {string} name
        * @memberof CometChat
        */
    export function removeLoginListener(name: string): void;
    /**
        * Get the current connection status
        *
        * @returns string
        * @memberof CometChat
        */
    export function getConnectionStatus(): string;
    /**
	 * Returns a boolean value which indicates if the extension is enabled or not.
	 *
     * @param {string} extensionId Id of the extension
	 * @returns
	 * @memberof CometChat
	 */
	export function isExtensionEnabled(extensionId: string): Promise<boolean>;
    /**
	 * Returns an object of CCExtension Class which has the details of the extension.
	 *
     * @param {string} extensionId Id of the extension
	 * @returns
	 * @memberof CometChat
	 */
	export function getExtensionDetails(extensionId: string): Promise<CCExtension>;
    /**
        * Get the XMPP/ WEBRTC details from the servers
        *
        * @returns
        * @memberof CometChat
        */
    export function getAppSettings(): Promise<Object>;
    /**
	 * Returns a boolean value which indicates if a feature is enabled or not for the current plan.
	 *
     * @param {string} feature Name of feature
	 * @returns
	 * @memberof CometChat
	 */
	export function isFeatureEnabled(feature: string): Promise<boolean>;
    /**
        * Clears the authtoken from server and clears the local cache.
        *
        * @static
        * @memberof CometChat
        */
    export function logout(): Promise<Object>;
    
    /**
	 * method to set resource, platform and language variable.
	 *
	 * @static
	 * @param {string} resource
	 * @param {string} platform
	 * @param {string} language
	 * @returns void
	 * @memberof CometChat
	 */
    export function setSource(resource: string, platform: string, language: string): void;

    /**
	 * method to call extension API.
	 *
	 * @static
	 * @param {string} slug
	 * @param {string} method
	 * @param {string} endpoint
	 * @param {Object} data
	 * @returns {Promise<Object>}
	 * @memberof CometChat
	 */
    export function callExtension(slug: string, method: string, endpoint: string, data: Object): Promise<Object>;
    
    export function isExtensionEnabled(extensionId: string): Promise<boolean>;
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
        getLastActiveAt(): number;
        setLastActiveAt(lastActiveAt: number): void;
        getLink(): string;
        setLink(link: string): string;
        getMetadata(): Object;
        setMetadata(metadata: Object): void;
        getRole(): string;
        setRole(role: string): void;
        getStatus(): string;
        setStatus(status: string): void;
        getStatusMessage(): string;
        setStatusMessage(statusMessage: string): void;
        setBlockedByMe(blockedByMe: boolean): void;
        getBlockedByMe(): boolean;
        setHasBlockedMe(hasBlockedMe: boolean): void;
        getHasBlockedMe(): boolean;
        setTags(tags: Array<String>): void;
        getTags(): Array<String>;
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
        setConversationWith(conversationWith: User | Group): void;
        setUnreadMessageCount(unreadMessageCount: number): void;
        getConversationId(): string;
        getConversationType(): string;
        getLastMessage(): TextMessage | MediaMessage | CustomMessage | any;
        getConversationWith(): User | Group;
        getUnreadMessageCount(): number;
        constructor(conversationId: string, conversationType: string, lastMessage: TextMessage | MediaMessage | CustomMessage | any, conversationWith: User | Group, unreadMessageCount: number | any)
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
        constructor(receiverId: string, file: object | string, type: string, receiverType: string);
        setCaption(text: string): void;
        getCaption(): string;
        getSender(): User;
        getReceiver(): User | Group;
        getMetadata(): Object;
        setMetadata(metadata: Object): void;
        getData(): Object;
        setData(value: Object): void;
        getAttachment(): Attachment;
        setAttachment(attachment: Attachment): void;
        getURL(): string;
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
        protected conversationId?: string;
        protected parentMessageId?: string;
        protected muid?: string;
        protected sender?: Me | any;
        protected receiverId?: string;
        protected receiver?: User | Group;
        protected type?: string;
        protected category?: string;
        protected receiverType?: string;
        protected sentAt?: number;
        protected deliveredAt?: number;
        protected readAt?: number;
        protected deliveredToMeAt?: number;
        protected readByMeAt?: number;
        protected metadata: Object;
        protected status?: string;
        protected receipts?: any[];
        protected readReceipts?: MessageReceipt[];
        protected deliveryReceipts?: MessageReceipt[];
        protected editedAt: number;
        protected editedBy: string;
        protected deletedAt: number;
        protected deletedBy: string;
        protected replyCount: number;
        protected rawMessage: Object;
        constructor(receiverId: string, messageType: string, receiverType: string, category: string);
        getId(): number;
        setId(value: number): void;
        getConversationId(): string;
        setConversationId(value: string): void;
        getParentMessageId(): number;
        setParentMessageId(value: number): void;
        getMuid(): string;
        setMuid(value: string): void;
        getSender(): User;
        setSender(value: User): void;
        getReceiver(): User | Group;
        setReceiver(value: User | Group): void;
        getReceiverId(): string;
        setReceiverId(value: string): void;
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
        getDeliveredToMeAt(): number;
        setDeliveredToMeAt?(deliveredToMeAt: number): void;
        getReadAt?(): number;
        setReadAt?(readAt: number): void;
        getReadByMeAt?(): number;
        setReadByMeAt?(readByMeAt: number): void;
        getCategory(): string;
        setCategory(category: string): void;
        setEditedAt(editedAt: number): void;
        getEditedAt(): number;
        setEditedBy(editedBy: string): void;
        getEditedBy(): void;
        setDeletedAt(deletedAt: number): void;
        getDeletedAt(): number;
        setDeletedBy(deletedBy: string): void;
        getDeletedBy(): string;
        setReplyCount(replyCount: number): void;
        getReplyCount(): number;
        setRawMessage(rawMessage: Object): void;
        getRawMessage(): Object;
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
        constructor(receiverId: string, text: string, receiverType: string);
        getSender(): User;
        getReceiver(): User | Group;
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
        CONVERSATION_MAX_LIMIT: number;
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
        ws_url: string;
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
        KEYS_STORE: string;
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
            KEY_ENTITYTYPE: string;
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
            RECEIVER_ID: string;
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
                HIDE_MESSAGES_FROM_BLOCKED_USER: string;
                SEARCH_KEY: string;
                ONLY_UPDATES: string;
                UPDATED_AT: string;
                CATEGORY: string;
                TYPE: string;
                HIDE_REPLIES: string;
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
            MEMBER_ADDED: string;
            MEMBER_JOINED: string;
            MEMBER_LEFT: string;
            MEMBER_KICKED: string;
            MEMBER_BANNED: string;
            MEMBER_UNBANNED: string;
            MEMBER_INVITED: string;
            MEMBER_SCOPE_CHANGED: string;
            MESSAGE_EDITED: string;
            MESSSAGE_DELETED: string;
            TYPE_USER: string;
            TYPE_GROUP: string;
            TYPE_GROUP_MEMBER: string;
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
        CALL_MODE: {
            DEFAULT: string,
            SPOTLIGHT: string,
            SINGLE: string,
        };
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
            NAME: string;
        };
    };
    export const UserConstants: {
        UID: string;
        NAME: string;
        AUTH_TOKEN: string;
        AVATAR: string;
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
        INVALID_MEDIA_FILE: {
            code: string;
            name: string;
            message: string;
            details: {};
        };
        EMPTY_STRING: {
            code: string;
            name: string;
            message: string;
            details: {};
        };
        MISSING_KEY: {
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

    export const CONNECTION_STATUS: {
        CONNECTED: string;
        CONNECTING: string;
        DISCONNECTED: string;
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
        getMetadata(): Object;
        setMetadata(metadata: Object): void;
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
        getMembersCount(): number;
        setMembersCount(membersCount: number): void;
        getTags(): Array<String>;
        setTags(tags: Array<String>): void;
    }

    export class ConnectionListener {
        onConnected?: Function;
        inConnecting?: Function;
        onDisconnected?: Function;
        constructor(...args: any[]);
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
        onTransientMessageReceived?: Function;
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
        onUserListUpdated?: Function;
        onMediaDeviceListUpdated?: Function;
        onRecordingStarted?: Function;
        onRecordingStopped?: Function;
        onUserMuted?: Function;
        constructor(...args: any[]);
    }
    export class LoginListener {
        loginSuccess?: Function;
        loginFailure?: Function;
        logoutFailure?: Function;
        logoutSuccess?: Function;
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
        constructor(receiverId: any, type: any, receiverType: any, category?: any);
        getCallInitiator(): User;
        getCallReceiver(): Group | User;
        setCallInitiator(user: any): void;
        setCallReceiver(user: any): void;
        getData(): object;
        setData(data: object): void;
        getSessionId(): string;
        setSessionId(sessionId: string): void;
        getMetadata(): Object;
        getSender(): User;
        setMetadata(metadata: Object): void;
        getAction(): string;
        setAction(action: string): void;
        getInitiatedAt(): number;
        setInitiatedAt(initiatedAt: number): void;
        getJoinedAt(): number;
        setJoinedAt(joinedAt: number): void;
        setRawData(rawData: any): void;
        getRawData(): any;
        setSender(sender: any): void;
        setReceiver(receiver: any): void;
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
        initiateCall(call: Call): Promise<Call>;
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
        onCallStarted(call: Call): Promise<Call>;
        endCallSession(): void;
        startCall(callSettings: CallSettings, view: HTMLElement): void;
        getAudioInputDevices(): MediaDevice[];
        getAudioOutputDevices(): MediaDevice[];
        getVideoInputDevices(): MediaDevice[];
        setAudioInputDevice(deviceId: string): void;
        setAudioOutputDevice(deviceId: string): void;
        setVideoInputDevice(deviceId: string): void;
        muteAudio(mute: boolean): void;
        pauseVideo(pause: boolean): void;
        setMode(mode: string): void;
        stopScreenShare(): void;
        startScreenShare(): void;
        startRecording(): void;
        stopRecording(): void;
        endSession(): void;
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
        getActionFor(): User | Group | BaseMessage | any;
        getMetadata(): Object;
        setMetadata(metadata: Object): void;
    }

    export class GroupsRequest {
        constructor(builder?: GroupsRequestBuilder);
        fetchPrevious(): Promise<Group[] | []>;
        fetchNext(): Promise<Group[] | []>;
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
        withTags(withTags: boolean): this;
        setTags(tags: Array<String>): this;
        build(): GroupsRequest;
    }

    export class BannedMembersRequest {
        constructor(builder?: BannedMembersRequestBuilder);
        fetchPrevious(): Promise<GroupMember[] | []>;
        fetchNext(): Promise<GroupMember[] | []>;
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
        setLimit(limit: number): this;
        setSearchKeyword(searchKeyword: string): this;
        build(): BannedMembersRequest;
    }

    export class GroupMembersRequest {
        constructor(builder?: GroupMembersRequestBuilder | GroupOutCastMembersRequestBuilder);
        fetchPrevious(): Promise<GroupMember[] | []>;
        fetchNext(): Promise<GroupMember[] | []>;
        getNextData(): any;
        getPreData(): any;
    }

    export class GroupMembersRequestBuilder {
        constructor(guid: string);
        limit: number;
        searchKeyword: string;
        guid: string;
        scopes?: Array<String>;
        setLimit(limit: number): this;
        setSearchKeyword(searchKeyword: string): this;
        setScopes(scopes: Array<String>): this;
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
        fetchPrevious(): Promise<User[] | []>;
        fetchNext(): Promise<User[] | []>;
        getNextData(): any;
        getPreData(): any;
    }
    export class UsersRequestBuilder {
        limit: number;
        status: string;
        searchKeyword: string;
        shouldHideBlockedUsers: boolean;
        role: string;
        roles: Array<String>;
        tags: Array<String>;
        showFriendsOnly: boolean;
        showTags: boolean;
        UIDs: Array<String>;
        setLimit(limit: number): this;
        setStatus(status: string): this;
        setSearchKeyword(searchKeyword: string): this;
        hideBlockedUsers(hideBlockedUsers: boolean): this;
        setRole(role: string): this;
        setRoles(roles: Array<String>): this;
        friendsOnly(friendsOnly: boolean): this;
        setTags(tags: Array<String>): this;
        withTags(withTags: boolean): this;
        setUIDs(uids: Array<String>): this;
        build(): UsersRequest;
    }

    export class ConversationsRequest {
        constructor(builder?: ConversationsRequestBuilder);
        fetchNext(): Promise<Conversation[] | []>;
        getNextData(): any;
    }
    export class ConversationsRequestBuilder {
        conversationType: string;
        limit: number;
        setLimit(limit: number): this;
        setConversationType(conversationType: string): this;
        withUserAndGroupTags(getUserAndGroupTags: boolean): this;
        build(): ConversationsRequest;
    }

    export class CallSettings {
        constructor(builder?: CallSettingsBuilder);
        getSessionId(): string;
        isAudioOnlyCall(): boolean;
        isDefaultLayoutEnabled(): boolean;
        getMode(): string;
        isEndCallButtonEnabled(): boolean;
        isScreenShareButtonEnabled(): boolean;
        isModeButtonEnabled(): boolean;
        isMuteAudioButtonEnabled(): boolean;
        isPauseVideoButtonEnabled(): boolean;
        getLocalizedStringObject(): Object;
        getStartWithAudioMuted(): boolean;
        getStartWithVideoMuted(): boolean;
        getCustomCSS(): string;
        isRecordingButtonEnabled(): boolean;
        shouldStartRecordingOnCallStart(): boolean
    }

    export class CallSettingsBuilder {
        sessionID: string;
        defaultLayout: boolean;
        isAudioOnly: boolean;
        mode: string;
        ShowEndCallButton: boolean;
        ShowMuteAudioButton: boolean;
        ShowPauseVideoButton: boolean;
        ShowScreenShareButton: boolean;
        ShowSwitchModeButton: boolean;
        localizedObject: Object;
        StartAudioMuted: boolean;
        StartVideoMuted: boolean;
        ShowRecordingButton: boolean;
        StartRecordingOnCallStart: boolean;
        customCSS: string;

        setSessionID(sessionID: string): this;
        enableDefaultLayout(defaultLayout: boolean): this;
        setIsAudioOnlyCall(isAudioOnly: boolean): this;
        setMode(mode: string): this;
        showEndCallButton(showEndCallButton: boolean): this;
        showMuteAudioButton(showMuteAudioButton: boolean): this;
        showPauseVideoButton(showPauseVideoButton: boolean): this;
        showScreenShareButton(ShowScreenShareButton: boolean): this;
        showModeButton(showModeButton: boolean): this;
        setLocalizedStringObject(localizedStringObject: Object): this;
        startWithAudioMuted(audioMuted: boolean): this;
        startWithVideoMuted(videoMuted: boolean): this;
        setCustomCSS(customCSS: string): this;
        showRecordingButton(showRecordingButton: boolean): this;
        startRecordingOnCallStart(startRecordingOnCallStart: boolean): this;
        build(): CallSettings;
    }

    export class MediaDevice {
        constructor(id, name, active);
        getId(): string;
        getName(): string;
        getIsActive(): boolean;
    }

    export class CometChatHelper {
        static getConversationFromMessage(message: TextMessage | MediaMessage | CustomMessage | any): Promise<Conversation>;
        static processMessage(message: Object): Promise<TextMessage | MediaMessage | CustomMessage | BaseMessage>;
    }

    export class MessagesRequest {
        constructor(builder?: MessagesRequestBuilder);
        fetchNext(): Promise<BaseMessage[] | []>;
        fetchPrevious(): Promise<BaseMessage[] | []>;
    }
    export class MessagesRequestBuilder {
        limit?: number;
        maxLimit: number;
        uid?: string;
        guid?: string;
        parentMessageId?: number;
        timestamp?: number;
        id?: number;
        unread?: boolean;
        HideMessagesFromBlockedUsers?: boolean;
        searchKey?: string;
        updatedAt?: string;
        onlyUpdate?: number;
        category?: string;
        categories?: Array<String>;
        type?: string;
        types?: Array<String>;
        hideThreadedMessages?: boolean;
        HideDeletedMessages?: boolean;
        setLimit(limit: number): this;
        setGUID(guid: string): this;
        setUID(uid: string): this;
        setParentMessageId(parentMessageId: number): this
        setTimestamp(timestamp?: number): this;
        setMessageId(id?: number): this;
        setUnread(unread?: boolean): this;
        hideMessagesFromBlockedUsers(hideMessagesFromBlockedUsers?: boolean): this;
        setSearchKeyword(searchKey: string): this;
        setUpdatedAfter(updatedAt: string): this;
        updatesOnly(onlyUpdate: boolean): this;
        setCategory(category: string): this;
        setCategories(categories: Array<String>): this;
        setType(type: string): this;
        setTypes(types: Array<String>): this;
        hideReplies(hideReplies: boolean): this;
        hideDeletedMessages(hideDeletedMessages: boolean): this;
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
        getMetadata(): Object;
        setMetadata(meta: Object): void;
        getSender(): User;
        setSender(sender: User): void;
    }

    export class TransientMessage {
        constructor(receiverId: string, receiverType: string, data: any);
        getReceiverId(): string;
        setReceiverId(receiverId: string): void;
        getReceiverType(): string;
        setReceiverType(receiverType: string): void;
        getData(): any;
        setData(data: any): void;
        getSender(): User;
        setSender(sender: User): void;
    }

    export class CustomMessage extends BaseMessage implements Message {
        constructor(...args: any[]);
        getCustomData(): Object;
        setCustomData(customData: Object): void;
        getSender(): User;
        getReceiver(): User | Group;
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
        getLastActiveAt(): number;
        setLastActiveAt(lastActiveAt: number): void;
        getLink(): string;
        setLink(link: string): void;
        getMetadata(): Object;
        setMetadata(metadata: Object): void;
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
        fetchPrevious(): Promise<User[] | []>;
        fetchNext(): Promise<User[] | []>;
        getNextData(): any;
        getPreData(): any;
    }
    export class BlockedUsersRequestBuilder {
        limit: number;
        searchKeyword: string;
        direction: string;
        setLimit(limit: number): this;
        setSearchKeyword(searchKeyword: string): this;
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
        enableAutoJoinForGroups(isAutoJoinEnabled: boolean): this;
        build(): AppSettings;
    }

    export class CCExtension {
        constructor(extension: any);
        getId(): string;
        getName(): string;
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
        toJSON(attachment: Attachment): Object;
        getExtension(): string;
        setExtension(extension: string): void;
        getMimeType(): string;
        setMimeType(mimeType: string): void;
        getName(): string;
        setName(name: string): void;
        getSize(): number;
        setSize(size: number): void;
        getUrl(): string;
        setUrl(url: string): void;
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
        getReadAt(): number;
        setReadAt(readAt: number): void;
        setDeliveredAt(deliveredAt: number): void;
        getDeliveredAt(): number;
        getMessageId(): string;
        setMessageId(messageId: string): void;
        getReceiptType(): string;
        setReceiptType(receiptType?: string): void;
    }

}
