import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/core/services';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { AdditionalService } from './service/additional.service';
import { FormCanDeactivate } from 'src/app/core/guards/form-can-deactivate';


@Component({
  selector: 'app-additional-service',
  templateUrl: './additional-service.component.html',
  styleUrls: ['./additional-service.component.css']
})
export class AdditionalServiceComponent extends FormCanDeactivate {
  editSaveForm!: FormGroup;
  mode: string = "new";
  showWarning: boolean = false;
  screenId: number;
  excelFileName: string = this.translate.instant("master.additionalService.titles.additionalServiceList");
  warningMessage: string = '';
  submitted: boolean = false;
  additionalServiceId: number = 0;
  tableMappingList = [];
  tableInitialData: any = [];
  selectedRowData: any = null;
  additionalServiceInfo: any = null;
  activeStatus: any;
  // Role_Rights
  disableAddButton: boolean = false;
  disableSaveButton: boolean = false;
  createBit: boolean = false;
  editBit: boolean = false;
  viewBit: boolean = false;
  editValue: boolean = false;
  currentUserName: any;
  headerColumnList = [
    {
      field: "serviceCode",
      header: this.translate.instant("master.additionalService.grid.serviceCode"),
      width: "30%",
      key: 1,
    },

    {
      field: "serviceDescription",
      header: this.translate.instant("master.additionalService.grid.serviceDescription"),
      width: "40%",
      key: 2,
    },
    {
      field: "defaultStatus",
      header: this.translate.instant("master.additionalService.grid.default"),
      width: "15%",
      key: 3,
    },
    {
      field: "activeStatus",
      header: this.translate.instant("master.additionalService.grid.active"),
      width: "15%",
      key: 4,
    },
    {
      field: 'delete',
      header: '',
      width: '2%',
      key: 5

    },
  ];


  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    public notificationService: NotificationService,
    private translate: TranslateService,
    private userAuthService: UserAuthService,
    private additionalService: AdditionalService,
    private loaderService: NgxUiLoaderService,
    private router: Router,
  ) {
    super();
    const snapshot: RouterStateSnapshot = router.routerState.snapshot;
    this.screenId = snapshot.root.queryParams['screenId'];
  }

  ngOnInit() {

    this.editSaveForm = this.formBuilder.group({
      serviceCode: ['', [Validators.required]],
      serviceDescription: ['', [Validators.required]],
      default: [false, []],
      active: [true, []],
      isActiveChanged: [false, []],
    });
    this.currentUserName = this.userAuthService.getCurrentUserName()
    this.editSaveForm.controls['active'].setValue(true);
    this.getTableData();
    this.getPageRights(this.screenId);
  }


  //Get Additional Service list 
  getTableData() {
    this.loaderService.start();
    this.additionalService.getTableRecords().subscribe((data: any) => {
      this.tableInitialData = data["response"];
      this.loaderService.stop();
    });
  }

  refreshIconClick(value: any) {
    if (value) {
      this.getTableData();
    }
  }

  get editSaveFormController() {
    return this.editSaveForm.controls;
  }

  // null check common method
  isNullorEmpty(value: any) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "NaN"
    ) {
      return true;
    } else {
      return false;
    }
  }

  //edit form - click table record it will show in form fields
  receiveTableRowData(event: any) {
    
    if (event) {
      if (this.editSaveForm.dirty) {
        this.confirmationService.confirm({
          message: this.translate.instant("common.Information.unsavedChangesInfo"),
          accept: () => {
            this.mode = "edit"
            this.patchRowData(event);
            this.additionalServiceId = event.additionalServiceId;
            this.additionalServiceInfo = event;
            this.editValue = true;
            this.enableRights();
          },
          reject: () => {
            return false;
          },
        });
      } else {
        this.mode = "edit"
        this.patchRowData(event);
        this.additionalServiceId = event.additionalServiceId;
        this.additionalServiceInfo = event;
        this.editValue = true;
        this.enableRights();
      }

    }
  }

  //check Existing Field
  checkExistingField(controlName: any) {


    const control = this.editSaveForm.controls[controlName];

    if (control.errors) {
      return;
    }
    const bodyData = {
      additionalServiceId: this.isNullorEmpty(this.additionalServiceId) ? 0 : this.additionalServiceId,
      serviceCode: control.value,
    };

    if (control.value) {
      this.additionalService.isCodeValid(bodyData).subscribe((data: any) => {
        if (data["status"] === true) {
          if (control.value) {
            control.setErrors(null);
          } else {
            control.setErrors({
              required: true
            });
          }
        } else {
          control.setErrors({ duplicateCode: true });
        }
      });

    }
  }

  // validate form when form is invalid
  validateAllFormFields(formGroup: FormGroup) {
    formGroup.controls &&
      Object.keys(formGroup.controls).forEach((field) => {
        const control = formGroup.get(field);
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.validateAllFormFields(control);
        }
      });
  }

  // resets form to pristine state
  private _markFormPristine(form: FormGroup): void {
    form.controls &&
      Object.keys(form.controls).forEach((control) => {
        form.controls[control].markAsPristine();
      });
  }

  reset() {
    this.submitted = false;
    this.editSaveForm.reset();
    this.mode = "new";
    this.additionalServiceInfo = null;
    this.editSaveForm.controls['active'].setValue(true);
    this.additionalServiceId = 0;
  }

  handleDeleteAdditionalServiceIcon(event: any) {
    this.confirmationService.confirm({
      message: this.translate.instant('common.Information.deleteConfirmation'),
      header: this.translate.instant('common.notificationTitle.confirmation'),
      accept: () => {
        this.deleteAdditionalServiceList(event);
      },
      reject: () => {
        return false;
      },
    });
  }

  deleteAdditionalServiceList(event: any) {

    this.additionalService.deleteAdditionalService(event.additionalServiceId).subscribe(
      (data: any) => {
        this.getTableData();

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

  //submit function
  onSubmit(): void {
    this.submitted = true;

    if (this.editSaveForm.invalid) {
      this.validateAllFormFields(this.editSaveForm);
      return;
    } else {
      if (this.editSaveForm.dirty) {
        this.loaderService.start();
        let formValues: any = {
          serviceCode: this.editSaveForm.value.serviceCode,
          serviceDescription: this.editSaveForm.value.serviceDescription,
          default: this.editSaveForm.value.default == null ? false : this.editSaveForm.value.default,
          active: this.editSaveForm.value.active == null ? true : this.editSaveForm.value.active,
          createdBy: this.currentUserName,
          modifiedBy: this.currentUserName,
          isActiveChanged: false,
        }

        if (this.mode == "edit") {
          formValues['additionalServiceId'] = this.additionalServiceInfo.additionalServiceId;
          formValues['modifiedBy'] = this.currentUserName;
          formValues['modified'] = this.additionalServiceInfo.modified;
          formValues['created'] = this.additionalServiceInfo.created;
          formValues['createdBy'] = this.additionalServiceInfo.createdBy;
          formValues['isActiveChanged'] = false;

        }

        if (this.additionalServiceInfo && this.additionalServiceInfo.active !== formValues.active) {
          formValues["isActiveChanged"] = true
        }

        if (this.mode == "new") {
          this.additionalService.createAdditionalService(formValues).subscribe((data: any) => {
            if (data["status"] === true) {
              this.notificationService.smallBox({
                title: this.translate.instant("common.notificationTitle.success"),
                content: data["message"],
                timeout: 3000,
                icon: "fa fa-check",
              });
              this.editValue = false;
              this.editSaveForm.markAsPristine();
              this._markFormPristine(this.editSaveForm);
              this.reset();
              this.refreshIconClick(true);
              this.enableRights();

            } else {
              this.loaderService.stop();

              this.notificationService.smallBox({
                title: this.translate.instant("common.notificationTitle.error"),
                content: data["message"],
                timeout: 5000,
                icon: "fa fa-times",
              });
            }
          });

        } else {
          this.additionalService.updateAdditionalService(formValues).subscribe((data: any) => {

            if (data["status"] === true) {
              this.notificationService.smallBox({
                severity: 'success',
                title: this.translate.instant(
                  'common.notificationTitle.success'
                ),
                content: data['message'],
                timeout: 5000,
                icon: 'fa fa-check',
              })
              this.editValue = false;
              this.editSaveForm.markAsPristine();
              this._markFormPristine(this.editSaveForm);
              this.reset();
              this.refreshIconClick(true);
              this.enableRights();
            } else {
              this.loaderService.stop();
              this.notificationService.smallBox({
                title: this.translate.instant("common.notificationTitle.error"),
                content: data["message"],
               
                severity: 'error',
                timeout: 5000,
                icon: "fa fa-times",
              });
            }
          });


        }
      } else {
        this.loaderService.stop();
        this.notificationService.smallBox({
          title: this.translate.instant(
            "common.notificationTitle.information"
          ),
          content: this.translate.instant(
            "common.Information.noChangesInfo"
          ),
          severity: "info",
          timeout: 3000,
          icon: "fa fa-check",
        });

      }
    }
  }

  patchRowData(event: any) {
    this.editSaveForm.patchValue(event);
  }

  addNewEntry() {
    if (this.editSaveForm.dirty ||
      this.editSaveForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant("common.Information.unsavedChangesInfo"),
        header: this.translate.instant("common.notificationTitle.confirmation"),
        accept: () => {
          this.editSaveForm.reset();
          this.additionalServiceInfo = null;
          this.mode = "new";
          this.editSaveForm.controls['active'].setValue(true);
          this.editSaveForm.markAsPristine();
          this._markFormPristine(this.editSaveForm);
          this.additionalServiceId = 0;
          this.editValue = false;
          this.submitted = false
          this.enableRights();

        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.editSaveForm.reset();
      this.additionalServiceInfo = null;
      this.mode = "new";
      this.editSaveForm.controls['active'].setValue(true);
      this.editSaveForm.markAsPristine();
      this._markFormPristine(this.editSaveForm);
      this.additionalServiceId = 0;
      this.editValue = false;
      this.submitted = false
      this.enableRights();
    }
  }

  onChangeActive() {
    const control = this.editSaveForm.controls["active"];

    if (this.mode === "edit") {
      this.activeStatus = this.additionalServiceInfo.active == control.value ? false : true;
      this.additionalService
        .onChangeActive(this.additionalServiceInfo)
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

  getPageRights(screenId: any) {


    this.createBit = true;
    this.editBit = true;
    this.viewBit = true;
    this.enableRights();
    

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
