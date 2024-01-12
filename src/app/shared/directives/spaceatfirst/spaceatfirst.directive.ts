import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
} from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Directive({
  selector: '[spaceatfirst]',
})
export class SpaceAtFirstDirective {
  private regex = new RegExp(/^[A-Za-z0-9-]*$/);

  private specialKeys = [
    'Delete',
    'Backspace',
    'Tab',
    'End',
    'Home',
    'ArrowLeft',
    'ArrowRight',
    'Control',
  ];

  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: any) {
    const current: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const space = this.el.nativeElement.code;
    const nextt: string = current.concat(event.key);
    const next: string = current.concat(event.key);
    if (position === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }
  // @HostListener('paste', ['$event'])
  //     onPaste(event:any) {
  //         event.preventDefault();
  //         let pastedInput;
  //         pastedInput = event.clipboardData.getData('text/plain');
  //         if (pastedInput && !String(pastedInput).match(this.regex)) {
  //             event.preventDefault();
  //             event.clipboardData.getData('text/plain').replace(pastedInput, '');
  //         } else {
  //             document.execCommand('insertText', false, pastedInput);
  //         }
  //         //
  // }
  @HostListener('paste', ['$event'])
  onPaste(event: any) {
    event.preventDefault();
    let pastedInput = event.clipboardData.getData('text/plain');

    // Remove leading whitespace (spaces, tabs, etc.)
    pastedInput = pastedInput.replace(/^\s+/, '');

    // Insert the modified text
    document.execCommand('insertText', false, pastedInput);
  }
}
