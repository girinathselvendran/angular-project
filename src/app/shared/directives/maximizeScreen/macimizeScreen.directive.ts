import { Directive, ElementRef, Renderer2 } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
@Directive({
  selector: "[maximize]",
  exportAs: "maximize" // <-- Make not of this here
})
export class MaximizeScreenDirective {
  private isMaximizedSubject = new BehaviorSubject(false);
  isMaximized$ = this.isMaximizedSubject.pipe();
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  toggle() {
    this.isMaximizedSubject?.getValue() ? this.minimize() : this.maximize();
  }
  maximize() {
    if (this.el) {
      this.isMaximizedSubject.next(true);
      

      this.renderer.addClass(this.el.nativeElement, "fullscreen");
      this.renderer.addClass(this.el.nativeElement, "p-accordion-div")
    }
  }
  minimize() {
    if (this.el) {
      this.isMaximizedSubject.next(false);
      this.renderer.removeClass(this.el.nativeElement, "fullscreen");
      this.renderer.removeClass(this.el.nativeElement, "p-accordion-div")

    }
  }
}
