import { assert } from '../debug/debug';
import { stringify } from '../utils/utils';
import { CompiledDirectiveResult, RuntimeCompiler } from './compiler';
import { NodeVisitor } from './node_visitor';
import { BoundElementPropertyAst, BoundEventAst } from './ast';
import { Injector, provide } from '../core/di/di';
import { AppView, ViewType, ViewContainerRef } from '../core/view/view';
import { AppElement } from '../core/view/element';
import { ComponentFactoryResolver, ComponentFactory, ComponentRef } from '../core/directive/factory';

export function createComponent<T>(component: CompiledDirectiveResult<T>, parentInjector: Injector, nativeElement: Element): ComponentRef<T> {
    assert(component.isComponent, `Could not create component. "${stringify(component.type)}" is a Directive!`);

    const compiler: RuntimeCompiler = parentInjector.get(RuntimeCompiler);
    assert(compiler instanceof RuntimeCompiler,
        `Could not resolve the compiler while creating "${stringify(component.type)}"`);

    const visitor: NodeVisitor = compiler.compileVisitor(component.type);
    assert(visitor instanceof NodeVisitor,
        `Could not resolve the visitor while creating component "${stringify(component.type)}"`);

    // let resolver: ComponentFactoryResolver = parentInjector.get(ComponentFactoryResolver);
    // assert(resolver instanceof ComponentFactoryResolver,
    //     `No ComponentFactoryResolver found while creating component "${stringify(component.type)}"!`);
    // resolver = compiler.resolveComponentFactoryResolver(component.type);

    const factory = compiler.compileComponent(component.type);
    assert(factory instanceof ComponentFactory,
        `Could not find the factory for ${stringify(component.type)}!`);

    // Create a new injector for that component
    const injector = parentInjector.resolveAndCreateChild([
        provide(NodeVisitor, { useValue: visitor })
    ]);

    const ref = factory.create(injector, nativeElement);
    console.log(ref);
    return ref;
}
