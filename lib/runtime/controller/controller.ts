import { assert } from './../../debug/debug';
import { getClassName, endsWith, toKebabCase } from './../../utils/utils';
import { CoreMap } from './../../core/map/map';
import { registerClass } from './../register/register';
import { View, onDidAttachView, onDidRenderView } from '../view/view';
import { Application } from './../application/application';

export abstract class Controller extends View {

     static targetClassList: CoreMap = new CoreMap();
    
    constructor() {
        super();
    }

    static register(ControllerClass: Function, meta?: { name: string; }) {
        registerClass(Controller, ControllerClass, meta);
    }
}
