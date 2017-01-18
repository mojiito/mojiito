import { ClassType, isClassInstance } from '../../utils/class/class';
import { CoreMap, TypedMap } from '../../core/map/map';
import { assert } from '../../debug/debug';

// assert(!!(Reflect && Reflect.defineMetadata), 'reflect-metadata shim is required! Please make sure it is installed.');


export class ClassReflection {

    private _properties = new TypedMap<string | symbol, any>();
    private _parameters: any[] = [];
    private _annotations = new TypedMap<ClassType<any>, any>();

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
            // return Reflect.getMetadata('reflection', classType);
            return classType['__reflection__'];
        }
        let reflection = new ClassReflection();
        // Reflect.defineMetadata('reflection', reflection, classType);
        classType['__reflection__'] = reflection;
        return reflection;
    }

    static isReflected(classType: ClassType<any>): boolean {
        return !!classType['__reflection__'];
        // return Reflect.hasMetadata('reflection', classType);
    }
}
