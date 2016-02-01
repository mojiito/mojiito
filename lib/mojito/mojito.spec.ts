/// <reference path="../../typings/main.d.ts" />

import {Mojito} from './mojito';
describe('Mojito',() => {
  it('should test anything', () => {
    expect('x').toEqual('x');
  })
  it('should test ', () => {
    let mojito = new Mojito();
    expect(mojito.upperCaseTest('test')).toEqual('TEST');
  })
})