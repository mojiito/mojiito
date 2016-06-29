import { Injector } from '../injectable/injector';
import { DOMParser } from '../../compiler/dom_parser/dom_parser';

export function bootstrap() {
    let parser = Injector.resolve(DOMParser);
    parser.parseTree(document.body);
}