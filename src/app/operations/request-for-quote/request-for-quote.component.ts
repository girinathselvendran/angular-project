import { DatePipe } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { defineLocale, enGbLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { RequestForQuoteService } from './service/request-for-quote.service';
import { SharedLazyTableNewComponent } from 'src/app/shared/components/shared-lazy-table-new/shared-lazy-table-new.component';
import { FormCanDeactivate } from 'src/app/core/guards/form-can-deactivate';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { CancelPopupComponent } from 'src/app/shared/components/popup/cancel-popup/cancel-popup.component';
import { RequestForQuoteListComponent } from './request-for-quote-list/request-for-quote-list.component';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';
import {
  ApprovalRequest,
  ReopenRFQ,
  RequestForQuote,
  RequestForQuoteOutputPrintData,
  RequestForQuotePartDetail,
  RequestForQuoteSupplierDetail,
} from './model/request-for-quote_model';
import { NotificationService } from 'src/app/core/services';
import { event } from 'jquery';
import { SendEmailComponent } from '../../shared/components/send-email/send-email.component';
import { ExcelService } from 'src/app/shared/services/export/excel/excel.service';
import { GenerateRfqPdfComponent } from './generate-rfq-pdf/generate-rfq-pdf.component';
import { ConfirmationService } from 'primeng/api';
import { RequestForQuoteFormCanDeactivate } from 'src/app/core/guards/requestForQuote-can-deactivate';

@Component({
  selector: 'app-request-for-quote',
  templateUrl: './request-for-quote.component.html',
  styleUrls: ['./request-for-quote.component.css'],
})
export class RequestForQuoteComponent extends RequestForQuoteFormCanDeactivate {
  @ViewChild('sharedLazyTableNew') sharedLazyTableNew:
    | SharedLazyTableNewComponent
    | undefined;
  @ViewChild('cancelPopup') cancelPopup!: CancelPopupComponent;
  @ViewChild('requestForQuoteList')
  requestForQuoteList!: RequestForQuoteListComponent;
  @ViewChild(GenerateRfqPdfComponent)
  generateRfqPdfComponent!: GenerateRfqPdfComponent;
  @ViewChild('emailModal') emailModal!: SendEmailComponent;
  @ViewChild(GenerateRfqPdfComponent)
  GenerateRfqPdfComponent!: GenerateRfqPdfComponent;
  requestForQuote!: RequestForQuote;
  @Input() requestForQuoteOutputData: any;
  showList: boolean = true;
  lastModifiedDate: any = new Date();
  editSaveFormSearch!: FormGroup;
  editSaveForm!: FormGroup;
  editSaveRFQPartForm!: FormGroup;
  editSaveSupplierForm!: FormGroup;
  submittedSearch: boolean = false;
  submitted = false;
  clickedSearchBtn: boolean = false;
  clickedResetBtn: boolean = false;
  tableFilterFormGroup!: FormGroup;
  tableTitle = 'Overall List'; // default table title
  requestForQuoteIdForPrint: any;
  currentStatusId: number = 586; // overall status Id
  @Input() requestForQuoteOutputPrintData: RequestForQuoteOutputPrintData[] =
    [];

  // Enable rights
  createBit: boolean = true;
  editBit: boolean = true;
  viewBit: boolean = true;
  showWarningMessageForRoleRights: boolean = false;
  warningMessageForRoleRights: string = '';
  showWarningMessageForRoleRightsForm: boolean = false;
  warningMessageForRoleRightsForm: string = '';
  disableSaveButton: boolean = false;
  disableAddButton: boolean = false;
  showTableByColumn = 1;
  mode: string = 'new';
  paramsGlobal: any;
  currentDate: Date = new Date();
  // Disable Table grid icons
  disableALLGridIcons: boolean = false;
  disableALLFormIcons: boolean = false;
  disableAddNewIcons: boolean = false;
  disableSendForApprovalIcons: boolean = false;
  disableCancelRFQIcons: boolean = false;
  disableReopenIcons: boolean = false;
  disablePrintRFQIcons: boolean = false;
  disableEmailRFQIcons: boolean = false;
  disableFormPrintRFQIcons: boolean = false;
  disableFormEmailRFQIcons: boolean = false;
  disableFormCancelRFQIcons: boolean = false;
  disableFormSendForApprovalIcons: boolean = false;
  disableFormAddNewIcons: boolean = false;
  disableFormReopenIcons: boolean = false;
  disableFormSubmitIcons: boolean = false;
  disableFormResetIcons: boolean = false;
  disableFormSendRFQIcons: boolean = false;
  hideSendForApproval: boolean = false;
  hideEmailRFQ: boolean = false;
  hideCancelRFQ: boolean = false;
  hideResetRFQ: boolean = false;
  hidesave: boolean = false;
  hideSendRFQ: boolean = false;
  hideSendEmail: boolean = true;
  showPartDetails: boolean = true; // in new mode show part details
  overViewObject: any = {
    overAll: 0,
    drafts: 0,
    requested: 0,
    quotesReceived: 0,
    pendingApproval: 0,
    approved: 0,
    cancelled: 0,
    rejected: 0,
  };
  // dropDowns
  associatedDepots = [];
  rfqNumberDDList = [];
  rfqStatusDDList = [];
  rfqSourceDDList = [];
  serverSideProcessing: any;

  requestForQuoteId: any;
  selectedData: any;
  selectedRFQListRecord: any;
  selectedDataRFQNumbers: any;
  approvalRequest!: ApprovalRequest;
  reopenPO!: ReopenRFQ;

  // Date validation
  fromGreaterThanCurrent = false;
  toLesserThanCurrent = false;
  fromGreaterThanTo = false;
  toLesserThanFrom = false;
  startPeriodSmallerThanEnd = false;
  startPeriodSmallerThanCurrent = false;
  screenId: any = '';
  rfqNumber: any = '';
  currentTabStatusId: number = 1;
  currentUserName!: string;
  currentCompanyId!: any;
  currentUserId!: any;
  RFQnumbers = [];
  selectedDataList: any = [];
  selectedDataToUpdate: any = [];
  requestForQuoteData: any = [];
  overallSupplierData: any = [];
  partDetailData: any = [];
  totalDataGridCountComp: any;
  userId = this.userAuthService.getCurrentUserId();
  // cancel popup
  cancelPopupTitle = 'Cancel RFQ';
  attachmentPath: any;
  emailSubject: string = '';

  newPartDetailList = [];
  excelDataTable: any = [];
  rfqAttachmentPath: any = [];
  showFormSendRFQIcons: boolean = true;
  showFormSendForApprovalIcons: boolean = true;
  showEmailRFQIcons: boolean = true;
  showReopenIcons: boolean = true;
  showCancelIcons: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private userAuthService: UserAuthService,
    private datePipe: DatePipe,
    private loaderService: NgxUiLoaderService,
    private localeService: BsLocaleService,
    private router: Router,
    private requestForQuoteService: RequestForQuoteService,
    private commonService: CommonService,
    private sharedTableStoreService: SharedTableStoreService,
    private notificationService: NotificationService,
    private excelService: ExcelService,
    private confirmationService: ConfirmationService
  ) {
    super();
    this.currentUserName = this.userAuthService.getCurrentUserName();
    this.currentCompanyId = this.userAuthService.getCurrentCompanyId();
    this.currentUserId = this.userAuthService.getCurrentUserId();
    this.requestForQuoteService.supplierData$.subscribe((data: any[]) => {
      if (data.length != 0) {
        this.overallSupplierData = data;
      }
    });

    this.requestForQuoteService.partDetailData$.subscribe((data: any[]) => {
      this.partDetailData = data; 
    });

    enGbLocale.invalidDate = '';
    defineLocale('custom locale', enGbLocale);
    this.localeService.use('custom locale');
    const snapshot: RouterStateSnapshot = router.routerState.snapshot;
    this.screenId = snapshot.root.queryParams['screenId'];
  }
  ngOnInit() {
    this.editSaveFormSearch = this.formBuilder.group({
      depot: [[], []],
      rfqNo: [[], []],
      rfqFromDate: ['', []],
      rfqToDate: ['', []],
      rfqStatus: [[], []],
      rfqSource: [[], []],
    });
    this.tableFilterFormGroup = this.formBuilder.group({
      requestForQuoteNo: ['', []],
      requestForQuoteDate: ['', []],
      requestForQuoteSource: ['', []],
      currentStatusCode: ['', []],
      totalRequestForQuoteCost: ['', []],
      modifiedBy: ['', []],
      modifiedDate: ['', []],
      purchaseRequisitionNo: ['', []],
      purchaseOrderNo: ['', []],
      depotCurrencyCode: ['', []],
      depotCode: ['', []],
    });
    this.editSaveForm = this.formBuilder.group({
      //editSav eForm
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
      partCode: [[], [Validators.required]],
      partName: [[], []],
      partCategory: [[], []],
      partSpecification: ['', []],
      stockUom: ['', []],
      stockUomId: ['', []], // New form control for stockUomId
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
      tempUniqValue: ['', []],
    });

    this.requestForQuoteService.emailServiceDate.subscribe((data) => {
      this.requestForQuoteService.uploadFile(data).subscribe((data: any) => {
        // this.attachmentPath = data.response;
        this.attachmentPath = this.rfqAttachmentPath;

        this.emailModal.attachmentPath = this.rfqAttachmentPath.toString();
        this.emailModal.changeValue();
      });
      this.loaderService.stop();
    });
    this.changeHeaderColumn(1);
    this.getActiveDepot();
    this.getRFQNoByCurrentStatusId(this.currentStatusId);
    this.getRequestForQuoteStatuses();
    this.getRequestForQuoteSources();
    this.getRequestForQuoteOverView();

    //For Approval Screen Form Validation
    
    if (this.screenId == 259) {
      this.editSaveFormSearch.disable();
      this.editSaveForm.disable();
      this.editSaveRFQPartForm.disable();
      this.editSaveSupplierForm.disable();
    }

    this.enableRights();
    this.getPageRights(this.screenId);
  }

  getRequestForQuoteOverView() {
    this.requestForQuoteService
      .getRequestForQuoteOverView()
      .subscribe((res) => {
        if (res.status === true) {
          this.overViewObject = res.response;
          this.lastModifiedDate = res['response'].lastModifiedDate
            ? this.commonService.getFormattedLastModifiedDate(
              res['response'].lastModifiedDate
            )
            : null;
        }
      });
  }
  getRequestForQuoteSources() {
    this.requestForQuoteService.getRequestForQuoteSources().subscribe((res) => {
      if (res.status === true) {
        this.rfqSourceDDList = res.response;
      }
    });
  }
  getRequestForQuoteStatuses() {
    this.requestForQuoteService
      .getRequestForQuoteStatuses()
      .subscribe((res) => {
        if (res.status === true) {
          this.rfqStatusDDList = res.response;
        }
      });
  }

  getPRNoByCurrentStatusId(currentStatusId: number, cardNumber: number = 1) {
    this.requestForQuoteService
      .getRequestForQuoteNoByCurrentStatusId(currentStatusId)
      .subscribe((res) => {
        if (res.status === true) {
          this.rfqNumberDDList = res.response;
        }
      });
  }
  getActiveDepot() {
    this.requestForQuoteService.getActiveDepot(this.userId).subscribe((res) => {
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

  get editSaveFormSearchController() {
    return this.editSaveFormSearch.controls;
  }
  

  searchRecordsList() {
    this.getServerSideTableList(this.paramsGlobal);
    this.submittedSearch = true;
    this.clickedSearchBtn = true;
  }
  resetForm() {
    this.editSaveFormSearch.reset();
    this.getRFQNoByCurrentStatusId(586);
    this.clickedSearchBtn = false;
  }
  // ............................................rfq function..........................................................

  handleCancelIcon(event: any) {
    if (this.editSaveRFQPartForm.dirty) {
      
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.requestForQuote.errors.clickSavetoCancel'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
      return;
    }
    if (
      (this.selectedDataList?.length <= 0 ||
        this.selectedDataList == undefined) &&
      event == 'icon'
    ) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.requestForQuote.errors.atLeastOneSelectedForCancel'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    } else {
      const invalidStatus = this.selectedDataList.some(
        (item: { currentStatusId: number }) =>
          item.currentStatusId !== 587 &&
          item.currentStatusId !== 588 &&
          item.currentStatusId !== 589 &&
          item.currentStatusId !== 590
      );

      if (invalidStatus) {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant(
            'operations.requestForQuote.errors.cancelActionInvalidForAfterPendingApproval'
          ),
          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
      } else {
        this.cancelPopup.openForm();
      }
    }
  }
  // ------------Grid Icon Functions--------- Start
  nullifyTempArray() {
    this.requestForQuoteService.setSupplierData([]);
    this.requestForQuoteService.setPartDetailsData([]);
    this.requestForQuoteService.setSupplierGridData([]);
    this.requestForQuoteService.setPartId(0);
    this.requestForQuoteService.setSupplierDropdownData([]);
    this.partDetailData =[]
    this.overallSupplierData = []
  }
  handleAddRecordIcon(event: any) {
    this.showList = false;
    this.nullifyTempArray();
    this.showPartDetails = true;
    this.mode = 'new';
    this.editSaveForm.reset();
    
    this.editSaveRFQPartForm.reset();
    this.newPartDetailList = [];
  }

  handleFormPrintIcon() {
    

    const prId = [this.selectedDataToUpdate.requestForQuoteId];
   

    this.loaderService.start();
    this.requestForQuoteService
      .getRequestForQuoteOutput(prId)
      .subscribe(async (data: any) => {
        if (data.status === true) {
          this.requestForQuoteOutputData = data.response;
          for (const printData of data.response) {
            await this.generatePdfForData(printData);
          }

          this.sharedTableStoreService.setResetTableData(true);
          this.sharedTableStoreService.refreshTable(true);
          this.selectedDataList = [];
        }
      });
  }
  async generatePdfForData(
    printData: RequestForQuoteOutputPrintData
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.generateRfqPdfComponent.getData(printData);
        this.generateRfqPdfComponent.downloadPdf().then(() => {
          resolve();
        });
      }, 1000);
    });
  }
  handleBackToList() {
    if (
      this.editSaveRFQPartForm.dirty ||
      this.editSaveForm.dirty ||
      this.editSaveFormSearch.dirty
    ) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.getRFQNoByCurrentStatusId(this.currentStatusId);
          this.showList = true;
          this.editSaveForm.reset();
          this.editSaveRFQPartForm.reset();
          this.enableRights();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.getRFQNoByCurrentStatusId(this.currentStatusId);
      this.showList = true;
      this.editSaveForm.reset();
      this.editSaveRFQPartForm.reset();
      this.enableRights();
    }
  }

  selectedDraftRfq: any = null;
  // hideSendRFQ
  receiveTableRowData(rfqDetails: any) {
    this.selectedDataToUpdate = rfqDetails;
    if (rfqDetails?.currentStatusId !== 587) {
      // draft Enum id 587
      this.hideSendRFQ = true;
    } else {
      this.hideSendRFQ = false;
    }
    if (rfqDetails?.currentStatusId === 591) {
      this.hideSendEmail = false;
      
      this.selectedDataList[0] = rfqDetails
    } else {
      this.hideSendEmail = true;


    }


    this.requestForQuoteId = rfqDetails.requestForQuoteId;
    this.mode = 'edit';
    this.showList = false;
    this.editSaveForm.patchValue({
      rfqNumber: rfqDetails.requestForQuoteNo,
      rfqDate: rfqDetails.requestForQuoteDate,
      rfqStatus: {
        statusCode: rfqDetails.currentStatusCode,
        statusId: rfqDetails.currentStatusId,
      },
      rfqEndDate: rfqDetails.requestForQuoteEndDateString,
      rfqSource: rfqDetails.requestForQuoteSource,
      depot: rfqDetails.depotCode,
      city: rfqDetails.city, // city
      prNumber: rfqDetails.purchaseRequisitionNo,
      rfqRemarks: rfqDetails.remarks,
    });

    if (rfqDetails.currentStatusId == 589) {
      this.hideSendForApproval = false;
    } else {
      this.hideSendForApproval = true;
    }

    if (rfqDetails.currentStatusId == 587) {
      //587 is Draft status Id
      this.selectedDraftRfq = rfqDetails;
      this.getRFQPartDetailsByRequestForQuoteId(rfqDetails.requestForQuoteId);
      this.showPartDetails = true;
      this.editSaveForm.disable();
    } else {
      this.showPartDetails = false;
    }
    this.editSaveForm.disable();
    this.selectedRFQListRecord = rfqDetails;
    this.selectedData = [rfqDetails.requestForQuoteId];
    this.rfqNumber = rfqDetails.requestForQuoteNo;
    this.selectedDataRFQNumbers = [rfqDetails.requestForQuoteNo];
    this.enableRights();
  }
  getRFQPartDetailsByRequestForQuoteId(requestForQuoteIds: number | number[]) {
    const idsArray = Array.isArray(requestForQuoteIds)
      ? requestForQuoteIds
      : [requestForQuoteIds];

    this.requestForQuoteService
      .getRFQPartDetailsByRequestForQuoteIds(idsArray)
      .subscribe((res) => {
        if (res.status === true) {
          const transformedData = res.response.map((item: any) => {
            return {
              partType: item.partTypeCode,
              partTypeId: item.partTypeId,
              partCode: item.partCode,
              partId: item.partId,
              partName: item.partName,
              partCategory: item.partCategory,
              stockUom: item.stockUOMCode,
              requisitionQuantity: item.requisitionQuantity,
              partRate: item.partRate,
              estimatedCost: item.estimatedCost,
              supplier: 'Code',
              stockUomId: item.stockUOMId,
              requiredDate: item.requiredDate,
              requestForQuotePartDetailId: item.requestForQuotePartDetailId,
              remarks: item.remarks,
              created: item.created,
              createdBy: item.createdBy,
              modified: item.modified,
              modifiedBy: this.currentUserName,
              tempUniqValue:
                item.requestForQuotePartDetailId != 0
                  ? this.requestForQuoteService.generateUniqueId()
                  : '',
            };
          });

          this.requestForQuoteService.setPartDetailsData(transformedData);
        }
      });
  }

  receiveSelectedData(selectedData: any) {
    
    this.selectedDataList = selectedData;

    const requestForQuoteNumbers: string[] = selectedData.map(
      (item: any) => item.requestForQuoteNo
    );
    const requestForQuoteIds: number[] = selectedData.map(
      (item: any) => item.requestForQuoteId
    );
    this.selectedDataRFQNumbers = requestForQuoteNumbers;
    this.selectedData = requestForQuoteIds;
    this.enableRights();
  }

  handleFormResetIcon() {
    this.editSaveForm.reset();
  }
  handleSendForApprovalIcon(event: any) {
    if (this.currentTabStatusId == 4) {
      if (
        this.selectedDataList?.length > 0 ||
        this.selectedRFQListRecord != undefined
      ) {
       
        const hasError = this.selectedDataList.some(
          (item: any) => item.isPoQuantityAdded == false
        );
        if (hasError) {
          this.notificationService.smallBox({
            title: this.translate.instant('common.notificationTitle.error'),
            content: this.translate.instant(
              'operations.requestForQuote.errors.poQuantityRequiredForSendApproval'
            ),

            severity: 'error',
            timeout: 5000,
            icon: 'fa fa-times',
          });
        } else {
          this.approvalRequest = {
            requestForQuotes: this.selectedData,
            requestForQuoteNo: this.selectedDataRFQNumbers,
          };
          this.loaderService.start();
          this.requestForQuoteService
            .sendForApproval(this.approvalRequest)
            .subscribe((data: any) => {
              if (data['status'] === true) {
                this.getServerSideTableList(this.paramsGlobal);
                this.sharedTableStoreService.setResetTableData(true);
                this.sharedTableStoreService.refreshTable(true);
                this.selectedDataList = [];
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
              } else {
                this.loaderService.stop();
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
        return;
      } else if (this.selectedDataList?.length < 1) {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant(
            'operations.requestForQuote.errors.atLeastOneSelectedForApproval'
          ),
          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
      }
    }
    if (
      this.selectedDataList?.length > 0 ||
      this.selectedRFQListRecord != undefined
    ) {
      const hasError = this.selectedDataList.some(
        (item: any) => item.currentStatusId !== 589 //587 Enum id = QUOTE RECEIVED
      );
      if (hasError) {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant(
            'operations.requestForQuote.errors.sendForApprovalErrorMessage'
          ),

          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
      } else {
        this.approvalRequest = {
          requestForQuotes: this.selectedData,
          requestForQuoteNo: this.selectedDataRFQNumbers,
        };
        this.loaderService.start();
        this.requestForQuoteService
          .sendForApproval(this.approvalRequest)
          .subscribe((data: any) => {
            if (data['status'] === true) {
              this.getServerSideTableList(this.paramsGlobal);
              this.sharedTableStoreService.setResetTableData(true);
              this.sharedTableStoreService.refreshTable(true);
              this.selectedDataList = [];
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
    } else if (this.selectedDataList?.length < 1) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.requestForQuote.errors.atLeastOneSelectedForApproval'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    }
  }

 

  handleSendForApprovalFormIcon() {
    if (
      this.selectedDataList?.length > 0 ||
      this.selectedRFQListRecord != undefined
    ) {
      const hasError = this.selectedDataList.some(
        (item: any) => item.currentStatusId !== 587 //587 is Draft status Id
      );
      if (hasError) {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant(
            'operations.requestForQuote.errors.sendForApprovalErrorMessage'
          ),

          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
      } else {
       
        this.loaderService.start();
        this.requestForQuoteService
          .sendForApprovalInForm(
            this.selectedData[0],
            this.selectedDataRFQNumbers[0]
          )
          .subscribe((data: any) => {
            if (data['status'] === true) {
              this.currentStatusId = 590; // => Enum ID = 589 = PENDING APPROVAL

              this.editSaveForm.controls['rfqStatus'].setValue({
                statusCode: 'PENDING APPROVAL',
                statusId: 590, // => Enum ID = 589 = PENDING APPROVAL
              });

              this.getServerSideTableList(this.paramsGlobal);
              this.sharedTableStoreService.setResetTableData(true);
              this.sharedTableStoreService.refreshTable(true);
              this.selectedDataList = [];
              this.loaderService.stop();
              this.enableRights();

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
    } else if (this.selectedDataList?.length < 1) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.requestForQuote.errors.atLeastOneSelectedForApproval'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    }
  }
  handleSendRequestForQuote(event: any) {
    if (
      this.selectedDataList?.length > 0 ||
      this.selectedRFQListRecord != undefined
    ) {
      
      const hasError = this.selectedDataList.some(
        (item: any) => item.currentStatusId !== 587 //588 is Requested status Id
      );
      if (hasError) {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant(
            'operations.requestForQuote.errors.sendRFQErrorMessage'
          ),

          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
      } else {
        this.loaderService.start();
        this.requestForQuoteService
          .sendRequestForQuote(this.selectedData, this.selectedDataRFQNumbers)
          .subscribe((data: any) => {
            if (data['status'] === true) {
              this.sharedTableStoreService.setResetTableData(true);
              this.sharedTableStoreService.refreshTable(true);
              this.selectedDataList = [];
              this.getServerSideTableList(this.paramsGlobal);
              this.selectedDataList = [];
              this.sharedTableStoreService.setResetTableData(true);
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
    } else if (this.selectedDataList?.length < 1) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.requestForQuote.errors.atLeastOneSelectedForSendRFQ'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    }
  }

  handleReopenIcon(event: any) {
    if (this.selectedDataList?.length > 0) {
      const hasError = this.selectedDataList.some(
        (item: any) => item.currentStatusId !== 592
      );
      if (hasError) {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant(
            'operations.requestForQuote.errors.reopenErrorMessage'
          ),
          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
      } else {
        this.loaderService.start();
        this.requestForQuoteService
          .reopenRequestForQuote(this.selectedData)
          .subscribe((data: any) => {
            if (data['status'] === true) {
              this.getServerSideTableList(this.paramsGlobal);
              this.getRequestForQuoteOverView();
              this.sharedTableStoreService.setResetTableData(true);
              this.sharedTableStoreService.refreshTable(true);
              this.selectedDataList = [];
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
    } else {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.requestForQuote.errors.cancelPRErrorMessage'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    }
  }
  handleFormNewRFQIcon() {
    this.mode = 'new';
    this.showPartDetails = true;
    this.editSaveForm.reset();
    this.editSaveRFQPartForm.reset();
    this.newPartDetailList = [];
    this.nullifyTempArray();
    this.editSaveForm.controls['rfqEndDate'].enable();
    this.editSaveForm.controls['depot'].enable();
    this.editSaveForm.controls['rfqRemarks'].enable();
    // this.editSaveForm.controls['rfqEndDate'].setValue(this.currentDate);
    this.editSaveForm.controls['rfqDate'].setValue(this.currentDate);
    this.editSaveForm.controls['rfqEndDate'].setValue(this.currentDate);
    this.editSaveForm.controls['rfqSource'].setValue({
      sourceCode: 'DIRECT',
      sourceId: 594,
    });
    this.editSaveForm.controls['rfqStatus'].setValue({
      statusCode: 'DRAFT',
      statusId: 587,
    });
    this.editSaveForm.controls['city'].disable();
    this.editSaveForm.controls['prNumber'].disable();
    this.editSaveRFQPartForm?.controls['requiredDate'].setValue(
      this.currentDate
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

  
  consolidateData(
    generalFields: any,
    supplierDetails: any[],
    partDetails: any[]
  ): RequestForQuote {
    const consolidatedObject: RequestForQuote = {
      requestForQuoteDate: generalFields.rfqDate,
      currentStatusId: generalFields.rfqStatusId,
      requestForQuoteEndDate: generalFields.rfqEndDate,
      createdBy: this.currentUserName,
      companyId: this.currentCompanyId,
      modifiedBy: this.currentUserName,
      requestForQuoteSourceId: generalFields.rfqSourceId,
      depotId: generalFields.depotId,
      purchaseRequisitionId: generalFields.purchaseRequisitionId,
      remarks: generalFields.rfqRemarks,
      requestForQuotePartDetails: [],
    };

    const supplierDetailsMap = new Map<
      string,
      RequestForQuoteSupplierDetail[]
    >();

    supplierDetails.forEach((supplierDetail: any) => {
      const tempUniqValue = supplierDetail.tempUniqValue;

      if (!supplierDetailsMap.has(tempUniqValue)) {
        supplierDetailsMap.set(tempUniqValue, []);
      }

      supplierDetailsMap.get(tempUniqValue)?.push({
        partId: supplierDetail.partId,
        supplierId: supplierDetail.supplierId,
        preferredSupplier: supplierDetail.preferredSupplier || false,
        createdBy: this.currentUserName,
        modifiedBy: this.currentUserName,
        tempUniqValue: tempUniqValue,
      });
    });

    partDetails.forEach((partDetail: any) => {
      const consolidatedPartDetail: RequestForQuotePartDetail = {
        partTypeId: partDetail.partTypeId,
        partId: partDetail.partId,
        stockUOMId: partDetail.stockUomId,
        requisitionQuantity: parseInt(partDetail.requisitionQuantity),
        estimatedCost: partDetail.estimatedCost,
        requiredDate: partDetail.requiredDate,
        createdBy: this.currentUserName,
        remarks: partDetail.remarks,
        modifiedBy: this.currentUserName,
        tempUniqValue: partDetail.tempUniqValue,
        requestForQuoteSupplierDetails:
          supplierDetailsMap.get(partDetail.tempUniqValue) || [],
      };

      //Remove tempUniqValue from both requestForQuotePartDetails and requestForQuoteSupplierDetails
      delete consolidatedPartDetail.tempUniqValue;
      consolidatedPartDetail.requestForQuoteSupplierDetails.forEach(
        (supplierDetail) => {
          delete supplierDetail.tempUniqValue;
        }
      );

      consolidatedObject.requestForQuotePartDetails.push(
        consolidatedPartDetail
      );
    });

    return consolidatedObject;
  }

  

  consolidateDatForUpdate(
    generalFields: any,
    supplierDetails: any[],
    partDetails: any[]
  ): RequestForQuote {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();

    const consolidatedObject: RequestForQuote = {
      requestForQuoteId: generalFields.requestForQuoteId,
      requestForQuoteNo: generalFields.requestForQuoteNo,
      requestForQuoteDate: generalFields.requestForQuoteDate,
      currentStatusId: generalFields.currentStatusId,
      requestForQuoteEndDate: generalFields.modifiedDate, 
      requestForQuoteSourceId: generalFields.requestForQuoteSourceId,
      depotId: generalFields.depotId,
      totalRequestForQuoteCost: generalFields.totalRequestForQuoteCost,
      remarks: generalFields.remarks,
      purchaseRequisitionId: generalFields.purchaseRequisitionId,
      created: generalFields.created,
      createdBy: generalFields.createdBy,
      modified: generalFields.modified,
      modifiedBy: this.currentUserName,
      requestForQuotePartDetails: [],
    };

    const supplierDetailsMap = new Map<
      number,
      RequestForQuoteSupplierDetail[]
    >();
    supplierDetails.forEach((supplierDetail: any) => {
      const tempUniqValue = supplierDetail.tempUniqValue;
      let partId = supplierDetail.partId;
      if (!supplierDetailsMap.has(tempUniqValue)) {
        supplierDetailsMap.set(tempUniqValue, []);
      }
      supplierDetailsMap.get(tempUniqValue)?.push({
        partId: partId,
        tempUniqValue: tempUniqValue,
        supplierId: supplierDetail.supplierId,
        preferredSupplier: supplierDetail.preferredSupplier
          ? supplierDetail.preferredSupplier
          : false,
        createdBy: supplierDetail.createdBy
          ? supplierDetail.createdBy
          : this.currentUserName,
        modifiedBy: this.currentUserName,
        created: supplierDetail.created
          ? supplierDetail.created
          : formattedDate,
        modified: formattedDate,
      });
    });

    partDetails.forEach((partDetail: any) => {
      const consolidatedPartDetail: RequestForQuotePartDetail = {
        requestForQuotePartDetailId: partDetail.requestForQuotePartDetailId
          ? partDetail.requestForQuotePartDetailId
          : 0,
        partTypeId: partDetail.partTypeId,
        partId: partDetail.partId,
        stockUOMId: partDetail.stockUomId,
        requisitionQuantity: parseInt(partDetail.requisitionQuantity),
        estimatedCost: partDetail.estimatedCost,
        requiredDate: partDetail.requiredDate,
        createdBy: partDetail.createdBy
          ? partDetail.createdBy
          : this.currentUserName,
        remarks: partDetail.remarks,
        modifiedBy: partDetail.modifiedBy
          ? partDetail.modifiedBy
          : this.currentUserName,
        created: partDetail.created ? partDetail.created : formattedDate,
        modified: formattedDate,
        tempUniqValue: partDetail.tempUniqValue,
        requestForQuoteSupplierDetails:
          supplierDetailsMap.get(partDetail.tempUniqValue) || [],
      };
      consolidatedObject['requestForQuotePartDetails'].push(
        consolidatedPartDetail
      );
    });

    return consolidatedObject;
  }
  handleFormSubmit() {
    
    if (this.editSaveForm.invalid) {
      this.validateAllFormFields(this.editSaveForm);
     
      return;
    } else {

      if (
        this.editSaveForm.dirty &&
        this.editSaveForm.touched &&
        this.mode === 'new'
      ) {
        
        if (this.mode === 'new') {
          

          let rfqNumberControl = this.editSaveForm.get('rfqNumber')?.value;
          let rfqDateControl = this.editSaveForm.get('rfqDate')?.value;
          let rfqStatusControl = this.editSaveForm.get('rfqStatus')?.value;
          let rfqSourceControl = this.editSaveForm.get('rfqSource')?.value;
          let prNumberControl = this.editSaveForm.get('prNumber')?.value;
          let formExtractedObject = {
            rfqNumber: rfqNumberControl,
            rfqDate: rfqDateControl,
            rfqStatusId: rfqStatusControl.statusId,
            rfqEndDate: this.editSaveForm.value.rfqEndDate,
            rfqSourceId: rfqSourceControl.sourceId,
            depotId: this.editSaveForm.value.depot.depotId,
            purchaseRequisitionId: prNumberControl,
            rfqRemarks: this.editSaveForm.value.rfqRemarks,
          };
          
          let uniqueSupplierData: any[] = [];

          this.overallSupplierData.forEach(
            (
              item: { partId: any; supplierId: any; tempUniqValue: any },
              index: any
            ) => {
              const isDuplicate = uniqueSupplierData.some((uniqueItem) => {
                return (
                  uniqueItem.partId === item.partId &&
                  uniqueItem.supplierId === item.supplierId &&
                  uniqueItem.tempUniqValue === item.tempUniqValue
                );
              });

              if (!isDuplicate) {
                uniqueSupplierData.push(item);
              }
            }
          );
        
          let uniquePartData: any[] = [];

          this.partDetailData.forEach((item: { tempUniqValue: any }) => {
            // Check if there is any item in uniquePartData with the same tempUniqValue
            const isDuplicate = uniquePartData.some((uniqueItem) => {
              return uniqueItem.tempUniqValue === item.tempUniqValue;
            });

            // If there is no duplicate, add the item to uniquePartData
            if (!isDuplicate) {
              uniquePartData.push(item);
            }
          });

          const consolidatedData = this.consolidateData(
            formExtractedObject,
            uniqueSupplierData,
            uniquePartData
          );
          
          

          if (uniquePartData && uniquePartData?.length === 0) {
            this.notificationService.smallBox({
              title: this.translate.instant('common.notificationTitle.error'),
              content: this.translate.instant(
                'operations.requestForQuote.errors.atLeastOnePartErr'
              ),
              severity: 'error',
              timeout: 5000,
              icon: 'fa fa-times',
            });
          } else {
            this.editSaveForm.markAsDirty();
            
            
            this.loaderService.start();
            this.requestForQuoteService
              .createRequestForQuote(consolidatedData)
              .subscribe((data) => {
                this.loaderService.stop();
                if (data['status'] === true) {
                  this.notificationService.smallBox({
                    severity: 'success',
                    title: this.translate.instant(
                      'common.notificationTitle.success'
                    ),
                    content: data['message'],
                    timeout: 5000,
                    icon: 'fa fa-check',
                  });
                  this.sharedTableStoreService.setResetTableData(true);
                  this.sharedTableStoreService.refreshTable(true);
                  this.selectedDataList = [];
                  
                  this.receiveTableRowData(data.response);
                  this.submitted = false;
                  
                  this.mode = 'edit';
                  this.editSaveForm.markAsPristine();
                  this.overallSupplierData = [];
                  this.enableRights();
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
        }
      } else {
       
        let uniqueSupplierData: any[] = [];

        this.overallSupplierData.forEach(
          (
            item: { partId: any; supplierId: any; tempUniqValue: any },
            index: any
          ) => {
            const isDuplicate = uniqueSupplierData.some((uniqueItem) => {
              return (
                uniqueItem.partId === item.partId &&
                uniqueItem.supplierId === item.supplierId &&
                uniqueItem.tempUniqValue === item.tempUniqValue
              );
            });

            if (!isDuplicate) {
              uniqueSupplierData.push(item);
            }
          }
        );
        

        let uniquePartData: any[] = [];

        this.partDetailData.forEach((item: { tempUniqValue: any }) => {
          // Check if there is any item in uniquePartData with the same tempUniqValue
          const isDuplicate = uniquePartData.some((uniqueItem) => {
            return uniqueItem.tempUniqValue === item.tempUniqValue;
          });

          // If there is no duplicate, add the item to uniquePartData
          if (!isDuplicate) {
            uniquePartData.push(item);
          }
        });

        const finalSupplierData = uniqueSupplierData.filter((item) => {
          return !('requestForQuoteSupplierDetailId' in item);
        });

        

        const consolidatedData = this.consolidateDatForUpdate(
          this.selectedDataToUpdate,
          finalSupplierData,
          uniquePartData
        );
        if (
          uniquePartData &&
          uniquePartData?.length === 0 &&
          finalSupplierData &&
          finalSupplierData?.length === 0
        ) {
          this.notificationService.smallBox({
            title: this.translate.instant(
              'common.notificationTitle.information'
            ),
            content: this.translate.instant('common.Information.noChangesInfo'),
            severity: 'info',
            timeout: 3000,
            icon: 'fa fa-check',
          });
        } else {

          
          this.loaderService.start();
          this.requestForQuoteService
            .updateRequestForQuote(consolidatedData)
            .subscribe((data) => {
              this.loaderService.stop();
              if (data['status'] === true) {
                this.notificationService.smallBox({
                  severity: 'success',
                  title: this.translate.instant(
                    'common.notificationTitle.success'
                  ),
                  content: data['message'],
                  timeout: 5000,
                  icon: 'fa fa-check',
                });
                
                this.sharedTableStoreService.setResetTableData(true);
                this.sharedTableStoreService.refreshTable(true);
                this.selectedDataList = [];
                this.receiveTableRowData(data.response);
                

                this.enableRights();
                this.getServerSideTableList(this.paramsGlobal);
                this.nullifyTempArray();
                this.mode = 'edit';
                this.editSaveForm.markAsPristine();
                this.overallSupplierData = [];
              } else {
                this.nullifyTempArray();
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
      }
    }
  }

  handleFormCancelSave(remarks: any) {
    
    this.cancelPopup.cancelRemarkForm.markAsPristine();
    this.loaderService.start();
    this.requestForQuoteService
      .cancelRequestForQuote(
        this.selectedDataRFQNumbers,
        this.selectedData,
        remarks
      )
      .subscribe((data: any) => {
        if (data['status'] === true) {
          this.sharedTableStoreService.setResetTableData(true);
          this.sharedTableStoreService.refreshTable(true);
          this.selectedDataList = [];
          this.selectedDataRFQNumbers = [];
          this.getServerSideTableList(this.paramsGlobal);
          this.getRequestForQuoteOverView();
          this.showList = true;
          this.cancelPopup.cancelPopup.hide();
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
  // ------------Grid Icon Functions--------- end
  validatePeriod(controlName: string, event: any) {
    this.currentDate = new Date();

    const selectedDate = new Date(this.formatDate(event));

    if (selectedDate > this.currentDate) {
      this.fromGreaterThanCurrent = true;
      this.fromGreaterThanTo = false;

      if (controlName === 'rfqFromDate') {
        this.editSaveFormSearch.controls['rfqFromDate'].setErrors({
          greaterThanCurrentDateError: true,
        });
      }
      if (controlName === 'rfqToDate') {
        this.editSaveFormSearch.controls['rfqToDate'].setErrors({
          greaterThanCurrentDateError: true,
        });
      }

      this.toLesserThanCurrent = true;
      this.toLesserThanFrom = false;
    } else {
      if (controlName === 'rfqFromDate') {
        this.editSaveFormSearch.controls['rfqFromDate'].setErrors(null);
      }
      if (controlName === 'rfqToDate') {
        this.editSaveFormSearch.controls['rfqToDate'].setErrors(null);
      }

      let fromRfq = this.editSaveFormSearch.controls['rfqFromDate'].value;
      let toRfq = this.editSaveFormSearch.controls['rfqToDate'].value;

      let convertedRfqToDte = new Date(this.formatDate(fromRfq));
      let convertedRfqFromDte = new Date(this.formatDate(toRfq));

      if (convertedRfqToDte && convertedRfqFromDte) {
        
        if (convertedRfqFromDte < convertedRfqToDte) {
          if (controlName === 'rfqFromDate') {
            this.editSaveFormSearch.controls['rfqFromDate'].setErrors({
              customErr: true,
            });
          }
          if (controlName === 'rfqToDate') {
            this.editSaveFormSearch.controls['rfqToDate'].setErrors({
              customErr: true,
            });
          }
        } else {
          this.editSaveFormSearch.controls['rfqToDate'].setErrors(null);
          this.editSaveFormSearch.controls['rfqFromDate'].setErrors(null);
        }
      }
    }
    if (isNaN(selectedDate.getTime())) {
      this.editSaveFormSearch.controls[controlName].setErrors({
        invalid: true,
      });
    }
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
  checkNgSearchFormSelectValue(event: any, controlName: any) {
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

  dropdownDepotSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['depotCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotCode'].toLocaleLowerCase() === term ||
      item['depotName'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotName'].toLocaleLowerCase() === term
    );
  }
  dropdownRFQNoSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['requestForQuoteNo'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['requestForQuoteNo'].toLocaleLowerCase() === term
    );
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

  getServerSideTableList(params: any): void {
    this.paramsGlobal = params;
    const formValues = this.editSaveFormSearch.getRawValue();
    const rfqStatusArray = Array.isArray(formValues?.rfqStatus)
      ? formValues.rfqStatus
      : [];

    const searchRFQStatus =
      rfqStatusArray
        .filter((status: { enumId: any }) => status.enumId !== 586)
        .map((status: { enumId: any }) => status.enumId) ?? [];

    let requestForQuoteDate = this.tableFilterFormGroup.value
      .requestForQuoteDate
      ? this.tableFilterFormGroup.value.requestForQuoteDate
      : '';

    
    this.serverSideProcessing = {
      ...params,
      currentPage: params?.first || 0,
      globalFilter:
        params?.globalFilter != undefined
          ? params?.globalFilter
          : this.requestForQuoteList != undefined
            ? this.requestForQuoteList?.sharedLazyTableNew?.globalFilter.value
            : null,
      pageSize: params?.rows,
      sortField: params.sortField ? params.sortField : 'sortOnly',
      sortOrder: params.sortField
        ? params.sortOrder
          ? params.sortOrder
          : -1
        : -1,
      

      requestForQuoteNo: this.tableFilterFormGroup.value.requestForQuoteNo
        ? this.tableFilterFormGroup.value.requestForQuoteNo
        : '',
      requestForQuoteDate: requestForQuoteDate,
      requestForQuoteSource: this.tableFilterFormGroup.value
        .requestForQuoteSource
        ? this.tableFilterFormGroup.value.requestForQuoteSource
        : '',
      requestForQuoteStatus: this.tableFilterFormGroup.value.currentStatusCode
        ? this.tableFilterFormGroup.value.currentStatusCode
        : '',
     
      totalRequestForQuoteCost: this.tableFilterFormGroup.value
        .totalRequestForQuoteCost
        ? String(this.tableFilterFormGroup.value.totalRequestForQuoteCost)
        : '',
      modifiedBy: this.tableFilterFormGroup.value.modifiedBy
        ? this.tableFilterFormGroup.value.modifiedBy
        : '',
      modifiedDate: this.tableFilterFormGroup.value.modifiedDate
        ? this.tableFilterFormGroup.value.modifiedDate
        : '',

      purchaseRequisitionNo: this.tableFilterFormGroup.value
        .purchaseRequisitionNo
        ? this.tableFilterFormGroup.value.purchaseRequisitionNo
        : '',
      purchaseOrderNo: this.tableFilterFormGroup.value.purchaseOrderNo
        ? this.tableFilterFormGroup.value.purchaseOrderNo
        : '',
      depotCurrencyCode: this.tableFilterFormGroup.value.depotCurrencyCode
        ? this.tableFilterFormGroup.value.depotCurrencyCode
        : '',

      depotCode: this.tableFilterFormGroup.value.depotCode
        ? this.tableFilterFormGroup.value.depotCode
        : '',
      searchDepot:
        formValues?.depot?.map((depot: { depotId: any }) => depot?.depotId) ??
        [],
      searchRFQNo:
        formValues?.rfqNo?.map(
          (rfq: { requestForQuoteId: any }) => rfq?.requestForQuoteId
        ) ?? [],
      searchRFQStatus: searchRFQStatus,
      searchCurrentStatusId: this.currentStatusId || 0,
      searchRFQSource:
        formValues?.rfqSource?.map(
          (source: { enumId: any }) => source?.enumId
        ) ?? [],
      searchRRQFromDate: formValues?.rfqFromDate,
      searchRRQToDate: formValues?.rfqToDate,
    };

    this.searchRequestForQuote(this.serverSideProcessing);
  }

  exportToExcel(event: any) {
    let newColumns = event?.columns?.filter(
      (key: any) => key.field != 'checkbox'
    );

    let params: any = { first: 0, rows: this.totalDataGridCountComp };
    newColumns?.map((item: { [x: string]: any; field: string }) => { });
    this.excelDataTable = [];
    this.excelDataTable.columns = newColumns;
    this.excelDataTable.filteredValue = undefined;
    let downloaded: boolean;

    const formValues = this.editSaveFormSearch.getRawValue();
    const rfqStatusArray = Array.isArray(formValues?.rfqStatus)
      ? formValues.rfqStatus
      : [];

    const searchRFQStatus =
      rfqStatusArray
        .filter((status: { enumId: any }) => status.enumId !== 586)
        .map((status: { enumId: any }) => status.enumId) ?? [];

    let requestForQuoteDate = this.tableFilterFormGroup.value
      .requestForQuoteDate
      ? this.tableFilterFormGroup.value.requestForQuoteDate
      : '';

    let serverSideProcessing = {
      ...params,
      currentPage: params?.first || 0,
      globalFilter:
        params?.globalFilter != undefined
          ? params?.globalFilter
          : this.requestForQuoteList != undefined
            ? this.requestForQuoteList?.sharedLazyTableNew?.globalFilter.value
            : null,
      pageSize: params?.rows,
      sortField: params.sortField ? params.sortField : 'sortOnly',
      sortOrder: params.sortField
        ? params.sortOrder
          ? params.sortOrder
          : -1
        : -1,
      
      requestForQuoteNo: this.tableFilterFormGroup.value.requestForQuotationNo
        ? this.tableFilterFormGroup.value.requestForQuotationNo
        : '',
      requestForQuoteDate: requestForQuoteDate,
      requestForQuoteSource: this.tableFilterFormGroup.value
        .requestForQuoteSource
        ? this.tableFilterFormGroup.value.requestForQuoteSource
        : '',
      requestForQuoteStatus: this.tableFilterFormGroup.value.currentStatusCode
        ? this.tableFilterFormGroup.value.currentStatusCode
        : '',

      totalRequestForQuoteCost: this.tableFilterFormGroup.value
        .totalRequestForQuoteCost
        ? String(this.tableFilterFormGroup.value.totalRequestForQuoteCost)
        : '',
      modifiedBy: this.tableFilterFormGroup.value.modifiedBy
        ? this.tableFilterFormGroup.value.modifiedBy
        : '',
      modifiedDate: this.tableFilterFormGroup.value.modifiedDate
        ? this.tableFilterFormGroup.value.modifiedDate
        : '',

      purchaseRequisitionNo: this.tableFilterFormGroup.value
        .purchaseRequisitionNo
        ? this.tableFilterFormGroup.value.purchaseRequisitionNo
        : '',
      purchaseOrderNo: this.tableFilterFormGroup.value.poNo
        ? this.tableFilterFormGroup.value.poNo
        : '',
      depotCurrencyCode: this.tableFilterFormGroup.value.depotCurrencyCode
        ? this.tableFilterFormGroup.value.depotCurrencyCode
        : '',

      depotCode: this.tableFilterFormGroup.value.depotCode
        ? this.tableFilterFormGroup.value.depotCode
        : '',
      searchDepot:
        formValues?.depot?.map((depot: { depotId: any }) => depot?.depotId) ??
        [],
      searchRFQNo:
        formValues?.rfqNo?.map(
          (rfq: { requestForQuoteId: any }) => rfq?.requestForQuoteId
        ) ?? [],
      searchRFQStatus: searchRFQStatus,
      searchCurrentStatusId: this.currentStatusId || 0,
      searchRFQSource:
        formValues?.rfqSource?.map(
          (source: { enumId: any }) => source?.enumId
        ) ?? [],
      searchRRQFromDate: formValues?.rfqFromDate,
      searchRRQToDate: formValues?.rfqToDate,
    };

    this.loaderService.start();
    this.requestForQuoteService
      .getRequestForQuoteListServerSide(
        serverSideProcessing,
        this.userAuthService.getCurrentCompanyId(),
        this.userAuthService.getCurrentUserId()
      )
      .subscribe((data: any) => {
        if (data.status === true) {
          this.selectedDataList = [];
          this.excelDataTable.value = data['response'].result;
          downloaded = this.excelService.exportAsExcelFile(
            this.excelDataTable,
            'Request For Quote List',
            false
          );
        }

        this.loaderService.stop();
      });
  }

  searchRequestForQuote(params: any) {
    this.loaderService.start();
    this.requestForQuoteService
      .getRequestForQuoteListServerSide(
        params,
        this.userAuthService.getCurrentCompanyId(),
        this.userAuthService.getCurrentUserId()
      )
      .subscribe((data: any) => {
        if (data.status === true) {
          this.selectedDataList = [];
          this.sharedTableStoreService.setResetTableData(true);
          
          this.requestForQuoteData = data.response.result;
          this.totalDataGridCountComp = data['response'].filterRecordCount;
          this.sharedTableStoreService.setAssignGridData({ data, params });
          this.getRequestForQuoteOverView();
        }
        this.loaderService.stop();
      });
  }

  getRFQNoByCurrentStatusId(currentStatusId: number, cardNumber: number = 1) {
    this.currentStatusId = currentStatusId;
    this.requestForQuoteService
      .getRequestForQuoteNoByCurrentStatusId(currentStatusId)
      .subscribe((res) => {
        if (res.status === true) {
          this.rfqNumberDDList = res.response;
        }
      });

    this.currentTabStatusId = cardNumber;
    if (this.currentTabStatusId == 2) {
      this.showFormSendRFQIcons = true;
      this.showFormSendForApprovalIcons = false;
      this.showEmailRFQIcons = false;
      this.showReopenIcons = false;
      this.showCancelIcons = true;
    } else if (
      this.currentTabStatusId == 5 ||
      this.currentTabStatusId == 3 ||
      this.currentTabStatusId == 4
    ) {
      

      this.showFormSendRFQIcons = false;
      this.showFormSendForApprovalIcons = false;
      this.showEmailRFQIcons = false;
      this.showReopenIcons = false;
      this.showCancelIcons = true;
    } else if (this.currentTabStatusId == 6 || this.currentTabStatusId == 8) {
      this.showFormSendRFQIcons = false;
      this.showFormSendForApprovalIcons = false;
      this.showCancelIcons = false;
      this.showReopenIcons = false;
      this.showEmailRFQIcons = true;
    } else if (this.currentTabStatusId == 7) {
      this.showFormSendRFQIcons = false;
      this.showFormSendForApprovalIcons = false;
      this.showCancelIcons = false;
      this.showEmailRFQIcons = false;
      this.showReopenIcons = true;
    } else {
      this.showFormSendRFQIcons = true;
      this.showFormSendForApprovalIcons = true;
      this.showEmailRFQIcons = true;
      this.showReopenIcons = true;
      this.showCancelIcons = true;
    }

    this.changeHeaderColumn(cardNumber);
    this.changeTableTitle(cardNumber);
    this.getRequestForQuoteOverView();
    this.getRequestForQuoteStatuses();
    this.getRequestForQuoteSources();
    this.getServerSideTableList(this.paramsGlobal);
  }
  sendEmailFunction(emailData: any) {
   
    emailData.requestForQuoteId = this.selectedDataList[0]?.requestForQuoteId;
    emailData.RFQNo = this.selectedDataList[0]?.requestForQuoteNo;

    this.requestForQuoteService.sendEmail(emailData).subscribe((data) => {
      if (data['status'] === true) {
        this.loaderService.stop();
        this.sharedTableStoreService.setResetTableData(true);
        this.sharedTableStoreService.refreshTable(true);
        this.selectedDataList = [];
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
  handleEmailIcon(event: any) {
 

    if (this.selectedDataList?.length == 1) {
      const invalidStatus = this.selectedDataList.some(
        (item: { currentStatusId: number }) => item.currentStatusId !== 591
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
        const emailSubjectPre = this.translate.instant(
          'operations.requestForQuote.titles.emailSubjectPre'
        );
        const emailSubjectSuf = this.translate.instant(
          'operations.requestForQuote.titles.emailSubjectSuf'
        );
        this.emailSubject =
          emailSubjectPre +
          this.selectedDataList[0]?.requestForQuoteNo +
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
                  title: this.translate.instant(
                    'common.notificationTitle.error'
                  ),
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
                this.rfqAttachmentPath.push(
                  'RequestForQuoteOutput' + printData?.supplierCode + '.pdf'
                );
              }
              this.emailModal.emailPopup = true;

              
            }
          });
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

  async generateEmailPdfForData(
    printData: RequestForQuoteOutputPrintData
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.GenerateRfqPdfComponent.getData(printData);
        this.GenerateRfqPdfComponent.generateEmailPdf().then(() => {
          resolve();
        });
      }, 1000);
    });
  }

  changeTableTitle(cardNumber: any) {
    if (cardNumber == 1) {
      this.tableTitle = 'Overall List';
      this.editSaveFormSearch.controls['rfqStatus'].patchValue([
        { code: 'OVERALL', enumId: 586 },
      ]);
      this.editSaveFormSearch.controls['rfqStatus'].enable();
    } else if (cardNumber == 2) {
      this.tableTitle = 'Drafts List';
      this.editSaveFormSearch.controls['rfqStatus'].patchValue([
        { code: 'DRAFT', enumId: 587 },
      ]);
      this.editSaveFormSearch.controls['rfqStatus'].disable();
    } else if (cardNumber == 3) {
      this.tableTitle = 'Requested List';
      this.editSaveFormSearch.controls['rfqStatus'].patchValue([
        { code: 'REQUESTED', enumId: 588 },
      ]);
      this.editSaveFormSearch.controls['rfqStatus'].disable();
    } else if (cardNumber == 4) {
      this.tableTitle = 'Quotes Received List';
      this.editSaveFormSearch.controls['rfqStatus'].patchValue([
        { code: 'QUOTE RECEIVED', enumId: 589 },
      ]);
      this.editSaveFormSearch.controls['rfqStatus'].disable();
    } else if (cardNumber == 5) {
      this.tableTitle = 'Pending Approval List';
      this.editSaveFormSearch.controls['rfqStatus'].patchValue([
        { code: 'PENDING APPROVAL', enumId: 590 },
      ]);
      this.editSaveFormSearch.controls['rfqStatus'].disable();
    } else if (cardNumber == 6) {
      this.tableTitle = 'Approved List';
      this.editSaveFormSearch.controls['rfqStatus'].patchValue([
        { code: 'APPROVED', enumId: 591 },
      ]);
      this.editSaveFormSearch.controls['rfqStatus'].disable();
    } else if (cardNumber == 7) {
      this.tableTitle = 'Cancelled List';
      this.editSaveFormSearch.controls['rfqStatus'].patchValue([
        { code: 'CANCELLED', enumId: 592 },
      ]);
      this.editSaveFormSearch.controls['rfqStatus'].disable();
    } else if (cardNumber == 8) {
      this.tableTitle = 'Rejected List';
      this.editSaveFormSearch.controls['rfqStatus'].patchValue([
        { code: 'REJECTED', enumId: 593 },
      ]);
      this.editSaveFormSearch.controls['rfqStatus'].disable();
    }

    this.sharedLazyTableNew?.changeTableTitle(this.tableTitle);
  }

  changeHeaderColumn(cardNumber: number) {
    if (cardNumber == 1) {
      this.tableTitle = 'Overall list';
      this.showTableByColumn = 1;
    } else if (cardNumber == 7) {
      this.showTableByColumn = 2;
    } else {
      this.showTableByColumn = 3;
    }

    this.sharedLazyTableNew?.changeHeaderDynamically();
  }
  disableAllIcons() {
    this.disableAddNewIcons = true;
    this.disableSendForApprovalIcons = true;
    this.disableCancelRFQIcons = true;
    this.disableReopenIcons = true;
    this.disablePrintRFQIcons = true;
    this.disableEmailRFQIcons = true;
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
      if (this.mode == 'new') {
        this.showWarningMessageForRoleRights = true;
        this.warningMessageForRoleRights = 'common.roleRightsMessages.create';
        this.showWarningMessageForRoleRightsForm = true;
        this.warningMessageForRoleRightsForm =
          'common.roleRightsMessages.create';
        this.mode = 'view';
        this.disableAddButton = true;
        this.disableSaveButton = false;
        this.editSaveForm.disable();

        this.disableAllIcons();
        if (this.currentTabStatusId == 1) {
          //overall
        } else if (this.currentTabStatusId == 2) {
          
          //draft
          this.disableFormSendRFQIcons = true;
          this.disableAddNewIcons = true;
          this.disableSendForApprovalIcons = true;
          this.disableCancelRFQIcons = true;
          this.disableFormCancelRFQIcons = true;
        } else if (this.currentTabStatusId == 3) {
          //pending approval
          this.disableCancelRFQIcons = true;
          this.disablePrintRFQIcons = true;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disablePrintRFQIcons = true;
          this.disableEmailRFQIcons = true;
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableReopenIcons = true;
          this.disablePrintRFQIcons = false;
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disableAddNewIcons = true;
          this.disableCancelRFQIcons = true;
          this.disablePrintRFQIcons = false;
        } else if (this.currentTabStatusId == 7) {
          // create
          this.showWarningMessageForRoleRightsForm = true;
          this.warningMessageForRoleRightsForm =
            'common.roleRightsMessages.edit';

          this.disableFormAddNewIcons = true;
          this.disableFormSubmitIcons = true;
        }
      } else {
        this.showWarningMessageForRoleRightsForm = true;
        this.warningMessageForRoleRightsForm = 'common.roleRightsMessages.edit';
        this.mode = 'view';
        this.disableAddButton = true;
        this.disableSaveButton = true;
        this.disableAllIcons();

        if (this.currentTabStatusId == 1) {
          //overall
          this.disableFormAddNewIcons = true;

          this.disableFormPrintRFQIcons = true;
          this.disableFormEmailRFQIcons = true;
          this.disableCancelRFQIcons = true;
          this.disableFormSubmitIcons = true;
        } else if (this.currentTabStatusId == 2) {
          //draft

          this.disableFormPrintRFQIcons = true;
          this.disableCancelRFQIcons = true;
          this.disableFormSendForApprovalIcons = true;
          this.disableFormAddNewIcons = true;
          this.disableFormSubmitIcons = true;
          this.disableFormResetIcons = true;
        } else if (this.currentTabStatusId == 3) {
          //pending approval

          this.disableCancelRFQIcons = true;
          this.disableFormAddNewIcons = true;
          this.disableFormPrintRFQIcons = false;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disableFormPrintRFQIcons = true;
          this.disableCancelRFQIcons = true;
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableFormPrintRFQIcons = true;
          this.disableCancelRFQIcons = true;
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disableFormPrintRFQIcons = true;
          this.disableCancelRFQIcons = true;
        } else if (this.currentTabStatusId == 7) {
          // create

          this.disableFormPrintRFQIcons = true;
          this.disableCancelRFQIcons = true;
          this.disableFormSendForApprovalIcons = true;
          this.disableFormAddNewIcons = true;
          this.disableFormSubmitIcons = true;
          this.disableFormResetIcons = true;
        }
      }
    } else if (!this.createBit && this.editBit && this.viewBit) {
      // edit and view
      if (this.mode == 'new') {
        this.showWarningMessageForRoleRights = true;
        this.warningMessageForRoleRights = 'common.roleRightsMessages.create';
        this.showWarningMessageForRoleRightsForm = true;
        this.warningMessageForRoleRightsForm =
          'common.roleRightsMessages.create';
        this.mode = 'view';
        this.disableAddButton = true;
        this.disableSaveButton = false;
        this.editSaveForm.disable();

        if (this.currentTabStatusId == 1) {
          //overall
          this.disableAddNewIcons = true;
          this.disablePrintRFQIcons = false;
          this.disableEmailRFQIcons = false;
        } else if (this.currentTabStatusId == 2) {
          //draft
          this.disableAddNewIcons = true;
          this.disablePrintRFQIcons = false;
          this.disableSendForApprovalIcons = false;
          this.disableCancelRFQIcons = false;
        } else if (this.currentTabStatusId == 3) {
          //pending approval
          this.disableAddNewIcons = true;

          this.disableCancelRFQIcons = false;
          this.disablePrintRFQIcons = false;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disablePrintRFQIcons = false;
          this.disableEmailRFQIcons = false;
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableReopenIcons = false;
          this.disablePrintRFQIcons = false;
          this.disableEmailRFQIcons = false;
          this.disableFormSubmitIcons = true;
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disablePrintRFQIcons = false;
          this.disableCancelRFQIcons = false;
          this.disableFormAddNewIcons = true;
        } else if (this.currentTabStatusId == 7) {
          // create
          this.disableFormAddNewIcons = true;
          this.disableFormSubmitIcons = true;
        } else if (this.currentTabStatusId == 8) {
          // update
          this.disableFormAddNewIcons = true;
        } else {
        }
      } else {
        this.showWarningMessageForRoleRightsForm = true;
        this.warningMessageForRoleRightsForm =
          'common.roleRightsMessages.create';

        this.mode = 'edit';
        this.disableAddButton = true;
        this.disableSaveButton = false;
        this.editSaveForm.disable();

        if (this.currentTabStatusId == 1) {
          //overall
          this.disableFormAddNewIcons = true;
          this.disableFormPrintRFQIcons = false;
          this.disableCancelRFQIcons = false;
          this.disableFormSendForApprovalIcons = false;
          this.disableFormSubmitIcons = false;
          this.disableFormResetIcons = false;
        } else if (this.currentTabStatusId == 2) {
          //draft
          this.disableFormAddNewIcons = true;

          this.disableFormPrintRFQIcons = false;
          this.disableCancelRFQIcons = false;
          this.disableFormSendForApprovalIcons = false;
          this.disableFormSubmitIcons = false;
          this.disableFormResetIcons = false;
        } else if (this.currentTabStatusId == 3) {
          //pending approval
          this.disableFormSubmitIcons = false;
          this.disableCancelRFQIcons = false;
          this.disableFormPrintRFQIcons = false;
          this.disableFormAddNewIcons = true;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disableFormPrintRFQIcons = false;
          this.disableFormEmailRFQIcons = false;
          this.disableFormSubmitIcons = true;
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableFormPrintRFQIcons = false;
          this.disableFormPrintRFQIcons = false;
          this.disableFormEmailRFQIcons = false;
          this.editSaveForm.disable();
          this.disableFormSubmitIcons = true;
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disableFormPrintRFQIcons = false;
          this.disableCancelRFQIcons = false;
          this.editSaveForm.disable();
          this.disableFormSubmitIcons = true;
        } else if (this.currentTabStatusId == 7) {
          // create
          this.warningMessageForRoleRightsForm =
            'common.roleRightsMessages.create';

          this.mode = 'edit';
          this.disableFormAddNewIcons = false;
          this.disableFormSubmitIcons = false;
          this.disableFormPrintRFQIcons = false;
          this.disableCancelRFQIcons = false;
          this.disableFormResetIcons = false;
          this.disableFormSendForApprovalIcons = false;
        } else if (this.currentTabStatusId == 8) {
          // update
          this.warningMessageForRoleRightsForm =
            'common.roleRightsMessages.create';
          this.disableFormAddNewIcons = true;

          this.disableFormPrintRFQIcons = false;
          this.disableCancelRFQIcons = false;
          this.disableFormSendForApprovalIcons = false;
          this.disableFormSubmitIcons = false;
          this.disableFormResetIcons = false;
        }
      }
    } else if (this.createBit && !this.editBit && this.viewBit) {
      

      // create and view

      this.showWarningMessageForRoleRights = true;
      this.warningMessageForRoleRights = 'common.roleRightsMessages.edit';
      this.showWarningMessageForRoleRightsForm = true;
      this.warningMessageForRoleRightsForm = 'common.roleRightsMessages.edit';

      if (this.mode == 'new') {
        this.mode = 'new';
        this.disableAddButton = false;
        this.disableSaveButton = false;
        
        this.editSaveForm.enable();
        this.disableFormSubmitIcons = false;
        this.disableAddNewIcons = false;
        this.disablePrintRFQIcons = false;
        this.disableEmailRFQIcons = false;

        if (this.currentTabStatusId == 1) {
          //overall
          this.disableCancelRFQIcons = true;
        } else if (this.currentTabStatusId == 2) {
          //draft
          this.disableAddNewIcons = false;
          this.disablePrintRFQIcons = false;
          this.disableSendForApprovalIcons = false;
          this.disableCancelRFQIcons = false;
        } else if (this.currentTabStatusId == 3) {
          //pending approval
          this.disableAddNewIcons = false;
          this.disableCancelRFQIcons = false;
          this.disablePrintRFQIcons = false;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disablePrintRFQIcons = false;
          this.disableEmailRFQIcons = false;
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableReopenIcons = false;
          this.disablePrintRFQIcons = false;
          this.disableEmailRFQIcons = false;
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disablePrintRFQIcons = false;
          this.disableCancelRFQIcons = false;
          this.disableAddNewIcons = false;
        } else if (this.currentTabStatusId == 7) {
          // create
          this.disableAddNewIcons = false;
        } else if (this.currentTabStatusId == 8) {
          // update
          this.disableAddNewIcons = false;
        } else {
        }
      } else {
        this.mode = 'view';
        this.showWarningMessageForRoleRightsForm = true;
        this.warningMessageForRoleRightsForm = 'common.roleRightsMessages.edit';
        this.disableAddButton = false;
        this.disableSaveButton = true;
        this.disableFormAddNewIcons = false;
        this.disableFormSubmitIcons = true;

        this.editSaveForm.disable();
        if (this.currentTabStatusId == 1) {
          //overall
          this.disableFormAddNewIcons = false;
          this.disableFormPrintRFQIcons = false;
          this.disableFormEmailRFQIcons = false;
          this.disableCancelRFQIcons = true;
        } else if (this.currentTabStatusId == 2) {
          //draft
          this.disableFormAddNewIcons = false;
          this.disableFormPrintRFQIcons = false;
          this.disableFormSendForApprovalIcons = false;
          this.disableFormResetIcons = false;
          this.disableCancelRFQIcons = true;
        } else if (this.currentTabStatusId == 3) {
          //pending approval

          this.disableCancelRFQIcons = false;
          this.disableFormPrintRFQIcons = false;
          this.disableFormAddNewIcons = false;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disableFormPrintRFQIcons = false;
          this.disableFormEmailRFQIcons = false;
          this.disableFormReopenIcons = false;
          this.editSaveForm.disable();
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableFormPrintRFQIcons = false;
          this.disableFormEmailRFQIcons = false;
          this.editSaveForm.disable();
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disableFormPrintRFQIcons = false;
          this.disableCancelRFQIcons = false;
          this.editSaveForm.disable();
        } else if (this.currentTabStatusId == 7) {
          // create
          this.warningMessageForRoleRightsForm =
            'common.roleRightsMessages.edit';

          this.disableFormAddNewIcons = false;
          this.disableFormSubmitIcons = false;
          this.disableFormResetIcons = false;

          this.disableFormPrintRFQIcons = true;
          this.disableCancelRFQIcons = true;
        } else if (this.currentTabStatusId == 8) {
          // update
          this.warningMessageForRoleRightsForm =
            'common.roleRightsMessages.edit';

          this.disableFormPrintRFQIcons = false;
          this.disableCancelRFQIcons = false;
          this.disableFormSendForApprovalIcons = false;
          this.disableFormAddNewIcons = false;
          this.disableFormSubmitIcons = false;
          this.disableFormResetIcons = false;
        }
      }
    }
  }
}
