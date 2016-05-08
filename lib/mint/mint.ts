// parse
// compile
// render

/*
private REGEX_IS_ACTION = /^\(\w+\)$/;
private REGEX_IS_BINDING = /^\[\(?\w+\)?\]$/
private REGEX_IS_FUNCTION = /\w+\(.*\)/;

private REGEX_FIND_FUNCTION_PARAMS = /\(.+\)$/;
private REGEX_FIND_NAME = /\w+/;
*/

import { DOMParser, IDOMParserContextObject, IDOMParserContext } from './dom-parser/dom-parser';

const parser = new DOMParser();

// action hook
// parser.registerAttributeHook({
//     predicate: function(attribute: Attr) {
//         return !!attribute.name.match(/^\[{2}\w+\]{2}|data-\w+$/);
//     },
//     onBeforeParse: function(element: Element, attribute: Attr, context: Array<any>){
//         return [{test: 'a'}];
//     } 
// });
/*
    (attribute: Attr) => {
    return !!attribute.name.match(/^\(\w+\)|data-on-\w+$/) && !!attribute.value.match(/\w+\(.*\)/);
}, (element: Element, attribute: Attr, context: Array<any>) => {
    console.log(attribute);
    return null;
});

// binding hook
parser.registerAttributeHook((attribute: Attr) => {
    return !!attribute.name.match(/^\[\(?\w+\)?\]|data-bind-\w+$/);
}, (element: Element, attribute: Attr, context: Array<any>) => {
    const attributeName = attribute.name.match(/\w+/)[0];
    const isTwoWay = (!!attribute.name.match(/\[\(\w+\)\]/) || !!attribute.value.match(/\(\w+\)/)) && !!element.tagName.toLowerCase().match(/input|select|textarea/);
    console.log(attribute);
    return null;
});
*/
// definition hook
parser.registerAttributeHook({
    predicate: function(attribute: Attr): boolean {
        return !!attribute.name.match(/^\[{2}\w+\]{2}|data-\w+$/);
    },
    onBeforeParse: function (element: Element, attribute: Attr, context: IDOMParserContext): IDOMParserContextObject {
        let type = attribute.name.replace('data-', '').match(/\w+/)[0];
        let name = attribute.value;
        if (type !== 'application' && type !== 'controller' && type !== 'component') {
            throw new Error('Unknown attribute definition found: ' + attribute.name);
        }
        if (type !== 'application') {
            let applicationContext: IDOMParserContextObject = null;
            for (let i = 0, imax = context.length; i < imax; i++) {
                for (let j = 0, jmax = context[i].length; j < jmax; j++) {
                    let contextObject = context[i][j];
                    if (contextObject.type === 'application') {
                        applicationContext = contextObject;
                    }
                }
            }
            if (!applicationContext) {
                throw new Error(`Attribute definition "${attribute.name}=\"${attribute.value}\"" has no application context`);
            }
        }
        return {
            type: type,
            name: name,
            context: context
        }
    } 
});
console.time('parse');
parser.parseTree(document.body);
console.timeEnd('parse');