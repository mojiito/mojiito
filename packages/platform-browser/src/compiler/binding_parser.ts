import { Injectable } from 'mojiito-core';
import { ExpressionParser } from './expression_parser';
import { isPresent } from '../facade/lang';
import * as html from './html';
import { BoundEventAst, BoundPropertyAst } from './ast';

// tslint:disable-next-line:max-line-length
const BIND_NAME_REGEXP = /^(?:(?:(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.+))|\[\(([^\)]+)\)\]|\[([^\]]+)\]|\(([^\)]+)\))$/;

// Group 1 = "bind-"
const KW_BIND_IDX = 1;
// Group 2 = "let-"
const KW_LET_IDX = 2;
// Group 3 = "ref-/#"
const KW_REF_IDX = 3;
// Group 4 = "on-"
const KW_ON_IDX = 4;
// Group 5 = "bindon-"
const KW_BINDON_IDX = 5;
// Group 6 = "@"
const KW_AT_IDX = 6;
// Group 7 = the identifier after "bind-", "let-", "ref-/#", "on-", "bindon-" or "@"
const IDENT_KW_IDX = 7;
// Group 8 = identifier inside [()]
const IDENT_BANANA_BOX_IDX = 8;
// Group 9 = identifier inside []
const IDENT_PROPERTY_IDX = 9;
// Group 10 = identifier inside ()
const IDENT_EVENT_IDX = 10;

const CLASS_ATTR = 'class';

@Injectable()
export class BindingParser {

  constructor(private _exprParser: ExpressionParser) { }

  parseAttr(attr: html.Attribute, targetMatchableAttrs: string[][],
      targetProps: BoundPropertyAst[], targetEvents: BoundEventAst[]) {
    const name = this._normalizeAttributeName(attr.name);
    const value = attr.value;

    const bindParts = name.match(BIND_NAME_REGEXP);
    let hasBinding = false;

    // const expr = this._exprParser.parse(value);
    if (bindParts !== null) {
      hasBinding = true;
      if (bindParts[KW_BIND_IDX] != null) {
        unsupported('Property binding', name, value);
      } else if (bindParts[KW_LET_IDX]) {
        unsupported('Variable declaration', name, value);
      } else if (bindParts[KW_REF_IDX]) {
        unsupported('Variable declaration', name, value);
      } else if (bindParts[KW_ON_IDX]) {
        // this._parseEvent();
      } else if (bindParts[KW_BINDON_IDX]) {
        unsupported('Two way binding', name, value);
      } else if (bindParts[KW_AT_IDX]) {
      } else if (bindParts[IDENT_BANANA_BOX_IDX]) {
      } else if (bindParts[IDENT_PROPERTY_IDX]) {
      } else if (bindParts[IDENT_EVENT_IDX]) {
      }
    }

    return hasBinding;

    // if (isPresent(bindParts[KW_BIND_IDX])) {
    //   unsupported('Property binding', name, value);
    // } else if (bindParts[KW_REF_IDX]) {
    //   unsupported('Variable declaration', name, value);
    // } else if (bindParts[KW_ON_IDX]) {
    //   return new EventBindingParseResult(bindParts[IDENT_KW_IDX], expr);
    // } else if (bindParts[KW_BINDON_IDX]) {
    //   unsupported('Two way binding', name, value);
    // } else if (bindParts[KW_AT_IDX]) {
    //   unsupported('Animations', name, value);
    // } else if (bindParts[IDENT_BANANA_BOX_IDX]) {
    //   unsupported('Two way binding', name, value);
    // } else if (bindParts[IDENT_PROPERTY_IDX]) {
    //   unsupported('Property binding', name, value);
    // } else if (bindParts[IDENT_EVENT_IDX]) {
    //   return new EventBindingParseResult(bindParts[IDENT_EVENT_IDX], expr);
    // } else {
    //   throw new Error(`Unknown binding name: ${name}`);
    // }
  }

  private _parseEvent(name: string, expression: string) {
    // long format: 'target: eventName'
    // const [target, eventName] = splitAtColon(name, [null !, name]);
    // const ast = this._parseAction(expression, sourceSpan);
    // targetMatchableAttrs.push([name !, ast.source !]);
    // targetEvents.push(new BoundEventAst(eventName, target, null, ast, sourceSpan));
    // Don't detect directives for event names for now,
    // so don't add the event name to the matchableAttrs
  }

  private _normalizeAttributeName(attrName: string): string {
    return /^data-/i.test(attrName) ? attrName.substring(5) : attrName;
  }
}



function unsupported(type: string, name: string, expression: string) {
  throw new Error(`${type} is not yet supported: ${name}="${expression}"`);
}
