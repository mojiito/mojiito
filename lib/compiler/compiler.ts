import { DOMParser } from './dom_parser/dom_parser';
import { DirectiveResolver } from './resolver/directive_resolver';
import { getRegisteredDirectives } from '../runtime/directives/directives';

export class Compiler {
    private parser = new DOMParser();

    constructor() {
        let directives = getRegisteredDirectives();
        for (let key in directives) {
            if (directives.hasOwnProperty(key)) {
                var directive = directives[key];
                let resolver = new DirectiveResolver(directive.klass, directive.metadata);
            }
        }
        console.log(directives);
    }
}