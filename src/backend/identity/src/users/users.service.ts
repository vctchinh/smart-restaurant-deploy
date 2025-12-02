import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user';
import RegisterResponse from 'src/users/dtos/response/register-user-response.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RolesService } from 'src/roles/roles.service';
import { AuthorityEnum, RoleEnum } from 'src/utils/enum';
import { Role } from 'src/entity/role';
import AppException from 'src/exception/app-exception';
import ErrorCode from 'src/exception/error-code';
import GetRoleResponseDto from 'src/roles/dtos/response/get-role-response.dto';
import GetAuthorityResponseDto from 'src/authorities/dtos/response/get-authority-response.dto';
import { GetUserResponseDto } from 'src/users/dtos/response/get-user-response.dto';
import RegisterUserResponseDto from 'src/users/dtos/response/register-user-response.dto';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import RegisterUserWithProfileRequestDto from 'src/users/dtos/request/register-user-with-profile-request.dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly rolesService: RolesService,
		@Inject('PROFILE_SERVICE') private readonly profileClient: ClientProxy,
	) {}

	async Register(
		data: RegisterUserWithProfileRequestDto,
	): Promise<RegisterUserResponseDto> {
		const rolesString = data.roles || ['USER'];
		const roles: Role[] = [];
		for (const role of rolesString) {
			const roleInt: number = RoleEnum[role as keyof typeof RoleEnum];
			const roleInRepo = await this.rolesService.getRoleById(roleInt);
			if (!roleInRepo) {
				throw new AppException(ErrorCode.ROLE_NOT_FOUND);
			}
			roles.push(roleInRepo);
		}

		const user = this.userRepository.create({
			username: data.username,
			email: data.email,
			password: await bcrypt.hash(data.password, 10),
			roles: roles,
		});
		try {
			const savedUser = await this.userRepository.save(user);
			const response = new RegisterResponse();
			response.userId = savedUser.userId;
			response.username = savedUser.username;
			response.email = savedUser.email;
			response.roles = savedUser.roles.map((role) => {
				const dto = new GetRoleResponseDto();
				dto.name = RoleEnum[role.name];
				dto.description = role.description;
				dto.authorities = role.authorities.map((authority) => {
					return new GetAuthorityResponseDto({
						name: AuthorityEnum[authority.name],
						description: authority.description,
					});
				});
				return dto;
			});

			try {
				// Chỉ lấy các field của profile, không lấy username, email, password, roles...
				const profileData: any = {
					userId: savedUser.userId,
					profileApiKey: process.env.PROFILE_API_KEY,
				};

				// Map các optional profile fields nếu có
				if (data.birthDay) profileData.birthDay = data.birthDay;
				if (data.phoneNumber) profileData.phoneNumber = data.phoneNumber;
				if (data.address) profileData.address = data.address;
				if (data.restaurantName) profileData.restaurantName = data.restaurantName;
				if (data.businessAddress) profileData.businessAddress = data.businessAddress;
				if (data.contractNumber) profileData.contractNumber = data.contractNumber;
				if (data.contractEmail) profileData.contractEmail = data.contractEmail;
				if (data.cardHolderName) profileData.cardHolderName = data.cardHolderName;
				if (data.accountNumber) profileData.accountNumber = data.accountNumber;
				if (data.expirationDate) profileData.expirationDate = data.expirationDate;
				if (data.cvv) profileData.cvv = data.cvv;
				if (data.frontImage) profileData.frontImage = data.frontImage;
				if (data.backImage) profileData.backImage = data.backImage;

				const profile: any = await firstValueFrom(
					this.profileClient.send('profiles:modify-profile', profileData),
				);

				if (!profile || !profile.userId) {
					await this.userRepository.delete({ userId: savedUser.userId });
					throw new AppException(ErrorCode.PROFILE_SERVICE_ERROR);
				}
			} catch (err) {
				await this.userRepository.delete({ userId: savedUser.userId });
				if (err instanceof AppException) {
					throw err;
				}
				console.error('Error calling profile service:', err);
				throw new AppException(ErrorCode.PROFILE_SERVICE_ERROR);
			}

			return response;
		} catch (err) {
			console.error('Error saving user:', err);
			throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
		}
	}

	async getAllUsers(): Promise<GetUserResponseDto[]> {
		const users = await this.userRepository.find({
			relations: ['roles', 'roles.authorities'],
		});
		return users.map((user) => {
			const dto = new GetUserResponseDto();
			dto.userId = user.userId;
			dto.username = user.username;
			dto.email = user.email;
			dto.roles = user.roles.map((role) => {
				const roleDto = new GetRoleResponseDto();
				roleDto.name = RoleEnum[role.name];
				roleDto.description = role.description;
				roleDto.authorities = role.authorities.map((authority) => {
					return new GetAuthorityResponseDto({
						name: AuthorityEnum[authority.name],
						description: authority.description,
					});
				});
				return roleDto;
			});
			return dto;
		});
	}

	async getUserById(userId: string): Promise<GetUserResponseDto | null> {
		const user = await this.userRepository.findOne({
			where: { userId },
			relations: ['roles', 'roles.authorities'],
		});
		if (!user) {
			return null;
		}
		const dto = new GetUserResponseDto();
		dto.userId = user.userId;
		dto.username = user.username;
		dto.email = user.email;
		dto.roles = user.roles.map((role) => {
			const roleDto = new GetRoleResponseDto();
			roleDto.name = RoleEnum[role.name];
			roleDto.description = role.description;
			roleDto.authorities = role.authorities.map((authority) => {
				return new GetAuthorityResponseDto({
					name: AuthorityEnum[authority.name],
					description: authority.description,
				});
			});
			return roleDto;
		});
		return dto;
	}
}
