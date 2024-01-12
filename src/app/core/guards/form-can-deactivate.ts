import { NgForm, FormGroup } from "@angular/forms";
import { ComponentCanDeactivate } from "./component-can-deactivate";

export abstract class FormCanDeactivate extends ComponentCanDeactivate {
  pageValid: any;
  abstract get editSaveForm(): FormGroup;

  public canDeactivate(): any {
    return this.editSaveForm.dirty;
  }

}
