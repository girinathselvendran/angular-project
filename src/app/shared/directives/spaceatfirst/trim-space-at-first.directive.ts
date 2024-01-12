import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[saTrimSpaceAtFirst]'
})
export class TrimSpaceAtFirstDirective {

    constructor(private el: ElementRef) {
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event:any) {
        const current: string = this.el.nativeElement.value;
        const position = this.el.nativeElement.selectionStart;
        const space = this.el.nativeElement.code;
        const nextt: string = current.concat(event.key);
        const next: string = current.concat(event.key);
        if (position === 0 &&  event.code === 'Space'){
            event.preventDefault();
         }
    }

}
