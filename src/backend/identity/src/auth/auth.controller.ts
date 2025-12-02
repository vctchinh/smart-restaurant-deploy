import { LogoutAuthRequestDto } from './dtos/request/logout-auth.request.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from 'src/auth/auth.service';
import LoginAuthRequestDto from 'src/auth/dtos/request/login-auth-request.dto';
import HttpResponse from 'src/utils/http-response';
import { ConfigService } from '@nestjs/config';
import AppException from 'src/exception/app-exception';
import ErrorCode from 'src/exception/error-code';
import { AuthMeRequestDto } from 'dtos/request/auth-me-request.dto';

@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly config: ConfigService,
	) {}

	@MessagePattern('auth:login')
	async login(data: LoginAuthRequestDto) {
		const expectedApiKey = this.config.get<string>('IDENTITY_API_KEY');
		if (data.identityApiKey !== expectedApiKey) {
			throw new AppException(ErrorCode.UNAUTHORIZED);
		}
		return new HttpResponse(200, 'Login successful', await this.authService.login(data));
	}

	@MessagePattern('auth:me')
	async me(data: AuthMeRequestDto) {
		const expectedApiKey = this.config.get<string>('IDENTITY_API_KEY');
		if (data.identityApiKey !== expectedApiKey) {
			throw new AppException(ErrorCode.UNAUTHORIZED);
		}
		const result = await this.authService.me(data.userId);
		if (result === null) {
			return new HttpResponse(404, 'User not found', null);
		}
		return new HttpResponse(200, 'User fetched successfully', result);
	}

	@MessagePattern('auth:logout')
	async logout(data: LogoutAuthRequestDto) {
		if (data.identityApiKey) {
			const expectedApiKey = this.config.get<string>('IDENTITY_API_KEY');
			if (data.identityApiKey !== expectedApiKey) {
				throw new AppException(ErrorCode.UNAUTHORIZED);
			}
		}
		await this.authService.logout(data);
		return new HttpResponse(200, 'Logout successful', null);
	}
}
