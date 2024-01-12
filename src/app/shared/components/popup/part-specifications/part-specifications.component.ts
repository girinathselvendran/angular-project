import { Component, Input, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-part-specifications',
  templateUrl: './part-specifications.component.html',
  styleUrls: ['./part-specifications.component.css']
})
export class PartSpecificationsComponent {
  @ViewChild('partSpecificationModal') partSpecificationModal: any;

  @Input() tableTitle = 'Purchase Part Specification';
  @Input() excelFileName = 'Purchase Part Specification List';
  @Input() partSpecificationData: any = [];

  tableColumnsPartSpecification = [
    {
      field: 'partSpecification',
      header: this.translate.instant('master.store.grid.partSpecification'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 1,
    },
    {
      field: 'uom',
      header: this.translate.instant('master.store.grid.uom1'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 2,
    },
    {
      field: 'value',
      header: this.translate.instant('master.store.grid.value'),
      width: '8%',
      isFilter: true,
      isSubHeader: false,
      type: 'string',
      key: 3,
    },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
  ){}
  handleOpenSpecification() {
    this.partSpecificationModal.show();
  }
  handleCloseSpecification() {
    this.partSpecificationModal.hide();
  }
}
