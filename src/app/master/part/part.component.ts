import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/core/services';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { PartService } from './service/part.service';
import { SharedLazyTableComponent } from 'src/app/shared/components/shared-lazy-table/shared-lazy-table.component';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';
import { ExcelService } from 'src/app/shared/services/export/excel/excel.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormCanDeactivate } from 'src/app/core/guards/form-can-deactivate';


@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrls: ['./part.component.css']
})
export class PartComponent extends FormCanDeactivate {
  @ViewChild('attachment') attachment: any;
  @ViewChild('PartForm') partFormComponent: any;
  @ViewChild("sharedLazyTable") sharedLazyTableChild: SharedLazyTableComponent | undefined;
  updateOver: any;
  editSaveForm!: FormGroup;
  partTableFilterFormGroup!: FormGroup;
  screenId: any = "";
  canMoveToNext: any;
  showForm: boolean = false;
  mode: string = 'new';
  noOfAttachment = 0; //To set initial number of attachments as 0
  saveButton: any = true;
  selectedPartCategoryList: any = [];
  selectedRowList: any = [];
  // grid data
  partCategoryDataList: any = [];
  partTableDataList: any[] | any = [];
  // file and name for upload template download
  excelDocument: any = {
    file: "assets/api/template/ImportPartMasterTemplate.xlsx",
    name: "ImportPartMasterTemplate.xlsx",
  };
  // temp table records
  tempSelectedCategoryRecords = [];
  tempPartSpecifications = [];
  partId: any = 0; //To set the initial partId as 0 
  excelDataTable!: any;
  isPartCategoryRequired: boolean = false;
  partCategoryFullRecords: any = [];
  partInformationObject: any
  serverSideProcessing!: any;
  totalDataGridCountComp: any;
  //----------------- Enable Rights Conditions ----------------- 
  createBit: boolean = true;
  editBit: boolean = true;
  viewBit: boolean = true;
  showWarningMessageForRoleRights: boolean = false;
  warningMessageForRoleRights: string = "";
  disableSaveButton: boolean = false;
  disableAttachmentButton: boolean = false;
  disableAddButton: boolean = false;
  currentUserName: any;
  currentCompanyId: any;
  currentUserId: any;
  excelFileName: any;
  uploadHeader: any;
  uploadDynamic: any;
  constructor(
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    public notificationService: NotificationService,
    private sharedTableStoreService: SharedTableStoreService,
    private translate: TranslateService,
    private userAuthService: UserAuthService,
    private partService: PartService,
    private loaderService: NgxUiLoaderService,
    private excelService: ExcelService,
    private router: Router
  ) {
    super();
    const snapshot: RouterStateSnapshot = router.routerState.snapshot;
    this.screenId = snapshot.root.queryParams['screenId'];
  }
  ngOnInit() {
    this.editSaveForm = this.formBuilder.group({
      partName: ['', [Validators.required]],
      partCode: ['', [Validators.required]],
      partId: ['', []],
      partType: [[], [Validators.required]],
      partCategory: ['', []],
      ledgerId: ['', []],
      planningStrategy: [[], [Validators.required]],
      movementFrequency: [[], []],
      reOrderLevel: [
        '',
        [Validators.required, Validators.min(1), Validators.max(999999999)],
      ],
      reOrderQuantity: [
        '',
        [Validators.required, Validators.min(1), Validators.max(999999999)],
      ],
      stockUom: [[], [Validators.required]],
      remarks: ['', []],
      active: [true, []],
      hazardous: [false, []],
    });

    this.partTableFilterFormGroup = this.formBuilder.group({
      partNo: ["", []],
      partDescription: ["", []],
      partType: ["", []],
      partCategory: ["", []],
      stockUom: ["", []],
      modifiedBy: ["", []],
      modifiedDate: ["", []],
      activeStatus: ["", []],
    })
    this.excelFileName = this.translate.instant('master.part.titles.partList')
    this.uploadHeader = this.translate.instant('master.part.titles.uploadHeader')
    this.uploadDynamic = this.translate.instant('master.part.titles.part')

    this.partService.tempTableCategory.subscribe((items: any) => {
      this.tempSelectedCategoryRecords = items;
    });
    this.partService.tempTable.subscribe((items: any) => {
      this.tempPartSpecifications = items;
    });
    this.getPageRights(this.screenId);
    this.currentUserName = this.userAuthService.getCurrentUserName();
    this.currentCompanyId = this.userAuthService.getCurrentCompanyId()
    this.currentUserId = this.userAuthService.getCurrentUserId()

  }
  columnHeaderList = [
    {
      field: "partNo",
      header: this.translate.instant('master.part.grid.titles.partCode'),
      width: "8%",
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: "partDescription",
      header: this.translate.instant('master.part.grid.titles.partName'),
      width: "12%",
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: "partType",
      header: this.translate.instant('master.part.grid.titles.partType'),
      width: "8%",
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: "partCategory",
      header: this.translate.instant('master.part.grid.titles.partCategory'),
      width: "24%",
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: "stockUom",
      header: this.translate.instant("master.part.grid.titles.stockUom"),
      width: "10%",
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: "modifiedBy",
      header: this.translate.instant("master.part.grid.titles.modifiedBy"),
      width: "10%",
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: "modifiedDate",
      header: this.translate.instant("master.part.grid.titles.modifiedDate"),
      width: "12%",
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: "activeStatus",
      header: this.translate.instant("master.part.grid.titles.active"),
      width: "8%",
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },

  ];

  uploadColumnHeaderList: any = [
    {
      rowspan: "2",
      field: "partCode",
      header: this.translate.instant("master.part.grid.titles.partCode"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },

    {
      rowspan: "2",
      field: "partDescription",
      header: this.translate.instant("master.part.grid.titles.partCode"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      rowspan: "2",
      field: "partType",
      header: this.translate.instant("master.part.grid.titles.partType"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      rowspan: "2",
      field: "ledgerId",
      header: this.translate.instant("master.part.grid.titles.ledgerId"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      rowspan: "2",
      field: "movementFrequency",
      header: this.translate.instant("master.part.grid.titles.movementFrequency"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      rowspan: "2",
      field: "planningStrategy",
      header: this.translate.instant("master.part.grid.titles.planningStrategy"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      rowspan: "2",
      field: "reOrderLevel",
      header: this.translate.instant("master.part.grid.titles.reOrderLevel"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      rowspan: "2",
      field: "reOrderQuantity",
      header: this.translate.instant("master.part.grid.titles.reOrderQuantity"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
    {
      rowspan: "2",
      field: "stockUOM",
      header: this.translate.instant("master.part.grid.titles.stockUom"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      rowspan: "2",
      field: "partSpecification",
      header: this.translate.instant("master.part.grid.titles.partSpecification"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },
    {
      rowspan: "2",
      field: "partSpecificationValue",
      header: this.translate.instant("master.part.grid.titles.value"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
    {
      rowspan: "2",
      field: "partSpecificationUom",
      header: this.translate.instant("master.part.grid.titles.uom"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 12,
    },
    {
      rowspan: "2",
      field: "isoCode",
      header: this.translate.instant("master.part.grid.titles.isoCode"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 13,
    },
    {
      rowspan: "2",
      field: "hazardous",
      header: this.translate.instant("master.part.grid.titles.hazardous"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 14,
    },
    {
      rowspan: "2",
      field: "remarks",
      header: this.translate.instant("master.part.grid.titles.remarks"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 15,
    },
    {
      rowspan: "2",
      field: "activeStatus",
      header: this.translate.instant("master.part.grid.titles.active"),
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 16,
    },

    {
      rowspan: "2",
      field: "errorMessage",
      header: this.translate.instant("master.part.grid.titles.errorMessage"),
      width: "3%",
      type: "string",
      isSubHeader: false,
    },
  ]

  //to recieve row data on row click
  receiveTableRowData(event: any) {
    this.selectedRowList = event;
    this.partId = event.partId;
    this.mode = 'edit';
    this.partInformationObject = {
      partId: event.partId,
      partCode: event.partNo
    }
    this.partId = event.partId;
    this.noOfAttachment = event.noOfAttachment;

    this.showForm = true;
    this.enableRights();
  }

  //to show new form on add icon click
  addIconClick(event: any) {
    this.showForm = true;
    this.reset();
  }
  //to show new forms for adding new parts
  addnewPart() {
    if (this.partFormComponent.editPartSaveForm.dirty ||
      this.partFormComponent.purchasePartSpecificationForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant("common.Information.unsavedChangesInfo"),
        header: this.translate.instant("common.notificationTitle.confirmation"),
        accept: () => {
          this.canMoveToNext = false;
          this.reset();
          this._markFormPristine(this.partFormComponent.editPartSaveForm);
          this._markFormPristine(this.partFormComponent.purchasePartSpecificationForm);
          this.partFormComponent.hideUnsavedErrorMessage = true;
          this.partFormComponent.addNewForm();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.canMoveToNext = false;
      this.reset();
      this._markFormPristine(this.partFormComponent.editPartSaveForm);
      this._markFormPristine(this.partFormComponent.purchasePartSpecificationForm);
      this.partFormComponent.addNewForm();
    }

  }
  private _markFormPristine(form: FormGroup): void {
    Object.keys(form.controls).forEach((control) => {
      form.controls[control].markAsPristine();
      form.controls[control].markAsUntouched();
    });
  }
  // to reset everything to the base value, to reset all forms, to reset in to new mode
  reset() {
    this.partId = 0;
    this.noOfAttachment = 0;
    this.mode = 'new';
    this.selectedRowList = [];
    this.partCategoryFullRecords = [];
    this.partFormComponent.editPartSaveForm.reset();
    this.partFormComponent.purchasePartSpecificationForm.reset();
    this.partFormComponent.editPartSaveForm.controls['partCode'].enable();
    this.isPartCategoryRequired = false;
    this.partFormComponent?.markAsUnDirtyPartCategory();
    this.partInformationObject = {
      partId: 0,
      partCode: null
    }
    this.enableRights();
  }
  //to check if all fields in form has required validations
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

  // to create params as an object for creating nd updating parts
  constructPartObject() {
    const selectedIsoMappingList = this.tempSelectedCategoryRecords.map((row: any) => {
      return row;
    })
    const partSpecificationsRecords = this.tempPartSpecifications.map((row: any) => {
      row.CreatedBy = this.currentUserName;
      row.ModifiedBy = this.currentUserName;
      return row;
    })

    const formValues = this.partFormComponent.editPartSaveForm.value;

    if (this.mode === "new") {
      // Temp Part Specification list
      let partSpecificationList = this.partFormComponent.partSpecificationList;
      partSpecificationList = partSpecificationList.map((item: any) => {
        delete item['partSpecification'];
        delete item['uom'];
        item.CreatedBy = this.currentUserName;
        item.ModifiedBy = this.currentUserName;
        return item;
      })

      const partObject = {
        PartCode: formValues.partCode,
        PartName: formValues.partName,
        PartTypeId: formValues.partType?.enumId,
        LedgerID: formValues.ledgerId,
        MovementFrequencyId: formValues.movementFrequency?.enumId,
        PlanningStrategyId: formValues.planningStrategy?.enumId,
        ReOrderLevel: formValues.reOrderLevel,
        ReOrderQuantity: formValues.reOrderQuantity,
        StockUOMId: formValues.stockUom.unitId,
        Remarks: formValues.remarks,
        Hazardous: formValues.hazardous || false,
        Active: formValues.active || false,
        CreatedBy: this.currentUserName,
        ModifiedBy: this.currentUserName,
        PartIsoCodeMappings: selectedIsoMappingList,
        PurchasePartSpecifications: partSpecificationList
      }
      return partObject;

    } else if (this.mode == 'edit') {
      const selectedRowList = this.selectedRowList;
      let partSpecificationList = this.partFormComponent.partSpecificationList;

      partSpecificationList = partSpecificationList.map((item: any) => {

        delete item['partSpecification'];
        delete item['uom'];
        item.partId = selectedRowList.partId;
        item.Created = item.created;
        item.Modified = item.Modified;
        item.CreatedBy = this.currentUserName;
        item.ModifiedBy = this.currentUserName;
        return item;
      })

      const partCategoryListInitial = this.partFormComponent.partCategoryListInitial;
      const partIsoMappingList = this.selectedPartCategoryList.map((item: any) => {
        item.isoMappingId = item.isoMappingId;
        item.partIsoMappingId = item.partIsoMappingId;
        item.partId = selectedRowList.partId;
        return item;
      })

      const removedItems = partCategoryListInitial.filter(
        (initialItem: any) =>
          !selectedIsoMappingList.some((selectedItem: any) => selectedItem.id === initialItem.id)
      );

      const newlySelectedItems = partIsoMappingList.filter(
        (selectedItem: any) => selectedItem.partIsoMappingId == 0
      );

      if (this.partFormComponent.changeCategoryPopup == true) {
        const newIsoMappingList = removedItems.map((item: any) => {
          item.isoMappingId = item.isoMappingId;
          item.partIsoMappingId = item.partIsoMappingId;
          item.partId = selectedRowList.partId;
          item.ActionType = "remove"
          return item;
        })

        this.partCategoryFullRecords = [...newIsoMappingList, ...newlySelectedItems];
      } else {
        this.partCategoryFullRecords = [...newlySelectedItems];
      }

      const partObject = {
        PartId: selectedRowList.partId,
        PartCode: this.partInformationObject.partCode,
        PartName: formValues.partName,
        PartTypeId: formValues.partType?.enumId,
        LedgerID: formValues.ledgerId,
        MovementFrequencyId: formValues.movementFrequency?.enumId,
        PlanningStrategyId: formValues.planningStrategy?.enumId,
        ReOrderLevel: formValues.reOrderLevel,
        ReOrderQuantity: formValues.reOrderQuantity,
        StockUOMId: formValues.stockUom.unitId,
        Remarks: formValues.remarks,
        Hazardous: formValues.hazardous,
        Active: formValues.active,
        CreatedBy: selectedRowList.createdBy,
        Created: selectedRowList.createdFullDate || selectedRowList.created,
        Modified: selectedRowList.modifiedFullDate || selectedRowList.modified,
        ModifiedBy: this.currentUserName,
        PartIsoCodeMappings: this.partCategoryFullRecords,
        PurchasePartSpecifications: partSpecificationList
      }
      return partObject;
    } else {
      return false;
    }
  }
  //to handle create and update part
  async onSubmit() {
    if (this.partCategoryFullRecords.length == 0 && this.partFormComponent.modalSelectedData.length == 0 && this.partFormComponent.partCategoryListInitial.length == 0) {
      this.isPartCategoryRequired = true;
    } else {
      this.isPartCategoryRequired = false;
    }
    if (this.partFormComponent.editPartSaveForm.invalid || this.partFormComponent.partSpecificationList.length == 0 || this.isPartCategoryRequired) {
      this.validateAllMethodFormFields(this.partFormComponent.editPartSaveForm);
      if (this.partFormComponent.partSpecificationList.length == 0) {
        this.validateAllMethodFormFields(this.partFormComponent.purchasePartSpecificationForm);
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant(
            'master.part.errors.partSpecificationNotConfigured'
          ),
          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
      }
      return;
    } else {
      if (this.partFormComponent.editPartSaveForm.dirty || this.partFormComponent.purchasePartSpecificationForm.dirty || this.partFormComponent.changeCategoryPopup == true) {
        const createPartPayload: any = await this.constructPartObject();
        if (this.mode === "new") {
          this.loaderService.start();
          this.partService
            .createPart(createPartPayload)
            .subscribe(
              (data) => {
                if (data["status"] === true) {
                  this.partId = data['response'].partId
                  this.selectedRowList = data.response;
                  this.partInformationObject = {
                    partId: data['response'].partId,
                    partCode: data['response'].partCode
                  };
                  this.canMoveToNext = true;
                  this.loaderService.stop();
                  this.mode = "edit";
                  this.partFormComponent.GetPartSpecificationList(this.selectedRowList.partId)
                  this.partFormComponent.editPartSaveForm.markAsPristine();
                  this.partFormComponent.editPartSaveForm.controls['partCode'].disable();
                  this.partFormComponent.purchasePartSpecificationForm.markAsPristine();
                  this.partFormComponent?.markAsUnDirtyPartCategory();

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
        } else {
          this.loaderService.start();
          this.partService
            .updatePart(createPartPayload)
            .subscribe(
              (data) => {
                this.mode = "edit";
                if (data["status"] === true) {
                  this.loaderService.stop();
                  this.partFormComponent.GetPartSpecificationList(this.selectedRowList.partId)
                  this.selectedRowList = data.response;
                  this.partFormComponent.editPartSaveForm.markAsPristine();
                  this.partFormComponent.purchasePartSpecificationForm.markAsPristine();
                  this.partFormComponent?.markAsUnDirtyPartCategory();
                  this.canMoveToNext = true;
                  this.updateOver = true;
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
              (err) => {
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
  //go back to grid screen and reset all forms
  backToList() {
    if (this.partFormComponent.editPartSaveForm.dirty ||
      this.partFormComponent.purchasePartSpecificationForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant("common.Information.unsavedChangesInfo"),
        header: this.translate.instant("common.notificationTitle.confirmation"),
        accept: () => {
          this.showForm = false;
          this.reset();
          this.canMoveToNext = false;
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.canMoveToNext = false;
      this.showForm = false;
      this.reset();
    }
  }

  attachmentOutPutEvent(event: any) {
    this.loaderService.start();
    this.noOfAttachment = event;
    this.loaderService.stop();
  }


  // to get datas for lazy load grid
  getPartsListServerSide(params: any) {
    this.serverSideProcessing = {
      CurrentPage: params.first,
      GlobalFilter: params.globalFilter != undefined
        ? params.globalFilter
        : this.sharedLazyTableChild != undefined
          ? this.sharedLazyTableChild.globalFilter.value
          : null,
      PageSize: params.rows,
      SortField: params.sortField ? params.sortField : "sortOnly",
      SortOrder: params.sortField
        ? params.sortOrder
          ? params.sortOrder
          : -1
        : -1,
      partNo: this.partTableFilterFormGroup.value.partNo || "",
      partDescription: this.partTableFilterFormGroup.value.partDescription || "",
      partType: this.partTableFilterFormGroup.value.partType || "",
      partCategory: this.partTableFilterFormGroup.value.partCategory || "",
      stockUom: this.partTableFilterFormGroup.value.stockUom || "",
      modifiedBy: this.partTableFilterFormGroup.value.modifiedBy || "",
      modifiedDate: this.partTableFilterFormGroup.value.modifiedDate || "",
      active: this.partTableFilterFormGroup.value.activeStatus || "",
    };
    this.loaderService.start();
    this.partService
      .getPartsListServerSide(
        this.serverSideProcessing,
        this.currentCompanyId,
        this.currentUserId
      )
      .subscribe((data: any) => {
        this.partTableDataList = data["response"].result;
        this.totalDataGridCountComp = data["response"].filterRecordCount;
        this.sharedTableStoreService.setAssignGridData({ data, params });
        this.loaderService.stop();
      });
    this.loaderService.stop();

  }
  //function to export datas to excel
  exportToExcel(event: any) {
    let newColumns = event.columns.filter((key: any) => key.field != 'checkbox')
    newColumns.map((item: { [x: string]: any; field: string; }) => {
    })
    this.excelDataTable = [];
    this.excelDataTable.columns = newColumns;
    this.excelDataTable.filteredValue = undefined;
    let dowloaded: boolean;

    let params: any = { first: 0, rows: this.totalDataGridCountComp };
    const serverSideProcessing = {
      CurrentPage: params.first,
      GlobalFilter: params.globalFilter != undefined
        ? params.globalFilter
        : this.sharedLazyTableChild != undefined
          ? this.sharedLazyTableChild.globalFilter.value
          : null,
      PageSize: params.rows,
      SortField: params.sortField ? params.sortField : "sortOnly",
      SortOrder: params.sortField
        ? params.sortOrder
          ? params.sortOrder
          : -1
        : -1,
      partNo: this.partTableFilterFormGroup.value.partNo || "",
      partDescription: this.partTableFilterFormGroup.value.partDescription || "",
      partType: this.partTableFilterFormGroup.value.partType || "",
      partCategory: this.partTableFilterFormGroup.value.partCategory || "",
      stockUom: this.partTableFilterFormGroup.value.stockUom || "",
      modifiedBy: this.partTableFilterFormGroup.value.modifiedBy || "",
      modifiedDate: this.partTableFilterFormGroup.value.modifiedDate || "",
      active: this.partTableFilterFormGroup.value.activeStatus || "",
    };
    this.loaderService.start();
    this.partService
      .getPartsListServerSide(
        serverSideProcessing,
        this.currentCompanyId,
        this.currentUserId
      )
      .subscribe((data: any) => {
        this.excelDataTable.value = data["response"].result;
        dowloaded = this.excelService.exportAsExcelFile(this.excelDataTable, "Part List", false);
        this.loaderService.stop();
      });
    this.loaderService.stop();
  }

  //get selected part category from child component
  getSelectedPartCategory(event: any) {
    this.selectedPartCategoryList = event;
    this.partService.tempTableCategory.subscribe((items: any) => {
    });
  }



  //page rights
  getPageRights(screenId: any) {
    this.enableRights();
    
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
  //role rights
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
        this.disableAttachmentButton = false;
        this.showWarningMessageForRoleRights = true;
        this.warningMessageForRoleRights = "common.roleRightsMessages.edit";
      }
    }
  }



}
