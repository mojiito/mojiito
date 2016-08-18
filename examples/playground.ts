import { Injector, Injectable, Inject, Component, Output, Input, bootstrap, Provider, ElementRef, HostElement, EventEmitter } from '../dist';

console.time('startUp');


@Component({ selector: '[todo-app]' })
class TodoApp {

    private text: string;
    private interable = [1, 2];

    constructor() {
        this.text = '';
    }

    onButtonClick(event: MouseEvent) {
        console.log('clicked');
    }
}
bootstrap(TodoApp);

console.timeEnd('startUp');
