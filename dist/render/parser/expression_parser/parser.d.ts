import { Executable } from './executable';
export declare class ExpressionParser {
    private expession;
    constructor(expession: string);
    parse(requestContextForToken: (token: string) => Function | Object): Executable;
}
