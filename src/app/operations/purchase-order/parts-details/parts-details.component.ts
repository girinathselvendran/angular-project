import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PurchaseOrderService } from '../service/purchase-order.service';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { NotificationService } from 'src/app/core/services';
import { ConfirmationService } from 'primeng/api';
import { StoreService } from 'src/app/master/store/service/store.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AddPartDetailsComponent } from '../add-part-details/add-part-details.component';
import { Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-parts-details',
  templateUrl: './parts-details.component.html',
  styleUrls: ['./parts-details.component.css']
})
export class PartsDetailsComponent {
  @ViewChild('addPartDetailsModel') addPartDetailsModel!: AddPartDetailsComponent;
  @ViewChild('purchasePartSpecificationModal')
  purchasePartSpecificationModal: any;
  @Input() editSavePartDetailsForm!: FormGroup;
  @Input() supplierCurrency: any;
  @Input() depotCurrency: any;
  @Input() poExchangeRate: any;
  @Input() currentUserId: any;
  @Input() currentStatusId: any;
  @Output() childValueChange = new EventEmitter<string>();
  @Input() selectedPoId: any;
  @Input() poScreenMode: any;
  @Input() editSavePOForm!: FormGroup;
  @Input() addButton: boolean = false;
  @Input() screenId: number = 0;

  purchaseOrderPartsList: any = [];
  showAddPartDetailsPopup: boolean = false;
  selectedColumnData: any;
  totalPoAmount: any;
  purchasePartSpecificationData: any;
  saveButton: boolean = false;
  poPartDetailsColumnList = [
    {
      field: 'partType',
      header: this.translate.instant('operations.purchaseOrder.grid.partType'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'partCode',
      header: this.translate.instant('operations.purchaseOrder.grid.partCode'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'partName',
      header: this.translate.instant('operations.purchaseOrder.grid.partName'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'partCategory',
      header: this.translate.instant('operations.purchaseOrder.grid.partCategory'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'partSpecificationIcon',
      header: this.translate.instant('operations.purchaseOrder.grid.partSpec'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'poQuantity',
      header: this.translate.instant('operations.purchaseOrder.grid.pOQuantity'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'partRate',
      header: this.translate.instant('operations.purchaseOrder.grid.partRate'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'totalDPLC',
      header: this.translate.instant('operations.purchaseOrder.grid.totalDPLC'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
    {
      field: 'deliveryDate',
      header: this.translate.instant('operations.purchaseOrder.grid.deliveryDate'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'pRNo',
      header: this.translate.instant('operations.purchaseOrder.grid.pRNo'),
      width: '4%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },
    {
      field: 'rFQNo',
      header: this.translate.instant('operations.purchaseOrder.grid.rFQNo'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
    {
      field: 'quoteNo',
      header: this.translate.instant('operations.purchaseOrder.grid.quoteNo'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 12,
    },
    {
      field: 'stockUom',
      header: this.translate.instant('operations.purchaseOrder.grid.stockUOM'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 13,
    },
    {
      field: 'delete',
      header: this.translate.instant('operations.purchaseOrder.grid.delete'),
      width: '1%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 14,
    },
  ]
  tableColumnsPartSpecification = [
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
  selectedPartListRecord: any;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private purchaseOrderService: PurchaseOrderService,
    private confirmationService: ConfirmationService,
    private storeService: StoreService,
    private loaderService: NgxUiLoaderService,
    public notificationService: NotificationService,
    private router: Router,

  ) {
  }

  getPurchaseOrderPartsListFn() {
    this.purchaseOrderService
      // .getPurchaseOrderPartsList(this.currentUserId, this.selectedPartListRecord?.purchaseOrderDetailId || 2)
      .getPurchaseOrderPartsList(this.currentUserId, this.selectedPoId || 0)
      .subscribe((data: any) => {
        this.purchaseOrderPartsList = data.response;
        if (data.status && data.response && data.response.length > 0) {
          this.calculateTotalPoAmount(data.response);

        } else {
          this.editSavePartDetailsForm.controls['totPOAmtInSuppCur'].setValue(0.00)
          this.editSavePartDetailsForm.controls['totalPOAmount'].setValue(0.00)
        }
      });
  }

  ngOnInit() {
    this.editSavePartDetailsForm.disable();
    if (this.poScreenMode != 'new') {
      this.getPurchaseOrderPartsListFn()
    }

    //For Approval Screen Form Validation
    if (this.screenId == 259) {
      this.editSavePartDetailsForm.disable();
      this.addButton = true;
      this.disablePartDetailsForm();
    }
  }
  disablePartDetailsForm() {
    this.addPartDetailsModel?.addPartDetailsEditForm.disable();
  }
  calculateTotalPoAmount(response: any) {

    this.totalPoAmount = response.reduce((sum: any, item: any) => {
      // Check if the property totalDPLC exists before adding it to the sum
      if (item.totalDPLC !== undefined && item.totalDPLC !== null && item.totalDPLC !== "") {
        return sum + item.totalDPLC;
      }
      return sum;
    }, 0);
    this.purchaseOrderService.setTotalPoAmount(this.totalPoAmount);
    this.editSavePartDetailsForm.controls['totalPOAmount'].setValue(this.totalPoAmount)

    let totalAmountInSupplierCurrency = this.totalPoAmount * this.poExchangeRate;

    this.editSavePartDetailsForm.controls['totPOAmtInSuppCur'].setValue(totalAmountInSupplierCurrency)

    this.purchaseOrderService.setTotalAmountInSupplierCurrency(totalAmountInSupplierCurrency);

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['depotCurrency'] || changes['supplierCurrency']) {
      // Do something with the new parentValue
      this.editSavePartDetailsForm.controls['depotCurrency'].setValue(this.depotCurrency)
      this.editSavePartDetailsForm.controls['supplierCurrency'].setValue(this.supplierCurrency)
      // Emit a new value to be sent to the parent
      this.childValueChange.emit('New Child Value');
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
  handleAddPartDetailsIcon() {
    if (this.editSavePOForm.invalid) {
      this.validateAllFormFields(this.editSavePOForm);
      return;
    } else {
      this.showAddPartDetailsPopup = true;
      this.addPartDetailsModel?.addPartDetailsModel?.show()
      this.addPartDetailsModel?.addPartDetailsEditForm?.reset();
      this.selectedColumnData = null;
    }
  }
  refreshPoPartList(event: any) {
    this.getPurchaseOrderPartsList();
  }
  receiveTablePartList(event: any) {
    this.selectedColumnData = event;
    this.addPartDetailsModel?.addPartDetailsModel?.show();
    this.addPartDetailsModel?.addPartDetailsEditForm.patchValue({
      partType: { partTypeId: event.partTypeId, code: event.partType },
      partCode: { partId: event.partId, partCode: event.partCode },
      partName: event.partName,
      partCategory: event.partCategory,
      partSpecification: event.partSpecification,
      poQuantity: event.poQuantity,
      partRate: event.partRate,
      totalCost: event.totalCost || (event.poQuantity * event.partRate),
      deliveryDate: event.deliveryDate,
      prNo: event.pRNo,
      rfqNo: event.rFQNo,
      quoteNo: event.quoteNo,
      stockUom: event.stockUom
    });
  }
  deleteRowDataPoPart(event: any) {
    const rowId = event.id;
    this.confirmationService.confirm({
      message: this.translate.instant('common.Information.deleteConfirmation'),
      header: this.translate.instant('common.notificationTitle.confirmation'),
      accept: () => {
        this.handleDeleteRowData(rowId, event);
      },
      reject: () => {
        return false;
      },
    });
  }
  handleDeleteRowData(rowId: any, event: any) {


    this.loaderService.start();
    this.purchaseOrderService
      .deletePOPartDetails(event.purchaseOrderPartDetailId)
      .subscribe((data: any) => {
        if (data['status'] === true) {
          this.purchaseOrderService

            .getPurchaseOrderPartsList(this.currentUserId, this.selectedPoId || 0)
            .subscribe((data: any) => {
              this.purchaseOrderPartsList = data.response;
              if (data.status && data.response && data.response.length > 0) {
                this.calculateTotalPoAmount(data.response);

              } else {
                this.editSavePartDetailsForm.controls['totPOAmtInSuppCur'].setValue(0.00)
                this.editSavePartDetailsForm.controls['totalPOAmount'].setValue(0.00)
              }
            });

          this.loaderService.stop();
          this.notificationService.smallBox({
            severity: 'success',
            title: this.translate.instant('common.notificationTitle.success'),
            content: data['message'],
            timeout: 5000,
            icon: 'fa fa-check',
          });
        } else {
          this.loaderService.stop();
          this.notificationService.smallBox({
            title: this.translate.instant('common.notificationTitle.error'),
            content: data['message'],

            severity: 'error',
            timeout: 5000,
            icon: 'fa fa-times',
          });
        }
      });
  }
  handlePartSpecificationRowData(event: any) {

    this.addPartDetailsModel?.getPartSpecificationList(event.partId);
    this.addPartDetailsModel?.purchasePartSpecificationModal.show();
  }

  receivePartDetailsData(event: any) {
    this.purchaseOrderPartsList = event;
    this.calculateTotalPoAmount(this.purchaseOrderPartsList);

  }

  handleClosePurchaseSpecification() {
    this.purchasePartSpecificationModal.hide();
  }
  getPurchaseOrderPartsList() {
    this.purchaseOrderService
      .getPurchaseOrderPartsList(this.currentUserId, this.selectedPoId || 0)
      .subscribe((data: any) => {
        this.purchaseOrderPartsList = data.response;
        if (data.status && data.response && data.response.length > 0) {
          this.calculateTotalPoAmount(data.response);

        } else {
          this.editSavePartDetailsForm.controls['totPOAmtInSuppCur'].setValue(0.00)
          this.editSavePartDetailsForm.controls['totalPOAmount'].setValue(0.00)
        }
      });
  }
}
