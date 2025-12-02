import { IsNotEmpty, IsOptional } from 'class-validator';

export class LogoutAuthRequestDto {
	@IsNotEmpty({ message: 'token should not be empty' })
	token: string;

	@IsNotEmpty({ message: 'expiresAt should not be empty' })
	expiresAt: Date;

	@IsOptional()
	identityApiKey?: string;
}
