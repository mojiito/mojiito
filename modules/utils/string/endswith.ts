export function endsWith(str: string, searchString: string, position?: number): boolean {
    let prototype = <any>String.prototype;
    if (typeof prototype.endsWith === 'function') {
        return prototype.endsWith.call(str, searchString, position);
    } else {
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > str.length) {
            position = str.length;
        }
        position -= searchString.length;
        let lastIndex = str.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    }
}