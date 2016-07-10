import {Component, ElementRef, ViewChild} from '@angular/core';
import {Animation, NavController} from 'ionic-angular';

import {DragGestureRecognizerProvider} from '../utils/gestures/drag-gesture-recognizer-provider';
import {GestureDirection} from '../utils/gestures/gesture-direction';

import {BodyContent} from './body-content';
import {PagingComponent, PageChangedEvent, PageObject, SMALL_CIRCLE_DIAMETER, LARGE_CIRCLE_DIAMETER} from './paging-component';

import {ANIMATION_DURATION} from '../utils/constants';

@Component({
  directives: [BodyContent, PagingComponent],
  template: `
  <ion-content #content class="content" text-center>
    <div class="circle-animation-helper" #circleAnimationHelper></div>
    <body-content [selectedIndex]="currentIndex"></body-content>
    <paging-component [pages]="pages" [selectedIndex]="currentIndex" (pageChangeComplete)="pageChangeComplete()" [zoomCircleRef]="circleElementRef" [parentHeight]="elementRef?.nativeElement.clientHeight" [parentWidth]="elementRef?.nativeElement.clientWidth"></paging-component>
  </ion-content>
  `
})
export class LandingPage {

  @ViewChild("content", {read: ElementRef}) elementRef: ElementRef;
  @ViewChild("circleAnimationHelper", {read: ElementRef}) circleElementRef: ElementRef;

  private pages: PageObject[];
  private currentIndex: number = MIN_INDEX;

  constructor(private dragGestureRecognizerProvider: DragGestureRecognizerProvider) {
  }

  ionViewWillEnter() {
    let tempPages: PageObject[] = [];
    tempPages.push({iconName: "ionic"});
    tempPages.push({iconName: "cloud-outline"});
    tempPages.push({iconName: "ionitron"});
    this.pages = tempPages;
    this.pageChangeComplete();
  }

  ionViewDidEnter() {
    let dragRecognizer = this.dragGestureRecognizerProvider.getGestureRecognizer(this.elementRef, {threshold: 30, direction: GestureDirection.HORIZONTAL});
    dragRecognizer.listen();
    dragRecognizer.onPanStart.subscribe( event => { this.handleSwipe(event) });
  }

  handleSwipe(event:HammerInput) {
    if ( event.direction === GestureDirection.LEFT ) {
      if ( this.currentIndex < MAX_INDEX) {
        this.currentIndex++;
      }
    }
    else if ( this.currentIndex > MIN_INDEX ) {
      this.currentIndex--;
    }
  }

  pageChangeComplete() {
    let element = <HTMLElement> this.elementRef.nativeElement;
    this.updateStylesForElement(element);
  }

  pageChangeStart(event: PageChangedEvent) {
    this.updateStylesForElement(this.circleElementRef.nativeElement);
    this.doCircleAnimation(event, this.circleElementRef);
  }

  doCircleAnimation(event: PageChangedEvent, elementRef: ElementRef) {
    /*let animation = new Animation(elementRef.nativeElement);
    animation.fromTo("opacity", "0.3", "1.0", true);
    let xOffset = event.rect.left - event.newOffset - CIRCLE_ANIMATION_DIAMETER/2;
    animation.fromTo("translateX", `${event.rect.left}px`, `${event.rect.left}`, true);
    animation.fromTo("translateY", `${event.rect.top}px`, `${event.rect.top}`, true);
    animation.duration(ANIMATION_DURATION);
    animation.play();
    */

    // figure out the scale we need to expand at to cover the entire screen
    let radius = CIRCLE_ANIMATION_DIAMETER/2;
    let yRatio = this.elementRef.nativeElement.clientHeight / radius;
    let xRatio = this.elementRef.nativeElement.clientWidth / radius;
    let scale = Math.ceil(Math.max(yRatio, xRatio));

    let animation = new Animation(elementRef.nativeElement);
    let animationOriginX = event.centerX - elementRef.nativeElement.clientWidth/2;
    let animationOriginY = event.centerY - elementRef.nativeElement.clientHeight/2;
    animation.before.setStyles({'transform': `translate3d(${animationOriginX}px, ${animationOriginY}px, 0px)`, '-webkit-transform': `translate3d(${animationOriginX}px, ${animationOriginY}px, 0px)`});


    //animation.fromTo("opacity", "1.0", "1.0", true);
    //animation.fromTo("scale", `${1.0}`, `${24}`, true);
    //animation.fromTo("translateX", ``, `${event.rect.left}`);
    //animation.fromTo("translateY", `${event.rect.top}px`, `${event.rect.top}`);

    //animation.easing("ease-out");
    //animation.duration(ANIMATION_DURATION);
    animation.play();
  }

  updateStylesForElement(element:HTMLElement) {
    if ( this.currentIndex === 1 ) {
      element.classList.add(BLUE_CLASS);
      element.classList.remove(GREEN_CLASS);
      element.classList.remove(PURPLE_CLASS);
    }
    else if ( this.currentIndex === 2 ) {
      element.classList.remove(BLUE_CLASS);
      element.classList.add(GREEN_CLASS);
      element.classList.remove(PURPLE_CLASS);
    }
    else if ( this.currentIndex === 3 ) {
      element.classList.remove(BLUE_CLASS);
      element.classList.remove(GREEN_CLASS);
      element.classList.add(PURPLE_CLASS);
    }
  }
}

const CIRCLE_ANIMATION_DIAMETER = 60;

const MIN_INDEX = 1;
const MAX_INDEX = 3;

const BLUE_CLASS = "blue";
const GREEN_CLASS = "green";
const PURPLE_CLASS = "purple";
