import { Mojito } from './../mojito/mojito';
import { assert } from './../../debug/debug';
import { getClassName } from './../../utils/utils';
import { CoreClass, CoreMap, Meta } from './../../core/core';
import { Controller, IController, IControllerMeta } from './../controller/controller';

export interface IApplicationClass {
    new (): Application;
    register(ApplicationClass: IApplicationClass);
}

export interface IApplicationMeta {
    name?: string;
}

export abstract class Application extends CoreClass {

    static applicationClassList: CoreMap = new CoreMap();
    
    // get name() {
    //     return Meta.peek(this).getProperty('values', 'name');
    // }
    
    // set name(value: string) {
    //     throw new Error('Setting an application name directly is not allowed. The name has to be provided on the constructor');
    // }
    
    get root(): Element {
        return Meta.peek(this).getProperty('values', 'root');
    }
    
    set root(value: Element) {
        throw new Error('Setting the application root directly is not allowed.');
    }
    
    constructor(root: HTMLElement) {
        // assert(arguments.length === 1, 'Application must be created with on argument: a name');
        // assert(typeof name === 'string', 'The name provided to the Application must be a string', TypeError);
        
        super();
        
        const meta = Meta.peek(this);
        
        // meta.setProperties('values', {
        //     root: root
        // }, {
        //     writable: false,
        //     configurable: false,
        //     enumerable: false
        // });
        
        // meta.createMember('controllers');
        // meta.createMember('components');
    }
    
    // registerController(ControllerClass: IController, meta: IControllerMeta): Array<Controller> {
    //     assert(arguments.length === 2, 'registerController must be called with on argument: a controller class');
        
    //     const controllers: Array<Controller> = Controller.register(ControllerClass, meta);
        
    //     let controllersList:Array<Controller> = Meta.peek(this).getProperty('controllers', ControllerClass.name);
    //     if (!Array.isArray(controllersList)) {
    //         Meta.peek(this).setProperty('controllers', ControllerClass.name, controllersList = []);
    //     }
    //     Array.prototype.push.apply(controllersList, controllers);
        
    //     return controllersList;
    // }
    
    // getControllers(): Object {
    //     return Meta.peek(this).getMember('controllers');
    // }
    
    // getControllersByClassName(className: string): Object {
    //     let controllersList: Array<Controller> = Meta.peek(this).getProperty('controllers', className);
    //     return Array.isArray(controllersList) ? controllersList : [];
    // }

    static register(ApplicationClass: IApplicationClass, meta?: IApplicationMeta) {
        let name = getClassName(ApplicationClass);
        if (typeof meta === 'object') {
            !!meta.name && (name = meta.name);
        }
    }
}