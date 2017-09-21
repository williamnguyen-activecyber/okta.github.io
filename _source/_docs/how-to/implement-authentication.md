---
layout: docs_page
title: Implementing Authentication in your Application
excerpt: How to implement an OAuth 2.0 flow for your application using Okta.
---

## a. Setting up an Authorization Server


## b. Server-side Application (Authorization Code Flow)

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

https://github.com/okta/samples-nodejs-express-4

## c. Single Page Application (Implicit Flow)

If you are building a Single-page Application (SPA), then the implicit flow is the recommended method for controlling access between your SPA and a resource server. 

At a high-level, this flow has the following steps:

- Your application directs the browser to the Okta sign-in page, where the user authenticates
- Okta redirects the browser back to the specified redirect URI, along with access and ID tokens, and optionally a refresh token, as a hash fragment in the URI
- Your application extracts the tokens from the URI
- Your application can now use these tokens to perform actions on behalf of the user with a resource server (for example an API)

For more information on the implicit flow, including why to use it, see (jakub.todo).

### 1. Setting up your Application

1. From the Applications page, choose **Add Application**
2. You will now be on the Create New Application page. From here, select **SPA**
3. Fill-in the Application Settings, then click **Done**.

### 2. Using the Implicit Flow

This flow is very similar to the authorization code flow (jakub.todo Link to page) except that the `response_type` is `token` and/or `id_token` instead of `code`.

Your browser makes a request to your authorization server's `/authorize` endpoint. If you are using the default Okta authorization server, then your request URL would look something like this:

```
https://your-Org.oktapreview.com/oauth2/default/v1/authorize?client_id=0oabv6kx4qq6h1U5l0h7&response_type=token&scope=openid&redirect_uri=http%3A%2F%2Flocalhost&state=state-296bc9a0-a2a2-4a57-be1a-d0e2fd9bb601&nonce=foo'
```

> Note: You must request the `openid` scope or configure a default scope on the authorization server. For more information about this, see (jakub.todo).

If the user does not have an existing session, this will open the Okta Sign-in Page. After successfully authenticating, your browser will arrive at the specified `redirect_uri` along with a `token` as a hash fragment:

```
http://localhost/#access_token=eyJhb[...]erw&token_type=Bearer&expires_in=3600&scope=openid&state=state-296bc9a0-a2a2-4a57-be1a-d0e2fd9bb601
```

Your application must now extract the token(s) from the URI and store them.

### 3. Next Steps

When your application passes a request with an `access_token`, the resource server will need to validate it. For more on this, see (jakub.todo).

### 4. Samples

## d. Native Mobile Application (Authorization Code Flow with PKCE)

If you are building a native mobile application, then the authorization code flow with a Proof Key for Code Exchange (PKCE) is the recommended method for controlling the access between your application and a resource server. 

The Authorization Code Flow with PKCE is simply the standard Code flow with an extra step at the beginning and an extra verification at the end. At a high-level, the flow has the following steps:

- Your application generates a code verifier followed by a code challenge
- Your application directs the browser to the Okta Sign-In page, along with the generated code challenge, and the user authenticates
- Okta redirects back to your application with an authorization code
- The authorization code is passed to your application
- Your application sends this code, along with the code verifier, to Okta. Okta returns access and ID tokens, and optionally a refresh token
- Your application can now use these tokens to perform actions on behalf of the user with a resource server (for example an API)

For more information on the authorization code with PKCE flow, including why to use it, see (jakub.todo).

### 1. Setting up your Application

1. From the Applications page, choose **Add Application**
2. You will now be on the Create New Application page. From here, select **Native**
3. Fill-in the Application Settings, then click **Done**.

### 2. Using the Authorization Code Flow with PKCE

Just like with the regular authorization code flow, you start by making a request to your authorization server’s `/authorize` endpoint. However, in this instance you will also have to pass along a code challenge.

Your first step should therefore be to generate a code verifier and challenge:
 
* Code verifier: Random URL-safe string with a minimum length of 43 characters
* Code challenge: Base64 URL-encoded SHA-256 hash of the code verifier.

You’ll need to add code in your native mobile app to create the code verifier and code challenge. For example, in Node.js:

```
const base64url = require('base64url');
var crypto = require('crypto');
crypto.createHash('sha256').update('at83hsVcajT5nfc2FVnKSxI6bsuU2Tq2aoVhEFhEO1A').digest();
var buffer = crypto.createHash('sha256').update('at83hsVcajT5nfc2FVnKSxI6bsuU2Tq2aoVhEFhEO1A').digest();
base64url.encode(buffer)
```

> NOTE: You can try running the above code on Runkit here: https://pkce-generator-s9q3fj7oxbgc.runkit.sh/

This will create output like this:

```
{
  "code_verifier":"M25iVXpKU3puUjFaYWg3T1NDTDQtcW1ROUY5YXlwalNoc0hhakxifmZHag",
  "code_challenge":"qjrzSW9gMiUgpUvqgEPE4_-8swvyCtfOVvg55o5S_es"
}
```

The `code_challenge` is a Base64-URL-encoded string of the SHA256 hash of the `code_verifier`. Your app will save the `code_verifier` for later, and send the `code_challenge` along with the authorization request to your authorization server’s `/authorize` URL:

```
https://your-Org.oktapreview.com/oauth2/default/v1/authorize?client_id=0oabygpxgk9lXaMgF0h7&response_type=code&response_mode=query&scope=openid&redirect_uri=http%3A%2F%2Flocalhost&state=state-8600b31f-52d1-4dca-987c-386e3d8967e9&nonce=nonce-8600b31f-52d1-4dca-987c-386e3d8967e9&code_challenge_method=S256&code_challenge=qjrzSW9gMiUgpUvqgEPE4_-8swvyCtfOVvg55o5S_es
```

If the user does not have an existing session, this will open the Okta Sign-in Page. After successfully authenticating, the user will arrive at the specified `redirect_uri` along with an authorization `code`:

```
http://localhost/?code=BdLDvZvO3ZfSwg-asLNk&state=state-8600b31f-52d1-4dca-987c-386e3d8967e9
```

This code can only be used once, and will remain valid for 60 seconds, during which time it can be exchanged for tokens.

### 3. Exchanging the Code for Tokens

To exchange this code for access and ID tokens, you pass it to your authorization server's `/token` endpoint along with the `code_verifier` that was generated at the beginning:

```
curl --request POST \
  --url https://your-Org.oktapreview.com/oauth2/default/v1/token \
  --header 'accept: application/json' \
  --header 'cache-control: no-cache' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'grant_type=authorization_code&client_id=0oabygpxgk9lXaMgF0h7&redirect_uri=http%3A%2F%2Flocalhost&code=CKA9Utz2GkWlsrmnqehz&code_verifier=M25iVXpKU3puUjFaYWg3T1NDTDQtcW1ROUY5YXlwalNoc0hhakxifmZHag'
```

> Note: The call to the `/token` endpoint requires authentication. For more on this, please see [Token Authentication Methods](https://developer.okta.com/docs/api/resources/oauth2.html#token-authentication-methods).

If the code is still valid, your application will receive back access and ID tokens:

```
{
    "access_token": "eyJhb[...]Hozw",
    "expires_in": 3600,
    "id_token": "eyJhb[...]jvCw",
    "scope": "openid",
    "token_type": "Bearer"
}
```

### 4. Next Steps

When your application passes a request with an `access_token`, the resource server will need to validate it. For more on this, see (jakub.todo).

### 5. Samples

## e. Trusted Application (Resource Owner Password Flow)

The Resource Owner Password Flow is intended for use cases where you control both the client application and the resource that it is interacting with.  At a high-level, this flow has the following steps:

- Your client application collects a user's credentials
- Your application sends these credentials to your Okta authorization server
- If the credentials are accurate, Okta responds with the requested tokens

For more information on the resource owner password flow, including why to use it, see (jakub.todo).

### 1. Setting up your Application

1. From the Applications page, choose **Add Application**
2. You will now be on the Create New Application page. From here, select **Native**
3. Fill-in the Application Settings, being sure to select "Resource Owner Password" as one of the allowed grant types, then click **Done**.
4. On the next screen, in the "Client Credentials section", click **Edit**.
5. Select "Use Client Authentication", then click **Save**.

### 2. Using the Resource Owner Password Flow

Before you can begin this flow, you will have to collect the user's password in a manner of your choosing. 

Once you have collected the credentials, all that is required is a single API call to the `/token` endpoint:

```
curl --request POST \
  --url https://dev-686102.oktapreview.com/oauth2/default/v1/token \
  --header 'accept: application/json' \
  --header 'authorization: Basic MG9hYnpsamloM3JucjZhR3QwaDc6UHU4X2hmQkxzOGxNejVnMTZBNllmY0xid091LTExOFRPNF9YR1VOTQ==' \
  --header 'cache-control: no-cache' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'grant_type=password&redirect_uri=http%3A%2F%2Flocalhost&username=testuser1%40example.com&password=%7CmCovrlnU9oZU4qWGrhQSM%3Dyd&scope=openid'
```

> Note: The call to the `/token` endpoint requires authentication. For more on this, please see [Token Authentication Methods](https://developer.okta.com/docs/api/resources/oauth2.html#token-authentication-methods).

If the credentials are valid, your application will receive back access and ID tokens:

```
{
    "access_token": "eyJhb[...]56Rg",
    "expires_in": 3600,
    "id_token": "eyJhb[...]yosFQ",
    "scope": "openid",
    "token_type": "Bearer"
}
```

### 3. Next Steps

When your application passes a request with an access_token, the resource server will need to validate it. For more on this, see (jakub.todo).

### 4. Samples

## f. Service (Client Credentials)

The Client Credentials flow is recommended for use in machine-to-machine authentication. Your application will need to securely store it's Client ID and Secret and pass those to Okta in exchange for an access token. At a high-level, the flow only has two steps:

- Your application passes its client credentials to your Okta authorization server
- If the credentials are accurate, Okta responds with an access token

### 1. Setting up your Application

1. From the Applications page, choose **Add Application**
2. You will now be on the Create New Application page. From here, select **Service**
3. Fill-in the Application Name, then click **Done**.

### 2. Creating Custom Scopes

The Client Credentials flow never has a user context, so you can't request OpenID scopes. Instead, you must create a custom scope. For more information on creating custom scopes, see (jakub.todo).

### 3. Using the Client Credentials Flow

Your Client Application will need to have its Client ID and Secret stored in a secure manner. These are then passed via Basic Auth in the request to your Okta Authorization Server's `/token` endpoint:

```
curl --request POST \
  --url https://dev-686102.oktapreview.com/oauth2/default/v1/token \
  --header 'accept: application/json' \
  --header 'authorization: Basic MG9hY...' \
  --header 'cache-control: no-cache' \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data 'grant_type=client_credentials&redirect_uri=http%3A%2F%2Flocalhost&scope=customScope'
```

> NOTE: The Client ID and Secret aren’t included in the POST body, but rather are placed in the HTTP Authorization header following the rules of HTTP Basic Auth.

If the credentials are valid, the application will receive back an access token:

```
{
    "access_token": "eyJhbG[...]1LQ",
    "token_type": "Bearer",
    "expires_in": 3600,
    "scope": "customScope"
}
```

### 3. Next Steps

When your application sends a request with an access_token, the resource server will need to validate it. For more on this, see (jakub.todo).

### 4. Samples