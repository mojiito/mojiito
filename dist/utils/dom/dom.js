"use strict";
/**
 * Converts the array-like NodeList (NodeListOf) to a real array
 *
 * @export
 * @template T
 * @param {NodeListOf<T>} nodeList
 * @returns {Array<T>} Converted Array
 */
function convertNodeListToArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
}
exports.convertNodeListToArray = convertNodeListToArray;
/**
 * Checks if a selector matches an element.
 *
 * @export
 * @param {string} selector
 * @param {Element} element
 * @returns Returns true if selector matches, false if not
 */
function doesSelectorMatchElement(selector, element) {
    var results = convertNodeListToArray(element.parentElement.querySelectorAll(selector));
    return results.length ? results.indexOf(element) !== -1 : false;
}
exports.doesSelectorMatchElement = doesSelectorMatchElement;
//# sourceMappingURL=dom.js.map