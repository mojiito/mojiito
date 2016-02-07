import { CoreObject, Meta, observes } from '../core/core';

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
    
    constructor() {
        super();
        this.var2 = 'asdf';
    }
    
    @observes('var2')
    var2Changed(newValue: String, oldValue?: String) {
        console.log("var2 changed", newValue, oldValue);
    }
}

export class Mojito {
    public Meta: Function;
    public Object: Function;
    
    constructor() {
        this.Meta = Meta;
        this.Object = CoreObject;

    }
}
//console.log(new MyClass());
console.log(new CoreObject({ member: false }));