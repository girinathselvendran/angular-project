import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CustomStyle } from 'src/app/constants/custom-style';
import { Seviority } from '../../enum/common';
import { PrimengMessageDialogService } from '../../services/common/primeng-message-dialog.service';
import { MesssgeDialogModel } from '../models/confirm-dialog.model';

@Component({
  selector: 'app-primeng-message-dialog',
  templateUrl: './primeng-message-dialog.component.html',
  styleUrls: ['./primeng-message-dialog.component.scss'],
  providers: [ConfirmationService]
})
export class PrimengMessageDialogComponent implements OnInit {

  messagesSubscription: Subscription;
  seviority: Seviority;
  styleClass: string;

  constructor(
    private dialogService: PrimengMessageDialogService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.getToastMessages();
  }

  getToastMessages(){
    this.messagesSubscription = this.dialogService.getMessageObs().subscribe((data: MesssgeDialogModel)=> {
      if(data){
        this.seviority = data.severity;
        switch(this.seviority){
          case Seviority.success:
            this.styleClass = CustomStyle.SuccessMessageDialog;
            break;
          case Seviority.error:
            this.styleClass = CustomStyle.ErrorMessageDialog;
            break;
          case Seviority.info:
            this.styleClass = CustomStyle.InfoMessageDialog;
            break;
          case Seviority.warn:
            this.styleClass = CustomStyle.WarningMessageDialog;
            break;
        }
        this.confirmationService.confirm({
          message: data.message,
          header: data.header,
          accept: () => {
            this.dialogService.setOkConfirmObs(true);
          },
          reject: () => {
          },
          key: "positionDialog"
        });
        this.dialogService.setMessageObs({"message":"success"});
      }
    });
  }

  ngOnDestroy(){
    this.messagesSubscription?.unsubscribe();
  }

}
