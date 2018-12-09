# CometChatPulse
## The simplest voice, video and text chat SDK.

CometChat enables you to add voice, video and text chat to your  app in minutes! 



### Before you start

 The first thing we need to do is grab all the necessary information to start with **CometChat Pulse**.
Please keep following information handy.

| APP ID  	| Unique identification of your app.Generated and given to you at the time of app creation. 	|
|---------	|-------------------------------------------------------------------------------------------	|
| API KEY 	| The API keys are use to give authorized access to app.                                    	|


### Adding JS SDK to your project

You can add the CometChat JS SDK to your project using `npm`.
 Please follow the below steps to get started.


```javascript
npm i @cometchat-pulse/cometchat-pulse.js
```

```javascript
import { CometChat } from '@cometchat-pulse/cometchat-pulse.js';
```
### Initialize the CometChat Pulse SDK

This method will initializes the  CometChat SDK, initializes the basic settings required for the CometChat SDK to function.
*You need to use the below method to do so*
```javascript
var appId="xxxxxxxx";
CometChat.init(appId);
```
> This method needs to be called once in the entire scope of the app. We suggest you call the `init()` method before you call any other method from `CometChat`"

Once you have initialized the CometChat Pulse SDK you can call Login.

### Login

Once the initialization is successful, you will need to log the user into CometChat. We provide the below two mechanisms to do so.


**Login using UserId and API KEY** 
```javascript
var appId="xxxxxxxx";
CometChat.init(appId);
var UID = "SUPERHERO1";
var apiKey = "xxxxxxxxxxxxxxxxxxxxxxxxx";
CometChat.login(UID,apiKey).then(AppUser=>{
  console.log("AppUser Information :", {AppUser});
  // do something when login is successful 
}).catch(error=>{
  console.log("AppUser Information :", {error});
  // do something when login fails  
});
```

> We suggest you avoid using this method, as this method takes the API-key as a parameter which can be insecure as the API-key can be obtained from the `Javascript` file. We suggest that you generate the auth-token using our [Restful API](https://cometchat-8.readme.io/v1/docs/js-quick-start-guide) at the server once the user is successfully authenticated for your app and then at the app level call the login method which only accepts the *Auth-Token* as shown below"
}

**Login using App Id and  Auth Token** 
```javascript var appId="xxxxxxxx";
CometChat.init(appId);
var authToken = "xxxxxxxxxxxxxxxxxxxxxxxxx";
CometChat.login(authToken).then(AppUser=>{ 
console.log("AppUser Information :", {AppUser});
   // do something when login is successful  
}).catch(error=>{  console.log("AppUser Information :", {error});
  // do something when login fails 
});
```

**AppUser object will look as follow** 


```json
{ 
    "uid": "superhero1",
    "name": "name provided at the time of registration",
    "authToken": "secure-auth-token-created for this session",
    "avatar": "avatar-url-provided-at-the-time-of-user-creation", 
    "link": "profile-url-provided-at-the-time-of-registration",
    "status": "offline | online",
    "language": "json"
}
```
You can get more methods of [AppUser](https://cometchat-8.readme.io/v1/docs/js-cometchat-classes-appendix#section-appuser) class form [here](https://cometchat-8.readme.io/v1/docs/js-cometchat-classes-appendix#section-appuser)


### Get list of Users

In order to fetch the list of users available to chat, you will have to make use of a class named `UsersRequest`. Using the `fetchNext()` method provided by the class, you can obtain a paginated list of Users to chat with.

You need to use the `UsersRequestBuilder` class to create an object of the `UsersRequest` class. 
The `build()` method of the `UsersRequestBuilder` class returns an object of the `UsersRequest` class. This object can be used to call the `fetchNext()` method to get all the users available to chat with.

All the pagination related information is handled internally. You just need to be careful to call the `fetchNext()` method on the same object.

You can achieve this as shown below:

```javascript 
import { CometChat, UsersRequestBuilder } from '@cometchat-pulse/cometchat-pulse.js';

var limit = 30;
var usersRequestBuilder = new UsersRequestBuilder();
var usersRequest = usersRequestBuilder.setLimit(limit).build();

usersRequest.fetchNext().then(
    appUserList => {
        //Handle list of the AppUsers.
        appUserList.map(appUser => {
            //handle the appUser individualy.
        });
    },
    error => {
        //Handle error.
    }
);
```
This can be implemented along with scrolling, to display the complete list of users available to chat.

The UsersRequestBuilder class allows you to set the limit to the number of users fetched in a single operation. You can use the `setLimit(limit)` method as shown in the above code snippet. The maximum limit for a single operation is 100, while the default limit is set to 20;

You will receive the `array` of `AppUsers` in the  resolve method of the promise.

if you reach the end of the list?, it will give you the **empty array.** 

```json
[
  {
    "uid": "superhero1",
    "name": "name provided at the time of registration",
    "authToken": "secure-auth-token-created for this session",
    "avatar": "avatar-url-provided-at-the-time-of-user-creation",
    "link": "profile-url-provided-at-the-time-of-registration",
    "status": "offline | online",
    "lastActiveAt": "1544114449235"
  },
  {
    "uid": "superhero10",
    "name": "name provided at the time of registration",
    "authToken": "secure-auth-token-created for this session",
    "avatar": "avatar-url-provided-at-the-time-of-user-creation",
    "link": "profile-url-provided-at-the-time-of-registration",
    "status": "offline | online",
    "lastActiveAt": "1544114449235"
  },
  {
    "uid": "superhero100",
    "name": "name provided at the time of registration",
    "authToken": "secure-auth-token-created for this session",
    "avatar": "avatar-url-provided-at-the-time-of-user-creation",
    "link": "profile-url-provided-at-the-time-of-registration",
    "status": "offline | online",
    "lastActiveAt": "1544114449235"
  }
]
```
### Get User Information 
To get the information of any particular user, you can use the `getUser()` method provided by the CometChat class. You can use the method as shown below:
```
var uid="SUPERHERO2" //udi is the unique id of the user whos info is to be requested
CometChat
	.getUser(uid) 
	.then(AppUser => {
		// Handle the user
	})
	.catch(error => {
		// Handle error
	});
```
expected user
```JSON
{
  "uid": "SUPERHERO2",
  "name": "SUPERHERO2",
  "avatar": "avatar-url-provided-at-the-time-of-user-creation",
  "lastActiveAt": "1543917470588",
  "link": "profile-url-provided-at-the-time-of-registration",
  "status": "offline|online"
}
```
> Only the information provided at the time of the user creation or updating will be available except for the `status` and `lastActiveAt` values.

### Get list of groups
In order to fetch the list of groups available to chat, you will have to make use of a class named `GroupsRequest`. Using the `fetchNext()` method provided by the class, you can obtain a paginated list of Groups to chat in.

You need to use the `GroupsRequestBuilder` class to create an object of the `GroupsRequest` class. 
The `build()` method of the `GroupsRequestBuilder` class returns an object of the `GroupsRequest` class. This object can be used to call the `fetchNext()` method to get all the users available to chat with.

All the pagination related information is handled internally. You just need to be careful to call the `fetchNext()` method on the same object.

You can achieve this as shown below:
``` 
var limit=30;

var groupsRequestBuilder = new GroupsRequestBuilder();
var groupRequest = groupsRequestBuilder.setLimit(limit).build();

groupRequest.fetchNext().then(groupList => {  
  // Handle the groups in the list 
  groupList.map(group=>{
    //handle the group
  	console.log(group);
  });  
}, error => {
  // Handle Exception
});

```

**Group List** 
```JSON
[
  {
    "guid": "SUPERGROUP1",
    "name": "SUPERGROUP ONE",
    "type": "public",
    "description": "Description for your group",
    "createdAt": 1543931213,
    "owner": "superhero1",
    "hasJoined": true
  },
  {
    "guid": "SUPERGROUP2",
    "name": "SUPERGROUP TWO",
    "type": "protected",
    "description": "Description for your group",
    "createdAt": 1544024856,
    "owner": "superhero13"
  },
  {
    "guid": "SUPERGROUP3",
    "name": "SUPERGROUP THREE",
    "type": "private",
    "description": "Description for your group",
    "icon": "https://www.w3schools.com/w3css/img_lights.jpg",
    "createdAt": 1543933128,
    "owner": "superhero6",
    "hasJoined": true
  }
]
```

### Get Group information
To get the information of any particular group, you can use the getGroup() method provided by the CometChat class. You can use the method as shown below:

```javascript
var guid = "SUPERGROUP1";
CometChat.getGroup(guid).then(
	group => {
		// Handle the group obtained
		console.log("Information of the group:", group);
	},
	error => {
		// Handle Exception
	}
);
```
**Group object.** 
```json
 {
    "guid": "SUPERGROUP1",
    "name": "SUPERGROUP ONE",
    "type": "public",
    "description": "Description for your group",
    "createdAt": 1543931213,
    "owner": "superhero1",
    "hasJoined": true
  }
  ```
  In either of the two methods described above, you are provided with an object of the Group class. This object contains all the relevant information pertaining to that group. You can find more information [here](/docs/js-cometchat-classes-appendix#section-group)
  
  ### Create a group
  
  You can create a group using `createGroup()` method. This method takes a `Group` object as a parameter which takes all the information related to the group. So, in order to create a group, you will have to create an object of the group and assign all the values to the group. 

To create a group, you can use either of the below two constructors:

1. new Group(String guid, String name, Group.Type.Private, String password);

2. new Group(String guid, String name, Group.Type.Private, String password, String icon, String description)

The groupType needs to be either of the below 3 values :
1. Group.Type.Public
2. Group.Type.Private 
3. Group.Type.Protected

```
var guid = "SUPERGROUP2";
var groupName = "Group Name"
var group = new Group(guid, groupName, Group.Type.Public);

CometChat.createGroup(group).then(group => {
	console.log("On Group Created", JSON.stringify(group))
	// Handle the group Obtained.
}, error => {
	console.log("Error in group creation", error)
	// Handle Exception
}); 
```
**Expected group object** 
```json
{
  "guid": "supergroup2",
  "name": "Group Name",
  "type": "public",
  "createdAt": 1544166885,
  "owner": "superhero1"
}
```
### Join a Group
In order to start participating in group conversations, you will have to join a group. You can do so using the `joinGroup()` method provided by the `CometChat` class. You can refer to the code snippet shown below to achieve this.
```
var guid = "SUPERGROUP1"; // guid of the group to join
var groupName = "Name of the group";
var password = ""; // mandatory in case of protected group

CometChat.joinGroup(guid, groupName, Group.Type.Private, password).then(
	group => {
		console.log("Joined group", group);
		// handle group join success
	},
	error => {
		// handle exception
	}
);
```
Once you have joined a group successfully, you will be able to receive the messages for that group and will also be able to send messages in the group.
The CometChat SDK keeps a track of the groups joined by any user and thus it is not necessary to join the group everytime you need to communicate in the group. You can identify if a group is joined using the `hasJoined` parameter in the group object. For more information, please check [here](/docs/js-cometchat-classes-appendix#section-group).

*In order to stop receiving updates and messages from any joined group, you will have to leave the group as described in the `Leave a Group section`* 

You will receive a list of `GroupMember` objects. For more details related to the information carried by the `GroupMember`  class please check [here](/docs/android-cometchat-classes-appendix#section-group-member)


### Leave a Group
In order to stop receiving updates and messages for any particular joined group, you will have to leave the group. To achieve this you will have to use the `leaveGroup()` method provided by the `CometChat` class as shown below:
```javascript
var guid = "SUPERGROUP1"; // guid of the group to join

CometChat.leaveGroup(guid).then(
	hasLeft => {
		console.log("is user left the group", hasLeft);
    //Posible values for hasLeft true|false
		//Handler group leaving operation.
	},
	error => {
		console.log("Error", { e });
		//handle error
	}
);
```
Once a group is left, the user will not receive any updates or messages pertaining to the group. To start receiving the messages for the group again, the user will have to join the group again.

### Get the list of Group Members
In order to fetch the list of the group members available in the group, you will have to make use of a class named `GroupMembersRequest`. Using the `fetchNext()` method provided by the class, you can obtain a paginated list of Group Members available in the group.

You need to use the `GroupMembersRequestBuilder` class to create an object of the `GroupMembersRequest` class. 
The `build()` method of the `GroupMembersRequestBuilder` class returns an object of the `GroupMembersRequest` class. This object can be used to call the `fetchNext()` method to get all the users available to chat with.

All the pagination related information is handled internally. You just need to be careful to call the `fetchNext()` method on the same object and not create a new object everytime to call the `fetchNext()` method.

You can achieve this as shown below:

```javascript
var guid = "SUPERGROUP1";
var limit = 30;
var groupMemberRequest = new GroupMembersRequestBuilder(guid).setLimit(limit).buid();

groupMemberRequest.fetchNext().then(
	groupMembers => {
		// Handle the group members in the list
		console.log("List of group members", groupMembers);
	},
	error => {
		// Handle Exception
	}
);

```
This can be implemented along with scrolling, to display the complete list of group members available in the group.

The `GroupMembersRequestBuilder` class constructor takes the guid of the group for which the members are to be fetched as a mandatory parameter.

The `GroupMembersRequestBuilder` class also allows you to set the limit to the number of users fetched in a single operation. You can use the `setLimit(int limit)` method as shown in the above code snippet. The maximum limit for a single operation is 100, while the default limit is set to 20;

You will receive the list of users as the `promise`

```json
[
  {
    "isBanned": 0,
    "guid": "SUPERGROUP1",
    "uid": "superhero3",
    "scope": "participant",
    "user": {
      "uid": "superhero3",
      "name": "name provided at the time of registration",
      "authToken": "secure-auth-token-created for this session",
      "avatar": "avatar-url-provided-at-the-time-of-user-creation",
      "link": "profile-url-provided-at-the-time-of-registration",
      "status": "offline | online",
      "lastActiveAt": "1544114449235"
    },
    "joinedAt": 1543921793
  },
  {
    "isBanned": 0,
    "guid": "SUPERGROUP1",
    "uid": "superhero4",
    "scope": "participant",
    "user": {
      "uid": "superhero4",
      "name": "name provided at the time of registration",
      "authToken": "secure-auth-token-created for this session",
      "avatar": "avatar-url-provided-at-the-time-of-user-creation",
      "link": "profile-url-provided-at-the-time-of-registration",
      "status": "offline | online",
      "lastActiveAt": "1544114449235"
    },
    "joinedAt": 1543922035
  },
  {
    "isBanned": 0,
    "guid": "SUPERGROUP1",
    "uid": "superhero6",
    "scope": "participant",
    "user": {
      "uid": "superhero6",
      "name": "name provided at the time of registration",
      "authToken": "secure-auth-token-created for this session",
      "avatar": "avatar-url-provided-at-the-time-of-user-creation",
      "link": "profile-url-provided-at-the-time-of-registration",
      "status": "offline | online",
      "lastActiveAt": "1544114449235"
    },
    "joinedAt": 1543922388
  }
]
```
> You will receive a list of `GroupMember` objects. For more details related to the information carried by the `GroupMember`  class please check [here](/docs/js-cometchat-classes-appendix#section-group-member)


### Send A Message

Using CometChat, you can send two types of messages viz.

1. TextMessage - a plain text message
2. MediaMessage - Any media can be shared like image, video, audio, file etc.

### Send a Text Message:
In order to send a text message to a user or to a group, you can use the `sendMessage()` method provided by the `CometChat` class. 
The `sendMessage()` method takes an object of the `TextMessage` class.
 
The TextMessage class has the below constructor which takes the mandatory parameters. You can use the same to create an object of the class as shown below.
```javascript
var textMessage=new TextMessage(uid, text, MESSAGE_TYPE.TEXT, RECEIVER_TYPE.USER);
```
`CometChat.sendMessage` will return `Javascript Promise` and informs you when the message was sent successfully.
Using the object of the TextMessage class created above, you can use the `sendMessage()` method as shown below to send a text message.

#### Send message to user
```javascript
var uid="SUPERHERO2";
var text="Hello";

var textMessage=new TextMessage(uid, text, MESSAGE_TYPE.TEXT, RECEIVER_TYPE.USER);
cometchat.sendMessage(textMessage).then((message) => {
  console.log("sent message info:",messsage);
 	//Do something with message
}, (error) => {
  	//Handle any error
});
```
#### Send message to group
```javascript
var TextMessage = CometChat.TextMessage;
var uid="SUPERGROUP1";
var text="Hello";

let textMessage=new TextMessage(uid, text, MESSAGE_TYPE.TEXT, RECEIVER_TYPE.GROUP);

CometChat.sendMessage().then((message) => {	
  if(message instanceOf TextMessage)
 	//Do something with message
}, (error) => {
  	//Handle any error
}); 
```
**Message object obtained from send message promise** 
```json
{
  "receiver": "superhero2",
  "type": "text",
  "receiverType": "user",
  "category": "message",
  "data": {
    "text": "Hello",
    "entities": {
      "sender": {
        "entity": {
          "uid": "superhero1",
          "name": "SUPERHERO1",
          "link": "https://abc.xyz.com",
          "avatar": "image-url",
          "status": "offline",
          "role": "admin"
        },
        "entityType": "user"
      },
      "receiver": {
        "entity": {
          "uid": "superhero2",
          "name": "SUPERHERO2",
          "link": "https://abc.xyz.com",
          "avatar": "image-url",
          "status": "offline"
        },
        "entityType": "user"
      }
    }
  },
  "text": "Hello",
  "id": "496",
  "sender": "superhero1",
  "sentAt": 1544169596
}
```
> you can call [`getSender()`](https://cometchat-8.readme.io/v1/docs/js-cometchat-classes-appendix#section-appuser)method on message Object to obtain the complete information of the sender as an [`AppUse`](https://cometchat-8.readme.io/v1/docs/js-cometchat-classes-appendix#section-appuser) object

### Send Media Message:

Just like sending a TextMessage, you need to use the MediaMessage class to send any type of media messages to a user or a group.

An object of the MediaMessage class can be created as shown below:
```javascript 
var mediaMessage=new MediaMessage(fileobject,MESSAGE_TYPE.FILE, RECEIVER_TYPE.GROUP)
```

```javascript
var MediaMessage = CometChat.MediaMessage;

var uid="SUPERHERO2";

let mediaMessage=new MediaMessage(uid, `INPUT FILE OBJECT`,MESSAGE_TYPE.MEDIA, RECEIVER_TYPE.USER);
CometChat.sendMessage(mediaMessage).then((message) => {	    
		// do something.. 
}, (error) => {
	  // handle exceptiobn
});
```

The message types can be one of the below values and can be obtained from the 
`MESSAGE_TYPE`
1.IMAGE
2. VIDEO
3. AUDIO
4. FILE

Both TextMessage and MediaMessage have a custom field called **metadata** that can be used to share additional information with any message which will be received at the receiver end as it was sent.
You can use the `setMetadata()` and `getMetadata()` methods of the TextMessage or MediaMessage class to set and get the same.

```javascript
CometChat.addMessageEventListner(
	"unique_listener_id",
	new MessageEventListener({
		onActionRecived: action => {
			// handle actions
		},
		onMessageReceived: message => {
			if (message instanceof TextMessage) {
				// handle text messages
			} else if (message instanceof MediaMessage) {
				// handle media messages
			}
		}
	})
);
CometChat.addMessageEventListner(
	"unique_listener_id",
	new MessageEventListener({
		onActionRecived: action => {
			// handle actions
		},
		onMessageReceived: message => {
			if (message instanceof TextMessage) {
				// handle text messages
			} else if (message instanceof MediaMessage) {
				// handle media messages
			}
		}
	})
);
```
You need to add these listeners to all the activities where you need to receive events of messages or actions received.

You can also remove the listeners once the activity or fragment is not in use using the below methods:
```javascript
CometChat.removeMessageEventListener("unique_listener_id");
```

Apart from receiving real-time messages and actions, you will also need a mechanism to fetch the previous messages. You can do so using the mechanism mentioned in the next section.

### Fetching previous messages for a User/Group
In order to fetch the previous messages for a conversation with any particular user, you will have to make use of a class named `UserMessagesRequest`. Using the `fetchPrevious()` method provided by the class, you can obtain a paginated list of Messages that we a part of the conversation with the user.

You need to use the `UserMessagesRequestBuilder` class to create an object of the `UserMessagesRequest` class. 
The `UserMessagesRequestBuilder` class provides constructor:

Following are the two ways to build `UserMessagesRequestBuilder`.

```javascript 
//Initiated by id.
var messageRequestBuilder = new UserMessagesRequestBuilder(uid, currentTime, MESSAGE_REQUEST.ID);

//Initited by message timestamp.
var messageRequestBuilder = new UserMessagesRequestBuilder(uid, currentTime, MESSAGE_REQUEST.SENT_AT);
```

This can be used if you would like to fetch the previous messages prior to the messageId provided.  To fetch all the messages from the start, you can pass the messageId parameter as 0.
The `build()` method of the `UserMessagesRequestBuilder` class returns an object of the `UserMessagesRequest` class. This object can be used to call the `fetchPrevious()` method to get all the users available to chat with.

All the pagination related information is handled internally. You just need to be careful to call the `fetchPrevious()` method on the same object and not create a new object every time to call the `fetchPrevious()` method.


You can achieve this as shown below:

#### By timestamp
```javascript
var uid = "superhero2"; //Uid of the user with the communication is happening.;

var currentTime = parseInt((new Date().getTime() / 1000).toString());
var messageRequestBuilder = new UserMessagesRequestBuilder(uid, currentTime, MESSAGE_REQUEST.SENT_AT);

var messageRequest = messageRequestBuilder.setLimit(50).build();

messageRequest
	.fetchPrevious()
	.then(messages => {
		console.log("List of messages:", JSON.stringify(messages));
		//handle the list of messages
		message.map(message => {
			console.log("Message object:", message);
			//handle message object
		});
		// handle list of messages received
	})
	.catch(err => {
		// handle exception
	});
```
#### By message Id
```javascript 
var uid = "superhero2"; //Uid of the user with the communication is happening.;

var messageId = parseInt((new Date().getTime() / 1000).toString()); // minimum message id available for perticular conversation.
var messageRequestBuilder = new UserMessagesRequestBuilder(uid, messageId, MESSAGE_REQUEST.ID);

var messageRequest = messageRequestBuilder.setLimit(50).build();
messageRequest
	.fetchPrevious()
	.then(messages => {
		console.log("List of messages:", JSON.stringify(messages));
		//handle the list of messages
		message.map(message => {
			console.log("Message object:", message);
			//handle message object
		});
		// handle list of messages received
	})
	.catch(err => {
		// handle exception
	});
 ```
**Following is the output object you will get** 
```json
[
  {
    "receiver": "superhero1",
    "type": "text",
    "receiverType": "user",
    "category": "message",
    "data": {
      "text": "asfasf",
      "entities": {
        "sender": {
          "entity": {
            "uid": "superhero2",
            "link": "https://abc.xyz.com",
            "name": "SUPERHERO2",
            "avatar": "provided avatar url",
            "status": "offline"
          },
          "entityType": "user"
        },
        "receiver": {
          "entity": {
            "uid": "superhero1",
            "link": "https://abc.xyz.com",
            "name": "SUPERHERO1",
            "avatar": "provided avatar url",
            "status": "offline"
          },
          "entityType": "user"
        }
      }
    },
    "text": "asfasf",
    "id": "64",
    "sender": "superhero2",
    "sentAt": 1543992440
  },
  {
    "receiver": "superhero1",
    "type": "text",
    "receiverType": "user",
    "category": "message",
    "data": {
      "text": "asfas",
      "entities": {
        "sender": {
          "entity": {
            "uid": "superhero2",
            "link": "https://abc.xyz.com",
            "name": "SUPERHERO2",
            "avatar": "provided avatar url",
            "status": "offline"
          },
          "entityType": "user"
        },
        "receiver": {
          "entity": {
            "uid": "superhero1",
            "link": "https://abc.xyz.com",
            "name": "SUPERHERO1",
            "avatar": "provided avatar url",
            "status": "offline"
          },
          "entityType": "user"
        }
      }
    },
    "text": "asfas",
    "id": "65",
    "sender": "superhero2",
    "sentAt": 1543992507
  },
  {
    "receiver": "superhero1",
    "type": "text",
    "receiverType": "user",
    "category": "message",
    "data": {
      "text": "sdgsdg",
      "entities": {
        "sender": {
          "entity": {
            "uid": "superhero2",
            "link": "https://abc.xyz.com",
            "name": "SUPERHERO2",
            "avatar": "provided avatar url",
            "status": "offline"
          },
          "entityType": "user"
        },
        "receiver": {
          "entity": {
            "uid": "superhero1",
            "link": "https://abc.xyz.com",
            "name": "SUPERHERO1",
            "avatar": "provided avatar url",
            "status": "offline"
          },
          "entityType": "user"
        }
      }
    },
    "text": "sdgsdg",
    "id": "66",
    "sender": "superhero2",
    "sentAt": 1543992566
  },
  {
    "receiver": "superhero2",
    "type": "text",
    "receiverType": "user",
    "category": "message",
    "data": {
      "text": "asfasfasf",
      "entities": {
        "sender": {
          "entity": {
            "uid": "superhero1",
            "link": "https://abc.xyz.com",
            "name": "SUPERHERO1",
            "avatar": "provided avatar url",
            "status": "offline"
          },
          "entityType": "user"
        },
        "receiver": {
          "entity": {
            "uid": "superhero2",
            "link": "https://abc.xyz.com",
            "name": "SUPERHERO2",
            "avatar": "provided avatar url",
            "status": "offline"
          },
          "entityType": "user"
        }
      }
    },
    "text": "asfasfasf",
    "id": "67",
    "sender": "superhero1",
    "sentAt": 1543992740
  }
]
```

This, when implemented with upward scrolling, can enable you to fetch the entire conversation with any user. You can use the `setLimit()` method of the builder class to set the number of messages to be received in one iteration.

> **For Group**
> Similarly, for Groups, You need to use the `**GroupMessagesRequest**` class and pass the id of the group to the builder constructor in place of the user uid. Everything else stays the same.

In the case of the list of Messages Received, the messages can be either of the 3 types:

1. TextMessage
2. MediaMessage
3. Action

you will have to check for all the three types to segregate the messages and act on the same accordingly. This can be done using the `instanceOf` operator in java.  This can also be achieved using the category variable available. 
The category can either be `message` or `action`.

For, detailed information regarding the `TextMessage`, `MediaMessage` and Action classes, you can check [this](/docs/android-cometchat-classes-appendix#section-messages)
