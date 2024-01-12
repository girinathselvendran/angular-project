import { Component, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SupplierService } from '../service/supplier.service';
import { UserAuthService } from 'src/app/core/services/user-auth.service';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css'],
})
export class SupplierFormComponent {
  @Input() editSaveSupplierForm!: FormGroup;
  @Input() selectedRowList!: any;
  @Input() disableAddButton: boolean = false;
  @Input() disableSaveButton: boolean = false;
  @Input() createBit!: boolean;
  @Input() editBit!: boolean;
  @Input() viewBit!: boolean;
  @Input() mode!: string;

  submitted: boolean = false;
  exemptionUnderNeeded = true;
  repairTariffGroupNo: any;
  addButton = false;
  saveButton = false;
  isCurrencyExists = false;
  isDuplicateCombination = false;
  isTariffCombination = false;
  gstnStateCodes: any = [];
  tableFilterFormGroup!: FormGroup;
  currencyTypes = [];
  associatedDepots = [];
  supplierClassifications = [];
  excelFileName = 'Contact';
  tableInitialData = [];
  isCurrencyValueInr: boolean = false;
  financeIntegration: boolean = false;
  submittedDetails = false;



  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private supplierService: SupplierService,
    private userAuthService: UserAuthService
  ) { }

  ngOnInit() {
    this.getActiveCurrency();
    this.getActiveDepot();
    this.GetSupplierClassification();
    this.editSaveSupplierForm.controls['gstnState'].setValue(null);

    this.financeIntegration = this.userAuthService.getFinanceIntergrationApplicable();
    if (this.financeIntegration) {
      this.editSaveSupplierForm.controls['ledgerId'].disable();
      this.editSaveSupplierForm.controls['ledgerId'].setValue(null);
    } else {
      this.editSaveSupplierForm.controls['ledgerId'].enable();
    }
    this.enableRights();

    if (this.mode != 'new') {
      this.patchFormsValues(this.selectedRowList);
    } else {
      this.editSaveSupplierForm.controls['supplierCode'].enable();
    }
    this.changeCurrencyConditions();
    this.changeSupplierClassification()
  }
  isActiveChanged = false;

  onChangeActiveToggle(activeValue: any) {
    if (this.mode == 'edit') {
      this.isActiveChanged = true;
      this.editSaveSupplierForm.controls['isActiveChanged'].setValue(true);
    }
  }

  GetSupplierClassification() {
    this.supplierService.getSupplierClassification().subscribe(
      (data) => {
        this.supplierClassifications = data['response'];
      },
      (err) => { }
    );
  }
  getActiveCurrency() {
    this.supplierService.getActiveCurrency().subscribe(
      (data) => {
        this.currencyTypes = data['response'];
      },
      (err) => { }
    );
  }

  getActiveDepot() {
    this.supplierService
      .getActiveDepot(this.userAuthService.getCurrentUserId())
      .subscribe((res) => {
        if (res.status === true) {
          if (res.response.length === 1) {
            this.editSaveSupplierForm.controls['associatedDepots'].setValue(
              res.response[0]
            );
            this.editSaveSupplierForm.controls['associatedDepots'].disable();
          } else {
            if (this.mode != 'view') {
              this.editSaveSupplierForm.controls['associatedDepots'].enable();
            }
            this.associatedDepots = res.response;
          }
        }
      });
  }


  checkNgSelectValue(event: any, controlName: any) {
    const control = this.editSaveSupplierForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.editSaveSupplierForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }

  get editSaveSupplierFormInfo() {
    return this.editSaveSupplierForm.controls;
  }

  addNewForm() {
    this.editSaveSupplierForm.controls['active'].setValue(true);
    this.editSaveSupplierForm.controls['supplierCode'].enable();
    this.mode = 'new'
    this.enableRights();
    this.changeCurrencyConditions()
    this.changeSupplierClassification()
    this.isActiveChanged = false;
    this.editSaveSupplierForm.controls['isActiveChanged'].setValue(false);
  }

  updateForm() {
    this.mode = 'edit'
    this.enableRights();
  }

  patchFormsValues(values: any) {
    this.isActiveChanged = false;
    this.editSaveSupplierForm.controls['isActiveChanged'].setValue(false);
    this.editSaveSupplierForm.patchValue({
      supplierName: values.supplierName,
      supplierCode: values.supplierCode,
      currency: {
        currencyTypeCode: values.currency,
        currencyId: values.currencyId,
      },
      city: {
        city: values.city,
        cityId: values.cityId
      },
      ledgerId: values.ledgerId,
      taxRegistrationNo: values.taxRegistrationNo,
      panNo: values.panNo,
      tinNo: values.tinNo,
      supplierClassification: values.supplierClassification,
      exemptionUnder: values.exemptionUnder,
      gstnNo: values.gstnNo,
      gstnState: values.gstnState,
      associatedDepots: values.associatedDepotsList,
      remarks: values.remarks,
      manufacturer: values.manufacturerStatus,
      active: values.active,
      blacklist: values.blacklistStatus,
    })

    this.editSaveSupplierForm.controls['supplierCode'].disable();
  }

  dropdownSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['currencyTypeCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['currencyTypeCode'].toLocaleLowerCase() === term ||
      item['currencyTypeDescription'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['currencyTypeDescription'].toLocaleLowerCase() === term
    );
  }

  dropdownSearchFnAssociatedDepots(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['depotName'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotName'].toLocaleLowerCase() === term ||
      item['depotCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotCode'].toLocaleLowerCase() === term
    );
  }

  dropdownSearchFnGstnState(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['description'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['description'].toLocaleLowerCase() === term
    );
  }

  dropdownSearchFnSupplierClassification(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['enumCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['enumCode'].toLocaleLowerCase() === term
    );
  }

  validateSupplierCode(controlName: any) {

    const control = this.editSaveSupplierForm.controls[controlName];

    if (control.errors) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    const supplier = {
      supplierId: this.selectedRowList?.supplierId || 0,
      supplierCode: this.editSaveSupplierForm.controls['supplierCode'].value,
    };
    if (control.value) {
      this.supplierService.isSupplierCodeValid(supplier).subscribe((data: any) => {
        if (data['status'] === true) {

          control.setErrors(null);
        } else {

          control.setErrors({ duplicateSupplierCode: true });
        }
      });
    }
  }

  validateTaxRegNoCode(controlName: any) {
    const control = this.editSaveSupplierForm.controls[controlName];

    if (control.errors) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    const tax = {
      supplierId: this.selectedRowList?.supplierId || 0,
      taxRegNo: this.editSaveSupplierForm.controls['taxRegistrationNo'].value,
    };

    if (control.value) {
      this.supplierService.isTaxRegNoValid(tax).subscribe((data: any) => {
        if (data['status'] === true) {


          control.setErrors(null);
        } else {

          control.setErrors({ duplicateVatNo: true });
        }
      });
    }
  }

  changeCurrencyConditions() {
    const currencyValue = this.editSaveSupplierForm.controls['currency'].value;

    if (currencyValue?.currencyId == 66) {
      this.isCurrencyValueInr = true;
      this.editSaveSupplierForm.controls['panNo'].enable();
      this.editSaveSupplierForm.controls['tinNo'].enable();
      this.editSaveSupplierForm.controls['gstnState'].enable();
      this.editSaveSupplierForm.controls['gstnNo'].enable();

      this.editSaveSupplierForm.controls['gstnNo'].setValidators([Validators.required]);
      this.editSaveSupplierForm.controls['tinNo'].setValidators([Validators.required]);
      this.editSaveSupplierForm.controls['gstnState'].setValidators([Validators.required]);
      this.editSaveSupplierForm.controls['gstnNo'].setValidators([Validators.required]);
    } else {
      this.isCurrencyValueInr = false;
      this.editSaveSupplierForm.controls['panNo'].setValue(null);
      this.editSaveSupplierForm.controls['tinNo'].setValue(null);
      this.editSaveSupplierForm.controls['gstnState'].setValue(null);
      this.editSaveSupplierForm.controls['gstnNo'].setValue(null);

      this.editSaveSupplierForm.controls['panNo'].disable();
      this.editSaveSupplierForm.controls['tinNo'].disable();
      this.editSaveSupplierForm.controls['gstnState'].disable();
      this.editSaveSupplierForm.controls['gstnNo'].disable();

      this.editSaveSupplierForm.controls['panNo'].clearValidators();
      this.editSaveSupplierForm.controls['tinNo'].clearValidators();
      this.editSaveSupplierForm.controls['gstnState'].clearValidators();
      this.editSaveSupplierForm.controls['gstnNo'].clearValidators();
    }
  }

  checkNgSelectGeneralInfoValue(e: any, controlName: any) {
    if (controlName == 'currency' && e && e.currencyId == 66) {
      this.supplierService.getGstnState().subscribe((data: any) => {
        if (data['status'] === true) {
          this.gstnStateCodes = data['response'];
        } else {
          this.gstnStateCodes = []
        }
      });
    }
    this.changeCurrencyConditions()
  }

  changeSupplierClassification() {
    const supplierClassificationValue = this.editSaveSupplierForm.controls['supplierClassification'].value;

    if (supplierClassificationValue?.enumId != 522) {
      this.exemptionUnderNeeded = false;
      this.editSaveSupplierForm.controls['exemptionUnder'].disable();
      this.editSaveSupplierForm.controls['exemptionUnder'].setValue(null);
    } else {
      this.exemptionUnderNeeded = true;
      this.editSaveSupplierForm.controls['exemptionUnder'].enable();
    }
  }

  changeCurrencyValue() {
    const currencyValue = this.editSaveSupplierForm.controls['currency'].value;

    if (currencyValue?.currencyId == 66) {
      this.editSaveSupplierForm.controls['panNo'].enable();
      this.editSaveSupplierForm.controls['tinNo'].enable();
      this.editSaveSupplierForm.controls['gstnState'].enable();
      this.editSaveSupplierForm.controls['gstnNo'].enable();
    } else {
      this.editSaveSupplierForm.controls['panNo'].disable();
      this.editSaveSupplierForm.controls['tinNo'].disable();
      this.editSaveSupplierForm.controls['gstnState'].disable();
      this.editSaveSupplierForm.controls['gstnNo'].disable();
    }
  }

  enableRights() {
    if (!this.editBit && !this.createBit && this.viewBit) {
      // only view
      if (this.mode == 'new') {
        this.mode = 'view';
        this.disableAddButton = true;
        this.disableSaveButton = false;
        this.editSaveSupplierForm.disable();
      } else {
        this.mode = 'view';
        this.disableAddButton = true;
        this.disableSaveButton = true;
        this.editSaveSupplierForm.disable();
      }
    } else if (!this.createBit && this.editBit && this.viewBit) {
      // edit and view
      if (this.mode == 'new') {
        this.editSaveSupplierForm.disable();
        this.mode = 'view';
        this.disableAddButton = true;
        this.disableSaveButton = false;
      } else {
        this.editSaveSupplierForm.enable();
        this.mode = 'edit';
        this.disableAddButton = true;
        this.disableSaveButton = false;
      }
    } else if (this.createBit && !this.editBit && this.viewBit) {
      // create and view

      if (this.mode == 'new') {
        this.editSaveSupplierForm.enable();
        this.mode = 'new';
        this.disableAddButton = false;
        this.disableSaveButton = false;
      } else {
        this.editSaveSupplierForm.disable();
        this.mode = 'view';
        this.disableAddButton = false;
        this.disableSaveButton = true;
      }
    }
  }
}
