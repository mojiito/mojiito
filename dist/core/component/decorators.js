"use strict";
var decorators_1 = require('../decorators/decorators');
var metadata_1 = require('./metadata');
exports.Component = decorators_1.createClassDecorator(metadata_1.ComponentMetadata);
exports.Input = decorators_1.createPropertyDecoratory(metadata_1.InputMetadata);
exports.Output = decorators_1.createPropertyDecoratory(metadata_1.OutputMetadata);
//# sourceMappingURL=decorators.js.map