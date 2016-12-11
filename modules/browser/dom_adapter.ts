import  { OpaqueToken, provide, Provider } from '../core/di/di'
import { DOMTraverser } from './dom_traverser';

export const DOCUMENT: OpaqueToken = new OpaqueToken('DocumentToken');
export const WINDOW: OpaqueToken = new OpaqueToken('WindowToken');

export const DOM_PROVIDERS: any[] = [
    provide(WINDOW, { useValue: window }),
    provide(DOCUMENT, { useValue: window.document }),
    DOMTraverser
]; 

