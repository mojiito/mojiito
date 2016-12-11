import { CompileDirective } from './compiler';
import { BoundElementPropertyAst, BoundEventAst } from './ast';
export declare function buildView<T>(nativeElement: Element, directive: CompileDirective<T>, targetProperties: BoundElementPropertyAst[], targetEvents: BoundEventAst[]): void;
