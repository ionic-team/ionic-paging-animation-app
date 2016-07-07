import {ElementRef, EventEmitter} from '@angular/core';
import * as hammer from 'hammerjs';

import {GestureDirection} from './gesture-direction';
import {GestureRecognizer} from './gesture-recognizer';

const DEFAULT_NUM_POINTERS: number = 1;
const DEFAULT_THRESHOLD: number = 10;
const DEFAULT_DIRECTION: GestureDirection = GestureDirection.ALL;
const DEFAULT_VELOCITY: number = 0.3;

export class SwipeGestureRecognizer extends GestureRecognizer {

  onSwipe: EventEmitter<HammerInput>;

  constructor(elementRef: ElementRef, options: SwipeGestureRecognizerOptions) {
    options.threshold = options.threshold ? options.threshold : DEFAULT_THRESHOLD;
    options.pointers = options.pointers ? options.pointers : DEFAULT_NUM_POINTERS;
    options.direction = options.direction ? options.direction : DEFAULT_DIRECTION;
    options.velocity = options.velocity ? options.velocity : DEFAULT_VELOCITY;
    super(elementRef, new hammer.Swipe(options));
    this.onSwipe = new EventEmitter();
  }

  listen() {
    super.listen();
    this._hammerManager.on('swipe', this._onSwipe);
  }

  unlisten() {
    this._hammerManager.off('swipe', this._onSwipe);
    super.unlisten();
  }

  _onSwipe(event: HammerInput): void {
    this.onSwipe.emit(event);
  }
}

export interface SwipeGestureRecognizerOptions {
  threshold?: number;
  pointers?: number;
  direction?: GestureDirection;
  velocity?: number;
};
