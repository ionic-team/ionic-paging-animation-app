import {ElementRef, EventEmitter} from '@angular/core';
import * as hammer from 'hammerjs';

import {GestureDirection} from './gesture-direction';
import {GestureRecognizer} from './gesture-recognizer';

const DEFAULT_NUM_POINTERS: number = 1;
const DEFAULT_NUM_TAPS: number = 1;
const DEFAULT_INTERVAL: number = 300;
const DEFAULT_TIME: number = 250;
const DEFAULT_THRESHOLD: number = 2;
const DEFAULT_POSITION_THRESHOLD: number = 10;

export class TapGestureRecognizer extends GestureRecognizer {

  onTap: EventEmitter<HammerInput>;

  constructor(elementRef: ElementRef, options: TapGestureRecognizerOptions) {
    options.pointers = options.pointers ? options.pointers : DEFAULT_NUM_POINTERS;
    options.taps = options.taps ? options.taps : DEFAULT_NUM_TAPS;
    options.interval = options.interval ? options.interval : DEFAULT_INTERVAL;
    options.time = options.time ? options.time : DEFAULT_TIME;
    options.threshold = options.threshold ? options.threshold : DEFAULT_THRESHOLD;
    options.posThreshold = options.posThreshold ? options.posThreshold : DEFAULT_POSITION_THRESHOLD;
    super(elementRef, new hammer.Tap(options));
    this.onTap = new EventEmitter();
  }

  listen() {
    super.listen();
    this._hammerManager.on('tap', this._onTap);
  }

  unlisten() {
    this._hammerManager.off('tap', this._onTap);
    super.unlisten();
  }

  _onTap(event: HammerInput): void {
    this.onTap.emit(event);
  }
}

export interface TapGestureRecognizerOptions {
  pointers?: number;
  taps?: number;
  interval?: number;
  time?: number;
  threshold?: number;
  posThreshold?: number;
};
