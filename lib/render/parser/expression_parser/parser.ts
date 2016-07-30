import { assert } from '../../../debug/assert/assert';
import { ExpressionTokenizer, ExpressionToken, ExpressionTokenType } from './tokenizer';
import { Executable } from './executable';

export class ExpressionParser {

    private _tokenizer: ExpressionTokenizer;

    constructor(private expession: string) {
        this._tokenizer = new ExpressionTokenizer(this.expession);
    }

    parse(requestContextForToken: (token: ExpressionToken) => Function | Object): Executable {
        let tokenList = this._tokenizer.tokenize();
        return Executable.fromTokenList(tokenList, requestContextForToken);
    }
}

