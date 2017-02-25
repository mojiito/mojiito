import { Component } from 'mojiito-core';

import { DialogComponent } from './dialog.component';

@Component({
  selector: 'body',
  components: [ DialogComponent ]
})
export class AppComponent {
  constructor() {
    console.log('init');
  }
}
