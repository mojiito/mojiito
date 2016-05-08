import { CoreObject, CoreArray, CoreClass, CoreView, Meta } from './core';
import { Mojito, Application, Controller, Service, singleton, inject, injectable, register } from './runtime';
import { assert } from './debug';

@register({})
class App extends Application {
    
}