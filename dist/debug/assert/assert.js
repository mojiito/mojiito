"use strict";
/**
 * Writes an error message to the console if the assertion is false.
 * If the assertion is true, nothing happens.
 *
 * @param  {boolean} assertion
 * @param  {string} message
 * @returns void
 */
function assert(assertion, message, ErrorType) {
    var CustomError = ErrorType ? ErrorType : Error;
    if (!assertion) {
        throw new CustomError('Assertion failed: ' + message);
    }
}
exports.assert = assert;
//# sourceMappingURL=assert.js.map