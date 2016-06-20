/**
 * Converts the array-like NodeList (NodeListOf) to a real array
 *
 * @export
 * @template T
 * @param {NodeListOf<T>} nodeList
 * @returns {Array<T>} Converted Array
 */
export function convertNodeListToArray<T extends Node>(nodeList: NodeListOf<T>): Array<T>  {
    return Array.prototype.slice.call(nodeList);
}

/**
 * Checks if a selector matches an element.
 *
 * @export
 * @param {string} selector
 * @param {Element} element
 * @returns Returns true if selector matches, false if not
 */
export function doesSelectorMatchElement(selector: string, element: Element) {
    let results = convertNodeListToArray(element.parentElement.querySelectorAll(selector));
    return results.length ? results.indexOf(element) !== -1 : false; 
}