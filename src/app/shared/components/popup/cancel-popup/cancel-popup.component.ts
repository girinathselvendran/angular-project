import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-cancel-popup',
  templateUrl: './cancel-popup.component.html',
  styleUrls: ['./cancel-popup.component.css']
})
export class CancelPopupComponent {
  @ViewChild('cancelPopup') cancelPopup: any;
  @Output() handleFormCancelSaveFn = new EventEmitter();
  @Input() popupTitle = this.translate.instant('operations.common.cancelPurchase.title.cancelPO');
  @Input() fieldTitle = this.translate.instant('operations.common.cancelPurchase.title.cancellationRemarks');
  @Input() isClearButton = true;
  cancelRemarkForm!: FormGroup;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private confirmationService: ConfirmationService,
  ){};
  ngOnInit()  {
    this.cancelRemarkForm = this.formBuilder.group({
      remarks: ['', [Validators.required]],
    });
  }
  openForm() {
    this.cancelRemarkForm.reset();
    this.cancelPopup.show();
  }
  clearForm() {
    this.cancelRemarkForm.reset();
  }
  handleFormCancelSave() {
    if (this.cancelRemarkForm.invalid) {
      this.validateAllFormFields(this.cancelRemarkForm);
      return;
    }
    const remarks = this.cancelRemarkForm.controls['remarks'].value;
    this.handleFormCancelSaveFn.emit(remarks);
  }
  cancelPopupClose() {
    if (this.cancelRemarkForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.cancelRemarkForm.reset();
          this.cancelPopup.hide();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.cancelRemarkForm.reset();
      this.cancelPopup.hide();
    }
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
