// export interface StorePartAllocationDetails {
//     StorePartMappingId?: number;
//     storeId?: number;
//     depotId?: number;
//     zoneId?: number;
//     binId?: number;
//     allocationQuantity?: number;
//     createdBy?: string;
//     modifiedBy?: string;
//     created?: Date;
//     modified?: Date;
// }
export interface StorePartAllocationDetails {
    StoreZoneDetailId: number;
    StoreBinDetailId: number;
    StorePartMappingId?: number;
    PartTypeId: number;
    PartId: number;
    StoreId: number;
    PartCode?: string;
    ZoneCode?: string;
    BinCode?: string;
    createdBy: string;
    created?: Date;
    modifiedBy: string;
    modified?: Date;
    allocationQuantity?: number;
}


export interface GoodsReceipt {
    purchaseOrderId: number;
    supplierId: number;
    depotId: number;
    companyId: number;
    goodsReceiptTypeId: number;
    goodsReceiptCategoryId: number;
    remarks: string;
    goodsReceiptDate: string;
    fileDescription: string;
    modifiedBy: string;
    createdBy: string;
    goodsReceiptPartDetails: GoodsReceiptPartDetail[];
}

export interface GoodsReceiptPartDetail {
    partTypeId: number;
    partId: number;
    purchaseQuantity: number;
    totalReceivedQuantity: number;
    balanceQuantity: number;
    receivedQuantity: number;
    expectedDeliveryDate: string;
    actualDeliveryDate: string;
}
