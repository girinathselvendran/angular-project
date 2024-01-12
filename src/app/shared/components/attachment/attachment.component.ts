import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl,
  NgForm,
  MinLengthValidator,
} from "@angular/forms";
import {
  HttpRequest,
  HttpClient,
  HttpEventType,
  HttpParams,
  HttpResponse,
} from "@angular/common/http";
import { NgxUiLoaderService } from "ngx-ui-loader";
import appSettings from "../../../../assets/configuration/env-setting.json";
import { ConfirmationService } from "primeng/api";
import { Observable, Subscription } from "rxjs";
import { Router, RouterStateSnapshot } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import _ from "lodash";
import { NotificationService } from "src/app/core/services/notification.service";
import { UserAuthService } from "src/app/core/services/user-auth.service";
import { AttachmentService } from "../../services/attachment/attachment.service";
@Component({
  selector: "sa-attachment",
  templateUrl: "./attachment.component.html",
  styleUrls: ["./attachment.component.css"],
})
export class AttachmentComponent implements OnInit {
  retResponse!: Subscription[];
  unSavedFilesAfterDelete: any = [];
  filePath: any;
  isFileValid = true;
  isFileValidErrorMessage: any;
  uploadedFileNames = null;
  @Output() attachmentOutPutEvent = new EventEmitter();
  @Output() attachmentPreAdviceEquipmentOutPutEvent = new EventEmitter();
  @ViewChild("attachmentPopup") attachmentPopup: any;
  @ViewChild("attachFile") attachementForm: any;
  @Input() disableBtnsBit!: boolean;
  attachmentDetailsBody: any;
  selectedFileURL: any;
  public imagePath: any;
  imgURL: any;
  public uploader: any;
  displayAttachment = "none";
  currentDate = new Date();
  uploadedFiles: any;
  tempUploadedFiles: any = [];
  deletedAttachment: any = [];
  @Output() fileAttached = new EventEmitter();
  companyId!: number;
  userId: any;
  userName!: string;
  referenceId!: number;
  referenceName: any;
  urls = [];
  changeStatus = true;
  popupDirty = false;
  closeAttachmentBtnClick = false;
  fileGoted = false;
  screenName = null;
  dbScreenTableName = '';
  currentDateTime!: Date;
  message!: any;
  disableUpload = true;
  disableAdd = false;
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private attachmentService: AttachmentService,
    private loaderService: NgxUiLoaderService,
    private notificationService: NotificationService,
    private authService: UserAuthService,
    router: Router,
    public confirmationService: ConfirmationService,
    private translate: TranslateService
  ) {
    this.getUserInfo();
  }
  ngOnInit() {
    if (this.attachementForm) {
      this.attachementForm.nativeElement.value = "";
    }
  }
  ngAfterViewInt() {
    this.attachmentPopup.hide();

  }
  getUserInfo() {
    this.userName = this.authService.user.userName;
    this.userId = this.authService.getCurrentUserId();
    this.companyId = this.authService.getCurrentCompanyId();
  }
  attachment(dbScreenTableName: any, referenceId: any) {
    this.dbScreenTableName = dbScreenTableName;
    this.referenceId = referenceId;
    this.retResponse = [];
    this.upload(this.tempUploadedFiles);
  }
  showAttachment(
    screenName: any,
    screenTableName: any,
    referenceId: any,
    referenceName: any
  ) {
    this.dbScreenTableName = screenTableName;
    this.screenName = screenName;
    this.referenceId = referenceId;
    this.referenceName = referenceName;
    if (referenceId !== 0 && referenceId != null && referenceId !== undefined) {
      this.getAttachments(this.dbScreenTableName, referenceId);
    }
    this.attachmentPopup.show();
    if (this.attachementForm) {
      this.attachementForm.nativeElement.value = "";
    }
    this.isFileValid = true;
    this.isFileValidErrorMessage = "";
    this.popupDirty = false;
    this.deletedAttachment = [];
    this.unSavedFilesAfterDelete = [];
    this.disableAdd = false;
    this.disableUpload = true;
  }

  onAttachmentModalShown(event: any) {
    this.attachmentDetailsBody = document.getElementById(
      "attachmentDetailsBody"
    );
    if (this.attachmentDetailsBody) {
      this.attachmentDetailsBody.scrollTop = 0;
    }
  }
  closeAttachmentClick() {
    this.closeAttachmentBtnClick = true;
    this.closeAttachment();
    this.closeAttachmentBtnClick = false;
  }
  closeAttachment() {
    if (this.changeStatus) {
      this.isFileValid = true;
      this.isFileValidErrorMessage = null;
      if (this.attachementForm) {
        this.attachementForm.nativeElement.value = "";
      }
      this.selectedFileURL = null;
      this.changeStatus = true;
      if (this.closeAttachmentBtnClick) {
        this.attachmentPopup.hide();
      } else {
        this.notificationService.smallBox({
          title: this.translate.instant("common.notificationTitle.information"),
          content: this.translate.instant("common.Information.noChangesInfo"),
         
          severity: "info",
          timeout: 3000,
          icon: "fa fa-check",
        });
      }

      
    } else {
      this.confirmationService.confirm({
        message: this.translate.instant(
          "attachment.unSavedAttachmentsConfirmation"
        ),
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.attachmentPopup.hide();
          this.changeStatus = true;
          this.selectedFileURL = null;
        },
        reject: () => { },
      });
    }
  }
  getAttachments(dbScreenTableName: string, referenceId: number) {
    this.attachmentService
      .getAttachment(dbScreenTableName, referenceId)
      .subscribe((data) => {
        if (data["status"] === true) {
          this.uploadedFiles = data["response"];
          if (this.unSavedFilesAfterDelete.length > 0) {
            this.tempUploadedFiles = this.unSavedFilesAfterDelete.concat(
              this.uploadedFiles
            );
            this.unSavedFilesAfterDelete = [];
          } else {
            this.tempUploadedFiles = this.uploadedFiles;
          }
          this.fileGoted = true;
          this.selectedFileURL = null;
          if (this.tempUploadedFiles.length > 0) {
            if (
              this.tempUploadedFiles[0].type === "image/png" ||
              this.tempUploadedFiles[0].type === "image/jpeg" ||
              this.tempUploadedFiles[0].type === "image/jpg" ||
              this.tempUploadedFiles[0].type === "image/gif"
            ) {
              this.selectedFileURL = this.tempUploadedFiles[0].filePath;
            }
          }
          if (dbScreenTableName === "PreAdviceEquipment") {
            this.attachmentPreAdviceEquipmentOutPutEvent.emit(
              this.uploadedFiles.length
            );
          } else if (dbScreenTableName === "Product") {
            this.attachmentPreAdviceEquipmentOutPutEvent.emit(
              this.uploadedFiles.length
            );
          } else {
            this.attachmentOutPutEvent.emit(this.uploadedFiles.length);
          }
          if (dbScreenTableName === "Product") {
            this.attachmentOutPutEvent.emit(this.uploadedFiles.length);
          } else {
            this.attachmentOutPutEvent.emit(this.uploadedFiles.length);
          }
          if (dbScreenTableName === "Cleaning") {
            this.attachmentOutPutEvent.emit(this.uploadedFiles.length);
          } else {
            this.attachmentOutPutEvent.emit(this.uploadedFiles.length);
          }
        } else {
          this.uploadedFiles = [];
          if (dbScreenTableName === "PreAdviceEquipment") {
            this.attachmentPreAdviceEquipmentOutPutEvent.emit(
              this.uploadedFiles.length
            );
          } else if (dbScreenTableName === "Product") {
            this.attachmentOutPutEvent.emit(this.uploadedFiles.length);
          } else if (dbScreenTableName === "Cleaning") {
            this.attachmentOutPutEvent.emit(this.uploadedFiles.length);
          } else {
            this.attachmentOutPutEvent.emit(this.uploadedFiles.length);
          }
        }
      });
  }

  onDeleteAttachment(event: any): void {
    const data = this.tempUploadedFiles.find(
      (x: { name: number; type: string }) =>
        x.name === event["name"] && x.type === event["type"]
    );
    if (data) {
      this.deletedAttachment = [];
      this.confirmationService.confirm({
        header: this.translate.instant("common.notificationTitle.confirmation"),
        message: this.translate.instant("common.Information.deleteConfirmation"),
        icon: "pi pi-exclamation-triangle",
        accept: () => {
          this.unSavedFilesAfterDelete = [];
          const fileSavedInDb = this.uploadedFiles.filter(
            (x: any) =>
              x.name === event.name &&
              x.attachmentId.toString() === event.attachmentId.toString()
          )[0];
          if (fileSavedInDb) {
            if (
              event.attachmentId != null &&
              event.attachmentId !== undefined
            ) {
              this.deletedAttachment = [...this.deletedAttachment, event];
              this.changeStatus = false;
              this.popupDirty = false;
            }
            this.attachmentService
              .removeAttachement(
                this.deletedAttachment,
                this.dbScreenTableName,
                this.referenceId,
                this.authService.getCurrentUserName()
              )
              .subscribe((data1) => {
                if (data1.type === HttpEventType.Response) {
                  if (data1.body["status"] === true) {
                    this.deletedAttachment = [];
                    this.fileGoted = false;
                    this.changeStatus = true;
                    if (this.screenName === "Pre Advice") {
                      this.message = this.screenName;
                    } else if (
                      this.screenName === "Pre Advice Equipment Detail"
                    ) {
                      this.message = "Equipment " + this.referenceName;
                    } else if (this.screenName === "Business Partner") {
                      this.message = this.screenName;
                    } else if (this.screenName === "Gate In") {
                      this.message = this.screenName;
                    } else if (this.screenName === "Gate Out") {
                      this.message = this.screenName;
                    } else if (this.screenName === "Pre-Trip Inspection") {
                      this.message = this.screenName;
                    } else {
                      this.message = this.screenName;
                    }
                    this.unSavedFilesAfterDelete = _(this.tempUploadedFiles)
                      .differenceBy(this.uploadedFiles, "attachmentId", "name")
                      .value();
                    if (
                      this.unSavedFilesAfterDelete &&
                      this.unSavedFilesAfterDelete.length > 0
                    ) {
                      this.changeStatus = false;
                      this.popupDirty = true;
                    }
                    this.getAttachments(
                      this.dbScreenTableName,
                      this.referenceId
                    );
                    this.notificationService.smallBox({
                      title: this.translate.instant(
                        "common.notificationTitle.success"
                      ),
                      content:
                        this.translate.instant(
                          "attachment.attachmentSuccessfullyRemoved"
                        ) + this.message,
                      
                      timeout: 3000,
                      icon: "fa fa-check",
                    });
                  }
                  this.loaderService.stop();
                }
              });
          } else {
            for (
              let index = 0;
              index < this.tempUploadedFiles.length;
              index++
            ) {
              const element = this.tempUploadedFiles[index];
              if (
                event.name === element.name &&
                element.attachmentId.toString() ===
                event.attachmentId.toString()
              ) {
                this.tempUploadedFiles.splice(index, 1);
                if (this.selectedFileURL === event.filePath) {
                  this.selectedFileURL = null;
                }
                this.notificationService.smallBox({
                  title: this.translate.instant(
                    "common.notificationTitle.information"
                  ),
                  content: this.translate.instant(
                    "attachment.attachmentRemovedInfo"
                  ),
                 
                  severity: "info",
                  timeout: 3000,
                  icon: "fa fa-check",
                });
              }
            }
          }
        },
        reject: () => {
          return true;
        },
      });
    }
  }
  addAttachment(): void {
    if (this.popupDirty) {
      this.attachment(this.dbScreenTableName, this.referenceId);
    } else {
      this.notificationService.smallBox({
        title: this.translate.instant("common.notificationTitle.information"),
        content: this.translate.instant("common.Information.noChangesInfo"),
       
        severity: "info",
        timeout: 3000,
        icon: "fa fa-check",
      });
    }
  }

  onChange(event: any) {
    const eventCopy = event;
    const files: any = [].slice.call(event.target.files);
    this.isFileValidErrorMessage = "";
    if (files.length > 0) {
      this.isFileValid = false;
      let invalidFileCount = 0;
      let validFileCount = 0;
      let err1 = false;
      let err2 = false;
      let err3 = false;
      let valid1 = false;
      for (let index = 0; index < files.length; index++) {
        this.isFileValid = true;
        this.uploadedFileNames = null;

        const formData = new FormData();
        this.onSelectFile(eventCopy, index).subscribe((success) => {
          files[index].filename = files.map((f: any) => f.name);
          files[index].sze = files.map((f: any) => f.size);

          if (this.fnCheckFIleExtension(files[index].name)) {
            const fileNameAndExtensionArr = files[index].name.split(".");
            const fileNameWithoutExtension = fileNameAndExtensionArr[0];
            if (parseInt(files[index].size, 10) < parseInt("15728640", 10)) {
              if (
                parseInt(fileNameWithoutExtension.length, 10) <=
                parseInt("50", 10)
              ) {
                valid1 = true
                this.isFileValid = true;
                validFileCount++;
              } else {

                err3 = true;
                invalidFileCount++;

                this.isFileValid = false;
                this.isFileValidErrorMessage =
                  "Error: Uploaded file name should be less than or equal to 50 characters.";
              }
            } else {

              err2 = true;
              invalidFileCount++;
              this.isFileValid = false;
              this.isFileValidErrorMessage =
                "Error: Uploaded file size should not be greater than 15 MB.";
            }
          } else {

            err1 = true;
            invalidFileCount++;
            this.isFileValid = false;
            this.isFileValidErrorMessage =
              "Error: Incorrect File Format. Please upload the files with recommended formats";
          }


          if (err1 && err2 && err3) {
            this.isFileValidErrorMessage =
              "Error: Incorrect File Format. Please upload the files with recommended formats";
          } else if (err1 && err2) {
            this.isFileValidErrorMessage = "Error: Incorrect File Format. Please upload the files with recommended formats"
          } else if (err2 && err3) {
            this.isFileValidErrorMessage = "Error: Uploaded file name should be less than or equal to 50 characters."
          } else if (err1 && err3) {
            this.isFileValidErrorMessage = "Error: Uploaded file name should be less than or equal to 50 characters."
          }



          if (this.attachementForm) {
            this.attachementForm.nativeElement.value = "";
          }

          if (this.isFileValid === true) {
            const element = files[index];
            element.attachmentDate = new Date();
            element.userName = this.userName;
            element.attachmentId = this.generateId();
            element.value = 0;
            element.state = "";
            element.filePath = this.filePath;
            this.tempUploadedFiles = [element, ...this.tempUploadedFiles];
            if (
              element.type === "image/png" ||
              element.type === "image/jpeg" ||
              element.type === "image/jpg" ||
              element.type === "image/gif"
            ) {
              this.selectedFileURL = element.filePath;
            } else {
              this.selectedFileURL = null;
            }
            if (files.length === validFileCount + invalidFileCount) {
              this.notificationService.smallBox({
                title: this.translate.instant("common.notificationTitle.information"),
                content: this.translate.instant(
                  "attachment.estimateattachmentAddedInfo"
                ),
                severity: "info",
               
                timeout: 4000,
                icon: "fa fa-check",
              });
            } else if (valid1) {
              this.notificationService.smallBox({
                title: this.translate.instant("common.notificationTitle.information"),
                content: this.translate.instant(
                  "attachment.estimateattachmentAddedInfo"
                ),
                severity: "info",
               
                timeout: 4000,
                icon: "fa fa-check",
              });
            }

            if (this.disableUpload === true) {
              this.disableUpload = false;
              this.disableAdd = false;
            }

            this.changeStatus = false;
            this.popupDirty = true;
          }
        });
      }
    } else {
      this.isFileValid = true;
      this.isFileValidErrorMessage = null;
    }
    if (this.attachementForm) {
      this.attachementForm.nativeElement.value = "";
    }
  }
  cancel() {
    this.retResponse.forEach((element) => {
      element.unsubscribe();
    });
    let fileSavedInDb = null;
    for (let i = 0; i < this.tempUploadedFiles.length; i++) {
      if (this.uploadedFiles.length > 0) {
        fileSavedInDb = this.uploadedFiles.filter(
          (x: any) =>
            x.name === this.tempUploadedFiles[0].name &&
            x.attachmentId.toString() ===
            this.tempUploadedFiles[0].attachmentId.toString()
        )[0];
      } else {
        fileSavedInDb = null;
      }
      if (this.isNullOrEmpty(fileSavedInDb)) {
        this.tempUploadedFiles.forEach((element: any) => {
          element.value = 0;
        });
      }
    }
    this.changeStatus = false;
   
  }
  
  cancelUpload(data: any) {
    let count = 0;
    let responseCount = 0;
    let fileSavedInDbCount = null;
    for (let i = 0; i < this.tempUploadedFiles.length; i++) {
      if (this.uploadedFiles.length > 0) {
        fileSavedInDbCount = this.uploadedFiles.filter(
          (x: any) =>
            x.name === this.tempUploadedFiles[i].name &&
            x.attachmentId.toString() ===
            this.tempUploadedFiles[i].attachmentId.toString()
        ).length;
        if (fileSavedInDbCount === 0) {
          count++;
          if (
            this.tempUploadedFiles[i].name === data.name &&
            this.tempUploadedFiles[i].attachmentId === data.attachmentId
          ) {
            this.retResponse.forEach((element) => {
              responseCount++;
              if (responseCount - 1 === count - 1) {
                element.unsubscribe();
                this.tempUploadedFiles[i].value = 0;
                this.changeStatus = false;
              }
            });
          }
        }
      } else {
        count++;
        if (
          this.tempUploadedFiles[i].name === data.name &&
          this.tempUploadedFiles[i].attachmentId === data.attachmentId
        ) {
          this.retResponse.forEach((element) => {
            responseCount++;
            if (responseCount - 1 === count - 1) {
              element.unsubscribe();
              this.tempUploadedFiles[i].value = 0;
              this.changeStatus = false;
            }
          });
        }
      }
    }
    if (this.retResponse.length > 0) {
      if (this.tempUploadedFiles.length === this.uploadedFiles.length) {
        this.disableUpload = true;
        this.disableAdd = false;
      } else {
        this.disableUpload = false;
        this.disableAdd = false;
      }
    }
  }
  upload(files: any) {
    if (files.length === 0) {
      return;
    }
    let uploadCount = 0;
    let uploadSuccessCount = 0;
    for (let i = 0; i < files.length; i++) {
      let fileSavedInDb = null;

      if (this.uploadedFiles && this.uploadedFiles.length > 0) {
        fileSavedInDb = this.uploadedFiles.filter(
          (x: any) =>
            x.name === files[i].name &&
            x.attachmentId.toString() === files[i].attachmentId.toString()
        )[0];
      } else {
        fileSavedInDb = null;
      }

      if (this.isNullOrEmpty(fileSavedInDb)) {
        uploadCount++;
        files[i].value = 0;
        files[i].referenceId = this.referenceId;
        this.isFileValid = true;
        this.isFileValidErrorMessage = "";
        const params =
          this.referenceId.toString() +
          "-" +
          this.dbScreenTableName.toString() +
          "-" +
          this.authService.getCurrentUserName();
        this.retResponse.push(
          this.attachmentService.uploadAttachment(files[i], params).subscribe(
            (event: any) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.disableUpload = true;
                this.disableAdd = true;
                files[i].value = Math.round((100 * event.loaded) / event.total);
              } else if (event instanceof HttpResponse) {
                uploadSuccessCount++;
                if (event.body["status"] === true) {
                  this.uploadedFiles.push(event.body["response"]);
                  this.tempUploadedFiles[i].attachmentId =
                    event.body["response"].attachmentId;
                  this.changeStatus = true;

                
                }
                this.checkCancelUpload(uploadCount, uploadSuccessCount);
               
              }
            },
            (err) => {
             
              files[i].value = 0;
              this.changeStatus = false;
              this.message = "Could not upload the file:" + files[i].name;
            }
          )
        );
      }
    }
  }

  checkCancelUpload(uploadCount: any, uploadSuccessCount: any) {
    if (uploadCount === uploadSuccessCount) {
      if (this.retResponse.length > 0) {
        if (this.tempUploadedFiles.length === this.uploadedFiles.length) {
          this.disableUpload = true;
          this.disableAdd = false;
        } else {
          this.disableUpload = false;
          this.disableAdd = false;
        }
      }
      if (this.screenName === "Pre Advice") {
        this.message = this.screenName;
      } else if (this.screenName === "Gate In") {
        this.message = this.screenName;
      } else if (this.screenName === "Pre Advice Equipment Detail") {
        this.message = "Equipment " + this.referenceName;
      } else if (this.screenName === "Business Partner") {
        this.message = this.screenName;
      } else if (this.screenName === "Booking") {
        this.message = this.screenName;
      } else if (this.screenName === "Gate Out") {
        this.message = this.screenName;
      } else if (this.screenName === "Pre-Trip Inspection") {
        this.message = this.screenName;
      } else if (this.screenName === "Commodity") {
        this.message = this.screenName;
      } else {
        this.message = this.screenName + " : " + this.referenceName;
      }
  
      this.notificationService.smallBox({
        title: this.translate.instant("common.notificationTitle.success"),
        content: this.translate.instant(
          "attachment.attachmentSuccessfullyUploaded"
        ),
        
        timeout: 3000,
        icon: "fa fa-check",
      });
      if (this.dbScreenTableName === "PreAdviceEquipment") {
        this.attachmentPreAdviceEquipmentOutPutEvent.emit(
          this.uploadedFiles.length
        );
      } else {
        this.attachmentOutPutEvent.emit(this.uploadedFiles.length);
      }
      if (this.dbScreenTableName === "Product") {
        this.attachmentPreAdviceEquipmentOutPutEvent.emit(
          this.uploadedFiles.length
        );
      }
      if (this.dbScreenTableName === "Cleaning") {
        this.attachmentPreAdviceEquipmentOutPutEvent.emit(
          this.uploadedFiles.length
        );
      }
    }
  }
  isNullOrEmpty(value: any) {
    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "NaN"
    ) {
      return true;
    } else {
      return false;
    }
  }
  onSelectFile(event: any, index: any): Observable<boolean> {
    return new Observable((observer) => {
      if (event.target.files && event.target.files[index]) {
        const reader = new FileReader();

        reader.readAsDataURL(event.target.files[index]);
        reader.onload = () => {
          this.filePath = reader.result;
          observer.next(true);
          observer.complete();
        };
        reader.onerror = () => {
          this.filePath = null;
          observer.next(true);
          observer.complete();
        };
      }
    });
  }
  showImage(event: any) {
    this.selectedFileURL = event.currentTarget.currentSrc;
  }
  removeAttachment(deletedAttachment: any, dbScreenTableName: any) {
    if (deletedAttachment.length > 0) {
      const currentDateString = new Date().toLocaleString(
        appSettings.ServerTimeZone,
        { timeZone: appSettings.LocalTimeZone }
      );
      this.currentDateTime = new Date(currentDateString);

      this.attachmentService
        .removeAttachement(
          deletedAttachment,
          dbScreenTableName,
          this.referenceId,
          this.authService.getCurrentUserName()
        )
        .subscribe((data) => {
          if (data["status"] === true) {
            this.deletedAttachment = [];
            this.fileGoted = false;
            this.changeStatus = true;
            this.getAttachments(dbScreenTableName, this.referenceId);
            this.loaderService.stop();
          } else {
            this.changeStatus = true;
            this.loaderService.stop();
          }
        });
    }
    this.changeStatus = true;
    this.closeAttachment();
  }
  downloadAttachFile(attachFile: any) {
    if (attachFile != null) {
      if (attachFile.filePath.substr(0, 4) === "http") {
        this.saveAs(attachFile.filePath, attachFile.name);
        this.notificationService.smallBox({
          title: this.translate.instant("common.notificationTitle.success"),
          content: attachFile.name + " Downloaded Successfully",
          
          timeout: 2000,
          icon: "fa fa-check",
        });
      } else {
        const blob = this.dataURIToBlob(attachFile.filePath);
        const url = URL.createObjectURL(blob);
        const bloblink = document.createElement("a");
        bloblink.href = url;
        bloblink.download = attachFile.name;
        bloblink.target = "_blank";
        document.body.appendChild(bloblink);
        bloblink.click();
        document.body.removeChild(bloblink);
        URL.revokeObjectURL(url);
      }
    }
  }
  saveAs(uri: any, filename: any) {
    const link = document.createElement("a");
    if (typeof link.download === "string") {
      link.href = uri;
      link.download = filename;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(uri);
    }
  }
  fnCheckFIleExtension(filename: any) {
    let fileExtension = "";
    if (filename.lastIndexOf(".") > 0) {
      fileExtension = filename
        .substring(filename.lastIndexOf(".") + 1, filename.length)
        .toLowerCase();
    }
    if (
      fileExtension === "xls" ||
      fileExtension === "xlsx" ||
      fileExtension === "csv" ||
      fileExtension === "jpg" ||
      fileExtension === "png" ||
      fileExtension === "jpeg" ||
      fileExtension === "doc" ||
      fileExtension === "ods" ||
      fileExtension === "docx" ||
      fileExtension === "pdf" ||
      fileExtension === "gif" ||
      fileExtension === "txt" ||
      fileExtension === "zip" ||
      fileExtension === "jfif" ||
      fileExtension === "msg"
    ) {
      return true;
    } else {
      return false;
    }
  }
  generateId() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  onChooseFilesBtnClick(): boolean {
    document.getElementById("files")?.click();
    return false;
  }

  dataURIToBlob(dataURI: any) {
    const binStr = atob(dataURI.split(",")[1]),
      len = binStr.length,
      arr = new Uint8Array(len),
      mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr], {
      type: mimeString,
    });
  }
}
