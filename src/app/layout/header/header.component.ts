import { Component, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ChangePasswordComponent } from 'src/app/auth/change-password/change-password.component';
import { LanguageService } from 'src/app/core/services/language.service';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import moment from 'moment';
import { PartRatesComponent } from 'src/app/master/part/part-rates/part-rates.component';

declare var $:any;
interface Language {
  name: string;
  code: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @ViewChild('changePassword') changePasswordModal: any;
  title = 'imsDepoUI';
  languages: Language[] | undefined;
  selectedLanguage: Language | undefined;
  disableCloseBit: boolean = false;
  user!: { firstName: string; lastName: string; };
  welcome!: string;
  usernameLabel!: string;
  passwordLabel!: string;
  currentDateTime: any;
  time: any;
  displayTime: any;
  serverDate:any;
  globalSearchValue: string | undefined;
  tabVersion = false;
  currentUserName:string="";

  constructor(private translate: TranslateService, private userAuthService: UserAuthService, private languageService: LanguageService) {
    translate.addLangs(['en', 'ar', 'fr']);
    let languageCode = this.languageService.getLanguageCode();
    this.translate.setDefaultLang(languageCode);
    this.translate.use(languageCode);
  }

  ngOnInit() {
    this.currentUserName = this.userAuthService.getCurrentUserName();

    this.languages = [
      { name: 'English', code: 'en' },
      { name: 'Arabic', code: 'ar' },
      { name: 'French', code: 'fr' }
  ];



  

  // let languageCode = this.languageService.getLanguageCode();
  // this.selectedLanguage = this.languages.find(s => s.code==languageCode);
  // //alert(this.selectedLanguage?.name);
  // this.translate.setDefaultLang(languageCode);
  // this.translate.use(languageCode);
    
    // hardcoded example
    this.user = { firstName: 'IIC', lastName: 'DepoUser' };

    // synchronous. Also interpolate the 'firstName' parameter with a value.
    //this.welcome = this.translate.instant('welcomeMessage', { firstName: this.user.firstName });

    // asynchronous - gets translations then completes.
    this.translate.get(['login.username', 'login.password'])
      .subscribe(translations => {
        this.usernameLabel = translations['login.username'];
        this.passwordLabel = translations['login.password'];
      });
      var atStart = performance.now();
      var looper = setInterval(() => this.getCurrentDatee(atStart), 1000);
  }

  getCurrentDatee(atStart: any) {
   
    let milliseconds =  performance.now() - atStart;
    let secs = (milliseconds / 1000);
     // const currentDateString = moment(this.serverDate).format('DD-MM-YYYY HH:mm:ss');
      // this.currentDateTime = new Date(this.serverDate);

    // Create a moment object representing the current date and time
    const currentDateTimeMoment = moment();

    // Convert the Moment object to a Date object
    const currentDateTimeDate = currentDateTimeMoment.toDate();

   // Now, 'currentDateTimeDate' contains the current date and time as a Date object
  

   // You can also format it as needed
  const formattedDateTime = currentDateTimeMoment.format('DD-MMM-YYYY HH:mm:ss').toUpperCase();
  
  // Perform operations on the 'currentDateTimeDate' variable
  currentDateTimeDate.setSeconds(currentDateTimeDate.getSeconds() + secs);
      this.time = this.currentDateTime;
      this.displayTime = moment(this.currentDateTime).format('DD-MMM-YYYY HH:mm:ss').toUpperCase();
  
      


  }
  globalSearchDropDown=[
    {
      label: 'Some Label 1',
      value: 'Value 1'
      // Other properties for the first item in the array
  },
  {
      label: 'Some Label 2',
      value: 'Value 2'
      // Other properties for the second item in the array
  }
  ]
  searchInputPlaceholder = this.globalSearchDropDown[0]?.label;
  selectedGlobalSearchType = this.globalSearchDropDown[0].value;
  onGlobalSearchTypeSelected() {
    this.globalSearchValue = '';
  }
  onSubmit(){}
  toggleSearchMobile(){}

  languageChange(eve:any){
    this.languageService.setLanguageCode(eve.code);
    if (eve.code == 'en'){
      this.translate.setDefaultLang('en');
      this.translate.use('en');
    }
    else if (eve.code == 'ar'){
      this.translate.setDefaultLang('ar');
      this.translate.use('ar');
    }
    else if (eve.code == 'fr'){
      this.translate.setDefaultLang('fr');
      this.translate.use('fr');
    }
  }

  logoutAction(){
    this.userAuthService.logout();
  }

  getDocumentation(){
    this.userAuthService.downloadUserManual();
  }

  showDialog(){
   this.changePasswordModal.showDialog();
    
  }

  checkForgotPasswordCondition() {
    if (this.userAuthService.user.forgotPasswordBit === true) {
      this.disableCloseBit = true;
    } else {
      this.disableCloseBit = false;
    }
  }


isFullScreen = false;

  // Method to toggle fullscreen
  toggleFullScreen() {
    if (!this.isFullScreen) {
      // Enter fullscreen
      const docElm = document.documentElement as any;
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) { // Firefox
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullscreen) { // Chrome, Safari and Opera
        docElm.webkitRequestFullscreen();
      } else if (docElm.msRequestFullscreen) { // IE/Edge
        docElm.msRequestFullscreen();
      }
      this.isFullScreen = true;
    } else {
      // Exit fullscreen
      const doc = document as any;
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.mozCancelFullScreen) { // Firefox
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) { // Chrome, Safari and Opera
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) { // IE/Edge
        doc.msExitFullscreen();
      }
      this.isFullScreen = false;
    }
  }





}


