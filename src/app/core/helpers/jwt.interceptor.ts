import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserAuthService } from '../services/user-auth.service';

// import { I18nService } from '@app/shared/i18n/i18n.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    public userDetails: any;
    constructor(
        private userAuthService: UserAuthService,
        // private i18nService: I18nService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const userToken: any = localStorage.getItem("userToken");
        const currentUser = JSON.parse(userToken);

        // if (this.cookieService.check('userDetails')) {
        //     this.userDetails = JSON.parse(this.cookieService.get('userDetails'));
        // }

        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    "Authorization": `Bearer ${currentUser.token}`,
                    "Accept-Language": 'en-US'
                }
            });
        }

        return next.handle(request);
    }
}
