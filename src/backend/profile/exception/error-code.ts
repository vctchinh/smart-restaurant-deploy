export default class ErrorCode {
	static readonly USER_NOT_FOUND: ErrorCode = new ErrorCode(1001, 'User not found');
	static readonly ERROR_VALIDATION: ErrorCode = new ErrorCode(
		1002,
		'Validation error',
		400,
	);
	static readonly ROLE_CREATION_FAILED: ErrorCode = new ErrorCode(
		1003,
		'Role creation failed',
		500,
	);

	static readonly AUTHORITY_CREATION_FAILED: ErrorCode = new ErrorCode(
		1004,
		'Authority creation failed',
		500,
	);

	static readonly AUTHORITY_NOT_FOUND: ErrorCode = new ErrorCode(
		1005,
		'Authority not found',
		404,
	);

	static readonly ROLE_NOT_FOUND: ErrorCode = new ErrorCode(1006, 'Role not found', 404);

	static readonly VALIDATION_FAILED: ErrorCode = new ErrorCode(
		1007,
		'Validation failed',
		400,
	);

	static readonly LOGIN_FAILED: ErrorCode = new ErrorCode(
		1008,
		'Username or password is incorrect',
		401,
	);

	static readonly INVALID_TIME_FORMAT: ErrorCode = new ErrorCode(
		1009,
		'Invalid time format',
		400,
	);
	static readonly USER_ALREADY_EXISTS: ErrorCode = new ErrorCode(
		1010,
		'User with given username or email already exists',
		409,
	);
	static readonly UNAUTHORIZED: ErrorCode = new ErrorCode(
		1011,
		'Unauthorized access',
		401,
	);

	static readonly TOKEN_ALREADY_REMOVED: ErrorCode = new ErrorCode(
		1012,
		'Token has already been removed',
		400,
	);

	//update for other services

	static readonly PROFILE_NOT_FOUND: ErrorCode = new ErrorCode(
		1013,
		'Profile not found',
		404,
	);

	static readonly PROFILE_SERVICE_ERROR: ErrorCode = new ErrorCode(
		1014,
		'Profile service error',
		500,
	);
	constructor(
		public readonly code: number,
		public readonly message: string,
		public readonly httpStatus?: number,
	) {
		this.code = code;
		this.message = message;
		this.httpStatus = httpStatus;
	}
}
