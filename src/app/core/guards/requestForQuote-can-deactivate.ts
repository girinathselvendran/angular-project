import { FormGroup } from "@angular/forms";
import { ComponentCanDeactivate } from "./component-can-deactivate";

export abstract class RequestForQuoteFormCanDeactivate extends ComponentCanDeactivate {
  abstract get editSaveForm(): FormGroup;
  abstract get editSaveRFQPartForm(): FormGroup;

  public canDeactivate(): any {
    if (this.editSaveRFQPartForm) {
      return this.editSaveForm.dirty || this.editSaveRFQPartForm.dirty;
    } else {
      return this.editSaveForm.dirty;
    }
  }

}


