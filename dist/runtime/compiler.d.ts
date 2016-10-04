import { ClassType } from '../utils/utils';
import { DirectiveResolver } from '../core/directive/resolver';
import { DirectiveMetadata } from '../core/directive/metadata';
import { ChangeDetectionStrategy } from '../core/change_detection/change_detection';
export declare class RuntimeCompiler {
    private _resolver;
    constructor(_resolver: DirectiveResolver);
    compileDirectiveAndAllChilds(directive: ClassType<any>): CompileDirective<any>[];
    private _compileDirective(directive);
}
export declare class CompileDirective<T> {
    isComponent: boolean;
    type: ClassType<T>;
    changeDetection: ChangeDetectionStrategy;
    selector: string;
    inputs: {
        [key: string]: string;
    };
    outputs: {
        [key: string]: string;
    };
    host: {
        [key: string]: string;
    };
    providers: any[];
    directives: ClassType<any>[];
    templateUrl: string;
    template: string;
    styleUrls: string[];
    styles: string[];
    constructor(type: ClassType<T>, metadata: DirectiveMetadata);
    static create<T>(type: ClassType<T>, metadata: DirectiveMetadata): CompileDirective<T>;
}
