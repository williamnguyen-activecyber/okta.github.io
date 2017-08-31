---
layout: docs_page
title: Implementing Authentication in your Application
excerpt: How to implement an OAuth 2.0 flow for your application using Okta.
---

## a. Setting up an Authorization Server


## b. Server-side Application (Authorization Code Flow)

If you are building a a server-side (or "web") application such as an API, then the authorization code flow is the recommended method for controlling access to your application. For more information on the authorization code flow, including why to use it, see (jakub.todo).

### 1. Setting up your Application

1. From the Applications page, choose **Add Application**
2. You will now be on the Create New Application page. From here, select **Web**
3. Fill-in the Application Settings, then click **Done**.

### 2. Using the Authorization Code Flow

To get an authorization code, you make a request to your authorization server's `/authorize` endpoint. If you are using the default Okta authorization server, then your request URL would look something like this:

```
https://dev-686102.oktapreview.com/oauth2/default/v1/authorize?client_id=0oabucvyc38HLL1ef0h7&response_type=code&response_mode=query&scope=openid&redirect_uri=http%3A%2F%2Flocalhost&state=state-296bc9a0-a2a2-4a57-be1a-d0e2fd9bb601'
```

> Note: You must request at least the `openid` scope, or the `offline_access` scope if you have that enabled for your application. It is also possible to create a custom scope, in which case you can use that scope. If you create a custom scope and set it as a default scope, then you can also omit the `scope` parameter entirely. (jakub.todo This should probably go somewhere else)

If the user does not have an existing session, this will open an authentication prompt. After successfully authenticating, the user will arrive at the specified `redirect_uri` along with a `code`:

```
http://localhost/?code=P5I7mdxxdv13_JfXrCSq&state=state-296bc9a0-a2a2-4a57-be1a-d0e2fd9bb601
```

This code will remain valid for 60 seconds, during which it can be exchanged for tokens.

### 3. Exchanging the Code for Tokens

To exchange this code for access and ID tokens, you pass it to your authorization server's `/default` endpoint:

```
curl --request POST \
  --url https://dev-686102.oktapreview.com/oauth2/default/v1/token \
  --header 'accept: application/json' \
  --header 'authorization: Basic MG9hY...' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'grant_type=authorization_code&redirect_uri=http%3A%2F%2Flocalhost&code=P59yPm1_X1gxtdEOEZjn'
```

If the code is still valid, you will receive back access and ID tokens:

```
{
    "access_token": "eyJhbG[...]9pDQ",
    "token_type": "Bearer",
    "expires_in": 3600,
    "scope": "openid",
    "id_token": "eyJhbG[...]RTM0A"
}
```

This `access_token` can now be passed to your application in the form of a bearer token.

### 4. Next Steps

When your application receives a request with an `access_token`, it will need to validate it. For more on this, see (jakub.todo).

### 5. Samples

## c. Single Page Application (Implicit Flow)

### 1. Setting up your Application
### 2. Using the Implicit Flow
### 3. Next Steps
### 4. Samples

## d. Mobile Application (Authorization Code Flow with PKCE)

### 1. Setting up your Application
### 2. Using the Authorization Code Flow with PKCE
### 3. Exchanging the Code for Tokens
### 4. Samples

## e. Trusted Application (Resource Owner Password Flow)

### 1. Setting up your Application
### 2. Using the Resource Owner Password Flow
### 3. Next Steps
### 4. Samples

## f. API Service (Client Credentials)

### 1. Setting up your Application
### 2. Using Client Credentials Flow
### 3. Next Steps
### 4. Samples