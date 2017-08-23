# Revoking Tokens

## How to Revoke a Token

If for whatever reason you would like to disable an access or refresh token, simply send a request to your `/revoke` endpoint:

```
http --form POST https://dev-144769.oktapreview.com/oauth2/ausaw8fz3q4Yd3Zk70h7/v1/revoke \
  accept:application/json \
  authorization:'Basic ZmEz...' \
  cache-control:no-cache \
  content-type:application/x-www-form-urlencoded \
  token=eyJhbG... \
  token_type_hint=access_token
```

> Note: Revoking a token that is invalid, expired, or already revoked will still return a `200 OK` so as to not leak information.

For more information, see [Revoke a Token](https://developer.okta.com/docs/api/resources/oauth2.html#revoke-a-token) in the Okta OAuth 2.0 reference.

## Removing a User Session

For a more complete explanation of Okta User sessions, see (jakub.todo).

For more information see [Clear User Sessions](https://developer.okta.com/docs/api/resources/users.html#clear-user-sessions) in the Users API reference.

https://developer.okta.com/docs/api/resources/users.html#user-sessions

## Revoking Tokens Without Deleting the User Session

## Revoking the Access VS the Refresh Token

