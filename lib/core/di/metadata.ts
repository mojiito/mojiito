import { stringify } from '../../utils/string/stringify';

export class InjectableMetadata {
    constructor() { }
    toString(): string { return `@Injectable()`; }
}

export class InjectMetadata {
    constructor(public token: any) { }
    toString(): string { return `@Inject(${stringify(this.token)})`; }
}