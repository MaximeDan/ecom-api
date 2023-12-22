import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get(Role, context.getHandler());

    if (!requiredRole) {
      throw new UnauthorizedException('Role not defined for this route');
    }

    const request = context.switchToHttp().getRequest();
    const userRole = request.user.role;

    console.log('requiredRole', requiredRole);
    return userRole === requiredRole;
  }
}
