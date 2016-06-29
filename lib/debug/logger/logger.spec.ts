/// <reference path="../../../typings/main.d.ts" />

import { Logger, LogLevel, LogType } from './logger';

var console = {
    log: function (msg: string) {
    },
    warn: function(msg: string) {
    },
    debug: function(msg: string) {
    },
    info: function(msg: string) {
    },
    error: function(msg: string) {
    }
}

describe('Logger', () => {
    it('should exist', () => {
        expect(typeof Logger).toBe('function');
    });
    it('can create an instance', () => {
        expect(typeof new Logger(LogLevel.critical)).toBe('object');
    });
});