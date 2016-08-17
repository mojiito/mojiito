import { Injector, Injectable, Inject, Component, Output, Input, bootstrap, Provider, ElementRef, HostElement, EventEmitter } from '../dist';

console.time('startUp');


@Component({ selector: '[todo-app]' })
class TodoApp {

    private text = '';
    private interable = [1, 2];

    constructor() { }
    
    onButtonClick(event: MouseEvent) {
        console.log('clicked');
    }

    now() {
        return Date.now();
    }
}
bootstrap(TodoApp);

console.timeEnd('startUp');
