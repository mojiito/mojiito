import { assert } from 'mojito/debug';

import { CoreObject, set, get } from 'mojito/core';

import { Application } from 'mojito/runtime';


//assert(false, 'test');

//var app = new Application('xx'); 
//console.log(app);
var x = new CoreObject({});
x.set('y', 'test');
console.log(x);
class X{
  constructor () {
    console.log('XXX');
  }
}

// new X();