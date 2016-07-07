import {Component, ElementRef, ViewChild} from '@angular/core';
//import {animate, state, style, transition, trigger} from '@angular/core';
import {Animation, NavController} from 'ionic-angular';

import {DragGestureRecognizerProvider} from '../utils/gestures/drag-gesture-recognizer-provider';
import {GestureDirection} from '../utils/gestures/gesture-direction';

import {PageOne} from './one';

@Component({
  template: `
  <ion-content #content padding class="content" text-center>
    <!--<div class="paged-content" [ngSwitch]="currentIndex">
      <icon-content *ngSwitchCase="1" title="Framework" iconName="ionic" bodyContent="Hands down the best way to build high performance, cross-platform apps that can run on any screen! 100% free and open-source forever. Available under the MIT license."></icon-content>
      <icon-content *ngSwitchCase="2" title="Cloud" iconName="ionic" bodyContent="Ionic Cloud is a suite of web services that make building, deploying, prototyping and scaling apps easy! 100% free to get started!"></icon-content>
      <icon-content *ngSwitchCase="3" title="Enterprise" iconName="ionic" bodyContent="The same framework you know and love, with direct access to the Ionic team, priority hot fixes, support SLAs, and more!"></icon-content>
    </div>-->
    <div class="paged-content"></div>
    <div class="paging-control" #pagingControl>
      <div class="paging-circle" #pagingOne>
        <div class="inner"></div>
      </div>
      <div class="paging-circle" #pagingTwo>
        <div class="inner" style="opacity: 0.0"></div>
      </div>
      <div class="paging-circle" #pagingThree>
        <div class="inner" style="opacity: 0.0"></div>
      </div>
    </div>
  </ion-content>
  `
})
export class LandingPage {

  private rootPage: any = PageOne;
  @ViewChild("content", {read: ElementRef}) elementRef: ElementRef;
  @ViewChild("pagingControl") pagingControl: ElementRef;
  @ViewChild("pagingOne") pagingOne: ElementRef;
  @ViewChild("pagingTwo") pagingTwo: ElementRef;
  @ViewChild("pagingThree") pagingThree: ElementRef;

  private currentPagingOffset: number = 0;
  private currentIndex: number = MIN_INDEX;

  constructor(private dragGestureRecognizerProvider: DragGestureRecognizerProvider) {
  }

  ionViewDidEnter(){
    this.processPageChange(null, this.pagingOne, false);
    let dragRecognizer = this.dragGestureRecognizerProvider.getGestureRecognizer(this.elementRef, {threshold: 10, direction: GestureDirection.HORIZONTAL});
    dragRecognizer.listen();
    dragRecognizer.onPanStart.subscribe( event => { this.handleSwipe(event) });
  }

  handleSwipe(event:HammerInput){
    if ( event.direction === GestureDirection.LEFT ) {
      if ( this.currentIndex < MAX_INDEX ){
        let currentPagingElement = this.getPagingElementForIndex(this.currentIndex);
        this.currentIndex++;
        let futurePagingElement = this.getPagingElementForIndex(this.currentIndex);
        this.processPageChange(currentPagingElement, futurePagingElement);
      }
    }
    else {
      if ( this.currentIndex > MIN_INDEX ) {
        let currentPagingElement = this.getPagingElementForIndex(this.currentIndex);
        this.currentIndex--;
        let futurePagingElement = this.getPagingElementForIndex(this.currentIndex);
        this.processPageChange(currentPagingElement, futurePagingElement);
      }
    }
  }

  processPageChange(currentSelectedPagingElement: ElementRef, futureSelectedPagingElement: ElementRef, animate: boolean = true) {
    let existingOffset = this.currentPagingOffset;
    this.currentPagingOffset = futureSelectedPagingElement.nativeElement.offsetLeft + futureSelectedPagingElement.nativeElement.clientWidth/2;
    this.animatePagingControl(existingOffset, this.currentPagingOffset, currentSelectedPagingElement, futureSelectedPagingElement, this.pagingControl, animate);
  }

  animatePagingControl(currentOffset: number, futureOffset: number, currentSelectedPagingElement: ElementRef, futureselectedPagingElement: ElementRef, pagingControl: ElementRef, animate: boolean) {
    let currentPosition = pagingControl.nativeElement.clientWidth/2 - currentOffset;
    let futurePosition = pagingControl.nativeElement.clientWidth/2 - futureOffset;
    let animation = new Animation(pagingControl.nativeElement, {renderDelay: 0});
    animation.fromTo(`translateX`, `${currentPosition}px`, `${futurePosition}px`);
    if ( animate ) {
      animation.duration(150);
    }

    if ( currentSelectedPagingElement ) {
      let currentPagingElementAnimation = new Animation(currentSelectedPagingElement.nativeElement, {renderDelay: 0});
      currentPagingElementAnimation.after.removeClass("active");
      //currentPagingElementAnimation.fromTo('width', `${60}px`, `${30}px`);
      //currentPagingElementAnimation.fromTo('height', `${60}px`, `${30}px`);
      animation.add(currentPagingElementAnimation);

      let innerCurrentElement = currentSelectedPagingElement.nativeElement.querySelector(".inner");
      let innerCurrentElementAnimation = new Animation(innerCurrentElement, {renderDelay: 0});
      innerCurrentElementAnimation.fromTo('opacity', '1.0', '0.0');
      animation.add(innerCurrentElementAnimation);
    }

    if ( futureselectedPagingElement ) {
      let futurePagingElementAnimation = new Animation(futureselectedPagingElement.nativeElement, {renderDelay: 0});
      futurePagingElementAnimation.after.addClass("active");
      //futurePagingElementAnimation.fromTo('width', `${30}px`, `${60}px`);
      //futurePagingElementAnimation.fromTo('height', `${30}px`, `${60}px`);
      //futurePagingElementAnimation.fromTo('scale', '1.0', '2.0', true);
      animation.add(futurePagingElementAnimation);

      let innerFutureElement = futureselectedPagingElement.nativeElement.querySelector(".inner");
      let innerFutureElementAnimation = new Animation(innerFutureElement, {renderDelay: 0});
      innerFutureElementAnimation.fromTo('opacity', '0.01', '1.0');
      animation.add(innerFutureElementAnimation);
    }

    //animation.play();
  }

  getPagingElementForIndex(index:number): ElementRef {
    if ( index === MIN_INDEX ) {
      return this.pagingOne;
    }
    else if ( index === 2 ) {
      return this.pagingTwo;
    }
    else if ( index === MAX_INDEX ) {
      return this.pagingThree;
    }
  }
}

const MIN_INDEX = 1;
const MAX_INDEX = 3;
