import { assert } from '../../debug/debug';
import { TypedMap } from '../../core/map/map';
import { ClassFactory, getClassName } from '../../utils/class/class';

export abstract class Injector {

    static _instances = new TypedMap<ClassFactory<{}>, {}>();

    static resolve<C>(klass: ClassFactory<C>): C {
        let instance = <C>this._instances.get(klass);

        // Not shure if we should throw an error or return null if no instance was found
        // For now we are returning null
        // assert(!!instance, `No registered Injectable class "${getClassName(klass)}" found for resolving!`, TypeError);
        assert(instance instanceof klass, `The found instance of class "${getClassName(klass)}" for injecting ist not an instance of it!`, TypeError);
        
        return instance || null;
    }

    static register<C>(klass: ClassFactory<C>, ...args: Array<any>): C {
        let registeredInstance = this._instances.get(klass);
        assert(typeof registeredInstance === 'undefined' || !(registeredInstance instanceof klass), `The class "${getClassName(klass)}" is already registered for injecting!`);

        // create new instance from class
        // instead of new klass() using the following code to apply
        // the args as an arguments array
        let instance = <C>new (Function.prototype.bind.apply(klass, [null].concat(args)));
        this._instances.set(klass, instance);
        return instance;
    }
}