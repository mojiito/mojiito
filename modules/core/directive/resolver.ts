import { assert } from '../../debug/debug';
import { stringify } from '../../utils/string/stringify';
import { isPresent } from '../../utils/lang/lang';
import { Injectable } from '../di/di';
import { ClassType } from '../../utils/class/class';
import { DirectiveMetadata, ComponentMetadata, InputMetadata, OutputMetadata } from './metadata';
import { ClassReflection } from '../reflect/reflection';

@Injectable()
export class DirectiveResolver {
    private _directiveCache = new Map<ClassType<any>, DirectiveMetadata>();

    resolve(type: ClassType<any>): DirectiveMetadata {
        let metadata = this._directiveCache.get(type);
        if (!this._directiveCache.get(type)) {
            metadata = ClassReflection.peek(type).annotations.get(ComponentMetadata);
            if (!metadata) {
                metadata = ClassReflection.peek(type).annotations.get(DirectiveMetadata);
            }
            assert(isPresent(metadata), `Annotated metadata found on ${stringify(type)} is not a DirectiveMetadata`, TypeError);
            assert(metadata instanceof DirectiveMetadata, `No annotated metadata found on ${stringify(type)}`, TypeError);
            metadata = this._mergeWithPropertyMetadata(metadata, ClassReflection.peek(type).properties, type);
            this._directiveCache.set(type, metadata);
        }
        return metadata;
    }

    private _mergeWithPropertyMetadata(dm: DirectiveMetadata, properties: Map<string | symbol, any>, type: ClassType<any>): DirectiveMetadata {
        var inputs: string[] = [];
        var outputs: string[] = [];

        properties.forEach((value: any, index: string) => {
            if (value instanceof InputMetadata) {
                if (isPresent(value.bindingPropertyName)) {
                    inputs.push(`${index}: ${value.bindingPropertyName}`);
                } else {
                    inputs.push(index);
                }
            } else if (value instanceof OutputMetadata) {
                if (isPresent(value.bindingPropertyName)) {
                    outputs.push(`${index}: ${value.bindingPropertyName}`);
                } else {
                    outputs.push(index);
                }
            }
        });

        let mergedInputs: string[];
        if (isPresent(dm.inputs)) {
            const dmInputs = dm.inputs.map((def: string): string => this._extractPublicName(def));
            inputs.forEach((def: string) => {
                const name = this._extractPublicName(def);
                assert(dmInputs.indexOf(name) === -1, `Input '${name}' defined multiple times in '${stringify(type)}'`)
            });
            mergedInputs = dm.inputs.concat(inputs);
        } else {
            mergedInputs = inputs;
        }

        let mergedOutputs: string[];
        if (isPresent(dm.outputs)) {
            const dmOutputs = dm.outputs.map((def: string): string => this._extractPublicName(def));
            outputs.forEach((def: string) => {
                const name = this._extractPublicName(def);
                assert(dmOutputs.indexOf(name) === -1, `Output '${name}' defined multiple times in '${stringify(type)}'`)
            });
            mergedOutputs = dm.outputs.concat(inputs);
        } else {
            mergedOutputs = outputs;
        }
        if (dm instanceof ComponentMetadata) {
            return new ComponentMetadata({
                selector: dm.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                host: dm.host,
                changeDetection: dm.changeDetection,
                providers: dm.providers,
                template: dm.template,
                templateUrl: dm.templateUrl,
                styles: dm.styles,
                styleUrls: dm.styleUrls,
            });

        } else {
            return new DirectiveMetadata({
                selector: dm.selector,
                inputs: mergedInputs,
                outputs: mergedOutputs,
                providers: dm.providers
            });
        }
    }

    private _extractPublicName(def: string) {
        const parts = def.split(':');
        if (parts.length !== 2) return def.trim();
        return parts[1].trim();
    }
}