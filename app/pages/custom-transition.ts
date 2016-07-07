import {ElementRef} from '@angular/core';
import {Animation, Transition, TransitionOptions, ViewController} from 'ionic-angular';

export const TRANSITION_IN_KEY: string = 'pageEnter';
export const TRANSITION_OUT_KEY: string = 'pageLeave';

export class PagingExampleInTransition extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);

    // DOM READS
    let enteringElement = <HTMLElement> enteringView.pageRef().nativeElement;
    let exitingElement = <HTMLElement> leavingView.pageRef().nativeElement;
    let pagingControl = <HTMLElement> enteringElement.querySelector(".paging-control");
    let newActivePagingElement = <HTMLElement> enteringElement.querySelector(".paging-circle.active");


    // do some math
    let pagingControlCenter = pagingControl.clientWidth / 2;
    let newActivePagingElementCenter = newActivePagingElement.offsetLeft + newActivePagingElement.clientWidth/2;
    let activePagingElementAnimation = new Animation(newActivePagingElement);
    activePagingElementAnimation.fromTo(`translateX`, `${newActivePagingElementCenter}px`, `${pagingControlCenter - newActivePagingElementCenter}px`);


    this.element(enteringView.pageRef()).easing('ease').duration(100)
      .before.addClass('show-page')
      .add(activePagingElementAnimation);
  }
}
export class PagingExampleOutTransition extends Transition {
  constructor(enteringView: ViewController, leavingView: ViewController, opts: TransitionOptions) {
    super(enteringView, leavingView, opts);

    console.log("Exit Transition");

    this.element(enteringView.pageRef()).easing('ease').duration(10)
      .before.addClass('show-page');
  }
}

Transition.register(TRANSITION_IN_KEY, PagingExampleInTransition);
Transition.register(TRANSITION_OUT_KEY, PagingExampleOutTransition);
