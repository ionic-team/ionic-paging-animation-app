import {ElementRef, Injectable} from '@angular/core';
import {TapGestureRecognizer, TapGestureRecognizerOptions} from './tap-gesture-recognizer';

@Injectable()
export class TapGestureRecognizerProvider {
  constructor() {
  }

  getGestureRecognizer(elementRef: ElementRef, options: TapGestureRecognizerOptions) {
    return new TapGestureRecognizer(elementRef, options);
  }
}
