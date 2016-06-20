import { observes } from 'mojito/core';
import { Application, Controller } from 'mojito/runtime';
import { Compiler } from 'mojito/compiler';


@Controller({ name: 'foo-controller' })    
class FooController {
}

@Controller({ name: 'bar-controller' })
class BarController {
}

let compiler = new Compiler();
