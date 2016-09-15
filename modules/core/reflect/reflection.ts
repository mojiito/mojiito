import { ClassType, isClassInstance } from '../../utils/class/class';
import { CoreMap, TypedMap } from '../../core/map/map';
import { assert } from '../../debug/debug';

assert(!!(Reflect && Reflect.defineMetadata), 'reflect-metadata shim is required! Please make sure it is installed.');


export class ClassReflection {

    private _properties = new Map<string | symbol, any>();
    private _parameters: any[] = [];
    private _annotations = new Map<ClassType<any>, any>();

    get properties() {
        return this._properties;
    }

    get parameters() {
        return this._parameters;
    }

    get annotations() {
        return this._annotations;
    }

    static peek(classType: ClassType<any>): ClassReflection {
        if (this.isReflected(classType))  {
            return Reflect.getMetadata('reflection', classType);
        }
        let reflection = new ClassReflection();
        Reflect.defineMetadata('reflection', reflection, classType);
        return reflection;
    }

    static isReflected(classType: ClassType<any>): boolean {
        return Reflect.hasMetadata('reflection', classType);
    }
}