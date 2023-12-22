import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './role.decorator';
import { AuthService } from './authentication.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndMerge(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const token = authorizationHeader.split(' ')[1];
    console.log(token);

    try {
      request.user = await this.authService.authenticateUser(token);

      if (!request.user.roles) {
        throw new UnauthorizedException(
          'User roles are not defined for this route.',
        );
      }

      const hasRequiredRole = roles.some((role) =>
        request.user.roles.includes(role),
      );

      if (!hasRequiredRole) {
        throw new UnauthorizedException(
          'You do not have the required roles for this route.',
        );
      }

      return hasRequiredRole;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
