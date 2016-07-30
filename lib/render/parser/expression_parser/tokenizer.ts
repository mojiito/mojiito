import OPERATOR_CHARS from './operators';

export enum ExpressionTokenType {
    Variable,
    Function,
    Operator
}

export class ExpressionToken {

    private _type: ExpressionTokenType;
    private _expression: string;
    private _key: string;

    get type() {
        return this._type;
    }

    get expression() {
        return this._expression;
    }

    get key() {
        return this._key;
    }

    constructor(expression: string, type: ExpressionTokenType) {
        this._expression = expression
        this._type = type;
        switch (type) {
            case ExpressionTokenType.Function:
                this._key = expression.match(/\w+/)[0];
                break;
            case ExpressionTokenType.Variable:
                this._key = expression;
                break;
        }
    }

    static create(tokenString: string): ExpressionToken {
        if (!tokenString.length) {
            return;
        }
        let type: ExpressionTokenType;

        if (/^\w+$/.test(tokenString)) {
            type = ExpressionTokenType.Variable;
        } else if (/\w+\(\w*(,\w+)*\)/.test(tokenString)) {
            type = ExpressionTokenType.Function;
        } else if (OPERATOR_CHARS.indexOf(tokenString) !== -1) {
            type = ExpressionTokenType.Operator;
        } else {
            throw new Error(`Unknown Expression "${tokenString}"`)
        }

        return new ExpressionToken(tokenString, type);
    }
}


export class ExpressionTokenizer {
    private _tokenList: ExpressionToken[];

    constructor(private expression: string) {}

    tokenize(): ExpressionToken[] {
        if (!this.expression.length) {
            return [];
        }
        if (Array.isArray(this._tokenList)) {
            return this._tokenList;
        }
        let expression = this.expression;
        let tokenString = '';
        let tokens: ExpressionToken[] = [];
        for (let i = 0, max = expression.length; i < max; i++) {
            let char = expression[i];
            if (char === ' ') {
                if (tokenString.length) {
                    tokens.push(ExpressionToken.create(tokenString));
                }
                tokenString = '';
                continue;
            }
            if (OPERATOR_CHARS.indexOf(char) !== -1) {
                if (tokenString.length) {
                    tokens.push(ExpressionToken.create(tokenString));
                }
                tokens.push(ExpressionToken.create(char));
                tokenString = '';
                continue;
            }
            tokenString += char;
        }
        if (tokenString.length) {
            tokens.push(ExpressionToken.create(tokenString));
        }
        return this._tokenList = tokens;
    }
}