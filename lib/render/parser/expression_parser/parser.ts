import { assert } from '../../../debug/assert/assert';
import { Executable } from './executable';

export class ExpressionParser {    

    constructor(private expession: string) {}

    parse(requestContextForToken: (token: string) => Function | Object): Executable {
        return new Executable(this.expession, requestContextForToken);
    }
}

