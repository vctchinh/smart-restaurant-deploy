import { ConfigService } from '@nestjs/config';
import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from 'src/common/guards/get-role/auth.guard';

@Controller()
export class TableController {
	constructor(
		@Inject('TABLE_SERVICE') private readonly tableClient: ClientProxy,
		private readonly configService: ConfigService,
	) {}

	@UseGuards(AuthGuard)
	@Post('/tenants/:tenantId/tables')
	createTable(@Param('tenantId') tenantId: string, @Body() data: any) {
		return this.tableClient.send('tables:create', {
			...data,
			tenantId,
			tableApiKey: this.configService.get('TABLE_API_KEY'),
		});
	}

	@UseGuards(AuthGuard)
	@Get('/tenants/:tenantId/tables')
	listTables(
		@Param('tenantId') tenantId: string,
		@Query('isActive') isActive?: string,
		@Query('location') location?: string,
	) {
		const payload: any = {
			tenantId,
			tableApiKey: this.configService.get('TABLE_API_KEY'),
		};
		if (isActive !== undefined) {
			payload.isActive = isActive === 'true';
		}
		if (location) {
			payload.location = location;
		}
		return this.tableClient.send('tables:list', payload);
	}

	@UseGuards(AuthGuard)
	@Get('/tenants/:tenantId/tables/:tableId')
	getTableById(@Param('tenantId') tenantId: string, @Param('tableId') tableId: string) {
		return this.tableClient.send('tables:get-by-id', {
			tenantId,
			tableId,
			tableApiKey: this.configService.get('TABLE_API_KEY'),
		});
	}

	@UseGuards(AuthGuard)
	@Patch('/tenants/:tenantId/tables/:tableId')
	updateTable(
		@Param('tenantId') tenantId: string,
		@Param('tableId') tableId: string,
		@Body() data: any,
	) {
		return this.tableClient.send('tables:update', {
			tenantId,
			tableId,
			data: {
				...data,
				tableApiKey: this.configService.get('TABLE_API_KEY'),
			},
		});
	}

	@UseGuards(AuthGuard)
	@Delete('/tenants/:tenantId/tables/:tableId')
	deleteTable(@Param('tenantId') tenantId: string, @Param('tableId') tableId: string) {
		return this.tableClient.send('tables:delete', {
			tableId,
			tenantId,
			tableApiKey: this.configService.get('TABLE_API_KEY'),
		});
	}

	// QR Code Endpoints
	@UseGuards(AuthGuard)
	@Post('table/:tableId/qrcode')
	generateQrCode(@Param('tableId') tableId: string, @Req() req: Request) {
		const userId = (req as any).user?.userId;
		return this.tableClient.send('qr:generate', {
			tableId,
			tenantId: userId,
			tableApiKey: this.configService.get('TABLE_API_KEY'),
		});
	}

	@Get('table/scan/:token')
	validateScan(@Param('token') token: string) {
		return this.tableClient.send('qr:validate-scan', {
			token,
			tableApiKey: this.configService.get('TABLE_API_KEY'),
		});
	}
}
