import {Component, ViewChild} from '@angular/core';

import {BodyContent} from './body-content';
import {AnimationReadyEvent, PagingComponent, PageObject} from './paging-component';

@Component({
  directives: [BodyContent, PagingComponent],
  template: `
  <ion-content #content class="content" text-center
    [class.blue]="activeIndex === 0"
    [class.green]="activeIndex === 1"
    [class.purple]="activeIndex === 2"
    (swipeleft)="swipeLeftToRight()" (swiperight)="swipeRightToLeft()">
    <body-content [selectedIndex]="activeIndex" #bodyContent></body-content>
    <paging-component [pages]="pages" [selectedIndex]="nextIndex" (animationReady)="pageChangeAnimationReady($event)"></paging-component>
  </ion-content>
  `
})
export class LandingPage {

  @ViewChild('bodyContent') bodyContent: BodyContent;
  private pages: PageObject[];

  private activeIndex: number = 0;
  private nextIndex: number = 0;

  constructor() {
  }

  ionViewWillEnter() {
    let tempPages: PageObject[] = [];
    tempPages.push({iconName: 'ionic'});
    tempPages.push({iconName: 'cloud-outline'});
    tempPages.push({iconName: 'ionitron'});
    this.pages = tempPages;
    this.pageChangeAnimationReady();
  }

  swipeLeftToRight() {
    if ( this.nextIndex < this.pages.length - 1 ) {
      this.nextIndex++;
    }
  }

  swipeRightToLeft() {
    if ( this.nextIndex > 0 ) {
      this.nextIndex--;
    }
  }

  pageChangeAnimationReady(event: AnimationReadyEvent = { animation: null}) {
    this.bodyContent.processTransition(this.activeIndex, this.nextIndex, event.animation).then( () => {
      this.activeIndex = this.nextIndex;
    });
  }
}
