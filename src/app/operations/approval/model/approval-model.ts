export interface ApprovalRequest {
    ids: number[],
    nos: string[],
    ApprovalTypeId: any,
    approvedBy: any,
    approvedDate: any,
    approvedRemarks: any,
    recordType: string,
    purchaseApprovalId?: any
}
export interface RejectionPopup {
    rejectionRemarks: any,
    rejectionDate: any,
    rejectionBy: any,
    ids: number[],
    nos: string[],
    recordType: string,
    CreatedBy: any,
    ModifiedBy: any
}
export interface CancelRejection {
    cancelRejectionRemarks: any,
    cancelRejectionDate: any,
    cancelRejectionBy: any,
    ids: number[],
    nos: string[],
    recordType: string,
    CreatedBy: any,
    ModifiedBy: any
}