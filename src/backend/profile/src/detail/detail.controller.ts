import { Controller } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessagePattern } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { ModifyProfileRequestDto } from 'dtos/request/modify-profile-request.dto';
import { GetProfileRequestDto } from 'dtos/request/get-profile-request.dto';
import GetProfileResponseDto from 'dtos/response/get-profile-response.dto';
import AppException from 'exception/app-exception';
import ErrorCode from 'exception/error-code';
import { DetailService } from 'src/detail/detail.service';

@Controller()
export class DetailController {
	constructor(
		private readonly detailService: DetailService,
		private readonly config: ConfigService,
	) {}

	@MessagePattern('profiles:modify-profile')
	async modifyProfile(data: ModifyProfileRequestDto): Promise<GetProfileResponseDto> {
		const expectedApiKey = this.config.get<string>('PROFILE_API_KEY');
		if (data.profileApiKey !== expectedApiKey) {
			throw new AppException(ErrorCode.UNAUTHORIZED);
		}
		return this.detailService.modifyProfileServiceStatus(
			plainToInstance(ModifyProfileRequestDto, data),
		);
	}

	@MessagePattern('profiles:get-profile')
	async getProfile(data: GetProfileRequestDto): Promise<GetProfileResponseDto> {
		const expectedApiKey = this.config.get<string>('PROFILE_API_KEY');
		if (data.profileApiKey !== expectedApiKey) {
			throw new AppException(ErrorCode.UNAUTHORIZED);
		}
		return this.detailService.getProfileServiceStatus(data.userId);
	}
}
