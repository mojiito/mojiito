# Getting Started

## Install
The latest release of Mojito can be installed using npm:     

`npm install --save git+https://github.com/mojito-js/mojito.git`    
**Note**: We will move Mojito in its own npm package soon.

## Quickstart

Create you first Component. This component is the start of your application and will be used for bootstrapping.

```typescript
import {Component} from 'mojito';

@Component({
  selector: 'body'
})
export class AppComponent {
}
```

```typescript
import {plattformBrowser} from 'mojito';
import {AppComponent} from 'app.component.ts`;

platformBrowser().bootstrapComponent(AppComponent);
```

For a better structure we recommend splitting components and the cody for bootstrapping into different files. For now we have two:

| Filename  | Description |
| ------------- | ------------- |
| `main.ts`  | Contains the method for bootstrapping the Mojito application. Needs to import the app component.  |
| `app.component.ts`  | Top level component. Used for bootstrapping the application. All other components are declared in this or a sub component  |
