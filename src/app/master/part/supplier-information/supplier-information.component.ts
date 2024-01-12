import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PartService } from '../service/part.service';
import { SharedLazyTableComponent } from 'src/app/shared/components/shared-lazy-table/shared-lazy-table.component';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { NotificationService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { ExcelService } from 'src/app/shared/services/export/excel/excel.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-supplier-information',
  templateUrl: './supplier-information.component.html',
  styleUrls: ['./supplier-information.component.css'],
})
export class SupplierInformationComponent {
  @ViewChild('addsupplierModel') addsupplierModel: any;
  @ViewChild("sharedLazyTable") sharedLazyTableChild: SharedLazyTableComponent | undefined;
  @Input() partInformation!: any;
  @Input() partId!: number;
  @Input() disableAddButton: boolean = false;
  @Input() disableSaveButton: boolean = false;

  addStoreRateBtn: boolean = false;
  addSupplierEditForm!: FormGroup;
  supplierInformationTableFilterFormGroup!: FormGroup;
  supplierDetails: any;
  supplierInfoMode: string = 'new'; //Supplier Information mode
  partSupplierRowData: any;
  tableParams = { first: 0, rows: 10 };
  tableInitialData: any = [];
  submitted = false;
  supplierCodes = [];
  associatedDepots = [];
  excelDataTable!: any;
  serverSideProcessing!: any;
  totalDataGridCountComp: any;
  currentUserName: any;
  currentCompanyId: any;
  currentUserId: any;
  excelFileName: any;
  tableColumnHeaderList = [
    {
      field: 'supplierCode',
      header: this.translate.instant('master.part.grid.titles.supplierCode'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'supplierName',
      header: this.translate.instant('master.part.grid.titles.supplierName'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'manufactureStatus',
      header: this.translate.instant('master.part.grid.titles.manufacture'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'supplierMfrPartRefNo',
      header: this.translate.instant('master.part.grid.titles.supplierMfrPartRefNo'),
      width: '12%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'country',
      header: this.translate.instant('master.part.grid.titles.country'),
      width: '6%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'city',
      header: this.translate.instant('master.part.grid.titles.city'),
      width: '6%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'associatedDepots',
      header: this.translate.instant('master.part.grid.titles.associatedDepots'),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
    },
    {
      header: 'Delete',
      field: 'delete',
      width: '2%',
      isFilter: false,
      isSubHeader: false,
      type: 'string',
      key: 8,
    },
  ];

  //search function for curreny dropdown
  currencyCustomSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item.currencyCode.toLocaleLowerCase().indexOf(term) > -1 ||
      item.currencyCode.toLocaleLowerCase() === term ||
      item.currencyDescription.toLocaleLowerCase().indexOf(term) > -1 ||
      item.currencyDescription.toLocaleLowerCase() === term
    );
  }
  // field validator
  checkNgSelectGeneralInfoValue(event: any, controlName: any) {
    const control = this.addSupplierEditFormControls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors.required = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });
      control.errors.required = false;
    } else {
      control.setErrors(null);
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private sharedTableStoreService: SharedTableStoreService,
    private partService: PartService,
    private loaderService: NgxUiLoaderService,
    private userAuthService: UserAuthService,
    private translate: TranslateService,
    public notificationService: NotificationService,
    private excelService: ExcelService,
    private confirmationService: ConfirmationService

  ) { }
  resetForm() {
    this.addSupplierEditForm.controls['supplierName'].disable();
    this.addSupplierEditForm.controls['country'].disable();
    this.addSupplierEditForm.controls['city'].disable();
    this.addSupplierEditForm.controls['associatedDepots'].disable();
    this.addSupplierEditForm.controls['manuFacture'].disable();
    this.addSupplierEditForm.controls['manuFacture'].setValue(false);
  }
  // intializing addSupplierEditForm
  initialAddSupplierEditFormGroup() {
    this.addSupplierEditForm = this.formBuilder.group({
      supplierCode: [[], [Validators.required]],
      supplierName: ['', []],
      manuFacture: [false, []],
      supplierMfrPartRefNo: ['', []],
      country: ['', []],
      city: ['', []],
      associatedDepots: ['', []],
      supplierId: ['', []],
    });

    this.resetForm();
  }
  // intializing SupplierInformationTableFilterFormGroup
  initialSupplierInformationTableFilterFormGroup() {
    this.supplierInformationTableFilterFormGroup = this.formBuilder.group({
      supplierName: ['', []],
      supplierCode: ['', []],
      manufactureStatus: ['', []],
      supplierMfrPartRefNo: ['', []],
      country: ['', []],
      city: ['', []],
      associatedDepots: ['', []],
    });
  }
  //to handle manufacturer toggle
  onChangeActive(controlName: string) {
    const control = this.addSupplierEditForm.controls[controlName];
  }
  //to clear addSupplierEditForm
  clearForm() {
    if (this.addSupplierEditForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant("common.Information.unsavedChangesInfo"),
        header: this.translate.instant("common.notificationTitle.confirmation"),
        accept: () => {
          this.addSupplierEditForm.reset();
          this.resetForm();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.addSupplierEditForm.reset();
      this.resetForm();
    }
  }

  ngOnInit() {
    this.excelFileName = this.translate.instant("master.part.titles.supplierInformationList")
    this.currentUserName = this.userAuthService.getCurrentUserName();
    this.currentCompanyId = this.userAuthService.getCurrentCompanyId()
    this.currentUserId = this.userAuthService.getCurrentUserId()
    this.initialAddSupplierEditFormGroup();
    this.getSupplierCode();
    this.initialSupplierInformationTableFilterFormGroup();

  }
  //to get supplier code
  getSupplierCode() {
    this.partService.getSupplierCode().subscribe(
      (data) => {
        this.supplierCodes = data['response'];
      },
      (err) => { }
    );
  }
  //to get controls for addSupplierEditForm
  get addSupplierEditFormControls(): any {
    return this.addSupplierEditForm.controls;
  }

  // recieve row data from supplier information list grid
  receiveTableRowData(event: any) {
    const associatedDepotsList = event.associatedDepotsList
    this.addSupplierEditForm.patchValue(event);
    this.addSupplierEditForm.patchValue({
      associatedDepots: associatedDepotsList
    });
    this.addsupplierModel.show();
    this.supplierInfoMode = 'edit';
    this.partSupplierRowData = event;
  }
  //to validate form fields
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
  //function to handle create and update supplier mapping
  onSubmit() {
    if (this.addSupplierEditForm.invalid) {
      this.validateAllFormFields(this.addSupplierEditForm);
      return;
    } else {
      if (this.addSupplierEditForm.dirty) {
        if (this.supplierInfoMode === 'new') {
          const partSupplierValues = {
            partId: this.partInformation.partId,
            supplierId: this.addSupplierEditForm.value.supplierCode.supplierId,
            supplierMfrPartRefNo:
              this.addSupplierEditForm.value.supplierMfrPartRefNo,
            CreatedBy: this.currentUserName,
            ModifiedBy: this.currentUserName,
          };
          this.partService
            .createSupplierMapping(partSupplierValues)
            .subscribe((data) => {
              if (data['status'] === true) {

                this.closeAddSupplierDialog()
                this.getSupplierListServerSide(this.tableParams)
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
          const partSupplierValues = {
            PartId: this.partSupplierRowData.partId,
            PartSupplierId: this.partSupplierRowData.partSupplierId,
            SupplierId: this.addSupplierEditForm.value.supplierCode.supplierId
              ? this.addSupplierEditForm.value.supplierCode.supplierId
              : this.partSupplierRowData.supplierId,
            SupplierMfrPartRefNo:
              this.addSupplierEditForm.value.supplierMfrPartRefNo,
            Created: this.partSupplierRowData.created,
            Modified: this.partSupplierRowData.modified,
            CreatedBy: this.currentUserName,
            ModifiedBy: this.currentUserName,
          };

          this.partService
            .updateSupplierMapping(partSupplierValues)
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
                this.getSupplierListServerSide(this.tableParams)
                this.closeAddSupplierDialog()
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
  // to show add part supplier modal
  openAddSupplierDialog(modeType: string) {
    this.addSupplierEditForm.reset();
    this.supplierInfoMode = 'new';
    this.addsupplierModel.show();
    this.partSupplierRowData.partSupplierId = 0;
  }
  // to close add part supplier modal
  closeAddSupplierDialog(action: any = 1) {
    if (action === 2) {
      if (this.addSupplierEditForm.dirty) {
        this.confirmationService.confirm({
          message: this.translate.instant("common.Information.unsavedChangesInfo"),
          header: this.translate.instant("common.notificationTitle.confirmation"),
          accept: () => {
            this.addsupplierModel.hide();
            this.addSupplierEditForm.reset();

          },
          reject: () => {
            return false;
          },
        });
      } else {
        this.addsupplierModel.hide();
        this.addSupplierEditForm.reset();

      }
    } else {
      this.addsupplierModel.hide();
      this.addSupplierEditForm.reset();
    }
  }

  checkNgSelectValue(event: any, controlName: any) {
    const control = this.addSupplierEditForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.addSupplierEditForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }
  //supplier code dropdown search function
  dropdownSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['supplierCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['supplierCode'].toLocaleLowerCase() === term
    );
  }
  //to get supplier details on supplier code change
  checkNgSelectValuePurchaseSupplierCode(event: any, controlName: any) {
    this.partService
      .getSupplierDetailsBySupplierID(event.supplierId)
      .subscribe((data: any) => {
        if (data['response']) {
          this.supplierDetails = data['response'];
          this.addSupplierEditForm.controls['supplierName'].setValue(
            data['response']?.supplierName
          );
          this.addSupplierEditForm.controls['manuFacture'].setValue(
            data['response']?.manufacturer
          );
          this.addSupplierEditForm.controls['country'].setValue(
            data['response']?.country
          );
          this.addSupplierEditForm.controls['city'].setValue(
            data['response']?.city
          );
          this.addSupplierEditForm.controls['associatedDepots'].setValue(
            data['response']?.associatedDepotsList
          );
        }
      });
  }

  // to get part-supplier information list data for supplier mapping list view lazy table
  getSupplierListServerSide(params: any) {

    if (this.partInformation.partId != 0) {

      this.serverSideProcessing = {
        CurrentPage: params.first,
        GlobalFilter:
          params.globalFilter != undefined
            ? params.globalFilter
            : this.sharedLazyTableChild != undefined
              ? this.sharedLazyTableChild.globalFilter.value
              : null,
        PageSize: params.rows,
        SortField: params.sortField ? params.sortField : "sortOnly",
        SortOrder: params.sortField
          ? params.sortOrder
            ? params.sortOrder
            : -1
          : -1,
        partId: this.partInformation.partId,

        supplierCode: this.supplierInformationTableFilterFormGroup.value.supplierCode || "",
        supplierName: this.supplierInformationTableFilterFormGroup.value.supplierName || "",
        manufacture: this.supplierInformationTableFilterFormGroup.value.manufactureStatus || "",
        supplierMfrPartRefNo: this.supplierInformationTableFilterFormGroup.value.supplierMfrPartRefNo || "",
        country: this.supplierInformationTableFilterFormGroup.value.country || "",
        city: this.supplierInformationTableFilterFormGroup.value.city || "",
        associatedDepots: this.supplierInformationTableFilterFormGroup.value.associatedDepots || ""
      };
      this.loaderService.start();

      this.partService
        .getSupplierListServerSide(
          this.serverSideProcessing,
          this.currentCompanyId,
          this.currentUserId
        )
        .subscribe((data: any) => {

          this.tableInitialData = data["response"].result;
          this.totalDataGridCountComp = data["response"].filterRecordCount;
          this.sharedTableStoreService.setAssignGridData({ data, params });
          this.loaderService.stop();
        });
      this.loaderService.stop();
    }
  }
  //function to export supplier information table data in to excel
  exportToExcel(event: any) {
    let newColumns = event.columns.filter((key: any) => key.field != 'delete')
    newColumns.map((item: { [x: string]: any; field: string; }) => {
    })
    this.excelDataTable = [];
    this.excelDataTable.columns = newColumns;
    this.excelDataTable.filteredValue = undefined;
    let dowloaded: boolean;
    let params: any = { first: 0, rows: this.totalDataGridCountComp };

    const serverSideProcessing = {
      CurrentPage: params.first,
      GlobalFilter:
        params.globalFilter != undefined
          ? params.globalFilter
          : this.sharedLazyTableChild != undefined
            ? this.sharedLazyTableChild.globalFilter.value
            : null,
      PageSize: params.rows,
      SortField: params.sortField ? params.sortField : "sortOnly",
      SortOrder: params.sortField
        ? params.sortOrder
          ? params.sortOrder
          : -1
        : -1,
      partId: this.partInformation.partId,

      supplierCode: this.supplierInformationTableFilterFormGroup.value.supplierCode || "",
      supplierName: this.supplierInformationTableFilterFormGroup.value.supplierName || "",
      manufacture: this.supplierInformationTableFilterFormGroup.value.manufactureStatus || "",
      supplierMfrPartRefNo: this.supplierInformationTableFilterFormGroup.value.supplierMfrPartRefNo || "",
      country: this.supplierInformationTableFilterFormGroup.value.country || "",
      city: this.supplierInformationTableFilterFormGroup.value.city || "",
      associatedDepots: this.supplierInformationTableFilterFormGroup.value.associatedDepots || ""
    };


    this.loaderService.start();

    this.partService
      .getSupplierListServerSide(
        serverSideProcessing,
        this.currentCompanyId,
        this.currentUserId
      )
      .subscribe((data: any) => {


        this.excelDataTable.value = data["response"].result;
        dowloaded = this.excelService.exportAsExcelFile(this.excelDataTable, "Part Supplier Mapping List", false);
        this.loaderService.stop();
      });
    this.loaderService.stop();


  }

  // Custom validation for supplier Code field
  validateSupplierCode(controlName: string) {
    const control = this.addSupplierEditForm.controls[controlName];
    if (control.errors) {
      return;
    }
    const supplierIdValue = this.addSupplierEditForm.controls[controlName].value;
    const supplier = {
      supplierId: supplierIdValue?.supplierId,
      partId: this.partInformation.partId,
      PartSupplierId: this.partSupplierRowData?.partSupplierId || 0
    };
    if (control.value) {
      this.partService.isSupplierCodeValid(supplier).subscribe(((data: any) => {
        if (data['status'] === true) {
          control.setErrors(null);
        } else {
          control.setErrors({ duplicateSupplierCode: true });
        }
      }));

    }
  }

  //delete row data from supplier information grid
  deleteRowData(event: any) {
    this.confirmationService.confirm({
      header: this.translate.instant("common.notificationTitle.confirmation"),
      message: this.translate.instant("common.Information.deleteConfirmation"),

      accept: () => {

        this.partService.deletePartSupplier(event.partSupplierId, event.supplierCode).subscribe(

          (data) => {
            const result = data["response"];
            if (data["status"] === true) {
              this.getSupplierListServerSide(this.tableParams)

              this.notificationService.smallBox({
                title: this.translate.instant("common.notificationTitle.success"),
                content: data["message"],
                severity: 'success',
                timeout: 5000,
                icon: "fa fa-check",
              });
              this.loaderService.stop();
            } else {
              this.notificationService.smallBox({
                title: this.translate.instant("common.notificationTitle.error"),
                content: data["message"],
                severity: 'error',
                timeout: 5000,
                icon: "fa fa-times",
              });
              this.loaderService.stop();
            }
          },
          (err) => {
            this.notificationService.smallBox({
              title: this.translate.instant("common.notificationTitle.error"),
              content: err["message"],
              severity: 'error',
              timeout: 5000,
              icon: "fa fa-times",
            });
            this.loaderService.stop();
          }
        );

      },
      reject: () => {
        return false;
      },
    });

  }
}
