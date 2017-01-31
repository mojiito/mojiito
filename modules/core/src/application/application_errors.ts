import { BaseError } from '../error';
import { stringify } from '../utils/lang';
import { ClassType } from '../utils/facade';

export class NoComponentsOrFactoriesProvidedError extends BaseError {
  constructor() {
    super(`No components or factories have been provided to bootstrap the application.`);
  }
}

export class InvalidComponentTypeError extends BaseError {
  constructor(type: any) {
    super(`Invalid component type "${stringify(type)}" provided to bootstrap the application!` +
      ` Make sure you have provided a class`);
  }
}

export class NoMetadataFoundError extends BaseError {
  constructor(classType: ClassType<any>) {
    super(`No Metadata was found on the component class "${stringify(classType)}"`);
  }
}

export class ComponentAlreadyFoundError extends BaseError {
  constructor(classType: ClassType<any>) {
    super(`The component "${stringify(classType)}" found twice or more in the provided array to ` +
      `bootstrap the application`);
  }
}

export class NotYetBootstrappedError extends BaseError {
  constructor(methodName: string) {
    super(`You have bootstrap the application first before calling the "${methodName}" method`);
  }
}
