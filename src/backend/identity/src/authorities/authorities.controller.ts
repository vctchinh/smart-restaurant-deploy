import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthoritiesService } from 'src/authorities/authorities.service';
import CreateAuthorityRequestDto from 'src/authorities/dtos/request/create-authority-request.dto';
import HttpResponse from 'src/utils/http-response';

@Controller('authorities')
export class AuthoritiesController {
	constructor(private readonly authoritiesService: AuthoritiesService) {}

	@MessagePattern('authorities:get-all-authorities')
	async getAllAuthorities(): Promise<HttpResponse> {
		return new HttpResponse(
			200,
			'Get all authorities successful',
			await this.authoritiesService.getAllAuthorities(),
		);
	}

	@MessagePattern('authorities:create-authority')
	async createAuthority(data: CreateAuthorityRequestDto): Promise<HttpResponse> {
		return new HttpResponse(
			200,
			'Create authority successful',
			await this.authoritiesService.createAuthority(data),
		);
	}
}
