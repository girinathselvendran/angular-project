
import { Injectable } from '@angular/core';
import { SessionService } from '../../../core/services/session.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {

    private errorMessageList: any;

    constructor(private sessionService: SessionService) { }

    getErrorMessageList(){
        return this.errorMessageList;
    }

    getErrorMessage(errorCode: string){
        this.setErrorMessageList();
        const selectedMessage = {"code": 400, "message":"Internal Server Error"};
        let message = 'Error Message Not Defined';
        if(selectedMessage){
            message = `${selectedMessage.code} : ${selectedMessage.message}`;
        }
        return message;
    }

    setErrorMessageList(){
        if(!this.errorMessageList || (this.errorMessageList && this.errorMessageList.length == 0)){
            this.errorMessageList = this.sessionService.getErrorMessages();
        }
    }

}