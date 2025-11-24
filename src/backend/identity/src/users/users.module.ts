import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RolesModule } from 'src/roles/roles.module';

@Module({
	imports: [TypeOrmModule.forFeature([User]), RolesModule],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}
