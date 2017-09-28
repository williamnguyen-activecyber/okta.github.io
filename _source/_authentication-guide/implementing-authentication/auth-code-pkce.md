---
layout: docs_page
title: Authorization Code Flow with PKCE
weight: 4
excerpt: How to implement the authorization code flow with PKCE in Okta
---

# Implementing the Authorization Code Flow with PKCE

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

You’ll need to add code in your native mobile app to create the code verifier and code challenge. For examples of code that handles this, see (jakub.todo.Example section below)

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

When your application passes a request with an `access_token`, the resource server will need to validate it. For more on this, see [Validating Access Tokens](/authentication-guide/tokens/validating-access-tokens).

### 5. Samples

(jakub.todo)

<https://github.com/openid/AppAuth-iOS>

<https://github.com/openid/AppAuth-Android>