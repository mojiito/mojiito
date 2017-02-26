import { Component } from 'mojiito-core';

import { DialogComponent } from './dialog.component';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'body',
  components: [ DialogComponent, ButtonComponent ]
})
export class AppComponent {
  constructor() {
    console.log('init');
  }
}
