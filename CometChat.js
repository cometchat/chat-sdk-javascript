(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return  (function(modules) { 
 	
 	var installedModules = {};

 	
 	function __webpack_require__(moduleId) {

 		
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};

 		
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

 		
 		module.l = true;

 		
 		return module.exports;
 	}


 	
 	__webpack_require__.m = modules;

 	
 	__webpack_require__.c = installedModules;

 	
 	__webpack_require__.d = function(exports, name, getter) {
 		if(!__webpack_require__.o(exports, name)) {
 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
 		}
 	};

 	
 	__webpack_require__.r = function(exports) {
 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
 		}
 		Object.defineProperty(exports, '__esModule', { value: true });
 	};

 	
 	
 	
 	
 	
 	__webpack_require__.t = function(value, mode) {
 		if(mode & 1) value = __webpack_require__(value);
 		if(mode & 8) return value;
 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
 		var ns = Object.create(null);
 		__webpack_require__.r(ns);
 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
 		return ns;
 	};

 	
 	__webpack_require__.n = function(module) {
 		var getter = module && module.__esModule ?
 			function getDefault() { return module['default']; } :
 			function getModuleExports() { return module; };
 		__webpack_require__.d(getter, 'a', getter);
 		return getter;
 	};

 	
 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

 	
 	__webpack_require__.p = "";


 	
 	return __webpack_require__(__webpack_require__.s = 38);
 })

 ([

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.validateConversationType = exports.validateUpdateUser = exports.validateCreateUser = exports.validateMessage = exports.validateChatType = exports.validateMsgId = exports.validateArray = exports.validateHideMessagesFromBlockedUsers = exports.validateId = exports.validateCreateGroup = exports.validateJoinGroup = exports.validateUpdateGroup = exports.validateScope = exports.isAudio = exports.isVideo = exports.isImage = exports.getUpdatedSettings = exports.getAppSettings = exports.getCurrentTime = exports.Logger = exports.createUidFromJid = exports.format = exports.getOrdinalSuffix = exports.isFalsy = exports.isTruthy = exports.isObject = exports.getJidHost = exports.getChatHost = void 0;
var store_1 = __webpack_require__(14);
var Constants_1 = __webpack_require__(1);
var HttpHelper_1 = __webpack_require__(6);
var CustomError_1 = __webpack_require__(2);
var TextMessage_1 = __webpack_require__(16);
var MediaMessage_1 = __webpack_require__(17);
var CustomMessage_1 = __webpack_require__(19);
var CometChat_1 = __webpack_require__(3);
var CometChatErrorConstants_1 = __webpack_require__(13);
function getChatHost(appSettings) {
    return appSettings[Constants_1.APP_SETTINGS.KEYS.CHAT_HOST_OVERRIDE] ? appSettings[Constants_1.APP_SETTINGS.KEYS.CHAT_HOST_OVERRIDE] : (appSettings[Constants_1.APP_SETTINGS.KEYS.CHAT_HOST_APP_SPECIFIC] ? appSettings[Constants_1.APP_SETTINGS.KEYS.CHAT_HOST_APP_SPECIFIC] : appSettings[Constants_1.APP_SETTINGS.KEYS.CHAT_HOST]);
}
exports.getChatHost = getChatHost;
function getJidHost(appSettings) {
    return appSettings[Constants_1.APP_SETTINGS.KEYS.JID_HOST_OVERRIDE] ? appSettings[Constants_1.APP_SETTINGS.KEYS.JID_HOST_OVERRIDE] : appSettings[Constants_1.APP_SETTINGS.KEYS.CHAT_HOST];
}
exports.getJidHost = getJidHost;
function isObject(object) {
    return object instanceof Object && object.constructor === Object;
}
exports.isObject = isObject;
function isTruthy($true) {
    var truevalues = [true, 1, '1', 'true', 'TRUE'];
    return truevalues.includes($true);
}
exports.isTruthy = isTruthy;
function isFalsy($false) {
    if ($false != null) {
        if (typeof $false == "string")
            $false = $false.trim();
        if (typeof $false == "object" && Object.keys($false).length === 0)
            $false = undefined;
    }
    var falsyvalues = ['', 0, '0', false, null, 'null', undefined, 'undefined'];
    return falsyvalues.includes($false);
}
exports.isFalsy = isFalsy;
function getOrdinalSuffix(number) {
    var tens = number % 10, hundreds = number % 100;
    if (tens == 1 && hundreds != 11)
        return number + 'st';
    if (tens == 2 && hundreds != 12)
        return number + 'nd';
    if (tens == 3 && hundreds != 13)
        return number + 'rd';
    return number + 'th';
}
exports.getOrdinalSuffix = getOrdinalSuffix;
function format(fmt) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return fmt
        .split("%s").reduce(function (aggregate, chunk, i) {
        return aggregate + chunk + (args[i] || "");
    }, "");
}
exports.format = format;
function createUidFromJid(jid) {
    return jid.substring(jid.lastIndexOf("]") + 1, jid.lastIndexOf("@"));
}
exports.createUidFromJid = createUidFromJid;
var Logger =  (function () {
    function Logger() {
    }
    Logger.log = function (TAG, message) {
        console.log(TAG, message);
    };
    Logger.error = function (TAG, message) {
        console.log(TAG, message);
    };
    Logger.info = function (TAG, message) {
        console.info(TAG, message);
    };
    return Logger;
}());
exports.Logger = Logger;
exports.getCurrentTime = function () {
    return new Date().getTime();
};

function getAppSettings() {
    return new Promise(function (resolve, reject) {
        store_1.LocalStorage.getInstance().get(Constants_1.LOCAL_STORE.KEY_APP_SETTINGS).then(function (appSettings) {
            if (isFalsy(appSettings)) {
                getUpdatedSettings().then(function (appSettings) {
                    resolve(appSettings);
                }, function (error) {
                    reject(error);
                });
            }
            else {
                resolve(appSettings);
            }
        }, function (error) {
            reject(error);
        });
    });
}
exports.getAppSettings = getAppSettings;

function getUpdatedSettings() {
    return new Promise(function (resolve, reject) {
        HttpHelper_1.makeApiCall("appSettings").then(function (data) {
            store_1.LocalStorage.getInstance().set(Constants_1.LOCAL_STORE.KEY_APP_SETTINGS, data.data);
            if (data.data.MODE) {
                CometChat_1.CometChat.setMode(data.data.MODE);
            }
            resolve(data.data);
        }, function (error) {
            reject(new CustomError_1.CometChatException(error.error));
        });
    });
}
exports.getUpdatedSettings = getUpdatedSettings;
exports.isImage = function (file) {
    var isImage;
    if (file.type) {
        if (file.type.toLowerCase().includes("image"))
            isImage = true;
    }
    return isImage;
};
exports.isVideo = function (file) {
    var isVideo;
    if (file.type) {
        if (file.type.toLowerCase().includes("video"))
            isVideo = true;
    }
    return isVideo;
};
exports.isAudio = function (file) {
    var isAudio;
    if (file.type) {
        if (file.type.toLowerCase().includes("audio"))
            isAudio = true;
    }
    return isAudio;
};
exports.validateScope = function (scope) {
    var response;
    if (typeof scope !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "SCOPE", "SCOPE", "Scope")));
        return response;
    }
    else {
        if (isFalsy(scope)) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "SCOPE", "SCOPE", "scope", "scope")));
            return response;
        }
        else {
            if (!(scope == CometChat_1.CometChat.GROUP_MEMBER_SCOPE.ADMIN || scope == CometChat_1.CometChat.GROUP_MEMBER_SCOPE.MODERATOR || scope == CometChat_1.CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT)) {
                response = new CustomError_1.CometChatException(Constants_1.GroupErrors.INVALID_SCOPE);
                return response;
            }
        }
    }
};
exports.validateUpdateGroup = function (group) {
    var response;
    if (!group.hasOwnProperty(Constants_1.GroupConstants.KEYS.GUID)) {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_COMPULSORY), "GUID", "GUID", "GUID", "GUID")));
        return response;
    }
    else {
        if (typeof group[Constants_1.GroupConstants.KEYS.GUID] !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "GUID", "GUID", "GUID")));
            return response;
        }
        else {
            if (isFalsy(group[Constants_1.GroupConstants.KEYS.GUID])) {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_GROUP_PROPERTY), "GUID", "GUID", "GUID", "GUID")));
                return response;
            }
        }
    }
    if (group.hasOwnProperty(Constants_1.GroupConstants.KEYS.NAME) && group[Constants_1.GroupConstants.KEYS.NAME] === '') {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.EMPTY_STRING), "GROUP_NAME", "GROUP_NAME", "Group name")));
        return response;
    }
};
exports.validateJoinGroup = function (group, type, password) {
    var response;
    if (typeof group == Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.OBJECT) {
        if (!group.hasOwnProperty(Constants_1.GroupConstants.KEYS.GUID)) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_COMPULSORY), "GUID", "GUID", "GUID", "GUID")));
            return response;
        }
        else {
            if (typeof group[Constants_1.GroupConstants.KEYS.GUID] !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "GUID", "GUID", "GUID")));
                return response;
            }
            else {
                if (isFalsy(group[Constants_1.GroupConstants.KEYS.GUID])) {
                    response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_GROUP_PROPERTY), "GUID", "GUID", "GUID", "GUID")));
                    return response;
                }
            }
        }
        if (!group.hasOwnProperty(Constants_1.GroupConstants.KEYS.TYPE)) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_COMPULSORY), "GROUP_TYPE", "GROUP_TYPE", "Group type", "Group type")));
            return response;
        }
        else {
            if (typeof group[Constants_1.GroupConstants.KEYS.TYPE] !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "GROUP_TYPE", "GROUP_TYPE", "Group type")));
                return response;
            }
            else {
                if (isFalsy(group[Constants_1.GroupConstants.KEYS.TYPE])) {
                    response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_GROUP_PROPERTY), "GROUP_TYPE", "GROUP_TYPE", "type", "type")));
                    return response;
                }
                if (!(group[Constants_1.GroupConstants.KEYS.TYPE].toLowerCase() == CometChat_1.CometChat.GROUP_TYPE.PUBLIC || group[Constants_1.GroupConstants.KEYS.TYPE].toLowerCase() == CometChat_1.CometChat.GROUP_TYPE.PASSWORD || group[Constants_1.GroupConstants.KEYS.TYPE].toLowerCase() == CometChat_1.CometChat.GROUP_TYPE.PROTECTED || group[Constants_1.GroupConstants.KEYS.TYPE].toLowerCase() == CometChat_1.CometChat.GROUP_TYPE.PRIVATE)) {
                    response = new CustomError_1.CometChatException(Constants_1.GroupErrors.INVALID_GROUP_TYPE);
                    return response;
                }
                if (group[Constants_1.GroupConstants.KEYS.TYPE].toLowerCase() == CometChat_1.CometChat.GROUP_TYPE.PASSWORD) {
                    if (!group.hasOwnProperty(Constants_1.GroupConstants.KEYS.PASSWORD)) {
                        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.PASSWORD_COMPULSORY), "PASSWORD", "PASSWORD")));
                        return response;
                    }
                    else {
                        if (typeof group[Constants_1.GroupConstants.KEYS.PASSWORD] !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "PASSWORD", "PASSWORD", "Password")));
                            return response;
                        }
                        else {
                            if (isFalsy(group[Constants_1.GroupConstants.KEYS.PASSWORD])) {
                                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_GROUP_PROPERTY), "PASSWORD", "PASSWORD", "password", "password")));
                                return response;
                            }
                        }
                    }
                }
            }
        }
    }
    else {
        if (group !== undefined) {
            if (typeof group !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "GUID", "GUID", "GUID")));
                return response;
            }
            else {
                if (isFalsy(group)) {
                    response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_GROUP_PROPERTY), "GUID", "GUID", "GUID", "GUID")));
                    return response;
                }
            }
        }
        if (type !== undefined) {
            if (typeof type !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "GROUP_TYPE", "GROUP_TYPE", "Group type")));
                return response;
            }
            else {
                if (isFalsy(type)) {
                    response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_GROUP_PROPERTY), "GROUP_TYPE", "GROUP_TYPE", "type", "type")));
                    return response;
                }
                if (!(type.toLowerCase() == CometChat_1.CometChat.GROUP_TYPE.PUBLIC || type.toLowerCase() == CometChat_1.CometChat.GROUP_TYPE.PASSWORD || type.toLowerCase() == CometChat_1.CometChat.GROUP_TYPE.PROTECTED || type.toLowerCase() == CometChat_1.CometChat.GROUP_TYPE.PRIVATE)) {
                    response = new CustomError_1.CometChatException(Constants_1.GroupErrors.INVALID_GROUP_TYPE);
                    return response;
                }
                if (type.toLowerCase() == CometChat_1.CometChat.GROUP_TYPE.PASSWORD) {
                    if (typeof password !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "PASSWORD", "PASSWORD", "Password")));
                        return response;
                    }
                    else {
                        if (isFalsy(password)) {
                            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_GROUP_PROPERTY), "PASSWORD", "PASSWORD", "password", "password")));
                            return response;
                        }
                    }
                }
            }
        }
    }
};
exports.validateCreateGroup = function (group) {
    var response;
    if (!group.hasOwnProperty(Constants_1.GroupConstants.KEYS.GUID)) {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_COMPULSORY), "GUID", "GUID", "GUID", "GUID")));
        return response;
    }
    else {
        if (typeof group[Constants_1.GroupConstants.KEYS.GUID] !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "GUID", "GUID", "GUID")));
            return response;
        }
        else {
            if (isFalsy(group[Constants_1.GroupConstants.KEYS.GUID])) {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_GROUP_PROPERTY), "GUID", "GUID", "GUID", "GUID")));
                return response;
            }
        }
    }
    if (!group.hasOwnProperty(Constants_1.GroupConstants.KEYS.NAME)) {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_COMPULSORY), "GROUP_NAME", "GROUP_NAME", "Group name", "Group name")));
        return response;
    }
    else {
        if (typeof group[Constants_1.GroupConstants.KEYS.NAME] !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "GROUP_NAME", "GROUP_NAME", "Group name")));
            return response;
        }
        else {
            if (isFalsy(group[Constants_1.GroupConstants.KEYS.NAME])) {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_GROUP_PROPERTY), "GROUP_NAME", "GROUP_NAME", "name", "name")));
                return response;
            }
        }
    }
    if (!group.hasOwnProperty(Constants_1.GroupConstants.KEYS.TYPE)) {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_COMPULSORY), "GROUP_TYPE", "GROUP_TYPE", "Group type", "Group type")));
        return response;
    }
    else {
        if (typeof group[Constants_1.GroupConstants.KEYS.TYPE] !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "GROUP_TYPE", "GROUP_TYPE", "Group type")));
            return response;
        }
        else {
            if (isFalsy(group[Constants_1.GroupConstants.KEYS.TYPE])) {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_GROUP_PROPERTY), "GROUP_TYPE", "GROUP_TYPE", "type", "type")));
                return response;
            }
            if (!(group[Constants_1.GroupConstants.KEYS.TYPE].toLowerCase() == CometChat_1.CometChat.GROUP_TYPE.PUBLIC || group[Constants_1.GroupConstants.KEYS.TYPE].toLowerCase() == CometChat_1.CometChat.GROUP_TYPE.PASSWORD || group[Constants_1.GroupConstants.KEYS.TYPE].toLowerCase() == CometChat_1.CometChat.GROUP_TYPE.PROTECTED || group[Constants_1.GroupConstants.KEYS.TYPE].toLowerCase() == CometChat_1.CometChat.GROUP_TYPE.PRIVATE)) {
                response = new CustomError_1.CometChatException(Constants_1.GroupErrors.INVALID_GROUP_TYPE);
                return response;
            }
            if (group[Constants_1.GroupConstants.KEYS.TYPE].toLowerCase() == CometChat_1.CometChat.GROUP_TYPE.PASSWORD) {
                if (!group.hasOwnProperty(Constants_1.GroupConstants.KEYS.PASSWORD)) {
                    response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.PASSWORD_COMPULSORY), "PASSWORD", "PASSWORD")));
                    return response;
                }
                else {
                    if (typeof group[Constants_1.GroupConstants.KEYS.PASSWORD] !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "PASSWORD", "PASSWORD", "Password")));
                        return response;
                    }
                    else {
                        if (isFalsy(group[Constants_1.GroupConstants.KEYS.PASSWORD])) {
                            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_GROUP_PROPERTY), "PASSWORD", "PASSWORD", "password", "password")));
                            return response;
                        }
                    }
                }
            }
        }
    }
    if (group.hasOwnProperty(Constants_1.GroupConstants.KEYS.TAGS)) {
        if (!Array.isArray(group[Constants_1.GroupConstants.KEYS.TAGS])) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_AN_ARRAY), "GROUP_TAGS", "GROUP_TAGS", "Group tags")));
            return response;
        }
        else {
            if (group[Constants_1.GroupConstants.KEYS.TAGS].length === 0) {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.EMPTY_ARRAY), "GROUP_TAGS", "GROUP_TAGS", "Group tags")));
                return response;
            }
        }
    }
};
exports.validateId = function (id, type) {
    var response;
    if (type === "user") {
        if (typeof id !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "UID", "UID", "UID")));
            return response;
        }
        else {
            if (isFalsy(id)) {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "UID", "UID", "UID", "UID")));
                return response;
            }
        }
    }
    if (type === "group") {
        if (typeof id !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "GUID", "GUID", "GUID")));
            return response;
        }
        else {
            if (isFalsy(id)) {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "GUID", "GUID", "GUID", "GUID")));
                return response;
            }
        }
    }
};
exports.validateHideMessagesFromBlockedUsers = function (bool) {
    var response;
    if (typeof bool !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.BOOLEAN) {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_BOOLEAN), "HIDE_MESSAGES_FROM_BLOCKED_USERS", "HIDE_MESSAGES_FROM_BLOCKED_USERS", "hideMessagesFromBlockedUsers")));
        return response;
    }
};
exports.validateArray = function (array, type) {
    var response, message = 'List should be an array.';
    if (type === 'blockUsers') {
        message = 'blockUsers() method accepts an array of users.';
    }
    else if (type === 'unblockUsers') {
        message = 'unblockUsers() method accepts an array of users.';
    }
    else if (type === 'groupMembers') {
        message = 'addMembersToGroup() method accepts members list as an array of users.';
    }
    else {
        message = 'addMembersToGroup() method accepts bannedMembers list as an array of users.';
    }
    if (typeof array == Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.OBJECT) {
        if (!Array.isArray(array)) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_ARRAY), "USER_LIST", "USER_LIST", message)));
            return response;
        }
    }
    else {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_ARRAY), "USER_LIST", "USER_LIST", message)));
        return response;
    }
};
exports.validateMsgId = function (msgId) {
    var response;
    if (isNaN(msgId)) {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_NUMBER), "MESSAGE_ID", "MESSAGE_ID", "Message Id")));
        return response;
    }
    else {
        if (isFalsy(msgId)) {
            response = new CustomError_1.CometChatException(CometChatErrorConstants_1.ERRORS.PARAMETER_MISSING);
            return response;
        }
    }
};
exports.validateChatType = function (type) {
    var response;
    if (typeof type !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "RECEIVER_TYPE", "RECEIVER_TYPE", "Receiver type")));
        return response;
    }
    else {
        if (isFalsy(type)) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "RECEIVER_TYPE", "RECEIVER_TYPE", "receiver type", "receiver type")));
            return response;
        }
        else {
            if (!(type == Constants_1.MessageConstatnts.RECEIVER_TYPE.GROUP || type == Constants_1.MessageConstatnts.RECEIVER_TYPE.USER)) {
                response = new CustomError_1.CometChatException(Constants_1.MessageErrors.INVALID_RECEIVER_TYPE);
                return response;
            }
        }
    }
};
exports.validateMessage = function (message) {
    var response = message;
    var tempMessage = message;
    if (typeof (tempMessage.getReceiverId()) !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "RECEIVER_ID", "RECEIVER_ID", "Receiver Id")));
        return response;
    }
    else {
        if (isFalsy(tempMessage.getReceiverId())) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "RECEIVER_ID", "RECEIVER_ID", "receiver id", "receiver id")));
            return response;
        }
    }
    if (typeof (tempMessage.getReceiverType()) !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "RECEIVER_TYPE", "RECEIVER_TYPE", "Receiver Type")));
        return response;
    }
    else {
        if (isFalsy(tempMessage.getReceiverType())) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "RECEIVER_TYPE", "RECEIVER_TYPE", "receiver type", "receiver type")));
            return response;
        }
        else {
            if ((tempMessage.getReceiverType() != Constants_1.MessageConstatnts.RECEIVER_TYPE.GROUP && tempMessage.getReceiverType() != Constants_1.MessageConstatnts.RECEIVER_TYPE.USER)) {
                response = new CustomError_1.CometChatException(Constants_1.MessageErrors.INVALID_RECEIVER_TYPE);
                return response;
            }
        }
    }
    if (message instanceof TextMessage_1.TextMessage) {
        var tempMessage_1 = message;
        if (typeof tempMessage_1.getText() !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "MESSAGE_TEXT", "MESSAGE_TEXT", "Message text")));
            return response;
        }
        else {
            if (tempMessage_1.getText().trim() === '') {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.EMPTY_STRING), "MESSAGE_TEXT", "MESSAGE_TEXT", "Message text")));
                return response;
            }
        }
    }
    if (message instanceof MediaMessage_1.MediaMessage) {
        var tempMessage_2 = message;
        if (tempMessage_2.getData() && tempMessage_2.getData().hasOwnProperty("attachments")) {
            var attachments = tempMessage_2.getAttachments();
            for (var i = 0; i < attachments.length; i++) {
                if (!attachments[i].getExtension()) {
                    response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MISSING_KEY), "extension", "Attachment")));
                    return response;
                }
                if (!attachments[i].getMimeType()) {
                    response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MISSING_KEY), "mimeType", "Attachment")));
                    return response;
                }
                if (!attachments[i].getName()) {
                    response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MISSING_KEY), "name", "Attachment")));
                    return response;
                }
                if (!attachments[i].getUrl()) {
                    response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MISSING_KEY), "url", "Attachment")));
                    return response;
                }
            }
        }
        var multipleFileAttached = tempMessage_2.hasOwnProperty("files");
        if (multipleFileAttached) {
            for (var i = 0; i < tempMessage_2["files"]["length"]; i++) {
                if (!(tempMessage_2["files"][i] instanceof Blob)) {
                    response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_BLOB), "MEDIA_OBJECT", "MEDIA_OBJECT", "Media object")));
                    return response;
                }
            }
        }
    }
    if (message instanceof CustomMessage_1.CustomMessage) {
        var tempMessage_3 = message;
        if (isFalsy(tempMessage_3.getCustomData())) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "CUSTOM_DATA", "CUSTOM_DATA", "custom data", "custom data")));
            return response;
        }
    }
};
exports.validateCreateUser = function (user) {
    var response;
    if (!user.hasOwnProperty(Constants_1.UserConstants.UID)) {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_COMPULSORY), "UID", "UID", "UID", "UID")));
        return response;
    }
    else {
        if (typeof user[Constants_1.UserConstants.UID] !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "UID", "UID", "UID")));
            return response;
        }
        else {
            if (isFalsy(user[Constants_1.UserConstants.UID])) {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_USER_PROPERTY), "UID", "UID", "UID", "UID")));
                return response;
            }
        }
    }
    if (!user.hasOwnProperty(Constants_1.UserConstants.NAME)) {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_COMPULSORY), "USER_NAME", "USER_NAME", "User name", "User name")));
        return response;
    }
    else {
        if (typeof user[Constants_1.UserConstants.NAME] !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "USER_NAME", "USER_NAME", "User name")));
            return response;
        }
        else {
            if (isFalsy(user[Constants_1.UserConstants.NAME])) {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_USER_PROPERTY), "USER_NAME", "USER_NAME", "name", "name")));
                return response;
            }
        }
    }
    if (user.hasOwnProperty(Constants_1.UserConstants.AVATAR) && user[Constants_1.UserConstants.AVATAR] === '') {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.EMPTY_STRING), "USER_AVATAR", "USER_AVATAR", "User avatar")));
        return response;
    }
    if (user.hasOwnProperty(Constants_1.UserConstants.META_DATA) && user[Constants_1.UserConstants.META_DATA] === '') {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.EMPTY_STRING), "USER_METADATA", "USER_METADATA", "User metadata")));
        return response;
    }
    if (user.hasOwnProperty(Constants_1.UserConstants.LINK) && user[Constants_1.UserConstants.LINK] === '') {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.EMPTY_STRING), "USER_LINK", "USER_LINK", "User link")));
        return response;
    }
    if (user.hasOwnProperty(Constants_1.UserConstants.STATUS_MESSAGE) && user[Constants_1.UserConstants.STATUS_MESSAGE] === '') {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.EMPTY_STRING), "USER_STATUS_MESSAGE", "USER_STATUS_MESSAGE", "User status message")));
        return response;
    }
    if (user.hasOwnProperty(Constants_1.UserConstants.ROLE) && user[Constants_1.UserConstants.ROLE] === '') {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.EMPTY_STRING), "USER_ROLE", "USER_ROLE", "User role")));
        return response;
    }
    if (user.hasOwnProperty(Constants_1.UserConstants.TAGS)) {
        if (!Array.isArray(user[Constants_1.UserConstants.TAGS])) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_AN_ARRAY), "USER_TAGS", "USER_TAGS", "User tags")));
            return response;
        }
        else {
            if (user[Constants_1.UserConstants.TAGS].length === 0) {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.EMPTY_ARRAY), "USER_TAGS", "USER_TAGS", "User tags")));
                return response;
            }
        }
    }
};
exports.validateUpdateUser = function (user) {
    var response;
    if (!user.hasOwnProperty(Constants_1.UserConstants.UID)) {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_COMPULSORY), "UID", "UID", "UID", "UID")));
        return response;
    }
    else {
        if (typeof user[Constants_1.UserConstants.UID] !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "UID", "UID", "UID")));
            return response;
        }
        else {
            if (isFalsy(user[Constants_1.UserConstants.UID])) {
                response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID_USER_PROPERTY), "UID", "UID", "UID", "UID")));
                return response;
            }
        }
    }
    if (user.hasOwnProperty(Constants_1.UserConstants.NAME) && user[Constants_1.UserConstants.NAME] === '') {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.EMPTY_STRING), "USER_NAME", "USER_NAME", "User name")));
        return response;
    }
};
exports.validateConversationType = function (conversationType) {
    var response;
    if (typeof conversationType !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
        response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_STRING), "CONVERSATION_TYPE", "CONVERSATION_TYPE", "Conversation type")));
        return response;
    }
    else {
        if (isFalsy(conversationType)) {
            response = new CustomError_1.CometChatException(JSON.parse(format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "CONVERSATION_TYPE", "CONVERSATION_TYPE", "conversation type", "conversation type")));
            return response;
        }
        else {
            conversationType = conversationType.toLowerCase();
            if (!(conversationType == CometChat_1.CometChat.RECEIVER_TYPE.USER || conversationType == CometChat_1.CometChat.RECEIVER_TYPE.GROUP)) {
                response = new CustomError_1.CometChatException(Constants_1.ConversationErrors.INVALID_CONVERSATION_TYPE);
                return response;
            }
        }
    }
};


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.ONLINE_MEMBER_COUNT_API = exports.JWT_API = exports.ProsodyApiErrors = exports.PROSODY_API = exports.API_ERROR_CODES = exports.SESSION_STORE = exports.CONNECTION_STATUS = exports.COMMON_UTILITY_CONSTANTS = exports.APP_SETTINGS = exports.PresenceConstatnts = exports.FeatureRestrictionErrors = exports.MessageErrors = exports.ExtensionErrors = exports.ConversationErrors = exports.GroupErrors = exports.UserErrors = exports.ReceiptErrors = exports.GENERAL_ERROR = exports.PARAMETER_ERROR = exports.CALL_ERROR = exports.Errors = exports.UserConstants = exports.GroupMemersConstans = exports.GroupConstants = exports.CallConstants = exports.BlockedUsersConstants = exports.ActionConstatnts = exports.TYPING_NOTIFICATION = exports.MessageCategory = exports.ATTACHMENTS_CONSTANTS = exports.MessageConstatnts = exports.READ_RECEIPTS = exports.DELIVERY_RECEIPTS = exports.ResponseConstants = exports.LOCAL_STORE = exports.ANALYTICS = exports.WS = exports.SDKHeader = exports.APPINFO = exports.GROUP_MEMBER_SCOPE = exports.GroupMemberScope = exports.GROUP_TYPE = exports.GroupType = exports.CALLING_COMPONENT_VERSION = exports.DEFAULT_VALUES = exports.constants = void 0;
var CustomError_1 = __webpack_require__(2);
exports.constants = {
    DEFAULT_STORE: "cometchat",
    MSG_VER_PRE: "store-ver-pre",
    MSG_VER_POST: "store-ver-post",
};
exports.DEFAULT_VALUES = {
    ZERO: 0,
    MSGS_LIMIT: 30,
    MSGS_MAX_LIMIT: 100,
    USERS_LIMIT: 30,
    USERS_MAX_LIMIT: 100,
    GROUPS_LIMIT: 30,
    GROUPS_MAX_LIMIT: 100,
    CONVERSATION_MAX_LIMIT: 50,
    CALL_TIMEOUT: 45,
    DEFAULT_MSG_ID: 0,
    DEFAULT_MAX_TYPING_INDICATOR_LIMIT: 5,
    REGION_DEFAULT: "eu",
    REGION_DEFAULT_EU: "eu",
    REGION_DEFAULT_US: "us",
    REGION_DEFAULT_IN: "in",
    REGION_DEFAULT_PRIVATE: "private",
};
exports.CALLING_COMPONENT_VERSION = 5;
var GroupType;
(function (GroupType) {
    GroupType["Public"] = "public";
    GroupType["Private"] = "private";
    GroupType["Protected"] = "protected";
    GroupType["Password"] = "password";
})(GroupType = exports.GroupType || (exports.GroupType = {}));
exports.GROUP_TYPE = {
    PUBLIC: "public",
    PRIVATE: "private",
    PROTECTED: "password",
    PASSWORD: "password"
};
var GroupMemberScope;
(function (GroupMemberScope) {
    GroupMemberScope["Admin"] = "admin";
    GroupMemberScope["Moderator"] = "moderator";
    GroupMemberScope["Member"] = "member";
})(GroupMemberScope = exports.GroupMemberScope || (exports.GroupMemberScope = {}));
exports.GROUP_MEMBER_SCOPE = {
    ADMIN: "admin",
    MODERATOR: "moderator",
    PARTICIPANT: "participant"
};
exports.APPINFO = {
    platform: "WEB",
    sdkVersion: "v4.0.0-beta4",
    apiVersion: "v3.0",
    sdkVersionWithUnderScore: "4_0_0_beta4"
};
exports.SDKHeader = {
    platform: 'javascript',
    sdkVersion: '4.0.0-beta4',
    sdk: "%s@%s",
};
exports.WS = {
    CONVERSATION: {
        TYPE: {
            CHAT: "chat",
            GROUP_CHAT: "groupchat"
        }
    }
};
exports.ANALYTICS = {
    analyticsHost: "metrics-%s.cometchat.io",
    analyticsVersion: "v1"
};
exports.LOCAL_STORE = {
    COMMON_STORE: "common_store",
    MESSAGE_LISTENERS_LIST: "message_listeners_list",
    USERS_STORE: "users_store",
    MESSAGES_STORE: "messages_store",
    KEYS_STORE: "keys_store",
    STORE_STRING: "%s:%s",
    KEY_STRING: "%s/%s",
    KEY_USER: "user",
    KEY_APP_SETTINGS: "app_settings",
    KEY_APP_ID: "appId",
    KEY_DEVICE_ID: "deviceId",
    KEY_MESSAGE_LISTENER_LIST: "all"
};
exports.ResponseConstants = {
    RESPONSE_KEYS: {
        KEY_DATA: "data",
        KEY_META: "meta",
        KEY_CURSOR: "cursor",
        KEY_ACTION: "action",
        KEY_MESSAGE: "message",
        KEY_ERROR: "error",
        KEY_ERROR_DETAILS: "details",
        KEY_ERROR_CODE: "code",
        KEY_ERROR_MESSAGE: "message",
        KEY_AUTH_TOKEN: "authToken",
        KEY_WS_CHANNEL: "wsChannel",
        KEY_IDENTITY: "identity",
        KEY_SERVICE: "identity",
        KEY_ENTITIES: "entities",
        KEY_ENTITITY: "entity",
        KEY_ENTITYTYPE: "entityType",
        KEY_ATTACHMENTS: "attachments",
        CODE_REQUEST_OK: 200,
        CODE_BAD_REQUEST: 401,
        UNREAD_UNDELIVERED_KEYS: {
            ENTITY: "entity",
            ENTITY_TYPE: "entityType",
            ENTITY_Id: "entityId",
            COUNT: "count"
        }, GROUP_MEMBERS_RESPONSE: {
            SUCCESS: "success",
            ERROR: "error",
            MESSAGE: "message"
        }, KEY_ENTITY_TYPE: {
            USER: "user",
            GROUP: "group"
        }
    }
};
exports.DELIVERY_RECEIPTS = {
    RECEIVER_ID: "receiverId",
    RECEIVER_TYPE: "type",
    RECIPIENT: "recipient",
    MESSAGE_ID: "messageId",
    RECEIVED: "delivered",
    DELIVERED_AT: 'deliveredAt',
    ID: 'id',
    TIME: 'time',
    DELIVERED_TO_ME_AT: "deliveredToMeAt"
};
exports.READ_RECEIPTS = {
    RECEIVER_ID: "receiverId",
    RECEIVER_TYPE: "type",
    RECIPIENT: "recipient",
    MESSAGE_ID: "messageId",
    READ: "read",
    READ_AT: 'readAt',
    ID: 'id',
    TIME: 'time',
    READ_BY_ME_AT: 'readByMeAt'
};
exports.MessageConstatnts = {
    TYPE: {
        TEXT: "text",
        MEDIA: "media",
        IMAGE: "image",
        VIDEO: "video",
        AUDIO: "audio",
        FILE: "file",
        CUSTOM: "custom"
    },
    CATEGORY: {
        MESSAGE: "message",
        ACTION: "action",
        CALL: "call",
        CUSTOM: 'custom'
    }, RECEIVER_TYPE: {
        USER: 'user',
        GROUP: 'group'
    },
    KEYS: {
        ATTATCHMENT: "attatchment",
        ATTATCHMENTS: "attachments",
        ACTION: 'action',
        TYPE: 'type',
        DATA: 'data',
        ID: 'id',
        MUID: 'muid',
        SENDER: 'sender',
        RECEIVER: 'receiver',
        RECEIVER_ID: 'receiverId',
        CATEGORY: 'category',
        RECEIVER_TYPE: 'receiverType',
        SENT_AT: 'sentAt',
        STATUS: 'status',
        TEXT: "text",
        URL: "url",
        METADATA: "metadata",
        RECEIPTS: "receipts",
        MY_RECEIPTS: "myReceipt",
        CUSTOM_DATA: "customData",
        CUSTOM_SUB_TYPE: "subType",
        RESOURCE: "resource"
    }, KNOWN_MEDIA_TYPE: {
        IMAGE: [],
        VIDEO: [],
        AUDIO: [],
        FILE: []
    }, PAGINATION: {
        AFFIX: {
            APPEND: 'append',
            PREPEND: 'prepend'
        },
        CURSOR_FILEDS: {
            ID: 'id',
            SENT_AT: 'sentAt',
        },
        CURSOR_AFFIX_DEFAULT: "prepend",
        CURSOR_FIELD_DEFAULT: "sentAt",
        KEYS: {
            PER_PAGE: "per_page",
            CURSOR_AFFIX: "cursorAffix",
            AFFIX: "affix",
            CURSOR_FIELD: "cursorField",
            CURSOR_VALUE: "cursorValue",
            UID: "uid",
            SENT_AT: "sentAt",
            ID: 'id',
            CURRENT_PAGE: 'page',
            UNREAD: "unread",
            HIDE_MESSAGES_FROM_BLOCKED_USER: "hideMessagesFromBlockedUsers",
            SEARCH_KEY: "searchKey",
            ONLY_UPDATES: "onlyUpdates",
            UPDATED_AT: "updatedAt",
            CATEGORY: "category",
            CATEGORIES: "categories",
            TYPE: "type",
            TYPES: "types",
            HIDE_REPLIES: "hideReplies",
            HIDE_DELETED_MESSAGES: "hideDeleted",
            WITH_TAGS: "withTags",
            TAGS: "tags"
        }
    }
};
exports.ATTACHMENTS_CONSTANTS = {
    KEYS: {
        EXTENSION: "extension",
        MIME_TYPE: "mimeType",
        NAME: "name",
        SIZE: "size",
        URL: "url"
    }
};
var MessageCategory;
(function (MessageCategory) {
    MessageCategory["ACTION"] = "action";
    MessageCategory["MESSAGE"] = "message";
    MessageCategory["CALL"] = "call";
    MessageCategory["CUSTOM"] = "custom";
})(MessageCategory = exports.MessageCategory || (exports.MessageCategory = {}));
exports.TYPING_NOTIFICATION = {
    RECEIVER_ID: "receiverId",
    RECEIVER_TYPE: "receiverType",
    META: "metadata",
    KEYS: {
        TYPING_NOTIFICATION: "typingNotification",
        TIMESTAMP: "timestamp"
    },
    ACTIONS: {
        STARTED: "started",
        ENDED: "ended"
    }
};
exports.ActionConstatnts = {
    ACTION_SUBJECTS: {
        ACTION_ON: "on",
        ACTION_BY: "by",
        ACTION_FOR: "for"
    }, ACTION_ENTITY_TYPE: {
        GROUP_USER: "groupuser",
        USER: "user",
        GROUP: "group",
        MESSAGE: "message"
    }, ACTION_KEYS: {
        ACTION_CREATED: "created",
        ACTION_UPDATED: "updated",
        ACTION_DELETED: "deleted",
        ENTITIES: "entities",
        ENTITY: "entity",
        ENTITY_TYPE: "entityType",
        TYPE_MEMBER_JOINED: "joined",
        TYPE_MEMBER_LEFT: "left",
        TYPE_MEMBER_KICKED: "kicked",
        TYPE_MEMBER_BANNED: "banned",
        TYPE_MEMBER_UNBANNED: "unbanned",
        TYPE_MEMBER_INVITED: "invited",
        TYPE_MEMBER_ADDED: "added",
        ACTION_SCOPE_CHANGED: "scopeChanged",
        ACTION_TYPE_USER: "user",
        ACTION_TYPE_GROUP: "group",
        ACTION_TYPE_GROUP_MEMBER: "groupMember",
        TYPE_MESSAGE_EDITED: "edited",
        TYPE_MESSAGE_DELETED: "deleted",
        ACTION_TYPE_CALL: "call",
        EXTRAS: "extras",
        SCOPE: "scope",
        NEW: "new",
        OLD: "old"
    }, ActionMessages: {
        ACTION_GROUP_JOINED_MESSAGE: "%s joined",
        ACTION_GROUP_LEFT_MESSAGE: "%s left",
        ACTION_MEMBER_KICKED_MESSAGE: "%s kicked %s",
        ACTION_MEMBER_BANNED_MESSAGE: "%s banned %s",
        ACTION_MEMBER_UNBANNED_MESSAGE: "%s unbanned %s",
        ACTION_MEMBER_INVITED_MESSAGE: "%s banned %s",
        ACTION_MESSAGE_EDITED_MESSAGE: " Message Edited",
        ACTION_MESSAGE_DELETED_MESSAGE: "Message Deleted",
        ACTION_MEMBER_SCOPE_CHANGED: "%s made %s %s",
        ACTION_MEMBER_ADDED_TO_GROUP: "%s added %s"
    }, ACTION_TYPE: {
        TYPE_MEMBER_JOINED: "joined",
        TYPE_MEMBER_LEFT: "left",
        TYPE_MEMBER_KICKED: "kicked",
        TYPE_MEMBER_BANNED: "banned",
        TYPE_MEMBER_UNBANNED: "unbanned",
        TYPE_MEMBER_INVITED: "invited",
        TYPE_MEMBER_SCOPE_CHANGED: "scopeChanged",
        TYPE_MESSAGE: "message",
        TYPE_MESSAGE_EDITED: "edited",
        TYPE_MESSAGE_DELETED: "deleted",
        TYPE_MEMBER_ADDED: "added",
    }, ACTIONS: {
        MEMBER_ADDED: "added",
        MEMBER_JOINED: "joined",
        MEMBER_LEFT: "left",
        MEMBER_KICKED: "kicked",
        MEMBER_BANNED: "banned",
        MEMBER_UNBANNED: "unbanned",
        MEMBER_INVITED: "invited",
        MEMBER_SCOPE_CHANGED: "scopeChanged",
        MESSAGE_EDITED: "edited",
        MESSSAGE_DELETED: "deleted",
        TYPE_USER: "user",
        TYPE_GROUP: "group",
        TYPE_GROUP_MEMBER: "groupMember"
    }
};
exports.BlockedUsersConstants = {
    REQUEST_KEYS: {
        DIRECTIONS: {
            BOTH: "both",
            HAS_BLOCKED_ME: "hasBlockedMe",
            BLOCKED_BY_ME: "blockedByMe",
        }
    }
};
exports.CallConstants = {
    CALL_MODE: {
        DEFAULT: "DEFAULT",
        SPOTLIGHT: "SPOTLIGHT",
        SINGLE: "SINGLE",
        TILE: "TILE",
        GRID: "GRID"
    },
    CALL_TYPE: {
        AUDIO: "audio",
        VIDEO: "video",
    },
    RECEIVER_TYPE_GROUP: "group",
    RECEIVER_TYPE_USER: "user",
    CALL_KEYS: {
        CALL_DATA: "data",
        CALL_ID: "id",
        CALL_SESSION_ID: "sessionid",
        CALL_RECEIVER: "receiver",
        CALL_SENDER: "sender",
        CALL_RECEIVER_TYPE: "receiverType",
        CALL_STATUS: "status",
        CALL_TYPE: "type",
        CALL_INITIATED_AT: "initiatedAt",
        CALL_JOINED_AT: "joinedAt",
        CALL_LEFT_AT: "leftAt",
        CALL_METADATA: "metadata",
        CALL_ENTITIES: "entities",
        CALL_ENTITY_TYPE: "entityType",
        CALL_ENTITY: "entity",
        CALL_ENTITY_USER: "user",
        CALL_ENTITY_GROUP: "group",
    },
    CALL_STATUS: {
        INITIATED: "initiated",
        ONGOING: "ongoing",
        UNANSWERED: "unanswered",
        REJECTED: "rejected",
        BUSY: "busy",
        CANCELLED: "cancelled",
        ENDED: "ended",
    },
    AUDIO_INPUT_DEVICES: "audioInputDevices",
    AUDIO_OUTPUT_DEVICES: "audioOutputDevices",
    VIDEO_INPUT_DEVICES: "videoInputDevices",
    POST_MESSAGES: {
        TYPES: {
            ACTION_MESSAGE: "cometchat_action_message",
            HANGUP: "hangup",
            COMETCHAT_RTC_SETTINGS: "cometchat_rtc_settings"
        },
        ACTIONS: {
            USER_JOINED: "onUserJoined",
            USER_LEFT: "onUserLeft",
            USER_LIST_CHANGED: "onUserListChanged",
            INITIAL_DEVICE_LIST: "initialDeviceList",
            DEVICE_CHANGE: "onDeviceChange",
            LOAD: "LOAD",
            CHANGE_AUDIO_INPUT: "changeAudioInput",
            CHANGE_AUDIO_OUTPUT: "changeAudioOutput",
            CHANGE_VIDEO_INPUT: "changeVideoInput",
            MUTE_AUDIO: "muteAudio",
            UNMUTE_AUDIO: "unMuteAudio",
            PAUSE_VIDEO: "pauseVideo",
            UNPAUSE_VIDEO: "unPauseVideo",
            SWITCH_MODE: "switchMode",
            START_SCREENSHARE: "startScreenShare",
            STOP_SCREENSHARE: "stopScreenShare",
            END_CALL: "endCall",
            START_RECORDING: "startRecording",
            STOP_RECORDING: "stopRecording",
            RECORDING_TOGGLED: "onRecordingToggled",
            USER_MUTED: "onUserMuted",
            SCREEN_SHARE_STARTED: "SCREEN_SHARE_STARTED",
            SCREEN_SHARE_STOPPED: "SCREEN_SHARE_ENDED",
            SWITCH_TO_VIDEO_CALL: "switchedToVideo",
            SWITCHED_TO_VIDEO_CALL: "onCallSwitchedToVideo",
            OPEN_VIRTUAL_BACKGROUND: "openVirtualBackgroundMenu",
            SET_BACKGROUND_BLUR: "setBackgroundBlur",
            SET_BACKGROUND_IMAGE: "setBackgroundImage"
        }
    },
    MEDIA_DEVICE: {
        ID: "id",
        NAME: "name",
        ACTIVE: "active"
    },
    ZOOM_BUTTON_DEFAULT_PARAMS: {
        position: "bottom-right",
        visible: true
    },
    NAME_LABEL_DEFAULT_PARAMS: {
        position: "bottom-left",
        visible: true,
        color: "rgba(27, 27, 27, 0.4)"
    },
    NETWORK_LABEL_DEFAULT_PARAMS: {
        position: "bottom-right",
        visible: true
    },
    MAIN_VIDEO_CONTAINER_SETTINGS: {
        KEYS: {
            POSITION: "position",
            VISIBILITY: "visible",
            COLOR: "color"
        }
    }
};
exports.GroupConstants = {
    KEYS: {
        NAME: 'name',
        GUID: 'guid',
        TYPE: 'type',
        PASSWORD: 'password',
        ICON: 'icon',
        DESCRIPTION: 'description',
        OWNER: 'owner',
        METADATA: 'metadata',
        CREATED_AT: 'createdAt',
        UPDATED_AT: 'updatedAt',
        HAS_JOINED: 'hasJoined',
        WS_CHANNEL: 'wsChannel',
        TAGS: "tags"
    }
};
exports.GroupMemersConstans = {
    KEYS: {
        SCOPE: 'scope',
        UID: 'uid',
        GUID: 'guid',
        USER: 'user',
        NAME: 'name'
    }
};
exports.UserConstants = {
    UID: 'uid',
    NAME: 'name',
    AUTH_TOKEN: 'authToken',
    AVATAR: 'avatar',
    LAST_ACTIVE_AT: 'lastActiveAt',
    LINK: 'link',
    META_DATA: 'metadata',
    ROLE: 'role',
    STATUS: 'status',
    STATUS_MESSAGE: 'statusMessage',
    USER_NAME: 'user_name',
    TAGS: 'tags',
    SORT_BY: {
        NAME: "name",
        STATUS: "status"
    },
    SORT_ORDER: {
        ASCENDING: "asc",
        DESCENDING: "desc"
    }
};
exports.Errors = {
    ERROR_IO_EXCEPTION: "ERROR_IO_EXCEPTION",
    ERROR_JSON_EXCEPTION: "ERROR_JSON_EXCEPTION",
    ERROR_PASSWORD_MISSING: "ERROR_PASSWORD_MISSING",
    ERROR_LIMIT_EXCEEDED: "ERROR_LIMIT_EXCEEDED",
    ERROR_USER_NOT_LOGGED_IN: "ERROR_USER_NOT_LOGGED_IN",
    ERROR_INVALID_GUID: "ERROR_INVALID_GUID",
    ERROR_PASSWORD_MISSING_MESSAGE: "Password is mandatory for a password group",
    ERROR_LIMIT_EXCEEDED_MESSAGE: "Limit Exceeded Max limit of %s",
    ERROR_USER_NOT_LOGGED_IN_MESSAGE: "Please log in to CometChat before calling this method",
    ERROR_INVALID_GUID_MESSAGE: "Please provide a valid GUID",
    ERROR_DEFAULT_MESSAGE: "Something went wrong",
    ERR_SETTINGS_HASH_OUTDATED: "ERR_SETTINGS_HASH_OUTDATED",
    ERR_NO_AUTH: "ERR_NO_AUTH",
};
exports.CALL_ERROR = {
    CALL_ALREADY_INITIATED: {
        code: "CALL_ALREADY_INITIATED",
        name: "CALL_ALREADY_INITIATED",
        message: "There is already call in progress",
        details: {}
    },
    ERROR_IN_CALLING: {
        code: "CALL_IN_PROGRESS",
        name: "CALL_ALREADY_INITIATED",
        message: "There is already call in progress",
        details: {}
    },
    CANNOT_ACCEPT_CALL: {
        code: "CALL_IN_PROGRESS",
        name: "CALL_IN_PROGRESS",
        message: "There is already a call in progress",
        details: {}
    },
    NOT_INITIALIZED: {
        code: "NOT_INITIALIZED",
        name: 'NOT_INITIALIZED',
        message: "Please call the CometChat.init() method before calling any other methods related to CometChat.",
        details: {}
    },
    NOT_LOGGED_IN: {
        code: "NOT_LOGGED_IN",
        name: 'NOT_LOGGED_IN',
        message: "Please login before starting a call.",
        details: {}
    },
    SESSION_ID_REQUIRED: {
        code: "SESSION_ID_REQUIRED",
        name: 'SESSION_ID_REQUIRED',
        message: "Please make sure you are passing correct session id.",
        details: {}
    },
    CALL_SETTINGS_REQUIRED: {
        code: "CALL_SETTINGS_REQUIRED",
        name: 'CALL_SETTINGS_REQUIRED',
        message: "Please make sure you are passing the call settings object.",
        details: {}
    },
    JWT_NOT_FOUND: {
        code: "JWT_NOT_FOUND",
        name: "JWT_NOT_FOUND",
        message: "There was some issue while fetching JWT from API.",
        details: {}
    }
};
exports.PARAMETER_ERROR = {
    PARAMETER_REQUIRED: {
        code: "%s_NOT_PROVIDED",
        name: "%s_NOT_PROVIDED",
        message: "please provide the %s.",
        details: {}
    }
};
exports.GENERAL_ERROR = {
    MUST_BE_A_STRING: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "%s should be a string.",
        details: {}
    },
    MUST_BE_A_NUMBER: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "%s should be a number.",
        details: {},
    },
    MUST_BE_A_OBJECT: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "%s should be a object.",
        details: {}
    },
    MUST_BE_AN_ARRAY: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "%s should be an array.",
        details: {}
    },
    MUST_BE_A_BOOLEAN: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "%s should be a boolean.",
        details: {}
    },
    MUST_BE_A_BLOB: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "%s should be a blob.",
        details: {}
    },
    INVALID: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "Invalid %s. Please provide a valid %s.",
        details: {}
    },
    METHOD_COMPULSORY: {
        code: "%s_IS_COMPULSORY",
        name: "%s_IS_COMPULSORY",
        message: "%s is required.",
        details: {}
    },
    LIMIT_EXCEEDED: {
        code: "ERROR_%s_EXCEEDED",
        name: "ERROR_%s_EXCEEDED",
        message: "Limit exceeded max limit of %s.",
        details: {}
    },
    MUST_BE_A_POSITIVE_NUMBER: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "%s should be a postive integer greater than 0.",
        details: {}
    },
    INVALID_MEDIA_FILE: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "The message type does not match the file's mime type.",
        details: {}
    },
    EMPTY_STRING: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "%s cannot be empty.",
        details: {}
    },
    MISSING_KEY: {
        code: "MISSING_KEY",
        name: "MISSING_KEY",
        message: "The key %s is missing from the %s object.",
        details: {}
    },
    EMPTY_ARRAY: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "The parameter %s should be an array and it cannot be empty.",
        details: {}
    },
    INVALID_SEARCH_KEYWORD: {
        code: "INVALID_SEARCH_KEYWORD",
        name: "INVALID_SEARCH_KEYWORD",
        message: "Invalid search keyword. Please provide a valid search keyword.",
        details: {}
    },
    INVALID_GROUP_PROPERTY: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "Invalid %s provided for the group. Please provide a valid %s.",
        details: {}
    },
    INVALID_USER_PROPERTY: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "Invalid %s provided for a user. Please provide a valid %s.",
        details: {}
    },
    PARAMETER_MUST_BE_A_NUMBER: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "%s method accepts parameter as a number.",
        details: {}
    },
    PARAMETER_MUST_BE_AN_ARRAY: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "%s method accepts parameter as an array.",
        details: {}
    },
    PARAMETER_MUST_BE_A_BOOLEAN: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "%s method accepts parameter as a boolean.",
        details: {}
    },
    PARAMETER_MUST_BE_A_POSITIVE_NUMBER: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "%s method accepts parameter to be a positive number greater than 0.",
        details: {}
    },
    PARAMETER_MUST_BE_A_STRING: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "%s method accepts parameter as a string.",
        details: {}
    },
    PARAMETER_COMPULSORY: {
        code: "%s_IS_COMPULSORY",
        name: "%s_IS_COMPULSORY",
        message: "%s cannot be blank. Please provide a valid %s.",
        details: {}
    },
    PASSWORD_COMPULSORY: {
        code: "%s_IS_COMPULSORY",
        name: "%s_IS_COMPULSORY",
        message: "Password is mandatory for a password group.",
        details: {}
    },
    INVALID_ARRAY: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "%s",
        details: {}
    }
};
exports.ReceiptErrors = {
    MISSING_PARAMETERS: {
        code: "MISSING_PARAMETERS",
        name: "MISSING_PARAMETERS",
        message: "Expected 4 parameters received 3",
        details: {}
    },
    INVALID_PARAMETER: {
        code: "INVALID_%s",
        name: "INVALID_%s",
        message: "%s",
        details: {}
    },
    NO_WEBSOCKET_CONNECTION: {
        code: "NO_WEBSOCKET_CONNECTION",
        name: "NO_WEBSOCKET_CONNECTION",
        message: "Connection to our Websockets server is broken. Please retry after some time.",
        details: {}
    },
    RECEIPTS_TEMPORARILY_BLOCKED: {
        code: "RECEIPTS_TEMPORARILY_BLOCKED",
        name: "RECEIPTS_TEMPORARILY_BLOCKED",
        message: "Due to high load. Receipts have been blocked for your app.",
        details: {}
    },
    UNKNOWN_ERROR_OCCURRED: {
        code: "UNKNOWN_ERROR_OCCURRED",
        name: "UNKNOWN_ERROR_OCCURRED",
        message: "Unknown error occurred while marking a message as read.",
        details: {}
    }
};
exports.UserErrors = {
    INVALID_STATUS: new CustomError_1.CometChatException({
        code: "INVALID_STATUS_VALUE",
        name: "INVALID_STATUS_VALUE",
        message: "The `status` parameter accepts only `online` or `offline`.",
        details: "",
    }),
    INVALID_DIRECTION: new CustomError_1.CometChatException({
        code: "INVALID_DIRECTION_VALUE",
        name: "INVALID_DIRECTION_VALUE",
        message: "The `direction` parameter accepts only `both`, `blockeyByMe` or `hasBlockedMe`.",
        details: "",
    }),
    USER_NOT_LOGGED_IN: new CustomError_1.CometChatException({
        code: "USER_NOT_LOGGED_IN",
        name: "USER_NOT_LOGGED_IN",
        message: "Please log in to CometChat before calling this method.",
        details: "",
    }),
};
exports.GroupErrors = {
    NOT_A_GROUP: new CustomError_1.CometChatException({
        code: "NOT_A_GROUP",
        message: "Please use group class to construct a new group."
    }),
    INVALID_SCOPE: new CustomError_1.CometChatException({
        code: "INVALID_SCOPE_VALUE",
        name: "INVALID_SCOPE_VALUE",
        message: "Scope can be `admin`, `moderator` or `participant`.",
        details: "",
    }),
    INVALID_GROUP_TYPE: new CustomError_1.CometChatException({
        code: "INVALID_GROUP_TYPE",
        name: "INVALID_GROUP_TYPE",
        message: "Group type can be `public`, `private`, `protected` or `password`.",
        details: "",
    })
};
exports.ConversationErrors = {
    INVALID_CONVERSATION_TYPE: {
        code: "INVALID_CONVERSATION_TYPE",
        name: "INVALID_CONVERSATION_TYPE",
        message: "Conversation type can be `user` or `group`.",
        details: "Please check the value of conversationType.",
    },
    CONVERSATION_NOT_FOUND: {
        code: "CONVERSATION_NOT_FOUND",
        name: "CONVERSATION_NOT_FOUND",
        message: "Conversation for %s %s not found.",
        details: "Please check the value of conversationWith and conversationType.",
    }
};
exports.ExtensionErrors = {
    INVALID_EXTENSION: {
        code: "ERROR_INVALID_EXTENSION",
        name: "ERROR_INVALID_EXTENSION",
        message: "The provided extension cannot be null or empty. Please provide a valid extension.",
        details: {}
    },
    EXTENSION_NOT_FOUND: {
        code: "ERROR_EXTENSION_NOT_FOUND",
        name: "ERROR_EXTENSION_NOT_FOUND",
        message: "The provided extension could not be found.",
        details: {}
    }
};
exports.MessageErrors = {
    INVALID_RECEIVER_TYPE: {
        code: "INVALID_RECEIVER_TYPE",
        name: "INVALID_RECEIVER_TYPE",
        message: "Receiver type can be `user` or `group`.",
        details: "Please check the value of receiverType.",
    }
};
exports.FeatureRestrictionErrors = {
    INVALID_FEATURE: {
        code: "ERROR_INVALID_FEATURE",
        name: "ERROR_INVALID_FEATURE",
        message: "The provided feature cannot be null or empty. Please provide a valid feature.",
        details: {}
    },
    FEATURE_NOT_FOUND: {
        code: "ERROR_FEATURE_NOT_FOUND",
        name: "ERROR_FEATURE_NOT_FOUND",
        message: "The provided feature could not be found.",
        details: {}
    }
};
exports.PresenceConstatnts = {
    STATUS: {
        ONLINE: "online",
        AVAILABLE: "available",
        OFFLINE: "offline",
        JOINED: "JOINED",
        LEFT: "LEFT",
    }
};
exports.APP_SETTINGS = {
    APP_SETTINGS: "app_settings",
    KEYS: {
        CHAT_HOST: "CHAT_HOST",
        CHAT_USE_SSL: "CHAT_USE_SSL",
        GROUP_SERVICE: "GROUP_SERVICE",
        CALL_SERVICE: "CALL_SERVICE",
        CHAT_WS_PORT: "CHAT_WS_PORT",
        CHAT_WSS_PORT: "CHAT_WSS_PORT",
        CHAT_HTTP_BIND_PORT: "CHAT_HTTP_BIND_PORT",
        CHAT_HTTPS_BIND_PORT: "CHAT_HTTPS_BIND_PORT",
        ADMIN_API_HOST: "ADMIN_API_HOST",
        CLIENT_API_HOST: "CLIENT_API_HOST",
        WEBRTC_HOST: "WEBRTC_HOST",
        WEBRTC_USE_SSL: "WEBRTC_USE_SSL",
        WEBRTC_WS_PORT: "WEBRTC_WS_PORT",
        WEBRTC_WSS_PORT: "WEBRTC_WSS_PORT",
        WEBRTC_HTTP_BIND_PORT: "WEBRTC_HTTP_BIND_PORT",
        WEBRTC_HTTPS_BIND_PORT: "WEBRTC_HTTPS_BIND_PORT",
        EXTENSION_LIST: "extensions",
        EXTENSION_KEYS: {
            ID: "id",
            NAME: "name"
        },
        JID_HOST_OVERRIDE: "JID_HOST_OVERRIDE",
        CHAT_HOST_OVERRIDE: "CHAT_HOST_OVERRIDE",
        CHAT_HOST_APP_SPECIFIC: "CHAT_HOST_APP_SPECIFIC",
        MODE: "MODE",
        CONNECTION_TYPE: "connection_type",
        DEFAULT_MODE: "DEFAULT",
        LIMITED_TRANSIENT: "LIMITED_TRANSIENT",
        NO_TRANSIENT: "NO_TRANSIENT",
        POLLING_ENABLED: "POLLING_ENABLED",
        POLLING_INTERVAL: "POLLING_INTERVAL",
        ANALYTICS_PING_DISABLED: "ANALYTICS_PING_DISABLED",
        ANALYTICS_HOST: "ANALYTICS_HOST",
        ANALYTICS_VERSION: "ANALYTICS_VERSION",
        ANALYTICS_USE_SSL: "ANALYTICS_USE_SSL",
        SETTINGS_HASH: "settingsHash",
        SETTINGS_HASH_RECEIVED_AT: "settingsHashReceivedAt",
        DENY_FALLBACK_TO_POLLING: "DENY_FALLBACK_TO_POLLING",
        APP_VERSION: "APP_VERSION",
        MAIN_DOMAIN: "MAIN_DOMAIN",
        CHAT_API_VERSION: "CHAT_API_VERSION",
        WS_API_VERSION: "WS_API_VERSION",
        REGION: "REGION",
        EXTENSION_DOMAIN: "EXTENSION_DOMAIN",
        WEBRTC_API_SUBDOMAIN: "WEBRTC_API_SUBDOMAIN",
        WEBRTC_WEB_FRONTEND_HOST: "WEBRTC_WEB_FRONTEND_HOST",
        WEBRTC_WEB_FRONTEND_VERSION: "WEBRTC_WEB_FRONTEND_VERSION"
    }
};
exports.COMMON_UTILITY_CONSTANTS = {
    TYPE_CONSTANTS: {
        BOOLEAN: "boolean",
        STRING: "string",
        OBJECT: "object",
        NUMBER: "number"
    }
};
exports.CONNECTION_STATUS = {
    CONNECTED: "connected",
    CONNECTING: "connecting",
    DISCONNECTED: "disconnected",
    FEATURE_THROTTLED: "featureThrottled"
};
exports.SESSION_STORE = {
    SESSION_ID: "sessionId"
};
exports.API_ERROR_CODES = {
    AUTH_ERR_AUTH_TOKEN_NOT_FOUND: "AUTH_ERR_AUTH_TOKEN_NOT_FOUND"
};
exports.PROSODY_API = {
    DOMAIN_PREFIX: "xmpp",
    PATH: {
        ROOM: "room",
        ROOM_SIZE: "room-size",
        SESSIONS: "sessions"
    },
    RESPONSE: {
        PARTICIPANTS: "participants"
    },
    QUERY_PARAMETERS: {
        DOMAIN: "domain",
        ROOM: "room"
    }
};
exports.ProsodyApiErrors = {
    INVALID_SESSIONID: {
        code: "ERROR_INVALID_SESSIONID",
        name: "ERROR_INVALID_SESSIONID",
        message: "The provided sessionId cannot be null or empty. Please provide a valid sessionId.",
        details: "",
    },
    INVALID_TYPE: {
        code: "ERROR_INVALID_TYPE",
        name: "ERROR_INVALID_TYPE",
        message: "The provided type cannot be null or empty. Please provide a valid type.",
        details: "",
    }
};
exports.JWT_API = {
    KEYS: {
        PASSTHROUGH: "passthrough",
        EXPAND: "expand"
    }
};
exports.ONLINE_MEMBER_COUNT_API = {
    ENDPOINTS: {
        GET_ONLINE_MEMBER_COUNT: "api/%s/online-members"
    },
    RESPONSE: {
        ONLINE_USERS_COUNT: "onlineUsersCount",
        GROUPS: "groups"
    },
    ERRORS: {
        INVALID_GROUPLIST: {
            code: "ERROR_INVALID_GROUPLIST",
            name: "ERROR_INVALID_GROUPLIST",
            message: "Grouplist cannot be null or empty.",
            details: "",
        }
    }
};


 }),

 (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.CometChatException = void 0;
var CometChatException =  (function () {
    function CometChatException(errorModel) {
        if (errorModel.code !== null && errorModel.code !== undefined && errorModel.code !== '')
            this.code = errorModel.code;
        if (errorModel.name !== null && errorModel.name !== undefined && errorModel.name !== '')
            this.name = errorModel.name;
        if (errorModel.message !== null && errorModel.message !== undefined && errorModel.message !== '')
            this.message = errorModel.message;
        if (errorModel.details !== null && errorModel.details !== undefined && errorModel.details !== '')
            this.details = errorModel.details;
    }
    return CometChatException;
}());
exports.CometChatException = CometChatException;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.CometChat = void 0;
var EndpointFactory_1 = __webpack_require__(28);
var Helper_1 = __webpack_require__(0);
var CustomError_1 = __webpack_require__(2);
var HttpHelper_1 = __webpack_require__(6);
var UserModel_1 = __webpack_require__(4);
var store_1 = __webpack_require__(14);
var MediaMessage_1 = __webpack_require__(17);
var BaseMessage_1 = __webpack_require__(7);
var TextMessage_1 = __webpack_require__(16);
var MessageController_1 = __webpack_require__(10);
var UsersController_1 = __webpack_require__(11);
var Constants_1 = __webpack_require__(1);
var Group_1 = __webpack_require__(8);
var GroupsController_1 = __webpack_require__(15);
var KeyStore_1 = __webpack_require__(30);
var Listner_1 = __webpack_require__(23);
var Call_1 = __webpack_require__(21);
var CallController_1 = __webpack_require__(31);
var CometChatErrorConstants_1 = __webpack_require__(13);
var Action_1 = __webpack_require__(20);
var GroupsRequest_1 = __webpack_require__(40);
var GroupMembersRequest_1 = __webpack_require__(41);
var BannedMembersRequest_1 = __webpack_require__(42);
var UsersRequest_1 = __webpack_require__(43);
var ConversationRequest_1 = __webpack_require__(45);
var MessagesRequest_1 = __webpack_require__(46);
var MessageListenerEventMaping_1 = __webpack_require__(25);
var TypingNotification_1 = __webpack_require__(26);
var TypingNotificationController_1 = __webpack_require__(36);
var CustomMessage_1 = __webpack_require__(19);
var GroupMember_1 = __webpack_require__(34);
var BlockedUsersRequest_1 = __webpack_require__(48);
var AppSettings_1 = __webpack_require__(49);
var CometChatHelper_1 = __webpack_require__(50);
var ConversationModel_1 = __webpack_require__(35);
var ConversationController_1 = __webpack_require__(24);
var attachment_1 = __webpack_require__(18);
var CallSettings_1 = __webpack_require__(51);
var RTCUser_1 = __webpack_require__(52);
var WSConnectionHelper_1 = __webpack_require__(53);
var ListenerHandlers_1 = __webpack_require__(37);
var WSConstants_1 = __webpack_require__(5);
var CCExtension_1 = __webpack_require__(62);
var EndPointUtils_1 = __webpack_require__(29);
var MediaDevice_1 = __webpack_require__(32);
var TransientMessage_1 = __webpack_require__(27);
var uuidv4 = __webpack_require__(63);
var _WSConnectionHelper = WSConnectionHelper_1.WSConnectionHelper.getInstance();
var _listenerHandlers = ListenerHandlers_1.ListenerHandlers.getInstance();
var CometChat =  (function () {
    
    function CometChat(appId) {
        try {
            CometChat.appId = appId;
            CometChat.localStorage = store_1.LocalStorage.getInstance();
            CometChat.keyStore = KeyStore_1.KeyStore.getInstance();
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: constructor", err);
        }
    }
    
    CometChat.setAuthToken = function (authToken) {
        try {
            CometChat.authToken = authToken;
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: setAuthToken", err);
        }
    };
    
    CometChat.prototype.getAuthToken = function () {
        try {
            return CometChat.authToken;
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: getAuthToken", err);
        }
    };
    
    CometChat.getAppId = function () {
        try {
            return CometChat.appId;
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: getAppId", err);
        }
    };
    
    CometChat.prototype.getApiKey = function () {
        try {
            return CometChat.apiKey;
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: getApiKey", err);
        }
    };
    
    CometChat.getMode = function () {
        try {
            return CometChat.mode;
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: getMode", err);
        }
    };
    
    CometChat.setMode = function (mode) {
        try {
            CometChat.mode = mode;
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: getMode", err);
        }
    };
    
    CometChat.getSessionId = function () {
        try {
            return CometChat.sessionId;
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: getSessionId", err);
        }
    };
    
    CometChat.onStorageEvent = function (storageEvent) {
        if (document && !document.hasFocus()) {
            var key = CometChat.appId + ':common_store/user';
            if (storageEvent.key === key && storageEvent.newValue === null) {
                CometChat.authToken = undefined;
                if (CometChat.didAnalyticsPingStart()) {
                    CometChat.clearAnalyticsPingTimer();
                }
                _WSConnectionHelper.WSLogout();
                CometChat.pushToLoginListener('', 'Logout_Success');
            }
            if (storageEvent.key === key && storageEvent.oldValue === null) {
                store_1.LocalStorage.getInstance().get("user").then(function (user) {
                    if (user) {
                        CometChat.user = new UserModel_1.Me(user);
                        CometChat.setAuthToken(CometChat.user.getAuthToken());
                        if (user["jwt"]) {
                            CometChat.jwt = user["jwt"];
                        }
                        store_1.LocalStorage.getInstance().get("app_settings").then(function (appSettings) {
                            if (appSettings) {
                                if (appSettings.hasOwnProperty(Constants_1.APP_SETTINGS.KEYS.APP_VERSION)) {
                                    var currentAppVersion = parseInt(Constants_1.APPINFO.sdkVersion.charAt(1));
                                    if (appSettings[Constants_1.APP_SETTINGS.KEYS.APP_VERSION] < currentAppVersion) {
                                        if (!CometChat.appSettings.shouldAutoEstablishSocketConnection()) {
                                            CometChat.shouldConnectToWS = false;
                                        }
                                        CometChat.getInstance().internalRestart(CometChat.user.getAuthToken());
                                    }
                                }
                                else {
                                    if (!CometChat.appSettings.shouldAutoEstablishSocketConnection()) {
                                        CometChat.shouldConnectToWS = false;
                                    }
                                    CometChat.getInstance().internalRestart(CometChat.user.getAuthToken());
                                }
                                if (appSettings[Constants_1.APP_SETTINGS.KEYS.MODE]) {
                                    CometChat.mode = appSettings[Constants_1.APP_SETTINGS.KEYS.MODE];
                                }
                                if (appSettings[Constants_1.APP_SETTINGS.KEYS.SETTINGS_HASH]) {
                                    CometChat.settingsHash = appSettings[Constants_1.APP_SETTINGS.KEYS.SETTINGS_HASH];
                                }
                                if (appSettings[Constants_1.APP_SETTINGS.KEYS.SETTINGS_HASH_RECEIVED_AT]) {
                                    CometChat.settingsHashReceivedAt = appSettings[Constants_1.APP_SETTINGS.KEYS.SETTINGS_HASH_RECEIVED_AT];
                                }
                                if (appSettings[Constants_1.APP_SETTINGS.KEYS.ANALYTICS_PING_DISABLED]) {
                                    CometChat.isAnalyticsDisabled = true;
                                }
                                else {
                                    CometChat.isAnalyticsDisabled = false;
                                }
                                if (!CometChat.didAnalyticsPingStart() && !CometChat.isAnalyticsDisabled && CometChat.appSettings.shouldAutoEstablishSocketConnection()) {
                                    CometChat.pingAnalytics();
                                    CometChat.startAnalyticsPingTimer();
                                }
                                if (CometChat.getConnectionStatus() !== Constants_1.CONNECTION_STATUS.CONNECTED) {
                                    var data = new UserModel_1.User(CometChat.user);
                                    CometChat.pushToLoginListener(data, 'Login_Success');
                                    if (CometChat.appSettings.shouldAutoEstablishSocketConnection()) {
                                        CometChat.WSLogin(CometChat.user);
                                    }
                                }
                            }
                        });
                    }
                });
            }
        }
    };
    
    CometChat.beforeUnload = function (unloadEvent) {
        var sessionId = CometChat.getDataFromSessionStorage(Constants_1.SESSION_STORE.SESSION_ID);
        CometChat.removeDataFromSessionStorage(Constants_1.SESSION_STORE.SESSION_ID);
        store_1.LocalStorage.getInstance().set(Constants_1.SESSION_STORE.SESSION_ID, sessionId);
    };
    
    CometChat.didAnalyticsPingStart = function () {
        try {
            return CometChat.isAnalyticsPingStarted;
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: didAnalyticsPingStart", err);
        }
    };
    
    CometChat.getDataFromSessionStorage = function (key) {
        if (window.sessionStorage) {
            var sessionStorage_1 = window.sessionStorage;
            return sessionStorage_1.getItem(key);
        }
    };
    
    CometChat.addDataToSessionStorage = function (key, value) {
        if (window.sessionStorage) {
            var sessionStorage_2 = window.sessionStorage;
            sessionStorage_2.setItem(key, value);
        }
    };
    
    CometChat.removeDataFromSessionStorage = function (key) {
        if (window.sessionStorage) {
            var sessionStorage_3 = window.sessionStorage;
            sessionStorage_3.removeItem(key);
        }
    };
    
    
    CometChat.init = function (appId, appSettings) {
        var _this = this;
        if (appId === void 0) { appId = ""; }
        return new Promise(function (resolve, reject) {
            try {
                if (typeof appId === "object") {
                    if (appId.hasOwnProperty("appId")) {
                        appId = appId["appId"];
                    }
                    if (appId.hasOwnProperty("appSettings")) {
                        appSettings = appId["appSettings"];
                    }
                }
                if (Helper_1.isFalsy(appSettings)) {
                    appSettings = new AppSettings_1.AppSettingsBuilder().setRegion(AppSettings_1.AppSettings.REGION_EU).build();
                }
                else if (appSettings.getRegion() == AppSettings_1.AppSettings.REGION_PRIVATE) {
                    appSettings.region = appId;
                }
                _this.appSettings = appSettings;
                if (Helper_1.isFalsy(appId)) {
                    reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.INIT_ERROR.NO_APP_ID));
                }
                else {
                    if (window.addEventListener) {
                        window.addEventListener('storage', CometChat.onStorageEvent, false);
                        window.addEventListener("beforeunload", CometChat.beforeUnload, false);
                    }
                    _this.initialzed = true;
                    CometChat.appId = appId;
                    CometChat.getInstance(appId);
                    
                    store_1.LocalStorage.getInstance().get(Constants_1.SESSION_STORE.SESSION_ID).then(function (sessId) {
                        if (sessId == null || sessId == undefined) {
                            CometChat.sessionId = Constants_1.APPINFO.platform + '-' + Constants_1.APPINFO.sdkVersionWithUnderScore + '-' + uuidv4() + '-' + new Date().getTime();
                            CometChat.addDataToSessionStorage(Constants_1.SESSION_STORE.SESSION_ID, CometChat.getSessionId());
                            store_1.LocalStorage.getInstance().remove(Constants_1.SESSION_STORE.SESSION_ID);
                        }
                        else {
                            CometChat.sessionId = sessId.toLocaleString();
                            store_1.LocalStorage.getInstance().remove(Constants_1.SESSION_STORE.SESSION_ID);
                            CometChat.addDataToSessionStorage(Constants_1.SESSION_STORE.SESSION_ID, CometChat.getSessionId());
                        }
                        store_1.LocalStorage.getInstance().get(Constants_1.LOCAL_STORE.KEY_APP_ID).then(function (id) {
                            if (id == null || id == undefined) {
                                CometChat.appId = appId;
                                CometChat.getInstance(appId);
                                store_1.LocalStorage.getInstance().set(Constants_1.LOCAL_STORE.KEY_APP_ID, appId);
                                resolve(true);
                            }
                            else {
                                var appid = id.toLocaleString();
                                if (appid === appId) {
                                    CometChat.appId = appid;
                                    CometChat.getInstance(appid);
                                    store_1.LocalStorage.getInstance().get(Constants_1.LOCAL_STORE.KEY_USER).then(function (user) {
                                        if (user) {
                                            CometChat.isLoggedOut = false;
                                            CometChat.user = new UserModel_1.Me(user);
                                            CometChat.setAuthToken(CometChat.user.getAuthToken());
                                            if (user["jwt"]) {
                                                CometChat.jwt = user["jwt"];
                                            }
                                            resolve(true);
                                            store_1.LocalStorage.getInstance().get(Constants_1.LOCAL_STORE.KEY_APP_SETTINGS).then(function (appSettings) {
                                                if (appSettings) {
                                                    if (appSettings.hasOwnProperty(Constants_1.APP_SETTINGS.KEYS.APP_VERSION)) {
                                                        var currentAppVersion = parseInt(Constants_1.APPINFO.sdkVersion.charAt(1));
                                                        if (appSettings[Constants_1.APP_SETTINGS.KEYS.APP_VERSION] < currentAppVersion && appSettings[Constants_1.APP_SETTINGS.KEYS.APP_VERSION] !== 3) {
                                                            if (!_this.appSettings.shouldAutoEstablishSocketConnection()) {
                                                                CometChat.shouldConnectToWS = false;
                                                            }
                                                            CometChat.getInstance().internalRestart(CometChat.user.getAuthToken());
                                                        }
                                                    }
                                                    else {
                                                        if (!_this.appSettings.shouldAutoEstablishSocketConnection()) {
                                                            CometChat.shouldConnectToWS = false;
                                                        }
                                                        CometChat.getInstance().internalRestart(CometChat.user.getAuthToken());
                                                    }
                                                    if (appSettings[Constants_1.APP_SETTINGS.KEYS.MODE]) {
                                                        CometChat.mode = appSettings[Constants_1.APP_SETTINGS.KEYS.MODE];
                                                    }
                                                    if (appSettings[Constants_1.APP_SETTINGS.KEYS.SETTINGS_HASH]) {
                                                        CometChat.settingsHash = appSettings[Constants_1.APP_SETTINGS.KEYS.SETTINGS_HASH];
                                                    }
                                                    if (appSettings[Constants_1.APP_SETTINGS.KEYS.SETTINGS_HASH_RECEIVED_AT]) {
                                                        CometChat.settingsHashReceivedAt = appSettings[Constants_1.APP_SETTINGS.KEYS.SETTINGS_HASH_RECEIVED_AT];
                                                    }
                                                    if (appSettings[Constants_1.APP_SETTINGS.KEYS.ANALYTICS_PING_DISABLED]) {
                                                        CometChat.isAnalyticsDisabled = true;
                                                    }
                                                    else {
                                                        CometChat.isAnalyticsDisabled = false;
                                                    }
                                                    if (!CometChat.didAnalyticsPingStart() && !CometChat.isAnalyticsDisabled && _this.appSettings.shouldAutoEstablishSocketConnection()) {
                                                        CometChat.pingAnalytics();
                                                        CometChat.startAnalyticsPingTimer();
                                                    }
                                                    if (_WSConnectionHelper && !_WSConnectionHelper.connection) {
                                                        if (_this.appSettings.shouldAutoEstablishSocketConnection()) {
                                                            CometChat.isConnectingFromInit = true;
                                                            CometChat.WSLogin(CometChat.user);
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            resolve(true);
                                        }
                                    });
                                }
                                else {
                                    _this.clearCache().then(function () {
                                        CometChat.apiKey = undefined;
                                        CometChat.user = undefined;
                                        CometChat.authToken = undefined;
                                        CometChat.cometChat = undefined;
                                        CometChat.mode = undefined;
                                        _WSConnectionHelper.WSLogout();
                                        CometChat.appId = appId;
                                        store_1.LocalStorage.getInstance().set(Constants_1.LOCAL_STORE.KEY_APP_ID, appId);
                                        CometChat.getInstance(appId);
                                        resolve(true);
                                    });
                                }
                            }
                            KeyStore_1.KeyStore.getInstance().get(Constants_1.LOCAL_STORE.KEY_DEVICE_ID).then(function (id) {
                                if (id == null) {
                                    var uuid = uuidv4();
                                    var timestamp = new Date().getTime();
                                    var deviceId = appId + "_" + uuid + "_" + timestamp;
                                    KeyStore_1.KeyStore.getInstance().set(Constants_1.LOCAL_STORE.KEY_DEVICE_ID, deviceId);
                                }
                            });
                        });
                    });
                }
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.isInitialized = function () {
        try {
            return this.initialzed;
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: isInitialized", err);
        }
    };
    
    CometChat.getInstance = function (appId) {
        try {
            if (!this.cometChat) {
                this.cometChat = new CometChat(appId);
            }
            return this.cometChat;
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: getInstance", err);
        }
    };
    
    CometChat.registerTokenForPushNotification = function (token, settings) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                CometChat.keyStore.get(Constants_1.LOCAL_STORE.KEY_DEVICE_ID).then(function (id) {
                    Helper_1.getAppSettings().then(function (appSettings) {
                        var userAgent = "", deviceId = id, platform = Constants_1.APPINFO.platform, sdkVersion = Constants_1.APPINFO.sdkVersion, apiVersion = appSettings[Constants_1.APP_SETTINGS.KEYS.CHAT_API_VERSION];
                        if (navigator) {
                            userAgent = navigator.userAgent;
                        }
                        if (deviceId == null) {
                            var uuid = uuidv4();
                            var timestamp = new Date().getTime();
                            deviceId = _this.appId + "_" + uuid + "_" + timestamp;
                            CometChat.keyStore.set(Constants_1.LOCAL_STORE.KEY_DEVICE_ID, deviceId);
                        }
                        var body = {
                            "platform": platform,
                            "deviceId": deviceId,
                            "appInfo": {
                                "version": sdkVersion,
                                "apiVersion": apiVersion,
                                "userAgent": userAgent,
                                "pushNotification": {
                                    "fcmDeviceToken": token,
                                    "settings": settings
                                }
                            }
                        };
                        HttpHelper_1.makeApiCall("updateMyDetails", {}, body, false)
                            .then(function (data) {
                            resolve("Token Registration successful");
                        }, function (error) {
                            reject(new CustomError_1.CometChatException(error.error));
                        })["catch"](function (error) {
                            reject(new CustomError_1.CometChatException(error));
                        });
                    }, function (error) {
                        reject(new CustomError_1.CometChatException(error));
                    });
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.pushToLoginListener = function (data, status) {
        _listenerHandlers.loginHandlers.map(function (listener) {
            try {
                if (listener._eventListener) {
                    switch (status) {
                        case 'Login_Success':
                            if (!Helper_1.isFalsy(listener._eventListener.loginSuccess)) {
                                listener._eventListener.loginSuccess(data);
                            }
                            break;
                        case 'Login_Failure':
                            if (!Helper_1.isFalsy(listener._eventListener.loginFailure)) {
                                listener._eventListener.loginFailure(data);
                            }
                            break;
                        case 'Logout_Success':
                            if (!Helper_1.isFalsy(listener._eventListener.logoutSuccess)) {
                                listener._eventListener.logoutSuccess();
                            }
                            break;
                    }
                }
            }
            catch (e) {
                Helper_1.Logger.error("ConnectionHandlers: onConnected Status", e);
            }
        });
    };
    
    CometChat.login = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new Promise(function (resolveOuter, rejectOuter) {
            try {
                if (!CometChat.loginInProgress) {
                    CometChat.loginInProgress = true;
                    CometChat.isConnectingFromInit = false;
                    CometChat.localStorage.get(Constants_1.LOCAL_STORE.KEY_APP_ID).then(function (id) {
                        if (id == null || id == undefined) {
                            var err = new CustomError_1.CometChatException(CometChatErrorConstants_1.LOGIN_ERROR.NOT_INITIALIZED);
                            if (!CometChat.internalRestart) {
                                CometChat.pushToLoginListener(err, 'Login_Failure');
                            }
                            CometChat.loginInProgress = false;
                            CometChat.isLoggedOut = true;
                            return rejectOuter(err);
                        }
                        else {
                            var appId = id.toLocaleString();
                            _this.getInstance(appId);
                            CometChat.appId = appId;
                            store_1.LocalStorage.getInstance().set(Constants_1.LOCAL_STORE.KEY_APP_ID, appId);
                        }
                        if (typeof args[0] === "object") {
                            var userInfo = args[0];
                            if (args[0].hasOwnProperty("authToken")) {
                                args[0] = userInfo.authToken;
                            }
                            else if (args[0].hasOwnProperty("username") && args[0].hasOwnProperty("apiKey")) {
                                args[0] = userInfo.username;
                                args[1] = userInfo.apiKey;
                            }
                        }
                        if (args.length == 2) {
                            if (Helper_1.isFalsy(args[0]) || Helper_1.isFalsy(args[1])) {
                                var err = new CustomError_1.CometChatException(CometChatErrorConstants_1.ERRORS.PARAMETER_MISSING);
                                if (!CometChat.internalRestart) {
                                    CometChat.pushToLoginListener(err, 'Login_Failure');
                                }
                                CometChat.loginInProgress = false;
                                CometChat.isLoggedOut = true;
                                return rejectOuter(err);
                            }
                        }
                        else if (args.length == 1) {
                            if (Helper_1.isFalsy(args[0])) {
                                var err = new CustomError_1.CometChatException(CometChatErrorConstants_1.ERRORS.PARAMETER_MISSING);
                                if (!CometChat.internalRestart) {
                                    CometChat.pushToLoginListener(err, 'Login_Failure');
                                }
                                CometChat.loginInProgress = false;
                                CometChat.isLoggedOut = true;
                                return rejectOuter(err);
                            }
                        }
                        else {
                            var err = new CustomError_1.CometChatException(CometChatErrorConstants_1.ERRORS.PARAMETER_MISSING);
                            if (!CometChat.internalRestart) {
                                CometChat.pushToLoginListener(err, 'Login_Failure');
                            }
                            CometChat.loginInProgress = false;
                            CometChat.isLoggedOut = true;
                            return rejectOuter(err);
                        }
                        if (Helper_1.isFalsy(_this.getAppId())) {
                            var err = new CustomError_1.CometChatException(CometChatErrorConstants_1.LOGIN_ERROR.NOT_INITIALIZED);
                            if (!CometChat.internalRestart) {
                                CometChat.pushToLoginListener(err, 'Login_Failure');
                            }
                            CometChat.loginInProgress = false;
                            CometChat.isLoggedOut = true;
                            return rejectOuter(err);
                        }
                        else {
                            return CometChat.localStorage.get(Constants_1.LOCAL_STORE.KEY_USER).then(function (user) {
                                if (args.length == 2) {
                                    CometChat.apiKey = args[1];
                                    var uid_1 = args[0];
                                    if (user != null && user["uid"] !== args[0]) {
                                        CometChat.localStorage.clearStore().then(function () {
                                            _WSConnectionHelper.WSLogout();
                                            CometChat.generateAuthToken(uid_1).then(function (res) {
                                                CometChat.user = new UserModel_1.Me(res);
                                                CometChat.setAuthToken(CometChat.user.getAuthToken());
                                                CometChat.getLoggedInUser().then(function (data) {
                                                    CometChat.user = new UserModel_1.Me(data);
                                                    CometChat.user.setAuthToken(CometChat.authToken);
                                                    CometChat.setAuthToken(CometChat.user.getAuthToken());
                                                    var userObject = CometChat.user;
                                                    userObject.setStatus(Constants_1.PresenceConstatnts.STATUS.ONLINE);
                                                    CometChat.localStorage.set("user", userObject);
                                                    var dataObject = new UserModel_1.User(userObject);
                                                    resolveOuter(dataObject);
                                                    if (!CometChat.isConnectingFromInit && !CometChat.internalRestart) {
                                                        CometChat.pushToLoginListener(dataObject, 'Login_Success');
                                                    }
                                                    CometChat.loginInProgress = false;
                                                    if (!CometChat.didAnalyticsPingStart() && !CometChat.isAnalyticsDisabled && CometChat.appSettings.shouldAutoEstablishSocketConnection()) {
                                                        CometChat.pingAnalytics();
                                                        CometChat.startAnalyticsPingTimer();
                                                    }
                                                    CometChat.isLoggedOut = false;
                                                    if ((CometChat.appSettings.shouldAutoEstablishSocketConnection() || CometChat.internalRestart) && CometChat.shouldConnectToWS) {
                                                        CometChat.WSLogin(CometChat.user);
                                                    }
                                                }, function (err) {
                                                    if (!CometChat.internalRestart) {
                                                        CometChat.pushToLoginListener(err, 'Login_Failure');
                                                    }
                                                    CometChat.loginInProgress = false;
                                                    CometChat.isLoggedOut = true;
                                                    return rejectOuter(err);
                                                });
                                            }, function (err) {
                                                if (!CometChat.internalRestart) {
                                                    CometChat.pushToLoginListener(err, 'Login_Failure');
                                                }
                                                CometChat.loginInProgress = false;
                                                CometChat.isLoggedOut = true;
                                                return rejectOuter(err);
                                            });
                                        });
                                    }
                                    else {
                                        if (Helper_1.isFalsy(CometChat.authToken)) {
                                            if (!Helper_1.isFalsy(uid_1))
                                                if (!Helper_1.isFalsy(CometChat.apiKey)) {
                                                    _this.generateAuthToken(uid_1).then(function (res) {
                                                        _this.user = new UserModel_1.Me(res);
                                                        _this.setAuthToken(CometChat.user.getAuthToken());
                                                        _this.getLoggedInUser().then(function (data) {
                                                            _this.user = new UserModel_1.Me(data);
                                                            _this.user.setAuthToken(CometChat.authToken);
                                                            _this.setAuthToken(_this.user.getAuthToken());
                                                            _WSConnectionHelper.WSLogout();
                                                            var userObject = _this.user;
                                                            userObject.setStatus(Constants_1.PresenceConstatnts.STATUS.ONLINE);
                                                            _this.localStorage.set("user", userObject);
                                                            var dataObject = new UserModel_1.User(userObject);
                                                            resolveOuter(dataObject);
                                                            if (!CometChat.isConnectingFromInit && !CometChat.internalRestart) {
                                                                CometChat.pushToLoginListener(dataObject, 'Login_Success');
                                                            }
                                                            CometChat.loginInProgress = false;
                                                            if (!CometChat.didAnalyticsPingStart() && !CometChat.isAnalyticsDisabled && CometChat.appSettings.shouldAutoEstablishSocketConnection()) {
                                                                CometChat.pingAnalytics();
                                                                CometChat.startAnalyticsPingTimer();
                                                            }
                                                            CometChat.isLoggedOut = false;
                                                            if ((CometChat.appSettings.shouldAutoEstablishSocketConnection() || CometChat.internalRestart) && CometChat.shouldConnectToWS) {
                                                                _this.WSLogin(_this.user);
                                                            }
                                                        }, function (err) {
                                                            if (!CometChat.internalRestart) {
                                                                CometChat.pushToLoginListener(err, 'Login_Failure');
                                                            }
                                                            CometChat.loginInProgress = false;
                                                            CometChat.isLoggedOut = true;
                                                            return rejectOuter(err);
                                                        });
                                                    }, function (err) {
                                                        if (!CometChat.internalRestart) {
                                                            CometChat.pushToLoginListener(err, 'Login_Failure');
                                                        }
                                                        CometChat.loginInProgress = false;
                                                        CometChat.isLoggedOut = true;
                                                        return rejectOuter(err);
                                                    });
                                                }
                                                else {
                                                    var err = new CustomError_1.CometChatException(CometChatErrorConstants_1.LOGIN_ERROR.UNAUTHORISED);
                                                    if (!CometChat.internalRestart) {
                                                        CometChat.pushToLoginListener(err, 'Login_Failure');
                                                    }
                                                    CometChat.loginInProgress = false;
                                                    CometChat.isLoggedOut = true;
                                                    return rejectOuter(err);
                                                }
                                        }
                                        else {
                                            var data = new UserModel_1.User(_this.user);
                                            if (!CometChat.internalRestart) {
                                                CometChat.pushToLoginListener(data, 'Login_Success');
                                            }
                                            CometChat.loginInProgress = false;
                                            CometChat.isLoggedOut = false;
                                            return resolveOuter(data);
                                        }
                                    }
                                }
                                else {
                                    CometChat.authToken = args[0];
                                    _this.getLoggedInUser().then(function (data) {
                                        if (data.authToken != args[0]) {
                                            var that_1 = _this;
                                            that_1.localStorage.clearStore().then(function () {
                                                _WSConnectionHelper.WSLogout();
                                                that_1.getLoggedInUser().then(function (data) {
                                                    CometChat.user = new UserModel_1.Me(data);
                                                    CometChat.user.setAuthToken(CometChat.authToken);
                                                    CometChat.setAuthToken(CometChat.user.getAuthToken());
                                                    var userObject = CometChat.user;
                                                    userObject.setStatus(Constants_1.PresenceConstatnts.STATUS.ONLINE);
                                                    that_1.localStorage.set("user", userObject);
                                                    var dataObject = new UserModel_1.User(userObject);
                                                    resolveOuter(dataObject);
                                                    if (!CometChat.isConnectingFromInit && !CometChat.internalRestart) {
                                                        CometChat.pushToLoginListener(dataObject, 'Login_Success');
                                                    }
                                                    CometChat.loginInProgress = false;
                                                    if (!CometChat.didAnalyticsPingStart() && !CometChat.isAnalyticsDisabled && CometChat.appSettings.shouldAutoEstablishSocketConnection()) {
                                                        CometChat.pingAnalytics();
                                                        CometChat.startAnalyticsPingTimer();
                                                    }
                                                    CometChat.isLoggedOut = false;
                                                    if ((CometChat.appSettings.shouldAutoEstablishSocketConnection() || CometChat.internalRestart) && CometChat.shouldConnectToWS) {
                                                        CometChat.WSLogin(new UserModel_1.Me(data));
                                                    }
                                                }, function (error) {
                                                    if (!CometChat.internalRestart) {
                                                        CometChat.pushToLoginListener(error, 'Login_Failure');
                                                    }
                                                    CometChat.loginInProgress = false;
                                                    CometChat.isLoggedOut = true;
                                                    return rejectOuter(error);
                                                });
                                            });
                                        }
                                        else {
                                            if (!user) {
                                                CometChat.user = new UserModel_1.Me(data);
                                                CometChat.user.setAuthToken(CometChat.authToken);
                                                CometChat.setAuthToken(CometChat.user.getAuthToken());
                                                var userObject = CometChat.user;
                                                userObject.setStatus(Constants_1.PresenceConstatnts.STATUS.ONLINE);
                                                CometChat.localStorage.set("user", userObject);
                                                var dataObject = new UserModel_1.User(userObject);
                                                resolveOuter(dataObject);
                                                if (!CometChat.isConnectingFromInit && !CometChat.internalRestart) {
                                                    CometChat.pushToLoginListener(dataObject, 'Login_Success');
                                                }
                                                CometChat.loginInProgress = false;
                                                if (!CometChat.didAnalyticsPingStart() && !CometChat.isAnalyticsDisabled && CometChat.appSettings.shouldAutoEstablishSocketConnection()) {
                                                    CometChat.pingAnalytics();
                                                    CometChat.startAnalyticsPingTimer();
                                                }
                                                CometChat.isLoggedOut = false;
                                                if ((CometChat.appSettings.shouldAutoEstablishSocketConnection() || CometChat.internalRestart) && CometChat.shouldConnectToWS) {
                                                    CometChat.WSLogin(new UserModel_1.Me(data));
                                                }
                                            }
                                            else {
                                                var response = new UserModel_1.User(data);
                                                if (!CometChat.internalRestart) {
                                                    CometChat.pushToLoginListener(response, 'Login_Success');
                                                }
                                                CometChat.loginInProgress = false;
                                                CometChat.isLoggedOut = false;
                                                return resolveOuter(response);
                                            }
                                        }
                                    }, function (error) {
                                        if (!CometChat.internalRestart) {
                                            CometChat.pushToLoginListener(error, 'Login_Failure');
                                        }
                                        CometChat.loginInProgress = false;
                                        CometChat.isLoggedOut = true;
                                        return rejectOuter(error);
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    CometChat.isLoggedOut = true;
                    var error = new CustomError_1.CometChatException(CometChatErrorConstants_1.LOGIN_ERROR.REQUEST_IN_PROGRESS);
                    return rejectOuter(error);
                }
            }
            catch (err) {
                var error = new CustomError_1.CometChatException(err);
                if (!CometChat.internalRestart) {
                    CometChat.pushToLoginListener(error, 'Login_Failure');
                }
                CometChat.loginInProgress = false;
                CometChat.isLoggedOut = true;
                return rejectOuter(error);
            }
        });
    };
    
    
    CometChat.sendMessage = function (message) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var fileType, object, parentId;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    if (!(message instanceof TextMessage_1.TextMessage || (message instanceof MediaMessage_1.MediaMessage || message instanceof CustomMessage_1.CustomMessage))) {
                        if (message[Constants_1.MessageConstatnts.KEYS.ATTATCHMENT]) {
                            fileType = Constants_1.MessageConstatnts.TYPE.FILE;
                            if (Helper_1.isImage(message[Constants_1.MessageConstatnts.KEYS.ATTATCHMENT])) {
                                fileType = Constants_1.MessageConstatnts.TYPE.IMAGE;
                            }
                            else if (Helper_1.isAudio(message[Constants_1.MessageConstatnts.KEYS.ATTATCHMENT])) {
                                fileType = Constants_1.MessageConstatnts.TYPE.AUDIO;
                            }
                            else if (Helper_1.isVideo(message[Constants_1.MessageConstatnts.KEYS.ATTATCHMENT])) {
                                fileType = Constants_1.MessageConstatnts.TYPE.VIDEO;
                            }
                            message = new MediaMessage_1.MediaMessage(message[Constants_1.MessageConstatnts.KEYS.RECEIVER_ID], message[Constants_1.MessageConstatnts.KEYS.ATTATCHMENT], fileType, message[Constants_1.MessageConstatnts.KEYS.RECEIVER_TYPE]);
                        }
                        else {
                            message = new TextMessage_1.TextMessage(message[Constants_1.MessageConstatnts.KEYS.RECEIVER_ID], message[Constants_1.MessageConstatnts.KEYS.TEXT], message[Constants_1.MessageConstatnts.KEYS.RECEIVER_TYPE]);
                        }
                    }
                    object = Helper_1.validateMessage(message);
                    if (object instanceof CustomError_1.CometChatException) {
                        reject(object);
                        return [2 ];
                    }
                    message.receiver = message.receiverId;
                    delete message.receiverId;
                    parentId = message["parentMessageId"];
                    return [2 , HttpHelper_1.makeApiCall(parentId ? "sendMessageInThread" : "sendMessage", parentId ? { parentId: parentId } : {}, message, message instanceof MediaMessage_1.MediaMessage).then(function (data) { return __awaiter(_this, void 0, void 0, function () {
                            var message;
                            return __generator(this, function (_a) {
                                message = MessageController_1.MessageController.trasformJSONMessge(data.data);
                                MessageListenerEventMaping_1.MessageListnerMaping.getInstance().set("all", parseInt(message.id));
                                resolve(message);
                                return [2 ];
                            });
                        }); }, function (err) {
                            reject(new CustomError_1.CometChatException(err.error));
                        })];
                }
                catch (err) {
                    reject(new CustomError_1.CometChatException(err));
                }
                return [2 ];
            });
        }); });
    };
    
    CometChat.sendDirectMessage = function (message) {
        try {
            Object.assign(message, { receiverType: Constants_1.MessageConstatnts.RECEIVER_TYPE.USER });
            return this.sendMessage(message);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: sendDirectMessage", err);
        }
    };
    
    CometChat.sendGroupMessage = function (message) {
        try {
            Object.assign(message, { receiverType: Constants_1.MessageConstatnts.RECEIVER_TYPE.GROUP });
            return this.sendMessage(message);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: sendGroupMessage", err);
        }
    };
    
    CometChat.sendMediaMessage = function (message) {
        try {
            return this.sendMessage(message);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: sendMediaMessage", err);
        }
    };
    
    CometChat.sendCustomMessage = function (message) {
        try {
            return this.sendMessage(message);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: sendCustomMessage", err);
        }
    };
    
    CometChat.getLastDeliveredMessageId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 , MessageListenerEventMaping_1.MessageListnerMaping.getInstance().get(Constants_1.LOCAL_STORE.KEY_MESSAGE_LISTENER_LIST)];
                    case 1: return [2 , _a.sent()];
                    case 2:
                        err_1 = _a.sent();
                        Helper_1.Logger.error("CometChat: getLastDeliveredMessageId", err_1);
                        return [3 , 3];
                    case 3: return [2 ];
                }
            });
        });
    };
    
    CometChat.startTyping = function (typingNotification) {
        try {
            if (!Helper_1.isFalsy(typingNotification)) {
                var receiverId = void 0, receiverType = this.RECEIVER_TYPE.USER, metadata = {};
                if (typingNotification instanceof TypingNotification_1.TypingIndicator) {
                    receiverId = typingNotification.getReceiverId();
                    receiverType = typingNotification.getReceiverType();
                    metadata = typingNotification.getMetadata();
                }
                else {
                    if (typingNotification.hasOwnProperty(Constants_1.TYPING_NOTIFICATION.RECEIVER_ID)) {
                        receiverId = typingNotification[Constants_1.TYPING_NOTIFICATION.RECEIVER_ID];
                    }
                    else {
                        return;
                    }
                    if (typingNotification.hasOwnProperty(Constants_1.TYPING_NOTIFICATION.RECEIVER_TYPE)) {
                        receiverType = typingNotification[Constants_1.TYPING_NOTIFICATION.RECEIVER_TYPE];
                    }
                    if (typingNotification.hasOwnProperty(Constants_1.TYPING_NOTIFICATION.META)) {
                        metadata = typingNotification[Constants_1.TYPING_NOTIFICATION.META];
                    }
                }
                if (Helper_1.isFalsy(receiverId)) {
                    return;
                }
                if (TypingNotificationController_1.TypingNotificationController.getTypingStartedMap(receiverId) == undefined) {
                    var mode = CometChat.getMode();
                    if (Helper_1.isFalsy(mode) || (mode && mode !== Constants_1.APP_SETTINGS.KEYS.NO_TRANSIENT && mode !== Constants_1.APP_SETTINGS.KEYS.LIMITED_TRANSIENT)) {
                        _WSConnectionHelper.startTypingIndicator(receiverId, receiverType, metadata);
                        TypingNotificationController_1.TypingNotificationController.addTypingStarted(receiverId);
                        TypingNotificationController_1.TypingNotificationController.removeTypingEnded(receiverId);
                        return;
                    }
                    else {
                        return;
                    }
                }
            }
            else {
                return;
            }
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: startTyping", err);
        }
    };
    
    CometChat.endTyping = function (typingNotification) {
        try {
            if (!Helper_1.isFalsy(typingNotification)) {
                var receiverId = void 0, receiverType = this.RECEIVER_TYPE.USER, metadata = {};
                if (typingNotification instanceof TypingNotification_1.TypingIndicator) {
                    receiverId = typingNotification.getReceiverId();
                    receiverType = typingNotification.getReceiverType();
                    metadata = typingNotification.getMetadata();
                }
                else {
                    if (typingNotification.hasOwnProperty(Constants_1.TYPING_NOTIFICATION.RECEIVER_ID)) {
                        receiverId = typingNotification[Constants_1.TYPING_NOTIFICATION.RECEIVER_ID];
                    }
                    else {
                        return;
                    }
                    if (typingNotification.hasOwnProperty(Constants_1.TYPING_NOTIFICATION.RECEIVER_TYPE)) {
                        receiverType = typingNotification[Constants_1.TYPING_NOTIFICATION.RECEIVER_TYPE];
                    }
                    if (receiverType == this.RECEIVER_TYPE.USER) {
                        receiverType = Constants_1.WS.CONVERSATION.TYPE.CHAT;
                    }
                    else {
                        receiverType = Constants_1.WS.CONVERSATION.TYPE.GROUP_CHAT;
                    }
                    if (typingNotification.hasOwnProperty(Constants_1.TYPING_NOTIFICATION.META)) {
                        metadata = typingNotification[Constants_1.TYPING_NOTIFICATION.META];
                    }
                }
                if (Helper_1.isFalsy(receiverId)) {
                    return;
                }
                if (TypingNotificationController_1.TypingNotificationController.getTypingEndedMap(receiverId) == undefined) {
                    var mode = CometChat.getMode();
                    if (Helper_1.isFalsy(mode) || (mode && mode !== Constants_1.APP_SETTINGS.KEYS.NO_TRANSIENT && mode !== Constants_1.APP_SETTINGS.KEYS.LIMITED_TRANSIENT)) {
                        _WSConnectionHelper.pauseTypingIndicator(receiverId, receiverType, metadata);
                        TypingNotificationController_1.TypingNotificationController.addTypingEnded(receiverId);
                        TypingNotificationController_1.TypingNotificationController.removeTypingStarted(receiverId);
                        return;
                    }
                    else {
                        return;
                    }
                }
            }
            else {
                return;
            }
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: endTyping", err);
        }
    };
    
    CometChat.markAsRead = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            try {
                var messageId = void 0, receiverId = void 0, receiverType = void 0, senderId = void 0;
                if (args.length === 3) {
                    return reject(new CustomError_1.CometChatException(Constants_1.ReceiptErrors.MISSING_PARAMETERS));
                }
                else if (args.length === 4) {
                    if (Helper_1.isFalsy(args[0]) || typeof args[0] !== 'string') {
                        return reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.ReceiptErrors.INVALID_PARAMETER), "MESSAGE_ID", "MESSAGE_ID", "Message ID should be a string."))));
                    }
                    else {
                        messageId = args[0];
                    }
                    if (Helper_1.isFalsy(args[1]) || typeof args[1] !== 'string') {
                        return reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.ReceiptErrors.INVALID_PARAMETER), "RECEIVER_ID", "RECEIVER_ID", "Receiver ID should be a string."))));
                    }
                    else {
                        receiverId = args[1];
                    }
                    if (Helper_1.isFalsy(args[2]) || typeof args[2] !== 'string') {
                        return reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.ReceiptErrors.INVALID_PARAMETER), "RECEIVER_TYPE", "RECEIVER_TYPE", "Receiver type should be a string."))));
                    }
                    else {
                        receiverType = args[2];
                    }
                    if (Helper_1.isFalsy(args[3]) || typeof args[3] !== 'string') {
                        return reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.ReceiptErrors.INVALID_PARAMETER), "SENDER_ID", "SENDER_ID", "Sender ID should be a string."))));
                    }
                    else {
                        senderId = args[3];
                    }
                }
                else if (args.length === 1) {
                    if (Helper_1.isFalsy(args[0]) || !(args[0] instanceof BaseMessage_1.BaseMessage)) {
                        return reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.ReceiptErrors.INVALID_PARAMETER), "MESSAGE", "MESSAGE", "Invalid message object received."))));
                    }
                    else {
                        var message = args[0];
                        messageId = message.getId().toString();
                        receiverType = message.getReceiverType();
                        receiverId = receiverType === Constants_1.MessageConstatnts.RECEIVER_TYPE.USER ? (message.getSender().getUid() === CometChat.user.getUid() ? message.getReceiverId() : message.getSender().getUid()) : message.getReceiverId();
                        senderId = message.getSender().getUid();
                    }
                }
                else {
                    return reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.ReceiptErrors.INVALID_PARAMETER), "ARGUMENTS", "ARGUMENTS", "markAsRead() expects either 1 or 4 arguments."))));
                }
                var mode = CometChat.getMode();
                if (Helper_1.isFalsy(mode) || (mode && mode !== Constants_1.APP_SETTINGS.KEYS.NO_TRANSIENT && mode !== Constants_1.APP_SETTINGS.KEYS.LIMITED_TRANSIENT)) {
                    if (CometChat.getConnectionStatus() === Constants_1.CONNECTION_STATUS.CONNECTED) {
                        _WSConnectionHelper.markAsRead(receiverId, receiverType, messageId, senderId);
                        return resolve();
                    }
                    else {
                        return reject(new CustomError_1.CometChatException(Constants_1.ReceiptErrors.NO_WEBSOCKET_CONNECTION));
                    }
                }
                else {
                    return reject(new CustomError_1.CometChatException(Constants_1.ReceiptErrors.RECEIPTS_TEMPORARILY_BLOCKED));
                }
            }
            catch (err) {
                Helper_1.Logger.error("CometChat: markAsRead", err);
                return reject(new CustomError_1.CometChatException(Constants_1.ReceiptErrors.UNKNOWN_ERROR_OCCURRED));
            }
        });
    };
    
    CometChat.markAsDelivered = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            try {
                var messageId = void 0, receiverId = void 0, receiverType = void 0, senderId = void 0;
                if (args.length === 3) {
                    return reject(new CustomError_1.CometChatException(Constants_1.ReceiptErrors.MISSING_PARAMETERS));
                }
                else if (args.length === 4) {
                    if (Helper_1.isFalsy(args[0]) || typeof args[0] !== 'string') {
                        return reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.ReceiptErrors.INVALID_PARAMETER), "MESSAGE_ID", "MESSAGE_ID", "Message ID should be a string."))));
                    }
                    else {
                        messageId = args[0];
                    }
                    if (Helper_1.isFalsy(args[1]) || typeof args[1] !== 'string') {
                        return reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.ReceiptErrors.INVALID_PARAMETER), "RECEIVER_ID", "RECEIVER_ID", "Receiver ID should be a string."))));
                    }
                    else {
                        receiverId = args[1];
                    }
                    if (Helper_1.isFalsy(args[2]) || typeof args[2] !== 'string') {
                        return reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.ReceiptErrors.INVALID_PARAMETER), "RECEIVER_TYPE", "RECEIVER_TYPE", "Receiver type should be a string."))));
                    }
                    else {
                        receiverType = args[2];
                    }
                    if (Helper_1.isFalsy(args[3]) || typeof args[3] !== 'string') {
                        return reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.ReceiptErrors.INVALID_PARAMETER), "SENDER_ID", "SENDER_ID", "Sender ID should be a string."))));
                    }
                    else {
                        senderId = args[3];
                    }
                }
                else if (args.length === 1) {
                    if (Helper_1.isFalsy(args[0]) || !(args[0] instanceof BaseMessage_1.BaseMessage)) {
                        return reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.ReceiptErrors.INVALID_PARAMETER), "MESSAGE", "MESSAGE", "Invalid message object received."))));
                    }
                    else {
                        var message = args[0];
                        messageId = message.getId().toString();
                        receiverType = message.getReceiverType();
                        receiverId = receiverType === Constants_1.MessageConstatnts.RECEIVER_TYPE.USER ? (message.getSender().getUid() === CometChat.user.getUid() ? message.getReceiverId() : message.getSender().getUid()) : message.getReceiverId();
                        senderId = message.getSender().getUid();
                    }
                }
                else {
                    return reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.ReceiptErrors.INVALID_PARAMETER), "ARGUMENTS", "ARGUMENTS", "markAsDelivered() expects either 1 or 4 arguments."))));
                }
                var mode = CometChat.getMode();
                if (Helper_1.isFalsy(mode) || (mode && mode !== Constants_1.APP_SETTINGS.KEYS.NO_TRANSIENT && mode !== Constants_1.APP_SETTINGS.KEYS.LIMITED_TRANSIENT)) {
                    if (CometChat.getConnectionStatus() === Constants_1.CONNECTION_STATUS.CONNECTED) {
                        _WSConnectionHelper.markAsDelivered(receiverId, receiverType, messageId, senderId);
                        return resolve();
                    }
                    else {
                        return reject(new CustomError_1.CometChatException(Constants_1.ReceiptErrors.NO_WEBSOCKET_CONNECTION));
                    }
                }
                else {
                    return reject(new CustomError_1.CometChatException(Constants_1.ReceiptErrors.RECEIPTS_TEMPORARILY_BLOCKED));
                }
            }
            catch (err) {
                Helper_1.Logger.error("CometChat: markAsDelivered", err);
                return reject(new CustomError_1.CometChatException(Constants_1.ReceiptErrors.UNKNOWN_ERROR_OCCURRED));
            }
        });
    };
    
    CometChat.sendTransientMessage = function (transientMessage) {
        try {
            if (!Helper_1.isFalsy(transientMessage)) {
                var receiverId = void 0, receiverType = void 0, data = {};
                if (transientMessage instanceof TransientMessage_1.TransientMessage) {
                    receiverId = transientMessage.getReceiverId();
                    receiverType = transientMessage.getReceiverType();
                    data = transientMessage.getData();
                }
                else {
                    return;
                }
                if (Helper_1.isFalsy(receiverId) || Helper_1.isFalsy(receiverType)) {
                    return;
                }
                var mode = CometChat.getMode();
                if (Helper_1.isFalsy(mode) || (mode && mode !== Constants_1.APP_SETTINGS.KEYS.NO_TRANSIENT)) {
                    _WSConnectionHelper.sendTransientMessage(receiverId, receiverType, data);
                    return;
                }
                else {
                    return;
                }
            }
            else {
                return;
            }
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: sendTransientMessage", err);
        }
    };
    
    CometChat.sendTestMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var baseMessage, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        baseMessage = message;
                        if (!!(baseMessage instanceof BaseMessage_1.BaseMessage)) return [3 , 2];
                        return [4 , CometChatHelper_1.CometChatHelper.processMessage(message)];
                    case 1:
                        baseMessage = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (baseMessage instanceof TextMessage_1.TextMessage) {
                            WSConnectionHelper_1.WSConnectionHelper.getInstance().publishMessage(baseMessage);
                        }
                        return [3 , 4];
                    case 3:
                        err_2 = _a.sent();
                        Helper_1.Logger.error("CometChat: sendTestMessage", err_2);
                        return [3 , 4];
                    case 4: return [2 ];
                }
            });
        });
    };
    
    CometChat.getMessageDetails = function (messageId) {
        return new Promise(function (resolve, reject) {
            try {
                if (!Helper_1.isFalsy(messageId)) {
                    HttpHelper_1.makeApiCall("getMessageDetails", { messageId: messageId }).then(function (messageDetails) {
                        resolve(MessageController_1.MessageController.trasformJSONMessge(messageDetails.data));
                    }, function (error) {
                        Helper_1.Logger.error("CometChat:GetMessageDetails:", error);
                        reject(new CustomError_1.CometChatException(error.error));
                    });
                }
                else {
                    reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.ERRORS.PARAMETER_MISSING));
                }
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.getMessageReceipts = function (messageId) {
        return new Promise(function (resolve, reject) {
            try {
                var object = Helper_1.validateMsgId(messageId);
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                if (!Helper_1.isFalsy(messageId)) {
                    HttpHelper_1.makeApiCall("getMessageDetails", { messageId: messageId }).then(function (messageDetails) {
                        MessageController_1.MessageController.getReceiptsFromJSON(messageDetails.data).then(function (receipts) {
                            resolve(receipts);
                        }, function (error) {
                            reject(new CustomError_1.CometChatException(error));
                        });
                    }, function (error) {
                        Helper_1.Logger.error("CometChat:GetMessageDetails:", error);
                        reject(new CustomError_1.CometChatException(error.error));
                    });
                }
                else {
                    reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.ERRORS.PARAMETER_MISSING));
                }
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.getUnreadMessageCount = function (doHideMessages) {
        if (doHideMessages === void 0) { doHideMessages = false; }
        var hideMessagesFromBlockedUsers = 0;
        return new Promise(function (resolve, reject) {
            try {
                var Booleanobject = Helper_1.validateHideMessagesFromBlockedUsers(doHideMessages);
                if (Booleanobject instanceof CustomError_1.CometChatException) {
                    reject(Booleanobject);
                    return;
                }
                else {
                    if (doHideMessages) {
                        hideMessagesFromBlockedUsers = 1;
                    }
                }
                HttpHelper_1.makeApiCall("getMessages", {}, { unread: 1, count: 1, hideMessagesFromBlockedUsers: hideMessagesFromBlockedUsers }).then(function (listOfEntities) {
                    var users = {}, groups = {};
                    listOfEntities.data.map(function (entity) {
                        if (entity[Constants_1.ResponseConstants.RESPONSE_KEYS.UNREAD_UNDELIVERED_KEYS.ENTITY_TYPE] == Constants_1.MessageConstatnts.RECEIVER_TYPE.GROUP)
                            groups[entity[Constants_1.ResponseConstants.RESPONSE_KEYS.UNREAD_UNDELIVERED_KEYS.ENTITY_Id]] = entity[Constants_1.ResponseConstants.RESPONSE_KEYS.UNREAD_UNDELIVERED_KEYS.COUNT];
                        else
                            users[entity[Constants_1.ResponseConstants.RESPONSE_KEYS.UNREAD_UNDELIVERED_KEYS.ENTITY_Id]] = entity[Constants_1.ResponseConstants.RESPONSE_KEYS.UNREAD_UNDELIVERED_KEYS.COUNT];
                    });
                    resolve({ users: users, groups: groups });
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.getUnreadMessageCountForAllUsers = function (doHideMessages) {
        if (doHideMessages === void 0) { doHideMessages = false; }
        var hideMessagesFromBlockedUsers = 0;
        return new Promise(function (resolve, reject) {
            try {
                var Booleanobject = Helper_1.validateHideMessagesFromBlockedUsers(doHideMessages);
                if (Booleanobject instanceof CustomError_1.CometChatException) {
                    reject(Booleanobject);
                    return;
                }
                else {
                    if (doHideMessages) {
                        hideMessagesFromBlockedUsers = 1;
                    }
                }
                HttpHelper_1.makeApiCall("getMessages", {}, { hideMessagesFromBlockedUsers: hideMessagesFromBlockedUsers, receiverType: Constants_1.MessageConstatnts.RECEIVER_TYPE.USER, unread: 1, count: 1 }).then(function (listOfEntities) {
                    var users = {};
                    listOfEntities.data.map(function (entity) {
                        users[entity[Constants_1.ResponseConstants.RESPONSE_KEYS.UNREAD_UNDELIVERED_KEYS.ENTITY_Id]] = entity[Constants_1.ResponseConstants.RESPONSE_KEYS.UNREAD_UNDELIVERED_KEYS.COUNT];
                    });
                    resolve(__assign({}, users));
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.getUnreadMessageCountForAllGroups = function (doHideMessages) {
        if (doHideMessages === void 0) { doHideMessages = false; }
        var hideMessagesFromBlockedUsers = 0;
        return new Promise(function (resolve, reject) {
            try {
                var Booleanobject = Helper_1.validateHideMessagesFromBlockedUsers(doHideMessages);
                if (Booleanobject instanceof CustomError_1.CometChatException) {
                    reject(Booleanobject);
                    return;
                }
                else {
                    if (doHideMessages) {
                        hideMessagesFromBlockedUsers = 1;
                    }
                }
                HttpHelper_1.makeApiCall("getMessages", {}, { hideMessagesFromBlockedUsers: hideMessagesFromBlockedUsers, receiverType: Constants_1.MessageConstatnts.RECEIVER_TYPE.GROUP, unread: 1, count: 1 }).then(function (listOfEntities) {
                    var groups = {};
                    listOfEntities.data.map(function (entity) {
                        if (entity[Constants_1.ResponseConstants.RESPONSE_KEYS.UNREAD_UNDELIVERED_KEYS.ENTITY_TYPE] == Constants_1.MessageConstatnts.RECEIVER_TYPE.GROUP)
                            groups[entity[Constants_1.ResponseConstants.RESPONSE_KEYS.UNREAD_UNDELIVERED_KEYS.ENTITY_Id]] = entity[Constants_1.ResponseConstants.RESPONSE_KEYS.UNREAD_UNDELIVERED_KEYS.COUNT];
                    });
                    resolve(__assign({}, groups));
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.getUnreadMessageCountForUser = function (UID, doHideMessages) {
        if (doHideMessages === void 0) { doHideMessages = false; }
        var hideMessagesFromBlockedUsers = 0;
        return new Promise(function (resolve, reject) {
            try {
                var UIDobject = Helper_1.validateId(UID, "user");
                if (UIDobject instanceof CustomError_1.CometChatException) {
                    reject(UIDobject);
                    return;
                }
                var Booleanobject = Helper_1.validateHideMessagesFromBlockedUsers(doHideMessages);
                if (Booleanobject instanceof CustomError_1.CometChatException) {
                    reject(Booleanobject);
                    return;
                }
                else {
                    if (doHideMessages) {
                        hideMessagesFromBlockedUsers = 1;
                    }
                }
                HttpHelper_1.makeApiCall("getUserMessages", { listId: UID }, { hideMessagesFromBlockedUsers: hideMessagesFromBlockedUsers, unread: 1, count: 1, uid: UID }).then(function (listOfEntities) {
                    var users = {};
                    listOfEntities.data.map(function (entity) {
                        users[entity[Constants_1.ResponseConstants.RESPONSE_KEYS.UNREAD_UNDELIVERED_KEYS.ENTITY_Id]] = entity[Constants_1.ResponseConstants.RESPONSE_KEYS.UNREAD_UNDELIVERED_KEYS.COUNT];
                    });
                    resolve(__assign({}, users));
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.getUnreadMessageCountForGroup = function (GUID, doHideMessages) {
        if (doHideMessages === void 0) { doHideMessages = false; }
        var hideMessagesFromBlockedUsers = 0;
        return new Promise(function (resolve, reject) {
            try {
                var GUIDobject = Helper_1.validateId(GUID, "group");
                if (GUIDobject instanceof CustomError_1.CometChatException) {
                    reject(GUIDobject);
                    return;
                }
                var Booleanobject = Helper_1.validateHideMessagesFromBlockedUsers(doHideMessages);
                if (Booleanobject instanceof CustomError_1.CometChatException) {
                    reject(Booleanobject);
                    return;
                }
                else {
                    if (doHideMessages) {
                        hideMessagesFromBlockedUsers = 1;
                    }
                }
                HttpHelper_1.makeApiCall("getGroupMessages", { listId: GUID }, { hideMessagesFromBlockedUsers: hideMessagesFromBlockedUsers, unread: 1, count: 1, guid: GUID }).then(function (listOfEntities) {
                    var groups = {};
                    listOfEntities.data.map(function (entity) {
                        if (entity[Constants_1.ResponseConstants.RESPONSE_KEYS.UNREAD_UNDELIVERED_KEYS.ENTITY_TYPE] == Constants_1.MessageConstatnts.RECEIVER_TYPE.GROUP)
                            groups[entity[Constants_1.ResponseConstants.RESPONSE_KEYS.UNREAD_UNDELIVERED_KEYS.ENTITY_Id]] = entity[Constants_1.ResponseConstants.RESPONSE_KEYS.UNREAD_UNDELIVERED_KEYS.COUNT];
                    });
                    resolve(__assign({}, groups));
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.editMessage = function (message) {
        return new Promise(function (resolve, reject) {
            try {
                var object = Helper_1.validateMsgId(message.getId());
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                HttpHelper_1.makeApiCall("updateMessage", { messageId: message.getId() }, message).then(function (result) {
                    resolve(MessageController_1.MessageController.trasformJSONMessge(result.data).getActionOn());
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.deleteMessage = function (messageId) {
        return new Promise(function (resolve, reject) {
            try {
                var object = Helper_1.validateMsgId(messageId);
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                HttpHelper_1.makeApiCall("deleteMessage", { messageId: messageId }, { id: messageId }).then(function (result) {
                    resolve(MessageController_1.MessageController.trasformJSONMessge(result.data).getActionOn());
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    
    CometChat.getOnlineUserCount = function () {
        return new Promise(function (resolve, reject) {
            try {
                Helper_1.getAppSettings().then(function (settings) {
                    var endPoint = Helper_1.format(new EndpointFactory_1.EndpointFactory().wsApi, Helper_1.getChatHost(settings), Helper_1.format(Constants_1.ONLINE_MEMBER_COUNT_API.ENDPOINTS.GET_ONLINE_MEMBER_COUNT, settings[Constants_1.APP_SETTINGS.KEYS.WS_API_VERSION]));
                    var method = "POST";
                    var data = {};
                    var headers = {
                        appId: CometChat.appId,
                        Authorization: CometChat.jwt,
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    };
                    HttpHelper_1.postData(endPoint, method, data, headers, false)
                        .then(function (response) {
                        return response.json();
                    })
                        .then(function (response) {
                        if (response.hasOwnProperty(Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA)) {
                            return resolve(response[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA][Constants_1.ONLINE_MEMBER_COUNT_API.RESPONSE.ONLINE_USERS_COUNT]);
                        }
                        else {
                            return reject(new CustomError_1.CometChatException(response.error));
                        }
                    })["catch"](function () {
                        var err = {
                            error: CometChatErrorConstants_1.FETCH_ERROR.ERROR_IN_API_CALL
                        };
                        return reject(err);
                    });
                }, function (error) {
                    return reject(new CustomError_1.CometChatException(error));
                });
            }
            catch (err) {
                return reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.getOnlineGroupMemberCount = function (groups) {
        return new Promise(function (resolve, reject) {
            try {
                if (!groups || groups.length == 0) {
                    return reject(new CustomError_1.CometChatException((Constants_1.ONLINE_MEMBER_COUNT_API.ERRORS.INVALID_GROUPLIST)));
                }
                else {
                    Helper_1.getAppSettings().then(function (settings) {
                        var endPoint = Helper_1.format(new EndpointFactory_1.EndpointFactory().wsApi, Helper_1.getChatHost(settings), Helper_1.format(Constants_1.ONLINE_MEMBER_COUNT_API.ENDPOINTS.GET_ONLINE_MEMBER_COUNT, settings[Constants_1.APP_SETTINGS.KEYS.WS_API_VERSION]));
                        var method = "POST";
                        var data = { groups: groups };
                        var headers = {
                            appId: CometChat.appId,
                            Authorization: CometChat.jwt,
                            Accept: "application/json",
                            "Content-Type": "application/json"
                        };
                        HttpHelper_1.postData(endPoint, method, data, headers, false)
                            .then(function (response) {
                            return response.json();
                        })
                            .then(function (response) {
                            if (response.hasOwnProperty(Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA)) {
                                return resolve(response[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA][Constants_1.ONLINE_MEMBER_COUNT_API.RESPONSE.GROUPS]);
                            }
                            else {
                                return reject(new CustomError_1.CometChatException(response.error));
                            }
                        })["catch"](function () {
                            var err = {
                                error: CometChatErrorConstants_1.FETCH_ERROR.ERROR_IN_API_CALL
                            };
                            return reject(err);
                        });
                    }, function (error) {
                        return reject(new CustomError_1.CometChatException(error));
                    });
                }
            }
            catch (err) {
                return reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    
    CometChat.createUser = function (user, apiKey) {
        return new Promise(function (resolve, reject) {
            try {
                if (!Helper_1.isFalsy(apiKey)) {
                    CometChat.apiKey = apiKey;
                }
                else {
                    reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "AUTH_KEY", "AUTH_KEY", "AUTH_KEY", "AUTH_KEY"))));
                    return;
                }
                var object = Helper_1.validateCreateUser(user);
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                if (!(user instanceof UserModel_1.User)) {
                    var tempuser = void 0;
                    if (user.hasOwnProperty(Constants_1.UserConstants.UID)) {
                        if (user.hasOwnProperty(Constants_1.UserConstants.NAME)) {
                            tempuser = new UserModel_1.User(user[Constants_1.UserConstants.UID], user[Constants_1.UserConstants.NAME]);
                            if (user.hasOwnProperty(Constants_1.UserConstants.AVATAR)) {
                                tempuser.setAvatar(user[Constants_1.UserConstants.AVATAR]);
                            }
                            if (user.hasOwnProperty(Constants_1.UserConstants.ROLE)) {
                                tempuser.setRole(user[Constants_1.UserConstants.ROLE]);
                            }
                            if (user.hasOwnProperty(Constants_1.UserConstants.META_DATA)) {
                                tempuser.setMetadata(user[Constants_1.UserConstants.META_DATA]);
                            }
                            if (user.hasOwnProperty(Constants_1.UserConstants.LINK)) {
                                tempuser.setLink(user[Constants_1.UserConstants.LINK]);
                            }
                            if (user.hasOwnProperty(Constants_1.UserConstants.STATUS_MESSAGE)) {
                                tempuser.setStatusMessage(user[Constants_1.UserConstants.STATUS_MESSAGE]);
                            }
                            if (user.hasOwnProperty(Constants_1.UserConstants.TAGS)) {
                                tempuser.setTags(user[Constants_1.UserConstants.TAGS]);
                            }
                            user = tempuser;
                        }
                        else {
                            reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.ERRORS.PARAMETER_MISSING));
                            return;
                        }
                    }
                    else {
                        reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.ERRORS.PARAMETER_MISSING));
                        return;
                    }
                }
                HttpHelper_1.makeApiCall("createUser", {}, user).then(function (response) {
                    var createduser = UsersController_1.UsersController.trasformJSONUser(response.data);
                    resolve(createduser);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.updateUser = function (user, apiKey) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (!Helper_1.isFalsy(apiKey)) {
                    CometChat.apiKey = apiKey;
                }
                else {
                    reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "AUTH_KEY", "AUTH_KEY", "AUTH_KEY", "AUTH_KEY"))));
                    return;
                }
                var object = Helper_1.validateUpdateUser(user);
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                if (!(user instanceof UserModel_1.User)) {
                    var tempuser = void 0;
                    if (user.hasOwnProperty(Constants_1.UserConstants.UID)) {
                        tempuser = new UserModel_1.User(user[Constants_1.UserConstants.UID]);
                        if (user.hasOwnProperty(Constants_1.UserConstants.NAME)) {
                            tempuser.setName(user[Constants_1.UserConstants.NAME]);
                        }
                        if (user.hasOwnProperty(Constants_1.UserConstants.AVATAR)) {
                            tempuser.setAvatar(user[Constants_1.UserConstants.AVATAR]);
                        }
                        if (user.hasOwnProperty(Constants_1.UserConstants.ROLE)) {
                            tempuser.setRole(user[Constants_1.UserConstants.ROLE]);
                        }
                        if (user.hasOwnProperty(Constants_1.UserConstants.META_DATA)) {
                            tempuser.setMetadata(user[Constants_1.UserConstants.META_DATA]);
                        }
                        if (user.hasOwnProperty(Constants_1.UserConstants.LINK)) {
                            tempuser.setLink(user[Constants_1.UserConstants.LINK]);
                        }
                        if (user.hasOwnProperty(Constants_1.UserConstants.STATUS_MESSAGE)) {
                            tempuser.setStatusMessage(user[Constants_1.UserConstants.STATUS_MESSAGE]);
                        }
                        if (user.hasOwnProperty(Constants_1.UserConstants.TAGS)) {
                            tempuser.setTags(user[Constants_1.UserConstants.TAGS]);
                        }
                        user = tempuser;
                    }
                    else {
                        reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.ERRORS.PARAMETER_MISSING));
                        return;
                    }
                }
                var uid_2 = user.uid;
                HttpHelper_1.makeApiCall("updateUser", { uid: uid_2 }, user).then(function (response) {
                    if (_this.user && uid_2.toLocaleLowerCase() === _this.user.getUid().toLocaleLowerCase()) {
                        store_1.LocalStorage.getInstance().get("user").then(function (loggedInUser) {
                            if (loggedInUser) {
                                var updatedUser = UsersController_1.UsersController.trasformJSONUser(response.data);
                                var userObj = response.data;
                                userObj.wsChannel = loggedInUser["wsChannel"];
                                userObj.authToken = CometChat.authToken;
                                userObj.status = Constants_1.PresenceConstatnts.STATUS.ONLINE;
                                if (loggedInUser["jwt"]) {
                                    userObj.jwt = loggedInUser["jwt"];
                                }
                                CometChat.user = new UserModel_1.Me(userObj);
                                _this.localStorage.set("user", CometChat.user);
                                resolve(updatedUser);
                            }
                        });
                    }
                    else {
                        var updatedUser = UsersController_1.UsersController.trasformJSONUser(response.data);
                        resolve(updatedUser);
                    }
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.updateCurrentUserDetails = function (user) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                user["uid"] = _this.user.uid;
                var object = Helper_1.validateUpdateUser(user);
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                if (!(user instanceof UserModel_1.User)) {
                    var tempuser = void 0;
                    if (user.hasOwnProperty(Constants_1.UserConstants.UID)) {
                        tempuser = new UserModel_1.User(user[Constants_1.UserConstants.UID]);
                    }
                    if (user.hasOwnProperty(Constants_1.UserConstants.NAME)) {
                        tempuser.setName(user[Constants_1.UserConstants.NAME]);
                    }
                    if (user.hasOwnProperty(Constants_1.UserConstants.AVATAR)) {
                        tempuser.setAvatar(user[Constants_1.UserConstants.AVATAR]);
                    }
                    if (user.hasOwnProperty(Constants_1.UserConstants.ROLE)) {
                        tempuser.setRole(user[Constants_1.UserConstants.ROLE]);
                    }
                    if (user.hasOwnProperty(Constants_1.UserConstants.META_DATA)) {
                        tempuser.setMetadata(user[Constants_1.UserConstants.META_DATA]);
                    }
                    if (user.hasOwnProperty(Constants_1.UserConstants.LINK)) {
                        tempuser.setLink(user[Constants_1.UserConstants.LINK]);
                    }
                    if (user.hasOwnProperty(Constants_1.UserConstants.STATUS_MESSAGE)) {
                        tempuser.setStatusMessage(user[Constants_1.UserConstants.STATUS_MESSAGE]);
                    }
                    if (user.hasOwnProperty(Constants_1.UserConstants.TAGS)) {
                        tempuser.setTags(user[Constants_1.UserConstants.TAGS]);
                    }
                    user = tempuser;
                }
                HttpHelper_1.makeApiCall("updateMyDetails", {}, user).then(function (response) {
                    var updatedUser = UsersController_1.UsersController.trasformJSONUser(response.data);
                    CometChat.user = new UserModel_1.Me(response.data);
                    var userObject = CometChat.user;
                    userObject.setStatus(Constants_1.PresenceConstatnts.STATUS.ONLINE);
                    CometChat.localStorage.set("user", userObject);
                    resolve(updatedUser);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.getUser = function (uid) {
        return new Promise(function (resolve, reject) {
            try {
                if (typeof uid === "object") {
                    if (uid.hasOwnProperty("uid")) {
                        uid = uid["uid"];
                    }
                }
                var object = Helper_1.validateId(uid, "user");
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                HttpHelper_1.makeApiCall("user", { uid: uid })
                    .then(function (userData) {
                    var appUser = UsersController_1.UsersController.trasformJSONUser(userData.data);
                    resolve(appUser);
                })["catch"](function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.getLoggedInUser = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                CometChat.localStorage.get(Constants_1.LOCAL_STORE.KEY_USER).then(function (user) {
                    if (user) {
                        resolve(CometChat.user = new UserModel_1.Me(user));
                    }
                    else {
                        var userAgent = "", deviceId = "";
                        var platform = Constants_1.APPINFO.platform, sdkVersion = Constants_1.APPINFO.sdkVersion, apiVersion = Constants_1.APPINFO.apiVersion;
                        CometChat.keyStore.get(Constants_1.LOCAL_STORE.KEY_DEVICE_ID).then(function (id) {
                            deviceId = id;
                            if (navigator) {
                                userAgent = navigator.userAgent;
                            }
                            if (deviceId == null) {
                                var uuid = uuidv4();
                                var timestamp = new Date().getTime();
                                deviceId = _this.appId + "_" + uuid + "_" + timestamp;
                                CometChat.keyStore.set(Constants_1.LOCAL_STORE.KEY_DEVICE_ID, deviceId);
                            }
                            var appInfo = {
                                version: sdkVersion,
                                apiVersion: apiVersion,
                                userAgent: userAgent,
                            };
                            if (!Helper_1.isFalsy(_this.platform)) {
                                appInfo["platform"] = _this.platform;
                            }
                            if (!Helper_1.isFalsy(_this.language)) {
                                appInfo["language"] = _this.language;
                            }
                            if (!Helper_1.isFalsy(_this.resource)) {
                                appInfo["resource"] = _this.resource;
                            }
                            var body = {
                                "platform": platform,
                                "deviceId": deviceId,
                                "appInfo": appInfo
                            };
                            HttpHelper_1.makeApiCall("updateMyDetails", {}, body, false)
                                .then(function (data) {
                                if (data.data.jwt) {
                                    CometChat.jwt = data.data.jwt;
                                }
                                var settings = data.data.settings;
                                if (settings) {
                                    store_1.LocalStorage.getInstance().set("app_settings", settings);
                                    if (settings[Constants_1.APP_SETTINGS.KEYS.MODE]) {
                                        CometChat.setMode(settings[Constants_1.APP_SETTINGS.KEYS.MODE]);
                                    }
                                    if (settings[Constants_1.APP_SETTINGS.KEYS.SETTINGS_HASH]) {
                                        CometChat.settingsHash = settings[Constants_1.APP_SETTINGS.KEYS.SETTINGS_HASH];
                                    }
                                    if (settings[Constants_1.APP_SETTINGS.KEYS.SETTINGS_HASH_RECEIVED_AT]) {
                                        CometChat.settingsHashReceivedAt = settings[Constants_1.APP_SETTINGS.KEYS.SETTINGS_HASH_RECEIVED_AT];
                                    }
                                    if (settings[Constants_1.APP_SETTINGS.KEYS.ANALYTICS_PING_DISABLED]) {
                                        CometChat.isAnalyticsDisabled = true;
                                    }
                                    else {
                                        CometChat.isAnalyticsDisabled = false;
                                    }
                                }
                                resolve(new UserModel_1.Me(data.data));
                            }, function (error) {
                                reject(new CustomError_1.CometChatException(error.error));
                            })["catch"](function (error) {
                                reject(new CustomError_1.CometChatException(error));
                            });
                        });
                    }
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.getLoggedinUser = function () {
        return new Promise(function (resolve, reject) {
            try {
                CometChat.localStorage.get(Constants_1.LOCAL_STORE.KEY_USER).then(function (user) {
                    if (user) {
                        resolve(new UserModel_1.User(user));
                    }
                    else {
                        resolve(null);
                    }
                }, function (err) {
                    resolve(null);
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.blockUsers = function (blockedUids) {
        return new Promise(function (resolve, reject) {
            try {
                var object = Helper_1.validateArray(blockedUids, 'blockUsers');
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                if (Helper_1.isFalsy(blockedUids)) {
                    reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.USERS_REQUEST_ERRORS.EMPTY_USERS_LIST));
                }
                else {
                    HttpHelper_1.makeApiCall("blockUsers", {}, { blockedUids: blockedUids }).then(function (data) {
                        resolve(data.data);
                    }, function (err) {
                        reject(new CustomError_1.CometChatException(err.error));
                    });
                }
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.unblockUsers = function (blockedUids) {
        return new Promise(function (resolve, reject) {
            try {
                var object = Helper_1.validateArray(blockedUids, 'unblockUsers');
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                if (Helper_1.isFalsy(blockedUids)) {
                    reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.USERS_REQUEST_ERRORS.EMPTY_USERS_LIST));
                }
                else {
                    HttpHelper_1.makeApiCall("unblockUsers", {}, { blockedUids: blockedUids }).then(function (data) {
                        resolve(data.data);
                    }, function (err) {
                        reject(new CustomError_1.CometChatException(err.error));
                    });
                }
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    
    CometChat.getConversation = function (conversationWith, conversationType) {
        return new Promise(function (resolve, reject) {
            try {
                var conversationTypeObj = Helper_1.validateConversationType(conversationType);
                if (conversationTypeObj instanceof CustomError_1.CometChatException) {
                    reject(conversationTypeObj);
                    return;
                }
                var idObj = Helper_1.validateId(conversationWith, conversationType);
                if (idObj instanceof CustomError_1.CometChatException) {
                    reject(idObj);
                    return;
                }
                conversationType = conversationType.toLowerCase();
                conversationWith = conversationWith.toLowerCase();
                var data = {}, endpoint = "";
                if (conversationType === Constants_1.MessageConstatnts.RECEIVER_TYPE.GROUP) {
                    endpoint = "getGroupConversation";
                    data["guid"] = conversationWith;
                }
                else {
                    endpoint = "getUserConversation";
                    data["uid"] = conversationWith;
                }
                HttpHelper_1.makeApiCall(endpoint, data).then(function (response) {
                    if (response.data) {
                        var conversation = response.data;
                        resolve(ConversationController_1.ConversationController.trasformJSONConversation(conversation.conversationId, conversation.conversationType, conversation.lastMessage, conversation.conversationWith, parseInt(conversation.unreadMessageCount), conversation.tags ? conversation.tags : []));
                    }
                    else {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.ConversationErrors.CONVERSATION_NOT_FOUND), conversationType, conversationWith))));
                    }
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.tagConversation = function (conversationWith, conversationType, tags) {
        if (tags === void 0) { tags = []; }
        return new Promise(function (resolve, reject) {
            try {
                var conversationTypeObj = Helper_1.validateConversationType(conversationType);
                if (conversationTypeObj instanceof CustomError_1.CometChatException) {
                    reject(conversationTypeObj);
                    return;
                }
                var idObj = Helper_1.validateId(conversationWith, conversationType);
                if (idObj instanceof CustomError_1.CometChatException) {
                    reject(idObj);
                    return;
                }
                conversationType = conversationType.toLowerCase();
                conversationWith = conversationWith.toLowerCase();
                var data = {}, endpoint = "";
                if (conversationType === Constants_1.MessageConstatnts.RECEIVER_TYPE.GROUP) {
                    endpoint = "updateGroupConversation";
                    data["guid"] = conversationWith;
                }
                else {
                    endpoint = "updateUserConversation";
                    data["uid"] = conversationWith;
                }
                HttpHelper_1.makeApiCall(endpoint, data, { tags: tags }).then(function (response) {
                    if (response.data) {
                        var conversation = response.data;
                        resolve(ConversationController_1.ConversationController.trasformJSONConversation(conversation.conversationId, conversation.conversationType, conversation.lastMessage, conversation.conversationWith, parseInt(conversation.unreadMessageCount), conversation.tags ? conversation.tags : []));
                    }
                    else {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.ConversationErrors.CONVERSATION_NOT_FOUND), conversationType, conversationWith))));
                    }
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.deleteConversation = function (conversationWith, conversationType) {
        return new Promise(function (resolve, reject) {
            try {
                var conversationTypeObj = Helper_1.validateConversationType(conversationType);
                if (conversationTypeObj instanceof CustomError_1.CometChatException) {
                    reject(conversationTypeObj);
                    return;
                }
                var idObj = Helper_1.validateId(conversationWith, conversationType);
                if (idObj instanceof CustomError_1.CometChatException) {
                    reject(idObj);
                    return;
                }
                var data = {}, endpoint = "";
                conversationType = conversationType.toLowerCase();
                conversationWith = conversationWith.toLowerCase();
                if (conversationType === Constants_1.MessageConstatnts.RECEIVER_TYPE.GROUP) {
                    endpoint = "deleteGroupConversation";
                    data["guid"] = conversationWith;
                }
                else {
                    endpoint = "deleteUserConversation";
                    data["uid"] = conversationWith;
                }
                HttpHelper_1.makeApiCall(endpoint, data).then(function (response) {
                    var successMessage = "Conversation deleted successfully.";
                    resolve(successMessage);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    
    CometChat.createGroup = function (group) {
        return new Promise(function (resolve, reject) {
            try {
                var object = Helper_1.validateCreateGroup(group);
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                if (!(group instanceof Group_1.Group)) {
                    var tempGroup = void 0;
                    if (group.hasOwnProperty(Constants_1.GroupConstants.KEYS.GUID)) {
                        if (group.hasOwnProperty(Constants_1.GroupConstants.KEYS.NAME)) {
                            tempGroup = new Group_1.Group(group[Constants_1.GroupConstants.KEYS.GUID], group[Constants_1.GroupConstants.KEYS.NAME], "");
                            if (group.hasOwnProperty(Constants_1.GroupConstants.KEYS.TYPE)) {
                                if (group[Constants_1.GroupConstants.KEYS.TYPE].toLocaleLowerCase() == Constants_1.GroupType.Password) {
                                    if (group.hasOwnProperty(Constants_1.GroupConstants.KEYS.PASSWORD)) {
                                        tempGroup.setType(Constants_1.GROUP_TYPE.PASSWORD);
                                        tempGroup.setPassword(group[Constants_1.GroupConstants.KEYS.PASSWORD]);
                                    }
                                    else {
                                        reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.GROUP_CREATION_ERRORS.EMPTY_PASSWORD));
                                        return;
                                    }
                                }
                                else {
                                    tempGroup.setType(group[Constants_1.GroupConstants.KEYS.TYPE]);
                                }
                            }
                            else {
                                tempGroup.setType(Constants_1.GROUP_TYPE.PUBLIC);
                            }
                            if (group.hasOwnProperty(Constants_1.GroupConstants.KEYS.ICON)) {
                                tempGroup.setIcon(group[Constants_1.GroupConstants.KEYS.ICON]);
                            }
                            if (group.hasOwnProperty(Constants_1.GroupConstants.KEYS.DESCRIPTION)) {
                                tempGroup.setDescription(group[Constants_1.GroupConstants.KEYS.DESCRIPTION]);
                            }
                            if (group.hasOwnProperty(Constants_1.GroupConstants.KEYS.TAGS)) {
                                tempGroup.setTags(group[Constants_1.GroupConstants.KEYS.TAGS]);
                            }
                            group = tempGroup;
                        }
                        else {
                            reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.ERRORS.PARAMETER_MISSING));
                            return;
                        }
                    }
                    else {
                        reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.ERRORS.PARAMETER_MISSING));
                        return;
                    }
                }
                HttpHelper_1.makeApiCall("createGroup", {}, group).then(function (response) {
                    var createdGroup = GroupsController_1.GroupsController.trasformJSONGroup(response.data);
                    createdGroup.setHasJoined(true);
                    resolve(GroupsController_1.GroupsController.trasformJSONGroup(response.data));
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.getGroup = function (guid) {
        return new Promise(function (resolve, reject) {
            try {
                if (typeof guid === "object") {
                    if (guid.hasOwnProperty("guid")) {
                        guid = guid["guid"];
                    }
                }
                var object = Helper_1.validateId(guid, "group");
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                HttpHelper_1.makeApiCall("getGroup", { guid: guid }).then(function (response) {
                    resolve(GroupsController_1.GroupsController.trasformJSONGroup(response.data));
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.joinGroup = function (grp, type, password) {
        if (type === void 0) { type = Constants_1.GroupType.Public; }
        if (password === void 0) { password = ""; }
        return new Promise(function (resolve, reject) {
            try {
                var object = Helper_1.validateJoinGroup(grp, type, password);
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                var group = void 0;
                if (typeof grp === "object") {
                    if (grp.hasOwnProperty(Constants_1.GroupConstants.KEYS.GUID)) {
                        if (grp.hasOwnProperty(Constants_1.GroupConstants.KEYS.TYPE)) {
                            type = grp[Constants_1.GroupConstants.KEYS.TYPE];
                            if (grp[Constants_1.GroupConstants.KEYS.TYPE].toLocaleLowerCase() === Constants_1.GroupType.Password) {
                                if (grp.hasOwnProperty(Constants_1.GroupConstants.KEYS.PASSWORD)) {
                                    password = grp[Constants_1.GroupConstants.KEYS.PASSWORD];
                                }
                            }
                        }
                        grp = grp[Constants_1.GroupConstants.KEYS.GUID];
                    }
                    else {
                        reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.ERRORS.PARAMETER_MISSING));
                    }
                }
                if (Helper_1.isFalsy(password)) {
                    group = new Group_1.Group(grp, "name", type);
                }
                else {
                    group = new Group_1.Group(grp, "name", type, password);
                }
                HttpHelper_1.makeApiCall("joinGroup", group, group).then(function (response) {
                    var joinedGroup = GroupsController_1.GroupsController.trasformJSONGroup(response.data[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITIES][Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_FOR][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY]);
                    joinedGroup.setHasJoined(true);
                    resolve(joinedGroup);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.updateGroup = function (group) {
        return new Promise(function (resolve, reject) {
            try {
                var object = Helper_1.validateUpdateGroup(group);
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                if (!(group instanceof Group_1.Group)) {
                    var tempGroup = void 0;
                    if (group.hasOwnProperty(Constants_1.GroupConstants.KEYS.GUID)) {
                        tempGroup = new Group_1.Group(Constants_1.GroupConstants.KEYS.GUID, "", "");
                        if (!group.hasOwnProperty(Constants_1.GroupConstants.KEYS.TYPE)) {
                            group[Constants_1.GroupConstants.KEYS.TYPE] = Constants_1.GROUP_TYPE.PUBLIC;
                            tempGroup.setType[Constants_1.GROUP_TYPE.PUBLIC];
                        }
                        else {
                            tempGroup.setType(group[Constants_1.GroupConstants.KEYS.TYPE]);
                        }
                        if (group.hasOwnProperty(Constants_1.GroupConstants.KEYS.NAME)) {
                            tempGroup.setName(group[Constants_1.GroupConstants.KEYS.NAME]);
                        }
                        if (group.hasOwnProperty(Constants_1.GroupConstants.KEYS.ICON)) {
                            tempGroup.setIcon(group[Constants_1.GroupConstants.KEYS.ICON]);
                        }
                        if (group.hasOwnProperty(Constants_1.GroupConstants.KEYS.DESCRIPTION)) {
                            tempGroup.setDescription(group[Constants_1.GroupConstants.KEYS.DESCRIPTION]);
                        }
                        if (group.hasOwnProperty(Constants_1.GroupConstants.KEYS.TAGS)) {
                            tempGroup.setTags(group[Constants_1.GroupConstants.KEYS.TAGS]);
                        }
                        group = tempGroup;
                    }
                    else {
                        reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.ERRORS.PARAMETER_MISSING));
                        return;
                    }
                }
                HttpHelper_1.makeApiCall("updateGroup", group, group).then(function (response) {
                    resolve(GroupsController_1.GroupsController.trasformJSONGroup(response.data));
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.deleteGroup = function (guid) {
        return new Promise(function (resolve, reject) {
            try {
                var object = Helper_1.validateId(guid, "group");
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                HttpHelper_1.makeApiCall("deleteGroup", { guid: guid }).then(function (response) {
                    resolve(true);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.leaveGroup = function (guid) {
        return new Promise(function (resolve, reject) {
            try {
                var object = Helper_1.validateId(guid, "group");
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                HttpHelper_1.makeApiCall("leaveGroup", { guid: guid }).then(function (response) {
                    resolve(true);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.kickGroupMember = function (guid, uid) {
        return new Promise(function (resolve, reject) {
            try {
                var guidObj = Helper_1.validateId(guid, "group");
                if (guidObj instanceof CustomError_1.CometChatException) {
                    reject(guidObj);
                    return;
                }
                var uidObj = Helper_1.validateId(uid, "user");
                if (uidObj instanceof CustomError_1.CometChatException) {
                    reject(uidObj);
                    return;
                }
                HttpHelper_1.makeApiCall("kickGroupMembers", { guid: guid, uid: uid }).then(function (response) {
                    resolve(true);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.updateGroupMemberScope = function (guid, uid, scope) {
        return new Promise(function (resolve, reject) {
            try {
                var guidObj = Helper_1.validateId(guid, "group");
                if (guidObj instanceof CustomError_1.CometChatException) {
                    reject(guidObj);
                    return;
                }
                var uidObj = Helper_1.validateId(uid, "user");
                if (uidObj instanceof CustomError_1.CometChatException) {
                    reject(uidObj);
                    return;
                }
                var scopeObj = Helper_1.validateScope(scope);
                if (scopeObj instanceof CustomError_1.CometChatException) {
                    reject(scopeObj);
                    return;
                }
                HttpHelper_1.makeApiCall("changeScopeOfMember", { guid: guid, uid: uid }, { scope: scope }).then(function (response) {
                    resolve(true);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.banGroupMember = function (guid, uid) {
        return new Promise(function (resolve, reject) {
            try {
                var guidObj = Helper_1.validateId(guid, "group");
                if (guidObj instanceof CustomError_1.CometChatException) {
                    reject(guidObj);
                    return;
                }
                var uidObj = Helper_1.validateId(uid, "user");
                if (uidObj instanceof CustomError_1.CometChatException) {
                    reject(uidObj);
                    return;
                }
                HttpHelper_1.makeApiCall("banGroupMember", { guid: guid, uid: uid }).then(function (response) {
                    resolve(true);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.unbanGroupMember = function (guid, uid) {
        return new Promise(function (resolve, reject) {
            try {
                var guidObj = Helper_1.validateId(guid, "group");
                if (guidObj instanceof CustomError_1.CometChatException) {
                    reject(guidObj);
                    return;
                }
                var uidObj = Helper_1.validateId(uid, "user");
                if (uidObj instanceof CustomError_1.CometChatException) {
                    reject(uidObj);
                    return;
                }
                HttpHelper_1.makeApiCall("unbanGroupMember", { guid: guid, uid: uid }).then(function (response) {
                    resolve(true);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.addMembersToGroup = function (guid, groupMembers, bannedMembersList) {
        var admins = [], moderators = [], participants = [], usersToBan = [];
        return new Promise(function (resolve, reject) {
            try {
                var guidObj = Helper_1.validateId(guid, "group");
                if (guidObj instanceof CustomError_1.CometChatException) {
                    reject(guidObj);
                    return;
                }
                var groupMembersObj = Helper_1.validateArray(groupMembers, 'groupMembers');
                if (groupMembersObj instanceof CustomError_1.CometChatException) {
                    reject(groupMembersObj);
                    return;
                }
                if (bannedMembersList) {
                    var bannedMembersObj = Helper_1.validateArray(bannedMembersList, 'bannedMembers');
                    if (bannedMembersObj instanceof CustomError_1.CometChatException) {
                        reject(bannedMembersObj);
                        return;
                    }
                }
                if (Helper_1.isFalsy(groupMembers) && Helper_1.isFalsy(bannedMembersList))
                    reject(new CustomError_1.CometChatException({}));
                else if (!Helper_1.isFalsy(groupMembers) && !Helper_1.isFalsy(bannedMembersList)) {
                    groupMembers
                        .filter(function (groupMember) {
                        if (groupMember.getScope() == Constants_1.GROUP_MEMBER_SCOPE.ADMIN)
                            return true;
                    })
                        .map(function (groupMember) {
                        admins.push(groupMember.getUid());
                    });
                    groupMembers
                        .filter(function (groupMember) {
                        if (groupMember.getScope() == Constants_1.GROUP_MEMBER_SCOPE.MODERATOR)
                            return true;
                    })
                        .map(function (groupMember) {
                        moderators.push(groupMember.getUid());
                    });
                    groupMembers
                        .filter(function (groupMember) {
                        if (groupMember.getScope() == Constants_1.GROUP_MEMBER_SCOPE.PARTICIPANT)
                            return true;
                    })
                        .map(function (groupMember) {
                        participants.push(groupMember.getUid());
                    });
                    bannedMembersList.map(function (groupMember) {
                        usersToBan.push(groupMember);
                    });
                }
                else if (!Helper_1.isFalsy(groupMembers)) {
                    groupMembers
                        .filter(function (groupMember) {
                        if (groupMember.getScope() == Constants_1.GROUP_MEMBER_SCOPE.ADMIN)
                            return true;
                    })
                        .map(function (groupMember) {
                        admins.push(groupMember.getUid());
                    });
                    groupMembers
                        .filter(function (groupMember) {
                        if (groupMember.getScope() == Constants_1.GROUP_MEMBER_SCOPE.MODERATOR)
                            return true;
                    })
                        .map(function (groupMember) {
                        moderators.push(groupMember.getUid());
                    });
                    groupMembers
                        .filter(function (groupMember) {
                        if (groupMember.getScope() == Constants_1.GROUP_MEMBER_SCOPE.PARTICIPANT)
                            return true;
                    })
                        .map(function (groupMember) {
                        participants.push(groupMember.getUid());
                    });
                }
                else {
                    bannedMembersList.map(function (groupMember) {
                        usersToBan.push(groupMember);
                    });
                }
                var data = {};
                if (!Helper_1.isFalsy(admins))
                    data = __assign(__assign({}, data), { admins: admins });
                if (!Helper_1.isFalsy(participants))
                    data = __assign(__assign({}, data), { participants: participants });
                if (!Helper_1.isFalsy(moderators))
                    data = __assign(__assign({}, data), { moderators: moderators });
                if (!Helper_1.isFalsy(usersToBan))
                    data = __assign(__assign({}, data), { usersToBan: usersToBan });
                HttpHelper_1.makeApiCall("addMemebersToGroup", { guid: guid }, data).then(function (response) {
                    var responseList = {};
                    Object.keys(response.data.admins).map(function (uid) {
                        if (response.data.admins[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS]) {
                            responseList[uid] = Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS;
                        }
                        else {
                            responseList[uid] = response.data.admins[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.ERROR][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.MESSAGE];
                        }
                    });
                    Object.keys(response.data.participants).map(function (uid) {
                        if (response.data.participants[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS]) {
                            responseList[uid] = Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS;
                        }
                        else {
                            responseList[uid] = response.data.participants[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.ERROR][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.MESSAGE];
                        }
                    });
                    Object.keys(response.data.moderators).map(function (uid) {
                        if (response.data.moderators[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS]) {
                            responseList[uid] = Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS;
                        }
                        else {
                            responseList[uid] = response.data.moderators[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.ERROR][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.MESSAGE];
                        }
                    });
                    Object.keys(response.data.usersToBan).map(function (uid) {
                        if (response.data.usersToBan[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS]) {
                            responseList[uid] = Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS;
                        }
                        else {
                            responseList[uid] = response.data.usersToBan[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.ERROR][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.MESSAGE];
                        }
                    });
                    resolve(responseList);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.transferGroupOwnership = function (guid, uid) {
        return new Promise(function (resolve, reject) {
            try {
                var guidObj = Helper_1.validateId(guid, "group");
                if (guidObj instanceof CustomError_1.CometChatException) {
                    reject(guidObj);
                    return;
                }
                var uidObj = Helper_1.validateId(uid, "user");
                if (uidObj instanceof CustomError_1.CometChatException) {
                    reject(uidObj);
                    return;
                }
                HttpHelper_1.makeApiCall("transferOwnership", { guid: guid }, { owner: uid }).then(function (response) {
                    var successMessage;
                    if (response && response.data && response.data.message) {
                        successMessage = response.data.message;
                    }
                    else {
                        successMessage = "Ownership transferred to user " + uid + " for the group with guid " + guid + ".";
                    }
                    resolve(successMessage);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.createGroupWithMembers = function (group, members, banMembers) {
        var admins = [], moderators = [], participants = [], usersToBan = [];
        return new Promise(function (resolve, reject) {
            try {
                var groupObject = Helper_1.validateCreateGroup(group);
                if (groupObject instanceof CustomError_1.CometChatException) {
                    reject(groupObject);
                    return;
                }
                if (members && members.length > 0) {
                    var groupMembersObj = Helper_1.validateArray(members, 'groupMembers');
                    if (groupMembersObj instanceof CustomError_1.CometChatException) {
                        reject(groupMembersObj);
                        return;
                    }
                    members.map(function (member) {
                        if (member.getScope() === Constants_1.GROUP_MEMBER_SCOPE.ADMIN) {
                            admins.push(member.getUid());
                        }
                        if (member.getScope() === Constants_1.GROUP_MEMBER_SCOPE.MODERATOR) {
                            moderators.push(member.getUid());
                        }
                        if (member.getScope() === Constants_1.GROUP_MEMBER_SCOPE.PARTICIPANT) {
                            participants.push(member.getUid());
                        }
                    });
                }
                if (banMembers && banMembers.length > 0) {
                    var bannedMembersObj = Helper_1.validateArray(banMembers, 'bannedMembers');
                    if (bannedMembersObj instanceof CustomError_1.CometChatException) {
                        reject(bannedMembersObj);
                        return;
                    }
                    banMembers.map(function (groupMember) {
                        usersToBan.push(groupMember);
                    });
                }
                var data = {};
                data = __assign({}, group);
                if (!Helper_1.isFalsy(admins))
                    data["members"] = __assign(__assign({}, data["members"]), { admins: admins });
                if (!Helper_1.isFalsy(participants))
                    data["members"] = __assign(__assign({}, data["members"]), { participants: participants });
                if (!Helper_1.isFalsy(moderators))
                    data["members"] = __assign(__assign({}, data["members"]), { moderators: moderators });
                if (!Helper_1.isFalsy(usersToBan))
                    data["members"] = __assign(__assign({}, data["members"]), { usersToBan: usersToBan });
                HttpHelper_1.makeApiCall("createGroup", {}, data).then(function (response) {
                    var responseList = {};
                    responseList["members"] = {};
                    var membersResponse = response["data"]["members"]["data"] ? response["data"]["members"]["data"] : { admins: {}, moderators: {}, participants: {}, usersToBan: {} };
                    Object.keys(membersResponse.admins).map(function (uid) {
                        if (membersResponse.admins[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS]) {
                            responseList["members"][uid] = Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS;
                        }
                        else {
                            responseList["members"][uid] = membersResponse.admins[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.ERROR][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.MESSAGE];
                        }
                    });
                    Object.keys(membersResponse.participants).map(function (uid) {
                        if (membersResponse.participants[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS]) {
                            responseList["members"][uid] = Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS;
                        }
                        else {
                            responseList["members"][uid] = membersResponse.participants[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.ERROR][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.MESSAGE];
                        }
                    });
                    Object.keys(membersResponse.moderators).map(function (uid) {
                        if (membersResponse.moderators[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS]) {
                            responseList["members"][uid] = Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS;
                        }
                        else {
                            responseList["members"][uid] = membersResponse.moderators[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.ERROR][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.MESSAGE];
                        }
                    });
                    Object.keys(membersResponse.usersToBan).map(function (uid) {
                        if (membersResponse.usersToBan[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS]) {
                            responseList["members"][uid] = Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.SUCCESS;
                        }
                        else {
                            responseList["members"][uid] = membersResponse.usersToBan[uid][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.ERROR][Constants_1.ResponseConstants.RESPONSE_KEYS.GROUP_MEMBERS_RESPONSE.MESSAGE];
                        }
                    });
                    delete response["data"]["members"];
                    var groupResponse = response["data"];
                    var createdGroup = GroupsController_1.GroupsController.trasformJSONGroup(groupResponse);
                    createdGroup.setHasJoined(true);
                    responseList = __assign(__assign({}, responseList), { group: createdGroup });
                    resolve(responseList);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    
    CometChat.initiateCall = function (call) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var activeCall = _this.getActiveCall();
            if (activeCall === null) {
                try {
                    if (Helper_1.isFalsy(JSON.parse(JSON.stringify(call)).sender)) {
                        if (Helper_1.isFalsy(activeCall)) {
                            call.setStatus(Constants_1.CallConstants.CALL_STATUS.INITIATED);
                            call.receiver = call.receiverId.toString();
                            delete call.receiverId;
                            HttpHelper_1.makeApiCall("createCallSession", {}, call).then(function (response) {
                                var call = MessageController_1.MessageController.trasformJSONMessge(response[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA]);
                                CallController_1.CallController.getInstance()
                                    .initiateCall(call)
                                    .then(function (initiatedCall) {
                                    resolve(call);
                                })["catch"](function (error) {
                                    reject(new CustomError_1.CometChatException(error));
                                });
                            }, function (error) {
                                reject(new CustomError_1.CometChatException(error.error));
                            });
                        }
                        else {
                            reject(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.ERROR_IN_CALLING));
                        }
                    }
                    else {
                        CallController_1.CallController.getInstance()
                            .initiateCall(call)
                            .then(function (initiatedCall) {
                            resolve(Object.assign(call));
                        })["catch"](function (error) {
                            reject(new CustomError_1.CometChatException(error));
                        });
                    }
                }
                catch (err) {
                    reject(new CustomError_1.CometChatException(err));
                }
            }
            else {
                reject(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.CALL_ALREADY_INITIATED));
            }
        });
    };
    
    CometChat.acceptCall = function (sessionid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var activeCall = _this.getActiveCall();
            if (activeCall === null) {
                try {
                    var status_1 = {};
                    status_1[Constants_1.CallConstants.CALL_KEYS.CALL_STATUS] = Constants_1.CallConstants.CALL_STATUS.ONGOING;
                    HttpHelper_1.makeApiCall("updateCallSession", { sessionid: sessionid }, status_1).then(function (response) {
                        var call = MessageController_1.MessageController.trasformJSONMessge(response[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA]);
                        CallController_1.CallController.getInstance().onCallStarted(call);
                        resolve(call);
                    }, function (error) {
                        reject(new CustomError_1.CometChatException(error.error));
                    });
                }
                catch (err) {
                    reject(new CustomError_1.CometChatException(err));
                }
            }
            else {
                reject(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.CANNOT_ACCEPT_CALL));
            }
        });
    };
    
    CometChat.rejectCall = function (sessionId, status) {
        try {
            switch (status) {
                case Constants_1.CallConstants.CALL_STATUS.REJECTED:
                    return this.rejectIncomingCall(sessionId);
                case Constants_1.CallConstants.CALL_STATUS.CANCELLED:
                    return this.cancelCall(sessionId);
                case Constants_1.CallConstants.CALL_STATUS.BUSY:
                    return this.sendBusyResponse(sessionId);
                default:
                    return this.endCall(sessionId, true);
            }
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: rejectCall", err);
        }
    };
    
    CometChat.endCall = function (sessionid, isInternal) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (Helper_1.isFalsy(isInternal)) {
                isInternal = false;
            }
            var activeCall = _this.getActiveCall();
            if (activeCall !== null) {
                if (activeCall.getSessionId() === sessionid) {
                    try {
                        var jsonData = {};
                        jsonData[Constants_1.CallConstants.CALL_KEYS.CALL_STATUS] = Constants_1.CallConstants.CALL_STATUS.ENDED;
                        if (activeCall.getJoinedAt())
                            jsonData[Constants_1.CallConstants.CALL_KEYS.CALL_JOINED_AT] = activeCall.getJoinedAt();
                        HttpHelper_1.makeApiCall("updateCallSession", { sessionid: sessionid }, jsonData).then(function (response) {
                            if (!isInternal) {
                                CallController_1.CallController.getInstance().endSession();
                            }
                            var call = MessageController_1.MessageController.trasformJSONMessge(response[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA]);
                            resolve(call);
                            if (CallController_1.CallController.getInstance().getCallListner()) {
                                CallController_1.CallController.getInstance().getCallListner()._eventListener.onCallEnded(call);
                            }
                            CallController_1.CallController.getInstance().endCall();
                        }, function (error) {
                            Helper_1.Logger.log("calling Log", { error: error });
                            if (!isInternal) {
                                CallController_1.CallController.getInstance().endSession();
                            }
                            activeCall.setStatus(Constants_1.CallConstants.CALL_STATUS.ENDED);
                            resolve(activeCall);
                            if (CallController_1.CallController.getInstance().getCallListner()) {
                                CallController_1.CallController.getInstance().getCallListner()._eventListener.onCallEnded(activeCall);
                            }
                            CallController_1.CallController.getInstance().endCall();
                        });
                    }
                    catch (err) {
                        reject(new CustomError_1.CometChatException(err));
                    }
                }
            }
            else {
                if (!isInternal) {
                    CallController_1.CallController.getInstance().endSession();
                }
                resolve(null);
                if (CallController_1.CallController.getInstance().getCallListner()) {
                    CallController_1.CallController.getInstance().getCallListner()._eventListener.onCallEnded(null);
                }
                CallController_1.CallController.getInstance().endCall();
            }
        });
    };
    
    CometChat.getActiveCall = function () {
        try {
            return CallController_1.CallController.getInstance().getActiveCall();
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: getActiveCall", err);
        }
    };
    
    CometChat.startCall = function (callSettings, view, ongoingCallListener) {
        var _this = this;
        try {
            var callSettingsNew_1;
            var activeCall_1 = this.getActiveCall();
            var sessionId_1, isAudioCall_1 = false, defaultLayout_1 = true, showPauseVideoButton_1 = true, showMuteAudioButton_1 = true, showEndCallButton_1 = true, showScreenShareButton_1 = true, showSwitchModeButton_1 = true, startAudioMuted_1 = false, startVideoMuted_1 = false, mode_1 = Constants_1.CallConstants.CALL_MODE.DEFAULT, customCSS_1, showRecordingButton_1 = false, startRecordingOnCallStart_1 = false, useLegacyUI_1 = false, showSwitchAudioToVideoButton_1 = true, virtualBackground_1, showVirtualBackgroundSetting_1 = true, mainVideoContainerSetting_1;
            var region_1, appId_1, domain_1, localizedStringObject_1, analyticsSetting_1 = {};
            var user_1 = this.user;
            var rtcUser_1;
            virtualBackground_1 = new CallSettings_1.VirtualBackgroundBuilder().build();
            mainVideoContainerSetting_1 = new CallSettings_1.MainVideoContainerSetting();
            Helper_1.getAppSettings().then(function (appSettings) {
                domain_1 = appSettings[Constants_1.APP_SETTINGS.KEYS.WEBRTC_HOST];
                analyticsSetting_1[Constants_1.APP_SETTINGS.KEYS.ANALYTICS_HOST] = appSettings[Constants_1.APP_SETTINGS.KEYS.ANALYTICS_HOST];
                analyticsSetting_1[Constants_1.APP_SETTINGS.KEYS.ANALYTICS_VERSION] = appSettings[Constants_1.APP_SETTINGS.KEYS.ANALYTICS_VERSION];
                analyticsSetting_1[Constants_1.APP_SETTINGS.KEYS.ANALYTICS_PING_DISABLED] = appSettings[Constants_1.APP_SETTINGS.KEYS.ANALYTICS_PING_DISABLED];
                analyticsSetting_1[Constants_1.APP_SETTINGS.KEYS.ANALYTICS_USE_SSL] = appSettings[Constants_1.APP_SETTINGS.KEYS.ANALYTICS_USE_SSL];
                region_1 = appSettings[Constants_1.APP_SETTINGS.KEYS.REGION];
                if (!Helper_1.isFalsy(ongoingCallListener)) {
                    CallController_1.CallController.getInstance().setCallListner(ongoingCallListener);
                }
                if (Helper_1.isFalsy(_this.appSettings)) {
                    if (CallController_1.CallController.getInstance().getCallListner()) {
                        CallController_1.CallController.getInstance().getCallListner()._eventListener.onError(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.NOT_INITIALIZED));
                    }
                    return;
                }
                if (!region_1) {
                    if (CallController_1.CallController.getInstance().getCallListner()) {
                        CallController_1.CallController.getInstance().getCallListner()._eventListener.onError(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.NOT_INITIALIZED));
                    }
                    return;
                }
                if (!user_1) {
                    if (CallController_1.CallController.getInstance().getCallListner()) {
                        CallController_1.CallController.getInstance().getCallListner()._eventListener.onError(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.NOT_LOGGED_IN));
                    }
                    return;
                }
                else {
                    rtcUser_1 = new RTCUser_1.RTCUser(user_1.getUid());
                    rtcUser_1.setName(user_1.getName());
                    rtcUser_1.setAvatar(user_1.getAvatar());
                    rtcUser_1.setResource(CometChat.getSessionId());
                }
                if (!CometChat.appId) {
                    if (CallController_1.CallController.getInstance().getCallListner()) {
                        CallController_1.CallController.getInstance().getCallListner()._eventListener.onError(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.NOT_INITIALIZED));
                    }
                    return;
                }
                else {
                    appId_1 = CometChat.appId;
                }
                if (typeof (callSettings) === 'string') {
                    if (activeCall_1) {
                        var type = activeCall_1.getType();
                        isAudioCall_1 = type === Constants_1.CallConstants.CALL_TYPE.AUDIO ? true : false;
                        sessionId_1 = activeCall_1.getSessionId();
                    }
                    else {
                        if (Helper_1.isFalsy(callSettings)) {
                            if (CallController_1.CallController.getInstance().getCallListner()) {
                                CallController_1.CallController.getInstance().getCallListner()._eventListener.onError(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.SESSION_ID_REQUIRED));
                            }
                            return;
                        }
                        sessionId_1 = ("v1." + region_1 + "." + CometChat.getAppId() + "." + callSettings).toLowerCase();
                    }
                    if (!sessionId_1) {
                        if (CallController_1.CallController.getInstance().getCallListner()) {
                            CallController_1.CallController.getInstance().getCallListner()._eventListener.onError(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.SESSION_ID_REQUIRED));
                        }
                        return;
                    }
                    if (isAudioCall_1) {
                        showSwitchAudioToVideoButton_1 = true;
                    }
                    else {
                        showSwitchAudioToVideoButton_1 = false;
                    }
                    var data = {
                        uid: user_1.getUid(),
                        sessionId: sessionId_1
                    };
                    CometChat.getJWT(data).then(function (data) {
                        if (data.hasOwnProperty("token")) {
                            rtcUser_1.setJWT(data.token);
                            callSettingsNew_1 = new CallSettings_1.CallSettingsBuilder()
                                .setSessionID(sessionId_1)
                                .enableDefaultLayout(defaultLayout_1)
                                .setIsAudioOnlyCall(isAudioCall_1)
                                .setUser(rtcUser_1)
                                .setRegion(region_1)
                                .setAppId(appId_1)
                                .setDomain(domain_1)
                                .showEndCallButton(showEndCallButton_1)
                                .showMuteAudioButton(showMuteAudioButton_1)
                                .showPauseVideoButton(showPauseVideoButton_1)
                                .showScreenShareButton(showScreenShareButton_1)
                                .showModeButton(showSwitchModeButton_1)
                                .setMode(mode_1)
                                .setAnalyticsSettings(analyticsSetting_1)
                                .startWithAudioMuted(startAudioMuted_1)
                                .startWithVideoMuted(startVideoMuted_1)
                                .showRecordingButton(showRecordingButton_1)
                                .startRecordingOnCallStart(startRecordingOnCallStart_1)
                                .forceLegacyUI(useLegacyUI_1)
                                .showSwitchToVideoCallButton(showSwitchAudioToVideoButton_1)
                                .setVirtualBackground(virtualBackground_1)
                                .showVirtualBackgroundSetting(showVirtualBackgroundSetting_1)
                                .setMainVideoContainerSetting(mainVideoContainerSetting_1)
                                .build();
                            CallController_1.CallController.getInstance().startCall(callSettingsNew_1, view);
                        }
                        else {
                            if (CallController_1.CallController.getInstance().getCallListner()) {
                                CallController_1.CallController.getInstance().getCallListner()._eventListener.onError(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.JWT_NOT_FOUND));
                            }
                            return;
                        }
                    }, function (error) {
                        if (CallController_1.CallController.getInstance().getCallListner()) {
                            CallController_1.CallController.getInstance().getCallListner()._eventListener.onError(new CustomError_1.CometChatException(error));
                        }
                        return;
                    });
                }
                else {
                    if (Helper_1.isFalsy(callSettings)) {
                        if (CallController_1.CallController.getInstance().getCallListner()) {
                            CallController_1.CallController.getInstance().getCallListner()._eventListener.onError(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.CALL_SETTINGS_REQUIRED));
                        }
                        return;
                    }
                    if (activeCall_1) {
                        var type = activeCall_1.getType();
                        isAudioCall_1 = type === Constants_1.CallConstants.CALL_TYPE.AUDIO ? true : false;
                        sessionId_1 = activeCall_1.getSessionId();
                    }
                    else {
                        isAudioCall_1 = callSettings.isAudioOnlyCall();
                        if (Helper_1.isFalsy(callSettings.getSessionId())) {
                            if (CallController_1.CallController.getInstance().getCallListner()) {
                                CallController_1.CallController.getInstance().getCallListner()._eventListener.onError(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.SESSION_ID_REQUIRED));
                            }
                            return;
                        }
                        sessionId_1 = ("v1." + region_1 + "." + CometChat.getAppId() + "." + callSettings.getSessionId()).toLowerCase();
                    }
                    if (!sessionId_1) {
                        if (CallController_1.CallController.getInstance().getCallListner()) {
                            CallController_1.CallController.getInstance().getCallListner()._eventListener.onError(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.SESSION_ID_REQUIRED));
                        }
                        return;
                    }
                    defaultLayout_1 = callSettings.isDefaultLayoutEnabled();
                    showPauseVideoButton_1 = callSettings.isPauseVideoButtonEnabled();
                    showMuteAudioButton_1 = callSettings.isMuteAudioButtonEnabled();
                    showEndCallButton_1 = callSettings.isEndCallButtonEnabled();
                    showScreenShareButton_1 = callSettings.isScreenShareButtonEnabled();
                    mode_1 = callSettings.getMode();
                    localizedStringObject_1 = callSettings.getLocalizedStringObject();
                    customCSS_1 = callSettings.getCustomCSS();
                    showSwitchModeButton_1 = callSettings.isModeButtonEnabled();
                    startAudioMuted_1 = callSettings.getStartWithAudioMuted();
                    startVideoMuted_1 = callSettings.getStartWithVideoMuted();
                    showRecordingButton_1 = callSettings.isRecordingButtonEnabled();
                    startRecordingOnCallStart_1 = callSettings.shouldStartRecordingOnCallStart();
                    useLegacyUI_1 = callSettings.shouldUseLegacyUI();
                    if (isAudioCall_1) {
                        showSwitchAudioToVideoButton_1 = callSettings.isAudioToVideoButtonEnabled();
                    }
                    else {
                        showSwitchAudioToVideoButton_1 = false;
                    }
                    virtualBackground_1 = callSettings.getVirtualBackground();
                    showVirtualBackgroundSetting_1 = callSettings.isVirtualBackgroundSettingEnabled();
                    mainVideoContainerSetting_1 = callSettings.getMainVideoContainerSetting();
                    var data = {
                        uid: user_1.getUid(),
                        sessionId: sessionId_1
                    };
                    CometChat.getJWT(data).then(function (data) {
                        if (data.hasOwnProperty("token")) {
                            rtcUser_1.setJWT(data.token);
                            callSettingsNew_1 = new CallSettings_1.CallSettingsBuilder()
                                .setSessionID(sessionId_1)
                                .enableDefaultLayout(defaultLayout_1)
                                .setIsAudioOnlyCall(isAudioCall_1)
                                .setUser(rtcUser_1)
                                .setRegion(region_1)
                                .setAppId(appId_1)
                                .setDomain(domain_1)
                                .showEndCallButton(showEndCallButton_1)
                                .showMuteAudioButton(showMuteAudioButton_1)
                                .showPauseVideoButton(showPauseVideoButton_1)
                                .showScreenShareButton(showScreenShareButton_1)
                                .showModeButton(showSwitchModeButton_1)
                                .setMode(mode_1)
                                .setLocalizedStringObject(localizedStringObject_1)
                                .setCustomCSS(customCSS_1)
                                .setAnalyticsSettings(analyticsSetting_1)
                                .startWithAudioMuted(startAudioMuted_1)
                                .startWithVideoMuted(startVideoMuted_1)
                                .showRecordingButton(showRecordingButton_1)
                                .startRecordingOnCallStart(startRecordingOnCallStart_1)
                                .forceLegacyUI(useLegacyUI_1)
                                .showSwitchToVideoCallButton(showSwitchAudioToVideoButton_1)
                                .setVirtualBackground(virtualBackground_1)
                                .showVirtualBackgroundSetting(showVirtualBackgroundSetting_1)
                                .setMainVideoContainerSetting(mainVideoContainerSetting_1)
                                .build();
                            CallController_1.CallController.getInstance().startCall(callSettingsNew_1, view);
                        }
                        else {
                            if (CallController_1.CallController.getInstance().getCallListner()) {
                                CallController_1.CallController.getInstance().getCallListner()._eventListener.onError(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.JWT_NOT_FOUND));
                            }
                            return;
                        }
                    }, function (error) {
                        if (CallController_1.CallController.getInstance().getCallListner()) {
                            CallController_1.CallController.getInstance().getCallListner()._eventListener.onError(new CustomError_1.CometChatException(error));
                        }
                        return;
                    });
                }
            }, function (error) {
                Helper_1.Logger.error("CometChat: startCall", error);
            });
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: startCall", err);
        }
    };
    
    CometChat.getCallParticipantCount = function (sessionId, type) {
        return new Promise(function (resolve, reject) {
            try {
                Helper_1.getAppSettings().then(function (appSettings) {
                    if (Helper_1.isFalsy(sessionId)) {
                        return reject(new CustomError_1.CometChatException((Constants_1.ProsodyApiErrors.INVALID_SESSIONID)));
                    }
                    else if (Helper_1.isFalsy(type)) {
                        return reject(new CustomError_1.CometChatException((Constants_1.ProsodyApiErrors.INVALID_TYPE)));
                    }
                    else {
                        var region = appSettings[Constants_1.APP_SETTINGS.KEYS.REGION];
                        var data = {};
                        var rtcDomain = appSettings[Constants_1.APP_SETTINGS.KEYS.WEBRTC_HOST];
                        var subdomain = appSettings[Constants_1.APP_SETTINGS.KEYS.WEBRTC_API_SUBDOMAIN];
                        var endPoint = Helper_1.format(new EndpointFactory_1.EndpointFactory().prosodyApi, subdomain, rtcDomain, Constants_1.PROSODY_API.PATH.ROOM_SIZE);
                        if (type.toLowerCase() === "direct") {
                            sessionId = ("v1." + region + "." + CometChat.getAppId() + "." + sessionId).toLowerCase();
                        }
                        data[Constants_1.PROSODY_API.QUERY_PARAMETERS.DOMAIN] = rtcDomain;
                        data[Constants_1.PROSODY_API.QUERY_PARAMETERS.ROOM] = sessionId;
                        HttpHelper_1.postData(endPoint, "GET", data, {}, false)
                            .then(function (response) {
                            return response.text();
                        })
                            .then(function (res) {
                            var response = res ? JSON.parse(res) : {};
                            if (response.hasOwnProperty(Constants_1.PROSODY_API.RESPONSE.PARTICIPANTS)) {
                                return resolve(response[Constants_1.PROSODY_API.RESPONSE.PARTICIPANTS]);
                            }
                            else {
                                return resolve(0);
                            }
                        })["catch"](function () {
                            var err = {
                                error: CometChatErrorConstants_1.FETCH_ERROR.ERROR_IN_API_CALL
                            };
                            return reject(err);
                        });
                    }
                }, function (error) {
                    return reject(new CustomError_1.CometChatException(error));
                });
            }
            catch (error) {
                return reject(new CustomError_1.CometChatException(error));
            }
        });
    };
    
    
    CometChat.rejectIncomingCall = function (sessionid) {
        return new Promise(function (resolve, reject) {
            try {
                var status_2 = {};
                status_2[Constants_1.CallConstants.CALL_KEYS.CALL_STATUS] = Constants_1.CallConstants.CALL_STATUS.REJECTED;
                HttpHelper_1.makeApiCall("updateCallSession", { sessionid: sessionid }, status_2).then(function (response) {
                    var call = MessageController_1.MessageController.trasformJSONMessge(response[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA]);
                    resolve(call);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.cancelCall = function (sessionid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var status_3 = {};
                status_3[Constants_1.CallConstants.CALL_KEYS.CALL_STATUS] = Constants_1.CallConstants.CALL_STATUS.CANCELLED;
                HttpHelper_1.makeApiCall("updateCallSession", { sessionid: sessionid }, status_3).then(function (response) {
                    var call = MessageController_1.MessageController.trasformJSONMessge(response[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA]);
                    if (_this.getActiveCall().getSessionId() === sessionid) {
                        CallController_1.CallController.getInstance().endCallSession();
                    }
                    resolve(call);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.sendBusyResponse = function (sessionid) {
        return new Promise(function (resolve, reject) {
            try {
                var status_4 = {};
                status_4[Constants_1.CallConstants.CALL_KEYS.CALL_STATUS] = Constants_1.CallConstants.CALL_STATUS.BUSY;
                HttpHelper_1.makeApiCall("updateCallSession", { sessionid: sessionid }, status_4).then(function (response) {
                    var call = MessageController_1.MessageController.trasformJSONMessge(response[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA]);
                    resolve(call);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.sendUnansweredResponse = function (sessionid) {
        return new Promise(function (resolve, reject) {
            try {
                var status_5 = {};
                status_5[Constants_1.CallConstants.CALL_KEYS.CALL_STATUS] = Constants_1.CallConstants.CALL_STATUS.UNANSWERED;
                HttpHelper_1.makeApiCall("updateCallSession", { sessionid: sessionid }, status_5).then(function (response) {
                    var call = MessageController_1.MessageController.trasformJSONMessge(response[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA]);
                    _WSConnectionHelper.publishCallMessage(call);
                    resolve(call);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    
    CometChat.addConnectionListener = function (name, connectionListener) {
        try {
            _listenerHandlers.addConnectionEventListener(name, connectionListener);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: addConnectionListener", err);
        }
    };
    
    CometChat.removeConnectionListener = function (name) {
        try {
            _listenerHandlers.removeConnectionEventListener(name);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: removeConnectionListener", err);
        }
    };
    
    CometChat.addMessageListener = function (name, messageListener) {
        try {
            _listenerHandlers.addMessageEventListener(name, messageListener);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: addMessageListener", err);
        }
    };
    
    CometChat.removeMessageListener = function (name) {
        try {
            _listenerHandlers.removeMessageEventListener(name);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: removeMessageListener", err);
        }
    };
    
    CometChat.addCallListener = function (name, callListener) {
        try {
            _listenerHandlers.addCallEventListener(name, callListener);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: addCallListener", err);
        }
    };
    
    CometChat.removeCallListener = function (name) {
        try {
            _listenerHandlers.removeCallEventListener(name);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: removeCallListener", err);
        }
    };
    
    CometChat.addUserListener = function (name, userListener) {
        try {
            _listenerHandlers.addUserEventListener(name, userListener);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: addUserListener", err);
        }
    };
    
    CometChat.removeUserListener = function (name) {
        try {
            _listenerHandlers.removeUserEventListener(name);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: removeUserListener", err);
        }
    };
    
    CometChat.addGroupListener = function (name, groupListener) {
        try {
            _listenerHandlers.addGroupEventListener(name, groupListener);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: addGroupListener", err);
        }
    };
    
    CometChat.removeGroupListener = function (name) {
        try {
            _listenerHandlers.removeGroupEventListener(name);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: removeGroupListener", err);
        }
    };
    
    CometChat.addLoginListener = function (name, loginListener) {
        try {
            _listenerHandlers.addLoginEventListener(name, loginListener);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: addLoginListener", err);
        }
    };
    
    CometChat.removeLoginListener = function (name) {
        try {
            _listenerHandlers.removeLoginEventListener(name);
        }
        catch (err) {
            Helper_1.Logger.error("CometChat: removeLoginListener", err);
        }
    };
    
    
    CometChat.generateAuthToken = function (uid) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var data_1 = {};
                var deviceId_1 = '';
                var userAgent_1 = '';
                var platform_1 = Constants_1.APPINFO.platform, sdkVersion_1 = Constants_1.APPINFO.sdkVersion, apiVersion_1 = Constants_1.APPINFO.apiVersion;
                if (navigator) {
                    userAgent_1 = navigator.userAgent;
                }
                CometChat.keyStore.get(Constants_1.LOCAL_STORE.KEY_DEVICE_ID).then(function (id) {
                    deviceId_1 = id;
                    if (deviceId_1 == null) {
                        var uuid = uuidv4();
                        var timestamp = new Date().getTime();
                        deviceId_1 = _this.appId + "_" + uuid + "_" + timestamp;
                        CometChat.keyStore.set(Constants_1.LOCAL_STORE.KEY_DEVICE_ID, deviceId_1);
                    }
                    data_1 = {
                        "platform": platform_1,
                        "deviceId": deviceId_1,
                        "appInfo": {
                            "version": sdkVersion_1,
                            "apiVersion": apiVersion_1,
                            "userAgent": userAgent_1
                        }
                    };
                    HttpHelper_1.makeApiCall("authToken", { uid: uid }, data_1)
                        .then(function (res) {
                        resolve(res.data);
                    })["catch"](function (error) {
                        reject(new CustomError_1.CometChatException(error.error));
                    });
                }, function (err) {
                    Helper_1.Logger.error("Got error while fetching data from key store", err);
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    CometChat.tryReconnectingToWS = function () {
        
        if (!CometChat.WSReconnectionInProgress) {
            CometChat.startWSReconnectionTimer();
        }
    };
    
    CometChat.prototype.makeWSConnection = function () {
        CometChat.WSLogin(CometChat.user);
    };
    
    CometChat.prototype.accidentallyDisconnected = function () {
        CometChat.currentConnectionStatus = Constants_1.CONNECTION_STATUS.CONNECTING;
        _listenerHandlers.connectionHandlers.map(function (listener) {
            try {
                if (listener._eventListener) {
                    if (!Helper_1.isFalsy(listener._eventListener.inConnecting)) {
                        listener._eventListener.inConnecting();
                    }
                }
            }
            catch (e) {
                Helper_1.Logger.error("ConnectionHandlers: inConnecting Status", e);
            }
        });
        CometChat.tryReconnectingToWS();
    };
    CometChat.WSLogin = function (user) {
        var _this = this;
        if (!_WSConnectionHelper.connection) {
            _WSConnectionHelper.WSLogin(user.getJWT(), function (status) {
                switch (status) {
                    case WSConstants_1.READY_STATE.CONNECTING: {
                        var oldConnectionStatus = CometChat.getConnectionStatus();
                        if (oldConnectionStatus == Constants_1.CONNECTION_STATUS.DISCONNECTED) {
                            _this.currentConnectionStatus = Constants_1.CONNECTION_STATUS.CONNECTING;
                            _listenerHandlers.connectionHandlers.map(function (listener) {
                                try {
                                    if (listener._eventListener) {
                                        if (!Helper_1.isFalsy(listener._eventListener.inConnecting)) {
                                            listener._eventListener.inConnecting();
                                        }
                                    }
                                }
                                catch (e) {
                                    Helper_1.Logger.error("connectionHandlers: Connecting Status", e);
                                }
                            });
                        }
                        break;
                    }
                    case WSConstants_1.READY_STATE.OPEN: {
                        var oldConnectionStatus = CometChat.getConnectionStatus();
                        if (oldConnectionStatus == Constants_1.CONNECTION_STATUS.CONNECTING) {
                            _this.currentConnectionStatus = Constants_1.CONNECTION_STATUS.CONNECTED;
                            _listenerHandlers.connectionHandlers.map(function (listener) {
                                try {
                                    if (listener._eventListener) {
                                        if (!Helper_1.isFalsy(listener._eventListener.onConnected)) {
                                            listener._eventListener.onConnected();
                                        }
                                    }
                                }
                                catch (e) {
                                    Helper_1.Logger.error("connectionHandlers: Connected Status", e);
                                }
                            });
                        }
                        if (CometChat.WSReconnectionInProgress) {
                            CometChat.clearWSReconnectionTimer();
                        }
                        break;
                    }
                    case WSConstants_1.READY_STATE.CLOSING: {
                        break;
                    }
                    case WSConstants_1.READY_STATE.CLOSED: {
                        var oldConnectionStatus = CometChat.getConnectionStatus();
                        if (oldConnectionStatus !== Constants_1.CONNECTION_STATUS.DISCONNECTED && oldConnectionStatus !== Constants_1.CONNECTION_STATUS.CONNECTING) {
                            _this.currentConnectionStatus = Constants_1.CONNECTION_STATUS.DISCONNECTED;
                            _listenerHandlers.connectionHandlers.map(function (listener) {
                                try {
                                    if (listener._eventListener) {
                                        if (!Helper_1.isFalsy(listener._eventListener.onDisconnected)) {
                                            listener._eventListener.onDisconnected();
                                        }
                                    }
                                }
                                catch (e) {
                                    Helper_1.Logger.error("connectionHandlers: Disconnected Status", e);
                                }
                            });
                        }
                        if (_WSConnectionHelper.connection) {
                            _WSConnectionHelper.connection = null;
                        }
                        if (!CometChat.isLoggedOut && !CometChat.disconnectedByUser) {
                            _this.tryReconnectingToWS();
                        }
                        break;
                    }
                }
            });
        }
        else {
            Helper_1.Logger.error("CometChat :: WSLogin", _WSConnectionHelper.connection);
        }
    };
    CometChat.pingAnalytics = function () {
        var _this = this;
        try {
            CometChat.keyStore.get("deviceId").then(function (id) {
                Helper_1.getAppSettings().then(function (appSettings) {
                    var origin = null;
                    if (window && window.location && window.location.origin) {
                        origin = window.location.origin;
                    }
                    var userAgent = "", deviceId = id, sdkVersion = Constants_1.SDKHeader.sdkVersion, apiVersion = appSettings[Constants_1.APP_SETTINGS.KEYS.CHAT_API_VERSION];
                    var appInfo = {
                        "version": sdkVersion,
                        "apiVersion": apiVersion,
                        "origin": origin,
                        "uts": new Date().getTime()
                    };
                    if (!Helper_1.isFalsy(_this.resource)) {
                        appInfo["resource"] = _this.resource;
                    }
                    if (!Helper_1.isFalsy(_this.platform)) {
                        appInfo["platform"] = _this.platform;
                    }
                    if (!Helper_1.isFalsy(_this.language)) {
                        appInfo["language"] = _this.language;
                    }
                    if (navigator) {
                        userAgent = navigator.userAgent;
                    }
                    var body = {
                        "appInfo": appInfo,
                        "uid": CometChat.user.getUid(),
                        "userAgent": userAgent,
                        "deviceId": deviceId,
                        "platform": Constants_1.SDKHeader.platform
                    };
                    if (!Helper_1.isFalsy(CometChat.getSessionId())) {
                        body["wsId"] = CometChat.getSessionId();
                    }
                    var endPoint = "https://" + appSettings[Constants_1.APP_SETTINGS.KEYS.ANALYTICS_HOST] + "/" + appSettings[Constants_1.APP_SETTINGS.KEYS.ANALYTICS_VERSION] + "/ping";
                    var headers = {
                        appId: CometChat.appId,
                        sdk: Helper_1.format(Constants_1.SDKHeader.sdk, Constants_1.SDKHeader.platform, Constants_1.SDKHeader.sdkVersion)
                    };
                    headers["Content-Type"] = "application/json";
                    if (CometChat.settingsHash) {
                        headers["settingsHash"] = CometChat.settingsHash;
                    }
                    if (CometChat.settingsHashReceivedAt) {
                        headers["settingsHashReceivedAt"] = CometChat.settingsHashReceivedAt;
                    }
                    if (CometChat.jwt) {
                        headers["Authorization"] = "Bearer " + CometChat.jwt;
                    }
                    if (CometChat.authToken) {
                        headers["authToken"] = CometChat.authToken;
                    }
                    HttpHelper_1.postData(endPoint, "POST", body, headers, false)
                        .then(function (response) {
                        return response.json();
                    })
                        .then(function (response) {
                        if (response.hasOwnProperty(Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA)) {
                            Helper_1.Logger.log('Analytics Ping Request Data', response[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA]);
                        }
                        else {
                            if (response.hasOwnProperty(Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ERROR)) {
                                var err = response[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ERROR];
                                Helper_1.Logger.log('Analytics Ping Request Error', new CustomError_1.CometChatException(err));
                                var errCode = err.code;
                                if (errCode === Constants_1.Errors.ERR_SETTINGS_HASH_OUTDATED) {
                                    var authToken = CometChat.authToken;
                                    CometChat.getInstance().internalRestart(authToken);
                                }
                                if (errCode === Constants_1.Errors.ERR_NO_AUTH) {
                                    _this.updateJWT();
                                }
                            }
                        }
                    })["catch"](function (error) {
                        Helper_1.Logger.error('CometChat: pingAnalytics Fetch Error', error);
                    });
                }, function (error) {
                    Helper_1.Logger.error('CometChat: pingAnalytics getSettings Error', error);
                });
            }, function (error) {
                Helper_1.Logger.error('CometChat: pingAnalytics getDeviceId Error', error);
            });
        }
        catch (e) {
            Helper_1.Logger.error("CometChat: pingAnalytics", e);
        }
    };
    CometChat.updateJWT = function () {
        HttpHelper_1.makeApiCall("getMyDetails", {}, {}, false)
            .then(function (data) {
            var userObj = data.data;
            var settingsObj = userObj.settings;
            var user = new UserModel_1.Me(userObj);
            if (userObj.hasOwnProperty('jwt') && userObj.jwt) {
                CometChat.jwt = userObj.jwt;
            }
            store_1.LocalStorage.getInstance().set('user', user);
            if (settingsObj && settingsObj[Constants_1.APP_SETTINGS.KEYS.SETTINGS_HASH]) {
                if (CometChat.settingsHash !== settingsObj[Constants_1.APP_SETTINGS.KEYS.SETTINGS_HASH]) {
                    var authToken = CometChat.getInstance().getAuthToken();
                    CometChat.getInstance().internalRestart(authToken);
                }
            }
            Helper_1.Logger.log('CometChat: updateJWT response', data);
        }, function (error) {
            Helper_1.Logger.error('CometChat: updateJWT Fetch Error', error);
        })["catch"](function (error) {
            Helper_1.Logger.error('CometChat: updateJWT', error);
        });
    };
    CometChat.startAnalyticsPingTimer = function () {
        var _this = this;
        CometChat.isAnalyticsPingStarted = true;
        CometChat.analyticsPingTimer = setInterval(function () {
            try {
                _this.pingAnalytics();
            }
            catch (e) {
                Helper_1.Logger.error("CometChat: startAnalyticsPingTimer", e);
            }
        }, CometChat.settingsInterval);
    };
    
    CometChat.clearAnalyticsPingTimer = function () {
        try {
            CometChat.isAnalyticsPingStarted = false;
            clearInterval(CometChat.analyticsPingTimer);
        }
        catch (e) {
            Helper_1.Logger.error("CometChat: clearAnalyticsPingTimer", e);
        }
    };
    CometChat.startWSReconnectionTimer = function () {
        CometChat.WSReconnectionInProgress = true;
        CometChat.WSReconnectionTimer = setInterval(function () {
            try {
                CometChat.WSLogin(CometChat.user);
            }
            catch (e) {
                Helper_1.Logger.error("CometChat: startWSReconnectionTimer", e);
            }
        }, CometChat.WSReconnectionTimerInterval);
    };
    CometChat.clearWSReconnectionTimer = function () {
        CometChat.WSReconnectionInProgress = false;
        clearInterval(CometChat.WSReconnectionTimer);
    };
    CometChat.getJWT = function (passThroughData) {
        return new Promise(function (resolve, reject) {
            try {
                EndPointUtils_1.getEndPoint("getJWT").then(function (endPointData) {
                    var headers = {
                        appId: CometChat.appId,
                        Accept: "application/json",
                        authToken: CometChat.authToken,
                        resource: CometChat.getSessionId(),
                        sdk: Helper_1.format(Constants_1.SDKHeader.sdk, Constants_1.SDKHeader.platform, Constants_1.SDKHeader.sdkVersion)
                    };
                    headers["Content-Type"] = "application/json";
                    var data = {};
                    data[Constants_1.JWT_API.KEYS.PASSTHROUGH] = passThroughData;
                    HttpHelper_1.postData(endPointData["endpoint"], endPointData["method"], data, headers, false)
                        .then(function (response) {
                        return response.json();
                    })
                        .then(function (response) {
                        if (response.hasOwnProperty(Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA)) {
                            resolve(response[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA]);
                        }
                        else {
                            reject(new CustomError_1.CometChatException(response.error));
                        }
                    })["catch"](function (error) {
                        var err = {
                            error: CometChatErrorConstants_1.FETCH_ERROR.ERROR_IN_API_CALL
                        };
                        reject(new CustomError_1.CometChatException(err));
                    });
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.getConnectionStatus = function () {
        return this.currentConnectionStatus;
    };
    
    CometChat.prototype.setConnectionStatus = function (connectionStatus) {
        CometChat.currentConnectionStatus = connectionStatus;
    };
    
    CometChat.isExtensionEnabled = function (extensionId) {
        return new Promise(function (resolve, reject) {
            try {
                if (Helper_1.isFalsy(extensionId)) {
                    return reject(new CustomError_1.CometChatException((Constants_1.ExtensionErrors.INVALID_EXTENSION)));
                }
                else {
                    Helper_1.getAppSettings().then(function (settings) {
                        if (settings.extensions) {
                            var extensions = settings.extensions;
                            if (extensions.length > 0) {
                                var isEnabled = extensions.some(function (ext) { return ext.id === extensionId; });
                                return resolve(isEnabled);
                            }
                            else {
                                return resolve(false);
                            }
                        }
                        else {
                            return reject(new CustomError_1.CometChatException((Constants_1.ExtensionErrors.EXTENSION_NOT_FOUND)));
                        }
                    }, function (error) {
                        return reject(new CustomError_1.CometChatException(error));
                    });
                }
            }
            catch (error) {
                return reject(new CustomError_1.CometChatException(error));
            }
        });
    };
    
    CometChat.getExtensionDetails = function (extensionId) {
        return new Promise(function (resolve, reject) {
            try {
                if (Helper_1.isFalsy(extensionId)) {
                    return reject(new CustomError_1.CometChatException((Constants_1.ExtensionErrors.INVALID_EXTENSION)));
                }
                else {
                    Helper_1.getAppSettings().then(function (settings) {
                        if (settings.extensions) {
                            var extensions = settings.extensions;
                            if (extensions.length > 0) {
                                var extension = extensions.filter(function (ext) { return ext.id === extensionId; });
                                if (extension.length > 0) {
                                    var extensionDetail = new CCExtension_1.CCExtension(extension[0]);
                                    return resolve(extensionDetail);
                                }
                                else {
                                    return reject(new CustomError_1.CometChatException((Constants_1.ExtensionErrors.EXTENSION_NOT_FOUND)));
                                }
                            }
                            else {
                                return reject(new CustomError_1.CometChatException((Constants_1.ExtensionErrors.EXTENSION_NOT_FOUND)));
                            }
                        }
                        else {
                            return reject(new CustomError_1.CometChatException((Constants_1.ExtensionErrors.EXTENSION_NOT_FOUND)));
                        }
                    }, function (error) {
                        return reject(new CustomError_1.CometChatException(error));
                    });
                }
            }
            catch (error) {
                return reject(new CustomError_1.CometChatException(error));
            }
        });
    };
    
    CometChat.getAppSettings = function () {
        return new Promise(function (resolve, reject) {
            try {
                HttpHelper_1.makeApiCall("appSettings").then(function (data) {
                    store_1.LocalStorage.getInstance().set(Constants_1.LOCAL_STORE.KEY_APP_SETTINGS, data.data);
                    resolve(data.data);
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.isFeatureEnabled = function (feature) {
        return new Promise(function (resolve, reject) {
            try {
                if (Helper_1.isFalsy(feature)) {
                    return reject(new CustomError_1.CometChatException((Constants_1.FeatureRestrictionErrors.INVALID_FEATURE)));
                }
                else {
                    Helper_1.getAppSettings().then(function (settings) {
                        if (settings.parameters) {
                            var parameters = settings.parameters;
                            if (parameters.hasOwnProperty(feature)) {
                                return resolve(parameters[feature]);
                            }
                            else {
                                return resolve(false);
                            }
                        }
                        else {
                            return reject(new CustomError_1.CometChatException((Constants_1.FeatureRestrictionErrors.FEATURE_NOT_FOUND)));
                        }
                    }, function (error) {
                        return reject(new CustomError_1.CometChatException(error));
                    });
                }
            }
            catch (error) {
                return reject(new CustomError_1.CometChatException(error));
            }
        });
    };
    
    CometChat.logout = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (CometChat.didAnalyticsPingStart()) {
                    CometChat.clearAnalyticsPingTimer();
                }
                if (CometChat.WSReconnectionInProgress) {
                    CometChat.clearWSReconnectionTimer();
                }
                CometChat.isLoggedOut = true;
                CometChat.WSReconnectionInProgress = false;
                CometChat.isAnalyticsDisabled = false;
                HttpHelper_1.makeApiCall("userLogout").then(function (data) {
                    _this.clearCache().then(function () {
                        CometChat.apiKey = undefined;
                        CometChat.user = undefined;
                        CometChat.authToken = undefined;
                        CometChat.cometChat = undefined;
                        CometChat.mode = undefined;
                        _WSConnectionHelper.WSLogout();
                        CometChat.pushToLoginListener('', 'Logout_Success');
                        resolve(data.data);
                    });
                }, function (error) {
                    _this.clearCache().then(function () {
                        CometChat.apiKey = undefined;
                        CometChat.user = undefined;
                        CometChat.authToken = undefined;
                        CometChat.cometChat = undefined;
                        CometChat.mode = undefined;
                        _WSConnectionHelper.WSLogout();
                        CometChat.pushToLoginListener('', 'Logout_Success');
                        var cometChatError = new CustomError_1.CometChatException(error.error);
                        if (cometChatError.code == CometChatErrorConstants_1.SERVER_ERRORS.AUTH_ERR.code) {
                            resolve({});
                        }
                        else {
                            reject(new CustomError_1.CometChatException(error.error));
                        }
                    });
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CometChat.callExtension = function (slug, method, endpoint, data) {
        if (data === void 0) { data = {}; }
        return new Promise(function (resolve, reject) {
            try {
                Helper_1.getAppSettings().then(function (appSettings) {
                    var endPoint = Helper_1.format(new EndpointFactory_1.EndpointFactory().extensionApi, slug, appSettings[Constants_1.APP_SETTINGS.KEYS.REGION], appSettings[Constants_1.APP_SETTINGS.KEYS.EXTENSION_DOMAIN], endpoint);
                    var headers = {
                        appId: CometChat.appId,
                        Accept: "application/json",
                        authToken: CometChat.authToken,
                        resource: CometChat.getSessionId(),
                        sdk: Helper_1.format(Constants_1.SDKHeader.sdk, Constants_1.SDKHeader.platform, Constants_1.SDKHeader.sdkVersion),
                        chatApiVersion: appSettings[Constants_1.APP_SETTINGS.KEYS.CHAT_API_VERSION]
                    };
                    headers["Content-Type"] = "application/json";
                    HttpHelper_1.postData(endPoint, method, data, headers, false)
                        .then(function (response) {
                        return response.json();
                    })
                        .then(function (response) {
                        if (response.hasOwnProperty(Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA)) {
                            resolve(response[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_DATA]);
                        }
                        else {
                            reject(new CustomError_1.CometChatException(response.error));
                        }
                    })["catch"](function (error) {
                        var err = {
                            error: CometChatErrorConstants_1.FETCH_ERROR.ERROR_IN_API_CALL
                        };
                        reject(err);
                    });
                }, function (error) {
                    return reject(new CustomError_1.CometChatException(error));
                });
            }
            catch (error) {
                return reject(new CustomError_1.CometChatException(error));
            }
        });
    };
    
    CometChat.setSource = function (resource, platform, language) {
        if (!Helper_1.isFalsy(resource)) {
            this.resource = resource;
        }
        if (!Helper_1.isFalsy(platform)) {
            this.platform = platform;
        }
        if (!Helper_1.isFalsy(language)) {
            this.language = language;
        }
    };
    
    CometChat.clearCache = function () {
        return new Promise(function (resolve, reject) {
            try {
                store_1.LocalStorage.getInstance().clearStore().then(function () {
                    CometChat.removeDataFromSessionStorage(Constants_1.SESSION_STORE.SESSION_ID);
                    Helper_1.Logger.info("CometChat: clearCache => All store cleared successfully", "true");
                    resolve(true);
                });
            }
            catch (err) {
                Helper_1.Logger.error("CometChat: clearCache", err);
                reject(err);
            }
        });
    };
    
    CometChat.connect = function () {
        if (CometChat.user) {
            if (!_WSConnectionHelper.connection) {
                CometChat.disconnectedByUser = false;
                CometChat.WSLogin(CometChat.user);
            }
            if (!CometChat.didAnalyticsPingStart() && !CometChat.isAnalyticsDisabled) {
                CometChat.pingAnalytics();
                CometChat.startAnalyticsPingTimer();
            }
        }
    };
    
    CometChat.disconnect = function () {
        if (CometChat.user) {
            CometChat.disconnectedByUser = true;
            if (_WSConnectionHelper.connection) {
                _WSConnectionHelper.WSLogout();
            }
            if (CometChat.didAnalyticsPingStart()) {
                CometChat.clearAnalyticsPingTimer();
            }
        }
    };
    
    CometChat.prototype.internalRestart = function (authToken) {
        if (!CometChat.internalRestart) {
            CometChat.getInstance().internalLogout(false).then(function () {
                CometChat.internalRestart = true;
                CometChat.login(authToken).then(function (user) {
                    CometChat.shouldConnectToWS = true;
                    CometChat.internalRestart = false;
                }, function (error) {
                    Helper_1.Logger.error("CometChat: internalRestart :: login", error);
                    CometChat.internalRestart = false;
                });
            }, function (error) {
                Helper_1.Logger.error("CometChat: internalRestart :: internalLogout", error);
            });
        }
    };
    
    CometChat.prototype.internalLogout = function (pushToLoginListener) {
        if (pushToLoginListener === void 0) { pushToLoginListener = true; }
        return new Promise(function (resolve, reject) {
            try {
                if (CometChat.didAnalyticsPingStart()) {
                    CometChat.clearAnalyticsPingTimer();
                }
                if (CometChat.WSReconnectionInProgress) {
                    CometChat.clearWSReconnectionTimer();
                }
                CometChat.isLoggedOut = true;
                CometChat.WSReconnectionInProgress = false;
                CometChat.isAnalyticsDisabled = false;
                CometChat.clearCache().then(function () {
                    CometChat.apiKey = undefined;
                    CometChat.user = undefined;
                    CometChat.authToken = undefined;
                    CometChat.cometChat = undefined;
                    CometChat.mode = undefined;
                    _WSConnectionHelper.WSLogout();
                    if (pushToLoginListener) {
                        CometChat.pushToLoginListener('', 'Logout_Success');
                    }
                    resolve(true);
                });
            }
            catch (err) {
                Helper_1.Logger.error("CometChat: internalLogout", err);
                reject(err);
            }
        });
    };
    CometChat.initialzed = false;
    CometChat.CometChatException = CustomError_1.CometChatException;
    CometChat.TextMessage = TextMessage_1.TextMessage;
    CometChat.MediaMessage = MediaMessage_1.MediaMessage;
    CometChat.CustomMessage = CustomMessage_1.CustomMessage;
    CometChat.Action = Action_1.Action;
    CometChat.Call = Call_1.Call;
    CometChat.TypingIndicator = TypingNotification_1.TypingIndicator;
    CometChat.TransientMessage = TransientMessage_1.TransientMessage;
    CometChat.Group = Group_1.Group;
    
    CometChat.User = UserModel_1.User;
    CometChat.GroupMember = GroupMember_1.GroupMember;
    CometChat.Conversation = ConversationModel_1.Conversation;
    CometChat.USER_STATUS = { ONLINE: Constants_1.PresenceConstatnts.STATUS.ONLINE, OFFLINE: Constants_1.PresenceConstatnts.STATUS.OFFLINE };
    CometChat.MessagesRequest = MessagesRequest_1.MessagesRequest;
    CometChat.MessagesRequestBuilder = MessagesRequest_1.MessagesRequestBuilder;
    CometChat.UsersRequest = UsersRequest_1.UsersRequest;
    CometChat.UsersRequestBuilder = UsersRequest_1.UsersRequestBuilder;
    CometChat.ConversationsRequest = ConversationRequest_1.ConversationsRequest;
    CometChat.ConversationsRequestBuilder = ConversationRequest_1.ConversationsRequestBuilder;
    CometChat.BlockedUsersRequest = BlockedUsersRequest_1.BlockedUsersRequest;
    CometChat.BlockedUsersRequestBuilder = BlockedUsersRequest_1.BlockedUsersRequestBuilder;
    CometChat.GroupsRequest = GroupsRequest_1.GroupsRequest;
    CometChat.GroupsRequestBuilder = GroupsRequest_1.GroupsRequestBuilder;
    CometChat.GroupMembersRequest = GroupMembersRequest_1.GroupMembersRequest;
    CometChat.GroupMembersRequestBuilder = GroupMembersRequest_1.GroupMembersRequestBuilder;
    CometChat.BannedMembersRequest = BannedMembersRequest_1.BannedMembersRequest;
    CometChat.BannedMembersRequestBuilder = BannedMembersRequest_1.BannedMembersRequestBuilder;
    CometChat.CallSettings = CallSettings_1.CallSettings;
    CometChat.CallSettingsBuilder = CallSettings_1.CallSettingsBuilder;
    CometChat.MainVideoContainerSetting = CallSettings_1.MainVideoContainerSetting;
    CometChat.VirtualBackground = CallSettings_1.VirtualBackground;
    CometChat.VirtualBackgroundBuilder = CallSettings_1.VirtualBackgroundBuilder;
    CometChat.AppSettings = AppSettings_1.AppSettings;
    CometChat.AppSettingsBuilder = AppSettings_1.AppSettingsBuilder;
    CometChat.MessageListener = Listner_1.MessageListener;
    CometChat.UserListener = Listner_1.UserListener;
    CometChat.GroupListener = Listner_1.GroupListener;
    CometChat.OngoingCallListener = Listner_1.OngoingCallListener;
    CometChat.CallListener = Listner_1.CallListener;
    CometChat.ConnectionListener = Listner_1.ConnectionListener;
    CometChat.LoginListener = Listner_1.LoginListener;
    CometChat.CallController = CallController_1.CallController;
    CometChat.CometChatHelper = CometChatHelper_1.CometChatHelper;
    CometChat.Attachment = attachment_1.Attachment;
    CometChat.MediaDevice = MediaDevice_1.MediaDevice;
    CometChat.MESSAGE_TYPE = Constants_1.MessageConstatnts.TYPE;
    CometChat.CATEGORY_MESSAGE = Constants_1.MessageConstatnts.CATEGORY.MESSAGE;
    CometChat.CATEGORY_ACTION = Constants_1.MessageConstatnts.CATEGORY.ACTION;
    CometChat.CATEGORY_CALL = Constants_1.MessageConstatnts.CATEGORY.CALL;
    CometChat.CATEGORY_CUSTOM = Constants_1.MessageConstatnts.CATEGORY.CUSTOM;
    CometChat.ACTION_TYPE = Constants_1.ActionConstatnts.ACTIONS;
    CometChat.CALL_TYPE = Constants_1.CallConstants.CALL_TYPE;
    CometChat.RECEIVER_TYPE = Constants_1.MessageConstatnts.RECEIVER_TYPE;
    CometChat.CALL_STATUS = Constants_1.CallConstants.CALL_STATUS;
    CometChat.GROUP_MEMBER_SCOPE = Constants_1.GROUP_MEMBER_SCOPE;
    CometChat.GROUP_TYPE = Constants_1.GROUP_TYPE;
     CometChat.MESSAGE_REQUEST = Constants_1.MessageConstatnts.PAGINATION.CURSOR_FILEDS;
    CometChat.CONNECTION_STATUS = Constants_1.CONNECTION_STATUS;
    CometChat.CALL_MODE = Constants_1.CallConstants.CALL_MODE;
    CometChat.SORT_BY = Constants_1.UserConstants.SORT_BY;
    CometChat.SORT_ORDER = Constants_1.UserConstants.SORT_ORDER;
    CometChat.WSReconnectionInProgress = false;
    CometChat.WSReconnectionTimerInterval = 5000;
    CometChat.currentConnectionStatus = Constants_1.CONNECTION_STATUS.DISCONNECTED;
    CometChat.isConnectingFromInit = false;
    CometChat.loginInProgress = false;
    CometChat.internalRestart = false;
    CometChat.settingsInterval = 60000;
    CometChat.isAnalyticsPingStarted = false;
    CometChat.isLoggedOut = true;
    CometChat.isAnalyticsDisabled = false;
    CometChat.disconnectedByUser = false;
    CometChat.shouldConnectToWS = true;
    return CometChat;
}());
exports.CometChat = CometChat;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Me = exports.User = void 0;

var CustomError_1 = __webpack_require__(2);
var CometChatErrorConstants_1 = __webpack_require__(13);
var Constants_1 = __webpack_require__(1);

var User =  (function () {
    function User() {
        var userObj = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            userObj[_i] = arguments[_i];
        }
        this.hasBlockedMe = false;
        this.blockedByMe = false;
        this.deactivatedAt = 0;
        if (userObj.length === 1) {
            if (typeof userObj[0] === Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                this.uid = userObj[0];
            }
            else {
                this.uid = userObj[0].uid;
                this.name = userObj[0].name;
                if (userObj[0].authToken)
                    this.authToken = userObj[0].authToken;
                if (userObj[0].avatar)
                    this.avatar = userObj[0].avatar;
                if (userObj[0].lastActiveAt)
                    this.lastActiveAt = userObj[0].lastActiveAt;
                if (userObj[0].link)
                    this.link = userObj[0].link;
                if (userObj[0].metadata)
                    this.metadata = userObj[0].metadata;
                if (userObj[0].role)
                    this.role = userObj[0].role;
                if (userObj[0].statusMessage)
                    this.statusMessage = userObj[0].statusMessage;
                if (userObj[0].status && userObj[0].status !== 'offline') {
                    this.status = 'online';
                }
                else {
                    this.status = 'offline';
                }
                if (userObj[0].tags) {
                    this.tags = userObj[0].tags;
                }
                if (userObj[0].deactivatedAt) {
                    this.deactivatedAt = userObj[0].deactivatedAt;
                }
            }
        }
        else if (userObj.length === 2) {
            this.uid = userObj[0];
            this.name = userObj[1];
        }
        else {
            throw new CustomError_1.CometChatException(CometChatErrorConstants_1.ERRORS.PARAMETER_MISSING);
        }
    }
    
    User.prototype.getUid = function () {
        return this.uid.toString();
    };
    
    User.prototype.setUid = function (uid) {
        this.uid = uid;
    };
    
    User.prototype.getName = function () {
        return this.name.toString();
    };
    
    User.prototype.setName = function (name) {
        if (name) {
            this.name = name;
        }
    };
    
    User.prototype.getAuthToken = function () {
        return this.authToken;
    };
    
    User.prototype.setAuthToken = function (authToken) {
        this.authToken = authToken;
    };
    
    User.prototype.getAvatar = function () {
        return this.avatar;
    };
    
    User.prototype.setAvatar = function (avatar) {
        this.avatar = avatar;
    };
    
    User.prototype.getLastActiveAt = function () {
        return this.lastActiveAt;
    };
    
    User.prototype.setLastActiveAt = function (lastActiveAt) {
        this.lastActiveAt = lastActiveAt;
    };
    
    User.prototype.getLink = function () {
        return this.link;
    };
    
    User.prototype.setLink = function (link) {
        return this.link = link;
    };
    
    User.prototype.getMetadata = function () {
        return this.metadata;
    };
    
    User.prototype.setMetadata = function (metadata) {
        this.metadata = metadata;
    };
    
    User.prototype.getRole = function () {
        return this.role;
    };
    
    User.prototype.setRole = function (role) {
        this.role = role;
    };
    
    User.prototype.getStatus = function () {
        return this.status;
    };
    
    User.prototype.setStatus = function (status) {
        this.status = status;
    };
    
    User.prototype.getStatusMessage = function () {
        return this.statusMessage;
    };
    
    User.prototype.setStatusMessage = function (statusMessage) {
        this.statusMessage = statusMessage;
    };
    User.prototype.setBlockedByMe = function (blockedByMe) {
        this.blockedByMe = blockedByMe;
    };
    
    User.prototype.getBlockedByMe = function () {
        return this.blockedByMe;
    };
    User.prototype.setHasBlockedMe = function (hasBlockedMe) {
        this.hasBlockedMe = hasBlockedMe;
    };
    
    User.prototype.getHasBlockedMe = function () {
        return this.hasBlockedMe;
    };
    
    User.prototype.setTags = function (tags) {
        this.tags = tags;
    };
    
    User.prototype.getTags = function () {
        return this.tags;
    };
    
    User.prototype.setDeactivatedAt = function (deactivatedAt) {
        this.deactivatedAt = deactivatedAt;
    };
    
    User.prototype.getDeactivatedAt = function () {
        return this.deactivatedAt;
    };
    return User;
}());
exports.User = User;

var Me =  (function (_super) {
    __extends(Me, _super);
    function Me(userObj) {
        var _this = _super.call(this, userObj) || this;
        _this.wsChannel = userObj.wsChannel;
        if (userObj.jwt) {
            _this.jwt = userObj.jwt;
        }
        return _this;
    }
    Me.prototype.getWsChannel = function () {
        return this.wsChannel;
    };
    Me.prototype.getJWT = function () {
        return this.jwt;
    };
    return Me;
}(User));
exports.Me = Me;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.KEYS = exports.AUTH = exports.MESSAGE = exports.PRESENCE = exports.RECEIPTS = exports.TRANSIENT_MESSAGE = exports.TYPING_INDICATOR = exports.LOGOUT_REASON = exports.LOGOUT_CODE = exports.READY_STATE = exports.WS = void 0;
exports.WS = {
    protocol: "wss://"
};
exports.READY_STATE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
    INVALID_JWT: 4
};
exports.LOGOUT_CODE = 1000;
exports.LOGOUT_REASON = "User logged out";
exports.TYPING_INDICATOR = {
    TYPE: "typing_indicator",
    ACTION: {
        STARTED: "started",
        ENDED: "ended"
    }
};
exports.TRANSIENT_MESSAGE = {
    TYPE: "transient_message",
};
exports.RECEIPTS = {
    TYPE: "receipts",
    ACTION: {
        READ: "read",
        DELIVERED: "delivered"
    },
    RECEIPT_TYPE: {
        READ_RECEIPT: "read",
        DELIVERY_RECEIPT: "delivery"
    }
};
exports.PRESENCE = {
    TYPE: "presence",
    ACTION: {
        ONLINE: "online",
        AVAILABLE: "available",
        OFFLINE: "offline"
    }
};
exports.MESSAGE = {
    TYPE: "message"
};
exports.AUTH = {
    TYPE: "auth"
};
exports.KEYS = {
    TYPE: "type",
    ACTION: "action",
    APP_ID: "appId",
    RECEIVER: "receiver",
    RECEIVER_TYPE: "receiverType",
    DEVICE_ID: "deviceId",
    BODY: "body",
    USER: "user",
    METADATA: "metadata",
    MESSAGE_ID: "messageId",
    TIMESTAMP: "timestamp",
    STATUS: "status",
    CODE: "code",
    SENDER: "sender",
    MESSAGE_SENDER: "messageSender",
    PRESENCE_SUBSCRIPTION: "presenceSubscription",
    AUTH: "auth",
    PING: "ping",
    DATA: "data",
    PARAMS: "params",
    ACK: "ack",
    PONG: "pong"
};


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.postData = exports.makeAdminApiCall = exports.makeApiCall = void 0;
var EndPointUtils_1 = __webpack_require__(29);
var CometChat_1 = __webpack_require__(3);
var Helper_1 = __webpack_require__(0);
var CustomError_1 = __webpack_require__(2);
var CometChatErrorConstants_1 = __webpack_require__(13);
var Constants_1 = __webpack_require__(1);

function makeApiCall(endPointName, params, data, isFile) {
    if (endPointName === void 0) { endPointName = ""; }
    if (params === void 0) { params = {}; }
    if (data === void 0) { data = {}; }
    var cometChat = CometChat_1.CometChat.getInstance(CometChat_1.CometChat.getAppId());
    return new Promise(function (resolve, reject) {
        try {
            
            EndPointUtils_1.getEndPoint(endPointName, params)
                .then(function (endPointData) {
                var headers = {
                    resource: CometChat_1.CometChat.getSessionId(),
                    appId: CometChat_1.CometChat.getAppId(),
                    Accept: "application/json",
                    sdk: Helper_1.format(Constants_1.SDKHeader.sdk, Constants_1.SDKHeader.platform, Constants_1.SDKHeader.sdkVersion)
                };
                if (!isFile)
                    headers["Content-Type"] = "application/json";
                if (endPointData.hasOwnProperty("isAdminApi") && endPointData["isAdminApi"]) {
                    if (!cometChat.getApiKey()) {
                        reject({
                            error: {
                                code: "API_KEY_NOT_SET",
                                message: "An apiKey is needed to use the " + endPointName + " api.",
                                name: "API_KEY_NOT_SET"
                            }
                        });
                    }
                    else {
                        headers["apiKey"] = cometChat.getApiKey();
                    }
                }
                else {
                    if (!cometChat.getAuthToken()) {
                        reject({
                            error: {
                                code: "USER_NOT_LOGED_IN",
                                message: "An authToken is need to use the " + endPointName + " end-point. PS- We are aware of the spelling mistake, but in order to maintain backward compatibility we cannot change it :(",
                                name: "User not logged-in"
                            }
                        });
                    }
                    else {
                        headers["authToken"] = cometChat.getAuthToken();
                    }
                }
                postData(endPointData["endpoint"], endPointData["method"], data, headers, isFile)
                    .then(function (response) {
                    return response.json();
                })
                    .then(function (response) {
                    if (response.hasOwnProperty("data")) {
                        if (response["data"].hasOwnProperty("authToken")) {
                            CometChat_1.CometChat.setAuthToken(response["data"]["authToken"]);
                        }
                        resolve(response);
                    }
                    else {
                        if (response.hasOwnProperty("error")) {
                            var error = response.error;
                            if (error.hasOwnProperty("code")) {
                                var errorCode = error.code;
                                if (errorCode === Constants_1.API_ERROR_CODES.AUTH_ERR_AUTH_TOKEN_NOT_FOUND) {
                                    CometChat_1.CometChat.getInstance().internalLogout().then(function () {
                                        Helper_1.Logger.log('CometChat: makeApiCall', 'User logged out');
                                    });
                                }
                            }
                        }
                        reject(response);
                    }
                })["catch"](function (response) {
                    var error = {
                        error: CometChatErrorConstants_1.FETCH_ERROR.ERROR_IN_API_CALL
                    };
                    reject(error);
                });
            })["catch"](function (error) { return reject; });
        }
        catch (err) {
            reject(new CustomError_1.CometChatException(err));
        }
    });
}
exports.makeApiCall = makeApiCall;
function makeAdminApiCall(endPointName, params, data, isFile) {
    if (endPointName === void 0) { endPointName = ""; }
    if (params === void 0) { params = {}; }
    if (data === void 0) { data = {}; }
    var cometChat = CometChat_1.CometChat.getInstance(CometChat_1.CometChat.getAppId());
    return new Promise(function (resolve, reject) {
        
        EndPointUtils_1.getEndPoint(endPointName, params)
            .then(function (endPointData) {
            var headers = {
                appId: CometChat_1.CometChat.getAppId(),
                Accept: "application/json",
                sdk: Helper_1.format(Constants_1.SDKHeader.sdk, Constants_1.SDKHeader.platform, Constants_1.SDKHeader.sdkVersion)
            };
            if (!isFile)
                headers["Content-Type"] = "application/json";
            if (endPointData.hasOwnProperty("isAdminApi") && endPointData["isAdminApi"]) {
                if (!cometChat.getApiKey()) {
                    reject({
                        error: "An apiKey is need to use the " + endPointName + " api."
                    });
                }
                else {
                    headers["apiKey"] = cometChat.getApiKey();
                }
            }
            else {
                if (!cometChat.getAuthToken()) {
                    reject({
                        error: "An authToken is need to use the " + endPointName + " api."
                    });
                }
                else {
                    headers["authToken"] = cometChat.getAuthToken();
                }
            }
            postData(endPointData["endpoint"], endPointData["method"], data, headers, isFile)
                .then(function (response) {
                return response.json();
            })
                .then(function (response) {
                if (response.hasOwnProperty("data")) {
                    if (response["data"].hasOwnProperty("authToken")) {
                        CometChat_1.CometChat.setAuthToken(response["data"]["authToken"]);
                    }
                    resolve(response);
                }
                else {
                    reject(response);
                }
            })["catch"](function (response) {
                var error = {
                    error: CometChatErrorConstants_1.FETCH_ERROR.ERROR_IN_API_CALL
                };
                reject(error);
            });
        })["catch"](function (error) { return reject; });
    });
}
exports.makeAdminApiCall = makeAdminApiCall;
function postData(url, method, data, headers, isFile) {
    if (url === void 0) { url = ""; }
    if (method === void 0) { method = "GET"; }
    if (data === void 0) { data = {}; }
    if (headers === void 0) { headers = {}; }
    var formData;
    if (Helper_1.isFalsy(data)) {
        data = undefined;
    }
    else {
        if (method == "GET") {
            url = url + "?";
            Object.keys(data).map(function (key, index) {
                if (index === Object.keys(data).length - 1) {
                    url = url + key + "=" + data[key];
                }
                else {
                    url = url + key + "=" + data[key] + "&";
                }
            });
            data = undefined;
        }
        if (isFile) {
            formData = new FormData();
            Object.keys(data).map(function (key) {
                if (key != "data") {
                    if (key == "tags") {
                        formData.append(key + "[]", data[key]);
                    }
                    else {
                        if (key != "metadata") {
                            if (key === "files") {
                                for (var i = 0; i < data[key]["length"]; i++) {
                                    formData.append(key + "[]", data[key][i]);
                                }
                            }
                            else {
                                formData.append(key, data[key]);
                            }
                        }
                    }
                }
                else {
                    formData.append(key, JSON.stringify(data[key]));
                }
            });
        }
        data = JSON.stringify(data);
    }
    return fetch(url, {
        method: method,
        mode: "cors",
        cache: "no-cache",
        headers: headers,
        redirect: "follow",
        referrer: "no-referrer",
        body: isFile ? formData : data 
    });
}
exports.postData = postData;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.BaseMessage = void 0;

var BaseMessage =  (function () {
    function BaseMessage(receiverId, messageType, receiverType, category) {
        this.receiverId = receiverId;
        this.type = messageType;
        this.receiverType = receiverType;
        this.category = category;
    }
    
    BaseMessage.prototype.getId = function () {
        return this.id;
    };
    
    BaseMessage.prototype.setId = function (value) {
        this.id = value;
    };
    
    BaseMessage.prototype.getConversationId = function () {
        return this.conversationId;
    };
    
    BaseMessage.prototype.setConversationId = function (value) {
        this.conversationId = value;
    };
    
    BaseMessage.prototype.getParentMessageId = function () {
        return this.parentMessageId;
    };
    
    BaseMessage.prototype.setParentMessageId = function (value) {
        this.parentMessageId = value;
    };
    
    BaseMessage.prototype.getMuid = function () {
        return this.muid;
    };
    
    BaseMessage.prototype.setMuid = function (value) {
        this.muid = value;
    };
    
    BaseMessage.prototype.getSender = function () {
        return this.sender;
    };
    
    BaseMessage.prototype.setSender = function (value) {
        this.sender = value;
    };
    
    BaseMessage.prototype.getReceiver = function () {
        return this.receiver;
    };
    
    BaseMessage.prototype.setReceiver = function (value) {
        this.receiver = value;
    };
    
    BaseMessage.prototype.getReceiverId = function () {
        return this.receiverId;
    };
    
    BaseMessage.prototype.setReceiverId = function (value) {
        this.receiverId = value;
    };
    
    BaseMessage.prototype.getType = function () {
        return this.type;
    };
    
    BaseMessage.prototype.setType = function (value) {
        this.type = value;
    };
    
    BaseMessage.prototype.getReceiverType = function () {
        return this.receiverType;
    };
    
    BaseMessage.prototype.setReceiverType = function (value) {
        this.receiverType = value;
    };
    
    BaseMessage.prototype.getSentAt = function () {
        return this.sentAt;
    };
    
    BaseMessage.prototype.setSentAt = function (value) {
        this.sentAt = value;
    };
    
    BaseMessage.prototype.getStatus = function () {
        return this.status;
    };
    
    BaseMessage.prototype.setStatus = function (value) {
        this.status = value;
    };
    
    BaseMessage.prototype.getDeliveredAt = function () {
        return this.deliveredAt;
    };
    
    BaseMessage.prototype.setDeliveredAt = function (deliveredAt) {
        this.deliveredAt = deliveredAt;
    };
    
    BaseMessage.prototype.getDeliveredToMeAt = function () {
        return this.deliveredToMeAt;
    };
    
    BaseMessage.prototype.setDeliveredToMeAt = function (deliveredToMeAt) {
        this.deliveredToMeAt = deliveredToMeAt;
    };
    
    BaseMessage.prototype.getReadAt = function () {
        return this.readAt;
    };
    
    BaseMessage.prototype.setReadAt = function (readAt) {
        this.readAt = readAt;
    };
    
    BaseMessage.prototype.getReadByMeAt = function () {
        return this.readByMeAt;
    };
    
    BaseMessage.prototype.setReadByMeAt = function (readByMeAt) {
        this.readByMeAt = readByMeAt;
    };
    
    BaseMessage.prototype.getCategory = function () {
        return this.category;
    };
    
    BaseMessage.prototype.setCategory = function (category) {
        this.category = category;
    };
    
    BaseMessage.prototype.getEditedAt = function () {
        return this.editedAt;
    };
    
    BaseMessage.prototype.setEditedAt = function (editedAt) {
        this.editedAt = editedAt;
    };
    
    BaseMessage.prototype.getEditedBy = function () {
        return this.editedBy;
    };
    
    BaseMessage.prototype.setEditedBy = function (editedBy) {
        this.editedBy = editedBy;
    };
    
    BaseMessage.prototype.getDeletedAt = function () {
        return this.deletedAt;
    };
    
    BaseMessage.prototype.setDeletedAt = function (deletedAt) {
        this.deletedAt = deletedAt;
    };
    
    BaseMessage.prototype.getDeletedBy = function () {
        return this.deletedBy;
    };
    
    BaseMessage.prototype.setDeletedBy = function (deletedBy) {
        this.deletedBy = deletedBy;
    };
    
    BaseMessage.prototype.getReplyCount = function () {
        return this.replyCount;
    };
    
    BaseMessage.prototype.setReplyCount = function (value) {
        this.replyCount = value;
    };
    
    BaseMessage.prototype.getRawMessage = function () {
        return this.rawMessage;
    };
    
    BaseMessage.prototype.setRawMessage = function (rawMessage) {
        this.rawMessage = rawMessage;
    };
    return BaseMessage;
}());
exports.BaseMessage = BaseMessage;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.Group = void 0;

var Constants_1 = __webpack_require__(1);
var Group =  (function () {
    
    function Group(guid, name, type, passsword, icon, description, hasJoined) {
        this.hasJoined = false;
        this.membersCount = 0;
        this.guid = guid;
        if (name)
            this.name = name;
        if (type)
            this.type = type;
        if ((passsword || passsword === '') && type == "password")
            this.password = passsword;
        if (icon || icon === '')
            this.icon = icon;
        if (description || description === '')
            this.description = description;
        if (hasJoined)
            this.hasJoined = hasJoined;
    }
    
    Group.prototype.getGuid = function () {
        return this.guid;
    };
    
    Group.prototype.setGuid = function (guid) {
        this.guid = guid;
    };
    
    Group.prototype.getName = function () {
        return this.name;
    };
    
    Group.prototype.setName = function (name) {
        if (name)
            this.name = name;
    };
    
    Group.prototype.getType = function () {
        return this.type;
    };
    
    Group.prototype.setType = function (type) {
        this.type = type;
    };
    
    Group.prototype.getPassword = function () {
        return this.password;
    };
    
    Group.prototype.setPassword = function (password) {
        this.password = password;
    };
    
    Group.prototype.getIcon = function () {
        return this.icon;
    };
    
    Group.prototype.setIcon = function (icon) {
        this.icon = icon;
    };
    
    Group.prototype.getDescription = function () {
        return this.description;
    };
    
    Group.prototype.setDescription = function (description) {
        this.description = description;
    };
    
    Group.prototype.getOwner = function () {
        return this.owner;
    };
    
    Group.prototype.setOwner = function (owner) {
        this.owner = owner;
    };
    
    Group.prototype.getMetadata = function () {
        return this.metadata;
    };
    
    Group.prototype.setMetadata = function (metadata) {
        this.metadata = metadata;
    };
    
    Group.prototype.getCreatedAt = function () {
        return this.createdAt;
    };
    
    Group.prototype.setCreatedAt = function (createdAt) {
        this.createdAt = createdAt;
    };
    
    Group.prototype.getUpdatedAt = function () {
        return this.updatedAt;
    };
    
    Group.prototype.setUpdatedAt = function (updatedAt) {
        this.updatedAt = updatedAt;
    };
    
    Group.prototype.getHasJoined = function () {
        return this.hasJoined;
    };
    
    Group.prototype.setHasJoined = function (hasJoined) {
        this.hasJoined = hasJoined;
    };
    
    Group.prototype.getWsChannel = function () {
        return this.wsChannel;
    };
    
    Group.prototype.setWsChannel = function (wsChannel) {
        this.wsChannel = wsChannel;
    };
    
    Group.prototype.setScope = function (scope) {
        this.scope = scope;
    };
    
    Group.prototype.getScope = function () {
        return this.scope;
    };
    
    Group.prototype.getJoinedAt = function () {
        return this.joinedAt;
    };
    
    Group.prototype.setJoinedAt = function (joinedAt) {
        this.joinedAt = joinedAt;
    };
    
    Group.prototype.getMembersCount = function () {
        return this.membersCount;
    };
    
    Group.prototype.setMembersCount = function (membersCount) {
        this.membersCount = membersCount;
    };
    
    Group.prototype.setTags = function (tags) {
        this.tags = tags;
    };
    
    Group.prototype.getTags = function () {
        return this.tags;
    };
     Group.TYPE = Constants_1.GroupType;
     Group.Type = Group.TYPE;
    return Group;
}());
exports.Group = Group;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.CometChatEvent = void 0;
var Helper_1 = __webpack_require__(0);
var WSConstants_1 = __webpack_require__(5);
var CometChatEvent =  (function () {
    function CometChatEvent(appId, receiver, receiverType, sender, deviceId, messageSender) {
        if (!Helper_1.isFalsy(appId)) {
            this.appId = appId;
        }
        if (!Helper_1.isFalsy(receiver)) {
            this.receiver = receiver;
        }
        if (!Helper_1.isFalsy(receiverType)) {
            this.receiverType = receiverType;
        }
        if (!Helper_1.isFalsy(deviceId)) {
            this.deviceId = deviceId;
        }
        if (!Helper_1.isFalsy(sender)) {
            this.sender = sender;
        }
        if (!Helper_1.isFalsy(messageSender)) {
            this.messageSender = messageSender;
        }
    }
    CometChatEvent.prototype.getAppId = function () {
        return this.appId;
    };
    CometChatEvent.prototype.setAppId = function (appId) {
        this.appId = appId;
    };
    CometChatEvent.prototype.getReceiver = function () {
        return this.receiver;
    };
    CometChatEvent.prototype.setReceiver = function (receiver) {
        this.receiver = receiver;
    };
    CometChatEvent.prototype.getSender = function () {
        return this.sender;
    };
    CometChatEvent.prototype.setSender = function (sender) {
        this.sender = sender;
    };
    CometChatEvent.prototype.getReceiverType = function () {
        return this.receiverType;
    };
    CometChatEvent.prototype.setReceiverType = function (receiverType) {
        this.receiverType = receiverType;
    };
    CometChatEvent.prototype.getType = function () {
        return this.type;
    };
    CometChatEvent.prototype.setType = function (type) {
        this.type = type;
    };
    CometChatEvent.prototype.getDeviceId = function () {
        return this.deviceId;
    };
    CometChatEvent.prototype.setDeviceId = function (deviceId) {
        this.deviceId = deviceId;
    };
    CometChatEvent.prototype.getMessageSender = function () {
        return this.messageSender;
    };
    CometChatEvent.prototype.setMessageSender = function (messageSender) {
        this.messageSender = messageSender;
    };
    CometChatEvent.prototype.getCometChatEventJSON = function () {
        var mainObject = {};
        mainObject[WSConstants_1.KEYS.APP_ID] = this.getAppId();
        mainObject[WSConstants_1.KEYS.RECEIVER] = this.getReceiver();
        mainObject[WSConstants_1.KEYS.RECEIVER_TYPE] = this.getReceiverType();
        mainObject[WSConstants_1.KEYS.DEVICE_ID] = this.getDeviceId();
        mainObject[WSConstants_1.KEYS.TYPE] = this.getType();
        mainObject[WSConstants_1.KEYS.SENDER] = this.getSender();
        if (!Helper_1.isFalsy(this.getMessageSender())) {
            mainObject[WSConstants_1.KEYS.MESSAGE_SENDER] = this.getMessageSender();
        }
        return mainObject;
    };
    return CometChatEvent;
}());
exports.CometChatEvent = CometChatEvent;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.MessageController = void 0;
var BaseMessage_1 = __webpack_require__(7);
var TextMessage_1 = __webpack_require__(16);
var MediaMessage_1 = __webpack_require__(17);
var Helper_1 = __webpack_require__(0);
var Constants_1 = __webpack_require__(1);
var Action_1 = __webpack_require__(20);
var Call_1 = __webpack_require__(21);
var MessageReceipt_1 = __webpack_require__(22);
var CustomError_1 = __webpack_require__(2);
var attachment_1 = __webpack_require__(18);
var CustomMessage_1 = __webpack_require__(19);
var CometChat_1 = __webpack_require__(3);
var UsersController_1 = __webpack_require__(11);
var MessageController =  (function () {
    function MessageController() {
    }
    
    MessageController.trasformJSONMessge = function (message) {
        try {
            var rawMessage = null;
            if (!message.hasOwnProperty("rawMessage")) {
                rawMessage = JSON.parse(JSON.stringify(message));
            }
            var base = void 0;
            switch (message[Constants_1.MessageConstatnts.KEYS.CATEGORY]) {
                case Constants_1.MessageConstatnts.CATEGORY.ACTION:
                    base = Action_1.Action.actionFromJSON(message);
                    break;
                case Constants_1.MessageConstatnts.CATEGORY.CALL:
                    base = Call_1.Call.callFromJSON(message);
                    break;
                case Constants_1.MessageConstatnts.CATEGORY.MESSAGE:
                    switch (message[Constants_1.MessageConstatnts.KEYS.TYPE]) {
                        case Constants_1.MessageConstatnts.TYPE.TEXT:
                            base = new TextMessage_1.TextMessage(message[Constants_1.MessageConstatnts.KEYS.RECEIVER], message[Constants_1.MessageConstatnts.KEYS.DATA][Constants_1.MessageConstatnts.KEYS.TEXT], message[Constants_1.MessageConstatnts.KEYS.RECEIVER_TYPE]);
                            break;
                        case Constants_1.MessageConstatnts.TYPE.CUSTOM:
                            base = new CustomMessage_1.CustomMessage(message[Constants_1.MessageConstatnts.KEYS.RECEIVER], message[Constants_1.MessageConstatnts.KEYS.DATA][Constants_1.MessageConstatnts.KEYS.CUSTOM_DATA], message[Constants_1.MessageConstatnts.KEYS.RECEIVER_TYPE]);
                            break;
                        default:
                            base = new MediaMessage_1.MediaMessage(message[Constants_1.MessageConstatnts.KEYS.RECEIVER], message[Constants_1.MessageConstatnts.KEYS.DATA][Constants_1.MessageConstatnts.KEYS.URL], message[Constants_1.MessageConstatnts.KEYS.TYPE], message[Constants_1.MessageConstatnts.KEYS.RECEIVER_TYPE]);
                            if (message.hasOwnProperty(Constants_1.MessageConstatnts.KEYS.DATA)) {
                                var data = message[Constants_1.MessageConstatnts.KEYS.DATA];
                                if (data.hasOwnProperty(Constants_1.MessageConstatnts.KEYS.ATTATCHMENTS)) {
                                    var attachments = data[Constants_1.MessageConstatnts.KEYS.ATTATCHMENTS];
                                    var attachmentObjects = new Array();
                                    var attachment_2;
                                    attachments.map(function (file) {
                                        attachment_2 = new attachment_1.Attachment(file);
                                    });
                                    base.setAttachment(attachment_2);
                                }
                                if (data.hasOwnProperty(Constants_1.MessageConstatnts.KEYS.TEXT)) {
                                    base.setCaption(data[Constants_1.MessageConstatnts.KEYS.TEXT]);
                                }
                            }
                            if (base.hasOwnProperty('file')) {
                                delete base["file"];
                            }
                            break;
                    }
                    break;
                case Constants_1.MessageConstatnts.CATEGORY.CUSTOM: {
                    base = new CustomMessage_1.CustomMessage(message[Constants_1.MessageConstatnts.KEYS.RECEIVER], message[Constants_1.MessageConstatnts.KEYS.DATA][Constants_1.MessageConstatnts.KEYS.CUSTOM_DATA], message[Constants_1.MessageConstatnts.KEYS.RECEIVER_TYPE], message["type"]);
                }
                default:
                    break;
            }
            if (message[Constants_1.MessageConstatnts.KEYS.MY_RECEIPTS]) {
                message[Constants_1.MessageConstatnts.KEYS.MY_RECEIPTS] = message[Constants_1.MessageConstatnts.KEYS.MY_RECEIPTS];
                Object.keys(message[Constants_1.MessageConstatnts.KEYS.MY_RECEIPTS]).map(function (receiptInfo) {
                    var messageReceipt = new MessageReceipt_1.MessageReceipt();
                    if (receiptInfo == Constants_1.DELIVERY_RECEIPTS.DELIVERED_AT) {
                        messageReceipt.setReceiptType(messageReceipt.RECEIPT_TYPE.DELIVERY_RECEIPT);
                        messageReceipt.setDeliveredAt(message[Constants_1.MessageConstatnts.KEYS.MY_RECEIPTS][Constants_1.DELIVERY_RECEIPTS.DELIVERED_AT]);
                        if (!Helper_1.isFalsy(message[Constants_1.MessageConstatnts.KEYS.MY_RECEIPTS][Constants_1.DELIVERY_RECEIPTS.RECIPIENT])) {
                            messageReceipt.setSender(message[Constants_1.MessageConstatnts.KEYS.MY_RECEIPTS][Constants_1.DELIVERY_RECEIPTS.RECIPIENT]);
                        }
                        else {
                            message[Constants_1.DELIVERY_RECEIPTS.DELIVERED_TO_ME_AT] = message[Constants_1.MessageConstatnts.KEYS.MY_RECEIPTS][Constants_1.DELIVERY_RECEIPTS.DELIVERED_AT];
                        }
                        messageReceipt.setReceiverType(message[Constants_1.MessageConstatnts.KEYS.RECEIVER_TYPE]);
                        messageReceipt.setReceiver(message[Constants_1.MessageConstatnts.KEYS.RECEIVER]);
                    }
                    if (message[Constants_1.MessageConstatnts.KEYS.MY_RECEIPTS][Constants_1.READ_RECEIPTS.READ_AT]) {
                        messageReceipt.setReceiptType(messageReceipt.RECEIPT_TYPE.READ_RECEIPT);
                        messageReceipt.setReadAt(message[Constants_1.MessageConstatnts.KEYS.MY_RECEIPTS][Constants_1.READ_RECEIPTS.READ_AT]);
                        if (!Helper_1.isFalsy(message[Constants_1.MessageConstatnts.KEYS.MY_RECEIPTS][Constants_1.READ_RECEIPTS.RECIPIENT])) {
                            messageReceipt.setSender(message[Constants_1.MessageConstatnts.KEYS.MY_RECEIPTS][Constants_1.READ_RECEIPTS.RECIPIENT]);
                        }
                        else {
                            message[Constants_1.READ_RECEIPTS.READ_BY_ME_AT] = message[Constants_1.MessageConstatnts.KEYS.MY_RECEIPTS][Constants_1.READ_RECEIPTS.READ_AT];
                        }
                        messageReceipt.setReceiverType(message[Constants_1.MessageConstatnts.KEYS.RECEIVER_TYPE]);
                        messageReceipt.setReceiver(message[Constants_1.MessageConstatnts.KEYS.RECEIVER]);
                    }
                });
            }
            try {
                Object.assign(base, message);
                message = base;
                if (message["parentId"]) {
                    message["parentMessageId"] = message["parentId"];
                    delete message["parentId"];
                }
                if (message instanceof BaseMessage_1.BaseMessage) {
                    if (!Helper_1.isFalsy(rawMessage)) {
                        message.setRawMessage(rawMessage);
                    }
                }
                if (message instanceof TextMessage_1.TextMessage) {
                    message.setSender(message.getSender());
                    message.setReceiver(message.getReceiver());
                    if (message.getData()[Constants_1.MessageConstatnts.KEYS.METADATA])
                        message.setMetadata(message.getData()[Constants_1.MessageConstatnts.KEYS.METADATA]);
                }
                else if (message instanceof MediaMessage_1.MediaMessage) {
                    if (message.getData()[Constants_1.MessageConstatnts.KEYS.METADATA])
                        message.setMetadata(message.getData()[Constants_1.MessageConstatnts.KEYS.METADATA]);
                    message.setSender(message.getSender());
                    message.setReceiver(message.getReceiver());
                }
                else if (message instanceof Action_1.Action) {
                    message.setSender(message.getSender());
                    message.setReceiver(message.getActionFor());
                    message.setActionBy(message.getActionBy());
                    message.setActionOn(message.getActionOn());
                    message.setActionFor(message.getActionFor());
                    message.setMessage(message.getMessage());
                }
                else if (message instanceof Call_1.Call) {
                    try {
                        message.setSender(message.getSender());
                    }
                    catch (e) {
                        Helper_1.Logger.error("MessageController: trasformJSONMessge: setSender", e);
                    }
                    try {
                        message.setCallInitiator(message.getCallInitiator());
                    }
                    catch (e) {
                        Helper_1.Logger.error("MessageController: trasformJSONMessge: setCallInitiator", e);
                    }
                    try {
                        message.setReceiver(message.getCallReceiver());
                        message.setCallReceiver(message.getCallReceiver());
                    }
                    catch (e) {
                        Helper_1.Logger.error("MessageController: trasformJSONMessge: setCallreceiver", e);
                    }
                }
                else if (message instanceof CustomMessage_1.CustomMessage) {
                    if (message.getData()[Constants_1.MessageConstatnts.KEYS.METADATA])
                        message.setMetadata(message.getData()[Constants_1.MessageConstatnts.KEYS.METADATA]);
                    message.setCustomData(message.getData()[Constants_1.MessageConstatnts.KEYS.CUSTOM_DATA]);
                    message.setSubType(message.getData()[Constants_1.MessageConstatnts.KEYS.CUSTOM_SUB_TYPE]);
                    message.setSender(message.getSender());
                    message.setReceiver(message.getReceiver());
                }
            }
            catch (e) {
                Helper_1.Logger.error("MessageController: trasformJSONMessge: Main", e);
                message = null;
            }
            return message;
        }
        catch (err) {
            Helper_1.Logger.error("MessageController: trasformJSONMessge", err);
        }
    };
    
    MessageController.getReceiptsFromJSON = function (message) {
        return new Promise(function (resolve, reject) {
            try {
                var receiptsArray_1 = [];
                CometChat_1.CometChat.getLoggedInUser().then(function (user) {
                    if (Helper_1.isFalsy(message["receipts"])) {
                        resolve([]);
                    }
                    else {
                        message["receipts"].data.map(function (receiptInfo) {
                            var messageReceipt = new MessageReceipt_1.MessageReceipt();
                            if (receiptInfo[Constants_1.DELIVERY_RECEIPTS.DELIVERED_AT]) {
                                messageReceipt.setReceiptType(messageReceipt.RECEIPT_TYPE.DELIVERY_RECEIPT);
                                messageReceipt.setDeliveredAt(receiptInfo[Constants_1.DELIVERY_RECEIPTS.DELIVERED_AT]);
                                messageReceipt.setTimestamp(receiptInfo[Constants_1.DELIVERY_RECEIPTS.DELIVERED_AT]);
                                if (!Helper_1.isFalsy(receiptInfo[Constants_1.DELIVERY_RECEIPTS.RECIPIENT])) {
                                    messageReceipt.setSender(UsersController_1.UsersController.trasformJSONUser(receiptInfo[Constants_1.DELIVERY_RECEIPTS.RECIPIENT]));
                                }
                                else {
                                    messageReceipt.setSender(user);
                                }
                                messageReceipt.setReceiverType(message[Constants_1.MessageConstatnts.KEYS.RECEIVER_TYPE]);
                                messageReceipt.setReceiver(message[Constants_1.MessageConstatnts.KEYS.RECEIVER]);
                            }
                            if (receiptInfo[Constants_1.READ_RECEIPTS.READ_AT]) {
                                messageReceipt.setReceiptType(messageReceipt.RECEIPT_TYPE.READ_RECEIPT);
                                messageReceipt.setReadAt(receiptInfo[Constants_1.READ_RECEIPTS.READ_AT]);
                                messageReceipt.setTimestamp(receiptInfo[receiptInfo[Constants_1.READ_RECEIPTS.READ_AT]]);
                                if (!Helper_1.isFalsy(receiptInfo[Constants_1.READ_RECEIPTS.RECIPIENT])) {
                                    messageReceipt.setSender(UsersController_1.UsersController.trasformJSONUser(receiptInfo[Constants_1.READ_RECEIPTS.RECIPIENT]));
                                }
                                else {
                                    messageReceipt.setSender(user);
                                }
                                messageReceipt.setReceiverType(message[Constants_1.MessageConstatnts.KEYS.RECEIVER_TYPE]);
                                messageReceipt.setReceiver(message[Constants_1.MessageConstatnts.KEYS.RECEIVER]);
                            }
                            receiptsArray_1.push(messageReceipt);
                        });
                        resolve(receiptsArray_1);
                    }
                });
            }
            catch (e) {
                reject(new CustomError_1.CometChatException(e));
            }
        });
    };
    return MessageController;
}());
exports.MessageController = MessageController;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.UsersController = void 0;
var UserModel_1 = __webpack_require__(4);
var Helper_1 = __webpack_require__(0);
var UsersController =  (function () {
    function UsersController() {
    }
    
    UsersController.trasformJSONUser = function (user) {
        var cometChatUser;
        try {
            user.uid = user.uid.toString();
            user.name = user.name.toString();
            if (user.status && user.status !== "offline") {
                user.status = "online";
            }
            else {
                user.status = "offline";
            }
            cometChatUser = new UserModel_1.User(user);
            Object.assign(cometChatUser, user);
            user = cometChatUser;
        }
        catch (e) {
            Helper_1.Logger.error("UsersController:transformJSONUser", e);
        }
        return user;
    };
    return UsersController;
}());
exports.UsersController = UsersController;


 }),

 (function(module, exports, __webpack_require__) {

(function(global) {var require;var require;
(function(f){if(true){module.exports=f()}else { var g; }})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
'use strict';
var Mutation = global.MutationObserver || global.WebKitMutationObserver;

var scheduleDrain;

{
  if (Mutation) {
    var called = 0;
    var observer = new Mutation(nextTick);
    var element = global.document.createTextNode('');
    observer.observe(element, {
      characterData: true
    });
    scheduleDrain = function () {
      element.data = (called = ++called % 2);
    };
  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = nextTick;
    scheduleDrain = function () {
      channel.port2.postMessage(0);
    };
  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
    scheduleDrain = function () {

      
      
      var scriptEl = global.document.createElement('script');
      scriptEl.onreadystatechange = function () {
        nextTick();

        scriptEl.onreadystatechange = null;
        scriptEl.parentNode.removeChild(scriptEl);
        scriptEl = null;
      };
      global.document.documentElement.appendChild(scriptEl);
    };
  } else {
    scheduleDrain = function () {
      setTimeout(nextTick, 0);
    };
  }
}

var draining;
var queue = [];

function nextTick() {
  draining = true;
  var i, oldQueue;
  var len = queue.length;
  while (len) {
    oldQueue = queue;
    queue = [];
    i = -1;
    while (++i < len) {
      oldQueue[i]();
    }
    len = queue.length;
  }
  draining = false;
}

module.exports = immediate;
function immediate(task) {
  if (queue.push(task) === 1 && !draining) {
    scheduleDrain();
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(_dereq_,module,exports){
'use strict';
var immediate = _dereq_(1);


function INTERNAL() {}

var handlers = {};

var REJECTED = ['REJECTED'];
var FULFILLED = ['FULFILLED'];
var PENDING = ['PENDING'];

module.exports = Promise;

function Promise(resolver) {
  if (typeof resolver !== 'function') {
    throw new TypeError('resolver must be a function');
  }
  this.state = PENDING;
  this.queue = [];
  this.outcome = void 0;
  if (resolver !== INTERNAL) {
    safelyResolveThenable(this, resolver);
  }
}

Promise.prototype["catch"] = function (onRejected) {
  return this.then(null, onRejected);
};
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
    typeof onRejected !== 'function' && this.state === REJECTED) {
    return this;
  }
  var promise = new this.constructor(INTERNAL);
  if (this.state !== PENDING) {
    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.outcome);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }

  return promise;
};
function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  if (typeof onFulfilled === 'function') {
    this.onFulfilled = onFulfilled;
    this.callFulfilled = this.otherCallFulfilled;
  }
  if (typeof onRejected === 'function') {
    this.onRejected = onRejected;
    this.callRejected = this.otherCallRejected;
  }
}
QueueItem.prototype.callFulfilled = function (value) {
  handlers.resolve(this.promise, value);
};
QueueItem.prototype.otherCallFulfilled = function (value) {
  unwrap(this.promise, this.onFulfilled, value);
};
QueueItem.prototype.callRejected = function (value) {
  handlers.reject(this.promise, value);
};
QueueItem.prototype.otherCallRejected = function (value) {
  unwrap(this.promise, this.onRejected, value);
};

function unwrap(promise, func, value) {
  immediate(function () {
    var returnValue;
    try {
      returnValue = func(value);
    } catch (e) {
      return handlers.reject(promise, e);
    }
    if (returnValue === promise) {
      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      handlers.resolve(promise, returnValue);
    }
  });
}

handlers.resolve = function (self, value) {
  var result = tryCatch(getThen, value);
  if (result.status === 'error') {
    return handlers.reject(self, result.value);
  }
  var thenable = result.value;

  if (thenable) {
    safelyResolveThenable(self, thenable);
  } else {
    self.state = FULFILLED;
    self.outcome = value;
    var i = -1;
    var len = self.queue.length;
    while (++i < len) {
      self.queue[i].callFulfilled(value);
    }
  }
  return self;
};
handlers.reject = function (self, error) {
  self.state = REJECTED;
  self.outcome = error;
  var i = -1;
  var len = self.queue.length;
  while (++i < len) {
    self.queue[i].callRejected(error);
  }
  return self;
};

function getThen(obj) {
  
  var then = obj && obj.then;
  if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
    return function appyThen() {
      then.apply(obj, arguments);
    };
  }
}

function safelyResolveThenable(self, thenable) {
  
  var called = false;
  function onError(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.reject(self, value);
  }

  function onSuccess(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.resolve(self, value);
  }

  function tryToUnwrap() {
    thenable(onSuccess, onError);
  }

  var result = tryCatch(tryToUnwrap);
  if (result.status === 'error') {
    onError(result.value);
  }
}

function tryCatch(func, value) {
  var out = {};
  try {
    out.value = func(value);
    out.status = 'success';
  } catch (e) {
    out.status = 'error';
    out.value = e;
  }
  return out;
}

Promise.resolve = resolve;
function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return handlers.resolve(new this(INTERNAL), value);
}

Promise.reject = reject;
function reject(reason) {
  var promise = new this(INTERNAL);
  return handlers.reject(promise, reason);
}

Promise.all = all;
function all(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var values = new Array(len);
  var resolved = 0;
  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    allResolver(iterable[i], i);
  }
  return promise;
  function allResolver(value, i) {
    self.resolve(value).then(resolveFromAll, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
    function resolveFromAll(outValue) {
      values[i] = outValue;
      if (++resolved === len && !called) {
        called = true;
        handlers.resolve(promise, values);
      }
    }
  }
}

Promise.race = race;
function race(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    self.resolve(value).then(function (response) {
      if (!called) {
        called = true;
        handlers.resolve(promise, response);
      }
    }, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
  }
}

},{"1":1}],3:[function(_dereq_,module,exports){
(function (global){
'use strict';
if (typeof global.Promise !== 'function') {
  global.Promise = _dereq_(2);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"2":2}],4:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getIDB() {
    
    try {
        if (typeof indexedDB !== 'undefined') {
            return indexedDB;
        }
        if (typeof webkitIndexedDB !== 'undefined') {
            return webkitIndexedDB;
        }
        if (typeof mozIndexedDB !== 'undefined') {
            return mozIndexedDB;
        }
        if (typeof OIndexedDB !== 'undefined') {
            return OIndexedDB;
        }
        if (typeof msIndexedDB !== 'undefined') {
            return msIndexedDB;
        }
    } catch (e) {
        return;
    }
}

var idb = getIDB();

function isIndexedDBValid() {
    try {
        
        
        if (!idb) {
            return false;
        }
        
        
        
        
        var isSafari = typeof openDatabase !== 'undefined' && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);

        var hasFetch = typeof fetch === 'function' && fetch.toString().indexOf('[native code') !== -1;

        
        
        return (!isSafari || hasFetch) && typeof indexedDB !== 'undefined' &&
        
        
        
        
        typeof IDBKeyRange !== 'undefined';
    } catch (e) {
        return false;
    }
}







function createBlob(parts, properties) {
    
    parts = parts || [];
    properties = properties || {};
    try {
        return new Blob(parts, properties);
    } catch (e) {
        if (e.name !== 'TypeError') {
            throw e;
        }
        var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
        var builder = new Builder();
        for (var i = 0; i < parts.length; i += 1) {
            builder.append(parts[i]);
        }
        return builder.getBlob(properties.type);
    }
}



if (typeof Promise === 'undefined') {
    
    
    _dereq_(3);
}
var Promise$1 = Promise;

function executeCallback(promise, callback) {
    if (callback) {
        promise.then(function (result) {
            callback(null, result);
        }, function (error) {
            callback(error);
        });
    }
}

function executeTwoCallbacks(promise, callback, errorCallback) {
    if (typeof callback === 'function') {
        promise.then(callback);
    }

    if (typeof errorCallback === 'function') {
        promise["catch"](errorCallback);
    }
}

function normalizeKey(key) {
    
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    return key;
}

function getCallback() {
    if (arguments.length && typeof arguments[arguments.length - 1] === 'function') {
        return arguments[arguments.length - 1];
    }
}




var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
var supportsBlobs = void 0;
var dbContexts = {};
var toString = Object.prototype.toString;


var READ_ONLY = 'readonly';
var READ_WRITE = 'readwrite';






function _binStringToArrayBuffer(bin) {
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
        arr[i] = bin.charCodeAt(i);
    }
    return buf;
}
















function _checkBlobSupportWithoutCaching(idb) {
    return new Promise$1(function (resolve) {
        var txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
        var blob = createBlob(['']);
        txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

        txn.onabort = function (e) {
            
            
            e.preventDefault();
            e.stopPropagation();
            resolve(false);
        };

        txn.oncomplete = function () {
            var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
            var matchedEdge = navigator.userAgent.match(/Edge\//);
            
            
            resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
        };
    })["catch"](function () {
        return false; 
    });
}

function _checkBlobSupport(idb) {
    if (typeof supportsBlobs === 'boolean') {
        return Promise$1.resolve(supportsBlobs);
    }
    return _checkBlobSupportWithoutCaching(idb).then(function (value) {
        supportsBlobs = value;
        return supportsBlobs;
    });
}

function _deferReadiness(dbInfo) {
    var dbContext = dbContexts[dbInfo.name];

    
    var deferredOperation = {};

    deferredOperation.promise = new Promise$1(function (resolve, reject) {
        deferredOperation.resolve = resolve;
        deferredOperation.reject = reject;
    });

    
    dbContext.deferredOperations.push(deferredOperation);

    
    if (!dbContext.dbReady) {
        dbContext.dbReady = deferredOperation.promise;
    } else {
        dbContext.dbReady = dbContext.dbReady.then(function () {
            return deferredOperation.promise;
        });
    }
}

function _advanceReadiness(dbInfo) {
    var dbContext = dbContexts[dbInfo.name];

    
    var deferredOperation = dbContext.deferredOperations.pop();

    
    
    if (deferredOperation) {
        deferredOperation.resolve();
        return deferredOperation.promise;
    }
}

function _rejectReadiness(dbInfo, err) {
    var dbContext = dbContexts[dbInfo.name];

    
    var deferredOperation = dbContext.deferredOperations.pop();

    
    
    if (deferredOperation) {
        deferredOperation.reject(err);
        return deferredOperation.promise;
    }
}

function _getConnection(dbInfo, upgradeNeeded) {
    return new Promise$1(function (resolve, reject) {
        dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();

        if (dbInfo.db) {
            if (upgradeNeeded) {
                _deferReadiness(dbInfo);
                dbInfo.db.close();
            } else {
                return resolve(dbInfo.db);
            }
        }

        var dbArgs = [dbInfo.name];

        if (upgradeNeeded) {
            dbArgs.push(dbInfo.version);
        }

        var openreq = idb.open.apply(idb, dbArgs);

        if (upgradeNeeded) {
            openreq.onupgradeneeded = function (e) {
                var db = openreq.result;
                try {
                    db.createObjectStore(dbInfo.storeName);
                    if (e.oldVersion <= 1) {
                        
                        db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                    }
                } catch (ex) {
                    if (ex.name === 'ConstraintError') {
                        console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                    } else {
                        throw ex;
                    }
                }
            };
        }

        openreq.onerror = function (e) {
            e.preventDefault();
            reject(openreq.error);
        };

        openreq.onsuccess = function () {
            resolve(openreq.result);
            _advanceReadiness(dbInfo);
        };
    });
}

function _getOriginalConnection(dbInfo) {
    return _getConnection(dbInfo, false);
}

function _getUpgradedConnection(dbInfo) {
    return _getConnection(dbInfo, true);
}

function _isUpgradeNeeded(dbInfo, defaultVersion) {
    if (!dbInfo.db) {
        return true;
    }

    var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
    var isDowngrade = dbInfo.version < dbInfo.db.version;
    var isUpgrade = dbInfo.version > dbInfo.db.version;

    if (isDowngrade) {
        
        
        if (dbInfo.version !== defaultVersion) {
            console.warn('The database "' + dbInfo.name + '"' + " can't be downgraded from version " + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
        }
        
        dbInfo.version = dbInfo.db.version;
    }

    if (isUpgrade || isNewStore) {
        
        
        
        if (isNewStore) {
            var incVersion = dbInfo.db.version + 1;
            if (incVersion > dbInfo.version) {
                dbInfo.version = incVersion;
            }
        }

        return true;
    }

    return false;
}


function _encodeBlob(blob) {
    return new Promise$1(function (resolve, reject) {
        var reader = new FileReader();
        reader.onerror = reject;
        reader.onloadend = function (e) {
            var base64 = btoa(e.target.result || '');
            resolve({
                __local_forage_encoded_blob: true,
                data: base64,
                type: blob.type
            });
        };
        reader.readAsBinaryString(blob);
    });
}


function _decodeBlob(encodedBlob) {
    var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
    return createBlob([arrayBuff], { type: encodedBlob.type });
}


function _isEncodedBlob(value) {
    return value && value.__local_forage_encoded_blob;
}





function _fullyReady(callback) {
    var self = this;

    var promise = self._initReady().then(function () {
        var dbContext = dbContexts[self._dbInfo.name];

        if (dbContext && dbContext.dbReady) {
            return dbContext.dbReady;
        }
    });

    executeTwoCallbacks(promise, callback, callback);
    return promise;
}




function _tryReconnect(dbInfo) {
    _deferReadiness(dbInfo);

    var dbContext = dbContexts[dbInfo.name];
    var forages = dbContext.forages;

    for (var i = 0; i < forages.length; i++) {
        var forage = forages[i];
        if (forage._dbInfo.db) {
            forage._dbInfo.db.close();
            forage._dbInfo.db = null;
        }
    }
    dbInfo.db = null;

    return _getOriginalConnection(dbInfo).then(function (db) {
        dbInfo.db = db;
        if (_isUpgradeNeeded(dbInfo)) {
            
            return _getUpgradedConnection(dbInfo);
        }
        return db;
    }).then(function (db) {
        
        
        dbInfo.db = dbContext.db = db;
        for (var i = 0; i < forages.length; i++) {
            forages[i]._dbInfo.db = db;
        }
    })["catch"](function (err) {
        _rejectReadiness(dbInfo, err);
        throw err;
    });
}



function createTransaction(dbInfo, mode, callback, retries) {
    if (retries === undefined) {
        retries = 1;
    }

    try {
        var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
        callback(null, tx);
    } catch (err) {
        if (retries > 0 && (!dbInfo.db || err.name === 'InvalidStateError' || err.name === 'NotFoundError')) {
            return Promise$1.resolve().then(function () {
                if (!dbInfo.db || err.name === 'NotFoundError' && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
                    
                    if (dbInfo.db) {
                        dbInfo.version = dbInfo.db.version + 1;
                    }
                    
                    return _getUpgradedConnection(dbInfo);
                }
            }).then(function () {
                return _tryReconnect(dbInfo).then(function () {
                    createTransaction(dbInfo, mode, callback, retries - 1);
                });
            })["catch"](callback);
        }

        callback(err);
    }
}

function createDbContext() {
    return {
        
        forages: [],
        
        db: null,
        
        dbReady: null,
        
        deferredOperations: []
    };
}



function _initStorage(options) {
    var self = this;
    var dbInfo = {
        db: null
    };

    if (options) {
        for (var i in options) {
            dbInfo[i] = options[i];
        }
    }

    
    var dbContext = dbContexts[dbInfo.name];

    
    if (!dbContext) {
        dbContext = createDbContext();
        
        dbContexts[dbInfo.name] = dbContext;
    }

    
    dbContext.forages.push(self);

    
    if (!self._initReady) {
        self._initReady = self.ready;
        self.ready = _fullyReady;
    }

    
    var initPromises = [];

    function ignoreErrors() {
        
        
        return Promise$1.resolve();
    }

    for (var j = 0; j < dbContext.forages.length; j++) {
        var forage = dbContext.forages[j];
        if (forage !== self) {
            
            initPromises.push(forage._initReady()["catch"](ignoreErrors));
        }
    }

    
    var forages = dbContext.forages.slice(0);

    
    
    return Promise$1.all(initPromises).then(function () {
        dbInfo.db = dbContext.db;
        
        return _getOriginalConnection(dbInfo);
    }).then(function (db) {
        dbInfo.db = db;
        if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
            
            return _getUpgradedConnection(dbInfo);
        }
        return db;
    }).then(function (db) {
        dbInfo.db = dbContext.db = db;
        self._dbInfo = dbInfo;
        
        for (var k = 0; k < forages.length; k++) {
            var forage = forages[k];
            if (forage !== self) {
                
                forage._dbInfo.db = dbInfo.db;
                forage._dbInfo.version = dbInfo.version;
            }
        }
    });
}

function getItem(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.get(key);

                    req.onsuccess = function () {
                        var value = req.result;
                        if (value === undefined) {
                            value = null;
                        }
                        if (_isEncodedBlob(value)) {
                            value = _decodeBlob(value);
                        }
                        resolve(value);
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}


function iterate(iterator, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.openCursor();
                    var iterationNumber = 1;

                    req.onsuccess = function () {
                        var cursor = req.result;

                        if (cursor) {
                            var value = cursor.value;
                            if (_isEncodedBlob(value)) {
                                value = _decodeBlob(value);
                            }
                            var result = iterator(value, cursor.key, iterationNumber++);

                            
                            
                            
                            if (result !== void 0) {
                                resolve(result);
                            } else {
                                cursor["continue"]();
                            }
                        } else {
                            resolve();
                        }
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);

    return promise;
}

function setItem(key, value, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        var dbInfo;
        self.ready().then(function () {
            dbInfo = self._dbInfo;
            if (toString.call(value) === '[object Blob]') {
                return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
                    if (blobSupport) {
                        return value;
                    }
                    return _encodeBlob(value);
                });
            }
            return value;
        }).then(function (value) {
            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);

                    
                    
                    
                    
                    if (value === null) {
                        value = undefined;
                    }

                    var req = store.put(value, key);

                    transaction.oncomplete = function () {
                        
                        
                        
                        
                        
                        
                        if (value === undefined) {
                            value = null;
                        }

                        resolve(value);
                    };
                    transaction.onabort = transaction.onerror = function () {
                        var err = req.error ? req.error : req.transaction.error;
                        reject(err);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function removeItem(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    
                    
                    
                    
                    
                    var req = store["delete"](key);
                    transaction.oncomplete = function () {
                        resolve();
                    };

                    transaction.onerror = function () {
                        reject(req.error);
                    };

                    
                    
                    transaction.onabort = function () {
                        var err = req.error ? req.error : req.transaction.error;
                        reject(err);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function clear(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.clear();

                    transaction.oncomplete = function () {
                        resolve();
                    };

                    transaction.onabort = transaction.onerror = function () {
                        var err = req.error ? req.error : req.transaction.error;
                        reject(err);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function length(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.count();

                    req.onsuccess = function () {
                        resolve(req.result);
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function key(n, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        if (n < 0) {
            resolve(null);

            return;
        }

        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var advanced = false;
                    var req = store.openCursor();

                    req.onsuccess = function () {
                        var cursor = req.result;
                        if (!cursor) {
                            
                            resolve(null);

                            return;
                        }

                        if (n === 0) {
                            
                            
                            resolve(cursor.key);
                        } else {
                            if (!advanced) {
                                
                                
                                advanced = true;
                                cursor.advance(n);
                            } else {
                                
                                resolve(cursor.key);
                            }
                        }
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function keys(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.openCursor();
                    var keys = [];

                    req.onsuccess = function () {
                        var cursor = req.result;

                        if (!cursor) {
                            resolve(keys);
                            return;
                        }

                        keys.push(cursor.key);
                        cursor["continue"]();
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function dropInstance(options, callback) {
    callback = getCallback.apply(this, arguments);

    var currentConfig = this.config();
    options = typeof options !== 'function' && options || {};
    if (!options.name) {
        options.name = options.name || currentConfig.name;
        options.storeName = options.storeName || currentConfig.storeName;
    }

    var self = this;
    var promise;
    if (!options.name) {
        promise = Promise$1.reject('Invalid arguments');
    } else {
        var isCurrentDb = options.name === currentConfig.name && self._dbInfo.db;

        var dbPromise = isCurrentDb ? Promise$1.resolve(self._dbInfo.db) : _getOriginalConnection(options).then(function (db) {
            var dbContext = dbContexts[options.name];
            var forages = dbContext.forages;
            dbContext.db = db;
            for (var i = 0; i < forages.length; i++) {
                forages[i]._dbInfo.db = db;
            }
            return db;
        });

        if (!options.storeName) {
            promise = dbPromise.then(function (db) {
                _deferReadiness(options);

                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;

                db.close();
                for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                }

                var dropDBPromise = new Promise$1(function (resolve, reject) {
                    var req = idb.deleteDatabase(options.name);

                    req.onerror = req.onblocked = function (err) {
                        var db = req.result;
                        if (db) {
                            db.close();
                        }
                        reject(err);
                    };

                    req.onsuccess = function () {
                        var db = req.result;
                        if (db) {
                            db.close();
                        }
                        resolve(db);
                    };
                });

                return dropDBPromise.then(function (db) {
                    dbContext.db = db;
                    for (var i = 0; i < forages.length; i++) {
                        var _forage = forages[i];
                        _advanceReadiness(_forage._dbInfo);
                    }
                })["catch"](function (err) {
                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                    throw err;
                });
            });
        } else {
            promise = dbPromise.then(function (db) {
                if (!db.objectStoreNames.contains(options.storeName)) {
                    return;
                }

                var newVersion = db.version + 1;

                _deferReadiness(options);

                var dbContext = dbContexts[options.name];
                var forages = dbContext.forages;

                db.close();
                for (var i = 0; i < forages.length; i++) {
                    var forage = forages[i];
                    forage._dbInfo.db = null;
                    forage._dbInfo.version = newVersion;
                }

                var dropObjectPromise = new Promise$1(function (resolve, reject) {
                    var req = idb.open(options.name, newVersion);

                    req.onerror = function (err) {
                        var db = req.result;
                        db.close();
                        reject(err);
                    };

                    req.onupgradeneeded = function () {
                        var db = req.result;
                        db.deleteObjectStore(options.storeName);
                    };

                    req.onsuccess = function () {
                        var db = req.result;
                        db.close();
                        resolve(db);
                    };
                });

                return dropObjectPromise.then(function (db) {
                    dbContext.db = db;
                    for (var j = 0; j < forages.length; j++) {
                        var _forage2 = forages[j];
                        _forage2._dbInfo.db = db;
                        _advanceReadiness(_forage2._dbInfo);
                    }
                })["catch"](function (err) {
                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
                    throw err;
                });
            });
        }
    }

    executeCallback(promise, callback);
    return promise;
}

var asyncStorage = {
    _driver: 'asyncStorage',
    _initStorage: _initStorage,
    _support: isIndexedDBValid(),
    iterate: iterate,
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem,
    clear: clear,
    length: length,
    key: key,
    keys: keys,
    dropInstance: dropInstance
};

function isWebSQLValid() {
    return typeof openDatabase === 'function';
}




var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

var BLOB_TYPE_PREFIX = '~~local_forage_type~';
var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

var SERIALIZED_MARKER = '__lfsc__:';
var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;


var TYPE_ARRAYBUFFER = 'arbf';
var TYPE_BLOB = 'blob';
var TYPE_INT8ARRAY = 'si08';
var TYPE_UINT8ARRAY = 'ui08';
var TYPE_UINT8CLAMPEDARRAY = 'uic8';
var TYPE_INT16ARRAY = 'si16';
var TYPE_INT32ARRAY = 'si32';
var TYPE_UINT16ARRAY = 'ur16';
var TYPE_UINT32ARRAY = 'ui32';
var TYPE_FLOAT32ARRAY = 'fl32';
var TYPE_FLOAT64ARRAY = 'fl64';
var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

var toString$1 = Object.prototype.toString;

function stringToBuffer(serializedString) {
    
    var bufferLength = serializedString.length * 0.75;
    var len = serializedString.length;
    var i;
    var p = 0;
    var encoded1, encoded2, encoded3, encoded4;

    if (serializedString[serializedString.length - 1] === '=') {
        bufferLength--;
        if (serializedString[serializedString.length - 2] === '=') {
            bufferLength--;
        }
    }

    var buffer = new ArrayBuffer(bufferLength);
    var bytes = new Uint8Array(buffer);

    for (i = 0; i < len; i += 4) {
        encoded1 = BASE_CHARS.indexOf(serializedString[i]);
        encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
        encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
        encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

        
        bytes[p++] = encoded1 << 2 | encoded2 >> 4;
        bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
        bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }
    return buffer;
}



function bufferToString(buffer) {
    
    var bytes = new Uint8Array(buffer);
    var base64String = '';
    var i;

    for (i = 0; i < bytes.length; i += 3) {
        
        base64String += BASE_CHARS[bytes[i] >> 2];
        base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
        base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
        base64String += BASE_CHARS[bytes[i + 2] & 63];
    }

    if (bytes.length % 3 === 2) {
        base64String = base64String.substring(0, base64String.length - 1) + '=';
    } else if (bytes.length % 3 === 1) {
        base64String = base64String.substring(0, base64String.length - 2) + '==';
    }

    return base64String;
}




function serialize(value, callback) {
    var valueType = '';
    if (value) {
        valueType = toString$1.call(value);
    }

    
    
    
    
    if (value && (valueType === '[object ArrayBuffer]' || value.buffer && toString$1.call(value.buffer) === '[object ArrayBuffer]')) {
        
        
        var buffer;
        var marker = SERIALIZED_MARKER;

        if (value instanceof ArrayBuffer) {
            buffer = value;
            marker += TYPE_ARRAYBUFFER;
        } else {
            buffer = value.buffer;

            if (valueType === '[object Int8Array]') {
                marker += TYPE_INT8ARRAY;
            } else if (valueType === '[object Uint8Array]') {
                marker += TYPE_UINT8ARRAY;
            } else if (valueType === '[object Uint8ClampedArray]') {
                marker += TYPE_UINT8CLAMPEDARRAY;
            } else if (valueType === '[object Int16Array]') {
                marker += TYPE_INT16ARRAY;
            } else if (valueType === '[object Uint16Array]') {
                marker += TYPE_UINT16ARRAY;
            } else if (valueType === '[object Int32Array]') {
                marker += TYPE_INT32ARRAY;
            } else if (valueType === '[object Uint32Array]') {
                marker += TYPE_UINT32ARRAY;
            } else if (valueType === '[object Float32Array]') {
                marker += TYPE_FLOAT32ARRAY;
            } else if (valueType === '[object Float64Array]') {
                marker += TYPE_FLOAT64ARRAY;
            } else {
                callback(new Error('Failed to get type for BinaryArray'));
            }
        }

        callback(marker + bufferToString(buffer));
    } else if (valueType === '[object Blob]') {
        
        var fileReader = new FileReader();

        fileReader.onload = function () {
            
            var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

            callback(SERIALIZED_MARKER + TYPE_BLOB + str);
        };

        fileReader.readAsArrayBuffer(value);
    } else {
        try {
            callback(JSON.stringify(value));
        } catch (e) {
            console.error("Couldn't convert value into a JSON string: ", value);

            callback(null, e);
        }
    }
}









function deserialize(value) {
    
    
    
    if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
        return JSON.parse(value);
    }

    
    
    
    var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
    var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

    var blobType;
    
    
    if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
        var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
        blobType = matcher[1];
        serializedString = serializedString.substring(matcher[0].length);
    }
    var buffer = stringToBuffer(serializedString);

    
    
    switch (type) {
        case TYPE_ARRAYBUFFER:
            return buffer;
        case TYPE_BLOB:
            return createBlob([buffer], { type: blobType });
        case TYPE_INT8ARRAY:
            return new Int8Array(buffer);
        case TYPE_UINT8ARRAY:
            return new Uint8Array(buffer);
        case TYPE_UINT8CLAMPEDARRAY:
            return new Uint8ClampedArray(buffer);
        case TYPE_INT16ARRAY:
            return new Int16Array(buffer);
        case TYPE_UINT16ARRAY:
            return new Uint16Array(buffer);
        case TYPE_INT32ARRAY:
            return new Int32Array(buffer);
        case TYPE_UINT32ARRAY:
            return new Uint32Array(buffer);
        case TYPE_FLOAT32ARRAY:
            return new Float32Array(buffer);
        case TYPE_FLOAT64ARRAY:
            return new Float64Array(buffer);
        default:
            throw new Error('Unkown type: ' + type);
    }
}

var localforageSerializer = {
    serialize: serialize,
    deserialize: deserialize,
    stringToBuffer: stringToBuffer,
    bufferToString: bufferToString
};



function createDbTable(t, dbInfo, callback, errorCallback) {
    t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' ' + '(id INTEGER PRIMARY KEY, key unique, value)', [], callback, errorCallback);
}



function _initStorage$1(options) {
    var self = this;
    var dbInfo = {
        db: null
    };

    if (options) {
        for (var i in options) {
            dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
        }
    }

    var dbInfoPromise = new Promise$1(function (resolve, reject) {
        
        
        try {
            dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
        } catch (e) {
            return reject(e);
        }

        
        dbInfo.db.transaction(function (t) {
            createDbTable(t, dbInfo, function () {
                self._dbInfo = dbInfo;
                resolve();
            }, function (t, error) {
                reject(error);
            });
        }, reject);
    });

    dbInfo.serializer = localforageSerializer;
    return dbInfoPromise;
}

function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
    t.executeSql(sqlStatement, args, callback, function (t, error) {
        if (error.code === error.SYNTAX_ERR) {
            t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name = ?", [dbInfo.storeName], function (t, results) {
                if (!results.rows.length) {
                    
                    
                    createDbTable(t, dbInfo, function () {
                        t.executeSql(sqlStatement, args, callback, errorCallback);
                    }, errorCallback);
                } else {
                    errorCallback(t, error);
                }
            }, errorCallback);
        } else {
            errorCallback(t, error);
        }
    }, errorCallback);
}

function getItem$1(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
                    var result = results.rows.length ? results.rows.item(0).value : null;

                    
                    
                    if (result) {
                        result = dbInfo.serializer.deserialize(result);
                    }

                    resolve(result);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function iterate$1(iterator, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;

            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
                    var rows = results.rows;
                    var length = rows.length;

                    for (var i = 0; i < length; i++) {
                        var item = rows.item(i);
                        var result = item.value;

                        
                        
                        if (result) {
                            result = dbInfo.serializer.deserialize(result);
                        }

                        result = iterator(result, item.key, i + 1);

                        
                        
                        if (result !== void 0) {
                            resolve(result);
                            return;
                        }
                    }

                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function _setItem(key, value, callback, retriesLeft) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            
            
            
            if (value === undefined) {
                value = null;
            }

            
            var originalValue = value;

            var dbInfo = self._dbInfo;
            dbInfo.serializer.serialize(value, function (value, error) {
                if (error) {
                    reject(error);
                } else {
                    dbInfo.db.transaction(function (t) {
                        tryExecuteSql(t, dbInfo, 'INSERT OR REPLACE INTO ' + dbInfo.storeName + ' ' + '(key, value) VALUES (?, ?)', [key, value], function () {
                            resolve(originalValue);
                        }, function (t, error) {
                            reject(error);
                        });
                    }, function (sqlError) {
                        
                        
                        if (sqlError.code === sqlError.QUOTA_ERR) {
                            
                            
                            
                            
                            
                            
                            
                            if (retriesLeft > 0) {
                                resolve(_setItem.apply(self, [key, originalValue, callback, retriesLeft - 1]));
                                return;
                            }
                            reject(sqlError);
                        }
                    });
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function setItem$1(key, value, callback) {
    return _setItem.apply(this, [key, value, callback, 1]);
}

function removeItem$1(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}



function clear$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName, [], function () {
                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}



function length$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                
                tryExecuteSql(t, dbInfo, 'SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
                    var result = results.rows.item(0).c;
                    resolve(result);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}








function key$1(n, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
                    var result = results.rows.length ? results.rows.item(0).key : null;
                    resolve(result);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function keys$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
                    var keys = [];

                    for (var i = 0; i < results.rows.length; i++) {
                        keys.push(results.rows.item(i).key);
                    }

                    resolve(keys);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}



function getAllStoreNames(db) {
    return new Promise$1(function (resolve, reject) {
        db.transaction(function (t) {
            t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function (t, results) {
                var storeNames = [];

                for (var i = 0; i < results.rows.length; i++) {
                    storeNames.push(results.rows.item(i).name);
                }

                resolve({
                    db: db,
                    storeNames: storeNames
                });
            }, function (t, error) {
                reject(error);
            });
        }, function (sqlError) {
            reject(sqlError);
        });
    });
}

function dropInstance$1(options, callback) {
    callback = getCallback.apply(this, arguments);

    var currentConfig = this.config();
    options = typeof options !== 'function' && options || {};
    if (!options.name) {
        options.name = options.name || currentConfig.name;
        options.storeName = options.storeName || currentConfig.storeName;
    }

    var self = this;
    var promise;
    if (!options.name) {
        promise = Promise$1.reject('Invalid arguments');
    } else {
        promise = new Promise$1(function (resolve) {
            var db;
            if (options.name === currentConfig.name) {
                
                db = self._dbInfo.db;
            } else {
                db = openDatabase(options.name, '', '', 0);
            }

            if (!options.storeName) {
                
                resolve(getAllStoreNames(db));
            } else {
                resolve({
                    db: db,
                    storeNames: [options.storeName]
                });
            }
        }).then(function (operationInfo) {
            return new Promise$1(function (resolve, reject) {
                operationInfo.db.transaction(function (t) {
                    function dropTable(storeName) {
                        return new Promise$1(function (resolve, reject) {
                            t.executeSql('DROP TABLE IF EXISTS ' + storeName, [], function () {
                                resolve();
                            }, function (t, error) {
                                reject(error);
                            });
                        });
                    }

                    var operations = [];
                    for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) {
                        operations.push(dropTable(operationInfo.storeNames[i]));
                    }

                    Promise$1.all(operations).then(function () {
                        resolve();
                    })["catch"](function (e) {
                        reject(e);
                    });
                }, function (sqlError) {
                    reject(sqlError);
                });
            });
        });
    }

    executeCallback(promise, callback);
    return promise;
}

var webSQLStorage = {
    _driver: 'webSQLStorage',
    _initStorage: _initStorage$1,
    _support: isWebSQLValid(),
    iterate: iterate$1,
    getItem: getItem$1,
    setItem: setItem$1,
    removeItem: removeItem$1,
    clear: clear$1,
    length: length$1,
    key: key$1,
    keys: keys$1,
    dropInstance: dropInstance$1
};

function isLocalStorageValid() {
    try {
        return typeof localStorage !== 'undefined' && 'setItem' in localStorage &&
        
        !!localStorage.setItem;
    } catch (e) {
        return false;
    }
}

function _getKeyPrefix(options, defaultConfig) {
    var keyPrefix = options.name + '/';

    if (options.storeName !== defaultConfig.storeName) {
        keyPrefix += options.storeName + '/';
    }
    return keyPrefix;
}


function checkIfLocalStorageThrows() {
    var localStorageTestKey = '_localforage_support_test';

    try {
        localStorage.setItem(localStorageTestKey, true);
        localStorage.removeItem(localStorageTestKey);

        return false;
    } catch (e) {
        return true;
    }
}





function _isLocalStorageUsable() {
    return !checkIfLocalStorageThrows() || localStorage.length > 0;
}


function _initStorage$2(options) {
    var self = this;
    var dbInfo = {};
    if (options) {
        for (var i in options) {
            dbInfo[i] = options[i];
        }
    }

    dbInfo.keyPrefix = _getKeyPrefix(options, self._defaultConfig);

    if (!_isLocalStorageUsable()) {
        return Promise$1.reject();
    }

    self._dbInfo = dbInfo;
    dbInfo.serializer = localforageSerializer;

    return Promise$1.resolve();
}



function clear$2(callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var keyPrefix = self._dbInfo.keyPrefix;

        for (var i = localStorage.length - 1; i >= 0; i--) {
            var key = localStorage.key(i);

            if (key.indexOf(keyPrefix) === 0) {
                localStorage.removeItem(key);
            }
        }
    });

    executeCallback(promise, callback);
    return promise;
}




function getItem$2(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var result = localStorage.getItem(dbInfo.keyPrefix + key);

        
        
        
        
        if (result) {
            result = dbInfo.serializer.deserialize(result);
        }

        return result;
    });

    executeCallback(promise, callback);
    return promise;
}


function iterate$2(iterator, callback) {
    var self = this;

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var keyPrefix = dbInfo.keyPrefix;
        var keyPrefixLength = keyPrefix.length;
        var length = localStorage.length;

        
        
        
        
        
        
        var iterationNumber = 1;

        for (var i = 0; i < length; i++) {
            var key = localStorage.key(i);
            if (key.indexOf(keyPrefix) !== 0) {
                continue;
            }
            var value = localStorage.getItem(key);

            
            
            
            
            if (value) {
                value = dbInfo.serializer.deserialize(value);
            }

            value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

            if (value !== void 0) {
                return value;
            }
        }
    });

    executeCallback(promise, callback);
    return promise;
}


function key$2(n, callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var result;
        try {
            result = localStorage.key(n);
        } catch (error) {
            result = null;
        }

        
        if (result) {
            result = result.substring(dbInfo.keyPrefix.length);
        }

        return result;
    });

    executeCallback(promise, callback);
    return promise;
}

function keys$2(callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var length = localStorage.length;
        var keys = [];

        for (var i = 0; i < length; i++) {
            var itemKey = localStorage.key(i);
            if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
                keys.push(itemKey.substring(dbInfo.keyPrefix.length));
            }
        }

        return keys;
    });

    executeCallback(promise, callback);
    return promise;
}


function length$2(callback) {
    var self = this;
    var promise = self.keys().then(function (keys) {
        return keys.length;
    });

    executeCallback(promise, callback);
    return promise;
}


function removeItem$2(key, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        localStorage.removeItem(dbInfo.keyPrefix + key);
    });

    executeCallback(promise, callback);
    return promise;
}





function setItem$2(key, value, callback) {
    var self = this;

    key = normalizeKey(key);

    var promise = self.ready().then(function () {
        
        
        if (value === undefined) {
            value = null;
        }

        
        var originalValue = value;

        return new Promise$1(function (resolve, reject) {
            var dbInfo = self._dbInfo;
            dbInfo.serializer.serialize(value, function (value, error) {
                if (error) {
                    reject(error);
                } else {
                    try {
                        localStorage.setItem(dbInfo.keyPrefix + key, value);
                        resolve(originalValue);
                    } catch (e) {
                        
                        
                        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                            reject(e);
                        }
                        reject(e);
                    }
                }
            });
        });
    });

    executeCallback(promise, callback);
    return promise;
}

function dropInstance$2(options, callback) {
    callback = getCallback.apply(this, arguments);

    options = typeof options !== 'function' && options || {};
    if (!options.name) {
        var currentConfig = this.config();
        options.name = options.name || currentConfig.name;
        options.storeName = options.storeName || currentConfig.storeName;
    }

    var self = this;
    var promise;
    if (!options.name) {
        promise = Promise$1.reject('Invalid arguments');
    } else {
        promise = new Promise$1(function (resolve) {
            if (!options.storeName) {
                resolve(options.name + '/');
            } else {
                resolve(_getKeyPrefix(options, self._defaultConfig));
            }
        }).then(function (keyPrefix) {
            for (var i = localStorage.length - 1; i >= 0; i--) {
                var key = localStorage.key(i);

                if (key.indexOf(keyPrefix) === 0) {
                    localStorage.removeItem(key);
                }
            }
        });
    }

    executeCallback(promise, callback);
    return promise;
}

var localStorageWrapper = {
    _driver: 'localStorageWrapper',
    _initStorage: _initStorage$2,
    _support: isLocalStorageValid(),
    iterate: iterate$2,
    getItem: getItem$2,
    setItem: setItem$2,
    removeItem: removeItem$2,
    clear: clear$2,
    length: length$2,
    key: key$2,
    keys: keys$2,
    dropInstance: dropInstance$2
};

var sameValue = function sameValue(x, y) {
    return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
};

var includes = function includes(array, searchElement) {
    var len = array.length;
    var i = 0;
    while (i < len) {
        if (sameValue(array[i], searchElement)) {
            return true;
        }
        i++;
    }

    return false;
};

var isArray = Array.isArray || function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};



var DefinedDrivers = {};

var DriverSupport = {};

var DefaultDrivers = {
    INDEXEDDB: asyncStorage,
    WEBSQL: webSQLStorage,
    LOCALSTORAGE: localStorageWrapper
};

var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];

var OptionalDriverMethods = ['dropInstance'];

var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'].concat(OptionalDriverMethods);

var DefaultConfig = {
    description: '',
    driver: DefaultDriverOrder.slice(),
    name: 'localforage',
    
    
    size: 4980736,
    storeName: 'keyvaluepairs',
    version: 1.0
};

function callWhenReady(localForageInstance, libraryMethod) {
    localForageInstance[libraryMethod] = function () {
        var _args = arguments;
        return localForageInstance.ready().then(function () {
            return localForageInstance[libraryMethod].apply(localForageInstance, _args);
        });
    };
}

function extend() {
    for (var i = 1; i < arguments.length; i++) {
        var arg = arguments[i];

        if (arg) {
            for (var _key in arg) {
                if (arg.hasOwnProperty(_key)) {
                    if (isArray(arg[_key])) {
                        arguments[0][_key] = arg[_key].slice();
                    } else {
                        arguments[0][_key] = arg[_key];
                    }
                }
            }
        }
    }

    return arguments[0];
}

var LocalForage = function () {
    function LocalForage(options) {
        _classCallCheck(this, LocalForage);

        for (var driverTypeKey in DefaultDrivers) {
            if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
                var driver = DefaultDrivers[driverTypeKey];
                var driverName = driver._driver;
                this[driverTypeKey] = driverName;

                if (!DefinedDrivers[driverName]) {
                    
                    
                    
                    this.defineDriver(driver);
                }
            }
        }

        this._defaultConfig = extend({}, DefaultConfig);
        this._config = extend({}, this._defaultConfig, options);
        this._driverSet = null;
        this._initDriver = null;
        this._ready = false;
        this._dbInfo = null;

        this._wrapLibraryMethodsWithReady();
        this.setDriver(this._config.driver)["catch"](function () {});
    }

    
    
    
    


    LocalForage.prototype.config = function config(options) {
        
        
        
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
            
            
            if (this._ready) {
                return new Error("Can't call config() after localforage " + 'has been used.');
            }

            for (var i in options) {
                if (i === 'storeName') {
                    options[i] = options[i].replace(/\W/g, '_');
                }

                if (i === 'version' && typeof options[i] !== 'number') {
                    return new Error('Database version must be a number.');
                }

                this._config[i] = options[i];
            }

            
            
            if ('driver' in options && options.driver) {
                return this.setDriver(this._config.driver);
            }

            return true;
        } else if (typeof options === 'string') {
            return this._config[options];
        } else {
            return this._config;
        }
    };

    
    


    LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
        var promise = new Promise$1(function (resolve, reject) {
            try {
                var driverName = driverObject._driver;
                var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');

                
                
                if (!driverObject._driver) {
                    reject(complianceError);
                    return;
                }

                var driverMethods = LibraryMethods.concat('_initStorage');
                for (var i = 0, len = driverMethods.length; i < len; i++) {
                    var driverMethodName = driverMethods[i];

                    
                    
                    var isRequired = !includes(OptionalDriverMethods, driverMethodName);
                    if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== 'function') {
                        reject(complianceError);
                        return;
                    }
                }

                var configureMissingMethods = function configureMissingMethods() {
                    var methodNotImplementedFactory = function methodNotImplementedFactory(methodName) {
                        return function () {
                            var error = new Error('Method ' + methodName + ' is not implemented by the current driver');
                            var promise = Promise$1.reject(error);
                            executeCallback(promise, arguments[arguments.length - 1]);
                            return promise;
                        };
                    };

                    for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
                        var optionalDriverMethod = OptionalDriverMethods[_i];
                        if (!driverObject[optionalDriverMethod]) {
                            driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
                        }
                    }
                };

                configureMissingMethods();

                var setDriverSupport = function setDriverSupport(support) {
                    if (DefinedDrivers[driverName]) {
                        console.info('Redefining LocalForage driver: ' + driverName);
                    }
                    DefinedDrivers[driverName] = driverObject;
                    DriverSupport[driverName] = support;
                    
                    
                    
                    resolve();
                };

                if ('_support' in driverObject) {
                    if (driverObject._support && typeof driverObject._support === 'function') {
                        driverObject._support().then(setDriverSupport, reject);
                    } else {
                        setDriverSupport(!!driverObject._support);
                    }
                } else {
                    setDriverSupport(true);
                }
            } catch (e) {
                reject(e);
            }
        });

        executeTwoCallbacks(promise, callback, errorCallback);
        return promise;
    };

    LocalForage.prototype.driver = function driver() {
        return this._driver || null;
    };

    LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
        var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error('Driver not found.'));

        executeTwoCallbacks(getDriverPromise, callback, errorCallback);
        return getDriverPromise;
    };

    LocalForage.prototype.getSerializer = function getSerializer(callback) {
        var serializerPromise = Promise$1.resolve(localforageSerializer);
        executeTwoCallbacks(serializerPromise, callback);
        return serializerPromise;
    };

    LocalForage.prototype.ready = function ready(callback) {
        var self = this;

        var promise = self._driverSet.then(function () {
            if (self._ready === null) {
                self._ready = self._initDriver();
            }

            return self._ready;
        });

        executeTwoCallbacks(promise, callback, callback);
        return promise;
    };

    LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
        var self = this;

        if (!isArray(drivers)) {
            drivers = [drivers];
        }

        var supportedDrivers = this._getSupportedDrivers(drivers);

        function setDriverToConfig() {
            self._config.driver = self.driver();
        }

        function extendSelfWithDriver(driver) {
            self._extend(driver);
            setDriverToConfig();

            self._ready = self._initStorage(self._config);
            return self._ready;
        }

        function initDriver(supportedDrivers) {
            return function () {
                var currentDriverIndex = 0;

                function driverPromiseLoop() {
                    while (currentDriverIndex < supportedDrivers.length) {
                        var driverName = supportedDrivers[currentDriverIndex];
                        currentDriverIndex++;

                        self._dbInfo = null;
                        self._ready = null;

                        return self.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                    }

                    setDriverToConfig();
                    var error = new Error('No available storage method found.');
                    self._driverSet = Promise$1.reject(error);
                    return self._driverSet;
                }

                return driverPromiseLoop();
            };
        }

        
        
        
        var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
            return Promise$1.resolve();
        }) : Promise$1.resolve();

        this._driverSet = oldDriverSetDone.then(function () {
            var driverName = supportedDrivers[0];
            self._dbInfo = null;
            self._ready = null;

            return self.getDriver(driverName).then(function (driver) {
                self._driver = driver._driver;
                setDriverToConfig();
                self._wrapLibraryMethodsWithReady();
                self._initDriver = initDriver(supportedDrivers);
            });
        })["catch"](function () {
            setDriverToConfig();
            var error = new Error('No available storage method found.');
            self._driverSet = Promise$1.reject(error);
            return self._driverSet;
        });

        executeTwoCallbacks(this._driverSet, callback, errorCallback);
        return this._driverSet;
    };

    LocalForage.prototype.supports = function supports(driverName) {
        return !!DriverSupport[driverName];
    };

    LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
        extend(this, libraryMethodsAndProperties);
    };

    LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
        var supportedDrivers = [];
        for (var i = 0, len = drivers.length; i < len; i++) {
            var driverName = drivers[i];
            if (this.supports(driverName)) {
                supportedDrivers.push(driverName);
            }
        }
        return supportedDrivers;
    };

    LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
        
        
        
        
        for (var i = 0, len = LibraryMethods.length; i < len; i++) {
            callWhenReady(this, LibraryMethods[i]);
        }
    };

    LocalForage.prototype.createInstance = function createInstance(options) {
        return new LocalForage(options);
    };

    return LocalForage;
}();





var localforage_js = new LocalForage();

module.exports = localforage_js;

},{"3":3}]},{},[4])(4)
});

}.call(this, __webpack_require__(39)))

 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.FETCH_ERROR = exports.TYPINGNOTIFICATION_CONSTANTS = exports.LOGIN_ERROR = exports.MESSAGE_ERRORS = exports.MESSAGES_REQUEST_ERRORS = exports.USERS_REQUEST_ERRORS = exports.GROUP_CREATION_ERRORS = exports.INIT_ERROR = exports.ERRORS = exports.SERVER_ERRORS = void 0;
exports.SERVER_ERRORS = {
    AUTH_ERR: {
        code: "AUTH_ERR_AUTH_TOKEN_NOT_FOUND",
        message: "The auth token %s% does not exist. Please make sure you are logged in and have a valid auth token or try login again."
    }
};
exports.ERRORS = {
    PARAMETER_MISSING: {
        code: "MISSING_PARAMETERS",
        name: "Invalid or no parameter passed to the method."
    }
};
exports.INIT_ERROR = {
    NO_APP_ID: {
        code: exports.ERRORS.PARAMETER_MISSING.code,
        name: exports.ERRORS.PARAMETER_MISSING.name,
        message: "AppID cannot be empty. Please specify a valid appID.",
        details: {}
    }
};
exports.GROUP_CREATION_ERRORS = {
    EMPTY_PASSWORD: {
        code: "ERR_EMPTY_GROUP_PASS",
        details: undefined,
        message: "Password is mandatory to join a group.",
        name: undefined
    }
};
exports.USERS_REQUEST_ERRORS = {
    EMPTY_USERS_LIST: {
        code: "EMPTY_USERS_LIST",
        name: "EMPTY_USERS_LIST",
        message: "The users list needs to have atleast one UID.",
        details: {}
    },
};
exports.MESSAGES_REQUEST_ERRORS = {
    REQUEST_IN_PROGRESS_ERROR: {
        code: "REQUEST_IN_PROGRESS",
        name: "REQUEST_IN_PROGRESS",
        message: "Request in progress.",
        details: {}
    },
    NOT_ENOUGH_PARAMS: {
        code: "NOT_ENOUGH_PARAMETERS",
        name: "NOT_ENOUGH_PARAMETERS",
        message: "`Timestamp`, `MessageId` or `updatedAfter` is required to use the 'fetchNext()' method.",
        details: {}
    }
};
exports.MESSAGE_ERRORS = {
    INVALID_CUSTOM_DATA: {
        code: "-1",
        name: "%s_CUSTOM_DATA",
        message: "",
        details: {}
    }
};
exports.LOGIN_ERROR = {
    NOT_INITIALIZED: {
        code: "-1",
        name: "COMETCHAT_INITIALIZATION_NOT_DONE",
        message: "please initialize the cometchat before using login method.",
        details: {}
    },
    UNAUTHORISED: {
        code: 401,
        name: "USER_NOT_AUTHORISED",
        message: "The `authToken` of the user is not authorised. Please verify again.",
        details: {}
    },
    WS_CONNECTION_FAIL: {
        code: -1,
        name: "WS_CONNECTION_FAIL",
        message: "WS Connection failed. %s",
        details: {}
    },
    WS_CONNECTION_FAIL_PORT_ERROR: {
        code: -1,
        name: "WS_CONNECTION_FAIL",
        message: "WS Connection failed. Trying to connect with port: %s",
        details: {}
    },
    WS_CONNECTION_FALLBACK_FAIL_PORT_ERROR: {
        code: -1,
        name: "WS_CONNECTION_FALLBACK_FAIL",
        message: "WS Connection fallback failed. Trying to connect with port: %s",
        details: {}
    },
    WS_AUTH_FAIL: {
        code: -1,
        name: "WS_AUTH_FAIL",
        message: "WS username/password not correct.",
        details: {}
    },
    NO_INTERNET: {
        code: -1,
        name: "NO_INTERNET_CONNECTION",
        message: "You do not have internet connection.",
        details: {}
    },
    REQUEST_IN_PROGRESS: {
        code: -1,
        name: "LOGIN_IN_PROGRESS",
        message: "Please wait until the previous login request ends.",
        details: {}
    }
};
exports.TYPINGNOTIFICATION_CONSTANTS = {
    TOO_MANY_REQUEST: {
        code: "TOO_MANY_REQUEST",
        name: "TOO MANY REQUEST",
        message: "too many request, wait for `%s` seconds before sending next request.",
        details: {}
    }
};
exports.FETCH_ERROR = {
    ERROR_IN_API_CALL: {
        code: "FAILED_TO_FETCH",
        name: 'FAILED_TO_FETCH',
        message: "There is an unknown issue with the API request. Please check your internet connection and verify the api call.",
        details: {}
    }
};


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.LocalStorage = void 0;
var Helper_1 = __webpack_require__(0);
var Constants_1 = __webpack_require__(1);
var localforage = __webpack_require__(12);
var CometChat_1 = __webpack_require__(3);
var CustomError_1 = __webpack_require__(2);

var LocalStorage =  (function () {
    function LocalStorage(store) {
        this.store = Constants_1.constants.DEFAULT_STORE;
        if (!Helper_1.isFalsy(store))
            this.store = store;
        this.localStore = localforage.createInstance({
            name: Helper_1.format(Constants_1.LOCAL_STORE.STORE_STRING, CometChat_1.CometChat.getAppId(), Constants_1.LOCAL_STORE.COMMON_STORE)
        });
        this.localStore.setDriver([localforage.LOCALSTORAGE, localforage.INDEXEDDB, localforage.WEBSQL]);
    }
    
    LocalStorage.getInstance = function () {
        if (LocalStorage.localStorage == null) {
            LocalStorage.localStorage = new LocalStorage();
        }
        return LocalStorage.localStorage;
    };
    
    LocalStorage.prototype.set = function (key, value) {
        return this.localStore.setItem(key, JSON.stringify(value));
    };
    
    LocalStorage.prototype.remove = function (key) {
        this.localStore.removeItem(key);
    };
    
    LocalStorage.prototype.update = function (key, value) {
        this.remove(key);
        this.set(key, value);
    };
    
    LocalStorage.prototype.get = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.localStore.getItem(key).then(function (appSettings) {
                    try {
                        resolve(JSON.parse(appSettings));
                    }
                    catch (e) {
                        resolve(appSettings);
                    }
                }, function (error) {
                    reject(error);
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    LocalStorage.prototype.clearStore = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.localStore.keys().then(function (keys) {
                    if (keys.length > 0) {
                        for (var i = 0; i < keys.length; i++) {
                            if (keys[i] !== "appId") {
                                _this.localStore.removeItem(keys[i]);
                            }
                            if (i === keys.length - 1) {
                                resolve(true);
                            }
                        }
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    };
    
    LocalStorage.prototype.clear = function (store) { };
    
    LocalStorage.prototype.selectStore = function (store) {
        this.store = store;
    };
    LocalStorage.localStorage = null;
    return LocalStorage;
}());
exports.LocalStorage = LocalStorage;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.GroupsController = void 0;
var Group_1 = __webpack_require__(8);
var Constants_1 = __webpack_require__(1);
var Helper_1 = __webpack_require__(0);
var GroupsController =  (function () {
    function GroupsController() {
    }
    
    GroupsController.trasformJSONGroup = function (group) {
        var groupObject;
        try {
            groupObject = new Group_1.Group(group[Constants_1.GroupConstants.KEYS.GUID], group[Constants_1.GroupConstants.KEYS.NAME], group[Constants_1.GroupConstants.KEYS.TYPE]);
            if (group.wsChannel)
                delete group.wsChannel;
            Object.assign(groupObject, group);
            group = groupObject;
        }
        catch (e) {
            Helper_1.Logger.error("GroupsController:transformJSONGroup", e);
        }
        return group;
    };
    return GroupsController;
}());
exports.GroupsController = GroupsController;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.TextMessage = void 0;

var BaseMessage_1 = __webpack_require__(7);
var Constants_1 = __webpack_require__(1);
var UserModel_1 = __webpack_require__(4);
var Group_1 = __webpack_require__(8);
var Helper_1 = __webpack_require__(0);
var TextMessage =  (function (_super) {
    __extends(TextMessage, _super);
    
    function TextMessage(receiverId, text, receiverType) {
        var _this = _super.call(this, receiverId, 'text', receiverType, Constants_1.MessageCategory.MESSAGE) || this;
        _this.type = 'text';
        _this.data = { text: text };
        _this.text = text;
        return _this;
    }
    
    TextMessage.prototype.getSender = function () {
        try {
            return this.getSenderFromData();
        }
        catch (e) {
            return this.sender;
        }
    };
    
    TextMessage.prototype.getReceiver = function () {
        try {
            return this.getReceiverFromData();
        }
        catch (e) {
            return this.receiver;
        }
    };
    
    TextMessage.prototype.getMetadata = function () {
        if (this.data.metadata) {
            this.metadata = this.data.metadata;
        }
        return this.metadata;
    };
    
    TextMessage.prototype.setMetadata = function (value) {
        this.metadata = value;
        this.data = __assign(__assign({}, this.data), { metadata: value });
    };
    
    TextMessage.prototype.getData = function () {
        return this.data;
    };
    
    TextMessage.prototype.setData = function (value) {
        this.data = value;
    };
    
    TextMessage.prototype.getText = function () {
        return this.text;
    };
    
    TextMessage.prototype.setText = function (text) {
        this.text = text;
        this.data.text = text;
    };
    
    TextMessage.prototype.setProcessedText = function (text) {
        this.processedText = text;
    };
    
    TextMessage.prototype.getProcessedText = function () {
        return this.processedText;
    };
    
    TextMessage.prototype.getTags = function () {
        return this.tags;
    };
    
    TextMessage.prototype.setTags = function (tags) {
        this.tags = tags;
    };
    TextMessage.prototype.getSenderFromData = function () {
        try {
            var data = this.getData();
            if (data[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITIES][Constants_1.MessageConstatnts.KEYS.SENDER][Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITITY]) {
                return new UserModel_1.User(data[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITIES][Constants_1.MessageConstatnts.KEYS.SENDER][Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITITY]);
            }
        }
        catch (err) {
            Helper_1.Logger.error("TextMessageModel: getSenderFromData", err);
        }
    };
    TextMessage.prototype.getReceiverFromData = function () {
        try {
            var data = this.getData();
            var entity = data[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITIES][Constants_1.MessageConstatnts.KEYS.RECEIVER][Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITITY];
            if (data[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITIES][Constants_1.MessageConstatnts.KEYS.RECEIVER][Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITYTYPE] == [Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITY_TYPE.USER]) {
                return new UserModel_1.User(entity);
            }
            else {
                var grp = new Group_1.Group(entity[Constants_1.GroupConstants.KEYS.GUID], entity[Constants_1.GroupConstants.KEYS.NAME], entity[Constants_1.MessageConstatnts.KEYS.TYPE]);
                var GroupObject = Object.assign(grp, entity);
                return GroupObject;
            }
        }
        catch (err) {
            Helper_1.Logger.error("TextMessageModel: getReceiverFromData", err);
        }
    };
     TextMessage.TYPE = Constants_1.MessageConstatnts.TYPE.TEXT;
     TextMessage.RECEIVER_TYPE = Constants_1.MessageConstatnts.RECEIVER_TYPE;
     TextMessage.CATEGORY = Constants_1.MessageConstatnts.CATEGORY.MESSAGE;
    return TextMessage;
}(BaseMessage_1.BaseMessage));
exports.TextMessage = TextMessage;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.MediaMessage = void 0;

var BaseMessage_1 = __webpack_require__(7);
var Constants_1 = __webpack_require__(1);
var UserModel_1 = __webpack_require__(4);
var attachment_1 = __webpack_require__(18);
var Group_1 = __webpack_require__(8);
var Helper_1 = __webpack_require__(0);
var MediaMessage =  (function (_super) {
    __extends(MediaMessage, _super);
    function MediaMessage(receiverId, file, type, receiverType) {
        var _this = _super.call(this, receiverId, type, receiverType, Constants_1.MessageCategory.MESSAGE) || this;
        _this.data = {};
        if (!(typeof (file) == "object")) {
            _this.data = { url: file };
        }
        else {
            if (file) {
                if (file["length"] > 0) {
                    _this.files = file;
                }
                else {
                    _this.files = [file];
                }
            }
        }
        return _this;
    }
    
    MediaMessage.prototype.setCaption = function (text) {
        this.caption = text;
        this.data[Constants_1.MessageConstatnts.KEYS.TEXT] = text;
    };
    
    MediaMessage.prototype.getCaption = function () {
        return this.data[Constants_1.MessageConstatnts.KEYS.TEXT];
    };
    
    MediaMessage.prototype.getSender = function () {
        try {
            return this.getSenderFromData();
        }
        catch (e) {
            return this.sender;
        }
    };
    
    MediaMessage.prototype.getReceiver = function () {
        try {
            return this.getReceiverFromData();
        }
        catch (e) {
            return this.receiver;
        }
    };
    
    MediaMessage.prototype.getMetadata = function () {
        if (this.data.metadata) {
            this.metadata = this.data.metadata;
        }
        return this.metadata;
    };
    
    MediaMessage.prototype.setMetadata = function (metadata) {
        this.metadata = metadata;
        this.data = __assign(__assign({}, this.data), { metadata: metadata });
    };
    
    MediaMessage.prototype.getData = function () {
        return this.data;
    };
    
    MediaMessage.prototype.setData = function (value) {
        this.data = value;
    };
    
    MediaMessage.prototype.getAttachment = function () {
        var attachment = new attachment_1.Attachment(this.data["attachments"][0]);
        return attachment;
    };
    
    MediaMessage.prototype.setAttachment = function (attachment) {
        this.data["attachments"] = [attachment_1.Attachment.toJSON(attachment)];
    };
    
    MediaMessage.prototype.getAttachments = function () {
        var attachments = [];
        if (this.data["attachments"] && this.data.attachments.length > 0) {
            for (var i = 0; i < this.data.attachments.length; i++) {
                attachments.push(new attachment_1.Attachment(this.data.attachments[i]));
            }
        }
        return attachments;
    };
    
    MediaMessage.prototype.setAttachments = function (attachments) {
        var attachmentsArray = [];
        if (attachments && attachments.length > 0) {
            for (var i = 0; i < attachments.length; i++) {
                attachmentsArray.push(attachment_1.Attachment.toJSON(attachments[i]));
            }
        }
        this.data["attachments"] = attachmentsArray;
    };
    
    MediaMessage.prototype.getURL = function () {
        try {
            var data = this.getData();
            if (data[Constants_1.MessageConstatnts.KEYS.URL]) {
                return data[Constants_1.MessageConstatnts.KEYS.URL];
            }
        }
        catch (err) {
            Helper_1.Logger.error("MediaMessageModel: getURL", err);
        }
    };
    
    MediaMessage.prototype.getTags = function () {
        return this.tags;
    };
    
    MediaMessage.prototype.setTags = function (tags) {
        this.tags = tags;
    };
    MediaMessage.prototype.getSenderFromData = function () {
        try {
            var data = this.getData();
            if (data[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITIES][Constants_1.MessageConstatnts.KEYS.SENDER][Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITITY]) {
                return new UserModel_1.User(data[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITIES][Constants_1.MessageConstatnts.KEYS.SENDER][Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITITY]);
            }
        }
        catch (err) {
            Helper_1.Logger.error("MediaMessageModel: getSenderFromData", err);
        }
    };
    MediaMessage.prototype.getReceiverFromData = function () {
        try {
            var data = this.getData();
            var entity = data[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITIES][Constants_1.MessageConstatnts.KEYS.RECEIVER][Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITITY];
            if (data[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITIES][Constants_1.MessageConstatnts.KEYS.RECEIVER][Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITYTYPE] == [Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITY_TYPE.USER]) {
                return new UserModel_1.User(entity);
            }
            else {
                var grp = new Group_1.Group(entity[Constants_1.GroupConstants.KEYS.GUID], entity[Constants_1.GroupConstants.KEYS.NAME], entity[Constants_1.MessageConstatnts.KEYS.TYPE]);
                var GroupObject = Object.assign(grp, entity);
                return GroupObject;
            }
        }
        catch (err) {
            Helper_1.Logger.error("MediaMessageModel: getReceiverFromData", err);
        }
    };
     MediaMessage.TYPE = Constants_1.MessageConstatnts.TYPE;
     MediaMessage.RECEIVER_TYPE = Constants_1.MessageConstatnts.RECEIVER_TYPE;
     MediaMessage.CATEGORY = Constants_1.MessageConstatnts.CATEGORY;
    return MediaMessage;
}(BaseMessage_1.BaseMessage));
exports.MediaMessage = MediaMessage;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.Attachment = void 0;

var Constants_1 = __webpack_require__(1);
var Attachment =  (function () {
    function Attachment(file) {
        if (file.hasOwnProperty(Constants_1.ATTACHMENTS_CONSTANTS.KEYS.EXTENSION))
            this.extension = file[Constants_1.ATTACHMENTS_CONSTANTS.KEYS.EXTENSION];
        if (file.hasOwnProperty(Constants_1.ATTACHMENTS_CONSTANTS.KEYS.MIME_TYPE))
            this.mimeType = file[Constants_1.ATTACHMENTS_CONSTANTS.KEYS.MIME_TYPE];
        if (file.hasOwnProperty(Constants_1.ATTACHMENTS_CONSTANTS.KEYS.NAME))
            this.name = file[Constants_1.ATTACHMENTS_CONSTANTS.KEYS.NAME];
        if (file.hasOwnProperty(Constants_1.ATTACHMENTS_CONSTANTS.KEYS.SIZE))
            this.size = file[Constants_1.ATTACHMENTS_CONSTANTS.KEYS.SIZE];
        if (file.hasOwnProperty(Constants_1.ATTACHMENTS_CONSTANTS.KEYS.URL))
            this.url = file[Constants_1.ATTACHMENTS_CONSTANTS.KEYS.URL];
    }
    
    Attachment.prototype.createFileFromJSON = function (file) {
        return new Attachment(file);
    };
    
    Attachment.toJSON = function (attachment) {
        var jsonAttachment = {
            extension: attachment.getExtension(),
            mimeType: attachment.getMimeType(),
            name: attachment.getName(),
            url: attachment.getUrl(),
            size: attachment.getSize()
        };
        return jsonAttachment;
    };
    
    Attachment.prototype.getExtension = function () {
        return this.extension;
    };
    
    Attachment.prototype.setExtension = function (extension) {
        this.extension = extension;
    };
    
    Attachment.prototype.getMimeType = function () {
        return this.mimeType;
    };
    
    Attachment.prototype.setMimeType = function (mimeType) {
        this.mimeType = mimeType;
    };
    
    Attachment.prototype.getName = function () {
        return this.name;
    };
    
    Attachment.prototype.setName = function (name) {
        this.name = name;
    };
    
    Attachment.prototype.getSize = function () {
        return this.size;
    };
    
    Attachment.prototype.setSize = function (size) {
        this.size = size;
    };
    
    Attachment.prototype.getUrl = function () {
        return this.url;
    };
    
    Attachment.prototype.setUrl = function (url) {
        this.url = url;
    };
    return Attachment;
}());
exports.Attachment = Attachment;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.CustomMessage = void 0;

var BaseMessage_1 = __webpack_require__(7);
var Constants_1 = __webpack_require__(1);
var UserModel_1 = __webpack_require__(4);
var Helper_1 = __webpack_require__(0);
var Group_1 = __webpack_require__(8);
var CustomMessage =  (function (_super) {
    __extends(CustomMessage, _super);
    function CustomMessage() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = this;
        if (args.length == 3) {
            var receiverId = args[0], receiverType = args[1], customData = args[2];
            _this = _super.call(this, receiverId, Constants_1.MessageConstatnts.TYPE.CUSTOM, receiverType, Constants_1.MessageCategory.MESSAGE) || this;
            if (typeof customData != "object" || Array.isArray(customData)) {
                customData = {};
            }
            _this.customData = customData;
            if (Helper_1.isFalsy(_this.data))
                _this.data = {};
            _this.data[Constants_1.MessageConstatnts.KEYS.CUSTOM_DATA] = customData;
        }
        if (args.length == 4) {
            var receiverId = args[0], receiverType = args[1], type = args[2], customData = args[3];
            _this = _super.call(this, receiverId, type, receiverType, Constants_1.MessageCategory.CUSTOM) || this;
            if (typeof customData != "object" || Array.isArray(customData)) {
                customData = {};
            }
            _this.customData = customData;
            if (Helper_1.isFalsy(_this.data))
                _this.data = {};
            _this.data[Constants_1.MessageConstatnts.KEYS.CUSTOM_DATA] = customData;
        }
        return _this;
    }
    
    CustomMessage.prototype.getCustomData = function () {
        return this.customData;
    };
    
    CustomMessage.prototype.setCustomData = function (customData) {
        this.customData = customData;
        this.data[Constants_1.MessageConstatnts.KEYS.CUSTOM_DATA] = customData;
    };
    
    CustomMessage.prototype.getSender = function () {
        try {
            return this.getSenderFromData();
        }
        catch (e) {
            return this.sender;
        }
    };
    
    CustomMessage.prototype.getReceiver = function () {
        try {
            return this.getReceiverFromData();
        }
        catch (e) {
            return this.receiver;
        }
    };
    
    CustomMessage.prototype.getSubType = function () {
        return this.subType;
    };
    
    CustomMessage.prototype.setSubType = function (subType) {
        this.subType = subType;
        this.data = __assign(__assign({}, this.data), { subType: subType });
    };
    
    CustomMessage.prototype.getMetadata = function () {
        return this.metadata;
    };
    
    CustomMessage.prototype.setMetadata = function (metadata) {
        this.metadata = metadata;
        this.data = __assign(__assign({}, this.data), { metadata: metadata });
    };
    
    CustomMessage.prototype.getData = function () {
        return this.data;
    };
    
    CustomMessage.prototype.getTags = function () {
        return this.tags;
    };
    
    CustomMessage.prototype.setTags = function (tags) {
        this.tags = tags;
    };
    CustomMessage.prototype.getSenderFromData = function () {
        try {
            var data = this.getData();
            if (data[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITIES][Constants_1.MessageConstatnts.KEYS.SENDER][Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITITY]) {
                return new UserModel_1.User(data[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITIES][Constants_1.MessageConstatnts.KEYS.SENDER][Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITITY]);
            }
        }
        catch (err) {
            Helper_1.Logger.error("CustomMessageModel: getSenderFromData", err);
        }
    };
    CustomMessage.prototype.getReceiverFromData = function () {
        try {
            var data = this.getData();
            var entity = data[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITIES][Constants_1.MessageConstatnts.KEYS.RECEIVER][Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITITY];
            if (data[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITIES][Constants_1.MessageConstatnts.KEYS.RECEIVER][Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITYTYPE] == [Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITY_TYPE.USER]) {
                return new UserModel_1.User(entity);
            }
            else {
                var grp = new Group_1.Group(entity[Constants_1.GroupConstants.KEYS.GUID], entity[Constants_1.GroupConstants.KEYS.NAME], entity[Constants_1.MessageConstatnts.KEYS.TYPE]);
                var GroupObject = Object.assign(grp, entity);
                return GroupObject;
            }
        }
        catch (err) {
            Helper_1.Logger.error("CustomMessageModel: getReceiverFromData", err);
        }
    };
    return CustomMessage;
}(BaseMessage_1.BaseMessage));
exports.CustomMessage = CustomMessage;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Action = void 0;

var BaseMessage_1 = __webpack_require__(7);
var Group_1 = __webpack_require__(8);
var UserModel_1 = __webpack_require__(4);
var Constants_1 = __webpack_require__(1);
var Helper_1 = __webpack_require__(0);
var MessageController_1 = __webpack_require__(10);
var Action =  (function (_super) {
    __extends(Action, _super);
    function Action() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    
    Action.actionFromJSON = function (rawMessage) {
        var action = new this(rawMessage[Constants_1.MessageConstatnts.KEYS.RECEIVER], rawMessage[Constants_1.MessageConstatnts.KEYS.TYPE], rawMessage[Constants_1.MessageConstatnts.KEYS.RECEIVER_TYPE], Constants_1.MessageCategory.ACTION);
        var data = rawMessage[Constants_1.MessageConstatnts.KEYS.DATA];
        action.data = data;
        action.setAction(data[Constants_1.MessageConstatnts.KEYS.ACTION]);
        if (data[Constants_1.ActionConstatnts.ACTION_KEYS.EXTRAS]) {
            var extras = data[Constants_1.ActionConstatnts.ACTION_KEYS.EXTRAS];
            if (extras[Constants_1.ActionConstatnts.ACTION_KEYS.SCOPE]) {
                var scope = extras[Constants_1.ActionConstatnts.ACTION_KEYS.SCOPE];
                if (scope[Constants_1.ActionConstatnts.ACTION_KEYS.NEW] && scope[Constants_1.ActionConstatnts.ACTION_KEYS.OLD]) {
                    action.setOldScope(scope[Constants_1.ActionConstatnts.ACTION_KEYS.OLD]);
                    action.setNewScope(scope[Constants_1.ActionConstatnts.ACTION_KEYS.NEW]);
                }
            }
        }
        if (data[Constants_1.MessageConstatnts.KEYS.METADATA])
            action.setMetadata(data[Constants_1.MessageConstatnts.KEYS.METADATA]);
        var entities = data[Constants_1.ActionConstatnts.ACTION_KEYS.ENTITIES];
        if (entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_BY])
            if (entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_BY][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY_TYPE] == Constants_1.ActionConstatnts.ACTION_ENTITY_TYPE.USER) {
                var appUser = new UserModel_1.User(entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_BY][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY]);
                Object.assign(appUser, entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_BY][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY]);
                action.actionBy = appUser;
                action.setSender(appUser);
            }
            else {
                var group = new Group_1.Group("", "", "");
                Object.assign(group, entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_BY][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY]);
                action.actionBy = group;
            }
        if (entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_FOR])
            if (entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_FOR][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY_TYPE] == Constants_1.ActionConstatnts.ACTION_ENTITY_TYPE.USER) {
                var appUser = new UserModel_1.User(entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_FOR][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY]);
                Object.assign(appUser, entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_FOR][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY]);
                action.actionFor = appUser;
            }
            else {
                var group = new Group_1.Group("", "", "");
                Object.assign(group, entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_FOR][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY]);
                action.actionFor = group;
            }
        if (entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_ON])
            if (entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_ON][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY_TYPE] == Constants_1.ActionConstatnts.ACTION_ENTITY_TYPE.USER) {
                var appUser = new UserModel_1.User(entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_ON][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY]);
                Object.assign(appUser, entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_ON][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY]);
                action.actionOn = appUser;
            }
            else if (entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_ON][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY_TYPE] == Constants_1.ActionConstatnts.ACTION_ENTITY_TYPE.GROUP) {
                var group = new Group_1.Group("", "", "");
                Object.assign(group, entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_ON][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY]);
                action.actionOn = group;
            }
            else if (entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_ON][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY_TYPE] == Constants_1.ActionConstatnts.ACTION_ENTITY_TYPE.MESSAGE) {
                var message = MessageController_1.MessageController.trasformJSONMessge(entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_ON][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY]);
                action.actionOn = message;
            }
        action.setMessage(action.getActionMessage(action));
        return action;
    };
    
    Action.prototype.getOldScope = function () {
        return this.oldScope;
    };
    
    Action.prototype.setOldScope = function (oldScope) {
        this.oldScope = oldScope;
    };
    
    Action.prototype.getNewScope = function () {
        return this.newScope;
    };
    
    Action.prototype.setNewScope = function (newScope) {
        this.newScope = newScope;
    };
    
    Action.prototype.getRawData = function () {
        return this.rawData;
    };
    
    Action.prototype.setRawData = function (rawData) {
        this.rawData = rawData;
    };
    
    Action.prototype.getMessage = function () {
        return this.message;
    };
    
    Action.prototype.setMessage = function (message) {
        this.message = message;
    };
    
    Action.prototype.getAction = function () {
        return this.action;
    };
    
    Action.prototype.setAction = function (action) {
        this.action = action;
    };
    
    Action.prototype.getSender = function () {
        try {
            return this.getSenderFromData();
        }
        catch (e) {
            return this.sender;
        }
    };
    
    Action.prototype.getActionBy = function () {
        return this.actionBy;
    };
    
    Action.prototype.setActionBy = function (by) {
        this.actionBy = by;
    };
    
    Action.prototype.getActionOn = function () {
        return this.actionOn;
    };
    
    Action.prototype.setActionOn = function (on) {
        this.actionOn = on;
    };
    
    Action.prototype.getActionFor = function () {
        return this.actionFor;
    };
    
    Action.prototype.setActionFor = function (actionFor) {
        this.actionFor = actionFor;
    };
    
    Action.prototype.getMetadata = function () {
        if (this.data.metadata) {
            this.metadata = this.data.metadata;
        }
        return this.metadata;
    };
    
    Action.prototype.setMetadata = function (metadata) {
        this.metadata = metadata;
        this.data = __assign(__assign({}, this.data), { metadata: metadata });
    };
    
    Action.prototype.getActionMessage = function (action) {
        var message = "";
        switch (action.getType()) {
            case Constants_1.ActionConstatnts.ACTION_KEYS.ACTION_TYPE_USER:
                switch (action.getAction()) {
                    case Constants_1.ActionConstatnts.ACTION_KEYS.ACTION_CREATED:
                        break;
                    case Constants_1.ActionConstatnts.ACTION_KEYS.ACTION_UPDATED:
                        break;
                    case Constants_1.ActionConstatnts.ACTION_KEYS.ACTION_DELETED:
                        break;
                }
                break;
            case Constants_1.ActionConstatnts.ACTION_KEYS.ACTION_TYPE_GROUP:
                switch (action.getAction()) {
                    case Constants_1.ActionConstatnts.ACTION_KEYS.ACTION_CREATED:
                        break;
                    case Constants_1.ActionConstatnts.ACTION_KEYS.ACTION_UPDATED:
                        break;
                    case Constants_1.ActionConstatnts.ACTION_KEYS.ACTION_DELETED:
                        break;
                }
                break;
            case Constants_1.ActionConstatnts.ACTION_KEYS.ACTION_TYPE_GROUP_MEMBER:
                switch (action.getAction()) {
                    case Constants_1.ActionConstatnts.ACTION_KEYS.TYPE_MEMBER_JOINED: {
                        var actionBy = action.getActionBy();
                        message = Helper_1.format(Constants_1.ActionConstatnts.ActionMessages.ACTION_GROUP_JOINED_MESSAGE, actionBy.getName());
                        break;
                    }
                    case Constants_1.ActionConstatnts.ACTION_KEYS.TYPE_MEMBER_LEFT: {
                        var actionBy = action.getActionBy();
                        message = Helper_1.format(Constants_1.ActionConstatnts.ActionMessages.ACTION_GROUP_LEFT_MESSAGE, actionBy.getName());
                        break;
                    }
                    case Constants_1.ActionConstatnts.ACTION_KEYS.TYPE_MEMBER_KICKED: {
                        var actionBy = action.getActionBy();
                        var actionOn = action.getActionOn();
                        message = Helper_1.format(Constants_1.ActionConstatnts.ActionMessages.ACTION_MEMBER_KICKED_MESSAGE, actionBy.getName(), actionOn.getName());
                        break;
                    }
                    case Constants_1.ActionConstatnts.ACTION_KEYS.TYPE_MEMBER_BANNED: {
                        var actionBy = action.getActionBy();
                        var actionOn = action.getActionOn();
                        message = Helper_1.format(Constants_1.ActionConstatnts.ActionMessages.ACTION_MEMBER_BANNED_MESSAGE, actionBy.getName(), actionOn.getName());
                        break;
                    }
                    case Constants_1.ActionConstatnts.ACTION_KEYS.TYPE_MEMBER_UNBANNED: {
                        var actionBy = action.getActionBy();
                        var actionOn = action.getActionOn();
                        message = Helper_1.format(Constants_1.ActionConstatnts.ActionMessages.ACTION_MEMBER_UNBANNED_MESSAGE, actionBy.getName(), actionOn.getName());
                        break;
                    }
                    case Constants_1.ActionConstatnts.ACTION_KEYS.ACTION_SCOPE_CHANGED: {
                        var actionBy = action.getActionBy();
                        var actionOn = action.getActionOn();
                        var newScope = action.getNewScope();
                        message = Helper_1.format(Constants_1.ActionConstatnts.ActionMessages.ACTION_MEMBER_SCOPE_CHANGED, actionBy.getName(), actionOn.getName(), newScope);
                        break;
                    }
                    case Constants_1.ActionConstatnts.ACTION_KEYS.TYPE_MEMBER_ADDED: {
                        var actionBy = action.getActionBy();
                        var actionOn = action.getActionOn();
                        message = Helper_1.format(Constants_1.ActionConstatnts.ActionMessages.ACTION_MEMBER_ADDED_TO_GROUP, actionBy.getName(), actionOn.getName());
                        break;
                    }
                    case Constants_1.ActionConstatnts.ACTION_KEYS.TYPE_MESSAGE_EDITED: {
                        message = Helper_1.format(Constants_1.ActionConstatnts.ActionMessages.ACTION_MESSAGE_EDITED_MESSAGE, "");
                        break;
                    }
                    case Constants_1.ActionConstatnts.ACTION_KEYS.TYPE_MESSAGE_DELETED: {
                        message = Helper_1.format(Constants_1.ActionConstatnts.ActionMessages.ACTION_MESSAGE_DELETED_MESSAGE, "");
                        break;
                    }
                    default:
                        break;
                }
                break;
        }
        return message;
    };
    Action.prototype.getSenderFromData = function () {
        var data = this.data[Constants_1.ActionConstatnts.ACTION_KEYS.ENTITIES];
        if (data[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_BY]) {
            if (data[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_BY][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY_TYPE] == Constants_1.ActionConstatnts.ACTION_ENTITY_TYPE.USER) {
                var appUser = new UserModel_1.User(data[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_BY][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY]);
                Object.assign(appUser, data[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_BY][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITY]);
                return appUser;
            }
        }
    };
    Action.TYPE = Constants_1.MessageConstatnts.TYPE;
    Action.RECEIVER_TYPE = Constants_1.MessageConstatnts.RECEIVER_TYPE;
    Action.CATEGORY = Constants_1.MessageConstatnts.CATEGORY;
    Action.ACTION_TYPE = Constants_1.ActionConstatnts.ACTION_TYPE;
    return Action;
}(BaseMessage_1.BaseMessage));
exports.Action = Action;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.Call = void 0;

var BaseMessage_1 = __webpack_require__(7);
var Group_1 = __webpack_require__(8);
var Constants_1 = __webpack_require__(1);
var Helper_1 = __webpack_require__(0);
var UserModel_1 = __webpack_require__(4);
var Call =  (function (_super) {
    __extends(Call, _super);
    
    function Call(receiverId, type, receiverType, category) {
        var _this = this;
        if (Helper_1.isFalsy(category)) {
            _this = _super.call(this, receiverId, type, receiverType, Constants_1.MessageCategory.CALL) || this;
        }
        else {
            _this = _super.call(this, receiverId, type, receiverType, category) || this;
        }
        return _this;
    }
    
    Call.prototype.getCallInitiator = function () {
        return this.getCallInitiatedByFromData();
    };
    
    Call.prototype.setCallInitiator = function (user) {
        this.callInitiator = user;
    };
    
    Call.prototype.getCallReceiver = function () {
        return this.getCallReceivedByFromData();
    };
    
    Call.prototype.setCallReceiver = function (receiver) {
        this.callReceiver = receiver;
    };
    
    Call.prototype.getData = function () {
        return this.data;
    };
    
    Call.prototype.setData = function (data) {
        this.data = data;
    };
    
    Call.prototype.getSessionId = function () {
        return this.sessionId;
    };
    
    Call.prototype.setSessionId = function (sessionId) {
        this.sessionId = sessionId;
    };
    
    Call.prototype.getMetadata = function () {
        if (this.data.metadata) {
            this.metadata = this.data.metadata;
        }
        return this.metadata;
    };
    
    Call.prototype.setMetadata = function (metadata) {
        this.metadata = metadata;
        this.data = __assign(__assign({}, this.data), { metadata: metadata });
    };
    
    Call.prototype.getSender = function () {
        try {
            return this.getSenderFromData();
        }
        catch (e) {
            return this.sender;
        }
    };
    
    Call.prototype.getAction = function () {
        return this.action;
    };
    
    Call.prototype.setAction = function (action) {
        this.action = action;
    };
    
    Call.prototype.getInitiatedAt = function () {
        return this.initiatedAt;
    };
    
    Call.prototype.setInitiatedAt = function (initiatedAt) {
        this.initiatedAt = initiatedAt;
    };
    
    Call.prototype.getJoinedAt = function () {
        return this.joinedAt;
    };
    
    Call.prototype.setJoinedAt = function (joinedAt) {
        this.joinedAt = joinedAt;
    };
    
    Call.prototype.getRawData = function () {
        return this.rawData;
    };
    
    Call.prototype.setRawData = function (rawData) {
        this.rawData = rawData;
    };
    
    Call.callFromJSON = function (rawMessage) {
        try {
            var call = new this(rawMessage[Constants_1.MessageConstatnts.KEYS.RECEIVER], rawMessage[Constants_1.MessageConstatnts.KEYS.TYPE], rawMessage[Constants_1.MessageConstatnts.KEYS.RECEIVER_TYPE], Constants_1.MessageCategory.CALL);
            var data = rawMessage[Constants_1.MessageConstatnts.KEYS.DATA];
            call.setAction(data[Constants_1.MessageConstatnts.KEYS.ACTION]);
            if (data[Constants_1.MessageConstatnts.KEYS.METADATA])
                call.setMetadata(data[Constants_1.MessageConstatnts.KEYS.METADATA]);
            var entities = data[Constants_1.ActionConstatnts.ACTION_KEYS.ENTITIES];
            if (entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_BY]) {
                var byObject = entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_BY];
            }
            if (entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_ON]) {
                var onObject = entities[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_ON];
                if (onObject[Constants_1.CallConstants.CALL_KEYS.CALL_ENTITY]) {
                    var entityObject = onObject[Constants_1.CallConstants.CALL_KEYS.CALL_ENTITY];
                    if (entityObject[Constants_1.CallConstants.CALL_KEYS.CALL_SESSION_ID]) {
                        call.sessionId = entityObject[Constants_1.CallConstants.CALL_KEYS.CALL_SESSION_ID];
                    }
                    if (entityObject[Constants_1.CallConstants.CALL_KEYS.CALL_STATUS]) {
                        call.status = entityObject[Constants_1.CallConstants.CALL_KEYS.CALL_STATUS];
                    }
                    if (entityObject[Constants_1.CallConstants.CALL_KEYS.CALL_DATA]) {
                        var entityDataObject = entityObject[Constants_1.CallConstants.CALL_KEYS.CALL_DATA];
                        if (entityDataObject[Constants_1.CallConstants.CALL_KEYS.CALL_METADATA]) {
                            call.metadata = entityDataObject[Constants_1.CallConstants.CALL_KEYS.CALL_METADATA];
                        }
                        if (entityDataObject[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITIES]) {
                            var entitiesObject = entityDataObject[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_ENTITIES];
                        }
                    }
                    if (entityObject[Constants_1.CallConstants.CALL_KEYS.CALL_INITIATED_AT])
                        call.initiatedAt = entityObject[Constants_1.CallConstants.CALL_KEYS.CALL_INITIATED_AT];
                    if (entityObject[Constants_1.CallConstants.CALL_KEYS.CALL_JOINED_AT])
                        call.joinedAt = entityObject[Constants_1.CallConstants.CALL_KEYS.CALL_JOINED_AT];
                    if (entityObject[Constants_1.CallConstants.CALL_KEYS.CALL_LEFT_AT])
                        call.joinedAt = entityObject[Constants_1.CallConstants.CALL_KEYS.CALL_LEFT_AT];
                }
            }
            return call;
        }
        catch (err) {
            Helper_1.Logger.error("CallModel: callFromJSON", err);
        }
    };
    Call.prototype.getSenderFromData = function () {
        try {
            var data = this.getData();
            data = data[Constants_1.ActionConstatnts.ACTION_KEYS.ENTITIES];
            if (data[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_BY][Constants_1.CallConstants.CALL_KEYS.CALL_ENTITY]) {
                return new UserModel_1.User(data[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_BY][Constants_1.CallConstants.CALL_KEYS.CALL_ENTITY]);
            }
        }
        catch (err) {
            Helper_1.Logger.error("CallModel:getSenderFromData", err);
        }
    };
    Call.prototype.getCallInitiatedByFromData = function () {
        try {
            var data = this.getData();
            data = data[Constants_1.ActionConstatnts.ACTION_KEYS.ENTITIES];
            if (data[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_ON][Constants_1.CallConstants.CALL_KEYS.CALL_ENTITY][Constants_1.CallConstants.CALL_KEYS.CALL_DATA][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITIES][Constants_1.CallConstants.CALL_KEYS.CALL_SENDER]) {
                return new UserModel_1.User(data[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_ON][Constants_1.CallConstants.CALL_KEYS.CALL_ENTITY][Constants_1.CallConstants.CALL_KEYS.CALL_DATA][Constants_1.ActionConstatnts.ACTION_KEYS.ENTITIES][Constants_1.CallConstants.CALL_KEYS.CALL_SENDER][Constants_1.CallConstants.CALL_KEYS.CALL_ENTITY]);
            }
        }
        catch (err) {
            Helper_1.Logger.error("CallModel:getCallInitiatedByFromData", err);
        }
    };
    Call.prototype.getCallReceivedByFromData = function () {
        try {
            var data = this.getData();
            data = data[Constants_1.ActionConstatnts.ACTION_KEYS.ENTITIES];
            if (data[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_FOR][Constants_1.CallConstants.CALL_KEYS.CALL_ENTITY]) {
                if (data[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_FOR][Constants_1.CallConstants.CALL_KEYS.CALL_ENTITY_TYPE] == Constants_1.CallConstants.CALL_KEYS.CALL_ENTITY_USER) {
                    return new UserModel_1.User(data[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_FOR][Constants_1.CallConstants.CALL_KEYS.CALL_ENTITY]);
                }
                else {
                    var grp = new Group_1.Group(data[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_FOR][Constants_1.CallConstants.CALL_KEYS.CALL_ENTITY][Constants_1.GroupConstants.KEYS.GUID], data[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_FOR][Constants_1.CallConstants.CALL_KEYS.CALL_ENTITY][Constants_1.GroupConstants.KEYS.NAME], data[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_FOR][Constants_1.CallConstants.CALL_KEYS.CALL_ENTITY][Constants_1.GroupConstants.KEYS.TYPE]);
                    return Object.assign(grp, data[Constants_1.ActionConstatnts.ACTION_SUBJECTS.ACTION_FOR][Constants_1.CallConstants.CALL_KEYS.CALL_ENTITY]);
                }
            }
        }
        catch (err) {
            Helper_1.Logger.error("CallModel:getCallReceivedByFromData", err);
        }
    };
    Call.TYPE = Constants_1.MessageConstatnts.TYPE;
    Call.RECEIVER_TYPE = Constants_1.MessageConstatnts.RECEIVER_TYPE;
    Call.CATEGORY = Constants_1.MessageConstatnts.CATEGORY;
    Call.ACTION_TYPE = Constants_1.ActionConstatnts.ACTION_TYPE;
    return Call;
}(BaseMessage_1.BaseMessage));
exports.Call = Call;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.MessageReceipt = void 0;
var MessageReceipt =  (function () {
    function MessageReceipt() {
        this.RECEIPT_TYPE = {
            READ_RECEIPT: "read",
            DELIVERY_RECEIPT: "delivery"
        };
        this.receiptType = this.RECEIPT_TYPE.DELIVERY_RECEIPT;
    }
    
    MessageReceipt.prototype.getReceiverType = function () {
        return this.receiverType;
    };
    
    MessageReceipt.prototype.setReceiverType = function (receiverType) {
        this.receiverType = receiverType;
    };
    
    MessageReceipt.prototype.getSender = function () {
        return this.sender;
    };
    
    MessageReceipt.prototype.setSender = function (sender) {
        this.sender = sender;
    };
    
    MessageReceipt.prototype.getReceiver = function () {
        return this.receiver;
    };
    
    MessageReceipt.prototype.setReceiver = function (receiver) {
        this.receiver = receiver;
    };
    
    MessageReceipt.prototype.getTimestamp = function () {
        return this.timestamp;
    };
    
    MessageReceipt.prototype.setTimestamp = function (timestamp) {
        this.timestamp = timestamp;
    };
    
    MessageReceipt.prototype.setReadAt = function (readAt) {
        this.readAt = readAt;
    };
    
    MessageReceipt.prototype.getReadAt = function () {
        return this.readAt;
    };
    
    MessageReceipt.prototype.setDeliveredAt = function (deliveredAt) {
        this.deliveredAt = deliveredAt;
    };
    
    MessageReceipt.prototype.getDeliveredAt = function () {
        return this.deliveredAt;
    };
    
    MessageReceipt.prototype.getMessageId = function () {
        return this.messageId;
    };
    
    MessageReceipt.prototype.setMessageId = function (messageId) {
        this.messageId = messageId;
    };
    
    MessageReceipt.prototype.getReceiptType = function () {
        return this.receiptType;
    };
    
    MessageReceipt.prototype.setReceiptType = function (receiptType) {
        if (receiptType === void 0) { receiptType = this.RECEIPT_TYPE.DELIVERY_RECEIPT; }
        this.receiptType = receiptType;
    };
    return MessageReceipt;
}());
exports.MessageReceipt = MessageReceipt;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.WSConnectionListener = exports.UserLoginListener = exports.CallsListener = exports.UserCallListener = exports.GroupsListener = exports.UsersListener = exports.MessagesListener = exports.Listener = exports.ConnectionListener = exports.LoginListener = exports.OngoingCallListener = exports.GroupListener = exports.UserListener = exports.CallListener = exports.MessageListener = void 0;

var Helper_1 = __webpack_require__(0);
var MessageListener =  (function () {
    function MessageListener() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        
        this.onTextMessageReceived = undefined;
        
        this.onMediaMessageReceived = undefined;
        
        this.onCustomMessageReceived = undefined;
        
        this.onTypingStarted = undefined;
        
        this.onTypingEnded = undefined;
        
        this.onMessagesDelivered = undefined;
        
        this.onMessagesRead = undefined;
        
        this.onMessageEdited = undefined;
        
        this.onMessageDeleted = undefined;
        
        this.onTransientMessageReceived = undefined;
        if (!Helper_1.isFalsy(args[0]["onTextMessageReceived"]))
            this.onTextMessageReceived = args[0]["onTextMessageReceived"];
        if (!Helper_1.isFalsy(args[0]["onMediaMessageReceived"]))
            this.onMediaMessageReceived = args[0]["onMediaMessageReceived"];
        if (!Helper_1.isFalsy(args[0]["onTypingStarted"]))
            this.onTypingStarted = args[0]["onTypingStarted"];
        if (!Helper_1.isFalsy(args[0]["onTypingEnded"]))
            this.onTypingEnded = args[0]["onTypingEnded"];
        if (!Helper_1.isFalsy(args[0]["onMessagesDelivered"]))
            this.onMessagesDelivered = args[0]["onMessagesDelivered"];
        if (!Helper_1.isFalsy(args[0]["onMessagesRead"]))
            this.onMessagesRead = args[0]["onMessagesRead"];
        if (!Helper_1.isFalsy(args[0]["onCustomMessageReceived"]))
            this.onCustomMessageReceived = args[0]["onCustomMessageReceived"];
        if (!Helper_1.isFalsy(args[0]["onMessageEdited"]))
            this.onMessageEdited = args[0]["onMessageEdited"];
        if (!Helper_1.isFalsy(args[0]["onMessageDeleted"]))
            this.onMessageDeleted = args[0]["onMessageDeleted"];
        if (!Helper_1.isFalsy(args[0]["onTransientMessageReceived"]))
            this.onTransientMessageReceived = args[0]["onTransientMessageReceived"];
    }
    return MessageListener;
}());
exports.MessageListener = MessageListener;
var CallListener =  (function () {
    function CallListener() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        
        this.onIncomingCallReceived = undefined;
        
        this.onOutgoingCallAccepted = undefined;
        
        this.onOutgoingCallRejected = undefined;
        
        this.onIncomingCallCancelled = undefined;
        
        this.onCallEndedMessageReceived = undefined;
        if (!Helper_1.isFalsy(args[0]["onIncomingCallReceived"]))
            this.onIncomingCallReceived = args[0]["onIncomingCallReceived"];
        if (!Helper_1.isFalsy(args[0]["onOutgoingCallAccepted"]))
            this.onOutgoingCallAccepted = args[0]["onOutgoingCallAccepted"];
        if (!Helper_1.isFalsy(args[0]["onOutgoingCallRejected"]))
            this.onOutgoingCallRejected = args[0]["onOutgoingCallRejected"];
        if (!Helper_1.isFalsy(args[0]["onIncomingCallCancelled"]))
            this.onIncomingCallCancelled = args[0]["onIncomingCallCancelled"];
        if (!Helper_1.isFalsy(args[0]["onCallEndedMessageReceived"]))
            this.onCallEndedMessageReceived = args[0]["onCallEndedMessageReceived"];
    }
    return CallListener;
}());
exports.CallListener = CallListener;
var UserListener =  (function () {
    function UserListener() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!Helper_1.isFalsy(args[0]["onUserOnline"]))
            this.onUserOnline = args[0]["onUserOnline"];
        if (!Helper_1.isFalsy(args[0]["onUserOffline"]))
            this.onUserOffline = args[0]["onUserOffline"];
    }
    return UserListener;
}());
exports.UserListener = UserListener;
var GroupListener =  (function () {
    function GroupListener() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!Helper_1.isFalsy(args[0]["onGroupMemberJoined"]))
            this.onGroupMemberJoined = args[0]["onGroupMemberJoined"];
        if (!Helper_1.isFalsy(args[0]["onGroupMemberLeft"]))
            this.onGroupMemberLeft = args[0]["onGroupMemberLeft"];
        if (!Helper_1.isFalsy(args[0]["onGroupMemberKicked"]))
            this.onGroupMemberKicked = args[0]["onGroupMemberKicked"];
        if (!Helper_1.isFalsy(args[0]["onGroupMemberBanned"]))
            this.onGroupMemberBanned = args[0]["onGroupMemberBanned"];
        if (!Helper_1.isFalsy(args[0]["onGroupMemberUnbanned"]))
            this.onGroupMemberUnbanned = args[0]["onGroupMemberUnbanned"];
        if (!Helper_1.isFalsy(args[0]["onGroupMemberScopeChanged"]))
            this.onGroupMemberScopeChanged = args[0]["onGroupMemberScopeChanged"];
        if (!Helper_1.isFalsy(args[0]["onMemberAddedToGroup"]))
            this.onGroupMemberAddedToGroup = args[0]["onMemberAddedToGroup"];
    }
    return GroupListener;
}());
exports.GroupListener = GroupListener;
var OngoingCallListener =  (function () {
    function OngoingCallListener() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!Helper_1.isFalsy(args[0]["onYouLeft"]))
            this.onYouLeft = args[0]["onYouLeft"];
        if (!Helper_1.isFalsy(args[0]["onYouJoined"]))
            this.onYouJoined = args[0]["onYouJoined"];
        if (!Helper_1.isFalsy(args[0]["onUserJoined"]))
            this.onUserJoined = args[0]["onUserJoined"];
        if (!Helper_1.isFalsy(args[0]["onUserLeft"]))
            this.onUserLeft = args[0]["onUserLeft"];
        if (!Helper_1.isFalsy(args[0]["onUserListUpdated"]))
            this.onUserListUpdated = args[0]["onUserListUpdated"];
        if (!Helper_1.isFalsy(args[0]["onMediaDeviceListUpdated"]))
            this.onMediaDeviceListUpdated = args[0]["onMediaDeviceListUpdated"];
        if (!Helper_1.isFalsy(args[0]["onRecordingStarted"]))
            this.onRecordingStarted = args[0]["onRecordingStarted"];
        if (!Helper_1.isFalsy(args[0]["onRecordingStopped"]))
            this.onRecordingStopped = args[0]["onRecordingStopped"];
        if (!Helper_1.isFalsy(args[0]["onScreenShareStarted"]))
            this.onScreenShareStarted = args[0]["onScreenShareStarted"];
        if (!Helper_1.isFalsy(args[0]["onScreenShareStopped"]))
            this.onScreenShareStopped = args[0]["onScreenShareStopped"];
        if (!Helper_1.isFalsy(args[0]["onUserMuted"]))
            this.onUserMuted = args[0]["onUserMuted"];
        if (!Helper_1.isFalsy(args[0]["onCallSwitchedToVideo"]))
            this.onCallSwitchedToVideo = args[0]["onCallSwitchedToVideo"];
        if (!Helper_1.isFalsy(args[0]["onCallEnded"]))
            this.onCallEnded = args[0]["onCallEnded"];
        if (!Helper_1.isFalsy(args[0]["onError"]))
            this.onError = args[0]["onError"];
    }
    return OngoingCallListener;
}());
exports.OngoingCallListener = OngoingCallListener;
var LoginListener =  (function () {
    function LoginListener() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!Helper_1.isFalsy(args[0]["loginSuccess"]))
            this.loginSuccess = args[0]["loginSuccess"];
        if (!Helper_1.isFalsy(args[0]["loginFailure"]))
            this.loginFailure = args[0]["loginFailure"];
        if (!Helper_1.isFalsy(args[0]["logoutSuccess"]))
            this.logoutSuccess = args[0]["logoutSuccess"];
        if (!Helper_1.isFalsy(args[0]["logoutFailure"]))
            this.logoutFailure = args[0]["logoutFailure"];
    }
    return LoginListener;
}());
exports.LoginListener = LoginListener;
var ConnectionListener =  (function () {
    function ConnectionListener() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        
        this.onConnected = undefined;
        
        this.inConnecting = undefined;
        
        this.onDisconnected = undefined;
        
        this.onFeatureThrottled = undefined;
        if (!Helper_1.isFalsy(args[0]["onConnected"]))
            this.onConnected = args[0]["onConnected"];
        if (!Helper_1.isFalsy(args[0]["inConnecting"]))
            this.inConnecting = args[0]["inConnecting"];
        if (!Helper_1.isFalsy(args[0]["onDisconnected"]))
            this.onDisconnected = args[0]["onDisconnected"];
        if (!Helper_1.isFalsy(args[0]["onFeatureThrottled"]))
            this.onFeatureThrottled = args[0]["onFeatureThrottled"];
    }
    return ConnectionListener;
}());
exports.ConnectionListener = ConnectionListener;

var Listener =  (function () {
    function Listener(name, callback) {
        this._name = name;
        this._callback = callback;
    }
    return Listener;
}());
exports.Listener = Listener;

var MessagesListener =  (function (_super) {
    __extends(MessagesListener, _super);
    function MessagesListener(name, messageEventListener, cursor, callback) {
        var _this = _super.call(this, name, callback) || this;
        _this._eventListener = messageEventListener;
        if (cursor)
            _this._cursor = cursor;
        return _this;
    }
    return MessagesListener;
}(Listener));
exports.MessagesListener = MessagesListener;

var UsersListener =  (function (_super) {
    __extends(UsersListener, _super);
    function UsersListener(name, userEventHandler, cursor, callback) {
        var _this = _super.call(this, name, callback) || this;
        _this._eventListener = userEventHandler;
        if (cursor)
            _this._cursor = cursor;
        return _this;
    }
    return UsersListener;
}(Listener));
exports.UsersListener = UsersListener;

var GroupsListener =  (function (_super) {
    __extends(GroupsListener, _super);
    function GroupsListener(name, groupEventHandler, cursor, callback) {
        var _this = _super.call(this, name, callback) || this;
        _this._eventListener = groupEventHandler;
        if (cursor)
            _this._cursor = cursor;
        return _this;
    }
    return GroupsListener;
}(Listener));
exports.GroupsListener = GroupsListener;

var UserCallListener =  (function (_super) {
    __extends(UserCallListener, _super);
    function UserCallListener(callEventHandler, cursor, callback) {
        var _this = _super.call(this, "callListner", callback) || this;
        _this._eventListener = callEventHandler;
        return _this;
    }
    return UserCallListener;
}(Listener));
exports.UserCallListener = UserCallListener;

var CallsListener =  (function (_super) {
    __extends(CallsListener, _super);
    function CallsListener(name, callEventListner, cursor, callback) {
        var _this = _super.call(this, name, callback) || this;
        _this._eventListener = callEventListner;
        return _this;
    }
    return CallsListener;
}(Listener));
exports.CallsListener = CallsListener;

var UserLoginListener =  (function (_super) {
    __extends(UserLoginListener, _super);
    function UserLoginListener(name, loginEventHandler, cursor, callback) {
        var _this = _super.call(this, name, callback) || this;
        _this._eventListener = loginEventHandler;
        if (cursor)
            _this._cursor = cursor;
        return _this;
    }
    return UserLoginListener;
}(Listener));
exports.UserLoginListener = UserLoginListener;

var WSConnectionListener =  (function (_super) {
    __extends(WSConnectionListener, _super);
    function WSConnectionListener(name, connectionEventHandler, cursor, callback) {
        var _this = _super.call(this, name, callback) || this;
        _this._eventListener = connectionEventHandler;
        if (cursor)
            _this._cursor = cursor;
        return _this;
    }
    return WSConnectionListener;
}(Listener));
exports.WSConnectionListener = WSConnectionListener;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.ConversationController = void 0;
var ConversationModel_1 = __webpack_require__(35);
var Helper_1 = __webpack_require__(0);
var ConversationController =  (function () {
    function ConversationController() {
    }
    
    ConversationController.trasformJSONConversation = function (conversationId, conversationType, lastMessage, conversationWith, unreadMessageCount, tags) {
        var Cometchatconversation;
        try {
            Cometchatconversation = new ConversationModel_1.Conversation(conversationId, conversationType, lastMessage, conversationWith, unreadMessageCount, tags);
        }
        catch (e) {
            Helper_1.Logger.error("ConversationController:transformJSONConversation", e);
        }
        return Cometchatconversation;
    };
    return ConversationController;
}());
exports.ConversationController = ConversationController;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.MessageListnerMaping = void 0;
var Helper_1 = __webpack_require__(0);
var Constants_1 = __webpack_require__(1);
var localforage = __webpack_require__(12);
var CometChat_1 = __webpack_require__(3);

var MessageListnerMaping =  (function () {
    function MessageListnerMaping(store) {
        this.store = Constants_1.constants.DEFAULT_STORE;
        if (!Helper_1.isFalsy(store))
            this.store = store;
        this.settingsStore = localforage.createInstance({
            name: Helper_1.format(Constants_1.LOCAL_STORE.STORE_STRING, CometChat_1.CometChat.getAppId(), Constants_1.LOCAL_STORE.MESSAGE_LISTENERS_LIST)
        });
        this.settingsStore.setDriver([localforage.LOCALSTORAGE, localforage.INDEXEDDB, localforage.WEBSQL]);
    }
    
    MessageListnerMaping.getInstance = function () {
        if (MessageListnerMaping.settingsStore == null) {
            MessageListnerMaping.settingsStore = new MessageListnerMaping();
        }
        return MessageListnerMaping.settingsStore;
    };
    
    MessageListnerMaping.prototype.set = function (key, value) {
        return this.settingsStore.setItem(key, value);
    };
    
    MessageListnerMaping.prototype.remove = function (key) {
        this.settingsStore.removeItem(key);
    };
    
    MessageListnerMaping.prototype.get = function (key) {
        return this.settingsStore.getItem(key);
    };
    
    MessageListnerMaping.prototype.clearStore = function () {
        return this.settingsStore.clear();
    };
    
    MessageListnerMaping.prototype.clear = function (store) { };
    
    MessageListnerMaping.prototype.selectStore = function (store) {
        this.store = store;
    };
    MessageListnerMaping.settingsStore = null;
    return MessageListnerMaping;
}());
exports.MessageListnerMaping = MessageListnerMaping;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.TypingIndicator = void 0;
var TypingIndicator =  (function () {
    function TypingIndicator(receiverId, receiverType, meta) {
        this.receiverId = receiverId;
        this.receiverType = receiverType;
        this.metadata = meta;
    }
    
    TypingIndicator.prototype.getReceiverType = function () {
        return this.receiverType;
    };
    
    TypingIndicator.prototype.setReceiverType = function (receiverType) {
        this.receiverType = receiverType;
    };
    
    TypingIndicator.prototype.getReceiverId = function () {
        return this.receiverId;
    };
    
    TypingIndicator.prototype.setReceiverId = function (receiverId) {
        this.receiverId = receiverId;
    };
    
    TypingIndicator.prototype.getMetadata = function () {
        return this.metadata;
    };
    
    TypingIndicator.prototype.setMetadata = function (meta) {
        this.metadata = meta;
    };
    
    TypingIndicator.prototype.getSender = function () {
        return this.sender;
    };
    
    TypingIndicator.prototype.setSender = function (sender) {
        this.sender = sender;
    };
    return TypingIndicator;
}());
exports.TypingIndicator = TypingIndicator;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.TransientMessage = void 0;
var TransientMessage =  (function () {
    function TransientMessage(receiverId, receiverType, data) {
        this.receiverId = receiverId;
        this.receiverType = receiverType;
        this.data = data ? data : {};
    }
    
    TransientMessage.prototype.getReceiverId = function () {
        return this.receiverId;
    };
    
    TransientMessage.prototype.setReceiverId = function (receiverId) {
        this.receiverId = receiverId;
    };
    
    TransientMessage.prototype.getReceiverType = function () {
        return this.receiverType;
    };
    
    TransientMessage.prototype.setReceiverType = function (receiverType) {
        this.receiverType = receiverType;
    };
    
    TransientMessage.prototype.getData = function () {
        return this.data;
    };
    
    TransientMessage.prototype.setData = function (data) {
        this.data = data;
    };
    
    TransientMessage.prototype.getSender = function () {
        return this.sender;
    };
    
    TransientMessage.prototype.setSender = function (sender) {
        this.sender = sender;
    };
    return TransientMessage;
}());
exports.TransientMessage = TransientMessage;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.EndpointFactory = void 0;
var Helper_1 = __webpack_require__(0);
var Constants_1 = __webpack_require__(1);
var store_1 = __webpack_require__(14);
var CometChat_1 = __webpack_require__(3);
var CustomError_1 = __webpack_require__(2);

var EndpointFactory =  (function () {
    function EndpointFactory() {
        this.baseUrl = "https://%s.apiclient-%s.cometchat.io/";
        this.apiVersion = Constants_1.APPINFO.apiVersion;
        this.adminApiUrl = "https://%s.api-%s.cometchat.io/";
        this.adminApiVersion = Constants_1.APPINFO.apiVersion;
        this.extensionApi = "https://%s-%s.%s/%s";
        this.prosodyApi = "https://%s.%s/%s";
        this.wsApi = "https://%s/%s";
        
        
        this.uriEndpoints = {
            authToken: {
                endpoint: "users/{{uid}}/auth_tokens",
                method: "POST",
                data: { uid: "string|max:100" },
                isAdminApi: true
            },
            appSettings: {
                endpoint: "settings",
                method: "GET"
            },
            
            login: {
                endpoint: "admin/users/auth",
                method: "POST",
                data: { uid: "string|max:100" },
            },
            logout: {
                endpoint: "admin/users/auth/{{authToken}}",
                method: "DELETE",
            },
            
            getMyDetails: { endpoint: "me", method: "GET" },
            updateMyDetails: { endpoint: "me", method: "PUT" },
            getJWT: { endpoint: "me/jwt", method: "POST" },
            
            users: { endpoint: "users", method: "GET" },
            user: { endpoint: "users/{{uid}}", method: "GET" },
            blockUsers: {
                endpoint: "blockedusers",
                method: "POST"
            },
            blockedUsersList: {
                endpoint: "blockedusers",
                method: "GET"
            },
            unblockUsers: {
                endpoint: "blockedusers",
                method: "DELETE"
            },
            userLogout: {
                endpoint: "me",
                method: "DELETE",
            },
            createUser: {
                endpoint: "users",
                method: "POST",
                isAdminApi: true
            },
            updateUser: {
                endpoint: "users/{{uid}}",
                method: "PUT",
                isAdminApi: true
            },
            
            sendFriendRequests: {
                endpoint: "user/friends",
                method: "POST",
                data: { uids: "array<string|max:100>" }
            },
            getFriends: { endpoint: "user/friends", method: "GET" },
            unfriend: {
                endpoint: "user/friends/{{uid}}/{{gid}}",
                method: "DELETE",
                data: { uids: "array<string|max:100>" }
            },
            acceptFriendRequest: {
                endpoint: "user/friends/{{uid}}/accept",
                method: "PUT",
                data: { uids: "array<string|max:100>" }
            },
            rejectFriendRequest: {
                endpoint: "user/friends/{{uid}}/reject",
                method: "DELETE",
                data: { uids: "array<string|max:100>" }
            },
            
            createGroup: {
                endpoint: "groups",
                method: "POST",
                data: {
                    guid: "required|string|max:100",
                    name: "required|string|max:100",
                    type: "enum|public,protected,password",
                    password: "filled|string|max:100"
                }
            },
            getGroups: { endpoint: "groups", method: "GET" },
            getGroup: { endpoint: "groups/{{guid}}", method: "GET" },
            updateGroup: {
                endpoint: "groups/{{guid}}",
                method: "PUT"
            },
            deleteGroup: { endpoint: "groups/{{guid}}", method: "DELETE" },
            addGroupMembers: {
                endpoint: "groups/{{guid}}/members",
                method: "POST",
                data: { uids: "array<string|max:100>" }
            },
            getGroupMembers: { endpoint: "groups/{{guid}}/members", method: "GET" },
            joinGroup: { endpoint: "groups/{{guid}}/members", method: "POST" },
            leaveGroup: { endpoint: "groups/{{guid}}/members", method: "DELETE" },
            kickGroupMembers: {
                endpoint: "groups/{{guid}}/members/{{uid}}",
                method: "DELETE",
                data: { uids: "array<string|max:100>" }
            },
            changeScopeOfMember: {
                endpoint: "groups/{{guid}}/members/{{uid}}",
                method: "PUT",
                data: { uids: "array<string|max:100>" }
            },
            banGroupMember: {
                endpoint: "groups/{{guid}}/bannedusers/{{uid}}",
                method: "POST",
                data: { uids: "array<string|max:100>" }
            },
            unbanGroupMember: {
                endpoint: "groups/{{guid}}/bannedusers/{{uid}}",
                method: "DELETE",
                data: { uids: "array<string|max:100>" }
            },
            addMemebersToGroup: {
                endpoint: "groups/{{guid}}/members",
                method: "PUT",
            },
            getBannedGroupMembers: { endpoint: "groups/{{guid}}/bannedusers", method: "GET" },
            promotemoteGroupMember: {
                endpoint: "groups/{{guid}}/promote",
                method: "PUT",
                data: { uids: "array<string|max:100>" }
            },
            demoteGroupMember: {
                endpoint: "groups/{{guid}}/demote",
                method: "DELETE",
                data: { uids: "array<string|max:100>" }
            },
            transferOwnership: {
                endpoint: "groups/{{guid}}/owner",
                method: "PATCH"
            },
            
            sendMessage: {
                endpoint: "messages",
                method: "POST",
                data: {
                    sender: "array:string:max:100>",
                    isGroupMember: "filled|boolean|bail",
                    data: "required|json"
                }
            },
            sendMessageInThread: {
                endpoint: "messages/{{parentId}}/thread",
                method: "POST",
                data: {
                    sender: "array:string:max:100>",
                    isGroupMember: "filled|boolean|bail",
                    data: "required|json"
                }
            },
            getMessages: { endpoint: "messages", method: "GET" },
            getMessageDetails: { endpoint: "messages/{{messageId}}", method: "GET" },
            getUserMessages: { endpoint: "users/{{listId}}/messages", method: "GET" },
            getGroupMessages: { endpoint: "groups/{{listId}}/messages", method: "GET" },
            getThreadMessages: { endpoint: "messages/{{listId}}/thread", method: "GET" },
            getMessage: { endpoint: "user/messages/{{muid}}", method: "GET" },
            updateMessage: {
                endpoint: "messages/{{messageId}}",
                method: "PUT",
            },
            deleteMessage: { endpoint: "messages/{{messageId}}", method: "DELETE" },
            
            createCallSession: {
                endpoint: "calls",
                method: "POST", data: {}
            },
            updateCallSession: {
                endpoint: "calls/{{sessionid}}",
                method: "put", data: {}
            },
            getConversations: { endpoint: "conversations", method: "GET" },
            getUserConversation: { endpoint: "users/{{uid}}/conversation", method: "GET" },
            getGroupConversation: { endpoint: "groups/{{guid}}/conversation", method: "GET" },
            deleteUserConversation: { endpoint: "users/{{uid}}/conversation", method: "DELETE" },
            deleteGroupConversation: { endpoint: "groups/{{guid}}/conversation", method: "DELETE" },
            updateUserConversation: { endpoint: "users/{{uid}}/conversation", method: "PUT" },
            updateGroupConversation: { endpoint: "groups/{{guid}}/conversation", method: "PUT" },
            updateCallType: { endpoint: "calls/{{sessionid}}/type", method: "PATCH" },
        };
    }
    
    EndpointFactory.prototype.getEndpointData = function (endpointName) {
        return new Promise(function (resolve, reject) {
            try {
                var customAdminHost_1 = CometChat_1.CometChat.appSettings.getAdminHost();
                var customClientHost_1 = CometChat_1.CometChat.appSettings.getClientHost();
                store_1.LocalStorage.getInstance().get(Constants_1.LOCAL_STORE.KEY_APP_SETTINGS).then(function (appSettings) {
                    if (Helper_1.isFalsy(appSettings)) {
                        var endpointData = {};
                        if (new EndpointFactory().uriEndpoints.hasOwnProperty(endpointName)) {
                            endpointData = new EndpointFactory().uriEndpoints[endpointName];
                            if (endpointData.hasOwnProperty("isAdminApi")) {
                                if (Helper_1.isFalsy(customAdminHost_1)) {
                                    var endPoint = Helper_1.format(new EndpointFactory().adminApiUrl, CometChat_1.CometChat.getAppId(), CometChat_1.CometChat.appSettings.getRegion()) + new EndpointFactory().adminApiVersion + "/" + endpointData.endpoint;
                                    endpointData.endpoint = endPoint;
                                    resolve(endpointData);
                                }
                                else {
                                    var endPoint = "https://" + customAdminHost_1 + "/" + endpointData.endpoint;
                                    endpointData.endpoint = endPoint;
                                    resolve(endpointData);
                                }
                            }
                            else {
                                if (Helper_1.isFalsy(customClientHost_1)) {
                                    var endPoint = Helper_1.format(new EndpointFactory().baseUrl, CometChat_1.CometChat.getAppId(), CometChat_1.CometChat.appSettings.getRegion()) + new EndpointFactory().apiVersion + "/" + endpointData.endpoint;
                                    endpointData.endpoint = endPoint;
                                    resolve(endpointData);
                                }
                                else {
                                    var endPoint = "https://" + customClientHost_1 + "/" + endpointData.endpoint;
                                    endpointData.endpoint = endPoint;
                                    resolve(endpointData);
                                }
                            }
                        }
                    }
                    else {
                        var endpointData = {};
                        if (new EndpointFactory().uriEndpoints.hasOwnProperty(endpointName)) {
                            endpointData = new EndpointFactory().uriEndpoints[endpointName];
                            if (endpointData.hasOwnProperty("isAdminApi")) {
                                var endpoint = "https://" + appSettings[Constants_1.APP_SETTINGS.KEYS.ADMIN_API_HOST] + "/" + appSettings[Constants_1.APP_SETTINGS.KEYS.CHAT_API_VERSION] + "/" + endpointData.endpoint;
                                endpointData.endpoint = endpoint;
                                resolve(endpointData);
                            }
                            else {
                                var endpoint = "https://" + appSettings[Constants_1.APP_SETTINGS.KEYS.CLIENT_API_HOST] + "/" + appSettings[Constants_1.APP_SETTINGS.KEYS.CHAT_API_VERSION] + "/" + endpointData.endpoint;
                                endpointData.endpoint = endpoint;
                                resolve(endpointData);
                            }
                        }
                    }
                }, function (error) {
                    var endpointData;
                    if (new EndpointFactory().uriEndpoints.hasOwnProperty(endpointName)) {
                        endpointData = new EndpointFactory().uriEndpoints[endpointName];
                        if (endpointData.hasOwnProperty(["isAdminApi"])) {
                            if (Helper_1.isFalsy(customAdminHost_1)) {
                                var endpoint = Helper_1.format(new EndpointFactory().adminApiUrl, CometChat_1.CometChat.getAppId(), CometChat_1.CometChat.appSettings.getRegion()) + new EndpointFactory().adminApiVersion + "/" + endpointData.endpoint;
                                endpointData.endpoint = endpoint;
                                resolve(endpointData);
                            }
                            else {
                                endpointData.endpoint = "https://" + customAdminHost_1 + "/" + endpointData.endpoint;
                                resolve(endpointData);
                            }
                        }
                        else {
                            if (Helper_1.isFalsy(customClientHost_1)) {
                                var endpoint = Helper_1.format(new EndpointFactory().baseUrl, CometChat_1.CometChat.getAppId(), CometChat_1.CometChat.appSettings.getRegion()) + new EndpointFactory().apiVersion + "/" + endpointData.endpoint;
                                endpointData.endpoint = endpoint;
                                resolve(endpointData);
                            }
                            else {
                                endpointData.endpoint = "https://" + customClientHost_1 + "/" + endpointData.endpoint;
                                resolve(endpointData);
                            }
                        }
                    }
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    return EndpointFactory;
}());
exports.EndpointFactory = EndpointFactory;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.getEndPoint = void 0;
var EndpointFactory_1 = __webpack_require__(28);
var CustomError_1 = __webpack_require__(2);

function getEndPoint(endPointName, params) {
    if (endPointName === void 0) { endPointName = ""; }
    if (params === void 0) { params = {}; }
    var endpointFactory = new EndpointFactory_1.EndpointFactory();
    return new Promise(function (resolve, reject) {
        try {
            endpointFactory.getEndpointData(endPointName).then(function (endPointInfo) {
                var endPointData = endPointInfo;
                if (endPointData) {
                    for (var param in params) {
                        endPointData.endpoint = endPointData.endpoint.replace("{{" + param + "}}", params[param]);
                    }
                    resolve(endPointData);
                }
                else {
                    reject({ error: "Unknown endPoint name." });
                }
            });
        }
        catch (err) {
            reject(new CustomError_1.CometChatException(err));
        }
    });
}
exports.getEndPoint = getEndPoint;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.KeyStore = void 0;
var CometChat_1 = __webpack_require__(3);
var Helper_1 = __webpack_require__(0);
var Constants_1 = __webpack_require__(1);
var localforage = __webpack_require__(12);
var CustomError_1 = __webpack_require__(2);

var KeyStore =  (function () {
    function KeyStore(store) {
        this.store = Constants_1.constants.DEFAULT_STORE;
        if (!Helper_1.isFalsy(store))
            this.store = store;
        this.keyStore = localforage.createInstance({
            name: Helper_1.format(Constants_1.LOCAL_STORE.STORE_STRING, CometChat_1.CometChat.getAppId(), Constants_1.LOCAL_STORE.KEYS_STORE)
        });
        this.keyStore.setDriver([localforage.LOCALSTORAGE, localforage.INDEXEDDB, localforage.WEBSQL]);
    }
    
    KeyStore.getInstance = function () {
        if (KeyStore.KeyStore == null) {
            KeyStore.KeyStore = new KeyStore();
        }
        return KeyStore.KeyStore;
    };
    
    KeyStore.prototype.set = function (key, value) {
        return this.keyStore.setItem(key, value);
    };
    
    KeyStore.prototype.remove = function (key) {
        this.keyStore.removeItem(key);
    };
    
    KeyStore.prototype.get = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.keyStore.getItem(key).then(function (data) {
                    try {
                        resolve(JSON.parse(data));
                    }
                    catch (e) {
                        resolve(data);
                    }
                }, function (error) {
                    reject(error);
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    KeyStore.prototype.clearStore = function () {
        return this.keyStore.clear();
    };
    return KeyStore;
}());
exports.KeyStore = KeyStore;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.CallController = void 0;

var Constants_1 = __webpack_require__(1);
var Helper_1 = __webpack_require__(0);
var CometChat_1 = __webpack_require__(3);
var CustomError_1 = __webpack_require__(2);
var Listner_1 = __webpack_require__(23);
var MediaDevice_1 = __webpack_require__(32);
var UserModel_1 = __webpack_require__(4);
var HttpHelper_1 = __webpack_require__(6);
var CallController =  (function () {
    function CallController() {
        
        this.TAG = "calling Log";
        this.CALL_NO_ANSWER_INTERVAL = 45000;
        this.view = undefined;
        this.isDev = false;
    }
    
    CallController.prototype.getCallListner = function () {
        return CallController.callListner;
    };
    
    CallController.prototype.setCallListner = function (callEventHandler) {
        CallController.callListner = new Listner_1.UserCallListener(callEventHandler);
    };
    CallController.getInstance = function () {
        try {
            if (this.callController == null || this.callController == undefined)
                this.callController = new CallController();
            return this.callController;
        }
        catch (err) {
            Helper_1.Logger.error("CallController: getInstance", err);
        }
    };
    
    CallController.prototype.getActiveCall = function () {
        try {
            if (Helper_1.isFalsy(this.call)) {
                return null;
            }
            return this.call;
        }
        catch (e) {
            Helper_1.Logger.error("CallController: getActiveCall", e);
        }
    };
    
    CallController.prototype.initiateCall = function (call) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (Helper_1.isFalsy(_this.call)) {
                    if (call != null && call != undefined) {
                        _this.call = call;
                        _this.startCallTimer();
                        resolve(call);
                    }
                    else {
                        reject(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.ERROR_IN_CALLING));
                    }
                }
                else {
                    reject(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.CALL_ALREADY_INITIATED));
                }
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CallController.prototype.endCall = function (isInternal) {
        var _this = this;
        try {
            var callScreen = document.getElementsByName("frame");
            callScreen.forEach(function (element) {
                if (_this.view) {
                    _this.view.removeChild(element);
                    _this.view = undefined;
                }
            });
            this.endCallSession();
        }
        catch (e) {
            Helper_1.Logger.error("CallController: endCall", e);
        }
    };
    
    CallController.prototype.onCallStarted = function (call) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (Helper_1.isFalsy(_this.call)) {
                    if (call != null && call != undefined) {
                        _this.call = call;
                        resolve(call);
                    }
                    else {
                        reject(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.ERROR_IN_CALLING));
                    }
                }
                else {
                    reject(new CustomError_1.CometChatException(Constants_1.CALL_ERROR.CALL_ALREADY_INITIATED));
                }
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    CallController.prototype.endCallSession = function () {
        try {
            this.call = undefined;
            CallController.callController = undefined;
            if (this.timer)
                this.stopCallTimer();
            this.view = undefined;
            this.removeListener();
            CallController.callScreen = null;
            CallController.callSettings = null;
        }
        catch (e) {
            Helper_1.Logger.error("CallController:EndCallSession", { e: e });
        }
    };
    
    CallController.prototype.startCallTimer = function () {
        var _this = this;
        try {
            this.timer = setTimeout(function () {
                if (_this.call) {
                    CometChat_1.CometChat.sendUnansweredResponse(_this.call.getSessionId()).then(function (call) {
                        _this.endCallSession();
                    }, function (err) {
                        _this.endCallSession();
                    });
                }
                else {
                    _this.endCallSession();
                }
            }, this.CALL_NO_ANSWER_INTERVAL);
        }
        catch (e) {
            Helper_1.Logger.error("CallController: startCallTimer", e);
        }
    };
    
    CallController.prototype.stopCallTimer = function () {
        try {
            clearTimeout(this.timer);
        }
        catch (e) {
            Helper_1.Logger.error("CallController: stopCallTimer", e);
        }
    };
    
    CallController.prototype.startCall = function (callsettings, view) {
        var _this = this;
        try {
            console.log("call settings", callsettings);
            if (this.timer)
                this.stopCallTimer();
            var callScreen_1 = document.createElement("iframe");
            this.getCallUrl().then(function (url) {
                callScreen_1.src = url + "";
                callScreen_1.name = "frame";
                callScreen_1.setAttribute("allow", "camera; microphone; display-capture;");
                callScreen_1.setAttribute("width", "100%");
                callScreen_1.setAttribute("height", "100%");
                CallController.callScreen = callScreen_1;
                CallController.callSettings = callsettings;
                if (view)
                    _this.view = view;
                view.appendChild(callScreen_1);
                _this.addListener();
            });
        }
        catch (e) {
            Helper_1.Logger.error("CallController: startCall", e);
        }
    };
    
    CallController.prototype.addListener = function () {
        window.addEventListener("message", this.handler, true);
    };
    
    CallController.prototype.removeListener = function () {
        window.removeEventListener("message", this.handler, true);
    };
    
    CallController.prototype.handler = function (message) {
        var _this = this;
        var callsettings = CallController.callSettings;
        var callScreen = CallController.callScreen;
        var call = CallController.getInstance().getActiveCall();
        var msg;
        try {
            msg = JSON.parse(message.data);
            if (msg !== undefined && msg.type == Constants_1.CallConstants.POST_MESSAGES.TYPES.HANGUP) {
                CallController.deviceList = null;
                if (call) {
                    Helper_1.Logger.info(this.TAG, CallController.callListner);
                    window.setTimeout(function () {
                        CometChat_1.CometChat.endCall(call.getSessionId(), true).then(function (call) {
                            Helper_1.Logger.info(_this.TAG, { call: call });
                        })["catch"](function (error) {
                            Helper_1.Logger.info(_this.TAG, "The Call Was Already Ended");
                        });
                    }, 1000);
                }
                else {
                    CometChat_1.CometChat.endCall(callsettings.getSessionId(), true).then(function (call) {
                        Helper_1.Logger.info(_this.TAG, { call: call });
                    })["catch"](function (error) {
                        Helper_1.Logger.info(_this.TAG, "The Call Was Already Ended");
                    });
                }
            }
            else if (msg !== undefined && msg.type == Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE && msg.action == Constants_1.CallConstants.POST_MESSAGES.ACTIONS.USER_JOINED) {
                
                if (msg.value) {
                    var appUser = void 0;
                    var userObj = msg.value;
                    if (!Helper_1.isFalsy(userObj.uid) && !Helper_1.isFalsy(userObj.name)) {
                        appUser = new UserModel_1.User(userObj);
                        appUser.setStatus('online');
                        if (CometChat_1.CometChat.user.getUid().toLowerCase() != appUser.getUid().toLowerCase()) {
                            if (CallController.callListner) {
                                if (!Helper_1.isFalsy(CallController.callListner._eventListener.onUserJoined)) {
                                    CallController.callListner._eventListener.onUserJoined(appUser);
                                }
                            }
                        }
                    }
                }
            }
            else if (msg !== undefined && msg.type == Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE && msg.action == Constants_1.CallConstants.POST_MESSAGES.ACTIONS.USER_LEFT) {
                
                if (msg.value) {
                    var appUser = void 0;
                    var userObj = msg.value;
                    if (!Helper_1.isFalsy(userObj.uid) && !Helper_1.isFalsy(userObj.name)) {
                        appUser = new UserModel_1.User(userObj);
                        appUser.setStatus('online');
                        if (CometChat_1.CometChat.user.getUid().toLowerCase() != appUser.getUid().toLowerCase()) {
                            if (CallController.callListner) {
                                if (!Helper_1.isFalsy(CallController.callListner._eventListener.onUserLeft)) {
                                    CallController.callListner._eventListener.onUserLeft(appUser);
                                }
                            }
                        }
                    }
                }
            }
            else if (msg !== undefined && msg.type == Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE && msg.action == Constants_1.CallConstants.POST_MESSAGES.ACTIONS.USER_LIST_CHANGED) {
                
                var userList_1 = [];
                if (msg.value && msg.value.length > 0) {
                    var updatedUserList = msg.value;
                    updatedUserList.map(function (user) {
                        if (!Helper_1.isFalsy(user.uid) && !Helper_1.isFalsy(user.name)) {
                            var tempUser = new UserModel_1.User(user);
                            tempUser.setStatus('online');
                            userList_1.push(tempUser);
                        }
                    });
                    if (CallController.callListner) {
                        if (!Helper_1.isFalsy(CallController.callListner._eventListener.onUserListUpdated)) {
                            CallController.callListner._eventListener.onUserListUpdated(userList_1);
                        }
                    }
                }
            }
            else if (msg !== undefined && msg.type == Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE && msg.action == Constants_1.CallConstants.POST_MESSAGES.ACTIONS.INITIAL_DEVICE_LIST) {
                Helper_1.Logger.info("initialDeviceList received in SDK = ", msg);
                if (msg.value) {
                    CallController.deviceList = msg.value;
                }
            }
            else if (msg !== undefined && msg.type == Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE && msg.action == Constants_1.CallConstants.POST_MESSAGES.ACTIONS.DEVICE_CHANGE) {
                Helper_1.Logger.info("onDeviceChange received in SDK = ", msg);
                if (msg.value) {
                    CallController.deviceList = msg.value;
                    var availableDevices = CallController.getAvailableDeviceObject(CallController.deviceList);
                    if (CallController.callListner) {
                        if (!Helper_1.isFalsy(CallController.callListner._eventListener.onMediaDeviceListUpdated)) {
                            CallController.callListner._eventListener.onMediaDeviceListUpdated(availableDevices);
                        }
                    }
                }
            }
            else if (msg !== undefined && msg.type == Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE && msg.action == Constants_1.CallConstants.POST_MESSAGES.ACTIONS.RECORDING_TOGGLED) {
                Helper_1.Logger.info("onRecordingToggled received in SDK = ", msg);
                if (msg.value) {
                    var data = msg.value;
                    if (data.hasOwnProperty("user") && data.hasOwnProperty("recordingStarted") && !Helper_1.isFalsy(data.user.uid) && !Helper_1.isFalsy(data.user.name)) {
                        var user = new UserModel_1.User(data.user);
                        user.setStatus('online');
                        var recordingStarted = data["recordingStarted"];
                        if (CallController.callListner) {
                            if (recordingStarted) {
                                if (!Helper_1.isFalsy(CallController.callListner._eventListener.onRecordingStarted)) {
                                    CallController.callListner._eventListener.onRecordingStarted(user);
                                }
                            }
                            else {
                                if (!Helper_1.isFalsy(CallController.callListner._eventListener.onRecordingStopped)) {
                                    CallController.callListner._eventListener.onRecordingStopped(user);
                                }
                            }
                        }
                    }
                }
            }
            else if (msg !== undefined && msg.type == Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE && msg.action == Constants_1.CallConstants.POST_MESSAGES.ACTIONS.USER_MUTED) {
                Helper_1.Logger.info("onUserMuted received in SDK = ", msg);
                if (msg.value) {
                    var data = msg.value;
                    if (data.hasOwnProperty("muted") && data.hasOwnProperty("mutedBy") && !Helper_1.isFalsy(data.muted.uid) && !Helper_1.isFalsy(data.muted.name) && !Helper_1.isFalsy(data.mutedBy.uid) && !Helper_1.isFalsy(data.mutedBy.name)) {
                        var userMuted = new UserModel_1.User(data.muted);
                        userMuted.setStatus('online');
                        var userMutedBy = new UserModel_1.User(data.mutedBy);
                        userMutedBy.setStatus('online');
                        if (CallController.callListner) {
                            if (!Helper_1.isFalsy(CallController.callListner._eventListener.onUserMuted)) {
                                CallController.callListner._eventListener.onUserMuted(userMuted, userMutedBy);
                            }
                        }
                    }
                }
            }
            else if (msg !== undefined && msg.type == Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE && msg.action == Constants_1.CallConstants.POST_MESSAGES.ACTIONS.SCREEN_SHARE_STARTED) {
                if (CallController.callListner) {
                    if (!Helper_1.isFalsy(CallController.callListner._eventListener.onScreenShareStarted)) {
                        CallController.callListner._eventListener.onScreenShareStarted(null);
                    }
                }
            }
            else if (msg !== undefined && msg.type == Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE && msg.action == Constants_1.CallConstants.POST_MESSAGES.ACTIONS.SCREEN_SHARE_STOPPED) {
                if (CallController.callListner) {
                    if (!Helper_1.isFalsy(CallController.callListner._eventListener.onScreenShareStopped)) {
                        CallController.callListner._eventListener.onScreenShareStopped(null);
                    }
                }
            }
            else if (msg !== undefined && msg.type == Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE && msg.action == Constants_1.CallConstants.POST_MESSAGES.ACTIONS.SWITCHED_TO_VIDEO_CALL) {
                if (msg.value) {
                    var data = msg.value;
                    Helper_1.Logger.info("onCallSwitchedToVideo received in SDK = ", data);
                    if (data.hasOwnProperty("initiator") && data.hasOwnProperty("sessionId") && !Helper_1.isFalsy(data.initiator.uid) && !Helper_1.isFalsy(data.sessionId) && data.hasOwnProperty("accepted") && !Helper_1.isFalsy(data.accepted.uid)) {
                        var sessionid = data.sessionId;
                        var initiator = new UserModel_1.User(data.initiator);
                        initiator.setStatus('online');
                        var accepted = new UserModel_1.User(data.accepted);
                        accepted.setStatus('online');
                        if (CallController.getInstance().getCallListner()) {
                            if (!Helper_1.isFalsy(CallController.getInstance().getCallListner()._eventListener.onCallSwitchedToVideo)) {
                                CallController.getInstance().getCallListner()._eventListener.onCallSwitchedToVideo(sessionid, initiator, accepted);
                            }
                        }
                        if (data.initiator.uid.toLowerCase() === CometChat_1.CometChat.user.getUid().toLowerCase() && !data.sessionId.includes("v1.")) {
                            try {
                                var data_1 = {
                                    type: "video"
                                };
                                HttpHelper_1.makeApiCall("updateCallType", { sessionid: sessionid }, data_1).then(function (response) {
                                    console.log("response", response);
                                }, function (error) {
                                    Helper_1.Logger.error("CallController :: onSwitchedToVideo", error);
                                });
                            }
                            catch (err) {
                                Helper_1.Logger.error("CallController :: onSwitchedToVideo", err);
                            }
                        }
                    }
                }
            }
            else {
                if (msg !== undefined && msg.type && msg.action && msg.type == Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE && msg.action == Constants_1.CallConstants.POST_MESSAGES.ACTIONS.LOAD) {
                    if (callScreen.contentWindow != null) {
                        callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.COMETCHAT_RTC_SETTINGS, callsettings: JSON.stringify(callsettings) }, '*');
                    }
                }
            }
        }
        catch (e) {
            msg = undefined;
            Helper_1.Logger.error("CallController: startCall", e);
        }
    };
    CallController.prototype.getCallUrl = function () {
        var _this = this;
        var callUrl = undefined;
        return new Promise(function (resolve, reject) {
            try {
                if (_this.isDev) {
                    callUrl = "https://rtc-test.cometchat.io/?v=" + Constants_1.CALLING_COMPONENT_VERSION;
                    resolve(callUrl);
                }
                else {
                    Helper_1.getAppSettings().then(function (appSettings) {
                        callUrl = "https://" + appSettings[Constants_1.APP_SETTINGS.KEYS.WEBRTC_WEB_FRONTEND_HOST] + "/?v=" + Constants_1.CALLING_COMPONENT_VERSION;
                        resolve(callUrl);
                    });
                }
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    CallController.getAvailableDeviceArray = function (deviceArray) {
        var tempArray = [];
        try {
            if (deviceArray && deviceArray.length > 0) {
                deviceArray.map(function (device) {
                    tempArray.push(new MediaDevice_1.MediaDevice(device.deviceId, device.label, device.active));
                });
            }
            return tempArray;
        }
        catch (e) {
            Helper_1.Logger.error("CallController: getAvailableDeviceArray", e);
            return tempArray;
        }
    };
    CallController.getAvailableDeviceObject = function (deviceObject) {
        var audioInputDevices = [];
        var audioOutputDevices = [];
        var videoInputDevices = [];
        try {
            if (!Helper_1.isFalsy(deviceObject) && !Helper_1.isFalsy(deviceObject[Constants_1.CallConstants.AUDIO_INPUT_DEVICES])) {
                audioInputDevices = CallController.getAvailableDeviceArray(deviceObject[Constants_1.CallConstants.AUDIO_INPUT_DEVICES]);
            }
            if (!Helper_1.isFalsy(deviceObject) && !Helper_1.isFalsy(deviceObject[Constants_1.CallConstants.AUDIO_OUTPUT_DEVICES])) {
                audioOutputDevices = CallController.getAvailableDeviceArray(deviceObject[Constants_1.CallConstants.AUDIO_OUTPUT_DEVICES]);
            }
            if (!Helper_1.isFalsy(deviceObject) && !Helper_1.isFalsy(deviceObject[Constants_1.CallConstants.VIDEO_INPUT_DEVICES])) {
                videoInputDevices = CallController.getAvailableDeviceArray(deviceObject[Constants_1.CallConstants.VIDEO_INPUT_DEVICES]);
            }
            return { audioInputDevices: audioInputDevices, audioOutputDevices: audioOutputDevices, videoInputDevices: videoInputDevices };
        }
        catch (e) {
            Helper_1.Logger.error("CallController: getAvailableDeviceObject", e);
            return { audioInputDevices: audioInputDevices, audioOutputDevices: audioOutputDevices, videoInputDevices: videoInputDevices };
        }
    };
    
    CallController.prototype.getAudioInputDevices = function () {
        var availableDevices = [];
        try {
            if (!Helper_1.isFalsy(CallController.deviceList) && !Helper_1.isFalsy(CallController.deviceList[Constants_1.CallConstants.AUDIO_INPUT_DEVICES])) {
                availableDevices = CallController.getAvailableDeviceArray(CallController.deviceList[Constants_1.CallConstants.AUDIO_INPUT_DEVICES]);
            }
            return availableDevices;
        }
        catch (e) {
            Helper_1.Logger.error("CallController: getAudioInputDevices", e);
            return availableDevices;
        }
    };
    
    CallController.prototype.getAudioOutputDevices = function () {
        var availableDevices = [];
        try {
            if (!Helper_1.isFalsy(CallController.deviceList) && !Helper_1.isFalsy(CallController.deviceList[Constants_1.CallConstants.AUDIO_OUTPUT_DEVICES])) {
                availableDevices = CallController.getAvailableDeviceArray(CallController.deviceList[Constants_1.CallConstants.AUDIO_OUTPUT_DEVICES]);
            }
            return availableDevices;
        }
        catch (e) {
            Helper_1.Logger.error("CallController: getAudioOutputDevices", e);
            return availableDevices;
        }
    };
    
    CallController.prototype.getVideoInputDevices = function () {
        var availableDevices = [];
        try {
            if (!Helper_1.isFalsy(CallController.deviceList) && !Helper_1.isFalsy(CallController.deviceList[Constants_1.CallConstants.VIDEO_INPUT_DEVICES])) {
                availableDevices = CallController.getAvailableDeviceArray(CallController.deviceList[Constants_1.CallConstants.VIDEO_INPUT_DEVICES]);
            }
            return availableDevices;
        }
        catch (e) {
            Helper_1.Logger.error("CallController: getVideoInputDevices", e);
            return availableDevices;
        }
    };
    
    CallController.prototype.setAudioInputDevice = function (deviceId) {
        try {
            if (CallController.callScreen && !Helper_1.isFalsy(deviceId)) {
                var availableAudioInputDevices = CallController.getAvailableDeviceArray(CallController.deviceList[Constants_1.CallConstants.AUDIO_INPUT_DEVICES]);
                var isAnAudioInputDevice = availableAudioInputDevices.filter(function (audioInputDevice) {
                    if (audioInputDevice[Constants_1.CallConstants.MEDIA_DEVICE.ID] === deviceId && !audioInputDevice[Constants_1.CallConstants.MEDIA_DEVICE.ACTIVE]) {
                        return true;
                    }
                    return false;
                });
                if (isAnAudioInputDevice && isAnAudioInputDevice.length > 0) {
                    CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.CHANGE_AUDIO_INPUT, value: deviceId }, '*');
                }
            }
        }
        catch (e) {
            Helper_1.Logger.error("CallController: setAudioInputDevice", e);
        }
    };
    
    CallController.prototype.setAudioOutputDevice = function (deviceId) {
        try {
            if (CallController.callScreen && !Helper_1.isFalsy(deviceId)) {
                var availableAudioOutputDevices = CallController.getAvailableDeviceArray(CallController.deviceList[Constants_1.CallConstants.AUDIO_OUTPUT_DEVICES]);
                var isAnAudioOutputDevice = availableAudioOutputDevices.filter(function (audioOutputDevice) {
                    if (audioOutputDevice[Constants_1.CallConstants.MEDIA_DEVICE.ID] === deviceId && !audioOutputDevice[Constants_1.CallConstants.MEDIA_DEVICE.ACTIVE]) {
                        return true;
                    }
                    return false;
                });
                if (isAnAudioOutputDevice && isAnAudioOutputDevice.length > 0) {
                    CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.CHANGE_AUDIO_OUTPUT, value: deviceId }, '*');
                }
            }
        }
        catch (e) {
            Helper_1.Logger.error("CallController: setAudioOutputDevice", e);
        }
    };
    
    CallController.prototype.setVideoInputDevice = function (deviceId) {
        try {
            if (CallController.callScreen && !Helper_1.isFalsy(deviceId)) {
                var availableVideoInputDevices = CallController.getAvailableDeviceArray(CallController.deviceList[Constants_1.CallConstants.VIDEO_INPUT_DEVICES]);
                var isAVideoInputDevice = availableVideoInputDevices.filter(function (videoInputDevice) {
                    if (videoInputDevice[Constants_1.CallConstants.MEDIA_DEVICE.ID] === deviceId && !videoInputDevice[Constants_1.CallConstants.MEDIA_DEVICE.ACTIVE]) {
                        return true;
                    }
                    return false;
                });
                if (isAVideoInputDevice && isAVideoInputDevice.length > 0) {
                    CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.CHANGE_VIDEO_INPUT, value: deviceId }, '*');
                }
            }
        }
        catch (e) {
            Helper_1.Logger.error("CallController: setVideoInputDevice", e);
        }
    };
    
    CallController.prototype.muteAudio = function (muteAudio) {
        try {
            if (CallController.callScreen) {
                if (muteAudio) {
                    CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.MUTE_AUDIO }, '*');
                }
                else {
                    CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.UNMUTE_AUDIO }, '*');
                }
            }
        }
        catch (e) {
            Helper_1.Logger.error("CallController: muteAudio", e);
        }
    };
    
    CallController.prototype.pauseVideo = function (pauseVideo) {
        try {
            if (CallController.callScreen) {
                if (pauseVideo) {
                    CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.PAUSE_VIDEO }, '*');
                }
                else {
                    CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.UNPAUSE_VIDEO }, '*');
                }
            }
        }
        catch (e) {
            Helper_1.Logger.error("CallController: pauseVideo", e);
        }
    };
    
    CallController.prototype.setMode = function (mode) {
        try {
            if (CallController.callScreen && !Helper_1.isFalsy(mode)) {
                mode = mode.toUpperCase();
                if (Object.values(Constants_1.CallConstants.CALL_MODE).indexOf(mode) > -1 && mode != Constants_1.CallConstants.CALL_MODE.SINGLE) {
                    CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.SWITCH_MODE, value: mode }, '*');
                }
            }
        }
        catch (e) {
            Helper_1.Logger.error("CallController: setMode", e);
        }
    };
    
    CallController.prototype.startScreenShare = function () {
        try {
            if (CallController.callScreen) {
                CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.START_SCREENSHARE }, '*');
            }
        }
        catch (e) {
            Helper_1.Logger.error("CallController: startScreenShare", e);
        }
    };
    
    CallController.prototype.stopScreenShare = function () {
        try {
            if (CallController.callScreen) {
                CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.STOP_SCREENSHARE }, '*');
            }
        }
        catch (e) {
            Helper_1.Logger.error("CallController: stopScreenShare", e);
        }
    };
    
    CallController.prototype.startRecording = function () {
        try {
            if (CallController.callScreen) {
                CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.START_RECORDING }, '*');
            }
        }
        catch (e) {
            Helper_1.Logger.error("CallController: startRecording", e);
        }
    };
    
    CallController.prototype.stopRecording = function () {
        try {
            if (CallController.callScreen) {
                CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.STOP_RECORDING }, '*');
            }
        }
        catch (e) {
            Helper_1.Logger.error("CallController: stopRecording", e);
        }
    };
    
    CallController.prototype.switchToVideoCall = function () {
        try {
            if (CallController.callScreen) {
                CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.SWITCH_TO_VIDEO_CALL }, '*');
            }
        }
        catch (e) {
            Helper_1.Logger.error("CallController: switchToVideoCall", e);
        }
    };
    
    CallController.prototype.openVirtualBackground = function () {
        try {
            if (CallController.callScreen) {
                CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.OPEN_VIRTUAL_BACKGROUND }, '*');
            }
        }
        catch (e) {
            Helper_1.Logger.error("CallController: openVirtualBackground", e);
        }
    };
    
    CallController.prototype.setBackgroundBlur = function (blurLevel) {
        try {
            if (CallController.callScreen) {
                CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.SET_BACKGROUND_BLUR, value: blurLevel }, '*');
            }
        }
        catch (e) {
            Helper_1.Logger.error("CallController: openVirtualBackground", e);
        }
    };
    
    CallController.prototype.setBackgroundImage = function (image) {
        try {
            if (CallController.callScreen) {
                CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.SET_BACKGROUND_IMAGE, value: image }, '*');
            }
        }
        catch (e) {
            Helper_1.Logger.error("CallController: openVirtualBackground", e);
        }
    };
    
    CallController.prototype.endSession = function () {
        try {
            if (CallController.callScreen) {
                CallController.callScreen.contentWindow.postMessage({ type: Constants_1.CallConstants.POST_MESSAGES.TYPES.ACTION_MESSAGE, action: Constants_1.CallConstants.POST_MESSAGES.ACTIONS.END_CALL }, '*');
            }
        }
        catch (e) {
            Helper_1.Logger.error("CallController: endSession", e);
        }
    };
    
    CallController.callController = undefined;
    CallController.callListner = undefined;
    return CallController;
}());
exports.CallController = CallController;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.MediaDevice = void 0;
var Helper_1 = __webpack_require__(0);
var MediaDevice =  (function () {
    function MediaDevice(id, name, active) {
        this.id = "";
        this.name = "";
        this.active = false;
        if (!Helper_1.isFalsy(id)) {
            this.id = id;
        }
        if (!Helper_1.isFalsy(name)) {
            this.name = name;
        }
        this.active = active ? true : false;
    }
    
    MediaDevice.prototype.getId = function () {
        return this.id;
    };
    
    MediaDevice.prototype.setId = function (id) {
        this.id = id ? id : "";
    };
    
    MediaDevice.prototype.getName = function () {
        return this.name;
    };
    
    MediaDevice.prototype.setName = function (name) {
        this.name = name ? name : "";
    };
    
    MediaDevice.prototype.getIsActive = function () {
        return this.active;
    };
    
    MediaDevice.prototype.setIsActive = function (active) {
        this.active = active ? true : false;
    };
    return MediaDevice;
}());
exports.MediaDevice = MediaDevice;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.GroupMembersController = void 0;
var GroupMember_1 = __webpack_require__(34);
var Constants_1 = __webpack_require__(1);
var Helper_1 = __webpack_require__(0);
var GroupMembersController =  (function () {
    function GroupMembersController() {
    }
    
    GroupMembersController.trasformJSONGroupMember = function (groupMember) {
        var member;
        var appUser;
        try {
            if (groupMember.status && groupMember.status !== "offline") {
                groupMember.status = "online";
            }
            else {
                groupMember.status = "offline";
            }
            member = new GroupMember_1.GroupMember(groupMember[Constants_1.GroupMemersConstans.KEYS.UID]);
            Object.assign(member, groupMember);
            return member;
        }
        catch (e) {
            Helper_1.Logger.error("GroupMembersController:trasformJSONGroupMember", { e: e, groupMember: groupMember });
            return groupMember;
        }
    };
    return GroupMembersController;
}());
exports.GroupMembersController = GroupMembersController;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.GroupMember = void 0;

var UserModel_1 = __webpack_require__(4);
var Constants_1 = __webpack_require__(1);
var GroupMember =  (function (_super) {
    __extends(GroupMember, _super);
    function GroupMember(uid, scope) {
        var _this = _super.call(this, uid) || this;
        _this.joinedAt = 0;
        if (scope) {
            _this.scope = scope;
        }
        return _this;
    }
    
    GroupMember.prototype.setScope = function (scope) {
        this.scope = scope;
    };
    
    GroupMember.prototype.setJoinedAt = function (joinedAt) {
        this.joinedAt = joinedAt;
    };
    
    GroupMember.prototype.setGuid = function (guid) {
        this.guid = guid;
    };
    
    GroupMember.prototype.getScope = function () {
        return this.scope;
    };
    
    GroupMember.prototype.getJoinedAt = function () {
        return this.joinedAt;
    };
    
    GroupMember.prototype.getGuid = function () {
        return this.guid;
    };
    GroupMember.GroupMemberScope = Constants_1.GroupMemberScope;
    return GroupMember;
}(UserModel_1.User));
exports.GroupMember = GroupMember;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.Conversation = void 0;
var MessageController_1 = __webpack_require__(10);
var Constants_1 = __webpack_require__(1);
var UsersController_1 = __webpack_require__(11);
var GroupsController_1 = __webpack_require__(15);
var Conversation =  (function () {
    function Conversation(conversationId, conversationType, lastMessage, conversationWith, unreadMessageCount, tags) {
        this.conversationId = conversationId;
        this.conversationType = conversationType;
        if (tags && tags.length > 0) {
            this.tags = tags;
        }
        if (lastMessage !== undefined) {
            this.lastMessage = lastMessage;
            if (lastMessage.id !== undefined) {
                this.lastMessage = MessageController_1.MessageController.trasformJSONMessge(lastMessage);
            }
        }
        if (this.conversationType == Constants_1.MessageConstatnts.RECEIVER_TYPE.USER) {
            this.conversationWith = UsersController_1.UsersController.trasformJSONUser(conversationWith);
        }
        else {
            this.conversationWith = GroupsController_1.GroupsController.trasformJSONGroup(conversationWith);
        }
        if (unreadMessageCount !== undefined) {
            this.unreadMessageCount = unreadMessageCount;
        }
        else {
            this.unreadMessageCount = 0;
        }
    }
    
    Conversation.prototype.setConversationId = function (conversationId) {
        this.conversationId = conversationId;
    };
    
    Conversation.prototype.setConversationType = function (conversationType) {
        this.conversationType = conversationType;
    };
    
    Conversation.prototype.setLastMessage = function (lastMessage) {
        this.lastMessage = lastMessage;
    };
    
    Conversation.prototype.setConversationWith = function (conversationWith) {
        this.conversationWith = conversationWith;
    };
    
    Conversation.prototype.setUnreadMessageCount = function (unreadMessageCount) {
        this.unreadMessageCount = unreadMessageCount;
    };
    
    Conversation.prototype.getConversationId = function () {
        return this.conversationId;
    };
    
    Conversation.prototype.getConversationType = function () {
        return this.conversationType;
    };
    
    Conversation.prototype.getLastMessage = function () {
        return this.lastMessage;
    };
    
    Conversation.prototype.getConversationWith = function () {
        return this.conversationWith;
    };
    
    Conversation.prototype.getUnreadMessageCount = function () {
        return this.unreadMessageCount;
    };
    
    Conversation.prototype.getTags = function () {
        return this.tags;
    };
    return Conversation;
}());
exports.Conversation = Conversation;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.TypingNotificationController = void 0;
var Helper_1 = __webpack_require__(0);
var TypingNotificationController =  (function () {
    function TypingNotificationController() {
    }
    TypingNotificationController.addTypingStarted = function (receiverId) {
        this.TYPING_STARTED_MAP[receiverId] = Helper_1.getCurrentTime();
    };
    TypingNotificationController.removeTypingStarted = function (receiverId) {
        delete this.TYPING_STARTED_MAP[receiverId];
    };
    TypingNotificationController.getTypingStartedMap = function (receiverId) {
        if (receiverId) {
            return this.TYPING_STARTED_MAP[receiverId];
        }
    };
    TypingNotificationController.addTypingEnded = function (receiverId) {
        this.TYPING_ENDED_MAP[receiverId] = Helper_1.getCurrentTime();
    };
    TypingNotificationController.removeTypingEnded = function (receiverId) {
        delete this.TYPING_ENDED_MAP[receiverId];
    };
    TypingNotificationController.getTypingEndedMap = function (receiverId) {
        if (receiverId) {
            return this.TYPING_ENDED_MAP[receiverId];
        }
    };
    TypingNotificationController.addIncomingTypingStarted = function (typingNotification) {
        this.INCOMING_TYPING_STARTED_MAP[typingNotification.getReceiverId()] = { typingNotification: typingNotification, timestamp: Helper_1.getCurrentTime() };
    };
    TypingNotificationController.removeIncomingTypingStarted = function (typingNotification) {
        delete this.INCOMING_TYPING_STARTED_MAP[typingNotification.getReceiverId()];
    };
    TypingNotificationController.TYPING_STARTED_MAP = {};
    TypingNotificationController.TYPING_ENDED_MAP = {};
    TypingNotificationController.INCOMING_TYPING_STARTED_MAP = {};
    return TypingNotificationController;
}());
exports.TypingNotificationController = TypingNotificationController;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.ListenerHandlers = void 0;
var Helper_1 = __webpack_require__(0);
var Listner_1 = __webpack_require__(23);
var ListenerHandlers =  (function () {
    function ListenerHandlers() {
        this.connectionHandlers = [];
        this.loginHandlers = [];
        this.messageHandlers = [];
        this.userHandlers = [];
        this.groupHandlers = [];
        this.callHandlers = [];
    }
    ListenerHandlers.getInstance = function () {
        if (this.listenerHandlers == null || this.listenerHandlers == undefined) {
            this.listenerHandlers = new ListenerHandlers();
        }
        return this.listenerHandlers;
    };
    
    ListenerHandlers.prototype.addConnectionEventListener = function (name, connectionEventListener) {
        try {
            this.connectionHandlers = this.connectionHandlers.filter(function (listener) {
                return listener._name != name;
            });
            this.connectionHandlers = __spreadArrays(this.connectionHandlers, [new Listner_1.WSConnectionListener(name, connectionEventListener)]);
        }
        catch (err) {
            Helper_1.Logger.error("ListenerHandlers: addWSConnectionEventListener", err);
        }
    };
    
    ListenerHandlers.prototype.removeConnectionEventListener = function (handler) {
        try {
            this.connectionHandlers = this.connectionHandlers.filter(function (listener) {
                return listener._name !== handler;
            });
        }
        catch (err) {
            Helper_1.Logger.error("ListenerHandlers: removeWSConnectionEventListener", err);
        }
    };
    
    ListenerHandlers.prototype.addLoginEventListener = function (name, loginEventListener) {
        try {
            this.loginHandlers = this.loginHandlers.filter(function (listener) {
                return listener._name != name;
            });
            this.loginHandlers = __spreadArrays(this.loginHandlers, [new Listner_1.UserLoginListener(name, loginEventListener)]);
        }
        catch (err) {
            Helper_1.Logger.error("ListenerHandlers: addLoginEventListener", err);
        }
    };
    
    ListenerHandlers.prototype.removeLoginEventListener = function (handler) {
        try {
            this.loginHandlers = this.loginHandlers.filter(function (listener) {
                return listener._name !== handler;
            });
        }
        catch (err) {
            Helper_1.Logger.error("ListenerHandlers: removeLoginEventListener", err);
        }
    };
    
    ListenerHandlers.prototype.addMessageEventListener = function (name, messageListener) {
        try {
            this.messageHandlers = this.messageHandlers.filter(function (listener) {
                return listener._name != name;
            });
            this.messageHandlers = __spreadArrays(this.messageHandlers, [new Listner_1.MessagesListener(name, messageListener)]);
        }
        catch (err) {
            Helper_1.Logger.error("ListenerHandlers: addMessageEventListener", err);
        }
    };
    
    ListenerHandlers.prototype.removeMessageEventListener = function (handler) {
        try {
            this.messageHandlers = this.messageHandlers.filter(function (listener) {
                return listener._name !== handler;
            });
        }
        catch (err) {
            Helper_1.Logger.error("ListenerHandlers: removeMessageEventListener", err);
        }
    };
    
    ListenerHandlers.prototype.addUserEventListener = function (name, userEventListener) {
        try {
            this.userHandlers = this.userHandlers.filter(function (listener) {
                return listener._name != name;
            });
            this.userHandlers = __spreadArrays(this.userHandlers, [new Listner_1.UsersListener(name, userEventListener)]);
        }
        catch (err) {
            Helper_1.Logger.error("ListenerHandlers: addUserEventListener", err);
        }
    };
    
    ListenerHandlers.prototype.removeUserEventListener = function (handler) {
        try {
            this.userHandlers = this.userHandlers.filter(function (listener) {
                return listener._name !== handler;
            });
        }
        catch (err) {
            Helper_1.Logger.error("ListenerHandlers: removeUserEventListener", err);
        }
    };
    
    ListenerHandlers.prototype.addGroupEventListener = function (name, groupListener) {
        try {
            this.groupHandlers = this.groupHandlers.filter(function (listener) {
                return listener._name != name;
            });
            this.groupHandlers = __spreadArrays(this.groupHandlers, [new Listner_1.GroupsListener(name, groupListener)]);
        }
        catch (err) {
            Helper_1.Logger.error("ListenerHandlers: addGroupEventListener", err);
        }
    };
    
    ListenerHandlers.prototype.removeGroupEventListener = function (handler) {
        try {
            this.groupHandlers = this.groupHandlers.filter(function (listener) {
                return listener._name !== handler;
            });
        }
        catch (err) {
            Helper_1.Logger.error("ListenerHandlers: removeGroupEventListener", err);
        }
    };
    
    ListenerHandlers.prototype.addCallEventListener = function (name, callListener) {
        try {
            this.callHandlers = this.callHandlers.filter(function (listener) {
                return listener._name != name;
            });
            this.callHandlers = __spreadArrays(this.callHandlers, [new Listner_1.CallsListener(name, callListener)]);
        }
        catch (err) {
            Helper_1.Logger.error("ListenerHandlers: addCallEventListener", err);
        }
    };
    
    ListenerHandlers.prototype.removeCallEventListener = function (handler) {
        try {
            this.callHandlers = this.callHandlers.filter(function (listener) {
                return listener._name !== handler;
            });
        }
        catch (err) {
            Helper_1.Logger.error("ListenerHandlers: removeCallEventListener", err);
        }
    };
    ListenerHandlers.listenerHandlers = new ListenerHandlers();
    return ListenerHandlers;
}());
exports.ListenerHandlers = ListenerHandlers;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.CometChat = exports.init = void 0;
var CometChat_1 = __webpack_require__(3);

function init(appId) {
    return CometChat_1.CometChat.getInstance(appId);
}
exports.init = init;
exports.CometChat = CometChat_1.CometChat;


 }),

 (function(module, exports) {

var g;


g = (function() {
	return this;
})();

try {
	
	g = g || new Function("return this")();
} catch (e) {
	
	if (typeof window === "object") g = window;
}





module.exports = g;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.GroupsRequestBuilder = exports.GroupsRequest = void 0;
var HttpHelper_1 = __webpack_require__(6);
var Helper_1 = __webpack_require__(0);
var CustomError_1 = __webpack_require__(2);
var GroupsController_1 = __webpack_require__(15);
var Constants_1 = __webpack_require__(1);
var GroupsRequest =  (function () {
    function GroupsRequest(builder) {
        this.cursor = -1;
        this.total = -1;
        this.next_page = 1;
        this.last_page = -1;
        this.current_page = 1;
        this.total_pages = -1;
        this.hasJoined = 0;
        this.withTags = false;
        this.pagination = {
            total: 0,
            count: 0,
            per_page: 0,
            current_page: 0,
            total_pages: 0,
            links: []
        };
        if (!Helper_1.isFalsy(builder)) {
            if (!Helper_1.isFalsy(builder.limit)) {
                this.limit = builder.limit;
            }
            if (!Helper_1.isFalsy(builder.searchKeyword))
                this.searchKeyword = builder.searchKeyword;
            if (!Helper_1.isFalsy(builder.hasJoined))
                this.hasJoined = 1;
            if (!Helper_1.isFalsy(builder.tags))
                this.tags = builder.tags;
            if (!Helper_1.isFalsy(builder.showTags))
                this.withTags = builder.showTags;
        }
    }
    GroupsRequest.prototype.validateGroupBuilder = function () {
        var response;
        if (this.limit !== undefined) {
            if (isNaN(this.limit)) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_NUMBER), "SET_LIMIT", "SET_LIMIT", "setLimit()")));
                return response;
            }
            else if (this.limit > Constants_1.DEFAULT_VALUES.GROUPS_MAX_LIMIT) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.LIMIT_EXCEEDED), "SET_LIMIT", "SET_LIMIT", Constants_1.DEFAULT_VALUES.GROUPS_MAX_LIMIT)));
                return response;
            }
            else if (this.limit < Constants_1.DEFAULT_VALUES.ZERO) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_POSITIVE_NUMBER), "SET_LIMIT", "SET_LIMIT", "setLimit()")));
                return response;
            }
        }
        else {
            response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.METHOD_COMPULSORY), "SET_LIMIT", "SET_LIMIT", "Set Limit")));
            return response;
        }
        if (this.searchKeyword !== undefined) {
            if (typeof this.searchKeyword !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "SET_SEARCH_KEYWORD", "SET_SEARCH_KEYWORD", "setSearchKeyword()")));
                return response;
            }
            else {
                if (Helper_1.isFalsy(this.searchKeyword.trim())) {
                    response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "SET_SEARCH_KEYWORD", "SET_SEARCH_KEYWORD", "search keyword", "search keyword")));
                    return response;
                }
                else {
                    this.searchKeyword = this.searchKeyword.trim();
                }
            }
        }
        if (this.withTags !== undefined) {
            if (typeof this.withTags !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.BOOLEAN) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_BOOLEAN), "WITH_TAGS", "WITH_TAGS", "withTags()")));
                return response;
            }
            else {
                if (this.withTags == true) {
                    this.withTags = true;
                }
                else {
                    this.withTags = false;
                }
            }
        }
        if (this.tags !== undefined) {
            if (!Array.isArray(this.tags)) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_AN_ARRAY), "TAGS", "TAGS", "setTags()")));
                return response;
            }
        }
    };
    
    GroupsRequest.prototype.fetchNext = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var object = _this.validateGroupBuilder();
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                HttpHelper_1.makeApiCall("getGroups", {}, _this.getNextData()).then(function (res) {
                    if (res.meta)
                        _this.total_pages = res.meta.pagination.total_pages;
                    if (res.data.length > 0) {
                        _this.pagination = res.meta.pagination;
                        var groupList_1 = [];
                        res.data.map(function (key, value) {
                            groupList_1.push(GroupsController_1.GroupsController.trasformJSONGroup(key));
                        });
                        resolve(groupList_1);
                    }
                    resolve([]);
                }, function (err) {
                    reject(new CustomError_1.CometChatException(err.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    GroupsRequest.prototype.getNextData = function () {
        var paginationData = {};
        paginationData['per_page'] = this.limit;
        if (!Helper_1.isFalsy(this.searchKeyword)) {
            paginationData['searchKey'] = this.searchKeyword;
        }
        if (!Helper_1.isFalsy(this.hasJoined)) {
            paginationData['hasJoined'] = 1;
        }
        if (!Helper_1.isFalsy(this.tags)) {
            paginationData['tags'] = this.tags;
        }
        if (!Helper_1.isFalsy(this.withTags)) {
            paginationData['withTags'] = 1;
        }
        if (this.current_page == 1) {
            paginationData['page'] = this.next_page;
            this.next_page++;
            this.current_page++;
        }
        else {
            if (this.next_page > this.total_pages) {
                paginationData['page'] = this.next_page;
                return paginationData;
            }
            paginationData['page'] = this.next_page++;
        }
        return paginationData;
    };
    GroupsRequest.MAX_LIMIT = 100;
    GroupsRequest.DEFAULT_LIMIT = 30;
    return GroupsRequest;
}());
exports.GroupsRequest = GroupsRequest;
var GroupsRequestBuilder =  (function () {
    function GroupsRequestBuilder() {
    }
    
    GroupsRequestBuilder.prototype.setLimit = function (limit) {
        this.limit = limit;
        return this;
    };
    
    GroupsRequestBuilder.prototype.setSearchKeyword = function (searchKeyword) {
        this.searchKeyword = searchKeyword;
        return this;
    };
    
    GroupsRequestBuilder.prototype.joinedOnly = function (hasJoined) {
        this.hasJoined = hasJoined;
        return this;
    };
    
    GroupsRequestBuilder.prototype.setTags = function (tags) {
        this.tags = tags;
        return this;
    };
    
    GroupsRequestBuilder.prototype.withTags = function (withTags) {
        this.showTags = withTags;
        return this;
    };
    
    GroupsRequestBuilder.prototype.build = function () {
        return new GroupsRequest(this);
    };
    return GroupsRequestBuilder;
}());
exports.GroupsRequestBuilder = GroupsRequestBuilder;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.GroupMembersRequestBuilder = exports.GroupMembersRequest = void 0;
var HttpHelper_1 = __webpack_require__(6);
var Helper_1 = __webpack_require__(0);
var store_1 = __webpack_require__(14);
var CustomError_1 = __webpack_require__(2);
var GroupMemberController_1 = __webpack_require__(33);
var Constants_1 = __webpack_require__(1);
var GroupMembersRequest =  (function () {
    function GroupMembersRequest(builder) {
        this.cursor = -1;
        this.total = -1;
        this.next_page = 1;
        this.last_page = -1;
        this.current_page = 1;
        this.total_pages = -1;
        this.pagination = {
            total: 0,
            count: 0,
            per_page: 0,
            current_page: 0,
            total_pages: 0,
            links: []
        };
        this.store = store_1.LocalStorage.getInstance();
        if (!Helper_1.isFalsy(builder)) {
            this.limit = builder.limit;
            this.guid = builder.guid;
            if (!Helper_1.isFalsy(builder.searchKeyword))
                this.searchKeyword = builder.searchKeyword;
            if (!Helper_1.isFalsy(builder.scopes))
                this.scopes = builder.scopes;
        }
    }
    GroupMembersRequest.prototype.validateGroupMembersBuilder = function () {
        var response;
        if (this.limit !== undefined) {
            if (isNaN(this.limit)) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_NUMBER), "SET_LIMIT", "SET_LIMIT", "setLimit()")));
                return response;
            }
            else if (this.limit > Constants_1.DEFAULT_VALUES.USERS_MAX_LIMIT) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.LIMIT_EXCEEDED), "SET_LIMIT", "SET_LIMIT", Constants_1.DEFAULT_VALUES.USERS_MAX_LIMIT)));
                return response;
            }
            else if (this.limit < Constants_1.DEFAULT_VALUES.ZERO) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_POSITIVE_NUMBER), "SET_LIMIT", "SET_LIMIT", "setLimit()")));
                return response;
            }
        }
        else {
            response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.METHOD_COMPULSORY), "SET_LIMIT", "SET_LIMIT", "Set Limit")));
            return response;
        }
        if (this.searchKeyword !== undefined) {
            if (typeof this.searchKeyword !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "SET_SEARCH_KEYWORD", "SET_SEARCH_KEYWORD", "setSearchKeyword()")));
                return response;
            }
            else {
                if (Helper_1.isFalsy(this.searchKeyword.trim())) {
                    response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "SET_SEARCH_KEYWORD", "SET_SEARCH_KEYWORD", "search keyword", "search keyword")));
                    return response;
                }
                else {
                    this.searchKeyword = this.searchKeyword.trim();
                }
            }
        }
        if (this.guid !== undefined) {
            if (typeof this.guid !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "GUID", "GUID", "GroupMembersRequestBuilder()")));
                return response;
            }
            else {
                if (Helper_1.isFalsy(this.guid)) {
                    response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "GUID", "GUID", "GUID", "GUID")));
                    return response;
                }
            }
        }
        if (this.scopes !== undefined) {
            if (!Array.isArray(this.scopes)) {
                response = (new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_AN_ARRAY), "SET_SCOPES", "SET_SCOPES", "setScopes()"))));
                return response;
            }
        }
    };
    
    GroupMembersRequest.prototype.fetchNext = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var object = _this.validateGroupMembersBuilder();
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                HttpHelper_1.makeApiCall(("getGroupMembers"), { guid: _this.guid }, _this.getNextData()).then(function (res) {
                    if (res.meta)
                        _this.total_pages = res.meta.pagination.total_pages;
                    if (res.data.length > 0) {
                        _this.pagination = res.meta.pagination;
                        var groupMemberList_1 = [];
                        res.data.map(function (groupMember) {
                            groupMember.guid = _this.guid;
                            groupMemberList_1.push(GroupMemberController_1.GroupMembersController.trasformJSONGroupMember(groupMember));
                        });
                        resolve(groupMemberList_1);
                    }
                    else
                        resolve([]);
                }, function (err) {
                    reject(new CustomError_1.CometChatException(err.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    GroupMembersRequest.prototype.getNextData = function () {
        var paginationData = {};
        paginationData['per_page'] = this.limit;
        if (!Helper_1.isFalsy(this.searchKeyword))
            paginationData['searchKey'] = this.searchKeyword;
        if (!Helper_1.isFalsy(this.scopes))
            paginationData['scopes'] = this.scopes;
        if (this.current_page == 1) {
            paginationData['page'] = this.next_page;
            this.next_page++;
            this.current_page++;
        }
        else {
            if (this.next_page > this.total_pages) {
                paginationData['page'] = this.next_page;
                return paginationData;
            }
            paginationData['page'] = this.next_page++;
        }
        return paginationData;
    };
    GroupMembersRequest.MAX_LIMIT = 2;
    GroupMembersRequest.DEFAULT_LIMIT = 1;
    return GroupMembersRequest;
}());
exports.GroupMembersRequest = GroupMembersRequest;
var GroupMembersRequestBuilder =  (function () {
    function GroupMembersRequestBuilder(guid) {
        this.guid = guid;
    }
    
    GroupMembersRequestBuilder.prototype.setLimit = function (limit) {
        this.limit = limit;
        return this;
    };
    
    GroupMembersRequestBuilder.prototype.setSearchKeyword = function (searchKeyword) {
        this.searchKeyword = searchKeyword;
        return this;
    };
    
    GroupMembersRequestBuilder.prototype.setScopes = function (scopes) {
        this.scopes = scopes;
        return this;
    };
    
    GroupMembersRequestBuilder.prototype.build = function () {
        return new GroupMembersRequest(this);
    };
    return GroupMembersRequestBuilder;
}());
exports.GroupMembersRequestBuilder = GroupMembersRequestBuilder;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.BannedMembersRequestBuilder = exports.BannedMembersRequest = void 0;
var HttpHelper_1 = __webpack_require__(6);
var Helper_1 = __webpack_require__(0);
var CustomError_1 = __webpack_require__(2);
var GroupMemberController_1 = __webpack_require__(33);
var Constants_1 = __webpack_require__(1);
var BannedMembersRequest =  (function () {
    function BannedMembersRequest(builder) {
        this.cursor = -1;
        this.total = -1;
        this.next_page = 1;
        this.last_page = -1;
        this.current_page = 1;
        this.total_pages = -1;
        this.pagination = {
            total: 0,
            count: 0,
            per_page: 0,
            current_page: 0,
            total_pages: 0,
            links: []
        };
        if (!Helper_1.isFalsy(builder)) {
            this.limit = builder.limit;
            this.guid = builder.guid;
            if (!Helper_1.isFalsy(builder.searchKeyword))
                this.searchKeyword = builder.searchKeyword;
            if (!Helper_1.isFalsy(builder.scopes))
                this.scopes = builder.scopes;
        }
    }
    BannedMembersRequest.prototype.validateBannedMembersBuilder = function () {
        var response;
        if (this.limit !== undefined) {
            if (isNaN(this.limit)) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_NUMBER), "SET_LIMIT", "SET_LIMIT", "setLimit()")));
                return response;
            }
            else if (this.limit > Constants_1.DEFAULT_VALUES.USERS_MAX_LIMIT) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.LIMIT_EXCEEDED), "SET_LIMIT", "SET_LIMIT", Constants_1.DEFAULT_VALUES.USERS_MAX_LIMIT)));
                return response;
            }
            else if (this.limit < Constants_1.DEFAULT_VALUES.ZERO) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_POSITIVE_NUMBER), "SET_LIMIT", "SET_LIMIT", "setLimit()")));
                return response;
            }
        }
        else {
            response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.METHOD_COMPULSORY), "SET_LIMIT", "SET_LIMIT", "Set Limit")));
            return response;
        }
        if (this.searchKeyword !== undefined) {
            if (typeof this.searchKeyword !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "SET_SEARCH_KEYWORD", "SET_SEARCH_KEYWORD", "setSearchKeyword()")));
                return response;
            }
            else {
                if (Helper_1.isFalsy(this.searchKeyword.trim())) {
                    response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "SET_SEARCH_KEYWORD", "SET_SEARCH_KEYWORD", "search keyword", "search keyword")));
                    return response;
                }
                else {
                    this.searchKeyword = this.searchKeyword.trim();
                }
            }
        }
        if (this.guid !== undefined) {
            if (typeof this.guid !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "GUID", "GUID", "GroupMembersRequestBuilder()")));
                return response;
            }
            else {
                if (Helper_1.isFalsy(this.guid)) {
                    response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "GUID", "GUID", "GUID", "GUID")));
                    return response;
                }
            }
        }
        if (this.scopes !== undefined) {
            if (!Array.isArray(this.scopes)) {
                response = (new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_AN_ARRAY), "SET_SCOPES", "SET_SCOPES", "setScopes()"))));
                return response;
            }
        }
    };
    
    BannedMembersRequest.prototype.fetchNext = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var object = _this.validateBannedMembersBuilder();
                if (object instanceof CustomError_1.CometChatException) {
                    reject(object);
                    return;
                }
                HttpHelper_1.makeApiCall(("getBannedGroupMembers"), { guid: _this.guid }, _this.getNextData()).then(function (res) {
                    if (res.meta)
                        _this.total_pages = res.meta.pagination.total_pages;
                    if (res.data.length > 0) {
                        _this.pagination = res.meta.pagination;
                        var groupMemberList_1 = [];
                        res.data.map(function (groupMember) {
                            groupMember.guid = _this.guid;
                            groupMemberList_1.push(GroupMemberController_1.GroupMembersController.trasformJSONGroupMember(groupMember));
                        });
                        resolve(groupMemberList_1);
                    }
                    else
                        resolve([]);
                }, function (err) {
                    reject(new CustomError_1.CometChatException(err.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    BannedMembersRequest.prototype.getNextData = function () {
        var paginationData = {};
        paginationData['per_page'] = this.limit;
        if (!Helper_1.isFalsy(this.searchKeyword))
            paginationData['searchKey'] = this.searchKeyword;
        if (!Helper_1.isFalsy(this.scopes))
            paginationData['scopes'] = this.scopes;
        if (this.current_page == 1) {
            paginationData['page'] = this.next_page;
            this.next_page++;
            this.current_page++;
        }
        else {
            if (this.next_page > this.total_pages) {
                paginationData['page'] = this.next_page;
                return paginationData;
            }
            paginationData['page'] = this.next_page++;
        }
        return paginationData;
    };
    BannedMembersRequest.MAX_LIMIT = 2;
    BannedMembersRequest.DEFAULT_LIMIT = 1;
    return BannedMembersRequest;
}());
exports.BannedMembersRequest = BannedMembersRequest;
var BannedMembersRequestBuilder =  (function () {
    function BannedMembersRequestBuilder(guid) {
        this.guid = guid;
    }
    
    BannedMembersRequestBuilder.prototype.setLimit = function (limit) {
        this.limit = limit;
        return this;
    };
    
    BannedMembersRequestBuilder.prototype.setSearchKeyword = function (searchKeyword) {
        this.searchKeyword = searchKeyword;
        return this;
    };
    
    BannedMembersRequestBuilder.prototype.setScopes = function (scopes) {
        this.scopes = scopes;
        return this;
    };
    
    BannedMembersRequestBuilder.prototype.build = function () {
        return new BannedMembersRequest(this);
    };
    return BannedMembersRequestBuilder;
}());
exports.BannedMembersRequestBuilder = BannedMembersRequestBuilder;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.UsersRequestBuilder = exports.UsersRequest = void 0;
var HttpHelper_1 = __webpack_require__(6);
var Helper_1 = __webpack_require__(0);
var UsersController_1 = __webpack_require__(11);
var CustomError_1 = __webpack_require__(2);
var UserStore_1 = __webpack_require__(44);
var Constants_1 = __webpack_require__(1);
var UsersRequest =  (function () {
    function UsersRequest(builder) {
        this.next_page = 1;
        this.current_page = 1;
        this.total_pages = -1;
        this.hideBlockedUsers = false;
        this.friendsOnly = false;
        this.fetchingInProgress = false;
        this.withTags = false;
        this.pagination = {
            total: 0,
            count: 0,
            per_page: 0,
            current_page: 0,
            total_pages: 0,
            links: []
        };
        UsersRequest.userStore = UserStore_1.UserStore.getInstance();
        if (!Helper_1.isFalsy(builder)) {
            this.limit = builder.limit;
            if (!Helper_1.isFalsy(builder.searchKeyword))
                this.searchKeyword = builder.searchKeyword;
            if (!Helper_1.isFalsy(builder.status)) {
                if (builder.status == UsersRequest.USER_STATUS.ONLINE) {
                    this.status = Constants_1.PresenceConstatnts.STATUS.AVAILABLE;
                }
                else
                    this.status = builder.status;
            }
            if (!Helper_1.isFalsy(builder.shouldHideBlockedUsers))
                this.hideBlockedUsers = builder.shouldHideBlockedUsers;
            if (!Helper_1.isFalsy(builder.showFriendsOnly))
                this.friendsOnly = builder.showFriendsOnly;
            if (!Helper_1.isFalsy(builder.showTags))
                this.withTags = builder.showTags;
            if (!Helper_1.isFalsy(builder.role))
                this.role = builder.role;
            if (!Helper_1.isFalsy(builder.roles))
                this.roles = builder.roles;
            if (!Helper_1.isFalsy(builder.tags))
                this.tags = builder.tags;
            if (!Helper_1.isFalsy(builder.UIDs))
                this.UIDs = builder.UIDs;
            if (!Helper_1.isFalsy(builder.SortBy))
                this.sortBy = builder.SortBy;
            if (!Helper_1.isFalsy(builder.SearchIn))
                this.searchIn = builder.SearchIn;
            if (!Helper_1.isFalsy(builder.SortOrder))
                this.sortOrder = builder.SortOrder;
        }
    }
    UsersRequest.prototype.validateUserBuilder = function () {
        var response;
        if (this.limit !== undefined) {
            if (isNaN(this.limit)) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_NUMBER), "SET_LIMIT", "SET_LIMIT", "setLimit()")));
                return response;
            }
            else if (this.limit > Constants_1.DEFAULT_VALUES.USERS_MAX_LIMIT) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.LIMIT_EXCEEDED), "SET_LIMIT", "SET_LIMIT", Constants_1.DEFAULT_VALUES.USERS_MAX_LIMIT)));
                return response;
            }
            else if (this.limit < Constants_1.DEFAULT_VALUES.ZERO) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_POSITIVE_NUMBER), "SET_LIMIT", "SET_LIMIT", "setLimit()")));
                return response;
            }
        }
        else {
            response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.METHOD_COMPULSORY), "SET_LIMIT", "SET_LIMIT", "Set Limit")));
            return response;
        }
        if (this.searchKeyword !== undefined) {
            if (typeof this.searchKeyword !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "SET_SEARCH_KEYWORD", "SET_SEARCH_KEYWORD", "setSearchKeyword()")));
                return response;
            }
            else {
                if (Helper_1.isFalsy(this.searchKeyword.trim())) {
                    response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "SET_SEARCH_KEYWORD", "SET_SEARCH_KEYWORD", "search keyword", "search keyword")));
                    return response;
                }
                else {
                    this.searchKeyword = this.searchKeyword.trim();
                }
            }
        }
        if (this.status) {
            if (typeof this.status !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "SET_STATUS", "SET_STATUS", "setStatus()")));
                return response;
            }
            else {
                if (!(this.status.toLowerCase() == 'available')) {
                    if (!(this.status.toLowerCase() == 'offline')) {
                        response = new CustomError_1.CometChatException(Constants_1.UserErrors.INVALID_STATUS);
                        return response;
                    }
                }
            }
        }
        if (this.hideBlockedUsers !== undefined) {
            if (typeof this.hideBlockedUsers !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.BOOLEAN) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_BOOLEAN), "HIDE_BLOCKED_USERS", "HIDE_BLOCKED_USERS", "hideBlockedUsers()")));
                return response;
            }
            else {
                if (this.hideBlockedUsers == true) {
                    this.hideBlockedUsers = true;
                }
                else {
                    this.hideBlockedUsers = false;
                }
            }
        }
        if (this.friendsOnly !== undefined) {
            if (typeof this.friendsOnly !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.BOOLEAN) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_BOOLEAN), "FRIENDS_ONLY", "FRIENDS_ONLY", "friendsOnly()")));
                return response;
            }
            else {
                if (this.friendsOnly == true) {
                    this.friendsOnly = true;
                }
                else {
                    this.friendsOnly = false;
                }
            }
        }
        if (this.withTags !== undefined) {
            if (typeof this.withTags !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.BOOLEAN) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.MUST_BE_A_BOOLEAN), "WITH_TAGS", "WITH_TAGS", "withTags()")));
                return response;
            }
            else {
                if (this.withTags == true) {
                    this.withTags = true;
                }
                else {
                    this.withTags = false;
                }
            }
        }
        if (this.roles !== undefined) {
            if (!Array.isArray(this.roles)) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_AN_ARRAY), "ROLES", "ROLES", "setRoles()")));
                return response;
            }
        }
        if (this.tags !== undefined) {
            if (!Array.isArray(this.tags)) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_AN_ARRAY), "TAGS", "TAGS", "setTags()")));
                return response;
            }
        }
        if (this.UIDs !== undefined) {
            if (!Array.isArray(this.UIDs)) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_AN_ARRAY), "UIDs", "UIDs", "setUIDs()")));
                return response;
            }
        }
        if (this.sortBy) {
            if (typeof this.sortBy !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "SORT_BY", "SORT_BY", "sortBy()")));
                return response;
            }
            else {
                if (Helper_1.isFalsy(this.sortBy.trim())) {
                    response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "SORT_BY", "SORT_BY", "sort by", "sort by")));
                    return response;
                }
                else {
                    this.sortBy = this.sortBy.trim().toLowerCase();
                }
            }
        }
        if (this.sortOrder) {
            if (typeof this.sortOrder !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "SORT_BY_ORDER", "SORT_BY_ORDER", "sortByOrder()")));
                return response;
            }
            else {
                if (Helper_1.isFalsy(this.sortOrder.trim())) {
                    response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "SORT_BY_ORDER", "SORT_BY_ORDER", "sort order", "sort order")));
                    return response;
                }
                else {
                    this.sortOrder = this.sortOrder.trim().toLowerCase();
                }
            }
        }
        if (this.searchIn) {
            if (!Array.isArray(this.searchIn)) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_AN_ARRAY), "SEARCH_IN", "SEARCH_IN", "searchIn()")));
                return response;
            }
        }
    };
    
    UsersRequest.prototype.fetchNext = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (!_this.fetchingInProgress) {
                    _this.fetchingInProgress = true;
                    var object = _this.validateUserBuilder();
                    if (object instanceof CustomError_1.CometChatException) {
                        reject(object);
                        return;
                    }
                    HttpHelper_1.makeApiCall("users", {}, _this.getNextData()).then(function (res) {
                        if (res.meta)
                            _this.total_pages = res.meta.pagination.total_pages;
                        if (res.data.length > 0) {
                            _this.pagination = res.meta.pagination;
                            var userList_1 = [];
                            res.data.map(function (user) {
                                userList_1.push(UsersController_1.UsersController.trasformJSONUser(user));
                            });
                            resolve(userList_1);
                        }
                        else
                            resolve([]);
                        _this.fetchingInProgress = false;
                    }, function (err) {
                        _this.fetchingInProgress = false;
                        reject(new CustomError_1.CometChatException(err.error));
                    });
                }
                else {
                    _this.fetchingInProgress = false;
                    resolve([]);
                }
            }
            catch (err) {
                _this.fetchingInProgress = false;
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    UsersRequest.prototype.getNextData = function () {
        var paginationData = {};
        paginationData['per_page'] = this.limit;
        if (!Helper_1.isFalsy(this.searchKeyword))
            paginationData['searchKey'] = this.searchKeyword;
        if (!Helper_1.isFalsy(this.status))
            paginationData['status'] = this.status;
        if (!Helper_1.isFalsy(this.hideBlockedUsers))
            paginationData['hideBlockedUsers'] = 1;
        if (!Helper_1.isFalsy(this.role))
            paginationData['roles'] = this.role;
        if (!Helper_1.isFalsy(this.roles))
            paginationData['roles'] = this.roles;
        if (!Helper_1.isFalsy(this.tags))
            paginationData['tags'] = this.tags;
        if (!Helper_1.isFalsy(this.friendsOnly))
            paginationData['friendsOnly'] = 1;
        if (!Helper_1.isFalsy(this.withTags))
            paginationData['withTags'] = 1;
        if (!Helper_1.isFalsy(this.UIDs))
            paginationData['uids'] = this.UIDs;
        if (!Helper_1.isFalsy(this.sortBy))
            paginationData['sortBy'] = this.sortBy;
        if (!Helper_1.isFalsy(this.sortOrder))
            paginationData['sortOrder'] = this.sortOrder;
        if (!Helper_1.isFalsy(this.searchIn))
            paginationData['searchIn'] = this.searchIn;
        if (this.current_page == 1) {
            paginationData['page'] = this.next_page;
            this.next_page++;
            this.current_page++;
        }
        else {
            if (this.next_page > this.total_pages) {
                paginationData['page'] = this.next_page;
                return paginationData;
            }
            paginationData['page'] = this.next_page++;
        }
        return paginationData;
    };
    UsersRequest.USER_STATUS = { ONLINE: Constants_1.PresenceConstatnts.STATUS.ONLINE, OFFLINE: Constants_1.PresenceConstatnts.STATUS.OFFLINE };
    return UsersRequest;
}());
exports.UsersRequest = UsersRequest;
var UsersRequestBuilder =  (function () {
    function UsersRequestBuilder() {
         this.shouldHideBlockedUsers = false;
    }
    
    UsersRequestBuilder.prototype.setLimit = function (limit) {
        this.limit = limit;
        return this;
    };
    
    UsersRequestBuilder.prototype.setStatus = function (status) {
        this.status = status;
        return this;
    };
    
    UsersRequestBuilder.prototype.setSearchKeyword = function (searchKeyword) {
        this.searchKeyword = searchKeyword;
        return this;
    };
    
    UsersRequestBuilder.prototype.hideBlockedUsers = function (hideBlockedUsers) {
        this.shouldHideBlockedUsers = hideBlockedUsers;
        return this;
    };
    
    UsersRequestBuilder.prototype.setRole = function (role) {
        this.role = role;
        return this;
    };
    
    UsersRequestBuilder.prototype.setRoles = function (roles) {
        this.roles = roles;
        return this;
    };
    
    UsersRequestBuilder.prototype.friendsOnly = function (friendsOnly) {
        this.showFriendsOnly = friendsOnly;
        return this;
    };
    
    UsersRequestBuilder.prototype.setTags = function (tags) {
        this.tags = tags;
        return this;
    };
    
    UsersRequestBuilder.prototype.withTags = function (withTags) {
        this.showTags = withTags;
        return this;
    };
    
    UsersRequestBuilder.prototype.setUIDs = function (uids) {
        this.UIDs = uids;
        return this;
    };
    
    UsersRequestBuilder.prototype.sortBy = function (sortBy) {
        this.SortBy = sortBy;
        return this;
    };
    
    UsersRequestBuilder.prototype.sortByOrder = function (sortOrder) {
        this.SortOrder = sortOrder;
        return this;
    };
    
    UsersRequestBuilder.prototype.searchIn = function (searchIn) {
        this.SearchIn = searchIn;
        return this;
    };
    
    UsersRequestBuilder.prototype.build = function () {
        if (this.role && this.roles) {
            this.roles.push(this.role);
        }
        return new UsersRequest(this);
    };
    return UsersRequestBuilder;
}());
exports.UsersRequestBuilder = UsersRequestBuilder;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.UserStore = void 0;
var CometChat_1 = __webpack_require__(3);
var Helper_1 = __webpack_require__(0);
var Constants_1 = __webpack_require__(1);
var localforage = __webpack_require__(12);

var UserStore =  (function () {
    function UserStore(store) {
        this.store = Constants_1.constants.DEFAULT_STORE;
        if (!Helper_1.isFalsy(store))
            this.store = store;
        this.userStore = localforage.createInstance({
            name: Helper_1.format(Constants_1.LOCAL_STORE.STORE_STRING, CometChat_1.CometChat.getAppId(), Constants_1.LOCAL_STORE.USERS_STORE)
        });
        this.userStore.setDriver([localforage.LOCALSTORAGE, localforage.INDEXEDDB, localforage.WEBSQL]);
    }
    
    UserStore.getInstance = function () {
        if (UserStore.UserStore == null) {
            UserStore.UserStore = new UserStore();
        }
        return UserStore.UserStore;
    };
    
    UserStore.prototype.set = function (key, value) {
        return this.userStore.setItem(key, value);
    };
    
    UserStore.prototype.remove = function (key) {
        this.userStore.removeItem(key);
    };
    
    UserStore.prototype.get = function (key) {
        return this.userStore.getItem(key);
    };
    
    UserStore.prototype.clearStore = function () {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.userStore.clear().then(function () {
                res(true);
            })["catch"](function (err) {
                rej(err);
            });
        });
    };
    
    UserStore.prototype.clear = function (store) {
        
    };
    
    UserStore.prototype.selectStore = function (store) {
        this.store = store;
    };
    
    UserStore.prototype.storeUsers = function (users) {
        var _this = this;
        users.map(function (user) {
            _this.set(user.getUid(), user);
        });
        return true;
    };
    
    UserStore.prototype.storeUser = function (user) {
        this.set(user.getUid(), user);
        return true;
    };
    return UserStore;
}());
exports.UserStore = UserStore;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.ConversationsRequestBuilder = exports.ConversationsRequest = void 0;

var HttpHelper_1 = __webpack_require__(6);
var Helper_1 = __webpack_require__(0);
var CustomError_1 = __webpack_require__(2);
var ConversationController_1 = __webpack_require__(24);
var Constants_1 = __webpack_require__(1);
var ConversationsRequest =  (function () {
    
    function ConversationsRequest(builder) {
        this.limit = 100;
        this.next_page = 1;
        this.current_page = 1;
        this.total_pages = -1;
        this.fetchingInProgress = false;
        this.getUserAndGroupTags = false;
        this.withTags = false;
        this.pagination = {
            total: 0,
            count: 0,
            per_page: 0,
            current_page: 0,
            total_pages: 0,
            links: []
        };
        if (!Helper_1.isFalsy(builder)) {
            this.limit = builder.limit;
            if (!Helper_1.isFalsy(builder.conversationType)) {
                this.conversationType = builder.conversationType;
            }
            if (!Helper_1.isFalsy(builder.getUserAndGroupTags)) {
                this.getUserAndGroupTags = builder.getUserAndGroupTags;
            }
            if (builder.tags) {
                this.tags = builder.tags;
            }
            if (!Helper_1.isFalsy(builder.WithTags)) {
                this.withTags = builder.WithTags;
            }
            if (builder.groupTags) {
                this.groupTags = builder.groupTags;
            }
            if (builder.userTags) {
                this.userTags = builder.userTags;
            }
        }
    }
    ConversationsRequest.prototype.validateConversationBuilder = function () {
        var response;
        if (this.limit !== undefined) {
            if (isNaN(this.limit)) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_NUMBER), "SET_LIMIT", "SET_LIMIT", "setLimit()")));
                return response;
            }
            else if (this.limit > Constants_1.DEFAULT_VALUES.CONVERSATION_MAX_LIMIT) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.LIMIT_EXCEEDED), "SET_LIMIT", "SET_LIMIT", Constants_1.DEFAULT_VALUES.CONVERSATION_MAX_LIMIT)));
                return response;
            }
            else if (this.limit < Constants_1.DEFAULT_VALUES.ZERO) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_POSITIVE_NUMBER), "SET_LIMIT", "SET_LIMIT", "setLimit()")));
                return response;
            }
        }
        else {
            response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.METHOD_COMPULSORY), "SET_LIMIT", "SET_LIMIT", "Set Limit")));
            return response;
        }
    };
    
    ConversationsRequest.prototype.fetchNext = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (!_this.fetchingInProgress) {
                    _this.fetchingInProgress = true;
                    var object = _this.validateConversationBuilder();
                    if (object instanceof CustomError_1.CometChatException) {
                        reject(object);
                        return;
                    }
                    HttpHelper_1.makeApiCall("getConversations", {}, _this.getNextData()).then(function (res) {
                        if (res.meta) {
                            _this.total_pages = res.meta.pagination.total_pages;
                        }
                        if (res.data.length > 0) {
                            _this.pagination = res.meta.pagination;
                            var conversationList_1 = [];
                            res.data.map(function (conversation) {
                                conversationList_1.push(ConversationController_1.ConversationController.trasformJSONConversation(conversation.conversationId, conversation.conversationType, conversation.lastMessage, conversation.conversationWith, parseInt(conversation.unreadMessageCount), conversation.tags ? conversation.tags : []));
                            });
                            resolve(conversationList_1);
                        }
                        else {
                            resolve([]);
                        }
                        _this.fetchingInProgress = false;
                    }, function (err) {
                        _this.fetchingInProgress = false;
                        reject(new CustomError_1.CometChatException(err.error));
                    });
                }
                else {
                    _this.fetchingInProgress = false;
                    resolve([]);
                }
            }
            catch (err) {
                _this.fetchingInProgress = false;
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    ConversationsRequest.prototype.getNextData = function () {
        var paginationData = {};
        paginationData['per_page'] = this.limit;
        if (!Helper_1.isFalsy(this.conversationType)) {
            paginationData['conversationType'] = this.conversationType;
        }
        if (!Helper_1.isFalsy(this.getUserAndGroupTags)) {
            paginationData['withUserAndGroupTags'] = this.getUserAndGroupTags;
        }
        if (!Helper_1.isFalsy(this.tags)) {
            paginationData['tags'] = this.tags;
        }
        if (!Helper_1.isFalsy(this.withTags)) {
            paginationData['withTags'] = this.withTags;
        }
        if (!Helper_1.isFalsy(this.userTags)) {
            paginationData['userTags'] = this.userTags;
        }
        if (!Helper_1.isFalsy(this.groupTags)) {
            paginationData['groupTags'] = this.groupTags;
        }
        if (this.current_page == 1) {
            paginationData['page'] = this.next_page;
            this.next_page++;
            this.current_page++;
        }
        else {
            if (this.next_page > this.total_pages) {
                paginationData['page'] = this.next_page;
                return paginationData;
            }
            paginationData['page'] = this.next_page++;
        }
        return paginationData;
    };
    return ConversationsRequest;
}());
exports.ConversationsRequest = ConversationsRequest;
var ConversationsRequestBuilder =  (function () {
    function ConversationsRequestBuilder() {
         this.WithTags = false;
    }
    
    ConversationsRequestBuilder.prototype.setLimit = function (limit) {
        this.limit = limit;
        return this;
    };
    
    ConversationsRequestBuilder.prototype.setConversationType = function (conversationType) {
        this.conversationType = conversationType;
        return this;
    };
    
    ConversationsRequestBuilder.prototype.withUserAndGroupTags = function (getUserAndGroupTags) {
        if (typeof getUserAndGroupTags === 'boolean') {
            this.getUserAndGroupTags = getUserAndGroupTags;
        }
        return this;
    };
    
    ConversationsRequestBuilder.prototype.setTags = function (tags) {
        this.tags = tags;
        return this;
    };
    
    ConversationsRequestBuilder.prototype.withTags = function (withTags) {
        this.WithTags = withTags;
        return this;
    };
    
    ConversationsRequestBuilder.prototype.setGroupTags = function (groupTags) {
        this.groupTags = groupTags;
        return this;
    };
    
    ConversationsRequestBuilder.prototype.setUserTags = function (userTags) {
        this.userTags = userTags;
        return this;
    };
    
    ConversationsRequestBuilder.prototype.build = function () {
        return new ConversationsRequest(this);
    };
    return ConversationsRequestBuilder;
}());
exports.ConversationsRequestBuilder = ConversationsRequestBuilder;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.MessagesRequestBuilder = exports.MessagesRequest = void 0;
var CustomError_1 = __webpack_require__(2);
var HttpHelper_1 = __webpack_require__(6);
var MessageController_1 = __webpack_require__(10);
var Helper_1 = __webpack_require__(0);
var MessagesStore_1 = __webpack_require__(47);
var Constants_1 = __webpack_require__(1);
var CometChatErrorConstants_1 = __webpack_require__(13);
var MessageListenerEventMaping_1 = __webpack_require__(25);
var MessagesRequest =  (function () {
    function MessagesRequest(builder) {
        this.limit = Constants_1.DEFAULT_VALUES.MSGS_LIMIT;
        this.timestamp = 0;
        this.id = Constants_1.DEFAULT_VALUES.DEFAULT_MSG_ID;
        this.messageStore = MessagesStore_1.MessagesStore.getInstance();
        this.endpointName = "getUserMessages";
        this.listId = "";
        this.totalPages = 0;
        this.unread = false;
        this.inProgress = false;
        this.hideMessagesFromBlockedUsers = false;
        this.updatedAt = 0;
        this.onlyUpdates = 0;
        this.paginationMeta = {};
        this.WithTags = false;
        this.hideDeletedMessages = false;
        this.limit = builder.limit;
        this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.PER_PAGE] = this.limit;
        this.uid = builder.uid;
        this.guid = builder.guid;
        this.parentMessageId = builder.parentMessageId;
        this.timestamp = builder.timestamp;
        if (this.timestamp)
            this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.SENT_AT] = this.timestamp;
        this.id = builder.id;
        if (this.id != Constants_1.DEFAULT_VALUES.DEFAULT_MSG_ID)
            this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.ID] = this.id;
        this.hideMessagesFromBlockedUsers = builder.HideMessagesFromBlockedUsers;
        if (this.hideMessagesFromBlockedUsers)
            this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.HIDE_MESSAGES_FROM_BLOCKED_USER] = this.hideMessagesFromBlockedUsers;
        this.unread = builder.unread;
        if (this.unread)
            this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.UNREAD] = this.unread;
        if (builder.searchKey) {
            this.searchKey = builder.searchKey;
            this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.SEARCH_KEY] = this.searchKey;
        }
        if (builder.onlyUpdate) {
            this.onlyUpdates = builder.onlyUpdate;
            this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.ONLY_UPDATES] = this.onlyUpdates;
        }
        if (builder.updatedAt) {
            this.updatedAt = builder.updatedAt;
            this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.UPDATED_AT] = this.updatedAt;
        }
        if (builder.category) {
            this.category = builder.category;
        }
        if (builder.categories) {
            this.categories = builder.categories;
        }
        if (builder.type) {
            this.type = builder.type;
        }
        if (builder.types) {
            this.types = builder.types;
        }
        if (builder.WithTags) {
            this.WithTags = builder.WithTags;
        }
        if (builder.tags) {
            this.tags = builder.tags;
        }
        if (builder.HideReplies) {
            this.hideReplies = builder.HideReplies;
            this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.HIDE_REPLIES] = this.hideReplies;
        }
        this.hideDeletedMessages = builder.HideDeletedMessages;
        if (this.hideDeletedMessages) {
            this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.HIDE_DELETED_MESSAGES] = this.hideDeletedMessages;
        }
    }
    
    MessagesRequest.prototype.fetchNext = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var messages, e_1, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (this.inProgress) {
                            this.inProgress = false;
                            reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.MESSAGES_REQUEST_ERRORS.REQUEST_IN_PROGRESS_ERROR));
                            return [2 ];
                        }
                        this.inProgress = true;
                        if (this.onlyUpdates) {
                            if (this.updatedAt == 0) {
                                this.inProgress = false;
                                reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.MESSAGES_REQUEST_ERRORS.NOT_ENOUGH_PARAMS));
                                return [2 ];
                            }
                        }
                        else if (this.timestamp == 0 && this.id == 0 && this.updatedAt == 0) {
                            this.inProgress = false;
                            reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.MESSAGES_REQUEST_ERRORS.NOT_ENOUGH_PARAMS));
                            return [2 ];
                        }
                        this.affix = Constants_1.MessageConstatnts.PAGINATION.AFFIX.APPEND;
                        this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.AFFIX] = this.affix;
                        this.currentMethod = Constants_1.MessageConstatnts.PAGINATION.AFFIX.APPEND;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 , this.makeAPICall()];
                    case 2:
                        messages = _a.sent();
                        resolve(messages);
                        this.inProgress = false;
                        return [3 , 4];
                    case 3:
                        e_1 = _a.sent();
                        this.inProgress = false;
                        reject(new CustomError_1.CometChatException(e_1));
                        return [3 , 4];
                    case 4: return [3 , 6];
                    case 5:
                        err_1 = _a.sent();
                        this.inProgress = false;
                        reject(new CustomError_1.CometChatException(err_1));
                        return [3 , 6];
                    case 6: return [2 ];
                }
            });
        }); });
    };
    
    MessagesRequest.prototype.fetchPrevious = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var messages, e_2, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (this.inProgress) {
                            reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.MESSAGES_REQUEST_ERRORS.REQUEST_IN_PROGRESS_ERROR));
                            this.inProgress = false;
                            return [2 ];
                        }
                        this.inProgress = true;
                        if (this.onlyUpdates) {
                            if (this.updatedAt == 0) {
                                this.inProgress = false;
                                reject(new CustomError_1.CometChatException(CometChatErrorConstants_1.MESSAGES_REQUEST_ERRORS.NOT_ENOUGH_PARAMS));
                                return [2 ];
                            }
                        }
                        this.affix = Constants_1.MessageConstatnts.PAGINATION.AFFIX.PREPEND;
                        this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.AFFIX] = this.affix;
                        this.currentMethod = Constants_1.MessageConstatnts.PAGINATION.AFFIX.PREPEND;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 , this.makeAPICall()];
                    case 2:
                        messages = _a.sent();
                        resolve(messages);
                        this.inProgress = false;
                        return [3 , 4];
                    case 3:
                        e_2 = _a.sent();
                        this.inProgress = false;
                        reject(new CustomError_1.CometChatException(e_2));
                        return [3 , 4];
                    case 4: return [3 , 6];
                    case 5:
                        err_2 = _a.sent();
                        this.inProgress = false;
                        reject(new CustomError_1.CometChatException(err_2));
                        return [3 , 6];
                    case 6: return [2 ];
                }
            });
        }); });
    };
    MessagesRequest.prototype.makeAPICall = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var uid = _this.uid;
                if (uid !== undefined) {
                    if (typeof uid !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "UID", "UID", "setUID()"))));
                        return;
                    }
                    else {
                        if (Helper_1.isFalsy(uid.trim())) {
                            reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "UID", "UID", "UID", "UID"))));
                            return;
                        }
                        else {
                            _this.uid = uid.trim();
                        }
                    }
                }
                var guid = _this.guid;
                if (guid !== undefined) {
                    if (typeof guid !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "GUID", "GUID", "setGUID()"))));
                        return;
                    }
                    else {
                        if (Helper_1.isFalsy(guid.trim())) {
                            reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "GUID", "GUID", "GUID", "GUID"))));
                            return;
                        }
                        else {
                            _this.guid = guid.trim();
                        }
                    }
                }
                var parentMessageId = _this.parentMessageId;
                if (parentMessageId !== undefined) {
                    if (isNaN(parentMessageId)) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_NUMBER), "PARENT_MESSAGE_ID", "PARENT_MESSAGE_ID", "setParentMessageId()"))));
                        return;
                    }
                    else if (parentMessageId < Constants_1.DEFAULT_VALUES.ZERO) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_POSITIVE_NUMBER), "PARENT_MESSAGE_ID", "PARENT_MESSAGE_ID", 'setParentMessageId()'))));
                        return;
                    }
                }
                var limit = _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.PER_PAGE];
                if (limit !== undefined) {
                    if (isNaN(limit)) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_NUMBER), "SET_LIMIT", "SET_LIMIT", "setLimit()"))));
                        return;
                    }
                    else if (limit > Constants_1.DEFAULT_VALUES.MSGS_MAX_LIMIT) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.LIMIT_EXCEEDED), "SET_LIMIT", "SET_LIMIT", Constants_1.DEFAULT_VALUES.MSGS_MAX_LIMIT))));
                        return;
                    }
                    else if (limit < Constants_1.DEFAULT_VALUES.ZERO) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_POSITIVE_NUMBER), "SET_LIMIT", "SET_LIMIT", "setLimit()"))));
                        return;
                    }
                }
                else {
                    reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.METHOD_COMPULSORY), "SET_LIMIT", "SET_LIMIT", "Set Limit"))));
                    return;
                }
                var searchKeyword = _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.SEARCH_KEY];
                if (searchKeyword !== undefined) {
                    if (typeof searchKeyword !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "SET_SEARCH_KEYWORD", "SET_SEARCH_KEYWORD", "setSearchKeyword()"))));
                        return;
                    }
                    else {
                        if (Helper_1.isFalsy(searchKeyword.trim())) {
                            reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "SET_SEARCH_KEYWORD", "SET_SEARCH_KEYWORD", "search keyword", "search keyword"))));
                            return;
                        }
                        else {
                            _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.SEARCH_KEY] = searchKeyword.trim();
                        }
                    }
                }
                var msgId = _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.ID];
                if (msgId !== undefined) {
                    if (isNaN(msgId)) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_NUMBER), "MESSAGE_ID", "MESSAGE_ID", "setMessageId()"))));
                        return;
                    }
                    else {
                        if (msgId < Constants_1.DEFAULT_VALUES.ZERO) {
                            reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_POSITIVE_NUMBER), "MESSAGE_ID", "MESSAGE_ID", 'setMessageId()'))));
                            return;
                        }
                    }
                }
                var timestamp = _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.SENT_AT];
                if (timestamp !== undefined) {
                    if (isNaN(timestamp)) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_NUMBER), "TIMESTAMP", "TIMESTAMP", "setTimestamp()"))));
                        return;
                    }
                    else {
                        if (timestamp < Constants_1.DEFAULT_VALUES.ZERO) {
                            reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_POSITIVE_NUMBER), "TIMESTAMP", "TIMESTAMP", 'setTimestamp()'))));
                            return;
                        }
                    }
                }
                var hide = _this.hideMessagesFromBlockedUsers;
                if (hide !== undefined) {
                    if (typeof hide !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.BOOLEAN) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_BOOLEAN), "HIDE_MESSAGES_FROM_BLOCKED_USERS", "HIDE_MESSAGES_FROM_BLOCKED_USERS", "hideMessagesFromBlockedUsers()"))));
                        return;
                    }
                    else {
                        if (hide == true) {
                            _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.HIDE_MESSAGES_FROM_BLOCKED_USER] = 1;
                        }
                        else {
                            _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.HIDE_MESSAGES_FROM_BLOCKED_USER] = 0;
                        }
                    }
                }
                var unread = _this.unread;
                if (unread !== undefined) {
                    if (typeof unread !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.BOOLEAN) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_BOOLEAN), "UNREAD", "UNREAD", "setUnread()"))));
                        return;
                    }
                    else {
                        if (unread == true) {
                            _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.UNREAD] = 1;
                        }
                        else {
                            _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.UNREAD] = 0;
                        }
                    }
                }
                var category = _this.category;
                if (category !== undefined) {
                    if (typeof category !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "SET_CATEGORY", "SET_CATEGORY", "setCategory()"))));
                        return;
                    }
                    else {
                        if (Helper_1.isFalsy(category.trim())) {
                            reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "SET_CATEGORY", "SET_CATEGORY", "category", "category"))));
                            return;
                        }
                        else {
                            _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.CATEGORIES] = category.trim();
                        }
                    }
                }
                var categories = _this.categories;
                if (categories !== undefined) {
                    if (!Array.isArray(categories)) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_AN_ARRAY), "SET_CATEGORIES", "SET_CATEGORIES", "setCategories()"))));
                        return;
                    }
                    else {
                        if (categories.length > 0) {
                            _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.CATEGORIES] = categories;
                        }
                    }
                }
                var type = _this.type;
                if (type !== undefined) {
                    if (typeof type !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "SET_TYPE", "SET_TYPE", "setType()"))));
                        return;
                    }
                    else {
                        if (Helper_1.isFalsy(type.trim())) {
                            reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "SET_TYPE", "SET_TYPE", "type", "type"))));
                            return;
                        }
                        else {
                            _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.TYPES] = type.trim();
                        }
                    }
                }
                var types = _this.types;
                if (types !== undefined) {
                    if (!Array.isArray(types)) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_AN_ARRAY), "SET_TYPES", "SET_TYPES", "setTypes()"))));
                        return;
                    }
                    else {
                        if (types.length > 0) {
                            _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.TYPES] = types;
                        }
                    }
                }
                var tags = _this.tags;
                if (tags !== undefined) {
                    if (!Array.isArray(tags)) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_AN_ARRAY), "SET_TAGS", "SET_TAGS", "setTags()"))));
                        return;
                    }
                    else {
                        if (tags.length > 0) {
                            _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.TAGS] = tags;
                        }
                    }
                }
                var withTags = _this.WithTags;
                if (withTags !== undefined) {
                    if (typeof withTags !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.BOOLEAN) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_BOOLEAN), "WITH_TAGS", "WITH_TAGS", "withTags()"))));
                        return;
                    }
                    else {
                        if (withTags == true) {
                            _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.WITH_TAGS] = 1;
                        }
                        else {
                            _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.WITH_TAGS] = 0;
                        }
                    }
                }
                var hideDeletedMessages = _this.hideDeletedMessages;
                if (hideDeletedMessages !== undefined) {
                    if (typeof hideDeletedMessages !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.BOOLEAN) {
                        reject(new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_BOOLEAN), "HIDE_DELETED_MESSAGES", "HIDE_DELETED_MESSAGES", "hideDeletedMessages()"))));
                        return;
                    }
                    else {
                        if (hideDeletedMessages == true) {
                            _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.HIDE_DELETED_MESSAGES] = 1;
                        }
                        else {
                            _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.HIDE_DELETED_MESSAGES] = 0;
                        }
                    }
                }
                _this.createEndpoint();
                if (_this.totalPages) {
                    if (_this.totalPages != 1) {
                    }
                    else {
                        if (_this.lastAffix == _this.affix) {
                            resolve([]);
                            return;
                        }
                    }
                }
                HttpHelper_1.makeApiCall(_this.endpointName, { listId: _this.listId }, _this.paginationMeta).then(function (response) { return __awaiter(_this, void 0, void 0, function () {
                    var responseArray;
                    var _this = this;
                    return __generator(this, function (_a) {
                        responseArray = [];
                        if (response[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_META][Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_CURSOR].hasOwnProperty(Constants_1.MessageConstatnts.PAGINATION.KEYS.ID)) {
                            if (this.id == 0)
                                this.id = parseInt(response.meta.cursor[Constants_1.MessageConstatnts.PAGINATION.KEYS.ID]);
                        }
                        if (response[Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_META][Constants_1.ResponseConstants.RESPONSE_KEYS.KEY_CURSOR].hasOwnProperty(Constants_1.MessageConstatnts.PAGINATION.KEYS.SENT_AT)) {
                            if (this.timestamp == 0)
                                this.timestamp = response.meta.cursor[Constants_1.MessageConstatnts.PAGINATION.KEYS.SENT_AT];
                        }
                        if (response.meta.pagination.hasOwnProperty('total_pages'))
                            this.totalPages = response.meta.pagination.total_pages;
                        if (response.meta.cursor.hasOwnProperty('affix'))
                            this.lastAffix = response.meta.cursor.affix;
                        if (response.data[0]) {
                            if (this.id > 0)
                                this.id = parseInt(response.data[0].id);
                            if (this.timestamp > 0)
                                this.timestamp = response.data[0].sentAt;
                            response.data.map(function (message) {
                                MessageListenerEventMaping_1.MessageListnerMaping.getInstance().get(Constants_1.LOCAL_STORE.KEY_MESSAGE_LISTENER_LIST).then(function (id) {
                                    if (parseInt(message.id) > id)
                                        MessageListenerEventMaping_1.MessageListnerMaping.getInstance().set(Constants_1.LOCAL_STORE.KEY_MESSAGE_LISTENER_LIST, parseInt(message.id));
                                }, function (error) {
                                    MessageListenerEventMaping_1.MessageListnerMaping.getInstance().set(Constants_1.LOCAL_STORE.KEY_MESSAGE_LISTENER_LIST, parseInt(message.id));
                                });
                                if (_this.affix == Constants_1.MessageConstatnts.PAGINATION.AFFIX.APPEND) {
                                    if (_this.id < parseInt(message.id) && _this.id > 0) {
                                        _this.id = parseInt(message.id);
                                    }
                                    if (_this.timestamp < message.sentAt && _this.timestamp > 0) {
                                        _this.timestamp = message.sentAt;
                                    }
                                    if (_this.updatedAt < message.updatedAt && _this.updatedAt > 0) {
                                        _this.updatedAt = message.updatedAt;
                                    }
                                }
                                else {
                                    if (_this.id > parseInt(message.id)) {
                                        _this.id = parseInt(message.id);
                                    }
                                    if (_this.timestamp > message.sentAt) {
                                        _this.timestamp = message.sentAt;
                                    }
                                    if (_this.updatedAt > message.updatedAt) {
                                        _this.updatedAt = message.updatedAt;
                                    }
                                }
                                if (_this.id)
                                    _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.ID] = _this.id;
                                if (_this.timestamp)
                                    _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.SENT_AT] = _this.timestamp;
                                if (_this.updatedAt)
                                    _this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.UPDATED_AT] = _this.updatedAt;
                                responseArray.push(MessageController_1.MessageController.trasformJSONMessge(message));
                            });
                        }
                        else {
                            responseArray = [];
                        }
                        resolve(responseArray);
                        return [2 ];
                    });
                }); }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    MessagesRequest.prototype.createEndpoint = function () {
        if (this.parentMessageId) {
            this.endpointName = "getThreadMessages";
            this.listId = this.parentMessageId.toString();
            if (this.hideReplies) {
                this.hideReplies = false;
                delete this.paginationMeta[Constants_1.MessageConstatnts.PAGINATION.KEYS.HIDE_REPLIES];
            }
        }
        else {
            if (!Helper_1.isFalsy(this.guid) && !Helper_1.isFalsy(this.uid)) {
                this.endpointName = "getGroupMessages";
                this.listId = this.guid;
            }
            else if (!Helper_1.isFalsy(this.guid)) {
                this.endpointName = "getGroupMessages";
                this.listId = this.guid;
            }
            else if (!Helper_1.isFalsy(this.uid)) {
                this.endpointName = "getUserMessages";
                this.listId = this.uid;
            }
            else {
                this.endpointName = "getMessages";
                this.listId = this.uid;
            }
        }
    };
    MessagesRequest.prototype.makeData = function () {
        var paginationData = {};
        paginationData[Constants_1.MessageConstatnts.PAGINATION.KEYS.PER_PAGE] = this.limit;
        paginationData[Constants_1.MessageConstatnts.PAGINATION.KEYS.AFFIX] = this.affix;
        if (!Helper_1.isFalsy(this.guid) && !Helper_1.isFalsy(this.uid)) {
        }
        else if (!Helper_1.isFalsy(this.guid)) {
        }
        else if (!Helper_1.isFalsy(this.uid)) {
        }
        else {
        }
    };
    MessagesRequest.prototype.getFilteredPreviousDataByReceiverId = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var filteredMessages, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        filteredMessages = [];
                        _a = type;
                        switch (_a) {
                            case "user": return [3 , 1];
                            case "group": return [3 , 3];
                            case "both": return [3 , 5];
                        }
                        return [3 , 7];
                    case 1: return [4 , MessagesStore_1.MessagesStore.getInstance().get(this.uid).then(function (messages) {
                            Object.keys(messages).filter(function (key) { return parseInt(key) > _this.id; }).map(function (key) {
                                filteredMessages = __spreadArrays(filteredMessages, [messages[key]]);
                            });
                        })];
                    case 2:
                        _b.sent();
                        return [3 , 9];
                    case 3: return [4 , MessagesStore_1.MessagesStore.getInstance().get(this.guid).then(function (messages) {
                            Object.keys(messages).filter(function (key) { return parseInt(key) > _this.id; }).map(function (key) {
                                filteredMessages = __spreadArrays(filteredMessages, [messages[key]]);
                            });
                        })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [4 , MessagesStore_1.MessagesStore.getInstance().get(this.guid).then(function (messages) {
                            Object.keys(messages).filter(function (key) { return parseInt(key) > _this.id; }).filter(function (key) {
                                return messages[key]["sender"]["uid"] == _this.uid;
                            }).map(function (key) {
                                filteredMessages = __spreadArrays(filteredMessages, [messages[key]]);
                            });
                        })];
                    case 6:
                        _b.sent();
                        return [3 , 9];
                    case 7: return [4 , MessagesStore_1.MessagesStore.getInstance().getAllMessages().then(function (messages) {
                            Object.keys(messages).filter(function (key) { return parseInt(key) > _this.id; }).map(function (key) {
                                filteredMessages = __spreadArrays(filteredMessages, [messages[key]]);
                            });
                        })];
                    case 8:
                        _b.sent();
                        return [3 , 9];
                    case 9: return [2 , filteredMessages];
                }
            });
        });
    };
    MessagesRequest.prototype.getFilteredNextDataByReceiverId = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var filteredMessages, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        filteredMessages = [];
                        _a = type;
                        switch (_a) {
                            case "user": return [3 , 1];
                            case "group": return [3 , 3];
                            case "both": return [3 , 5];
                        }
                        return [3 , 7];
                    case 1: return [4 , MessagesStore_1.MessagesStore.getInstance().get(this.uid).then(function (messages) {
                            Object.keys(messages).filter(function (key) { return parseInt(key) > _this.id; }).map(function (key) {
                                filteredMessages = __spreadArrays(filteredMessages, [messages[key]]);
                            });
                        })];
                    case 2:
                        _b.sent();
                        return [3 , 9];
                    case 3: return [4 , MessagesStore_1.MessagesStore.getInstance().get(this.guid).then(function (messages) {
                            Object.keys(messages).filter(function (key) { return parseInt(key) > _this.id; }).map(function (key) {
                                filteredMessages = __spreadArrays(filteredMessages, [messages[key]]);
                            });
                        })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [4 , MessagesStore_1.MessagesStore.getInstance().get(this.guid).then(function (messages) {
                            Object.keys(messages).filter(function (key) { return parseInt(key) > _this.id; }).filter(function (key) {
                                return messages[key]["sender"]["uid"] == _this.uid;
                            }).map(function (key) {
                                filteredMessages = __spreadArrays(filteredMessages, [messages[key]]);
                            });
                        })];
                    case 6:
                        _b.sent();
                        return [3 , 9];
                    case 7: return [4 , MessagesStore_1.MessagesStore.getInstance().getAllMessages().then(function (messages) {
                            Object.keys(messages).filter(function (key) { return parseInt(key) > _this.id; }).map(function (key) {
                                filteredMessages = __spreadArrays(filteredMessages, [messages[key]]);
                            });
                        })];
                    case 8:
                        _b.sent();
                        return [3 , 9];
                    case 9: return [2 , filteredMessages];
                }
            });
        });
    };
    return MessagesRequest;
}());
exports.MessagesRequest = MessagesRequest;
var MessagesRequestBuilder =  (function () {
    function MessagesRequestBuilder() {
         this.maxLimit = Constants_1.DEFAULT_VALUES.MSGS_MAX_LIMIT;
         this.timestamp = 0;
         this.id = Constants_1.DEFAULT_VALUES.DEFAULT_MSG_ID;
         this.unread = false;
         this.HideMessagesFromBlockedUsers = false;
         this.onlyUpdate = 0;
         this.HideDeletedMessages = false;
         this.WithTags = false;
    }
    
    MessagesRequestBuilder.prototype.setLimit = function (limit) {
        this.limit = limit;
        return this;
    };
    
    MessagesRequestBuilder.prototype.setGUID = function (guid) {
        this.guid = guid;
        return this;
    };
    
    MessagesRequestBuilder.prototype.setUID = function (uid) {
        this.uid = uid;
        return this;
    };
    
    MessagesRequestBuilder.prototype.setParentMessageId = function (parentMessageId) {
        this.parentMessageId = parentMessageId;
        return this;
    };
    
    MessagesRequestBuilder.prototype.setTimestamp = function (timestamp) {
        if (timestamp === void 0) { timestamp = Helper_1.getCurrentTime(); }
        this.timestamp = timestamp;
        return this;
    };
    
    MessagesRequestBuilder.prototype.setMessageId = function (id) {
        if (id === void 0) { id = Constants_1.DEFAULT_VALUES.DEFAULT_MSG_ID; }
        this.id = id;
        return this;
    };
    
    MessagesRequestBuilder.prototype.setUnread = function (unread) {
        if (unread === void 0) { unread = false; }
        this.unread = unread;
        return this;
    };
    
    MessagesRequestBuilder.prototype.hideMessagesFromBlockedUsers = function (hideMessagesFromBlockedUsers) {
        if (hideMessagesFromBlockedUsers === void 0) { hideMessagesFromBlockedUsers = false; }
        this.HideMessagesFromBlockedUsers = hideMessagesFromBlockedUsers;
        return this;
    };
    
    MessagesRequestBuilder.prototype.setSearchKeyword = function (searchKey) {
        this.searchKey = searchKey;
        return this;
    };
    
    MessagesRequestBuilder.prototype.setUpdatedAfter = function (updatedAt) {
        this.updatedAt = updatedAt;
        return this;
    };
    
    MessagesRequestBuilder.prototype.updatesOnly = function (onlyUpdate) {
        if (onlyUpdate)
            this.onlyUpdate = 1;
        return this;
    };
    
    MessagesRequestBuilder.prototype.setCategory = function (category) {
        this.category = category;
        return this;
    };
    
    MessagesRequestBuilder.prototype.setCategories = function (categories) {
        this.categories = categories;
        return this;
    };
    
    MessagesRequestBuilder.prototype.setType = function (type) {
        this.type = type;
        return this;
    };
    
    MessagesRequestBuilder.prototype.setTypes = function (types) {
        this.types = types;
        return this;
    };
    
    MessagesRequestBuilder.prototype.hideReplies = function (hideReplies) {
        this.HideReplies = hideReplies;
        return this;
    };
    
    MessagesRequestBuilder.prototype.hideDeletedMessages = function (hideDeletedMessages) {
        this.HideDeletedMessages = hideDeletedMessages;
        return this;
    };
    
    MessagesRequestBuilder.prototype.setTags = function (tags) {
        this.tags = tags;
        return this;
    };
    
    MessagesRequestBuilder.prototype.withTags = function (withTags) {
        this.WithTags = withTags;
        return this;
    };
    
    MessagesRequestBuilder.prototype.build = function () {
        if (this.category && this.categories) {
            this.categories.push(this.category);
        }
        if (this.type && this.types) {
            this.types.push(this.type);
        }
        return new MessagesRequest(this);
    };
    return MessagesRequestBuilder;
}());
exports.MessagesRequestBuilder = MessagesRequestBuilder;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.MessagesStore = void 0;
var CometChat_1 = __webpack_require__(3);
var Helper_1 = __webpack_require__(0);
var Constants_1 = __webpack_require__(1);
var localforage = __webpack_require__(12);

var MessagesStore =  (function () {
    function MessagesStore(store) {
        this.store = Constants_1.constants.DEFAULT_STORE;
        if (!Helper_1.isFalsy(store))
            this.store = store;
        this.messagesStore = localforage.createInstance({
            name: Helper_1.format(Constants_1.LOCAL_STORE.STORE_STRING, CometChat_1.CometChat.getAppId(), Constants_1.LOCAL_STORE.MESSAGES_STORE)
        });
        this.messagesStore.setDriver([localforage.LOCALSTORAGE, localforage.INDEXEDDB, localforage.WEBSQL]);
    }
    
    MessagesStore.getInstance = function () {
        if (MessagesStore.MessagesStore == null) {
            MessagesStore.MessagesStore = new MessagesStore();
        }
        return MessagesStore.MessagesStore;
    };
    
    MessagesStore.prototype.set = function (key, value) {
        return this.messagesStore.setItem(key, value);
    };
    
    MessagesStore.prototype.remove = function (key) {
        this.messagesStore.removeItem(key);
    };
    
    MessagesStore.prototype.get = function (key) {
        return this.messagesStore.getItem(key);
    };
    
    MessagesStore.prototype.clearStore = function () {
        var _this = this;
        return new Promise(function (res, rej) {
            _this.messagesStore.clear().then(function () {
                res(true);
            })["catch"](function (err) {
                rej(err);
            });
        });
    };
    
    MessagesStore.prototype.getAllMessages = function () {
        var _this = this;
        var messages = {};
        return new Promise(function (resolve, reject) {
            _this.messagesStore.iterate(function (value, key, iterationNumber) {
                if (key != Constants_1.constants.MSG_VER_POST && key != Constants_1.constants.MSG_VER_POST)
                    messages = __assign(__assign({}, messages), value);
            }).then(function () {
                resolve(messages);
            });
        });
    };
    
    MessagesStore.prototype.clear = function (store) { };
    
    MessagesStore.prototype.selectStore = function (store) {
        this.store = store;
    };
    
    MessagesStore.prototype.storeMessages = function (messages) {
        var _this = this;
        if (CometChat_1.CometChat.user.getUid()) {
            var myUid_1 = CometChat_1.CometChat.user.getUid();
            var messageObject = {};
            var pre_1 = 0;
            var post = 0;
            this.get(Constants_1.constants.MSG_VER_POST).then(function (post) {
                messages.map(function (message) {
                    var _a;
                    if (!Helper_1.isFalsy(message)) {
                        if (pre_1 == 0)
                            pre_1 = parseInt(message.getId().toString());
                        if (pre_1 > message.getId())
                            pre_1 = parseInt(message.getId().toString());
                        if (post < message.getId())
                            post = parseInt(message.getId().toString());
                        var storeKey = void 0;
                        if (message.getSender() instanceof Object) {
                            storeKey = message.getSender().getUid();
                        }
                        else
                            storeKey = message.getSender();
                        if (message.getReceiverType() == Constants_1.MessageConstatnts.RECEIVER_TYPE.GROUP)
                            storeKey = message.getReceiver();
                        if (message.getSender() instanceof Object) {
                            if (message.getSender().getUid() == myUid_1) {
                                storeKey = message.getReceiver();
                            }
                        }
                        else {
                            if (message.getSender() == myUid_1) {
                                storeKey = message.getReceiver();
                            }
                        }
                        if (!messageObject[storeKey]) {
                            messageObject[storeKey] = {};
                        }
                        messageObject[storeKey] = __assign(__assign({}, messageObject[storeKey]), (_a = {}, _a[message.getId()] = message, _a));
                    }
                });
                if (_this.get(Constants_1.constants.MSG_VER_PRE).then(function (preInfo) {
                    if ((pre_1 > 0 && preInfo > pre_1) || preInfo == null)
                        _this.set(Constants_1.constants.MSG_VER_PRE, pre_1);
                }))
                    if (post > 0)
                        _this.set(Constants_1.constants.MSG_VER_POST, post);
                Object.keys(messageObject).map(function (key) {
                    _this.get(key).then(function (userMessages) {
                        if (userMessages == null)
                            userMessages = {};
                        _this.set(key, __assign(__assign({}, messageObject[key]), userMessages));
                    });
                });
            });
            return true;
        }
    };
    return MessagesStore;
}());
exports.MessagesStore = MessagesStore;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.BlockedUsersRequestBuilder = exports.BlockedUsersRequest = void 0;
var HttpHelper_1 = __webpack_require__(6);
var Helper_1 = __webpack_require__(0);
var UsersController_1 = __webpack_require__(11);
var CustomError_1 = __webpack_require__(2);
var Constants_1 = __webpack_require__(1);
var BlockedUsersRequest =  (function () {
    
    function BlockedUsersRequest(builder) {
        this.next_page = 1;
        this.current_page = 1;
        this.total_pages = -1;
        this.fetchingInProgress = false;
        this.pagination = {
            total: 0,
            count: 0,
            per_page: 0,
            current_page: 0,
            total_pages: 0,
            links: []
        };
        if (!Helper_1.isFalsy(builder)) {
            this.limit = builder.limit;
            if (!Helper_1.isFalsy(builder.searchKeyword))
                this.searchKeyword = builder.searchKeyword;
            if (!Helper_1.isFalsy(builder.direction))
                this.direction = builder.direction;
        }
    }
    BlockedUsersRequest.prototype.validateBlockedUsersBuilder = function () {
        var response;
        if (this.limit !== undefined) {
            if (isNaN(this.limit)) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_NUMBER), "SET_LIMIT", "SET_LIMIT", "setLimit()")));
                return response;
            }
            else if (this.limit > Constants_1.DEFAULT_VALUES.USERS_MAX_LIMIT) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.LIMIT_EXCEEDED), "SET_LIMIT", "SET_LIMIT", Constants_1.DEFAULT_VALUES.USERS_MAX_LIMIT)));
                return response;
            }
            else if (this.limit < Constants_1.DEFAULT_VALUES.ZERO) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_POSITIVE_NUMBER), "SET_LIMIT", "SET_LIMIT", "setLimit()")));
                return response;
            }
        }
        else {
            response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.METHOD_COMPULSORY), "SET_LIMIT", "SET_LIMIT", "Set Limit")));
            return response;
        }
        if (this.searchKeyword !== undefined) {
            if (typeof this.searchKeyword !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "SET_SEARCH_KEYWORD", "SET_SEARCH_KEYWORD", "setSearchKeyword()")));
                return response;
            }
            else {
                if (Helper_1.isFalsy(this.searchKeyword.trim())) {
                    response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.INVALID), "SET_SEARCH_KEYWORD", "SET_SEARCH_KEYWORD", "search keyword", "search keyword")));
                    return response;
                }
                else {
                    this.searchKeyword = this.searchKeyword.trim();
                }
            }
        }
        if (this.direction !== undefined) {
            if (typeof this.direction !== Constants_1.COMMON_UTILITY_CONSTANTS.TYPE_CONSTANTS.STRING) {
                response = new CustomError_1.CometChatException(JSON.parse(Helper_1.format(JSON.stringify(Constants_1.GENERAL_ERROR.PARAMETER_MUST_BE_A_STRING), "SET_DIRECTION", "SET_DIRECTION", "setDirection()")));
                return response;
            }
            else {
                if (!(this.direction == Constants_1.BlockedUsersConstants.REQUEST_KEYS.DIRECTIONS.BOTH || this.direction == Constants_1.BlockedUsersConstants.REQUEST_KEYS.DIRECTIONS.BLOCKED_BY_ME || this.direction == Constants_1.BlockedUsersConstants.REQUEST_KEYS.DIRECTIONS.HAS_BLOCKED_ME)) {
                    response = new CustomError_1.CometChatException(Constants_1.UserErrors.INVALID_DIRECTION);
                    return response;
                }
            }
        }
    };
    
    BlockedUsersRequest.prototype.fetchNext = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                if (!_this.fetchingInProgress) {
                    _this.fetchingInProgress = true;
                    var object = _this.validateBlockedUsersBuilder();
                    if (object instanceof CustomError_1.CometChatException) {
                        reject(object);
                        return;
                    }
                    HttpHelper_1.makeApiCall("blockedUsersList", {}, _this.getNextData()).then(function (res) {
                        if (res.meta)
                            _this.total_pages = res.meta.pagination.total_pages;
                        if (res.data.length > 0) {
                            _this.pagination = res.meta.pagination;
                            var userList_1 = [];
                            var users = [];
                            res.data.map(function (user) {
                                userList_1.push(UsersController_1.UsersController.trasformJSONUser(user));
                            });
                            resolve(userList_1);
                        }
                        else
                            resolve([]);
                        _this.fetchingInProgress = false;
                    }, function (err) {
                        _this.fetchingInProgress = false;
                        reject(new CustomError_1.CometChatException(err.error));
                    });
                }
                else {
                    _this.fetchingInProgress = false;
                    resolve([]);
                }
            }
            catch (err) {
                _this.fetchingInProgress = false;
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    
    BlockedUsersRequest.prototype.getNextData = function () {
        var paginationData = {};
        paginationData['per_page'] = this.limit;
        if (!Helper_1.isFalsy(this.direction))
            paginationData['direction'] = this.direction;
        if (!Helper_1.isFalsy(this.searchKeyword))
            paginationData['searchKey'] = this.searchKeyword;
        if (this.current_page == 1) {
            paginationData['page'] = this.next_page;
            this.next_page++;
            this.current_page++;
        }
        else {
            if (this.next_page > this.total_pages) {
                paginationData['page'] = this.next_page;
                return paginationData;
            }
            paginationData['page'] = this.next_page++;
        }
        return paginationData;
    };
    BlockedUsersRequest.MAX_LIMIT = 2;
    BlockedUsersRequest.DEFAULT_LIMIT = 1;
    BlockedUsersRequest.directions = Constants_1.BlockedUsersConstants.REQUEST_KEYS.DIRECTIONS;
    return BlockedUsersRequest;
}());
exports.BlockedUsersRequest = BlockedUsersRequest;
var BlockedUsersRequestBuilder =  (function () {
    function BlockedUsersRequestBuilder() {
    }
    
    BlockedUsersRequestBuilder.prototype.setLimit = function (limit) {
        this.limit = limit;
        return this;
    };
    
    BlockedUsersRequestBuilder.prototype.setSearchKeyword = function (searchKeyword) {
        this.searchKeyword = searchKeyword;
        return this;
    };
    
    BlockedUsersRequestBuilder.prototype.setDirection = function (direction) {
        this.direction = direction;
        return this;
    };
    
    BlockedUsersRequestBuilder.prototype.blockedByMe = function () {
        this.direction = Constants_1.BlockedUsersConstants.REQUEST_KEYS.DIRECTIONS.BLOCKED_BY_ME;
        return this;
    };
    
    BlockedUsersRequestBuilder.prototype.hasBlockedMe = function () {
        this.direction = Constants_1.BlockedUsersConstants.REQUEST_KEYS.DIRECTIONS.HAS_BLOCKED_ME;
        return this;
    };
    
    BlockedUsersRequestBuilder.prototype.build = function () {
        return new BlockedUsersRequest(this);
    };
    return BlockedUsersRequestBuilder;
}());
exports.BlockedUsersRequestBuilder = BlockedUsersRequestBuilder;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.AppSettingsBuilder = exports.AppSettings = void 0;

var Constants_1 = __webpack_require__(1);
var AppSettings =  (function () {
    
    function AppSettings(builder) {
        
        this.subscriptionType = AppSettings.SUBSCRIPTION_TYPE_NONE;
        
        this.roles = null;
        
        this.region = Constants_1.DEFAULT_VALUES.REGION_DEFAULT;
        
        this.autoJoinGroup = true;
        
        this.establishSocketConnection = true;
        
        this.adminHost = null;
        
        this.clientHost = null;
        this.subscriptionType = builder.subscriptionType;
        this.roles = builder.roles;
        this.region = builder.region;
        this.autoJoinGroup = builder.autoJoinGroup;
        this.establishSocketConnection = builder.establishSocketConnection;
        this.adminHost = builder.adminHost;
        this.clientHost = builder.clientHost;
    }
    
    AppSettings.prototype.getSubscriptionType = function () {
        return this.subscriptionType;
    };
    
    AppSettings.prototype.getRoles = function () {
        return this.roles;
    };
    
    AppSettings.prototype.getRegion = function () {
        return this.region;
    };
    
    AppSettings.prototype.getIsAutoJoinEnabled = function () {
        return this.autoJoinGroup;
    };
    
    AppSettings.prototype.shouldAutoEstablishSocketConnection = function () {
        return this.establishSocketConnection;
    };
    
    AppSettings.prototype.getAdminHost = function () {
        return this.adminHost;
    };
    
    AppSettings.prototype.getClientHost = function () {
        return this.clientHost;
    };
    AppSettings.SUBSCRIPTION_TYPE_NONE = "NONE";
    AppSettings.SUBSCRIPTION_TYPE_ALL_USERS = "ALL_USERS";
    AppSettings.SUBSCRIPTION_TYPE_ROLES = "ROLES";
    AppSettings.SUBSCRIPTION_TYPE_FRIENDS = "FRIENDS";
    
    AppSettings.REGION_EU = Constants_1.DEFAULT_VALUES.REGION_DEFAULT_EU;
    
    AppSettings.REGION_US = Constants_1.DEFAULT_VALUES.REGION_DEFAULT_US;
    
    AppSettings.REGION_IN = Constants_1.DEFAULT_VALUES.REGION_DEFAULT_IN;
    
    AppSettings.REGION_PRIVATE = Constants_1.DEFAULT_VALUES.REGION_DEFAULT_PRIVATE;
    return AppSettings;
}());
exports.AppSettings = AppSettings;
var AppSettingsBuilder =  (function () {
    function AppSettingsBuilder() {
        
        this.subscriptionType = AppSettings.SUBSCRIPTION_TYPE_NONE;
        
        this.roles = null;
        
        this.region = Constants_1.DEFAULT_VALUES.REGION_DEFAULT;
        
        this.autoJoinGroup = true;
        
        this.establishSocketConnection = true;
        
        this.adminHost = null;
        
        this.clientHost = null;
    }
    
    AppSettingsBuilder.prototype.subscribePresenceForAllUsers = function () {
        this.subscriptionType = AppSettings.SUBSCRIPTION_TYPE_ALL_USERS;
        return this;
    };
    
    AppSettingsBuilder.prototype.subscribePresenceForRoles = function (roles) {
        this.subscriptionType = AppSettings.SUBSCRIPTION_TYPE_ROLES;
        this.roles = roles;
        return this;
    };
    
    AppSettingsBuilder.prototype.subscribePresenceForFriends = function () {
        this.subscriptionType = AppSettings.SUBSCRIPTION_TYPE_FRIENDS;
        return this;
    };
    
    AppSettingsBuilder.prototype.setRegion = function (region) {
        if (region === void 0) { region = Constants_1.DEFAULT_VALUES.REGION_DEFAULT; }
        this.region = region.toLowerCase();
        return this;
    };
    
    AppSettingsBuilder.prototype.enableAutoJoinForGroups = function (isAutoJoinEnabled) {
        if (isAutoJoinEnabled === void 0) { isAutoJoinEnabled = true; }
        this.autoJoinGroup = isAutoJoinEnabled;
        return this;
    };
    
    AppSettingsBuilder.prototype.autoEstablishSocketConnection = function (establishSocketConnection) {
        if (establishSocketConnection === void 0) { establishSocketConnection = true; }
        this.establishSocketConnection = establishSocketConnection;
        return this;
    };
    
    AppSettingsBuilder.prototype.overrideAdminHost = function (adminHost) {
        this.adminHost = adminHost;
        return this;
    };
    
    AppSettingsBuilder.prototype.overrideClientHost = function (clientHost) {
        this.clientHost = clientHost;
        return this;
    };
    
    AppSettingsBuilder.prototype.build = function () {
        return new AppSettings(this);
    };
    return AppSettingsBuilder;
}());
exports.AppSettingsBuilder = AppSettingsBuilder;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.CometChatHelper = void 0;

var MessageController_1 = __webpack_require__(10);
var Constants_1 = __webpack_require__(1);
var UsersController_1 = __webpack_require__(11);
var GroupsController_1 = __webpack_require__(15);
var ConversationController_1 = __webpack_require__(24);
var CometChat_1 = __webpack_require__(3);
var CustomError_1 = __webpack_require__(2);
var Helper_1 = __webpack_require__(0);
var CometChatHelper =  (function () {
    
    function CometChatHelper() {
    }
    
    CometChatHelper.processMessage = function (message) {
        try {
            return MessageController_1.MessageController.trasformJSONMessge(message);
        }
        catch (err) {
            Helper_1.Logger.error("CometChatHelper: processMessage", err);
        }
    };
    
    
    CometChatHelper.getConversationFromMessage = function (message) {
        return new Promise(function (resolve, reject) {
            try {
                CometChat_1.CometChat.getLoggedinUser().then(function (user) {
                    if (user !== null) {
                        var messageJSON = MessageController_1.MessageController.trasformJSONMessge(message);
                        var conversationType = messageJSON.receiverType;
                        var conversationId = messageJSON.conversationId;
                        var conversationWith = void 0;
                        var lastMessage = MessageController_1.MessageController.trasformJSONMessge(message);
                        if (conversationType == Constants_1.MessageConstatnts.RECEIVER_TYPE.USER) {
                            var sender = UsersController_1.UsersController.trasformJSONUser(messageJSON[Constants_1.MessageConstatnts.KEYS.SENDER]);
                            if (sender.getUid() == user.getUid()) {
                                conversationWith = UsersController_1.UsersController.trasformJSONUser(messageJSON[Constants_1.MessageConstatnts.KEYS.RECEIVER]);
                            }
                            else {
                                conversationWith = sender;
                            }
                        }
                        else {
                            conversationWith = GroupsController_1.GroupsController.trasformJSONGroup(messageJSON[Constants_1.MessageConstatnts.KEYS.RECEIVER]);
                        }
                        var conversation = ConversationController_1.ConversationController.trasformJSONConversation(conversationId, conversationType, lastMessage, conversationWith, 0, []);
                        resolve(conversation);
                    }
                    else {
                        reject(Constants_1.UserErrors.USER_NOT_LOGGED_IN);
                    }
                }, function (error) {
                    reject(new CustomError_1.CometChatException(error.error));
                });
            }
            catch (err) {
                reject(new CustomError_1.CometChatException(err));
            }
        });
    };
    return CometChatHelper;
}());
exports.CometChatHelper = CometChatHelper;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.MainVideoContainerSetting = exports.VirtualBackgroundBuilder = exports.VirtualBackground = exports.CallSettingsBuilder = exports.CallSettings = void 0;
var Constants_1 = __webpack_require__(1);
var Helper_1 = __webpack_require__(0);
var CallSettings =  (function () {
    function CallSettings(builder) {
        this.sessionID = builder.sessionID;
        this.defaultLayout = builder.defaultLayout;
        this.isAudioOnly = builder.isAudioOnly;
        this.region = builder.region;
        this.user = builder.user;
        this.mode = builder.mode;
        this.domain = builder.domain;
        this.ShowEndCallButton = builder.ShowEndCallButton;
        this.ShowMuteAudioButton = builder.ShowMuteAudioButton;
        this.ShowPauseVideoButton = builder.ShowPauseVideoButton;
        this.ShowScreenShareButton = builder.ShowScreenShareButton;
        this.ShowSwitchModeButton = builder.ShowSwitchModeButton;
        this.StartAudioMuted = builder.StartAudioMuted;
        this.StartVideoMuted = builder.StartVideoMuted;
        this.localizedObject = builder.localizedObject;
        this.analyticsSettings = builder.analyticsSettings;
        this.appId = builder.appId;
        this.customCSS = builder.customCSS;
        this.ShowRecordingButton = builder.ShowRecordingButton;
        this.StartRecordingOnCallStart = builder.StartRecordingOnCallStart;
        this.useLegacyUI = builder.useLegacyUI;
        this.ShowSwitchToVideoCallButton = builder.ShowSwitchToVideoCallButton;
        this.VirtualBackground = builder.virtualBackground;
        this.ShowVirtualBackgroundSetting = builder.ShowVirtualBackgroundSetting;
        this.MainVideoContainerSetting = builder.MainVideoContainerSetting;
    }
    CallSettings.prototype.shouldUseLegacyUI = function () {
        return this.useLegacyUI;
    };
    CallSettings.prototype.isRecordingButtonEnabled = function () {
        return this.ShowRecordingButton;
    };
    CallSettings.prototype.shouldStartRecordingOnCallStart = function () {
        return this.StartRecordingOnCallStart;
    };
    CallSettings.prototype.getCustomCSS = function () {
        return this.customCSS;
    };
    CallSettings.prototype.getSessionId = function () {
        return this.sessionID;
    };
    CallSettings.prototype.isAudioOnlyCall = function () {
        return this.isAudioOnly;
    };
    CallSettings.prototype.getUser = function () {
        return this.user;
    };
    CallSettings.prototype.getRegion = function () {
        return this.region;
    };
    CallSettings.prototype.getAppId = function () {
        return this.appId;
    };
    CallSettings.prototype.getDomain = function () {
        return this.domain;
    };
    CallSettings.prototype.isDefaultLayoutEnabled = function () {
        return this.defaultLayout;
    };
    CallSettings.prototype.getMode = function () {
        return this.mode;
    };
    CallSettings.prototype.getStartWithAudioMuted = function () {
        return this.StartAudioMuted;
    };
    CallSettings.prototype.getStartWithVideoMuted = function () {
        return this.StartVideoMuted;
    };
    CallSettings.prototype.isEndCallButtonEnabled = function () {
        return this.ShowEndCallButton;
    };
    CallSettings.prototype.isMuteAudioButtonEnabled = function () {
        return this.ShowMuteAudioButton;
    };
    CallSettings.prototype.isPauseVideoButtonEnabled = function () {
        return this.ShowPauseVideoButton;
    };
    CallSettings.prototype.isScreenShareButtonEnabled = function () {
        return this.ShowScreenShareButton;
    };
    CallSettings.prototype.isModeButtonEnabled = function () {
        return this.ShowSwitchModeButton;
    };
    CallSettings.prototype.getLocalizedStringObject = function () {
        return this.localizedObject;
    };
    CallSettings.prototype.getAnalyticsSettings = function () {
        return this.analyticsSettings;
    };
    CallSettings.prototype.isAudioToVideoButtonEnabled = function () {
        return this.ShowSwitchToVideoCallButton;
    };
    CallSettings.prototype.getVirtualBackground = function () {
        return this.VirtualBackground;
    };
    CallSettings.prototype.isVirtualBackgroundSettingEnabled = function () {
        return this.ShowVirtualBackgroundSetting;
    };
    CallSettings.prototype.getMainVideoContainerSetting = function () {
        return this.MainVideoContainerSetting;
    };
    CallSettings.POSITION_TOP_LEFT = "top-left";
    CallSettings.POSITION_TOP_RIGHT = "top-right";
    CallSettings.POSITION_BOTTOM_LEFT = "bottom-left";
    CallSettings.POSITION_BOTTOM_RIGHT = "bottom-right";
    CallSettings.ASPECT_RATIO_DEFAULT = "default";
    CallSettings.ASPECT_RATIO_CONTAIN = "contain";
    CallSettings.ASPECT_RATIO_COVER = "cover";
    return CallSettings;
}());
exports.CallSettings = CallSettings;
var CallSettingsBuilder =  (function () {
    function CallSettingsBuilder() {
         this.defaultLayout = true;
         this.isAudioOnly = false;
         this.mode = Constants_1.CallConstants.CALL_MODE.DEFAULT;
         this.ShowEndCallButton = true;
         this.ShowMuteAudioButton = true;
         this.ShowPauseVideoButton = true;
         this.ShowScreenShareButton = true;
         this.ShowSwitchModeButton = true;
         this.StartAudioMuted = false;
         this.StartVideoMuted = false;
         this.localizedObject = {};
         this.analyticsSettings = {};
         this.ShowRecordingButton = false;
         this.StartRecordingOnCallStart = false;
         this.useLegacyUI = false;
         this.ShowSwitchToVideoCallButton = true;
         this.virtualBackground = new VirtualBackgroundBuilder().build();
         this.ShowVirtualBackgroundSetting = true;
         this.MainVideoContainerSetting = new MainVideoContainerSetting();
    }
    
    CallSettingsBuilder.prototype.setSessionID = function (sessionID) {
        this.sessionID = sessionID;
        return this;
    };
    
    CallSettingsBuilder.prototype.enableDefaultLayout = function (defaultLayout) {
        this.defaultLayout = defaultLayout;
        return this;
    };
    
    CallSettingsBuilder.prototype.setIsAudioOnlyCall = function (isAudioOnly) {
        this.isAudioOnly = isAudioOnly;
        return this;
    };
    
    CallSettingsBuilder.prototype.setRegion = function (region) {
        this.region = region;
        return this;
    };
    
    CallSettingsBuilder.prototype.setDomain = function (domain) {
        this.domain = domain;
        return this;
    };
    
    CallSettingsBuilder.prototype.setUser = function (user) {
        this.user = user;
        return this;
    };
    
    CallSettingsBuilder.prototype.setMode = function (mode) {
        this.mode = mode;
        return this;
    };
    
    CallSettingsBuilder.prototype.showEndCallButton = function (showEndCallButton) {
        this.ShowEndCallButton = showEndCallButton;
        return this;
    };
    
    CallSettingsBuilder.prototype.showMuteAudioButton = function (showMuteAudioButton) {
        this.ShowMuteAudioButton = showMuteAudioButton;
        return this;
    };
    
    CallSettingsBuilder.prototype.showPauseVideoButton = function (showPauseVideoButton) {
        this.ShowPauseVideoButton = showPauseVideoButton;
        return this;
    };
    
    CallSettingsBuilder.prototype.showScreenShareButton = function (showScreenShareButton) {
        this.ShowScreenShareButton = showScreenShareButton;
        return this;
    };
    
    CallSettingsBuilder.prototype.showModeButton = function (showModeButton) {
        this.ShowSwitchModeButton = showModeButton;
        return this;
    };
    
    CallSettingsBuilder.prototype.setLocalizedStringObject = function (localizedStringObject) {
        this.localizedObject = localizedStringObject;
        return this;
    };
    
    CallSettingsBuilder.prototype.setAnalyticsSettings = function (analyticsSettings) {
        this.analyticsSettings = analyticsSettings;
        return this;
    };
    
    CallSettingsBuilder.prototype.setAppId = function (appId) {
        this.appId = appId;
        return this;
    };
    
    CallSettingsBuilder.prototype.startWithAudioMuted = function (audioMuted) {
        this.StartAudioMuted = audioMuted;
        return this;
    };
    
    CallSettingsBuilder.prototype.startWithVideoMuted = function (videoMuted) {
        this.StartVideoMuted = videoMuted;
        return this;
    };
    
    CallSettingsBuilder.prototype.setCustomCSS = function (customCSS) {
        this.customCSS = customCSS;
        return this;
    };
    
    CallSettingsBuilder.prototype.showRecordingButton = function (showRecordingButton) {
        this.ShowRecordingButton = showRecordingButton;
        return this;
    };
    
    CallSettingsBuilder.prototype.startRecordingOnCallStart = function (startRecordingOnCallStart) {
        this.StartRecordingOnCallStart = startRecordingOnCallStart;
        return this;
    };
    
    CallSettingsBuilder.prototype.forceLegacyUI = function (legacyUI) {
        this.useLegacyUI = legacyUI;
        return this;
    };
    
    CallSettingsBuilder.prototype.showSwitchToVideoCallButton = function (showAudioToVideoSwitchButton) {
        this.ShowSwitchToVideoCallButton = showAudioToVideoSwitchButton;
        return this;
    };
    
    CallSettingsBuilder.prototype.setVirtualBackground = function (virtualBackground) {
        this.virtualBackground = virtualBackground;
        return this;
    };
    
    CallSettingsBuilder.prototype.showVirtualBackgroundSetting = function (showVirtualBackgroundSetting) {
        this.ShowVirtualBackgroundSetting = showVirtualBackgroundSetting;
        return this;
    };
    
    CallSettingsBuilder.prototype.setMainVideoContainerSetting = function (mainVideoContainerSetting) {
        this.MainVideoContainerSetting = mainVideoContainerSetting;
        return this;
    };
    
    CallSettingsBuilder.prototype.build = function () {
        return new CallSettings(this);
    };
    return CallSettingsBuilder;
}());
exports.CallSettingsBuilder = CallSettingsBuilder;
var VirtualBackground =  (function () {
    function VirtualBackground(builder) {
        this.AllowBackgroundBlur = builder.AllowBackgroundBlur;
        this.AllowUserImages = builder.AllowUserImages;
        this.ShowDefaultImages = builder.ShowDefaultImages;
        this.SetImages = builder.SetImages;
        this.EnforceBackgroundBlur = builder.EnforceBackgroundBlur;
        this.EnforceBackgroundImage = builder.EnforceBackgroundImage;
    }
    VirtualBackground.prototype.shouldAllowBackgroundBlur = function () {
        return this.AllowBackgroundBlur;
    };
    VirtualBackground.prototype.shouldAllowUserImages = function () {
        return this.AllowUserImages;
    };
    VirtualBackground.prototype.shouldShowDefaultImages = function () {
        return this.ShowDefaultImages;
    };
    VirtualBackground.prototype.getImages = function () {
        return this.SetImages;
    };
    VirtualBackground.prototype.isBackgroundBlurEnforced = function () {
        return this.EnforceBackgroundBlur;
    };
    VirtualBackground.prototype.getEnforcedBackgroundImage = function () {
        return this.EnforceBackgroundImage;
    };
    return VirtualBackground;
}());
exports.VirtualBackground = VirtualBackground;
var VirtualBackgroundBuilder =  (function () {
    function VirtualBackgroundBuilder() {
         this.AllowBackgroundBlur = true;
         this.AllowUserImages = true;
         this.ShowDefaultImages = true;
         this.SetImages = [];
         this.EnforceBackgroundBlur = 0;
         this.EnforceBackgroundImage = "";
    }
    
    VirtualBackgroundBuilder.prototype.allowBackgroundBlur = function (AllowBackgroundBlur) {
        this.AllowBackgroundBlur = AllowBackgroundBlur;
        return this;
    };
    
    VirtualBackgroundBuilder.prototype.allowUserImages = function (AllowUserImages) {
        this.AllowUserImages = AllowUserImages;
        return this;
    };
    
    VirtualBackgroundBuilder.prototype.showDefaultImages = function (ShowDefaultImages) {
        this.ShowDefaultImages = ShowDefaultImages;
        return this;
    };
    
    VirtualBackgroundBuilder.prototype.setImages = function (SetImages) {
        this.SetImages = SetImages;
        return this;
    };
    
    VirtualBackgroundBuilder.prototype.enforceBackgroundBlur = function (EnforceBackgroundBlur) {
        this.EnforceBackgroundBlur = EnforceBackgroundBlur;
        return this;
    };
    
    VirtualBackgroundBuilder.prototype.enforceBackgroundImage = function (EnforceBackgroundImage) {
        this.EnforceBackgroundImage = EnforceBackgroundImage;
        return this;
    };
    
    VirtualBackgroundBuilder.prototype.build = function () {
        return new VirtualBackground(this);
    };
    return VirtualBackgroundBuilder;
}());
exports.VirtualBackgroundBuilder = VirtualBackgroundBuilder;
var MainVideoContainerSetting =  (function () {
    function MainVideoContainerSetting() {
        this.videoFit = CallSettings.ASPECT_RATIO_CONTAIN;
        this.zoomButton = Constants_1.CallConstants.ZOOM_BUTTON_DEFAULT_PARAMS;
        this.nameLabel = Constants_1.CallConstants.NAME_LABEL_DEFAULT_PARAMS;
        this.network = Constants_1.CallConstants.NETWORK_LABEL_DEFAULT_PARAMS;
    }
    
    MainVideoContainerSetting.prototype.setMainVideoAspectRatio = function (mainVideoAspectRatio) {
        this.videoFit = mainVideoAspectRatio;
    };
    
    MainVideoContainerSetting.prototype.setFullScreenButtonParams = function (position, visibility) {
        if (!Helper_1.isFalsy(position)) {
            this.zoomButton[Constants_1.CallConstants.MAIN_VIDEO_CONTAINER_SETTINGS.KEYS.POSITION] = position;
        }
        if (visibility != undefined && visibility != null) {
            this.zoomButton[Constants_1.CallConstants.MAIN_VIDEO_CONTAINER_SETTINGS.KEYS.VISIBILITY] = visibility;
        }
    };
    
    MainVideoContainerSetting.prototype.setNameLabelParams = function (position, visibility, backgroundColor) {
        if (!Helper_1.isFalsy(position)) {
            this.nameLabel[Constants_1.CallConstants.MAIN_VIDEO_CONTAINER_SETTINGS.KEYS.POSITION] = position;
        }
        if (visibility != undefined && visibility != null) {
            this.nameLabel[Constants_1.CallConstants.MAIN_VIDEO_CONTAINER_SETTINGS.KEYS.VISIBILITY] = visibility;
        }
        if (!Helper_1.isFalsy(backgroundColor)) {
            this.nameLabel[Constants_1.CallConstants.MAIN_VIDEO_CONTAINER_SETTINGS.KEYS.COLOR] = backgroundColor;
        }
    };
    
    MainVideoContainerSetting.prototype.setNetworkLabelParams = function (position, visibility) {
        if (!Helper_1.isFalsy(position)) {
            this.network[Constants_1.CallConstants.MAIN_VIDEO_CONTAINER_SETTINGS.KEYS.POSITION] = position;
        }
        if (visibility != undefined && visibility != null) {
            this.network[Constants_1.CallConstants.MAIN_VIDEO_CONTAINER_SETTINGS.KEYS.VISIBILITY] = visibility;
        }
    };
    return MainVideoContainerSetting;
}());
exports.MainVideoContainerSetting = MainVideoContainerSetting;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.RTCUser = void 0;

var Helper_1 = __webpack_require__(0);
var RTCUser =  (function () {
    function RTCUser(uid) {
        this.avatar = "";
        if (!Helper_1.isFalsy(uid)) {
            this.uid = uid.toString();
        }
    }
    RTCUser.prototype.setUID = function (uid) {
        this.uid = uid ? uid.toString() : '';
    };
    RTCUser.prototype.getUID = function () {
        return this.uid.toString();
    };
    RTCUser.prototype.setName = function (name) {
        this.name = name ? name.toString() : '';
    };
    RTCUser.prototype.getName = function () {
        return this.name.toString();
    };
    RTCUser.prototype.setAvatar = function (avatar) {
        this.avatar = avatar ? avatar.toString() : '';
    };
    RTCUser.prototype.getAvatar = function () {
        return this.avatar.toString();
    };
    RTCUser.prototype.setJWT = function (jwt) {
        this.jwt = jwt ? jwt.toString() : '';
    };
    RTCUser.prototype.getJWT = function () {
        return this.jwt.toString();
    };
    RTCUser.prototype.setResource = function (resource) {
        this.resource = resource ? resource.toString() : '';
    };
    RTCUser.prototype.getResource = function () {
        return this.resource.toString();
    };
    return RTCUser;
}());
exports.RTCUser = RTCUser;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.WSConnectionHelper = void 0;
var CometChat_1 = __webpack_require__(3);
var Constants_1 = __webpack_require__(1);
var CallController_1 = __webpack_require__(31);
var TypingNotificationController_1 = __webpack_require__(36);
var Helper_1 = __webpack_require__(0);
var ListenerHandlers_1 = __webpack_require__(37);
var KeyStore_1 = __webpack_require__(30);
var MessageListenerEventMaping_1 = __webpack_require__(25);
var Action_1 = __webpack_require__(20);
var Call_1 = __webpack_require__(21);
var CometChatAuthEvent_1 = __webpack_require__(54);
var CometChatMessageEvent_1 = __webpack_require__(55);
var CometChatPingEvent_1 = __webpack_require__(56);
var CometChatPresenceEvent_1 = __webpack_require__(57);
var CometChatReceiptEvent_1 = __webpack_require__(58);
var CometChatTransientEvent_1 = __webpack_require__(59);
var CometChatTypingEvent_1 = __webpack_require__(60);
var MessageReceipt_1 = __webpack_require__(22);
var TransientMessage_1 = __webpack_require__(27);
var TypingNotification_1 = __webpack_require__(26);
var WSConstants_1 = __webpack_require__(5);
var WSHelper_1 = __webpack_require__(61);
var _listenerHandlers = ListenerHandlers_1.ListenerHandlers.getInstance();
var WSConnectionHelper =  (function () {
    function WSConnectionHelper() {
    }
    WSConnectionHelper.getInstance = function () {
        try {
            if (this.wsConnectionHelper == null || this.wsConnectionHelper == undefined) {
                this.wsConnectionHelper = new WSConnectionHelper();
            }
            return this.wsConnectionHelper;
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: getInstance", err);
        }
    };
    WSConnectionHelper.prototype.WSLogin = function (jwt, callback) {
        var _this = this;
        try {
            WSHelper_1.getWSURL().then(function (wsUrl) {
                _this.connection = new WebSocket(wsUrl);
                if (callback && _this.connection && _this.connection.readyState == WSConstants_1.READY_STATE.CONNECTING) {
                    callback(_this.connection.readyState);
                }
                _this.connection.onopen = function (event) {
                    _this.onOpen(event, callback);
                    _this.authenticateUser(jwt);
                };
                _this.connection.onclose = function (event) {
                    _this.onClose(event, callback);
                };
                _this.connection.onmessage = function (event) {
                    _this.onMessage(event);
                };
            }, function (error) {
                Helper_1.Logger.error("WSConnectionHelper :: WSLogin", error);
            });
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: WSLogin", err);
        }
    };
    WSConnectionHelper.prototype.onOpen = function (event, callback) {
        try {
            if (callback && this.connection) {
                callback(this.connection.readyState);
            }
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: onOpen", err);
        }
    };
    WSConnectionHelper.prototype.onClose = function (event, callback) {
        try {
            if (callback && this.connection) {
                callback(this.connection.readyState);
            }
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: onClose", err);
        }
    };
    WSConnectionHelper.prototype.onMessage = function (event) {
        if (event.data && typeof event.data === "string") {
            try {
                var message = JSON.parse(event.data);
                if (message && message.action && message.action === WSConstants_1.KEYS.PONG) {
                    return;
                }
                var cometchatEvent = this.getCometChatEventFromMessage(JSON.parse(event.data));
                if (cometchatEvent.getDeviceId() === CometChat_1.CometChat.getSessionId() && cometchatEvent.getType() !== WSConstants_1.AUTH.TYPE) {
                    return;
                }
                else {
                    switch (cometchatEvent.getType()) {
                        case WSConstants_1.TYPING_INDICATOR.TYPE: {
                            this.publishTypingIndicator(cometchatEvent);
                            break;
                        }
                        case WSConstants_1.RECEIPTS.TYPE: {
                            this.publishReceipts(cometchatEvent);
                            break;
                        }
                        case WSConstants_1.PRESENCE.TYPE: {
                            this.publishPresence(cometchatEvent);
                            break;
                        }
                        case WSConstants_1.AUTH.TYPE: {
                            this.authResponseReceived(cometchatEvent);
                            break;
                        }
                        case WSConstants_1.MESSAGE.TYPE: {
                            this.publishMessages(cometchatEvent);
                            break;
                        }
                        case WSConstants_1.TRANSIENT_MESSAGE.TYPE: {
                            this.publishTransientMessage(cometchatEvent);
                            break;
                        }
                        default:
                            Helper_1.Logger.log('WSHelper: onMessage :: unknown type', event.data);
                    }
                }
            }
            catch (e) {
                Helper_1.Logger.error("WSHelper: onMessage", e);
            }
        }
        else {
            Helper_1.Logger.log("WSHelper: onMessage :: object data", event.data);
        }
    };
    WSConnectionHelper.prototype.authenticateUser = function (jwt) {
        var _this = this;
        try {
            CometChat_1.CometChat.getLoggedinUser().then(function (loggedInUser) {
                if (loggedInUser) {
                    KeyStore_1.KeyStore.getInstance().get("deviceId").then(function (id) {
                        Helper_1.getAppSettings().then(function (appSettings) {
                            var origin = null;
                            if (window && window.location && window.location.origin) {
                                origin = window.location.origin;
                            }
                            var userAgent = "", deviceId = id, sdkVersion = Constants_1.SDKHeader.sdkVersion, apiVersion = appSettings[Constants_1.APP_SETTINGS.KEYS.CHAT_API_VERSION];
                            var appInfo = {
                                "version": sdkVersion,
                                "apiVersion": apiVersion,
                                "origin": origin,
                                "uts": new Date().getTime()
                            };
                            if (!Helper_1.isFalsy(CometChat_1.CometChat.resource)) {
                                appInfo["resource"] = CometChat_1.CometChat.resource;
                            }
                            if (!Helper_1.isFalsy(CometChat_1.CometChat.platform)) {
                                appInfo["platform"] = CometChat_1.CometChat.platform;
                            }
                            if (!Helper_1.isFalsy(CometChat_1.CometChat.language)) {
                                appInfo["language"] = CometChat_1.CometChat.language;
                            }
                            if (navigator) {
                                userAgent = navigator.userAgent;
                            }
                            var extraParameters = {
                                "appInfo": appInfo,
                                "userAgent": userAgent,
                                "deviceId": deviceId,
                                "platform": Constants_1.SDKHeader.platform
                            };
                            var authEvent = new CometChatAuthEvent_1.CometChatAuthEvent(CometChat_1.CometChat.getAppId(), '', '', loggedInUser.getUid(), CometChat_1.CometChat.getSessionId());
                            authEvent.setAuth(jwt);
                            authEvent.setPresenceSubscription(CometChat_1.CometChat.appSettings.getSubscriptionType());
                            authEvent.setDeviceId(CometChat_1.CometChat.getSessionId());
                            authEvent.setExtraParmaeters(extraParameters);
                            if (WSHelper_1.checkConnection(_this.connection)) {
                                var message = authEvent.getAsString();
                                _this.connection.send(message);
                            }
                        });
                    });
                }
                else {
                    Helper_1.Logger.log('no logged-in user', 'null');
                }
            }, function (error) {
                Helper_1.Logger.log('error in fetching logged-in user', error);
            });
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: startTypingIndicator", err);
        }
    };
    WSConnectionHelper.prototype.authResponseReceived = function (event) {
        try {
            if (event.getCode() === "200" && event.getStatus() === "OK") {
                this.startPingingWS();
            }
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: authResponseReceived", err);
        }
    };
    WSConnectionHelper.prototype.WSLogout = function () {
        try {
            this.clearPingTimer();
            if (WSHelper_1.checkConnection(this.connection)) {
                this.connection.close(WSConstants_1.LOGOUT_CODE, WSConstants_1.LOGOUT_REASON);
            }
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: WSLogout", err);
        }
    };
    WSConnectionHelper.prototype.startPingingWS = function () {
        var _this = this;
        try {
            if (!WSConnectionHelper.pingTimer) {
                WSConnectionHelper.pingTimer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                    var pingEvent, message, pongSuccess;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!WSHelper_1.checkConnection(this.connection)) return [3 , 2];
                                pingEvent = new CometChatPingEvent_1.CometChatPingEvent('', '', '', '', '');
                                message = pingEvent.getAsString();
                                this.connection.send(message);
                                return [4 , this.listenForPong()];
                            case 1:
                                pongSuccess = _a.sent();
                                if (pongSuccess) {
                                    Helper_1.Logger.log("WSConnectionHelper :: startPingingWS", "pong success");
                                    if (CometChat_1.CometChat.getConnectionStatus() != Constants_1.CONNECTION_STATUS.CONNECTED) {
                                        this.WSLogout();
                                        this.connection = null;
                                        CometChat_1.CometChat.getInstance().makeWSConnection();
                                    }
                                }
                                else {
                                    Helper_1.Logger.log("WSConnectionHelper :: startPingingWS", "pong failure");
                                    this.WSLogout();
                                    this.connection = null;
                                    CometChat_1.CometChat.getInstance().setConnectionStatus(Constants_1.CONNECTION_STATUS.DISCONNECTED);
                                    _listenerHandlers.connectionHandlers.map(function (listener) {
                                        try {
                                            if (listener._eventListener) {
                                                if (!Helper_1.isFalsy(listener._eventListener.onDisconnected)) {
                                                    listener._eventListener.onDisconnected();
                                                }
                                            }
                                        }
                                        catch (e) {
                                            Helper_1.Logger.error("WSConnectionHandlers: Disconnected Status", e);
                                        }
                                    });
                                    CometChat_1.CometChat.getInstance().accidentallyDisconnected();
                                }
                                _a.label = 2;
                            case 2: return [2 ];
                        }
                    });
                }); }, 15000);
            }
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: startPingingWS", err);
        }
    };
    WSConnectionHelper.prototype.listenForPong = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var pongTimer = setTimeout(function () {
                resolve(false);
            }, 3000);
            _this.connection.addEventListener("message", function (event) {
                if (event && event.data && typeof event.data === "string") {
                    var message = JSON.parse(event.data);
                    if (message.action === WSConstants_1.KEYS.PONG) {
                        clearTimeout(pongTimer);
                        resolve(true);
                    }
                }
            });
        });
    };
    WSConnectionHelper.prototype.clearPingTimer = function () {
        if (WSConnectionHelper.pingTimer) {
            clearInterval(WSConnectionHelper.pingTimer);
            WSConnectionHelper.pingTimer = undefined;
        }
    };
    WSConnectionHelper.prototype.sendOnlineEvent = function () {
        var _this = this;
        try {
            if (WSHelper_1.checkConnection(this.connection)) {
                CometChat_1.CometChat.getLoggedinUser().then(function (loggedInUser) {
                    if (loggedInUser) {
                        if (loggedInUser["authToken"]) {
                            delete loggedInUser["authToken"];
                        }
                        var userOnline = {
                            appId: CometChat_1.CometChat.getAppId(),
                            deviceId: CometChat_1.CometChat.getSessionId(),
                            type: WSConstants_1.PRESENCE.TYPE,
                            body: {
                                action: WSConstants_1.PRESENCE.ACTION.ONLINE,
                                timestamp: Math.floor(new Date().getTime() / 1000),
                                user: loggedInUser
                            }
                        };
                        if (WSHelper_1.checkConnection(_this.connection)) {
                            var message = WSHelper_1.stringifyMessage(userOnline);
                            _this.connection.send(message);
                        }
                    }
                    else {
                        Helper_1.Logger.log('no logged-in user', 'null');
                    }
                }, function (error) {
                    Helper_1.Logger.log('error in fetching logged-in user', error);
                });
            }
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: sendOnlineEvent", err);
        }
    };
    WSConnectionHelper.prototype.sendOfflineEvent = function () {
        var _this = this;
        try {
            if (WSHelper_1.checkConnection(this.connection)) {
                CometChat_1.CometChat.getLoggedinUser().then(function (loggedInUser) {
                    if (loggedInUser) {
                        if (loggedInUser["authToken"]) {
                            delete loggedInUser["authToken"];
                        }
                        var userOffline = {
                            appId: CometChat_1.CometChat.getAppId(),
                            deviceId: CometChat_1.CometChat.getSessionId(),
                            type: WSConstants_1.PRESENCE.TYPE,
                            body: {
                                action: WSConstants_1.PRESENCE.ACTION.OFFLINE,
                                timestamp: Math.floor(new Date().getTime() / 1000),
                                user: loggedInUser
                            }
                        };
                        if (WSHelper_1.checkConnection(_this.connection)) {
                            var message = WSHelper_1.stringifyMessage(userOffline);
                            _this.connection.send(message);
                        }
                    }
                    else {
                        Helper_1.Logger.log('no logged-in user', 'null');
                    }
                }, function (error) {
                    Helper_1.Logger.log('error in fetching logged-in user', error);
                });
            }
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: sendOfflineEvent", err);
        }
    };
    WSConnectionHelper.prototype.startTypingIndicator = function (receiverId, receiverType, metadata) {
        var _this = this;
        try {
            CometChat_1.CometChat.getLoggedinUser().then(function (loggedInUser) {
                if (loggedInUser) {
                    var typingIndicator = new TypingNotification_1.TypingIndicator(receiverId, receiverType);
                    if (loggedInUser["authToken"]) {
                        delete loggedInUser["authToken"];
                    }
                    typingIndicator.setSender(loggedInUser);
                    if (metadata) {
                        typingIndicator.setMetadata(metadata);
                    }
                    var typingEvent = new CometChatTypingEvent_1.CometChatTypingEvent(CometChat_1.CometChat.getAppId(), receiverId, receiverType, loggedInUser.getUid(), CometChat_1.CometChat.getSessionId());
                    typingEvent.setAction(WSConstants_1.TYPING_INDICATOR.ACTION.STARTED);
                    typingEvent.setTypingIndicator(typingIndicator);
                    if (WSHelper_1.checkConnection(_this.connection)) {
                        var message = typingEvent.getAsString();
                        _this.connection.send(message);
                    }
                }
                else {
                    Helper_1.Logger.log('no logged-in user', 'null');
                }
            }, function (error) {
                Helper_1.Logger.log('error in fetching logged-in user', error);
            });
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: startTypingIndicator", err);
        }
    };
    WSConnectionHelper.prototype.pauseTypingIndicator = function (receiverId, receiverType, metadata) {
        var _this = this;
        try {
            CometChat_1.CometChat.getLoggedinUser().then(function (loggedInUser) {
                if (loggedInUser) {
                    var typingIndicator = new TypingNotification_1.TypingIndicator(receiverId, receiverType);
                    if (loggedInUser["authToken"]) {
                        delete loggedInUser["authToken"];
                    }
                    typingIndicator.setSender(loggedInUser);
                    if (metadata) {
                        typingIndicator.setMetadata(metadata);
                    }
                    var typingEvent = new CometChatTypingEvent_1.CometChatTypingEvent(CometChat_1.CometChat.getAppId(), receiverId, receiverType, loggedInUser.getUid(), CometChat_1.CometChat.getSessionId());
                    typingEvent.setAction(WSConstants_1.TYPING_INDICATOR.ACTION.ENDED);
                    typingEvent.setTypingIndicator(typingIndicator);
                    if (WSHelper_1.checkConnection(_this.connection)) {
                        var message = typingEvent.getAsString();
                        _this.connection.send(message);
                    }
                }
                else {
                    Helper_1.Logger.log('no logged-in user', 'null');
                }
            }, function (error) {
                Helper_1.Logger.log('error in fetching logged-in user', error);
            });
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: pauseTypingIndicator", err);
        }
    };
    WSConnectionHelper.prototype.markAsRead = function (receiverId, receiverType, messageId, senderId) {
        var _this = this;
        try {
            var mode = CometChat_1.CometChat.getMode();
            CometChat_1.CometChat.getLoggedinUser().then(function (loggedInUser) {
                if (loggedInUser) {
                    var cometChatReceiptEvent = new CometChatReceiptEvent_1.CometChatReceiptEvent(CometChat_1.CometChat.getAppId(), receiverId, receiverType, loggedInUser.getUid(), CometChat_1.CometChat.getSessionId(), senderId);
                    cometChatReceiptEvent.setAction(WSConstants_1.RECEIPTS.ACTION.READ);
                    var messageReceipt = new MessageReceipt_1.MessageReceipt();
                    if (loggedInUser["authToken"]) {
                        delete loggedInUser["authToken"];
                    }
                    messageReceipt.setSender(loggedInUser);
                    messageReceipt.setReceiverType(receiverType);
                    messageReceipt.setReceiver(receiverId);
                    messageReceipt.setReceiptType(WSConstants_1.RECEIPTS.RECEIPT_TYPE.READ_RECEIPT);
                    messageReceipt.setMessageId(messageId);
                    messageReceipt.setTimestamp((Math.floor(new Date().getTime() / 1000).toString()));
                    cometChatReceiptEvent.setMessageReceipt(messageReceipt);
                    if (WSHelper_1.checkConnection(_this.connection)) {
                        var message = cometChatReceiptEvent.getAsString();
                        _this.connection.send(message);
                    }
                }
                else {
                    Helper_1.Logger.log('no logged-in user', 'null');
                }
            }, function (error) {
                Helper_1.Logger.log('error in fetching logged-in user', error);
            });
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: markAsRead", err);
        }
    };
    WSConnectionHelper.prototype.markAsDelivered = function (receiverId, receiverType, messageId, senderId) {
        var _this = this;
        try {
            var mode = CometChat_1.CometChat.getMode();
            CometChat_1.CometChat.getLoggedinUser().then(function (loggedInUser) {
                if (loggedInUser) {
                    var cometChatReceiptEvent = new CometChatReceiptEvent_1.CometChatReceiptEvent(CometChat_1.CometChat.getAppId(), receiverId, receiverType, loggedInUser.getUid(), CometChat_1.CometChat.getSessionId(), senderId);
                    cometChatReceiptEvent.setAction(WSConstants_1.RECEIPTS.ACTION.DELIVERED);
                    var messageReceipt = new MessageReceipt_1.MessageReceipt();
                    if (loggedInUser["authToken"]) {
                        delete loggedInUser["authToken"];
                    }
                    messageReceipt.setSender(loggedInUser);
                    messageReceipt.setReceiverType(receiverType);
                    messageReceipt.setReceiver(receiverId);
                    messageReceipt.setReceiptType(WSConstants_1.RECEIPTS.RECEIPT_TYPE.DELIVERY_RECEIPT);
                    messageReceipt.setMessageId(messageId);
                    messageReceipt.setTimestamp((Math.floor(new Date().getTime() / 1000).toString()));
                    cometChatReceiptEvent.setMessageReceipt(messageReceipt);
                    if (WSHelper_1.checkConnection(_this.connection)) {
                        var message = cometChatReceiptEvent.getAsString();
                        _this.connection.send(message);
                    }
                }
                else {
                    Helper_1.Logger.log('no logged-in user', 'null');
                }
            }, function (error) {
                Helper_1.Logger.log('error in fetching logged-in user', error);
            });
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: markAsDelivered", err);
        }
    };
    WSConnectionHelper.prototype.sendTransientMessage = function (receiverId, receiverType, data) {
        var _this = this;
        try {
            CometChat_1.CometChat.getLoggedinUser().then(function (loggedInUser) {
                if (loggedInUser) {
                    var transientMessage = new TransientMessage_1.TransientMessage(receiverId, receiverType, data);
                    if (loggedInUser["authToken"]) {
                        delete loggedInUser["authToken"];
                    }
                    transientMessage.setSender(loggedInUser);
                    var typingEvent = new CometChatTransientEvent_1.CometChatTransientEvent(CometChat_1.CometChat.getAppId(), receiverId, receiverType, loggedInUser.getUid(), CometChat_1.CometChat.getSessionId());
                    typingEvent.setTransientMessage(transientMessage);
                    if (WSHelper_1.checkConnection(_this.connection)) {
                        var message = typingEvent.getAsString();
                        _this.connection.send(message);
                    }
                }
                else {
                    Helper_1.Logger.log('no logged-in user', 'null');
                }
            }, function (error) {
                Helper_1.Logger.log('error in fetching logged-in user', error);
            });
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: sendTransientMessage", err);
        }
    };
    WSConnectionHelper.prototype.publishTypingIndicator = function (cometchatEvent) {
        try {
            var typingNotification_1 = cometchatEvent.getTypingIndicator();
            switch (cometchatEvent.getAction()) {
                case WSConstants_1.TYPING_INDICATOR.ACTION.STARTED: {
                    _listenerHandlers.messageHandlers.map(function (listener) {
                        if (listener._eventListener.onTypingStarted) {
                            listener._eventListener.onTypingStarted(typingNotification_1);
                        }
                    });
                    TypingNotificationController_1.TypingNotificationController.addIncomingTypingStarted(typingNotification_1);
                    break;
                }
                case WSConstants_1.TYPING_INDICATOR.ACTION.ENDED: {
                    _listenerHandlers.messageHandlers.map(function (listener) {
                        if (listener._eventListener.onTypingEnded) {
                            listener._eventListener.onTypingEnded(typingNotification_1);
                        }
                    });
                    TypingNotificationController_1.TypingNotificationController.removeIncomingTypingStarted(typingNotification_1);
                    break;
                }
            }
        }
        catch (err) {
            Helper_1.Logger.error("WSHelper: publishTypingIndicator", err);
        }
    };
    WSConnectionHelper.prototype.publishReceipts = function (cometchatEvent) {
        try {
            var messageReceipt_1 = cometchatEvent.getMessageReceipt();
            switch (cometchatEvent.getAction()) {
                case WSConstants_1.RECEIPTS.ACTION.DELIVERED: {
                    _listenerHandlers.messageHandlers.map(function (listner) {
                        if (listner._eventListener.onMessagesDelivered) {
                            listner._eventListener.onMessagesDelivered(messageReceipt_1);
                        }
                    });
                    break;
                }
                case WSConstants_1.RECEIPTS.ACTION.READ: {
                    _listenerHandlers.messageHandlers.map(function (listner) {
                        if (listner._eventListener.onMessagesRead) {
                            listner._eventListener.onMessagesRead(messageReceipt_1);
                        }
                    });
                    break;
                }
            }
        }
        catch (err) {
            Helper_1.Logger.error("WSHelper: publishReceipts", err);
        }
    };
    WSConnectionHelper.prototype.publishPresence = function (cometchatEvent) {
        try {
            var user_1 = cometchatEvent.getUser();
            user_1.setLastActiveAt(cometchatEvent.getTimestamp());
            switch (cometchatEvent.getAction()) {
                case WSConstants_1.PRESENCE.ACTION.ONLINE:
                case WSConstants_1.PRESENCE.ACTION.AVAILABLE: {
                    user_1.setStatus(Constants_1.PresenceConstatnts.STATUS.ONLINE);
                    _listenerHandlers.userHandlers.map(function (listener) {
                        if (!Helper_1.isFalsy(listener._eventListener.onUserOnline)) {
                            listener._eventListener.onUserOnline(user_1);
                        }
                    });
                    break;
                }
                case WSConstants_1.PRESENCE.ACTION.OFFLINE: {
                    user_1.setStatus(Constants_1.PresenceConstatnts.STATUS.OFFLINE);
                    _listenerHandlers.userHandlers.map(function (listener) {
                        if (!Helper_1.isFalsy(listener._eventListener.onUserOffline)) {
                            listener._eventListener.onUserOffline(user_1);
                        }
                    });
                    break;
                }
            }
        }
        catch (err) {
            Helper_1.Logger.error("WSHelper: publishPresence", err);
        }
    };
    WSConnectionHelper.prototype.publishMessages = function (cometchatEvent) {
        try {
            var message = cometchatEvent.getMessage();
            if (message && message.getId()) {
                MessageListenerEventMaping_1.MessageListnerMaping.getInstance().set("all", message.getId());
            }
            if (message instanceof Call_1.Call) {
                this.publishCallMessage(message);
            }
            else if (message instanceof Action_1.Action) {
                this.publishActionMessage(message);
            }
            else {
                this.publishMessage(message);
            }
        }
        catch (err) {
            Helper_1.Logger.error("WSHelper: publishMessages", err);
        }
    };
    WSConnectionHelper.prototype.publishMessage = function (message) {
        try {
            _listenerHandlers.messageHandlers.map(function (listener) {
                if (listener._eventListener) {
                    var _message = message;
                    switch (_message.getType()) {
                        case Constants_1.MessageConstatnts.TYPE.TEXT: {
                            if (!Helper_1.isFalsy(listener._eventListener.onTextMessageReceived)) {
                                listener._eventListener.onTextMessageReceived(message);
                            }
                            break;
                        }
                        case Constants_1.MessageConstatnts.TYPE.CUSTOM: {
                            if (!Helper_1.isFalsy(listener._eventListener.onCustomMessageReceived)) {
                                listener._eventListener.onCustomMessageReceived(message);
                            }
                            break;
                        }
                        default: {
                            if (_message.getCategory() == Constants_1.MessageCategory.CUSTOM) {
                                if (!Helper_1.isFalsy(listener._eventListener.onCustomMessageReceived)) {
                                    listener._eventListener.onCustomMessageReceived(message);
                                }
                            }
                            else {
                                if (!Helper_1.isFalsy(listener._eventListener.onMediaMessageReceived)) {
                                    listener._eventListener.onMediaMessageReceived(message);
                                }
                            }
                            break;
                        }
                    }
                }
            });
        }
        catch (err) {
            Helper_1.Logger.error("WSHelper: publishMessage", err);
        }
    };
    WSConnectionHelper.prototype.publishCallMessage = function (message) {
        try {
            var activeCall_1 = CallController_1.CallController.getInstance().getActiveCall();
            switch (message.getStatus()) {
                case Constants_1.CallConstants.CALL_STATUS.INITIATED: {
                    if (message.getReceiverType() == Constants_1.CallConstants.RECEIVER_TYPE_GROUP) {
                        _listenerHandlers.callHandlers.map(function (listener) {
                            if (message.getCallInitiator().getUid().toLocaleLowerCase() != CometChat_1.CometChat.user.getUid().toLocaleLowerCase()) {
                                if (!Helper_1.isFalsy(listener._eventListener.onIncomingCallReceived)) {
                                    listener._eventListener.onIncomingCallReceived(message);
                                }
                            }
                        });
                    }
                    else {
                        _listenerHandlers.callHandlers.map(function (listener) {
                            if (!Helper_1.isFalsy(listener._eventListener.onIncomingCallReceived)) {
                                listener._eventListener.onIncomingCallReceived(message);
                            }
                        });
                    }
                    break;
                }
                case Constants_1.CallConstants.CALL_STATUS.ONGOING: {
                    if (message.getReceiverType() == Constants_1.CallConstants.RECEIVER_TYPE_GROUP) {
                        if (message.getCallInitiator().getUid().toLocaleLowerCase() == CometChat_1.CometChat.user.getUid().toLocaleLowerCase()) {
                            _listenerHandlers.callHandlers.map(function (listener) {
                                if (!Helper_1.isFalsy(listener._eventListener.onOutgoingCallAccepted)) {
                                    listener._eventListener.onOutgoingCallAccepted(message);
                                }
                            });
                        }
                    }
                    else {
                        _listenerHandlers.callHandlers.map(function (listener) {
                            if (!Helper_1.isFalsy(listener._eventListener.onOutgoingCallAccepted)) {
                                listener._eventListener.onOutgoingCallAccepted(message);
                            }
                        });
                    }
                    break;
                }
                case Constants_1.CallConstants.CALL_STATUS.UNANSWERED: {
                    if (message.getCallInitiator().getUid().toLocaleLowerCase() == CometChat_1.CometChat.user.getUid().toLocaleLowerCase()) {
                        _listenerHandlers.callHandlers.map(function (listener) {
                            if (!Helper_1.isFalsy(listener._eventListener.onOutgoingCallRejected)) {
                                listener._eventListener.onOutgoingCallRejected(message);
                            }
                        });
                    }
                    else {
                        if (activeCall_1 !== null) {
                            if (activeCall_1.getSessionId() === message.getSessionId()) {
                                try {
                                    CallController_1.CallController.getInstance().endCall();
                                }
                                catch (error) {
                                    Helper_1.Logger.error("CallError", error);
                                }
                            }
                        }
                        _listenerHandlers.callHandlers.map(function (listener) {
                            if (!Helper_1.isFalsy(listener._eventListener.onIncomingCallCancelled)) {
                                listener._eventListener.onIncomingCallCancelled(message);
                            }
                        });
                    }
                    break;
                }
                case Constants_1.CallConstants.CALL_STATUS.REJECTED: {
                    if (message.getReceiverType() == Constants_1.CallConstants.RECEIVER_TYPE_GROUP) {
                        if (message.getCallInitiator().getUid().toLocaleLowerCase() == CometChat_1.CometChat.user.getUid().toLocaleLowerCase()) {
                            _listenerHandlers.callHandlers.map(function (listener) {
                                if (!Helper_1.isFalsy(listener._eventListener.onOutgoingCallRejected)) {
                                    listener._eventListener.onOutgoingCallRejected(message);
                                }
                            });
                        }
                    }
                    else {
                        if (activeCall_1 !== null) {
                            if (activeCall_1.getSessionId() === message.getSessionId()) {
                                try {
                                    CallController_1.CallController.getInstance().endCall();
                                }
                                catch (error) {
                                    Helper_1.Logger.error("CallError", error);
                                }
                            }
                        }
                        _listenerHandlers.callHandlers.map(function (listener) {
                            if (!Helper_1.isFalsy(listener._eventListener.onOutgoingCallRejected)) {
                                listener._eventListener.onOutgoingCallRejected(message);
                            }
                        });
                    }
                    break;
                }
                case Constants_1.CallConstants.CALL_STATUS.BUSY: {
                    if (message.getReceiverType() == Constants_1.CallConstants.RECEIVER_TYPE_GROUP) {
                        if (message.getCallInitiator().getUid().toLocaleLowerCase() == CometChat_1.CometChat.user.getUid().toLocaleLowerCase()) {
                            _listenerHandlers.callHandlers.map(function (listener) {
                                if (!Helper_1.isFalsy(listener._eventListener.onOutgoingCallRejected)) {
                                    listener._eventListener.onOutgoingCallRejected(message);
                                }
                            });
                        }
                    }
                    else {
                        _listenerHandlers.callHandlers.map(function (listener) {
                            if (activeCall_1 !== null) {
                                if (activeCall_1.getSessionId() === message.getSessionId()) {
                                    try {
                                        CallController_1.CallController.getInstance().endCall();
                                    }
                                    catch (error) {
                                        Helper_1.Logger.error("CallError", error);
                                    }
                                }
                            }
                            if (!Helper_1.isFalsy(listener._eventListener.onOutgoingCallRejected)) {
                                listener._eventListener.onOutgoingCallRejected(message);
                            }
                        });
                    }
                    break;
                }
                case Constants_1.CallConstants.CALL_STATUS.CANCELLED: {
                    _listenerHandlers.callHandlers.map(function (listener) {
                        if (!Helper_1.isFalsy(listener._eventListener.onIncomingCallCancelled)) {
                            listener._eventListener.onIncomingCallCancelled(message);
                        }
                    });
                    if (activeCall_1 !== null) {
                        if (activeCall_1.getSessionId() === message.getSessionId()) {
                            try {
                                CallController_1.CallController.getInstance().endCall();
                            }
                            catch (error) {
                                Helper_1.Logger.error("CallError", error);
                            }
                        }
                    }
                    break;
                }
                case Constants_1.CallConstants.CALL_STATUS.ENDED: {
                    _listenerHandlers.callHandlers.map(function (listener) {
                        if (!Helper_1.isFalsy(listener._eventListener.onCallEndedMessageReceived)) {
                            listener._eventListener.onCallEndedMessageReceived(message);
                        }
                    });
                    if (CallController_1.CallController.getInstance().getCallListner()) {
                        CallController_1.CallController.getInstance().getCallListner()._eventListener.onCallEnded(message);
                    }
                    if (activeCall_1 !== null) {
                        if (activeCall_1.getSessionId() === message.getSessionId()) {
                            try {
                                CallController_1.CallController.getInstance().endCall();
                            }
                            catch (error) {
                                Helper_1.Logger.error("CallError", error);
                            }
                        }
                    }
                    break;
                }
                default: {
                    Helper_1.Logger.log('WSHelper: publishCallMessage :: unknown status', message);
                    break;
                }
            }
        }
        catch (err) {
            Helper_1.Logger.error("WSHelper: publishCallMessage", err);
        }
    };
    WSConnectionHelper.prototype.publishActionMessage = function (message) {
        try {
            switch (message.getAction()) {
                case Constants_1.ActionConstatnts.ACTION_TYPE.TYPE_MEMBER_JOINED:
                    _listenerHandlers.groupHandlers.map(function (listener) {
                        if (!Helper_1.isFalsy(listener._eventListener.onGroupMemberJoined)) {
                            listener._eventListener.onGroupMemberJoined(message, message.getActionBy(), message.getActionFor());
                        }
                    });
                    break;
                case Constants_1.ActionConstatnts.ACTION_TYPE.TYPE_MEMBER_INVITED:
                    _listenerHandlers.groupHandlers.map(function (listener) {
                        if (!Helper_1.isFalsy(listener._eventListener.onGroupMemberJoined)) {
                            listener._eventListener.onGroupMemberJoined(message, message.getActionBy(), message.getActionFor());
                        }
                    });
                    break;
                case Constants_1.ActionConstatnts.ACTION_TYPE.TYPE_MEMBER_LEFT:
                    _listenerHandlers.groupHandlers.map(function (listener) {
                        if (!Helper_1.isFalsy(listener._eventListener.onGroupMemberLeft)) {
                            listener._eventListener.onGroupMemberLeft(message, message.getActionBy(), message.getActionFor());
                        }
                    });
                    break;
                case Constants_1.ActionConstatnts.ACTION_TYPE.TYPE_MEMBER_BANNED:
                    _listenerHandlers.groupHandlers.map(function (listener) {
                        if (!Helper_1.isFalsy(listener._eventListener.onGroupMemberBanned)) {
                            listener._eventListener.onGroupMemberBanned(message, message.getActionOn(), message.getActionBy(), message.getActionFor());
                        }
                    });
                    break;
                case Constants_1.ActionConstatnts.ACTION_TYPE.TYPE_MEMBER_KICKED:
                    _listenerHandlers.groupHandlers.map(function (listener) {
                        if (!Helper_1.isFalsy(listener._eventListener.onGroupMemberKicked)) {
                            listener._eventListener.onGroupMemberKicked(message, message.getActionOn(), message.getActionBy(), message.getActionFor());
                        }
                    });
                    break;
                case Constants_1.ActionConstatnts.ACTION_TYPE.TYPE_MEMBER_UNBANNED:
                    _listenerHandlers.groupHandlers.map(function (listener) {
                        if (!Helper_1.isFalsy(listener._eventListener.onGroupMemberUnbanned)) {
                            listener._eventListener.onGroupMemberUnbanned(message, message.getActionOn(), message.getActionBy(), message.getActionFor());
                        }
                    });
                    break;
                case Constants_1.ActionConstatnts.ACTION_TYPE.TYPE_MEMBER_SCOPE_CHANGED:
                    _listenerHandlers.groupHandlers.map(function (listener) {
                        if (!Helper_1.isFalsy(listener._eventListener.onGroupMemberScopeChanged)) {
                            listener._eventListener.onGroupMemberScopeChanged(message, message.getActionOn(), message.getNewScope(), message.getOldScope(), message.getActionFor());
                        }
                    });
                    break;
                case Constants_1.ActionConstatnts.ACTION_TYPE.TYPE_MESSAGE_EDITED: {
                    _listenerHandlers.messageHandlers.map(function (listener) {
                        if (!Helper_1.isFalsy(listener._eventListener.onMessageEdited)) {
                            listener._eventListener.onMessageEdited(message.getActionOn());
                        }
                    });
                    break;
                }
                case Constants_1.ActionConstatnts.ACTION_TYPE.TYPE_MESSAGE_DELETED: {
                    _listenerHandlers.messageHandlers.map(function (listener) {
                        if (!Helper_1.isFalsy(listener._eventListener.onMessageDeleted)) {
                            listener._eventListener.onMessageDeleted(message.getActionOn());
                        }
                    });
                    break;
                }
                case Constants_1.ActionConstatnts.ACTION_TYPE.TYPE_MEMBER_ADDED: {
                    _listenerHandlers.groupHandlers.map(function (listener) {
                        if (!Helper_1.isFalsy(listener._eventListener.onGroupMemberAddedToGroup)) {
                            listener._eventListener.onGroupMemberAddedToGroup(message, message.getActionOn(), message.getActionBy(), message.getActionFor());
                        }
                    });
                    break;
                }
                default: {
                    Helper_1.Logger.log("WSHelper: publishActionMessage :: unknown action", message);
                    break;
                }
            }
        }
        catch (err) {
            Helper_1.Logger.error("WSHelper: publishActionMessage", err);
        }
    };
    WSConnectionHelper.prototype.publishTransientMessage = function (cometchatEvent) {
        try {
            var transientMessage_1 = cometchatEvent.getTransientMessage();
            _listenerHandlers.messageHandlers.map(function (listener) {
                if (listener._eventListener.onTransientMessageReceived) {
                    listener._eventListener.onTransientMessageReceived(transientMessage_1);
                }
            });
        }
        catch (err) {
            Helper_1.Logger.error("WSHelper: publishTransientMessage", err);
        }
    };
    WSConnectionHelper.prototype.getCometChatEventFromMessage = function (message) {
        try {
            if (message.hasOwnProperty(WSConstants_1.KEYS.TYPE)) {
                var type = message.type;
                switch (type) {
                    case WSConstants_1.TYPING_INDICATOR.TYPE:
                        return CometChatTypingEvent_1.CometChatTypingEvent.getTypingEventFromJSON(message);
                    case WSConstants_1.RECEIPTS.TYPE:
                        return CometChatReceiptEvent_1.CometChatReceiptEvent.getReceiptEventFromJSON(message);
                    case WSConstants_1.PRESENCE.TYPE:
                        return CometChatPresenceEvent_1.CometChatPresenceEvent.getPresenceEventFromJSON(message);
                    case WSConstants_1.MESSAGE.TYPE:
                        return CometChatMessageEvent_1.CometChatMessageEvent.getMessageEventFromJSON(message);
                    case WSConstants_1.AUTH.TYPE:
                        return CometChatAuthEvent_1.CometChatAuthEvent.getAuthEventFromJSON(message);
                    case WSConstants_1.TRANSIENT_MESSAGE.TYPE:
                        return CometChatTransientEvent_1.CometChatTransientEvent.getTransientEventFromJSON(message);
                }
            }
        }
        catch (err) {
            Helper_1.Logger.error("WSConnectionHelper: getCometChatEventFromMessage", err);
        }
    };
    WSConnectionHelper.wsConnectionHelper = new WSConnectionHelper();
    return WSConnectionHelper;
}());
exports.WSConnectionHelper = WSConnectionHelper;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.CometChatAuthEvent = void 0;
var WSConstants_1 = __webpack_require__(5);
var CometChatEvent_1 = __webpack_require__(9);
var CometChatAuthEvent =  (function (_super) {
    __extends(CometChatAuthEvent, _super);
    function CometChatAuthEvent(appId, receiver, receiverType, sender, deviceId) {
        var _this = _super.call(this, appId, receiver, receiverType, sender, deviceId) || this;
        _this.setType(WSConstants_1.AUTH.TYPE);
        return _this;
    }
    CometChatAuthEvent.prototype.getStatus = function () {
        return this.status;
    };
    CometChatAuthEvent.prototype.setStatus = function (status) {
        this.status = status;
    };
    CometChatAuthEvent.prototype.getCode = function () {
        return this.code;
    };
    CometChatAuthEvent.prototype.setCode = function (code) {
        this.code = code;
    };
    CometChatAuthEvent.prototype.setAuth = function (auth) {
        this.auth = auth;
    };
    CometChatAuthEvent.prototype.getAuth = function () {
        return this.auth;
    };
    CometChatAuthEvent.prototype.setPresenceSubscription = function (presenceSubscription) {
        this.presenceSubscription = presenceSubscription;
    };
    CometChatAuthEvent.prototype.getPresenceSubscription = function () {
        return this.presenceSubscription;
    };
    CometChatAuthEvent.prototype.setDeviceId = function (deviceId) {
        this.deviceId = deviceId;
    };
    CometChatAuthEvent.prototype.getdeviceId = function () {
        return this.deviceId;
    };
    CometChatAuthEvent.prototype.setExtraParmaeters = function (params) {
        this.params = params;
    };
    CometChatAuthEvent.prototype.getExtraParameters = function () {
        return this.params;
    };
    CometChatAuthEvent.prototype.getAsString = function () {
        return JSON.stringify(this.getAsJSONObject());
    };
    CometChatAuthEvent.prototype.getAsJSONObject = function () {
        var mainObject = this.getCometChatEventJSON();
        var bodyObject = {};
        bodyObject[WSConstants_1.KEYS.AUTH] = this.auth;
        bodyObject[WSConstants_1.KEYS.DEVICE_ID] = this.deviceId;
        bodyObject[WSConstants_1.KEYS.PRESENCE_SUBSCRIPTION] = this.presenceSubscription;
        bodyObject[WSConstants_1.KEYS.PARAMS] = this.params;
        mainObject[WSConstants_1.KEYS.BODY] = bodyObject;
        return mainObject;
    };
    CometChatAuthEvent.getAuthEventFromJSON = function (message) {
        var appId = message[WSConstants_1.KEYS.APP_ID];
        var receiver = message[WSConstants_1.KEYS.RECEIVER];
        var receiverType = message[WSConstants_1.KEYS.RECEIVER_TYPE];
        var deviceId = message[WSConstants_1.KEYS.DEVICE_ID];
        var sender = message[WSConstants_1.KEYS.SENDER];
        var bodyObject = message[WSConstants_1.KEYS.BODY];
        var status = bodyObject[WSConstants_1.KEYS.STATUS];
        var code = bodyObject[WSConstants_1.KEYS.CODE];
        var cometChatAuthEvent = new CometChatAuthEvent(appId, receiver, receiverType, sender, deviceId);
        cometChatAuthEvent.setStatus(status);
        cometChatAuthEvent.setCode(code);
        return cometChatAuthEvent;
    };
    return CometChatAuthEvent;
}(CometChatEvent_1.CometChatEvent));
exports.CometChatAuthEvent = CometChatAuthEvent;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.CometChatMessageEvent = void 0;
var MessageController_1 = __webpack_require__(10);
var WSConstants_1 = __webpack_require__(5);
var CometChatEvent_1 = __webpack_require__(9);
var CometChatMessageEvent =  (function (_super) {
    __extends(CometChatMessageEvent, _super);
    function CometChatMessageEvent(appId, receiver, receiverType, sender, deviceId) {
        var _this = _super.call(this, appId, receiver, receiverType, sender, deviceId) || this;
        _this.setType(WSConstants_1.MESSAGE.TYPE);
        return _this;
    }
    CometChatMessageEvent.prototype.getMessage = function () {
        return this.message;
    };
    CometChatMessageEvent.prototype.setMessage = function (message) {
        this.message = message;
    };
    CometChatMessageEvent.getMessageEventFromJSON = function (message) {
        var appId = message[WSConstants_1.KEYS.APP_ID];
        var receiver = message[WSConstants_1.KEYS.RECEIVER];
        var receiverType = message[WSConstants_1.KEYS.RECEIVER_TYPE];
        var deviceId = message[WSConstants_1.KEYS.DEVICE_ID];
        var sender = message[WSConstants_1.KEYS.SENDER];
        var bodyObject = message[WSConstants_1.KEYS.BODY];
        var cometChatMessageEvent = new CometChatMessageEvent(appId, receiver, receiverType, sender, deviceId);
        var messageObj = MessageController_1.MessageController.trasformJSONMessge(bodyObject);
        cometChatMessageEvent.setMessage(messageObj);
        return cometChatMessageEvent;
    };
    return CometChatMessageEvent;
}(CometChatEvent_1.CometChatEvent));
exports.CometChatMessageEvent = CometChatMessageEvent;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.CometChatPingEvent = void 0;
var WSConstants_1 = __webpack_require__(5);
var CometChatEvent_1 = __webpack_require__(9);
var CometChatPingEvent =  (function (_super) {
    __extends(CometChatPingEvent, _super);
    function CometChatPingEvent(appId, receiver, receiverType, sender, deviceId) {
        return _super.call(this, appId, receiver, receiverType, sender, deviceId) || this;
    }
    CometChatPingEvent.prototype.getAsString = function () {
        return JSON.stringify(this.getAsJSONObject());
    };
    CometChatPingEvent.prototype.getAsJSONObject = function () {
        var mainObject = {};
        mainObject[WSConstants_1.KEYS.ACTION] = WSConstants_1.KEYS.PING;
        mainObject[WSConstants_1.KEYS.ACK] = "true";
        return mainObject;
    };
    return CometChatPingEvent;
}(CometChatEvent_1.CometChatEvent));
exports.CometChatPingEvent = CometChatPingEvent;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.CometChatPresenceEvent = void 0;
var WSConstants_1 = __webpack_require__(5);
var CometChatEvent_1 = __webpack_require__(9);
var UserModel_1 = __webpack_require__(4);
var CometChatPresenceEvent =  (function (_super) {
    __extends(CometChatPresenceEvent, _super);
    function CometChatPresenceEvent(appId, receiver, receiverType, sender, deviceId) {
        var _this = _super.call(this, appId, receiver, receiverType, sender, deviceId) || this;
        _this.setType(WSConstants_1.PRESENCE.TYPE);
        return _this;
    }
    CometChatPresenceEvent.prototype.getAction = function () {
        return this.action;
    };
    CometChatPresenceEvent.prototype.setAction = function (action) {
        this.action = action;
    };
    CometChatPresenceEvent.prototype.getUser = function () {
        return this.user;
    };
    CometChatPresenceEvent.prototype.setUser = function (user) {
        this.user = user;
    };
    CometChatPresenceEvent.prototype.getTimestamp = function () {
        return this.timestamp;
    };
    CometChatPresenceEvent.prototype.setTimestamp = function (timestamp) {
        this.timestamp = timestamp;
    };
    CometChatPresenceEvent.getPresenceEventFromJSON = function (message) {
        var appId = message[WSConstants_1.KEYS.APP_ID];
        var deviceId = message[WSConstants_1.KEYS.DEVICE_ID];
        var sender = message[WSConstants_1.KEYS.SENDER];
        var bodyObject = message[WSConstants_1.KEYS.BODY];
        var action = bodyObject[WSConstants_1.KEYS.ACTION];
        var user = bodyObject[WSConstants_1.KEYS.USER];
        var timestamp = bodyObject[WSConstants_1.KEYS.TIMESTAMP];
        var cometChatPresenceEvent = new CometChatPresenceEvent(appId, '', '', sender, deviceId);
        cometChatPresenceEvent.setAction(action);
        cometChatPresenceEvent.setUser(new UserModel_1.User(user));
        cometChatPresenceEvent.setTimestamp(timestamp);
        return cometChatPresenceEvent;
    };
    return CometChatPresenceEvent;
}(CometChatEvent_1.CometChatEvent));
exports.CometChatPresenceEvent = CometChatPresenceEvent;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.CometChatReceiptEvent = void 0;
var WSConstants_1 = __webpack_require__(5);
var CometChatEvent_1 = __webpack_require__(9);
var MessageReceipt_1 = __webpack_require__(22);
var UserModel_1 = __webpack_require__(4);
var CometChatReceiptEvent =  (function (_super) {
    __extends(CometChatReceiptEvent, _super);
    function CometChatReceiptEvent(appId, receiver, receiverType, sender, deviceId, messageSender) {
        var _this = _super.call(this, appId, receiver, receiverType, sender, deviceId, messageSender) || this;
        _this.setType(WSConstants_1.RECEIPTS.TYPE);
        return _this;
    }
    CometChatReceiptEvent.prototype.getAction = function () {
        return this.action;
    };
    CometChatReceiptEvent.prototype.setAction = function (action) {
        this.action = action;
    };
    CometChatReceiptEvent.prototype.getMessageReceipt = function () {
        return this.receipt;
    };
    CometChatReceiptEvent.prototype.setMessageReceipt = function (receipt) {
        this.receipt = receipt;
    };
    CometChatReceiptEvent.prototype.getAsString = function () {
        return JSON.stringify(this.getAsJSONObject());
    };
    CometChatReceiptEvent.prototype.getAsJSONObject = function () {
        var mainObject = this.getCometChatEventJSON();
        var bodyObject = {};
        bodyObject[WSConstants_1.KEYS.ACTION] = this.action;
        bodyObject[WSConstants_1.KEYS.MESSAGE_ID] = this.receipt.getMessageId();
        bodyObject[WSConstants_1.KEYS.USER] = this.receipt.getSender();
        mainObject[WSConstants_1.KEYS.BODY] = bodyObject;
        return mainObject;
    };
    CometChatReceiptEvent.getReceiptEventFromJSON = function (message) {
        var appId = message[WSConstants_1.KEYS.APP_ID];
        var receiver = message[WSConstants_1.KEYS.RECEIVER];
        var receiverType = message[WSConstants_1.KEYS.RECEIVER_TYPE];
        var deviceId = message[WSConstants_1.KEYS.DEVICE_ID];
        var sender = message[WSConstants_1.KEYS.SENDER];
        var bodyObject = message[WSConstants_1.KEYS.BODY];
        var action = bodyObject[WSConstants_1.KEYS.ACTION];
        var user = bodyObject[WSConstants_1.KEYS.USER];
        var messageId = bodyObject[WSConstants_1.KEYS.MESSAGE_ID];
        var timestamp = bodyObject[WSConstants_1.KEYS.TIMESTAMP];
        var cometChatReceiptEvent = new CometChatReceiptEvent(appId, receiver, receiverType, sender, deviceId);
        cometChatReceiptEvent.setAction(action);
        var messageReceipt = new MessageReceipt_1.MessageReceipt();
        messageReceipt.setSender(new UserModel_1.User(user));
        messageReceipt.setReceiverType(receiverType);
        messageReceipt.setReceiver(receiver);
        if (action === WSConstants_1.RECEIPTS.ACTION.DELIVERED) {
            messageReceipt.setReceiptType(WSConstants_1.RECEIPTS.RECEIPT_TYPE.DELIVERY_RECEIPT);
            messageReceipt.setDeliveredAt(timestamp);
        }
        if (action === WSConstants_1.RECEIPTS.ACTION.READ) {
            messageReceipt.setReceiptType(WSConstants_1.RECEIPTS.RECEIPT_TYPE.READ_RECEIPT);
            messageReceipt.setReadAt(timestamp);
        }
        messageReceipt.setMessageId(messageId.toString());
        messageReceipt.setTimestamp(timestamp);
        cometChatReceiptEvent.setMessageReceipt(messageReceipt);
        return cometChatReceiptEvent;
    };
    return CometChatReceiptEvent;
}(CometChatEvent_1.CometChatEvent));
exports.CometChatReceiptEvent = CometChatReceiptEvent;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.CometChatTransientEvent = void 0;
var WSConstants_1 = __webpack_require__(5);
var CometChatEvent_1 = __webpack_require__(9);
var TransientMessage_1 = __webpack_require__(27);
var UserModel_1 = __webpack_require__(4);
var CometChatTransientEvent =  (function (_super) {
    __extends(CometChatTransientEvent, _super);
    function CometChatTransientEvent(appId, receiver, receiverType, sender, deviceId) {
        var _this = _super.call(this, appId, receiver, receiverType, sender, deviceId) || this;
        _this.setType(WSConstants_1.TRANSIENT_MESSAGE.TYPE);
        return _this;
    }
    CometChatTransientEvent.prototype.getTransientMessage = function () {
        return this.transientMessage;
    };
    CometChatTransientEvent.prototype.setTransientMessage = function (transientMessage) {
        this.transientMessage = transientMessage;
    };
    CometChatTransientEvent.prototype.getAsString = function () {
        return JSON.stringify(this.getAsJSONObject());
    };
    CometChatTransientEvent.prototype.getAsJSONObject = function () {
        var mainObject = this.getCometChatEventJSON();
        var bodyObject = {};
        bodyObject[WSConstants_1.KEYS.USER] = this.transientMessage.getSender();
        if (this.transientMessage.getData()) {
            bodyObject[WSConstants_1.KEYS.DATA] = this.transientMessage.getData();
        }
        mainObject[WSConstants_1.KEYS.BODY] = bodyObject;
        return mainObject;
    };
    CometChatTransientEvent.getTransientEventFromJSON = function (message) {
        var appId = message[WSConstants_1.KEYS.APP_ID];
        var receiver = message[WSConstants_1.KEYS.RECEIVER];
        var receiverType = message[WSConstants_1.KEYS.RECEIVER_TYPE];
        var deviceId = message[WSConstants_1.KEYS.DEVICE_ID];
        var sender = message[WSConstants_1.KEYS.SENDER];
        var bodyObject = message[WSConstants_1.KEYS.BODY];
        var user = bodyObject[WSConstants_1.KEYS.USER];
        var data = bodyObject[WSConstants_1.KEYS.DATA];
        var cometChatTransientEvent = new CometChatTransientEvent(appId, receiver, receiverType, sender, deviceId);
        var receivedTransientMessage = new TransientMessage_1.TransientMessage(receiver, receiverType, data);
        receivedTransientMessage.setSender(new UserModel_1.User(user));
        if (bodyObject.hasOwnProperty(WSConstants_1.KEYS.DATA) && bodyObject[WSConstants_1.KEYS.DATA]) {
            receivedTransientMessage.setData(data);
        }
        cometChatTransientEvent.setTransientMessage(receivedTransientMessage);
        return cometChatTransientEvent;
    };
    return CometChatTransientEvent;
}(CometChatEvent_1.CometChatEvent));
exports.CometChatTransientEvent = CometChatTransientEvent;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.CometChatTypingEvent = void 0;
var WSConstants_1 = __webpack_require__(5);
var CometChatEvent_1 = __webpack_require__(9);
var TypingNotification_1 = __webpack_require__(26);
var UserModel_1 = __webpack_require__(4);
var CometChatTypingEvent =  (function (_super) {
    __extends(CometChatTypingEvent, _super);
    function CometChatTypingEvent(appId, receiver, receiverType, sender, deviceId) {
        var _this = _super.call(this, appId, receiver, receiverType, sender, deviceId) || this;
        _this.setType(WSConstants_1.TYPING_INDICATOR.TYPE);
        return _this;
    }
    CometChatTypingEvent.prototype.getAction = function () {
        return this.action;
    };
    CometChatTypingEvent.prototype.setAction = function (action) {
        this.action = action;
    };
    CometChatTypingEvent.prototype.getTypingIndicator = function () {
        return this.typingIndicator;
    };
    CometChatTypingEvent.prototype.setTypingIndicator = function (typing) {
        this.typingIndicator = typing;
    };
    CometChatTypingEvent.prototype.getAsString = function () {
        return JSON.stringify(this.getAsJSONObject());
    };
    CometChatTypingEvent.prototype.getAsJSONObject = function () {
        var mainObject = this.getCometChatEventJSON();
        var bodyObject = {};
        bodyObject[WSConstants_1.KEYS.ACTION] = this.action;
        bodyObject[WSConstants_1.KEYS.USER] = this.typingIndicator.getSender();
        if (this.typingIndicator.getMetadata()) {
            bodyObject[WSConstants_1.KEYS.METADATA] = this.typingIndicator.getMetadata();
        }
        mainObject[WSConstants_1.KEYS.BODY] = bodyObject;
        return mainObject;
    };
    CometChatTypingEvent.getTypingEventFromJSON = function (message) {
        var appId = message[WSConstants_1.KEYS.APP_ID];
        var receiver = message[WSConstants_1.KEYS.RECEIVER];
        var receiverType = message[WSConstants_1.KEYS.RECEIVER_TYPE];
        var deviceId = message[WSConstants_1.KEYS.DEVICE_ID];
        var sender = message[WSConstants_1.KEYS.SENDER];
        var bodyObject = message[WSConstants_1.KEYS.BODY];
        var action = bodyObject[WSConstants_1.KEYS.ACTION];
        var user = bodyObject[WSConstants_1.KEYS.USER];
        var metadata = bodyObject[WSConstants_1.KEYS.METADATA];
        var cometChatTypingEvent = new CometChatTypingEvent(appId, receiver, receiverType, sender, deviceId);
        cometChatTypingEvent.setAction(action);
        var receivedTypingIndicator = new TypingNotification_1.TypingIndicator(receiver, receiverType);
        receivedTypingIndicator.setSender(new UserModel_1.User(user));
        if (bodyObject.hasOwnProperty(WSConstants_1.KEYS.METADATA) && bodyObject[WSConstants_1.KEYS.METADATA]) {
            receivedTypingIndicator.setMetadata(metadata);
        }
        cometChatTypingEvent.setTypingIndicator(receivedTypingIndicator);
        return cometChatTypingEvent;
    };
    return CometChatTypingEvent;
}(CometChatEvent_1.CometChatEvent));
exports.CometChatTypingEvent = CometChatTypingEvent;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.getWSURL = exports.stringifyMessage = exports.checkConnection = void 0;
var Constants_1 = __webpack_require__(1);
var Helper_1 = __webpack_require__(0);
var WSConstants_1 = __webpack_require__(5);
function checkConnection(connection) {
    return connection && connection.readyState === WSConstants_1.READY_STATE.OPEN;
}
exports.checkConnection = checkConnection;
function stringifyMessage(message) {
    return JSON.stringify(message);
}
exports.stringifyMessage = stringifyMessage;
function getWSURL() {
    return new Promise(function (resolve, reject) {
        Helper_1.getAppSettings().then(function (settings) {
            var wsURL = WSConstants_1.WS.protocol + Helper_1.getChatHost(settings) + ":" + settings[Constants_1.APP_SETTINGS.KEYS.CHAT_WSS_PORT];
            resolve(wsURL);
        }, function (error) {
            Helper_1.Logger.error("WSHelper :: getWSURL", error);
        });
    });
}
exports.getWSURL = getWSURL;


 }),

 (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
exports.CCExtension = void 0;
var Helper_1 = __webpack_require__(0);
var CCExtension =  (function () {
    function CCExtension(extension) {
        this.id = '';
        this.name = '';
        if (extension) {
            if (!Helper_1.isFalsy(extension.id)) {
                this.id = extension.id;
            }
            if (!Helper_1.isFalsy(extension.name)) {
                this.name = extension.name;
            }
        }
    }
    
    CCExtension.prototype.getId = function () {
        return this.id;
    };
    
    CCExtension.prototype.getName = function () {
        return this.name;
    };
    return CCExtension;
}());
exports.CCExtension = CCExtension;


 }),

 (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(64);
var bytesToUuid = __webpack_require__(65);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


 }),

 (function(module, exports) {








var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  
  var rnds8 = new Uint8Array(16); 

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  
  
  
  
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


 }),

 (function(module, exports) {


var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;


 })
 ]);
});