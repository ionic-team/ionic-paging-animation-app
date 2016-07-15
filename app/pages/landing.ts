import {Component} from '@angular/core';

import {BodyContent} from './body-content';
import {PagingComponent, PageObject} from './paging-component';

@Component({
  directives: [BodyContent, PagingComponent],
  template: `
  <ion-content #content class="content" text-center
    [class.blue]="activeIndex === 0"
    [class.green]="activeIndex === 1"
    [class.purple]="activeIndex === 2"
    (swipeleft)="swipeLeftToRight()" (swiperight)="swipeRightToLeft()">
    <body-content [selectedIndex]="nextIndex"></body-content>
    <paging-component [pages]="pages" [selectedIndex]="nextIndex" (pageChangeComplete)="pageChangeComplete()"></paging-component>
  </ion-content>
  `
})
export class LandingPage {

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
    this.pageChangeComplete();
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

  pageChangeComplete() {
    this.activeIndex = this.nextIndex;
  }
}
