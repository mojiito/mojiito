"use strict";
var debug_1 = require('../debug/debug');
var utils_1 = require('../utils/utils');
var compiler_1 = require('./compiler');
var node_visitor_1 = require('./node_visitor');
var di_1 = require('../core/di/di');
var factory_1 = require('../core/directive/factory');
function createComponent(component, parentInjector, nativeElement) {
    debug_1.assert(component.isComponent, "Could not create component. \"" + utils_1.stringify(component.type) + "\" is a Directive!");
    var compiler = parentInjector.get(compiler_1.RuntimeCompiler);
    debug_1.assert(compiler instanceof compiler_1.RuntimeCompiler, "Could not resolve the compiler while creating \"" + utils_1.stringify(component.type) + "\"");
    var visitor = compiler.compileVisitor(component.type);
    debug_1.assert(visitor instanceof node_visitor_1.NodeVisitor, "Could not resolve the visitor while creating component \"" + utils_1.stringify(component.type) + "\"");
    // let resolver: ComponentFactoryResolver = parentInjector.get(ComponentFactoryResolver);
    // assert(resolver instanceof ComponentFactoryResolver,
    //     `No ComponentFactoryResolver found while creating component "${stringify(component.type)}"!`);
    // resolver = compiler.resolveComponentFactoryResolver(component.type);
    var factory = compiler.compileComponent(component.type);
    debug_1.assert(factory instanceof factory_1.ComponentFactory, "Could not find the factory for " + utils_1.stringify(component.type) + "!");
    // Create a new injector for that component
    var injector = parentInjector.resolveAndCreateChild([
        di_1.provide(node_visitor_1.NodeVisitor, { useValue: visitor })
    ]);
    var ref = factory.create(injector, nativeElement);
    console.log(ref);
    return ref;
}
exports.createComponent = createComponent;
//# sourceMappingURL=builder.js.map