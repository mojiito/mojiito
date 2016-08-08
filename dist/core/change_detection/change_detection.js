"use strict";
var iterable_1 = require('./differs/iterable');
exports.IterableDiffer = iterable_1.IterableDiffer;
exports.IterableDifferFactory = iterable_1.IterableDifferFactory;
var keyvalue_1 = require('./differs/keyvalue');
exports.KeyValueDiffer = keyvalue_1.KeyValueDiffer;
exports.KeyValueDifferFactory = keyvalue_1.KeyValueDifferFactory;
var change_detector_1 = require('./change_detector');
exports.ChangeDetector = change_detector_1.ChangeDetector;
var constants_1 = require('./constants');
exports.CHANGE_DETECTION_STRATEGY_VALUES = constants_1.CHANGE_DETECTION_STRATEGY_VALUES;
exports.CHANGE_DETECTOR_STATUS_VALUES = constants_1.CHANGE_DETECTOR_STATUS_VALUES;
exports.ChangeDetectionStrategy = constants_1.ChangeDetectionStrategy;
exports.ChangeDetectorStatus = constants_1.ChangeDetectorStatus;
//# sourceMappingURL=change_detection.js.map