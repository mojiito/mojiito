import { Token } from './expression_parser';

export class Expression {
  constructor(public tokens: Token[]) { }
}
