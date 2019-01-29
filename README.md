<div style="width:100%">
<div style="width:100%">
	<div style="width:50%; display:inline-block">
		<p align="center">
		<img style="text-align:center" width="180" height="180" alt="" src="https://raw.githubusercontent.com/cometchat-pro/ios-swift-chat-app/master/Screenshots/CometChat%20Logo.png">	
		</p>	
	</div>	
</div>
</br>
</br>
</div>

CometChat Pro enables you to add voice, video & text chat for your website & app.

<a href="https://www.npmjs.com">[![Platform](https://img.shields.io/badge/Platform-Javascript-blue.svg)](#)</a>
<a href="https://www.npmjs.com">[![Platform](https://img.shields.io/badge/Platform-NPM-orange.svg)](#)</a>

# Quick Start

This guide demonstrates how to add chat to a Javascript application using CometChat. Before you begin, we strongly recommend you read the <a href="https://prodocs.cometchat.com/docs/concepts" target="_blank">Key Concepts</a> guide.

## Get your Application Keys

<a href="https://app.cometchat.com" target="_blank">Signup for CometChat</a> and then:

1. Create a new app: Enter a name & hit the **+** button
2. Head over to the **API Keys** section and click on the **Create API Key** button
3. Enter a name and select the scope as **Auth Only**
4. Now note the **API Key** and **App ID**

## Add the CometChat Dependency

### NPM
First, install via npm

`Shell`

```shell
npm install @cometchat-pro/chat --save
```

Then, import the `CometChat` object wherever you want to use CometChat

`JavaScript`

```Javascript 
import { CometChat } from "@cometchat-pro/chat" 
```
### HTML (via CDN)
Include the CometChat Javascript library in your HTML code


```HTML
<script type="text/javascript" src="https://unpkg.com/@cometchat-pro/chat/CometChat.js"></script>
```

## Initialize CometChat
The `init()` method initializes the settings required for `CometChat`.

You need to call `init()` before calling any other method from CometChat.

```Javascript
var appID = "APP_ID";

CometChat.init(appID).then(
  hasInitialized => {
    console.log("Initialization completed successfully", hasInitialized);
    // You can now call login function.
  },
  error => {
    console.log("Initialization failed with error:", error);
    // Check the reason for error and take apppropriate action.
  }
);
```
Make sure you replace the `APP_ID` with your CometChat **App ID** in the above code.

## Login your user
Once initialization is successful, you will need to log the user into CometChat using the login() method.

We recommend you call the CometChat login method once your user logs into your app.
```Javascript

var UID = "SUPERHERO1";
var apiKey = "API_KEY";

CometChat.login(UID, apiKey).then(
  User => {
    console.log("Login Successful:", { User });
    // User loged in successfully.
  },
  error => {
    console.log("Login failed with exception:", { error });
    // User login failed, check error and take appropriate action.
  }
);
```
Make sure you replace the `API_KEY` with your `CometChat` **API Key** in the above code.

>**Sample Users**
>We have set-up 5 users for testing having UIDs: `SUPERHERO1`, `SUPERHERO2`, `SUPERHERO3`, `SUPERHERO4` and `SUPERHERO5`.

The `login()` method returns the User object on `Promise` resolved containing all the information of the logged in user.

## Send a message
Once your user has logged in, you can send a message using the `sendMessage()` method.
```Javascript
var receiverID = "SUPERHERO2";
var messageText = "Hello";
var messageType = CometChat.MESSAGE_TYPE.TEXT;
var receiverType = CometChat.RECEIVER_TYPE.USER;

var textMessage = new CometChat.TextMessage(receiverID, messageText, messageType, receiverType);

CometChat.sendMessage(textMessage).then(
  message => {
    console.log("Message sent successfully:", message);
    // Do something with message
  },
  error => {
    console.log("Message sending failed with error:", error);
    // Handle any error
  }
);
```
| **Parameter** | **Description**                                                                                                                                 |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| receiverID    | The UID or GUID of the recipient                                                                                                                |
| messageText   | The message string to be sent                                                                                                                   |
| messageType   | The type of the message that needs to be sent which in this case is `CometChat.MESSAGE_TYPE.TEXT` (text)                                        |
| receiverType  | The type of the receiver to whom the message is to be sent i.e `CometChat.RECEIVER_TYPE.USER` (user) or `CometChat.RECEIVER_TYPE.GROUP` (group) |

Once the message is sent successfully, you will receive the message information as <a href="https://prodocs.cometchat.com/docs/js-appendix#section-textmessage">`TextMessage` </a> object on `Promise` resolved.

## Receive Messages
You can add multiple MessageListener using the `addMessageListener()` method, to receive incoming message wherever you need.

```Javascript 
var listenerID = "UNIQUE_LISTENER_ID";can we get single amazon server !
CometChat.addMessageListener(listenerID, new CometChat.MessageListener({
  onTextMessageReceived: message => {
    console.log("Message received successfully:", message);
    // Handle text message
  }
}));
```
| **Parameter** | **Description**                                                                                |
|---------------|------------------------------------------------------------------------------------------------|
| listenerID    | An ID that uniquely identifies that listener. We recommend using the activity or fragment name |
 

To learn more, please refer to our <a href="https://prodocs.cometchat.com/docs/js-quick-start">javascript Developer Documentation</a>.