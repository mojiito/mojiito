import { assert } from './../../debug/debug';
import { getClassName, endsWith, toKebabCase } from './../../utils/utils';
import { Meta } from './../../core/meta/meta';
import { CoreMap } from './../../core/map/map';
import { registerClass } from './../register/register';
import { ObservableObject } from './../observable/observableObject';
import { Controller } from './../controller/controller';

export abstract class Application extends ObservableObject {

    static targetClassList: CoreMap = new CoreMap();
    
    constructor() {
        super();
    }

    static register(ApplicationClass: Function, meta?: { name: string; }) {
        registerClass(Application, ApplicationClass, meta);
    }
}
