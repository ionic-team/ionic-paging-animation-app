import {ElementRef, Injectable} from '@angular/core';
import {PinchGestureRecognizer, PinchGestureRecognizerOptions} from './pinch-gesture-recognizer';

@Injectable()
export class PinchGestureRecognizerProvider {
  constructor() {
  }

  getGestureRecognizer(elementRef: ElementRef, options: PinchGestureRecognizerOptions) {
    return new PinchGestureRecognizer(elementRef, options);
  }
}
