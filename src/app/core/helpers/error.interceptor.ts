import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { NotificationService } from '../services';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private userAuthService: UserAuthService,
        public notificationService: NotificationService,
        private loaderService: NgxUiLoaderService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log("Error:-", err);

            if (err.status === 401
                // || (err.status === 0 && err.statusText == "Unknown Error")
            ) {

                // auto logout if 401 response returned from api
                this.userAuthService.logout();
                location.reload();
            }

            const error = err.error.message || err.error.value || err.statusText;
            this.notificationService.smallBox({
                severity: 'error',
                title: 'Error',
                content: error,
                // color: "#a90329",
                icon: "fa fa-times",
                timeout: 3000
            });
            this.loaderService.stop();
            return throwError(error);
        }));
    }
}
