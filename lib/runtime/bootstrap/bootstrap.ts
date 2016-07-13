import { assert } from '../../debug/debug';
import { ClassType, getClassName } from '../../utils/class/class';
import { ComponentResolver } from '../component/resolver';
import { Provider, Injector } from '../di/di';

export function bootstrap<C>(appComponentType: ClassType<C>, customProviders: Array<ClassType<any> | Provider | { [key: string]: any }>, root?: HTMLElement): void;
export function bootstrap<C>(appComponentType: ClassType<C>, root?: HTMLElement): void;
export function bootstrap<C>(appComponentType: ClassType<C>, customProviders: any = [], root = document.body) {

    if (customProviders instanceof HTMLElement) {
        root = customProviders;
        customProviders = [];
    }

    assert(Array.isArray(customProviders), 'The custom providers must be an array', TypeError);

    if (customProviders.length) {
        let inj = Injector.resolveAndCreate(customProviders);
    }

    let componentResolver = new ComponentResolver();
    let factory = componentResolver.resolve(appComponentType);

    let elements = document.querySelectorAll(factory.metadataReference.selector);
    assert(!!elements.length,`We could not find an element matching the selector "${factory.metadataReference.selector}" of the "${getClassName(appComponentType)}" component provided to the bootstrap function`);
    assert(elements.length === 1, `There are more than one elements matching the selector "${factory.metadataReference.selector}" of the "${getClassName(appComponentType)}" component provided to the bootstrap function. Mojito only support one element/component per site for bootstraping your app!`);

    // let componentRef = factory.create(<HTMLElement>elements[0]);
    // console.log(componentRef);
}