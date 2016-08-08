"use strict";
function getClassName(klass) {
    return klass.name ? klass.name : /^function\s+([\w\$]+)\s*\(/.exec(this.toString())[1];
}
exports.getClassName = getClassName;
function isClassInstance(instance) {
    return typeof instance === 'object' && !!instance['constructor'];
}
exports.isClassInstance = isClassInstance;
//# sourceMappingURL=class.js.map