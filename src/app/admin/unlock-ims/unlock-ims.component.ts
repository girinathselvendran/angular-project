import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-unlock-ims',
  templateUrl: './unlock-ims.component.html',
  styleUrls: ['./unlock-ims.component.css'],
})
export class UnlockImsComponent {
  columnHeaderList = [
    {
      field: 'screenName',
      header:"Screen Name",
      // header: this.translate.instant("master.supplier.grid.city"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'refNoField',
      header:"Reference No Field",
      // header: this.translate.instant("master.supplier.grid.city"),
      width: '12%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'refNo',
      header:"Reference No",
      // header: this.translate.instant("master.supplier.grid.city"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'lockedBy',
      header:"Locked By",
      // header: this.translate.instant("master.supplier.grid.city"),
      width: '9%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'lockedTime',
      header:"Locked Time",
      // header: this.translate.instant("master.supplier.grid.city"),
      width: '10%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
    {
      field: 'Unlock',
      header:"Unlock",
      // header: this.translate.instant("master.supplier.grid.city"),
      width: '5%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 4,
    },
  ];
  excelFileName = 'Unlock IMS';
  contactInfoList = [];
  showWarningMessageForRoleRights = "";
  warningMessageForRoleRights = "";

  constructor(private translate: TranslateService) {
    // super();
  }

  addIconClick(event: any) {}
  receiveTableRowData(event: any) {}
  handleDeleteContactIcon(event: any) {}
  refreshIconClick(event: any) {}
}
