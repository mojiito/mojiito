import { DirectiveMetadata } from '../core/directive/metadata';
import { ClassType } from '../utils/class/class';

export class CompiledDirectiveMetadata {
    constructor(public metadata: DirectiveMetadata, public type: ClassType<any>) {}
}