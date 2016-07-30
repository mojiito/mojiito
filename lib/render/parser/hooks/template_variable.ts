import { assert } from '../../../debug/debug';
import { stringify } from '../../../utils/string/stringify';
import { ContextTree } from '../context';
import { ParserAttributeHook } from './hooks';
import { View } from '../../../runtime/view/view';


export class TemplateVariableParserHook extends ParserAttributeHook {

    removeAttributeNode = true;

    constructor() {
        super();
    }

    predicate(attribute: Attr): boolean {
        return !!attribute.name.match(/^\#\w+|ref-\w+|data-ref-\w+$/);
    }

    onParse(element: Element, attribute: Attr, context: ContextTree) {
        let view: View = context.getNearestContextOfType(View);
        let parts = attribute.name.split('-');
        let name = parts[parts.length - 1].match(/\w+/)[0];
        view.addTemplateVar(name, element);
    }
}
