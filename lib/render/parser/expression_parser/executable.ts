import { ExpressionTokenizer, ExpressionToken, ExpressionTokenType } from './tokenizer';

export class Executable {
    constructor(private fn: Function, private contexts: Object | Function[]) {}

    execute() {
        return this.fn.apply(this.fn, this.contexts);
    }
    
    static fromTokenList(tokenList: ExpressionToken[], requestContextForToken: (token: ExpressionToken) => Function | Object): Executable {
        let definitionString = '';
        let executableString = '';
        let contexts: any[] = [];
        for (let i = 0, max = tokenList.length; i < max; i++) {
            let token = tokenList[i];
            if (token.type === ExpressionTokenType.Function || token.type === ExpressionTokenType.Variable) {
                definitionString += `var expr_${i} = Function('return this.${token.expression}');`;
                executableString += `expr_${i}.apply(arguments[${i}], [])`;
                contexts.push(requestContextForToken(token));
            } else if(token.type === ExpressionTokenType.Operator) {
                executableString += token.expression;
            }
        }
        return new Executable(Function(definitionString + executableString), contexts);
    }
}