import { Directive, ElementRef, HostListener, Input, OnChanges } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Directive({
    selector: '[alphanumerichypenunderscore]'
})

export class AlphaNumericHypenUnderscore {
    private regex = new RegExp(/^[A-Za-z0-9_-]*$/);


    private specialKeys = ['Delete', 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Control'];

    constructor(private el: ElementRef, public notificationService: NotificationService) {
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(e: KeyboardEvent) {
        if (this.specialKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
            (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
            (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
            (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
            (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
            (e.key === 'a' && e.metaKey === true) || // Allow: Cmd+A (Mac)
            (e.key === 'c' && e.metaKey === true) || // Allow: Cmd+C (Mac)
            (e.key === 'v' && e.metaKey === true) || // Allow: Cmd+V (Mac)
            (e.key === 'x' && e.metaKey === true)) {
            return;
        }

        // Do not use event.keycode this is deprecated.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        const current: string = this.el.nativeElement.value;
        const position = this.el.nativeElement.selectionStart;
        const nextt: string = current.concat(e.key);


        const next: string = current.concat(e.key);
        if (next && !String(next).match(this.regex)) {
            e.preventDefault();
        }

    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        event.preventDefault();
        let pastedInput;

        pastedInput = event?.clipboardData?.getData('text/plain');
        if (pastedInput && !String(pastedInput).match(this.regex)) {
            event.preventDefault();
            event?.clipboardData?.getData('text/plain').replace(pastedInput, '');
        } else {
            document.execCommand('insertText', false, pastedInput);
        }

    }

}
