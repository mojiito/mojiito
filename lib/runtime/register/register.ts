import { Mojito } from './../../mojito/mojito';
import { Application } from './../application/application';
import { Controller, IController } from './../controller/controller';
import { assert } from './../../debug/debug';

export function register(obj: { application: string, selector: string }): ClassDecorator {
    return function (TargetClass: IController) {
        let applicationName: string = obj.application;
        let application = Mojito.getInstance().getApplication(applicationName);
        application.registerController(TargetClass, {
            application: application,
            selector: obj.selector
        });
    }
}
