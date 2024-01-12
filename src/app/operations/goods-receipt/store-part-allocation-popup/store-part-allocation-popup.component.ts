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
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { TranslateService } from '@ngx-translate/core';
import { GoodsReceiptService } from '../service/goods-receipt.service';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { StorePartAllocationDetails } from '../model/goods-receipt-model';
import { NotificationService } from 'src/app/core/services';

@Component({
  selector: 'app-store-part-allocation-popup',
  templateUrl: './store-part-allocation-popup.component.html',
  styleUrls: ['./store-part-allocation-popup.component.css']
})
export class StorePartAllocationPopupComponent {
  @ViewChild('storePartAllocationPopup') storePartAllocationPopup: any;
  @Input() partId: any = 150;
  // @Input() partId: any = 143;
  @Input() depotId: any = 1;
  @Input() partTypeId: any = 2;
  @Input() partCode: any;
  @Input() SelectedGoodsReceiptCategory: any;
  storeNameList: any;
  zoneNameList: any;
  binNameList: any;
  storeId: any;
  storeZoneDetailId: any;
  currentUserName: any;
  storePartAllocationDetails!: StorePartAllocationDetails;

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private loaderService: NgxUiLoaderService,
    private goodsReceiptService: GoodsReceiptService,
    private userAuthService: UserAuthService,
    public notificationService: NotificationService
  ) { }
  ngOnInit() {

    this.storePartAllocationForm = this.formBuilder.group({
      storeName: [[], [Validators.required]],
      zoneName: [[], [Validators.required]],
      binName: [[], [Validators.required]],
      allocationQuantity: [" ", [Validators.required]],

    });
    this.currentUserName = this.userAuthService.getCurrentUserName();

    // this.getBinNameDropDown();
  }
  ngAfterViewInit() {
    // Call your function here
    this.getStorePartAllocationList();
    this.getStoreNameDropDown();
  }
  columnHeaderList = [
    {
      field: 'storeName',
      header: this.translate.instant("operations.goodReceipt.grid.storeName"),
      width: '10%',
      key: 1
    },
    {
      field: 'zoneName',
      header: this.translate.instant("operations.goodReceipt.grid.zoneName"),
      width: '10%',
      key: 2

    },
    {
      field: 'binName',
      header: this.translate.instant("operations.goodReceipt.grid.binName"),
      width: '10%',
      key: 3

    },
    {
      field: 'allocationQuantity',
      header: this.translate.instant("operations.goodReceipt.grid.allocationQuantity"),
      width: '10%',
      key: 4

    },

  ];
  partSpecificationList = [];
  validatevalue(arg0: string) {
    throw new Error('Method not implemented.');
  }
  checkNgSelectGeneralInfoValue($event: Event, arg1: string) {
    throw new Error('Method not implemented.');
  }
  validatePartSpecification(arg0: string) {
    throw new Error('Method not implemented.');
  }
  checkNgSelectValuePurchasePartSpecification(event: Event, arg1: string) {
    throw new Error('Method not implemented.');
  }
  closePurchasePartSpecModal() {
    this.storePartAllocationMode = "new"
    this.storePartAllocationPopup.hide();
    this.storePartAllocationForm.reset();
  }
  storePartAllocationMode: any;
  selectedRowData: any;
  receiveTableStorePartAllocation(event: any) {
    this.storePartAllocationMode = "edit"
    this.selectedRowData = event;
    console.log('table row data ', this.SelectedGoodsReceiptCategory, event, 'KKKKKK', this.SelectedGoodsReceiptCategory.enumId);
    this.storePartAllocationForm.controls['zoneName'].setValue(event.zoneName);
    this.storePartAllocationForm.controls['storeName'].setValue(event.storeName);
    this.storePartAllocationForm.controls['binName'].setValue(event.binName);
    this.storePartAllocationForm.controls['allocationQuantity'].setValue(event.allocationQuantity);
    if (this.SelectedGoodsReceiptCategory.enumId == 599) {
      console.log('enabling quNTITY');

      this.storePartAllocationForm.controls['allocationQuantity'].enable();
    } else {
      this.storePartAllocationForm.controls['allocationQuantity'].disable();
    }
  }
  saveStorePartAllocation() {
    // throw new Error('Method not implemented.');
    if (this.storePartAllocationMode == "edit") {
      this.storePartAllocationDetails = {
        StorePartMappingId: this.selectedRowData.storePartMappingId,
        PartId: this.partId,
        PartTypeId: this.partTypeId,
        StoreBinDetailId: this.selectedRowData.binId,
        StoreId: this.selectedRowData.storeId,
        StoreZoneDetailId: this.selectedRowData.zoneId,
        createdBy: this.currentUserName,
        modifiedBy: this.currentUserName,
        allocationQuantity: this.storePartAllocationForm.controls['allocationQuantity'].value,
        BinCode: this.selectedRowData.binCode || "",
        PartCode: this.selectedRowData.partCode || "",
        ZoneCode: this.selectedRowData.zoneCode || "",
      };

      this.goodsReceiptService
        .updateStorePartAllocation(this.storePartAllocationDetails)
        .subscribe((data: any) => {

          if (data['status'] === true) {
            this.storePartAllocationPopup.hide();
            // this.addPartRatesEditForm.reset();
            // this.closeAddSupplierDialog();
            // this.getPartRatesListServerSide(this.tableParams);

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
        })

    } else if (this.storePartAllocationMode == "new") {
      console.log('rtrtrt ', this.storePartAllocationForm.controls['binName'].value.binId, this.storePartAllocationForm.controls['binName'].value);

      this.storePartAllocationDetails = {
        PartId: this.partId,
        PartTypeId: this.partTypeId,
        StoreBinDetailId: this.storePartAllocationForm.controls['binName'].value.storeBinDetailId,
        StoreId: this.storePartAllocationForm.controls['storeName'].value.storeId,
        StoreZoneDetailId: this.storePartAllocationForm.controls['zoneName'].value.storeZoneDetailId,
        createdBy: this.currentUserName,
        modifiedBy: this.currentUserName,
        allocationQuantity: 11,
        // allocationQuantity: this.storePartAllocationForm.controls['allocationQuantity'].value,
        BinCode: this.storePartAllocationForm.controls['binName'].value.binCode || "",
        PartCode: this.partCode || "",
        ZoneCode: this.storePartAllocationForm.controls['zoneName'].value.zoneCode || "",
      };

      this.goodsReceiptService
        .createStorePartAllocation(this.storePartAllocationDetails)
        .subscribe((data: any) => {

          if (data['status'] === true) {
            this.storePartAllocationPopup.hide();
            // this.addPartRatesEditForm.reset();
            // this.closeAddSupplierDialog();
            // this.getPartRatesListServerSide(this.tableParams);

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
        })
    }
  }
  clearPartSpecification() {
    throw new Error('Method not implemented.');
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
  storePartAllocationForm!: FormGroup;
  submitted: boolean = false;
  disableSaveButton: boolean = false;


  get storePartAllocationFormInfo() {
    return this.storePartAllocationForm.controls;
  }
  getStoreNameDropDown() {
    this.loaderService.start();
    if (this.partSpecificationList.length > 0) {

      this.goodsReceiptService
        .getStoreNameDropDown(this.partId)
        .subscribe((res: any) => {
          if (res.status === true) {
            console.log('store name are ', res.response);
            this.storeNameList = res.response;
            this.loaderService.stop();
          }
        });
    } else {
      console.log('log worig in new mode');

      this.storePartAllocationMode = 'new';
      this.goodsReceiptService
        .getAllActiveStoreNameDropDown()
        .subscribe((res: any) => {
          if (res.status === true) {
            console.log('store name are ', res.response);
            this.storeNameList = res.response;
            this.loaderService.stop();
          }
          this.storePartAllocationForm.controls['allocationQuantity'].enable();
        });
    }

  }
  getZoneNameDropDown() {
    this.loaderService.start();
    this.goodsReceiptService
      .getStoreZoneDropDown(this.storeId)
      .subscribe((res: any) => {
        if (res.status === true) {
          console.log('store name are ', res.response);
          this.zoneNameList = res.response;
          this.loaderService.stop();
        }
      });
  }
  getBinNameDropDown() {
    this.loaderService.start();
    this.goodsReceiptService
      .getStoreBinDropDown(this.storeZoneDetailId)
      .subscribe((res: any) => {
        if (res.status === true) {
          console.log('store name are ', res.response);
          this.binNameList = res.response;
          this.loaderService.stop();
        }
      });
  }
  onStoreNameChange(event: any) {
    this.storeId = this.storePartAllocationForm.controls['storeName'].value.storeId;
    this.getZoneNameDropDown();

  }
  onStoreZoneChange(event: any) {
    this.storeZoneDetailId = this.storePartAllocationForm.controls['zoneName'].value.storeZoneDetailId;
    this.getBinNameDropDown();

  }
  getStorePartAllocationList() {
    this.loaderService.start();
    this.goodsReceiptService
      .getStorePartAllocationList(
        this.partId, this.depotId
      )
      .subscribe((data: any) => {
        if (data.status === true) {
          this.partSpecificationList = data.response;
          // this.sharedTableStoreService.setAssignGridData({ data, params });
          if (this.partSpecificationList.length > 0) {
            this.storePartAllocationForm.disable();
          } else {
            this.storePartAllocationForm.enable();

          }
        }
      });
    this.loaderService.stop();
  }
}
