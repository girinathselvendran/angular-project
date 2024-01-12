import { Component, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../service/supplier.service';
import { SharedLazyTableComponent } from 'src/app/shared/components/shared-lazy-table/shared-lazy-table.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';
import { ExcelService } from 'src/app/shared/services/export/excel/excel.service';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/core/services';
import { PartService } from '../../part/service/part.service';
import { SharedTableV2StoreService } from 'src/app/shared/services/store/shared-table-v2-store.service';
import { SharedLazyTableNewComponent } from 'src/app/shared/components/shared-lazy-table-new/shared-lazy-table-new.component';


@Component({
  selector: 'app-part-mapping',
  templateUrl: './part-mapping.component.html',
  styleUrls: ['./part-mapping.component.css'],
})
export class PartMappingComponent {
  @ViewChild('contactModal') contactModal: any;
  @ViewChild('purchasePartSpecificationModal') purchasePartSpecificationModal: any;
  @ViewChild('sharedLazyTableAllParts') sharedLazyTableAllParts: | SharedLazyTableNewComponent | undefined;
  @ViewChild('sharedLazyTablePartMapping') sharedLazyTablePartMapping: | SharedLazyTableNewComponent | undefined;
  @Input() selectedRowList!: any;

  partTableFilterFormGroup!: FormGroup;
  partDetailsTableFilterFormGroup!: FormGroup;
  associatePartsForm!: FormGroup;
  totalDataGridCountComp: any;
  selectedSupplierPartMapping: any = [];
  partTypeDDList: any = [];
  excelDataTable: any;
  tableParams = { first: 0, rows: 10 };
  partSpecificationList: any;
  totalDataGridCountCompV2: any;
  isModalOpen = false;
  disableSaveButton = false;
  addContactBtn = false;
  submitted = false;
  contactMode: string = 'new';
  tableInitialDataAssociateParts: any = [];
  partTableDataList: any = [];
  tableInitialData: any = [];
  tableTitle = this.translate.instant('master.supplier.associateParts.title.supplierPartMapping');

  tableColumnHeaderList = [
    {
      field: 'partNo',
      header: this.translate.instant(
        'master.supplier.associateParts.grid.partNo'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'partDescription',
      header: this.translate.instant(
        'master.supplier.associateParts.grid.partDescription'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'partType',
      header: this.translate.instant(
        'master.supplier.associateParts.grid.partType'
      ),

      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'partCategory',
      header: this.translate.instant(
        'master.supplier.associateParts.grid.partCategory'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'supplierMnfrRefPartNo',
      header: this.translate.instant(
        'master.supplier.associateParts.grid.supplierMnfrRefPartNo'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'stockUOM',
      header: this.translate.instant(
        'master.supplier.associateParts.grid.stockUom'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'partSpecificationIcon',
      header: this.translate.instant(
        'master.supplier.associateParts.grid.partSpecificationIcon'
      ),
      width: '2%',
      isFilter: false,
      isSubHeader: false,
      type: 'string',
      isEyeIcon: true,
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
  tableColumnHeaderListPartDetails = [
    {
      field: 'partNo',
      header: this.translate.instant(
        'master.supplier.associateParts.grid.partNo'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'partType',
      header: this.translate.instant(
        'master.supplier.associateParts.grid.partType'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'partDescription',
      header: this.translate.instant(
        'master.supplier.associateParts.grid.partDescription'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
    {
      field: 'partCategory',
      header: this.translate.instant(
        'master.supplier.associateParts.grid.partCategory'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'stockUom',
      header: this.translate.instant(
        'master.supplier.associateParts.grid.stockUom'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'partSpecificationIcon',
      header: this.translate.instant(
        'master.supplier.associateParts.grid.partSpecificationIcon'
      ),
      width: '8%',
      isFilter: false,
      isSubHeader: false,
      type: 'string',
      isEyeIcon: true,
      key: 6,
    },
  ];
  tableColumnHeaderListPurchasePartSpecfication = [
    {
      field: 'partSpecification',
      header: this.translate.instant(
        'master.supplier.associateParts.grid.partSpecification'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'uom',
      header: this.translate.instant('master.supplier.associateParts.grid.uom'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'value',
      header: this.translate.instant(
        'master.supplier.associateParts.grid.value'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
  ];
  partDetailsTitle: string = this.translate.instant(
    'master.supplier.title.partDetails'
  )
  userName: any = "";

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private supplierService: SupplierService,
    private loaderService: NgxUiLoaderService,
    private userAuthService: UserAuthService,
    private sharedTableStoreService: SharedTableStoreService,
    private sharedTableV2StoreService: SharedTableV2StoreService,
    private excelService: ExcelService,
    private confirmationService: ConfirmationService,
    public notificationService: NotificationService,
    private partService: PartService
  ) { }

  ngOnInit() {
    this.partTableFilterFormGroup = this.formBuilder.group({
      partNo: ['', []],
      partDescription: ['', []],
      partType: ['', []],
      partCategory: ['', []],
      stockUOM: ['', []],
      partSpecification: ['', []],
      supplierMnfrRefPartNo: ['', []],
    });
    this.partDetailsTableFilterFormGroup = this.formBuilder.group({
      partNo: ['', []],
      partType: ['', []],
      partDescription: ['', []],
      partCategory: ['', []],
      stockUom: ['', []],
      partSpecificationIcon: ['', []],
    });
    this.associatePartsForm = this.formBuilder.group({
      partType: [[], []],
      partCategory: ['', []],
      partNo: ['', []],
    });
    this.getPartType();
    this.userName = this.userAuthService.getCurrentUserName()
  }

  get associatePartsFormControls(): any {
    return this.associatePartsForm.controls;
  }

  getPartType() {
    this.supplierService.getPartType().subscribe(
      (data) => {
        this.partTypeDDList = data['response'];
      },
      (err) => { }
    );
  }

  openContactDialog(modeType: string) {
    this.isModalOpen = true;
    this.contactModal.show();
  }
  closeContactDialog() {
    this.contactModal.hide();
    this.associatePartsForm.reset();
    this.getAllAssociatePartsServerSide(this.globalStoredParams);
    this.isModalOpen = false;
  }
  closePurchasePartSpecificationDialog() {
    this.purchasePartSpecificationModal.hide();
    this.isModalOpen = false;
  }

  receiveSelectedData(selectedData: any) {
    this.selectedSupplierPartMapping = selectedData;
  }

  receiveSelectedDataPartDetails(e: any) {
    this.isModalOpen = true;
    this.purchasePartSpecificationModal.show();
  }

  clearForm() {
    this.associatePartsForm.reset();
    this.getAllAssociatePartsServerSide(this.globalStoredParams);
  }
  onSubmit() {
    if (this.selectedSupplierPartMapping.length === 0) {
      this.notificationService.smallBox({
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'master.supplier.associateParts.errors.atLeastOneRecord'
        ),
        severity: 'error',
        timeout: 5000,
        icon: 'fa fa-times',
      });
    } else {
      for (let i = 0; i < this.selectedSupplierPartMapping.length; i++) {
        const item = this.selectedSupplierPartMapping[i];

        const modifiedItem = {
          partId: item.partId,
          SupplierId: this.selectedRowList.supplierId,
          createdBy: this.userName,
          modifiedBy: this.userName,
        };

        this.selectedSupplierPartMapping[i] = modifiedItem;
      }

      if (
        this.selectedSupplierPartMapping &&
        this.selectedSupplierPartMapping.length != 0
      ) {
        this.loaderService.start();
        this.supplierService
          .createSupplierPartMappings(this.selectedSupplierPartMapping)
          .subscribe((data) => {
            this.selectedSupplierPartMapping = [];
            this.sharedTableV2StoreService.setResetTableData(true);
            this.getPartMappingListServerSide(this.globalGetPartMappingParams);
            this.loaderService.stop();
            if (data['status'] === true) {
              this.closeContactDialog();
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
  dropdownSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['code'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['code'].toLocaleLowerCase() === term ||
      item['description'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['description'].toLocaleLowerCase() === term
    );
  }
  checkNgSelectValue(event: any, controlName: any) {
    const control = this.associatePartsForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.associatePartsForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }
  GetPartSpecificationList(partId: any) {
    this.partService.getPartSpecificationList(partId).subscribe((data: any) => {
      this.partSpecificationList = data.response;
    });
  }
  globalGetPartMappingParams: any;

  serverSideProcessing!: any;
  getPartMappingListServerSide(params: any) {
    this.globalGetPartMappingParams = params;
    this.serverSideProcessing = {
      CurrentPage: params.first,
      GlobalFilter:
        params.globalFilter != undefined
          ? params.globalFilter
          : this.sharedLazyTablePartMapping != undefined
            ? this.sharedLazyTablePartMapping.globalFilter.value
            : null,
      PageSize: params.rows,
      SortField: params.sortField ? params.sortField : 'sortOnly',
      SortOrder: params.sortField
        ? params.sortOrder
          ? params.sortOrder
          : -1
        : -1,

      partNo: this.partTableFilterFormGroup.value.partNo || '',
      partDescription:
        this.partTableFilterFormGroup.value.partDescription || '',
      partType: this.partTableFilterFormGroup.value.partType || '',
      partCategory: this.partTableFilterFormGroup.value.partCategory || '',
      stockUom: this.partTableFilterFormGroup.value.stockUOM || '',
      supplierMnfrRefPartNo:
        this.partTableFilterFormGroup.value.supplierMnfrRefPartNo || '',
      partSpecification:
        this.partTableFilterFormGroup.value.partSpecification || '',
      supplierId: this.selectedRowList.supplierId,
    };
    this.loaderService.start();

    this.supplierService
      .getPartsListServerSide(
        this.serverSideProcessing,
        this.userAuthService.getCurrentCompanyId(),
        this.userAuthService.getCurrentUserId()
      )
      .subscribe((data: any) => {
        this.partTableDataList = data['response'].result;
        this.totalDataGridCountComp = data['response'].filterRecordCount;
        this.sharedTableStoreService.setAssignGridData({ data, params });
        this.loaderService.stop();
      });
    this.loaderService.stop();
  }

  globalStoredParams: any;
  onchangeSearchFields() {
    this.getAllAssociatePartsServerSide(this.globalStoredParams);
  }

  exportToExcel(event: any) {
    let newColumns = event.columns.filter((key: any) => key.field != 'delete');
    newColumns.map((item: { [x: string]: any; field: string }) => { });
    this.excelDataTable = [];
    this.excelDataTable.columns = newColumns;
    this.excelDataTable.filteredValue = undefined;
    let downloaded: boolean;

    let params: any = { first: 0, rows: this.totalDataGridCountComp };
    const serverSideProcessingObject = {
      CurrentPage: params.first,
      GlobalFilter:
        params.globalFilter != undefined
          ? params.globalFilter
          : this.sharedLazyTablePartMapping != undefined
            ? this.sharedLazyTablePartMapping.globalFilter.value
            : null,
      PageSize: params.rows,
      SortField: params.sortField ? params.sortField : 'sortOnly',
      SortOrder: params.sortField
        ? params.sortOrder
          ? params.sortOrder
          : -1
        : -1,

      partNo: this.partTableFilterFormGroup.value.partNo || '',
      partDescription:
        this.partTableFilterFormGroup.value.partDescription || '',
      partType: this.partTableFilterFormGroup.value.partType || '',
      partCategory: this.partTableFilterFormGroup.value.partCategory || '',
      stockUom: this.partTableFilterFormGroup.value.stockUOM || '',
      supplierMnfrRefPartNo:
        this.partTableFilterFormGroup.value.supplierMnfrRefPartNo || '',
      partSpecification:
        this.partTableFilterFormGroup.value.partSpecification || '',
      supplierId: this.selectedRowList.supplierId,
    };

    this.loaderService.start();

    this.supplierService
      .getPartsListServerSide(
        serverSideProcessingObject,
        this.userAuthService.getCurrentCompanyId(),
        this.userAuthService.getCurrentUserId()
      )
      .subscribe((data: any) => {
        this.excelDataTable.value = data['response'].result;
        downloaded = this.excelService.exportAsExcelFile(
          this.excelDataTable,
          'Supplier List',
          false
        );
        this.loaderService.stop();
      });
    this.loaderService.stop();
  }
  partListGridCount: any;
  exportToExcelAllParts(event: any) {

    let newColumns = event.columns.filter((key: any) => key.field != 'delete');
    newColumns.map((item: { [x: string]: any; field: string }) => { });
    // Update the column header label for 'partSpecificationIcon'
    newColumns.forEach((item: any) => {
      if (item.field === 'partSpecificationIcon') {
        item.header = this.translate.instant(
          'master.supplier.associateParts.grid.partSpecification'
        );
      }
    });
    this.excelDataTable = [];
    this.excelDataTable.columns = newColumns;
    this.excelDataTable.filteredValue = undefined;
    let downloaded: boolean;

    let params: any = { first: 0, rows: this.partListGridCount };
    // const serverSideProcessingObject = {
    //   CurrentPage: params.first,
    //   GlobalFilter:
    //     params.globalFilter != undefined
    //       ? params.globalFilter
    //       : this.sharedLazyTableAllParts != undefined
    //       ? this.sharedLazyTableAllParts.globalFilter.value
    //       : null,
    //   PageSize: params.rows,
    //   SortField: params.sortField ? params.sortField : 'sortOnly',
    //   SortOrder: params.sortField
    //     ? params.sortOrder
    //       ? params.sortOrder
    //       : -1
    //     : -1,

    //   partNo: this.partDetailsTableFilterFormGroup.value.partNo || '',
    //   partDescription:
    //     this.partDetailsTableFilterFormGroup.value.partDescription || '',
    //   partType: this.partDetailsTableFilterFormGroup.value.partType || '',
    //   partCategory:
    //     this.partDetailsTableFilterFormGroup.value.partCategory || '',
    //   stockUom: this.partDetailsTableFilterFormGroup.value.stockUom || '',
    //   supplierMnfrRefPartNo:
    //     this.partDetailsTableFilterFormGroup.value.supplierMnfrRefPartNo || '',
    //   partSpecification:
    //     this.partDetailsTableFilterFormGroup.value.partSpecification || '',
    //   supplierId: this.selectedRowList.supplierId,

    // };
    const serverSideProcessingObject = {
      CurrentPage: params.first,
      GlobalFilter:
        params.globalFilter != undefined
          ? params.globalFilter
          : this.sharedLazyTableAllParts != undefined
            ? this.sharedLazyTableAllParts.globalFilter.value
            : null,
      PageSize: params.rows,
      SortField: params.sortField ? params.sortField : 'sortOnly',
      SortOrder: params.sortField
        ? params.sortOrder
          ? params.sortOrder
          : -1
        : -1,

      partNo:
        // this.associatePartsForm?.value?.partNo ||
        this.partDetailsTableFilterFormGroup.value.partNo ||
        '',
      partDescription:
        this.partDetailsTableFilterFormGroup.value.partDescription || '',
      partType:
        // this.associatePartsForm?.value?.partType?.code ||
        this.partDetailsTableFilterFormGroup.value.partType ||
        '',
      partCategory:
        // this.associatePartsForm?.value?.partCategory ||
        this.partDetailsTableFilterFormGroup.value.partCategory ||
        '',
      stockUom: this.partDetailsTableFilterFormGroup.value.stockUom || '',
      mainPartType: this.associatePartsForm?.value?.partType?.code || '',
      mainPartNo: this.associatePartsForm?.value?.partNo || '',
      mainPartCategory: this.associatePartsForm?.value?.partCategory || '',
    };

    this.loaderService.start();

    this.supplierService
      .getAllAssociatePartsServerSide(
        serverSideProcessingObject,
        this.userAuthService.getCurrentCompanyId(),
        this.userAuthService.getCurrentUserId()
      )
      .subscribe((data: any) => {
        this.excelDataTable.value = data['response'].result;

        downloaded = this.excelService.exportAsExcelFile(
          this.excelDataTable,
          'Part List',
          false
        );
        this.loaderService.stop();
      });
    this.loaderService.stop();
  }

  getAllAssociatePartsServerSide(params: any) {
    this.globalStoredParams = params;
    this.serverSideProcessing = {
      CurrentPage: params.first,
      GlobalFilter:
        params.globalFilter != undefined
          ? params.globalFilter
          : this.sharedLazyTableAllParts != undefined
            ? this.sharedLazyTableAllParts.globalFilter.value
            : null,
      PageSize: params.rows,
      SortField: params.sortField ? params.sortField : 'sortOnly',
      SortOrder: params.sortField
        ? params.sortOrder
          ? params.sortOrder
          : -1
        : -1,

      partNo:
        // this.associatePartsForm?.value?.partNo ||
        this.partDetailsTableFilterFormGroup.value.partNo ||
        '',
      partDescription:
        this.partDetailsTableFilterFormGroup.value.partDescription || '',
      partType:
        // this.associatePartsForm?.value?.partType?.code ||
        this.partDetailsTableFilterFormGroup.value.partType ||
        '',
      partCategory:
        // this.associatePartsForm?.value?.partCategory ||
        this.partDetailsTableFilterFormGroup.value.partCategory ||
        '',
      stockUom: this.partDetailsTableFilterFormGroup.value.stockUom || '',
      mainPartType: this.associatePartsForm?.value?.partType?.code || '',
      mainPartNo: this.associatePartsForm?.value?.partNo || '',
      mainPartCategory: this.associatePartsForm?.value?.partCategory || '',
    };

    this.loaderService.start();

    this.supplierService
      .getAllAssociatePartsServerSide(
        this.serverSideProcessing,
        this.userAuthService.getCurrentCompanyId(),
        this.userAuthService.getCurrentUserId()
      )
      .subscribe((data: any) => {
        this.tableInitialDataAssociateParts = data['response'].result;
        this.partListGridCount = data['response'].filterRecordCount;
        this.sharedTableV2StoreService.setAssignGridData({ data, params });
        this.loaderService.stop();
      });
    this.loaderService.stop();
  }

  handleDeletePartMappingIcon(event: any) {

    this.confirmationService.confirm({
      message: this.translate.instant('common.Information.deleteConfirmation'),
      header: this.translate.instant('common.notificationTitle.confirmation'),
      accept: () => {
        this.deletePartMappingList(event);
      },
      reject: () => {
        return false;
      },
    });
  }

  deletePartMappingList(event: any) {
    this.supplierService.deletePartMappingAddress(event).subscribe(
      (data: any) => {
        const result = data['response'];
        this.getPartMappingListServerSide(this.tableParams);

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
  handlePartSpecificationRowData(event: any) {
    this.GetPartSpecificationList(event.partId);
    this.isModalOpen = true;
    this.purchasePartSpecificationModal.show();
  }
}
