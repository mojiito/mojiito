import { isEmpty } from '../utils/utils';
import { assert } from '../debug/debug';

const CONTEXT_REGEXP = /([\$\.\w\d]+)/g;

export class ExpressionParser {    

    parse(expressionString: string) {
        assert(!isEmpty(expressionString), `Expressions can not be empty`, TypeError);

        const contexts = expressionString.match(CONTEXT_REGEXP);
        console.log(contexts);
    }
}

export class Expression {

}