import { Injectable } from '@angular/core';

import { MessageService } from 'primeng/api';
declare var $: any;

@Injectable()
export class NotificationService {

  constructor(private messageService: MessageService) {
  }

  smallBox({ severity = "success", title = "Success", content = "", timeout = 3000, icon = "" }) {
    this.messageService.add({
      severity: severity,
      summary: title,
      detail: content,
      life: timeout,
      icon: icon
    });
  }

  smartMessageBox(data: any, cb?: any) {
    $.SmartMessageBox(data, cb)
  }



}
