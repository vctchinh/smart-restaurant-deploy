import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import CreateRoleRequestDto from 'src/roles/dtos/request/create-role-request.dto';
import { RolesService } from 'src/roles/roles.service';
import HttpResponse from 'src/utils/http-response';

@Controller()
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@MessagePattern('roles:get-all-roles')
	async getAllRoles(): Promise<HttpResponse> {
		return new HttpResponse(
			200,
			'Get all roles successful',
			await this.rolesService.getAllRoles(),
		);
	}

	@MessagePattern('roles:create-role')
	async createRole(data: CreateRoleRequestDto): Promise<HttpResponse> {
		return new HttpResponse(
			200,
			'Create role successful',
			await this.rolesService.createRole(data),
		);
	}
}
