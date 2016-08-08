export declare class ContextReference {
    context: any;
    constructor(context: any);
}
export declare class ContextTree {
    private _tree;
    constructor(context?: any | any[]);
    up(): void;
    down(): void;
    add(context: any | any[]): void;
    getUnfiltered(): ContextReference[][];
    getFiltered(): ContextReference[][];
    getNearestContextOfType(type: Function | string): any;
}
