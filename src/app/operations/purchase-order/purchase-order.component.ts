import {
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { FormCanDeactivate } from 'src/app/core/guards/form-can-deactivate';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/core/services';
import { Router, RouterStateSnapshot } from '@angular/router';
import { ExcelService } from 'src/app/shared/services/export/excel/excel.service';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { PurchaseOrderService } from './service/purchase-order.service';
import { PurchaseOrderFormComponent } from './purchase-order-form/purchase-order-form.component';
import {
  ApprovalRequest,
  PurchaseOrder,
  PurchaseOrderOutputData,
  ReopenPO,
} from './model/purchase-order-model';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { GeneratePoPdfComponent } from './generate-po-pdf/generate-po-pdf.component';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css'],
})
export class PurchaseOrderComponent extends FormCanDeactivate {
  @ViewChild('purchaseOrderList') purchaseOrderList:
    | PurchaseOrderListComponent
    | undefined;
  @ViewChild('purchaseOrderForm') purchaseOrderForm:
    | PurchaseOrderFormComponent
    | undefined;
  @ViewChild(PurchaseOrderFormComponent)
  purchaseOrderFormComponent!: PurchaseOrderFormComponent;
  @ViewChild('cancelPopup') cancelPopup: any;
  @ViewChild(GeneratePoPdfComponent)
  generatePurchaseOrderPdfComponent!: GeneratePoPdfComponent;
  currentDate: any;
  startPeriodSmallerThanCurrent: any;
  startPeriodSmallerThanEnd: any;
  clickedSearchBtn: any;
  editSaveFormSearch!: FormGroup;
  editSaveForm!: FormGroup;
  cancelRemarkForm!: FormGroup;
  screenId: any = '';
  mode: string = 'new';
  poNumber: string = '';
  overViewObject: any = {
    overAll: 0,
    drafts: 0,
    pendingApproval: 0,
    approved: 0,
    cancelled: 0,
    rejected: 0,
  };
  associatedDepots = [];
  purchaseOrder!: PurchaseOrder;
  POStatuses = [];
  POSources = [];
  selectedPoRowData: any;
  lastModifiedDate: any;
  showList = true;
  submitted = false;
  submittedSearch = false;
  serverSideProcessing: any;
  paramsGlobal: any;
  approvalRequest!: ApprovalRequest;
  reopenPO!: ReopenPO;

  hidesave: boolean = false;
  hideSendForApproval: boolean = false;
  hideCancelPO: boolean = false;
  selectedDataList: any;
  purchaseOrderDropDownList: any;
  totalDataGridCountComp: any;
  currentStatusId: number = 583; //status id for overall grid // Enum Id => 583 => Purchase order OVERALL Status  
  tableTitle = 'Overall List'; // default table title
  purchaseOrderIdForPrint: any;
  showTableByColumn = 1;
  fromGreaterThanCurrent = false;
  toLesserThanCurrent = false;
  fromGreaterThanTo = false;
  toLesserThanFrom = false;
  additionalChargesList: any = [];
  selectedPoId: any;
  selectedDataPONumbers: any = [];
  selectedData: any = [];
  selectedRowFromTable = []; // selected data from table
  // Enable Rights
  showWarningMessageForRoleRights: boolean = false;
  warningMessageForRoleRights: string = '';
  showWarningMessageForRoleRightsForm: boolean = false;
  warningMessageForRoleRightsForm: string = '';

  currentTabStatusId: number = 1;
  createBit: boolean = true;
  editBit: boolean = true;
  viewBit: boolean = true;

  disableALLGridIcons: boolean = false;
  disableALLFormIcons: boolean = false;
  disableAddNewIcons: boolean = false;
  disableSendForApprovalIcons: boolean = false;
  disableCancelPOIcons: boolean = false;
  disableReopenIcons: boolean = false;
  disablePrintPOIcons: boolean = false;
  disableEmailPOIcons: boolean = false;

  disableFormPrintPOIcons: boolean = false;
  disableFormEmailPOIcons: boolean = false;
  disableFormCancelPOIcons: boolean = false;
  disableFormReopenIcons: boolean = false;
  disableFormResetIcons: boolean = false;
  disableFormAddNewIcons: boolean = false;
  disableFormSendForApprovalIcons: boolean = false;
  disableFormSubmitIcons: boolean = false;
  excelDataTable: any = [];
  isAddNew: boolean = false;
  poFormEnableRights: any;
  currentUserName: any;
  currentCompanyId: any;
  currentUserId: any;
  showCancelPopup: boolean = false;
  // Enable Rights end

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private userAuthService: UserAuthService,
    private purchaseOrderService: PurchaseOrderService,
    private datePipe: DatePipe,
    private loaderService: NgxUiLoaderService,
    private localeService: BsLocaleService,
    public notificationService: NotificationService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private excelService: ExcelService,
    private sharedTableStoreService: SharedTableStoreService,
    private commonService: CommonService
  ) {
    super();
    enGbLocale.invalidDate = '';
    defineLocale('custom locale', enGbLocale);
    this.localeService.use('custom locale');

    const snapshot: RouterStateSnapshot = router.routerState.snapshot;
    this.screenId = snapshot.root.queryParams['screenId'];
  }
  ngOnInit() {
    this.getPurchaseOrderOverView();

    this.editSaveForm = this.formBuilder.group({
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
    this.editSaveFormSearch = this.formBuilder.group({
      purchaseOrder: [[], []],
      depot: [[], []],
      poStatus: [[], []],
      poSource: [[], []],
      poFromDate: ['', []],
      poToDate: ['', []],
      rfqFromDate: ['', []],
      rfqToDate: ['', []],
      prNoRfqNoQuoteNo: ['', []],
    });
    this.cancelRemarkForm = this.formBuilder.group({
      remarks: ['', [Validators.required]],
    });
    this.getPOStatuses();
    this.getActiveDepot();
    this.getPOSources();
    this.getPageRights(this.screenId);
    this.currentUserName = this.userAuthService.getCurrentUserName();
    this.currentCompanyId = this.userAuthService.getCurrentCompanyId();
    this.currentUserId = this.userAuthService.getCurrentUserId();
  }

  getPurchaseOrderOverView() {
    this.purchaseOrderService.getPurchaseOrderOverView().subscribe((res) => {
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
  globalDepotId: any;
  getActiveDepot() {
    this.purchaseOrderService
      .getActiveDepot(this.userAuthService.getCurrentUserId())
      .subscribe((res) => {
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

  getPOStatuses() {
    this.purchaseOrderService.getPOStatuses().subscribe((res) => {
      if (res.status === true) {
        this.POStatuses = res.response;
      }
    });
  }
  getPOSources() {
    this.purchaseOrderService.getPOSources().subscribe((res) => {
      if (res.status === true) {
        this.POSources = res.response;
      }
    });
  }
  handleDepotChangeDD(event: any) {

    this.editSaveFormSearch.controls['depot'].setValue(event.city);
  }
  getPRNoByCurrentStatusId(currentStatusId: number, cardNumber: number = 1) {
    this.currentStatusId = currentStatusId;
    this.currentTabStatusId = cardNumber;
    this.changeHeaderColumn(cardNumber);
    this.changeTableTitle(cardNumber);
    this.getServerSideTableList(this.paramsGlobal);
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
  changeTableTitle(cardNumber: any) {
    if (cardNumber == 1) {
      this.tableTitle = 'Overall List';
      this.editSaveFormSearch.controls['poStatus'].setValue({
        code: 'OVERALL',
      });
      this.editSaveFormSearch.controls['poStatus'].enable();
    } else if (cardNumber == 2) {
      this.tableTitle = 'Drafts List';
      this.editSaveFormSearch.controls['poStatus'].setValue({
        code: 'DRAFT',
      });
      this.editSaveFormSearch.controls['poStatus'].disable();
    } else if (cardNumber == 3) {
      this.tableTitle = 'Pending Approval List';
      this.editSaveFormSearch.controls['poStatus'].setValue({
        code: 'PENDING APPROVAL',
      });
      this.editSaveFormSearch.controls['poStatus'].disable();
    } else if (cardNumber == 4) {
      this.tableTitle = 'Approved List';
      this.editSaveFormSearch.controls['poStatus'].setValue({
        code: 'APPROVED',
      });
      this.editSaveFormSearch.controls['poStatus'].disable();
    } else if (cardNumber == 5) {
      this.tableTitle = 'Cancelled List';
      this.editSaveFormSearch.controls['poStatus'].setValue({
        code: 'CANCELLED',
      });
      this.editSaveFormSearch.controls['poStatus'].disable();
    } else if (cardNumber == 6) {
      this.tableTitle = 'Rejected List';
      this.editSaveFormSearch.controls['poStatus'].setValue({
        code: 'REJECTED',
      });
      this.editSaveFormSearch.controls['poStatus'].disable();
    }
    this.purchaseOrderList?.sharedLazyTableNew?.changeTableTitle(
      this.tableTitle
    );
  }
  changeHeaderColumn(cardNumber: number) {

    if (cardNumber == 5) {
      this.showTableByColumn = 2;
    } else if (cardNumber == 6) {
      this.showTableByColumn = 3;
    } else {
      this.showTableByColumn = 1;
    }

    this.purchaseOrderList?.sharedLazyTableNew?.changeHeaderDynamically();
  }
  handleAddRecordIcon(data: any) {
    this.showList = false;
    this.currentTabStatusId = 7;
    this.editSaveForm.reset();
    this.mode = 'new';
    this.editSaveForm.controls['poStatus'].setValue({
      statusCode: 'DRAFT',
      statusId: 578,  // Enum Id => 583 => PO DRAFT  
    });
    this.editSaveForm.controls['poSource'].setValue({
      sourceCode: 'DIRECT',
      sourceId: 577,   // Enum Id => 583 => DIRECT  
    });
    this.currentTabStatusId = 7;
    this.currentStatusId = 583; // Enum Id => 583 => Purchase order OVERALL Status  
    this.enableRights();
    this.purchaseOrderForm?.resetForm();
    this.purchaseOrderForm?.initialFormData();
    this.enableRights();
  }
  receiveSelectedRowData(data: any) {
    this.showList = false;
    this.selectedPoRowData = data;
    this.purchaseOrderIdForPrint = data.purchaseOrderId;
    this.poNumber = data.poNumber;
    this.purchaseOrderService.setSelectedPORowData(data);
    this.mode = 'edit';
    this.currentTabStatusId = 8;
    this.enableRights();
    if ((data.currentStatusId == 578 || this.currentStatusId == 578) && this.mode != "new") {  // Enum Id => 583 => PO DRAFT  
      this.hideSendForApproval = false;
    } else {
      this.hideSendForApproval = true;
    }

    this.selectedDataPONumbers = [data.poNumber];
    this.selectedData = [data.purchaseOrderId];
  }
  receiveSelectedRowFromList(selectedGrid: any) {
    this.selectedRowFromTable = selectedGrid;
    // Use map to extract purchaseorderId from each object
    const purchaseOrderNumbers: string[] = selectedGrid.map(
      (item: any) => item.poNumber
    );
    const purchaseOrderIds: number[] = selectedGrid.map(
      (item: any) => item.purchaseOrderId
    );
    this.selectedDataPONumbers = purchaseOrderNumbers;
    this.selectedData = purchaseOrderIds;
  }
  handleFormNewPOIcon() {
    this.showList = false;

    if (this.editSaveForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.editSaveForm.reset();
          this.mode = 'new';
          this.editSaveForm.controls['poStatus'].setValue({
            statusCode: 'DRAFT',
            statusId: 578,
          });
          this.editSaveForm.controls['poSource'].setValue({
            sourceCode: 'DIRECT',
            sourceId: 577,
          });
          this.currentTabStatusId = 7;
          this.currentStatusId = 583; // Enum Id => 583 => Purchase order OVERALL Status  
          this.enableRights();
          this.purchaseOrderForm?.resetForm();
          this.purchaseOrderForm?.initialFormData();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.editSaveForm.reset();
      this.mode = 'new';
      this.editSaveForm.controls['poStatus'].setValue({
        statusCode: 'DRAFT',
        statusId: 578,
      });
      this.editSaveForm.controls['poSource'].setValue({
        sourceCode: 'DIRECT',
        sourceId: 577,
      });
      this.currentTabStatusId = 7;
      this.currentStatusId = 583; // Enum Id => 583 => Purchase order OVERALL Status  
      this.enableRights();
      this.purchaseOrderForm?.resetForm();
      this.purchaseOrderForm?.initialFormData();
    }
  }
  handleSendForApprovalIcon(event: any) {
    this.approvalRequest = {
      purchaseOrders: [this.selectedPoRowData?.purchaseOrderId],
      poNumbers: [this.selectedPoRowData.poNumber || this.selectedPoRowData?.purchaseOrderNo],
    };

    this.loaderService.start();
    this.purchaseOrderService
      .SendForApproval(this.approvalRequest)
      .subscribe((data: any) => {
        if (data['status'] === true) {
          this.getServerSideTableList(this.paramsGlobal);
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
  handleReopenIcon(event: any) {
    this.reopenPO = {
      purchaseOrders: [this.selectedPoRowData?.purchaseOrderId],
      poNumbers: [this.selectedPoRowData.poNumber || this.selectedPoRowData?.purchaseOrderNo],
    };

    this.loaderService.start();
    this.purchaseOrderService.ReopenPO(this.reopenPO).subscribe((data: any) => {
      if (data['status'] === true) {

        this.getServerSideTableList(this.paramsGlobal);
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
  handleBackToList() {
    if (this.editSaveForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.editSaveForm.reset();
          this.showList = true;
          this.mode = 'new';
          this.enableRights();
          this.currentTabStatusId = 1;
          this.getPRNoByCurrentStatusId(583, 1); // Enum Id => 583 => Purchase order OVERALL Status  
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.editSaveForm.reset();
      this.mode = 'new';
      this.showList = true;
      this.enableRights();
      this.currentTabStatusId = 1;
      this.getPRNoByCurrentStatusId(583, 1); // Enum Id => 583 => Purchase order OVERALL Status  
    }
  }
  handleFormSubmit() {
    const addNewPartForm = this.purchaseOrderForm?.partDetailsComponent?.addPartDetailsModel?.addPartDetailsEditForm;
    const termsAndConditionForm = this.purchaseOrderForm?.termsAndCondition?.editSaveFormSearch;
    const termsAndConditionForm1 = this.purchaseOrderForm?.termsAndCondition?.unSavedChanges;
    const additionalChargesForm = this.purchaseOrderForm?.additionalCharges?.addPartDetailsEditForm;
    const additionalChargesForm1 = this.purchaseOrderForm?.additionalCharges?.unSavedChanges;

    if (this.editSaveForm.invalid) {
      this.validateAllFormFields(this.editSaveForm);
      return;
    } else {
      if (this.editSaveForm.dirty && this.editSaveForm.touched || additionalChargesForm?.dirty && additionalChargesForm?.touched || addNewPartForm?.dirty || termsAndConditionForm?.dirty || additionalChargesForm1 || termsAndConditionForm1) {
        if (this.purchaseOrderForm?.partDetailsData?.length) {
          this.constructTermsAndConditionObject(
            this.editSaveForm.getRawValue()
          );
          if (this.mode === 'new') {
            this.editSaveForm.markAsDirty();
            this.loaderService.start();
            this.purchaseOrderService
              .createPurchaseOrder(this.purchaseOrder)
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
                  data.response["poNumber"] = data.response['purchaseOrderNo']
                  this.selectedPoRowData = data.response;
                  this.mode = 'edit';
                  this.poNumber = data.response.purchaseOrderNo;
                  this.purchaseOrderFormComponent.getPurchaseOrderPartsListFn();
                  this.purchaseOrderForm?.partDetailsData?.editSavePartDetailsForm.controls[
                    'poNumber'
                  ].setValue(this.poNumber);
                  this.getServerSideTableList(this.paramsGlobal);
                  this.selectedPoId = data?.response?.purchaseOrderId;
                  this.getAdditionalServiceList(data?.response?.purchaseOrderId)
                  this.enableRights();
                  this.editSaveForm.markAsPristine();
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
          } else {
            // for update
            this.purchaseOrderService
              .updatePurchaseOrder(this.purchaseOrder)
              .subscribe((data) => {

                if (data['status'] === true) {
                  this.enableRights();

                  this.selectedPoRowData = data.response;
                  this.editSaveForm.controls['depot'].setValue({
                    depotId: this.selectedPoRowData.depotId,
                    depotCode: this.selectedPoRowData.depotCode,
                  });
                  this.getServerSideTableList(this.paramsGlobal);
                  this.getAdditionalServiceList(data?.response?.purchaseOrderId)
                  this.selectedPoId = data?.response?.purchaseOrderId;

                  // this.resetForm();
                  this.notificationService.smallBox({
                    severity: 'success',
                    title: this.translate.instant(
                      'common.notificationTitle.success'
                    ),
                    content: data['message'],
                    timeout: 5000,
                    icon: 'fa fa-check',
                  });
                  this.mode = 'edit';

                  this.editSaveForm.markAsPristine();
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

        } else {
          this.notificationService.smallBox({
            title: this.translate.instant('common.notificationTitle.error'),
            content: this.translate.instant(
              'operations.purchaseOrder.errors.atLeastOnePart'
            ),
            severity: 'error',
            timeout: 5000,
            icon: 'fa fa-times',
          });
        }

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
    this.enableRights();
  }
  constructTermsAndConditionObject(formData: any) {

    const partDetails = this.purchaseOrderForm?.partDetailsData?.map(
      (item: any) => {

        return {
          purchaseOrderId: item.purchaseOrderId,
          partTypeId: item.partTypeId,
          partId: item.partId,
          stockUOMId: item.stockUomId,
          pOQuantity: item.poQuantity,
          totalCost: item.totalCost,
          deliveryDate: item.deliveryDate,
          partRate: item.partRate,
          pRId: item.prNo,
          createdBy: this.userAuthService.getCurrentUserName(),
          modifiedBy: this.userAuthService.getCurrentUserName(),
        };
      }
    );

    const termsAndConditionsData =
      this.purchaseOrderForm?.termsAndConditionsData?.map((item: any) => {
        return {
          purchaseOrderId: item.purchaseOrderId || this.selectedPoRowData?.purchaseOrderId,
          termsAndConditionId: item.tACId,
          createdBy: this.userAuthService.getCurrentUserName(),
          modifiedBy: this.userAuthService.getCurrentUserName(),
          purchaseOrderTermsAndConditionId: item.purchaseOrderTermsAndConditionId,
        };
      });
    const additionalChargesData =
      this.purchaseOrderForm?.additionalChargesData?.map((item: any) => {
        return {
          additionalServiceId: item.chargesId || item.additionalServiceId,
          purchaseOrderId: item.purchaseOrderId || this.selectedPoRowData?.purchaseOrderId,
          purchaseOrderAddittionalServiceId: item.purchaseOrderAddittionalServiceId,
          value: item.value,
          createdBy: this.userAuthService.getCurrentUserName(),
          modifiedBy: this.userAuthService.getCurrentUserName(),
        };
      });
    if (this.mode === 'new') {
      this.purchaseOrder = {
        companyId: 1,
        purchaseOrderId: 0,
        //poNumber: formData.poNumber, // check field weather need or not
        pODate: formData.poDate,
        depotId: formData.depot.depotId,
        currentStatusId: formData.poStatus.statusId,
        pOSourceId: formData.poSource.sourceId,
        supplierId: formData.supplier.supplierId,
        remarks: formData.remarks,
        purchaseOrderPartDetails: partDetails,
        totalPOSupplierCurrency:
          this.purchaseOrderForm?.editSavePartDetailsForm?.controls[
            'totalPOAmount'
          ]?.value,
        totalPoAmount:
          this.purchaseOrderForm?.editSavePartDetailsForm?.controls[
            'totPOAmtInSuppCur'
          ]?.value,
        purchaseOrderAdditionalServices: additionalChargesData,
        purchaseOrderTermsAndConditions: termsAndConditionsData,
        createdBy: this.userAuthService.getCurrentUserName(),
        modifiedBy: this.userAuthService.getCurrentUserName(),
      };

    } else {

      const updatedPartDetails = this.purchaseOrderForm?.partDetailsComponent?.purchaseOrderPartsList?.map(
        (item: any) => {
          return {
            purchaseOrderPartDetailId: item.purchaseOrderPartDetailId,
            partTypeId: item.partTypeId,
            partId: item.partId,
            stockUOMId: item.stockUomId,
            pOQuantity: item.poQuantity,
            totalCost: item.totalCost,
            deliveryDate: item.deliveryDate,
            partRate: item.partRate,
            pRId: item.prNo,
            created: item.created,
            modified: item.modified,
            purchaseOrderId: item.purchaseOrderId,
            createdBy: this.userAuthService.getCurrentUserName(),
            modifiedBy: this.userAuthService.getCurrentUserName(),
          };
        }
      );
      // const updatedPartDetails = this.purchaseOrderForm?.partDetailsComponent?.purchaseOrderPartsList

      const currentDate: Date = new Date();
      const formattedDate: string = currentDate.toISOString();
      this.purchaseOrder = {
        companyId: 1,
        purchaseOrderNo: this.selectedPoRowData?.poNumber || this.selectedPoRowData?.purchaseOrderNo,
        purchaseOrderId: this.selectedPoRowData?.purchaseOrderId || 0,
        pODate: formData.poDate,
        depotId: formData.depot.depotId,
        currentStatusId: formData.poStatus.statusId,
        pOSourceId: formData.poSource.sourceId,
        supplierId: formData.supplier.supplierId,
        remarks: formData.remarks,
        purchaseOrderPartDetails: updatedPartDetails,
        purchaseOrderAdditionalServices: additionalChargesData,
        purchaseOrderTermsAndConditions: termsAndConditionsData,
        totalPOSupplierCurrency:
          this.purchaseOrderForm?.editSavePartDetailsForm?.controls[
            'totPOAmtInSuppCur'
          ]?.value,
        totalPoAmount:
          this.purchaseOrderForm?.editSavePartDetailsForm?.controls[
            'totalPOAmount'
          ]?.value,
        created: this.selectedPoRowData?.created,
        modified: this.selectedPoRowData?.modified,
        createdBy: this.userAuthService.getCurrentUserName(),
        modifiedBy: this.userAuthService.getCurrentUserName(),
      };

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
  handleFormPrintIcon() {
    const poId = [this.purchaseOrderIdForPrint];
    this.loaderService.start();
    this.purchaseOrderService
      .getPurchaseOrderOutput(poId)
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

  handleCancelIcon(event: any) {
    if (
      (this.selectedRowFromTable?.length <= 0 ||
        this.selectedRowFromTable == undefined) &&
      event == 'icon'
    ) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.purchaseOrder.errors.atLeastOneSelectedForCancel'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    } else {

      const invalidStatus = this.selectedDataList.some(
        (item: { currentStatusId: number }) =>
          item.currentStatusId !== 578 && item.currentStatusId !== 579
      );

      if (invalidStatus) {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant(
            'operations.purchaseOrder.errors.cancelActionValidForDraftAndPending'
          ),
          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
      } else {
        this.cancelPopup.show();
      }
    }
  }

  handleCancelPOSuccess(event: any) {
    this.getPurchaseOrderOverView();
    this.getServerSideTableList(this.paramsGlobal);
  }

  get editSaveFormSearchControls() {
    return this.editSaveFormSearch.controls;
  }
  resetForm() {
    // throw new Error('Method not implemented.');
    this.submitted = false;
    this.editSaveFormSearch.reset();
  }
  searchRecordsList() {
    this.clickedSearchBtn = true;
    this.getServerSideTableList(this.paramsGlobal);
    this.submittedSearch = true;
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
  getServerSideTableList(params: any): void {

    this.paramsGlobal = params;
    const formValues = this.editSaveFormSearch.getRawValue();
    let poDate = this.purchaseOrderList?.tableFilterFormGroup.value.poDate
      ? this.purchaseOrderList?.tableFilterFormGroup.value.poDate
      : '';
    this.serverSideProcessing = {
      ...params,
      CurrentPage: params?.first || 0,
      GlobalFilter:
        params?.globalFilter != undefined
          ? params?.globalFilter
          : this.purchaseOrderList != undefined
            ? this.purchaseOrderList?.sharedLazyTableNew?.globalFilter.value
            : null,
      PageSize: params?.rows,
      SortField: params.sortField ? params.sortField : 'sortOnly',
      SortOrder: params.sortField
        ? params.sortOrder
          ? params.sortOrder
          : -1
        : -1,
      poNumber: this.purchaseOrderList?.tableFilterFormGroup.value.poNumber
        ? this.purchaseOrderList?.tableFilterFormGroup.value.poNumber
        : '',
      poDate: poDate,
      poSource: this.purchaseOrderList?.tableFilterFormGroup.value.poSource
        ? this.purchaseOrderList?.tableFilterFormGroup.value.poSource
        : '',
      poStatus: this.purchaseOrderList?.tableFilterFormGroup.value.poStatus
        ? this.purchaseOrderList?.tableFilterFormGroup.value.poStatus
        : '',
      supplierCode: this.purchaseOrderList?.tableFilterFormGroup.value
        .supplierCode
        ? this.purchaseOrderList?.tableFilterFormGroup.value.supplierCode
        : '',
      supplierName: this.purchaseOrderList?.tableFilterFormGroup.value
        .supplierName
        ? this.purchaseOrderList?.tableFilterFormGroup.value.supplierName
        : '',
      city: this.purchaseOrderList?.tableFilterFormGroup.value.city
        ? this.purchaseOrderList?.tableFilterFormGroup.value.city
        : '',
      rfqNo: this.purchaseOrderList?.tableFilterFormGroup.value.rfqNo
        ? this.purchaseOrderList?.tableFilterFormGroup.value.rfqNo
        : '',
      prNo: this.purchaseOrderList?.tableFilterFormGroup.value.prNo
        ? this.purchaseOrderList?.tableFilterFormGroup.value.prNo
        : '',
      quoteNo: this.purchaseOrderList?.tableFilterFormGroup.value.quoteNo
        ? this.purchaseOrderList?.tableFilterFormGroup.value.quoteNo
        : '',
      depot: this.purchaseOrderList?.tableFilterFormGroup.value.depot
        ? this.purchaseOrderList?.tableFilterFormGroup.value.depot
        : '',
      supplierCurrency: this.purchaseOrderList?.tableFilterFormGroup.value
        .supplierCurrency
        ? this.purchaseOrderList?.tableFilterFormGroup.value.supplierCurrency
        : '',
      poValueInSupplierCurrency: this.purchaseOrderList?.tableFilterFormGroup
        .value.poValueInSupplierCurrency
        ? this.purchaseOrderList?.tableFilterFormGroup.value
          .poValueInSupplierCurrency
        : '',
      poValueInDepotCurrency: this.purchaseOrderList?.tableFilterFormGroup.value
        .poValueInDepotCurrency
        ? this.purchaseOrderList?.tableFilterFormGroup.value
          .poValueInDepotCurrency
        : '',
      lastModifiedBy: this.purchaseOrderList?.tableFilterFormGroup.value
        .modifiedBy
        ? this.purchaseOrderList?.tableFilterFormGroup.value.modifiedBy
        : '',
      lastModifiedDate: this.purchaseOrderList?.tableFilterFormGroup.value
        .ModifiedDate
        ? this.purchaseOrderList?.tableFilterFormGroup.value.ModifiedDate
        : '',
      rejectionRemarks: this.purchaseOrderList?.tableFilterFormGroup.value
        .rejectionRemarks
        ? this.purchaseOrderList?.tableFilterFormGroup.value.rejectionRemarks
        : '',
      cancellationRemarks: this.purchaseOrderList?.tableFilterFormGroup.value
        .cancellationRemarks
        ? this.purchaseOrderList?.tableFilterFormGroup.value.cancellationRemarks
        : '',
      searchDepot: [13, 1],
      // searchDepot: formValues?.depot?.depotId || 0,
      searchPurchaseOrder: formValues?.purchaseOrder?.poNumber || '',
      searchPoStatus: this.currentStatusId || 0,
      searchPoSource: formValues?.poSource.enumId || 0,
      searchPrNoRfqNoQuoteNo: formValues?.prNoRfqNoQuoteNo || '',
      searchPoFromDate: formValues?.poFromDate
        ? this.formatDate(formValues.poFromDate)
        : '',
      searchPoToDate: formValues?.poToDate
        ? this.formatDate(formValues.poToDate)
        : '',
      searchRfqFromDate: formValues?.rfqFromDate
        ? this.formatDate(formValues.rfqFromDate)
        : '',
      searchRfqToDate: formValues?.rfqToDate
        ? this.formatDate(formValues.rfqToDate)
        : '',
    };

    this.searchPurchaseOrder(this.serverSideProcessing);
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
    let poDate = this.purchaseOrderList?.tableFilterFormGroup.value.poDate
      ? this.purchaseOrderList?.tableFilterFormGroup.value.poDate
      : '';

    let serverSideProcessing = {
      ...params,
      CurrentPage: params?.first || 0,
      GlobalFilter:
        params?.globalFilter != undefined
          ? params?.globalFilter
          : this.purchaseOrderList != undefined
            ? this.purchaseOrderList?.sharedLazyTableNew?.globalFilter.value
            : null,
      PageSize: params?.rows,
      SortField: params.sortField ? params.sortField : 'sortOnly',
      SortOrder: params.sortField
        ? params.sortOrder
          ? params.sortOrder
          : -1
        : -1,
      poNumber: this.purchaseOrderList?.tableFilterFormGroup.value.poNumber
        ? this.purchaseOrderList?.tableFilterFormGroup.value.poNumber
        : '',
      poDate: poDate,
      poSource: this.purchaseOrderList?.tableFilterFormGroup.value.poSource
        ? this.purchaseOrderList?.tableFilterFormGroup.value.poSource
        : '',
      poStatus: this.purchaseOrderList?.tableFilterFormGroup.value.poStatus
        ? this.purchaseOrderList?.tableFilterFormGroup.value.poStatus
        : '',
      supplierCode: this.purchaseOrderList?.tableFilterFormGroup.value
        .supplierCode
        ? this.purchaseOrderList?.tableFilterFormGroup.value.supplierCode
        : '',
      supplierName: this.purchaseOrderList?.tableFilterFormGroup.value
        .supplierName
        ? this.purchaseOrderList?.tableFilterFormGroup.value.supplierName
        : '',
      city: this.purchaseOrderList?.tableFilterFormGroup.value.city
        ? this.purchaseOrderList?.tableFilterFormGroup.value.city
        : '',
      rfqNo: this.purchaseOrderList?.tableFilterFormGroup.value.rfqNo
        ? this.purchaseOrderList?.tableFilterFormGroup.value.rfqNo
        : '',
      prNo: this.purchaseOrderList?.tableFilterFormGroup.value.prNo
        ? this.purchaseOrderList?.tableFilterFormGroup.value.prNo
        : '',
      quoteNo: this.purchaseOrderList?.tableFilterFormGroup.value.quoteNo
        ? this.purchaseOrderList?.tableFilterFormGroup.value.quoteNo
        : '',
      depot: this.purchaseOrderList?.tableFilterFormGroup.value.depot
        ? this.purchaseOrderList?.tableFilterFormGroup.value.depot
        : '',
      supplierCurrency: this.purchaseOrderList?.tableFilterFormGroup.value
        .supplierCurrency
        ? this.purchaseOrderList?.tableFilterFormGroup.value.supplierCurrency
        : '',
      poValueInSupplierCurrency: this.purchaseOrderList?.tableFilterFormGroup
        .value.poValueInSupplierCurrency
        ? this.purchaseOrderList?.tableFilterFormGroup.value
          .poValueInSupplierCurrency
        : '',
      poValueInDepotCurrency: this.purchaseOrderList?.tableFilterFormGroup.value
        .poValueInDepotCurrency
        ? this.purchaseOrderList?.tableFilterFormGroup.value
          .poValueInDepotCurrency
        : '',
      lastModifiedBy: this.purchaseOrderList?.tableFilterFormGroup.value
        .modifiedBy
        ? this.purchaseOrderList?.tableFilterFormGroup.value.modifiedBy
        : '',
      lastModifiedDate: this.purchaseOrderList?.tableFilterFormGroup.value
        .ModifiedDate
        ? this.purchaseOrderList?.tableFilterFormGroup.value.ModifiedDate
        : '',
      rejectionRemarks: this.purchaseOrderList?.tableFilterFormGroup.value
        .rejectionRemarks
        ? this.purchaseOrderList?.tableFilterFormGroup.value.rejectionRemarks
        : '',
      cancellationRemarks: this.purchaseOrderList?.tableFilterFormGroup.value
        .cancellationRemarks
        ? this.purchaseOrderList?.tableFilterFormGroup.value.cancellationRemarks
        : '',
      searchDepot: formValues?.depot?.depotId || 0,
      searchPurchaseOrder: formValues?.purchaseOrder?.poNumber || '',
      searchPoStatus: this.currentStatusId || 0,
      searchPoSource: formValues?.poSource.enumId || 0,
      searchPrNoRfqNoQuoteNo: formValues?.prNoRfqNoQuoteNo || '',
      searchPoFromDate: formValues?.poFromDate
        ? this.formatDate(formValues.poFromDate)
        : '',
      searchPoToDate: formValues?.poToDate
        ? this.formatDate(formValues.poToDate)
        : '',
      searchRfqFromDate: formValues?.rfqFromDate
        ? this.formatDate(formValues.rfqFromDate)
        : '',
      searchRfqToDate: formValues?.rfqToDate
        ? this.formatDate(formValues.rfqToDate)
        : '',
      // searchStatus: this.CurrentStatusId,
    };

    this.loaderService.start();
    this.purchaseOrderService
      .getPurchaseOrderListServerSide(
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
            'Purchase Order List',
            false
          );
        }

        this.loaderService.stop();
      });
  }
  searchPurchaseOrder(params: any) {


    this.loaderService.start();
    this.purchaseOrderService
      .getPurchaseOrderListServerSide(
        params,
        this.userAuthService.getCurrentCompanyId(),
        this.userAuthService.getCurrentUserId()
      )
      .subscribe((data: any) => {
        if (data.status === true) {
          this.selectedDataList = [];
          this.purchaseOrderDropDownList = data.response?.purchaseOrderFullRecord;
          this.totalDataGridCountComp = data['response'].filterRecordCount;
          this.sharedTableStoreService.setAssignGridData({ data, params });
        }
      });
    this.loaderService.stop();
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

  dropdownDepotSearchFnPurchaseOrder(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['poNumber'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['poNumber'].toLocaleLowerCase() === term
    );
  }
  dropdownDepotSearchFnDepot(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['depotCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotCode'].toLocaleLowerCase() === term ||
      item['depotName'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotName'].toLocaleLowerCase() === term
    );
  }
  dropdownDepotSearchFnPoStatus(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['code'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['code'].toLocaleLowerCase() === term
    );
  }
  dropdownDepotSearchFnPoSource(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['code'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['code'].toLocaleLowerCase() === term
    );
  }


  validatePeriod(controlName: string, event: any) {

    this.currentDate = new Date();


    const selectedDate = new Date(this.formatDate(event));

    if (selectedDate > this.currentDate) {

      this.fromGreaterThanCurrent = true;
      this.fromGreaterThanTo = false;

      if (controlName === 'poFromDate') {
        this.editSaveFormSearch.controls['poFromDate'].setErrors({
          greaterThanCurrentDateError: true,
        });
      }
      if (controlName === 'poToDate') {
        this.editSaveFormSearch.controls['poToDate'].setErrors({
          greaterThanCurrentDateError: true,
        });
      }

      this.toLesserThanCurrent = true;
      this.toLesserThanFrom = false;
    } else {


      if (controlName === 'poFromDate') {
        this.editSaveFormSearch.controls['poFromDate'].setErrors(null);
      }
      if (controlName === 'poToDate') {
        this.editSaveFormSearch.controls['poToDate'].setErrors(null);
      }

      let fromPo = this.editSaveFormSearch.controls['poFromDate'].value;
      let toPo = this.editSaveFormSearch.controls['poToDate'].value;



      let convertedPoToDte = new Date(this.formatDate(fromPo));
      let convertedPoFromDte = new Date(this.formatDate(toPo));

      if (convertedPoToDte && convertedPoFromDte) {

        if (convertedPoFromDte < convertedPoToDte) {
          if (controlName === 'poFromDate') {
            this.editSaveFormSearch.controls['poFromDate'].setErrors({
              customErr: true,
            });
          }
          if (controlName === 'poToDate') {
            this.editSaveFormSearch.controls['poToDate'].setErrors({
              customErr: true,
            });
          }
        }
        else {
          this.editSaveFormSearch.controls['poToDate'].setErrors(null);
          this.editSaveFormSearch.controls['poFromDate'].setErrors(null);;
        }
      }
    }
    if (isNaN(selectedDate.getTime())) {
      this.editSaveFormSearch.controls[controlName].setErrors({
        invalid: true,
      });
    }
  }


  validatePeriodRFQ(controlName: string, event: any) {
    this.currentDate = new Date();
    let fromPr = this.editSaveFormSearch.controls['rfqFromDate'].value;
    let toPr = this.editSaveFormSearch.controls['rfqToDate'].value;
    const fromPrFormatted = this.formatDate(fromPr);
    const toPrFormatted = this.formatDate(toPr);

    if (controlName === 'rfqFromDate') {
      const selectedDate = new Date(this.formatDate(event));

      if (selectedDate > this.currentDate) {
        this.fromGreaterThanCurrent = true;
        this.fromGreaterThanTo = false;
        this.editSaveFormSearch.controls['rfqFromDate'].setErrors({
          customError: true,
        });
      } else {
        this.fromGreaterThanCurrent = false;
        this.editSaveFormSearch.controls['rfqFromDate'].setErrors(null);

        if (toPr && fromPrFormatted < toPrFormatted) {
          this.fromGreaterThanTo = true;
          this.fromGreaterThanCurrent = false;
          this.toLesserThanCurrent = false;
          this.editSaveFormSearch.controls['rfqFromDate'].setErrors({
            customErrorDates: true,
          });
        } else {
          this.fromGreaterThanTo = false;
          this.editSaveFormSearch.controls['rfqFromDate'].setErrors(null);
        }
      }

      // Set error for invalid date
      if (isNaN(selectedDate.getTime())) {
        this.editSaveFormSearch.controls['rfqFromDate'].setErrors({
          invalid: true,
        });
      }
    } else if (controlName === 'rfqToDate') {
      const selectedDate = new Date(this.formatDate(event));

      if (selectedDate > this.currentDate) {
        this.editSaveFormSearch.controls['rfqToDate'].setErrors({
          customErrorTo: true,
        });
        this.toLesserThanCurrent = true;
        this.toLesserThanFrom = false;
      } else {
        this.toLesserThanCurrent = false;
        this.editSaveFormSearch.controls['rfqToDate'].setErrors(null);

        if (fromPr && fromPrFormatted > toPrFormatted) {

          this.fromGreaterThanTo = true;
          this.toLesserThanCurrent = false;
          this.fromGreaterThanCurrent = false;
          this.editSaveFormSearch.controls['rfqToDate'].setErrors({
            customErrorDate: true,
          });
        } else {
          this.fromGreaterThanTo = false;
          this.editSaveFormSearch.controls['rfqToDate'].setErrors(null);
        }
      }

      // Set error for invalid date
      if (isNaN(selectedDate.getTime())) {
        this.editSaveFormSearch.controls['rfqToDate'].setErrors({
          invalid: true,
        });
      }
    }
  }
  // Cancel PO popup
  cancelPopupClose() {
    if (this.cancelRemarkForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.cancelRemarkForm.reset();
          this.cancelPopup.hide();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.cancelRemarkForm.reset();
      this.cancelPopup.hide();
    }
  }
  handleRemarkFormClear() {
    this.cancelRemarkForm.reset();
  }
  handleFormCancelPRAction() {
    if (this.cancelRemarkForm.invalid) {
      this.validateAllFormFields(this.cancelRemarkForm);
      return;
    }
    const remarks = this.cancelRemarkForm.controls['remarks'].value;

    this.loaderService.start();
    const payload = {
      purchaseOrder: this.selectedData,
      pONumbers: this.selectedDataPONumbers,
      remarks: remarks,
      cancelledBy: this.userAuthService.getCurrentUserName(),
      cancelledOn: new Date(),
    };
    this.purchaseOrderService.cancelPR(payload).subscribe((data: any) => {
      if (data['status'] === true) {
        this.selectedDataPONumbers = [];
        this.cancelRemarkForm.reset();
        this.handleCancelPOSuccess(true);
        this.cancelPopup.hide();
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
  disableAllIcons() {
    this.disableAddNewIcons = true;
    this.disableSendForApprovalIcons = true;
    this.disableCancelPOIcons = true;
    this.disableReopenIcons = true;
    this.disablePrintPOIcons = true;
    this.disableEmailPOIcons = true;

    this.disableFormPrintPOIcons = true;
    this.disableFormCancelPOIcons = true;
    this.disableFormSendForApprovalIcons = true;
    this.disableFormAddNewIcons = true;
    this.disableFormSubmitIcons = true;
    this.disableFormResetIcons = true;
  }

  enableRights() {

    this.poFormEnableRights = {
      editBit: this.editBit,
      createBit: this.createBit,
      viewBit: this.viewBit,
    };
    this.purchaseOrderForm?.initialEnableRights({
      editBit: this.editBit,
      createBit: this.createBit,
      viewBit: this.viewBit,
    });

    if (!this.editBit && !this.createBit && this.viewBit) {
      // only view
      if (this.mode == 'new') {
        this.showWarningMessageForRoleRights = true;
        this.warningMessageForRoleRights = 'common.roleRightsMessages.create';
        this.showWarningMessageForRoleRightsForm = true;
        this.warningMessageForRoleRightsForm =
          'common.roleRightsMessages.create';
        this.mode = 'view';
        this.disableFormAddNewIcons = true;
        this.disableFormSubmitIcons = false;
        this.editSaveForm.disable();

        this.disableAllIcons();
        if (this.currentTabStatusId == 1) {
          //overall
        } else if (this.currentTabStatusId == 2) {
          //draft

          this.disableAddNewIcons = true;
          this.disableSendForApprovalIcons = true;
          this.disableCancelPOIcons = true;
        } else if (this.currentTabStatusId == 3) {
          //pending approval
          this.disableCancelPOIcons = true;
          this.disablePrintPOIcons = true;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disablePrintPOIcons = true;
          this.disableEmailPOIcons = true;
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableReopenIcons = true;
          this.disablePrintPOIcons = false;
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disableAddNewIcons = true;
          this.disableCancelPOIcons = true;
          this.disablePrintPOIcons = false;
        } else if (this.currentTabStatusId == 7) {
          // create
          this.showWarningMessageForRoleRightsForm = true;
          this.warningMessageForRoleRightsForm =
            'common.roleRightsMessages.edit';

          this.disableFormAddNewIcons = true;
          this.disableFormSubmitIcons = true;
        } else {
        }
      } else {
        this.showWarningMessageForRoleRightsForm = true;
        this.warningMessageForRoleRightsForm = 'common.roleRightsMessages.edit';
        this.mode = 'view';
        this.disableFormAddNewIcons = true;
        this.disableFormSubmitIcons = true;
        this.disableAllIcons();

        if (this.currentTabStatusId == 1) {
          //overall
          this.disableFormAddNewIcons = true;

          this.disableFormCancelPOIcons = true;
          this.disableFormSubmitIcons = true;

          this.disableFormPrintPOIcons = false;
          this.disableFormEmailPOIcons = false;
        } else if (this.currentTabStatusId == 2) {
          //draft

          this.disableFormPrintPOIcons = true;
          this.disableFormCancelPOIcons = true;
          this.disableFormSendForApprovalIcons = true;
          this.disableFormAddNewIcons = true;
          this.disableFormSubmitIcons = true;
          this.disableFormResetIcons = true;
        } else if (this.currentTabStatusId == 3) {
          //pending approval

          this.disableFormCancelPOIcons = true;
          this.disableFormAddNewIcons = true;
          this.disableFormPrintPOIcons = false;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disableFormPrintPOIcons = true;
          this.disableFormCancelPOIcons = true;
          this.disableFormSubmitIcons = true;
          this.disableFormEmailPOIcons = true;
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableFormPrintPOIcons = true;
          this.disableFormPrintPOIcons = true;
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disableFormPrintPOIcons = true;
          this.disableFormCancelPOIcons = true;
        } else if (this.currentTabStatusId == 7) {
          // create

          this.disableFormPrintPOIcons = true;
          this.disableFormCancelPOIcons = true;
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
        this.disableFormAddNewIcons = true;
        this.disableFormSubmitIcons = false;
        this.editSaveForm.disable();

        if (this.currentTabStatusId == 1) {
          //overall
          this.disableAddNewIcons = true;
          this.disablePrintPOIcons = false;
          this.disableEmailPOIcons = false;
        } else if (this.currentTabStatusId == 2) {
          //draft
          this.disableAddNewIcons = true;

          this.disablePrintPOIcons = false;
          this.disableSendForApprovalIcons = false;
          this.disableCancelPOIcons = false;
        } else if (this.currentTabStatusId == 3) {
          //pending approval
          this.disableAddNewIcons = true;

          this.disableCancelPOIcons = false;
          this.disablePrintPOIcons = false;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disablePrintPOIcons = false;
          this.disableEmailPOIcons = false;
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableReopenIcons = false;
          this.disablePrintPOIcons = false;
          this.disableEmailPOIcons = false;
          this.disableFormSubmitIcons = true;
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disablePrintPOIcons = false;
          this.disableCancelPOIcons = false;
          this.disableFormAddNewIcons = true;
        } else if (this.currentTabStatusId == 7) {
          // create
          this.disableFormAddNewIcons = true;
          this.disableFormSubmitIcons = true;
          this.disableFormPrintPOIcons = true;
          this.disableFormCancelPOIcons = true;
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
        this.disableFormAddNewIcons = true;
        this.disableFormSubmitIcons = false;
        this.editSaveForm.enable();

        if (this.currentTabStatusId == 1) {
          //overall
          this.disableFormAddNewIcons = true;
          this.disableFormPrintPOIcons = false;
          this.disableFormCancelPOIcons = false;
          this.disableFormSendForApprovalIcons = false;
          this.disableFormSubmitIcons = false;
          this.disableFormResetIcons = false;
        } else if (this.currentTabStatusId == 2) {
          //draft
          this.disableFormAddNewIcons = true;

          this.disableFormPrintPOIcons = false;
          this.disableFormCancelPOIcons = false;
          this.disableFormSendForApprovalIcons = false;
          this.disableFormSubmitIcons = false;
          this.disableFormResetIcons = false;
        } else if (this.currentTabStatusId == 3) {
          //pending approval

          this.disableFormCancelPOIcons = false;
          this.disableFormPrintPOIcons = false;
          this.disableFormAddNewIcons = true;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disableFormPrintPOIcons = false;
          this.disableFormEmailPOIcons = false;
          this.disableFormSubmitIcons = true;
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableFormPrintPOIcons = false;
          this.disableFormPrintPOIcons = false;
          this.disableFormEmailPOIcons = false;
          this.editSaveForm.disable();
          this.disableFormSubmitIcons = true;
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disableFormPrintPOIcons = false;
          this.disableFormCancelPOIcons = false;
          this.editSaveForm.disable();
          this.disableFormSubmitIcons = true;
        } else if (this.currentTabStatusId == 7) {
          // create
          this.warningMessageForRoleRightsForm =
            'common.roleRightsMessages.create';
          this.mode = 'edit';
          this.disableFormAddNewIcons = false;
          this.disableFormSubmitIcons = false;
          this.disableFormPrintPOIcons = false;
          this.disableFormCancelPOIcons = false;
          this.disableFormResetIcons = false;
          this.disableFormSendForApprovalIcons = false;
        } else if (this.currentTabStatusId == 8) {
          // update
          this.warningMessageForRoleRightsForm =
            'common.roleRightsMessages.create';
          this.disableFormAddNewIcons = true;

          this.disableFormPrintPOIcons = false;
          this.disableFormCancelPOIcons = false;
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
        this.disableAddNewIcons = false;
        this.disableFormAddNewIcons = false;
        this.disableFormSubmitIcons = false;
        this.showWarningMessageForRoleRights = false;
        this.warningMessageForRoleRights = '';
        this.editSaveForm.enable();

        //common
        this.disableAddNewIcons = false;
        this.disablePrintPOIcons = false;
        this.disableEmailPOIcons = false;

        if (this.currentTabStatusId == 1) {
          //overall
          this.disableCancelPOIcons = true;
        } else if (this.currentTabStatusId == 2) {
          //draft
          this.disableAddNewIcons = false;
          this.disablePrintPOIcons = false;
          this.disableSendForApprovalIcons = false;
          this.disableCancelPOIcons = true;
        } else if (this.currentTabStatusId == 3) {
          //pending approval
          this.disableAddNewIcons = false;
          this.disableCancelPOIcons = false;
          this.disablePrintPOIcons = false;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disablePrintPOIcons = false;
          this.disableEmailPOIcons = false;
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableReopenIcons = false;
          this.disablePrintPOIcons = false;
          this.disableEmailPOIcons = false;
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disablePrintPOIcons = false;
          this.disableCancelPOIcons = false;
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

        this.disableFormAddNewIcons = false;
        this.disableFormSubmitIcons = true;
        this.disableFormAddNewIcons = false;

        this.editSaveForm.disable();
        if (this.currentTabStatusId == 1) {
          //overall
          this.disableFormAddNewIcons = false;
          this.disableFormPrintPOIcons = false;
          this.disableFormEmailPOIcons = false;
          this.disableFormCancelPOIcons = true;
        } else if (this.currentTabStatusId == 2) {
          //draft
          this.disableFormAddNewIcons = false;
          this.disableFormPrintPOIcons = false;
          this.disableFormSendForApprovalIcons = false;
          this.disableFormResetIcons = false;
          this.disableFormCancelPOIcons = true;
        } else if (this.currentTabStatusId == 3) {
          //pending approval

          this.disableFormCancelPOIcons = false;
          this.disableFormPrintPOIcons = false;
          this.disableFormAddNewIcons = false;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.mode = 'edit';

          this.disableFormPrintPOIcons = false;
          this.disableFormEmailPOIcons = false;
          this.disableFormReopenIcons = false;
          this.editSaveForm.disable();
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.mode = 'edit';

          this.disableFormPrintPOIcons = false;
          this.disableFormEmailPOIcons = false;
          this.editSaveForm.disable();
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disableFormPrintPOIcons = false;
          this.disableFormCancelPOIcons = false;
          this.editSaveForm.disable();
        } else if (this.currentTabStatusId == 7) {
          // create
          this.mode = 'new';
          this.disableFormAddNewIcons = false;
          this.disableFormSubmitIcons = false;
          this.disableFormResetIcons = false;
          this.disableFormPrintPOIcons = true;
          this.disableFormCancelPOIcons = true;
        } else if (this.currentTabStatusId == 8) {
          // update
          this.warningMessageForRoleRightsForm =
            'common.roleRightsMessages.edit';
          this.disableFormAddNewIcons = false;
          this.disableFormSubmitIcons = true;
          this.disableFormSendForApprovalIcons = true;

          this.disableFormPrintPOIcons = false;
          this.disableFormCancelPOIcons = false;
          this.disableFormResetIcons = false;
        }
      }
    }
  }
}
