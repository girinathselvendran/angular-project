import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { FormCanDeactivate } from "@app/shared/form-can-deactivate/form-can-deactivate";

import {
  FormGroup,
  FormBuilder,
  Validators,
  NgForm,
  FormControl,
} from '@angular/forms';
import { ChangePassword } from '../shared/models/change-password.model';

import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { NotificationService } from 'src/app/core/services';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
}) //extends FormCanDeactivate
export class ChangePasswordComponent implements OnInit {
  display: boolean = false;
  hide = false;
  hideold = false;
  hideconfirm = false;
  changePassword: ChangePassword = new ChangePassword();
  editSaveForm!: FormGroup;
  inValidUser = '';
  password = '';
  login = '';
  userId: any;
  showPopup = false;
  public oldPassword!: string;
  public newPassword!: string;
  public confirmPassword!: string;
  submitted = false;
  id!: number;

  showHideTextOld = 'Show password';
  showHideTextNew = 'Show password';
  showHideTextConfirm = 'Show password';
  // passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
  passwordPattern =
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$%^&()_{};',.]).{4,}$"; // Accepted: #!@$%^&()_{};',. Not Accepted: \ / : * ? “ < > | [ ] + = -
  userName: any;
  invalidPassword = false;
  roleId = 0;
  comapanyId!: number;
  // tslint:disable-next-line: no-input-rename
  // @Input("disableCloseBit")
  @Input() disableCloseBit: any = false;

  constructor(
    private router: Router,
    private authService: UserAuthService,
    public notificationService: NotificationService,
    private formBuilder: FormBuilder,
    public confirmationService: ConfirmationService,
    private translate: TranslateService
  ) {
    // super();
  }
  toggleHideForNew() {
    this.hide = !this.hide;
    if (!this.hide) {
      this.showHideTextNew = 'Show password';
    } else {
      this.showHideTextNew = 'Hide password';
    }
  }
  toggleHideForOld() {
    this.hideold = !this.hideold;
    if (!this.hideold) {
      this.showHideTextOld = 'Show password';
    } else {
      this.showHideTextOld = 'Hide password';
    }
  }
  toggleHideForConfirm() {
    this.hideconfirm = !this.hideconfirm;
    if (!this.hideconfirm) {
      this.showHideTextConfirm = 'Show password';
    } else {
      this.showHideTextConfirm = 'Hide password';
    }
  }
  ngOnInit() {
    this.getUserInfo();
    this.getUserId();

    this.editSaveForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(this.passwordPattern),
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(this.passwordPattern),
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
    });
  }
  get changePasswordFormControls() {
    return this.editSaveForm.controls;
  }
  showDialog() {
    this.display = true;
  }

  checkNotAllowedSpecialCharactersNewPassword() {
    const regex = /[\\/:*?"<>|]/;
    const control = this.editSaveForm.controls['newPassword'];
    if (control.value && !control.errors) {
      if (regex.test(control.value)) {
        this.editSaveForm.controls['newPassword'].setErrors({
          pattern: true,
        });
      } else {
        this.editSaveForm.controls['newPassword'].setErrors(null);
      }
    }
  }

  checkNotAllowedSpecialCharactersConfirmPassword() {
    const regex = /[\\/:*?"<>|]/;
    const control = this.editSaveForm.controls['confirmPassword'];
    if (control.value && !control.errors) {
      if (regex.test(control.value)) {
        this.editSaveForm.controls['confirmPassword'].setErrors({
          pattern: true,
        });
      } else {
        this.editSaveForm.controls['confirmPassword'].setErrors(null);
      }
    }
  }
  checkAndPersistErrorsOldPassword() {
    const control = this.editSaveForm.controls['oldPassword'];
    const encryptedPassword = control.value;
    if (control.value && control.errors) {
      this.editSaveForm.controls['oldPassword'].setErrors({
        invalidPassword: true,
      });
    } else {
      this.editSaveForm.controls['oldPassword'].setErrors(null);
    }
  }
  // to check whether old password is correct or not
  oldPasswordCheck(event: any) {
    const control = this.editSaveForm.controls['oldPassword'];
    const encryptedPassword = control.value;
    if (control.value && !control.errors) {
      this.authService
        .oldPasswordCheck(this.userName, encryptedPassword)
        .subscribe((data) => {
          if (data['response'] === true) {
            this.editSaveForm.controls['oldPassword'].setErrors(null);
          } else {
            this.editSaveForm.controls['oldPassword'].setErrors({
              invalidPassword: true,
            });
          }
        });
    }
  }

  oldPasswordReuseCheck(event: any) {
    const control = this.editSaveForm.controls['newPassword'];
    const controlOld = this.editSaveForm.controls['oldPassword'];
    const encryptedPassword = control.value;
    this.authService
      .oldPasswordCheck(this.userName, encryptedPassword)
      .subscribe((data) => {
        if (data['response'] === false) {
          this.editSaveForm.controls['newPassword'].setErrors(null);
        } else {
          this.editSaveForm.controls['newPassword'].setErrors({
            samePassword: true,
          });
        }
      });
  }
  // to check the combination of new and confirm password
  confirmPasswordCheck() {
    const control = this.editSaveForm.controls['confirmPassword'];
    const controlOld = this.editSaveForm.controls['newPassword'];
    if (
      control.value &&
      !control.errors &&
      controlOld.value &&
      !controlOld.errors
    ) {
      if (control.value === controlOld.value) {
      } else {
        this.editSaveForm.controls['confirmPassword'].setErrors({
          invalidConfirmPassword: true,
        });
      }
    }
  }

  // to check the pattern of new password
  newPasswordCheck(event: any) {
    this.checkNotAllowedSpecialCharactersNewPassword();
    const control = this.editSaveForm.controls['confirmPassword'];
    const controlOld = this.editSaveForm.controls['newPassword'];
    if (
      controlOld.value !== '' ||
      controlOld.value !== undefined ||
      controlOld.value !== null
    ) {
      if (controlOld.value && !controlOld.errors) {
        this.oldPasswordReuseCheck(event);
      }
      if (
        control.value !== '' ||
        control.value !== undefined ||
        control.value !== null
      ) {
        if (control.value === controlOld.value && !controlOld.errors) {
          this.editSaveForm.controls['confirmPassword'].setErrors(null);
        } else if (control.value !== controlOld.value) {
          this.editSaveForm.controls['confirmPassword'].setErrors({
            invalidConfirmPassword: true,
          });
        }
      }
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
  getUserInfo() {
    this.comapanyId = this.authService.getCurrentCompanyId();
    this.userName = this.authService.user.userName;
  }
  constructchangePasswordObject(formData: any): void {
    this.changePassword = formData;
    this.changePassword.userName = this.userName;
    this.changePassword.password =
      this.changePasswordFormControls['newPassword'].value;
  }
  private _markFormPristine(form: FormGroup | NgForm): void {
    Object.keys(form.controls).forEach((control) => {
      form.controls[control].markAsPristine();
    });
  }
  closeForm() {
    if (this.editSaveForm.pristine === false) {
      this.confirmationService.confirm({
        message: this.translate.instant('common.Information.unsavedChangesInfo'),
        accept: () => {
          this.display = false;
          this.submitted = false;
          this.editSaveForm.reset();
          this.editSaveForm.markAsPristine();
        },
        reject: () => {
          this.display = true;
          return false;
        },
      });
    } else {
      this.submitted = false;
      this.display = false;
      this.editSaveForm.reset();
      this.editSaveForm.markAsPristine();
    }
  }

  onsubmit(): void {
    this.submitted = true;
    if (this.editSaveForm.invalid) {
      this.validateAllFormFields(this.editSaveForm);

      return;
    } else {
      if (this.editSaveForm.dirty) {
        const control = this.editSaveForm.controls['oldPassword'];
        const encryptedPassword = control.value as string;
        if (encryptedPassword && !control.errors) {
          this.authService
            .oldPasswordCheck(this.userName, encryptedPassword)
            .subscribe((data) => {
              if (data['response'] === true) {
                this.editSaveForm.controls['oldPassword'].setErrors(null);
                this.constructchangePasswordObject(this.editSaveForm.value);
                const userName = this.changePassword.userName as string; // Type assertion
                this.authService
                  .updatePassword(userName, this.changePassword.password)
                  .subscribe((data1) => {
                    if (data1['status'] === true) {
                      this.editSaveForm.markAsPristine();
                      this._markFormPristine(this.editSaveForm);
                      this.display = false;
                      this.authService.logout();
                      this.router.navigate(['/auth/login']);
                      this.notificationService.smallBox({
                        title: this.translate.instant(
                          'common.notificationTitle.success'
                        ),
                        content: this.translate.instant(
                          'changePassword.messages.success'
                        ),
                        // color: "#739E73",
                        timeout: 7000,
                        icon: 'fa fa-check',
                      });
                    } else {
                      this.notificationService.smallBox({
                        title: this.translate.instant(
                          'common.notificationTitle.error'
                        ),
                        content: data['message'],
                        // color: "#3276b1",
                        timeout: 5000,
                        icon: 'fa fa-times',
                      });
                    }
                  });
              } else {
                this.editSaveForm.controls['oldPassword'].setErrors({
                  invalidPassword: true,
                });
              }
            });
        }
      } else {
        this.notificationService.smallBox({
          title: 'Information',
          content: this.translate.instant('common.Information.noChangesInfo'),
          // color: "#3276b1",
          timeout: 2000,
          icon: 'fa fa-check',
        });
        this.display = false;
      }
    }
  }
  getUserId() {
    this.id = this.authService.getCurrentUserId();
  }
}
