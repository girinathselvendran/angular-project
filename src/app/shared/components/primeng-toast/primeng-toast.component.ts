import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PrimengToastService } from '../../services/common/primeng-toast.service';
import { ToastModel } from '../../models/toast.model';

@Component({
  selector: 'app-primeng-toast',
  templateUrl: './primeng-toast.component.html',
  styleUrls: ['./primeng-toast.component.scss'],
  providers: [MessageService]
})
export class PrimengToastComponent implements OnInit {

  //toastMessagesSubscription: Subscription;
  toastMessagesSubscription: any;

  constructor(private messageService: MessageService,
    private toastService: PrimengToastService) { 
      this.toastService.getToastMessageObs().subscribe((data: ToastModel)=> {
        if(data){
          this.messageService.add(data);
        }
      });
    }

  ngOnInit(): void {
    this.getToastMessages();
  }

  clear() {
      this.messageService.clear();
  }

  getToastMessages(){
    this.toastMessagesSubscription = this.toastService.getToastMessageObs().subscribe((data: ToastModel)=> {
      if(data){
        this.messageService.add(data);
      }
    });
  }

  ngOnDestroy(){
    this.toastMessagesSubscription?.unsubscribe();
  }

}
