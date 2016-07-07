import {Component, ElementRef, EventEmitter, Input, NgZone, Output, QueryList, SimpleChange, ViewChild, ViewChildren} from '@angular/core';
import {Animation} from 'ionic-angular';

import {ANIMATION_DURATION} from '../utils/constants';

@Component({
  selector: `paging-component`,
  template: `
    <div class="paging-container" #container [style.opacity]="initialized ? 1.0 : 0.0">
      <div *ngFor="let pageObject of pages; let i = index">
        <div class="paging-circle-wrapper" #pagingCircleWrapperElements>
          <div class="paging-circle">
            <div class="inner-circle">
              <ion-icon [name]="pageObject.iconName" class="paging-icon" [class.blue-text]="i === 0" [class.green-text]="i === 1" [class.purple-text]="i === 2"></ion-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PagingComponent {
  @Input() pages: PageObject[];
  @Input() selectedIndex: number;

  @Output() pageChangeStart: EventEmitter<PageChangedEvent> = new EventEmitter<PageChangedEvent>();
  @Output() pageChangeComplete: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('container', {read: ElementRef}) container: ElementRef;
  @ViewChildren('pagingCircleWrapperElements', {read: ElementRef}) queryList: QueryList<ElementRef>;

  private previousIndex: number;
  private currentAmountShiftedInPx: number = 0;
  private initialized: boolean = false;

  private numPagesHelper: any[];

  constructor(private ngZone: NgZone) {
  }

  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    let self = this;
    let change = changes['selectedIndex'];
    if ( change ) {
      this.previousIndex = change.previousValue;
      // start animation logic
      if ( this.initialized ) {
        let callback = () => {
          self.pageChangeComplete.emit(null);
        };
        this.selectedIndexChanged(change.currentValue, callback, true);
      }
    }

  }

  ngAfterViewInit(){
    // size isn't set yet, so add a small timeout
    setTimeout( () => {
      let callback = () => {
        this.ngZone.run( () => {
          this.initialized = true;
        });
      };
      this.selectedIndexChanged(this.selectedIndex, callback, false);
    }, 25);
  }

  selectedIndexChanged(newIndex: number, callback: () => any, doAnimation: boolean = true){
    let centerPoint = this.container.nativeElement.clientWidth/2;
    let pagingCircleWrapperElements = this.queryList.toArray();
    let selectedItemCenterPoint = pagingCircleWrapperElements[newIndex - 1].nativeElement.offsetLeft + (pagingCircleWrapperElements[newIndex - 1].nativeElement.clientWidth/2) ;
    let previousDistanceNeededToMove = this.currentAmountShiftedInPx;
    this.currentAmountShiftedInPx = centerPoint - selectedItemCenterPoint;
    let parentAnimation = new Animation(this.container.nativeElement);
    for ( let i = 0; i < pagingCircleWrapperElements.length; i++ ) {
      let pagingCircleWrapperRef = pagingCircleWrapperElements[i];
      let childAnimation = this.buildChildAnimation(newIndex, i, pagingCircleWrapperRef, previousDistanceNeededToMove, this.currentAmountShiftedInPx);
      parentAnimation.add(childAnimation);
    }
    if ( doAnimation ){
        parentAnimation.duration(ANIMATION_DURATION);
    }
    if ( callback ){
      parentAnimation.onFinish(callback);
    }
    parentAnimation.play();
  }

  buildChildAnimation(selectedIndex: number, currentIndex:number, pagingCircleWrapperRef:ElementRef, originalOffset:number, newOffset:number){
    let animation = new Animation(pagingCircleWrapperRef.nativeElement);
    let circleElement = <HTMLElement> pagingCircleWrapperRef.nativeElement.children[0];
    let innerCircleElement = circleElement.children[0];
    let circleAnimation = new Animation(circleElement);
    let innerCircleAnimation = new Animation(innerCircleElement);
    if ( currentIndex === (selectedIndex - 1) ){
      circleAnimation.before.addClass("selected");
      circleAnimation.before.removeClass("inactive");
      innerCircleAnimation.fromTo('opacity', '0.0', '1.0');
      circleAnimation.fromTo('height', `${SMALL_CIRCLE_DIAMETER}px`, `${LARGE_CIRCLE_DIAMETER}px`);
      circleAnimation.fromTo('width', `${SMALL_CIRCLE_DIAMETER}px`, `${LARGE_CIRCLE_DIAMETER}px`);
      this.pageChangeStart.emit({
        rect: circleElement.getBoundingClientRect(),
        originalOffset: originalOffset,
        newOffset: newOffset,
        diameter: LARGE_CIRCLE_DIAMETER
      });
    } else {
      circleAnimation.before.addClass("inactive");
      circleAnimation.before.removeClass("selected");
      if ( currentIndex === (this.previousIndex - 1) ){
        innerCircleAnimation.fromTo('opacity', '1.0', '0.0');
        circleAnimation.fromTo('height', `${LARGE_CIRCLE_DIAMETER}px`, `${SMALL_CIRCLE_DIAMETER}px`);
        circleAnimation.fromTo('width', `${LARGE_CIRCLE_DIAMETER}px`, `${SMALL_CIRCLE_DIAMETER}px`);
      }
    }
    animation.fromTo(`translateX`, `${originalOffset}px`, `${newOffset}px`);
    animation.add(circleAnimation);
    animation.add(innerCircleAnimation);
    return animation;
  }
}

export interface PageObject {
  iconName?: string;
}

export interface PageChangedEvent {
  rect: any,
  originalOffset: number,
  newOffset: number,
  diameter: number
}

const MARGIN = 10;

const SMALL_CIRCLE_DIAMETER = 20;
const LARGE_CIRCLE_DIAMETER = 40;

const BLUE_CLASS = "blue-text";
const GREEN_CLASS = "green-text";
const PURPLE_CLASS = "purple-text";
