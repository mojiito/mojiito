import { Mojito } from './../../mojito/mojito';
import { assert } from './../../debug';
import { CoreClass, Meta } from './../../core';
import { Controller } from './../controller/controller';

export class Application extends CoreClass {
    
    get name() {
        return Meta.peek(this).getProperty('values', 'name');
    }
    
    set name(value: string) {
        throw new Error('Setting a application name directly is not allowed. The name has to be provided on the constructor');
    }
    
    constructor(name: string) {
        assert(arguments.length === 1, 'Application must be created with on argument: a name');
        assert(typeof name === 'string', 'The name provided to the Application must be a string', TypeError);
        assert(!Mojito.getInstance().getApplication(name) , 'An Application with the provided name has already been created');
        
        super();
        
        const meta = Meta.peek(this);
        
        meta.setProperty('values', 'name', name, {
            writable: false,
            configurable: false,
            enumerable: false
        });
        
        meta.createMember('controllers');
        meta.createMember('components');
        console.dir(Mojito);
        Mojito.getInstance().registerApplication(this);
    }
    
    registerController(ControllerClass: Function): Controller {
        assert(arguments.length === 1, 'registerController must be called with on argument: a controller class');
        const controllerInstance = new (ControllerClass.constructor());
        
        debugger;
        
        return controllerInstance;
    }
    
    static create(name: string) {
        assert(arguments.length === 1, 'Application must be created with on argument: a name');
        assert(typeof name === 'string', 'The name provided to the create method must be a string', TypeError);
        
        return new Application(name)
    }
}