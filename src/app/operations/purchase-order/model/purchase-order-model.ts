// output document model
export interface PurchaseOrderOutputData {
  purchaseOrderId: any;
  purchaseOrderNo: string;
  poDate: string;
  prDate: string;
  prNo: string;
  depotDetails: {
    tRN: string;
    depotCode: string;
    city: string;
    country: {
      countryCode: string;
      countryDescription: string;
      cities: [
        {
          cityId: any;
          cityCode: string;
          cityDescription: string;
        }
      ];
    };
    address: string;
  };
  supplierDetails: {
    supplierCode: string;
    supplierName: string;
    supplierAddress: {
      supplierAddressId: any;
      supplierId: any;
      addressTypeId: any;
      address: string;
      countryId: any;
      cityId: any;
      zipCode: string;
      phoneNo: string;
      fax: string;
      cityDescription: string;
      country: {
        countryCode: string;
        countryDescription: string;

        cities: [
          {
            cityId: any;
            cityCode: string;
            cityDescription: string;
          }
        ];
      };
      city: {
        cityCode: string;
        cityDescription: string;
        country: {
          countryCode: string;
          countryDescription: string;
          cities: [];
        };
      };
    };
    cityName: string;
    countryName: string;
  };
  supplierContactInfo: {
    email: string;
    mobileNo: string;
    landlineNo: string;
    fax: string;
    attn: string;
  };
  supplierTRN: string;
  supplierTIN: string | null;
  supplierPartDetails: SpDetails[]
  termsAndConditions: string[];
  totalAmountSum: any
}

interface SpDetails {
  supplierPartRefNo: string;
  partCode: string;
  purchaseOrderPartDetailId: any;
  partName: string;
  partSpecification: string;
  uom: string;
  quantity: any;
  deliveryDate: string;
  partRate: any;
  totalAmount: any;
}

export interface ApprovalRequest {
  purchaseOrders: number[];
  poNumbers: string[];
}
export interface ReopenPO {
  purchaseOrders: number[];
  poNumbers: string[];
}

// create and update model 

export interface PurchaseOrder {
  purchaseOrderId?: number;
  purchaseOrderNo?: string;
  pODate: string;
  currentStatusId: number;
  previousStatusId?: number;
  createdBy: string;
  companyId: number;
  pOSourceId: number;
  modifiedBy: string;
  depotId: number;
  supplierId: number;
  remarks?: string;
  totalPOSupplierCurrency?: number;
  totalPoAmount?: number;
  created?: Date;
  modified?: Date;
  purchaseOrderPartDetails: PurchaseOrderPartDetail[];
  purchaseOrderAdditionalServices: PurchaseOrderAdditionalService[];
  purchaseOrderTermsAndConditions: PurchaseOrderTermsAndCondition[];
}

export interface PurchaseOrderPartDetail {
  purchaseOrderPartDetailId?: number;
  partTypeId: number;
  partId: number;
  stockUOMId: number;
  pOQuantity: number;
  totalCost: number;
  deliveryDate: string;
  unitPrice: number;
  pRId: number;
  createdBy: string;
  modifiedBy: string;
  created?: Date;
  modified?: Date;
}

export interface PurchaseOrderAdditionalService {
  purchaseOrderAdditionalServiceId?: number;
  additionalServiceId: number;
  value: number;
  createdBy: string;
  modifiedBy: string;
  created?: Date;
  modified?: Date;
}

export interface PurchaseOrderTermsAndCondition {
  purchaseOrderTermsAndConditionId?: number;
  termsAndConditionId: number;
  createdBy: string;
  modifiedBy: string;
  created?: Date;
  modified?: Date;
}