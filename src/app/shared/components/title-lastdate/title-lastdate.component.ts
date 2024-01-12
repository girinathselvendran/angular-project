import { Component,Input} from '@angular/core';

@Component({
  selector: 'sa-title-lastdate',
  templateUrl: './title-lastdate.component.html',
  styleUrls: ['./title-lastdate.component.css']
})

export class TitleLastdateComponent  {
@Input() screenTitle:string='';
@Input() lastModifiedDate:string='';
 

}
