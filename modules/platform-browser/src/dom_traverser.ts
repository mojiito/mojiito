import { Visitor } from './dom_visitor';

export class DomTraverser {

  private _nodeCount = 0;
  private _elementCount = 0;
  private _attributeCount = 0;
  private _textCount = 0;
  private _commentCount = 0;

  constructor() { }

  traverse(node: Node, visitor: Visitor, context: any = null) {
    let ctx: any = context;
    this._nodeCount++;

    if (node instanceof Element) {
      ctx = visitor.visitElement(node, ctx) || ctx;
      this._elementCount++;
    } else if (node instanceof Text) {
      ctx = visitor.visitText(node, ctx) || ctx;
      this._textCount++;
    } else if (node instanceof Comment) {
      ctx = visitor.visitComment(node, ctx) || ctx;
      this._commentCount++;
    }

    // Check if context has changed and look up the corresponding
    // NodeVisitor if available
    if (!!ctx && ctx !== context) {
      visitor = visitor.get(ctx);
    } else {
      // Traverse through all the attributes of the node
      // if it is type of Element
      if (node instanceof Element && node.attributes.length) {
        for (let i = 0, max = node.attributes.length; i < max; i++) {
          ctx = visitor.visitAttribute(node, node.attributes[i], ctx) || ctx;
          this._attributeCount++;
        }
      }
    }

    // Start traversing the child nodes
    let childNode = node.firstChild;
    if (childNode) {
      this.traverse(childNode, visitor, ctx);
      while (childNode = childNode.nextSibling) {
        this.traverse(childNode, visitor, ctx);
      }
    }
  }
}
