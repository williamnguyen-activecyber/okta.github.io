---
layout: docs_page
title: Authorization Code Flow
excerpt: How to implement the authorization code flow in Okta
---

# Implement the Authorization Code Flow

If you are building a server-side (or "web") application that is capable of securely storing secrets, then the authorization code flow is the recommended method for controlling access to it. 

At a high-level, this flow has the following steps: 

- Your application directs the browser to the Okta sign-in page, where the user authenticates
- The browser receives an authorization code from your Okta authorization server
- The authorization code is passed to your application
- Your application sends this code to Okta, and Okta returns access and ID tokens, and optionally a refresh token
- Your application can now use these tokens to perform actions on behalf of the user with a resource server (for example an API)

For more information on the authorization code flow, including why to use it, see (jakub.todo).

### 1. Setting up your Application

1. From the Applications page, choose **Add Application**
2. You will now be on the Create New Application page. From here, select **Web**
3. Fill-in the Application Settings, then click **Done**.

### 2. Using the Authorization Code Flow

To get an authorization code, you make a request to your authorization server's `/authorize` endpoint. If you are using the default Okta authorization server, then your request URL would look something like this:

```
https://your-Org.oktapreview.com/oauth2/default/v1/authorize?client_id=0oabucvyc38HLL1ef0h7&response_type=code&scope=openid&redirect_uri=http%3A%2F%2Flocalhost&state=state-296bc9a0-a2a2-4a57-be1a-d0e2fd9bb601'
```

> Note: You must request the `openid` scope or configure a default scope on the authorization server. For more information about this, see (jakub.todo).

If the user does not have an existing session, this will open the Okta Sign-in Page. After successfully authenticating, the user will arrive at the specified `redirect_uri` along with a `code`:

```
http://localhost/?code=P5I7mdxxdv13_JfXrCSq&state=state-296bc9a0-a2a2-4a57-be1a-d0e2fd9bb601
```

This code will remain valid for 60 seconds, during which it can be exchanged for tokens.

### 3. Exchanging the Code for Tokens

To exchange this code for access and ID tokens, you pass it to your authorization server's `/token` endpoint:

```
curl --request POST \
  --url https://your-Org.oktapreview.com/oauth2/default/v1/token \
  --header 'accept: application/json' \
  --header 'authorization: Basic MG9hY...' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'grant_type=authorization_code&redirect_uri=http%3A%2F%2Flocalhost&code=P59yPm1_X1gxtdEOEZjn'
```

> Note: The call to the `/token` endpoint requires authentication. For more on this, please see [Token Authentication Methods](https://developer.okta.com/docs/api/resources/oauth2.html#token-authentication-methods).

If the code is still valid, your application will receive back access and ID tokens:

```jwt
{
    "access_token": "eyJhbG[...]9pDQ",
    "token_type": "Bearer",
    "expires_in": 3600,
    "scope": "openid",
    "id_token": "eyJhbG[...]RTM0A"
}
```

### 4. Next Steps

When your application passes a request with an `access_token`, the resource server will need to validate it. For more on this, see (jakub.todo).

### 5. Samples

<https://github.com/okta/samples-nodejs-express-4>