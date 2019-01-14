<div style="width:100%">
	<div style="width:50%; display:inline-block">
		<h1> CometChat Pro</h1> 		
	</div>	
</div>
This guide demonstrates how to add chat to a Javascript application using CometChat. Before you begin, we strongly recommend you read the Key Concepts guide.

### Get your Application Keys

<a href="https://app.cometchat.com" target="_blank">Signup for CometChat</a> and then:

1. Create a new app: Enter a name & hit the **+** button
2. Head over to the **API Keys** section and click on the **Create API Key ** button
3. Enter a name and select the scope as **Auth Only**
4. Now note the **API Key** and **App ID**

### CometChat can be integrated with:
  * Web (Browser)
  * Node.js


# Add the CometChat Dependency

You can add the CometChat to your project using  `<script>` tag or `npm`.

`HTML`

```Javascript
     <!--Copy and paste the code snippet into your application HTML. The code snippet should look like this:-->
     <script type="text/javascript" src="https://unpkg.com/@cometchat-pro/chat/CometChat.js"></script>     
```
`NPM`
```Javascript
  npm install @cometchat-pulse/cometchat-pulse.js --save
```
>If you are using HTML, then a window scope variable called `CometChat` is created.
>if you are using npm to import CometChat,use : 
>`import { CometChat } from "@cometchat-pulse/cometchat-pulse.js"`

# Initialize CometChat
The `init()` method initializes the settings required for `CometChat`.

You need to call `init()` before calling any other method from CometChat.

```Javascript
import { CometChat } from "@cometchat-pulse/cometchat-pulse.js";

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

# Login your user
Once initialization is successful, you will need to log the user into CometChat using the login() method.

We recommend you call the CometChat login method once your user logs into your app.
```Javascript
import { CometChat } from "@cometchat-pulse/cometchat-pulse.js";

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

# Send a message
Once your user has logged in, you can send a message using the `sendMessage()` method.
```Javascript
import { CometChat } from "@cometchat-pulse/cometchat-pulse.js";

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
Once the message is sent successfully, you will receive the message information as `TextMessage` object on `Promise` resolved.

# Receive Messages
You can add multiple MessageListener using the `addMessageListener()` method, to receive incoming message wherever you need.

```Javascript 
import { CometChat } from "@cometchat-pulse/cometchat-pulse.js";

var listenerID = "UNIQUE_LISTENER_ID";
CometChat.addMessageListener(listenerID, new CometChat.MessageListener({
  onTextMessageReceived: message => {
    console.log("Message received successfully:", message);
    // Handle text message
  }
}));
```




