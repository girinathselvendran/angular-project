import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationService } from 'src/app/core/services';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// import * as appSettings from '../../../assets/api/app.config.json';
// import * as appSettings from '../../assets/app.config.json';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {


  loginFormGroup!: FormGroup;
  submitted = false;
  invalidLogin = false;
  invalidLoginMessage = '';
  hide = false;
  iInterchangeLogo = 'assets/img/iInterchangeLogo.png';
  iDepoLogo = 'assets/img/iDepoLogo.png';
  companyLogo = 'assets/img/companyLogo.png';
  versionNo: string = "";
  showHideText = "Show password";
  clientStrings = [
    { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ },
    { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
    { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
    { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
    { s: 'Windows Vista', r: /Windows NT 6.0/ },
    { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
    { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
    { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
    { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
    { s: 'Windows 98', r: /(Windows 98|Win98)/ },
    { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
    { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
    { s: 'Windows CE', r: /Windows CE/ },
    { s: 'Windows 3.11', r: /Win16/ },
    { s: 'Android', r: /Android/ },
    { s: 'Open BSD', r: /OpenBSD/ },
    { s: 'Sun OS', r: /SunOS/ },
    { s: 'Chrome OS', r: /CrOS/ },
    { s: 'Linux', r: /(Linux|X11(?!.*CrOS))/ },
    { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
    { s: 'Mac OS X', r: /Mac OS X/ },
    { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
    { s: 'QNX', r: /QNX/ },
    { s: 'UNIX', r: /UNIX/ },
    { s: 'BeOS', r: /BeOS/ },
    { s: 'OS/2', r: /OS\/2/ },
    { s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }
  ];
  toggleHide() {
    this.hide = !this.hide;
    if (!this.hide) {
      this.showHideText = "Show password";
    } else {
      this.showHideText = "Hide password";
    }
  }



  constructor(
    private formBuilder: FormBuilder,
    private authService: UserAuthService,
    public notificationService: NotificationService,
    private loaderService: NgxUiLoaderService,
    private translate : TranslateService,
    private router: Router) { }



  ngOnInit() {
   

    this.loginFormGroup = this.formBuilder.group({
      userName: [null, [Validators.required]],
      password: [null, Validators.required]
    });
    this.authService.GetIp();
    this.authService.getAppVersionDetails().subscribe((data: any) => {
      if (data['status'] === true) {
        this.versionNo = data['response'].versionNo;
      } else {
        this.notificationService.smallBox({
          title: "Error",
          content: "There seems to be an issue with connectivity. Please contact the system administrator, if the problem persists",
          // color: "#a90329",
          timeout: 5000,
          icon: "fa fa-times",
        });
      }
    });
  }

  get loginFormControls(): any { return this.loginFormGroup.controls; }


  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  onSubmit() {
    this.invalidLogin = false;
    this.invalidLoginMessage = '';
    this.submitted = false;
   

    if (this.loginFormGroup.invalid) {
      this.submitted = true;
      this.validateAllFormFields(this.loginFormGroup);
      return;
    } else {
     
      if (this.loginFormGroup.dirty) {
        this.submitted = true;
        const formData = this.loginFormGroup.value;
        if (formData['userName'] !== "" && formData['password'] !== "" && formData['userName'] !== null && formData['password'] !== null) {
          const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZoneName: 'long' };
          const currentDateTimeTmp = new Date();
          // const currentDateString = currentDateTimeTmp.toLocaleString(appSettings.ServerTimeZone, { timeZone: appSettings.LocalTimeZone });
          // const currentDateTime = new Date(currentDateString);
          const currentDateTime = new Date();
          let os: any;
          const nAgt = navigator.userAgent;
          
          const nVer = navigator.appVersion;
          for (let i = 0; i < this.clientStrings.length; i++) {
            const cs = this.clientStrings[i];
            if (cs.r.test(nAgt)) {
              os = cs.s;
              break;
            }
          }

          // let osVersion: any;

          // if (/Windows/.test(os)) {
          //   osVersion = /Windows (.*)/.exec(os)[1];
          //   os = 'Windows';
          // }

          let osVersion: any;

          if (/Windows/.test(os)) {
            const matchResult = /Windows (.*)/.exec(os);
            if (matchResult) {
              osVersion = matchResult[1];
              os = 'Windows';
            }
          }


          // switch (os) {
          //   case 'Mac OS X':
          //     osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
          //     break;

          //   case 'Android':
          //     osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
          //     break;

          //   case 'iOS':
          //     osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
          //     osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
          //     break;
          // }
          switch (os) {
            case 'Mac OS X':
              const macOsVersionMatch = /Mac OS X (10[\.\_\d]+)/.exec(nAgt);
              if (macOsVersionMatch) {
                osVersion = macOsVersionMatch[1];
              }
              break;

            case 'Android':
              const androidVersionMatch = /Android ([\.\_\d]+)/.exec(nAgt);
              if (androidVersionMatch) {
                osVersion = androidVersionMatch[1];
              }
              break;

            case 'iOS':
              const iOSVersionMatch = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
              if (iOSVersionMatch) {
                const version1 = parseInt(iOSVersionMatch[1], 10);
                const version2 = parseInt(iOSVersionMatch[2], 10);
                const version3 = iOSVersionMatch[3] ? parseInt(iOSVersionMatch[3], 10) : 0;

                osVersion = version1 + '.' + version2 + '.' + version3;
              }
              break;

          }

         
          if (os === 'Mac OS X' && navigator.maxTouchPoints >= 5) { // To fix iPadPro11 2020 issue
            os = "iOS";
          }
          this.loaderService.start();
          

          this.authService.login(formData['userName'], formData['password'], currentDateTime, os, osVersion).subscribe((data) => {
            this.loaderService.stop();
            if (data['status'] === true) {
              if (data['response'] !== null && data['response'] !== undefined && data['response'].token !== "") {
                // Successful Login

                this.authService.user = data['response'];
                this.authService.user.os = os;
                this.authService.user.osVersion = osVersion;
                if (os === "Android" || os === "iOS") {
                  this.authService.user.homePath = 'home_tab';
                } else {
                  this.authService.user.homePath = 'home';
                }
                const url = window.location.href;
                const arr = url.split("/");
                if (arr[2].includes('localhost:4200')) {
                  this.authService.user.siteName = arr[2];
                } else {
                  this.authService.user.siteName = arr[2] + '/' + arr[3];
                }
                localStorage.setItem("userToken", JSON.stringify(this.authService.user));

                const homeUrl = "/admin"
                this.router.navigate([homeUrl]);
              } else {
                this.invalidLogin = true;
                this.invalidLoginMessage = data['message'];
              }
            } else {
              this.notificationService.smallBox({
                title: "Error",
                content: "There seems to be an issue with connectivity. Please contact the system administrator, if the problem persists",
                // color: "#a90329",
                timeout: 5000,
                icon: "fa fa-times",
              });
            }
          });
        } else {
          this.submitted = true;
        }

      }
    }
  }
  getUrl() {
    return "url('assets/img/loginbg.jpg')";
  }


}
