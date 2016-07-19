import {Component, Input, ViewChild} from '@angular/core';
import {Animation, NavController} from 'ionic-angular';

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

  @ViewChild('nav') navController: NavController;

  processTransition(previousIndex: number, selectedIndex: number, animation: Animation) {
    if ( previousIndex > selectedIndex ) {
      // it's a pop
      return this.navController.pop({ animation: TRANSITION_OUT_KEY, ev: { animation: animation } });
    } else {
      // it's a push
      return this.navController.push(this.getPageForIndex(selectedIndex), {}, { animation: TRANSITION_IN_KEY, ev: { animation: animation } });
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
