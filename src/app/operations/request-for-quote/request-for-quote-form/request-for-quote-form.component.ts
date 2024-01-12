import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PartSpecificationsComponent } from 'src/app/shared/components/popup/part-specifications/part-specifications.component';
import { AddRFQSupplierComponent } from '../add-rfqsupplier/add-rfqsupplier.component';
import { RequestForQuoteService } from '../service/request-for-quote.service';
import { NotificationService } from 'src/app/core/services';
import { DatePipe } from '@angular/common';
import { RFQPartDetails } from '../model/request-for-quote_model';
@Component({
  selector: 'app-request-for-quote-form',
  templateUrl: './request-for-quote-form.component.html',
  styleUrls: ['./request-for-quote-form.component.css'],
})
export class RequestForQuoteFormComponent {
  @ViewChild("remarksPopup") remarksPopup: any;
  
  @ViewChild('partSpecificationModal') partSpecificationModal: any;

  @ViewChild(AddRFQSupplierComponent) addRFQSupplier!: AddRFQSupplierComponent;
  @Output() onRfqStatusSelectedFn = new EventEmitter();
  @Output() sendPartDetailsData = new EventEmitter();

  @Input() currentDate: Date = new Date();
  @Input() screenId!: number;

  @Input() editSaveRFQForm!: FormGroup;
  @Input() editSaveRFQPartForm!: FormGroup;
  @Input() submitted: boolean = false;
  @Input() editSaveSupplierForm!: FormGroup;
  @Input() mode = 'new';
  @Input() rfqStatusDDList = [];
  @Input() rfqSourceDDList = [];
  @Input() associatedDepots = [];
  @Input() rfqNumberDDList = [];
  @Input() requestForQuoteId: any;
  @Input() selectedGridDataList: any = [];
  tableTitle = 'Purchase Part Specification';
  excelFileName = 'Purchase Part Specification List';
  isShowSupplierRequiredErr: boolean = false;
  rfqSupplierData: any = [];
  remarks: any;
  isShowPartExistErr: boolean = false;
  cityDDList = [];
  partTypeDDList = [];
  partCodeDDList = [];
  partNameDDList = [];
  supplierData: any = [];
  totalEstimatedCode: any;
  partCategoryDDList = [];
  partSpecificationData = [];
  @Input() showPartDetails: boolean = true;
  @Input() partDetailList: any = [];
  selectedRFQPartData: any = [];
  selectedPartId!: number;
  rfqMode = 'new';
  tempRFQPartId = 1;

  tableColumnsPartSpecification = [
    {
      field: 'partSpecification',
      header: this.translate.instant('master.store.grid.partSpecification'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'uom',
      header: this.translate.instant('master.store.grid.uom1'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'value',
      header: this.translate.instant('master.store.grid.value'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
  ];

  partDetailColumnList = [
    {
      field: 'partType',
      header: this.translate.instant(
        'operations.requestForQuote.partDetails.grid.partType'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'partCode',
      header: this.translate.instant(
        'operations.requestForQuote.partDetails.grid.partCode'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'partName',
      header: this.translate.instant(
        'operations.requestForQuote.partDetails.grid.partName'
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
        'operations.requestForQuote.partDetails.grid.partCategory'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'partSpecificationIcon',
      header: this.translate.instant(
        'operations.requestForQuote.partDetails.grid.partSpecification'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 5,
    },
    {
      field: 'stockUom',
      header: this.translate.instant(
        'operations.requestForQuote.partDetails.grid.stockUOM'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 6,
    },
    {
      field: 'requisitionQuantity',
      header: this.translate.instant(
        'operations.requestForQuote.partDetails.grid.requisitionQuantity'
      ),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 7,
      isRightAlign: true
    },
    {
      field: 'partRate',
      header: this.translate.instant(
        'operations.requestForQuote.partDetails.grid.partRate'
      ),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 8,
      isRightAlign: true

    },
    {
      field: 'estimatedCost',
      header: this.translate.instant(
        'operations.requestForQuote.partDetails.grid.estimatedCost'
      ),
      width: '6%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 9,
    },
    {
      field: 'requiredDate',
      header: this.translate.instant(
        'operations.requestForQuote.partDetails.grid.requiredDate'
      ),
      width: '9%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 10,
    },
    {
      field: 'supplier',
      header: this.translate.instant(
        'operations.requestForQuote.partDetails.grid.supplier'
      ),
      width: '7%',
      isFilter: true,
      isSubHeader: false,
      isHyperLink: true,
      type: 'string',
      key: 11,
    },
    {
      field: 'remarks',
      header: this.translate.instant(
        'operations.requestForQuote.partDetails.grid.remarks'
      ),
      width: '7%',
      isFilter: false,
      isSubHeader: false,
      type: 'string',
      showHeaderIcon: false,
      isIcon: true,
      key: 12,
    }
  ];

  supplierGridData: any = [];

  constructor(
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private requestForQuoteService: RequestForQuoteService,
    private datePipe: DatePipe,
    public notificationService: NotificationService
  ) {
    this.requestForQuoteService.partDetailData$.subscribe((data: any[]) => {
      this.partDetailList = data;

      const sum = this.partDetailList.reduce(
        (accumulator: any, object: any) => {
          return accumulator + object.estimatedCost;
        },
        0
      );
      this.totalEstimatedCode = sum;
    });
    this.requestForQuoteService.supplierData$.subscribe((data: any[]) => {
      this.supplierData = data;
    });
    this.requestForQuoteService.supplierGridData$.subscribe(
      (supplierGridData: any) => {
        this.rfqSupplierData = supplierGridData;
      }
    );
    this.requestForQuoteService.supplierGridData$.subscribe(
      (supplierGridData: any) => {
        this.supplierGridData = supplierGridData;
      }
    );
  }

  ngOnInit() {
    this.getPartType();
    this.disablePartCodeFields();
    if (this.mode === 'new') {
      this.initialFormData();
    }
    this.nullifyTempArray();
    if (this.screenId == 259) {
      this.editSaveRFQForm.disable();
    }
    this.editSaveRFQPartForm.reset();
  }
  get editSaveRFQFormController() {
    return this.editSaveRFQForm.controls;
  }
  get editSaveRFQPartFormController() {
    return this.editSaveRFQPartForm.controls;
  }
  initialFormData() {
    this.editSaveRFQForm.disable();
    this.editSaveRFQForm.controls['depot'].enable();
    this.editSaveRFQForm.controls['rfqRemarks'].enable();
    this.editSaveRFQForm.controls['rfqEndDate'].enable();
    this.editSaveRFQForm.controls['rfqDate'].setValue(this.currentDate);
    this.editSaveRFQForm.controls['rfqEndDate'].setValue(this.currentDate);
    this.editSaveRFQForm.controls['rfqSource'].setValue({
      sourceCode: 'DIRECT',
      sourceId: 594,
    });
    this.editSaveRFQForm.controls['rfqStatus'].setValue({
      statusCode: 'DRAFT',
      statusId: 587,
    });
    this.editSaveRFQForm.controls['city'].disable();
    this.editSaveRFQForm.controls['prNumber'].disable();
    this.editSaveRFQPartForm?.controls['requiredDate'].setValue(
      this.currentDate
    );
  }

  onRfqStatusSelected(event: any) {
    this.onRfqStatusSelectedFn.emit(event);
  }
  openSupplierPopup(event: any) {
    this.requestForQuoteService
      .getRFQSupplierDetailsByRfqPartDetailId(event.requestForQuotePartDetailId)
      .subscribe(
        (data: any) => {
          
          if (this.supplierData.length !== 0) {
            let newCreatedSupplierForNewPart: any[] = [];
            this.supplierData.forEach((item: { tempUniqValue: any }) => {
              if (item.tempUniqValue === event.tempUniqValue) {
                newCreatedSupplierForNewPart.push(item);
              }
            });

            // Filter out duplicates based on requestForQuoteSupplierDetailId and tempUniqValue

            // Combine the arrays
            const combinedArray = [
              ...data.response,
              ...newCreatedSupplierForNewPart,
            ].map((item) => ({
              ...item,
              id: this.requestForQuoteService.generateUniqueId(),
            }));

            const uniqueValuesSet = new Set();

            // Filter duplicates based on requestForQuoteSupplierDetailId and supplierId
            const filteredCombinedArray = combinedArray.filter((item) => {
              const key = `${item.requestForQuoteSupplierDetailId}_${item.supplierId}`;

              if (!uniqueValuesSet.has(key)) {
                uniqueValuesSet.add(key);
                return true;
              }

              return false;
            });

            const filteredCombineArray = filteredCombinedArray;
           

            this.requestForQuoteService.setSupplierGridData(
              filteredCombineArray
            );
          }

          this.selectedPartId = event.partId;
          this.getSupplierForDropdown(event.partId);
          this.selectedPartId = event.partId;
          this.getSupplierForDropdown(event.partId);

          this.editSaveRFQPartForm.controls['tempUniqValue'].setValue(
            event.tempUniqValue
          );
          this.requestForQuoteService.setTempUniqValue(event.tempUniqValue);
          this.addRFQSupplier.rfqSupplierModal.show();
        },
        (err) => { }
      );
  }
  openNewCreatedSupplierPopup(event: any) {
    

    if (this.supplierData.length != 0) {
      let newCreatedSupplierForNewPart: any[] = [];
      this.supplierData.forEach((item: { tempUniqValue: any }) => {
        if (item.tempUniqValue === event.tempUniqValue) {
          newCreatedSupplierForNewPart.push(item);
        }
      });

     

      const uniqueValuesSet = new Set();


      // Filter duplicates based on requestForQuoteSupplierDetailId and supplierId
      const filteredCombinedArray = newCreatedSupplierForNewPart.filter(
        (item) => {
          const key = `${item.requestForQuoteSupplierDetailId}_${item.supplierId}`;

          if (!uniqueValuesSet.has(key)) {
            uniqueValuesSet.add(key);
            return true;
          }

          return false;
        }
      );

      const filteredCombineArray = filteredCombinedArray;
    

      this.requestForQuoteService.setSupplierGridData(filteredCombineArray);
    }


    this.selectedPartId = event.partId;
    this.getSupplierForDropdown(event.partId);

    this.requestForQuoteService.setTempUniqValue(event.tempUniqValue);
    this.addRFQSupplier.rfqSupplierModal.show();
  }
  getSupplierToSupplierPopup(requestForQuotePartDetailId: any) {
    this.requestForQuoteService
      .getRFQSupplierDetailsByRfqPartDetailId(requestForQuotePartDetailId)
      .subscribe(
        (data: any) => {
          data.response.map((item: any) => ({
            ...item,
            id: this.requestForQuoteService.generateUniqueId(),
          }));

          const uniqueValuesSet = new Set();

          const filteredCombinedArray = data.response.filter(
            (item: {
              requestForQuoteSupplierDetailId: any;
              supplierId: any;
            }) => {
              const key = `${item.requestForQuoteSupplierDetailId}_${item.supplierId}`;

              if (!uniqueValuesSet.has(key)) {
                uniqueValuesSet.add(key);
                return true;
              }

              return false;
            }
          );

          const filteredCombineArray = filteredCombinedArray;
        

          this.requestForQuoteService.setSupplierGridData(filteredCombineArray);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  getSupplierForDropdown(partId: number) {
    this.requestForQuoteService.getSupplierByPartId(partId).subscribe(
      (data) => {
        this.requestForQuoteService.setPartId(partId);
        this.requestForQuoteService.setSupplierDropdownData(data['response']);
      },
      (err) => { }
    );
  }

  nullifyTempIds() {
    this.editSaveRFQPartForm.controls['partCode'].setValue(null);
    this.selectedPartId = 0;
    this.requestForQuotePartDetailId = 0;
  }
  supplierValidation() {
    var found = false;
    var valueToCheck = this.editSaveRFQPartForm.value.tempUniqValue;

    for (var i = 0; i < this.supplierData.length; i++) {
      if (this.supplierData[i].tempUniqValue === valueToCheck) {
        found = true;
        break;
      }
    }

    if (found) {
      this.isShowSupplierRequiredErr = false;
    } else {
      this.isShowSupplierRequiredErr = true;
    }
  }

  savePartDetails() {
    this.supplierValidation();
    
    if (this.isShowSupplierRequiredErr) {
      if (this.editSaveRFQPartForm.invalid) {
        this.validateAllMethodFormFields(this.editSaveRFQPartForm);
      }
      return;
    } else {
      if (this.isShowPartExistErr) {
        return;
      } else {
        if (this.editSaveRFQPartForm.invalid) {
          this.validateAllMethodFormFields(this.editSaveRFQPartForm);
        } else {
          const formControls = this.editSaveRFQPartForm.controls;
          let message;
         
          const newRFQPartDetails: RFQPartDetails = {
            partTypeId: formControls['partType'].value.partTypeId,
            partType: formControls['partType'].value.code,
            partId: formControls['partCode'].value.partId,
            partCode: formControls['partCode'].value.partCode,
            partName: formControls['partName'].value,
            partCategory: formControls['partCategory'].value,
            requisitionQuantity: formControls['requisitionQuantity'].value,
            partRate: formControls['partRate'].value,
            estimatedCost: formControls['estimatedCost'].value,
            stockUomId: formControls['stockUomId'].value,
            stockUom: formControls['stockUom'].value,
            requiredDate: this.formatDate(formControls['requiredDate'].value),
            remarks: formControls['remarks'].value,
            tempRFQPartId: this.tempRFQPartId,
            tempUniqValue: formControls['tempUniqValue'].value,
          };
          if (this.rfqMode == 'new') {
            this.partDetailList.push(newRFQPartDetails);

           

            this.tempRFQPartId++;

            message = this.translate.instant(
              'operations.requestForQuote.partDetails.messages.partDetailsAdded'
            );
            this.requestForQuoteService.setPartDetailsData(this.partDetailList);
            this.sendPartDetailsData.emit(this.partDetailList);
            this.nullifyTempIds();
            this.editSaveRFQPartForm.reset();
            this.notificationService.smallBox({
              severity: 'success',
              title: this.translate.instant('common.notificationTitle.success'),
              content: message,
              timeout: 5000,
              icon: 'fa fa-check',
            });
           
          } else if (this.rfqMode == 'edit') {
          

            this.partDetailList.forEach((details: RFQPartDetails) => {
              if (
                details.requestForQuotePartDetailId ===
                this.selectedRFQPartData.requestForQuotePartDetailId &&
                this.selectedRFQPartData.requestForQuotePartDetailId !==
                undefined
              ) {
                this.updateRFQPartDetails(details, formControls);
              }

              if (
                details.tempRFQPartId ===
                this.selectedRFQPartData.tempRFQPartId &&
                details.tempRFQPartId !== undefined &&
                this.selectedRFQPartData.tempRFQPartId !== undefined
              ) {
                this.updateRFQPartDetails(details, formControls);
                details.requestForQuoteId =
                  this.selectedRFQPartData.requestForQuoteId;
              }
            });

            

            this.requestForQuoteService.setPartDetailsData(this.partDetailList);

            this.sendPartDetailsData.emit(this.partDetailList);

           

            this.isShowPartExistErr = false;
            this.editSaveRFQPartForm.controls['partCode'].setValue(null);

            message = this.translate.instant(
              'operations.purchaseOrder.addPartDetail.messages.partDetailsUpdated'
            );
            this.nullifyTempIds();
            this.editSaveRFQPartForm.reset();
            this.sendPartDetailsDataToFirst();

            this.notificationService.smallBox({
              severity: 'success',
              title: this.translate.instant('common.notificationTitle.success'),
              content: message,
              timeout: 5000,
              icon: 'fa fa-check',
            });

            this.rfqMode = 'new';
          }
        }
      }
      
    }

   
  }
  nullifyPatchedData() {
    this.requestForQuoteService.setSupplierGridData([]);
    this.requestForQuoteService.setPartId(0);
    this.supplierData = [];
    this.rfqSupplierData = [];
  }
  nullifyTempArray() {
    this.requestForQuoteService.setSupplierData([]);
    this.requestForQuoteService.setPartDetailsData([]);
    this.requestForQuoteService.setSupplierGridData([]);
    this.requestForQuoteService.setPartId(0);
    this.requestForQuoteService.setSupplierDropdownData([]);
    this.supplierData = [];
    this.rfqSupplierData = [];
  }
  sendPartDetailsDataToFirst() {
    this.requestForQuoteService.setPartDetailsData(this.partDetailList);
  }
  updateRFQPartDetails(details: RFQPartDetails, formControls: any) {

    details.partTypeId =
      formControls['partType'].value.partTypeId ||
      this.selectedRFQPartData.partTypeId;
    details.partType =
      formControls['partType'].value.code || this.selectedRFQPartData.partType;
    details.partId =
      formControls['partCode'].value.partId || this.selectedRFQPartData.partId;
    details.partCode =
      formControls['partCode'].value.partCode ||
      this.selectedRFQPartData.partCode;
    details.partName =
      formControls['partName'].value.partName ||
      this.selectedRFQPartData.partName;
    details.partCategory =
      formControls['partCategory'].value.partCategory ||
      this.selectedRFQPartData.partCategory;
    details.requisitionQuantity =
      formControls['requisitionQuantity'].value ||
      this.selectedRFQPartData.requisitionQuantity;
    details.partRate =
      formControls['partRate'].value || this.selectedRFQPartData.partRate;
    details.estimatedCost =
      formControls['estimatedCost'].value ||
      this.selectedRFQPartData.estimatedCost;
    details.stockUomId =
      formControls['partCode'].value.stockUomID ||
      this.selectedRFQPartData.stockUomId;
    details.stockUom =
      formControls['stockUom'].value || this.selectedRFQPartData.stockUom;
    details.requiredDate = formControls['requiredDate'].value
      ? this.formatDate(formControls['requiredDate'].value)
      : '';
    details.remarks =
      formControls['remarks'].value || this.selectedRFQPartData.remarks;
  }
  formatDate(inputDate: string | null | undefined): string {
    if (inputDate) {
      const formattedDate = this.datePipe
        .transform(inputDate, 'dd-MMM-yyyy')!
        .toUpperCase();
      return formattedDate;
    } else {
      return '';
    }
  }
  handleOpenPartSpecification() {
    const partId =
      this.editSaveRFQPartForm?.value?.partCode?.partId ||
      this.selectedPartId ||
      0;
    this.getPartSpecificationList(partId);
  }

  handlePartSpecificationRowData(event: any) {
    const partId = event?.partId || 0;
    this.getPartSpecificationList(partId);
  }
  getPartSpecificationList(partId: any) {
    this.requestForQuoteService
      .getPartSpecificationList(partId)
      .subscribe((data: any) => {
        this.partSpecificationData = data.response;
        this.partSpecificationModal.show();
      });
  }

  handleCloseSpecification() {
    this.partSpecificationModal.hide();
  }

  resetForm() {
    this.editSaveRFQPartForm.reset();
    this.requestForQuotePartDetailId = 0;
    this.uniqValFromSelectedPart = null;
    this.nullifyTempIds();
    this.rfqMode = 'new';
    // this.nullifyPatchedData();
  }

  combinationCheck() {
    throw new Error('Method not implemented.');
  }

  deleteSupplierData(tempUniqValueToDelete: string) {
    this.requestForQuoteService.deleteSupplierDataByUniqueValue(
      tempUniqValueToDelete
    );
  }

  onPartCodeSelected(selectedValue: any) {
    this.clearPreviousSelectedPartAssociatedData();
    const isPartIdExist = this.partDetailList.some(
      (item: { partId: any }) => item.partId === selectedValue.partId
    );
   

    var uniqueValueToCheck = this.editSaveRFQPartForm.value.tempUniqValue;
    var foundUniqueValue = null;
    if (uniqueValueToCheck) {
      for (var i = 0; i < this.supplierData.length; i++) {
        if (this.supplierData[i].tempUniqValue === uniqueValueToCheck) {
          foundUniqueValue = this.supplierData[i].tempUniqValue;
          break;
        }
      }
    }
    if (foundUniqueValue) {
      this.deleteSupplierData(foundUniqueValue);
    }
   

    if (isPartIdExist) {
      this.isShowPartExistErr = true;
    } else {
      this.isShowPartExistErr = false;
      this.selectedPartId = selectedValue.partId;
      let uniqVal = this.requestForQuoteService.generateUniqueId();
      if (this.rfqMode === 'new' && this.mode === 'new') {
       

        this.editSaveRFQPartForm.patchValue({
          partName: selectedValue.partName,
          partCategory: selectedValue.partCategory,
          stockUom: selectedValue.stockUom,
          stockUomId: selectedValue.stockUomID,
          partRate: selectedValue.partRate,
          tempUniqValue: uniqVal,
        });
      } else if (this.rfqMode === 'edit' && this.mode === 'new') {
       
        this.editSaveRFQPartForm.patchValue({
          partName: selectedValue.partName,
          partCategory: selectedValue.partCategory,
          stockUom: selectedValue.stockUom,
          stockUomId: selectedValue.stockUomID,
          partRate: selectedValue.partRate,
          tempUniqValue: this.editSaveRFQPartForm.value.tempUniqValue,
        });
      } else if (this.rfqMode === 'new' && this.mode === 'edit') {
      
        this.editSaveRFQPartForm.patchValue({
          partName: selectedValue.partName,
          partCategory: selectedValue.partCategory,
          stockUom: selectedValue.stockUom,
          stockUomId: selectedValue.stockUomID,
          partRate: selectedValue.partRate,
          tempUniqValue: uniqVal,
        });
      } else if (this.rfqMode === 'edit' && this.mode === 'edit') {
       
        this.editSaveRFQPartForm.patchValue({
          partName: selectedValue.partName,
          partCategory: selectedValue.partCategory,
          stockUom: selectedValue.stockUom,
          stockUomId: selectedValue.stockUomID,
          partRate: selectedValue.partRate,
          tempUniqValue: this.uniqValFromSelectedPart,
        });
      }

      this.requestForQuoteService
        .getPartRateBasedOnPartId(selectedValue.partId)
        .subscribe(
          (data) => {
            const result = data['response'];

            this.editSaveRFQPartForm.controls['partRate'].setValue(
              result && result.rate
            );
          },
          (err) => { }
        );

      let partId = this.editSaveRFQPartForm.controls['partCode'].value.partId;

      // this.getPartSpecificationList(partId);
    }
  }

  getUuidByPartIdFromPartDetail(partId: number): number | undefined {
    const foundObject = this.partDetailList.find(
      (obj: { partId: number }) => obj.partId === partId
    );
    return foundObject?.tempUniqValue;
  }

  // in part detail form

  clearPreviousSelectedPartAssociatedData() {
   
    const filteredSupplier = this.supplierData.filter(
      (supplier: { tempUniqValue: any }) =>
        supplier.tempUniqValue !==
        this.editSaveRFQPartForm?.value?.tempUniqValue
    );
    
    this.deleteSupplierData(this.editSaveRFQPartForm?.value?.tempUniqValue);

    this.requestForQuoteService.setSupplierGridData(filteredSupplier);
   
    this.requestForQuoteService.setPartId(0);
    this.selectedPartId = 0;
  }

  onPartTypeSelected(event: any) {
    this.isShowPartExistErr = false;
    this.editSaveRFQPartForm.controls['partCode'].setValue(null);
    this.editSaveRFQPartForm.controls['partName'].setValue(null);
    this.editSaveRFQPartForm.controls['partCategory'].setValue(null);
    this.editSaveRFQPartForm.controls['stockUom'].setValue(null);
    this.editSaveRFQPartForm.controls['partRate'].setValue(null);
    this.getPartCode(event.partTypeId);
    this.clearPreviousSelectedPartAssociatedData();
  }
  disablePartCodeFields() {
    this.editSaveRFQPartForm.controls['partName'].disable();
    this.editSaveRFQPartForm.controls['partCategory'].disable();
    this.editSaveRFQPartForm.controls['stockUom'].disable();
    this.editSaveRFQPartForm.controls['partRate'].disable();
    this.editSaveRFQPartForm.controls['estimatedCost'].disable();
  }

  handleAmountCalculation(event: any) {
    if (this.editSaveRFQPartForm.controls['requisitionQuantity'].value) {
      const totalCost = this.editSaveRFQPartForm.controls['partRate'].value
        ? this.editSaveRFQPartForm.controls['requisitionQuantity'].value *
        this.editSaveRFQPartForm.controls['partRate'].value
        : this.editSaveRFQPartForm.controls['requisitionQuantity'].value;
      this.editSaveRFQPartForm.controls['estimatedCost'].setValue(totalCost);
    }
  }

  handleOpenSupplierPopup() {
    const partId =
      this.editSaveRFQPartForm?.value?.partCode?.partId || this.selectedPartId;
    let selectedPartDetailTempUniqValue =
      this.editSaveRFQPartForm?.value?.tempUniqValue;

    if (partId) {
      this.requestForQuoteService.getSupplierByPartId(partId).subscribe(
        (data) => {
          this.requestForQuoteService.setPartId(partId);

          this.requestForQuoteService.setSupplierDropdownData(data['response']);
          
        },
        (err) => { }
      );
    } else {
      this.notificationService.smallBox({
        severity: 'error',
        title: this.translate.instant('common.notificationTitle.error'),
        content: this.translate.instant(
          'operations.requestForQuote.errors.selectPartErr'
        ),
        timeout: 3000,
        icon: 'fa fa-times',
      });
    }

    if (this.requestForQuotePartDetailId != 0 && partId) {
      
      let rfqPartNecessaryIdsObject = {
        partId,
        requestForQuotePartDetailId: this.requestForQuotePartDetailId,
        tempUniqValue: this.uniqValFromSelectedPart,
      };

      this.openSupplierPopup(rfqPartNecessaryIdsObject);
    } else if (
      this.requestForQuotePartDetailId == 0 &&
      partId &&
      this.rfqMode === 'new'
    ) {
      let rfqPartNecessaryIdsObject = {
        partId,
        requestForQuotePartDetailId: this.requestForQuotePartDetailId,
        tempUniqValue: selectedPartDetailTempUniqValue,
      };
      this.openNewCreatedSupplierPopup(rfqPartNecessaryIdsObject);
    } else if (
      this.requestForQuotePartDetailId == 0 &&
      partId &&
      this.rfqMode === 'edit'
    ) {
      let rfqPartNecessaryIdsObject = {
        partId,
        requestForQuotePartDetailId: this.requestForQuotePartDetailId,
        tempUniqValue: selectedPartDetailTempUniqValue,
      };
      this.openNewCreatedSupplierPopup(rfqPartNecessaryIdsObject);
    }

  
  }
  requestForQuotePartDetailId = 0;
  uniqValFromSelectedPart: any = '';
  receiveTablePartDetailList(event: any) {
    this.rfqMode = 'edit';
    
    if (this.mode === 'new') {
      this.isShowPartExistErr = false;
      this.isShowSupplierRequiredErr = false;
      this.selectedRFQPartData = event;
      this.selectedPartId = event.partId;
      if (
        event?.requestForQuotePartDetailId &&
        event?.requestForQuotePartDetailId != 0
      ) {
        this.requestForQuotePartDetailId = event?.requestForQuotePartDetailId;
        this.getSupplierToSupplierPopup(this.requestForQuotePartDetailId);
      } else {
        this.requestForQuotePartDetailId = 0;
      }

      this.editSaveRFQPartForm.patchValue(event);
      this.editSaveRFQPartForm.patchValue({
        partCode: { partId: event.partId, partCode: event.partCode },
        stockUomId: event.stockUomId,
        stockUom: event.stockUom,
        tempUniqValue: event.tempUniqValue,
      });
    } else {
      this.uniqValFromSelectedPart = event.tempUniqValue;
      this.isShowPartExistErr = false;
      this.isShowSupplierRequiredErr = false;
      this.selectedRFQPartData = event;
      this.selectedPartId = event.partId;

      if (
        event?.requestForQuotePartDetailId &&
        event?.requestForQuotePartDetailId != 0
      ) {
        this.requestForQuotePartDetailId = event?.requestForQuotePartDetailId;
        this.getSupplierToSupplierPopup(this.requestForQuotePartDetailId);
        this.requestForQuoteService
          .getRFQSupplierDetailsByRfqPartDetailId(
            event.requestForQuotePartDetailId
          )
          .subscribe(
            (data: any) => {
              this.requestForQuoteService.setSupplierData(data.response);
           
              if (data.response.length !== 0) {
                data.response.forEach((item: { tempUniqValue: string }) => {
                  item.tempUniqValue = this.uniqValFromSelectedPart;
                });
                this.isShowSupplierRequiredErr = false;
              } else {
                this.isShowSupplierRequiredErr = true;
              }
            },
            (err) => { }
          );
      } else {
        this.requestForQuotePartDetailId = 0;
      }

      this.editSaveRFQPartForm.patchValue(event);
      this.editSaveRFQPartForm.patchValue({
        partCode: { partId: event.partId, partCode: event.partCode },
        stockUomId: event.stockUomId,
        stockUom: event.stockUom,
        tempUniqValue: event.tempUniqValue,
      });
    }
  }
  refreshPartDetailList(event: any) {
    throw new Error('Method not implemented.');
  }
  handleDepotChangeDD(event: any) {
    this.editSaveRFQForm.controls['city'].setValue({
      cityCode: event.city,
      cityId: event.cityId,
    });
  }
  // DropDown api
  getPartType() {
    this.requestForQuoteService.getPartType().subscribe(
      (data) => {
        this.partTypeDDList = data['response'];
      },
      (err) => { }
    );
  }
  
  getPartCode(partTypeId: any) {
    this.editSaveRFQPartForm.controls['partCode'].setValue(null);
    this.requestForQuoteService.getPartCode(partTypeId).subscribe(
      (data) => {
        this.partCodeDDList = data['response'];
      },
      (err) => { }
    );
  }
  handleRemarksIcon(data: any) {
    

    this.remarks = data.row.remarks;
    this.remarksPopup.show();

    data.event.stopPropagation();
  }
  closeRemarksPopUp() {
    this.remarksPopup.hide();
  }

  openRemarksPopup(remarks: string, event: MouseEvent) {
    this.remarks = remarks;
    this.remarksPopup.show();
    event.stopPropagation();
  }
  validateRequiredDate(controlName: string, event: any) {
    this.currentDate = new Date();
    const selectedDate = new Date(event);
    if (
      selectedDate?.setHours(0, 0, 0, 0) <
      this.currentDate?.setHours(0, 0, 0, 0)
    ) {
      this.editSaveRFQPartForm.controls['requiredDate'].setErrors({
        customError: true,
      });
    } else if (isNaN(selectedDate.getTime())) {
      this.editSaveRFQPartForm.controls['requiredDate'].setErrors({
        invalid: true,
      });
    } else {
      this.editSaveRFQPartForm.controls['requiredDate'].setErrors(null);
    }
  }
  checkNgSelectValue(event: any, controlName: any) {
    const control =
      controlName != 'partType' && controlName != 'partCode'
        ? this.editSaveRFQForm.controls[controlName]
        : this.editSaveRFQPartForm.controls[controlName];
    if (control.errors && !event) {
      control.setErrors({ invalid: false });
      control.errors['required'] = true;
      return;
    } else if (event) {
      control.setErrors({ invalid: true });

      this.editSaveRFQForm.markAsDirty();
    } else {
      control.setErrors(null);
    }
  }
  validateRFQEndDate(controlName: string, event: any) {
    this.currentDate = new Date();
    const selectedDate = new Date(event);
    if (
      selectedDate?.setHours(0, 0, 0, 0) <
      this.currentDate?.setHours(0, 0, 0, 0)
    ) {
      this.editSaveRFQForm.controls['rfqEndDate'].setErrors({
        customError: true,
      });
    } else if (isNaN(selectedDate.getTime())) {
      this.editSaveRFQForm.controls['rfqEndDate'].setErrors({
        invalid: true,
      });
    } else {
      this.editSaveRFQForm.controls['rfqEndDate'].setErrors(null);
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
  dropdownDepotSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['depotCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotCode'].toLocaleLowerCase() === term ||
      item['depotName'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['depotName'].toLocaleLowerCase() === term
    );
  }
  dropdownPartCodeSearchFn(term: any, item: any) {
    term = term.toLocaleLowerCase();
    return (
      item['partCode'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['partCode'].toLocaleLowerCase() === term ||
      item['partName'].toLocaleLowerCase().indexOf(term) > -1 ||
      item['partName'].toLocaleLowerCase() === term
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
