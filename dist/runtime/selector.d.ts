export declare class Selector {
    element: string;
    id: string;
    classNames: string[];
    attributes: [string, string][];
    static parse(selector: string): Selector;
    static parseElement(element: Element): Selector;
    setElement(name: string): void;
    setID(id: string): void;
    addAttribute(name: string, value?: string): void;
    addClassName(name: string): void;
    match(selector: Selector): boolean;
    private _matchElement(selector);
    private _matchID(selector);
    private _matchClassNames(selector);
    private _matchAttributes(selector);
    toString(): string;
}
