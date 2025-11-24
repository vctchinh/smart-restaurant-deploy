import { registerDecorator } from 'class-validator';
import { ValidationOptions } from './../../../node_modules/class-validator/types/decorator/ValidationOptions.d';
import { MatchPasswordConstraint } from 'src/decorators/validation-constraint/match-password.validation-constraint';

export function MatchPassword(property: string, validationOptions?: ValidationOptions) {
	return function (object: any, propertyName: string) {
		registerDecorator({
			name: 'MatchPassword',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [property],
			options: validationOptions,
			validator: MatchPasswordConstraint,
		});
	};
}
