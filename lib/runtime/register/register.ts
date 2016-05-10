import { Mojito } from '../mojito/mojito';
import { Application } from '../application/application';
import { Controller, IController } from '../controller/controller';
import { assert } from '../../debug/debug';

export interface ITargetClass {
    new(): Function;
    register(TargetClass: ITargetClass, meta?: Object): void;
}

export function register(meta?: Object): ClassDecorator {
    return function (TargetClass: ITargetClass) {
        registerClass(TargetClass, meta);
    }
}

export function registerClass(TargetClass: ITargetClass, meta?: Object) {
    assert(arguments.length > 0 && arguments.length < 3, 'registerClass must be called with at least one argument; a TargetClass and optional a meta object');
    assert(typeof TargetClass === 'function' && typeof TargetClass.register === 'function', 'The TargetClass has to be an Application, Controller or Component', TypeError);
    assert(typeof meta === 'object' || typeof meta === 'undefined', 'Meta has to be an object if defined', TypeError);
    
    TargetClass.register(TargetClass, meta);
}