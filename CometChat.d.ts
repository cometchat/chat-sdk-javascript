export namespace CometChat {
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
        let CATEGORY_CUSTOM: string;
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
        let SORT_BY: {
            NAME: string;
            STATUS: string;
        }
        let SORT_ORDER: {
            ASCENDING: string;
            DESCENDING: string;
        }

        let appSettings: AppSettings;

        /**
            * Getter for appId.
            * @internal
            * @returns
            * @memberof CometChat
         */
        export function getAppId(): string;
        
        /**
            * Getter for apiKey.
            * @internal
            * @returns
            * @memberof CometChat
         */
        export function getApiKey(): string;
        
        /**------------------------------------*
        * Core apis     					   *
        *-------------------------------------**/
        
        /**
            * Initialize the CometChat app with appId & Object of AppSettings Class.
            * @param {string} appId
            * @param {AppSettings} appSettings
            * @returns {CometChat}
            * @memberof CometChat
         */
        export function init(appId: any, appSettings: AppSettings): Promise<boolean>;
        
        /**
            * Function to check whether CometChat class initialized before.
            * @returns {boolean}
            * @memberof CometChat
         */
        export function isInitialized(): boolean;
        
        /**
            * Function to register the FCM token for Push Notification.
            * @param {string} token
            * @param {JSON Object} Settings
            * @returns {Promise<string>}
            * @memberof CometChat
         */
        export function registerTokenForPushNotification(token: string, settings?: {}): Promise<string>;
        
        /**
            * Login funtion will authenticate user provided as an argument. There are two ways to login:
            * 1. using UID and authKey (unsecure way)
            * 2. using authToken (secure way)
            * @param {...string[]} args
            * @returns {User | CometChatException}
            * @memberof CometChat
            */
        export function login(...args: any): Promise<User>;

        /**-------------------------------------------------------------------*
        *    Message related functions provided by CometChat class            *
        *--------------------------------------------------------------------**/
        /**
            * Function to send message.
            * @param {TextMessage | MediaMessage | CustomMessage | any} message
            * @returns {Message | any}
            * @memberof CometChat
        */
        export function sendMessage(message: TextMessage | MediaMessage | CustomMessage | any): Promise<TextMessage | MediaMessage | CustomMessage | BaseMessage>;
        
        /**
            * Function to send a message to user.
            * @internal
            * @param {*} message Object
            * @returns
            * @memberof CometChat
        */
        export function sendDirectMessage(message: Object): Promise<TextMessage | BaseMessage | MediaMessage | CustomMessage>;
        
        /**
            * Function to send a message to group.
            * @internal
            * @param {*} message
            * @returns
            * @memberof CometChat
        */
        export function sendGroupMessage(message: any): Promise<TextMessage | BaseMessage | MediaMessage | CustomMessage>;
        
        /**
            * Function to send a media message.
            * @param {MediaMessage} message
            * @returns {Message | any}
            * @memberof CometChat
         */
        export function sendMediaMessage(message: Object): Promise<TextMessage | BaseMessage | MediaMessage | CustomMessage>;
        
        /**
            * Function to send a custom message.
            * @param {CustomMessage} message
            * @returns {Message | any}
            * @memberof CometChat
         */
        export function sendCustomMessage(message: CustomMessage): Promise<TextMessage | BaseMessage | MediaMessage | CustomMessage>;
        
        /**
            * Function to get the last delivered message id from local storage.
            * @returns {any}
            * @memberof CometChat
         */
        export function getLastDeliveredMessageId(): Promise<any>;
        
        /**
            * Function to send start typing notification to the provided uid/ guid.
            * @param {TypingIndicator | any} typingNotification
            * @memberof CometChat
         */
        export function startTyping(typingNotification: TypingIndicator | any): void;
        
        /**
            * Function to send stop typing notification to the provided uid/ guid.
            * @param {TypingIndicator | any} typingNotification
            * @memberof CometChat
         */
        export function endTyping(typingNotification: TypingIndicator | any): void;
        
        /**
            * Mark all messages upto a specified message id as read. There are two ways markAsRead works:
            * 1. message
            * 2. messageID, receiverID, receiverType, senderID
            * @param {...string[]} args
            * @memberof CometChat
         */
        export function markAsRead(...args: any): any;
        
        /**
            * Mark all messages upto a specified message id as delivered. There are two ways markAsDelivered works:
            * 1. message
            * 2. messageID, receiverID, receiverType, senderID
            * @param {...string[]} args
            * @memberof CometChat
         */
        export function markAsDelivered(...args: any): any;
        
        /**
            * Send a transient message.
            * @param {string} uid
            * @param {string} receiverType
            * @memberof CometChat
            */
        export function sendTransientMessage(transientMessage: TransientMessage): void;
        
        /**
            * Triggers the onTextMessageReceived event.
            * @internal
            * @param {any} message
            * @memberof CometChat
            */
        export function sendTestMessage(message: any): Promise<void>;
        
        /**
            * Function to fetch message details for the provided messageID.
            * @param {string | any} messageId
            * @returns {Message | any}
            * @memberof CometChat
         */
        export function getMessageDetails(messageId: string | any): Promise<TextMessage | MediaMessage | CustomMessage | BaseMessage>;
        
        /**
            * Function to fetch message receipt details for the provided messageID.
            * @param {string | any} messageId
            * @returns {MessageReceipt[]}
            * @memberof CometChat
         */
        export function getMessageReceipts(messageId: string | any): Promise<Object>;
        
        /**
            * Function to fetch unread message count.
            * @param {boolean} doHideMessages
            * @returns {Object}
            * @memberof CometChat
         */
        export function getUnreadMessageCount(doHideMessages?: boolean): Promise<Object>;
        
        /**
            * Function to fetch unread message count for all users.
            * @param {boolean} doHideMessages
            * @returns {Object}
            * @memberof CometChat
         */
        export function getUnreadMessageCountForAllUsers(doHideMessages?: boolean): Promise<Object>;
        
        /**
            * Function to fetch unread message count for all groups.
            * @param {boolean} doHideMessages
            * @returns {Object}
            * @memberof CometChat
         */
        export function getUnreadMessageCountForAllGroups(doHideMessages?: boolean): Promise<Object>;
        
        /**
            * Function to fetch unread message count for a particular UID.
            * @param {string} UID
            * @param {boolean} doHideMessages
            * @returns {Object}
            * @memberof CometChat
         */
        export function getUnreadMessageCountForUser(UID: string, doHideMessages?: boolean): Promise<Object>;
        
        /**
            * Function to fetch unread message count for a particular GUID.
            * @param {string} GUID
            * @param {boolean} doHideMessages
            * @returns {Object}
            * @memberof CometChat
         */
        export function getUnreadMessageCountForGroup(GUID: string, doHideMessages?: boolean): Promise<Object>;
        
        /**
            * Funtion to edit a message.
            * @param {BaseMessage} message
            * @returns {Promise<BaseMessage>}
            * @memberof CometChat
         */
        export function editMessage(message: BaseMessage): Promise<BaseMessage>;
        
        /**
            * Funtion to delete a message.
            * @param {string} messageId
            * @returns {Promise<BaseMessage>}
            * @memberof CometChat
         */
        export function deleteMessage(messageId: string): Promise<BaseMessage>;
        
        /**---------------------------------------------------------------------------------------*
        * Online User/Group Member count related functions provided by CometChat class           *
        *----------------------------------------------------------------------------------------**/
        
        /**
            * This function will return online user count.
            * @returns {Promise<number>}
            * @memberof CometChat
            */
        export function getOnlineUserCount(): Promise<number>;
        
        /**
            * This function will return online group members count for given GUIDs.
            * @param {String[]} groups
            * @returns {Promise<number>}
            * @memberof CometChat
            */
        export function getOnlineGroupMemberCount(groups: String[]): Promise<Object>;

        /**-------------------------------------------------------------------*
        * User related functions provided by CometChat class                  *
        *--------------------------------------------------------------------**/
        
        /**
            * Function to create a user.
            * @param {User | any} user
            * @param {string} apiKey
            * @returns {Promise<User>}
            * @memberof CometChat
         */
        export function createUser(user: User | any, apiKey: string): Promise<User>;
        
        /**
            *
            * Function to update the already existing user and returns the result with updated user.
            * @param {User | any} user
            * @param {string} apiKey
            * @returns {Promise<User>}
            * @memberof CometChat
         */
        export function updateUser(user: User | any, apiKey: string): Promise<User>;
        
        /**
            *
            * Function to update the logged-in user and returns the result with updated user
            * @param {User} user
            * @returns Promise<User>
            * @memberof CometChat
            */
        export function updateCurrentUserDetails(user: User | any): Promise<User>;
        
        /**
            * Function to get the information for the uid provided as an argument
            * @param {string} uid
            * @returns {Promise<User>}
            * @memberof CometChat
         */
        export function getUser(uid: any): Promise<User>;
        
        /**
            *
            * This function will return logged in user from local storage.
            * @returns {Promise<User | null>}
            * @memberof CometChat
         */
        export function getLoggedinUser(): Promise<User | null>;
        
        /**
            * Function to block users.
            * @param {String[]} blockedUids
            * @returns
            * @memberof CometChat
         */
        export function blockUsers(blockedUids: String[]): Promise<Object>;
        
        /**
            * Function to unblock users.
            * @param {String[]} blockedUids
            * @returns
            * @memberof CometChat
         */
        export function unblockUsers(blockedUids: String[]): Promise<Object>;

        /**-------------------------------------------------------------------*
        * Conversation related functions provided by CometChat class         *
        *--------------------------------------------------------------------**/

        /**
            * Function to fetch conversation for a specific user/group.
            * @param {string} conversationWith
            * @param {string} conversationType
            * @returns {Promise<Conversation>}
            * @memberof CometChat
         */
        export function getConversation(conversationWith: string, conversationType: string): Promise<Conversation>;

        /**
         * Function to tag a conversation for a specific user/group.
         * @param {string} conversationWith
         * @param {string} conversationType
         * @param {Array<String>} tags
         * @returns {Promise<Conversation>}
         * @memberof CometChat
        */
        export function tagConversation(conversationWith: string, conversationType: string, tags: Array<String>): Promise<Conversation>;
        
        /**
            * function to delete conversation for a specific user/group.
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
            * Function to create a group.
            * @param {Group} group
            * @returns {Promise<Group>}
            * @memberof CometChat
         */
        export function createGroup(group: Group | any): Promise<Group>;
        
        /**
            * Function to fetch details of a group.
            * @param {string | Object} guid
            * @returns {Promise<Group>}
            * @memberof CometChat
         */
        export function getGroup(guid: string | Object): Promise<Group>;
        
        /**
            * Function to join a public group.
            * @param {guid} guid
            * @param {GroupType} type
            * @param {string} password
            * @returns {Promise<Group>}
            * @memberof CometChat
         */
        export function joinGroup(grp: any, type?: GroupType, password?: string): Promise<Group>;
        
        /**
            * Function to update a group.
            * @param {Group} group
            * @returns {Promise<Group>}
            * @memberof CometChat
         */
        export function updateGroup(group: any): Promise<Group>;
        
        /**
            * Function to delete a group.
            * @param {string} guid
            * @returns {Promise<boolean>}
            * @memberof CometChat
         */
        export function deleteGroup(guid: string): Promise<boolean>;
        
        /**
            * Function to leave a group.
            * @param {string} guid
            * @returns {Promise}
            * @memberof CometChat
         */
        export function leaveGroup(guid: string): Promise<boolean>;
        
        /**
            * Function to kick a member from a group.
            * @param {string} guid
            * @param {string} uid
            * @returns {Promise<boolean>}
            * @memberof CometChat
         */
        export function kickGroupMember(guid: string, uid: string): Promise<boolean>;
        
        /**
            * Function to change the scope of a member in a group.
            * @param {string} guid
            * @param {string} uid
            * @param {GroupMemberScope} scope
            * @returns {Promise<boolean>}
            * @memberof CometChat
         */
        export function updateGroupMemberScope(guid: string, uid: string, scope: GroupMemberScope): Promise<boolean>;
        
        /**
            * Function to ban a group member from a group.
            * @param {string} guid
            * @param {string} uid
            * @returns {Promise<boolean>}
            * @memberof CometChat
         */
        export function banGroupMember(guid: string, uid: string): Promise<boolean>;
        /**
            * Function to unban a group member from a group.
            * @param {string} guid
            * @param {string} uid
            * @returns {Promise<boolean>}
            * @memberof CometChat
         */
        export function unbanGroupMember(guid: string, uid: string): Promise<boolean>;
        
        /**
            * Function to add members in a group. This function can also be used to ban a group member from a group.
            * @param {string} guid
            * @param {Array<GroupMember>} groupMembers
            * @param {Array<String>} bannedMembersList
            * @returns {Promise<Object>}
            * @memberof CometChat
         */
        export function addMembersToGroup(guid: string, groupMembers: Array<GroupMember>, bannedMembersList: Array<string>): Promise<Object>;
        
        /**
            *
            * Function to transfer ownership of a group.
            * @param {string} guid
            * @param {string} uid
            * @returns {Promise<string>}
            * @memberof CometChat
         */
        export function transferGroupOwnership(guid: string, uid: string): Promise<string>;

        /**
         * Function to create a group and add/ban members in/from that group.
         * @param {Group} group
         * @param {Array<GroupMember>} members
         * @param {Array<String>} banMembers
         * @returns {Promise<Object>}
         * @memberof CometChat
        */
        export function createGroupWithMembers(group: Group, members: Array<GroupMember>, banMembers: Array<string>): Promise<Object>;

        /**-------------------------------------------------------------------*
        * Call related functions provided by CometChat class                 *
        *--------------------------------------------------------------------**/
        
        /**
            * Function to initiate a user/group call.
            * @param {Call} call
            * @returns {Promise<Call>}
            * @memberof CometChat
         */
        export function initiateCall(call: Call | any): Promise<Call>;
        
        /**
            * Function to accept an incoming user/group call.
            * @param {string} sessionid
            * @returns {Promise<Call>}
            * @memberof CometChat
         */
        export function acceptCall(sessionid: string): Promise<Call>;
        
        /**
            * Function to reject an incoming call or cancel an outgoing call.
            * @param {string} sessionId
            * @param {string} status
            * @returns {Promise<Call>}
            * @memberof CometChat
         */
        export function rejectCall(sessionId: string, status: any): Promise<Call>;
        
        /**
            * Function to end an ongoing call.
            * @param {string} sessionid
            * @param {boolean} isInternal - Optional
            * @returns {Promise<Call>}
            * @memberof CometChat
         */
        export function endCall(sessionid: string, isInternal?: boolean): Promise<Call>;
        
        /**
            * Function to get the active call.
            * @returns {Call}
            * @memberof CometChat
         */
        export function getActiveCall(): Call;
        
        /**
            * Function to start a call.
            * @param {CallSettings | string} callSettings
            * @param {HTMLElement} view
            * @param {UserCallEventListener} callEventHandler
            * @memberof CometChat
         */
        export function startCall(callSettings: CallSettings | string, view: HTMLElement, ongoingCallListener?: OngoingCallListener): void;
        
        /**
            * Function to fetch participant count of an ongoing call.
            * @param {string} sessionId
            * @param {string} type
            * @returns {Promise<number>}
            * @memberof CometChat
         */
        export function getCallParticipantCount(sessionId: string, type: string): Promise<number>;
        
        /**-------------------------------------------------------------------------------------------------------*
        * Events listeners setting and removing	.																  *
        *--------------------------------------------------------------------------------------------------------**/
        
        /**
            * Function to add a Connection Listner.
            * @param {string} name
            * @param {ConnectionListener} connectionListener
            * @memberof CometChat
         */
        export function addConnectionListener(name: string, connectionListener: ConnectionListener): void;
        
        /**
            * Function to remove a Connection Listner.
            * @param {string} name
            * @memberof CometChat
         */
        export function removeConnectionListener(name: string): void;
        
        /**
            * Function to add a Message Listner.
            * @param {string} name
            * @param {MessageListener} messageListener
            * @memberof CometChat
         */
        export function addMessageListener(name: string, messageListener: MessageListener): void;
        
        /**
            * Function to remove a Message Listner.
            * @param {string} name
            * @memberof CometChat
         */
        export function removeMessageListener(name: string): void;
        
        /**
            *
            * Function to add a Call Listener.
            * @param {string} name
            * @param {CallListener} callListener
            * @memberof CometChat
         */
        export function addCallListener(name: string, callListener: CallListener): void;
        
        /**
            * Function to remove a Call Listener.
            * @param {string} name
            * @memberof CometChat
         */
        export function removeCallListener(name: string): void;
        
        /**
            * Function to add a User Listener.
            * @param {string} name
            * @param {UserListener} userListener
            * @memberof CometChat
         */
        export function addUserListener(name: string, userListener: UserListener): void;
       
        /**
            * Function to remove a User Listener.
            * @param {string} name
            * @memberof CometChat
         */
        export function removeUserListener(name: string): void;
        
        /**
            * Function to add a Group Listener.
            * @param {string} name
            * @param {GroupListener} groupListener
            * @memberof CometChat
         */
        export function addGroupListener(name: string, groupListener: GroupListener): void;
        
        /**
            *
            * Function to remove a Group Listener.
            * @param {string} name
            * @memberof CometChat
         */
        export function removeGroupListener(name: string): void;
        
        /**
            * Function to add a Login Listener.
            *
            * @param {string} name
            * @param {LoginListener} loginListener
            * @memberof CometChat
         */
        export function addLoginListener(name: string, loginListener: LoginListener): void;
        
        /**
            * Function to remove a Login Listener.
            *
            * @param {string} name
            * @memberof CometChat
         */
        export function removeLoginListener(name: string): void;
        
        /**
            * Get the current connection status
            * @returns {string}
            * @memberof CometChat
         */
        export function getConnectionStatus(): string;
        
        /**
            * Returns a boolean value which indicates if the extension is enabled or not.
            * @param {string} extensionId
            * @returns {Promise<boolean>}
            * @memberof CometChat
         */
        export function isExtensionEnabled(extensionId: string): Promise<boolean>;
        
        /**
            * Returns an object of CCExtension Class which has the details of the extension.
            *
            * @param {string} extensionId
            * @returns  {Promise<CCExtension>}
            * @memberof CometChat
         */
        export function getExtensionDetails(extensionId: string): Promise<CCExtension>;
        
        /**
            * Get the XMPP/ WEBRTC details from the servers
            * @internal
            * @returns {Promise<Object>}
            * @memberof CometChat
         */
        export function getAppSettings(): Promise<Object>;
        
        /**
            * Returns a boolean value which indicates if a feature is enabled or not for the current plan.
            * @param {string} feature
            * @returns {Promise<boolean>}
            * @memberof CometChat
         */
        export function isFeatureEnabled(feature: string): Promise<boolean>;
        
        /**
            * Clears the authtoken from server and clears the local cache.
            * @returns {Promise<Object>}
            * @memberof CometChat
         */
        export function logout(): Promise<Object>;
        
        /**
            * Function to call extension API.
            * @param {string} slug
            * @param {string} method
            * @param {string} endpoint
            * @param {Object} data
            * @returns {Promise<Object>}
            * @memberof CometChat
         */
        export function callExtension(slug: string, method: string, endpoint: string, data?: Object): Promise<Object>;
        
        /**
            * Function to set resource, platform and language variable.
            * @param {string} resource
            * @param {string} platform
            * @param {string} language
            * @memberof CometChat
         */
        export function setSource(resource: string, platform: string, language: string): void;
        
        /**
            *
            * Method to connect to WebSocket server.
            *
            * @static
            * @returns void
            * @memberof CometChat
         */
        export function connect(): void;
        
        /**
            *
            * Method to disconnect from WebSocket server.
            *
            * @static
            * @returns void
            * @memberof CometChat
         */
        export function disconnect(): void;


/**
  *
  * @module CometChatException
  * @implements {ErrorModel}
  */
export class CometChatException implements ErrorModel {
    code?: string | number;
    name?: string;
    message?: string;
    details?: string;
    constructor(errorModel: ErrorModel);
}

/** @private */
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
        tags: Array<string>;
        deactivatedAt: number;
}
/**
    * Implementation of UserObject
    */
export class User {
        /**
            * Method to get UID of the user.
            * @returns {string}
         */
        getUid(): string;
        /**
            * Method to set UID of the user.
            * @param {string} uid
         */
        setUid(uid: string): void;
        /**
            * Method to get name of the user.
            * @returns {string}
         */
        getName(): string;
        /**
            * Method to set name of the user.
            * @param {string} name
         */
        setName(name: string): void;
        /**
            * Method to get authToken of the user.
            * @returns {string}
         */
        getAuthToken(): string;
        /**
            * Method to set authToken of the user.
            * @param {string} authToken
         */
        setAuthToken(authToken: string): void;
        /**
            * Method to get avatar of the user.
            * @returns {string}
         */
        getAvatar(): string;
        /**
            * Method to set avatar of the user.
            * @param {string} avatar
         */
        setAvatar(avatar: string): void;
        /**
            * Method to get last active at timestamp of the user.
            * @returns {number}
         */
        getLastActiveAt(): number;
        /**
            * Method to set last active at timestamp of the user.
            * @param {number} lastActiveAt
         */
        setLastActiveAt(lastActiveAt: number): void;
        /**
            * Method to get link of the user.
            * @returns {string}
         */
        getLink(): string;
        /**
            * Method to set link of the user.
            * @param {string} link
         */
        setLink(link: string): string;
        /**
            * Method to get metadata of the user.
            * @returns {string}
         */
        getMetadata(): string;
        /**
            * Method to set metadata of the user.
            * @param {string} metadata
         */
        setMetadata(metadata: string): void;
        /**
            * Method to get role of the user.
            * @returns {string}
         */
        getRole(): string;
        /**
            * Method to set role of the user.
            * @param {string} role
         */
        setRole(role: string): void;
        /**
            * Method to get status of the user.
            * @returns {string}
         */
        getStatus(): string;
        /**
            * Method to set status of the user.
            * @param {string} status
         */
        setStatus(status: string): void;
        /**
            * Method to get status message of the user.
            * @returns {string}
         */
        getStatusMessage(): string;
        /**
            * Method to set status message of the user.
            * @param {string} statusMessage
         */
        setStatusMessage(statusMessage: string): void;
        setBlockedByMe(blockedByMe: boolean): void;
        /**
            * Method to know if the logged-in user has blocked the other user.
            * @returns {boolean}
         */
        getBlockedByMe(): boolean;
        setHasBlockedMe(hasBlockedMe: boolean): void;
        /**
            * Method to know if the logged-in user has been blocked by the other user.
            * @returns {boolean}
         */
        getHasBlockedMe(): boolean;
        /**
            * Method to set tags of the user.
            * @param {string[]} tags
            */
        setTags(tags: Array<string>): void;
        /**
            * Method to get tags of the user.
            * @returns {string[]}
         */
        getTags(): Array<string>;
        /**
         * Method to set deactivatedAt timestamp of a user.
         * @param {number} deactivatedAt 
        */
        setDeactivatedAt(deactivatedAt: number): void;
        /**
         * Method to get deactivatedAt timestamp of a user.
         * @returns {number}
        */
        getDeactivatedAt(): number;
        constructor(...userObj: any[]);
}

/**
    *
    * @module MediaMessage
    */
export class MediaMessage extends BaseMessage implements Message {
        /** @private */ static readonly TYPE: {
                TEXT: string;
                MEDIA: string;
                IMAGE: string;
                VIDEO: string;
                AUDIO: string;
                FILE: string;
                CUSTOM: string;
        };
        /** @private */ static readonly RECEIVER_TYPE: {
                USER: string;
                GROUP: string;
        };
        /** @private */ static readonly CATEGORY: {
                MESSAGE: string;
                ACTION: string;
                CALL: string;
                CUSTOM: string;
        };
        private url;
        private file;
        private files;
        private _metaData;
        protected data?: any;
        private attachment;
        private caption;
        private tags?: Array<String>;
        constructor(receiverId: string, file: object | string | Array<object> | any, type: string, receiverType: string);
        /**
            * Method to set caption for the media message.
            * @param {string} text
         */
        setCaption(text: string): void;
        /**
            * Method to get caption of the media message.
            * @returns {string}
         */
        getCaption(): string;
        /**
            * Method to get sender of the message.
            * @returns {User}
         */
        getSender(): User;
        /**
            * Method to get receiver of the message.
            * @returns {User | Group}
         */
        getReceiver(): User | Group;
        /**
            * Method to get metadata of the message.
            * @returns {Object}
         */
        getMetadata(): Object;
        /**
            * Method to set metadata of the message.
            * @param {Object} metadata
         */
        setMetadata(metadata: Object): void;
        /**
            * Method to get data of the message.
            * @returns {Object}
         */
        getData(): Object;
        /**
            * Method to set data of the message.
            * @param {Object} value
         */
        setData(value: Object): void;
        /**
            * Method to get attachment of media message.
            * @returns {Attachment}
         */
        getAttachment(): Attachment;
        /**
            * Method to set attachment of media message.
            * @param {Attachment} attachment
         */
        setAttachment(attachment: Attachment): void;
        /**
         * Method to get all the attachments of media message.
         * @returns {Array<Attachment>}
        */
        getAttachments(): Array<Attachment>;
        /**
         * Method to set multiple attachments of media message.
         * @param {Array<Attachment>} attachments
        */
        setAttachments(attachments: Array<Attachment>): void;
        /**
            * Method to get URL of the media file.
            * @returns {string}
         */
        getURL(): string;
        /**
         * Get the tags of the message.
         * @returns {Array<String>}
         */
        getTags(): Array<String>;
         /**
          * @param {Array<String>} tags
          * Set the tags for the message.
          */
        setTags(tags: Array<String>): void;
}

/**
    *
    * @module BaseMessage
    */
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
        protected parentMessageId?: number;
        protected muid?: string;
        protected sender?: User;
        protected receiverId?: string;
        protected receiver?: User | Group;
        protected type?: string;
        protected category?: MessageCategory;
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
        constructor(receiverId: string, messageType: string, receiverType: string, category: MessageCategory);
        /**
            * Get ID of the message
            * @returns {number}
         */
        getId(): number;
        /**
            * @param {number} value
            * Set ID of the message
         */
        setId(value: number): void;
        /**
            * Get conversation ID of the message.
            * @returns {string}
         */
        getConversationId(): string;
        /**
            * @param {string} value
            * Set conversation ID of the message.
         */
        setConversationId(value: string): void;
        /**
            * Get parent message ID of the message.
            * @returns {number}
         */
        getParentMessageId(): number;
        /**
            * @param {number} value
            * Set parent message ID of the message.
         */
        setParentMessageId(value: number): void;
        /**
            * Get MUID of the message.
            * @returns {string}
         */
        getMuid(): string;
        /**
            * @param {string} value
            * Sets the MUID of the message.
         */
        setMuid(value: string): void;
        /**
            * Get sender of the message.
            * @returns {User}
         */
        getSender(): User;
        /**
            * @param {User} value
            * Set sender of the message.
         */
        setSender(value: User): void;
        /**
            * Get receiver of the message.
            * @returns {User | Group}
         */
        getReceiver(): User | Group;
        /**
            * @param {User | Group} value
            * Set receiver of the message.
         */
        setReceiver(value: User | Group): void;
        /**
            * Get receiverID of the message.
            * @returns {string}
         */
        getReceiverId(): string;
        /**
            * @param {string} value
            * Set receiverId of the message.
         */
        setReceiverId(value: string): void;
        /**
            * Get type of the message.
            * @returns {string}
         */
        getType(): string;
        /**
            * @param {string} value
            * Set type of the message.
         */
        setType(value: string): void;
        /**
            * Get receiver type of the message.
            * @returns {string}
         */
        getReceiverType(): string;
        /**
            * @param {string} value
            * Set the receiver type of the message.
         */
        setReceiverType(value: string): void;
        /**
            * Get message's sentAt timestamp.
            * @returns {number}
         */
        getSentAt(): number;
        /**
            * @param {number} value
            * Set message's sentAt timestamp.
         */
        setSentAt(value: number): void;
        /** @private */
        getStatus(): string;
        /** @private */
        setStatus(value: string): void;
        /**
            * Get delivery timestamp of the message.
            * @returns {number}
         */
        getDeliveredAt(): number;
        /**
            * @param {number} deliveredAt
            * Set delivery timestamp of the message.
         */
        setDeliveredAt(deliveredAt: number): void;
        /**
            * Get timestamp of the message at which it was delivered to logged in user.
            * @returns {number}
         */
        getDeliveredToMeAt(): number;
        /**
            * @param {number} deliveredToMeAt
            * Set timestamp of the message at which it was delivered to logged in user.
         */
        setDeliveredToMeAt(deliveredToMeAt: number): void;
        /**
            * Get read timestamp of the message.
            * @returns {number}
            */
        getReadAt(): number;
        /**
            * @param {number} readAt
            * Set read timestamp of the message.
         */
        setReadAt(readAt: number): void;
        /**
            * Get timestamp of the message at which it was read by the logged in user.
            * @returns {number}
         */
        getReadByMeAt(): number;
        /**
            * @param {number} readByMeAt
            * Set timestamp of the message at which it was read by the logged in user.
         */
        setReadByMeAt(readByMeAt: number): void;
        /**
            * Get category of the message.
            * @returns {string}
         */
        getCategory(): MessageCategory;
        /**
            * @param {string} category
            * Set category of the message.
         */
        setCategory(category: MessageCategory): void;
        /**
            * Get timestamp of the message when it was updated/edited.
            * @returns {number}
         */
        getEditedAt(): number;
        /**
            * @param {number} editedAt
            * Set timestamp of the message when it was updated/edited.
         */
        setEditedAt(editedAt: number): void;
        /**
            * Get UID of the user who edited/updated the message.
            * @returns {string}
         */
        getEditedBy(): string;
        /**
            * @param {string} editedBy
            * Set UID of the user who edited/updated the message.
         */
        setEditedBy(editedBy: string): void;
        /**
            * Get timestamp of the message when it was deleted.
            * @returns {number}
         */
        getDeletedAt(): number;
        /**
            * @param {number} deletedAt
            * Set timestamp of the message when it was deleted.
         */
        setDeletedAt(deletedAt: number): void;
        /**
            * Get UID of the user who deleted the message.
            * @returns {number}
         */
        getDeletedBy(): string;
        /**
            * @param {string} deletedBy
            * Set UID of the user who deleted the message.
         */
        setDeletedBy(deletedBy: string): void;
        /**
            * Get the number of replies of the message.
            * @returns {number}
            */
        getReplyCount(): number;
        /**
            * @param {number} value
            * Set the number of replies of the message.
         */
        setReplyCount(value: number): void;
        /**
            * Get the raw JSON of the message.
            * @returns
            */
        getRawMessage(): Object;
        /**
            * @param {Object} rawMessage
            * Set the raw JSON of the message.
         */
        setRawMessage(rawMessage: Object): void;
}

/**
    *
    * @module TextMessage
    */
export class TextMessage extends BaseMessage implements Message {
        /** @private */ static readonly TYPE: string;
        /** @private */ static readonly RECEIVER_TYPE: {
                USER: string;
                GROUP: string;
        };
        /** @private */ static readonly CATEGORY: string;
        private text?;
        private data?;
        private processedText?;
        private tags?;
        /**
            *Creates an instance of TextMessage.
            * @param {string} receiverUid
            * @param {string} text
            * @param {string} senderUid
            * @param {string} receiverType
            * @memberof TextMessage
            */
        constructor(receiverId: string, text: string, receiverType: string);
        /**
            * Method to get sender of the message.
            * @returns {User}
         */
        getSender(): User;
        /**
            * Method to get receiver of the message.
            * @returns {User | Group}
         */
        getReceiver(): User | Group;
        /**
            * Method to get metadata of the message.
            * @returns {Object}
         */
        getMetadata(): Object;
        /**
            * Method to set metadata of the message.
            * @param {Object} value
         */
        setMetadata(value: Object): void;
        /**
            * Method to get data of the message.
            * @returns {Object}
         */
        getData(): any;
        /**
            * Method to set data of the message.
            * @param {Object} value
         */
        setData(value: string): void;
        /**
            * Method to get text of the message.
            * @returns {string}
         */
        getText(): string;
        /**
            * Method to set text of the message.
            * @param {string} text
         */
        setText(text: string): void;
        /** @internal */
        setProcessedText(text: string): void;
        /** @internal */
        getProcessedText(): string;
        /**
         * Get the tags of the message.
         * @returns {Array<String>}
         */
        getTags(): Array<String>;
         /**
          * @param {Array<String>} tags
          * Set the tags for the message.
          */
        setTags(tags: Array<String>): void;
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
export const CALLING_COMPONENT_VERSION = 5;
export enum GroupType {
    Public = "public",
    Private = "private",
    Protected = "protected",
    Password = "password"
}
export const GROUP_TYPE: {
    PUBLIC: string;
    PRIVATE: string;
    PROTECTED: string;
    PASSWORD: string;
};
export enum GroupMemberScope {
    Admin = "admin",
    Moderator = "moderator",
    Member = "member"
}
export const GROUP_MEMBER_SCOPE: {
    ADMIN: string;
    MODERATOR: string;
    PARTICIPANT: string;
};
export const APPINFO: {
    platform: string;
    sdkVersion: string;
    apiVersion: string;
    sdkVersionWithUnderScore: string;
};
export const SDKHeader: {
    platform: string;
    sdkVersion: string;
    sdk: string;
};
export const WS: {
    CONVERSATION: {
        TYPE: {
            CHAT: string;
            GROUP_CHAT: string;
        };
    };
};
export const ANALYTICS: {
    analyticsHost: string;
    analyticsVersion: string;
};
export const LOCAL_STORE: {
    COMMON_STORE: string;
    MESSAGE_LISTENERS_LIST: string;
    USERS_STORE: string;
    MESSAGES_STORE: string;
    KEYS_STORE: string;
    STORE_STRING: string;
    KEY_STRING: string;
    KEY_USER: string;
    KEY_APP_SETTINGS: string;
    KEY_APP_ID: string;
    KEY_DEVICE_ID: string;
    KEY_MESSAGE_LISTENER_LIST: string;
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
        KEY_ENTITY_TYPE: {
            USER: string;
            GROUP: string;
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
        RESOURCE: string;
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
            CATEGORIES: string;
            TYPE: string;
            TYPES: string;
            HIDE_REPLIES: string;
            HIDE_DELETED_MESSAGES: string;
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
    CALL = "call",
    CUSTOM = "custom"
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
        DEFAULT: string;
        SPOTLIGHT: string;
        SINGLE: string;
        TILE: string;
        GRID: string;
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
    AUDIO_INPUT_DEVICES: string;
    AUDIO_OUTPUT_DEVICES: string;
    VIDEO_INPUT_DEVICES: string;
    POST_MESSAGES: {
        TYPES: {
            ACTION_MESSAGE: string;
            HANGUP: string;
            COMETCHAT_RTC_SETTINGS: string;
        };
        ACTIONS: {
            USER_JOINED: string;
            USER_LEFT: string;
            USER_LIST_CHANGED: string;
            INITIAL_DEVICE_LIST: string;
            DEVICE_CHANGE: string;
            LOAD: string;
            CHANGE_AUDIO_INPUT: string;
            CHANGE_AUDIO_OUTPUT: string;
            CHANGE_VIDEO_INPUT: string;
            MUTE_AUDIO: string;
            UNMUTE_AUDIO: string;
            PAUSE_VIDEO: string;
            UNPAUSE_VIDEO: string;
            SWITCH_MODE: string;
            START_SCREENSHARE: string;
            STOP_SCREENSHARE: string;
            END_CALL: string;
            START_RECORDING: string;
            STOP_RECORDING: string;
            RECORDING_TOGGLED: string;
            USER_MUTED: string;
            SCREEN_SHARE_STARTED: string;
            SCREEN_SHARE_STOPPED: string;
        };
    };
    MEDIA_DEVICE: {
        ID: string;
        NAME: string;
        ACTIVE: string;
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
        TAGS: string;
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
    TAGS: string;
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
    ERR_SETTINGS_HASH_OUTDATED: string;
    ERR_NO_AUTH: string;
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
    CANNOT_ACCEPT_CALL: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    NOT_INITIALIZED: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    NOT_LOGGED_IN: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    SESSION_ID_REQUIRED: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    CALL_SETTINGS_REQUIRED: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    JWT_NOT_FOUND: {
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
    METHOD_COMPULSORY: {
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
    EMPTY_ARRAY: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    INVALID_SEARCH_KEYWORD: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    INVALID_GROUP_PROPERTY: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    INVALID_USER_PROPERTY: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    PARAMETER_MUST_BE_A_NUMBER: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    PARAMETER_MUST_BE_AN_ARRAY: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    PARAMETER_MUST_BE_A_BOOLEAN: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    PARAMETER_MUST_BE_A_POSITIVE_NUMBER: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    PARAMETER_MUST_BE_A_STRING: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    PARAMETER_COMPULSORY: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    PASSWORD_COMPULSORY: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    INVALID_ARRAY: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
};
export const ReceiptErrors: {
    MISSING_PARAMETERS: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    INVALID_PARAMETER: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    NO_WEBSOCKET_CONNECTION: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    RECEIPTS_TEMPORARILY_BLOCKED: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    UNKNOWN_ERROR_OCCURRED: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
};
export const UserErrors: {
    INVALID_STATUS: CometChatException;
    INVALID_DIRECTION: CometChatException;
    USER_NOT_LOGGED_IN: CometChatException;
};
export const GroupErrors: {
    NOT_A_GROUP: CometChatException;
    INVALID_SCOPE: CometChatException;
    INVALID_GROUP_TYPE: CometChatException;
};
export const ConversationErrors: {
    INVALID_CONVERSATION_TYPE: {
        code: string;
        name: string;
        message: string;
        details: string;
    };
    CONVERSATION_NOT_FOUND: {
        code: string;
        name: string;
        message: string;
        details: string;
    };
};
export const ExtensionErrors: {
    INVALID_EXTENSION: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    EXTENSION_NOT_FOUND: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
};
export const MessageErrors: {
    INVALID_RECEIVER_TYPE: {
        code: string;
        name: string;
        message: string;
        details: string;
    };
};
export const FeatureRestrictionErrors: {
    INVALID_FEATURE: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
    FEATURE_NOT_FOUND: {
        code: string;
        name: string;
        message: string;
        details: {};
    };
};
export const PresenceConstatnts: {
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
        JID_HOST_OVERRIDE: string;
        CHAT_HOST_OVERRIDE: string;
        CHAT_HOST_APP_SPECIFIC: string;
        MODE: string;
        CONNECTION_TYPE: string;
        DEFAULT_MODE: string;
        LIMITED_TRANSIENT: string;
        NO_TRANSIENT: string;
        ANALYTICS_PING_DISABLED: string;
        ANALYTICS_HOST: string;
        ANALYTICS_VERSION: string;
        ANALYTICS_USE_SSL: string;
        SETTINGS_HASH: string;
        SETTINGS_HASH_RECEIVED_AT: string;
        APP_VERSION: string;
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
    FEATURE_THROTTLED: string;
};
export const SESSION_STORE: {
    SESSION_ID: string;
};
export const API_ERROR_CODES: {
    AUTH_ERR_AUTH_TOKEN_NOT_FOUND: string;
};
export const PROSODY_API: {
    DOMAIN_PREFIX: string;
    PATH: {
        ROOM: string;
        ROOM_SIZE: string;
        SESSIONS: string;
    };
    RESPONSE: {
        PARTICIPANTS: string;
    };
    QUERY_PARAMETERS: {
        DOMAIN: string;
        ROOM: string;
    };
};
export const ProsodyApiErrors: {
    INVALID_SESSIONID: {
        code: string;
        name: string;
        message: string;
        details: string;
    };
    INVALID_TYPE: {
        code: string;
        name: string;
        message: string;
        details: string;
    };
};
export const JWT_API: {
    KEYS: {
        PASSTHROUGH: string;
        EXPAND: string;
    };
};
export const ONLINE_MEMBER_COUNT_API: {
    ENDPOINTS: {
        GET_ONLINE_MEMBER_COUNT: string;
    };
    RESPONSE: {
        ONLINE_USERS_COUNT: string;
        GROUPS: string;
    };
    ERRORS: {
        INVALID_GROUPLIST: {
            code: string;
            name: string;
            message: string;
            details: string;
        };
    };
};

/**
    *
    * @module Group
    */
export class Group {
        /** @private */ static readonly TYPE: typeof GroupType;
        /** @private */ static readonly Type: typeof GroupType;
        private guid;
        private name;
        private type;
        private password;
        private icon;
        private description;
        private owner;
        private metadata;
        private createdAt;
        private updatedAt;
        private hasJoined;
        private wsChannel;
        private scope;
        private joinedAt;
        private membersCount;
        private tags;
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
        constructor(guid: string, name?: string, type?: GroupType | string, passsword?: string, icon?: string, description?: string, hasJoined?: boolean);
        /**
            * Method to get GUID of the group.
            * @returns {string}
         */
        getGuid(): string;
        /**
            * Method to set GUID of the group.
            * @param {string} guid
         */
        setGuid(guid: string): void;
        /**
            * Method to get name of the group.
            * @returns {string}
         */
        getName(): string;
        /**
            * Method to set name of the group.
            * @param {string} name
         */
        setName(name: string): void;
        /**
            * Method to get the type of the group.
            * @returns {GroupType | string}
         */
        getType(): GroupType | string;
        /**
            * Method to set the type of the group.
            * @param {GroupType | string} type
         */
        setType(type: GroupType | string): void;
        /**
            * Method to get password of the group.
            * @returns {string}
         */
        getPassword(): string;
        /**
            * Method to set password of the group.
            * @param {string} password
         */
        setPassword(password: string): void;
        /**
            * Method to get icon of the group.
            * @returns {string}
         */
        getIcon(): string;
        /**
            * Method to set icon of the group.
            * @param {string} icon
         */
        setIcon(icon: string): void;
        /**
            * Method to get description of the group.
            * @returns {string}
         */
        getDescription(): string;
        /**
            * Method to set description of the group.
            * @param {string} description
         */
        setDescription(description: string): void;
        /**
            * Method to get owner of the group.
            * @returns {string}
         */
        getOwner(): string;
        /**
            * Method to set owner of the group.
            * @param {string} owner
         */
        setOwner(owner: string): void;
        /**
            * Method to get metadata of the group.
            * @returns {string}
         */
        getMetadata(): string;
        /**
            * Method to set metadata of the group.
            * @param {string} metadata
         */
        setMetadata(metadata: string): void;
        /**
            * Method to get the created at timestamp of the group.
            * @returns {number}
         */
        getCreatedAt(): number;
        /**
            * Method to set the created at timestamp of the group.
            * @param {number} createdAt
         */
        setCreatedAt(createdAt: number): void;
        /**
            * Method to get the updated at timestamp of the group.
            * @returns {number}
         */
        getUpdatedAt(): number;
        /**
            * Method to set updated at timestamp of the group.
            * @param {number} updatedAt
         */
        setUpdatedAt(updatedAt: number): void;
        /**
            * Method to get the joinedAt of the group.
            * @returns {boolean}
         */
        getHasJoined(): boolean;
        /**
            * Method to set the joinedAt of the group.
            * @param {boolean} hasJoined
         */
        setHasJoined(hasJoined: boolean): void;
        /** @private */
        getWsChannel(): any;
        /** @private */
        setWsChannel(wsChannel: any): void;
        /**
            * Method to set scope of the logged-in user in the group.
            * @param {string} scope
         */
        setScope(scope: string): void;
        /**
            * Method to get scope of the logged-in user.
            * @returns {string}
         */
        getScope(): string;
        /**
            * Method to get joinedAt timestamp of the logged-in user.
            * @returns {string}
         */
        getJoinedAt(): string;
        /**
            * Method to set joinedAt timestamp of the logged-in user in the group.
            * @param {string} joinedAt
         */
        setJoinedAt(joinedAt: string): void;
        /**
            * Method to get members count of the group.
            * @returns {number}
         */
        getMembersCount(): number;
        /**
            * Method to set members count of the group.
            * @param {number} membersCount
         */
        setMembersCount(membersCount: number): void;
        /**
            * Method to set tags of the group.
            * @param {string[]} tags
         */
        setTags(tags: Array<String>): void;
        /**
            * Method to get tags of the group.
            * @returns {string[]}
         */
        getTags(): Array<String>;
}

export class MessageListener {
        /**
            * This event is triggered when a text message is received.
         */
        onTextMessageReceived?: Function;
        /**
            * This event is triggered when a media message is received.
         */
        onMediaMessageReceived?: Function;
        /**
            * This event is triggered when a custom message is received.
         */
        onCustomMessageReceived?: Function;
        /**
            * This event is triggered when someone start typing.
         */
        onTypingStarted?: Function;
        /**
            * This event is triggered when someone stops typing.
         */
        onTypingEnded?: Function;
        /**
            * This event is triggered when a message is delivered.
         */
        onMessagesDelivered?: Function;
        /**
            * This event is triggered when a message is read.
         */
        onMessagesRead?: Function;
        /**
            * This event is triggered when a message is edited.
         */
        onMessageEdited?: Function;
        /**
            * This event is triggered when a message is deleted.
         */
        onMessageDeleted?: Function;
        /**
            * This event is triggered when a transient message is received.
         */
        onTransientMessageReceived?: Function;
        constructor(...args: any[]);
}
export class CallListener {
        /**
            * This event is triggered when an incoming call is received.
         */
        onIncomingCallReceived?: Function;
        /**
            * This event is triggered when an outgoing call is accepted.
         */
        onOutgoingCallAccepted?: Function;
        /**
            * This event is triggered when an outgoing call is rejected.
         */
        onOutgoingCallRejected?: Function;
        /**
            * This event is triggered when an incoming call is cancelled.
         */
        onIncomingCallCancelled?: Function;
        /**
         * This event is triggered when call is ended.
        */
        onCallEndedMessageReceived?: Function;
        constructor(...args: any[]);
}
export class UserListener {
        /**
            * This event is triggered when a user comes online.
         */
        onUserOnline?: Function;
        /**
            * This event is triggered when a user goes offline.
         */
        onUserOffline?: Function;
        constructor(...args: any[]);
}
export class GroupListener {
        /**
            * This event is triggered when a user joins a group.
         */
        onGroupMemberJoined?: Function;
        /**
            * This event is triggered when a group member leaves the group.
         */
        onGroupMemberLeft?: Function;
        /**
            * This event is triggered when a group member is kicked from the group.
         */
        onGroupMemberKicked?: Function;
        /**
            * This event is triggered when a group member is banned from the group.
         */
        onGroupMemberBanned?: Function;
        /**
            * This event is triggered when a group member is unbanned from the group.
         */
        onGroupMemberUnbanned?: Function;
        /**
            * This event is triggered when scope of a group member is changed.
         */
        onGroupMemberScopeChanged?: Function;
        /**
            * This event is triggered when a user is added in the group.
         */
        onGroupMemberAddedToGroup: Function;
        constructor(...args: any[]);
}
export class OngoingCallListener {
        /**
            * @internal
         */
        onYouLeft?: Function;
        /**
            * @internal
         */
        onYouJoined?: Function;
        /**
            * This event is triggered when a user joins the call.
         */
        onUserJoined?: Function;
        /**
            * This event is triggered when a user leaves the call.
         */
        onUserLeft?: Function;
        /**
            * This event is triggered when the participant list of the call changes.
         */
        onUserListUpdated?: Function;
        /**
            * This event is triggered when the media device list changes.
         */
        onMediaDeviceListUpdated?: Function;
        /**
            * This event is triggered when someone starts recording the call.
         */
        onRecordingStarted?: Function;
        /**
            * This event is triggered when someone stops recording the call.
         */
        onRecordingStopped?: Function;
        /**
            * This event is triggered when someone starts sharing their screen in the call.
         */
        onScreenShareStarted?: Function;
        /**
            * This event is triggered when someone stops sharing their screen in the call.
         */
        onScreenShareStopped?: Function;
        /**
            * This event is triggered when a user is muted.
         */
        onUserMuted?: Function;
        /**
            * This event is triggered when the call is ended.
         */
        onCallEnded?: Function;
        /**
            * This event is triggered when an error occurs.
         */
        onError?: Function;
        /**
         * This event is triggered when an audio call is switched to a video call.
        */
        onCallSwitchedToVideo?: Function;
        constructor(...args: any[]);
}
export class LoginListener {
        /**
            * This event is triggered when the user login is successful.
         */
        loginSuccess?: Function;
        /**
            * This event is triggered when the user login fails.
         */
        loginFailure?: Function;
        /**
            * This event is triggered when the user logout is successful.
         */
        logoutSuccess?: Function;
        /**
            * This event is triggered when the user logout fails.
         */
        logoutFailure?: Function;
        constructor(...args: any[]);
}
export class ConnectionListener {
        /**
            * This event is triggered when the WebSocket connection is in connected state.
         */
        onConnected?: Function;
        /**
            * This event is triggered when the WebSocket connection is in connecting state.
         */
        inConnecting?: Function;
        /**
            * This event is triggered when the WebSocket connection is in disconnected state.
         */
        onDisconnected?: Function;
        /**
            * This event is triggered when the WebSocket connection is in feature throttled state.
         */
        onFeatureThrottled?: Function;
        constructor(...args: any[]);
}
/** @internal */
export interface EventListener {
        _name: string;
        _eventListener?: MessageListener | UserListener | OngoingCallListener | CallListener | GroupListener | LoginListener | ConnectionListener;
}
/** @internal */
export class Listener implements EventListener {
        _name: string;
        _callback: Function;
        constructor(name: string, callback: Function);
}

/** @internal */
export class UserCallListener extends Listener implements EventListener {
    _cursor?: number;
    _eventListener: OngoingCallListener;
    constructor(callEventHandler?: OngoingCallListener, cursor?: number, callback?: Function);
}

/**
    *
    * @module Call
    */
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
        /**
            * @memberof {@link CometChat | CometChat }
            * @param receiverId
            * @param type
            * @param receiverType
            * @param category
         */
        constructor(receiverId: any, type: any, receiverType: any, category?: any);
        /**
            * Get call initiator entity(User)
            * @returns {User}
         */
        getCallInitiator(): User;
        /**
            * @param {User} user
            * Set details of the call initiator.
         */
        setCallInitiator(user: User): void;
        /**
            * Get call receiver entity(User/Group)
            * @returns {User | Group}
         */
        getCallReceiver(): Group | User;
        /**
            * @param {User | Group} receiver
            * Set details of the call receiver.
         */
        setCallReceiver(receiver: User | Group): void;
        /** @internal */
        getData(): object;
        /** @internal */
        setData(data: object): void;
        /**
            * Get unique session id of the call message.
            * @returns {string}
         */
        getSessionId(): string;
        /**
            * @param {string} sessionId
            * Set unique session id of the call message.
         */
        setSessionId(sessionId: string): void;
        /**
            * Get JSONObject of data set by developer.
            * @returns
            */
        getMetadata(): any;
        /**
            * @param {any} metadata
            * Set metadata of the call message.
         */
        setMetadata(metadata: any): void;
        /**
            * Get sender of the message.
            * @returns {User}
         */
        getSender(): User;
        /**
            * Get action of call.
            * @returns {string}
         */
        getAction(): string;
        /**
            * @param {string} action
            * Set action of call.
         */
        setAction(action: string): void;
        /**
            * Get call initiated timestamp.
            * @returns {number}
            */
        getInitiatedAt(): number;
        /**
            * @param {number} initiatedAt
            * Set call initiated timestamp.
         */
        setInitiatedAt(initiatedAt: number): void;
        /**
            * Get call join timestamp.
            * @returns {number}
            */
        getJoinedAt(): number;
        /**
            * @param {number} joinedAt
            * Set call join timestamp.
         */
        setJoinedAt(joinedAt: number): void;
        /**
            * Get raw JSON data of the call message.
            * @returns {any}
         */
        getRawData(): any;
        /**
            * @param {any} rawData
            * Set raw JSON data of the call message.
         */
        setRawData(rawData: any): void;
        /**
            * @internal
            * @param {string} receiverUid
            * @param {string} text
            * @param {string} senderUid
            * @param {string} receiverType
            * @memberof Actions
            */
        static callFromJSON(rawMessage: any): Call | Message;
}

export class CallController {
        static getInstance(): CallController;

        /**
            * Method to get all the available audio input devices.
            * @returns {MediaDevice[]}
        */
        getAudioInputDevices(): MediaDevice[];
        
        /**
            * Method to get all the available audio output devices.
            * @returns {MediaDevice[]}
        */
        getAudioOutputDevices(): MediaDevice[];
        
        /**
            * Method to get all the available video input devices.
            * @returns {MediaDevice[]}
        */
        getVideoInputDevices(): MediaDevice[];
        
        /**
            * Method to change the audio input devices.
            * @param {string} deviceId
            * @returns {MediaDevice[]}
        */
        setAudioInputDevice(deviceId: string): void;
        
        /**
            * Method to change the audio output devices.
            * @param {string} deviceId
            * @returns {MediaDevice[]}
        */
        setAudioOutputDevice(deviceId: string): void;
        
        /**
            * Method to change the video input devices.
            * @param {string} deviceId
            * @returns {MediaDevice[]}
        */
        setVideoInputDevice(deviceId: string): void;
        
        /**
            * Method to mute/unmute audio stream.
            * @param {boolean} muteAudio
        */
        muteAudio(muteAudio: boolean): void;
        
        /**
            * Method to pause/unpause video stream.
            * @param {boolean} pauseVideo
        */
        pauseVideo(pauseVideo: boolean): void;
        
        /**
            * Method to set mode.
            * @param mode
        */
        setMode(mode: any): void;
        
        /**
            * Method to start screen share.
        */
        startScreenShare(): void;
        
        /**
            * Method to stop screen share.
        */
        stopScreenShare(): void;
        
        /**
            * Method to start call recording.
        */
        startRecording(): void;
        
        /**
            * Method to stop call recording.
        */
        stopRecording(): void;

        /**
         * Method to switch an audio call to video call.
        */
        switchToVideoCall(): void;

         /**
          * Method to open the virtual background settings.
         */
        openVirtualBackground(): void;
 
         /**
          * Method to set the background blur. This method takes number as input which decides the blur level of the background.
         */
        setBackgroundBlur(blurLevel: number): void;
 
         /**
          * Method to set the background image. This method takes either a URL or file Object & sets that image as the background.
         */
        setBackgroundImage(image: string | Object): void;
}

/**
    *
    * @module Action
    */
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
            * @internal
         */
        static actionFromJSON(rawMessage: any): Action | Message;
        /**
            * Method to get old scope of a member.
            * @returns {string}
         */
        getOldScope(): string;
        /**
            * @param {string} oldScope
            * Method to set old scope of a member.
         */
        setOldScope(oldScope: string): void;
        /**
            * Method to get new scope of a member.
            * @returns {string}
         */
        getNewScope(): string;
        /**
            * @param {string} newScope
            * Method to set new scope of a member.
         */
        setNewScope(newScope: string): void;
        /**
            * Method to get raw JSON data in string.
            * @returns {string}
         */
        getRawData(): any;
        /**
            * @param {any} rawData
            * Method to set raw JSON data.
         */
        setRawData(rawData: any): void;
        /**
            * Method to get the default action message.
            * @returns {string}
         */
        getMessage(): string;
        /**
            * @param {string} message
            * Method to set the default action message.
         */
        setMessage(message: string): void;
        /**
            * Method to get the action which is being performed.
            * @returns {string}
         */
        getAction(): string;
        /**
            * @param {string} action
            * Method to set the default action message.
         */
        setAction(action: string): void;
        /**
            * Method to get the sender of the action message.
            * @returns {string}
         */
        getSender(): User;
        /**
            * Method to get the entity which performed the action.
            * @returns {User | Group | BaseMessage}
         */
        getActionBy(): User | Group | BaseMessage;
        /**
            * @param {User | Group | BaseMessage} by
            * Method to set the entity which performed the action.
         */
        setActionBy(by: User | Group | BaseMessage): void;
        /**
            * Method to get the entity on which the action was performed.
            * @returns {User | Group | BaseMessage}
         */
        getActionOn(): User | Group | BaseMessage;
        /**
            * @param {User | Group | BaseMessage} on
            * Method to set the entity on which the action was performed.
         */
        setActionOn(on: User | Group | BaseMessage): void;
        /**
            * Method to get the entity for whom the action was performed.
            * @returns {User | Group | BaseMessage | any}
         */
        getActionFor(): User | Group | BaseMessage | any;
        /**
            * @param {User | Group | BaseMessage} for
            * Method to set the entity for whom the action was performed.
         */
        setActionFor(actionFor: User | Group | BaseMessage): void;
        /**
            * Method to get the metadata of the action message.
            * @returns {any}
         */
        getMetadata(): any;
        /**
            * @param {any} metadata
            * Method to get the metadata of the action message.
         */
        setMetadata(metadata: any): void;
}

export class GroupsRequest {
        constructor(builder?: GroupsRequestBuilder);
        /**
            * Get list of next set of groups based on the parameters specified in GroupsRequestBuilder class The Developer need to call this method repeatedly using the same object of GroupsRequest class to get paginated list of groups.
            * @returns {Promise<Group[] | []>}
         */
        fetchNext(): Promise<Group[] | []>;
}
export class GroupsRequestBuilder {
        /** @private */ limit: number;
        /** @private */ searchKeyword: string;
        /** @private */ hasJoined: boolean;
        /** @private */ tags: Array<String>;
        /** @private */ showTags: boolean;
        /**
            *
            * @param {number} limit
            * A method to set limit for the number of Groups returned in a single iteration. A maximum of 100 groups can fetched in a single iteration.
            * @returns
         */
        setLimit(limit: number): this;
        /**
            *
            * @param {string} searchKeyword
            * A method to set the search string based on which the groups are to be fetched.
            * @returns
         */
        setSearchKeyword(searchKeyword: string): this;
        /**
            * A method to fetch only joined groups.
            * @param {boolean} hasJoined
            * @returns
            */
        joinedOnly(hasJoined: boolean): this;
        /**
            *
            * @param {string[]} tags
            * A method to set the tags based on which the groups are to be fetched.
            * @returns
         */
        setTags(tags: Array<String>): this;
        /**
            *
            * @param {boolean} withTags
            * A method to get the tags along with the other details of the groups.
            * @returns
         */
        withTags(withTags: boolean): this;
        /**
            * This method will return an object of the GroupsRequest class.
            * @returns {GroupsRequest}
         */
        build(): GroupsRequest;
}

export class GroupMembersRequest {
        constructor(builder: GroupMembersRequestBuilder);
        /**
            * Get list of next set of group members based on the parameters specified in GroupMembersRequestBuilder class. The Developer need to call this method repeatedly using the same object of GroupMembersRequest class to get paginated list of group members.
            * @returns {Promise<GroupMember[] | []>}
         */
        fetchNext(): Promise<GroupMember[] | []>;
}
export class GroupMembersRequestBuilder {
        /** @private */ limit: number;
        /** @private */ searchKeyword: string;
        /** @private */ guid: string;
        /** @private */ scopes?: Array<String>;
        constructor(guid: string);
        /**
            *
            * @param {number} limit
            * A method to set limit for the number of group members returned in a single iteration. A maximum of 100 group members can fetched in a single iteration.
            * @returns
         */
        setLimit(limit: number): this;
        /**
            *
            * @param {string} searchKeyword
            * A method to set the search string based on which the group members are to be fetched.
            * @returns
         */
        setSearchKeyword(searchKeyword: string): this;
        /**
            *
            * @param {string[]} scopes
            * A method to set the search group members based on their scope.
            * @returns
         */
        setScopes(scopes: Array<String>): this;
        /**
            * This method will return an object of the GroupMembersRequest class.
            * @returns {GroupMembersRequest}
         */
        build(): GroupMembersRequest;
}

export class BannedMembersRequest {
        constructor(builder: BannedMembersRequestBuilder);
        /**
            * Get list of next set of banned members based on the parameters specified in BannedMembersRequestBuilder class. The Developer need to call this method repeatedly using the same object of BannedMembersRequest class to get paginated list of banned members.
            * @returns {Promise<GroupMember[] | []>}
         */
        fetchNext(): Promise<GroupMember[] | []>;
}
export class BannedMembersRequestBuilder {
        /** @private */ limit: number;
        /** @private */ searchKeyword: string;
        /** @private */ guid: string;
        /** @private */ scopes?: Array<String>;
        constructor(guid: string);
        /**
            *
            * @param {number} limit
            * A method to set limit for the number of banned members returned in a single iteration. A maximum of 100 banned members can fetched in a single iteration.
            * @returns
         */
        setLimit(limit: number): this;
        /**
            *
            * @param {string} searchKeyword
            * A method to set the search string based on which the banned members are to be fetched.
            * @returns
         */
        setSearchKeyword(searchKeyword: string): this;
        /**
            *
            * @param {string[]} scopes
            * A method to set the search banned members based on their scope.
            * @returns
         */
        setScopes(scopes: Array<String>): this;
        /**
            * This method will return an object of the BannedMembersRequest class.
            * @returns {BannedMembersRequest}
         */
        build(): BannedMembersRequest;
}

export class UsersRequest {
        static USER_STATUS: {
                ONLINE: string;
                OFFLINE: string;
        };
        constructor(builder?: UsersRequestBuilder);
        /**
            * Get list of next set of users based on the parameters specified in UsersRequestBuilder class The Developer need to call this method repeatedly using the same object of UsersRequestBuilder class to get paginated list of users.
            * @returns {Promise<User[] | []>}
         */
        fetchNext(): Promise<User[] | []>;
}
export class UsersRequestBuilder {
        /** @private */ limit: number;
        /** @private */ status: string;
        /** @private */ searchKeyword: string;
        /** @private */ shouldHideBlockedUsers: boolean;
        /** @private */ role: string;
        /** @private */ roles: Array<String>;
        /** @private */ tags: Array<String>;
        /** @private */ showFriendsOnly: boolean;
        /** @private */ showTags: boolean;
        /** @private */ UIDs: Array<String>;
        /** @private */ SortBy: string;
        /** @private */ SortOrder: string;
        /** @private */ SearchIn: Array<String>;
        
        /**
            * A method to set limit for the number of Users returned in a single iteration. A maximum of 100 users can fetched in a single iteration.
            * @param {number} limit
            * @returns
         */
        setLimit(limit: number): this;
        /**
            * A method to get the users belonging to a specific status.
            * @param {string} status
            * @returns
         */
        setStatus(status: string): this;
        /**
            * A method to set the search string based on which the users are to be fetched.
            * @param {string} searchKeyword
            * @returns
         */
        setSearchKeyword(searchKeyword: string): this;
        /**
            * Method to hide blocked users.
            * @param {boolean} hideBlockedUsers
            * @returns
         */
        hideBlockedUsers(hideBlockedUsers: boolean): this;
        /**
            * A method to get the users with the specified role.
            * @param {string} role
            * @returns
         */
        setRole(role: string): this;
        /**
            * A method to get the users with the specified roles.
            * @param {string[]} role
            * @returns
         */
        setRoles(roles: Array<String>): this;
        /**
            * A method to fetch only friends.
            * @param {boolean} friendsOnly
            * @returns
         */
        friendsOnly(friendsOnly: boolean): this;
        /**
            * A method to get the users with the specified tags.
            * @param {string[]} tags
            * @returns
         */
        setTags(tags: Array<String>): this;
        /**
            * A method to get the tags along with the other details of the users.
            * @param {boolean} withTags
            * @returns
         */
        withTags(withTags: boolean): this;
        /**
            * A method to get the users with the specified UIDs.
            * @param {string[]} uids
            * @returns
         */
        setUIDs(uids: Array<String>): this;
        /**
         * A method to get the users sorted by either `name` or `status`. 
         * It accepts a string as input.
         * By default the SDK fetches users sorted by `status`.
         * @param {string} sortBy 
         * @returns 
        */
        public sortBy(sortBy: string): this;
        /**
         * A method to get the users sorted either in `asc` or `desc` order.  
         * It accepts a string as input.
         * By default the SDK fetches users sorted in `asc` order.
         * @param {string} sortOrder 
         * @returns 
        */
        public sortByOrder(sortOrder: string): this;
        /**
         * A method to set which field the search string should be searched. 
         * It accepts an array of string as input.
         * It can be `["name"]`, `["uid"]` or `["name", "uid"]`.
         * By default the SDK searches the search string in `["name", "uid"]`.
         * @param {string[]} searchIn 
         * @returns 
        */
        public searchIn(searchIn: Array<String>): this;
        /**
            * This method will return an object of the UsersRequest class.
            * @returns {UsersRequest}
         */
        build(): UsersRequest;
}

export class ConversationsRequest {
        /**
            * @private
            * @param {ConversationsRequestBuilder} builder
         */
        constructor(builder?: ConversationsRequestBuilder);
        /**
            * Get list of next set of conversations based on the parameters specified in ConversationsRequestBuilder class. The Developer need to call this method repeatedly using the same object of ConversationsRequest class to get paginated list of conversations.
            * @returns {Promise<Conversation[] | []>}
         */
        fetchNext(): Promise<Conversation[] | []>;
}
export class ConversationsRequestBuilder {
        /** @private */ conversationType: string;
        /** @private */ limit: number;
        /** @private */ getUserAndGroupTags: boolean;
        /** @private */ tags: Array<String>;
        /** @private */ WithTags: boolean;
        /** @private */ groupTags: Array<String>;
        /** @private */ userTags: Array<String>;
        /**
            *
            * @param {number} limit
            * A method to set limit for the number of Conversations returned in a single iteration. A maximum of 50 conversations can fetched in a single iteration.
            * @returns
         */
        setLimit(limit: number): this;
        /**
            *
            * @param {string} conversationType
            * A method to set the conversation type. It can take once of the two values: 1. 'user' - to fetch only the user conversations. 2. 'group' - to fetch only the group conversations.
            * @returns
         */
        setConversationType(conversationType: string): this;
        /**
            *
            * @param {boolean} getUserAndGroupTags
            * A method to fetch the user/group tags in the ConversationWith Object. The default value is false.
            * @returns
         */
        withUserAndGroupTags(getUserAndGroupTags: boolean): this;
        /**
         * A method to get the tags along with conversations.
         * @param {boolean} withTags 
         * @returns 
        */
        withTags(withTags: boolean): this;
        /**
         * A method to get conversations with the specified tags.
         * @param {Array<String>} tags 
         * @returns 
        */
        setTags(tags: Array<String>): this;
        /**
         * A method to filter conversation list by group tags.
         * @param {Array<String>} groupTags 
         * @returns 
        */
        public setGroupTags(groupTags: Array<String>): this;
        /**
         * A method to filter conversation list by user tags.
         * @param {Array<String>} userTags 
         * @returns 
        */
        public setUserTags(userTags: Array<String>): this;
        /**
            * This method will return an object of the ConversationsRequest class.
            * @returns {ConversationsRequest}
         */
        build(): ConversationsRequest;
}

export class MessagesRequest {
        constructor(builder?: MessagesRequestBuilder);
        /**
            * Get list of next messages based on the parameters specified in MessagesRequestBuilder class. The Developer need to call this method repeatedly using the same object of MessagesRequest class to get paginated list of message.
            * @returns {Promise<BaseMessage[] | []>}
         */
        fetchNext(): Promise<BaseMessage[] | []>;
        /**
            * Get list of previous messages based on the parameters specified in MessagesRequestBuilder class. The Developer need to call this method repeatedly using the same object of MessagesRequest class to get paginated list of message.
            * @returns {Promise<BaseMessage[] | []>}
         */
        fetchPrevious(): Promise<BaseMessage[] | []>;
}
export class MessagesRequestBuilder {
        /** @private */ limit?: number;
        /** @private */ maxLimit: number;
        /** @private */ uid?: string;
        /** @private */ guid?: string;
        /** @private */ parentMessageId?: number;
        /** @private */ timestamp?: number;
        /** @private */ id?: number;
        /** @private */ unread?: boolean;
        /** @private */ HideMessagesFromBlockedUsers?: boolean;
        /** @private */ searchKey?: string;
        /** @private */ updatedAt?: string;
        /** @private */ onlyUpdate?: number;
        /** @private */ category?: string;
        /** @private */ categories?: Array<String>;
        /** @private */ type?: string;
        /** @private */ types?: Array<String>;
        /** @private */ HideReplies?: boolean;
        /** @private */ HideDeletedMessages?: boolean;
        /** @private */ tags?: Array<String>;
        /** @private */ WithTags?: boolean;
        /**
            * A method to set limit for the number of messages returned in a single iteration. A maximum of 100 messages can fetched in a single iteration.
            * @param {number} limit
            * @returns
         */
        setLimit(limit: number): this;
        /**
            * A method to set GUID of a Group to get messages of that particular group conversation.
            * @param {string} guid
            * @returns
         */
        setGUID(guid: string): this;
        /**
            * A method to set UID of a User to get messages of that particular user conversation.
            * @param {string} uid
            * @returns
         */
        setUID(uid: string): this;
        /**
            * A method to set parent message id to get messages of that particular thread.
            * @param {number} parentMessageId
            * @returns
         */
        setParentMessageId(parentMessageId: number): this;
        /**
            * A method to set timestamp to get messages before/after the specified timestamp.
            * @param {number} timestamp
            * @returns
         */
        setTimestamp(timestamp?: number): this;
        /**
            * A method to set message ID of a particular message to get messages before/after the specified message.
            * @param {number} id
            * @returns
         */
        setMessageId(id?: number): this;
        /**
            * A method to get only unread messages.
            * @param {boolean} unread
            * @returns
         */
        setUnread(unread?: boolean): this;
        /**
            * Method to set parameters to hide or show message from blocked users.
            * @param {boolean} hideMessagesFromBlockedUsers
            * @returns
         */
        hideMessagesFromBlockedUsers(hideMessagesFromBlockedUsers?: boolean): this;
        /**
            * A method to set the search string based on which the messages are to be fetched.
            * @param {string} searchKey
            * @returns
         */
        setSearchKeyword(searchKey: string): this;
        /**
            * A method set timestamp to get fetch messages updated/edited after that timestamp.
            * @param {string} updatedAt
            * @returns
            */
        setUpdatedAfter(updatedAt: string): this;
        /**
            * A method to get only edited/updated messages.
            * @param {boolean} onlyUpdate
            * @returns
            */
        updatesOnly(onlyUpdate: boolean): this;
        /**
            * A method to set parameter to get the messages belonging to a specific category.
            * @param {string} category
            * @returns
         */
        setCategory(category: string): this;
        /**
            * A method to set parameter to get the messages belonging to specific categories.
            * @param {string[]} categories
            * @returns
         */
        setCategories(categories: Array<String>): this;
        /**
            * A method to set parameter to get the messages belonging to a specific type.
            * @param {string} type
            * @returns
         */
        setType(type: string): this;
        /**
            * A method to set parameter to get the messages belonging to specific types.
            * @param {string[]} types
            * @returns
         */
        setTypes(types: Array<String>): this;
        /**
            * A method to hide message replies.
            * @param {boolean} hideReplies
            * @returns
         */
        hideReplies(hideReplies: boolean): this;
        /**
            * A method to hide deleted messages.
            * @param {boolean} hideDeletedMessages
            * @returns
         */
        hideDeletedMessages(hideDeletedMessages: boolean): this;
        /**
         * A method to set parameter to get the messages belonging to specific tags.
         * @param {Array<String>} tags 
         * @returns 
        */
        setTags(tags: Array<String>): this;
        /**
         * A method to get messages with tags.
         * @param {boolean} withTags 
         * @returns 
        */
        withTags(withTags: boolean): this;
        /**
            * This method will return an object of the MessagesRequest class.
            * @returns {MessagesRequest}
         */
        build(): MessagesRequest;
}

/**
    *
    * @module TypingIndicator
    */
export class TypingIndicator {
        constructor(receiverId?: string, receiverType?: string, meta?: any);
        /**
            * Method to get receiver type of the transient message.
            * @returns {string}
         */
        getReceiverType(): string;
        /**
            * Method to set receiver type of the transient message.
            * @param {string} receiverType
         */
        setReceiverType(receiverType: string): void;
        /**
            * Method to get receiverID of typing indicator.
            * @returns {string}
         */
        getReceiverId(): string;
        /**
            * Method to set receiverID of typing indicator.
            * @param {string} receiverId
         */
        setReceiverId(receiverId: string): void;
        /**
            * Method to get metadata of the transient message.
            * @returns {string}
         */
        getMetadata(): string;
        /**
            * Method to set metadata of the transient message.
            * @param {string} meta
         */
        setMetadata(meta: string): void;
        /**
            * Method to get sender of the transient message.
            * @returns {User}
         */
        getSender(): User;
        /**
            * Method to set sender of the transient message.
            * @param {User} sender
         */
        setSender(sender: User): void;
}

/**
    *
    * @module CustomMessage
    */
export class CustomMessage extends BaseMessage implements Message {
        private customData;
        private subType;    
        private data?;
        private tags?;
        constructor(...args: any[]);
        /**
            * Method to get custom data of the message.
            * @returns {Object}
            */
        getCustomData(): Object;
        /**
            * Method to set custom data of the message.
            * @param {Object} customData
            */
        setCustomData(customData: Object): void;
        /**
            * Method to get sender of the message.
            * @returns {User}
            */
        getSender(): User;
        /**
            * Method to get receiver of the message.
            * @returns {User | Group}
            */
        getReceiver(): User | Group;
        /**
            * Methhod to get sub type of the message.
            * @returns {string}
            */
        getSubType(): string;
        /**
            * Method to set sub type of the message.
            * @param {string} subType
            */
        setSubType(subType: string): void;
        /**
            * Method to get metadata of the message.
            * @returns {Object}
            */
        getMetadata(): Object;
        /**
            * Method to set metadata of the message.
            * @param {Object} metadata
            */
        setMetadata(metadata: Object): void;
        /**
            * Method to get data of the message.
            * @returns
            */
        getData(): any;
        /**
         * Get the tags of the message.
         * @returns {Array<String>}
         */
        getTags(): Array<String>;
        /**
          * @param {Array<String>} tags
          * Set the tags for the message.
          */
        setTags(tags: Array<String>): void;
}

/**
    *
    * @module GroupMember
    */
export class GroupMember extends User {
        constructor(uid: string, scope?: string);
        /**
            * Method to set scope of the group member.
            * @param {GroupMemberScope} scope
         */
        setScope(scope: GroupMemberScope): void;
        /**
            * Method to set joinedAt of the group member.
            * @param {number} joinedAt
         */
        setJoinedAt(joinedAt: number): void;
        /**
            * Method to set guid of the group member.
            * @param {string} guid
         */
        setGuid(guid: string): void;
        /**
            * Method to get scope of the group member.
            * @returns {string}
         */
        getScope(): string;
        /**
            * Method to get joinedAt of the group member.
            * @returns {number}
         */
        getJoinedAt(): number;
        /**
            * Method to get guid of the group member.
            * @returns {string}
         */
        getGuid(): string;
}

export class BlockedUsersRequest {
        static directions: {
                BOTH: string;
                HAS_BLOCKED_ME: string;
                BLOCKED_BY_ME: string;
        };
        /**
            * @private
            * @param {BlockedUsersRequestBuilder} builder
            */
        constructor(builder?: BlockedUsersRequestBuilder);
        /**
            *
            * Get list of next set of blocked users based on the parameters specified in BlockedUsersRequestBuilder class. The Developer need to call this method repeatedly using the same object of BlockedUsersRequest class to get paginated list of blocked users.
            * @returns {Promise<User[] | []>}
            */
        fetchNext(): Promise<User[] | []>;
}
export class BlockedUsersRequestBuilder {
        /** @private */ limit: number;
        /** @private */ searchKeyword: string;
        /** @private */ direction: string;
        /**
            *
            * @param {number} limit
            * A method to set limit for the number of blocked users returned in a single iteration. A maximum of 100 blocked users can fetched in a single iteration.
            * @returns
         */
        setLimit(limit: number): this;
        /**
            *
            * @param {string} searchKeyword
            * A method to set the search string based on which the blocked users are to be fetched.
            * @returns
         */
        setSearchKeyword(searchKeyword: string): this;
        /**
            *
            * @param direction
            * A method to either fetch only users the logged-in user has blocked or the users who have blocked the logged-in user or both.
            * @returns
         */
        setDirection(direction: string): this;
        /** @internal */
        blockedByMe(): this;
        /** @internal */
        hasBlockedMe(): this;
        /**
            * This method will return an object of the BlockedUsersRequest class.
            * @returns {BlockedUsersRequest}
         */
        build(): BlockedUsersRequest;
}

export class AppSettings {
        static SUBSCRIPTION_TYPE_NONE: string;
        static SUBSCRIPTION_TYPE_ALL_USERS: string;
        static SUBSCRIPTION_TYPE_ROLES: string;
        static SUBSCRIPTION_TYPE_FRIENDS: string;
        /** @private */
        static REGION_EU: string;
        /** @private */
        static REGION_US: string;
        /** @private */
        static REGION_IN: string;
        /** @private */
        static REGION_PRIVATE: string;
        /** @private */
        subscriptionType: string;
        /** @private */
        roles: string[];
        /** @private */
        region: string;
        /** @private */
        autoJoinGroup: boolean;
        /** @private */
        establishSocketConnection: boolean;
        /** @private */
        adminHost: string;
        /** @private */
        clientHost: string;
        /**
            * @private
            * @param {AppSettingsBuilder}
         */
        constructor(builder: AppSettingsBuilder);
        /**
            * This method returns the subscription type set using one of the following methods of the AppSettingsBuilder `subscribePresenceForAllUsers()`, `subscribePresenceForRoles()` or `subscribePresenceForFriends()`.
            * @returns {string}
         */
        getSubscriptionType(): string;
        /**
            * This method returns the roles set using the `setRoles()` of the AppSettingsBuilder.
            * @returns {string[]}
         */
        getRoles(): string[];
        /**
            * This method returns the region set using the `setRegion()` of the AppSettingsBuilder.
            * @returns {string}
         */
        getRegion(): string;
        /**
            * This method returns whether auto joining of group was enabled or not using the `enableAutoJoinForGroups()` of the AppSettingsBuilder.
            * @returns {boolean}
         */
        getIsAutoJoinEnabled(): boolean;
        /**
            * This method returns whether the SDK should connect to WebSocket server when a user logs-in or not.
            * @returns {boolean}
         */
        shouldAutoEstablishSocketConnection(): boolean;

        /**
         * This method returns the admin host to which the SDK should connect.
         * @returns {boolean}
        */
        getAdminHost(): string;

        /**
         * This method returns the client host to which the SDK should connect.
         * @returns {boolean}
        */
        getClientHost(): string;
}
export class AppSettingsBuilder {
        /** @private */
        subscriptionType: string;
        /** @private */
        roles: string[];
        /** @private */
        region: string;
        /** @private */
        autoJoinGroup: boolean;
        /** @private */
        establishSocketConnection: boolean;
        /** @private */
        adminHost: string;
        /** @private */
        clientHost: string;
        /**
            * A method to subscribe presence for all users.
            * @returns
         */
        subscribePresenceForAllUsers(): this;
        /**
            * @param {string[]} roles
            * A method to subscribe presence for all roles.
            * @returns
         */
        subscribePresenceForRoles(roles: string[]): this;
        /**
            * A method to subscribe presence for friends.
            * @returns
         */
        subscribePresenceForFriends(): this;
        /**
            * @param {string} region
            * A method to set region of the app.
            * @returns
         */
        setRegion(region?: string): this;
        /**
            * @param {boolean} isAutoJoinEnabled
            * A method to enable/disable auto joining group. The default value is true.
            * @returns
         */
        enableAutoJoinForGroups(isAutoJoinEnabled?: boolean): this;
        /**
            * @param {boolean} establishSocketConnection
            * A method to auto connect to WebSocket server when a user logs-in. The default value is true.
            * @returns
         */
        autoEstablishSocketConnection(establishSocketConnection?: boolean): this;
        /**
         * @param {string} adminHost
         * This method is used to override the admin host which the SDK uses to make an API call.
         * @returns 
        */
        overrideAdminHost(adminHost: string): this;
        /**
         * @param {string} clientHost
         * This method is used to override the client host which the SDK uses to make an API call.
         * @returns 
        */
        overrideClientHost(clientHost: string): this
        /**
            * This method will return an object of the AppSettings class.
            * @returns {AppSettings}
         */
        build(): AppSettings;
}

export class CometChatHelper {
        /** @private */
        constructor();
        /**
            * Takes JSONMessage as an input and will return an Object of BaseMessage Class.
            * @param {Object} message
            * @returns {TextMessage | MediaMessage | CustomMessage | BaseMessage}
            * @memberof CometChatHelper
            */
        static processMessage(message: Object): Promise<TextMessage | MediaMessage | CustomMessage | BaseMessage>;
        /**-------------------------------------------------------------------*
            * Message related functions provided by CometChat class              *
            *--------------------------------------------------------------------**/
        /**
            * Takes a Message Object and converts it into Conversation Object.
            * @param {TextMessage | MediaMessage | CustomMessage} message
            * @returns {Conversation} conversation
            * @memberof CometChat
            */
        static getConversationFromMessage(message: TextMessage | MediaMessage | CustomMessage | any): Promise<Conversation>;
}

/**
    *
    * @module Conversation
    */
export class Conversation {
        protected conversationId: string;
        protected conversationType: string;
        protected lastMessage: TextMessage | MediaMessage | CustomMessage | any;
        protected conversationWith: User | Group;
        protected unreadMessageCount: number;
        protected tags: Array<String>;
        constructor(conversationId: string, conversationType: string, lastMessage: TextMessage | MediaMessage | CustomMessage | any, conversationWith: User | Group, unreadMessageCount: number, tags: Array<String>);
        /**
            * Method to set conversation ID of the conversation.
            * @param {string} conversationId
         */
        setConversationId(conversationId: string): void;
        /**
            * Method to set conversation type of the conversation.
            * @param {string} conversationId
         */
        setConversationType(conversationType: string): void;
        /**
            * Method to set last message of the conversation.
            * @param {TextMessage | MediaMessage | CustomMessage | any} conversationId
         */
        setLastMessage(lastMessage: TextMessage | MediaMessage | CustomMessage | any): void;
        /**
            * Method to set conversationWith of the conversation.
            * @param {User | Group} conversationId
         */
        setConversationWith(conversationWith: User | Group): void;
        /**
            * Method to set unread message count of the conversation.
            * @param {number} conversationId
         */
        setUnreadMessageCount(unreadMessageCount: number): void;
        /**
            * Method to get conversation ID of the conversation.
            * @returns {string}
         */
        getConversationId(): string;
        /**
            * Method to get conversation type of the conversation.
            * @returns {string}
         */
        getConversationType(): string;
        /**
            * Method to get last message of the conversation.
            * @returns {TextMessage | MediaMessage | CustomMessage | any}
         */
        getLastMessage(): TextMessage | MediaMessage | CustomMessage | any;
        /**
            * Method to get conversationWith of the conversation.
            * @returns {User | Group}
         */
        getConversationWith(): User | Group;
        /**
            * Method to get unread message count of the conversation.
            * @returns {number}
         */
        getUnreadMessageCount(): number;
        /**
         * Method to get tags of a conversation.
         * @returns {Array<String>}
        */
        getTags(): Array<String>;
}

export class Attachment {
        constructor(file: Object);
        /**
            * Create the file object from the provided JSON Object.
            * @private
            * @param {Object} file
            * @returns {FileObject}
            * @memberof FileObject
            */
        createFileFromJSON(file: Object): Attachment;
        /**
            * Converts the FileObject to JSON Object.
            * @private
            * @param {FileObject} fileObject
            * @returns {Object}
            * @memberof FileObject
            */
        toJSON(attachment: Attachment): Object;
        /**
            * Get extension of the file.
            * @returns {string}
         */
        getExtension(): string;
        /**
            * Method to set extension of the file.
            * @param {string} extension
         */
        setExtension(extension: string): void;
        /**
            * Get mime type of the file.
            * @returns {string}
         */
        getMimeType(): string;
        /**
            * Method to set mimeType of the file.
            * @param {string} mimeType
         */
        setMimeType(mimeType: string): void;
        /**
            * Get name of the file.
            * @returns {string}
         */
        getName(): string;
        /**
            * Method to set name of the file.
            * @param {string} name
         */
        setName(name: string): void;
        /**
            * Get size of the file.
            * @returns {string}
         */
        getSize(): number;
        /**
            * Method to set size of the file.
            * @param {string} name
         */
        setSize(size: number): void;
        /**
            * Get URL of the file.
            * @returns {string}
         */
        getUrl(): string;
        /**
            * Method to set URL of the file.
            * @param {string} name
         */
        setUrl(url: string): void;
}

export class CallSettings {
        static POSITION_TOP_LEFT: string;
        static POSITION_TOP_RIGHT: string;
        static POSITION_BOTTOM_LEFT: string;
        static POSITION_BOTTOM_RIGHT: string;
        static ASPECT_RATIO_DEFAULT: string;
        static ASPECT_RATIO_CONTAIN: string;
        static ASPECT_RATIO_COVER: string;
        constructor(builder?: CallSettingsBuilder);
        shouldUseLegacyUI(): boolean;
        isRecordingButtonEnabled(): boolean;
        shouldStartRecordingOnCallStart(): boolean;
        getCustomCSS(): string;
        getSessionId(): string;
        isAudioOnlyCall(): boolean;
        getUser(): RTCUser;
        getRegion(): string;
        getAppId(): string;
        getDomain(): string;
        isDefaultLayoutEnabled(): boolean;
        getMode(): string;
        getStartWithAudioMuted(): boolean;
        getStartWithVideoMuted(): boolean;
        isEndCallButtonEnabled(): boolean;
        isMuteAudioButtonEnabled(): boolean;
        isPauseVideoButtonEnabled(): boolean;
        isScreenShareButtonEnabled(): boolean;
        isModeButtonEnabled(): boolean;
        getLocalizedStringObject(): Object;
        getAnalyticsSettings(): Object;
        isAudioToVideoButtonEnabled(): boolean;
        getVirtualBackground(): VirtualBackground;
        isVirtualBackgroundSettingEnabled(): boolean;
        getMainVideoContainerSetting(): MainVideoContainerSetting;
}
export class CallSettingsBuilder {
        /** @private */ sessionID: string;
        /** @private */ defaultLayout: boolean;
        /** @private */ isAudioOnly: boolean;
        /** @private */ region: string;
        /** @private */ domain: string;
        /** @private */ user: RTCUser;
        /** @private */ mode: string;
        /** @private */ ShowEndCallButton: boolean;
        /** @private */ ShowMuteAudioButton: boolean;
        /** @private */ ShowPauseVideoButton: boolean;
        /** @private */ ShowScreenShareButton: boolean;
        /** @private */ ShowSwitchModeButton: boolean;
        /** @private */ StartAudioMuted: boolean;
        /** @private */ StartVideoMuted: boolean;
        /** @private */ localizedObject: Object;
        /** @private */ analyticsSettings: Object;
        /** @private */ appId: string;
        /** @private */ customCSS: string;
        /** @private */ ShowRecordingButton: boolean;
        /** @private */ StartRecordingOnCallStart: boolean;
        /** @private */ useLegacyUI: boolean;
        /** @private */ShowSwitchToVideoCallButton: boolean;
        /** @private */virtualBackground: VirtualBackground;
        /** @private */ShowVirtualBackgroundSetting: boolean;
        /** @private */ MainVideoContainerSetting: MainVideoContainerSetting;
        /**
            *
            * @param {string} sessionID
            * This methods sets the session ID of the call.
            * @returns
         */
        setSessionID(sessionID: string): this;
        /**
            *
            * @param {boolean} defaultLayout
            * This methods shows/hides the default button layout.
            * If set to true the default button layout will be shown.
            * If set to false the default button layout will be hidden.
            * Default value is true
            * @returns
         */
        enableDefaultLayout(defaultLayout: boolean): this;
        /**
            *
            * @param {boolean} isAudioOnly
            * This methods sets the type(audio/video) of the call.
            * If set to true, the call will be strictly an audio call.
            * If set to false, the call will be an audio-video call.
            * Default value is false
            * @returns
         */
        setIsAudioOnlyCall(isAudioOnly: boolean): this;
        /**
            * @private
            * @param {string} region
            * This method sets the region of the app.
            * @returns
         */
        setRegion(region: string): this;
        /**
            * @private
            * @param {string} domain
            * This method sets the domain of the app.
            * @returns
         */
        setDomain(domain: string): this;
        /**
            * @private
            * @param {RTCUser} user
            * This method sets the user.
            * @returns
         */
        setUser(user: RTCUser): this;
        /**
            *
            * @param {string} mode
            * This method sets the mode of the call.
            * @returns
         */
        setMode(mode: string): this;
        /**
            *
            * @param {boolean} showEndCallButton
            * This method shows/hides the end call button.
            * If set to true it will display the end call button.
            * If set to false it will hide the end call button.
            * Default value is true.
            * @returns
         */
        showEndCallButton(showEndCallButton: boolean): this;
        /**
            *
            * @param {boolean} showMuteAudioButton
            * This method shows/hides the mute audio button.
            * If set to true it will display the mute audio button.
            * If set to false it will hide the mute audio button.
            * Default value is true.
            * @returns
         */
        showMuteAudioButton(showMuteAudioButton: boolean): this;
        /**
            *
            * @param {boolean} showPauseVideoButton
            * This method shows/hides the pause video button.
            * If set to true it will display the pause video button.
            * If set to false it will hide the pause video button.
            * Default value is true.
            * @returns
         */
        showPauseVideoButton(showPauseVideoButton: boolean): this;
        /**
            *
            * @param {boolean} showScreenShareButton
            * This method shows/hides the screen share button.
            * If set to true it will display the screen share button.
            * If set to false it will hide the screen share button.
            * Default value is true.
            * @returns
         */
        showScreenShareButton(showScreenShareButton: boolean): this;
        /**
            *
            * @param {boolean} showModeButton
            * This method shows/hides the switch mode button.
            * If set to true it will display the switch mode button.
            * If set to false it will hide the switch mode button.
            * Default value is true.
            * @returns
         */
        showModeButton(showModeButton: boolean): this;
        /**
            *
            * @param {Object} localizedStringObject
            * This method will set the localized text in the call screen.
            * @returns
         */
        setLocalizedStringObject(localizedStringObject: Object): this;
        /**
            * @private
            * @param {Object} analyticsSettings
            * This method will set the settings required for analytics.
            * @returns
         */
        setAnalyticsSettings(analyticsSettings: Object): this;
        /**
            *
            * @param {string} appId
            * This method will set the appID.
            * @returns
         */
        setAppId(appId: string): this;
        /**
            *
            * @param {boolean} audioMuted
            * This method allows the call to be started with audio muted.
            * If set to true, the call will start with audio muted.
            * Default value is false.
            * @returns
         */
        startWithAudioMuted(audioMuted: boolean): this;
        /**
            *
            * @param {boolean} videoMuted
            * This method allows the call to be started with video muted.
            * If set to true, the call will start with video muted.
            * Default value is false.
            * @returns
         */
        startWithVideoMuted(videoMuted: boolean): this;
        /**
            *
            * @param {boolean} customCSS
            * This method will set the custom CSS of the call screen.
            * @returns
         */
        setCustomCSS(customCSS: string): this;
        /**
            *
            * @param {boolean} showRecordingButton
            * This method shows/hides the recording button.
            * If set to true it will display the recording button.
            * If set to false it will hide the recording button.
            * Default value is false.
            * @returns
         */
        showRecordingButton(showRecordingButton: boolean): this;
        /**
            *
            * @param {boolean} startRecordingOnCallStart
            * This method starts the recording as soon as the call start.
            * If set to true it will start the recording as soon as the call start.
            * Default value is false.
            * @returns
         */
        startRecordingOnCallStart(startRecordingOnCallStart: boolean): this;
        /**
            *
            * @param {boolean} legacyUI
            * This method will render the legacy call UI.
            * If set to true it will render the legacy call UI.
            * Default value is false.
            * @returns
         */
        forceLegacyUI(legacyUI: boolean): this;
        /**
         * 
         * @param {boolean} showAudioToVideoSwitchButton 
         * This method shows/hides the switch to video call button.
         * If set to true it will display the switch to video call button. 
         * If set to false it will hide the switch to video call button.
         * Default value is true.
         * @returns 
        */
        showSwitchToVideoCallButton(showAudioToVideoSwitchButton: boolean): this;

         /**
          *
          * @param {VirtualBackground} virtualBackground 
          * This method will set the virtual background setting. 
          * This methods takes an Object of VirtualBackground Class.
          * @returns 
         */
        setVirtualBackground(virtualBackground: VirtualBackground): this;
 
         /**
          * 
          * @param {boolean} showVirtualBackgroundSetting 
          * This method shows/hides the virtual background setting button.
          * If set to true it will display the virtual background setting button. 
          * If set to false it will hide the virtual background setting button.
          * Default value is true.
          * @returns 
         */
        showVirtualBackgroundSetting(showVirtualBackgroundSetting: boolean): this;
        /**
         * 
         * @param {MainVideoContainerSetting} mainVideoContainerSetting 
         * This method can be used to customize the main video container.
         * @returns 
        */
        setMainVideoContainerSetting(mainVideoContainerSetting: MainVideoContainerSetting): this;
        /**
            * This method will return an object of the CallSettings class.
            * @returns {CallSettings}
         */
        build(): CallSettings;
}

export class MainVideoContainerSetting{
    /** @private */  videoFit: string;
    /** @private */  zoomButton: Object;
    /** @private */  nameLabel: Object;
    /** @private */  network: Object;

    /**
     * 
     * @param {string} mainVideoAspectRatio 
     * This method is used to set the aspect ratio of main video.
     * The default value is `contain`.
     * @returns 
    */
    setMainVideoAspectRatio(mainVideoAspectRatio: string): void;
    
    /**
     * 
     * @param {string} position 
     * @param {boolean} visibility 
     * This method is used to set the position & visibility parameter of the full screen button.
     * By default the full screen button is visible in the `bottom-right` position.
     * @returns 
    */
    setFullScreenButtonParams(position: string, visibility: boolean): void;

    /**
     * 
     * @param {string} position 
     * @param {boolean} visibility 
     * @param {string} backgroundColor 
     * This method is used to set the position, visibility & background color of the name label.
     * By default the name label is visible in the `bottom-right` position with a background-color `rgba(27, 27, 27, 0.4)`.
     * @returns 
    */
    setNameLabelParams(position: string, visibility: boolean, backgroundColor: string): void;

    /**
     * 
     * @param {string} position 
     * @param {boolean} visibility 
     * This method is used to set the position, visibility of the network label.
     * By default the network label is visible in the `bottom-right` position.
     * @returns 
    */
    setNetworkLabelParams(position: string, visibility: boolean): void;
}

export class VirtualBackground {
    public constructor(builder?: VirtualBackgroundBuilder);
    shouldAllowBackgroundBlur(): boolean;
    shouldAllowUserImages(): boolean;
    shouldShowDefaultImages(): boolean;
    getImages(): Array<String>;
    isBackgroundBlurEnforced(): number;
    getEnforcedBackgroundImage(): string;
}
    
export class VirtualBackgroundBuilder{
    /** @private */ AllowBackgroundBlur: boolean;
    /** @private */ AllowUserImages: boolean;
    /** @private */ ShowDefaultImages: boolean;
    /** @private */ SetImages: Array<String>;
    /** @private */ EnforceBackgroundBlur: number;
    /** @private */ EnforceBackgroundImage: string;
    
    /**
    *
    * @param {boolean} AllowBackgroundBlur
    * This method will show the background blur option in Virtual Background.
    * If set to true it will show the background blur option.
    * Default value is true.
    * @returns
    */
    allowBackgroundBlur(AllowBackgroundBlur: boolean): this;
    
    /**
    *
    * @param {boolean} AllowUserImage
    * This method will allow the user to add custom images as background.
    * If set to true it will allow the user to add custom images as background.
    * Default value is true.
    * @returns
    */
    allowUserImages(AllowUserImages: boolean): this;
    
    /**
    *
    * @param {boolean} ShowDefaultImages
    * This method will show the default images to be used as background.
    * If set to true it will show the default images to be used as background.
    * Default value is true.
    * @returns
    */
    showDefaultImages(ShowDefaultImages: boolean): this;
    
    /**
    *
    * @param {boolean} SetImages
    * This method will allow user to add custom Images to be used as background. It takes in an array of URLs.
    * @returns
    */
    
    setImages(SetImages: Array<String>):
    this;
    
    /**
    *
    * @param {number} EnforceBackgroundBlur
    * This method will enforce background blur.
    * This method takes number as input which decides the blur level of the background.
    * Default value is 0.
    * @returns
    */
    enforceBackgroundBlur(EnforceBackgroundBlur: number): this;
    
    /**
    *
    * @param {string} EnforceBackgroundImage
    * This method will enforce background image.
    * If an URL of the image is sent then that image will be set as background.
    * By default no image is set.
    * @returns
    */
    enforceBackgroundImage(EnforceBackgroundImage: string): this;
    
    /**
    * This method will return an object of the VirtualBackground class.
    * @returns {VirtualBackground}
    */
    build(): VirtualBackground;
}

export class CCExtension {
        constructor(extension: any);
        /**
            * This method returns the id of the extension.
            * @returns {string}
         */
        getId(): string;
        /**
            * This method returns the name of the extension.
            * @returns {string}
            */
        getName(): string;
}

export class MediaDevice {
        constructor(id: string, name: string, active: boolean);
        /**
            * Method to get ID of the media device.
            * @returns {string}
         */
        getId(): string;
        /**
            * Method to set ID of the media device.
            * @param {string} id
         */
        setId(id: string): void;
        /**
            * Method to get name of the media device.
            * @returns {string}
         */
        getName(): string;
        /**
            * Method to set name of the media device.
            * @param {string} name
         */
        setName(name: string): void;
        /**
            * Method to check if the media device is active or not.
            * @returns {boolean}
         */
        getIsActive(): boolean;
        /**
            * Method to set the media device as active.
            * @param {boolean} active
         */
        setIsActive(active: boolean): void;
}

export class TransientMessage {
        constructor(receiverId: string, receiverType: string, data: any);
        /**
            * Method to get receiverID of the transient message.
            * @returns {string}
         */
        getReceiverId(): string;
        /**
            * Method to set receiverID of the transient message.
            * @param {string} receiverId
         */
        setReceiverId(receiverId: string): void;
        /**
            * Method to get receiver type of the transient message.
            * @returns {string}
         */
        getReceiverType(): string;
        /**
            * Method to set receiver type of the transient message.
            * @param {string} receiverType
         */
        setReceiverType(receiverType: string): void;
        /**
            * Method to get data of the transient message.
            * @returns {any}
         */
        getData(): any;
        /**
            * Method to set data of the transient message.
            * @param {any} data
         */
        setData(data: any): void;
        /**
            * Method to get sender of the transient message.
            * @returns {User}
         */
        getSender(): User;
        /**
            * Method to set sender of the transient message.
            * @param {User} sender
         */
        setSender(sender: User): void;
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

/**
    *
    * @module MessageReceipt
    */
export class MessageReceipt {
        RECEIPT_TYPE: {
                READ_RECEIPT: string;
                DELIVERY_RECEIPT: string;
        };
        /**
            * Method to get receiver type of the message receipt.
            * @returns {string}
         */
        getReceiverType(): string;
        /**
            * Method to set receiver type of the message receipt.
            * @param {string} receiverType
         */
        setReceiverType(receiverType: string): void;
        /**
            * Method to get sender of the message receipt.
            * @returns {User}
         */
        getSender(): User;
        /**
            * Method to set sender of the message receipt.
            * @param {User} sender
         */
        setSender(sender: User): void;
        /**
            * Method to get receiver of the message receipt.
            * @returns {string}
         */
        getReceiver(): string;
        /**
            * Method to set receiver of the message receipt.
            * @param {string} receiver
         */
        setReceiver(receiver: string): void;
        /**
            * Method to get timestamp of the message receipt.
            * @returns {string}
         */
        getTimestamp(): string;
        /**
            * Method to set timestamp of the message receipt.
            * @param {string} timestamp
         */
        setTimestamp(timestamp: string): void;
        /**
            * Method to set readAt timestamp of the message receipt.
            * @param {number} readAt
         */
        setReadAt(readAt: number): void;
        /**
            * Method to get readAt timestamp of the message receipt.
            * @returns {number}
         */
        getReadAt(): number;
        /**
            * Method to set deliveredAt timestamp of the message receipt.
            * @param {number} deliveredAt
         */
        setDeliveredAt(deliveredAt: number): void;
        /**
            * Method to get deliveredAt timestamp of the message receipt.
            * @returns {number}
         */
        getDeliveredAt(): number;
        /**
            * Method to get the message ID.
            * @returns {string}
         */
        getMessageId(): string;
        /**
            * Method to set the message ID.
            * @param {string} messageId
         */
        setMessageId(messageId: string): void;
        /**
            * Method to get the receipt type of message receipt.
            * @returns {string}
         */
        getReceiptType(): string;
        /**
            * Method to set the receipt type of message receipt.
            * @param {string} receiptType
         */
        setReceiptType(receiptType?: string): void;
}

export class RTCUser {
    constructor(uid: string);
    setUID(uid: string): void;
    getUID(): string;
    setName(name: string): void;
    getName(): string;
    setAvatar(avatar: string): void;
    getAvatar(): string;
    setJWT(jwt: string): void;
    getJWT(): string;
    setResource(resource: string): void;
    getResource(): string;
}
}
