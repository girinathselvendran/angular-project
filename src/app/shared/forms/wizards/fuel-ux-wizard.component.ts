import {
  Component,
  OnInit,
  ElementRef,
  EventEmitter,
  Output,
  Input
} from "@angular/core";
// import "script-loader!app/api/wizard.js";
// import * as wizard from '../../../api/wizard.js';

@Component({
  selector: "fuel-ux-wizard",
  template: `
    <div>
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class FuelUxWizardComponent implements OnInit {
  @Output() complete = new EventEmitter();

  constructor(private el: ElementRef) { }

  ngOnInit() {
    const element: any = $(this.el.nativeElement);
    const wizard = element.wizard();

    const $form = element.find("form");

    wizard.on("actionclicked.fu.wizard", (e: any, data: any) => {
      if ($form.data("validator")) {
        if (!$form.valid()) {
          $form.data("validator").focusInvalid();
          e.preventDefault();
        }
      }
    });

    wizard.on("finished.fu.wizard", (e: any, data: any) => {
      const formData: any = {};
      $form.serializeArray().forEach((field: any) => {
        formData[field.name] = field.value;
      });
      this.complete.emit(formData);
    });

    wizard.on("stepclicked.fu.wizard", (e: any, data: any) => {
    });
  }
}

