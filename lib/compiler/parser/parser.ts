import { DOMParser } from '../dom_parser/dom_parser';
import { Resolver } from '../resolver/resolver';

class Parser {
    private domParser: DOMParser;
    private root: Element;

    private resolver: Array<Resolver>;

    constructor(rootElement: Element = window.document.body) {
        this.root = rootElement;
    }

    parse() {

    }
}