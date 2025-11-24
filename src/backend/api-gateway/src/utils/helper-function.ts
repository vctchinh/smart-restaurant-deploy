import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/configuration/jwt-strategy.config';
import AppException from 'src/exception/app-exception';
import ErrorCode from 'src/exception/error-code';
export function checkValidTime(time: string) {
	try {
		const date = new Date(time);
		if (isNaN(date.getTime())) {
			throw new AppException(ErrorCode.INVALID_TIME_FORMAT);
		}
		const now = new Date();
		return date.getTime() > now.getTime();
	} catch (err) {
		console.error('Error parsing time:', err);
		throw new AppException(ErrorCode.INVALID_TIME_FORMAT);
	}
}

export function generateToken(data: any, jwtService: JwtService) {
	const expiresInMs = parseInt(process.env.JWT_EXPIRES_IN) * 1000;
	const expiresRefreshInMs = parseInt(process.env.JWT_EXPIRES_REFRESH_IN) * 1000;
	const payload: JwtPayload = {
		userId: data.userId,
		username: data.username,
		email: data.email,
		claims: {
			roles: data.roles,
			expires: new Date(Date.now() + expiresInMs).toUTCString(),

			expiresRefresh: new Date(Date.now() + expiresRefreshInMs).toUTCString(),
		},
	};
	return jwtService.sign(payload);
}
