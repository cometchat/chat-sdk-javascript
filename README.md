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

```
npm install @cometchat-pro/chat@2.0.7 --save
```

Then, import the `CometChat` object wherever you want to use CometChat

```
import { CometChat } from "@cometchat-pro/chat" 
```

### HTML (via CDN)
Include the CometChat Javascript library in your HTML code

```
<script type="text/javascript" src="https://unpkg.com/@cometchat-pro/chat@2.0.7/CometChat.js"></script>
```

To learn more, please refer to our Documentation: <a href="https://prodocs.cometchat.com/v2.0/docs/js-quick-start">Documentation</a>