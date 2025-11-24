import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user';
import { RemoveToken } from 'src/entity/remove-token';

@Module({
	imports: [TypeOrmModule.forFeature([User, RemoveToken])],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
