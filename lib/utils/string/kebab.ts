const KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;

export function toKebabCase(str: string): string {
	let result = str.replace(KEBAB_REGEX, function (match) {
		return '-' + match.toLowerCase();
    });
    return result.indexOf('-') === 0 ? result.slice(1) : result;
};
