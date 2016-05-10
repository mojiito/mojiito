import { assert } from '../../debug/debug';

export function getClassName(Klass: Function) {
    assert(arguments.length === 1, 'getClassName must be called with one arguments; a class');
    assert(typeof Klass === 'function', 'The class provided to the getClassName function must be a function', TypeError);
    
    if (Klass['name']) {
        return Klass['name'];
    } else {
        return /^function\s+([\w\$]+)\s*\(/.exec(Klass.toString())[1];
    }
}