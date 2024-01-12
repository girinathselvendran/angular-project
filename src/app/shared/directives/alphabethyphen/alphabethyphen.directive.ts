
import { Directive, ElementRef, HostListener } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Directive({
    selector: '[alphabethyphen]'
})
export class AlphabetHyphenDirective {
    private regex = new RegExp(/^[A-Za-z0-9- ]*$/);
    private specialKeys = ['Delete', 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Control'];

    constructor(private el: ElementRef, public notificationService: NotificationService) {}

    @HostListener('keydown', ['$event'])
    onKeyDown(e: KeyboardEvent) {
        if (this.specialKeys.indexOf(e.key) > -1 || // Allow: navigation keys, Ctrl/Command+A/C/V/X
            (e.key === 'a' && e.ctrlKey) || 
            (e.key === 'c' && e.ctrlKey) ||
            (e.key === 'v' && e.ctrlKey) ||
            (e.key === 'x' && e.ctrlKey)) {
            return;
        }

        const current: string = this.el.nativeElement.value;
        const next: string = current.concat(e.key);

        if (next && !String(next).match(this.regex)) {
            e.preventDefault(); // Use 'e' instead of 'event'
        }
    }

    @HostListener('paste', ['$event'])
    onPaste(e: ClipboardEvent) {
        e.preventDefault();
        let pastedInput = e.clipboardData?.getData('text/plain');

        if (pastedInput && !String(pastedInput).match(this.regex)) {
            e.preventDefault();
            pastedInput = pastedInput.replace(this.regex, ''); // Replace with allowed characters only
        }

        document.execCommand('insertText', false, pastedInput);
    }
}
