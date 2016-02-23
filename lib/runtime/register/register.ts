import { Application } from './../application/application';
import { Controller } from './../controller/controller';

export function register(obj: {application: string, selector: string}): ClassDecorator {
    return function(TargetClass: Function) {
        let applicationName: string = obj.application;
        Application.registerController(applicationName, TargetClass);
    }
}
