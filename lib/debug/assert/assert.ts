/**
 * Writes an error message to the console if the assertion is false. If the assertion is true, nothing happens.
 * @param  {boolean} assertion
 * @param  {string} message
 * @returns void
 */
export default function assert(assertion: boolean, message: string, ErrorType?: ErrorConstructor): void {
    if (console && console.assert) {
        // use native assert function
        console.assert.call(assertion, message);
    } else {
        // use polyfill
        let CustomError = ErrorType ? ErrorType : Error;
        if (!assertion) {
            try {
                // attempt to preserve the stack
                throw new CustomError('Assertion failed: ' + message);
            } catch (error) {
                setTimeout(() => {
                    throw error;
                }, 0);
            }
        }
    }
}