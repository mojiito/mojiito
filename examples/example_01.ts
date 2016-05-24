import { Application, Controller, register } from 'mojito/runtime';

@register({
    name: 'my-app'
})
class MyApp extends Application {
    
}

@register({
    name: 'foo'
})
class FooController extends Controller {
    
}

console.log(Application.targetClassList);
console.log(Controller.targetClassList);