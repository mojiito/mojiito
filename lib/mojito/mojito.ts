import { CoreObject, CoreArray, Meta, observes } from './../core';
import { Service, injectable, inject } from './../runtime/runtime';

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
let w: any = window;
let array:Array<any> = [];
for (var index = 0; index < 10; index++) {
    array.push(index);
    
}
w['array'] = new CoreArray(array);