export interface TermsAndCondition {
    isActiveChanged: boolean;
    active: boolean;
    termsAndConditionId?: number;
    code: string;
    description: string;
    createdBy: string;
    created?: Date;
    modifiedBy: string;
    modified?: Date;
  }
  