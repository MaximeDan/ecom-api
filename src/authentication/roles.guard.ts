import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndMerge(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      // No roles defined for this route, allow access
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userRoles = request.user.roles;
    console.log(userRoles);
    // Check if the user has at least one required role
    const hasRequiredRole = roles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      throw new UnauthorizedException(
        'You do not have the required roles for this route.',
      );
    }

    return hasRequiredRole;
  }
}