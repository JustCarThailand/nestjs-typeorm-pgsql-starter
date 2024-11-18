import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

interface RequestUser {
  userId: number;
  username: string;
  userRoles: {
    userRoleNames: Array<string>;
    userRoleCodes: Array<number>;
  };
  uuid: string;
}

@Injectable()
export class RoleAuthGuard implements CanActivate {
  private readonly logger = new Logger(RoleAuthGuard.name);
  constructor(private reflector: Reflector) {}

  matchRoles(roles: number[], userRole: number) {
    return roles.some(role => role === userRole);
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: RequestUser = request.user;

    for (const item of user.userRoles.userRoleCodes) {
      const checkRole = this.matchRoles(roles, item);
      if (checkRole) {
        return true;
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}
