import { ClassType } from '../../utils/class/class';
import { DirectiveMetadata } from './metadata';
export declare class DirectiveResolver {
    private _directiveCache;
    resolve(type: ClassType<any>): DirectiveMetadata;
    private _mergeWithPropertyMetadata(dm, properties, type);
    private _extractPublicName(def);
}
