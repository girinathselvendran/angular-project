import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GoodsReceiptService } from './service/goods-receipt.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { GoodsReceiptFormComponent } from './goods-receipt-form/goods-receipt-form.component';
import { defineLocale, enGbLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Router, RouterStateSnapshot } from '@angular/router';
import { NotificationService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { GoodsReceipt } from './model/goods-receipt-model';

@Component({
  selector: 'app-goods-receipt',
  templateUrl: './goods-receipt.component.html',
  styleUrls: ['./goods-receipt.component.css'],
})
export class GoodsReceiptComponent {
  @ViewChild(GoodsReceiptFormComponent)
  goodsReceiptFormComponent!: GoodsReceiptFormComponent;
  // Enable rights
  createBit: boolean = true;
  editBit: boolean = true;
  viewBit: boolean = true;
  showWarningMessageForRoleRights: boolean = false;
  warningMessageForRoleRights: string = '';
  showWarningMessageForRoleRightsForm: boolean = false;
  warningMessageForRoleRightsForm: string = '';
  disableSaveButton: boolean = false;

  serverSideProcessing: any;
  handleBackToList() {
    // throw new Error('Method not implemented.');
    this.showList = true;
  }
  overViewObject: any = {
    pending: 0,
    submitted: 0,
  };
  hideResetRFQ: any;
  handleFormResetIcon() {
    throw new Error('Method not implemented.');
  }
  hidesave: any;
  disableFormResetIcons: any;

  hideSendRFQ: any;
  disableFormSubmitIcons: any;
  handleSendRequestForQuote($event: MouseEvent) {
    throw new Error('Method not implemented.');
  }
  handleEmailIcon($event: MouseEvent) {
    throw new Error('Method not implemented.');
  }
  disableFormSendRFQIcons: any;
  hideSendEmail: any;
  handleFormNewRFQIcon() {
    throw new Error('Method not implemented.');
  }
  disableFormSendForApprovalIcons: any;
  hideSendForApproval: any;
  disableFormAddNewIcons: any;
  handleSendForApprovalFormIcon() {
    throw new Error('Method not implemented.');
  }
  disableFormCancelRFQIcons: any;
  hideCancelRFQ!: boolean;
  handleCancelIcon(arg0: string) {
    throw new Error('Method not implemented.');
  }
  disableFormPrintRFQIcons: any;
  handleFormPrintIcon() {
    throw new Error('Method not implemented.');
  }
  userId = 0;
  startPeriodSmallerThanCurrent: any;
  startPeriodSmallerThanEnd: any;
  currentCard = 1;
  showList = true;
  mode = 'new';
  clickedSearchBtn = false;
  screenId: any = '';

  editSaveFormSearch!: FormGroup;
  goodsReceiptForm!: FormGroup;
  editSavePartDetailForm!: FormGroup;
  // tableFilterFormGroup!: FormGroup;
  submittedSearch = true;
  rfqSourceDDList: readonly any[] | null | undefined;
  grNumber = '1234';
  noOfAttachment = 1;
  validatePeriod(arg0: string, $event: any) {
    throw new Error('Method not implemented.');
  }
  associatedDepots = [];
  rfqNumberDDList: readonly any[] | null | undefined;
  checkNgSearchFormSelectValue($event: Event, arg1: string) {
    throw new Error('Method not implemented.');
  }
  rfqStatusDDList: readonly any[] | null | undefined;

  goodsReceiptCategory = [];
  goodsReceiptType: any = [];
  goodsReceiptPo = [];
  goodsReceiptNo = [];
  goodsReceiptSupplier = [];
  partDetailList: any = [
    {
      partTypeId: 311,
      partTypeCode: 'STORES',
      partId: 166,
      partCode: 'AS1',
      partName: '2323e',
      stockUOMCode: 'QTY',
      partCategory: '12RE, 12RE, 12RE, 12RE, 20DC, 20DV',
      stockUOMId: 110,
      deliveryDate: '29-DEC-2023',
      purchaseOrderQuantity: 234.0,
      created: '2023-12-18T12:24:47.02239',
      createdBy: 'ADMIN',
      modified: '2023-12-18T12:24:47.022389',
      modifiedBy: 'ADMIN',
    },
  ];
  excelDataTable: any = [];
  updatedPartDetailData: any[] = [];
  totalDataGridCountComp: any;

  currentUserName!: string;
  currentCompanyId!: any;

  constructor(
    private formBuilder: FormBuilder,
    private goodsReceiptService: GoodsReceiptService,
    private loaderService: NgxUiLoaderService,
    private userAuthService: UserAuthService,
    private localeService: BsLocaleService,
    private router: Router,
    private notificationService: NotificationService,
    private translate: TranslateService,
  ) {
    this.currentUserName = this.userAuthService.getCurrentUserName();
    this.currentCompanyId = this.userAuthService.getCurrentCompanyId();
    this.userId = this.userAuthService.getCurrentUserId();
    this.goodsReceiptService.partDetailData$.subscribe((data: any[]) => {
      this.updatedPartDetailData = data;
    });
    enGbLocale.invalidDate = '';
    defineLocale('custom locale', enGbLocale);
    this.localeService.use('custom locale');
    const snapshot: RouterStateSnapshot = router.routerState.snapshot;
    this.screenId = snapshot.root.queryParams['screenId'];
  }
  paramsGlobal: any;

  ngOnInit() {
    this.editSaveFormSearch = this.formBuilder.group({
      depot: [[], []],
      poNo: [[], []],
      podateFrom: ['', []],
      podateTo: ['', []],
      supplier: [[], []],
      goodsReceiptNo: [[], []],
      goodsReceiptFromDate: ['', []],
      goodsReceiptToDate: ['', []],
      goodsReceiptCategory: [[], []],
      goodsReceiptType: [[], []],
    });
    this.goodsReceiptForm = this.formBuilder.group({
      goodsReceiptNo: ['', []],
      goodsReceiptDate: ['', []],
      depot: [[], []],
      city: [[], []],
      goodsReceiptType: [[], []],
      goodsReceiptCategory: [[], [Validators.required]],
      supplier: [[], []],
      poNumber: [[], []],
      remarks: ['', []],
    });

    this.editSavePartDetailForm = this.formBuilder.group({
      partType: [[], []],
      partCode: [[], []],
      partName: [[], []],
      partCategory: ['', []],
      purchaseQuantity: ['', []],
      totalReceivedQuantity: ['', []],
      balanceQuantity: ['', []],
      receivedQuantity: ['', [Validators.required]],
      expectedDeliveryDate: ['', []],
      actualDeliveryDate: [new Date(), [Validators.required]],
      stockUOM: [[], []],
    });
    // this.tableFilterFormGroup = this.formBuilder.group({
    //   goodsReceiptNo: ['', []],
    //   goodsReceiptDate: ['', []],
    //   goodsReceiptCategory: ['', []],
    //   supplierCode: ['', []],
    //   supplierName: ['', []],
    //   depot: ['', []],
    //   city: ['', []],
    //   purchaseOrderNo: ['', []],
    //   totalAmountPoQuantity: ['', []],
    //   supplierCurrency: ['', []],
    //   totalAmountReceivedQuantity: ['', []],
    //   depotCurrency: ['', []],
    //   modifiedBy: ['', []],
    //   modifiedDate: ['', []],
    // });
    this.getGoodsReceiptOverView();

    this.getDropdownValues();
    this.getServerSideTableList(this.paramsGlobal, this.currentCard);
  }

  ////////////

  getPRNoByCurrentStatusId(currentStatusId: number, cardNumber: number = 1) {
    // this.requestForQuoteService
    //   .getRequestForQuoteNoByCurrentStatusId(currentStatusId)
    //   .subscribe((res) => {
    //     if (res.status === true) {
    //       this.rfqNumberDDList = res.response;
    //     }
    //   });
  }
  ////////////
  selectedGoodsReceiptData: any = null;
  async getReceivedTableRowData(event: { data: any; currentCard: number }) {
    this.selectedGoodsReceiptData = event;

    if (event.currentCard === 2) {
      // 2 is flag number for submit
    } else {
      this.goodsReceiptService
        .getPartDetailsFromPurchaseOrder(event.data.purchaseOrderId)
        .subscribe((res) => {
          if (res.status === true) {
            console.log(res.response, 'getPartDetailsFromPurchaseOrder');
            this.partDetailList = res.response.map((item: any) => {
              return {
                ...item,
                storePartAllocation: 'Store - Part Allocation',
              };
            });
          }
        });

      console.log(event.data, 'event.data >>>>>>>>');

      this.goodsReceiptForm.patchValue({
        goodsReceiptNo: event.data.goodsReceiptNo,
        goodsReceiptDate: event.data.goodsReceiptDate,
        depot: { depotId: event.data.depotId, code: event.data.depot },
        city: event.data.city,
        goodsReceiptType: {
          goodsReceiptTypeId: this.goodsReceiptType[0]?.enumId,
          code: this.goodsReceiptType[0]?.code,
        },
        goodsReceiptCategory: event.data.goodsReceiptCategory,
        supplier: {
          supplierId: event.data.supplierId,
          supplierCode: event.data.supplierCode,
        },
        poNumber: {
          purchaseOrderId: event.data.purchaseOrderId,
          purchaseOrderNo: event.data.purchaseOrderNo,
        },
        remarks: event.data.remarks,
      });

      this.goodsReceiptForm.disable();
      this.goodsReceiptForm.controls['goodsReceiptCategory'].enable();
      this.editSavePartDetailForm.disable();

      this.showList = false;
    }

    // this.mode = 'edit';
  }

  getActiveDepot() {
    this.goodsReceiptService.getActiveDepot(this.userId).subscribe((res) => {
      if (res.status === true) {
        if (res.response.length === 1) {
          this.editSaveFormSearch.controls['depot'].setValue(res.response[0]);
          this.editSaveFormSearch.controls['depot'].disable();
        } else {
          if (this.mode != 'view') {
            this.editSaveFormSearch.controls['depot'].enable();
          }
          this.associatedDepots = res.response;
        }
      }
    });
  }

  getDropdownValues() {
    this.getActiveDepot();
    this.goodsReceiptService.getPONoByPending().subscribe((res: any) => {
      if (res.status === true) {
        this.goodsReceiptPo = res.response;
      }
    });

    this.goodsReceiptService.getSupplier().subscribe((res: any) => {
      if (res.status === true) {
        this.goodsReceiptSupplier = res.response;
      }
    });

    this.goodsReceiptService.goodsReceiptCategory().subscribe((res: any) => {
      if (res.status === true) {
        this.goodsReceiptCategory = res.response;
      }
    });

    // if (this.currentCard === 2) {

    // }
    this.goodsReceiptService.getPONoBySubmitted().subscribe((res: any) => {
      if (res.status === true) {
        this.goodsReceiptPo = res.response;
      }
    });
    this.goodsReceiptService.goodsReceiptNo().subscribe((res: any) => {
      if (res.status === true) {
        this.goodsReceiptNo = res.response;
      }
    });
    this.goodsReceiptService.goodsReceiptType().subscribe((res: any) => {
      if (res.status === true) {
        this.goodsReceiptType = res.response;
      }
    });
  }

  getGoodsReceiptOverView() {
    this.loaderService.start();
    this.goodsReceiptService.getGoodsReceiptOverView().subscribe((res) => {
      // this.loaderService.stop();
      if (res.status === true) {
        this.overViewObject = res.response;
      }
    });
  }
  searchRecordsList() {
    throw new Error('Method not implemented.');
  }

  resetForm() {
    throw new Error('Method not implemented.');
  }

  getPendingData(currentCard: number) {
    this.getDropdownValues();
    this.getServerSideTableList(this.paramsGlobal, currentCard);
  }

  getSubmitData(currentCard: number) {
    this.currentCard = currentCard;
    this.getDropdownValues();
    this.getServerSideTableList(this.paramsGlobal, currentCard);
  }

  get editSaveFormSearchPendingController() {
    return this.editSaveFormSearch.controls;
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

  dropdownSearchFngoodsReceiptCategory(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['depotName'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotName'].toLocaleLowerCase() === term ||
      item['depotCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotCode'].toLocaleLowerCase() === term
    );
  }
  checkNgSelectValue(event: any, controlName: any) {
    const control = this.editSaveFormSearch.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.editSaveFormSearch.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }
  handleAddRecordIcon(event: any) {
    this.showList = false;
    // this.nullifyTempArray();
    // this.showPartDetails = true;
    // this.mode = 'new';
    // this.editSaveForm.reset();
    // this.editSaveRFQPartForm.reset();
    // this.newPartDetailList = [];
  }
  goodsReceiptData: any = [];
  getServerSideTableList(params: any, currentCard: number) {
    this.loaderService.start();
    this.goodsReceiptService
      .getGoodsReceiptListServerSide(this.currentCard)
      .subscribe((res: any) => {
        if (res.status === true) {
          this.goodsReceiptData = res.response;
        }
        this.currentCard = currentCard;
        this.loaderService.stop();
      });

    if (this.currentCard == 1) {
      this.paramsGlobal = params;
      // const formValues = this.editSaveFormSearch.getRawValue();
      // let poDate = this.goodsReceiptList?.tableFilterFormGroup.value.poDate
      //   ? this.goodsReceiptList?.tableFilterFormGroup.value.poDate
      //   : '';
      this.serverSideProcessing = {
        ...params,
        CurrentPage: params?.first || 0,
        // GlobalFilter:
        //   params?.globalFilter != undefined
        //     ? params?.globalFilter
        //     : this.goodsReceiptList != undefined
        //       ? this.goodsReceiptList?.sharedLazyTableNew?.globalFilter.value
        //       : null,
        // PageSize: params?.rows,
        // SortField: params.sortField ? params.sortField : 'sortOnly',
        // SortOrder: params.sortField
        //   ? params.sortOrder
        //     ? params.sortOrder
        //     : -1
        //   : -1,
        // poNumber: this.goodsReceiptList?.tableFilterFormGroup.value.poNumber
        //   ? this.goodsReceiptList?.tableFilterFormGroup.value.poNumber
        //   : '',
        // poDate: poDate,
        // supplierCode: this.goodsReceiptList?.tableFilterFormGroup.value
        //   .supplierCode
        //   ? this.goodsReceiptList?.tableFilterFormGroup.value.supplierCode
        //   : '',
        // supplierName: this.goodsReceiptList?.tableFilterFormGroup.value
        //   .supplierName
        //   ? this.goodsReceiptList?.tableFilterFormGroup.value.supplierName
        //   : '',
        // goodsReceiptNo: this.goodsReceiptList?.tableFilterFormGroup.value
        //   .goodsReceiptNo
        //   ? this.goodsReceiptList?.tableFilterFormGroup.value.goodsReceiptNo
        //   : '',
        // goodsReceiptDate: this.goodsReceiptList?.tableFilterFormGroup.value
        //   .goodsReceiptDate
        //   ? this.goodsReceiptList?.tableFilterFormGroup.value.goodsReceiptDate
        //   : '',
        // city: this.goodsReceiptList?.tableFilterFormGroup.value.city
        //   ? this.goodsReceiptList?.tableFilterFormGroup.value.city
        //   : '',
        // rfqNo: this.goodsReceiptList?.tableFilterFormGroup.value.rfqNo
        //   ? this.goodsReceiptList?.tableFilterFormGroup.value.rfqNo
        //   : '',
        // prNo: this.goodsReceiptList?.tableFilterFormGroup.value.prNo
        //   ? this.goodsReceiptList?.tableFilterFormGroup.value.prNo
        //   : '',

        // depot: this.goodsReceiptList?.tableFilterFormGroup.value.depot
        //   ? this.goodsReceiptList?.tableFilterFormGroup.value.depot
        //   : '',
        // currency: this.goodsReceiptList?.tableFilterFormGroup.value
        //   .currency
        //   ? this.goodsReceiptList?.tableFilterFormGroup.value.currency
        //   : '',
        // poValueInSupplierCurrency: this.goodsReceiptList?.tableFilterFormGroup
        //   .value.poValueInSupplierCurrency
        //   ? this.goodsReceiptList?.tableFilterFormGroup.value
        //     .poValueInSupplierCurrency
        //   : '',
        // poValue: this.goodsReceiptList?.tableFilterFormGroup.value
        //   .poValue
        //   ? this.goodsReceiptList?.tableFilterFormGroup.value
        //     .poValue
        //   : '',
        // lastModifiedBy: this.goodsReceiptList?.tableFilterFormGroup.value
        //   .modifiedBy
        //   ? this.goodsReceiptList?.tableFilterFormGroup.value.modifiedBy
        //   : '',
        // lastModifiedDate: this.goodsReceiptList?.tableFilterFormGroup.value
        //   .modifiedDate
        //   ? this.goodsReceiptList?.tableFilterFormGroup.value.modifiedDate
        //   : '',

        // searchDepot: [13, 1],
        // // searchDepot: formValues?.depot?.depotId || 0,
        // searchPurchaseOrder: formValues?.purchaseOrder?.poNumber || '',
        // searchPoStatus: this.currentStatusId || 0,
        // searchPoSource: formValues?.poSource.enumId || 0,
        // searchPrNoRfqNoQuoteNo: formValues?.prNoRfqNoQuoteNo || '',
        // searchPoFromDate: formValues?.poFromDate
        //   ? this.formatDate(formValues.poFromDate)
        //   : '',
        // searchPoToDate: formValues?.poToDate
        //   ? this.formatDate(formValues.poToDate)
        //   : '',
        // searchRfqFromDate: formValues?.rfqFromDate
        //   ? this.formatDate(formValues.rfqFromDate)
        //   : '',
        // searchRfqToDate: formValues?.rfqToDate
        //   ? this.formatDate(formValues.rfqToDate)
        //   : '',
      };

      // this.searchPurchaseOrder(this.serverSideProcessing);
    }
  }
  // searchPurchaseOrder(params: any) {

  //   this.loaderService.start();
  //   this.goodsReceiptService
  //     .getGoodsReceiptListServerSide(
  //       params,
  //       this.userAuthService.getCurrentCompanyId(),
  //       this.userAuthService.getCurrentUserId()
  //     )
  //     .subscribe((data: any) => {
  //       if (data.status === true) {

  //         this.sharedTableStoreService.setAssignGridData({ data, params });
  //       }
  //     });
  //   this.loaderService.stop();
  // }
  exportToExcel(event: any) {
    let newColumns = event?.columns?.filter(
      (key: any) => key.field != 'checkbox'
    );

    let params: any = { first: 0, rows: this.totalDataGridCountComp };
    newColumns?.map((item: { [x: string]: any; field: string }) => {});
    this.excelDataTable = [];
    this.excelDataTable.columns = newColumns;
    this.excelDataTable.filteredValue = undefined;
    let downloaded: boolean;
    const formValues = this.editSaveFormSearch.getRawValue();

    let serverSideProcessing = {
      ...params,
      currentPage: params?.first || 0,
      globalFilter:
        params?.globalFilter != undefined
          ? params?.globalFilter
          : this.goodsReceiptData != undefined
          ? this.goodsReceiptData?.sharedLazyTableNew?.globalFilter.value
          : null,
      pageSize: params?.rows,
      sortField: params.sortField ? params.sortField : 'sortOnly',
      sortOrder: params.sortField
        ? params.sortOrder
          ? params.sortOrder
          : -1
        : -1,
      // goodsReceiptNo: this.goodsReceiptList?.tableFilterFormGroup.value
      //   .goodsReceiptNo
      //   ? this.goodsReceiptList?.tableFilterFormGroup.value.goodsReceiptNo
      //   : '',
      // goodsReceiptDate: this.goodsReceiptList?.tableFilterFormGroup.value
      //   .goodsReceiptDate
      //   ? this.goodsReceiptList?.tableFilterFormGroup.value.goodsReceiptDate
      //   : '',
      // goodsReceiptCategory: this.goodsReceiptList?.tableFilterFormGroup.value
      //   .goodsReceiptCategory
      //   ? this.goodsReceiptList?.tableFilterFormGroup.value.goodsReceiptCategory
      //   : '',
      // supplierCode: this.goodsReceiptList?.tableFilterFormGroup.value
      //   .supplierCode
      //   ? this.goodsReceiptList?.tableFilterFormGroup.value.supplierCode
      //   : '',
      // supplierName: this.goodsReceiptList?.tableFilterFormGroup.value
      //   .supplierName
      //   ? this.goodsReceiptList?.tableFilterFormGroup.value.supplierName
      //   : '',
      // depot: this.goodsReceiptList?.tableFilterFormGroup.value.depot
      //   ? this.goodsReceiptList?.tableFilterFormGroup.value.depot
      //   : '',
      // city: this.goodsReceiptList?.tableFilterFormGroup.value.city
      //   ? this.goodsReceiptList?.tableFilterFormGroup.value.city
      //   : '',
      // poNumber: this.goodsReceiptList?.tableFilterFormGroup.value.poNumber
      //   ? this.goodsReceiptList?.tableFilterFormGroup.value.poNumber
      //   : '',
      // totalAmountPoQuantity: this.goodsReceiptList?.tableFilterFormGroup.value
      //   .totalAmountPoQuantity
      //   ? this.goodsReceiptList?.tableFilterFormGroup.value.totalAmountPoQuantity
      //   : '',
      // supplierCurrency: this.goodsReceiptList?.tableFilterFormGroup.value
      //   .supplierCurrency
      //   ? this.goodsReceiptList?.tableFilterFormGroup.value.supplierCurrency
      //   : '',
      // totalAmountReceivedQuantity: this.goodsReceiptList?.tableFilterFormGroup.value
      //   .totalAmountReceivedQuantity
      //   ? this.goodsReceiptList?.tableFilterFormGroup.value.totalAmountReceivedQuantity
      //   : '',
      // depotCurrency: this.goodsReceiptList?.tableFilterFormGroup.value
      //   .depotCurrency
      //   ? this.goodsReceiptList?.tableFilterFormGroup.value.depotCurrency
      //   : '',
      // lastModifiedBy: this.goodsReceiptList?.tableFilterFormGroup.value
      //   .modifiedBy
      //   ? this.goodsReceiptList?.tableFilterFormGroup.value.modifiedBy
      //   : '',
      // lastModifiedDate: this.goodsReceiptList?.tableFilterFormGroup.value
      //   .modifiedDate
      //   ? this.goodsReceiptList?.tableFilterFormGroup.value.modifiedDate
      //   : '',
      searchPoNo:
        formValues?.poNo?.map((poNo: { purchaseOrderId: any }) => poNo?.purchaseOrderId) ??
        [],
      searchSupplier:
        formValues?.supplier?.map((supplier: { supplierId: any }) => supplier?.supplierId) ??
        [],
      searchPodateFrom: formValues?.podateFrom,
      searchPodateTo: formValues?.podateTo,
      searchDepot:
        formValues?.depot?.map((depot: { depotId: any }) => depot?.depotId) ??
        [],
      searchGoodsReceiptNo:
        formValues?.goodsReceiptNo?.map((goodsReceiptNo: { goodsReceiptId: any }) => goodsReceiptNo?.goodsReceiptId) ??
        [],
      searchGoodsReceiptFromDate: formValues?.goodsReceiptFromDate,
      searchGoodsReceiptToDate: formValues?.goodsReceiptToDate,
      searchGoodsReceiptType:
        formValues?.goodsReceiptType?.map((goodsReceiptType: { enumId: any }) => goodsReceiptType?.enumId) ??
        [],
      searchGoodsReceiptCategory:
        formValues?.goodsReceiptCategory?.map((goodsReceiptCategory: { enumId: any }) => goodsReceiptCategory?.enumId) ??
        [],
    }
    // this.loaderService.start();
    // this.goodsReceiptService
    //   .getGoodsReceiptListServerSide(
    //     serverSideProcessing,
    //     this.userAuthService.getCurrentCompanyId(),
    //     this.userAuthService.getCurrentUserId()
    //   )
    //   .subscribe((data: any) => {
    //     if (data.status === true) {

    //       this.sharedTableStoreService.setAssignGridData({ data, params });
    //     }
    //   });
    // this.loaderService.stop();
  }

  handleFormSubmit() {
    if (this.updatedPartDetailData.length !== 0) {
      let headerInfo = this.goodsReceiptForm.getRawValue();

      let consolidatedObject: GoodsReceipt = {
        purchaseOrderId: headerInfo.poNumber.purchaseOrderId,
        supplierId: headerInfo.supplier.supplierId,
        depotId: headerInfo.depot.depotId,
        companyId: this.currentCompanyId,
        goodsReceiptTypeId: headerInfo.goodsReceiptType.goodsReceiptTypeId,
        goodsReceiptCategoryId: headerInfo.goodsReceiptCategory.enumId,
        remarks: headerInfo.remarks,
        goodsReceiptDate: headerInfo.goodsReceiptDate,
        fileDescription: '',
        modifiedBy: this.currentUserName,
        createdBy: this.currentUserName,
        goodsReceiptPartDetails: this.updatedPartDetailData.map((part) => ({
          partTypeId: part.partTypeId,
          partId: part.partId,
          purchaseQuantity: part.purchaseOrderQuantity,
          totalReceivedQuantity: part.totalReceivedQuantity,
          balanceQuantity: part.balanceQuantity,
          receivedQuantity: part.receivedQuantity,
          expectedDeliveryDate: part.deliveryDate,
          actualDeliveryDate: part.actualDeliveryDate,
        })),
      };
      this.loaderService.start()
      this.goodsReceiptService
        .CreateGoodsReceipt(consolidatedObject)
        .subscribe((data) => {
          this.loaderService.stop();
          if (data['status'] === true) {
            this.loaderService.stop()

            this.notificationService.smallBox({
              severity: 'success',
              title: this.translate.instant('common.notificationTitle.success'),
              content: data['message'],
              timeout: 5000,
              icon: 'fa fa-check',
            });
            data.response['poNumber'] = data.response['purchaseOrderNo'];
            // this.selectedPoRowData = data.response;
            this.mode = 'edit';
            // this.poNumber = data.response.purchaseOrderNo;
            // this.purchaseOrderFormComponent.getPurchaseOrderPartsListFn();
            // this.purchaseOrderForm?.partDetailsData?.editSavePartDetailsForm.controls[
            //   'poNumber'
            // ].setValue(this.poNumber);
            // this.getServerSideTableList(this.paramsGlobal);
            // this.selectedPoId = data?.response?.purchaseOrderId;
            // this.getAdditionalServiceList(data?.response?.purchaseOrderId)
            // this.enableRights();
            // this.editSaveForm.markAsPristine();
            this.goodsReceiptService.setPartDetailsData([]);
            this.updatedPartDetailData = [];
          } else {
            this.notificationService.smallBox({
              title: this.translate.instant('common.notificationTitle.error'),
              content: data['message'],
              severity: 'error',
              timeout: 5000,
              icon: 'fa fa-times',
            });
          }
        });
    } else {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.information'),
        content: this.translate.instant('common.Information.noChangesInfo'),
        severity: 'info',
        timeout: 3000,
        icon: 'fa fa-check',
      });
    }
  }
  // Enable Rights
  getPageRights(screenId: any) {


    this.enableRights();
    this.userAuthService
      .getPageRights(screenId, this.userAuthService.getCurrentPersonaId())
      .subscribe((data) => {
        if (data['status'] === true) {
          if (data['response'].length > 0) {
            this.createBit = data['response'][0].createBit;
            this.editBit = data['response'][0].editBit;
            this.viewBit = data['response'][0].viewBit;
            this.enableRights();
          } else {
          }
        } else {
          this.notificationService.smallBox({
            title: this.translate.instant(
              'common.notificationTitle.information'
            ),
            content: data['message'],
            severity: 'info',
            timeout: 2000,
            icon: 'fa fa-check',
          });
        }
      });
  }
  enableRights() {
    this.getPageRights(this.screenId);

    if (!this.editBit && !this.createBit && this.viewBit) {
      // only view

      this.showWarningMessageForRoleRightsForm = true;
      this.warningMessageForRoleRightsForm = 'common.roleRightsMessages.edit';
      this.mode = 'view';
      this.disableFormSubmitIcons = true;
      this.editSavePartDetailForm.disable();
      if (this.currentCard == 1) {
        //overall
        this.disableFormAddNewIcons = true;
        this.disableFormSubmitIcons = true;
        this.disableFormResetIcons = true;
      } else if (this.currentCard == 2) {
        //draft
        this.disableFormSubmitIcons = true;
        this.disableFormResetIcons = true;
        this.editSavePartDetailForm.disable();
      }
    } else if (!this.createBit && this.editBit && this.viewBit) {
      // edit and view
      this.showWarningMessageForRoleRightsForm = true;
      this.warningMessageForRoleRightsForm =
        'common.roleRightsMessages.create';

      this.mode = 'edit';
      this.disableFormSubmitIcons = true;
      this.disableFormResetIcons = true;
      if (this.currentCard == 1) {
        //overall
        this.disableFormSubmitIcons = true;
        this.disableFormResetIcons = true;
        this.disableFormSendForApprovalIcons = false;
        this.disableFormSubmitIcons = false;
        this.disableFormResetIcons = false;
      } else if (this.currentCard == 2) {
        //draft

        this.disableFormSubmitIcons = false;
        this.disableFormResetIcons = false;
      }
    } else if (this.createBit && !this.editBit && this.viewBit) {
      // create and view
      this.showWarningMessageForRoleRights = true;
      this.warningMessageForRoleRights = 'common.roleRightsMessages.edit';
      this.showWarningMessageForRoleRightsForm = true;
      this.warningMessageForRoleRightsForm = 'common.roleRightsMessages.edit';
      this.mode = 'view';
      this.showWarningMessageForRoleRightsForm = true;
      this.warningMessageForRoleRightsForm = 'common.roleRightsMessages.edit';
      this.disableFormSubmitIcons = true;
      this.disableFormAddNewIcons = false;
      this.disableFormSubmitIcons = true;

      if (this.currentCard == 1) {
        //overall
      } else if (this.currentCard == 2) {
        //draft
        this.mode = 'new';

        this.disableFormAddNewIcons = false;
        this.disableFormPrintRFQIcons = false;
        this.disableFormSendForApprovalIcons = false;
        this.disableFormResetIcons = false;
      }
    }
  }
}
