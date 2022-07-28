const express = require('express');
const passport = require('passport');
const CriiptoVerifyPassportStrategy = require('@criipto/verify-passport-jwt').default;
const app = express();
const port = 3000;

const CRIIPTO_DOMAIN = 'samples.criipto.id';
const CRIIPTO_CLIENT_ID = 'urn:my:application:identifier:9134';


passport.use(
  'criiptoVerify',
  new CriiptoVerifyPassportStrategy({
    domain: CRIIPTO_DOMAIN,
    clientID: CRIIPTO_CLIENT_ID
  },
  async (jwtClaims) => {
    return jwtClaims;
  })
);
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/', passport.authenticate('criiptoVerify', { session: false }), (req, res) => {
  res.json(req.user);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});