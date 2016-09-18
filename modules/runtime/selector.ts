import { assert } from '../debug/debug';
import { isPresent, isEmpty } from '../utils/utils';

// See https://github.com/angular/angular/blob/master/modules/%40angular/compiler/src/selector.ts#L16
const _SELECTOR_REGEXP = new RegExp(
    '(\\:not\\()|' +                              //":not("
    '([-\\w]+)|' +                            // "tag"
    '(#[-\\w]+)|' +                            // "#id"
    '(?:\\.([-\\w]+))|' +                     // ".class"
    '(?:\\[([-\\w*]+)(?:=([^\\]]*))?\\])|' +  // "[name]", "[name=value]" or "[name*=value]"
    '(\\))|' +                                // ")"
    '(\\s*,\\s*)',                            // ","
    'g');

export class Selector {

    public element: string;
    public id: string;
    public classNames: string[] = [];
    public attributes: [string, string][] = [];

    static parse(selector: string) {
        assert(selector.indexOf(' ') === -1, `Nesting in a selector "${selector}" is not allowed!`);

        const sel = new Selector();
        let match: string[];

        while (isPresent(match = _SELECTOR_REGEXP.exec(selector))) {
            if (isPresent(match[1])) {
                throw new Error(`:not is currently not supported in a selector "${selector}"`);
            }
            if (isPresent(match[2])) {
                sel.setElement(match[2]);
            }
            if (isPresent(match[3])) {
                sel.setID(match[3]);
            }
            if (isPresent(match[4])) {
                sel.addClassName(match[4]);
            }
            if (isPresent(match[5])) {
                sel.addAttribute(match[5], match[6]);
            }
            // if (isPresent(match[7])) {
            // }
            if (isPresent(match[8])) {
                throw new Error(`Multiple selectors are currently not supported: "${selector}"`);
            }
        }

        return sel;
    }

    static parseElement(element: Element) {
        const selector = new Selector();
        selector.setElement(element.tagName.toLowerCase());
        selector.setID(element.id || undefined);
        element.className.split(' ').filter(n => !!n).forEach(n => selector.addClassName(n));
        Array.prototype.slice.call(element.attributes)
            .filter((a: Attr) => a.name !== 'class' && a.name !== 'id')
            .forEach((a: Attr) => selector.addAttribute(a.name, a.value));
        return selector;
    }

    setElement(name: string) {
        this.element = name;
    }

    setID(id: string) {
        this.id = id;
    }

    addAttribute(name: string, value: string = '') {
        this.attributes.push([name, value]);
    }

    addClassName(name: string) {
        this.classNames.push(name.toLowerCase());
    }

    match(selector: Selector) {
        return this._matchElement(selector) && this._matchID(selector) &&
            this._matchClassNames(selector) && this._matchAttributes(selector);
    }

    private _matchElement(selector: Selector) {
        return isPresent(this.element) ? this.element === selector.element : true;
    }

    private _matchID(selector: Selector) {
        return isPresent(this.id) ? this.id === selector.id : true;
    }

    private _matchClassNames(selector: Selector) {
        if (!isEmpty(this.classNames)) {
            if (isEmpty(selector.classNames))
                return false;
            return this.classNames.filter(n => selector.classNames.indexOf(n) !== -1).length !== this.classNames.length;
        }
        return true;
    }

    private _matchAttributes(selector: Selector) {
        if (!isEmpty(this.attributes)) {
            if (isEmpty(selector.attributes))
                return false;
            
            let result = this.attributes.filter(
                a1 => isPresent(selector.attributes.find(a2 => a1[0] === a2[0] && a1[1] === a2[1])));
            return result.length === this.attributes.length;
        }
        return true;
    }

    toString() {
        let result = this.element || '';
        result += (this.id && '#' + this.id) || '';
        result += this.classNames.map(n => '.' + n).join('');
        return result += this.attributes
            .filter(a => a[0] !== 'class' && a[0] !== 'id')
            .map(a => {
                let attr = a[0];
                if (a[1]) {
                    attr += '="' + a[1] + '"';
                }
                return '[' + attr + ']';
            }).join('');
    }
}