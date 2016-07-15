import {Component, ElementRef, Input, SimpleChange, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';

import {PageOne} from './content-one';
import {PageTwo} from './content-two';
import {PageThree} from './content-three';

import {TRANSITION_IN_KEY, TRANSITION_OUT_KEY} from './body-content-transition';

@Component({
  selector: `body-content`,
  template: `
    <ion-nav [root]="rootPage" #nav class="content-nav"></ion-nav>
  `
})
export class BodyContent {

  @Input() selectedIndex: number;
  @ViewChild('nav') navController: NavController;

  private previousIndex: number;

  constructor() {
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    let change = changes['selectedIndex'];
    if ( change ) {
      this.previousIndex = change.previousValue;
      this.processTransition(this.previousIndex, change.currentValue);
    }
  }

  processTransition(previousIndex: number, selectedIndex: number) {
    if ( this.previousIndex > this.selectedIndex ) {
      // it's a pop
      this.navController.pop({animation: TRANSITION_OUT_KEY});
    } else {
      // it's a push
      this.navController.push(this.getPageForIndex(this.selectedIndex), {}, {animation: TRANSITION_IN_KEY});
    }
  }

  getPageForIndex(index: number) {
    if ( index === 0 ) {
      return PageOne;
    } else if ( index === 1 ) {
      return PageTwo;
    } else {
      return PageThree;
    }
  }
}
