import { CoreObject, CoreArray, Meta, observes } from './../core';
import { Service, injectable, inject } from './../runtime';

export class Mojito {
    public Meta: Function;
    public Object: Function;
    public Array: Function;
    public Service: Function;
    
    constructor() {
        this.Meta = Meta;
        this.Object = CoreObject;
        this.Array = CoreArray;
        this.Service = Service;
    }
}