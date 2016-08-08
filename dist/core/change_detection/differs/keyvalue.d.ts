import { ChangeDetector } from '../change_detector';
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 *
 * Modified by Thomas Pink for the usage in Mojito
 */
/**
 * Factory for creating a KeyValueDiffer
 *
 * @export
 * @class DefaultKeyValueDifferFactory
 */
export declare class KeyValueDifferFactory {
    constructor();
    supports(obj: any): boolean;
    create(cdRef: ChangeDetector): KeyValueDiffer;
}
/**
 * Key-Value Differ for Objects and Maps
 *
 * @export
 * @class KeyValueDiffer
 */
export declare class KeyValueDiffer {
    private _records;
    private _mapHead;
    private _previousMapHead;
    private _changesHead;
    private _changesTail;
    private _additionsHead;
    private _additionsTail;
    private _removalsHead;
    private _removalsTail;
    isDirty: boolean;
    forEachItem(fn: (r: KeyValueChangeRecord) => void): void;
    forEachPreviousItem(fn: (r: KeyValueChangeRecord) => void): void;
    forEachChangedItem(fn: (r: KeyValueChangeRecord) => void): void;
    forEachAddedItem(fn: (r: KeyValueChangeRecord) => void): void;
    forEachRemovedItem(fn: (r: KeyValueChangeRecord) => void): void;
    diff(map: Map<any, any> | {
        [k: string]: any;
    }): KeyValueDiffer;
    onDestroy(): void;
    check(map: Map<any, any> | {
        [k: string]: any;
    }): boolean;
    /** @internal */
    _reset(): void;
    /** @internal */
    _truncate(lastRecord: KeyValueChangeRecord, record: KeyValueChangeRecord): void;
    private _maybeAddToChanges(record, newValue);
    /** @internal */
    _isInRemovals(record: KeyValueChangeRecord): boolean;
    /** @internal */
    _addToRemovals(record: KeyValueChangeRecord): void;
    /** @internal */
    _removeFromSeq(prev: KeyValueChangeRecord, record: KeyValueChangeRecord): void;
    /** @internal */
    _removeFromRemovals(record: KeyValueChangeRecord): void;
    /** @internal */
    _addToAdditions(record: KeyValueChangeRecord): void;
    /** @internal */
    _addToChanges(record: KeyValueChangeRecord): void;
    toString(): string;
    private _forEach<K, V>(obj, callback);
}
export declare class KeyValueChangeRecord {
    key: any;
    previousValue: any;
    currentValue: any;
    /** @internal */
    _nextPrevious: KeyValueChangeRecord;
    /** @internal */
    _next: KeyValueChangeRecord;
    /** @internal */
    _nextAdded: KeyValueChangeRecord;
    /** @internal */
    _nextRemoved: KeyValueChangeRecord;
    /** @internal */
    _prevRemoved: KeyValueChangeRecord;
    /** @internal */
    _nextChanged: KeyValueChangeRecord;
    constructor(key: any);
    toString(): string;
}
