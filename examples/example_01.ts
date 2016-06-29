import { observes } from 'mojito/core';
import { Application, Controller, bootstrap } from 'mojito/runtime';
import { DirectiveResolver, DOMParser } from 'mojito/compiler';

console.time('init');

@Controller({ selector: 'my-controller' })    
class FooController {
}

bootstrap();

console.timeEnd('init');