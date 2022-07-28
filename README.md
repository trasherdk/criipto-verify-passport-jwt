# @criipto/verify-passport-jwt

A Passport strategy for authenticating with a Criipto Verify JWT.

## Install

```shell
npm install @criipto/verify-passport-jwt
```

## Usage

It is currently assumed that the token will be delivered via the `Authorization: Bearer {token}` header.

```javascript
import CriiptoVerifyStrategy from '@criipto/verify-passport-jwt';

passport.use(
  'criiptoVerify',
  new CriiptoVerifyStrategy(
    {
      domain: '{YOUR_CRIIPTO_DOMAIN}',
      clientID: '{YOUR_CRIIPTO_APPLICATION_CLIENT_ID}'
    },
    async (jwtClaims) => {
      return User.findOne({id: jwtClaims.sub});
    }
  )
);
```

## Authenticate requests

```javascript
app.post('/', passport.authenticate('criiptoVerify', { session: false }), (req, res) => {
  res.json(req.user);
});
```

## JWT Payload/Claims

You can find the expected JWT payload/claims contents in the [e-ID section of the Criipto docs](https://docs.criipto.com/verify/e-ids/)

## Debugging

You can use `DEBUG=@criipto/verify-passport-jwt` to log errors from this library.

## Criipto

Learn more about Criipto and sign up for your free developer account at [criipto.com](https://www.criipto.com).