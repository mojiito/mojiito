import { assert } from '../../debug/debug';
import { ClassType, getClassName } from '../../utils/class/class';
import { ComponentResolver } from '../component/resolver';
import { ComponentReference } from '../component/reference';
import { Provider, Injector } from '../di/di';
import { doesSelectorMatchElement } from '../../utils/dom/dom';
import { Parser } from '../../render/parser/parser';

export function bootstrap<C>(appComponentType: ClassType<C>, customProviders: Array<ClassType<any> | Provider | { [key: string]: any }>, root?: Element): void;
export function bootstrap<C>(appComponentType: ClassType<C>, root?: HTMLElement): void;
export function bootstrap<C>(appComponentType: ClassType<C>, customProviders: any = [], root = document.body) {

    if (customProviders instanceof Element) {
        root = customProviders;
        customProviders = [];
    }

    assert(root instanceof Element, 'Root has to be an Element!', TypeError);    
    assert(Array.isArray(customProviders), 'The custom providers must be an array', TypeError);

    let appRef: ComponentReference<any>;    
    let providers = [
        new Provider(ComponentResolver, { useClass: ComponentResolver }),
        new Provider(Parser, { useClass: Parser }),
        new Provider(ComponentReference, { useValue: appRef })
    ]
    let rootInjector = Injector.resolveAndCreate(providers.concat(customProviders));
    let componentResolver = <ComponentResolver>rootInjector.get(ComponentResolver);
    let factory = componentResolver.resolveComponent(appComponentType);

    let element: Element;
    let selector = factory.metadataReference.selector;
    if (doesSelectorMatchElement(selector, root)) {
        element = root;
    } else {
        let elements = root.querySelectorAll(factory.metadataReference.selector);
        assert(
            !!elements.length,
            `We could not find an element matching the selector "${factory.metadataReference.selector}" of the "${getClassName(appComponentType)}" component provided to the bootstrap function`
        );
        assert(
            elements.length === 1,
            `There are more than one elements matching the selector "${factory.metadataReference.selector}" of the "${getClassName(appComponentType)}" component provided to the bootstrap function. Mojito only support one element/component per site for bootstraping your app!`
        );
        element = elements[0];
    }

    appRef = factory.create(rootInjector, element);
    appRef.parse();
}