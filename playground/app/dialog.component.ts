import { Component, ElementRef } from 'mojiito-core';

@Component({
  selector: 'dialog'
})
export class DialogComponent {

  constructor(private elementRef: ElementRef) {
    console.log(elementRef.nativeElement);
  }

}
