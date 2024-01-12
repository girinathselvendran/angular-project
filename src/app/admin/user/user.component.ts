import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from 'src/app/core/services';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SharedTableStoreService } from 'src/app/shared/services/store/shared-table-store.service';
import {ExcelService} from 'src/app/shared/services/export/excel/excel.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  currencyMethodDetailsForm!: FormGroup;
  submittedDetails = false;
  currencyTypes = 
    [
      { currencyTypeCode: 'CAD', currencyTypeDescription: 'Canadian Dollar' },
      { currencyTypeCode: 'AUD', currencyTypeDescription: 'Australian Dollar' },
      { currencyTypeCode: 'CHF', currencyTypeDescription: 'Swiss Franc' },
      { currencyTypeCode: 'CNY', currencyTypeDescription: 'Chinese Yuan' },
      { currencyTypeCode: 'INR', currencyTypeDescription: 'Indian Rupee' },
      { currencyTypeCode: 'SGD', currencyTypeDescription: 'Singapore Dollar' },
      { currencyTypeCode: 'NZD', currencyTypeDescription: 'New Zealand Dollar' },
      { currencyTypeCode: 'HKD', currencyTypeDescription: 'Hong Kong Dollar' },
      { currencyTypeCode: 'SEK', currencyTypeDescription: 'Swedish Krona' },
      { currencyTypeCode: 'KRW', currencyTypeDescription: 'South Korean Won' },
      
  
  ];
  excelDataTable: any;
  constructor(
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private sharedTableStoreService: SharedTableStoreService,
    private excelService: ExcelService,
  ) {}
  showConfirmation() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to proceed?',
      accept: () => {
        this.notificationService.smallBox({
          severity: 'success',
          title: 'Success',
          content: 'This is the success message',
          timeout: 3000,
          icon: 'fa fa-check',
        });
      },
      reject: () => {
        this.notificationService.smallBox({
          severity: 'error',
          title: 'Error',
          content: 'This is the error message',
          timeout: 3000,
          icon: 'fa fa-times',
        });
      },
    });
  }

  tableFilterFormGroup!: FormGroup;

  headerColumnList = [
    {
      field: 'no',
      header: 'No',
      width: '7%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
    },
    {
      field: 'name',
      header: 'Name',
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
    },
    {
      field: 'projects',
      header: 'Projects',
      width: '35%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
    },
    {
      field: 'description',
      header: 'Description',
      width: '30%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
    },
    {
      field: 'status',
      header: 'status',
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
    },
  ];

  tableInitialData: any = [
    {
      no: '1',
      name: 'Giri',
      projects: 'IMS',
      description: 'Developer',
      status: 'Yes',
    },
    {
      no: '2',
      name: 'Nandha',
      projects: 'IMS',
      description: 'Developer',
      status: 'Yes',
    },
    {
      no: '3',
      name: 'Mahroof',
      projects: 'iDepo',
      description: 'Developer',
      status: 'Yes',
    },
    {
      no: '4',
      name: 'Arul',
      projects: 'Paripoorna',
      description: 'Tester',
      status: 'Yes',
    },
    {
      no: '5',
      name: 'Siva',
      projects: 'iDepo',
      description: 'Support',
      status: 'Yes',
    },
    {
      no: '6',
      name: 'Vijay',
      projects: 'Fintech',
      description: 'Sales',
      status: 'No',
    },
    {
      no: '7',
      name: 'Mahroof',
      projects: 'iDepo',
      description: 'Developer',
      status: 'Yes',
    },
    {
      no: '8',
      name: 'Mahroof',
      projects: 'iDepo',
      description: 'Developer',
      status: 'Yes',
    },
  ];

  APIResponseTableInitialData: any = {
    response: {
      result: [
        {
          no: '1',
          name: 'Giri',
          projects: 'IMS',
          description: 'Developer',
          status: 'Yes',
        },
        {
          no: '2',
          name: 'Nandha',
          projects: 'IMS',
          description: 'Developer',
          status: 'Yes',
        },
        {
          no: '3',
          name: 'Mahroof',
          projects: 'iDepo',
          description: 'Developer',
          status: 'Yes',
        },
        {
          no: '4',
          name: 'Arul',
          projects: 'Paripoorna',
          description: 'Tester',
          status: 'Yes',
        },
        {
          no: '5',
          name: 'Siva',
          projects: 'iDepo',
          description: 'Support',
          status: 'Yes',
        },
        {
          no: '6',
          name: 'Vijay',
          projects: 'Fintech',
          description: 'Sales',
          status: 'No',
        },
        {
          no: '7',
          name: 'Mahroof',
          projects: 'iDepo',
          description: 'Developer',
          status: 'Yes',
        },
        {
          no: '8',
          name: 'Mahroof',
          projects: 'iDepo',
          description: 'Developer',
          status: 'Yes',
        },
      ],
      totalCount: 19,
      filterRecordCount: 8,
    },
  };

  excelFileName = 'Sample File';

  ngOnInit() {
    this.initializeFormGroups();
    this.currencyMethodDetailsForm = this.formBuilder.group({
      currencyType: ["", [Validators.required]]
    });
  }

  initializeFormGroups() {
    this.tableFilterFormGroup = this.formBuilder.group({
      no: ['', []],
      name: ['', []],
      projects: ['', []],
      description: ['', []],
      status: ['', []],
    });

    setTimeout(() => {
      let params = { first: 0, rows: 10 };

      this.sharedTableStoreService.setAssignGridData({
        data: this.APIResponseTableInitialData,
        params: params,
      });
    }, 2000);
  }
  addIconClick(event: any) {
   
  }
  receiveTableRowData(event: any) {
    
  }
  refreshIconClick(event: any) {
    
  }
  receiveSelectedData(event: any) {
  
  }

  getServerSideTableList(event: any) {
    
  }

  exportToExcel(event: any) {
  
    let newColumns = event.columns.filter((key:any) => key.field != 'checkbox')
    newColumns.map((item: { [x: string]: any; field: string; }) => {
   
    })
    this.excelDataTable = [];
    this.excelDataTable.columns = newColumns;
    this.excelDataTable.filteredValue = undefined;
    let dowloaded: boolean;


    this.excelDataTable.value=this.APIResponseTableInitialData.response.result;
          dowloaded = this.excelService.exportAsExcelFile(this.excelDataTable, "dummy Title", false);
  }

  handleRemarksIcon(event: any) {
   
  }

  submitForm(){
    this.submittedDetails = true

  }

  dropdownSearchFn(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item["currencyTypeCode"].toLocaleLowerCase().indexOf(term) > -1 ||
      item["currencyTypeCode"].toLocaleLowerCase() === term ||
      item["currencyTypeDescription"].toLocaleLowerCase().indexOf(term) > -1 ||
      item["currencyTypeDescription"].toLocaleLowerCase() === term
    );
  }
 get currencyTypeDetailsFormControllers() {
    return this.currencyMethodDetailsForm.controls;
  }
  checkNgSelectValue(event: any, controlName: any) {
   
    const control = this.currencyMethodDetailsForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });
     
      this.currencyMethodDetailsForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }
}
