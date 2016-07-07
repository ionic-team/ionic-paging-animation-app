import * as hammer from 'hammerjs';
import {ElementRef} from '@angular/core';

export class GestureRecognizer {
    protected _listening: boolean;
    protected _hammerManager: HammerManager;

    constructor(protected element: ElementRef, protected recognizer: AttrRecognizer) {
    }

    listen() {
      if (! this._listening ) {
        this._hammerManager = new hammer.Manager(this.element.nativeElement);
        this._hammerManager.add(this.recognizer);
      }
      this._listening = true;
    }

    unlisten() {
      this._listening = false;
      this._hammerManager.remove(this.recognizer);
      this.recognizer = null;
      this._hammerManager = null;
    }
}
