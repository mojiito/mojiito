import { assert } from '../../debug/debug';
import { ClassType, getClassName } from '../../utils/class/class';
import { ComponentMetadataReference } from './metadata';

assert(!!(Reflect && Reflect.defineMetadata), 'reflect-metadata shim is required! Please make sure it is installed.');

export class ComponentReflection {

    private static _propertyName = '__meta__';    

    constructor(
        public metadataReference: ComponentMetadataReference<any> = null,
        public injectableClasses: ClassType<any>[] = []
    ) {}

    static get(reflectedClass: ClassType<any>): ComponentReflection {
        let compRefl = Reflect.getMetadata(this._propertyName, reflectedClass);
        if (compRefl instanceof ComponentReflection) {
            return compRefl;
        }

        return this.create(reflectedClass);
    }

    static create(reflectedClass: ClassType<any>, metadataReference?: ComponentMetadataReference<any>, injectableClasses?: ClassType<any>[]): ComponentReflection {
        // assert(!this.get(reflectedClass), `The class ${getClassName(reflectedClass)} already has defined a reflection on it!`);
        let compRefl = new ComponentReflection(metadataReference, injectableClasses);
        Reflect.defineMetadata(this._propertyName, compRefl, reflectedClass);
        return compRefl;
    }
}