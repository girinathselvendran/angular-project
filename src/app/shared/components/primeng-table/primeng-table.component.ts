import { Component, Input, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-primeng-table',
  templateUrl: './primeng-table.component.html',
  styleUrls: ['./primeng-table.component.css']
})
export class PrimengTableComponent implements OnInit {

  @Input() tConfig: any;
  @Input() tData: any;
  
  tableType:string = 'normal';
  tableHeader:any;
  first = 0;
  rows = 10;

  ngOnInit(){
    this.tableType = this.tConfig.type;
    this.tableHeader = this.tConfig.headers;
  }

  customSort(event: SortEvent) {
    if(event && event.data && event.field && event.order){
      event.data.sort((data1, data2) => {
          let value1 = event.field ? data1[event.field] : data1[0];
          let value2 = event.field ? data2[event.field] : data2[0];
          let result = null;

          if (value1 == null && value2 != null) result = -1;
          else if (value1 != null && value2 == null) result = 1;
          else if (value1 == null && value2 == null) result = 0;
          else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
          else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

          return event.order ? event.order * result : 0;
      });
    }
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
      this.first = this.first - this.rows;
  }

  reset() {
      this.first = 0;
  }

  isLastPage(): boolean {
      return this.tData ? this.first === this.tData.length - this.rows : true;
  }

  isFirstPage(): boolean {
      return this.tData ? this.first === 0 : true;
  }

}
