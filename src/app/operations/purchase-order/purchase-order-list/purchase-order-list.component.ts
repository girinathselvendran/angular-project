import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NotificationService } from 'src/app/core/services';
import { ConfirmationService } from 'primeng/api';
import { ExcelService } from 'src/app/shared/services/export/excel/excel.service';
import { PurchaseOrderService } from '../service/purchase-order.service';
import { PurchaseOrderOutputData, ApprovalRequest, ReopenPO } from '../model/purchase-order-model';
import { GeneratePoPdfComponent } from '../generate-po-pdf/generate-po-pdf.component';
import { SendEmailComponent } from '../../../shared/components/send-email/send-email.component';
import { SharedLazyTableNewComponent } from 'src/app/shared/components/shared-lazy-table-new/shared-lazy-table-new.component';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.css'],
})
export class PurchaseOrderListComponent {
  @ViewChild('emailModal') emailModal!: SendEmailComponent;
  @ViewChild("sharedLazyTableNew") sharedLazyTableNew: SharedLazyTableNewComponent | undefined;
  @ViewChild('generatePdfComponent', { static: true })
  generatePoPdfComponent!: GeneratePoPdfComponent;
  @ViewChild(GeneratePoPdfComponent)
  generatePurchaseOrderPdfComponent!: GeneratePoPdfComponent;
  @Output() getServerSideTable = new EventEmitter();
  @Output() addNewGridIcon = new EventEmitter();
  @Output() sendSelectedRowData = new EventEmitter();
  @Output() exportToExcel = new EventEmitter();
  @Output() receiveSelectedRowData = new EventEmitter();
  @Output() sendSelectedRowFromList = new EventEmitter();
  @Output() handleCancelPOSuccess = new EventEmitter();
  @Output() handleCancel = new EventEmitter();
  @Input() editSavePOForm!: FormGroup;
  @Input() poMode: any;
  @Input() showTableByColumn: number = 0;
  @Input() currentStatusId: number = 0;
  @Input() showCancelPopup: boolean = false;
  @Input() tableTitle: string = "List View";
  @Input() disableAddNewIcons: boolean = false;
  @Input() disableSendForApprovalIcons: boolean = false;
  @Input() disableCancelPOIcons: boolean = false;
  @Input() disableReopenIcons: boolean = false;
  @Input() disablePrintPOIcons: boolean = false;
  @Input() disableEmailPOIcons: boolean = false;

  poId: any = 0;
  attachmentPath: any;
  purchaseOrderOutputData: PurchaseOrderOutputData[] = [];
  approvalRequest !: ApprovalRequest;
  reopenPO !: ReopenPO;
  purchaseRequisitionData: any = [];
  tableFilterFormGroup!: FormGroup;
  cancelRemarkForm!: FormGroup;
  submitted: boolean = false;
  selectedDataList: any = [];
  selectedDataPONumbers: any = [];
  selectedData: any = [];
  companyId!: any;
  userId!: any;
  userName!: any;
  selectedDatas: any;
  globalEventToGetList: any;

  constructor(
    private translate: TranslateService,
    private userAuthService: UserAuthService,
    private formBuilder: FormBuilder,
    private loaderService: NgxUiLoaderService,
    public notificationService: NotificationService,
    private purchaseOrderService: PurchaseOrderService,
    private sharedTableStoreService: SharedTableStoreService,

  ) { }

  ngOnInit() {
    this.tableFilterFormGroup = this.formBuilder.group({
      poNumber: ['', []],
      poDate: ['', []],
      poSource: ['', []],
      poStatus: ['', []],
      supplierCode: ['', []],
      supplierName: ['', []],
      city: ['', []],
      rfqNo: ['', []],
      prNo: ['', []],
      quoteNo: ['', []],
      depot: ['', []],
      supplierCurrency: ['', []],
      poValueInSupplierCurrency: ['', []],
      poValueInDepotCurrency: ['', []],
      modifiedBy: ['', []],
      ModifiedDate: ['', []],
      cancellationRemarks: ['', []],
      rejectionRemarks: ['', []],
    });
    this.cancelRemarkForm = this.formBuilder.group({
      remarks: ['', [Validators.required]],
    });

    this.companyId = this.userAuthService.getCurrentCompanyId();
    this.userId = this.userAuthService.getCurrentUserId();
    this.userName = this.userAuthService.getCurrentUserName();
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

  }
  receiveTableRowData(event: any) {
    const selectedRecord = event;
    this.sendSelectedRowData.emit(event);
    this.receiveSelectedRowData.emit(event);

    this.editSavePOForm.controls['poStatus'].setValue({
      statusCode: 'DRAFT',
      statusId: 578,
    }); // need to change based on selected records dynamically
    this.editSavePOForm.controls['poSource'].setValue({
      sourceCode: event.poSource,
      sourceId: event.poSourceId,
    });
  }

  exportToExcelData(event: any) {
    this.exportToExcel.emit(event);

  }
  getServerSideTableList(event: any) {
    this.globalEventToGetList = event;
    this.getServerSideTable.emit(event);
  }
  handleSendForApprovalIcon($event: any) {
    if (this.selectedDataList.length == 0) {

      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.purchaseOrder.errors.atleastOneRecordForSendApproval'
        ),
        severity: 'error',
        timeout: 3000,
        icon: 'fa fa-times',
      });
      return;
    }
    const hasError = this.selectedDataList.some(
      (item: any) => item.poStatusId !== 578
    );
    if (hasError) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant('operations.purchaseOrder.errors.sendApprovalOnlyForDraft'),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
      return;
    } else {
      this.approvalRequest = {
        purchaseOrders: this.selectedData,
        poNumbers: this.selectedDataPONumbers
      }

      this.loaderService.start();
      this.purchaseOrderService
        .SendForApproval(this.approvalRequest)
        .subscribe((data: any) => {
          if (data['status'] === true) {

            this.selectedDataPONumbers = []
            this.selectedData = [];
            this.getServerSideTable.emit(this.globalEventToGetList);
            this.loaderService.stop();
            this.notificationService.smallBox({
              severity: 'success',
              title: this.translate.instant(
                'common.notificationTitle.success'
              ),
              content: data['message'],
              timeout: 5000,
              icon: 'fa fa-check',
            });
            this.selectedData = [];
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
  }
  receiveSelectedData(selectedData: any) {
    this.selectedDataList = selectedData;
    this.sendSelectedRowFromList.emit(selectedData)
    // Use map to extract purchaseorderId from each object
    const purchaseOrderNumbers: string[] = selectedData.map(
      (item: any) => item.poNumber
    );
    const purchaseOrderIds: number[] = selectedData.map(
      (item: any) => item.purchaseOrderId
    );
    this.selectedDataPONumbers = purchaseOrderNumbers;
    this.selectedData = purchaseOrderIds;
    // this.enableRights();
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


  handleCancelIcon(event: any) {
    this.handleCancel.emit(event);
  }


  emailSubject: string = "";
  handleEmailIcon(event: any) {
    if (this.selectedDataList?.length == 1) {
      const invalidStatus = this.selectedDataList.some(
        (item: { currentStatusId: number }) => item.currentStatusId !== 580 && item.currentStatusId !== 578 && item.currentStatusId !== 579
      );

      if (invalidStatus) {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant(
            'operations.purchaseOrder.errors.atLeastEmailOne'
          ),

          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
      } else {

        this.poId = this.selectedData[0];

        const emailSubjectPre = this.translate.instant("operations.purchaseOrder.titles.emailSubjectPre")
        const emailSubjectSuf = this.translate.instant("operations.purchaseOrder.titles.emailSubjectSuf")
        this.emailSubject = emailSubjectPre + this.selectedDataList[0]?.poNumber + emailSubjectSuf

        this.loaderService.start();
        const purchaseOrderIds = this.selectedDataList.map(
          (item: { purchaseOrderId: any }) => item.purchaseOrderId
        );

        this.purchaseOrderService
          .getPurchaseOrderOutput(purchaseOrderIds)
          .subscribe(async (data: any) => {

            if (data.status === true) {
              for (const printData of data.response) {
                await this.generatePdfForData(printData);
              }
              await this.generatePoPdfComponent.generateEmailPdf();

            }
          });
        this.emailModal.emailPopup = true;
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
  sendEmailFunction(emailData: any) {
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

  handleReopenIcon($event: any) {
    if (this.selectedDataList.length == 0) {

      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.purchaseOrder.errors.atleastOneCancelledRecordForReopen'
        ),
        severity: 'error',
        timeout: 3000,
        icon: 'fa fa-times',
      });
      return;
    }
    const hasError = this.selectedDataList.some(
      (item: any) => item.poStatusId !== 581
    );
    if (hasError) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant('operations.purchaseOrder.errors.sendApprovalOnlyForDraft'),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
      return;
    } else {
      this.reopenPO = {
        purchaseOrders: this.selectedData,
        poNumbers: this.selectedDataPONumbers
      }

      this.loaderService.start();
      this.purchaseOrderService
        .ReopenPO(this.reopenPO)
        .subscribe((data: any) => {
          if (data['status'] === true) {

            this.selectedDataPONumbers = []

            this.selectedData = [];
            this.getServerSideTable.emit(this.globalEventToGetList);
            this.loaderService.stop();
            this.notificationService.smallBox({
              severity: 'success',
              title: this.translate.instant(
                'common.notificationTitle.success'
              ),
              content: data['message'],
              timeout: 5000,
              icon: 'fa fa-check',
            });
            this.selectedData = [];
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
  }
  handleAddRecordIcon($event: any) {

    this.addNewGridIcon.emit(true);
  }

  handlePrintIcon(event: any) {
    let purchaseOrderIds = [];
    purchaseOrderIds = this.selectedDataList.map(
      (item: { purchaseOrderId: any }) => item.purchaseOrderId
    );
    if (purchaseOrderIds?.length === 0) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.purchaseOrder.errors.minOneSelectedForPrint'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    } else if (purchaseOrderIds?.length === 1) {
      this.loaderService.start();
      this.purchaseOrderService
        .getPurchaseOrderOutput(purchaseOrderIds)
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
    } else {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.purchaseOrder.errors.printActionRestrictedForMultiplePRs'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    }
  }

  async generatePdfForData(printData: PurchaseOrderOutputData): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.generatePurchaseOrderPdfComponent.getData(printData);
        this.generatePurchaseOrderPdfComponent.downloadPdf().then(() => {
          resolve();
        });
      }, 1000);
    });
  }

  columnHeaderListWithStatus = [
    {
      field: 'poNumber',
      header: this.translate.instant('operations.purchaseOrder.grid.poNumber'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'poDate',
      header: this.translate.instant('operations.purchaseOrder.grid.poDate'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'poSource',
      header: this.translate.instant('operations.purchaseOrder.grid.poSource'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'poStatus',
      header: this.translate.instant('operations.purchaseOrder.grid.poStatus'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'supplierCode',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.supplierCode'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'supplierName',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.supplierName'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'city',
      header: this.translate.instant('operations.purchaseOrder.grid.city'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'rfqNo',
      header: this.translate.instant('operations.purchaseOrder.grid.rfqNo'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
    {
      field: 'prNo',
      header: this.translate.instant('operations.purchaseOrder.grid.prNo'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'quoteNo',
      header: this.translate.instant('operations.purchaseOrder.grid.quoteNo'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },
    {
      field: 'depot',
      header: this.translate.instant('operations.purchaseOrder.grid.depot'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
    {
      field: 'supplierCurrency',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.supplierCurrency'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 12,
    },
    {
      field: 'poValueInSupplierCurrency',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.poValueInSupplierCurrency'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 13,
    },
    {
      field: 'poValueInDepotCurrency',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.poValueInDepotCurrency'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 14,
    },
    {
      field: 'modifiedBy',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.modifiedBy'
      ),
      width: '6%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 15,
    },
    {
      field: 'ModifiedDate',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.ModifiedDate'
      ),
      width: '7%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 16,
    },
  ];
  columnHeaderListWithCancelRemarks = [
    {
      field: 'poNumber',
      header: this.translate.instant('operations.purchaseOrder.grid.poNumber'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'poDate',
      header: this.translate.instant('operations.purchaseOrder.grid.poDate'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'poSource',
      header: this.translate.instant('operations.purchaseOrder.grid.poSource'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'poStatus',
      header: this.translate.instant('operations.purchaseOrder.grid.poStatus'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'supplierCode',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.supplierCode'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'supplierName',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.supplierName'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'city',
      header: this.translate.instant('operations.purchaseOrder.grid.city'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'rfqNo',
      header: this.translate.instant('operations.purchaseOrder.grid.rfqNo'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
    {
      field: 'prNo',
      header: this.translate.instant('operations.purchaseOrder.grid.prNo'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'quoteNo',
      header: this.translate.instant('operations.purchaseOrder.grid.quoteNo'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },
    {
      field: 'depot',
      header: this.translate.instant('operations.purchaseOrder.grid.depot'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
    {
      field: 'supplierCurrency',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.supplierCurrency'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 12,
    },
    {
      field: 'poValueInSupplierCurrency',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.poValueInSupplierCurrency'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 13,
    },
    {
      field: 'poValueInDepotCurrency',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.poValueInDepotCurrency'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 14,
    },
    {
      rowspan: '2',
      field: 'cancellationRemarks',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.cancellationRemarks'
      ),
      isFilter: true,
      isSubHeader: false,
      isIcon: true,
      type: 'string',
      key: 6,
    },
    {
      field: 'modifiedBy',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.modifiedBy'
      ),
      width: '6%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 15,
    },
    {
      field: 'modifiedDate',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.ModifiedDate'
      ),
      width: '7%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 16,
    },
  ];
  columnHeaderListWithRejectionRemarks = [
    {
      field: 'poNumber',
      header: this.translate.instant('operations.purchaseOrder.grid.poNumber'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'poDate',
      header: this.translate.instant('operations.purchaseOrder.grid.poDate'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'poSource',
      header: this.translate.instant('operations.purchaseOrder.grid.poSource'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'poStatus',
      header: this.translate.instant('operations.purchaseOrder.grid.poStatus'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'supplierCode',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.supplierCode'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'supplierName',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.supplierName'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'city',
      header: this.translate.instant('operations.purchaseOrder.grid.city'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      field: 'rfqNo',
      header: this.translate.instant('operations.purchaseOrder.grid.rfqNo'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
    {
      field: 'prNo',
      header: this.translate.instant('operations.purchaseOrder.grid.prNo'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'quoteNo',
      header: this.translate.instant('operations.purchaseOrder.grid.quoteNo'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },
    {
      field: 'depot',
      header: this.translate.instant('operations.purchaseOrder.grid.depot'),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 11,
    },
    {
      field: 'supplierCurrency',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.supplierCurrency'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 12,
    },
    {
      field: 'poValueInSupplierCurrency',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.poValueInSupplierCurrency'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 13,
    },
    {
      field: 'poValueInDepotCurrency',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.poValueInDepotCurrency'
      ),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 14,
    },
    {
      rowspan: '2',
      field: 'rejectionRemarks',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.rejectionRemarks'
      ),
      isFilter: true,
      isSubHeader: false,
      isIcon: true,
      type: 'string',
      key: 6,
    },
    {
      field: 'modifiedBy',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.modifiedBy'
      ),
      width: '6%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 15,
    },
    {
      field: 'ModifiedDate',
      header: this.translate.instant(
        'operations.purchaseOrder.grid.ModifiedDate'
      ),
      width: '7%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 16,
    },
  ];
}
