import { BaseError } from '../facade';
import { stringify } from '../facade';
import { ClassType } from '../type';

export class PlatformAlreadyExistsError extends BaseError {
  constructor() {
    super(`A platform already exists. Destroy it first before creating this one.`);
  }
}
