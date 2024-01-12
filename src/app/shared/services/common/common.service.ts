import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { environment } from 'src/environments/environment'; 
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    constructor(
        private http: HttpClient
    ) { }

    // apiUrl: string = environment.imsDepoUI;
    convertToDateString(dateString: string): string {
      let ds = dateString ? dateString.split(".")[0] : null;
      
      if (ds) {
          const match = /(\d{4})-(\d\d)-(\d\d)T(.+)/.exec(ds);
          
          if (match) {
              ds =
                  "JanFebMarAprMayJunJulAugSepOctNovDec".substr(
                      Number(match[2]) * 3 - 3,
                      3
                  ) +
                  " " +
                  match[3] +
                  " " +
                  match[1] +
                  " " +
                  match[4];
              return ds;
          }
      }
  
      // If ds is null or if the regex match fails, return the original dateString
      return dateString;
  }
  
    getFormattedLastModifiedDate(lastModifiedDate:any) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        lastModifiedDate = new Date(this.convertToDateString(lastModifiedDate));
        const date = new Date(lastModifiedDate).getDate();
        const day = days[new Date(lastModifiedDate).getDay()];
        const month = months[new Date(lastModifiedDate).getMonth()];
        const year = new Date(lastModifiedDate).getFullYear();
        return day + ", " + month + " " + date + ", " + year;
    }

}
