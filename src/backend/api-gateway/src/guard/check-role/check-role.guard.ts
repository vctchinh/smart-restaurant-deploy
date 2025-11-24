import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import AppException from 'src/exception/app-exception';
import ErrorCode from 'src/exception/error-code';

export default function Role(...roles: string[]) {
	@Injectable()
	class CheckRoleGuard implements CanActivate {
		canActivate(
			context: ExecutionContext,
		): boolean | Promise<boolean> | Observable<boolean> {
			const request: Request = context.switchToHttp().getRequest();
			const user: any = request.user;
			if (!user || !user.claims || !user.claims.roles) {
				throw new AppException(ErrorCode.UNAUTHORIZED);
			}

			const splitRoles = user.claims.roles.split(' ').map((role: string) => role.trim());
			console.log('User roles:', splitRoles);
			for (const role of roles) {
				if (splitRoles.includes(role)) {
					return true;
				}
			}
			throw new AppException(ErrorCode.UNAUTHORIZED);
		}
	}

	return new CheckRoleGuard();
}
