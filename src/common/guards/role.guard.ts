import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const publicDecorator = this.reflector.getAllAndMerge('public', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (publicDecorator.length) return true;
    const roles = this.reflector.get(Roles, context.getHandler());
    const request = context.switchToHttp().getRequest();
    if (!roles.includes(request.user.role))
      throw new ForbiddenException('Not allowed');

    return true;
  }
}
