import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Patch,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import Role from 'src/guard/check-role/check-role.guard';

@Controller('profiles')
export class ProfileController {
	constructor(
		@Inject('PROFILE_SERVICE') private readonly profileClient: ClientProxy,
		private readonly configService: ConfigService,
	) {}

	@Get('my-profile')
	@UseGuards(AuthGuard('jwt'))
	getMyProfile(@Req() req: Request) {
		const userId = (req as any).user.userId;
		console.log('userId from JWT:', userId);
		return this.profileClient.send('profiles:get-profile', {
			userId,
			profileApiKey: this.configService.get('PROFILE_API_KEY'),
		});
	}

	@Patch('modify')
	@UseGuards(AuthGuard('jwt'))
	modifyProfile(@Body() data: any, @Req() req: Request) {
		const userId = (req as any).user.userId;
		console.log('userId from JWT:', userId);
		data.userId = userId;
		return this.profileClient.send('profiles:modify-profile', {
			...data,
			profileApiKey: this.configService.get('PROFILE_API_KEY'),
		});
	}

	@Get(':userId')
	@UseGuards(AuthGuard('jwt'), Role('ADMIN'))
	getProfile(@Param('userId') userId: string) {
		return this.profileClient.send('profiles:get-profile', {
			userId,
			profileApiKey: this.configService.get('PROFILE_API_KEY'),
		});
	}
}
