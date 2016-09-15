import { Injector, Injectable, Inject, Component, Output, Input, bootstrap, Provider, ElementRef, HostElement, EventEmitter, OnChanges, OnInit, OnParse, OnBeforeCheck, OnAfterCheck } from '../dist';

console.time('startUp');


@Component({ selector: '[todo-app]' })
class TodoApp {
    private test = { text: 'asfsadf' };
    constructor() {
    }

    onClick(test) {
        console.log(test, this.test);
        this.test = test;
    }
}

@Component({ selector: 'test-form' })
class TestForm implements OnInit, OnParse, OnChanges, OnBeforeCheck, OnAfterCheck {
    @Input('test') testObj;
    @Output('onClick') clickEmitter = new EventEmitter(); 
    constructor() {
    }

    onButtonClick(evt: MouseEvent) {
        asdf
        evt.preventDefault();
        console.log(this.testObj);
        this.clickEmitter.emit(this.testObj);
    }

    onInit() {
        console.debug('onInit');
    }

    onParse() {
        console.debug('onParse');
    }

    onChanges() {
        console.debug('onChanges');
    }

    onBeforeCheck() {
        console.debug('onBeforeCheck');
    }

    onAfterCheck() {
        console.debug('onAfterCheck');
    }
}

bootstrap(TodoApp);

console.timeEnd('startUp');
