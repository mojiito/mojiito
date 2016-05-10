import { CoreObject, set, get } from 'mojito/core';

import { Application, Controller, register } from 'mojito/runtime';

@register({
    name: 'my-app'
})
class MyApp extends Application {
}