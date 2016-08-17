export class Executable {

    private _executableFn: Function;
    private _contexts: Function | Object[] = [];

    constructor(expression: string, requestContextForToken: (token: string) => Function | Object) {
        let pattern = /\$?\b\w+(\.\w+)*\b/g;
        var executableString = "";

        let lastIndex = 0;
        let match: RegExpExecArray;
        let contexts: any[] = [];
        while (match = pattern.exec(expression)) {
            const token = expression.substr(match.index, pattern.lastIndex - match.index);
            contexts.push(requestContextForToken(token.split('.')[0]));
            executableString += expression.substr(lastIndex, match.index - lastIndex) + 'arguments['+(contexts.length-1)+'].' + token ;
            lastIndex = pattern.lastIndex;
        }
        executableString += expression.substr(lastIndex, expression.length);
        
        this._executableFn = Function('return '+executableString);
        this._contexts = contexts;
        
        this.execute = this.execute.bind(this);
    }

    execute() {
        return this._executableFn.apply(this._executableFn, this._contexts);
    }
}
