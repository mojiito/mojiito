import { Token, TokenType } from './angular_compiler/lexer';

export class TemplateBuilder {

    private _index: number = -1;
    private _peek: Token;
    private _result: string;
    private _activeTag: 

    constructor(private tokens: Token[]) { }

    build(): string {
        this._attachInstruction('start');
        while (this._peek.type !== TokenType.EOF) {
            if (this._peek.type === TokenType.TAG_OPEN_START) {
                // this._consumeStartTag(this._advance());
            } else if (this._peek.type === TokenType.TAG_CLOSE) {
                // this._consumeEndTag(this._advance());
            } else if (this._peek.type === TokenType.CDATA_START) {
                // this._closeVoidElement();
                // this._consumeCdata(this._advance());
            } else if (this._peek.type === TokenType.COMMENT_START) {
                // this._closeVoidElement();
                // this._consumeComment(this._advance());
            } else if (
                this._peek.type === TokenType.TEXT || this._peek.type === TokenType.RAW_TEXT ||
                this._peek.type === TokenType.ESCAPABLE_RAW_TEXT) {
                // this._closeVoidElement();
                // this._consumeText(this._advance());
            } else if (this._peek.type === TokenType.EXPANSION_FORM_START) {
                // this._consumeExpansion(this._advance());
            } else {
                // Skip all other tokens...
                this._advance();
            }
            this._advance();
        }
        return this._result;
    }

    private _advance(): Token {
        const prev = this._peek;
        if (this._index < this.tokens.length - 1) {
            this._index++;
        }
        this._peek = this.tokens[this._index];
        return prev;
    }

    private _consumeStartTag(startTagToken: Token) {
        const prefix = startTagToken.parts[0];
        const name = startTagToken.parts[1];
        this._attachInstruction('createTag', name);
    }

    private _attachInstruction(key, ...args: any[]) {
        this._result += TEMPLATE_DICTIONARY[key].apply(this, args)+';';
    }
}

const TEMPLATE_DICTIONARY = {
    start: '',
    end: '',
    createTag: (name: string) => `document.createElement(${name})`,
    setAttribute: (name: string, value: string) => `document.setAttribute(${name},${value})`,
}