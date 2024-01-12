import { Component, Input, Output, OnInit, ViewChild, EventEmitter, OnChanges, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { HttpClient, HttpParams, HttpRequest, HttpEventType } from '@angular/common/http';
import { FormBuilder, FormControl } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { NotificationService } from 'src/app/core/services';
import { ExcelService } from '../../services/export/excel/excel.service';
// import { ExcelService } from '../../services/export/excel/excel.service';
// import { NotificationService } from 'src/app/core/services';


@Component({
  selector: 'sa-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, OnChanges {
  percentDone: boolean = false;
  @Input() uploadHeader!: string;
  @Input() successCount!: number;
  @Input() failedCount!: number;
  @Input() totalProcessed!: any;
  @Input() successPercentage!: any;
  @Input() failedPercentage!: any;
  @Input() hrefDynamic!: any;
  @Input() uploadDynamic!: any;
  @Input() uploadColumns!: any;
  files: any = [];
  @Input() excelDocument: any;
  @Input() uploadFileName: any;


  upload: any = [];
  uploadDataSource!: any[];
  showUploadResultGrid = false;
  uploadrecordLastIndex!: any;
  filteredUploadCount!: number;
  uploadStatusTablepaginatorhide!: boolean;
  uploadIsoMappingColumns!: { field: string; header: string; width: string; }[];
  uploadCount!: number;
  uploadrecordsPerPage!: number;
  uploadGlobalFilter = new FormControl('');
  uploadTemplateColumns!: { field: string; header: any; width: string; type: string; }[];
  // uploadColumns: { field: string; header: string; width: string; type: string; }[];
  @ViewChild('dtUpload') uploadStatusTable: any;
  @Output() closeUploadButton = new EventEmitter<string>();
  toggle: any;
  hrefDynamicExcel: any;
  filteredValue: any = [];

  constructor(private translate: TranslateService,
    private loaderService: NgxUiLoaderService,
    private authService: UserAuthService,
    private http: HttpClient,
    public notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private excelService: ExcelService

  ) { }

  ngOnInit() {

  }
  ngOnChanges() {
    this.successCount = 0.00;
    this.failedCount = 0.00;
    this.totalProcessed = "0";
    this.successPercentage = "0.00";
    this.failedPercentage = "0.00";
    // this.hrefDynamicExcel = this.hrefDynamic;

  }
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (this.showUploadResultGrid === true) {
      this.resetandcloseUploadDialog();
    }

  }

  closeUploadDetailsImportDialog() {
    this.resetandcloseUploadDialog();
  }

  resetandcloseUploadDialog() {
    this.upload = [];
    this.uploadDataSource = [];
    this.successCount = 0;
    this.failedCount = 0;
    this.failedPercentage = "0.00";
    this.successPercentage = "0.00";
    this.totalProcessed = "0";
    this.closeUploadButton.emit('close');
    // this.refreshRepair(this.tableData);
    this.showUploadResultGrid = false;

  }

  excelTemplateDownload() {
    const link = document.createElement('a');
    link.setAttribute('type', 'hidden');
    // link.href = this.hrefDynamicExcel;
    link.href = this.excelDocument.file;
    link.download = this.excelDocument.name;
    // link.href = 'assets/api/template/ImportEquipmentISOMappingTemplate.xlsx';
    // link.download = "ImportEquipmentISOMappingTemplate.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  onSelect(event: any) {

    this.files.push(...event.addedFiles);
    this.uploadExcel(this.files);
  }

  uploadExcel(files: any): void {
    this.loaderService.start();
    const fileElement = files[0].name;
    let fileExtension = '';
    if (fileElement.lastIndexOf('.') > 0) {
      fileExtension = fileElement.substring(fileElement.lastIndexOf('.') + 1, fileElement.length);
    }
    if (fileExtension.toLowerCase() === 'xlsx') {
      if (files.length === 0) {
        return;
      }
      const formData = new FormData();
      for (const file of files) {
        formData.append(file.name, file);
      }
      formData.append("dataParam", JSON.stringify({
        companyId: this.authService.getCurrentCompanyId(),
        createdBy: this.authService.getCurrentUserName(),
        userId: this.authService.getCurrentUserId()
      }));

      const uploadDynamic = this.uploadDynamic

      const uploadReq = new HttpRequest('POST', environment.hostUrl + uploadDynamic + `/UploadFile`, formData, {
        reportProgress: true
      });

      this.http.request(uploadReq).subscribe((event: any) => {
        this.percentDone = true;
        if (event.type === HttpEventType.Response) {
          this.loaderService.stop();
          if (event.body["status"] === true) {
            if (event.body["response"].status === true) {
              if (event.body["response"].message) {
                this.percentDone = false;
                this.uploadStatus('TotalProcessed')
                this.upload = event.body["response"].message;
                this.uploadDataSource = event.body["response"].message;
                this.files = [];
                this.uploadCount = this.upload.length;
                if (this.uploadCount > 0) {
                  this.uploadStatusTablepaginatorhide = true;
                } else {
                  this.uploadStatusTablepaginatorhide = false;
                }
                this.uploadGlobalFilter.setValue(null);
                this.filteredUploadCount = this.upload.length;
                this.uploadrecordLastIndex = 0;
                if (this.uploadDataSource.length < this.uploadrecordsPerPage) {
                  this.uploadrecordLastIndex = this.upload.length;
                } else {
                  this.uploadrecordLastIndex = this.uploadrecordsPerPage;
                }
                this.setEquipmentDetailsUploadListColumns();
                this.successCount = 0;
                this.failedCount = 0;

                this.totalProcessed = this.uploadDataSource.length;
                this.uploadDataSource.forEach(element => {
                  if (element.status === "Success") {
                    this.successCount++;
                  }
                  if (element.status === "Failure") {
                    this.failedCount++;
                  }
                });
                this.successPercentage = parseFloat(((this.successCount / this.totalProcessed) * 100).toString()).toFixed(2);
                this.failedPercentage = parseFloat(((this.failedCount / this.totalProcessed) * 100).toString()).toFixed(2);
                this.notificationService.smallBox({
                  severity: 'success',
                  title: 'Success',
                  content: event.body["message"],
                  // color: "#739E73",
                  timeout: 5000,
                  icon: "fa fa-check",
                });

                this.showUploadResultGrid = true;
                //   this.reset();

              } else {
                this.percentDone = false;
                this.notificationService.smallBox({
                  title: "Error",
                  severity: 'error',
                  content: event.body["response"].message,
                  // color: "#a90329",
                  timeout: 5000,
                  icon: "fa fa-times",
                });
                this.reset();
                this.loaderService.stop();
              }
            } else {
              this.percentDone = false;
              this.notificationService.smallBox({
                title: "Error",
                content: event.body["response"].message,
                // color: "#a90329",
                severity: 'error',

                timeout: 5000,
                icon: "fa fa-times",
              });
              this.reset();
            }
          } else {
            this.percentDone = false;
            this.notificationService.smallBox({
              title: "Error",
              content: event.body["message"].message,
              // color: "#a90329",
              severity: 'error',

              timeout: 5000,
              icon: "fa fa-times",
            });
            this.showUploadResultGrid = false;
            this.reset();
          }
        } else {

        }
      });
    } else {
      this.notificationService.smallBox({
        title: "Error",
        content: "Only files with .xlsx can be used for upload",
        // color: "#a90329",
        severity: 'error',

        timeout: 3000,
        icon: "fa fa-times",
      });
      this.loaderService.stop();
      this.reset();
    }
  }
  setEquipmentDetailsUploadListColumns() {
    // var result = jsObjects.find(obj => {
    //   return obj.b === 6
    // });
    return this.uploadColumns;
  }
  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
    this.percentDone = false;
  }
  uploadStatus(buttonName: any) {
    if (buttonName === "Success") {
      this.uploadGlobalFilter.setValue(null);

      this.upload = [];
      for (const i in this.uploadDataSource) {
        if (this.uploadDataSource[i].status === "Success") {
          this.upload.push(this.uploadDataSource[i]);
          if (this.uploadStatusTable) {
            this.uploadStatusTable.reset();
            this.uploadStatusTable.rows = 5;
          }


          this.uploadStatusTablepaginatorhide = true;
        }
      }
      if (this.upload.length === 0) {
        this.uploadStatusTablepaginatorhide = false;
      }
    } else if (buttonName === "Failure") {
      this.uploadGlobalFilter.setValue(null);

      this.upload = [];
      for (const i in this.uploadDataSource) {
        if (this.uploadDataSource[i].status === "Failure") {
          this.upload.push(this.uploadDataSource[i]);
          if (this.uploadStatusTable) {
            this.uploadStatusTable.reset();
            this.uploadStatusTable.rows = 5;
          }

        } else {
          this.uploadStatusTablepaginatorhide = true;
        }
      }
      if (this.upload.length === 0) {
        this.uploadStatusTablepaginatorhide = false;
      } else {
        this.uploadStatusTablepaginatorhide = true;
      }
    } else {
      this.uploadGlobalFilter.setValue(null);

      this.upload = this.uploadDataSource;
      if (this.uploadStatusTable) {
        this.uploadStatusTable.reset();
        this.uploadStatusTable.rows = 5;
      }
      this.uploadStatusTablepaginatorhide = true;
    }
  }
  errorFileDownload() {
    const errorData = [];
    for (const i in this.uploadDataSource) {
      if (this.uploadDataSource[i].status === "Failure") {
        errorData.push(this.uploadDataSource[i]);
      }
    }
    this.uploadFileName = this.uploadFileName != null ? this.uploadFileName + " UploadResult" : this.uploadDynamic + "UploadResult";
    this.excelService.exportAsExcelTemplateFile(errorData, this.uploadFileName, this.uploadColumns);
  }
  reset() {
    // this.fileInputVariable.nativeElement.value = "";
    // this.submitted = false;
    // this.editSaveForm.reset();
    // this._markFormPristine(this.editSaveForm);
    // // this.editSaveForm.controls.active.patchValue('true');
    // this.equipmentIsoMappingFormControls.active.setValue(true);
    this.uploadStatusTablepaginatorhide = false;
    this.showUploadResultGrid = false;
    this.files = [];
    this.successCount = 0;
    this.failedCount = 0;
    this.successPercentage = "0.00";
    this.failedPercentage = "0.00";
    this.totalProcessed = 0;
  }
  onFiltering(event: any) {
    this.filteredValue = event.filteredValue;
    if (this.filteredValue.length === 0) {
      this.uploadStatusTablepaginatorhide = false;
    } else {
      if (this.uploadStatusTablepaginatorhide === false) {
        this.uploadStatusTablepaginatorhide = true;
      }
    }
  }


}
