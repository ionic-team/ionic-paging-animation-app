import {ElementRef, Injectable} from '@angular/core';
import {RotateGestureRecognizer, RotateGestureRecognizerOptions} from './rotate-gesture-recognizer';

@Injectable()
export class RotateGestureRecognizerProvider {
  constructor() {
  }

  getGestureRecognizer(elementRef: ElementRef, options: RotateGestureRecognizerOptions) {
    return new RotateGestureRecognizer(elementRef, options);
  }
}
