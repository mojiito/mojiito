"use strict";
var decorators_1 = require('../decorators/decorators');
var metadata_1 = require('./metadata');
exports.Injectable = decorators_1.createClassDecorator(metadata_1.InjectableMetadata);
exports.Inject = decorators_1.createParameterDecorator(metadata_1.InjectMetadata);
//# sourceMappingURL=decorators.js.map