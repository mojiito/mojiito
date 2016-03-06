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

import { DOMParser } from './dom-parser/dom-parser';

const parser = new DOMParser();

// action hook
parser.registerAttributeHook({
    predicate: function(attribute: Attr) {
        return !!attribute.name.match(/^\[{2}\w+\]{2}|data-\w+$/);
    },
    onBeforeParse: function(element: Element, attribute: Attr, context: Array<any>){
        return [{test: 'a'}];
    } 
});

// action hook
parser.registerAttributeHook({
    predicate: function(attribute: Attr) {
        return !!attribute.name.match(/^\(\w+\)|data-on-\w+$/) && !!attribute.value.match(/\w+\(.*\)/);
    },
    onParse: function(element: Element, attribute: Attr, context: Array<any>){
        console.log(element, attribute, context);
    } 
});
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

// definition hook
parser.registerAttributeHook((attribute: Attr) => {
    return !!attribute.name.match(/^\[{2}\w+\]{2}|data-\w+$/);
}, (element: Element, attribute: Attr, context: Array<any>) => {
    return [element];
});*/
console.time('parse');
parser.parseTree(document.body);
console.timeEnd('parse');