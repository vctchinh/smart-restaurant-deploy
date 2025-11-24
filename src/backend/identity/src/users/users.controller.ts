import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import RegisterUserRequestDto from 'src/users/dtos/request/register-user-request.dto';
import { UsersService } from 'src/users/users.service';
import HttpResponse from 'src/utils/http-response';

@Controller()
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@MessagePattern('users:register')
	async registerUser(data: RegisterUserRequestDto): Promise<HttpResponse> {
		return new HttpResponse(
			200,
			'Register successful',
			await this.usersService.Register(data),
		);
	}

	@MessagePattern('users:get-all-users')
	async getAllUsers(): Promise<HttpResponse> {
		return new HttpResponse(
			200,
			'Get all users successful',
			await this.usersService.getAllUsers(),
		);
	}

	@MessagePattern('users:get-user-by-id')
	async getUserById(userId: string): Promise<HttpResponse> {
		return new HttpResponse(
			200,
			'Get user by id successful',
			await this.usersService.getUserById(userId),
		);
	}
}
