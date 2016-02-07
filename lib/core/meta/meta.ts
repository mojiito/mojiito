import { assert } from './../../debug/assert/assert';

const META_FIELD = '__mojito_meta__';

/**
 * The meta object contains information about computed property descriptors,
 * values of defined properties as well as any watched properties and other information.
 * 
 * @class Meta
 */
export class Meta {
    
    /**
     * Creates the member on a meta hash 
     * 
     * @method createMember
     * @param  {string} memberKey
     * @returns Object
     */
    createMember(memberKey: string): Object {
        assert(arguments.length === 1, 'createMember on an meta hash must be called with one arguments: a member key');
        assert(typeof memberKey === 'string', 'The member key provided to the createMember method on a meta hash must be a string', TypeError);
        
        if (!this.hasMember(memberKey)) {
            Object.defineProperty(this, '_' + memberKey, {
                writable: true,
                configurable: false,
                enumerable: true,
                value: {}
            });
            return this.getMember(memberKey);
        }
        return undefined;
    }
    
    /**
     * Checks if the member is already there, otherwise 
     * it will create it. The member gets returned.
     * 
     * @method peekMember
     * @param  {string} memberKey
     * @returns Object
     */
    peekMember(memberKey: string): Object {
        assert(arguments.length === 1, 'peekMember on an meta hash must be called with one arguments: a member key');
        assert(typeof memberKey === 'string', 'The member key provided to the peekMember method on a meta hash must be a string', TypeError);

        const member = this.createMember(memberKey);
        return member ? member : this.getMember(memberKey);
        
    }
    
    /**
     * Returns the member of the meta hash 
     * or `undefined` it does not exist 
     * 
     * @method getMember
     * @param  {string} memberKey
     * @returns Object
     */
    getMember(memberKey: string): Object {
        assert(arguments.length === 1, 'getMember on an meta hash must be called with one arguments: a member key');
        assert(typeof memberKey === 'string', 'The member key provided to the getMember method on a meta hash must be a string', TypeError);

        const source: any = this;  // needed for enabled noImplicitAny
        memberKey = '_' + memberKey;
        return source[memberKey];
    }
    
    /**
     * Checks if the meta hash has a specific member
     * 
     * @method hasMember
     * @param  {string} memberKey
     * @returns Object
     */
    hasMember(memberKey: string): Object {
        assert(arguments.length === 1, 'hasMember on an meta hash must be called with one arguments: a member key');
        assert(typeof memberKey === 'string', 'The member key provided to the hasMember method on a meta hash must be a string', TypeError);

        return !!this.getMember(memberKey);
    }
    
    /**
     * Deletes all the properties of a member in the meta hash.
     * 
     * @method clearMember
     * @param  {string} memberKey
     * @returns boolean
     */
    clearMember(memberKey: string): boolean {
        assert(arguments.length === 1, 'clearMember on an meta hash must be called with one arguments: a member key');
        assert(typeof memberKey === 'string', 'The member key provided to the clearMember method on a meta hash must be a string', TypeError);

        let member = this.getMember(memberKey);
        if (member) {
            let result = true;
            for (let propertyKey in member) {
                result = this.deleteProperty(memberKey, propertyKey) ? result : false;
            }
            return result;
        }
        // No member to be cleared found -> false
        return false;
    }
    
    /**
     * Sets the property of a member in the meta hash.
     * If the property does not exist, it will be created.
     * If the property does exist, the value will be overwritten
     * 
     * @method setProperty
     * @param  {string} memberKey
     * @param  {string} propertyKey
     * @param  {any} value
     * @returns any
     */
    setProperty(memberKey: string, propertyKey: string, value: any): any {
        assert(arguments.length === 3, 'setProperty on an meta hash must be called with three arguments; a member key, a property key and a value');
        assert(typeof memberKey === 'string', 'The member key provided to the setProperty method on a meta hash must be a string', TypeError);
        assert(typeof propertyKey === 'string', 'The property key provided to the setProperty method on a meta hash must be a string', TypeError);
        //assert(typeof value !== 'undefined', 'Cannot call setProperty on a meta hash with an `undefined` value ', TypeError);

        let member: any = this.getMember(memberKey);
        if (!member) {
            member = this.createMember(memberKey);
        }
        member[propertyKey] = value;
        return value;
    }
    
    /**
     * Returns the property of a member in the meta hash
     * or `undefined` if the property or the member do not exist.
     * 
     * @method getProperty
     * @param  {string} memberKey
     * @param  {string} propertyKey
     * @returns any
     */
    getProperty(memberKey: string, propertyKey: string): any {
        assert(arguments.length === 2, 'getProperty on an meta hash must be called with two arguments; a member key and a property key');
        assert(typeof memberKey === 'string', 'The member key provided to the getProperty method on a meta hash must be a string', TypeError);
        assert(typeof propertyKey === 'string', 'The property key provided to the getProperty method on a meta hash must be a string', TypeError);

        const member: any = this.peekMember(memberKey);
        return member[propertyKey];
    }
    
    /**
     * Checks if the member of the meta hash has a specific property
     * 
     * @method hasProperty
     * @param  {string} memberKey
     * @param  {string} propertyKey
     * @returns boolean
     */
    hasProperty(memberKey: string, propertyKey: string): boolean {
        assert(arguments.length === 2, 'hasProperty on an meta hash must be called with two arguments; a member key and a property key');
        assert(typeof memberKey === 'string', 'The member key provided to the hasProperty method on a meta hash must be a string', TypeError);
        assert(typeof propertyKey === 'string', 'The property key provided to the hasProperty method on a meta hash must be a string', TypeError);

        return !!this.getProperty(memberKey, propertyKey);
    }
    
    /**
     * Deletes a property of a member in the meta hash
     * 
     * @method deleteProperty
     * @param  {string} memberKey
     * @param  {string} propertyKey
     * @returns boolean
     */
    deleteProperty(memberKey: string, propertyKey: string): boolean {
        assert(arguments.length === 2, 'deleteProperty on an meta hash must be called with two arguments; a member key and a property key');
        assert(typeof memberKey === 'string', 'The member key provided to the deleteProperty method on a meta hash must be a string', TypeError);
        assert(typeof propertyKey === 'string', 'The property key provided to the deleteProperty method on a meta hash must be a string', TypeError);

        const source: any = this;  // needed for enabled noImplicitAny
        if (source.hasProperty(memberKey, propertyKey)) {
            memberKey = '_' + memberKey;
            source[memberKey][propertyKey] = null;
            delete source[memberKey][propertyKey];
            return !source[memberKey][propertyKey];
        }
        return false;
    }
    
    /**
     * Creates a new Meta instance and extends an object with it.
     * 
     * @method extend
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
     * @method peek
     * @param  {Object} obj
     * @returns Meta
     */
    static peek(obj: Object): Meta {
        const source: any = obj;  // needed for enabled noImplicitAny
        let meta = source[META_FIELD];

        if (!meta) {
            meta = Meta.extend(obj);
        }

        return meta
    }

}