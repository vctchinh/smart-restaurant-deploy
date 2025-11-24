import { LogoutAuthRequestDto } from './dtos/request/logout-auth.request.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from 'src/auth/auth.service';
import LoginAuthRequestDto from 'src/auth/dtos/request/login-auth-request.dto';
import HttpResponse from 'src/utils/http-response';

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@MessagePattern('auth:login')
	async login(data: LoginAuthRequestDto) {
		return new HttpResponse(200, 'Login successful', await this.authService.login(data));
	}

	@MessagePattern('auth:me')
	async me(userId: string) {
		const result = await this.authService.me(userId);
		if (result === null) {
			return new HttpResponse(404, 'User not found', null);
		}
		return new HttpResponse(200, 'User fetched successfully', result);
	}

	@MessagePattern('auth:logout')
	async logout(data: LogoutAuthRequestDto) {
		await this.authService.logout(data);
		return new HttpResponse(200, 'Logout successful', null);
	}
}
