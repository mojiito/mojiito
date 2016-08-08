/**
 * Converts the array-like NodeList (NodeListOf) to a real array
 *
 * @export
 * @template T
 * @param {NodeListOf<T>} nodeList
 * @returns {Array<T>} Converted Array
 */
export declare function convertNodeListToArray<T extends Node>(nodeList: NodeListOf<T>): Array<T>;
/**
 * Checks if a selector matches an element.
 *
 * @export
 * @param {string} selector
 * @param {Element} element
 * @returns Returns true if selector matches, false if not
 */
export declare function doesSelectorMatchElement(selector: string, element: Element): boolean;
