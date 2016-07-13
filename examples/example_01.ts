import { observes } from 'mojito/core';
import { Injector } from 'mojito/runtime';

console.time('init');

// class asf {}
// @Component({ selector: '[my-application]' })    
// class App {
//     constructor(@Inject(asf) test) {
//     }
// }

// @Component({ selector: 'my-component' })
// class TestComponent {
//     private test: App;
//     constructor() {
//     }
// }

// bootstrap(App);

class aaaaa {

}

let inj = Injector.resolveAndCreate([aaaaa]);
console.log(inj);


console.timeEnd('init');



// Check if metadata is an object
// assert(
//     typeof metadata === 'object' && !Array.isArray(metadata),
//     `The metadata property for the directive on your class "${getClassName(klass)}" must be an object and implement the IControllerMetadata interface!`,
//     TypeError
// );

// // Check if a selector is specified in the metadata.
// // Every directive must have a selector
// assert(typeof metadata.selector === 'string',
//     `The directive metadata object on your class "${getClassName(klass)}" must specify a selector!`,
//     TypeError);

// metadata.selector = metadata.selector.trim();

// // Check if selector contains only one level of dom nodes
// // Ok: .my-selector
// // Not allowed: .parent .my-selector
// assert(metadata.selector.indexOf(' ') === -1,
//     `The directive selector "${metadata.selector}" on your class "${getClassName(klass)}" contains more than one levels of nodes. Only one is allowed!`,
//     SyntaxError);

// // Check if selector is valid
// assert(!!metadata.selector.match(/^([a-z#\-\.\[\]\=\"\']*)+$/),
//     `The directive selector "${metadata.selector}" on your class "${getClassName(klass)}" is not valid`,
//     SyntaxError);

// // Parsing the selector string to an array
// // 'my-element.class1#id[attribute1].class2[attribute2="value"]'
// // to
// // ["my-element", ".class1", "#id", "[attribute1]", ".class2", "[attribute2="value"]"]   
// let selectorList: string[] = metadata.selector.split('.').join(' .').split('#').join(' #').split('[').join(' [').trim().split(' ');

// for (let i = 0, max = selectorList.length; i < max; i++) {
//     let selector = selectorList[i];
//     if (!selector.length) {
//         continue;
//     }

//     // Check if the selector contains element names whicht are not allowed
//     // eg. custom elements without a "-" in it
//     assert(
//         !selector.match(/^\w+(-\w+)*$/) || !(document.createElement(selector) instanceof HTMLUnknownElement),
//         `The selector "${metadata.selector}" on your class "${getClassName(klass)}" contains an element name "${selector}" which is not allowed. 
//         If you are using a custom element, there has to be a "-" char in it. E.g.: my-component`,
//         SyntaxError);
// }