import { User } from 'src/entity/user';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import LoginAuthRequestDto from 'src/auth/dtos/request/login-auth-request.dto';
import LoginAuthResponseDto from 'src/auth/dtos/response/login-auth-response.dto';
import AppException from 'src/exception/app-exception';
import ErrorCode from 'src/exception/error-code';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from 'src/utils/enum';
import { GetUserResponseDto } from 'src/users/dtos/response/get-user-response.dto';
import { LogoutAuthRequestDto } from 'src/auth/dtos/request/logout-auth.request.dto';
import { RemoveToken } from 'src/entity/remove-token';
@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@InjectRepository(RemoveToken)
		private readonly removeTokenRepository: Repository<RemoveToken>,
	) {}

	async login(data: LoginAuthRequestDto): Promise<LoginAuthResponseDto> {
		const user = await this.userRepository.findOne({
			where: { username: data.username },
			relations: ['roles'],
		});
		if (!user) {
			throw new AppException(ErrorCode.LOGIN_FAILED);
		}

		const isPasswordValid = await bcrypt.compare(data.password, user.password);
		if (!isPasswordValid) {
			throw new AppException(ErrorCode.LOGIN_FAILED);
		}

		const response = new LoginAuthResponseDto();
		response.userId = user.userId;
		response.username = user.username;
		response.email = user.email;
		response.roles = user.roles.map((role) => RoleEnum[role.name]);
		return response;
	}

	async me(userId: string): Promise<Omit<GetUserResponseDto, 'roles'> | null> {
		const user = await this.userRepository.findOne({
			where: { userId },
		});
		if (!user) {
			return null;
		}
		const response: Omit<GetUserResponseDto, 'roles'> = {
			userId: user.userId,
			username: user.username,
			email: user.email,
		};
		return response;
	}

	async logout(data: LogoutAuthRequestDto): Promise<void> {
		try {
			await this.removeTokenRepository.save({
				token: data.token,
				expiryDate: data.expiresAt,
			});
		} catch (err) {
			console.error('Error saving removed token:', err);
			throw new AppException(ErrorCode.TOKEN_ALREADY_REMOVED);
		}
	}
}
