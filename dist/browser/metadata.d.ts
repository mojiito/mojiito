import { DirectiveMetadata } from '../core/directive/metadata';
import { ClassType } from '../utils/class/class';
export declare class CompiledDirectiveMetadata {
    metadata: DirectiveMetadata;
    type: ClassType<any>;
    constructor(metadata: DirectiveMetadata, type: ClassType<any>);
}
