import {ElementRef, Injectable} from '@angular/core';
import {DragGestureRecognizer, DragGestureRecognizerOptions} from './drag-gesture-recognizer';

@Injectable()
export class DragGestureRecognizerProvider {
  constructor() {
  }

  getGestureRecognizer(elementRef: ElementRef, options: DragGestureRecognizerOptions) {
    return new DragGestureRecognizer(elementRef, options);
  }
}
