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

export function filterNullValues(obj: any): any {
	return Object.entries(obj).reduce((acc, [key, value]) => {
		if (value !== null && value !== undefined) {
			acc[key] = value;
		}
		return acc;
	}, {} as any);
}
