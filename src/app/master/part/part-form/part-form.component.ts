import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/core/services';
import { PartService } from '../service/part.service';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-part-form',
  templateUrl: './part-form.component.html',
  styleUrls: ['./part-form.component.css'],
})
export class PartFormComponent {
  @ViewChild('contactModal') contactModal: any;
  @ViewChild('purchasePartSpecModal') purchasePartSpecModal: any;
  @Output() getSelectedPartCategory = new EventEmitter();
  @Input() canMoveToNext!: boolean;
  @Input() updateOver!: boolean;
  // editPartSaveForm!: FormGroup;
  @Input() editPartSaveForm !: FormGroup;
  purchasePartSpecificationForm!: FormGroup;
  partCategoryDataList: any = [];
  @Input() mode!: string;
  @Input() selectedRowList!: any;
  @Input() partInformationObject: any;
  @Input() isPartCategoryRequired: boolean = false;
  @Input() disableAddButton: boolean = false;
  @Input() disableSaveButton: boolean = false;
  @Input() createBit!: boolean;
  @Input() editBit!: boolean;
  @Input() viewBit!: boolean;

  showCreatePartFirst = true;
  showCreatePartFirstAddRates = true;
  isPartSpecificationEdit: boolean = false;
  changeCategoryPopup: boolean = false;
  submitted: boolean = false;
  activeTab = 1;// to set the activetab as 1 , so it will first show the first wizard
  tabCount: number = 0;// initialy to set tabcount as 0
  checkedPartCategoryList: any = [];
  partTypeDDList: any = [];
  movementFrequencyDDList: any = [];
  planningStrategyDDList: any = [];
  stockUomDDList: any = [];
  partSpecificationDDList: any = [];
  uomDDList: any = [];
  supplierTempTableRecords: any = [];
  categoryTempTableRecords: any = [];
  partSpecificationList: any = [];
  partSpecificationListInitial: any = [];
  partCategoryListInitial: any = [];
  specificationEditData!: any;
  restrictTabWarning: boolean = true;
  tabNames: string = '';
  hideUnsavedErrorMessage: boolean = true;
  hideNewErrorMessage: boolean = true;
  errorTabName: string = '';
  unsavedChanges = false;
  newTabCount: any;
  modalSelectedData: any = [];
  financeIntegration: boolean = false;
  currentUserName: any;
  currentCompanyId: any;
  currentUserId: any;
  editPartSpecificationIndex!: number;
  partCategoryExcelFileName: any;
  purchasePartSpecificationtabletitle: any;
  purchasePartSpecificationexcelFileName: any;
  constructor(
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private userAuthService: UserAuthService,
    private partService: PartService,
    private loaderService: NgxUiLoaderService
  ) { }

  ngOnInit() {

    this.purchasePartSpecificationForm = this.formBuilder.group({
      partSpecification: [[], [Validators.required]],
      value: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.max(999999999999.99),
        ],
      ],
      uom: [[], [Validators.required]],
      type: ['', []]
    });
    this.partCategoryExcelFileName = this.translate.instant("master.part.titles.partCategoryExcelFileName")
    this.purchasePartSpecificationtabletitle = this.translate.instant("master.part.titles.purchasePartSpecificationtabletitle")
    this.purchasePartSpecificationexcelFileName = this.translate.instant("master.part.titles.purchasePartSpecificationexcelFileName")
    // set default value on page load
    this.editPartSaveForm.controls['active'].setValue(true);
    this.editPartSaveForm.controls['hazardous'].setValue(false);

    if (this.mode != 'new') {
      this.patchFormsValues(this.selectedRowList);
      this.getPartSpecificationList(this.selectedRowList.partId);
    }

    // get tempTable list
    this.partService.tempTable.subscribe((items: any) => {
      this.supplierTempTableRecords = items;
    });
    this.partService.tempTableCategory.subscribe((items: any) => {
      this.categoryTempTableRecords = items;
    });

    this.financeIntegration = this.userAuthService.getFinanceIntergrationApplicable();
    if (this.financeIntegration) {
      this.editPartSaveForm.controls['ledgerId'].disable();
      this.editPartSaveForm.controls['ledgerId'].setValue(null);
    } else {
      this.editPartSaveForm.controls['ledgerId'].enable();
    }
    this.currentCompanyId = this.userAuthService.getCurrentCompanyId()
    this.getPartCategoryList();
    this.getMovementFrequency();
    this.getPlanningStrategy();
    this.getStockUOM();
    this.getPartType();
    this.getPartSpecification();
    this.getUOM();
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.showCreatePartFirst = changes['canMoveToNext']?.currentValue || true
    this.showCreatePartFirstAddRates = changes['canMoveToNext']?.currentValue || true
    this.hideUnsavedErrorMessage = changes['updateOver']?.currentValue || true
  }

  addNewForm() {
    this.editPartSaveForm.controls['active'].setValue(true);
    this.editPartSaveForm.controls['hazardous'].setValue(false);
    this.partSpecificationList = [];
    this.supplierTempTableRecords = [];
    this.checkedPartCategoryList = [];
    this.partService.clearTempTable();
    this.isPartSpecificationEdit = false;
    this.activeTab = 1;
    this.isPartCategoryRequired = false;
    this.changeCategoryPopup = false;
    this.partCategoryListInitial = [];
  }


  patchFormsValues(selectedRowList: any) {
    this.editPartSaveForm.patchValue({
      partName: selectedRowList.partDescription,
      partCode: selectedRowList.partNo,
      partNo: selectedRowList.partNo,
      partDescription: selectedRowList.partDescription,
      partType: {
        code: selectedRowList.partType,
        enumId: selectedRowList.partTypeId,
      },
      partCategory: selectedRowList.partCategory,
      ledgerId: selectedRowList.ledgerId,
      planningStrategy: {
        code: selectedRowList.planningStrategy,
        enumId: selectedRowList.planningStrategyId,
        description: selectedRowList.planningStrategyDescription,
      },
      movementFrequency: selectedRowList.movementFrequency ? {
        code: selectedRowList.movementFrequency,
        enumId: selectedRowList.movementFrequencyId,
        description: selectedRowList.movementFrequencyDescription,
      } : null,
      reOrderLevel: selectedRowList.reOrderLevel,
      reOrderQuantity: selectedRowList.reOrderQuantity,
      stockUom: {
        code: selectedRowList.stockUOM,
        unitId: selectedRowList.stockUOMId,
      },
      remarks: selectedRowList.remarks,
      active: selectedRowList.active,
      hazardous: selectedRowList.hazardous,
    });
    this.editPartSaveForm.controls['partCode'].disable();
    // enum id = 517 means -> "None"
    if (selectedRowList.planningStrategyId == 517) {
      this.editPartSaveForm.controls['reOrderLevel'].disable();
      this.editPartSaveForm.controls['reOrderQuantity'].disable();
    } else {
      this.editPartSaveForm.controls['reOrderLevel'].enable();
      this.editPartSaveForm.controls['reOrderQuantity'].enable();
    }
    this.enableRights();
  }

  getPlanningStrategy() {
    this.partService.getPlanningStrategy().subscribe(
      (data) => {
        this.planningStrategyDDList = data['response'];
      },
      (err) => { }
    );
  }
  getMovementFrequency() {
    this.partService.getMovementFrequency().subscribe(
      (data) => {
        this.movementFrequencyDDList = data['response'];
      },
      (err) => { }
    );
  }
  getStockUOM() {
    this.partService.getStockUOM().subscribe(
      (data) => {
        this.stockUomDDList = data['response'];
      },
      (err) => { }
    );
  }
  getUOM() {
    this.partService.getUOM().subscribe(
      (data) => {
        this.uomDDList = data['response'];
      },
      (err) => { }
    );
  }
  getPartSpecification() {
    this.partService.getPartSpecification().subscribe(
      (data) => {
        this.partSpecificationDDList = data['response'];
      },
      (err) => { }
    );
  }
  getPartType() {
    this.partService.getPartType().subscribe(
      (data) => {
        this.partTypeDDList = data['response'];
      },
      (err) => { }
    );
  }

  getPartSpecificationList(partId: any) {
    this.partService.getPartSpecificationList(partId).subscribe((data: any) => {
      this.partSpecificationList = data.response;
      this.partSpecificationListInitial = data.response;
    });
  }

  getPartCategoryList() {
    this.partService
      .getPartCategoryList(
        this.currentCompanyId,
        this.selectedRowList.partId || 0
      )
      .subscribe((data: any) => {
        this.partCategoryDataList = data.response;

        if (this.selectedRowList.partId == 0) {
          this.checkedPartCategoryList = data.response;
        } else {
          this.checkedPartCategoryList = data.response.filter(
            (item: any) => item.isChecked == 'True'
          );
          this.partCategoryListInitial = this.checkedPartCategoryList;
        }
      });
  }

  columnHeaderList = [
    {
      field: 'partSpecification',
      header: this.translate.instant("master.part.grid.titles.partSpecification"),
      width: '15%',
      key: 1
    },
    {
      field: 'value',
      header: this.translate.instant("master.part.grid.titles.value"),
      width: '10%',
      key: 2

    },
    {
      field: 'uom',
      header: this.translate.instant("master.part.grid.titles.uom"),
      width: '10%',
      key: 3

    },
    {
      field: 'delete',
      header: this.translate.instant("master.part.grid.titles.delete"),
      width: '3%',
      key: 4

    },
  ];
  partCategoryColumns = [
    {
      field: 'isoGroup',
      header: this.translate.instant("master.part.grid.titles.isoGroup"),
      width: '5%',
      key: 1

    },
    {
      field: 'equipmentType',
      header: this.translate.instant("master.part.grid.titles.equipmentType"),
      width: '5%',
      key: 2

    },
    {
      field: 'isoCode',
      header: this.translate.instant("master.part.grid.titles.isoCode"),
      width: '5%',
      key: 3

    },
    {
      field: 'equipmentISODescription',
      header: this.translate.instant("master.part.grid.titles.equipmentISODescription"),
      width: '10%',
      key: 4

    },
  ];

  receiveTableRowData(event: any) { }

  checkNgSelectValue(event: any, controlName: any) {
    const control = this.editPartSaveForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.editPartSaveForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }
  checkNgSelectValuePurchasePartSpecification(event: any, controlName: any) {
    const control = this.purchasePartSpecificationForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.purchasePartSpecificationForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }
  get partInfo() {
    return this.editPartSaveForm.controls;
  }

  get purchasePartInfo() {
    return this.purchasePartSpecificationForm.controls;
  }

  changeTab(tabNumber: number) {
    this.activeTab = tabNumber;
  }

  checkNgSelectGeneralInfoValue(e: any, controlName: any) {
    if (controlName == 'planningStrategy' && e && e.enumId == 517) {
      this.editPartSaveForm.controls['reOrderLevel'].setValue(null);
      this.editPartSaveForm.controls['reOrderQuantity'].setValue(null);
      this.editPartSaveForm.controls['reOrderLevel'].disable();
      this.editPartSaveForm.controls['reOrderQuantity'].disable();
    } else {
      this.editPartSaveForm.controls['reOrderLevel'].enable();
      this.editPartSaveForm.controls['reOrderQuantity'].enable();
    }
  }
  openContactDialog() {
    this.contactModal.show();
  }
  closeContactDialog() {

    this.contactModal.hide();
  }

  dropdownSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['code'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['code'].toLocaleLowerCase() === term ||
      item['description'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['description'].toLocaleLowerCase() === term
    );
  }
  validateReOrderLevel(controlName: any): any {
    const control = this.editPartSaveForm.controls[controlName];
    if (control.errors) {
      // return if another validator has already found an error on the matchingControl
      return null;
    }
    if (control.value) {
      if (control.value <= 0 || control.value > 9999999999.9999) {
        control.setErrors({ invalidRate: true });
      } else {
        control.setErrors(null);
      }
    }
  }
  validatereOrderQuantity(controlName: any): any {
    const control = this.editPartSaveForm.controls[controlName];
    if (control.errors) {
      // return if another validator has already found an error on the matchingControl
      return null;
    }
    if (control.value) {
      if (control.value <= 0 || control.value > 9999999999.9999) {
        control.setErrors({ invalidRate: true });
      } else {
        control.setErrors(null);
      }
    }
  }
  validatevalue(controlName: any): any {
    const control = this.purchasePartSpecificationForm.controls[controlName];
    if (control.errors) {
      // return if another validator has already found an error on the matchingControl
      return null;
    }
    if (control.value) {
      if (control.value < 0 || control.value > 999999999999.99) {
        control.setErrors({ invalidRate: true });
      } else {
        control.setErrors(null);
      }
    }
  }
  refreshIconClick(event: any) {
    this.getPartSpecificationList(this.selectedRowList.partId);
  }
  tableRefreshIcon(event: any) {
    this.getPartCategoryList();
  }

  partSpecificationFormReset() {
    this.purchasePartSpecificationForm.reset();
    this.specificationEditData = null;
  }

  private _markFormPristine(form: FormGroup): void {
    Object.keys(form.controls).forEach((control) => {
      form.controls[control].markAsPristine();
      form.controls[control].markAsUntouched();
    });
  }
  clearPartSpecification() {
    if (this.purchasePartSpecificationForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.partSpecificationFormReset();
          this.isPartSpecificationEdit = false;
          this._markFormPristine(this.purchasePartSpecificationForm);
          this.purchasePartSpecificationForm.markAsPristine();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.isPartSpecificationEdit = false;
      this.partSpecificationFormReset();
      this._markFormPristine(this.purchasePartSpecificationForm);
      this.purchasePartSpecificationForm.markAsPristine();

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

  savePartSpecification() {
    if (this.purchasePartSpecificationForm.invalid) {
      this.validateAllMethodFormFields(this.purchasePartSpecificationForm);
      return;
    } else {

      if (!this.specificationEditData) {
        this.purchasePartSpecificationForm.controls['type'].setValue('Temp');
        let tempform = this.purchasePartSpecificationForm.value;
        this.partSpecificationList.push(
          {
            partSpecification: tempform.partSpecification?.code,
            partSpecificationId: tempform.partSpecification?.enumId,
            value: tempform.value,
            uom: tempform.uom.code,
            uomId: tempform.uom.unitId,
            id: this.partSpecificationList.length + 1,
            type: 'Temp'
          }
        )
      }

      const formsValues = this.purchasePartSpecificationForm.value;

      if (this.mode == 'new') {
        const newItem: any[] = [];
        let newRecords = this.partSpecificationList.map((data: any, index1: number) => {
          if (this.specificationEditData) {


            if (data.type == 'Temp' &&
              data.id == this.specificationEditData.id
            ) {
              let tempform = this.purchasePartSpecificationForm.value;

              data.partSpecification = tempform.partSpecification?.code || data.partSpecification;
              data.partSpecificationId = tempform.partSpecification?.enumId || data.partSpecificationId;
              data.value = tempform.value || data.value;
              data.uom = tempform.uom?.code || data.uom;
              data.uomId = tempform.uom?.unitId || data.uomId || data.unitId;
              data.id = data.id;
              data.type = data.type;

              return data;
            } else {

              data.partSpecification = data.partSpecification?.code || data.partSpecification;
              data.partSpecificationId = data.partSpecification?.enumId || data.partSpecificationId;
              data.value = data?.value;
              data.uom = data.uom?.code || data.uom;
              data.uomId = data.uom?.unitId || data.uomId || data.unitId;
              data.id = data.id;
              data.type = data.type;

              return data;
            }

          } else {

            newItem.push({
              partSpecification: data.partSpecification?.code || data.partSpecification,
              partSpecificationId: data.partSpecification?.enumId || data.partSpecificationId,
              value: data.value,
              uom: data.uom?.code || data.uom,
              uomId: data.uom?.unitId || data.uomId || data.unitId,
              id: data.id,
              type: 'Temp',
            });
          }
          this.partSpecificationList = newItem;
        });
        if (this.specificationEditData) {
          this.partSpecificationList = newRecords;
        }
      } else {
        const newItem: any[] = [];
        if (this.specificationEditData) {
          let newRecords = this.partSpecificationList.map((data: any) => {

            let tempform = this.purchasePartSpecificationForm.value;

            if (data.type == 'Temp' &&
              data.id == this.specificationEditData.id
            ) {

              data.partSpecification = tempform.partSpecification?.code || data.partSpecification;
              data.partSpecificationId = tempform.partSpecification?.enumId || data.partSpecificationId;
              data.value = tempform.value || data.value;
              data.uom = tempform.uom?.code || data.uom;
              data.uomId = tempform.uom?.unitId || data.uomId || data.unitId;
              data.id = data.id;
              data.type = data.type;

              return data;
            }
            else if (data.purchasePartSpecificationId == this.specificationEditData.purchasePartSpecificationId) {

              data.purchasePartSpecificationId = data.purchasePartSpecificationId;
              data.partSpecification = tempform.partSpecification?.code || data.partSpecification;
              data.partSpecificationId = tempform.partSpecification?.enumId || data.partSpecificationId;
              data.value = tempform.value || data.value;
              data.uom = tempform.uom?.code || data.uom;
              data.uomId = tempform.uom?.unitId || data.uomId || data.unitId;
              data.id = data.id;
              data.type = data.type;
              return data;
            }
            else {

              data.partSpecification = data.partSpecification?.code || data.partSpecification;
              data.partSpecificationId = data.partSpecification?.enumId || data.partSpecificationId;
              data.value = data?.value;
              data.uom = data.uom?.code || data.uom;
              data.uomId = data.uom?.unitId || data.uomId || data.unitId;
              data.id = data.id;
              data.type = data.type;

              return data;
            }
          });
          this.partSpecificationList = newRecords;
        }
        this.supplierTempTableRecords = this.partSpecificationList;
      }


      // save message
      if (this.isPartSpecificationEdit) {
        this.notificationService.smallBox({
          severity: 'success',
          title: this.translate.instant('common.notificationTitle.success'),
          content: this.translate.instant(
            'master.part.messages.modifiedPartSpecification'
          ),
          timeout: 5000,
          icon: 'fa fa-check',
        });
      } else {
        this.notificationService.smallBox({
          severity: 'success',
          title: this.translate.instant('common.notificationTitle.success'),
          content: this.translate.instant(
            'master.part.messages.savePartSpecification'
          ),
          timeout: 5000,
          icon: 'fa fa-check',
        });
      }

      this.isPartSpecificationEdit = false;
      this.specificationEditData = null;
      this.purchasePartSpecificationForm.reset();
      this.purchasePartSpecificationForm.markAsDirty();
    }
  }

  handleDeletePartSpecificationList(event: any) {
    this.partService.tempTable.subscribe((items: any) => {
      this.supplierTempTableRecords = items;
    });

    this.loaderService.start();

    if (event.rowDetails.type == 'Temp') {
      const id = event.rowDetails.id;

      this.partSpecificationList = this.partSpecificationList.filter((item: any) => item.id != id)
      this.loaderService.stop();
    } else {
      const purchasePartSpecificationId = event.rowDetails.purchasePartSpecificationId;
      this.partService.deletePartSpecification(purchasePartSpecificationId).subscribe(
        (data) => {
          const result = data['response'];
          this.getPartSpecificationList(this.selectedRowList.partId);
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
        (err) => {
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
  }

  deletePartSpecification(event: any) {
    this.confirmationService.confirm({
      message: this.translate.instant('common.Information.deleteConfirmation'),
      header: this.translate.instant('common.notificationTitle.confirmation'),
      accept: () => {
        this.handleDeletePartSpecificationList(event);
      },
      reject: () => {
        return false;
      },
    });
  }
  markAsUnDirtyPartCategory() {
    this.changeCategoryPopup = false;

  }
  receiveSelectedData(event: any) {
    this.modalSelectedData = event;


    this.getSelectedPartCategory.emit(event);
    this.partService.addTempRecord('category', event);
    this.changeCategoryPopup = true;
  }
  receiveSpecificationRowData(event: any) {

    if (this.purchasePartSpecificationForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.specificationEditData = event; //purchasePartSpecificationId
          this.isPartSpecificationEdit = true;
          this.partSpecificationList.map((item: any, index: number) => {
            if (event.partSpecificationId == item.partSpecificationId) {
              this.editPartSpecificationIndex = index;
            }
          });
          this.purchasePartSpecificationForm.patchValue({
            partSpecification: {
              code: event.partSpecification,
              enumId: event.partSpecificationId,
            },
            value: event.value,
            uom: { code: event.uom, unitId: event.unitId || event.uomId },
          });
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.specificationEditData = event; //purchasePartSpecificationId

      this.partSpecificationList.map((item: any, index: number) => {
        if (event.partSpecificationId == item.partSpecificationId) {
          this.editPartSpecificationIndex = index;
        }
      });
      this.isPartSpecificationEdit = true;

      this.purchasePartSpecificationForm.patchValue({
        partSpecification: {
          code: event.partSpecification,
          enumId: event.partSpecificationId,
        },
        value: event.value,
        uom: { code: event.uom, unitId: event.uomIdd },
      });
    }
  }

  // Custom validation for partCode field
  validateCode(controlName: string) {
    const control = this.editPartSaveForm.controls[controlName];

    if (control.errors) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    const part = {
      // partId: this.isNullorEmpty(this.editPartSaveForm.controls['partId'].value) ? 0 : this.editPartSaveForm.controls['partId'].value,
      partId: this.selectedRowList.partId || 0,
      partCode: this.editPartSaveForm.controls['partCode'].value,
    };
    if (control.value) {
      this.partService.isCodeValid(part).subscribe((data: any) => {
        if (data['status'] === true) {
          control.setErrors(null);
        } else {
          control.setErrors({ duplicateCode: true });
        }
      });
    }
  }
  // Custom validation for part Specification field
  validatePartSpecification(controlName: string) {
    const control = this.purchasePartSpecificationForm.controls[controlName];
    if (control.errors) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    if (control.value) {
      const partSpec =
        this.purchasePartSpecificationForm.controls['partSpecification'].value;
      if (this.specificationEditData?.partSpecification == partSpec.code) {
      } else {
        if (
          this.partSpecificationList.some(
            (item: any) => item.partSpecification === partSpec.code
          )
        ) {
          control.setErrors({ duplicatePartSpecification: true });
        } else {
          control.setErrors(null);
        }
      }
    }
  }

  // null check common method
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
  checkPartSpecificationNoListError() {
    if (this.partSpecificationList.length == 0) {
      this.tabCount = 1;

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
  }
  openPurchasePartSpecification() {
    this.purchasePartSpecModal.show();
  }
  closePurchasePartSpecModal() {
    if (this.purchasePartSpecificationForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.purchasePartSpecModal.hide();
          this.partSpecificationFormReset();
          this.isPartSpecificationEdit = false;
          this._markFormPristine(this.purchasePartSpecificationForm);
          this.purchasePartSpecificationForm.markAsPristine();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.purchasePartSpecModal.hide();
      this.isPartSpecificationEdit = false;
      this.partSpecificationFormReset();
      this._markFormPristine(this.purchasePartSpecificationForm);
      this.purchasePartSpecificationForm.markAsPristine();

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
      this.tabCount = 1;
      if (tabCount === 1) {

        this.restrictTabWarning = true;
      } else {
        if (this.canMoveToNext) {
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
            this.showCreatePartFirst = false;
            this.showCreatePartFirstAddRates = true;
            this.checkPartSpecificationNoListError();
          } else {
            this.showCreatePartFirstAddRates = false;
            this.showCreatePartFirst = true;
            this.checkPartSpecificationNoListError();

          }

        }
      }
    } else {

      if (tabCount === 2) {
        if (this.purchasePartSpecificationForm.dirty || this.editPartSaveForm.dirty || this.editPartSaveForm.invalid || this.changeCategoryPopup) {
          if (!this.editPartSaveForm.invalid || this.purchasePartSpecificationForm.dirty || this.changeCategoryPopup) {
            this.hideUnsavedErrorMessage = false;

            this.tabCount = 1;
            this.unsavedChanges = false;
            this.restrictTabWarning = true;
            if (event.stopPropagation) {
              event.stopPropagation();
            }
          } else {
            this.hideUnsavedErrorMessage = true;
            if (event.stopPropagation) {
              event.stopPropagation();
            }
            this.validateAllFormFields(this.editPartSaveForm);
          }

        } else {
          if (this.partSpecificationList.length == 0) {
            this.checkPartSpecificationNoListError();
          } else {
            this.activeTab = tabCount;
          }
        }
      } else if (tabCount === 3) {
        if (this.editPartSaveForm.dirty || this.editPartSaveForm.invalid || this.purchasePartSpecificationForm.dirty || this.changeCategoryPopup) {
          if (!this.editPartSaveForm.invalid || this.purchasePartSpecificationForm.dirty || this.changeCategoryPopup) {
            this.hideUnsavedErrorMessage = false;
            this.tabCount = 1;
            this.unsavedChanges = false;
            this.restrictTabWarning = true;
            if (event.stopPropagation) {
              event.stopPropagation();
            }
            this.checkPartSpecificationNoListError();

          } else {

            this.hideUnsavedErrorMessage = true;
            if (event.stopPropagation) {
              event.stopPropagation();
            }
            this.validateAllFormFields(this.editPartSaveForm);
            this.checkPartSpecificationNoListError();

          }
        } else {
          if (this.partSpecificationList.length == 0) {
            this.checkPartSpecificationNoListError();
          } else {
            this.activeTab = tabCount;

          }
        }
      }
    }
  }

  savePartCategory() {
    if (this.modalSelectedData?.length > 0) {
      this.closeContactDialog();
    } else {
      this.notificationService.smallBox({
        severity: 'error',
        title: 'Error',
        content: 'At least one record must be selected to Save Part Category',
        timeout: 3000,
      });
    }
  }

  enableRights() {
    if (!this.editBit && !this.createBit && this.viewBit) {
      // only view
      if (this.mode == 'new') {
        this.mode = 'view';
        this.disableAddButton = true;
        this.disableSaveButton = false;
        this.editPartSaveForm.disable();
        this.purchasePartSpecificationForm.disable();
      } else {
        this.mode = 'view';
        this.disableAddButton = true;
        this.disableSaveButton = true;
        this.editPartSaveForm.disable();
        this.purchasePartSpecificationForm.disable();
      }
    } else if (!this.createBit && this.editBit && this.viewBit) {
      // edit and view
      if (this.mode == 'new') {
        this.editPartSaveForm.disable();
        this.mode = 'view';
        this.disableAddButton = true;
        this.disableSaveButton = false;
        this.purchasePartSpecificationForm.disable();
      } else {
        this.editPartSaveForm.enable();
        this.mode = 'edit';
        this.disableAddButton = true;
        this.disableSaveButton = false;
        this.purchasePartSpecificationForm.enable();
      }
    } else if (this.createBit && !this.editBit && this.viewBit) {
      // create and view

      if (this.mode == 'new') {
        this.editPartSaveForm.enable();
        this.mode = 'new';
        this.disableAddButton = false;
        this.disableSaveButton = false;
        this.purchasePartSpecificationForm.enable();
      } else {
        this.editPartSaveForm.disable();
        this.purchasePartSpecificationForm.disable();
        this.mode = 'view';
        this.disableAddButton = false;
        this.disableSaveButton = true;
      }
    }
  }
}
