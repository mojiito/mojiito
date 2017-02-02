import { ClassType } from './utils/facade';

/**
 * Includes is created as a reflection on a class and
 * includes annotations, parameters and properties.
 *
 * You can get this reflected by using the static `peek`
 * method on a class.
 *
 * ```ts
 * class MyClass {
 *   // some code
 * }
 *
 * const reflect = ClassReflection.peek(MyClass);
 * reflect.annotations
 * reflect.properties
 * reflect.parameters
 * ```
 *
 * @export
 * @class ClassReflection
 */
export class ClassReflection {

    private _properties = new Map<string | symbol, any>();
    private _parameters: any[] = [];
    private _annotations = new Map<ClassType<any>, any>();

    get properties() { return this._properties; }
    get parameters() { return this._parameters; }
    get annotations() { return this._annotations; }

    /**
     * Peeks into a class for reflected annotations, properties
     * and parameters. It will return a ClassReflection instance
     * if available or a new one will be created.
     *
     * @static
     * @param {(ClassType<any> | Function)} classType
     * @returns {ClassReflection}
     *
     * @memberOf ClassReflection
     */
    static peek(classType: ClassType<any> | Function): ClassReflection {
        if (this.isReflected(classType))  {
            return classType['__reflection__'];
        }
        let reflection = new ClassReflection();
        classType['__reflection__'] = reflection;
        return reflection;
    }

    /**
     * Checks if a class has already a reflection on it.
     *
     * @static
     * @param {(ClassType<any> | Function)} classType
     * @returns {boolean}
     *
     * @memberOf ClassReflection
     */
    static isReflected(classType: ClassType<any> | Function): boolean {
        return !!classType['__reflection__'];
    }
}
