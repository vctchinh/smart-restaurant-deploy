interface JsonObject {
	[key: string]: unknown;
}

export function toJSONIgnoreNullsOrUndefined(obj: JsonObject): JsonObject {
	const jsonObj: JsonObject = {};

	for (const key in obj) {
		const value = obj[key];
		if (value !== null && value !== undefined) {
			jsonObj[key] = value;
		}
	}

	return jsonObj;
}

export function extractFields(source: any, fields: string[]): any {
	return fields.reduce((acc, field) => {
		if (source[field] !== undefined && source[field] !== null) {
			acc[field] = source[field];
		}
		return acc;
	}, {} as any);
}
