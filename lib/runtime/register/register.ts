import { Mojito } from '../mojito/mojito';
import { Application } from '../application/application';
import { Controller, IController } from '../controller/controller';
import { assert } from '../../debug/debug';

export function register(obj: { }): ClassDecorator {
    return function (TargetClass: IController) {
        let name: string;
        if (TargetClass.hasOwnProperty('name')) {
            name = TargetClass.name;
        } else {
            name = /^function\s+([\w\$]+)\s*\(/.exec(TargetClass.toString())[1];
        }
        console.log(name);
        // let applicationName: string = obj.application;
        // let application = Mojito.getInstance().getApplication(applicationName);
        // application.registerController(TargetClass, {
        //     application: application,
        //     selector: obj.selector
        // });
    }
}
