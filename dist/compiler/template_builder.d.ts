export declare class TemplateBuilder {
    private _index;
    private _peek;
    private _result;
    private _activeTag;
    build(): string;
    private _advance();
    private _consumeStartTag(startTagToken);
    private _attachInstruction(key, ...args);
}
