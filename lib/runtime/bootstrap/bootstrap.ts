import { Injector } from '../injectable/injector';
import { DOMParser } from '../../compiler/dom_parser/dom_parser';

export function bootstrap(root: HTMLElement = document.body) {
    let parser = Injector.get(DOMParser);
    parser.parseTree(root);
}