import get from '../get/get';
import set from '../set/set';
import Meta from '../meta/meta';

/**
 * Extends the native Object by observers, computed properties 
 * and many more mojito features.
 * 
 * @class CoreObject
 */
export default class CoreObject {

    constructor(obj?: Object) {
        if (obj instanceof CoreObject) {
            throw new TypeError('Instanciating of Core Objects is only allowed with native Objects');
        }
        
        // extend the CoreObject with a Meta hash 
        Meta.extend(this);
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && !(obj[key] instanceof Meta)) {
                Object.defineProperty(this, key, {
                    get() {
                        Meta.peek(this).get('values', key);
                    },
                    
                    set(value) {
                        Meta.peek(this).set('values', key, value);
                    }
                })
            }
        }
    }

    /**
     * Retrieves the value of a property from the object.
     * 
     * @param  {string} propertyName
     * @returns any
     */
    get(propertyName: string): any {
        get(this, propertyName);
    }
    
    /**
     * Sets the provided key or path on the object to the value.
     * 
     * @param  {string} propertyName
     * @param  {any} value
     * @returns any
     */
    set(propertyName: string, value: any): any {
        set(this, propertyName, value);
    }
    
    /**
     * Static method to provide functionality for `CoreObject.create()`
     * 
     * @param  {Object} obj
     * @returns CoreObject
     */
    static create(obj: Object): CoreObject {
        return new CoreObject(obj);
    }
    
}