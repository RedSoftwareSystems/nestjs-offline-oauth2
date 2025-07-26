import { DynamicModule, Module } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { Algorithm } from 'jsonwebtoken';
import { AuthOptions } from './auth.types';

export type JwksType = {
  keys: { use: 'sig' | 'enc'; alg: Algorithm; x5c: string[] }[];
};

type OpenIdConfiguration = {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  introspection_endpoint: string;
  userinfo_endpoint: string;
  end_session_endpoint: string;
  jwks_uri: string;
  check_session_iframe: string;
};

async function getOpenIdConfiguration(
  authProviderUri: string,
  realm: string,
): Promise<OpenIdConfiguration> {
  const oidcResp = await fetch(
    `${authProviderUri}/realms/${realm}/.well-known/openid-configuration`,
  );
  return oidcResp.json() as Promise<OpenIdConfiguration>;
}

async function getJwks(jwksUri: string): Promise<JwksType> {
  const jwksResp = await fetch(jwksUri);
  return jwksResp.json() as Promise<JwksType>;
}

@Module({})
export class AuthModule {
  public static forRootAsync(options: AuthOptions): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: 'JwtGuard',
          useFactory: async (reflector: Reflector) => {
            const { rolesMapping, authProvider, realm, jwksUri } = options;
            let jwks_uri = jwksUri;

            if (!jwks_uri) {
              const oidc = await getOpenIdConfiguration(authProvider!, realm);
              jwks_uri = oidc.jwks_uri;
            }

            const jwks = await getJwks(jwks_uri);

            const sigKey = jwks.keys.find((item) => item.use === 'sig');
            const x5cArray = sigKey?.x5c || [];
            const alg = sigKey?.alg as Algorithm;

            const pemCert = x5cArray
              .map(
                (x5c) =>
                  `-----BEGIN CERTIFICATE-----\n${x5c}\n-----END CERTIFICATE-----\n`,
              )
              .join('\n');

            return new AuthGuard({ pemCert, alg, rolesMapping }, reflector);
          },
          inject: [Reflector],
        },
      ],
      exports: ['JwtGuard'],
    };
  }
}
