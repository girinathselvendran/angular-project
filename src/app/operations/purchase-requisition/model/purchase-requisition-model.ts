
export interface PurchaseRequisitionDetail {
  purchaseRequisitionDetailId?: number;
  partTypeId: number;
  partId: number;
  requisitionQuantity: number;
  estimatedCost: number;
  requiredDate: Date;
  remarks?: string;
  stockUOMId?: number;
  partName?: string;
  purchaseRequisitionPartIsoCodeMappings?: any;
  purchaseRequisitionPartSpecificationDetails?: any;
  created?: Date;
  createdBy: string;
  modified?: Date;
  modifiedBy: string;
}

export interface PurchaseRequisition {
  purchaseRequisitionId?: number;
  prDate: Date;
  currentStatusId: number;
  previousStatusId?: number | null;
  depotId: number;
  purchaseRequisitionNo?: string;
  
  purchaseRequisitionDetails: PurchaseRequisitionDetail[];
  companyId: number;
  created?: Date;
  createdBy: string;
  modified?: Date;
  modifiedBy: string;
}

// out put document model
export interface PurchaseRequisitionOutPutData {
  purchaseRequisitionId: number;
  purchaseRequisitionNo: string;
  prDate: string;
  prDateString: string;
  city: string;
  depotCode: string;
  totalEstimatedCost: number;
  currentStatus: string;
  prevuesStatus: string;
  currentStatusId: number;
  depotId: number;
  purchaseRequisitionDetails?: PurchaseRequisitionDetailOutPutData[];
  created: string;
  createdDate: string;
  lastModifiedBy: string;
  modified: string;
  lastModifiedDate: string;
}

export interface PurchaseRequisitionDetailOutPutData {
  partCode: string;
  partId: number;
  partType: string;
  partTypeId: number;
  partCategory: string;
  partName: string;
  stockUOM: string;
  stockUOMId: number;
  requisitionQuantity: number;
  currentStatus: string;
  partRate: number | null;
  estimatedCost: number;
  requestedDate: string;
  createdDate: string;
  createdBy: string;
}
export interface ApprovalRequest {
  purchaseRequisitions: number[];
  prNumbers: string[];
}

export interface ApprovalRequest {
  purchaseRequisitions: number[];
  prNumbers: string[];
}