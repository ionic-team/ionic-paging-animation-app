import {ElementRef, Injectable} from '@angular/core';
import {PressGestureRecognizer, PressGestureRecognizerOptions} from './press-gesture-recognizer';

@Injectable()
export class PressGestureRecognizerProvider {
  constructor() {
  }

  getGestureRecognizer(elementRef: ElementRef, options: PressGestureRecognizerOptions) {
    return new PressGestureRecognizer(elementRef, options);
  }
}
