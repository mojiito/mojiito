import { ClassType } from './utils/facade';

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

    static peek(classType: ClassType<any> | Function): ClassReflection {
        if (this.isReflected(classType))  {
            return classType['__reflection__'];
        }
        let reflection = new ClassReflection();
        classType['__reflection__'] = reflection;
        return reflection;
    }

    static isReflected(classType: ClassType<any> | Function): boolean {
        return !!classType['__reflection__'];
    }
}
