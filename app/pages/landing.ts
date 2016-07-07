import {Component, ElementRef, ViewChild} from '@angular/core';
import {Animation, NavController} from 'ionic-angular';

import {DragGestureRecognizerProvider} from '../utils/gestures/drag-gesture-recognizer-provider';
import {GestureDirection} from '../utils/gestures/gesture-direction';

import {PagingComponent, PageObject} from './paging-component';

@Component({
  directives: [PagingComponent],
  template: `
  <ion-content #content class="content" text-center>
    <div class="paged-content"></div>
    <paging-component [pages]="pages" [selectedIndex]="currentIndex" [previousIndex]="previousIndex"></paging-component>
  </ion-content>
  `
})
export class LandingPage {

  @ViewChild("content", {read: ElementRef}) elementRef: ElementRef;

  private pages: PageObject[];
  private currentIndex: number = MIN_INDEX;
  private previousIndex: number;

  constructor(private dragGestureRecognizerProvider: DragGestureRecognizerProvider) {
  }

  ionViewWillEnter(){
    let tempPages: PageObject[] = [];
    tempPages.push({iconName: "md-ionic"});
    tempPages.push({iconName: "md-ionic"});
    tempPages.push({iconName: "md-ionic"});
    this.pages = tempPages;
  }

  ionViewDidEnter(){
    let dragRecognizer = this.dragGestureRecognizerProvider.getGestureRecognizer(this.elementRef, {threshold: 10, direction: GestureDirection.HORIZONTAL});
    dragRecognizer.listen();
    dragRecognizer.onPanStart.subscribe( event => { this.handleSwipe(event) });
  }

  handleSwipe(event:HammerInput){
    if ( event.direction === GestureDirection.LEFT && this.currentIndex < MAX_INDEX ) {
      this.previousIndex = this.currentIndex;
      this.currentIndex++;
    }
    else if ( this.currentIndex > MIN_INDEX ) {
      this.previousIndex = this.currentIndex;
      this.currentIndex--;
    }
  }
}

const MIN_INDEX = 1;
const MAX_INDEX = 3;
