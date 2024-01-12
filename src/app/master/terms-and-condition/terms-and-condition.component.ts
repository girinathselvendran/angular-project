import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/core/services';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TermsAndConditionService } from './service/terms-and-condition.service';
import { TermsAndCondition } from './models/termsAndCondition.model';
import { FormCanDeactivate } from 'src/app/core/guards/form-can-deactivate';
@Component({
  selector: 'app-terms-and-condition',
  templateUrl: './terms-and-condition.component.html',
  styleUrls: ['./terms-and-condition.component.css'],
})
export class TermsAndConditionComponent extends FormCanDeactivate {

  editSaveForm!: FormGroup;
  mode: string = 'new';
  showWarning: boolean = false;
  screenId: number;
  excelFileName: string = this.translate.instant('master.termsAndCondition.titles.termsAndConditionList');
  warningMessage: string = '';
  termsAndCondition!: TermsAndCondition;
  tableMappingList = [];
  submitted: boolean = false;
  disableTCSaveBtn: boolean = false;
  saveButton: boolean = true;
  showWarningMessage: boolean = false;
  tableInitialData = [];
  termsAndConditionList: any = [];
  createBit: boolean = false;
  editBit: boolean = false;
  viewBit: boolean = false;
  editValue: boolean = false;

  // enable rights
  disableAddButton: boolean = false;
  disableSaveButton: boolean = false;


  isActiveBitChanged: boolean = false;
  getDataFromTable: any;
  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    public notificationService: NotificationService,
    private translate: TranslateService,
    private userAuthService: UserAuthService,
    private termsAndConditionService: TermsAndConditionService,
    private loaderService: NgxUiLoaderService,
    private router: Router,
  ) {
    super();
    const snapshot: RouterStateSnapshot = router.routerState.snapshot;
    this.screenId = snapshot.root.queryParams['screenId'];
  }
  headerColumnList = [
    {
      field: 'termsAndConditionCode',
      header: this.translate.instant('master.termsAndCondition.grid.code'),
      width: '20%',
      key: 1,
    },
    {
      field: 'termsAndConditionDescription',
      header: this.translate.instant('master.termsAndCondition.grid.description'),
      width: '60',
      key: 2,
    },
    {
      field: 'activeStatus',
      header: this.translate.instant('master.termsAndCondition.grid.active'),
      width: '20%',
      key: 3,
    },
    {
      field: 'delete',
      header: '',
      width: '2%',
      key: 5

    },
  ];

  ngOnInit() {
    this.editSaveForm = this.formBuilder.group({
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
      active: [true, []],
    });
    this.GetTermsAndCondition();
    this.getPageRights(this.screenId);
  }

  onChangeActive(controlName: string) {
    if (this.mode === 'edit') {
      this.isActiveBitChanged = true;
      this.editSaveForm.markAsDirty();
      this.editSaveForm.markAsTouched();
      this.termsAndConditionService
        .onChangeActive(this.editSaveForm.getRawValue())
        .subscribe((data: any) => {
          if (data["status"] === false) {
            this.notificationService.smallBox({
              title: this.translate.instant("common.notificationTitle.error"),
              content: data["message"],
              timeout: 5000,
              icon: "fa fa-times",
            });
          } else {
          }
        });
    }
  }

  isNullorEmpty(value: any) {
    if (
      value === '' ||
      value === null ||
      value === undefined ||
      value === 'NaN'
    ) {
      return true;
    } else {
      return false;
    }
  }

  validateTermsAndConditionCode(controlName: string) {
    const control = this.editSaveForm.controls[controlName];

    if (control.errors) {
      return;
    }

    const termsAndCondition = {
      TermsAndConditionId: this.isNullorEmpty(
        this.editSaveForm.controls['termsAndConditionId']?.value
      )
        ? 0
        : this.editSaveForm.controls['termsAndConditionId'].value,
      Code: this.editSaveForm.controls['code'].value,
    };

    if (control.value) {
      this.termsAndConditionService
        .isCodeValid(termsAndCondition)
        .subscribe((data) => {
          if (data['status'] === true) {
            control.setErrors(null);
          } else {
            control.setErrors({ duplicateCode: true });
          }
        });
    }
  }

  reset() {
    this.mode = 'new';
    this.editSaveForm.reset();
    this.submitted = false
    this.editSaveForm.controls['active'].setValue(true)
    this.isActiveBitChanged = false

  }
  private _markFormPristine(form: FormGroup): void {
    form.controls &&
      Object.keys(form.controls).forEach((control) => {
        form.controls[control].markAsPristine();
      });
  }
  addNew() {
    if (this.editSaveForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.reset();

          this._markFormPristine(this.editSaveForm);
          this.editValue = false;
          this.enableRights();

        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.reset();
      this._markFormPristine(this.editSaveForm);
      this.editValue = false;
      this.enableRights();
    }
  }
  //API

  refreshIconClick(value: any) {
    this.GetTermsAndCondition();
  }


  receiveTableRowData(event: any) {
    if (event) {
      if (this.editSaveForm.dirty) {
        this.confirmationService.confirm({
          message: this.translate.instant('common.Information.unsavedChangesInfo'),
          accept: () => {
            this.patchRowData(event);
            this.editValue = true;
            this.enableRights();
          },
          reject: () => {
            return false;
          },
        });
      } else {
        this.patchRowData(event);
        this.editValue = true;
        this.enableRights();
      }
    }
  }
  patchRowData(event: any) {
    this.isActiveBitChanged = false
    this.getDataFromTable = event;
    this.mode = 'edit';
    this.editSaveForm.patchValue({
      code: event.termsAndConditionCode,
      description: event.termsAndConditionDescription,
      active: event.active,

    })

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
  onSubmit() {
    if (this.saveButton) {
      if (this.showWarningMessage) {
        return;
      }
      if (this.editSaveForm.invalid) {
        this.validateAllFormFields(this.editSaveForm);
        return;
      } else {
        this.submitted = true;
        if (this.editSaveForm.dirty && this.editSaveForm.touched) {
          this.constructTermsAndConditionObject(
            this.editSaveForm.getRawValue()
          );
          if (this.mode === 'new') {
            this.editSaveForm.markAsDirty();
            this.loaderService.start();
            this.termsAndConditionService
              .createTermsAndCondition(this.termsAndCondition)
              .subscribe((data) => {
                this.loaderService.stop();
                if (data['status'] === true) {
                  this.GetTermsAndCondition();
                  this.reset()
                  this.editValue = false;
                  this.enableRights();
                  this.notificationService.smallBox({
                    severity: 'success',
                    title: this.translate.instant(
                      'common.notificationTitle.success'
                    ),
                    content: data['message'],
                    timeout: 5000,
                    icon: 'fa fa-check',
                  });

                } else {
                  this.notificationService.smallBox({
                    title: this.translate.instant(
                      'common.notificationTitle.error'
                    ),
                    content: data['message'],
                    severity: 'error',
                    timeout: 5000,
                    icon: 'fa fa-times',
                  });
                }
              });
          } else {
            this.termsAndConditionService
              .updateTermsAndCondition(this.termsAndCondition)
              .subscribe((data) => {
                if (data['status'] === true) {
                  this.reset();
                  this.GetTermsAndCondition();
                  this.isActiveBitChanged = false;
                  this.editValue = false;
                  this.enableRights();
                  this.notificationService.smallBox({
                    severity: 'success',
                    title: this.translate.instant(
                      'common.notificationTitle.success'
                    ),
                    content: data['message'],
                    timeout: 5000,
                    icon: 'fa fa-check',
                  });
                  this.mode = 'edit';

                } else {
                  this.notificationService.smallBox({
                    title: this.translate.instant(
                      'common.notificationTitle.error'
                    ),
                    content: data['message'],
                    severity: 'error',
                    timeout: 5000,
                    icon: 'fa fa-times',
                  });
                }
              });
          }
        } else {
          this.notificationService.smallBox({
            title: this.translate.instant(
              'common.notificationTitle.information'
            ),
            content: this.translate.instant('common.Information.noChangesInfo'),
            severity: 'info',
            timeout: 3000,
            icon: 'fa fa-check',
          });
        }
        this.editSaveForm.markAsDirty();

      }
    }
  }

  constructTermsAndConditionObject(formData: any) {
    if (this.mode === 'new') {
      this.termsAndCondition = {
        code: formData['code'],
        description: formData['description'],
        isActiveChanged: false,
        active: formData['active'],
        createdBy: this.userAuthService.getCurrentUserName(),
        modifiedBy: this.userAuthService.getCurrentUserName(),
      };
    } else {
      this.termsAndCondition = {
        termsAndConditionId: this.getDataFromTable.termsAndConditionId,
        code: formData['code'],
        description: formData['description'],
        active: formData['active'],
        created: this.getDataFromTable.created,
        modified: this.getDataFromTable.modified,
        createdBy: this.getDataFromTable.createdBy,
        modifiedBy: this.userAuthService.getCurrentUserName(),
        isActiveChanged: this.isActiveBitChanged,
      };
    }
  }
  GetTermsAndCondition() {
    this.loaderService.start();
    this.termsAndConditionService.getTermsAndCondition().subscribe(
      (data) => {
        this.termsAndConditionList = data['response'];
        this.loaderService.stop();
      },
      (err) => { }
    );
  }

  getPageRights(screenId: any) {


    this.userAuthService
      .getPageRights(screenId, this.userAuthService.getCurrentPersonaId())
      .subscribe((data) => {


        if (data["status"] === true) {
          if (data["response"].length > 0) {
            this.enableRights();
          } else {
          }
        } else {
          this.notificationService.smallBox({
            title: this.translate.instant("common.notificationTitle.information"),
            content: data["message"],
            severity: "info",
            timeout: 2000,
            icon: "fa fa-check",
          });
        }
      });
  }
  handleDeleteTermsAndConditionIcon(event: any) {


    this.confirmationService.confirm({
      message: this.translate.instant('common.Information.deleteConfirmation'),
      header: this.translate.instant('common.notificationTitle.confirmation'),
      accept: () => {
        this.deleteTermsAndConditionList(event);
      },
      reject: () => {
        return false;
      },
    });
  }
  deleteTermsAndConditionList(event: any) {

    this.termsAndConditionService.deleteTermsAndConditionList(event.termsAndConditionId).subscribe(
      (data: any) => {
        this.GetTermsAndCondition();

        if (data['status'] === true) {
          this.notificationService.smallBox({
            title: this.translate.instant('common.notificationTitle.success'),
            content: data['message'],
            severity: 'success',
            timeout: 5000,
            icon: 'fa fa-check',
          });
          this.loaderService.stop();
        } else {
          this.notificationService.smallBox({
            title: this.translate.instant('common.notificationTitle.error'),
            content: data['message'],
            severity: 'error',
            timeout: 5000,
            icon: 'fa fa-times',
          });
          this.loaderService.stop();
        }
      },
      (err: any) => {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: err['message'],
          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
        this.loaderService.stop();
      }
    );
  }


  private enableRights() {

    if (!this.editBit && !this.createBit && this.viewBit) {

      this.disableAddButton = true;
      this.disableSaveButton = true;
      this.editSaveForm.disable();

      if (this.editValue == false) {
        this.showWarning = true;
        this.warningMessage = 'common.roleRightsMessages.create';
      }
      if (this.editValue == true) {
        this.showWarning = true;
        this.warningMessage = 'common.roleRightsMessages.edit';
      }

      this.mode = "view";

    } else if (this.editBit && this.viewBit && !this.createBit && !this.editValue) {
      this.disableAddButton = true;
      this.disableSaveButton = true;
      this.editSaveForm.disable();
      this.editValue = false;
      this.showWarning = true;
      this.warningMessage = 'common.roleRightsMessages.create';

      this.mode = "view";

    } else if (this.editBit && this.viewBit && !this.createBit && this.editValue) {
      this.disableSaveButton = false;
      this.disableAddButton = true;
      this.editSaveForm.enable();
      this.showWarning = false;
      this.mode = "edit";
      this.mode = "edit";
    } else if (this.createBit && !this.editBit && this.viewBit && this.editValue) {
      this.showWarning = true;
      this.warningMessage = "common.roleRightsMessages.edit";

      this.disableAddButton = false;
      this.disableSaveButton = true;
      this.editSaveForm.disable();
      this.mode = "view";
    } else if (this.createBit && !this.editBit && this.viewBit && !this.editValue
    ) {
      this.disableAddButton = false;
      this.disableSaveButton = false;
      this.editSaveForm.enable();
      this.mode = "new";
      this.showWarning = false;

    } else if (this.editBit && this.viewBit && this.createBit) {
      this.disableAddButton = false;
      this.disableSaveButton = false;
      this.editSaveForm.disable();
      if (this.editValue) {
        this.editSaveForm.enable()
        this.mode = "edit";
      } else {
        this.mode = "new";
        this.editSaveForm.enable()
      }

    } else {
    }

  }
}
