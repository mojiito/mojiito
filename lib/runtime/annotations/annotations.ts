import { ClassType, isClassInstance } from '../../utils/class/class';
import { CoreMap } from '../../core/map/map';
import { assert } from '../../debug/debug';

assert(!!(Reflect && Reflect.defineMetadata), 'reflect-metadata shim is required! Please make sure it is installed.');

export class Annotations {
    private _map = new CoreMap();
    private _classType: ClassType<any>;

    constructor(classType: ClassType<any>) {
        this._classType = classType;
    }

    get<A>(annotationType: ClassType<A>): A[] {
        return this._map.get(annotationType);
    }

    getSingle<A>(annotationType: ClassType<A>): A {
        let annotations = this.get(annotationType);
        return Array.isArray(annotations) && annotations.length ? annotations[0] : null;
    }

    add<A>(annotation: A) {
        assert(isClassInstance(annotation), `Annotation ${annotation} has to be an instance of a class`, TypeError);
        let annotations = this.get(<ClassType<A>>annotation['constructor']);
        if (annotations === undefined) {
            annotations = [];
            this._map.set(annotation['constructor'],annotations);
        }
        annotations.push(annotation);
    }

    set<A>(annotation: A) {
        this._map.delete(annotation['constructor']);
        this.add(annotation);
    }

    static peek(classType: ClassType<any>): Annotations {
        if (this.isAnnotated(classType))  {
            return Reflect.getMetadata('annotations', classType);
        }
        let annotations = new Annotations(classType);
        Reflect.defineMetadata('annotations', annotations, classType);
        return annotations;
    }

    static isAnnotated(classType: ClassType<any>): boolean {
        return Reflect.hasMetadata('annotations', classType);
    }
}