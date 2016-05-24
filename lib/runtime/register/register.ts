import { assert } from '../../debug/debug';
import { getClassName, endsWith, toKebabCase } from './../../utils/utils';
import { CoreMap } from './../../core/map/map';
import { Application } from '../application/application';
import { Controller } from '../controller/controller';

export function register(meta?: Object): ClassDecorator {
    assert(typeof meta === 'object' || typeof meta === 'undefined', 'If defined, Meta has to be an object', TypeError);
    
    return function (TargetClass: Function) {
        assert(typeof TargetClass === 'function' && typeof (<any>TargetClass).register === 'function', 'You can only register Application, Controller or Component classes', TypeError);
        (<any>TargetClass).register(TargetClass, meta);
    }
}

export function registerClass(SourceClass: Function, TargetClass: Function, meta?: { name: string }) {
    assert(typeof SourceClass === 'function' && (<any>SourceClass).targetClassList instanceof CoreMap, 'The SourceClass has to be Application, Controller or Component', TypeError);
    
    let name = '';
    let sourceName = getClassName(SourceClass);
    if (typeof meta === 'object') {
        !!meta.name && (name = meta.name);
    } else {
        name = getClassName(TargetClass);
        if (endsWith(name, sourceName)) {
            name = name.slice(0, -10)
        }
        name = toKebabCase(name);
    }
    (<any>SourceClass).targetClassList.set(name, {
        klass: TargetClass,
        meta: meta
    });
}