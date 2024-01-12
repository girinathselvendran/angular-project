import { Injectable } from '@angular/core';
import { CanDeactivate, } from '@angular/router';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from './component-can-deactivate';
import { Observer } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { UserAuthService } from '../services/user-auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {
    constructor(public confirmationService: ConfirmationService, private authService: UserAuthService, private loaderService: NgxUiLoaderService,) { }
    canDeactivate(component: any): boolean {
        if (component != null && component.canDeactivate()) {
            this.loaderService.stopAll()
            return Observable.create((observer: Observer<boolean>) => {
                component.confirmationService.confirm({
                    header: "Confirmation",
                    message: "You have unsaved changes in the screen, Do you want to continue ?",
                    acceptVisible: true,
                    rejectLabel: "No",
                    rejectIcon: "fa fa-times red",
                    acceptLabel: "Yes",
                    acceptIcon: "fa fa-check greenIcon",
                    accept: () => {
                        observer.next(true);
                        observer.complete();
                        return false;

                    },
                    reject: () => {
                        observer.next(false);
                        observer.complete();
                        return true;
                    }
                });
            });
        } else {
            if (component != undefined && component.repairCompanyService != undefined) {
                component.repairCompanyService.editCompanyDetailsObs._value = null
            }
            return true;
        }

    }

}


