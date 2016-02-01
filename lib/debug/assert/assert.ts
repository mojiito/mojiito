/**
 * Writes an error message to the console if the assertion is false. 
 * If the assertion is true, nothing happens.
 * 
 * @param  {boolean} assertion
 * @param  {string} message
 * @returns void
 */
export default function assert(assertion: boolean, message: string, ErrorType?: ErrorConstructor): void {
    let CustomError = ErrorType ? ErrorType : Error;
    if (!assertion) {
        throw new CustomError('Assertion failed: ' + message);
    }
}