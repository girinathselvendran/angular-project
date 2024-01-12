import { Component, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { RequestForQuoteService } from '../../request-for-quote/service/request-for-quote.service';
import { PurchaseOrderService } from '../../purchase-order/service/purchase-order.service';
import { PurchaseRequisitionService } from '../../purchase-requisition/service/purchase-requisition.service';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { DatePipe } from '@angular/common';
import { PartSpecificationsComponent } from 'src/app/shared/components/popup/part-specifications/part-specifications.component';
import { PurchaseRequisitionFormComponent } from '../../purchase-requisition/purchase-requisition-form/purchase-requisition-form.component';

@Component({
  selector: 'app-approval-form',
  templateUrl: './approval-form.component.html',
})
export class ApprovalFormComponent {
  @ViewChild(PartSpecificationsComponent) partSpecification!: PartSpecificationsComponent;
  @ViewChild(PurchaseRequisitionFormComponent) purchaseRequisition!: PurchaseRequisitionFormComponent;
  @Input() selectedFormRowData!: any;
  @Input() editSavePRForm!: FormGroup;
  @Input() editSaveRFQForm!: FormGroup;
  @Input() editSaveRFQPartForm!: FormGroup;
  @Input() editSavePOForm!: FormGroup;
  @Input() screenId: number = 0;
  @Input() companyId!: any;
  @Input() userId!: any;
  @Input() userName!: any;

  purchaseRequisitionPartsList: any = [];
  editSaveSupplierForm!: FormGroup;
  tableFilterFormGroup!: FormGroup;
  disableEmailPOIcons!: boolean;
  mode = "new"; // initial value
  formMode = "view"; // initial value
  selectedForm: string = "PR_FORM" // initial value
  poFormEnableRights!: any;
  selectedPoId: any;
  prId: any;
  additionalChargesList = [];
  currentStatusId = 12;
  associatedDepots: any = [];
  requestForQuoteId: number = 0;
  newPartDetailList = []
  partSpecificationData: any = [];

  constructor(
    private requestForQuoteService: RequestForQuoteService,
    private purchaseOrderService: PurchaseOrderService,
    private purchaseRequisitionService: PurchaseRequisitionService,
    private userAuthService: UserAuthService,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.selectedPoId = this.selectedFormRowData?.value?.purchaseOrderId || 0;
    this.prId = this.selectedFormRowData?.value?.purchaseRequisitionId || 0;
    this.currentStatusId = this.selectedFormRowData?.value?.currentStatusId || 0;

    if (this.selectedFormRowData?.selectedTab) {
      const selectedTab = this.selectedFormRowData?.selectedTab;
      this.selectedForm = selectedTab;
    }

    if (this.selectedForm == "PO") {
      this.selectedFormRowData = this.selectedFormRowData.value;
    }
    if (this.selectedForm == "RFQ") {
      this.requestForQuoteId = this.selectedFormRowData.value.requestForQuoteId;

    }
    if (this.prId != 0) {
      this.getPurchaseRequisitionPartsList(this.prId)
      this.editSavePRForm.disable();
    }

    this.getActiveDepot();
    this.getAdditionalServiceList(this.selectedPoId);
  }

  getAdditionalServiceList(poId: any) {
    this.purchaseOrderService.getAdditionalServiceList(poId).subscribe((res: any) => {
      if (res.status === true) {
        this.additionalChargesList = res.response;
        this.additionalChargesList.map((data: any) => {
          data.chargesCode = data.charges,
            data.values = data.value
        })
      }
    });
  }

  handleOpenPurchaseSpecification() {
    this.partSpecification.handleOpenSpecification();
    this.getPartSpecificationList(this.purchaseRequisition?.editSavePRForm?.value?.partCode?.partId || 0);
  }

  getPartSpecificationList(partId: any) {
    this.requestForQuoteService
      .getPartSpecificationList(partId)
      .subscribe((data: any) => {
        this.partSpecificationData = data.response;
      });
  }

  getActiveDepot() {
    this.requestForQuoteService
      .getActiveDepot(this.userId)
      .subscribe((res) => {
        if (res.status === true) {
          if (res.response.length === 1) {

            this.editSaveRFQForm.controls['depot'].setValue(res.response[0]);
            this.editSaveRFQForm.controls['depot'].disable();
          } else {
            this.associatedDepots = res.response;
          }
        }
      });
  }



  getPurchaseRequisitionPartsList(purchaseRequisitionId: any) {
    this.purchaseRequisitionService
      .getPurchaseRequisitionPartsList(
        this.userAuthService.getCurrentUserId(),
        purchaseRequisitionId
      )
      .subscribe((res) => {
        if (res.status === true) {
          this.purchaseRequisitionPartsList = res.response;

          const sum = this.purchaseRequisitionPartsList.reduce(
            (accumulator: any, object: any) => {
              return accumulator + object.estimatedCost;
            },
            0
          );
        }
      });
  }

  receiveTablePartList(event: any) {
    this.mode = 'edit';
    this.editSavePRForm.patchValue({
      depot: event.depot,
      partType: {
        code: event.partType,
        description: event.partTypeId,
      },
      partCode: {
        partCode: event.partCode,
        partId: event?.partId || event.partCodeId,
      },
      partName: event.partDescription,
      partCategory: event.partCategory,
      availableStock: event.availableStock,
      stockUOM: event.stockUom.unitCode,
      stockUOMId: event.stockUOM?.stockUomId || event.stockUomId,
      requisitionQuantity: event.requisitionQuantity,
      partRate: event.partRate,
      estimatedCost: event.estimatedCost,
      requiredDate: this.formatDate(event.requiredDate),
      createdBy: event.createdBy,
      createdDate: this.formatDate(event.created),
      remarks: event.remarks,
    });
  }
  formatDate(inputDate: string | null | undefined): string {
    if (inputDate) {
      const formattedDate = this.datePipe
        .transform(inputDate, 'dd-MMM-yyyy')!
        .toUpperCase();
      return formattedDate;
    } else {
      return '';
    }
  }
}
