import { Expression } from './expression';

export class BoundAst {
  constructor(public expression: Expression) { }
}

export class BoundPropertyAst extends BoundAst {
  constructor(public eventName: string, expression: Expression) {
    super(expression);
  }
}

export class BoundEventAst extends BoundAst {
  constructor(public eventName: string, expression: Expression) {
    super(expression);
  }
}
