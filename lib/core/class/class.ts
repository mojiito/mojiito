import { CoreObject } from './../object/object';

export abstract class CoreClass extends CoreObject {
    
    constructor(propertyMap?: Object) {
        super(propertyMap);
    }
}