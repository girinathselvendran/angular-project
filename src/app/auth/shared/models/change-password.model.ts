
interface ChangePasswordInterface {
    userId?: number;
    userName?: string;
    password: string;
    modifiedBy?: string;
    modifiedDate?: string;
}
export class ChangePassword implements ChangePasswordInterface {
    userId?: number;
    userName?: string;
    password!: string;
    modifiedBy?: string;
    modifiedDate?: string;
}
