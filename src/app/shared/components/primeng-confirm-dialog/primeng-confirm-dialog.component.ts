import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PrimengConfirmDialogService } from '../../services/common/primeng-confirm-dialog.service';
import { ConfirmDialogModel } from '../../models/confirm-dialog.model';

@Component({
  selector: 'app-primeng-confirm-dialog',
  templateUrl: './primeng-confirm-dialog.component.html',
  styleUrls: ['./primeng-confirm-dialog.component.scss'],
  providers: [ConfirmationService]
})
export class PrimengConfirmDialogComponent implements OnInit {

  //confirmDialogSubscription: Subscription;
  confirmDialogSubscription: any;

  constructor(private confirmationService: ConfirmationService,
    private confirmDialogService: PrimengConfirmDialogService) { }

  ngOnInit(): void {
    this.getConfirmDialog();
  }

  getConfirmDialog(){
    this.confirmDialogSubscription = this.confirmDialogService.getConfirmDialogObs().subscribe((data: ConfirmDialogModel)=> {
      if(data){
        this.confirmationService.confirm({
          message: data.message,
          header: data.header,
          accept: () => {
            this.confirmDialogService.setConfirmDialogActionObs({accepted: true, actionName: data.actionName});
          },
          reject: () => {
            this.confirmDialogService.setConfirmDialogActionObs({rejected: true, actionName: data.actionName});
          }
        });
        this.confirmDialogService.setConfirmDialogObs({});
      }
    });
  }

  ngOnDestroy(){
    this.confirmDialogSubscription?.unsubscribe();
  }

}
