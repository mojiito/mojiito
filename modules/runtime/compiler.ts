import { ClassType, isArray, isPresent, splitAtColon, stringify } from '../utils/utils';
import { DirectiveResolver } from '../core/directive/resolver';
import { ComponentFactory } from '../core/directive/factory';
import { DirectiveMetadata, ComponentMetadata } from '../core/directive/metadata';
import { Inject, Injectable } from '../core/di/di';
import { ChangeDetectionStrategy } from '../core/change_detection/change_detection';
import {assert} from "../debug/assert/assert";

@Injectable()
export class RuntimeCompiler {

    constructor(
        @Inject(DirectiveResolver) private _resolver: DirectiveResolver
    ) { }

    compileDirectiveAndAllChilds(directive: ClassType<any>) {
        let result = [this._compileDirective(directive)];
        const metadata = this._resolver.resolve(directive);
        if(isArray(metadata.directives)) {
            metadata.directives
                .filter(d => isPresent(d))
                .map(d => result = result.concat(this.compileDirectiveAndAllChilds(d)));
        }
        return result;
    }

    private _compileDirective(directive: ClassType<any>) {
        const metadata = this._resolver.resolve(directive);
        return CompileDirective.create(directive, metadata);
    }

}


export class CompileDirective<T> {

    isComponent: boolean;
    type: ClassType<T>;
    changeDetection: ChangeDetectionStrategy;
    selector: string;
    inputs: {[key: string]: string};
    outputs: {[key: string]: string};
    host: {[key: string]: string};
    providers: any[];
    directives: ClassType<any>[];
    templateUrl: string;
    template: string;
    styleUrls: string[];
    styles: string[];

    constructor(type: ClassType<T>, metadata: DirectiveMetadata) {
        this.type = type;
        this.isComponent = metadata instanceof ComponentMetadata;

        let mergedInputs: {[key: string]: string} = {};
        metadata.inputs.forEach(i => {
            const parts = splitAtColon(i, [i,i]);
            assert(!isPresent(mergedInputs[parts[1]]), `The input parameter ${parts[1]} is already defined on ${stringify(type)}`);
            mergedInputs[parts[1]] = parts[0];
        });
        this.inputs = mergedInputs;

        let mergedOutputs: {[key: string]: string} = {};
        metadata.outputs.forEach(i => {
            const parts = splitAtColon(i, [i,i]);
            assert(!isPresent(mergedOutputs[parts[1]]), `The output parameter ${parts[1]} is already defined on ${stringify(type)}`);
            mergedOutputs[parts[1]] = parts[0];
        });
        this.outputs = mergedOutputs;
        
        this.directives = metadata.directives;
        this.providers = metadata.providers;
        this.selector = metadata.selector;

        if(metadata instanceof ComponentMetadata) {
            this.changeDetection = metadata.changeDetection || ChangeDetectionStrategy.Default;
            this.host = metadata.host;
            this.templateUrl = metadata.templateUrl;
            this.template = metadata.template;
            this.styleUrls = metadata.styleUrls;
            this.styles = metadata.styles;
        }
    }

    static create<T>(type: ClassType<T>, metadata: DirectiveMetadata) {
        return new CompileDirective(type, metadata);
    }
}