import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/services';
import { UserAuthService } from 'src/app/core/services/user-auth.service';

@Component({
  selector: 'sa-forgot',
  templateUrl: './forgot.component.html'
})
export class ForgotComponent implements OnInit {
  forgotFormGroup!: FormGroup;
  product = "imsDepo";

  iInterchangeLogo = 'assets/img/iInterchangeLogo.png';
  iDepoLogo = 'assets/img/iDepoLogo.png';
  companyLogo = 'assets/img/companyLogo.png';
  versionNo!: string;
  // emailPattern = "[a-zA-Z0-9]{1,}[a-zA-Z0-9._]{0,}[a-zA-Z0-9]{1,}@[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,3}";
  // emailPattern = "[a-zA-Z0-9]{1,}[a-zA-Z0-9._]{0,}[a-zA-Z0-9]{1,}@[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,3}";
  get forgotFormControls(): any { return this.forgotFormGroup.controls; }
  constructor(private formBuilder: FormBuilder, private authService: UserAuthService,
    public notificationService: NotificationService,
    private router: Router) { }

  ngOnInit() {
  

    this.forgotFormGroup = this.formBuilder.group({
      userName: ['', [Validators.required]],
      email: ['', [Validators.required]]
    });
    this.authService.getAppVersionDetails().subscribe((data) => {
      if (data['status'] === true) {
        this.versionNo = data['response'].versionNo;
      } else {
        this.notificationService.smallBox({
          severity: 'error',
          title: 'Error',
          content: "There seems to be an issue with connectivity. Please contact the system administrator, if the problem persists",
          // color: "#a90329",
          timeout: 5000,
          icon: "fa fa-times",
        });
      }
    });
  }

  onSubmit() {
    if (this.forgotFormGroup.invalid) {
      this.validateAllFormFields(this.forgotFormGroup);
      return;
    } else {
      if (this.forgotFormGroup.dirty) {
        this.forgotFormControls.userName.setErrors(null);
        this.forgotFormControls.email.setErrors(null);
        const formData = this.forgotFormGroup.value;
        if (formData['userName'] !== "" && formData['email'] !== "" && formData['userName'] !== null && formData['email'] !== null) {
          this.authService.forgot(formData['userName'], formData['email']).subscribe((data) => {
            if (data['status'] === true) {
              if (data['response'] === true) {
                this.notificationService.smallBox({
                  severity: 'success',
                  title: 'Success',
                  content: data['message'],
                  // color: "#739E73",
                  timeout: 3000,
                  icon: "fa fa-check",
                });
              } else {
                this.notificationService.smallBox({
                  severity: 'error',
                  title: 'Error',
                  content: data['message'],
                  // color: "#a90329",
                  timeout: 5000,
                  icon: "fa fa-times",
                });
              }
            } else {
              this.notificationService.smallBox({
                severity: 'error',
                title: "Error",
                content: data['message'],
                // color: "#a90329",
                timeout: 5000,
                icon: "fa fa-times",
              });
            }
          });
        }
      }
    }
  }

  getUrl() {
    return "url('assets/img/loginbg.jpg')";
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  checkInvalidEmailPattern(controlName: string) {
    this.forgotFormGroup.controls[controlName].setValue(this.forgotFormGroup.controls[controlName].value !== null ? this.forgotFormGroup.controls[controlName].value.replace(/\s/g, "") : null);
    const control = this.forgotFormGroup.controls[controlName];
    if (control.value && !control.errors) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(String(control.value).toLowerCase()) === false) {
        control.setErrors({
          pattern: true
        });
      } else {
        const splitStrings = control.value.split("@");
        if (splitStrings.length === 2) { /* Should not  Allow more than 2 @ */
          const domain = splitStrings[1];
          if (domain[0] === "-" || domain[domain.length - 1] === "-") { /* The first and last character cannot be hyphen */
            control.setErrors({
              pattern: true
            });
          }
        } else {
          control.setErrors({
            pattern: true
          });
        }
      }
    }
  }


}
