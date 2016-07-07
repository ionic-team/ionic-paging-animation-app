import {Component, ElementRef, ViewChild} from '@angular/core';
import {Animation, NavController} from 'ionic-angular';

import {DragGestureRecognizerProvider} from '../utils/gestures/drag-gesture-recognizer-provider';
import {GestureDirection} from '../utils/gestures/gesture-direction';

import {BodyContent} from './body-content';
import {PagingComponent, PageObject} from './paging-component';

@Component({
  directives: [BodyContent, PagingComponent],
  template: `
  <ion-content #content class="content" text-center>
    <body-content [selectedIndex]="currentIndex"></body-content>
    <paging-component [pages]="pages" [selectedIndex]="currentIndex" (pageChangeComplete)="pageChangeComplete()"></paging-component>
  </ion-content>
  `
})
export class LandingPage {

  @ViewChild("content", {read: ElementRef}) elementRef: ElementRef;

  private pages: PageObject[];
  private currentIndex: number = MIN_INDEX;

  constructor(private dragGestureRecognizerProvider: DragGestureRecognizerProvider) {
  }

  ionViewWillEnter(){
    let tempPages: PageObject[] = [];
    tempPages.push({iconName: "ionic"});
    tempPages.push({iconName: "cloud-outline"});
    tempPages.push({iconName: "ionitron"});
    this.pages = tempPages;
    this.pageChangeComplete();
  }

  ionViewDidEnter(){
    let dragRecognizer = this.dragGestureRecognizerProvider.getGestureRecognizer(this.elementRef, {threshold: 10, direction: GestureDirection.HORIZONTAL});
    dragRecognizer.listen();
    dragRecognizer.onPanStart.subscribe( event => { this.handleSwipe(event) });
  }

  handleSwipe(event:HammerInput){
    if ( event.direction === GestureDirection.LEFT ) {
      if ( this.currentIndex < MAX_INDEX) {
        this.currentIndex++;
      }
    }
    else if ( this.currentIndex > MIN_INDEX ) {
      this.currentIndex--;
    }
  }

  pageChangeComplete(){
    let element = <HTMLElement> this.elementRef.nativeElement;
    if ( this.currentIndex === 1 ){
      element.classList.add(BLUE_CLASS);
      element.classList.remove(GREEN_CLASS);
      element.classList.remove(PURPLE_CLASS);
    }
    else if ( this.currentIndex === 2 ){
      element.classList.remove(BLUE_CLASS);
      element.classList.add(GREEN_CLASS);
      element.classList.remove(PURPLE_CLASS);
    }
    else if ( this.currentIndex === 3 ){
      element.classList.remove(BLUE_CLASS);
      element.classList.remove(GREEN_CLASS);
      element.classList.add(PURPLE_CLASS);
    }
  }
}

const MIN_INDEX = 1;
const MAX_INDEX = 3;

const BLUE_CLASS = "blue";
const GREEN_CLASS = "green";
const PURPLE_CLASS = "purple";
