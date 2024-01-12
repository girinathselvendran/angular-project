import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/core/services';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { ExcelService } from 'src/app/shared/services/export/excel/excel.service';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';
import { SupplierService } from './service/supplier.service';
import { SharedLazyTableComponent } from 'src/app/shared/components/shared-lazy-table/shared-lazy-table.component';
import { FormCanDeactivate } from 'src/app/core/guards/form-can-deactivate';
import { SharedLazyTableNewComponent } from 'src/app/shared/components/shared-lazy-table-new/shared-lazy-table-new.component';
@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
})
export class SupplierComponent extends FormCanDeactivate {
  @ViewChild("sharedLazyTableNew") sharedLazyTableChild: SharedLazyTableNewComponent | undefined;
  @ViewChild('attachment') attachment: any;
  @ViewChild('SupplierForm') supplierFormComponent: any;
  canMoveToNext: any = false;
  mode = 'new';
  screenId: any = "";
  companyId!: any;
  userId!: any;
  userName!: any;
  showList = true;
  activeTab = 1;
  tabCount: number = 0;
  noOfAttachment = 0;
  excelFileName = this.translate.instant("master.supplier.title.supplierExcelName");
  supplierRecordsList: any = []
  disableAddButton: any = false;
  disableSaveButton: any = false;
  editSaveForm!: FormGroup;
  partTableFilterFormGroup!: FormGroup;
  excelDataTable: any = [];
  serverSideProcessingObject!: any;
  totalDataGridCountComp: any;
  selectedSupplierInfoObject: any = {
    supplierId: 0,
    supplierCode: ""
  }
  selectedRowList: any;
  tableTitle = "";
  //-------------- enable rights ----------------------- 
  disableAttachmentButton: boolean = false;
  restrictTabWarning: boolean | undefined;
  tabNames: string | undefined;
  hideUnsavedErrorMessage: boolean | undefined;
  hideNewErrorMessage: boolean | undefined;
  errorTabName: string | undefined;
  showCreatePartFirst: boolean | undefined;
  showCreatePartFirstAddRates: boolean | undefined;
  showCreateSupplierContactAddress: boolean | undefined;
  showCreateSupplierMapParts: boolean | undefined;
  supplierInformationWizardError: boolean = false;
  showWarningMessageForRoleRights: boolean = false;
  warningMessageForRoleRights: string = "";
  createBit: boolean = true;
  editBit: boolean = true;
  viewBit: boolean = true;
  // --------------


  columnHeaderList = [
    {
      field: 'supplierCode',
      header: this.translate.instant("master.supplier.grid.supplierCode"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,

    },
    {
      field: 'supplierName',
      header: this.translate.instant("master.supplier.grid.supplierName"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'country',
      header: this.translate.instant("master.supplier.grid.country"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'city',
      header: this.translate.instant("master.supplier.grid.city"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'associatedDepots',
      header: this.translate.instant("master.supplier.grid.associatedDepots"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: "modifiedBy",
      header: this.translate.instant("master.supplier.grid.modifiedBy"),
      width: "10%",
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: "modifiedDate",
      header: this.translate.instant("master.supplier.grid.modifiedDate"),
      width: "12%",
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: "activeStatus",
      header: this.translate.instant("master.supplier.grid.active"),
      width: "8%",
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
  ];


  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    public notificationService: NotificationService,
    private sharedTableStoreService: SharedTableStoreService,
    private translate: TranslateService,
    private userAuthService: UserAuthService,
    private supplierService: SupplierService,
    private loaderService: NgxUiLoaderService,
    private excelService: ExcelService,
    private router: Router
  ) {
    super();
    const snapshot: RouterStateSnapshot = router.routerState.snapshot;
    this.screenId = snapshot.root.queryParams['screenId'];
  }

  ngOnInit() {

    // supplier Form FormGroup
    this.editSaveForm = this.formBuilder.group({
      supplierName: ['', [Validators.required]],
      supplierCode: ['', [Validators.required]],
      currency: [[], [Validators.required]],
      ledgerId: ['', []],
      taxRegistrationNo: ['', [Validators.required]],
      panNo: ['', []],
      tinNo: ['', []],
      supplierClassification: [[], []],
      exemptionUnder: ['', [Validators.required]],
      gstnNo: ['', []],
      gstnState: [[], []],
      associatedDepots: ['', [Validators.required]],
      manufacturer: [false, [Validators.required]],
      remarks: ['', []],
      active: [true, []],
      blacklist: [false, []],
      isActiveChanged: [false, []],
    });

    // supplier grid FormGroup
    this.partTableFilterFormGroup = this.formBuilder.group({
      supplierCode: ["", []],
      supplierName: ["", []],
      country: ["", []],
      city: ["", []],
      associatedDepots: ["", []],
      modifiedBy: ["", []],
      modifiedDate: ["", []],
      activeStatus: ["", []],
    })

    // calling page rights function for enable rights
    this.getPageRights(this.screenId);
    this.companyId = this.userAuthService.getCurrentCompanyId()
    this.userId = this.userAuthService.getCurrentUserId()
    this.userName = this.userAuthService.getCurrentUserName();
  }


  // Get All Supplier Grid List API
  getSupplierListServerSide(params: any) {

    this.serverSideProcessingObject = {
      CurrentPage: params.first,
      GlobalFilter: params.globalFilter != undefined ? params.globalFilter : this.sharedLazyTableChild != undefined ? this.sharedLazyTableChild.globalFilter.value : null,
      PageSize: params.rows,
      SortField: params.sortField ? params.sortField : "sortOnly",
      SortOrder: params.sortField ? params.sortOrder ? params.sortOrder : -1 : -1,
      supplierCode: this.partTableFilterFormGroup.value.supplierCode || "",
      supplierName: this.partTableFilterFormGroup.value.supplierName || "",
      country: this.partTableFilterFormGroup.value.country || "",
      city: this.partTableFilterFormGroup.value.city || "",
      associatedDepots: this.partTableFilterFormGroup.value.associatedDepots || "",
      modifiedBy: this.partTableFilterFormGroup.value.modifiedBy || "",
      modifiedDate: this.partTableFilterFormGroup.value.modifiedDate || "",
      active: this.partTableFilterFormGroup.value.activeStatus || ""
    };
    this.loaderService.start();

    this.supplierService
      .getSupplierListServerSide(
        this.serverSideProcessingObject,
        this.companyId,
        this.userId
      )
      .subscribe((data: any) => {
        this.supplierRecordsList = data["response"].result;
        this.totalDataGridCountComp = data["response"].filterRecordCount;
        this.sharedTableStoreService.setAssignGridData({ data, params });
        this.loaderService.stop();
      });
    this.loaderService.stop();

  }

  // export excel
  exportToExcel(event: any) {

    // remove checkbox field in grid columns
    let newColumns = event.columns.filter((key: any) => key.field != 'checkbox')

    this.excelDataTable = [];
    this.excelDataTable.columns = newColumns;
    this.excelDataTable.filteredValue = undefined;
    let downloaded: boolean;

    // default params set row count added
    let params: any = { first: 0, rows: this.totalDataGridCountComp };

    const serverSideProcessingObject = {
      CurrentPage: params.first,
      GlobalFilter: params.globalFilter != undefined ? params.globalFilter : this.sharedLazyTableChild != undefined ? this.sharedLazyTableChild.globalFilter.value : null,
      PageSize: params.rows,
      SortField: params.sortField ? params.sortField : "sortOnly",
      SortOrder: params.sortField ? params.sortOrder ? params.sortOrder : -1 : -1,
      supplierCode: this.partTableFilterFormGroup.value.supplierCode || "",
      supplierName: this.partTableFilterFormGroup.value.supplierName || "",
      country: this.partTableFilterFormGroup.value.country || "",
      city: this.partTableFilterFormGroup.value.city || "",
      associatedDepots: this.partTableFilterFormGroup.value.associatedDepots || "",
      modifiedBy: this.partTableFilterFormGroup.value.modifiedBy || "",
      modifiedDate: this.partTableFilterFormGroup.value.modifiedDate || "",
      active: this.partTableFilterFormGroup.value.activeStatus || ""
    };

    this.loaderService.start();

    this.supplierService
      .getSupplierListServerSide(
        serverSideProcessingObject,
        this.companyId,
        this.userId
      )
      .subscribe((data: any) => {
        this.excelDataTable.value = data["response"].result;
        downloaded = this.excelService.exportAsExcelFile(this.excelDataTable, this.excelFileName, false);
        this.loaderService.stop();
      });
    this.loaderService.stop();


  }

  attachmentOutPutEvent(event: any) {
    this.loaderService.start();
    this.noOfAttachment = event;
    this.loaderService.stop();
  }

  changeTab(tabNumber: number) {
    this.activeTab = tabNumber;
  }

  receiveTableRowData(event: any) {
    this.showList = false;
    this.mode = 'edit'
    this.selectedSupplierInfoObject = {
      supplierId: event.supplierId,
      supplierCode: event.supplierCode
    }
    this.selectedRowList = event;
    this.noOfAttachment = event.noOfAttachment;
    this.enableRights();

  }

  addIconClick(event: any) {
    this.showList = false;
    this.reset();
  }

  addNewSupplier() {
    if (this.supplierFormComponent.editSaveSupplierForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant("common.Information.unsavedChangesInfo"),
        header: this.translate.instant("common.notificationTitle.confirmation"),
        accept: () => {
          this.reset();
          this.showCreateSupplierContactAddress = false;
          this.showCreateSupplierMapParts = false;
          this.supplierInformationWizardError = false;
          this._markFormPristine(this.supplierFormComponent.editSaveSupplierForm);
          this.supplierFormComponent.addNewForm();
          this.enableRights();

        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.showCreateSupplierContactAddress = false;
      this.showCreateSupplierMapParts = false;
      this.supplierInformationWizardError = false;
      this.reset();
      this._markFormPristine(this.supplierFormComponent.editSaveSupplierForm);
      this.supplierFormComponent.addNewForm();
      this.enableRights();

    }
  }

  private _markFormPristine(form: FormGroup): void {
    Object.keys(form.controls).forEach((control) => {
      form.controls[control].markAsPristine();
      form.controls[control].markAsUntouched();
    });
  }

  reset() {
    this.noOfAttachment = 0;
    this.mode = 'new';
    this.activeTab = 1;
    this.supplierFormComponent?.editSaveSupplierForm?.reset();
    this.editSaveForm.controls['active'].setValue(true);
    this.selectedRowList = null;
    this.selectedSupplierInfoObject = {
      supplierId: 0,
      SupplierCode: null
    }

  }

  validateAllMethodFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllMethodFormFields(control);
      }
    });
  }

  constructSupplierObject() {

    const formValues = this.supplierFormComponent.editSaveSupplierForm.value;

    if (this.mode === "new") {

      const supplierObject = {

        SupplierCode: formValues.supplierCode,
        SupplierName: formValues.supplierName,
        CurrencyId: formValues.currency.currencyId,
        Active: formValues.active || false,
        IsActiveChanged: formValues.isActiveChanged || false,
        Remarks: formValues.remarks,
        LedgerID: formValues.ledgerId,
        Manufacturer: formValues.manufacturer || false,
        Blacklist: formValues.blacklist || false,
        TaxRegistrationNo: formValues.taxRegistrationNo,
        SupplierClassificationId: formValues.supplierClassification && formValues.supplierClassification.enumId || null,
        GSTNStateId: formValues.gstnState?.enumId || null,
        PANNo: formValues.panNo,
        TINNo: formValues.tinNo,
        ExemptionUnder: formValues.exemptionUnder,
        GSTNNo: formValues.gstnNo,
        SupplierAssociatedDepots: formValues.associatedDepots,
        CreatedBy: this.userName,
        ModifiedBy: this.userName,
      }

      return supplierObject;

    } else if (this.mode == 'edit') {
      const selectedRowList = this.selectedRowList;

      const supplierObject = {
        SupplierId: this.selectedSupplierInfoObject.supplierId,
        SupplierCode: this.selectedSupplierInfoObject.supplierCode,
        SupplierName: formValues.supplierName,
        CurrencyId: formValues.currency.currencyId,
        Active: formValues.active || false,
        IsActiveChanged: formValues.isActiveChanged || false,
        Remarks: formValues.remarks,
        LedgerID: formValues.ledgerId,
        Manufacturer: formValues.manufacturer || false,
        Blacklist: formValues.blacklist || false,
        TaxRegistrationNo: formValues.taxRegistrationNo,
        SupplierClassificationId: formValues.supplierClassification && formValues.supplierClassification.enumId || null,
        GSTNStateId: formValues.gstnState?.enumId || null,
        PANNo: formValues.panNo,
        TINNo: formValues.tinNo,
        ExemptionUnder: formValues.exemptionUnder,
        GSTNNo: formValues.gstnNo,
        SupplierAssociatedDepots: formValues.associatedDepots,
        CreatedBy: selectedRowList.createdBy,
        Created: selectedRowList.createdFullDate || selectedRowList.created,
        Modified: selectedRowList.modifiedFullDate || selectedRowList.modified,
        ModifiedBy: this.userName,
      }

      return supplierObject;

    } else {
      return false;
    }
  }
  async onSubmit() {

    const supplierFormController = this.supplierFormComponent.editSaveSupplierForm;
    if (supplierFormController.invalid) {

      // if form is valid mapping fields in this function
      this.validateAllMethodFormFields(supplierFormController);
      return;
    } else {

      if (supplierFormController.dirty) {

        const payload: any = this.constructSupplierObject();

        if (this.mode === "new") {
          this.loaderService.start();
          this.supplierService
            .createSupplier(payload)
            .subscribe(
              (data) => {
                if (data["status"] === true) {

                  this.selectedRowList = data.response;

                  this.selectedSupplierInfoObject = {
                    supplierId: data['response'].supplierId,
                    supplierCode: data['response'].supplierCode
                  };
                  this.canMoveToNext = true;

                  this.loaderService.stop();

                  this.mode = "edit";
                  this.supplierFormComponent.editSaveSupplierForm.markAsPristine();
                  this.enableRights();
                  this.supplierFormComponent.updateForm();

                  this.supplierFormComponent.editSaveSupplierForm.controls['supplierCode'].disable();

                  this.notificationService.smallBox({
                    severity: 'success',
                    title: this.translate.instant(
                      'common.notificationTitle.success'
                    ),
                    content: data['message'],
                    timeout: 5000,
                    icon: 'fa fa-check',
                  })

                } else {
                  this.loaderService.stop();
                  this.notificationService.smallBox({
                    title: this.translate.instant("common.notificationTitle.error"),
                    content: data["message"],
                    // color: "#a90329",
                    severity: 'error',
                    timeout: 5000,
                    icon: "fa fa-times",
                  });
                }
              },
            );
        } else {
          this.loaderService.start();
          this.supplierService
            .updateSupplier(payload)
            .subscribe(
              (data: any) => {
                this.mode = "edit";
                if (data["status"] === true) {
                  this.loaderService.stop();
                  this.selectedRowList = data.response;
                  this.supplierFormComponent.editSaveSupplierForm.controls['isActiveChanged'].setValue(false)
                  this.supplierFormComponent.editSaveSupplierForm.markAsPristine();
                  this.supplierInformationWizardError = false;

                  this.enableRights();
                  this.supplierFormComponent.updateForm();

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
                  this.loaderService.stop();
                  this.notificationService.smallBox({
                    title: this.translate.instant("common.notificationTitle.error"),
                    content: data["message"],
                    severity: 'error',
                    timeout: 5000,
                    icon: "fa fa-times",
                  });
                }
              },
              (err: any) => {
                if (err.status === 500) {
                  this.loaderService.stop();
                  this.notificationService.smallBox({
                    title: this.translate.instant("common.notificationTitle.error"),
                    content: err.error["value"],
                    severity: 'error',
                    timeout: 5000,
                    icon: "fa fa-times",
                  });
                }
              }
            );
        }
      } else {
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
  backToList() {

    if (this.supplierFormComponent?.editSaveSupplierForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant("common.Information.unsavedChangesInfo"),
        header: this.translate.instant("common.notificationTitle.confirmation"),
        accept: () => {
          this.showCreateSupplierContactAddress = false;
          this.showCreateSupplierMapParts = false;
          this.supplierInformationWizardError = false;
          this.showList = true;
          this.reset();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.showCreateSupplierContactAddress = false;
      this.showCreateSupplierMapParts = false;
      this.supplierInformationWizardError = false;
      this.showList = true;
      this.reset();

    }
  }

  checkFileMode(event: any, tabName: string, tabCount: any) {


    this.restrictTabWarning = true;
    this.tabNames = '';
    this.hideUnsavedErrorMessage = true;
    this.hideNewErrorMessage = true;
    this.restrictTabWarning = true;
    this.errorTabName = '';
    if (this.mode === 'new') {
      if (tabCount === 1) {
        this.showCreateSupplierContactAddress = false;
        this.showCreateSupplierMapParts = false;
        this.restrictTabWarning = true;
      } else {
        if (this.canMoveToNext) {
          this.showCreateSupplierContactAddress = false;
          this.showCreateSupplierMapParts = false;
          if (tabCount === 2) {

            if (event.stopPropagation) {
              event.stopPropagation();
            }
            this.restrictTabWarning = false;
            this.activeTab = tabCount;
          } else if (tabCount === 3) {

            if (event.stopPropagation) {
              event.stopPropagation();
            }
            this.restrictTabWarning = false;
            this.activeTab = tabCount;

          }
        } else {
          if (tabCount === 2) {
            this.showCreateSupplierMapParts = false;
            this.showCreateSupplierContactAddress = true;
            this.supplierInformationWizardError = false;
          } else {

            this.showCreateSupplierContactAddress = false;
            this.showCreateSupplierMapParts = true;
            this.supplierInformationWizardError = false;

          }

        }
      }
    } else {
      if (tabCount === 1) {
        this.activeTab = tabCount;
      } else

        if (tabCount === 2) {
          if (this.editSaveForm.dirty || this.editSaveForm.invalid) {
            if (!this.editSaveForm.invalid) {
              this.hideUnsavedErrorMessage = false;

              this.tabCount = 1;
              this.restrictTabWarning = true;
              if (event.stopPropagation) {
                event.stopPropagation();
              }
            } else {
              this.hideUnsavedErrorMessage = true;
              if (event.stopPropagation) {
                event.stopPropagation();
              }
              this.validateAllFormFields(this.editSaveForm);
            }
            this.supplierInformationWizardError = true;

          } else {
            this.activeTab = tabCount;
          }
        } else if (tabCount === 3) {
          if (this.editSaveForm.dirty || this.editSaveForm.invalid) {
            if (!this.editSaveForm.invalid) {
              this.hideUnsavedErrorMessage = false;
              this.tabCount = 1;
              this.restrictTabWarning = true;
              if (event.stopPropagation) {
                event.stopPropagation();
              }

            } else {

              this.hideUnsavedErrorMessage = true;
              if (event.stopPropagation) {
                event.stopPropagation();
              }
              this.validateAllFormFields(this.editSaveForm);
            }
            this.supplierInformationWizardError = true;

          } else {
            this.activeTab = tabCount;

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

  getPageRights(screenId: any) {

    // Enable rights for testing purpose.
    //  test start
    // this.createBit = false;
    // this.editBit = true;
    // this.viewBit = true;
    // this.enableRights();
    //  test end

    this.userAuthService
      .getPageRights(screenId, this.userAuthService.getCurrentPersonaId())
      .subscribe((data) => {
        if (data["status"] === true) {
          if (data["response"].length > 0) {
            this.createBit = data["response"][0].createBit;
            this.editBit = data["response"][0].editBit;
            this.viewBit = data["response"][0].viewBit;

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

  enableRights() {

    if (!this.editBit && !this.createBit && this.viewBit) {

      // only view
      if (this.mode == "new") {

        this.showWarningMessageForRoleRights = true;
        this.warningMessageForRoleRights = "common.roleRightsMessages.create";
        this.mode = "view";
        this.disableAddButton = true;
        this.disableSaveButton = false;
        this.disableAttachmentButton = false;
      } else {

        this.showWarningMessageForRoleRights = true;
        this.warningMessageForRoleRights = "common.roleRightsMessages.edit";
        this.mode = "view";
        this.disableAddButton = true;
        this.disableSaveButton = true;
        this.disableAttachmentButton = true;

      }
    } else if (!this.createBit && this.editBit && this.viewBit) {

      // edit and view
      if (this.mode == "new") {
        this.showWarningMessageForRoleRights = true;
        this.warningMessageForRoleRights = "common.roleRightsMessages.create";
        this.mode = "view";
        this.disableAddButton = true;
        this.disableSaveButton = false;
        this.disableAttachmentButton = false;
      } else {

        this.showWarningMessageForRoleRights = true;
        this.warningMessageForRoleRights = "common.roleRightsMessages.create";
        this.mode = "edit";
        this.disableAddButton = true;
        this.disableSaveButton = false;
        this.disableAttachmentButton = false;
      }
    } else if (this.createBit && !this.editBit && this.viewBit) {
      // create and view
      if (this.mode == "new") {
        this.mode = "new";
        this.disableAddButton = false;
        this.disableSaveButton = false;
        this.disableAttachmentButton = true;
        this.showWarningMessageForRoleRights = false;
        this.warningMessageForRoleRights = "";
      } else {
        this.mode = "view";
        this.disableAddButton = false;
        this.disableSaveButton = true;
        this.disableAttachmentButton = true;
        this.showWarningMessageForRoleRights = true;
        this.warningMessageForRoleRights = "common.roleRightsMessages.edit";
      }
    }
  }

}
