import { Component, Input, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/core/services';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { ExcelService } from 'src/app/shared/services/export/excel/excel.service';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';
import { Router, RouterStateSnapshot } from '@angular/router';
import { StoreService } from '../service/store.service';
import { StorePartMapping } from '../models/part-mapping.model';

@Component({
  selector: 'app-store-part-mapping',
  templateUrl: './part-mapping.component.html',
  styleUrls: ['./part-mapping.component.css'],
})
export class StorePartMappingComponent {
  @ViewChild('addPartMappingModel') addPartMappingModel: any;
  @ViewChild('partCategoryModel') partCategoryModel: any;
  @ViewChild('purchasePartSpecificationModal')
  purchasePartSpecificationModal: any;

  @Input() createBit!: boolean;
  @Input() editBit!: boolean;
  @Input() viewBit!: boolean;

  partMappingMode: string = 'new';
  addButton: boolean = false;
  addNew: boolean = false;
  mode: string = 'new';
  saveButton: boolean = true;
  showWarningMessage: boolean = false;
  addStoreRateBtn: boolean = false;
  @Input() parentStoreId: any;
  editSaveForm!: FormGroup;
  IsCombinationErr: boolean = false;
  getDataFromTable: any;
  activeTab: number = 1; //set first wizard as the current active tab
  purchasePartSpecificationData: any;
  excelFileName = this.translate.instant('master.store.partMapping.excelName');
  submitted: boolean = false;
  ddL: any = [];

  columnHeaderList = [
    {
      field: 'zoneCode',
      header: this.translate.instant('master.store.grid.zoneCode'),
      width: '7%',
      key: 1,
    },
    {
      field: 'binCode',
      header: this.translate.instant('master.store.grid.binCode'),
      width: '7%',
      key: 2,
    },
    {
      field: 'partType',
      header: this.translate.instant('master.store.grid.partType'),
      width: '6%',
      key: 3,
    },
    {
      field: 'partCategory',
      header: this.translate.instant('master.store.grid.partCategory'),
      width: '8%',
      key: 4,
    },
    {
      field: 'partCode',
      header: this.translate.instant('master.store.grid.partCode'),
      width: '7%',
      key: 5,
    },
    {
      field: 'partName',
      header: this.translate.instant('master.store.grid.partName'),
      width: '8%',
      key: 6,
    },
    {
      field: 'stockUOM',
      header: this.translate.instant('master.store.grid.uom'),
      width: '6%',
      key: 7,
    },

    {
      field: 'partSpecificationIcon',
      header: this.translate.instant('master.store.grid.purchaseSpecification'),
      width: '12%',
      key: 8,
    },
    {
      field: 'delete',
      header: this.translate.instant('master.store.grid.delete'),
      width: '5%',
      key: 9,
    },
  ];
  tableInitialData: any = [];

  tableColumnHeaderListPurchasePartSpecification = [
    {
      field: 'partSpecification',
      header: this.translate.instant(
        'master.store.grid.partSpecification'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'uom',
      header: this.translate.instant('master.store.grid.uom1'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'value',
      header: this.translate.instant(
        'master.store.grid.value'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
  ];

  partSpecificationPartId: any = 0;
  partTypeDDList: any;
  partCodeDDList: any;
  binDDList: any;
  zoneDDList: any;
  storePartMapping!: StorePartMapping;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private loaderService: NgxUiLoaderService,
    private userAuthService: UserAuthService,
    private sharedTableStoreService: SharedTableStoreService,
    public notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private storeService: StoreService,
    private localeService: BsLocaleService,
    private excelService: ExcelService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getPartMappingList(this.parentStoreId);
    this.initializeFormGroups();
    this.getPartType();
    this.getZoneCode();
  }

  getPartType() {
    this.storeService.getPartType().subscribe(
      (data) => {
        this.partTypeDDList = data['response'];
      },
      (err) => { }
    );
  }
  onPartTypeSelected(selectedValue: any) {
    this.storeService.getPartCode(selectedValue.partTypeId).subscribe(
      (data) => {
        this.partCodeDDList = data['response'];
      },
      (err) => { }
    );
  }
  onPartCodeSelected(selectedValue: any) {

    this.partSpecificationPartId = selectedValue.partId;
    this.editSaveForm.controls['partName'].setValue(selectedValue.partName);
    selectedValue.partCategory
      ? this.editSaveForm.controls['partCategory'].setValue(
        selectedValue.partCategory
      )
      : this.editSaveForm.controls['partCategory'].setValue('');
    this.editSaveForm.controls['uom'].setValue(selectedValue.stockUom);
  }

  onZoneCodeSelected(selectedValue: any) {
    this.storeService
      .getBinCode(this.parentStoreId, selectedValue.storeZoneDetailId)
      .subscribe(
        (data) => {
          this.binDDList = data['response'];
        },
        (err) => { }
      );
  }

  getZoneCode() {
    this.storeService.getZoneCode(this.parentStoreId).subscribe(
      (data) => {
        this.zoneDDList = data['response'];
      },
      (err) => { }
    );
  }

  initializeFormGroups() {
    this.editSaveForm = this.formBuilder.group({
      zoneCode: [[], [Validators.required]],
      binCode: [[], [Validators.required]],
      partType: [[], [Validators.required]],
      partCode: [[], [Validators.required]],
      partName: ['', []],
      partCategory: ['', []],
      uom: ['', []],
      purchaseSpecification: ['', []],
    });
    this.disableFormControls();
  }
  disableFormControls() {
    this.editSaveForm.controls['partName'].disable();
    this.editSaveForm.controls['partCategory'].disable();
    this.editSaveForm.controls['uom'].disable();
  }
  getPartMappingList(storeId: any) {
    this.loaderService.start();
    this.storeService.getPartMappingList(storeId).subscribe((data: any) => {
      this.loaderService.stop();
      this.tableInitialData = data.response;
    });
  }

  get editSaveFormControls(): any {
    return this.editSaveForm['controls'];
  }

  translateFieldValue(key: string) {
    const translatedValue: string = this.translate.instant(key);
    return translatedValue;
  }

  dropdownSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['supplierCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['supplierCode'].toLocaleLowerCase() === term
    );
  }

  checkNgSelectValue(event: any, controlName: any) {
    const control: any = this.editSaveForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors.required = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });
      this.editSaveForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }

  combinationCheck() {
    // Checking if all IDs have values
    if (
      this.editSaveForm.value.zoneCode?.storeZoneDetailId &&
      this.editSaveForm.value.binCode?.storeBinDetailId &&
      this.editSaveForm.value.partType?.partTypeId &&
      this.editSaveForm.value.partCode?.partId
    ) {


      if (this.mode === "new") {
        let combinationObj = {
          storePartMappingId: 0,
          storeZoneDetailId: this.editSaveForm.value.zoneCode?.storeZoneDetailId,
          storeBinDetailId: this.editSaveForm.value.binCode?.storeBinDetailId,
          partTypeId: this.editSaveForm.value.partType?.partTypeId,
          partId: this.editSaveForm.value.partCode?.partId,

        };
        this.CheckCombinationMapping(combinationObj)
      } else {
        let combinationObj = {
          StorePartMappingId: this.getDataFromTable.storePartMappingId,
          storePartMappingId: 0,
          storeZoneDetailId: this.editSaveForm.value.zoneCode?.storeZoneDetailId,
          storeBinDetailId: this.editSaveForm.value.binCode?.storeBinDetailId,
          partTypeId: this.editSaveForm.value.partType?.partTypeId,
          partId: this.editSaveForm.value.partCode?.partId,
        };
        this.CheckCombinationMapping(combinationObj)
      }


    }
  }
  CheckCombinationMapping(CombObj: any) {
    this.storeService
      .checkCombinationMapping(CombObj)
      .subscribe((data: any) => {
        if (data['status'] === false) {
          this.IsCombinationErr = true;
        } else {
          this.IsCombinationErr = false;
        }
      });
  }

  resetForm() {
    this.editSaveForm.reset();
  }

  ClearForm() {
    this.editSaveForm.reset();
    this.partSpecificationPartId = 0;
    this.resetForm();
  }

  closePartMappingDialog() {
    if (this.editSaveForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.addPartMappingModel.hide();
          this.editSaveForm.reset();
          this.partSpecificationPartId = 0;
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.addPartMappingModel.hide();
      this.editSaveForm.reset();
      this.partSpecificationPartId = 0;
    }
  }

  refreshIconClick(event: any) {
    this.getPartMappingList(this.parentStoreId);
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
  reset() {
    this.mode = 'new';
    this.editSaveForm.reset();
    this.submitted = false;
    this.disableFormControls();
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
          this.constructStorePartMappingObject(this.editSaveForm.getRawValue());

          if (this.mode === 'new') {
            this.editSaveForm.markAsDirty();
            this.loaderService.start();
            this.storeService
              .createStorePartMapping(this.storePartMapping)
              .subscribe((data) => {
                this.loaderService.stop();
                if (data['status'] === true) {
                  this.getPartMappingList(this.parentStoreId);
                  this.reset();
                  this.closeStoreRateDialog();
                  this.notificationService.smallBox({
                    severity: 'success',
                    title: this.translate.instant(
                      'common.notificationTitle.success'
                    ),
                    content: data['message'],
                    timeout: 5000,
                    icon: 'fa fa-check',
                  });

                  this.editSaveForm.markAsPristine();
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
            this.storeService
              .updateStorePartMapping(this.storePartMapping)
              .subscribe((data) => {
                if (data['status'] === true) {
                  this.getPartMappingList(this.parentStoreId);
                  this.reset();
                  this.closeStoreRateDialog();
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

                  this.editSaveForm.markAsPristine();
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
      }
    }
  }

  receiveTableRowData(event: any) {
    if (event) {
      if (this.editSaveForm.dirty) {
        this.confirmationService.confirm({
          message: this.translate.instant(
            'common.Information.unsavedChangesInfo'
          ),
          accept: () => {
            this.patchRowData(event);
          },
          reject: () => {
            return false;
          },
        });
      } else {
        this.patchRowData(event);
      }
    }
  }
  patchRowData(event: any) {
    this.getDataFromTable = event;
    this.mode = 'edit';
    this.disableFormControls();
    this.onZoneCodeSelected(event);
    this.onPartTypeSelected(event);
    this.editSaveForm.patchValue(event);
    this.addPartMappingModel.show();
  }

  constructStorePartMappingObject(formData: any) {


    if (this.mode === 'new') {
      this.storePartMapping = {
        PartId: formData['partCode'].partId,
        PartTypeId: formData['partType'].partTypeId,
        BinCode: formData['binCode'].binCode,
        PartCode: formData['partCode'].partCode,
        ZoneCode: formData['zoneCode'].zoneCode,
        StoreBinDetailId: formData['binCode'].storeBinDetailId,
        StoreId: this.parentStoreId,
        StoreZoneDetailId: formData['zoneCode'].storeZoneDetailId,
        createdBy: this.userAuthService.getCurrentUserName(),
        modifiedBy: this.userAuthService.getCurrentUserName(),
      };
    } else {
      this.storePartMapping = {
        StorePartMappingId: this.getDataFromTable.storePartMappingId,
        PartId: formData['partCode']?.partId ? formData['partCode'].partId : this.getDataFromTable.partId,
        PartTypeId: formData['partType']?.enumId ? formData['partType']?.enumId : this.getDataFromTable.partTypeId,
        BinCode: formData['binCode']?.binCode ? formData['binCode']?.binCode : this.getDataFromTable.binCode,
        PartCode: formData['partCode']?.partCode ? formData['partCode']?.partCode : this.getDataFromTable.partCode,
        ZoneCode: formData['zoneCode']?.zoneCode ? formData['zoneCode']?.zoneCode : this.getDataFromTable.zoneCode,
        StoreBinDetailId: formData['binCode']?.storeBinDetailId ? formData['binCode']?.storeBinDetailId : this.getDataFromTable.storeBinDetailId,
        StoreId: this.parentStoreId,
        StoreZoneDetailId: formData['zoneCode']?.storeZoneDetailId ? formData['zoneCode']?.storeZoneDetailId : this.getDataFromTable.storeZoneDetailId,
        created: this.getDataFromTable.created,
        modified: this.getDataFromTable.modified,
        createdBy: this.getDataFromTable.createdBy,
        modifiedBy: this.userAuthService.getCurrentUserName(),
      };
    }
  }

  openStorePartMappingDialog() {
    this.reset();
    this.addPartMappingModel.show();
  }

  closeStoreRateDialog() {
    this.addPartMappingModel.hide();
  }

  handleOpenPurchaseSpecification() {
    this.GetPartSpecificationList(this.partSpecificationPartId);
    this.purchasePartSpecificationModal.show();
  }

  handleClosePurchaseSpecification() {
    this.purchasePartSpecificationModal.hide();
  }

  GetPartSpecificationList(partId: any) {
    this.storeService
      .getPartSpecificationList(partId)
      .subscribe((data: any) => {
        this.purchasePartSpecificationData = data.response;
      });
  }

  handleDeleteStorePartMapping(event: any) {
    this.confirmationService.confirm({
      message: this.translate.instant('common.Information.deleteConfirmation'),
      header: this.translate.instant('common.notificationTitle.confirmation'),
      accept: () => {
        this.deleteStorePartMapping(event);
      },
      reject: () => {
        return false;
      },
    });
  }

  deleteStorePartMapping(event: any) {
    this.loaderService.start();
    const {
      storePartMappingId,
      storeZoneDetailId,
      storeBinDetailId,
      partTypeId,
      partId,
      storeId,
      partCode,
      zoneCode,
      binCode,
    } = event;

    // Create a new object with specific fields
    const deleteParams = {
      storePartMappingId,
      storeZoneDetailId,
      storeBinDetailId,
      partTypeId,
      partId,
      storeId,
      partCode,
      zoneCode,
      binCode,
    };

    this.storeService.deleteStorePartMappingById(deleteParams).subscribe(
      (data: any) => {
        const result = data['response'];
        this.getPartMappingList(this.parentStoreId);
        this.loaderService.stop();
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
  handlePartSpecificationRowData(event: any) {
    this.GetPartSpecificationList(event.partId);
    this.purchasePartSpecificationModal.show();
  }
}
