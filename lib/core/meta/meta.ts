const META_FIELD = '__mojito_meta__';

/**
 * The meta object contains information about computed property descriptors,
 * values of defined properties as well as any watched properties and other information.
 * 
 * @class Meta
 */
export default class Meta {

    private observers: Object;
    private values: Object;
    private cache: Object;
    
}

/**
 * Retrieves the meta hash for an object.
 * If the object has no meta yet, a new one will be created
 * 
 * @function meta
 * @param  {Object} obj
 * @returns Meta
 */
export function meta(obj: Object): Meta {
    let meta = obj[META_FIELD];

    if (!meta) {
        meta = new Meta();

        Object.defineProperty(obj, META_FIELD, {
            writable: true,
            configurable: true,
            enumerable: false,
            value: meta
        });
    }

    return meta;
}