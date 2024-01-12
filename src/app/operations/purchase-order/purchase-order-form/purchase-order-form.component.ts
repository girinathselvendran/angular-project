import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PurchaseOrderService } from '../service/purchase-order.service';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { AdditionalChargesComponent } from '../additional-charges/additional-charges.component';
import { AddTermsAndConditionsComponent } from '../add-terms-and-conditions/add-terms-and-conditions.component';
import { AddPartDetailsComponent } from '../add-part-details/add-part-details.component';
import { PartsDetailsComponent } from '../parts-details/parts-details.component';
import { BillingAndDeliveryAddressComponent } from '../billing-and-delivery-address/billing-and-delivery-address.component';
import { NotificationService } from 'src/app/core/services';
import { Router, RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-purchase-order-form',
  templateUrl: './purchase-order-form.component.html',
  styleUrls: ['./purchase-order-form.component.css']
})
export class PurchaseOrderFormComponent {
  @Input() editSavePOForm!: FormGroup;
  @Input() poMode: any;
  @Input() currentStatusId: any;
  @Input() enableRights: any;
  @ViewChild(PartsDetailsComponent)
  partsDetailsComponent!: PartsDetailsComponent;
  @ViewChild("additionalCharges") additionalCharges: AdditionalChargesComponent | any;
  @ViewChild("termsAndCondition") termsAndCondition: AddTermsAndConditionsComponent | any;
  @ViewChild("partDetailsComponent") partDetailsComponent !: PartsDetailsComponent | any;
  @ViewChild("partDetailsComponent") billingAndDelComponent !: BillingAndDeliveryAddressComponent | any;
  @Input() additionalChargesList: any = [];
  @Input() selectedPoId: any;
  @Input() selectedPoRowData: any;
  @Input() submitted: boolean = false;
  editSavePartDetailsForm!: FormGroup;
  editSaveAdditionalChargesForm!: FormGroup;
  billingAddressForm!: FormGroup
  deliveryAddressForm!: FormGroup
  associatedDepots: any = [];
  supplierDropDownList: any = [];
  poStatusDDList: any = [];
  poSourceDDList: any = [];
  approveOrRejectOrDraftDDList: any = [];
  cityList: any = [];
  chargesList: any = [];
  activeTab = 1;
  showPartDetails: boolean = true;
  showTermsAndConditions: boolean = false;
  supplierId: number = 0;
  showFormWarning: boolean = false;
  formWarningMessage: string = "";
  supplierCurrency: any;
  depotCurrency: any;
  poExchangeRate: any;
  partDetailsData: any;
  additionalChargesData: any;
  termsAndConditionsData: any;
  currentUserId: any;
  addButton: boolean = false;
  screenId: number = 0;
  disableSaveButtonTAndC: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private purchaseOrderService: PurchaseOrderService,
    private userAuthService: UserAuthService,
    private translate: TranslateService,
    public notificationService: NotificationService,
    private router: Router,

  ) {
    const snapshot: RouterStateSnapshot = router.routerState.snapshot;
    this.screenId = snapshot.root.queryParams['screenId'];

  }
  ngOnInit() {
    this.currentUserId = this.userAuthService.getCurrentUserId();
    this.editSavePartDetailsForm = this.formBuilder.group({
      depotCurrency: ['', []],
      totalPOAmount: ['', []],
      supplierCurrency: ['', []],
      totPOAmtInSuppCur: ['', []]      // Total PO Amount In Supplier Currency
    })
    this.billingAddressForm = this.formBuilder.group({
      streetAddress: ['', []],
      country: ['', []],
      city: ['', []],
      zipCode: ['', []],
      email: ['', []]
    })
    this.deliveryAddressForm = this.formBuilder.group({
      deliveryAddress: ['', []],
      country: ['', []],
      city: ['', []],
      zipCode: ['', []],
      email: ['', []]
    })

    this.editSaveAdditionalChargesForm = this.formBuilder.group({
      charges: [[], [Validators.required]],
      value: ['', [Validators.required, Validators.min(0.00), Validators.max(1000000000000.00)]],
    })
    this.editSavePOForm.controls['city'].disable();
    this.editSavePOForm.controls['poNumber'].disable();
    if (this.selectedPoRowData && this.selectedPoRowData?.supplierId) {
      this.getSupplierDDList(this.selectedPoRowData.supplierId);

      this.handlePathDepotChangeDD(this.selectedPoRowData?.depotFull, this.selectedPoRowData.supplierId);
    }
    this.patchDepotValue(this.selectedPoRowData)
    this.purchaseOrderService.selectedPORowData.subscribe((data: any) => {

      if (this.poMode != "new") {
        this.selectedPoRowData = data;

        this.editSavePOForm.patchValue({
          ...this.selectedPoRowData,
          depot: this.selectedPoRowData?.depotFull,
          poSource: {
            sourceId: this.selectedPoRowData.poSourceId,
            sourceCode: this.selectedPoRowData.poSource
          },
          poStatus: {
            statusId: this.selectedPoRowData.poStatusId,
            statusCode: this.selectedPoRowData.poStatus
          },
          supplier: {
            supplierId: this.selectedPoRowData.supplierId,
            supplierCode: this.selectedPoRowData.supplierCode,
            supplierName: this.selectedPoRowData.supplierName
          }


        });
        this.editSavePartDetailsForm.patchValue({
          depotCurrency: this.selectedPoRowData?.depotFull?.depotCurrencyCode,
          // supplierCurrency: this.selectedPoRowData?.supplierCurrency,
          totalPOAmount: this.selectedPoRowData.totalPoAmount,
          totPOAmtInSuppCur: this.selectedPoRowData.totalPOSupplierCurrency,
        })
      }

    });
    this.purchaseOrderService.receivePartDetails.subscribe((data: any) => {
      this.partDetailsData = data;
    });
    this.getActiveDepot();
    this.initialFormData();

    if (this.poMode != "new") {
      if (this.selectedPoRowData?.length != 0) {
        this.editSavePOForm.patchValue({

          ...this.selectedPoRowData,
          depot: this.selectedPoRowData?.depotFull,
          poSource: {
            sourceId: this.selectedPoRowData?.poSourceId,
            sourceCode: this.selectedPoRowData?.poSource
          },
          poStatus: {
            statusId: this.selectedPoRowData?.poStatusId,
            statusCode: this.selectedPoRowData?.poStatus
          },
          supplier: {
            supplierId: this.selectedPoRowData?.supplierId,
            supplierCode: this.selectedPoRowData?.supplierCode,
            supplierName: this.selectedPoRowData?.supplierName
          }

        });
        this.selectedPoId = this.selectedPoRowData?.purchaseOrderId;
      }
      this.editSavePOForm.controls['depot'].disable();
      this.editSavePOForm.controls['supplier'].disable();

      this.getPOExchangeRate()
    }


    //For Approval Screen Form Validation

    if (this.screenId == 259) {
      this.editSavePOForm.disable();
      this.editSavePartDetailsForm.disable();
      this.editSaveAdditionalChargesForm.disable();
      this.disableSaveButtonTAndC = true;
    }
  }
  ngOnChanges() {
    this.initialEnableRights(this.enableRights)
  }

  get editSavePOFormController() {
    return this.editSavePOForm.controls;
  }
  get additionalChargesFormController() {
    return this.editSavePOForm.controls;
  }

  getPOExchangeRate() {
    const depot = this.editSavePOForm.controls["depot"].value?.depotCurrencyId || 0;
    const supplier = this.editSavePOForm.controls["supplier"].value?.currencyId || this.selectedPoRowData?.supplierCurrencyId || 0;

    if (depot && supplier) {
      this.purchaseOrderService.getPOExchangeRate(depot, supplier).subscribe((res: any) => {
        if (res.status === true) {
          this.poExchangeRate = res.response;
          // this.supplierDropDownList = res.response;
          this.purchaseOrderService.setPoExchangeRate(res.response);

        }
      });
    }
  }

  getPurchaseOrderPartsListFn() {
    this.partsDetailsComponent.getPurchaseOrderPartsListFn()
  }

  initialFormData() {

    this.editSavePOForm.controls['poDate'].disable();
    this.editSavePOForm.controls['poStatus'].disable();
    this.editSavePOForm.controls['poSource'].disable();
    this.editSavePOForm.controls['approveOrRejectOrDraft'].disable();
    this.editSavePOForm.controls['poDate'].setValue(new Date());
    this.editSavePOForm.controls['poStatus'].setValue({ statusCode: "DRAFT", statusId: 578 }); // Enum ID => 578 =  DRAFT 
    this.editSavePOForm.controls['poSource'].setValue({ sourceCode: "DIRECT", sourceId: 577 }); // Enum ID => 577 =  DIRECT 
    this.editSavePOForm.controls['approveOrRejectOrDraft'].setValue(this.selectedPoRowData?.poStatus || "DRAFT");  // initial Value
    this.editSavePartDetailsForm.controls['totalPOAmount'].setValue("0.00");
    this.editSavePOForm.controls['depot'].enable();
    this.editSavePOForm.controls['supplier'].enable();

  }
  resetForm() {
    this.additionalCharges.additionalChargesList = [];
    this.termsAndCondition.tAcList = [];
    this.partDetailsComponent.purchaseOrderPartsList = [];
    this.billingAndDelComponent.billingAddressForm?.reset();
    this.billingAndDelComponent.deliveryAddressForm?.reset();
    this.editSavePartDetailsForm.reset();
    this.editSavePartDetailsForm.controls['totalPOAmount'].setValue("0.00");
  }
  initialEnableRights(data: any) {


    if (!data?.editBit && !data?.createBit && data?.viewBit) { // view only
      this.addButton = true;
      this.additionalCharges.saveButton = true;
      this.termsAndCondition.saveButton = true;
      this.additionalCharges.editSaveAdditionalChargesForm.disable();
      this.termsAndCondition.editSaveTACForm.disable();
      this.addButton = true;
      this.partDetailsComponent?.disablePartDetailsForm();
      this.additionalCharges.additionalChargesList = [];
    } else if (!data?.createBit && data?.editBit && data?.viewBit) { // edit and view
      this.addButton = true;
      this.additionalCharges.saveButton = true;
      this.termsAndCondition.saveButton = true;
      this.additionalCharges.editSaveAdditionalChargesForm.disable();
      this.termsAndCondition.editSaveTACForm.disable();
      this.addButton = true;
      this.partDetailsComponent?.disablePartDetailsForm();

    } else if (data?.createBit && !data?.editBit && data?.viewBit) { // create and view

      this.addButton = false;
      this.additionalCharges.saveButton = false;
      this.termsAndCondition.saveButton = false;
      this.additionalCharges.editSaveAdditionalChargesForm.enable();
      this.termsAndCondition.editSaveTACForm.enable();
      this.addButton = false;
      this.partDetailsComponent?.disablePartDetailsForm();

    }
  }

  checkNgSelectValue(event: any, controlName: any) {
    const control = this.editSavePOForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.editSavePOForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }
  checkNgSelectACValue(event: any, controlName: any) {
    const control = this.editSaveAdditionalChargesForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.editSaveAdditionalChargesForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }

  checkFileMode(event: any, activeTab: any) {


    if (activeTab === 1) {
      this.showPartDetails = true;
      this.showTermsAndConditions = false;
      this.activeTab = activeTab;
    } else {
      if (activeTab == 2) {
        if (this.partDetailsData?.length == 0 || this.partDetailsComponent?.purchaseOrderPartsList?.length == 0) {
          this.notificationService.smallBox({
            title: this.translate.instant('common.notificationTitle.error'),
            content: this.translate.instant(
              'operations.purchaseOrder.errors.atLeastOnePart'
            ),
            severity: 'error',
            timeout: 5000,
            icon: 'fa fa-times',
          });
        } else {
          this.showPartDetails = false;
          this.showTermsAndConditions = true;
          this.activeTab = activeTab;
        }
      }
    }
  }
  // dropDown api calls
  getActiveDepot() {
    this.purchaseOrderService
      .getActiveDepot(this.currentUserId)
      .subscribe((res) => {
        if (res.status === true) {
          if (res.response.length === 1) {
            this.editSavePOForm.controls['depot'].setValue(res.response[0]);
            this.editSavePOForm.controls['depot'].disable();
          } else {
            if (this.poMode != 'view') {
              this.editSavePOForm.controls['depot'].enable();
            }
            this.associatedDepots = res.response;

          }
        }
      });
  }

  getSupplierDDList(depotId: any) {
    this.purchaseOrderService.getSupplierCodes(depotId).subscribe((res: any) => {
      if (res.status === true) {
        this.supplierDropDownList = res.response;
      }
    });
  }

  // dropDown search functions
  dropdownDepotSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['depotCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotCode'].toLocaleLowerCase() === term ||
      item['depotName'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotName'].toLocaleLowerCase() === term
    );
  }
  dropdownSupplierSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['supplierCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['supplierCode'].toLocaleLowerCase() === term ||
      item['supplierName'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['supplierName'].toLocaleLowerCase() === term
    );
  }
  dropdownCitySearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['cityCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['cityCode'].toLocaleLowerCase() === term ||
      item['cityName'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['cityName'].toLocaleLowerCase() === term
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
  handleDepotChangeDD(event: any) {
    this.purchaseOrderService.setPoDepotData(event);
    this.depotCurrency = event.depotCurrencyCode;
    this.editSavePOForm.controls['city'].setValue({ cityCode: event.city, cityId: event.cityId });
    this.editSavePOForm.controls['supplier'].setValue(null);
    this.getSupplierDDList(event.depotId);
    this.getPOExchangeRate();
  }
  handlePathDepotChangeDD(event: any, supplierId: any) {
    this.purchaseOrderService.setPoDepotData(event);
    this.depotCurrency = event.depotCurrencyCode;
    this.editSavePOForm.controls['city'].setValue({ cityCode: event.city, cityId: event.cityId });
    this.editSavePOForm.controls['supplier'].setValue(null);
    this.getPOExchangeRate();

    this.purchaseOrderService.getSupplierCodes(event.depotId).subscribe((res: any) => {
      if (res.status === true) {
        this.supplierDropDownList = res.response;
        const result = res.response.find((item: any) => item.supplierId == supplierId)
        this.editSavePOForm.patchValue({
          supplier: result
        });

        this.billingAddressForm.patchValue(result)
        if (result) {
          this.purchaseOrderService.setPoSupplierData(result);
          this.editSavePartDetailsForm.patchValue({
            supplierCurrency: result?.supplierCurrencyCode
          })
        }
        this.getSupplierDDList(event.depotId);


      }
    });
  }
  patchDepotValue(data: any) {
    if (data && data?.depotId) {

      this.purchaseOrderService
        .getActiveDepot(this.currentUserId)
        .subscribe((res) => {
          if (res.status === true) {
            if (res.response.length === 1) {

              this.deliveryAddressForm.patchValue(res.response[0]);

            } else {

              const result = res.response.find((item: any) => item.depotId == data.depotId)
              // this.editSavePOForm.patchValue({
              //   supplier: result
              // });

              this.deliveryAddressForm.patchValue(result);


            }
          }
        });
    }
  }

  handleChangeSupplierDD(event: any) {
    this.getPOExchangeRate();
    this.supplierCurrency = event.supplierCurrencyCode;
    // this.supplierId = event.supplierId;
    this.purchaseOrderService.setPoSupplierData(event);
    if (!event?.isAvailableKeyContact) {
      this.showFormWarning = true;
      this.formWarningMessage = this.translate.instant("operations.purchaseOrder.errors.billingAddressError") + event.supplierCode;
    } else {
      this.showFormWarning = false;
      this.formWarningMessage = "";
    }
  }
  receivePartDetails(event: any) {
    this.partDetailsData = event;
  }
  receiveAddCharges(event: any) {
    this.additionalChargesData = event;
  }
  receiveTermsAndConditions(event: any) {
    this.termsAndConditionsData = event;
  }
}
