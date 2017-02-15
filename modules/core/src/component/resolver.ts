import { ListWrapper } from '../facade/collection';
import { stringify } from '../facade/lang';
import { ClassType } from '../type';
import { Component } from './metadata';
import { reflector } from '../reflection/reflection';
import { ReflectorReader } from '../reflection/reflector_reader';
import { Injectable } from '../di/metadata';

@Injectable()
export class ComponentResolver {
  constructor(private _reflector: ReflectorReader = reflector) { }

  /**
   * Resolve the metadata of a Component.
   *
   * @param {ClassType<any>} type component type
   * @param {boolean} [throwIfNotFound=true]
   * @returns component metadata
   * @memberOf ComponentResolver
   */
  resolve(type: ClassType<any>, throwIfNotFound = true) {
    const componentMeta: Component =
      ListWrapper.findLast(this._reflector.annotations(type), obj => obj instanceof Component);
    if (componentMeta) {
      return componentMeta;
    } else {
      if (throwIfNotFound) {
        throw new Error(`No Component metadata found for '${stringify(type)}'.`);
      }
      return null;
    }
  }
}
