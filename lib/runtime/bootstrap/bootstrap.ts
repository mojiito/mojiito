import { assert } from '../../debug/debug';
import { ClassType, getClassName } from '../../utils/class/class';
import { ComponentResolver } from '../component/resolver';

export function bootstrap<C>(appComponent: ClassType<C>, root = document.body) {
    let componentResolver = new ComponentResolver();
    let factory = componentResolver.resolve(appComponent);

    let elements = document.querySelectorAll(factory.metadataReference.selector);
    assert(!!elements.length,`We could not find an element matching the selector "${factory.metadataReference.selector}" of the "${getClassName(appComponent)}" component provided to the bootstrap function`);
    assert(elements.length === 1, `There are more than one elements matching the selector "${factory.metadataReference.selector}" of the "${getClassName(appComponent)}" component provided to the bootstrap function. Mojito only support one element/component per site for bootstraping your app!`);

    // let componentRef = factory.create(<HTMLElement>elements[0]);
    // console.log(componentRef);
}