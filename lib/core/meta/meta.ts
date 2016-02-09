import { assert } from './../../debug/debug';
import { CoreObject } from '../object/object';
import { CoreArray } from '../array/array';

const META_FIELD = '__mojito_meta__';

/**
 * The meta object contains information about computed property descriptors,
 * values of defined properties as well as any watched properties and other information.
 * 
 * @export
 * @class Meta
 */
export class Meta {
    
    /**
     * Creates the member on a meta hash 
     * 
     * @param  {string} memberKey The name(key) of the member to be created
     * @returns {Object} The created member object
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
     * @param  {string} memberKey The name(key) of the member to be peeked
     * @returns {Object} The peeked member object
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
     * @param  {string} memberKey The name(key) of the member to be returned
     * @returns {Object} The member object or `undefined`
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
     * @param  {string} memberKey The name(key) of the member to be checked
     * @returns {boolean} true if member exists, false if not
     */
    hasMember(memberKey: string): boolean {
        assert(arguments.length === 1, 'hasMember on an meta hash must be called with one arguments: a member key');
        assert(typeof memberKey === 'string', 'The member key provided to the hasMember method on a meta hash must be a string', TypeError);

        return !!this.getMember(memberKey);
    }
    
    /**
     * Deletes all the properties of a member in the meta hash.
     * 
     * @param  {string} memberKey The name(key) of the member to be cleared
     * @returns {boolean} true if clear was successful, false if not
     */
    clearMember(memberKey: string): boolean {
        assert(arguments.length === 1, 'clearMember on an meta hash must be called with one arguments: a member key');
        assert(typeof memberKey === 'string', 'The member key provided to the clearMember method on a meta hash must be a string', TypeError);

        let member = this.getMember(memberKey);
        if (member) {
            let status = true;
            for (let propertyKey in member) {
                status = this.deleteProperty(memberKey, propertyKey) ? status : false;
            }
            return status;
        }
        // No member to be cleared found -> false
        return false;
    }
    
    /**
     * Sets the property of a member in the meta hash.
     * If the property does not exist, it will be created.
     * If the property does exist, the value will be overwritten
     * 
     * @param  {string} memberKey The name(key) of the member where the property will be set
     * @param  {string} propertyKey The name(key) of the property to be set
     * @param  {*} value The value which will be set on the property
     * @returns {*} The applied value
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
     * @param  {string} memberKey The name(key) of the member where to look for the property
     * @param  {string} propertyKey The name(key) of the requeste property
     * @returns {*} The requested property
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
     * @param  {string} memberKey The name(key) of the member where to look for the property
     * @param  {string} propertyKey The name(key) of the property to be checked
     * @returns {boolean} true if the property was found, false if not
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
     * @param  {string} memberKey The name(key) of the member where to delete the property
     * @param  {string} propertyKey The name(key) of the property to be deleted
     * @returns {boolean} true if deletion was successful, false if not
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
     * @static
     * @param  {CoreObject} obj The CoreObject where the meta will be created on
     * @returns {Meta} The created meta object
     */
    static extend(obj: CoreObject): Meta;
    /**
     * Creates a new Meta instance and extends an object with it.
     * 
     * @static
     * @param  {CoreArray} obj The CoreArray where the meta will be created on
     * @returns {Meta} The created meta object
     */
    static extend(obj: CoreArray): Meta;
    static extend(obj: any): Meta {
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
     * @static
     * @param  {CoreObject} obj The CoreObject where to peek for a meta hash
     * @returns {Meta} The peeked or created meta object
     */
    static peek(obj: CoreObject): Meta;
    /**
     * Retrieves the meta hash for an object.
     * If the object has no meta yet, a new one will be created
     * 
     * @static
     * @param  {CoreArray} obj The CoreArray where to peek for a meta hash
     * @returns {Meta} The peeked or created meta object
     */
    static peek(obj: CoreArray): Meta;
    static peek(obj: any): Meta {
        const source: any = obj;  // needed for enabled noImplicitAny
        let meta = source[META_FIELD];

        if (!meta) {
            meta = Meta.extend(obj);
        }

        return meta
    }

}