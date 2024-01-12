import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/core/services';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { ExcelService } from 'src/app/shared/services/export/excel/excel.service';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';
import { SharedLazyTableComponent } from 'src/app/shared/components/shared-lazy-table/shared-lazy-table.component';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { Router, RouterStateSnapshot } from "@angular/router";
import { FormCanDeactivate } from 'src/app/core/guards/form-can-deactivate';
import { StoreService } from './service/store.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
})
export class StoreComponent extends FormCanDeactivate {

  @ViewChild('storeRateModal') storeRateModal: any;
  @ViewChild("sharedLazyTable") sharedLazyTableChild: SharedLazyTableComponent | undefined;
  @ViewChild('attachment') attachment: any;
  @ViewChild('StoreInformationComponent') StoreInformationComponent: any;
  @ViewChild('storeInformation') storeInformation: any;

  noOfAttachment = 0;
  selectedRowList: any = [];
  parentStoreId: any;
  showList: boolean = true;
  mode: string = 'new';
  addButton: boolean = false;
  addNew: boolean = false;
  saveButton: boolean = true;
  addStoreRateBtn: boolean = false;
  editSaveForm!: FormGroup;
  zoneDetailsForm!: FormGroup;
  binDetailsForm!: FormGroup;
  storeKeeperDetailsForm!: FormGroup;
  storeTableFilterFormGroup!: FormGroup;
  serverSideProcessingObject!: any;
  activeTab: number = 1;  //initial tab
  storeRecordsList: any;
  totalDataGridCountComp: any;
  excelDataTable!: any;
  canMoveToNext = false;
  showCreateStore = false;
  showSaveStoreError = false;
  submitted: boolean = false;
  screenId: any = "";
  //----------------- Enable Rights Conditions ----------------- 
  createBit: boolean = true;
  editBit: boolean = true;
  viewBit: boolean = true;

  showWarningMessageForRoleRights: boolean = false;
  warningMessageForRoleRights: string = "";

  disableSaveButton: boolean = false;
  disableAttachmentButton: boolean = false;
  disableAddButton: boolean = false;
  screenName: string = this.translate.instant("master.store.titles.storeList");
  storeRateForm!: FormGroup;
  storeRateMode: string = 'new';
  storeRateSubmitted: boolean = false;
  storeRateDetails: boolean = false;
  columnHeaderList = [

    {
      field: 'storeCode',
      header: this.translate.instant("master.store.grid.storeCode"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,

    },
    {
      field: 'storeName',
      header: this.translate.instant("master.store.grid.storeName"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'depot',
      header: this.translate.instant("master.store.grid.depot"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'modifiedBy',
      header: this.translate.instant("master.store.grid.modifiedBy"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'modifiedFormatDate',
      header: this.translate.instant("master.store.grid.modifiedDate"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'activeStatus',
      header: this.translate.instant("master.store.grid.active"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private loaderService: NgxUiLoaderService,
    private userAuthService: UserAuthService,
    private sharedTableStoreService: SharedTableStoreService,
    public notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private localeService: BsLocaleService,
    private excelService: ExcelService,
    private router: Router,
    private storeService: StoreService,
  ) {
    super();
    enGbLocale.invalidDate = '';
    defineLocale('custom locale', enGbLocale);
    this.localeService.use('custom locale');

    const snapshot: RouterStateSnapshot = router.routerState.snapshot;
    this.screenId = snapshot.root.queryParams['screenId'];

  }

  ngOnInit() {

    this.editSaveForm = this.formBuilder.group({
      depot: [[], [Validators.required]],
      storeName: ['', []],
      storeCode: ['', [Validators.required]],
      remarks: ['', []],
      depotId: ['', []],
      active: [true, []],
      isActiveChanged: [false, []]
    });

    this.storeRateForm = this.formBuilder.group({
      dropdown: [[], [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', []],
    });
    this.zoneDetailsForm = this.formBuilder.group({
      zoneCode: [[], [Validators.required]],
      zoneName: ['', []],
      remarks: ['', []],
    });
    this.binDetailsForm = this.formBuilder.group({
      binCode: [[], [Validators.required]],
      binName: ['', []],
      remarks: ['', []],
    });
    this.storeKeeperDetailsForm = this.formBuilder.group({
      storeKeeper: [[], [Validators.required]],
      designation: ['', []],
      emailId: ['', []],
      mobileNo: ['', []],
      landlineNo: ['', []],
      keyPerson: [false, []],
    });
    this.storeTableFilterFormGroup = this.formBuilder.group({
      storeCode: ["", []],
      storeName: ["", []],
      depot: ["", []],
      activeStatus: ["", []],
      modifiedBy: ["", []],
      modifiedFormatDate: ["", []]
    })

    this.getPageRights(this.screenId);
  }


  exportToExcel(event: any) {
    let newColumns = event.columns.filter((key: any) => key.field != 'checkbox')
    newColumns.map((item: { [x: string]: any; field: string; }) => {

    })
    this.excelDataTable = [];
    this.excelDataTable.columns = newColumns;
    this.excelDataTable.filteredValue = undefined;
    let dowloaded: boolean;


    let params: any = { first: 0, rows: this.totalDataGridCountComp };

    const serverSideProcessingObject = {
      CurrentPage: params.first,
      GlobalFilter: params.globalFilter != undefined ? params.globalFilter : this.sharedLazyTableChild != undefined ? this.sharedLazyTableChild.globalFilter.value : null,
      PageSize: params.rows,
      SortField: params.sortField ? params.sortField : "sortOnly",
      SortOrder: params.sortField ? params.sortOrder ? params.sortOrder : -1 : -1,

      storeCode: this.storeTableFilterFormGroup.value.storeCode || "",
      storeName: this.storeTableFilterFormGroup.value.storeName || "",
      depot: this.storeTableFilterFormGroup.value.depot || "",
      modifiedBy: this.storeTableFilterFormGroup.value.modifiedBy || "",
      modifiedDate: this.storeTableFilterFormGroup.value.modifiedFormatDate || "",
      activeStatus: this.storeTableFilterFormGroup.value.activeStatus || "",
    };


    this.loaderService.start();

    this.storeService
      .getStoreListServerSide(
        serverSideProcessingObject,
        this.userAuthService.getCurrentCompanyId(),
        this.userAuthService.getCurrentUserId()
      )
      .subscribe((data: any) => {

        this.excelDataTable.value = data["response"].result;
        dowloaded = this.excelService.exportAsExcelFile(this.excelDataTable, this.screenName, false);
        this.loaderService.stop();
      });
    this.loaderService.stop();
  }
  getStoreListServerSide(params: any) {

    this.serverSideProcessingObject = {
      CurrentPage: params.first,
      GlobalFilter: params.globalFilter != undefined ? params.globalFilter : this.sharedLazyTableChild != undefined ? this.sharedLazyTableChild.globalFilter.value : null,
      PageSize: params.rows,
      SortField: params.sortField ? params.sortField : "sortOnly",
      SortOrder: params.sortField ? params.sortOrder ? params.sortOrder : -1 : -1,

      storeCode: this.storeTableFilterFormGroup.value.storeCode || "",
      storeName: this.storeTableFilterFormGroup.value.storeName || "",
      depot: this.storeTableFilterFormGroup.value.depot || "",
      modifiedBy: this.storeTableFilterFormGroup.value.modifiedBy || "",
      modifiedDate: this.storeTableFilterFormGroup.value.modifiedFormatDate || "",
      activeStatus: this.storeTableFilterFormGroup.value.activeStatus || "",
    };
    this.loaderService.start();

    this.storeService
      .getStoreListServerSide(
        this.serverSideProcessingObject,
        this.userAuthService.getCurrentCompanyId(),
        this.userAuthService.getCurrentUserId()
      )
      .subscribe((data: any) => {
        this.storeRecordsList = data["response"].result;
        this.totalDataGridCountComp = data["response"].filterRecordCount;
        this.sharedTableStoreService.setAssignGridData({ data, params });
        this.loaderService.stop();
      });

  }


  addNewRecord() {

    if (this.editSaveForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant("common.Information.unsavedChangesInfo"),
        header: this.translate.instant("common.notificationTitle.confirmation"),
        accept: () => {
          this.showList = false;
          this.parentStoreId = 0;
          this.storeInformation.addNewForm();
          this.storeInformation.resetZoneGrid();
          this.storeInformation.resetStoreKeeper();
          this.editSaveForm.reset();
          this.mode = "new";
          this.enableRights();
        },
        reject: () => {
          return false;
        },
      });
    } else {

      this.showList = false;
      this.parentStoreId = 0;
      this.storeInformation.addNewForm();
      this.storeInformation.resetZoneGrid();
      this.storeInformation.resetStoreKeeper();
      this.editSaveForm.reset();
      this.mode = "new";
      this.enableRights();
    }

  }
  addIconClick(event: any, mode: any) {
    this.editSaveForm.reset();
    this.editSaveForm.controls['active'].setValue(true);
    this.mode = mode;
    this.showList = false;
    this.parentStoreId = 0;
    this.enableRights();

  }
  receiveTableRowData(event: any) {
    this.mode = 'edit';
    this.parentStoreId = event.storeId;
    this.selectedRowList = event;
    this.showList = false;
    this.noOfAttachment = event.noOfAttachment;

    this.editSaveForm.patchValue({
      ...event,
      depot: {
        depotCode: event.depot,
        depotId: event.depotId,
      }

    });
    this.enableRights();
  }
  backToList() {

    if (this.editSaveForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant("common.Information.unsavedChangesInfo"),
        header: this.translate.instant("common.notificationTitle.confirmation"),
        accept: () => {
          this.activeTab = 1;
          this.showList = true;
          this.noOfAttachment = 0;
          this.parentStoreId = 0;
          this.mode = "new";
          this.enableRights();
          this.showCreateStore = false;
          this.showSaveStoreError = false;
          this.editSaveForm.reset();

        },
        reject: () => {
          return false;
        },
      });
    } else {

      this.activeTab = 1;
      this.showList = true;
      this.noOfAttachment = 0;
      this.parentStoreId = 0;
      this.mode = "new";
      this.enableRights();
      this.showCreateStore = false;
      this.showSaveStoreError = false;
      this.editSaveForm.reset();
    }

  }


  checkFileMode(event: any, activeTab: any) {


    if (this.mode === 'new') {
      this.showCreateStore = false;


      if (activeTab === 1) {
        this.showCreateStore = false;
      } else {
        if (this.canMoveToNext) {
          this.showCreateStore = false;
          if (activeTab === 2) {

            if (event.stopPropagation) {
              event.stopPropagation();
            }
            this.activeTab = activeTab;
          }
        } else {
          if (activeTab === 2) {
            this.showCreateStore = true;
            this.showSaveStoreError = false;
          } else {
            this.showCreateStore = false;
            this.showSaveStoreError = false;
          }

        }
      }
    } else {
      if (activeTab === 1) {
        this.activeTab = activeTab;
      } else

        if (activeTab === 2) {

          if (this.editSaveForm.dirty || this.editSaveForm.invalid) {
            if (!this.editSaveForm.invalid) {

              this.showCreateStore = true;
              this.showSaveStoreError = false;

              this.activeTab = 1;

              if (event.stopPropagation) {
                event.stopPropagation();
              }
            } else {
              this.showCreateStore = true;
              this.showSaveStoreError = false;
              if (event.stopPropagation) {
                event.stopPropagation();
              }
              this.validateAllFormFields(this.editSaveForm);
            }

          } else if (this.StoreInformationComponent?.storeKeeperGridData?.length == 0 || this.StoreInformationComponent?.zoneGridTableInitialData?.length == 0 || this.StoreInformationComponent?.zoneGridTableInitialData?.length == undefined || this.StoreInformationComponent?.storeKeeperGridData?.length == undefined) {

            this.showSaveStoreError = true;
            this.showCreateStore = false;
            if (event.stopPropagation) {
              event.stopPropagation();
            }

          } else {
            this.showSaveStoreError = false;
            this.showCreateStore = false;
            this.activeTab = activeTab;
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
  async onSubmit() {
    if (this.editSaveForm.invalid) {
      this.validateAllMethodFormFields(this.editSaveForm);
      return;
    } else {
      if (this.editSaveForm.dirty) {
        const createStorePayload: any = await this.constructStoreObject();
        if (this.mode === "new") {
          this.loaderService.start();
          this.storeService
            .createStore(createStorePayload)
            .subscribe(
              (data: any) => {
                if (data["status"] === true) {
                  this.parentStoreId = data['response'].storeId;
                  this.selectedRowList = data.response;
                  this.canMoveToNext = true;
                  this.showCreateStore = false;
                  this.showSaveStoreError = false;
                  this.loaderService.stop();
                  this.mode = "edit";
                  this.editSaveForm.markAsPristine();
                  this.enableRights();
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
                    severity: 'error',
                    timeout: 5000,
                    icon: "fa fa-times",
                  });
                }
              },
            );
        }
        else {
          this.loaderService.start();
          this.storeService
            .updateStore(createStorePayload)
            .subscribe(
              (data: any) => {
                this.mode = "edit";
                if (data["status"] === true) {
                  this.loaderService.stop();
                  this.showSaveStoreError = false;
                  this.editSaveForm.controls['isActiveChanged'].setValue(false);
                  this.editSaveForm.markAsPristine();
                  this.selectedRowList = data['response'];
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
              (err: any) => {
                if (err.status === 500) {
                  this.loaderService.stop();
                  this.notificationService.smallBox({
                    title: this.translate.instant("common.notificationTitle.error"),
                    content: err.error["value"],
                    // color: "#a90329",
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

  constructStoreObject() {
    const formValues = this.editSaveForm.value;

    if (this.mode === "new") {
      const storeObject = {
        DepotId: formValues.depot.depotId,
        StoreName: formValues.storeName,
        StoreCode: formValues.storeCode,
        Remarks: formValues.remarks,
        Active: formValues.active || false,
        CreatedBy: this.userAuthService.getCurrentUserName(),
        ModifiedBy: this.userAuthService.getCurrentUserName()
      }


      return storeObject;
    }
    else if (this.mode === "edit") {
      const storeObject = {
        DepotId: formValues.depot.depotId || formValues.depotId,
        StoreName: formValues.storeName,
        StoreCode: formValues.storeCode,
        Remarks: formValues.remarks,
        Active: formValues.active || false,
        StoreId: this.selectedRowList.storeId,
        CreatedBy: this.selectedRowList.createdBy,
        Created: this.selectedRowList.created,
        Modified: this.selectedRowList.modified,
        ModifiedBy: this.userAuthService.getCurrentUserName(),
        isActiveChanged: this.editSaveForm.controls['isActiveChanged'].value || false
      }
      return storeObject;
    }
    else {
      return false;
    }

  }


  cardMinimize(key: any) {
    var element: any = document.getElementsByClassName(key);
    element[0].classList.remove("fullscreen");
    var element2: any = document.getElementsByClassName('p-accordion-content');
  }

  cardMaximize(key: any) {
    var element: any = document.getElementsByClassName(key);
    var element2: any = document.getElementsByClassName('p-accordion-content');
  }



  initialStoreFormGroup() {
    this.storeRateForm = this.formBuilder.group({
      dropdown: [[], [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', []],
    });
  }


  get storeRateFormControls(): any {
    return this.storeRateForm.controls;
  }



  openStoreRateDialog(modeType: string) {
    this.storeRateModal.show();
  }
  closeStoreRateDialog() {
    this.storeRateModal.hide();
  }

  contactFormReset() {
    this.resetContact();
  }

  resetContact() {
    this.storeRateMode = 'new';
    this.storeRateSubmitted = false;
    this.storeRateForm.reset();
    this.storeRateForm.markAsPristine();
    this.noOfAttachment = 0;
    this.parentStoreId = 0;
  }

  checkNgSelectCustomValidator(event: any, controlName: any) {
    const control: any = this.storeRateForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors.required = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });
    } else {
      control.setErrors(null);
    }
  }

  attachmentOutPutEvent(event: any) {
    this.loaderService.start();
    this.noOfAttachment = event;
    this.loaderService.stop();
  }


  getPageRights(screenId: any) {
    this.enableRights();
    this.userAuthService
      .getPageRights(screenId, this.userAuthService.getCurrentPersonaId())
      .subscribe((data) => {


        if (data["status"] === true) {
          if (data["response"].length > 0) {
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
        this.disableAttachmentButton = false;
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
        this.disableAttachmentButton = false;
        this.showWarningMessageForRoleRights = true;
        this.warningMessageForRoleRights = "common.roleRightsMessages.edit";
      }
    }
  }


}
