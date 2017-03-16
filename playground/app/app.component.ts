import { Component, ViewContainerRef } from 'mojiito-core';

import {Dialog, DialogComponent } from './dialog.component';
import { ButtonComponent } from './button.component';
import { DrawerComponent } from './drawer.component';

@Component({
  selector: 'body',
  components: [ DialogComponent, ButtonComponent, DrawerComponent ],
  providers: [Dialog]
})
export class AppComponent {
  constructor(container: ViewContainerRef) {
    console.log('init', container);
  }
}
