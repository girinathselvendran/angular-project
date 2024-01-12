import { Component, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StoreService } from '../service/store.service';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { NotificationService } from 'src/app/core/services';

@Component({
  selector: 'app-store-information',
  templateUrl: './store-information.component.html',
  styleUrls: ['./store-information.component.css']
})
export class StoreInformationComponent {
  @Output() arraysEmitter: EventEmitter<{ array1: any[], array2: any[] }> = new EventEmitter();
  @Input() editSaveStoreInformationForm!: FormGroup;
  @Input() zoneDetailsForm!: FormGroup;
  @Input() binDetailsForm!: FormGroup;
  @Input() storeKeeperDetailsForm!: FormGroup;
  @Input() parentMode: any;
  @Input() parentStoreId: any;
  @Input() createBit!: boolean;
  @Input() editBit!: boolean;
  @Input() viewBit!: boolean;
  @ViewChild('storeKeeperModal') storeKeeperModal: any;
  @ViewChild('binZoneModal') binZoneModal: any;

  depotTypes: any;
  StoreBinDetails: any = [];
  mode = 'new';
  storeKeeperMode: any;

  // enable rights
  disableSaveButton: boolean = false;
  disableAttachmentButton: boolean = false;
  disableAddButton: boolean = false;
  disableZoneAndBinAddButton: boolean = false;
  disableStoreKeeperAddButton: boolean = false;
  editSaveForm!: FormGroup;
  storeRateForm!: FormGroup;
  storeRateDetails = true;
  showList: boolean = false;
  storeRateMode!: string;
  storeRateSubmitted!: boolean;
  saveButton = false;
  isUnsavedBin = false;
  showStoreKeeperCombination = false;
  id = 1; //to handle the add bin locally function
  binMode = 'new'; //to handle the mode of bin
  storeKeeperColumnHeaderList = [

    {
      field: 'storeKeeper',
      header: this.translate.instant("master.store.grid.storeKeeper"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,

    },
    {
      field: 'designation',
      header: this.translate.instant("master.store.grid.designation"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,

    },
    {
      field: 'emailId',
      header: this.translate.instant("master.store.grid.emailId"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,

    },
    {
      field: 'mobileNo',
      header: this.translate.instant("master.store.grid.mobileNo"),
      width: '12%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,

    },
    {
      field: 'landlineNo',
      header: this.translate.instant("master.store.grid.landlineNo"),
      width: '12%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,

    },
    {
      field: 'keyPersonStatus',
      header: this.translate.instant("master.store.grid.keyPersonStatus"),
      width: '12%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,

    },
    {
      field: 'delete',
      header: '',
      width: '5%',
    }
  ]
  excelFileNameStoreKeeperDetails = 'Store Keeper Details List';
  excelFileNameZoneAndBinDetails = 'Zone and Bin Details List';

  storeKeeperGridData: any;

  zoneGridcolumnHeaderList = [
    {
      field: 'zoneCode',
      header: this.translate.instant("master.store.grid.zoneCode"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,

    },
    {
      field: 'zoneName',
      header: this.translate.instant("master.store.grid.zoneName"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,

    },
    {
      field: 'remarks',
      header: this.translate.instant("master.store.grid.remarks"),
      width: '8%',
      isFilter: false,
      isSubHeader: false,
      type: 'string',
      showHeaderIcon: false,
      isIcon: false,
      key: 3,
    },
    {
      field: 'delete',
      header: '',
      width: '5%',
      key: 4
    }
  ]
  submitted: boolean = false;
  addStoreRateBtn = true;
  zoneGridTableInitialData: any;
  ddL = [];
  uomDDList: any;
  columnHeaderList = [
    {
      field: 'binCode',
      header: this.translate.instant("master.store.grid.binCode"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,

    },
    {
      field: 'binName',
      header: this.translate.instant("master.store.grid.binName"),
      width: '12%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,

    },
    {
      field: 'remarks',
      header: this.translate.instant("master.store.grid.remarks"),
      width: '12%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,

      showHeaderIcon: false,
      isIcon: false,

    },
    {
      field: 'delete',
      header: this.translate.instant("master.store.grid.delete"),
      width: '12%',
    },
  ];

  partSpecificationDDList: any;
  selectedRowDataStoreKeeper: any;
  selectedRowDataZone: any;
  zoneBinMode = 'new';
  selectedBinRowData: any;

  constructor(
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private userAuthService: UserAuthService,
    private confirmationService: ConfirmationService,
    private translate: TranslateService,
    private loaderService: NgxUiLoaderService,
    public notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.getActiveDepots()
    if (this.parentMode == 'edit') {
      this.getStoreKeeperDetails(this.parentStoreId)
      this.getZoneDetails(this.parentStoreId)
    }
    this.enableRights()
  }

  emitArraysToParent(): void {
    this.arraysEmitter.emit({ array1: this.StoreBinDetails, array2: this.zoneGridTableInitialData });
  }

  closeStoreKeeperModal() {
    if (this.storeKeeperDetailsForm.dirty) {

      this.confirmationService.confirm({
        message: this.translate.instant("common.Information.unsavedChangesInfo"),
        header: this.translate.instant("common.notificationTitle.confirmation"),
        accept: () => {
          this.storeKeeperModal.hide();
          this.storeKeeperDetailsForm.reset();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.storeKeeperModal.hide();
      this.storeKeeperDetailsForm.reset();
    }
  }
  openStoreKeeperModal(storeKeeperMode: string) {
    this.storeKeeperMode = storeKeeperMode;
    this.storeKeeperModal.show();
  }
  deleteBinRowData(event: any) {
    const rowId = event.rowDetails.id;
    this.confirmationService.confirm({
      message: this.translate.instant('common.Information.deleteConfirmation'),
      header: this.translate.instant('common.notificationTitle.confirmation'),
      accept: () => {
        this.handleDeleteBinRowData(rowId, event);
      },
      reject: () => {
        return false;
      },
    });
  }
  handleDeleteBinRowData(rowId: any, event: any) {


    this.loaderService.start()
    if (event.rowDetails.storeBinDetailId == 0 || event.rowDetails.storeBinDetailId == undefined) {
      this.StoreBinDetails = this.StoreBinDetails.filter((binDetail: any) => binDetail.id !== rowId);

    } else {
      this.loaderService.start();
      this.storeService
        .deleteBin(event.rowDetails.storeBinDetailId)
        .subscribe(
          (data: any) => {
            if (data["status"] === true) {
              this.StoreBinDetails = this.StoreBinDetails.filter((binDetail: any) => binDetail.storeBinDetailId !== event.rowDetails.storeBinDetailId);
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
  async addZoneAndBin() {

    if (this.zoneDetailsForm.invalid) {

      this.validateAllMethodFormFields(this.zoneDetailsForm);

      return;
    } else
      if (this.StoreBinDetails?.length < 1) {
        this.notificationService.smallBox({
          title: this.translate.instant("common.notificationTitle.error"),
          content: this.translate.instant("master.store.errors.atleastOneBin"),
          severity: 'error',
          timeout: 5000,
          icon: "fa fa-times",
        });
        return;
      }
    if (this.binDetailsForm.dirty) {
      this.notificationService.smallBox({
        title: this.translate.instant("common.notificationTitle.error"),
        content: this.translate.instant("master.store.messages.unSaveBin"),
        severity: 'error',
        timeout: 5000,
        icon: "fa fa-times",
      });
      return;
    }
    if (this.parentStoreId == undefined || this.parentStoreId == null || this.parentStoreId == 0) {
      this.notificationService.smallBox({
        title: this.translate.instant("common.notificationTitle.error"),
        content: this.translate.instant("store.errors.createStoreForZoneBin"),
        severity: 'error',
        timeout: 5000,
        icon: "fa fa-times",
      });
      return;
    }
    else {


      if (this.zoneDetailsForm.dirty || this.binDetailsForm.dirty) {


        const createStoreZoneDetailsPayload: any = await this.constructStoreObject();

        if (this.zoneBinMode === 'new') {
          this.loaderService.start();
          this.storeService
            .createZoneBin(createStoreZoneDetailsPayload)
            .subscribe(
              (data: any) => {
                if (data["status"] === true) {
                  this.getZoneDetails(this.parentStoreId)
                  this.binDetailsForm.reset();
                  this.zoneDetailsForm.reset();
                  this.binZoneModal.hide();
                  this.loaderService.stop();
                  this.zoneBinMode = 'new';
                  this.StoreBinDetails = [];
                  this.notificationService.smallBox({
                    severity: 'success',
                    title: this.translate.instant(
                      'common.notificationTitle.success'
                    ),
                    content: data['message'],
                    timeout: 5000,
                    icon: 'fa fa-check',
                  })

                } else {
                  this.loaderService.stop();
                  this.notificationService.smallBox({
                    title: this.translate.instant("common.notificationTitle.error"),
                    content: data["message"],
                    // color: "#a90329",
                    severity: 'error',
                    timeout: 5000,
                    icon: "fa fa-times",
                  });
                }
              },
            );
        } else {
          this.loaderService.start();
          this.storeService
            .updateZoneBin(createStoreZoneDetailsPayload)
            .subscribe(
              (data: any) => {
                if (data["status"] === true) {
                  this.getZoneDetails(this.parentStoreId)

                  this.binDetailsForm.reset();
                  this.zoneDetailsForm.reset();
                  this.binZoneModal.hide();

                  this.loaderService.stop();
                  this.StoreBinDetails = [];
                  this.zoneBinMode = 'edit';

                  this.notificationService.smallBox({
                    severity: 'success',
                    title: this.translate.instant(
                      'common.notificationTitle.success'
                    ),
                    content: data['message'],
                    timeout: 5000,
                    icon: 'fa fa-check',
                  })

                } else {
                  this.loaderService.stop();
                  this.notificationService.smallBox({
                    title: this.translate.instant("common.notificationTitle.error"),
                    content: data["message"],
                    // color: "#a90329",
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

  receiveBinRowData(event: any) {
    this.binDetailsForm.patchValue(event);
    this.selectedBinRowData = event;
    this.binMode = 'edit';
  }
  clearBinDetails() {
    this.binMode = 'new';
    this.binDetailsForm.reset();
    this.selectedBinRowData = null;
  }
  saveBinDetails() {
    if (this.binDetailsForm.invalid) {

      this.validateAllMethodFormFields(this.binDetailsForm);
    } else {
      this.zoneDetailsForm.markAsDirty();
      if (this.binMode == 'new') {
        this.StoreBinDetails.push(
          {
            binName: this.binDetailsForm.controls['binName'].value,
            binCode: this.binDetailsForm.controls['binCode'].value,
            remarks: this.binDetailsForm.controls['remarks'].value,
            CreatedBy: this.userAuthService.getCurrentUserName(),
            ModifiedBy: this.userAuthService.getCurrentUserName(),
            id: this.id,
            storeBinDetailId: 0
          }
        );
        this.id = this.id + 1;
        this.notificationService.smallBox({
          severity: 'success',
          title: this.translate.instant(
            'common.notificationTitle.success'
          ),
          content: this.translate.instant(
            'master.store.messages.addBinDetails'
          ),
          timeout: 5000,
          icon: 'fa fa-check',
        })

      } else if (this.binMode == 'edit') {
        this.StoreBinDetails.forEach((binDetail: any) => {
          if ((binDetail.id == this.selectedBinRowData.id && this.selectedBinRowData.id != undefined && binDetail.id != undefined) || binDetail.storeBinDetailId == this.selectedBinRowData.storeBinDetailId) {

            binDetail.binCode = this.binDetailsForm.controls['binCode'].value;
            binDetail.binName = this.binDetailsForm.controls['binName'].value;
            binDetail.remarks = this.binDetailsForm.controls['remarks'].value;
          }
        });
        this.notificationService.smallBox({
          severity: 'success',
          title: this.translate.instant(
            'common.notificationTitle.success'
          ),
          content: this.translate.instant(
            'master.store.messages.updateBinDetails'
          ),
          timeout: 5000,
          icon: 'fa fa-check',
        })
      }

      this.binMode = 'new';
      this.binDetailsForm.reset();
      this.selectedBinRowData = null;
    }
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


  get editSaveFormControls(): any {
    return this.editSaveStoreInformationForm['controls'];
  }
  get zoneDetailsFormControls(): any {
    return this.zoneDetailsForm['controls'];
  }
  get binDetailsFormControls(): any {
    return this.binDetailsForm['controls'];
  }
  get storeKeeperDetailsFormControls(): any {
    return this.storeKeeperDetailsForm['controls'];
  }

  contactFormReset() {
    this.resetContact();
  }
  clearZoneBinDialog() {
    this.StoreBinDetails = [];
    this.selectedRowDataZone = null;
    this.zoneDetailsForm.reset();
    this.binDetailsForm.reset();
  }
  closeZoneBinDialog() {
    if (this.zoneDetailsForm.dirty || this.binDetailsForm.dirty) {
      this.confirmationService.confirm({
        message: this.translate.instant("common.Information.unsavedChangesInfo"),
        header: this.translate.instant("common.notificationTitle.confirmation"),
        accept: () => {
          this.clearZoneBinDialog();
          this.binZoneModal.hide();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.clearZoneBinDialog();
      this.binZoneModal.hide();
    }

  }
  resetContact() {
    this.storeKeeperDetailsForm.reset();
    this.storeKeeperDetailsForm.markAsPristine();
  }

  clearZoneDetail() {
    this.zoneDetailsForm.reset();
  }

  addNewZone() {

    if (this.zoneDetailsForm.dirty || this.binDetailsForm.dirty) {

      this.confirmationService.confirm({
        message: this.translate.instant("common.Information.unsavedChangesInfo"),
        header: this.translate.instant("common.notificationTitle.confirmation"),
        accept: () => {
          this.zoneBinMode = 'new';
          this.clearZoneBinDialog();
        },
        reject: () => {
          return false;
        },
      });
    } else {
      this.zoneBinMode = 'new';
      this.clearZoneBinDialog();
    }

  }

  openStoreRateDialog(modeType: string) {

    if (this.editSaveStoreInformationForm.invalid) {
      this.validateAllMethodFormFields(this.editSaveStoreInformationForm);
      return;
    } else {
      this.zoneBinMode = modeType;
      this.binZoneModal.show();
      this.binMode = 'new';
    }
  }
  get storeRateFormControls(): any {
    return this.storeRateForm.controls;
  }

  getActiveDepots() {
    this.storeService.getActiveDepot(this.userAuthService.getCurrentUserId()).subscribe((res) => {
      if (res.status === true) {

        if (res.response.length === 1) {
          this.editSaveStoreInformationForm.controls['depot'].setValue(res.response[0]);
          this.editSaveStoreInformationForm.controls['depot'].disable();
        } else {
          this.depotTypes = res.response
        }
      }
    })
  }

  getStoreKeeperDetails(parentStoreId: any) {
    this.storeService.getStoreKeeperDetails(this.userAuthService.getCurrentUserId(), parentStoreId).subscribe((res) => {
      if (res.status === true) {
        this.storeKeeperGridData = res.response;
      }
    })
  }

  getZoneDetails(parentStoreId: any) {
    this.storeService.getZoneDetails(this.userAuthService.getCurrentUserId(), parentStoreId).subscribe((res) => {
      if (res.status === true) {
        this.zoneGridTableInitialData = res.response;
      }
    })
  }
  getBinDetails(storeZoneDetailId: any) {
    this.storeService.getBinDetails(this.userAuthService.getCurrentUserId(), storeZoneDetailId).subscribe((res) => {
      if (res.status === true) {
        this.StoreBinDetails = res.response;
      }
    })
  }
  onChangeActiveToggle(activeValue: any) {

    if (this.parentMode == 'edit') {
      this.editSaveStoreInformationForm.controls['isActiveChanged'].setValue(true);
    }
  }
  refreshZoneAndBinIconClick(event: any) {

    this.getZoneDetails(this.parentStoreId);
  }
  refreshStoreKeeperIconClick(event: any) {
    this.getStoreKeeperDetails(this.parentStoreId);
  }
  refreshBinIconClick(event: any) {
    this.getBinDetails(this.selectedRowDataZone?.storeZoneDetailId)
  }

  receiveTableRowData(event: any) {
    this.showList = false;
  }

  checkNgSelectValue(event: any, controlName: any) {
    const control: any = this.editSaveStoreInformationForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors.required = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });
      this.editSaveStoreInformationForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }


  receiveTableRowDataStoreKeeper(event: any) {
    this.selectedRowDataStoreKeeper = event;
    this.storeKeeperDetailsForm.patchValue(event);
    this.openStoreKeeperModal('edit')
  }
  receiveTableRowDataZone(event: any) {
    this.selectedRowDataZone = event;
    this.zoneDetailsForm.patchValue(event);
    this.getBinDetails(event.storeZoneDetailId)
    this.openZoneBinModal('edit')
  }

  openZoneBinModal(mode: any) {
    this.zoneBinMode = mode;
    this.binZoneModal.show();
  }
  deleteRowDataStoreKeeper(event: any) {
    this.confirmationService.confirm({
      message: this.translate.instant('common.Information.deleteConfirmation'),
      header: this.translate.instant('common.notificationTitle.confirmation'),
      accept: () => {
        this.handleDeleteRowDataStoreKeeper(event.storekeeperInfoId);
      },
      reject: () => {
        return false;
      },
    });
  }
  deleteRowDataZone(event: any) {
    this.confirmationService.confirm({
      message: this.translate.instant('common.Information.deleteConfirmation'),
      header: this.translate.instant('common.notificationTitle.confirmation'),
      accept: () => {
        this.handleDeleteRowDataZone(event.storeZoneDetailId);
      },
      reject: () => {
        return false;
      },
    });
  }
  handleDeleteRowDataZone(StoreZoneDetailId: any) {
    this.loaderService.start();
    this.storeService
      .deleteZone(StoreZoneDetailId)
      .subscribe(
        (data: any) => {
          if (data["status"] === true) {
            this.getZoneDetails(this.parentStoreId)
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

          } else {
            this.loaderService.stop();
            this.notificationService.smallBox({
              title: this.translate.instant("common.notificationTitle.error"),
              content: data["message"],
              // color: "#a90329",
              severity: 'error',
              timeout: 5000,
              icon: "fa fa-times",
            });
          }
        },
      );
  }
  handleDeleteRowDataStoreKeeper(StorekeeperInfoId: any) {
    this.loaderService.start();
    this.storeService
      .deleteStoreKeeper(StorekeeperInfoId)
      .subscribe(
        (data: any) => {
          if (data["status"] === true) {
            this.getStoreKeeperDetails(this.parentStoreId)
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

          } else {
            this.loaderService.stop();
            this.notificationService.smallBox({
              title: this.translate.instant("common.notificationTitle.error"),
              content: data["message"],
              // color: "#a90329",
              severity: 'error',
              timeout: 5000,
              icon: "fa fa-times",
            });
          }
        },
      );
  }

  constructStoreObject() {

    if (this.zoneBinMode === 'new') {
      const zoneBinObject = {
        StoreBinDetails: this.StoreBinDetails,
        StoreId: this.parentStoreId,
        ZoneCode: this.zoneDetailsForm.controls['zoneCode']?.value,
        ZoneName: this.zoneDetailsForm.controls['zoneName']?.value,
        Remarks: this.zoneDetailsForm.controls['remarks']?.value,
        CreatedBy: this.userAuthService.getCurrentUserName(),
        ModifiedBy: this.userAuthService.getCurrentUserName(),
      }
      return zoneBinObject;
    } else if (this.zoneBinMode == 'edit') {
      const zoneBinObject = {
        StoreBinDetails: this.StoreBinDetails,
        StoreId: this.parentStoreId,
        StoreZoneDetailId: this.selectedRowDataZone.storeZoneDetailId,
        Created: this.selectedRowDataZone.created,
        Modified: this.selectedRowDataZone.modified,
        ZoneCode: this.zoneDetailsForm.controls['zoneCode']?.value,
        ZoneName: this.zoneDetailsForm.controls['zoneName']?.value,
        Remarks: this.zoneDetailsForm.controls['remarks']?.value,
        CreatedBy: this.userAuthService.getCurrentUserName(),
        ModifiedBy: this.userAuthService.getCurrentUserName(),
      }
      return zoneBinObject;
    }
    return true;
  }

  onInputDesignationStoreKeeper(event: any, controlName: any) {

    if (this.parentMode = "edit") {
      const designation = this.storeKeeperDetailsForm.controls['designation'].value || null;
      const storeKeeper = this.storeKeeperDetailsForm.controls['storeKeeper'].value || null;
      const storekeeperInfoId = this.selectedRowDataStoreKeeper?.storekeeperInfoId || 0;
      const storeId = this.parentStoreId;

      const controlDesignation = this.storeKeeperDetailsForm.controls['designation'];
      const controlStoreKeeper = this.storeKeeperDetailsForm.controls['storeKeeper'];

      if (controlStoreKeeper?.value || controlDesignation) {
        this.storeService.isStoreKeeperDesignationCombinationValid(storeKeeper, designation, storekeeperInfoId, storeId).subscribe((data: any) => {
          if (data['status'] === true) {
            this.showStoreKeeperCombination = false;

          } else {
            this.showStoreKeeperCombination = true;
          }
        });
      }
    }
  }


  constructStoreKeeperObject() {
    if (this.storeKeeperMode === "new") {
      const StoreKeeperObject = {
        StoreKeeperName: this.storeKeeperDetailsForm.controls['storeKeeper']?.value,
        Designation: this.storeKeeperDetailsForm.controls['designation']?.value,
        Email: this.storeKeeperDetailsForm.controls['emailId']?.value,
        MobileNo: this.storeKeeperDetailsForm.controls['mobileNo']?.value,
        LandlineNo: this.storeKeeperDetailsForm.controls['landlineNo']?.value,
        KeyContact: this.storeKeeperDetailsForm.controls['keyPerson']?.value || false,
        CreatedBy: this.userAuthService.getCurrentUserName(),
        ModifiedBy: this.userAuthService.getCurrentUserName(),
        StoreId: this.parentStoreId
      }
      return StoreKeeperObject;
    } else {
      const StoreKeeperObject = {
        StoreKeeperName: this.storeKeeperDetailsForm.controls['storeKeeper']?.value,
        Designation: this.storeKeeperDetailsForm.controls['designation']?.value,
        Email: this.storeKeeperDetailsForm.controls['emailId']?.value,
        MobileNo: this.storeKeeperDetailsForm.controls['mobileNo']?.value,
        LandlineNo: this.storeKeeperDetailsForm.controls['landlineNo']?.value,
        KeyContact: this.storeKeeperDetailsForm.controls['keyPerson']?.value || false,
        CreatedBy: this.selectedRowDataStoreKeeper.createdBy,
        Created: this.selectedRowDataStoreKeeper.created,
        Modified: this.selectedRowDataStoreKeeper.modified,
        ModifiedBy: this.userAuthService.getCurrentUserName(),
        StoreId: this.selectedRowDataStoreKeeper.storeId,
        StoreKeeperInfoId: this.selectedRowDataStoreKeeper.storekeeperInfoId
      }

      return StoreKeeperObject;
    }
  }
  addNewForm() {
    this.enableRights();
  }
  resetZoneGrid() {
    this.zoneGridTableInitialData = [];
  }
  resetStoreKeeper() {
    this.storeKeeperGridData = [];
  }

  addStoreKeeperDetail() {

    if (this.storeKeeperDetailsForm.invalid) {
      this.validateAllMethodFormFields(this.storeKeeperDetailsForm);
      return;
    } else if (this.parentStoreId == undefined || this.parentStoreId == null || this.parentStoreId == 0) {
      this.notificationService.smallBox({
        title: this.translate.instant("common.notificationTitle.error"),
        content: this.translate.instant("store.errors.createStoreForStoreKeeper"),
        severity: 'error',
        timeout: 5000,
        icon: "fa fa-times",
      });
      return;
    } else {
      let filterdPersons: any;
      if (this.storeKeeperMode === 'edit') {
        filterdPersons = this.storeKeeperGridData?.filter((x: any) => x.keyPerson === true && x.storekeeperInfoId !== this.selectedRowDataStoreKeeper.storekeeperInfoId);
      } else {
        filterdPersons = this.storeKeeperGridData?.filter((x: any) => x.keyPerson === true);
      }


      const createStoreKeeperPayload: any = this.constructStoreKeeperObject();
      if (this.storeKeeperMode === "new" && filterdPersons?.length <= 0) {

        this.loaderService.start();
        this.storeService
          .createStoreKeeper(createStoreKeeperPayload)
          .subscribe(
            (data: any) => {
              if (data["status"] === true) {
                this.getStoreKeeperDetails(this.parentStoreId)
                this.loaderService.stop();
                // this.mode = "edit";
                this.storeKeeperDetailsForm.reset();
                this.storeKeeperDetailsForm.controls['keyPerson'].setValue(false);
                this.closeStoreKeeperModal();
                this.notificationService.smallBox({
                  severity: 'success',
                  title: this.translate.instant(
                    'common.notificationTitle.success'
                  ),
                  content: data['message'],
                  timeout: 5000,
                  icon: 'fa fa-check',
                })

              } else {
                this.loaderService.stop();
                this.notificationService.smallBox({
                  title: this.translate.instant("common.notificationTitle.error"),
                  content: data["message"],
                  // color: "#a90329",
                  severity: 'error',
                  timeout: 5000,
                  icon: "fa fa-times",
                });
              }
            },
          );
      } else if (this.storeKeeperMode === "new" && filterdPersons?.length > 0 && this.storeKeeperDetailsForm.controls['keyPerson'].value == true) {
        this.confirmationService.confirm({
          message: this.translate.instant('master.supplier.contactAndAddress.contactInformation.confirmation.warning'),
          header: this.translate.instant('common.notificationTitle.confirmation'),
          icon: 'fa fa-exclamation-triangle',
          accept: () => {
            const StoreKeeperEditObject = {
              StoreKeeperName: filterdPersons[0].storeKeeper,
              Designation: filterdPersons[0].designation,
              Email: filterdPersons[0].emailId,
              MobileNo: filterdPersons[0].mobileNo,
              LandlineNo: filterdPersons[0].landlineNo,
              KeyContact: false,
              CreatedBy: filterdPersons[0].createdBy,
              Created: filterdPersons[0].created,
              Modified: filterdPersons[0].modified,
              ModifiedBy: this.userAuthService.getCurrentUserName(),
              StoreId: filterdPersons[0].storeId,
              StoreKeeperInfoId: filterdPersons[0].storekeeperInfoId
            }
            this.loaderService.start();
            this.storeService
              .updateStoreKeeper(StoreKeeperEditObject)
              .subscribe(
                (data: any) => {
                  if (data["status"] === true) {
                    this.getStoreKeeperDetails(this.parentStoreId)
                    this.storeService
                      .createStoreKeeper(createStoreKeeperPayload)
                      .subscribe(
                        (data: any) => {
                          if (data["status"] === true) {
                            this.getStoreKeeperDetails(this.parentStoreId)
                            this.loaderService.stop();
                            // this.mode = "edit";
                            this.storeKeeperDetailsForm.reset();
                            this.storeKeeperDetailsForm.controls['keyPerson'].setValue(false);

                            this.closeStoreKeeperModal();
                            this.notificationService.smallBox({
                              severity: 'success',
                              title: this.translate.instant(
                                'common.notificationTitle.success'
                              ),
                              content: data['message'],
                              timeout: 5000,
                              icon: 'fa fa-check',
                            })

                          } else {
                            this.loaderService.stop();
                            this.notificationService.smallBox({
                              title: this.translate.instant("common.notificationTitle.error"),
                              content: data["message"],
                              // color: "#a90329",
                              severity: 'error',
                              timeout: 5000,
                              icon: "fa fa-times",
                            });
                          }
                        },
                      );

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
          },
          reject: () => {
          }
        });

      } else if (this.storeKeeperMode === "edit" && filterdPersons?.length > 0 && this.storeKeeperDetailsForm.controls['keyPerson'].value == true) {

        this.confirmationService.confirm({
          message: this.translate.instant('master.store.confirmation.keyPersonWarning'),
          header: this.translate.instant('common.notificationTitle.confirmation'),
          icon: 'fa fa-exclamation-triangle',
          accept: () => {
            const StoreKeeperEditObject = {
              StoreKeeperName: filterdPersons[0].storeKeeper,
              Designation: filterdPersons[0].designation,
              Email: filterdPersons[0].emailId,
              MobileNo: filterdPersons[0].mobileNo,
              LandlineNo: filterdPersons[0].landlineNo,
              KeyContact: false,
              CreatedBy: filterdPersons[0].createdBy,
              Created: filterdPersons[0].created,
              Modified: filterdPersons[0].modified,
              ModifiedBy: this.userAuthService.getCurrentUserName(),
              StoreId: filterdPersons[0].storeId,
              StoreKeeperInfoId: filterdPersons[0].storekeeperInfoId,
            }
            this.loaderService.start();
            this.storeService
              .updateStoreKeeper(StoreKeeperEditObject)
              .subscribe(
                (data: any) => {
                  if (data["status"] === true) {
                    // this.getStoreKeeperDetails(this.parentStoreId)
                    this.storeService
                      .updateStoreKeeper(createStoreKeeperPayload)
                      .subscribe(
                        (data: any) => {
                          if (data["status"] === true) {
                            this.getStoreKeeperDetails(this.parentStoreId)
                            this.loaderService.stop();
                            // this.mode = "edit";
                            this.storeKeeperDetailsForm.reset();
                            this.storeKeeperDetailsForm.controls['keyPerson'].setValue(false);
                            this.editSaveStoreInformationForm.controls['isActiveChanged'].setValue(false);

                            this.closeStoreKeeperModal();
                            this.notificationService.smallBox({
                              severity: 'success',
                              title: this.translate.instant(
                                'common.notificationTitle.success'
                              ),
                              content: data['message'],
                              timeout: 5000,
                              icon: 'fa fa-check',
                            })

                          } else {
                            this.loaderService.stop();
                            this.notificationService.smallBox({
                              title: this.translate.instant("common.notificationTitle.error"),
                              content: data["message"],
                              // color: "#a90329",
                              severity: 'error',
                              timeout: 5000,
                              icon: "fa fa-times",
                            });
                          }
                        },
                      );



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
          },
          reject: () => {
          }
        });


      } else if (this.storeKeeperMode == 'new' && (this.storeKeeperDetailsForm.controls['keyPerson'].value == false || this.storeKeeperDetailsForm.controls['keyPerson'].value == null) && filterdPersons?.length > 0) {
        this.loaderService.start();
        this.storeService
          .createStoreKeeper(createStoreKeeperPayload)
          .subscribe(
            (data: any) => {
              if (data["status"] === true) {
                this.getStoreKeeperDetails(this.parentStoreId)
                this.loaderService.stop();
                // this.mode = "edit";
                this.storeKeeperDetailsForm.reset();
                this.storeKeeperDetailsForm.controls['keyPerson'].setValue(false);

                this.closeStoreKeeperModal();
                this.notificationService.smallBox({
                  severity: 'success',
                  title: this.translate.instant(
                    'common.notificationTitle.success'
                  ),
                  content: data['message'],
                  timeout: 5000,
                  icon: 'fa fa-check',
                })

              } else {
                this.loaderService.stop();
                this.notificationService.smallBox({
                  title: this.translate.instant("common.notificationTitle.error"),
                  content: data["message"],
                  // color: "#a90329",
                  severity: 'error',
                  timeout: 5000,
                  icon: "fa fa-times",
                });
              }
            }
          )
      } else {

        this.storeService
          .updateStoreKeeper(createStoreKeeperPayload)
          .subscribe(
            (data: any) => {
              if (data["status"] === true) {
                this.getStoreKeeperDetails(this.parentStoreId)
                this.loaderService.stop();
                // this.mode = "edit";
                this.storeKeeperDetailsForm.reset();
                this.storeKeeperDetailsForm.controls['keyPerson'].setValue(false);
                this.editSaveStoreInformationForm.controls['isActiveChanged'].setValue(false);

                this.closeStoreKeeperModal();
                this.notificationService.smallBox({
                  severity: 'success',
                  title: this.translate.instant(
                    'common.notificationTitle.success'
                  ),
                  content: data['message'],
                  timeout: 5000,
                  icon: 'fa fa-check',
                })

              } else {
                this.loaderService.stop();
                this.notificationService.smallBox({
                  title: this.translate.instant("common.notificationTitle.error"),
                  content: data["message"],
                  // color: "#a90329",
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


  // Custom validation for storeCode field
  validateCode(controlName: string) {
    const control = this.editSaveFormControls[controlName];

    if (control.errors) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    const store = {
      storeId: this.parentStoreId || 0,
      storeCode: this.editSaveFormControls['storeCode'].value,
    };
    if (control.value) {
      this.storeService.isCodeValid(store).subscribe((data: any) => {
        if (data['status'] === true) {
          control.setErrors(null);
        } else {
          control.setErrors({ duplicateCode: true });
        }
      });
    }
  }

  // Custom validation for Bin Cod field
  validateBinCode(controlName: string) {
    const control = this.binDetailsForm.controls[controlName];

    if (control.errors) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    const store = {
      zoneId: this.selectedRowDataZone?.storeZoneDetailId || 0,
      binCode: control.value,
      binId: this.selectedBinRowData?.storeBinDetailId || 0,
    };
    if (control.value) {

      if (this.zoneBinMode == "edit") {

        this.storeService.isBinCodeValid(store).subscribe((data: any) => {
          if (data['status'] === true) {
            control.setErrors(null);
          } else {
            control.setErrors({ duplicateCode: true });
          }
        });
      } else {
        const findBinData = this.StoreBinDetails.find((item: any) => item.binCode == control.value)
        if (findBinData) control.setErrors({ duplicateCode: true });
      }
    }
  }

  enableRights() {

    if (!this.editBit && !this.createBit && this.viewBit) {

      // only view
      if (this.parentMode == 'new') {
        this.disableAddButton = true;
        this.disableSaveButton = false;
        this.disableZoneAndBinAddButton = true;
        this.disableStoreKeeperAddButton = true;
        this.editSaveStoreInformationForm.disable();
      } else {
        this.disableAddButton = true;
        this.disableSaveButton = true;
        this.disableZoneAndBinAddButton = true;
        this.disableStoreKeeperAddButton = true;
        this.editSaveStoreInformationForm.disable();
      }
    } else if (!this.createBit && this.editBit && this.viewBit) {
      // edit and view
      if (this.parentMode == 'new') {


        this.editSaveStoreInformationForm.disable();

        this.disableAddButton = true;
        this.disableSaveButton = false;
        this.disableZoneAndBinAddButton = true;
        this.disableStoreKeeperAddButton = true;
      } else {


        this.editSaveStoreInformationForm.enable();

        this.disableAddButton = true;
        this.disableSaveButton = false;
        this.disableZoneAndBinAddButton = true;
        this.disableStoreKeeperAddButton = true;
      }
    } else if (this.createBit && !this.editBit && this.viewBit) {
      // create and view

      if (this.parentMode == 'new') {


        this.editSaveStoreInformationForm.enable();

        this.disableAddButton = false;
        this.disableSaveButton = false;
      } else {


        this.editSaveStoreInformationForm.disable();

        this.disableAddButton = false;
        this.disableSaveButton = true;
        this.disableZoneAndBinAddButton = true;
        this.disableStoreKeeperAddButton = true;
      }
    }


  }


  validateEmail(controlName: any) {


    this.storeKeeperDetailsForm.controls[controlName].setValue(this.storeKeeperDetailsForm.controls[controlName].value !== null ? this.storeKeeperDetailsForm.controls[controlName].value.replace(/\s/g, "") : null);
    const control = this.storeKeeperDetailsForm.controls[controlName].value;
    const control1 = this.storeKeeperDetailsForm.controls[controlName];
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
            if (controlName === "emailId") {
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
                  if (controlName === "emailId") {
                    control1.setErrors({ pattern: true });
                    return;
                  }

                } else {
                  if (controlName === "email") {
                    control1.setErrors(null);
                  }
                  if (controlName === "emailId") {
                    control1.setErrors(null);
                  }

                }
              } else {
                // Not allow consecutive dots or consecutive_ /
                if (controlName === "email") {
                  control1.setErrors({ pattern: true });
                  return;
                }
                if (controlName === "emailId") {
                  control1.setErrors({ pattern: true });
                  return;
                }

              }
            } else {
              if (controlName === "email") {
                control1.setErrors({ pattern: true });
                return;
              }
              if (controlName === "emailId") {
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
          if (controlName === "emailId") {
            control1.setErrors({ pattern: true });
            return;
          }

        }
      }
    } else {
      if (controlName === "email") {
        this.storeKeeperDetailsFormControls.toEmailId.setValidators([
          Validators.required,
        ]);
        this.storeKeeperDetailsFormControls.toEmailId.updateValueAndValidity();
      }
      if (controlName === "emailId") {
        this.storeKeeperDetailsFormControls.emailId.setValidators([
          Validators.required,
        ]);
        this.storeKeeperDetailsFormControls.emailId.updateValueAndValidity();
      }
    }
    return true;
  }

}




