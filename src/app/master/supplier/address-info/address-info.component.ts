import { Component, ViewChild, Input } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { SupplierService } from '../service/supplier.service';
import { NotificationService } from 'src/app/core/services';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-address-info',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.css'],
})
export class AddressInformationComponent {
  @ViewChild('addressModal') addressModal: any;
  @Input() selectedRowList!: any;
  @Input() mode!: string;
  @Input() disableAddButton: boolean = false;
  @Input() disableSaveButton: boolean = false;
  @Input() createBit!: boolean;
  @Input() editBit!: boolean;
  @Input() viewBit!: boolean;
  tableTitle = this.translate.instant('master.supplier.contactAndAddress.addressInformation.titles.addressInformation');

  addAddressBtn: boolean = false;
  excelFileName = this.translate.instant('master.supplier.title.supplierAddressDetailsExcel');
  isModalOpen = false;
  addressTypes = [];
  countries = [];
  cities = [];
  addressRowData: any;
  addressInfoList: any = [];
  columnHeaderList = [
    {
      field: 'addressTypeCode',
      header: this.translate.instant('master.supplier.contactAndAddress.addressInformation.grid.addressTypeCode'),
      width: '9%',
      key: 1
    },
    {
      field: 'address',
      header: this.translate.instant('master.supplier.contactAndAddress.addressInformation.grid.address'),
      width: '9%',
      key: 2

    },
    {
      field: 'countryCode',
      header: this.translate.instant('master.supplier.contactAndAddress.addressInformation.grid.ddlCountry'),
      width: '9%',
      key: 3

    },
    {
      field: 'cityCode',
      header: this.translate.instant('master.supplier.contactAndAddress.addressInformation.grid.ddlCity'),
      width: '9%',
      key: 4

    },
    {
      field: 'zipCode',
      header: this.translate.instant('master.supplier.contactAndAddress.addressInformation.grid.zipCode'),
      width: '9%',
      key: 5

    },
    {
      field: 'phoneNo',
      header: this.translate.instant('master.supplier.contactAndAddress.addressInformation.grid.phoneNo'),
      width: '9%',
      key: 6

    },
    {
      field: 'fax',
      header: this.translate.instant('master.supplier.contactAndAddress.addressInformation.grid.fax'),
      width: '9%',
      key: 7

    },
    {
      field: 'delete',
      header: '',
      width: '10%',
      key: 8

    },
  ];
  addressFormGroup!: FormGroup;
  addressMode: string = 'new';
  addressSubmitted: boolean = false;
  addressDetails: boolean = true;
  saveButton: boolean = false;
  userName: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private loaderService: NgxUiLoaderService,
    private userAuthService: UserAuthService,
    private supplierService: SupplierService,
    public notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.initialStoreFormGroup();
    this.getAddressType();
    this.getCountries();
    this.getAddressInfoList(this.selectedRowList.supplierId);
    this.userName = this.userAuthService.getCurrentUserName();

  }

  getAddressInfoList(supplierId: any) {
    this.supplierService
      .getAddressInfoList(supplierId)
      .subscribe((data: any) => {
        this.addressInfoList = data.response;
      });
  }
  handleDeleteAddressIcon(event: any) {
    this.confirmationService.confirm({
      message: this.translate.instant('common.Information.deleteConfirmation'),
      header: this.translate.instant('common.notificationTitle.confirmation'),
      accept: () => {
        this.deleteAddressInfoList(event);
      },
      reject: () => {
        return false;
      },
    });
  }

  deleteAddressInfoList(event: any) {
    this.supplierService.deleteSupplierAddress(event).subscribe(
      (data: any) => {
        const result = data['response'];
        this.getAddressInfoList(this.selectedRowList.supplierId);

        if (data['status'] === true) {
          this.notificationService.smallBox({
            title: this.translate.instant('common.notificationTitle.success'),
            content: data['message'],
            severity: 'success',
            timeout: 5000,
            icon: 'fa fa-check',
          });
          this.loaderService.stop();
        } else {
          this.notificationService.smallBox({
            title: this.translate.instant('common.notificationTitle.error'),
            content: data['message'],
            severity: 'error',
            timeout: 5000,
            icon: 'fa fa-times',
          });
          this.loaderService.stop();
        }
      },
      (err: any) => {
        this.notificationService.smallBox({
          title: this.translate.instant('common.notificationTitle.error'),
          content: err['message'],
          severity: 'error',
          timeout: 5000,
          icon: 'fa fa-times',
        });
        this.loaderService.stop();
      }
    );
  }

  onSelectionChange(event: any) {
    if (event && event.countryId) {
      this.getCitiesBasedOnCountryId(event.countryId);
    }
    this.addressFormGroup.controls['city'].setValue(null);

  }

  getAddressType() {
    this.supplierService.getAddressType().subscribe(
      (data) => {
        this.addressTypes = data['response'];
      },
      (err) => { }
    );
  }
  getCountries() {
    this.supplierService.getCountries().subscribe(
      (data) => {
        this.countries = data['response'];
      },
      (err) => { }
    );
  }
  getCitiesBasedOnCountryId(countryId: any) {
    this.supplierService
      .getCitiesBasedOnCountryId(countryId)
      .subscribe((data) => {
        if (data.status === true) {
          this.cities = data?.response;
        }
      });
  }

  receiveTableRowData(event: any) {
    this.addressModal.show();
    this.addressMode = 'edit';
    this.addressFormGroup.patchValue({
      addressType: {
        code: event.addressTypeCode,
        enumId: event.addressTypeId,
      },
      country: {
        countryCode: event.countryCode,
        countryId: event.countryId,
      },
      city: {
        cityCode: event.cityCode,
        cityId: event.cityId,
      },
      address: event.address,
      zipCode: event.zipCode,
      phoneNo: event.phoneNo,
      fax: event.fax,
    });
    this.addressRowData = event;
    if (this.editBit == false) {
      this.addressMode = 'view';
      this.addressFormGroup.disable()
    }
  }
  refreshIconClick(event: any) {
    this.getAddressInfoList(this.selectedRowList.supplierId);
  }


  initialStoreFormGroup() {
    this.addressFormGroup = this.formBuilder.group({
      addressType: [[], [Validators.required]],
      address: [[], [Validators.required]],
      country: [[], [Validators.required]],
      city: [[], [Validators.required]],
      zipCode: ['', []],
      phoneNo: ['', []],
      fax: ['', []],
    });
  }
  get addressFormGroupControls(): any {
    return this.addressFormGroup.controls;
  }

  openContactDialog(modeType: string) {
    this.addressModal.show();
    this.addressRowData = null;
    this.isModalOpen = true;
  }
  closeContactDialog() {

    if (this.addressFormGroup.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant("common.Information.unsavedChangesInfo"),
        header: this.translate.instant("common.notificationTitle.confirmation"),
        accept: () => {
          this.addressModal.hide();
          this.addressFormGroup.reset();
          this.addressRowData = null;
          this.addressMode = 'new';
          this.isModalOpen = false;
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.addressModal.hide();
      this.addressFormGroup.reset();
      this.addressRowData = null;
      this.addressMode = 'new';
      this.isModalOpen = false;
    }
  }

  addressFormGroupReset() {

    if (this.addressFormGroup.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant("common.Information.unsavedChangesInfo"),
        header: this.translate.instant("common.notificationTitle.confirmation"),
        accept: () => {
          this.resetContact();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.resetContact();
    }
  }

  resetContact() {
    this.addressSubmitted = false;
    this.addressFormGroup.reset();
    this.addressFormGroup.markAsPristine();
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

  addAddress() {
    if (this.addressFormGroup.invalid) {

      this.validateAllFormFields(this.addressFormGroup);

      return;
    } else {

      if (this.addressFormGroup.dirty) {

        if (this.addressMode === 'new') {
          const addressDetails = {
            supplierId: this.selectedRowList.supplierId,
            addressTypeId:
              this.addressFormGroup.controls['addressType']?.value?.enumId,
            countryId:
              this.addressFormGroup.controls['country']?.value?.countryId,
            cityId: this.addressFormGroup.controls['city']?.value?.cityId,
            address: this.addressFormGroup.controls['address']?.value,
            zipCode: this.addressFormGroup.controls['zipCode']?.value,
            phoneNo: this.addressFormGroup.controls['phoneNo']?.value,
            fax: this.addressFormGroup.controls['fax']?.value,
            modifiedBy: this.userName,
            createdBy: this.userName,
          };
          this.loaderService.start();
          if (this.addressMode === 'new') {
            this.loaderService.start();
            this.supplierService
              .saveAddress(addressDetails)
              .subscribe((data: any) => {
                if (data['status'] === true) {
                  this.getAddressInfoList(this.selectedRowList.supplierId);
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
                  this.addressModal.hide();
                  this.isModalOpen = false;
                  this.addressFormGroup.reset();
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
        } else {
          const addressDetails = {
            supplierId: this.selectedRowList.supplierId,
            addressTypeId:
              this.addressFormGroup.controls['addressType']?.value?.enumId,
            countryId:
              this.addressFormGroup.controls['country']?.value?.countryId,
            cityId: this.addressFormGroup.controls['city']?.value?.cityId,
            address: this.addressFormGroup.controls['address']?.value,
            zipCode: this.addressFormGroup.controls['zipCode']?.value,
            phoneNo: this.addressFormGroup.controls['phoneNo']?.value,
            fax: this.addressFormGroup.controls['fax']?.value,
            modifiedBy: this.userAuthService.getCurrentUserName(),
            createdBy: this.userAuthService.getCurrentUserName(),
            Created: this.addressRowData.created,
            Modified: this.addressRowData.modified,
            supplierAddressId: this.addressRowData.supplierAddressId
          }

          this.loaderService.start();
          if (this.addressMode === 'edit') {
            this.loaderService.start();
            this.supplierService
              .updateAddress(addressDetails)
              .subscribe(
                (data: any) => {
                  if (data["status"] === true) {
                    this.getAddressInfoList(this.selectedRowList.supplierId)
                    this.loaderService.stop();
                    this.notificationService.smallBox({
                      severity: 'success',
                      title: this.translate.instant(
                        'common.notificationTitle.success'
                      ),
                      content: data['message'],
                      timeout: 5000,
                      icon: 'fa fa-check',
                    })
                    this.addressModal.hide();
                    this.isModalOpen = false;
                    this.addressFormGroup.reset();

                  } else {
                    this.loaderService.stop();
                    this.notificationService.smallBox({
                      title: this.translate.instant("common.notificationTitle.error"),
                      content: data["message"],
                      severity: 'error',
                      timeout: 5000,
                      icon: "fa fa-times",
                    });
                  }
                },
              );
          }
        }
      }
    }
  }

  onAddressTypeSelected(controlName: any) {
    const control = this.addressFormGroup.controls[controlName];
    if (control.errors) {
      // return if another validator has already found an error on the matchingControl
      return;
    }
    const paramData = {
      supplierId: this.selectedRowList?.supplierId || 0,
      addressTypeId: this.addressFormGroup.controls[controlName]?.value?.enumId,
      supplierAddressId: this.addressRowData?.supplierAddressId || 0,
    };
    if (control.value) {
      this.supplierService
        .isAddressTypeValid(paramData)
        .subscribe((data: any) => {
          if (data['status'] === true) {
            control.setErrors(null);
          } else {
            control.setErrors({ duplicateAddressType: true });
          }
        });
    }
  }

  checkNgSelectCustomValidator(event: any, controlName: any) {
    const control: any = this.addressFormGroup.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors.required = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });
    } else {
      control.setErrors(null);
    }
  }

  dropdownSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['depotCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotCode'].toLocaleLowerCase() === term ||
      item['depotName'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotName'].toLocaleLowerCase() === term
    );
  }
  dropdownSearchFnCountry(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['countryCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['countryCode'].toLocaleLowerCase() === term ||
      item['countryDescription'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['countryDescription'].toLocaleLowerCase() === term
    );
  }
  dropdownSearchFnCity(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['cityCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['cityCode'].toLocaleLowerCase() === term ||
      item['cityDescription'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['cityDescription'].toLocaleLowerCase() === term
    );
  }
  dropdownSearchFnAddressType(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['code'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['code'].toLocaleLowerCase() === term ||
      item['description'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['description'].toLocaleLowerCase() === term
    );
  }
}
