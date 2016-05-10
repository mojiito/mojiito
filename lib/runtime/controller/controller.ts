import { CoreView, onDidAttachView, onDidRenderView, Meta } from './../../core/core';
import { assert } from './../../debug/debug';
import { Application } from './../application/application';

export interface IControllerMeta {
    application: Application,
    selector: string
}

export interface IController extends Controller {
    new (): IController;
    name: string;
}

export abstract class Controller extends CoreView {
    
    constructor() {
        super();
    }
    
    // _attachController(element: Element) {
    //     super._attachView(element);
    // }
    
    static register(ControllerClass: IController, meta: IControllerMeta) {
        // const elements = meta.application.root.querySelectorAll(meta.selector);
        // let instances: Array<Controller> = [];
        // for (let i = 0, max = elements.length; i < max; i++) {
        //     let element = elements[i];
        //     let controllerInstance = new ControllerClass();
            
        //     Meta.peek(controllerInstance).setProperties('controller', meta, {
        //         writable: false,
        //         configurable: false,
        //         enumerable: true
        //     });
            
        //     instances.push(controllerInstance);
        //     controllerInstance._attachController(element);
        // }

        // return instances;
    }
}
