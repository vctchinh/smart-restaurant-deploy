import { JwtPayload } from 'src/configuration/jwt-strategy.config';

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}
