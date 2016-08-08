export declare class Executable {
    private _executableFn;
    private _contexts;
    constructor(expression: string, requestContextForToken: (token: string) => Function | Object);
    execute(): any;
}
