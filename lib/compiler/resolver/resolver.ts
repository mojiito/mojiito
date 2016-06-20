export * from './directive_resolver';

export abstract class Resolver {
    abstract validate(element: Element): boolean;
    abstract resolve(element: Element): void;
}