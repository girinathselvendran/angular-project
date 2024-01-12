import { Component, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApprovalListComponent } from './approval-list/approval-list.component';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { PurchaseApprovalService } from './service/purchase-approval.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApprovalPopupComponent } from './approval-popup/approval-popup.component';
import { CancelRejectionPopupComponent } from './cancel-rejection-popup/cancel-rejection-popup.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SendEmailComponent } from '../../shared/components/send-email/send-email.component';
import { NotificationService } from 'src/app/core/services';
import { ConfirmationService } from 'primeng/api';
import { PurchaseOrderService } from '../purchase-order/service/purchase-order.service';
import { PurchaseRequisitionService } from '../purchase-requisition/service/purchase-requisition.service';
import { GeneratePoPdfComponent } from '../purchase-order/generate-po-pdf/generate-po-pdf.component';
import { PurchaseOrderOutputData } from '../purchase-order/model/purchase-order-model';
import { RequestForQuoteService } from '../request-for-quote/service/request-for-quote.service';
import { RejectionPopupComponent } from './rejection-popup/rejection-popup.component';
import { PurchaseRequisitionOutPutData } from '../purchase-requisition/model/purchase-requisition-model';
import { Router, RouterStateSnapshot } from '@angular/router';
import { defineLocale, enGbLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { RequestForQuoteOutputPrintData } from '../request-for-quote/model/request-for-quote_model';
import { GenerateRfqPdfComponent } from '../request-for-quote/generate-rfq-pdf/generate-rfq-pdf.component';
import { FormCanDeactivate } from 'src/app/core/guards/form-can-deactivate';
import { GeneratePdfComponent } from '../purchase-requisition/generate-pdf/generate-pdf.component';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css']
})
export class ApprovalComponent extends FormCanDeactivate {

  @ViewChild('emailModal') emailModal!: SendEmailComponent;
  @ViewChild('approval') approvalListComponent:
    | ApprovalListComponent
    | undefined;
  @ViewChild('approvalpopup') approvalPopup!: ApprovalPopupComponent;
  @ViewChild('cancelpopup') cancelpopup!: CancelRejectionPopupComponent;
  @ViewChild('rejectionpopup') rejectionpopup!: RejectionPopupComponent;
  @ViewChild(GeneratePdfComponent) generatePdfComponent!: GeneratePdfComponent;
  @ViewChild(GenerateRfqPdfComponent) GenerateRfqPdfComponent!: GenerateRfqPdfComponent;
  @Input() requestForQuoteOutputData: any;
  @ViewChild(GenerateRfqPdfComponent)
  generateRfqPdfComponent!: GenerateRfqPdfComponent;
  @ViewChild(GeneratePoPdfComponent)
  generatePurchaseOrderPdfComponent!: GeneratePoPdfComponent;

  editSaveForm!: FormGroup;
  mode = "new"
  selectedRowNo = "";
  createBit: boolean = true;
  editBit: boolean = true;
  viewBit: boolean = true;
  showWarningMessageForRoleRights: boolean = false;
  warningMessageForRoleRights: string = '';
  monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]; // Month List
  disableRejectIcons: boolean = false;
  disablePrintIcons: boolean = false;
  disableApproveIcons: boolean = false;
  disableEmailIcons: boolean = false;
  disableCancelRejectionIcons: boolean = true;
  disableFormRejectIcons: boolean = false;
  disableFormPrintIcons: boolean = false;
  disableFormEmailIcons: boolean = false;
  disableFormApproveIcons: boolean = false;
  disableFormCancelIcons: boolean = false;
  updateApproval: boolean = false;
  showCancelIcon = false;
  rfqAttachmentPath: any = [];
  revenueData: { labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string; borderColor: string; }[]; } | undefined;
  options: any;
  showGridByType = 1;
  selectedForm: string = "PR";//initial value - default show Purchase requisition
  selectedTabStatus: string = "PENDING";//initial value - default show PENDING STATUS
  showList: boolean = true;
  selectedRowList: any = { value: null, selectedTabStatus: this.selectedTabStatus, selectedTab: this.selectedForm };
  approvalGridTitle: any = this.translate.instant('operations.approval.titles.pendingApprovalPurchaseRequisition');
  pendingPR: number = 0; //initial Value
  pendingPO: number = 0; //initial Value
  pendingRFQ: number = 0; //initial Value
  approvedPR: number = 0; //initial Value
  approvedPO: number = 0; //initial Value
  approvedRFQ: number = 0; //initial Value
  prTrend: any = [];
  poTrend: any = [];
  rfqTrend: any = [];
  selectedDataList: any = [];
  showPRCount: boolean = false;
  showPOCount: boolean = false;
  showRFQCount: boolean = false;
  lastModifiedDate: any = "";
  editSavePRForm!: FormGroup;
  editSaveRFQForm!: FormGroup;
  editSaveRFQPartForm!: FormGroup;
  editSavePOForm!: FormGroup;
  emailSubject: string = "";
  attachmentPath: any;
  companyId!: any;
  userId!: any;
  userName!: any;
  homeScreen: any;
  selectedRowDataIds: any = [];
  selectedRowDataNos: any = [];
  submitted = false;
  selectedRowDetails!: any;
  screenId: number = 0;
  currentDate!: Date;


  constructor(
    private translate: TranslateService,
    private userAuthService: UserAuthService,
    private purchaseApprovalService: PurchaseApprovalService,
    private commonService: CommonService,
    public notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder,
    private loaderService: NgxUiLoaderService,
    private purchaseOrderService: PurchaseOrderService,
    private purchaseRequisitionService: PurchaseRequisitionService,
    private requestForQuoteService: RequestForQuoteService,
    private router: Router,
    private localeService: BsLocaleService,
    private sharedTableStoreService: SharedTableStoreService,


  ) {
    super();
    enGbLocale.invalidDate = '';
    defineLocale('custom locale', enGbLocale);
    this.localeService.use('custom locale');
    const snapshot: RouterStateSnapshot = router.routerState.snapshot;
    this.screenId = snapshot.root.queryParams['screenId'];
  }

  ngOnInit() {
    this.getOverviewCount();
    this.initialFormGroup();
    console.log('uuuuuuuuu', this.approvalPopup?.approvalPopup);

    this.companyId = this.userAuthService.getCurrentCompanyId();
    this.userId = this.userAuthService.getCurrentUserId();
    this.userName = this.userAuthService.getCurrentUserName();

    this.purchaseApprovalService.emailServiceDate.subscribe((data) => {
      this.purchaseApprovalService
        .uploadFile(data)
        .subscribe((data: any) => {

          this.attachmentPath = data.response;
          this.emailModal.attachmentPath = data.response;
          this.emailModal.changeValue();

        });
      this.loaderService.stop();
    });

    this.purchaseRequisitionService.emailServiceDate.subscribe((data) => {
      this.purchaseRequisitionService
        .uploadFile(data)
        .subscribe((data: any) => {

          this.attachmentPath = data.response;
          this.emailModal.attachmentPath = data.response;
          this.emailModal.changeValue();
        });
      this.loaderService.stop();
    });

    this.purchaseOrderService.emailServiceDate.subscribe((data) => {
      this.purchaseOrderService
        .uploadFile(data)
        .subscribe((data: any) => {

          this.attachmentPath = data.response;
          this.emailModal.attachmentPath = data.response;
          this.emailModal.changeValue();

        });
      this.loaderService.stop();
    });

    this.requestForQuoteService.emailServiceDate.subscribe((data) => {
      this.requestForQuoteService.uploadFile(data).subscribe((data: any) => {
        this.attachmentPath = this.rfqAttachmentPath;
        this.emailModal.attachmentPath = this.attachmentPath.toString();
        this.emailModal.changeValue();
      });
      this.loaderService.stop();
    });

    this.enableRights();
    this.getPageRights(this.screenId);
    console.log('uuuuuuuuu  2', this.approvalPopup?.approvalPopup);
    this.approvalPopup?.approvalPopup.show();

  }

  initialFormGroup() {
    this.currentDate = new Date();

    this.editSavePRForm = this.formBuilder.group({
      depot: [[], [Validators.required]],
      partType: [[], [Validators.required]],
      partCode: [[], [Validators.required]],
      partName: ['', []],
      partCategory: ['', []],
      availableStock: ['', []],
      stockUOM: ['', []],
      stockUOMId: ['', []],
      requisitionQuantity: [
        '',
        [Validators.required, Validators.min(1), Validators.max(1000000000000)],
      ],
      partRate: ['', []],
      estimatedCost: ['', []],
      requiredDate: [[], [Validators.required]],
      createdBy: ['', []],
      createdDate: ['', []],
      remarks: ['', []],
    });
    this.editSaveRFQForm = this.formBuilder.group({
      rfqNumber: ['', []],
      rfqDate: [this.currentDate, []],
      rfqStatus: [[], []],
      rfqEndDate: [[], []],
      rfqSource: [[], []],
      depot: [[], [Validators.required]],
      city: [[], []],
      prNumber: ['', []],
      rfqRemarks: ['', []],
    });
    this.editSaveRFQPartForm = this.formBuilder.group({
      partType: [[], [Validators.required]],
      partCode: ['', [Validators.required]],
      partName: [[], []],
      partCategory: [[], []],
      partSpecification: ['', []],
      stockUom: ['', []],
      stockUomId: ['', []],
      requisitionQuantity: [
        '',
        [
          Validators.required,
          Validators.min(1.0),
          Validators.max(999999999999.99),
        ],
      ],
      partRate: ['', []],
      estimatedCost: ['', []],
      requiredDate: ['', [Validators.required]],
      supplier: ['', []],
      remarks: ['', []],
    })
    this.editSaveForm = this.formBuilder.group({
      depot: [[], []],
      rfqNo: [[], []],
      rfqFromDate: ['', []],
      rfqToDate: ['', []],
      rfqStatus: [[], []],
      rfqSource: [[], []],
    });
    this.editSavePOForm = this.formBuilder.group({
      poNumber: ['', []],
      poDate: [[], [Validators.required]],
      depot: [[], [Validators.required]],
      city: [[], [Validators.required]],
      poStatus: [[], []],
      poSource: [[], []],
      supplier: [[], [Validators.required]],
      approveOrRejectOrDraft: [[], []],
      remarks: ['', []],
    });
  }

  handleRejectIcon(event: any) {

    if (this.selectedRowDataIds.length == 1) {
      this.rejectionpopup.rejectionPopup.show()
      this.enableRights();

    } else if (this.selectedRowDataIds.length > 1) {

      let errorMessage;
      if (this.selectedForm == "PR") {
        errorMessage = this.translate.instant(
          'operations.approval.errors.prRestrictedMoreThanOneInReject'
        )
      } else if (this.selectedForm == "RFQ") {
        errorMessage = this.translate.instant(
          'operations.approval.errors.restrictedMoreThanOneInReject'
        )
      } else if (this.selectedForm == "PO") {
        errorMessage = this.translate.instant(
          'operations.approval.errors.poRestrictedMoreThanOneInReject'
        )
      }
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: errorMessage,
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    } else if (this.selectedRowDataIds.length <= 0 || this.selectedDataList == undefined) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.approval.errors.atLeastOneRecordToReject'
        ) + this.selectedForm,
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    }

  }
  handlePrintIcon(event: any) {
    if (this.selectedDataList.length > 0) {
      this.handleFormPrintIcon(true);
      this.enableRights();

    } else if (this.selectedDataList.length <= 0 || this.selectedDataList == undefined) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.approval.errors.atLeastOneRecordToPrint'
        ) + this.selectedForm,
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    }

  }

  handleCancelRejectIcon(event: any) {
    if (this.selectedDataList.length > 0) {
      // Enum IDs : 582 -PO REJECTED, 593 - RFQ REJECTED, 546 - RP REJECTED 
      const invalidStatus = this.selectedDataList.some(
        (item: { currentStatusId: number }) => item.currentStatusId !== 582 && item.currentStatusId !== 593 && item.currentStatusId !== 546
      );

      if (this.selectedDataList.length > 1) {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant(
            'operations.approval.errors.onlyOnRejectedRecordsMulti'
          ),
          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
        return;
      }
      else if (invalidStatus) {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant(
            'operations.approval.errors.onlyOnRejectedRecords'
          ),

          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
        return;
      }
      this.cancelpopup?.cancelpopup.show();
      this.enableRights();

    } else if (this.selectedDataList.length <= 0 || this.selectedDataList == undefined) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.approval.errors.atLeastOneRecordToCancelRejection'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    }
  }
  handleApprovalIcon(event: any) {
    if (this.selectedDataList.length > 0) {
      this.approvalPopup?.approvalPopup.show();
    } else if (this.selectedDataList.length <= 0 || this.selectedDataList == undefined) {
      const atLeastOneToApprove = this.translate.instant(
        'operations.approval.errors.atLeastOneToApprove'
      )
      let newMessage;

      if (this.selectedForm == "PR") {
        newMessage = this.translate.instant(
          'operations.approval.errors.atLeastOneRecordToApprove'
        )
      } else if (this.selectedForm == "PO") {
        newMessage = atLeastOneToApprove + this.translate.instant(
          'operations.approval.errors.approveAndSendPO'
        )
      } else if (this.selectedForm == "RFQ") {
        newMessage = atLeastOneToApprove + this.translate.instant(
          'operations.approval.errors.approveAndCreate'
        )
      }

      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: newMessage,
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    }
    this.enableRights();

  }
  handleCancelIcon(arg0: string) {
    this.cancelpopup?.cancelpopup.show();
    this.enableRights();
  }

  handleFormPrintIcon(gridIcon: boolean = false) {

    if (this.selectedForm == "PR") {
      const prId = gridIcon ? this.selectedRowDataIds : [this.selectedRowData.purchaseRequisitionId];
      this.loaderService.start();
      this.purchaseRequisitionService
        .getPurchaseRequisitionOutput(prId)
        .subscribe(async (data: any) => {

          if (data.status === true) {
            if (data.response && data.response.length > 0) {
              for (const printData of data.response) {
                await this.generatePdfForPRData(printData);
              }
              this.sharedTableStoreService.setResetTableData(true)
              this.sharedTableStoreService.refreshTable(true)
              this.selectedDataList = []
            }
          }
        });
    } else
      if (this.selectedForm == "PO") {
        const poId = gridIcon ? this.selectedRowDataIds : [this.selectedRowData.purchaseOrderId];
        this.loaderService.start();
        this.purchaseOrderService
          .getPurchaseOrderOutput(poId)
          .subscribe(async (data: any) => {

            if (data.status === true) {
              for (const printData of data.response) {
                await this.generatePdfForPoData(printData);
              }
              this.sharedTableStoreService.setResetTableData(true)
              this.sharedTableStoreService.refreshTable(true)
              this.selectedDataList = []
            }
          });
      } else
        if (this.selectedForm == "RFQ") {
          const requestForQuoteIds = gridIcon ? this.selectedRowDataIds : [this.selectedRowData.requestForQuoteId];
          this.loaderService.start();
          this.requestForQuoteService
            .getRequestForQuoteOutput(requestForQuoteIds)
            .subscribe(async (data: any) => {
              if (data.status === true) {

                for (const printData of data.response) {
                  await this.generatePdfForData(printData);

                }
                this.sharedTableStoreService.setResetTableData(true)
                this.sharedTableStoreService.refreshTable(true)
                this.selectedDataList = []

              }
            });
        }

  }
  async generatePdfForPRData(printData: PurchaseRequisitionOutPutData): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.generatePdfComponent.getData(printData);
        this.generatePdfComponent.downloadPdf().then(() => {
          resolve();
        });
      }, 1000);
    });
  }
  async generatePdfForPoData(printData: PurchaseOrderOutputData): Promise<void> { //
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.generatePurchaseOrderPdfComponent.getData(printData);
        this.generatePurchaseOrderPdfComponent.downloadPdf().then(() => {
          resolve();
        });
      }, 1000);
    });
  }
  async generatePdfForData(printData: RequestForQuoteOutputPrintData): Promise<void> { //
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.generateRfqPdfComponent.getData(printData);
        this.generateRfqPdfComponent.downloadPdf().then(() => {
          resolve();
        });
      }, 1000);
    });
  }
  handleApprovalFromFn(event: any) {
    this.approvalPopup?.approvalPopup.show();
    this.enableRights();


  }

  handleChangeTabStatus(status: string) {
    this.selectedTabStatus = status;
    this.enableRights()
  }
  handleRecordListUpdate(event: any) {
    this.getOverviewCount();
    this.approvalListComponent?.handleGridRefresh();

  }
  handleBackToList(event: any) {


    if (
      this.editSavePRForm.dirty ||
      this.editSaveRFQForm.dirty ||
      this.editSaveRFQPartForm.dirty ||
      this.editSavePOForm.dirty
    ) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.showList = true;
          this.enableRights();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.showList = true;
      this.enableRights();
    }

  }

  getPrev12MonthNames(): string[] {
    let prev12Months: string[];
    prev12Months = [];

    const now = new Date();

    for (let monthIndex = -11; monthIndex <= 0; monthIndex++) {
      const past = new Date(now.getFullYear(), now.getMonth() + monthIndex, 1);
      const month = this.monthNames[past.getMonth()];
      const year = past.getFullYear().toString().substr(-2);

      prev12Months.push(month + "-" + year);
    }

    return prev12Months;

  }

  getChartInfo() {
    let datasets = [];
    let prev12Months: string[];
    prev12Months = this.getPrev12MonthNames();

    // remove access in chart if no access
    if (this.showPRCount) {
      datasets.push({
        label: this.translate.instant('operations.approval.titles.purchaseRequisition'),
        data: this.prTrend,
        backgroundColor: '#eba134',
        borderColor: '#eba134',
      })
    }
    if (this.showPOCount) {
      datasets.push({
        label: this.translate.instant('operations.approval.titles.requestForQuote'),
        data: this.rfqTrend,
        backgroundColor: '#4a3e2d',
        borderColor: '#4a3e2d',
      })
    }
    if (this.showRFQCount) {
      datasets.push({
        label: this.translate.instant('operations.approval.titles.purchaseOrder'),
        data: this.poTrend,
        backgroundColor: '#73716f',
        borderColor: '#73716f',
      })
    }

    this.revenueData = {
      labels: prev12Months,
      datasets: datasets
    };


    this.options = {
      plugins: {
        labels: {
          render: 'value',
          fontSize: 10
        }
      },
      legend: { display: false },
      scales: {
        yAxes: [{
          id: 'y-axis-1', type: 'linear', position: 'left', ticks: { min: 0, max: 100, fontSize: 10, fontStyle: 'bold' }
        }],
        xAxes: [{
          ticks: { fontSize: 10, fontStyle: 'bold' }, gridLines: {
            display: false
          }
        }]
      }
    };
  }

  setCurrentGrid(type: any) {
    if (type == 2) {
      this.selectedTabStatus = "PENDING";
      this.showGridByType = 2;
      this.approvalGridTitle = this.translate.instant('operations.approval.titles.pendingApprovalRequestForQuote')
    }
    else if (type == 3) {
      this.selectedTabStatus = "PENDING";
      this.showGridByType = 3;
      this.approvalGridTitle = this.translate.instant('operations.approval.titles.pendingApprovalPurchaseOrder')

    }
    else if (type == 4) {
      this.selectedTabStatus = "APPROVED";
      this.showGridByType = 4;
      this.showCancelIcon = true;
      this.approvalGridTitle = this.translate.instant('operations.approval.titles.approvedPurchaseRequisition')

    } else if (type == 5) {
      this.selectedTabStatus = "APPROVED";
      this.showGridByType = 5;
      this.showCancelIcon = true;
      this.approvalGridTitle = this.translate.instant('operations.approval.titles.approvedRequestForQuote')

    } else if (type == 6) {
      this.selectedTabStatus = "APPROVED";
      this.showGridByType = 6;
      this.showCancelIcon = true;
      this.approvalGridTitle = this.translate.instant('operations.approval.titles.approvedPurchaseOrder')

    }
    else if (type == 1) {
      this.selectedTabStatus = "PENDING";
      this.showGridByType = 1;
      this.approvalGridTitle = this.translate.instant('operations.approval.titles.pendingApprovalPurchaseRequisition')

    }

    if (type == 1 || type == 4) {
      this.selectedForm = "PR";
    } else if (type == 2 || type == 5) {
      this.selectedForm = "RFQ";
    } else if (type == 3 || type == 6) {
      this.selectedForm = "PO";
    }

  }
  selectedRowData: any;
  currentStatus: any = true;
  onValueReceived(selectedRowData: any) {
    this.selectedRowData = selectedRowData;

    this.showList = false;
    // Do something with the received value
    this.selectedRowDetails = selectedRowData;
    this.purchaseOrderService.setSelectedPORowData(selectedRowData);
    this.editSavePOForm.patchValue(selectedRowData);
    this.selectedRowList = { value: selectedRowData, selectedTabStatus: this.selectedTabStatus, selectedTab: this.selectedForm };

    if (this.selectedForm == "PO") {
      this.selectedRowNo = selectedRowData?.poNumber || "";
      this.selectedRowDataNos = [this.selectedRowNo];
      this.selectedRowDataIds = [selectedRowData?.purchaseOrderId];
    } else if (this.selectedForm == "PR") {
      this.selectedRowNo = selectedRowData?.purchaseRequisitionNo || "";
      this.selectedRowDataNos = [this.selectedRowNo];
      this.selectedRowDataIds = [selectedRowData?.purchaseRequisitionId];

    } else if (this.selectedForm == "RFQ") {
      this.selectedRowNo = selectedRowData?.rfqNo || "";  // need to add
      this.selectedRowDataNos = [this.selectedRowNo];
      this.selectedRowDataIds = [selectedRowData?.requestForQuoteId];

      this.editSaveRFQForm.patchValue({
        rfqNumber: selectedRowData.rfqNo,
        rfqDate: selectedRowData.rfqDate,
        rfqStatus: selectedRowData.currentStatusCode,
        rfqEndDate: selectedRowData.requestForQuoteEndDateString,
        rfqSource: selectedRowData.rfqSource,
        depot: selectedRowData.depotCode,
        city: selectedRowData.city,
        prNumber: selectedRowData.purchaseRequisitionNo,
        rfqRemarks: selectedRowData.remarks,
      });

      this.editSaveRFQForm.disable();
    }
    this.enableRights();

  }


  tab = "PR";
  handleSelectedRowList(data: { selectedData: any; tab: any }) {
    const { selectedData, tab } = data;
    this.tab = tab;
    this.selectedDataList = selectedData;
    if (tab == 'PO') {
      const purchaseOrderIds: number[] = selectedData.map(
        (item: any) => item.purchaseOrderId
      );
      const purchaseOrderNumbers: number[] = selectedData.map(
        (item: any) => item.poNumber
      );
      this.selectedRowDataIds = purchaseOrderIds;
      this.selectedRowDataNos = purchaseOrderNumbers
    } else
      if (tab == 'RFQ') {
        const rfqIds: number[] = selectedData.map(
          (item: any) => item.requestForQuoteId
        );
        const rfqNumbers: number[] = selectedData.map(
          (item: any) => item.rfqNo
        );
        this.selectedRowDataIds = rfqIds;
        this.selectedRowDataNos = rfqNumbers
      } else
        if (tab == 'PR') {
          const prIds: number[] = selectedData.map(
            (item: any) => item.purchaseRequisitionId
          );
          const prNumbers: number[] = selectedData.map(
            (item: any) => item.purchaseRequisitionNo
          );
          this.selectedRowDataIds = prIds;
          this.selectedRowDataNos = prNumbers
        }
  }

  handleEmailIcon(event: any) {
    if (!this.showList) {
      this.selectedDataList = [this.selectedRowData]
    }

    if (this.selectedDataList?.length == 1) {

      const invalidStatus = this.selectedDataList.some(
        (item: { currentStatusId: number }) => item.currentStatusId !== 580 && item.currentStatusId !== 591 && item.currentStatusId !== 544
      );

      if (invalidStatus) {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant(
            'operations.approval.errors.sendEmailOnlyForApproved'
          ),

          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
      } else {

        this.loaderService.start();
        if (this.selectedForm == "PO") {

          const emailSubjectPre = this.translate.instant("operations.approval.titles.emailSubjectPre")
          const emailSubjectSuf = this.translate.instant("operations.approval.titles.emailSubjectSuf")
          this.emailSubject = emailSubjectPre + this.selectedDataList[0]?.poNumber + emailSubjectSuf
          const purchaseOrderIds = this.selectedDataList.map(
            (item: { purchaseOrderId: any }) => item.purchaseOrderId
          );

          this.purchaseOrderService
            .getPurchaseOrderOutput(purchaseOrderIds)
            .subscribe(async (data: any) => {

              if (data.status === true) {
                for (const printData of data.response) {
                  await this.generatePdfForPoData(printData);
                }
                await this.generatePurchaseOrderPdfComponent.generateEmailPdf();
                this.sharedTableStoreService.setResetTableData(true)
                this.sharedTableStoreService.refreshTable(true)
                this.selectedDataList = []
              }
            });
          this.emailModal.emailPopup = true;
        }

        else if (this.selectedForm == "PR") {
          const emailSubjectPre = this.translate.instant("operations.approval.titles.emailPRSubjectPre")
          this.emailSubject = emailSubjectPre + this.selectedDataList[0]?.purchaseRequisitionNo

          const purchaseRequisitionIds = this.selectedDataList.map(
            (item: { purchaseRequisitionId: any }) => item.purchaseRequisitionId
          );

          this.purchaseRequisitionService
            .getPurchaseRequisitionOutput(purchaseRequisitionIds)
            .subscribe(async (data: any) => {
              if (data.status === true) {
                for (const printData of data.response) {
                  await this.generatePdfForPRData(printData);
                }
                await this.generatePdfComponent.generateEmailPdf();

              }
            });

          this.emailModal.emailPopup = true;

        } else if (this.selectedForm == "RFQ") {

          const emailSubjectPre = this.translate.instant("operations.approval.titles.emailRFQSubjectPre")
          const emailSubjectSuf = this.translate.instant("operations.approval.titles.emailSubjectSuf")
          this.emailSubject = emailSubjectPre + this.selectedDataList[0]?.poNumber + emailSubjectSuf

          this.emailSubject =
            emailSubjectPre +
            this.selectedDataList[0]?.rfqNo +
            emailSubjectSuf;

          this.loaderService.start();
          const requestForQuoteIds = this.selectedDataList.map(
            (item: { requestForQuoteId: any }) => item.requestForQuoteId
          );
          this.rfqAttachmentPath = [];

          this.requestForQuoteService
            .getRequestForQuoteOutput(requestForQuoteIds)
            .subscribe(async (data: any) => {
              if (data?.status === true) {

                if (data?.response?.length > 2) {
                  this.loaderService.stop();

                  this.notificationService.smallBox({
                    title: this.translate.instant('common.notificationTitle.error'),
                    content: this.translate.instant(
                      'operations.common.errors.attachment.sizeLimitReached'
                    ),
                    severity: 'error',
                    timeout: 5000,
                    icon: 'fa fa-times',
                  });
                  return;

                }

                for (const printData of data.response) {
                  await this.generateEmailPdfForData(printData);
                  this.rfqAttachmentPath.push('RequestForQuoteOutput' + printData?.supplierCode + ".pdf")
                }

                this.emailModal.emailPopup = true;
              }
            });
        } else {
          this.loaderService.stop();

        }
      }
    } else if (this.selectedDataList?.length < 1) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.purchaseOrder.errors.atLeastOneSelectedForEmail'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    } else if (this.selectedDataList?.length > 1) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.purchaseOrder.errors.sendMailErrorMessage'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    }
  }
  async generateEmailPdfForData(printData: RequestForQuoteOutputPrintData): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.generateRfqPdfComponent.getData(printData);
        this.generateRfqPdfComponent.generateEmailPdf().then(() => {
          resolve();
        });
      }, 1000);
    });
  }

  sendEmailFunction(emailData: any) {
    if (this.selectedForm == "PR") {
      emailData.PurchaseRequisitionId = this.selectedDataList[0]?.purchaseRequisitionId;
      emailData.PRNo = this.selectedDataList[0]?.purchaseRequisitionNo

      this.purchaseRequisitionService.sendEmail(emailData).subscribe((data) => {
        if (data['status'] === true) {
          this.loaderService.stop();
          this.notificationService.smallBox({
            title: this.translate.instant('common.notificationTitle.success'),
            content: data['message'],
            timeout: 5000,
            icon: "fa fa-check",
          });
          this.emailModal.emailPopup = false;
        } else {
          this.loaderService.stop();
        }
      });
    }
    if (this.selectedForm == "PO") {
      emailData.PurchaseOrderId = this.selectedDataList[0]?.purchaseOrderId;
      emailData.PRNo = this.selectedDataList[0]?.poNumber;

      this.purchaseOrderService.sendEmail(emailData).subscribe((data: any) => {
        if (data['status'] === true) {
          this.loaderService.stop();
          this.notificationService.smallBox({
            title: this.translate.instant('common.notificationTitle.success'),
            content: data['message'],
            timeout: 5000,
            icon: 'fa fa-check',
          });
          this.emailModal.emailPopup = false;
        } else {
          this.loaderService.stop();
        }
      });
    }
    if (this.selectedForm == "RFQ") {
      emailData.requestForQuoteId =
        this.selectedDataList[0]?.requestForQuoteId;
      emailData.RFQNo = this.selectedDataList[0]?.rfqNo;
      emailData.attachmentsPath = this.rfqAttachmentPath;

      this.requestForQuoteService.sendEmail(emailData).subscribe((data) => {
        if (data['status'] === true) {
          this.loaderService.stop();
          this.notificationService.smallBox({
            title: this.translate.instant('common.notificationTitle.success'),
            content: data['message'],
            timeout: 5000,
            icon: 'fa fa-check',
          });
          this.emailModal.emailPopup = false;
        } else {
          this.loaderService.stop();
        }
      });
    }
  }


  getOverviewCount() {
    this.purchaseApprovalService.getOverviewCount(this.userAuthService.getCurrentUserId(), this.userAuthService.getCurrentCompanyId(), this.userAuthService.getCurrentPersonaId())
      .subscribe((res) => {
        if (res.status === true) {
          const data = res.response;
          this.pendingPR = data.pendingApprovalPR;
          this.pendingPO = data.pendingApprovalPO;
          this.pendingRFQ = data.pendingApprovalRFQ;
          this.approvedPR = data.approvedPR;
          this.approvedPO = data.approvedPO;
          this.approvedRFQ = data.approvedRFQ;

          this.prTrend = data.purchaseRequisitionTrend;
          this.poTrend = data.purchaseOrderTrend;
          this.rfqTrend = data.requestForQuoteTrend;
          this.showPRCount = true;
          this.showPOCount = true;
          this.showRFQCount = true;
          this.lastModifiedDate = this.commonService.getFormattedLastModifiedDate(data.latestModificationDate)

          this.getChartInfo();
        } else {
          this.notificationService.smallBox({
            title: this.translate.instant(
              'common.notificationTitle.error'
            ),
            content: res['message'],
            severity: 'error',
            timeout: 5000,
            icon: 'fa fa-times',
          });
        }
      });
  }

  // Enable Rights
  getPageRights(screenId: any) {
    this.enableRights();
    this.userAuthService
      .getPageRights(screenId, this.userAuthService.getCurrentPersonaId())
      .subscribe((data) => {
        if (data['status'] === true) {
          if (data['response'].length > 0) {
            this.createBit = data["response"][0].createBit;
            this.editBit = data["response"][0].editBit;
            this.viewBit = data["response"][0].viewBit;
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

    if (this.selectedTabStatus == "APPROVED") {
      //  email btn after  approve
      this.disableEmailIcons = false;
      this.disablePrintIcons = false;

      const rejectedStatusIds = [546, 582, 593]; //pr = 546, po = 582, rfq = 593 => Enum ID => Rejected
      const currentStatusId = this.selectedRowDetails?.currentStatusId;

      if (currentStatusId && rejectedStatusIds.includes(currentStatusId)) {
        // Cancel Rejection Button must be enabled only when the PR Rejected
        this.disableCancelRejectionIcons = false;
      } else {
        this.disableCancelRejectionIcons = true;

      }
    } else {
      this.disablePrintIcons = true;
      this.disableEmailIcons = true;
    }


    if (!this.editBit && !this.createBit && this.viewBit) {

      this.showWarningMessageForRoleRights = true;
      this.warningMessageForRoleRights = 'common.roleRightsMessages.create';

      this.mode = 'view';
      this.disableRejectIcons = true;
      this.disableApproveIcons = true;
      this.disablePrintIcons = true;
      this.disableCancelRejectionIcons = true;

    } else if (!this.createBit && this.editBit && this.viewBit) {
      this.showWarningMessageForRoleRights = true;
      this.warningMessageForRoleRights = 'common.roleRightsMessages.create';

      this.mode = 'edit';
      this.disablePrintIcons = true;
      this.disableRejectIcons = true;
      this.disableApproveIcons = true;

    } else if (this.createBit && !this.editBit && this.viewBit) {
      this.showWarningMessageForRoleRights = true;
      this.warningMessageForRoleRights = 'common.roleRightsMessages.edit';

      this.mode = 'new';
      this.disableRejectIcons = false;
      this.disableApproveIcons = false;
    }
  }

}
