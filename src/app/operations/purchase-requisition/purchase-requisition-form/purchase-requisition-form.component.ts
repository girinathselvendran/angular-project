import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-purchase-requisition-form',
  templateUrl: './purchase-requisition-form.component.html',
  styleUrls: ['./purchase-requisition-form.component.css'],
})
export class PurchaseRequisitionFormComponent {
  //fn
  @Output() deleteRowData = new EventEmitter();
  @Output() refreshPrPart = new EventEmitter();
  @Output() receiveTablePart = new EventEmitter();
  @Output() handleOpenPurchaseSpecificationModel = new EventEmitter();
  @Output() combinationCheckFn = new EventEmitter();
  @Output() onPartCodeSelectedFn = new EventEmitter();
  @Output() onPartTypeSelectedFn = new EventEmitter();

  // var
  @Input() currentDate!: Date;
  @Input() editSavePRForm!: FormGroup;
  @Input() purchaseRequisitionPartsList: any = [];
  @Input() partCodeDDList: any = [];
  @Input() partTypeDDList: any = [];
  @Input() associatedDepots: any = [];
  @Input() totalEstimatedCode: any;
  @Input() submitted: boolean = false;
  @Input() partSpecificationPartId!: any;


  constructor(
    private translate: TranslateService
  ) { }

  get editSavePRFormController() {
    return this.editSavePRForm.controls;
  }
  prPartListColumnList = [
    {
      field: 'depot',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.depot'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'partType',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.partType'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'partCategory',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.partCategory'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'partDescription',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.partDescription'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'availableStock',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.availableStock'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'stockUOM',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.stockUOM'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'requisitionQuantity',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.requisitionQuantity'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'partRate',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.partRate'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
    {
      field: 'estimatedCost',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.estimatedCost'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'requiredDate',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.requiredDate'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },

    {
      field: 'partSpecification',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.partSpecification'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
    {
      field: 'createdBy',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.createdBy'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 12,
    },
    {
      field: 'createdDate',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.createdDate'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 13,
    },
    {
      field: 'delete',
      header: this.translate.instant(
        'operations.purchaseRequisition.grid.delete'
      ),
      width: '2%',
      key: 14,
    },
  ];

  deleteRowDataPrPart(event: any) {
    this.deleteRowData.emit(event);
  }
  refreshPrPartList(event: any) {
    this.refreshPrPart.emit(event);
  }
  receiveTablePartList(event: any) {
    this.receiveTablePart.emit(event);
  }
  handleOpenPurchaseSpecification() {
    this.handleOpenPurchaseSpecificationModel.emit();
  }
  combinationCheck() {
    this.combinationCheckFn.emit();
  }
  onPartCodeSelected(event: any) {
    this.onPartCodeSelectedFn.emit(event);
  }
  onPartTypeSelected(event: any) {
    this.onPartTypeSelectedFn.emit(event);
  }
  dropdownSearchFnPartCode(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['partCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['partCode'].toLocaleLowerCase() === term ||
      item['partName'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['partName'].toLocaleLowerCase() === term
    );
  }
  dropdownSearchFnPartType(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['code'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['code'].toLocaleLowerCase() === term ||
      item['description'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['description'].toLocaleLowerCase() === term
    );
  }
  checkNgSelectValue(event: any, controlName: any) {
    const control = this.editSavePRForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.editSavePRForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }
  validateRequiredDate(controlName: string, event: any) {
    this.currentDate = new Date();
    const selectedDate = new Date(event);
    if (selectedDate < this.currentDate) {
      this.editSavePRForm.controls['requiredDate'].setErrors({
        customError: true,
      });
    } else if (isNaN(selectedDate.getTime())) {
      this.editSavePRForm.controls['requiredDate'].setErrors({
        invalid: true,
      });
    } else {
      this.editSavePRForm.controls['requiredDate'].setErrors(null);
    }
  }
  handleAmountCalculation(controlName: string) {
    if (this.editSavePRForm.controls['requisitionQuantity'].value) {
      const totalCount = this.editSavePRForm.controls['partRate'].value
        ? this.editSavePRForm.controls['requisitionQuantity'].value *
        this.editSavePRForm.controls['partRate'].value
        : this.editSavePRForm.controls['requisitionQuantity'].value;
      this.editSavePRForm.controls['estimatedCost'].setValue(totalCount);
    }
  }
  dropdownDepotSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['depotCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotCode'].toLocaleLowerCase() === term ||
      item['depotName'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotName'].toLocaleLowerCase() === term
    );
  }
}
