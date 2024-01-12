import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/core/services';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent {
  @Input() attachmentPath: any;
  @Input() emailSubject: any;
  @Output() sendEmailFunction: any = new EventEmitter();

  submitted: any;
  emailPopup: boolean = false;
  htmlBody: any;
  currentDateTime: Date | undefined;
  emailEstimateForm!: FormGroup;
  userFirstName = this.userAuthService.getCurrentUserFirstName();
  userLastName = this.userAuthService.getCurrentUserLastName();


  constructor(
    private formBuilder: FormBuilder,
    private userAuthService: UserAuthService,
    private loaderService: NgxUiLoaderService,
    private translate: TranslateService,
    public notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.emailEstimateForm = this.formBuilder.group({
      toEmail: ['', [Validators.required, Validators.maxLength(200)]],
      ccEmail: ['', [Validators.maxLength(200)]],
      bccEmail: ['', [Validators.maxLength(200)]],
      subject: ['', [Validators.required, Validators.maxLength(100)]],
      attachment: ['', []],
      body: ['', [Validators.maxLength(500)]],
      sentBy: ['', []],
      sentOn: ['', []],
      createdBy: ['', []],
      modifiedBy: ['', []],
      fileName: ['', []],
      path: ['', []]
    });
    this.emailEstimateForm?.controls['attachment']?.disable();
  }

  changeValue() {

    this.emailEstimateForm?.controls['attachment']?.setValue(this.attachmentPath);
    this.emailEstimateForm?.controls['subject']?.setValue(this.emailSubject);
    this.emailEstimateForm?.controls['attachment']?.disable();
  }

  checkValidityAndActivateError() {
    const requiredFieldControl = this.emailEstimateForm.get('toEmail');

    if (requiredFieldControl && requiredFieldControl.invalid) {
      // Activate the error, for example:
      requiredFieldControl.markAsTouched(); // Marks the control as touched to activate the error message
      return false;
    } else {
      return true;
    }
  }


  onSubmit() {
    if (!this.checkValidityAndActivateError()) {
      return;
    } else {

      let div = document?.getElementById("messageBody")?.innerHTML;
      const tracking = {
        createdBy: this.userAuthService.getCurrentUserName(),
        modifiedBy: this.userAuthService.getCurrentUserName(),
        SentBy: this.userAuthService.getCurrentUserName(),
        MailId: this.emailEstimateForm.controls['toEmail'].value,
        fileName: this.emailEstimateForm.controls['attachment'].value,
        FirstName: this.userAuthService.getCurrentUserFirstName(),
        LastName: this.userAuthService.getCurrentUserLastName(),
        CC: this.emailEstimateForm.controls['ccEmail'].value,
        bCC: this.emailEstimateForm.controls['bccEmail'].value,
        Subject: this.emailEstimateForm.controls['subject'].value,
        Body: this.emailEstimateForm.controls['body'].value,
        resendBody: div,
        sentOn: this.currentDateTime,
        companyId: this.userAuthService.getCurrentCompanyId(),
        userFirstName: this.userFirstName,
        userLastName: this.userLastName
      };
      this.sendEmailFunction.emit(tracking)
    
    }

  }
  cancelEmailClick() {
    this.hidePoup();
  }
  hidePoup() {
    this.emailPopup = false;
  }

  get emailEstimateFormControls() { return this.emailEstimateForm.controls; }

  validateEmail(controlName: any) {
    this.emailEstimateForm.controls[controlName].setValue(this.emailEstimateForm.controls[controlName].value !== null ? this.emailEstimateForm.controls[controlName].value.replace(/\s/g, "") : null);
    const control1 = this.emailEstimateForm.controls[controlName];
    const control = this.emailEstimateForm.controls[controlName];
    const x = control.value;
    if (control.value) {
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const result = x.split(/,/);
      const dotPattern = /^(?!.*?\.\.).*?$/;
      const underScorePattern = /^(?!.*?\_\_).*?$/;
      const hiphenPattern = /^(?!.*?\-\-).*?$/;
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          if (!regex.test(result[i])) {
            if (controlName === "toEmail") {
              control1.setErrors({ pattern: true });
              return;
            }
            if (controlName === "ccEmail") {
              control1.setErrors({ pattern: true });
              return;
            }
            if (controlName === "bccEmail") {
              control1.setErrors({ pattern: true });
              return;
            }
          } else {

            const splitStrings = result[i].split("@");
            if (splitStrings.length === 2) { /*Not Allowing more than 2 @ */
              const email = splitStrings[0];
              const email1 = splitStrings[1];
              if (dotPattern.test(email) && underScorePattern.test(email) && hiphenPattern.test(email1)) {
                if (email.substring(0, 1) === "." || email1.substring(0, 1) === "." || email1.substring(0, 1) === "-") {
                  if (controlName === "toEmail") {
                    control1.setErrors({ pattern: true });
                    return;
                  }
                  if (controlName === "ccEmail") {
                    control1.setErrors({ pattern: true });
                    return;
                  }
                  if (controlName === "bccEmail") {
                    control1.setErrors({ pattern: true });
                    return;
                  }
                } else {
                  if (controlName === "toEmail") {
                    control1.setErrors(null);
                    this.emailEstimateForm.updateValueAndValidity();
                  }
                  if (controlName === "ccEmail") {
                    control1.setErrors(null);
                  }
                  if (controlName === "bccEmail") {
                    control1.setErrors(null);
                  }
                }
              } else { // Not allow consecutive dots or consecutive_ /
                if (controlName === "toEmail") {
                  control1.setErrors({ pattern: true });
                  return;
                }
                if (controlName === "ccEmail") {
                  control1.setErrors({ pattern: true });
                  return;
                }
                if (controlName === "bccEmail") {
                  control1.setErrors({ pattern: true });
                  return;
                }
              }
            } else {
              if (controlName === "toEmail") {
                control1.setErrors({ pattern: true });
                return;
              }
              if (controlName === "ccEmail") {
                control1.setErrors({ pattern: true });
                return;
              }
              if (controlName === "bccEmail") {
                control1.setErrors({ pattern: true });
                return;
              }

            }
          }
        }
      } else {
        if (!regex.test(control.value)) {
          if (controlName === "toEmail") {
            control1.setErrors({ pattern: true });
            return;
          }
          if (controlName === "ccEmail") {
            control1.setErrors({ pattern: true });
            return;
          }
          if (controlName === "bccEmail") {
            control1.setErrors({ pattern: true });
            return;
          }
        }
      }
    } else {
      if (controlName === "toEmail") {
        this.emailEstimateForm.controls['toEmail'].setValidators([Validators.required]);
        this.emailEstimateForm.controls['toEmail'].updateValueAndValidity();
      }
    }
    return true;
  }



}
