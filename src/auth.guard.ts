import { Observable } from 'rxjs';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './auth.decorators';
import { Request } from 'express';
import { Algorithm, JwtPayload, verify } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  //private readonly keys: JwksTypes = [];
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private options: {
      pemCert: string;
      alg: Algorithm;
      rolesMapping: string;
    },
    private reflector: Reflector,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // const { pemCert, alg, rolesMapping } = this.options;
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const roles: string[] | undefined = this.reflector.get(
      Roles,
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    try {
      const grp = this.getUserGroups(request);
      const anyRoleMatch = grp.find((tokenRole) =>
        roles.find((allowedRole) => allowedRole === tokenRole),
      );
      return !!anyRoleMatch;
    } catch (error: unknown) {
      this.logger.warn((error as Error).message);
      return false;
    }
  }
  public getUserGroups(request: Request): string[] {
    const { pemCert, alg, rolesMapping } = this.options;
    const accessToken = request
      .header('authorization')
      ?.replace(/^Bearer\s+/i, '');

    if (!accessToken) {
      return [];
    }

    const token = verify(accessToken, pemCert, {
      algorithms: [alg],
    });
    const grp: string[] =
      ((token as JwtPayload)?.[rolesMapping] as unknown as string[]) || [];
    return grp;
  }
}
