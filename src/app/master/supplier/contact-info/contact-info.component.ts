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
import { ExcelService } from 'src/app/shared/services/export/excel/excel.service';
import { SupplierService } from '../service/supplier.service';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/core/services';
@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css'],
})
export class ContactInformationComponent {
  @ViewChild('contactModal') contactModal: any;
  @Input() selectedRowList!: any;

  IsCombinationErr: boolean = false;
  addContactBtn: boolean = false;
  supplierContactRowData: any;
  excelFileName = 'Contact And Address';
  tableInitialData: any = [];

  @Input() mode!: string;
  @Input() disableAddButton: boolean = false;
  @Input() disableSaveButton: boolean = false;
  @Input() createBit!: boolean;
  @Input() editBit!: boolean;
  @Input() viewBit!: boolean;
  contactInfoList: any = [];
  editSaveForm!: FormGroup;
  contactMode: string = 'new';
  contactSubmitted: boolean = false;
  contactDetails: boolean = true;
  saveButton: boolean = false;
  tableTitle = this.translate.instant('master.supplier.contactAndAddress.contactInformation.titles.contactInformation');
  columnHeaderList = [
    {
      field: 'contactName',
      header: this.translate.instant('master.supplier.contactAndAddress.contactInformation.grid.contactName'),
      width: '12%',
      key: 1
    },
    {
      field: 'designation',
      header: this.translate.instant('master.supplier.contactAndAddress.contactInformation.grid.designation'),
      key: 2,
      width: '10%',
    },
    {
      field: 'email',
      header: this.translate.instant('master.supplier.contactAndAddress.contactInformation.grid.email'),
      width: '8%',
      key: 3

    },
    {
      field: 'ccEmail',
      header: this.translate.instant('master.supplier.contactAndAddress.contactInformation.grid.ccEmail'),
      width: '8%',
      key: 4

    },
    {
      field: 'mobileNo',
      header: this.translate.instant('master.supplier.contactAndAddress.contactInformation.grid.mobileNo'),
      width: '10%',
      key: 5

    },
    {
      field: 'landlineNo',
      header: this.translate.instant('master.supplier.contactAndAddress.contactInformation.grid.landLineNo'),
      width: '10%',
      key: 6

    },
    {
      field: 'keyContactStatus',
      header: this.translate.instant('master.supplier.contactAndAddress.contactInformation.grid.keyContact'),
      width: '10%',
      key: 7

    },
    {
      field: 'delete',
      header: '',
      width: '2%',
      key: 8

    },
  ];
  isModalOpen = false;
  userName: string = '';


  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private loaderService: NgxUiLoaderService,
    private userAuthService: UserAuthService,
    private excelService: ExcelService,
    private supplierService: SupplierService,
    private confirmationService: ConfirmationService,
    public notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.initialStoreFormGroup();
    this.getContactInfoList(this.selectedRowList.supplierId);
    this.userName = this.userAuthService.getCurrentUserName();
  }
  getContactInfoList(supplierId: any) {
    this.supplierService
      .getContactInfoList(supplierId)
      .subscribe((data: any) => {
        this.contactInfoList = data.response;
      });
  }
  customEmailValidator() {
    return (control: FormControl) => {
      if (!control.value) {
        // Empty value, consider it valid
        return null;
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(control.value)) {
        return { invalidEmail: true }; // Mark as invalid if email format is not valid
      }

      return null; // Valid email
    };
  }

  handleDeleteContactIcon(event: any) {


    this.confirmationService.confirm({
      message: this.translate.instant('common.Information.deleteConfirmation'),
      header: this.translate.instant('common.notificationTitle.confirmation'),
      accept: () => {
        this.deleteContactInfoList(event);
      },
      reject: () => {
        return false;
      },
    });
  }

  deleteContactInfoList(event: any) {
    this.supplierService.deleteSupplierContact(event).subscribe(
      (data: any) => {
        this.getContactInfoList(this.selectedRowList.supplierId);

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

  receiveTableRowData(event: any) {
    this.contactMode = 'edit';
    this.supplierContactRowData = event;
    this.editSaveForm.patchValue(event);
    this.isModalOpen = true;
    this.contactModal.show();
    if (this.editBit == false) {
      this.contactMode = 'view';
      this.editSaveForm.disable()
    }
  }
  refreshIconClick(event: any) {
    this.getContactInfoList(this.selectedRowList.supplierId);
  }


  initialStoreFormGroup() {
    this.editSaveForm = this.formBuilder.group({
      contactName: ['', [Validators.required]],
      designation: ['', []],
      email: ['', [Validators.required]],
      ccEmail: [''],
      mobileNo: ['', []],
      landlineNo: ['', []],
      keyContact: [false, []],
    });
  }

  get contactFormGroupControls(): any {
    return this.editSaveForm.controls;
  }

  openContactDialog(modeType: string) {
    this.contactMode = 'new';
    this.contactModal.show();
    this.resetContact();
    this.isModalOpen = true;

  }
  closeContactDialog() {
    if (this.editSaveForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant("common.Information.unsavedChangesInfo"),
        header: this.translate.instant("common.notificationTitle.confirmation"),
        accept: () => {
          this.contactModal.hide();
          this.isModalOpen = false;

        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.contactModal.hide();
      this.isModalOpen = false;

    }
  }

  contactFormGroupReset() {
    if (this.editSaveForm.dirty) {
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
    this.contactSubmitted = false;
    this.editSaveForm.reset();
    this.editSaveForm.markAsPristine();
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

  closeAddSupplierDialog(action: any = 1) {
    if (action === 2) {
      if (this.editSaveForm.dirty) {
        this.confirmationService.confirm({
          message: this.translate.instant(
            'common.Information.unsavedChangesInfo'
          ),
          header: this.translate.instant(
            'common.notificationTitle.confirmation'
          ),
          accept: () => {
            this.contactModal.hide();
            this.editSaveForm.reset();
          },
          reject: () => {
            return false;
          },
        });
      } else {
        this.contactModal.hide();
        this.editSaveForm.reset();
      }
    } else {
      this.contactModal.hide();
      this.editSaveForm.reset();
    }
  }


  addContact() {

    if (this.editSaveForm.invalid) {
      this.validateAllFormFields(this.editSaveForm);
      return;
    } else {

      if (this.editSaveForm.dirty && !this.IsCombinationErr) {
        let filteredContacts: any;
        if (this.contactMode === 'edit') {
          filteredContacts = this.contactInfoList.filter((x: any) => x.keyContact === true && x.supplierInfoContactId !== this.selectedRowList.supplierInfoContactId);
        } else {
          filteredContacts = this.contactInfoList.filter((x: any) => x.keyContact === true);
        }


        if (filteredContacts.length > 0 && this.contactMode === 'edit' && this.editSaveForm.controls['keyContact'].value == true) {

          this.confirmationService.confirm({
            message: this.translate.instant('master.supplier.contactAndAddress.contactInformation.confirmation.warning'),
            header: this.translate.instant('common.notificationTitle.confirmation'),
            icon: 'fa fa-exclamation-triangle',
            accept: () => {
              const SupplierContactFormValues = {
                supplierInfoContactId:
                  filteredContacts[0].supplierInfoContactId,
                SupplierId: filteredContacts[0].supplierId,
                ContactName: filteredContacts[0].contactName,
                Designation: filteredContacts[0].designation,
                Email: filteredContacts[0].email,
                CCEmail: filteredContacts[0].ccEmail,
                MobileNo: filteredContacts[0].mobileNo,
                LandlineNo: filteredContacts[0].landlineNo,
                KeyContact: false,
                created: filteredContacts[0].created,
                modified: filteredContacts[0].modified,
                createdBy: this.userName,
                modifiedBy: this.userName,
              };

              this.supplierService
                .updateSupplierContact(SupplierContactFormValues)
                .subscribe((data) => {

                  if (data['status'] === true) {
                    this.isModalOpen = false;
                    this.editSaveForm.reset();
                    this.closeAddSupplierDialog();
                    this.getContactInfoList(
                      this.selectedRowList.supplierId
                    );

                    const SupplierContactFormValues1 = {
                      supplierInfoContactId:
                        this.supplierContactRowData.supplierInfoContactId,
                      SupplierId: this.supplierContactRowData.supplierId,
                      ContactName: this.supplierContactRowData.contactName,
                      Designation: this.supplierContactRowData.designation,
                      Email: this.supplierContactRowData.email,
                      CCEmail: this.supplierContactRowData.ccEmail,
                      MobileNo: this.supplierContactRowData.mobileNo,
                      LandlineNo: this.supplierContactRowData.landlineNo,
                      KeyContact: this.supplierContactRowData.keyContact || true,
                      created: this.supplierContactRowData.created,
                      modified: this.supplierContactRowData.modified,
                      createdBy: this.userName,
                      modifiedBy: this.userName,
                    };
                    this.supplierService
                      .updateSupplierContact(SupplierContactFormValues1)
                      .subscribe((data) => {

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
                          this.isModalOpen = false;
                          this.editSaveForm.reset();
                          this.closeAddSupplierDialog();
                          this.getContactInfoList(

                            this.selectedRowList.supplierId
                          );
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
            },
            reject: () => {
              this.isModalOpen = false;
            }
          });
        }
        else if (filteredContacts.length > 0 && this.contactMode === 'new' && this.editSaveForm.controls['keyContact'].value == true) {


          this.confirmationService.confirm({
            message: this.translate.instant('master.supplier.contactAndAddress.contactInformation.confirmation.warning'),
            header: this.translate.instant('master.supplier.contactAndAddress.contactInformation.confirmation.title'),
            icon: 'fa fa-exclamation-triangle',
            accept: () => {
              const SupplierContactFormValues = {
                supplierInfoContactId:
                  filteredContacts[0].supplierInfoContactId,
                SupplierId: filteredContacts[0].supplierId || "",
                ContactName: filteredContacts[0].contactName || "",
                Designation: filteredContacts[0].designation || "",
                Email: filteredContacts[0].email || "",
                CCEmail: filteredContacts[0].ccEmail || "",
                MobileNo: filteredContacts[0].mobileNo || "",
                LandlineNo: filteredContacts[0].landlineNo || "",
                KeyContact: false,
                created: filteredContacts[0].created,
                modified: filteredContacts[0].modified,
                createdBy: this.userName,
                modifiedBy: this.userName,
              };

              this.supplierService
                .updateSupplierContact(SupplierContactFormValues)
                .subscribe((data) => {

                  if (data['status'] === true) {
                    this.getContactInfoList(
                      this.selectedRowList.supplierId
                    );


                    const SupplierContactFormValues = {
                      SupplierId: this.selectedRowList.supplierId,
                      ContactName: this.editSaveForm.value['contactName'],
                      Designation: this.editSaveForm.value['designation'],
                      Email: this.editSaveForm.value['email'],
                      CCEmail: this.editSaveForm.value['ccEmail'],
                      MobileNo: this.editSaveForm.value['mobileNo'],
                      LandlineNo: this.editSaveForm.value['landlineNo'],
                      KeyContact: this.editSaveForm.value['keyContact'] || false,
                      createdBy: this.userName,
                      modifiedBy: this.userName,
                    };

                    this.supplierService
                      .createSupplierContact(SupplierContactFormValues)
                      .subscribe((data) => {
                        if (data['status'] === true) {
                          this.editSaveForm.reset();
                          this.isModalOpen = false;
                          this.closeAddSupplierDialog();
                          this.getContactInfoList(
                            this.selectedRowList.supplierId
                          );
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
            },
            reject: () => {
              this.isModalOpen = false;
            }
          });
        }
        // .............................................normal update and create....................................................

        else if (this.contactMode === 'new' && filteredContacts.length <= 1) {

          const SupplierContactFormValues = {
            SupplierId: this.selectedRowList.supplierId,
            ContactName: this.editSaveForm.value['contactName'],
            Designation: this.editSaveForm.value['designation'],
            Email: this.editSaveForm.value['email'],
            CCEmail: this.editSaveForm.value['ccEmail'],
            MobileNo: this.editSaveForm.value['mobileNo'],
            LandlineNo: this.editSaveForm.value['landlineNo'],
            KeyContact: this.editSaveForm.value['keyContact'] || false,
            createdBy: this.userName,
            modifiedBy: this.userName,
          };

          this.supplierService
            .createSupplierContact(SupplierContactFormValues)
            .subscribe((data) => {
              if (data['status'] === true) {
                this.editSaveForm.reset();
                this.isModalOpen = false;
                this.closeAddSupplierDialog();
                this.getContactInfoList(

                  this.selectedRowList.supplierId
                );
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
        } else if (this.contactMode === 'edit') {
          const SupplierContactFormValues = {
            supplierInfoContactId:
              this.supplierContactRowData.supplierInfoContactId,
            SupplierId: this.selectedRowList.supplierId,
            ContactName: this.editSaveForm.value['contactName'],
            Designation: this.editSaveForm.value['designation'],
            Email: this.editSaveForm.value['email'],
            CCEmail: this.editSaveForm.value['ccEmail'],
            MobileNo: this.editSaveForm.value['mobileNo'],
            LandlineNo: this.editSaveForm.value['landlineNo'],
            KeyContact: this.editSaveForm.value['keyContact'] || false,
            created: this.supplierContactRowData.created,
            modified: this.supplierContactRowData.modified,
            createdBy: this.userName,
            modifiedBy: this.userName,
          };
          this.supplierService
            .updateSupplierContact(SupplierContactFormValues)
            .subscribe((data) => {

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
                this.isModalOpen = false;
                this.editSaveForm.reset();
                this.closeAddSupplierDialog();
                this.getContactInfoList(

                  this.selectedRowList.supplierId
                );
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
    }
  }

  onChangeInput() {


    if (this.contactMode === "new") {
      let combinationObj = {
        supplierId:
          this.selectedRowList.supplierId,
        supplierInfoContactId: 0,
        contactName: this.editSaveForm.value['contactName'],
        designation: this.editSaveForm.value['designation'],
        email: this.editSaveForm.value['email'],
        ccEmail: this.editSaveForm.value['ccEmail'],
        mobileNo: this.editSaveForm.value['mobileNo'],
        landLineNo: this.editSaveForm.value['landlineNo'],
      };
      this.checkCombinationContact(combinationObj)
    } else {
      let combinationObj = {
        supplierId:
          this.selectedRowList.supplierId,
        supplierInfoContactId: this.supplierContactRowData.supplierInfoContactId,
        contactName: this.editSaveForm.value['contactName'],
        designation: this.editSaveForm.value['designation'],
        email: this.editSaveForm.value['email'],
        ccEmail: this.editSaveForm.value['ccEmail'],
        mobileNo: this.editSaveForm.value['mobileNo'],
        landLineNo: this.editSaveForm.value['landlineNo'],
      };
      this.checkCombinationContact(combinationObj)
    }
    this.validateEmail('email');

  }

  checkCombinationContact(combinationObject: any) {

    this.supplierService
      .checkSupplierContactCombination(combinationObject)
      .subscribe((data: any) => {
        if (data['status'] === false) {
          this.IsCombinationErr = true;
        } else {
          this.IsCombinationErr = false;
        }
      });
  }

  checkNgSelectCustomValidator(event: any, controlName: any) {
    const control: any = this.editSaveForm.controls[controlName];
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
  validateEmail(controlName: any) {
    this.editSaveForm.controls[controlName].setValue(this.editSaveForm.controls[controlName].value !== null ? this.editSaveForm.controls[controlName].value.replace(/\s/g, "") : null);
    const control = this.editSaveForm.controls[controlName].value;
    const control1 = this.editSaveForm.controls[controlName];
    const x = control;
    if (control) {
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const result = x.split(/,/);
      const dotPattern = /^(?!.*?\.\.).*?$/;
      const underScorePattern = /^(?!.*?\_\_).*?$/;
      const hiphenPattern = /^(?!.*?\-\-).*?$/;
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          if (!regex.test(result[i])) {
            if (controlName === "email") {
              control1.setErrors({ pattern: true });
              return;
            }
            if (controlName === "ccEmail") {
              control1.setErrors({ pattern: true });
              return;
            }

          } else {
            const splitStrings = result[i].split("@");
            if (splitStrings.length === 2) {
              /*Not Allowing more than 2 @ */
              const email = splitStrings[0];
              const email1 = splitStrings[1];
              if (
                dotPattern.test(email) &&
                underScorePattern.test(email) &&
                hiphenPattern.test(email1)
              ) {
                if (
                  email.substring(0, 1) === "." ||
                  email1.substring(0, 1) === "." ||
                  email1.substring(0, 1) === "-" ||
                  email.substring(0, 1) === "<" ||
                  email.substring(0, 1) === ">" ||
                  email.substring(0, 1) === "[" ||
                  email.substring(0, 1) === "]" ||
                  email.substring(0, 1) === "," ||
                  email.substring(0, 1) === ":"
                ) {
                  if (controlName === "email") {
                    control1.setErrors({ pattern: true });
                    return;
                  }
                  if (controlName === "ccEmail") {
                    control1.setErrors({ pattern: true });
                    return;
                  }

                } else {
                  if (controlName === "email") {
                    control1.setErrors(null);
                  }
                  if (controlName === "ccEmail") {
                    control1.setErrors(null);
                  }

                }
              } else {
                // Not allow consecutive dots or consecutive_ /
                if (controlName === "email") {
                  control1.setErrors({ pattern: true });
                  return;
                }
                if (controlName === "ccEmail") {
                  control1.setErrors({ pattern: true });
                  return;
                }

              }
            } else {
              if (controlName === "email") {
                control1.setErrors({ pattern: true });
                return;
              }
              if (controlName === "ccEmail") {
                control1.setErrors({ pattern: true });
                return;
              }

            }
          }
        }
      } else {
        if (!regex.test(control)) {
          if (controlName === "email") {
            control1.setErrors({ pattern: true });
            return;
          }
          if (controlName === "ccEmail") {
            control1.setErrors({ pattern: true });
            return;
          }

        }
      }
    } else {
      if (controlName === "email") {
        this.contactFormGroupControls.toEmailId.setValidators([
          Validators.required,
        ]);
        this.contactFormGroupControls.toEmailId.updateValueAndValidity();
      }
      if (controlName === "ccEmail") {
        this.contactFormGroupControls.ccEmailId.setValidators([
          Validators.required,
        ]);
        this.contactFormGroupControls.ccEmailId.updateValueAndValidity();
      }
    }
    return true;
  }


}
