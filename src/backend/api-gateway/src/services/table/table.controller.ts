import { ConfigService } from '@nestjs/config';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('table')
export class TableController {
	constructor(
		@Inject('TABLE_SERVICE') private readonly tableClient: ClientProxy,
		private readonly configService: ConfigService,
	) {}
}
