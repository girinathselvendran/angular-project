import { Component, OnInit, Input } from '@angular/core';
import {LayoutService} from "../../../core/services/layout.service";

@Component({
  selector: 'sa-ribbon',
  templateUrl: './ribbon.component.html'
})
export class RibbonComponent implements OnInit {

  constructor(private layoutService: LayoutService) {}
  @Input()icon!: string;
  ngOnInit() {
  }

  resetWidgets() {
    this.layoutService.factoryReset()
  }

}
