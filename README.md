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
