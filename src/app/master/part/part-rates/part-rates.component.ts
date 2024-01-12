import { Component, Input, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SharedLazyTableComponent } from 'src/app/shared/components/shared-lazy-table/shared-lazy-table.component';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PartService } from '../service/part.service';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { NotificationService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { ExcelService } from 'src/app/shared/services/export/excel/excel.service';
import { enGbLocale } from "ngx-bootstrap/locale";
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-part-rates',
  templateUrl: './part-rates.component.html',
  styleUrls: ['./part-rates.component.css'],
})
export class PartRatesComponent {
  @ViewChild('addsupplierModel') addsupplierModel: any;
  @ViewChild('sharedLazyTable') sharedLazyTableChild:
    | SharedLazyTableComponent
    | undefined;
  @ViewChild("remarksPopup") remarksPopup: any;
  @Input() disableAddButton: boolean = false;
  @Input() disableSaveButton: boolean = false;
  @Input() partInformation!: any;
  addStoreRateBtn: boolean = false;
  partRateRowData: any;
  depotTypes = [];
  partRateMode: string = 'new';
  PartRatesTableFilterFormGroup!: FormGroup;
  tableParams = { first: 0, rows: 10 };
  globalParam: any;
  remarks: string = '';
  submitted = false;
  currentUserName: any;
  currentCompanyId: any;
  currentUserId: any;
  tableInitialData = [];
  addPartRatesEditForm!: FormGroup;
  currencyTypes: any = []
  excelDataTable!: any;
  serverSideProcessing!: any;
  totalDataGridCountComp: any;
  excelFileName: any;
  ngOnInit() {
    this.addPartRatesEditForm = this.formBuilder.group({
      partCode: [{ value: '', disabled: true }, [Validators.required]],
      currency: [{ value: [], disabled: true }, [Validators.required]],
      depot: [[], [Validators.required]],
      rate: [
        '',
        [Validators.required, Validators.min(0.0), Validators.max(999999.99)],
      ],
      effectiveDate: [[], [Validators.required]],
      remarks: ['', []],
    });
    this.excelFileName = this.translate.instant('master.part.titles.partRateList')
    this.initialPartRatesTableFilterFormGroup();
    this.currentUserName = this.userAuthService.getCurrentUserName();
    this.currentCompanyId = this.userAuthService.getCurrentCompanyId()
    this.currentUserId = this.userAuthService.getCurrentUserId()
  }

  constructor(
    private formBuilder: FormBuilder,
    private sharedTableStoreService: SharedTableStoreService,
    private partService: PartService,
    private loaderService: NgxUiLoaderService,
    private userAuthService: UserAuthService,
    public notificationService: NotificationService,
    private translate: TranslateService,
    private excelService: ExcelService,
    private confirmationService: ConfirmationService,
    private localeService: BsLocaleService,
  ) {
    enGbLocale.invalidDate = "";
    defineLocale("custom locale", enGbLocale);
    this.localeService.use("custom locale");
  }

  clearForm() {
    this.addPartRatesEditForm.reset();
    this.addPartRatesEditForm.controls['partCode'].setValue(
      this.partInformation.partCode
    );
    this.partRateRowData = null;
    this.addPartRatesEditForm.controls['effectiveDate'].markAsDirty();

  }
  initialPartRatesTableFilterFormGroup() {
    this.PartRatesTableFilterFormGroup = this.formBuilder.group({
      partRateId: ['', []],
      partCode: ['', []],
      currency: ['', []],
      depot: ['', []],
      rate: ['', []],
      effectiveDateString: ['', []],
      remarks: ['', []],
    });
  }

  tableColumnHeaderList = [
    {
      field: 'partCode',
      header: this.translate.instant('master.part.grid.titles.partCode'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'depot',
      header: this.translate.instant('master.part.grid.titles.depot'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'currency',
      header: this.translate.instant('master.part.grid.titles.currency'),

      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'rate',
      header: this.translate.instant('master.part.grid.titles.rate'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'effectiveDateString',
      header: this.translate.instant('master.part.grid.titles.effectiveDate'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'remarks',
      header: this.translate.instant('master.part.grid.titles.remarks'),
      width: '8%',
      isFilter: false,
      isSubHeader: false,
      type: 'string',
      showHeaderIcon: false,
      isIcon: true,
      key: 6,
    },
    {
      header: 'Delete',
      field: 'delete',
      width: '2%',
      isFilter: false,
      isSubHeader: false,
      type: 'string',
      key: 7,
    }
  ];
  formatDate(inputDate: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    };
    const dateParts = inputDate.split(' ')[0].split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', options);
  }
  receiveTableRowData(event: any) {
    this.partRateMode = 'edit'
    this.addPartRatesEditForm.patchValue(
      {
        depot: {
          depotCode: event.depot,
          depotId: event.depotId
        },
        currency: {
          currencyCode: event.currency,
          currencyId: event.currencyId,
        },
        partCode: {
          partCode: event.partCode,
          partId: event.partId,
        },
        rate: event.rate,
        effectiveDate: event.effectiveDate,
        remarks: event.remarks,
        partRateId: event.partRateId
      }
    );
    this.partRateRowData = event;
    this.addPartRatesEditForm.controls['effectiveDate'].setValue(
      this.formatDate(event.effectiveDate)
    );
    this.addsupplierModel.show();
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
  onSubmit() {
    if (this.addPartRatesEditForm.invalid) {
      this.validateAllFormFields(this.addPartRatesEditForm);
      return;
    } else {

      if (this.addPartRatesEditForm.dirty) {

        if (this.partRateMode === 'new') {
          const partRateFormValues = {
            partId: this.partInformation.partId,
            depotId: this.addPartRatesEditForm.value['depot'].depotId,
            currencyId: this.addPartRatesEditForm.controls['currency'].value.currencyId,
            rate: this.addPartRatesEditForm.value.rate,
            effectiveDate:
              this.addPartRatesEditForm.value.effectiveDate.toDateString(
                "yyyy-MM-ddT00:00:00"
              ),
            remarks: this.addPartRatesEditForm.value.remarks,
            createdBy: this.currentUserName,
            modifiedBy: this.currentUserName,
          };
          this.partService
            .createPartRate(partRateFormValues)
            .subscribe((data) => {

              if (data['status'] === true) {

                this.addPartRatesEditForm.reset();

                this.closeAddSupplierDialog();
                this.getPartRatesListServerSide(this.tableParams);

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
          const partRateValues = {
            partId: this.partInformation.partId,
            partRateId: this.partRateRowData.partRateId,
            depotId: this.partRateRowData.depotId,
            currencyId: this.partRateRowData.currencyId,
            rate: this.addPartRatesEditForm.value.rate,
            effectiveDate: this.addPartRatesEditForm.value.effectiveDate.toDateString(
              "yyyy-MM-ddT00:00:00"
            ),
            remarks: this.addPartRatesEditForm.value.remarks,
            created: this.partRateRowData.created,
            modified: this.partRateRowData.modified,
            createdBy: this.currentUserName,
            modifiedBy: this.currentUserName,
          };
          this.partService.updatePartRate(partRateValues).subscribe((data) => {
            if (data['status'] === true) {
              this.addPartRatesEditForm.reset();
              this.notificationService.smallBox({
                severity: 'success',
                title: this.translate.instant(
                  'common.notificationTitle.success'
                ),
                content: data['message'],
                timeout: 5000,
                icon: 'fa fa-check',
              });
              this.closeAddSupplierDialog();
              this.getPartRatesListServerSide(this.tableParams);
            } else {
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
    }
  }
  closeAddSupplierDialog(action: any = 1) {
    if (action === 2) {
      if (this.addPartRatesEditForm.dirty) {
        this.confirmationService.confirm({
          message: this.translate.instant("common.Information.unsavedChangesInfo"),
          header: this.translate.instant("common.notificationTitle.confirmation"),
          accept: () => {
            this.addsupplierModel.hide();
            this.addPartRatesEditForm.reset();
          },
          reject: () => {
            return false;
          },
        });
      } else {
        this.addsupplierModel.hide();
        this.addPartRatesEditForm.reset();
      }
    } else {
      this.addsupplierModel.hide();
      this.addPartRatesEditForm.reset();
    }
  }

  getActiveDepot() {
    this.partService.getActiveDepot(this.currentUserId).subscribe((res) => {
      if (res.status === true) {
        if (res.response.length === 1) {
          this.addPartRatesEditForm.controls['depot'].setValue(res.response[0]);
          this.addPartRatesEditForm.controls['depot'].disable();
          this.partService.getCurrencyBasedOnDepot(this.addPartRatesEditForm.controls['depot']).subscribe((data) => {
            if (data.status == true && data.response.length > 0) {
              this.addPartRatesEditForm.controls['currency'].setValue({
                currencyId: data.response[0].currencyId,
                currencyCode: data.response[0].currencyCode
              })
            } else {
              this.addPartRatesEditForm.controls['currency'].setValue(null)
            }
          })
        } else {
          this.depotTypes = res.response
        }
      }
    })
  }

  onChangeDepot(event: any) {
    this.partService.getCurrencyBasedOnDepot(event.depotId).subscribe((data) => {
      if (data.status == true) {
        this.addPartRatesEditForm.controls['currency'].setValue(data.response[0])
        this.addPartRatesEditForm.patchValue({
          currency: data.response[0]
        })
      } else {
        this.addPartRatesEditForm.controls['currency'].setValue(null)
      }
    })
  }
  getCurrencyBasedOnDepot() {
    this.partService.getCurrencyBasedOnDepot(this.addPartRatesEditForm.controls['depot']).subscribe((data) => {
      if (data.status == true && data.response.length > 0) {
        this.addPartRatesEditForm.controls['currency'].setValue({
          currencyId: data.response[0].currencyId,
          currencyCode: data.response[0].currencyCode
        })
      } else {
        this.addPartRatesEditForm.controls['currency'].setValue(null)
      }
    })
  }



  get addPartRatesEditFormControls(): any {
    return this.addPartRatesEditForm.controls;
  }

  openAddSupplierDialog(modeType: string) {
    this.partRateMode = 'new'
    this.addPartRatesEditForm.controls['partCode'].setValue(
      this.partInformation.partCode
    );
    this.getActiveDepot();
    this.partRateRowData = null;
    this.addsupplierModel.show();
    this.addPartRatesEditForm.markAsPristine();
  }

  validaterate(controlName: any): any {
    const control = this.addPartRatesEditForm.controls[controlName];
    if (control.errors) {
      return null;
    }
    if (control.value) {
      if (control.value <= 0 || control.value > 9999999999.9999) {
        control.setErrors({ invalidRate: true });
      } else {
        control.setErrors(null);
      }
    }
  }

  getPartRatesListServerSide(params: any) {
    this.globalParam = params;
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
        partCode: this.PartRatesTableFilterFormGroup.value.partCode || "",
        depot: this.PartRatesTableFilterFormGroup.value.depot || "",
        currency: this.PartRatesTableFilterFormGroup.value.currency || "",
        rate: this.PartRatesTableFilterFormGroup.value.rate || "",
        effectiveDate: this.PartRatesTableFilterFormGroup.value.effectiveDateString || "",
        remarks: this.PartRatesTableFilterFormGroup.value.remarks || "",
      };
      this.loaderService.start();

      this.partService
        .getPartRatesListServerSide(
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
      partCode: this.PartRatesTableFilterFormGroup.value.partCode || "",
      depot: this.PartRatesTableFilterFormGroup.value.depot || "",
      currency: this.PartRatesTableFilterFormGroup.value.currency || "",
      rate: this.PartRatesTableFilterFormGroup.value.rate || "",
      effectiveDate: this.PartRatesTableFilterFormGroup.value.effectiveDateString || "",
      remarks: this.PartRatesTableFilterFormGroup.value.remarks || "",
    };
    this.loaderService.start();
    this.partService
      .getPartRatesListServerSide(
        serverSideProcessing,
        this.currentCompanyId,
        this.currentUserId
      )
      .subscribe((data: any) => {
        this.excelDataTable.value = data["response"].result;
        dowloaded = this.excelService.exportAsExcelFile(this.excelDataTable, "Part Rates List", false);
        this.loaderService.stop();
      });
    this.loaderService.stop();
  }

  // to handle combination check on date input
  handleDateInput(event: any) {
    this.addPartRatesEditForm.controls['effectiveDate'].markAsDirty();
    this.addPartRatesEditForm.controls['effectiveDate'].setValue(event)
    const control = this.addPartRatesEditForm.controls['effectiveDate'].getRawValue();
    if (this.addPartRatesEditForm.controls['effectiveDate'].errors) {
      return;
    }
    const effectiveDateValue = this.addPartRatesEditForm.controls['effectiveDate'].value;
    const depotId = this.addPartRatesEditForm.value['depot'];
    const depotIdValue = depotId?.depotId;
    const effectiveDate = {
      depotId: depotIdValue || 0,
      rate: this.addPartRatesEditForm.value['rate'] || 0,
      partRateId: this.partRateRowData?.partRateId || 0,
      effectiveDate: this.formatDateValueChange(this.addPartRatesEditForm.controls['effectiveDate'].value),
    };

    if (control) {
      this.partService.isEffectiveDateCombinationValid(effectiveDate).subscribe(((data: any) => {
        if (data['status'] === true) {
          this.addPartRatesEditForm.controls['effectiveDate'].setErrors(null);
        } else {
          this.addPartRatesEditForm.controls['effectiveDate'].setErrors({ invalidCombination: true });
        }
      }));

    }
  }

  // Function to format the date to 'yyyy-MM-ddT00:00:00' format
  formatDateValueChange(dateValue: Date): string {
    if (dateValue instanceof Date) {
      const year = dateValue.getFullYear();
      const month = (dateValue.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
      const day = dateValue.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}T00:00:00`;
    }
    return ''; // Handle cases where the dateValue is not a Date
  }
  deleteRowData(event: any) {
    this.confirmationService.confirm({
      header: this.translate.instant("common.notificationTitle.confirmation"),
      message: this.translate.instant("common.Information.deleteConfirmation"),
      accept: () => {
        this.partService.deletePartRate(event.partRateId).subscribe(

          (data) => {
            const result = data["response"];
            if (data["status"] === true) {
              this.notificationService.smallBox({
                title: this.translate.instant("common.notificationTitle.success"),
                content: data["message"],
                severity: 'success',
                timeout: 5000,
                icon: "fa fa-check",
              });
              this.getPartRatesListServerSide(this.globalParam)
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

  checkNgSelectValue(event: any, controlName: any) {
    const control = this.addPartRatesEditForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.addPartRatesEditForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }

  dropdownSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['depotCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotCode'].toLocaleLowerCase() === term ||
      item['depotName'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotName'].toLocaleLowerCase() === term
    );
  }

  closeRemarksPopUp() {
    this.remarksPopup.hide();
  }

  openRemarksPopup(remarks: string, event: MouseEvent) {
    this.remarks = remarks;
    this.remarksPopup.show();
    event.stopPropagation();
  }

  handleRemarksIcon(data: any) {
    this.remarks = data.row.remarks;
    this.remarksPopup.show();
    this.remarksPopup.show();
    data.event.stopPropagation();
  }
}
