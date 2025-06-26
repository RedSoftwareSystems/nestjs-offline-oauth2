# NestJs Oauth2 Offline Authorizer

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Examples](#examples)
- [License](#license)

## Description

This package is used to perform an offline authorization using the Bearer token caming from oauth2 authentication process.

Test have been performed against [https://www.keycloak.org/](Keycloak)

## Installation

```bash
npm install -S nestjs-offline-oauth2 jsonwebtoken
```

## Examples

### AuthModule.forRootAsync(options)

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from 'nestjs-offline-oauth2';

@Module({
  imports: [
    AuthModule.forRootAsync({
      authProvider: 'https://auth.redss.local',
      realm: 'redss',
      rolesMapping: 'grp', //or any custom claim of string[] type
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useExisting: 'JwtGuard',
    },
  ],
})
export class AppModule {}
```

### @Roles(roles)

```ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from 'nestjs-offline-oauth2';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/protected')
  @Roles(['/admin', '/test'])
  getHelloProtected(): string {
    return this.appService.getHello2();
  }
}
```

## License

MIT
