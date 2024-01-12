export interface RequestForQuote {
   requestForQuoteId?: number;
    requestForQuoteDate: string;
    currentStatusId: number;
    requestForQuoteNo?: string;
    previousStatusId?: number |null ;
    requestForQuoteEndDate: string;
    totalRequestForQuoteCost?: number;
    createdBy: string;
    created?:string;
    modified?:string;
    companyId?: number;
    requestForQuoteSourceId: number;
    modifiedBy: string;
    depotId: number;
    purchaseRequisitionId?: number;
    remarks: string;
    requestForQuotePartDetails: RequestForQuotePartDetail[];
  }
  
  export interface RequestForQuotePartDetail {
    partTypeId: number;
    partId: number;
    stockUOMId: number;
    requisitionQuantity: number;
    estimatedCost: number;
    requiredDate: string;
    createdBy: string;
    remarks: string;
    modifiedBy: string;
    created?:string;
    modified?:string;
    requestForQuotePartDetailId?: number;
    tempUniqValue?:number|string;
    requestForQuoteSupplierDetails: RequestForQuoteSupplierDetail[];
  }
  
  export interface RequestForQuoteSupplierDetail {
    partId?:number;
    supplierId: number;
    preferredSupplier: boolean;
    createdBy: string;
    modifiedBy: string;
    created?:string;
    modified?:string;
    tempUniqValue?:number|string;
  }
  
  export interface RFQPartDetails {
    partTypeId: number;
    partType: string;
    partId: number;
    partCode: string;
    partName: string;
    partCategory: string;
    requisitionQuantity : number;
    partRate : number;
    estimatedCost : number;
    stockUom : string;
    stockUomId : string;
    tempUniqValue?:number|string;
    requiredDate :string;
    remarks :string;
    tempRFQPartId? :number;
    requestForQuotePartDetails?: [];
    requestForQuoteId?: number;
    requestForQuotePartDetailId?: number;
    
  }

  export interface ApprovalRequest {
    requestForQuotes: number[];
    requestForQuoteNo: string[];
  }
  export interface ReopenRFQ {
    requestForQuotes: number[];
    requestForQuoteNo: string[];
  }


  
  // output document model
export interface RequestForQuoteOutputPrintData {
  supplierCode: string;
  supplierName: string;
  address: string | null;
  countryName: string | null;
  cityName: string | null;
  email: string | null;
  mobileNo: string | null;
  fax: string | null;
  contactName: string | null;
  taxRegistrationNo: string;
  tinNo: string | null;
  quotationRefNo: string | null;
  quotationDate: string | null;
  quotationValidTill: string | null;
  depotName: string;
  depotStreetAddress: string;
  depotCityName: string;
  depotCountryName: string;
  depotRegistrationNo: string;
  supplierPartReferenceNo: string;
  partName: string;
  partCode: string;
  partId: number;
  partSpecification: string;
  uom: string;
  quantity: number;
  partRate: number | null;
  totalCost: number;
  remarks: string;
}
