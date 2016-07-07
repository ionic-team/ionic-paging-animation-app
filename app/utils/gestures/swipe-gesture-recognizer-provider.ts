import {ElementRef, Injectable} from '@angular/core';
import {SwipeGestureRecognizer, SwipeGestureRecognizerOptions} from './swipe-gesture-recognizer';

@Injectable()
export class SwipeGestureRecognizerProvider {
  constructor() {
  }

  getGestureRecognizer(elementRef: ElementRef, options: SwipeGestureRecognizerOptions) {
    return new SwipeGestureRecognizer(elementRef, options);
  }
}
