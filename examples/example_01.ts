import { observes } from 'mojito/core';
import { Application, Controller } from 'mojito/runtime';


@Controller({ name: 'foo-controller' })    
class FooController {
}

@Controller({ name: 'bar-controller' })
class BarController {
}