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
import { PurchaseRequisitionService } from './service/purchase-requisition.service';
import { FormCanDeactivate } from 'src/app/core/guards/form-can-deactivate';
import { DatePipe } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { enGbLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/core/services';
import { GeneratePdfComponent } from './generate-pdf/generate-pdf.component';
import { Router, RouterStateSnapshot } from '@angular/router';
import { ExcelService } from 'src/app/shared/services/export/excel/excel.service';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { SharedLazyTableNewComponent } from 'src/app/shared/components/shared-lazy-table-new/shared-lazy-table-new.component';
import { ApprovalRequest, PurchaseRequisition, PurchaseRequisitionOutPutData } from './model/purchase-requisition-model';
import { PurchaseRequisitionListComponent } from './purchase-requisition-list/purchase-requisition-list.component';

@Component({
  selector: 'app-purchase-requisition',
  templateUrl: './purchase-requisition.component.html',
  styleUrls: ['./purchase-requisition.component.css'],
})
export class PurchaseRequisitionComponent extends FormCanDeactivate {
  @ViewChild(PurchaseRequisitionListComponent)
  purchaseRequisitionListComponent!: PurchaseRequisitionListComponent;
  @ViewChild(GeneratePdfComponent)
  generatePdfComponent!: GeneratePdfComponent;
  @ViewChild('sharedTableNew') sharedTableNew: any;
  @ViewChild('sharedLazyTableNew') sharedLazyTableNew: SharedLazyTableNewComponent | undefined;
  @ViewChild('purchasePartSpecificationModal')
  purchasePartSpecificationModal: any;
  @ViewChild('cancelPopup') cancelPopup: any;
  @ViewChild("remarksPopup") remarksPopup: any;
  @ViewChild('emailModal') emailModal: any;
  // @Input() purchaseRequisitionOutputData: PurchaseRequisitionOutPutData[] = [];

  editSaveForm!: FormGroup;
  editSavePRForm!: FormGroup;
  cancelRemarkForm!: FormGroup;
  tableFilterFormGroup!: FormGroup;
  overViewObject: any;
  clickedSearchBtn: boolean = false;
  purchaseRequisition!: PurchaseRequisition;
  approvalRequest !: ApprovalRequest;
  showWarningMessage: boolean = false;
  paramsGlobal: any;
  saveButton: boolean = true;
  serverSideProcessing: any;
  submitted = false;
  submittedSearch = false;
  currentDate!: Date;
  prNumber: string = '';
  showList = true
  selectedData: any;
  selectedDataPRNumbers: any;
  selectedDataList: any = [];
  excelDataTable: any = [];
  tableTitle = 'Overall List'; // default table title
  purchaseRequisitionIdForPrint: any;
  startPeriodSmallerThanEnd = false;
  startPeriodSmallerThanCurrent = false;
  mode: string = 'new';
  associatedDepots = [];
  prStatuses = [];
  prNumbers = [];

  totalEstimatedCode = 0;
  currentStatusId: number = 547;
  showTableByColumn = 1;

  partSpecificationPartId: any = 0;
  purchasePartSpecificationData: any = [];
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
  partCodeDDList: any = [];
  IsCombinationErr: boolean = false;
  partTypeDDList: any = [];
  selectedPartListRecord: any;
  selectedPRListRecord: any;
  purchaseRequisitionPartsList: any = [];

  //----------------- Enable Rights Variables -----------------
  currentTabStatusId: number = 1;
  createBit: boolean = true;
  editBit: boolean = true;
  viewBit: boolean = true;
  showWarningMessageForRoleRights: boolean = false;
  warningMessageForRoleRights: string = '';
  showWarningMessageForRoleRightsForm: boolean = false;
  warningMessageForRoleRightsForm: string = '';
  disableSaveButton: boolean = false;
  disableAddButton: boolean = false;
  lastModifiedDate: any;
  disableALLGridIcons: boolean = false;
  disableALLFormIcons: boolean = false;
  disableAddNewIcons: boolean = false;
  disableSendForApprovalIcons: boolean = false;
  disableCancelPRIcons: boolean = false;
  disableReopenIcons: boolean = false;
  disablePrintPRIcons: boolean = false;
  disableEmailPRIcons: boolean = false;
  disableFormPrintPRIcons: boolean = false;
  disableFormEmailPRIcons: boolean = false;
  disableFormCancelPRIcons: boolean = false;
  disableFormSendForApprovalIcons: boolean = false;
  disableFormAddNewIcons: boolean = false;
  disableFormReopenIcons: boolean = false;
  disableFormSubmitIcons: boolean = false;
  disableFormResetIcons: boolean = false;
  screenId: any = '';
  hideSendForApproval: boolean = false;
  hideEmailPR: boolean = false;
  hideCancelPR: boolean = false;
  hidesave: boolean = false;
  hideResetPR: boolean = false;
  prDateFromDateCounter = 0;
  fromGreaterThanCurrent = false;
  toLesserThanCurrent = false;
  fromGreaterThanTo = false;
  toLesserThanFrom = false;
  purchaseRequisitionData: any = [];
  totalDataGridCountComp: any;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private userAuthService: UserAuthService,
    private purchaseRequisitionService: PurchaseRequisitionService,
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
    this.getPartType();
    this.getActiveDepot();

    this.editSaveForm = this.formBuilder.group({
      depot: [[], []],
      prNo: [[], []],
      purchaseDateFrom: ['', []],
      purchaseDateTo: ['', []],
      currentStatus: [[], []],
    });

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
    this.tableFilterFormGroup = this.formBuilder.group({
      purchaseRequisitionNo: ['', []],
      prDateString: ['', []],
      depotCode: ['', []],
      totalEstimatedCost: ['', []],
      currentStatus: ['', []],
      createdBy: ['', []],
      lastModifiedBy: ['', []],
      lastModifiedDate: ['', []],
    });
    this.cancelRemarkForm = this.formBuilder.group({
      remarks: ['', [Validators.required]],
    });
    this.getPRStatuses();
    this.getPRNoByCurrentStatusId(this.currentStatusId);
    this.getActiveDepot();
    this.getPurchaseRequisitionOverView();
    this.changeHeaderColumn(1);

    this.purchaseRequisitionService.emailServiceDate.subscribe((data) => {
      this.purchaseRequisitionService
        .uploadFile(data)
        .subscribe((data: any) => {


          this.attachmentPath = data.response;
        });
      this.loaderService.stop();
    });
    this.getPageRights(this.screenId);
    this.disablePartCodeFields();
  }


  getPurchaseRequisitionOverView() {
    this.purchaseRequisitionService
      .getPurchaseRequisitionOverView()
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

  onPartTypeSelected(selectedValue: any) {
    this.editSavePRForm.controls['partCode'].setValue(null);
    this.purchaseRequisitionService
      .getPartCode(selectedValue.partTypeId)
      .subscribe(
        (data) => {
          this.partCodeDDList = data['response'];
        },
        (err) => { }
      );
    this.resetPartCodeFields();
  }

  combinationCheck() {

    if (
      this.editSavePRForm.value['partCode'].partId &&
      this.editSavePRForm.value['partType'].partTypeId
    ) {
      const combinationObj = {
        prId: this.selectedPRListRecord?.purchaseRequisitionId || 0,
        prDetailId: this.selectedPRListRecord?.purchaseRequisitionDetailId || 0,
        partId:
          this.selectedPartListRecord?.partId ||
          this.editSavePRForm.value['partCode'].partId,
      };

      this.purchaseRequisitionService
        .isPartCodeValid(combinationObj)
        .subscribe((data: any) => {
          if (data['status'] === false) {
            this.IsCombinationErr = true;
          } else {
            this.IsCombinationErr = false;
          }
        });
    }
  }
  onPartCodeSelected(selectedValue: any) {

    this.partSpecificationPartId = selectedValue.partId;
    this.currentTabStatusId = 1;
    this.editSavePRForm.patchValue({
      partName: selectedValue.partName,
      partCategory: selectedValue.partCategory,
      availableStock: selectedValue.availableStock,
      stockUOM: selectedValue.stockUom,
      stockUOMId: selectedValue.stockUomID,
      partRate: selectedValue.partRate,
    });

    this.purchaseRequisitionService
      .getPartRateBasedOnPartId(selectedValue.partId)
      .subscribe(
        (data) => {
          const result = data['response'];

          this.editSavePRForm.controls['partRate'].setValue(
            result && result.rate
          );
        },
        (err) => { }
      );

    this.disablePartCodeFields();
  }
  disablePartCodeFields() {
    this.editSavePRForm.controls['partName'].disable();
    this.editSavePRForm.controls['partCategory'].disable();
    this.editSavePRForm.controls['availableStock'].disable();
    this.editSavePRForm.controls['stockUOM'].disable();
    this.editSavePRForm.controls['partRate'].disable();
    this.editSavePRForm.controls['estimatedCost'].disable();
    this.editSavePRForm.controls['createdDate'].disable();
    this.editSavePRForm.controls['createdBy'].disable();
  }
  resetPartCodeFields() {
    this.editSavePRForm.controls['partName'].setValue('');
    this.editSavePRForm.controls['partCategory'].setValue('');
    this.editSavePRForm.controls['availableStock'].setValue('');
    this.editSavePRForm.controls['stockUOM'].setValue('');
    this.editSavePRForm.controls['partRate'].setValue('');
  }

  get editSaveFormController() {
    return this.editSaveForm.controls;
  }



validatePeriod(controlName: string, event: any) {
    
  this.currentDate = new Date();


  const selectedDate = new Date(this.formatDate(event));

  if (selectedDate > this.currentDate) {

    this.fromGreaterThanCurrent = true;
    this.fromGreaterThanTo = false;
    
    if (controlName === 'purchaseDateFrom') {
      this.editSaveForm.controls['purchaseDateFrom'].setErrors({
        greaterThanCurrentDateError: true,
      });
    } 
    if (controlName === 'purchaseDateTo') {
      this.editSaveForm.controls['purchaseDateTo'].setErrors({
        greaterThanCurrentDateError: true,
      });
    }

    this.toLesserThanCurrent = true;
    this.toLesserThanFrom = false;
  } else {
    

    if (controlName === 'purchaseDateFrom') {
      this.editSaveForm.controls['purchaseDateFrom'].setErrors(null);
    }
    if (controlName === 'purchaseDateTo') {
      this.editSaveForm.controls['purchaseDateTo'].setErrors(null);
    }

    let fromPo = this.editSaveForm.controls['purchaseDateFrom'].value;
    let toPo = this.editSaveForm.controls['purchaseDateTo'].value;

    

    let convertedPoToDte = new Date(this.formatDate(fromPo));
    let convertedPoFromDte = new Date(this.formatDate(toPo));

    if (convertedPoToDte && convertedPoFromDte) {

       if (convertedPoFromDte < convertedPoToDte) {
        if (controlName === 'purchaseDateFrom') {
          this.editSaveForm.controls['purchaseDateFrom'].setErrors({
            customErr: true,
          });
        }
        if (controlName === 'purchaseDateTo') {
          this.editSaveForm.controls['purchaseDateTo'].setErrors({
            customErr: true,
          });
        }
      }
      else {
        this.editSaveForm.controls['purchaseDateTo'].setErrors(null);
        this.editSaveForm.controls['purchaseDateFrom'].setErrors(null);;
      }
    }
  }
  if (isNaN(selectedDate.getTime())) {
    this.editSaveForm.controls[controlName].setErrors({
      invalid: true,
    });
  }
}


  get editSaveFormControls() {
    return this.editSaveForm.controls;
  }
  closeRemarksPopUp() {
    this.remarksPopup.hide();
  }

  openRemarksPopup(remarks: string, event: MouseEvent) {
    this.remarks = remarks;
    this.remarksPopup.show();
    event.stopPropagation();
  }
  remarks = ""
  handleRemarksIcon(data: any) {

    this.remarks = data.row.remarks;
    this.remarksPopup.show();
    this.remarksPopup.show();
    data.event.stopPropagation();
  }
  resetForm() {
    this.clickedSearchBtn = false;
    this.editSaveForm.reset();
    this.currentStatusId = 547;
    this.editSaveForm.controls['currentStatus'].setValue({
      code: 'OVERALL',
    });
    this.editSaveForm.controls['currentStatus'].enable();
    this.submittedSearch = false;
    this.getServerSideTableList(this.paramsGlobal);
  }

  searchRecordsList() {
    this.clickedSearchBtn = true;
    this.getServerSideTableList(this.paramsGlobal);
    this.submittedSearch = true;
  }
  resetPRForm() {
    this.submitted = false;
    this.editSavePRForm.reset();
  }

  changeStatusID(event: any) {
    this.currentStatusId = event?.enumId;

  }
  checkNgSearchFormSelectValue(event: any, controlName: any) {
    const control = this.editSaveForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.editSaveForm.markAsDirty();
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

  dropdownPRNoSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['purchaseRequisitionNo'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['purchaseRequisitionNo'].toLocaleLowerCase() === term
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

  //  isRemarkIcon = false
  getPRNoByCurrentStatusId(currentStatusId: number, cardNumber: number = 1) {
    this.currentStatusId = currentStatusId;
    this.purchaseRequisitionService
      .getPRNoByCurrentStatusId(currentStatusId)
      .subscribe((res) => {
        if (res.status === true) {
          this.prNumbers = res.response;
        }
      });

    this.currentTabStatusId = cardNumber;
    this.changeHeaderColumn(cardNumber);
    this.changeTableTitle(cardNumber);
    this.getServerSideTableList(this.paramsGlobal);
  }

  changeTableTitle(cardNumber: any) {
    if (cardNumber == 1) {
      this.tableTitle = 'Overall List';
      this.editSaveForm.controls['currentStatus'].setValue({
        code: 'OVERALL',
      });
      this.editSaveForm.controls['currentStatus'].enable();
    } else if (cardNumber == 2) {
      this.tableTitle = 'Drafts List';
      this.editSaveForm.controls['currentStatus'].setValue({
        code: 'DRAFT',
      });
      this.editSaveForm.controls['currentStatus'].disable();
    } else if (cardNumber == 3) {
      this.tableTitle = 'Pending Approval List';
      this.editSaveForm.controls['currentStatus'].setValue({
        code: 'PENDING APPROVAL',
      });
      this.editSaveForm.controls['currentStatus'].disable();
    } else if (cardNumber == 4) {
      this.tableTitle = 'Approved List';
      this.editSaveForm.controls['currentStatus'].setValue({
        code: 'APPROVED',
      });
      this.editSaveForm.controls['currentStatus'].disable();
    } else if (cardNumber == 5) {
      this.tableTitle = 'Cancelled List';
      this.editSaveForm.controls['currentStatus'].setValue({
        code: 'CANCELLED',
      });
      this.editSaveForm.controls['currentStatus'].disable();

    } else if (cardNumber == 6) {
      this.tableTitle = 'Rejected List';
      this.editSaveForm.controls['currentStatus'].setValue({
        code: 'REJECTED',
      });
      this.editSaveForm.controls['currentStatus'].disable();
    }
    this.getPurchaseRequisitionOverView();
    this.sharedLazyTableNew?.changeTableTitle(this.tableTitle);
  }
  changeHeaderColumn(cardNumber: number) {

    if (cardNumber == 1) {
      this.tableTitle = 'Overall list';
      this.showTableByColumn = 1;

    } else if (cardNumber == 5) {
      this.showTableByColumn = 2;
    } else {
      this.showTableByColumn = 3;

    }

    this.sharedLazyTableNew?.changeHeaderDynamically();
  }

  getActiveDepot() {
    this.purchaseRequisitionService
      .getActiveDepot(this.userAuthService.getCurrentUserId())
      .subscribe((res) => {
        if (res.status === true) {
          if (res.response.length === 1) {

            this.editSaveForm.controls['depot'].setValue(res.response[0]);
            this.editSaveForm.controls['depot'].disable();
          } else {
            if (this.mode != 'view') {
              this.editSaveForm.controls['depot'].enable();
            }
            this.associatedDepots = res.response;
          }
        }
      });
  }
  getPRStatuses() {
    this.purchaseRequisitionService.getPRStatuses().subscribe((res) => {
      if (res.status === true) {
        this.prStatuses = res.response;
      }
    });
  }


  // -----------API Functions-------Start
  getPartSpecificationList(partId: any) {

    if (this.mode == "new") {
      this.purchaseRequisitionService
        .getPartSpecificationList(partId)
        .subscribe((data: any) => {
          this.purchasePartSpecificationData = data.response;
        });

    } else {

      this.purchaseRequisitionService
        .getPRPartSpecificationList(this.selectedPartListRecord?.purchaseRequisitionDetailId || 0)
        .subscribe((data: any) => {
          this.purchasePartSpecificationData = data.response;
        });
    }
  }
  getPartType() {

    this.purchaseRequisitionService.getPartType().subscribe(
      (data) => {
        this.partTypeDDList = data['response'];
      },
      (err) => { }
    );
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
          this.totalEstimatedCode = sum;
        }
      });
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

  handleFormSubmit() {


    // this.constructTermsAndConditionObject(this.editSavePRForm.getRawValue());
    if (this.saveButton) {
      if (this.showWarningMessage) {
        return;
      }
      if (this.editSavePRForm.invalid) {
        this.validateAllFormFields(this.editSavePRForm);
        return;
      } else {
        this.submitted = true;
        if (this.editSavePRForm.dirty && this.editSavePRForm.touched) {
          this.constructTermsAndConditionObject(
            this.editSavePRForm.getRawValue()
          );

          if (this.mode === 'new') {
            this.editSavePRForm.markAsDirty();
            this.loaderService.start();
            this.purchaseRequisitionService
              .createPurchaseRequisition(this.purchaseRequisition)
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
                  this.mode = 'edit';
                  this.prNumber = data.response.purchaseRequisitionNo;
                  this.getPurchaseRequisitionPartsList(
                    data.response.purchaseRequisitionId
                  );
                  this.getServerSideTableList(this.paramsGlobal);
                  this.getPurchaseRequisitionOverView();
                  this.prNumber = data.response.purchaseRequisitionNo;

                  this.mode = 'edit';
                  this.enableRights();

                  this.editSavePRForm.markAsPristine();
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
            this.purchaseRequisitionService
              .updatePurchaseRequisition(this.purchaseRequisition)
              .subscribe((data) => {
                if (data['status'] === true) {
                  this.enableRights();
                  this.getPurchaseRequisitionPartsList(
                    this.selectedPRListRecord.purchaseRequisitionId
                  );
                  this.editSavePRForm.controls['depot'].setValue({
                    depotId: this.selectedPRListRecord.depotId,
                    depotCode: this.selectedPRListRecord.depotCode,
                  });
                  this.getServerSideTableList(this.paramsGlobal);
                  this.resetPRForm();

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

                  this.editSavePRForm.markAsPristine();
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
            title: this.translate.instant(
              'common.notificationTitle.information'
            ),
            content: this.translate.instant('common.Information.noChangesInfo'),
            severity: 'info',
            timeout: 3000,
            icon: 'fa fa-check',
          });
        }
      }
    }
  }

  constructTermsAndConditionObject(formData: any) {

    if (this.mode === 'new') {
      this.purchaseRequisition = {
        purchaseRequisitionId: 0,
        companyId: this.userAuthService.getCurrentCompanyId(),
        currentStatusId: 542,
        previousStatusId: null,
        prDate: new Date(),
        depotId: formData.depot.depotId,
        purchaseRequisitionDetails: [
          {
            purchaseRequisitionDetailId: 0,
            partId: formData.partCode.partId,
            partTypeId: formData.partType.partTypeId,
            requiredDate: formData.requiredDate,
            requisitionQuantity: formData.requisitionQuantity,
            remarks: formData.remarks,
            createdBy: this.userAuthService.getCurrentUserName(),
            modifiedBy: this.userAuthService.getCurrentUserName(),
            estimatedCost: formData.estimatedCost,
            stockUOMId: formData.stockUOMId,
            partName: formData.partName
          },
        ],
        createdBy: this.userAuthService.getCurrentUserName(),
        modifiedBy: this.userAuthService.getCurrentUserName(),
      };
    } else {
      const currentDate: Date = new Date();
      const formattedDate: string = currentDate.toISOString();
      this.purchaseRequisition = {
        purchaseRequisitionId: this.selectedPRListRecord.purchaseRequisitionId,
        companyId: this.userAuthService.getCurrentCompanyId(),
        currentStatusId: this.selectedPRListRecord.currentStatusId,
        previousStatusId: this.selectedPRListRecord.previousStatusId,
        prDate: this.selectedPRListRecord.prDate,
        depotId: this.selectedPRListRecord.depotId,
        purchaseRequisitionNo: this.selectedPRListRecord.purchaseRequisitionNo,
        purchaseRequisitionDetails: [
          {
            purchaseRequisitionDetailId: this.selectedPartListRecord
              ?.purchaseRequisitionDetailId
              ? this.selectedPartListRecord?.purchaseRequisitionDetailId
              : 0,
            partId: formData.partCode.partId
              ? formData.partCode.partId
              : this.selectedPartListRecord.partCodeId,
            partTypeId: formData.partType.partTypeId
              ? formData.partType.partTypeId
              : this.selectedPartListRecord.partTypeId,
            requiredDate: formData.requiredDate
              ? formData.requiredDate
              : this.selectedPartListRecord.requiredDate,
            requisitionQuantity: formData.requisitionQuantity
              ? formData.requisitionQuantity
              : this.selectedPartListRecord.requisitionQuantity,
            remarks: formData.remarks,
            createdBy: this.userAuthService.getCurrentUserName(),
            modifiedBy: this.userAuthService.getCurrentUserName(),
            created: this.selectedPartListRecord?.created
              ? this.selectedPartListRecord?.created
              : formattedDate,
            modified: this.selectedPartListRecord?.modified
              ? this.selectedPartListRecord?.created
              : formattedDate,
            estimatedCost: +formData.estimatedCost,
            stockUOMId: formData.stockUOMId,
            partName: formData.partName
          },
        ],

        created: this.selectedPRListRecord.created,
        modified: this.selectedPRListRecord.modified,
        createdBy: this.userAuthService.getCurrentUserName(),
        modifiedBy: this.userAuthService.getCurrentUserName(),
      };
    }
  }

  cancelPopupClose() {
    this.cancelRemarkForm.reset();
    this.cancelPopup.hide();
  }
  handleRemarkFormClear() {
    this.cancelRemarkForm.reset();
  }

  // ............................................cancel pr function..........................................................
  handleFormCancelPRAction() {
    if (this.cancelRemarkForm.invalid) {
      this.validateAllFormFields(this.cancelRemarkForm);
      return;
    }
    const remarks = this.cancelRemarkForm.controls['remarks'].value;

    this.loaderService.start();
    this.purchaseRequisitionService
      .cancelPR(this.selectedDataPRNumbers, this.selectedData, remarks)
      .subscribe((data: any) => {
        if (data['status'] === true) {
          this.selectedDataPRNumbers = []
          this.getServerSideTableList(this.paramsGlobal);
          this.getPurchaseRequisitionOverView();
          this.showList = true
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
  handleCancelIcon(event: any) {

    if (
      (this.selectedDataList?.length <= 0 ||
        this.selectedDataList == undefined) &&
      event == 'icon'
    ) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.purchaseRequisition.errors.atLeastOneSelectedForCancel'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    } else {
      const invalidStatus = this.selectedDataList.some(
        (item: { currentStatusId: number }) =>
          item.currentStatusId !== 542 && item.currentStatusId !== 543
      );

      if (invalidStatus) {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant(
            'operations.purchaseRequisition.errors.cancelActionValidForDraftAndPending'
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
  // -----------API Functions-------end

  // ------------Grid Icon Functions--------- Start
  handleAddRecordIcon(event: any) {
    this.editSavePRForm.reset();
    const createdBy = this.userAuthService?.getCurrentUserName();
    this.editSavePRForm.controls['createdBy'].setValue(createdBy);
    this.totalEstimatedCode = 0;
    this.purchaseRequisitionPartsList = [];
    this.disablePartCodeFields();
    this.showList = false
    this.mode = 'new';
    this.enableRights();
    this.currentTabStatusId = 7;
  }
  handleBackToList() {
    if (this.editSavePRForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant(
          'common.Information.unsavedChangesInfo'
        ),
        header: this.translate.instant('common.notificationTitle.confirmation'),
        accept: () => {
          this.checkForEmptyValues();
          this.editSavePRForm.reset();
          this.showList = true
          this.mode = 'new';
          this.enableRights();
          this.currentTabStatusId = 1;
          this.getPRNoByCurrentStatusId(547, 1);
          this.disablePartCodeFields();
          this.getPurchaseRequisitionOverView();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.checkForEmptyValues();
      this.editSavePRForm.reset();
      this.mode = 'new';
      this.enableRights();
      this.showList = true
      this.currentTabStatusId = 1;
      this.getPRNoByCurrentStatusId(547, 1);
      this.disablePartCodeFields();
    }
  }
  checkForEmptyValues(): void {
    Object.keys(this.editSavePRForm.controls).forEach((controlName: any) => {
      const control = this.editSavePRForm?.get(controlName);
      if (control?.value === '' || control?.value === null) {
        this.getPRNoByCurrentStatusId(547, 1);
      }
    });
  }

  handleOpenPurchaseSpecification() {
    this.getPartSpecificationList(this.partSpecificationPartId);
    this.purchasePartSpecificationModal.show();
  }
  handleClosePurchaseSpecification() {
    this.purchasePartSpecificationModal.hide();
  }
  handlePrintIcon(event: any) {
    const hasStatusIdRejected = this.selectedDataList.some((item: any) => item.currentStatusId === 546);
    if (hasStatusIdRejected) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.purchaseRequisition.errors.printNotForRejected'
        ),
        severity: 'error',
        timeout: 3000,
        icon: 'fa fa-times',
      });
      return;
    }
    const hasStatusIdCancelled = this.selectedDataList.some((item: any) => item.currentStatusId === 545);
    if (hasStatusIdCancelled) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.purchaseRequisition.errors.printNotForCancelled'
        ),
        severity: 'error',
        timeout: 3000,
        icon: 'fa fa-times',
      });
      return;
    }
    let purchaseRequisitionIds = [];
    purchaseRequisitionIds = this.selectedDataList.map(
      (item: { purchaseRequisitionId: any }) => item.purchaseRequisitionId
    );
    if (purchaseRequisitionIds?.length === 0) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.purchaseRequisition.errors.minOneSelectedForPrint'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    }  else {
      this.loaderService.start();
      this.purchaseRequisitionService
        .getPurchaseRequisitionOutput(purchaseRequisitionIds)
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

  async generatePdfForData(printData: PurchaseRequisitionOutPutData): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.generatePdfComponent.getData(printData);
        this.generatePdfComponent.downloadPdf().then(() => {
          resolve();
        });
      }, 1000);
    });
  }

  handleFormPrintIcon() {
    const prId = [this.purchaseRequisitionIdForPrint];
    this.loaderService.start();
    this.purchaseRequisitionService
      .getPurchaseRequisitionOutput(prId)
      .subscribe(async (data: any) => {
        // if (data.status === true) {
        //   this.purchaseRequisitionOutputData = data.response;
        //   if (data.response && data.response.length > 0) {
        //     await this.generatePdfComponent.downloadPdf();
        //   }
        // }

        if (data.status === true) {  
          if (data.response && data.response.length > 0) {
          for (const printData of data.response) {
            await this.generatePdfForData(printData);
          }
        }
        }


      });
  }

  handleReopenIcon(event: any) {

    if (this.selectedDataList?.length > 0) {
      const hasError = this.selectedDataList.some(
        (item: any) => item.currentStatusId !== 545
      );
      if (hasError) {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant('operations.purchaseRequisition.errors.reopenErrorMessage'),
          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
      } else {

        this.loaderService.start();
        this.purchaseRequisitionService
          .ReopenPR(this.selectedData)
          .subscribe((data: any) => {
            if (data['status'] === true) {
              this.getServerSideTableList(this.paramsGlobal);
              this.getPurchaseRequisitionOverView();
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
        content: this.translate.instant('operations.purchaseRequisition.errors.cancelPRErrorMessage'),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    }

  }
  prId: any;
  attachmentPath: any;
  handleEmailIcon(event: any) {

    if (this.selectedDataList?.length == 1) {
      const invalidStatus = this.selectedDataList.some(
        (item: { currentStatusId: number }) => item.currentStatusId !== 544
      );

      if (invalidStatus) {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant(
            'operations.purchaseRequisition.errors.emailValidForApprovedPRs'
          ),

          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
      } else {
        this.prId = this.selectedData[0];
        this.loaderService.start();
        const purchaseRequisitionIds = this.selectedDataList.map(
          (item: { purchaseRequisitionId: any }) => item.purchaseRequisitionId
        );

        this.purchaseRequisitionService
          .getPurchaseRequisitionOutput(purchaseRequisitionIds)
          .subscribe(async (data: any) => {
            // if (data.status === true) {
            //   // data.response.forEach(async (item: any) => {
            //   //   setTimeout(async () => {
            //   //     this.purchaseRequisitionOutputData = item;
            //   //     await this.generatePdfComponent.generateEmailPdf();
            //   //   }, 1000);

            //   // })
            //   // this.purchaseRequisitionOutputData = data.response;
            //   // await this.generatePdfComponent.generateEmailPdf();
            // }
            for (const printData of data.response) {
              await this.generatePdfForData(printData);
            }
            await this.generatePdfComponent.generateEmailPdf();
            this.sharedTableStoreService.setResetTableData(true)
            this.sharedTableStoreService.refreshTable(true)
            this.selectedDataList = []
          });
        this.emailModal.emailPopup = true;
      }
    } else if (this.selectedDataList?.length < 1) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.purchaseRequisition.errors.atLeastOneSelectedForEmail'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    } else if (this.selectedDataList?.length > 1) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant('operations.purchaseRequisition.errors.sendMailErrorMessage'),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    }
  }
  handleSendForApprovalIcon(event: any) {


    if (
      this.selectedDataList?.length > 0 ||
      this.selectedPRListRecord != undefined
    ) {
      const hasError = this.selectedDataList.some(
        (item: any) => item.currentStatusId !== 542
      );
      if (hasError) {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: this.translate.instant('operations.purchaseRequisition.errors.sendForApprovalErrorMessage'),

          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
      } else {
        this.approvalRequest = {
          purchaseRequisitions: this.selectedData,
          prNumbers: this.selectedDataPRNumbers
        }

        this.loaderService.start();
        this.purchaseRequisitionService
          .SendForApproval(this.approvalRequest)
          .subscribe((data: any) => {
            if (data['status'] === true) {

              this.selectedDataPRNumbers = []
              this.getPurchaseRequisitionOverView();

              this.selectedData = [];
              this.currentStatusId = 542;
              this.getServerSideTableList(this.paramsGlobal);
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
              this.purchaseRequisitionListComponent.handleResetSelectedData()
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
          'operations.purchaseRequisition.errors.atLeastOneSelectedForApproval'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    }
  }


  deleteRowDataPrPart(event: any) {


    this.confirmationService.confirm({
      message: this.translate.instant('common.Information.deleteConfirmation'),
      header: this.translate.instant('common.notificationTitle.confirmation'),
      accept: () => {
        this.handleDeleteRowDataPrPart(event.purchaseRequisitionDetailId);
      },
      reject: () => {
        return false;
      },
    });
  }
  handleDeleteRowDataPrPart(purchaseRequisitionDetailId: any) {
    this.loaderService.start();
    this.purchaseRequisitionService
      .deletePrPart(purchaseRequisitionDetailId)
      .subscribe((data: any) => {
        if (data['status'] === true) {
          this.getPurchaseRequisitionPartsList(
            this.selectedPRListRecord?.purchaseRequisitionId || 0
          );

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

  // ------------Grid Icon Functions--------- End

  // ------------Form Icon Functions--------- Start

  handleFormCancelPRIcon() {
    this.cancelPopup.show();
  }


  handleFormResetIcon() {

    this.totalEstimatedCode = 0;
    this.editSavePRForm.reset();
  }


  handleFormNewPRIcon() {
    this.mode = 'new';
    this.totalEstimatedCode = 0;
    this.purchaseRequisitionPartsList = [];
    this.editSavePRForm.reset();
    this.editSavePRForm.controls['depot'].setValue({
      depotId: this.selectedPRListRecord.depotId,
      depotCode: this.selectedPRListRecord.depotCode,
    });
    this.editSavePRForm.enable();
    this.currentTabStatusId = 1;
    this.enableRights();
    this.disablePartCodeFields();
    this.hidesave = false;
    this.hideResetPR = false;


  }

  // ------------Form Icon Functions--------- End

  // Grid Server side API

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

  getServerSideTableList(params: any): void {
    this.paramsGlobal = params;
    const formValues = this.editSaveForm.getRawValue();
    let PRDate = this.tableFilterFormGroup.value.prDateString
      ? this.tableFilterFormGroup.value.prDateString
      : '';
    this.serverSideProcessing = {
      ...params,
      CurrentPage: params?.first || 0,
      GlobalFilter: params?.globalFilter != undefined
        ? params?.globalFilter
        : this.sharedLazyTableNew != undefined
          ? this.sharedLazyTableNew?.globalFilter.value
          : null,
      PageSize: params?.rows,
      SortField: params?.sortField ? params?.sortField : "sortOnly",
      SortOrder: params?.sortField
        ? params?.sortOrder
          ? params?.sortOrder
          : -1
        : -1,
      PRNo: this.tableFilterFormGroup.value.purchaseRequisitionNo
        ? this.tableFilterFormGroup.value.purchaseRequisitionNo
        : '',
      PRDate: PRDate,
      depot: this.tableFilterFormGroup.value.depotCode
        ? this.tableFilterFormGroup.value.depotCode
        : '',
      totalEstimatedCost: this.tableFilterFormGroup.value.totalEstimatedCost
        ? this.tableFilterFormGroup.value.totalEstimatedCost
        : '',
      lastModifiedBy: this.tableFilterFormGroup.value.lastModifiedBy
        ? this.tableFilterFormGroup.value.lastModifiedBy
        : '',
      lastModifiedDate: this.tableFilterFormGroup.value.lastModifiedDate
        ? this.tableFilterFormGroup.value.lastModifiedDate
        : '',
      searchDepot: formValues?.depot?.depotId,
      searchPrNo: formValues?.prNo?.purchaseRequisitionId,
      searchPRDateFrom: formValues?.purchaseDateFrom
        ? this.formatDate(formValues.purchaseDateFrom)
        : null,
      searchPRDateTo: formValues?.purchaseDateTo
        ? this.formatDate(formValues.purchaseDateTo)
        : null,
      searchStatus: this.currentStatusId,
    };

    this.serverSideProcessing['currentStatus'] = this.tableFilterFormGroup.value
      .currentStatus
      ? this.tableFilterFormGroup.value.currentStatus
      : '';
    this.serverSideProcessing['createdBy'] = this.tableFilterFormGroup.value
      .createdBy
      ? this.tableFilterFormGroup.value.createdBy
      : '';

    this.searchPurchaseRequisition(this.serverSideProcessing);

  }

  exportToExcel(event: any) {
    let newColumns = event.columns.filter(
      (key: any) => key.field != 'checkbox'
    );

    let params: any = { first: 0, rows: this.totalDataGridCountComp };
    newColumns.map((item: { [x: string]: any; field: string }) => { });
    this.excelDataTable = [];
    this.excelDataTable.columns = newColumns;
    this.excelDataTable.filteredValue = undefined;
    let downloaded: boolean;

    const formValues = this.editSaveForm.getRawValue();
    let PRDate = this.tableFilterFormGroup.value.prDateString
      ? this.tableFilterFormGroup.value.prDateString
      : '';
    let serverSideProcessing = {
      CurrentPage: params?.first || 0,
      GlobalFilter: params?.globalFilter != undefined
        ? params?.globalFilter
        : this.sharedLazyTableNew != undefined
          ? this.sharedLazyTableNew?.globalFilter.value
          : null,
      PageSize: params?.rows,
      // SortField: params.sortField ? params.sortField : 'sortOnly',
      // SortOrder: params.sortField
      //   ? params.sortOrder
      //     ? params.sortOrder
      //     : -1
      //   : -1,
      SortField: params?.sortField ? params?.sortField : "sortOnly",
      SortOrder: params.sortField
        ? params.sortOrder
          ? params.sortOrder
          : -1
        : -1,
      PRNo: this.tableFilterFormGroup.value.purchaseRequisitionNo
        ? this.tableFilterFormGroup.value.purchaseRequisitionNo
        : '',
      PRDate: PRDate,
      depot: this.tableFilterFormGroup.value.depotCode
        ? this.tableFilterFormGroup.value.depotCode
        : '',
      totalEstimatedCost: this.tableFilterFormGroup.value.totalEstimatedCost
        ? this.tableFilterFormGroup.value.totalEstimatedCost
        : '',
      lastModifiedBy: this.tableFilterFormGroup.value.lastModifiedBy
        ? this.tableFilterFormGroup.value.lastModifiedBy
        : '',
      lastModifiedDate: this.tableFilterFormGroup.value.lastModifiedDate
        ? this.tableFilterFormGroup.value.lastModifiedDate
        : '',
      searchDepot: formValues?.depot?.depotId,
      searchPrNo: formValues?.prNo?.purchaseRequisitionId,
      searchPRDateFrom: formValues?.purchaseDateFrom
        ? this.formatDate(formValues.purchaseDateFrom)
        : null,
      searchPRDateTo: formValues?.purchaseDateTo
        ? this.formatDate(formValues.purchaseDateTo)
        : null,
      searchStatus: this.currentStatusId,
      currentStatus: this.tableFilterFormGroup.value.currentStatus
        ? this.tableFilterFormGroup.value.currentStatus
        : '',
      createdBy: this.tableFilterFormGroup.value.createdBy
        ? this.tableFilterFormGroup.value.createdBy
        : '',
    };


    this.loaderService.start();
    this.purchaseRequisitionService
      .getPurchaseRequisitionListServerSide(
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
            'Purchase Requisition List',
            false
          );
        }

        this.loaderService.stop();
      });
  }

  searchPurchaseRequisition(params: any) {

    this.loaderService.start();
    this.purchaseRequisitionService
      .getPurchaseRequisitionListServerSide(
        params,
        this.userAuthService.getCurrentCompanyId(),
        this.userAuthService.getCurrentUserId()
      )
      .subscribe((data: any) => {
        if (data.status === true) {
          this.selectedDataList = [];
          this.purchaseRequisitionData = data.response.result;
          this.totalDataGridCountComp = data['response'].filterRecordCount;
          this.sharedTableStoreService.setAssignGridData({ data, params });
        }
      });
    this.loaderService.stop();
  }

  receiveTablePartList(event: any) {

    this.loaderService.start();
    this.purchaseRequisitionService.getPartCode(event.partTypeId).subscribe(
      (data) => {
        this.partCodeDDList = data['response'];
      },
      (err) => { }
    );
    this.loaderService.stop();

    this.mode = 'edit';
    this.selectedPartListRecord = event;
    this.editSavePRForm.patchValue({

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

  receiveTableRowData(event: any) {

    this.purchaseRequisitionIdForPrint = event.purchaseRequisitionId;
    if (event.currentStatusId != 542) {
      this.hideSendForApproval = true;
    } else {
      this.hideSendForApproval = false;
    }
    if (event.currentStatusId == 543) {
      this.hideSendForApproval = true;
    } else {
      this.hideSendForApproval = false;
    }
    if (event.currentStatusId != 544) {
      this.hideEmailPR = true;
    }
    if (event.currentStatusId == 545) {
      this.hideSendForApproval = true;
      this.hidesave = true;
      this.editSavePRForm.disable();
    } else if (event.currentStatusId == 544) {
      this.editSavePRForm.disable();
    } else {
      this.editSavePRForm.controls['partType'].enable();
      this.editSavePRForm.controls['partCode'].enable();
      this.editSavePRForm.controls['requisitionQuantity'].enable();
      this.editSavePRForm.controls['requiredDate'].enable();
      this.editSavePRForm.controls['remarks'].enable();
    }
    if (event.currentStatusId == 546) {
      this.hideSendForApproval = true;
      this.hidesave = true;
      this.hideEmailPR = true;
      this.hideCancelPR = true;
      this.hideResetPR = true;
    }
    if (
      event.currentStatusId == 544 ||
      event.currentStatusId == 545 ||
      event.currentStatusId == 546
    ) {
      this.hideCancelPR = true;
    } else {
      this.hideCancelPR = false;
    }

    this.mode = 'edit';

    this.selectedPRListRecord = event;
    this.selectedData = [event.purchaseRequisitionId];
    this.getPurchaseRequisitionPartsList(event.purchaseRequisitionId);

    this.showList = false
    this.prNumber = event.purchaseRequisitionNo;


    this.editSavePRForm.controls['depot'].setValue({
      depotId: this.selectedPRListRecord.depotId,
      depotCode: this.selectedPRListRecord.depotCode,
    });
    this.enableRights();


    this.editSavePRForm.controls['depot'].disable();

  }

  receiveSelectedData(selectedData: any) {
    
    this.selectedDataList = selectedData;
    // Use map to extract purchaseRequisitionId from each object
    const purchaseRequisitionNumbers: string[] = selectedData.map(
      (item: any) => item.purchaseRequisitionNo
    );
    const purchaseRequisitionIds: number[] = selectedData.map(
      (item: any) => item.purchaseRequisitionId
    );
    this.selectedDataPRNumbers = purchaseRequisitionNumbers
    this.selectedData = purchaseRequisitionIds;
    this.enableRights();
  }


  refreshPrPartList(event: any) {
    this.getPurchaseRequisitionPartsList(
      this.selectedPRListRecord?.purchaseRequisitionId || 0
    );
  }

  // Enable Rights
  getPageRights(screenId: any) {


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
    this.disableCancelPRIcons = true;
    this.disableReopenIcons = true;
    this.disablePrintPRIcons = true;
    this.disableEmailPRIcons = true;
  }

  enableRights() {


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
        this.editSavePRForm.disable();

        this.disableAllIcons();
        if (this.currentTabStatusId == 1) {
          //overall
        } else if (this.currentTabStatusId == 2) {
          //draft

          this.disableAddNewIcons = true;
          this.disableSendForApprovalIcons = true;
          this.disableCancelPRIcons = true;
        } else if (this.currentTabStatusId == 3) {
          //pending approval
          this.disableCancelPRIcons = true;
          this.disablePrintPRIcons = true;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disablePrintPRIcons = true;
          this.disableEmailPRIcons = true;
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableReopenIcons = true;
          this.disablePrintPRIcons = false;
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disableAddNewIcons = true;
          this.disableCancelPRIcons = true;
          this.disablePrintPRIcons = false;

        } else if (this.currentTabStatusId == 7) {
          // create
          this.showWarningMessageForRoleRightsForm = true;
          this.warningMessageForRoleRightsForm = 'common.roleRightsMessages.edit';

          this.disableFormAddNewIcons = true;
          this.disableFormSubmitIcons = true;
        } else {
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

          this.disableFormPrintPRIcons = true;
          this.disableFormEmailPRIcons = true;
          this.disableFormCancelPRIcons = true;
          this.disableFormSubmitIcons = true;
        } else if (this.currentTabStatusId == 2) {
          //draft

          this.disableFormPrintPRIcons = true;
          this.disableFormCancelPRIcons = true;
          this.disableFormSendForApprovalIcons = true;
          this.disableFormAddNewIcons = true;
          this.disableFormSubmitIcons = true;
          this.disableFormResetIcons = true;
        } else if (this.currentTabStatusId == 3) {
          //pending approval

          this.disableFormCancelPRIcons = true;
          this.disableFormAddNewIcons = true;
          this.disableFormPrintPRIcons = false;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disableFormPrintPRIcons = true;
          this.disableFormCancelPRIcons = true;
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableFormPrintPRIcons = true;
          this.disableFormPrintPRIcons = true;
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disableFormPrintPRIcons = true;
          this.disableFormCancelPRIcons = true;
        } else if (this.currentTabStatusId == 7) {
          // create

          this.disableFormPrintPRIcons = true;
          this.disableFormCancelPRIcons = true;
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
        this.editSavePRForm.disable();

        if (this.currentTabStatusId == 1) {
          //overall
          this.disableAddNewIcons = true;
          this.disablePrintPRIcons = false;
          this.disableEmailPRIcons = false;
        } else if (this.currentTabStatusId == 2) {
          //draft
          this.disableAddNewIcons = true;
          this.disablePrintPRIcons = false;
          this.disableSendForApprovalIcons = false;
          this.disableCancelPRIcons = false;
        } else if (this.currentTabStatusId == 3) {
          //pending approval
          this.disableAddNewIcons = true;

          this.disableCancelPRIcons = false;
          this.disablePrintPRIcons = false;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disablePrintPRIcons = false;
          this.disableEmailPRIcons = false;
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableReopenIcons = false;
          this.disablePrintPRIcons = false;
          this.disableEmailPRIcons = false;
          this.disableFormSubmitIcons = true;
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disablePrintPRIcons = false;
          this.disableCancelPRIcons = false;
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
        this.editSavePRForm.enable();


        if (this.currentTabStatusId == 1) {
          //overall
          this.disableFormAddNewIcons = true;
          this.disableFormPrintPRIcons = false;
          this.disableFormCancelPRIcons = false;
          this.disableFormSendForApprovalIcons = false;
          this.disableFormSubmitIcons = false;
          this.disableFormResetIcons = false;
        } else if (this.currentTabStatusId == 2) {
          //draft
          this.disableFormAddNewIcons = true;

          this.disableFormPrintPRIcons = false;
          this.disableFormCancelPRIcons = false;
          this.disableFormSendForApprovalIcons = false;
          this.disableFormSubmitIcons = false;
          this.disableFormResetIcons = false;
        } else if (this.currentTabStatusId == 3) {
          //pending approval

          this.disableFormCancelPRIcons = false;
          this.disableFormPrintPRIcons = false;
          this.disableFormAddNewIcons = true;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disableFormPrintPRIcons = false;
          this.disableFormEmailPRIcons = false;
          this.disableFormSubmitIcons = true;

        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableFormPrintPRIcons = false;
          this.disableFormPrintPRIcons = false;
          this.disableFormEmailPRIcons = false;
          this.editSavePRForm.disable();
          this.disableFormSubmitIcons = true;

        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disableFormPrintPRIcons = false;
          this.disableFormCancelPRIcons = false;
          this.editSavePRForm.disable();
          this.disableFormSubmitIcons = true;

        } else if (this.currentTabStatusId == 7) {
          // create
          this.warningMessageForRoleRightsForm =
            'common.roleRightsMessages.create';

          this.mode = "edit"
          this.disableFormAddNewIcons = false;
          this.disableFormSubmitIcons = false;
          this.disableFormPrintPRIcons = false;
          this.disableFormCancelPRIcons = false;
          this.disableFormResetIcons = false;
          this.disableFormSendForApprovalIcons = false;
        } else if (this.currentTabStatusId == 8) {
          // update
          this.warningMessageForRoleRightsForm =
            'common.roleRightsMessages.create';
          this.disableFormAddNewIcons = true;

          this.disableFormPrintPRIcons = false;
          this.disableFormCancelPRIcons = false;
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
        this.showWarningMessageForRoleRights = false;
        this.warningMessageForRoleRights = '';
        this.editSavePRForm.enable();
        this.disableFormSubmitIcons = false;

        this.disableAddNewIcons = false;
        this.disablePrintPRIcons = false;
        this.disableEmailPRIcons = false;

        if (this.currentTabStatusId == 1) {
          //overall
          this.disableCancelPRIcons = true;

        } else if (this.currentTabStatusId == 2) {
          //draft
          this.disableAddNewIcons = false;
          this.disablePrintPRIcons = false;
          this.disableSendForApprovalIcons = false;
          this.disableCancelPRIcons = true;
        } else if (this.currentTabStatusId == 3) {
          //pending approval
          this.disableAddNewIcons = false;
          this.disableCancelPRIcons = false;
          this.disablePrintPRIcons = false;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disablePrintPRIcons = false;
          this.disableEmailPRIcons = false;
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableReopenIcons = false;
          this.disablePrintPRIcons = false;
          this.disableEmailPRIcons = false;
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disablePrintPRIcons = false;
          this.disableCancelPRIcons = false;
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
        this.warningMessageForRoleRightsForm =
          'common.roleRightsMessages.edit';
        this.disableAddButton = false;
        this.disableSaveButton = true;
        this.disableFormAddNewIcons = false;
        this.disableFormSubmitIcons = true;

        this.editSavePRForm.disable();
        if (this.currentTabStatusId == 1) {
          //overall
          this.disableFormAddNewIcons = false;
          this.disableFormPrintPRIcons = false;
          this.disableFormEmailPRIcons = false;
          this.disableFormCancelPRIcons = true;
        } else if (this.currentTabStatusId == 2) {
          //draft
          this.disableFormAddNewIcons = false;
          this.disableFormPrintPRIcons = false;
          this.disableFormSendForApprovalIcons = false;
          this.disableFormResetIcons = false;
          this.disableFormCancelPRIcons = true;
        } else if (this.currentTabStatusId == 3) {
          //pending approval

          this.disableFormCancelPRIcons = false;
          this.disableFormPrintPRIcons = false;
          this.disableFormAddNewIcons = false;
        } else if (this.currentTabStatusId == 4) {
          // approved
          this.disableFormPrintPRIcons = false;
          this.disableFormEmailPRIcons = false;
          this.disableFormReopenIcons = false;
          this.editSavePRForm.disable();
        } else if (this.currentTabStatusId == 5) {
          //cancelled
          this.disableFormPrintPRIcons = false;
          this.disableFormEmailPRIcons = false;
          this.editSavePRForm.disable();
        } else if (this.currentTabStatusId == 6) {
          //rejected
          this.disableFormPrintPRIcons = false;
          this.disableFormCancelPRIcons = false;
          this.editSavePRForm.disable();
        } else if (this.currentTabStatusId == 7) {
          // create
          this.warningMessageForRoleRightsForm =
            'common.roleRightsMessages.edit';

          this.disableFormAddNewIcons = false;
          this.disableFormSubmitIcons = false;
          this.disableFormResetIcons = false;

          this.disableFormPrintPRIcons = true;
          this.disableFormCancelPRIcons = true;
        } else if (this.currentTabStatusId == 8) {
          // update
          this.warningMessageForRoleRightsForm =
            'common.roleRightsMessages.edit';

          this.disableFormPrintPRIcons = false;
          this.disableFormCancelPRIcons = false;
          this.disableFormSendForApprovalIcons = false;
          this.disableFormAddNewIcons = false;
          this.disableFormSubmitIcons = false;
          this.disableFormResetIcons = false;
        }
      }
    }
  }
}
