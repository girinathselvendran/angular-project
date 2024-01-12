import { Seviority } from "../enum/common";

export interface ConfirmDialogModel {
    message?: string;
    header?: string;
    actionName?: string;
}

export interface ConfirmDialogActionModel {
  accepted?: boolean;
  rejected?: boolean;
  actionName?: string;
}

export interface MesssgeDialogModel {
  message: string;
  header?: string;
  severity?: Seviority;
}