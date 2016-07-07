import {ElementRef, EventEmitter} from '@angular/core';
import * as hammer from 'hammerjs';

import {GestureDirection} from './gesture-direction';
import {GestureRecognizer} from './gesture-recognizer';

const DEFAULT_THRESHOLD: number = 1;

export class DragGestureRecognizer extends GestureRecognizer {

  onPanStart: EventEmitter<HammerInput>;
  onPanMove: EventEmitter<HammerInput>;
  onPanEnd: EventEmitter<HammerInput>;

  private _onPanStart: (event: HammerInput) => void;
  private _onPanMove: (event: HammerInput) => void;
  private _onPanEnd: (event: HammerInput) => void;

  protected self: DragGestureRecognizer;

  constructor(elementRef: ElementRef, options: DragGestureRecognizerOptions) {
    options.direction = options.direction ? options.direction : GestureDirection.ALL;
    options.threshold = options.threshold ? options.threshold : DEFAULT_THRESHOLD;
    super(elementRef, new hammer.Pan(options));
    this.onPanStart = new EventEmitter();
    this.onPanMove = new EventEmitter();
    this.onPanEnd = new EventEmitter();
    this.self = this;
  }

  listen() {
    super.listen();
    this._onPanStart = (event: HammerInput) => {
      this.onPanStart.emit(event);
    };
    this._onPanMove = (event: HammerInput) => {
      this.onPanMove.emit(event);
    };
    this._onPanEnd = (event: HammerInput) => {
      this.onPanEnd.emit(event);
    };
    this._hammerManager.on('panstart', this._onPanStart);
    this._hammerManager.on('panmove', this._onPanMove);
    this._hammerManager.on('panend', this._onPanEnd);
  }

  unlisten() {
    this._hammerManager.off('panstart', this._onPanStart);
    this._hammerManager.off('panmove', this._onPanMove);
    this._hammerManager.off('panend', this._onPanEnd);
    super.unlisten();
  }
}

export interface DragGestureRecognizerOptions {
  threshold?: number;
  direction?: GestureDirection;
};
