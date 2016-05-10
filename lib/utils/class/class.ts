import { assert } from '../../debug/debug';

export interface IClass {
    [propertyName: string]: any;
    name?: string;
}

export function getClassName(klass: IClass) {
    assert(arguments.length === 1, 'getClassName must be called with one arguments; a class');
    assert(typeof klass === 'function', 'The class provided to the getClassName function must be a function', TypeError);
    if (klass.name) {
        return klass.name;
    } else {
        return /^function\s+([\w\$]+)\s*\(/.exec(klass.toString())[1];
    }
}