import { CoreObject, CoreArray, Meta, observes } from '../core/core';

class MyClass extends CoreObject {
    var1: string;
    
    constructor() {
        super();
        this.var1 = 'asdf';
    }
    
    @observes('var1')
    var1Changed(newValue: String, oldValue?: String) {
        console.log("var1 changed", newValue, oldValue);
    }
}

class MyClassExtended extends MyClass {
    var2: string;
    var3: Object;
    
    constructor(obj) {
        super();
        this.var2 = 'asdf';
        this.var3 = obj;
    }
    
    @observes('var2')
    var2Changed(newValue: String, oldValue?: String) {
        console.log("var2 changed", newValue, oldValue);
    }
    
    @observes('var3.a')
    aChanged()  {
        
    }
}

export class Mojito {
    public Meta: Function;
    public Object: Function;
    public Array: Function;
    
    constructor() {
        this.Meta = Meta;
        this.Object = CoreObject;
        this.Array = CoreArray;
    }
}
//console.log(new MyClass());
window.Mojito = new Mojito;
window.my = new MyClassExtended();
window.a = new window.Mojito.Array([1, 2, 3]);