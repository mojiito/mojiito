export class BaseError extends Error {
  /** @internal **/
  _nativeError: Error;

  constructor(message: string) {
    super(message);
    // Errors don't use current this, instead they create a new instance.
    // We have to do forward all of our api to the nativeInstance.
    const nativeError = new Error(message) as any as Error;
    this._nativeError = nativeError;
  }

  get message() { return this._nativeError.message; }
  set message(message) { this._nativeError.message = message; }
  get name() { return this._nativeError.name; }
  get stack() { return (this._nativeError as any).stack; }
  set stack(value) { (this._nativeError as any).stack = value; }
  toString() { return this._nativeError.toString(); }
}

export class WrappedError extends BaseError {
  originalError: any;

  constructor(message: string, error: any) {
    super(`${message} caused by: ${error instanceof Error ? error.message : error}`);
    this.originalError = error;
  }

  get stack() {
    return ((this.originalError instanceof Error ? this.originalError : this._nativeError) as any)
      .stack;
  }
}

export class NotImplementedError extends BaseError {
  constructor() {
    super(`Not yet implemented"`);
  }
}
