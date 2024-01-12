import {
  Component,
  ViewChild,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/core/services';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { RequestForQuoteService } from '../service/request-for-quote.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-add-rfqsupplier',
  templateUrl: './add-rfqsupplier.component.html',
  styleUrls: ['./add-rfqsupplier.component.css'],
})
export class AddRFQSupplierComponent {
  @ViewChild('rfqSupplierModal') rfqSupplierModal: any;
  @Output() sendPartDetailsData = new EventEmitter();
  @Input() editSaveSupplierForm!: FormGroup;
  supplierCodeDDList: any = [];
  cityDDList = [];
  submitted = false;
  rfqSupplierMode = 'new';
  isShowSupplierExistErr: boolean = false;
  userName: string = '';
  tempRFQSupplierId = 1;
  selectedColumnData: any = [];
  disableSaveButton: boolean = false;
  tableColumnsSupplier = [
    {
      field: 'supplierCode',
      header: this.translate.instant(
        'operations.requestForQuote.addSupplier.grid.supplierCode'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'supplierName',
      header: this.translate.instant(
        'operations.requestForQuote.addSupplier.grid.supplierName'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'manufactureStatus',
      header: this.translate.instant(
        'operations.requestForQuote.addSupplier.grid.manufacturer'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'city',
      header: this.translate.instant(
        'operations.requestForQuote.addSupplier.grid.city'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
  ];
  tempUniqValue: any = null;
  rfqSupplierData: any = [];
  partId: any = null;
  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private userAuthService: UserAuthService,
    public notificationService: NotificationService,
    private loaderService: NgxUiLoaderService,
    private confirmationService: ConfirmationService,
    private requestForQuoteService: RequestForQuoteService
  ) {
    this.userName = this.userAuthService.getCurrentUserName();

    this.requestForQuoteService.supplierGridData$.subscribe(
      (supplierGridData: any) => {
        this.rfqSupplierData = supplierGridData;
      }
    );
    this.requestForQuoteService.partId$.subscribe((partId: number) => {
      this.partId = partId;
    });

    this.requestForQuoteService.supplierDropDownData$.subscribe(
      (data: any[]) => {
        this.supplierCodeDDList = data;
       
      }
    );
    this.requestForQuoteService.tempUniqValue$.subscribe((data: any) => {
      this.tempUniqValue = data;
     
    });
  }

  sendSupplierDataToFirst() {
    this.requestForQuoteService.setSupplierData(this.rfqSupplierData);
  }

  ngOnInit() {
    this.editSaveSupplierForm = this.formBuilder.group({
      supplierCode: [[], [Validators.required]],
      supplierName: ['', []],
      manufacturer: ['', []],
      city: ['', []],
      preferredSupplier: [false, []],
    });
    this.getSupplierByAssociatedPart();
    this.disableReadOnlyFields();
    this.isShowSupplierExistErr = false;
    this.rfqSupplierData = [];
  }

  getSupplierByAssociatedPart() {}
  disableSupplierPopup() {
    this.editSaveSupplierForm.disable();
    this.disableSaveButton = true;
  }

  get editSaveSupplierFormController() {
    return this.editSaveSupplierForm.controls;
  }
  handleCloseSupplier() {
    this.isShowSupplierExistErr = false;
    this.requestForQuoteService.setPartId(0);
    this.rfqSupplierModal.hide();
  }
  receiveSelectedData(event: any) {
    
    this.selectedColumnData = event;
    this.rfqSupplierMode = 'edit';
  }
  handleDeleteRowData(rowData: any) {
    this.confirmationService.confirm({
      message: this.translate.instant('common.Information.deleteConfirmation'),
      header: this.translate.instant('common.notificationTitle.confirmation'),
      accept: () => {
        this.deleteSelectedRowData(this.selectedColumnData);
      },
      reject: () => {
        return false;
      },
    });
  }
  supplierDetailId = [];
  deleteSupplierData(tempUniqValueToDelete: string) {
    this.requestForQuoteService.deleteSupplierDataByUniqueValue(
      tempUniqValueToDelete
    );
  }
  deleteSelectedRowData(event: any) {
    this.selectedColumnData.forEach((row: any) => {
      if (
        row.requestForQuoteSupplierDetailId == 0 ||
        row.requestForQuoteSupplierDetailId == undefined
      ) {
        this.rfqSupplierData = this.rfqSupplierData.filter(
          (supplierDetail: any) => supplierDetail !== row
        );
        this.notificationService.smallBox({
          severity: 'success',
          title: this.translate.instant('common.notificationTitle.success'),
          content: this.translate.instant(
            'operations.requestForQuote.addSupplier.errors.deleteSupplier'
          ),
          timeout: 5000,
          icon: 'fa fa-check',
        });
        if (event?.length != 0) {
          event?.map((row: { tempUniqValue: string }) => {
            if (row?.tempUniqValue) {
              this.deleteSupplierData(row?.tempUniqValue);
            }
          });
        }

        //  this.deleteSupplierData()
        this.selectedColumnData = [];
      } else {
        this.supplierDetailId.push(
          row.requestForQuoteSupplierDetailId as never
        );
       
      }
    });
    if (this.supplierDetailId.length != 0) {
      this.loaderService.start();
      this.requestForQuoteService
        .deleteSupplierDetails(this.supplierDetailId)
        .subscribe((data: any) => {
          if (data['status'] === true) {
            // this.getTermsAndConditionList();
            this.loaderService.stop();
            this.notificationService.smallBox({
              severity: 'success',
              title: this.translate.instant('common.notificationTitle.success'),
              content: data['message'],
              timeout: 5000,
              icon: 'fa fa-check',
            });
            this.selectedColumnData = [];
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
  disableReadOnlyFields() {
    this.editSaveSupplierForm.controls['supplierName'].disable();
    this.editSaveSupplierForm.controls['manufacturer'].disable();
    this.editSaveSupplierForm.controls['city'].disable();
  }

  onChangePreferredSupplierToggle(event: any) {
    throw new Error('Method not implemented.');
  }

  selectedSupplier: any = null;
  onSupplierCodeSelected(event: any) {
    const isPartIdExist = this.rfqSupplierData.some(
      (item: { supplierId: any }) => item.supplierId === event.supplierId
    );

    if (isPartIdExist) {
      this.isShowSupplierExistErr = true;
    } else {
      this.isShowSupplierExistErr = false;

     

      this.selectedSupplier = event;

     

      this.selectedSupplier['preferredSupplier'] =
        this.editSaveSupplierForm.value.preferredSupplier;
      this.selectedSupplier['tempUniqValue'] = this.tempUniqValue;
      

      this.editSaveSupplierForm.controls['supplierName'].setValue(
        event.supplierName
      );
      this.editSaveSupplierForm.controls['manufacturer'].setValue(
        event.manufactureStatus
      );
      this.editSaveSupplierForm.controls['city'].setValue(event.city);
      this.disableReadOnlyFields();
    }
  }

  saveSupplier() {
    if (this.isShowSupplierExistErr) {
      return;
    }
    {
      if (!this.editSaveSupplierForm.valid) {
        this.validateAllMethodFormFields(this.editSaveSupplierForm);
      } else {
        if (this.rfqSupplierMode == 'new') {
          if (this.selectedSupplier) {
            const formControls = this.editSaveSupplierForm.controls;

            this.selectedSupplier['preferredSupplier'] = formControls[
              'preferredSupplier'
            ].value
              ? formControls['preferredSupplier'].value
              : false;

            this.rfqSupplierData.push(this.selectedSupplier);
            this.disableReadOnlyFields();
            this.tempRFQSupplierId = this.tempRFQSupplierId + 1;

            this.notificationService.smallBox({
              severity: 'success',
              title: this.translate.instant('common.notificationTitle.success'),
              content: this.translate.instant(
                'operations.requestForQuote.partDetails.messages.partSupplierCreated'
              ),
              timeout: 5000,
              icon: 'fa fa-check',
            });
            this.sendSupplierDataToFirst();
            this.selectedSupplier = null;
            this.editSaveSupplierForm.reset();
          }
        }
      }
    }
  }

  resetForm() {
    this.editSaveSupplierForm.reset();
    this.isShowSupplierExistErr = false;
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

  dropdownSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['code'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['code'].toLocaleLowerCase() === term ||
      item['description'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['description'].toLocaleLowerCase() === term
    );
  }
  validateAllMethodFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllMethodFormFields(control);
      }
    });
  }
}
