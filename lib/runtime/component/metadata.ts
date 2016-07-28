import { stringify } from '../../utils/string/stringify';
import { InjectableMetadata } from '../di/metadata';

export class DirectiveMetadata extends InjectableMetadata {
    selector: string;
    inputs: string[];
    outputs: string[];
    host: {[key: string]: string};
    providers: any[];

    constructor(
        {
            selector, 
            inputs, 
            outputs, 
            host, 
            providers
        }: {
            selector?: string,
            inputs?: string[],
            outputs?: string[],
            host?: {[key: string]: string},
            providers?: any[]
        } = {}
    ) {
        super();
        this.selector = selector;
        this.inputs = inputs;
        this.outputs = outputs;
        this.host = host;
        this.providers = providers;
    }

    toString(): string { return `@DirectiveMetadata()`; }
}

export class ComponentMetadata extends DirectiveMetadata {
    templateUrl: string;
    template: string;

    styleUrls: string[];
    styles: string[];

    constructor(
        {
            selector, 
            inputs, 
            outputs, 
            host, 
            providers, 
            templateUrl, 
            template, 
            styleUrls, 
            styles
        }: {
            selector?: string,
            inputs?: string[],
            outputs?: string[],
            host?: {[key: string]: string},
            providers?: any[],
            templateUrl?: string,
            template?: string,
            styleUrls?: string[],
            styles?: string[],
        } = {}
    ) {
        super({ selector, inputs, outputs, host, providers });
        this.templateUrl = templateUrl;
        this.template = template;
        this.styles = styles;
        this.styleUrls = styleUrls;
    }

    toString(): string { return `@ComponentMetadata()`; }
}

