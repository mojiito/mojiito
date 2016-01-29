const META_FIELD = '__mojito_meta__';

/**
 * The meta object contains information about computed property descriptors,
 * values of defined properties as well as any watched properties and other information.
 * 
 * @class Meta
 */
export default class Meta {
    
    /**
     * @function set
     * @param  {string} memberKey
     * @param  {string} propertyKey
     * @param  {any} value
     * @returns any
     */
    set(memberKey: string, propertyKey: string, value: any): any {
        let member = this[memberKey];
        if (!member) {
            Object.defineProperty(this, memberKey, {
                writable: true,
                configurable: false,
                enumerable: true,
                value: {}
            });
            member = this[memberKey];
        }
        member[propertyKey] = value;

        return value;
    }
    
    /**
     * @function get
     * @param  {string} memberKey
     * @param  {string} propertyKey
     * @returns any
     */
    get(memberKey: string, propertyKey: string): any {
        return this.has(memberKey, propertyKey) ? this[memberKey][propertyKey] : undefined;
    }
    
    /**
     * @function has
     * @param  {string} memberKey
     * @param  {string} propertyKey
     * @returns boolean
     */
    has(memberKey: string, propertyKey: string): boolean {
        return this[memberKey] && this[memberKey][propertyKey];
    }
    
    /**
     * @function delete
     * @param  {string} memberKey
     * @param  {string} propertyKey
     * @returns boolean
     */
    delete(memberKey: string, propertyKey: string): boolean {
        if (this.has(memberKey, propertyKey)) {
            this[memberKey][propertyKey] = null;
            return this[memberKey][propertyKey];
        }
        return false;
    }
    
    /**
     * @function clear
     * @param  {string} memberKey
     * @returns boolean
     */
    clear(memberKey: string): boolean {
        if (this[memberKey]) {
            let result = true;
            for (let propertyKey in this[memberKey]) {
                result = this.delete(memberKey, propertyKey) ? result : false;
            }
            return false;
        }
    }
    
    /**
     * Creates a new Meta instance and extends an object with it.
     * 
     * @function extend
     * @param  {Object} obj
     * @returns Meta
     */
    static extend(obj: Object): Meta {
        var meta = new Meta();

        Object.defineProperty(obj, META_FIELD, {
            writable: true,
            configurable: true,
            enumerable: false,
            value: meta
        });

        return meta;
    }
    
    /**
     * Retrieves the meta hash for an object.
     * If the object has no meta yet, a new one will be created
     * 
     * @function peek
     * @param  {Object} obj
     * @returns Meta
     */
    static peek(obj: Object): Meta {
        let meta = obj[META_FIELD];

        if (!meta) {
            meta = Meta.extend(obj);
        }

        return meta
    }

}