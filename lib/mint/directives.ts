// import { DOMParser, IDOMParserContext, IDOMParserContextObject } from './dom-parser/dom-parser';

// /**
//  * (description)
//  * 
//  * @export
//  * @param {DOMParser} parser (description)
//  * @param {Function} callback (description)
//  */
// export function registerDefinitionHook(parser: DOMParser, callback: Function) {
//     parser.registerAttributeHook({
//         // Check for [[something]] and data-something
//         predicate: function (attribute: Attr): boolean {
//             return !!attribute.name.match(/^\[{2}\w+\]{2}|data-\w+$/);
//         },
//         onBeforeParse: function (element: Element, attribute: Attr, context: IDOMParserContext): IDOMParserContextObject {
//             // [[foo-controller]]            
//             let directiveName = attribute.name.replace('data-', '').match(/\w+/)[0];
            
//             return {
//                 type: type,
//                 name: name,
//                 context: null
//             }
//         }
//     });
// }