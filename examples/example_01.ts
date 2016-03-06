import {assert} from 'debug/assert/assert';
import { CoreObject, set, get } from 'core';
import { Application } from 'runtime';
assert(true, 'test');

//var app = new Application('xx'); 

var x = new CoreObject({});
x.set('y', 'test');
console.log(x);
class X{
  constructor () {
    console.log('XXX');
  }
}

new X();