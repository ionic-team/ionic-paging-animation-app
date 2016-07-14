import {Component, ElementRef, ViewChild} from '@angular/core';
import {Animation, NavController} from 'ionic-angular';

import {DragGestureRecognizerProvider} from '../utils/gestures/drag-gesture-recognizer-provider';
import {GestureDirection} from '../utils/gestures/gesture-direction';

import {BodyContent} from './body-content';
import {PagingComponent, PageChangedEvent, PageObject, SMALL_CIRCLE_DIAMETER, LARGE_CIRCLE_DIAMETER} from './paging-component';

import {ANIMATION_DURATION} from '../utils/constants';

import {v4} from 'node-uuid';

@Component({
  directives: [BodyContent, PagingComponent],
  template: `
  <ion-content #content class="content" text-center>
    <div>The guid is: {{guid}}</div>
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
  private guid: string;

  constructor(private dragGestureRecognizerProvider: DragGestureRecognizerProvider) {
  }

  ionViewWillEnter() {
    let tempPages: PageObject[] = [];
    tempPages.push({iconName: "ionic"});
    tempPages.push({iconName: "cloud-outline"});
    tempPages.push({iconName: "ionitron"});
    this.pages = tempPages;
    this.pageChangeComplete();
    this.guid = v4();
  }

  ionViewDidEnter() {
    let dragRecognizer = this.dragGestureRecognizerProvider.getGestureRecognizer(this.elementRef, {threshold: 30, direction: GestureDirection.HORIZONTAL});
    dragRecognizer.listen();
    dragRecognizer.onPanStart.subscribe( event => { this.handleSwipe(event) });

    Promise.resolve().then( () => {
      console.log("Boom city");
    });
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
