import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import passport from 'passport';
import { ParsedQs } from 'qs';
import { createRemoteJWKSet, JWTPayload, jwtVerify } from 'jose';

const debug = require('debug')('@criipto/verify-passport-jwt');

export interface CriiptoVerifyStrategyOptions {
  domain: string
  clientID: string
}

export default class CriiptoVerifyStrategy implements passport.Strategy  {
  options: CriiptoVerifyStrategyOptions
  claimsToUser: (input: JWTPayload) => Express.User
  jwks: ReturnType<typeof createRemoteJWKSet>

  constructor(options: CriiptoVerifyStrategyOptions, claimsToUser: (input: JWTPayload) => Express.User) {
    this.options = options;
    this.claimsToUser = claimsToUser;
    this.jwks = createRemoteJWKSet(new URL(`https://${options.domain}/.well-known/jwks`))
  }

  authenticate(
    this: passport.StrategyCreated<this, this & passport.StrategyCreatedStatic> & this,
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    options?: any
  ) {
    Promise.resolve().then(async () => {
      const jwt = extractBearerToken(req);
      if (!jwt) throw new Error('No bearer token found in request');
      
      const { payload, protectedHeader } = await jwtVerify(jwt, this.jwks, {
        issuer: `https://${this.options.domain}`,
        audience: this.options.clientID,
      });

      return this.claimsToUser(payload);
    }).then(this.success)
    .catch(err => {
      debug(err);
      this.fail(err);
    });
  }
}

function extractBearerToken(req: Request) {
  if (!req.headers['authorization']) return null;
  const authorization = req.headers['authorization'];

  if (!authorization.startsWith('Bearer ')) return null;

  return authorization.split('Bearer ')[1] || null;
}