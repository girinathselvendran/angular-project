import { Component, Input, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { StorePartAllocationPopupComponent } from '../store-part-allocation-popup/store-part-allocation-popup.component';
import { GoodsReceiptService } from '../service/goods-receipt.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-goods-receipt-form',
  templateUrl: './goods-receipt-form.component.html',
  styleUrls: ['./goods-receipt-form.component.css'],
})
export class GoodsReceiptFormComponent {
  SelectedGoodsReceiptCategory: any;
  handleCloseSpecification() {
    this.partSpecificationModal.hide();
  }
  @ViewChild('storePartAllocationpopup')
  StorePartAllocationPopup!: StorePartAllocationPopupComponent;
  @ViewChild('partSpecificationModal') partSpecificationModal: any;

  @Input() mode: any;
  @Input() goodsReceiptCategory: any = [];
  @Input() selectedGoodsReceiptData: any = null;

  partTypeDDList = [];
  stockUOMList = [];
  partSpecificationData = [];
  partNameDDList = [];
  cityDDList = [];
  goodsReceiptType = [];
  supplierDDList = [];
  poDDList = [];

  // supplierPoDetailForm!: FormGroup;

  activeTab = 1;
  submitted = false;
  tableTitle = 'Purchase Part Specification';
  excelFileName = 'Purchase Part Specification List';
  @Input() partDetailList: any = [];
  @Input() editSavePartDetailForm!: FormGroup;
  @Input() goodsReceiptForm!: FormGroup;
  selectedPartDetail: any = null;
  updatedPartDetail: any = [];
  partDetailColumnList = [
    {
      field: 'partTypeCode',
      // header: this.translate.instant(
      //   'operations.requestForQuote.partDetails.grid.partCode'
      // ),
      header: 'Part Type',
      width: '7%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'partCode',
      // header: this.translate.instant(
      //   'operations.requestForQuote.partDetails.grid.partType'
      // ),
      header: 'Part No',
      width: '6%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'partName',
      // header: this.translate.instant(
      //   'operations.requestForQuote.partDetails.grid.partName'
      // ),
      header: 'Part Description',
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },

    {
      field: 'partSpecificationIcon',
      header: this.translate.instant(
        'operations.requestForQuote.partDetails.grid.partSpecification'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'partCategory',
      header: this.translate.instant(
        'operations.requestForQuote.partDetails.grid.partCategory'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'purchaseOrderQuantity',
      // header: this.translate.instant(
      //   'operations.requestForQuote.partDetails.grid.partCategory'
      // ),
      header: 'Purchase Quantity',
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },

    //   {
    //     "partType": {
    //         "partTypeId": 311,
    //         "code": "STORES"
    //     },
    //     "partCode": {
    //         "partId": 166,
    //         "code": "AS1"
    //     },
    //     "partName": "2323e",
    //     "partCategory": "12RE, 12RE, 12RE, 12RE, 20DC, 20DV",
    //     "purchaseQuantity": 234,
    //     "totalReceivedQuantity": 3,
    //     "balanceQuantity": 231,
    //     "receivedQuantity": "3",
    //     "expectedDeliveryDate": "29-DEC-2023",
    //     "actualDeliveryDate": "2024-01-11T14:48:30.683Z",
    //     "stockUOM": {
    //         "stockUOMId": 110,
    //         "code": "QTY"
    //     }
    // }

    {
      field: 'totalReceivedQuantity',
      // header: this.translate.instant(
      //   'operations.requestForQuote.partDetails.grid.partCategory'
      // ),
      header: 'Total Received Quantity',
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'balanceQuantity',
      // header: this.translate.instant(
      //   'operations.requestForQuote.partDetails.grid.partCategory'
      // ),
      header: 'Balance Quantity',
      width: '7%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'receivedQuantity',
      // header: this.translate.instant(
      //   'operations.requestForQuote.partDetails.grid.partCategory'
      // ),
      header: 'Received Quantity',
      width: '7%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },

    {
      field: 'deliveryDate',
      // header: this.translate.instant(
      //   'operations.requestForQuote.partDetails.grid.requiredDate'
      // ),
      header: 'Expected Delivery Date',
      width: '7%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },
    {
      field: 'actualDeliveryDate',
      // header: this.translate.instant(
      //   'operations.requestForQuote.partDetails.grid.supplier'
      // ),
      header: 'Actual Delivery Date',
      width: '7%',
      isFilter: true,
      isSubHeader: false,
      // isHyperLink: true,
      type: 'string',
      key: 11,
    },
    {
      field: 'storePartAllocation',
      // header: this.translate.instant(
      //   'operations.requestForQuote.partDetails.grid.remarks'
      // ),
      header: 'Store - Part Allocation',
      width: '7%',
      isFilter: false,
      isHyperLink: true,
      isSubHeader: false,
      type: 'string',
      showHeaderIcon: false,
      isIcon: true,
      key: 12,
    },
    {
      field: 'stockUOMCode',
      header: this.translate.instant(
        'operations.requestForQuote.partDetails.grid.stockUOM'
      ),
      width: '7%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
  ];
  tableColumnsPartSpecification = [
    {
      field: 'partSpecification',
      header: this.translate.instant('master.store.grid.partSpecification'),
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
      header: this.translate.instant('master.store.grid.value'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private loaderService: NgxUiLoaderService,
    private goodsReceiptService: GoodsReceiptService
  ) {}
  ngOnInit() {
    // this.goodsReceiptForm = this.formBuilder.group({
    //   goodsReceiptNo: ['', []],
    //   goodsReceiptDate: ['', []],
    //   depot: [[], []],
    //   city: [[], []],
    //   goodsReceiptType: [[], []],
    //   goodsReceiptCategory: [[], []],
    //   supplier: [[], []],
    //   poNumber: [[], []],
    //   remarks: ['', []],
    // });
    // this.editSavePartDetailForm.disable();
    // this.editSavePartDetailForm.controls['receivedQuantity'].enable();
    // this.editSavePartDetailForm.controls['actualDeliveryDate'].enable();
    // this.supplierPoDetailForm.disable();
    // this.supplierPoDetailForm.controls['remarks'].enable();
    // this.goodsReceiptForm.disable();
    // console.log(
    //   'dfdfdf ',
    //   this.StorePartAllocationPopup?.storePartAllocationPopup
    // );
    // console.log('dfdfdf 2 ', this.StorePartAllocationPopup);
    // console.log(this.selectedGoodsReceiptData,"selectedGoodsReceiptData");
  }

  saveGoodsReceiptPartDetails() {
    let formValues = this.editSavePartDetailForm.getRawValue();
    let formHeaderFormValue = this.goodsReceiptForm.getRawValue();
    if (
      formHeaderFormValue.goodsReceiptCategory.enumId === 599 &&
      this.isPatchPartDetails
    ) {
      alert('ok step 1');
      console.log(this.editSavePartDetailForm, 'this.editSavePartDetailForm');
      console.log(formValues, 'formValues');

      if (
        formValues.receivedQuantity === '' ||
        formValues.receivedQuantity === null ||
        formValues.receivedQuantity === undefined ||
        formValues.actualDeliveryDate === '' ||
        formValues.actualDeliveryDate === null ||
        formValues.actualDeliveryDate === undefined ||
        formValues.receivedQuantity === 0
      ) {
        this.submitted = true;
        this.validateAllFormFields(this.editSavePartDetailForm);
      } else {
        const purchaseOrderPartDetailIdToMatch =
          this.selectedPartDetail.purchaseOrderPartDetailId;
        this.selectedPartDetail = {
          ...this.selectedPartDetail,
          totalReceivedQuantity: formValues.totalReceivedQuantity,
          balanceQuantity: formValues.balanceQuantity,
          receivedQuantity: formValues.receivedQuantity,
          actualDeliveryDate: formValues.actualDeliveryDate,
        };
        // const updatedMainArray = this.partDetailList.map(
        //   (item: { purchaseOrderPartDetailId: any }) => {
        //     if (
        //       item.purchaseOrderPartDetailId ===
        //       purchaseOrderPartDetailIdToMatch
        //     ) {
        //       // If purchaseOrderPartDetailId matches, update the object with new values
        //       return this.selectedPartDetail;
        //     }
        //     return item;
        //   }
        // );
        const updatePartDetailList = this.partDetailList.map((item: { purchaseOrderPartDetailId: any; }) => {
          if (item.purchaseOrderPartDetailId === purchaseOrderPartDetailIdToMatch) {
            // If purchaseOrderPartDetailId matches, update the object with new values
            return {
              ...item,
              totalReceivedQuantity: formValues.totalReceivedQuantity,
              balanceQuantity: formValues.balanceQuantity,
              receivedQuantity: formValues.receivedQuantity,
              actualDeliveryDate: formValues.actualDeliveryDate
            };
          }
          return item;
        });
        this.partDetailList = updatePartDetailList

        // Add the updated object to updatedPartDetail if it doesn't exist, or update if it does
        const indexInUpdatedPartDetail = this.updatedPartDetail.findIndex(
          (item: { purchaseOrderPartDetailId: any; }) =>
            item.purchaseOrderPartDetailId === purchaseOrderPartDetailIdToMatch
        );

        if (indexInUpdatedPartDetail !== -1) {
          // If object already exists, update it
          this.updatedPartDetail[indexInUpdatedPartDetail] = {
            ...this.updatedPartDetail[indexInUpdatedPartDetail],
            totalReceivedQuantity: formValues.totalReceivedQuantity,
            balanceQuantity: formValues.balanceQuantity,
            receivedQuantity: formValues.receivedQuantity,
            actualDeliveryDate: formValues.actualDeliveryDate,
          };
        } else {
          // If object doesn't exist, add it to updatedPartDetail
          this.updatedPartDetail.push({
            ...this.selectedPartDetail,
            totalReceivedQuantity: formValues.totalReceivedQuantity,
            balanceQuantity: formValues.balanceQuantity,
            receivedQuantity: formValues.receivedQuantity,
            actualDeliveryDate: formValues.actualDeliveryDate,
          });
        }

       
       console.log(this.updatedPartDetail,"updatedPartDetail");
       this.goodsReceiptService.setPartDetailsData(this.updatedPartDetail)

      }
    } else {
      if (
        formValues.actualDeliveryDate === '' ||
        formValues.actualDeliveryDate === null ||
        formValues.actualDeliveryDate === undefined
      ) {
        this.submitted = true;
        this.validateAllFormFields(this.editSavePartDetailForm);
      } else {
        alert('ok step 2');
        console.log(formValues, 'editSavePartDetailForm');
      }
    }
  }

  get editSaveGoodsReceiptFormFormController() {
    return this.goodsReceiptForm.controls;
  }
  isPatchPartDetails = false;

  onGoodsReceiptCategoryChange(event: any) {
    let formValues = this.goodsReceiptForm.getRawValue();
    if (this.isPatchPartDetails) {
      if (formValues.goodsReceiptCategory.enumId === 599) {
        console.log(formValues, 'goodsReceiptForm receivePartTableRowData');
        this.editSavePartDetailForm.controls['receivedQuantity'].enable();
        this.editSavePartDetailForm.controls['actualDeliveryDate'].enable();
      } else {
        this.editSavePartDetailForm.controls['receivedQuantity'].setValue(null);
        this.editSavePartDetailForm.controls['actualDeliveryDate'].enable();
      }
    }
  }
  handleAmountCalculation(event: any) {
    const control = this.editSavePartDetailForm.controls['receivedQuantity'];

    if (
      this.editSavePartDetailForm.controls['receivedQuantity'].value >
      this.editSavePartDetailForm.controls['purchaseQuantity'].value
    ) {
      control.setErrors({ receivedQuantityLess: true });
      // control.errors['required'] = true;
    } else {
      control.setErrors({ receivedQuantityLess: false });

      const receivedQuantity =
        this.editSavePartDetailForm.controls['receivedQuantity'].value;
      const totalReceivedQuantity =
        this.editSavePartDetailForm.controls['totalReceivedQuantity'].value;
      const updatedTotalReceivedQuantity = +receivedQuantity;
      this.editSavePartDetailForm.controls['totalReceivedQuantity'].setValue(
        updatedTotalReceivedQuantity
      );
      if (
        this.editSavePartDetailForm.controls['purchaseQuantity'].value &&
        this.editSavePartDetailForm.controls['totalReceivedQuantity'].value
      ) {
        const balanceQuantity =
          this.editSavePartDetailForm.controls['purchaseQuantity'].value -
          this.editSavePartDetailForm.controls['totalReceivedQuantity'].value;
        this.editSavePartDetailForm.controls['balanceQuantity'].setValue(
          balanceQuantity
        );
      } else {
        this.editSavePartDetailForm.controls['balanceQuantity'].setValue(0);
      }
    }
  }
  get editSavePartDetailFormController() {
    return this.editSavePartDetailForm.controls;
  }

  checkNgSelectValue(event: any, controlName: any) {
    const control = this.goodsReceiptForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });
      this.goodsReceiptForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }
  dropdownSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['code'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['code'].toLocaleLowerCase() === term ||
      item['description'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['description'].toLocaleLowerCase() === term
    );
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
  receivePartTableRowData(event: any) {
    console.log(event, 'receivePartTableRowData');
    this.selectedPartDetail = event;
    let formValues = this.goodsReceiptForm.getRawValue();

    if (this.goodsReceiptForm.invalid) {
      this.validateAllFormFields(this.goodsReceiptForm);
    } else {
      this.editSavePartDetailForm.patchValue({
        ...event,
        partCode: { partId: event.partId, code: event.partCode },
        partType: { partTypeId: event.partTypeId, code: event.partTypeCode },
        stockUOM: { stockUOMId: event.stockUOMId, code: event.stockUOMCode },
        purchaseQuantity: event.purchaseOrderQuantity,
        totalReceivedQuantity: event?.totalReceivedQuantity
          ? event?.totalReceivedQuantity
          : 0,
        expectedDeliveryDate: event.deliveryDate,
      });
      this.isPatchPartDetails = true;
      if (formValues.goodsReceiptCategory.enumId === 599) {
        console.log(formValues, 'goodsReceiptForm receivePartTableRowData');
        this.editSavePartDetailForm.disable();
        this.editSavePartDetailForm.controls['receivedQuantity'].enable();
        this.editSavePartDetailForm.controls['actualDeliveryDate'].enable();
      } else {
        this.editSavePartDetailForm.disable();
        this.editSavePartDetailForm.controls['receivedQuantity'].setValue(null);
        this.editSavePartDetailForm.controls['actualDeliveryDate'].enable();
      }
    }
  }
  currentDate = new Date();
  validateActualDeliveryDate(controlName: string, event: any) {
    this.currentDate = new Date();
    const selectedDate = new Date(event);

    if (!this.editSavePartDetailForm?.controls['actualDeliveryDate']?.value) {
      this.editSavePartDetailForm.controls['actualDeliveryDate'].setErrors({
        required: true,
      });
    } else {
      if (isNaN(selectedDate.getTime())) {
        this.editSavePartDetailForm.controls['actualDeliveryDate'].setErrors({
          invalid: true,
        });
      } else if (selectedDate < this.currentDate) {
        this.editSavePartDetailForm.controls['actualDeliveryDate'].setErrors({
          customError: true,
        });
      } else {
        this.editSavePartDetailForm.controls['actualDeliveryDate'].setErrors(
          null
        );
      }
    }
  }

  handlePartSpecificationRowData(event: any) {
    const partId = event?.partId || 0;
    this.getPartSpecificationList(partId);
  }
  handleOpenPartSpecification() {
    let formValues = this.editSavePartDetailForm.getRawValue();
    console.log(formValues, 'editSavePartDetailForm');
    const partId = formValues?.partCode?.partId || 0;
    this.getPartSpecificationList(partId);

    // this.StorePartAllocationPopup?.storePartAllocationPopup.show();
  }

  getPartSpecificationList(partId: any) {
    this.loaderService.start();
    this.goodsReceiptService
      .getPartSpecificationList(partId)
      .subscribe((data: any) => {
        this.loaderService.stop();
        this.partSpecificationData = data.response;
        this.partSpecificationModal.show();
      });
  }

  openmodal() {
    this.StorePartAllocationPopup?.storePartAllocationPopup.show();
  }
  openStorePartAllocationPopup() {
    this.SelectedGoodsReceiptCategory =
      this.goodsReceiptForm.controls['goodsReceiptCategory'].value;
    this.StorePartAllocationPopup?.storePartAllocationPopup.show();
  }
}
