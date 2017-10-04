---
layout: docs_page
weight: 1
title: Okta Authentication Overview
---

# Authentication Overview

## OAuth 2.0 vs OpenID Connect vs Authentication API

At a very high-level:

- The Authentication API controls access to the Okta API.
- The OAuth 2.0 protocol controls authorization to access a protected resource, like a web app, mobile app, or API service.
- The OpenID Connect protocol is built on the OAuth 2.0 protocol and helps authenticate users and convey information about them. It is also more opinionated that plain OAuth 2.0, for example in its scope definitions.

If you would like to work with the Okta API and control user access to Okta, then you want to use the Authentication API and should check out the [Okta Authentication API documentation](https://developer.okta.com/docs/api/resources/authn.html).

If you are interested in controlling access to your own application, then you should use the OAuth 2.0 and OpenID Connect (OIDC) protocols. The OAuth 2.0 protocol will allow you to delete authorization, while the OIDC protocol will allow you retrieve and store authentication information about your end-users. The Okta Authentication Guide is intended to help you figure out how to implement and use OAuth 2.0 and OIDC with Okta. 

### OAuth 2.0

OAuth is a standard that apps can use to provide client applications with access. If you would like to grant access to your application data in a secure way, then you want to use the OAuth 2.0 protocol. 

The OAuth 2.0 spec has four important roles:

- The "authorization server", which is the server that issues the access token. In this case Okta is the authorization server. 
- The "resource owner", normally your application's end-user, that grants permission to access the resource server with an access token. 
- The "client", which is the application that requests the access token from Okta and then passes it to the resource server.
- The "resource server", which accepts the access token and therefore also must verify that it is valid. In this case this is your application.

Other important terms: 

- An OAuth 2.0 "grant" is the authorization given (or "granted") to the client by the user. Examples of grants are "authorization code" and "client credentials".
- The "access token" is given by the authorization server (Okta) in exchange for the grant.
- The "refresh token" is an optional token that can be exchanged for a new access token if the access token has expired.

The usual OAuth 2.0 grant flow looks like this:

1. Client requests authorization from the resource owner (usually the user). 
2. If the user gives authorization, the client passes the authorization grant to the authorization server (in this case Okta).
3. If the grant is valid, the authorization server returns an access token, possibly alongside a refresh and/or ID token.
4. The client now uses that access token to access the resource server.

> For a deeper dive into OAuth 2.0, see [What the Heck is OAuth?](https://developer.okta.com/blog/2017/06/21/what-the-heck-is-oauth) over on the Okta Developer blog. 

### OpenID Connect

Although OpenID Connect (OIDC) is built on top of OAuth 2.0, the specification uses slightly different terms for the roles in the flow:

- The "OpenID Provider" (OP), which is the authorization server that issues the ID token. In this case Okta is the OpenID Provider. 
- The "End-User" whose information is contained in the ID token.
- The "Relying Party" (RP), which is the client application that requests the ID token from Okta.

- The "ID token" is given by the OpenID Provider and contains information about the End-User in the form of claims.
- A "claim" is a piece of information about the End-User.

The high-level flow looks the same for both OIDC and regular OAuth 2.0 flows, the primary difference being simply that an OIDC flow results in an ID token, in addition to any access or refresh tokens.

### Authentication API

The Okta Authentication API controls access to the Okta API by creating and controlling Okta session tokens. Okta session tokens are one-time bearer token issued when the authentication transaction completes successfully. Session tokens may be redeemed for a session in Okta's Session API or converted to a session cookie. 

Session tokens are for use within Okta, while ID tokens, access tokens, and refresh tokens are for use when accessing third party resources, such as your application.

## What OAuth 2.0 Flow to use?

Depending on what kind of OAuth client you are building, you will want to use a different OAuth flow. The flowchart below can quickly help you decide which flow to use. Further explanation about each flow is included below.

{% img oauth_grant_flowchart.png alt:"OAuth Flow Diagram" width:"800px" %}

(This is probably not the best way to render this diagram, but until the flow itself is approved I'll leave it in this format)

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

If you own both the client application and the Resource that it is accessing, then your application can be trusted to store your end-user's login and password. In this case, you can use the [Resource Owner Password flow](resource-owner-password-flow).

### Authorization Code Flow

The authorization code flow is best used by server-side apps where the source code is not publicly exposed. This is because the request that exchanges the authorization code for a token requires a client secret, which will have to be stored in your client. Because it relies on redirection to the authentication prompt, it also relies on interaction with the end-user's web browser which will redirect the user and then receive the authorization code.

{% img auth_code_flow.png alt:"Auth Code Flow" width:"800px" %}

<!-- Source for image. Generated using http://www.plantuml.com/plantuml/uml/

@startuml

skinparam monochrome true

actor "Resource Owner (User)" as user
participant "Client" as client
participant "Authorization Server (Okta)" as okta
participant "Resource Server (Your App)" as app

client -> okta: Authorization Code Request to /authorize
okta -> user: 302 redirect to authentication prompt
user -> okta: Authentication & consent
okta -> client: Authorization Code Response
client -> okta: Send authorization code + Client Secret to /token
okta -> client: Access token (and optionally Refresh Token)
client -> app: Request with access token
app -> client: Response

-->

### Authorization Code with PKCE

Intended for native and mobile applications. The use of the PKCE 

For native applications, the Client ID Secret are embedded in the source code of the application which means that they can't be treated as a secret. Therefore native apps should make use of Proof Key for Code Exchange (PKCE) to mitigate authorization code interception.

<!-- Source for image. Generated using http://www.plantuml.com/plantuml/uml/

@startuml

skinparam monochrome true

actor "Resource Owner (User)" as user
participant "Client" as client
participant "Authorization Server (Okta)" as okta
participant "Resource Server (Your App)" as app

client -> client: Generate PKCE code verifier & challenge
client -> okta: Authorization Code Request + code_challenge to /authorize
okta -> user: 302 redirect to authentication prompt
user -> okta: Authentication & consent
okta -> client: Authorization Code Response
client -> okta: Send authorization code + code_verifier to /token
okta -> okta: Evaluates PKCE code
okta -> client: Access token (and optionally Refresh Token)
client -> app: Request with access token
app -> client: Response

-->

### Implicit Flow

Intended for Single Page Applications (SPA)

Access token returned directly from authorization request

Does not support refresh tokens

Assumes Resource Owner and Public Client are on the same device

### Resource Owner Password Flow 

Intended for scenarios where you control both 

### Client Credentials Flow

Intended for server-side (AKA "confidential") app with no end user
