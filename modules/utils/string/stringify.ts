import { getClassName } from '../class/class';

export function stringify(token: any): string {
    if (typeof token === 'string') {
        return token;
    }

    if (token === undefined || token === null) {
        return '' + token;
    }    
    
    // if (typeof token === 'function') {
    //     return getClassName(token);
    // }

    if (token.name) {
        return token.name;
    }
    if (token.overriddenName) {
        return token.overriddenName;
    }

    if (token instanceof HTMLElement) {
        let parts = token.toString().match(/\w+/g);
        if (parts && parts.length)  {
            return parts[parts.length - 1];
        }
    }

    var res = token.toString();
    var newLineIndex = res.indexOf('\n');
    return (newLineIndex === -1) ? res : res.substring(0, newLineIndex);
}