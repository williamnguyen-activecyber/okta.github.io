---
layout: docs_page
weight: 1
title: Okta Authentication Overview
---

# Authentication Overview

## OAuth 2.0 vs OpenID Connect vs Authentication API

### OAuth 2.0

Access token

Access tokens are credentials used to access a protected resource server. They are transmitted and stored as strings in JSON Web Token (JWT) format. They are also cryptographically signed using private JSON Web Keys (JWK). 

> NOTE: The JWT specification for which can be found here: <https://tools.ietf.org/html/rfc7519>.
> The specification for JWK which you can find here: <https://tools.ietf.org/html/rfc7517>. 

Tokens contain information about an authorization issued by a resource owner (normally the end-user) specific scopes and durations of access, granted by the resource owner, and enforced by the resource server and authorization server.

Refresh token

The OAuth 2.0 spec has four important roles:

- The authorization server, which is the server that issues the access token. In this case Okta is the authorization server. 
- The resource owner, normally your application's end-user, that grants permission to access the resource server with an access token. 
- The client, which is the application that requests the access token from Okta and then passes it to the resource server.
- The resource server, which accepts the access token and therefore also must verify that it is valid. In this case this is your application.

### OpenID Connect

Although OpenID Connect is built on top of OAuth 2.0, the specification uses slightly different terms:

ID Token

- The OpenID Provider (OP), which is the authorization server that issues the ID token. In this case Okta is the OP. For more information about setting-up Okta as your authorization server, go here: [Set Up Authorization Server](/authentication-guide/implementing-authentication/set-up-authz-server).
- The End-User whose information is contained in the ID token.
- A Claim is a piece of information about your End-User. 
- The Relying Party (RP), which is the client application that requests the ID token from Okta.

### Authentication API

### What is an Okta Session? and How is it Different than an OAuth 2.0 / OpenID Connect Tokens?

Distinct from the ID tokens and access tokens minted in response to an authentication query,
Okta' Authentication API uses session tokens: a one-time bearer token issued when the authentication transaction completes with a `SUCCESS` status.
Session tokens may be redeemed for a session in Okta's Session API or converted to a session cookie. 

Session tokens are for use within Okta, while ID tokens, access tokens, and refresh tokens are for use when accessing third party resources.

## What OAuth 2.0 Flow to use?

Depending on what kind of OAuth client you are building, you will want to use a different OAuth flow. The flowchart below can quickly help you decide which flow to use. Further explanation about each flow is included below.

{% img oauth_grant_flowchart.png alt:"Social Login Flow" width:"800px" %}

(This is probably not the best way to render this diagram, but until it's approved I'll leave it in this format)

<!-- Source for image. Generated using http://www.plantuml.com/plantuml/uml/

@startuml

skinparam monochrome true

start

if (Is your Client public?) then (yes)
    if (Is your Client a SPA or mobile/native?) then (SPA)
    :Implicit Flow;
    end      
    else (mobile/native)
    :Auth Code w PKCE;
    end
    endif
else(no)

if (Does the Client have \nan end-user?) then (yes)
  :Client Credentials Flow;
  end
else (no)

if (Does the Resource Owner \nalso own the Client?) then (yes)
  :Resource Owner Flow;
  end
else (no)
  :Authorization Code Flow;
  end

@enduml

-->

#### Is your Client public? 

A client application is considered "public" when an end user could possibly view and modify the code. This includes Single Page Apps (SPAs) or any mobile or native applications. In both cases, the application cannot keep secrets from malicious users. 

##### Is your Client a SPA or mobile/native?

If your Client application is a Single Page Application (SPA), you should use the [Implicit flow](#implicit-flow).

If your Client application is a mobile/native application, you should use the [Authorization Code with PKCE flow](#authorization-code-with-pkce).

#### Does the Client have an end-user?

If your client application is running on a server with no direct end-user, then it can be trusted to store credentials and use them responsible. If your client application will only be doing this sort of machine-to-machine interaction, then you should use the [Client Credentials flow](#client-credentials-flow). 

#### Does the Resource Owner own the Client?

If you own both the client application and the Resource that it is accessing, then your application can be trusted to store your end-user's login and password. In this case, you can use the [Resource Owner Password flow](resource-owner-password-flow)

### Authorization Code Flow

Server-side app with an end user

Assumes Resource Owner and Client are on separate devices

Most secure flow as tokens never pass through user-agent


### Authorization Code with PKCE

Intended for native and mobile applications

For native applications, the client_id and client_secret are embedded in the source code of the application; in this context, the client secret isn’t treated as a secret. Therefore native apps should make use of Proof Key for Code Exchange (PKCE) to mitigate authorization code interception.


### Implicit Flow

Intended for Single Page Applications (SPA)

Access token returned directly from authorization request

Does not support refresh tokens

Assumes Resource Owner and Public Client are on the same device

### Resource Owner Password Flow 

Intended for scenarios where you control both 

### Client Credentials Flow

Intended for server-side (AKA "confidential") app with no end user

## Types of tokens

### Access Token

Access tokens are credentials used to access a protected resource server. They are transmitted and stored as strings in JSON Web Token (JWT) format. They are also cryptographically signed using private JSON Web Keys (JWK). 

> NOTE: The JWT specification for which can be found here: <https://tools.ietf.org/html/rfc7519>.
> The specification for JWK which you can find here: <https://tools.ietf.org/html/rfc7517>. 

Tokens contain information about an authorization issued by a resource owner (normally the end-user). A resource server can authorize the client to access particular resources based on the scopes and claims in the access token.

The lifetime of Access Token can be configured in the Access Policies. If the client that issued the token is deactivated, the token is immediately and permanently invalidated. Reactivating the client does not make the token valid again.

### Refresh Token

### ID Token

ID Tokens contain authentication information, including information about the authentication event itself, as well as the entity that has authenticated. Just like access and refresh tokens, they are transmitted and stored in JSON web token (JWT) format.