import { CoreObject, CoreArray, Meta, observes } from './../core';
import { Service, injectable, inject } from './../runtime/runtime';

@injectable
class MyService extends Service {
    private url: string = 'asdf';
    
    testFn() {
        return this.url;
    }
}

class MyClass {
    
    @inject(MyService)
    private myService: MyService;
    
    constructor() {
        console.log(this.myService.testFn());
    }
}

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
w['Mojito'] = new Mojito();
w['myClass'] = new MyClass();
