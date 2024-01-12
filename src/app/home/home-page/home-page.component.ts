import { Component, OnInit } from '@angular/core';
import { PrimengMessageDialogService } from '../../shared/services/common/primeng-message-dialog.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  tableDetails:any;
  tableDetailConfig:any;
  tableDetailConfig2:any;
  tableDetailConfig3:any;

  constructor(
    private messageDialogService: PrimengMessageDialogService,
    ) { }

  ngOnInit(){
    this.loadTableDetails();
  }

  ShowToast():void{
    this.messageDialogService.success("New Password Sent to Registered Email.");
  }
  
  
  loadTableDetails(){
    this.tableDetailConfig = {
      type: 'normal', 
      headers :[
        { header: 'Name', field: 'name' },
        { header: 'Company', field: 'company' },
        { header: 'Date', field: 'date' },
        { header: 'Status', field: 'status' },
        { header: 'Verified', field: 'verified' },
        { header: 'Activity', field: 'activity' },
        { header: 'Balance', field: 'balance' }
      ]
    };

    this.tableDetailConfig2 = {
      type: 'sorting', 
      headers :[
        { header: 'Name', field: 'name' },
        { header: 'Company', field: 'company' },
        { header: 'Date', field: 'date' },
        { header: 'Status', field: 'status' },
        { header: 'Verified', field: 'verified' },
        { header: 'Activity', field: 'activity' },
        { header: 'Balance', field: 'balance' }
      ]
    };

    this.tableDetailConfig3 = {
      type: 'pagination', 
      headers :[
        { header: 'Name', field: 'name' },
        { header: 'Company', field: 'company' },
        { header: 'Date', field: 'date' },
        { header: 'Status', field: 'status' },
        { header: 'Verified', field: 'verified' },
        { header: 'Activity', field: 'activity' },
        { header: 'Balance', field: 'balance' }
      ]
    };

    this.tableDetails =  [
      {
          "name": "James Butt",
          "company": "Benton, John B Jr",
          "date": "2015-09-13",
          "status": "unqualified",
          "verified": true,
          "activity": 17,
          "balance": 70663
      },
      {
          "name": "Josephine Darakjy",
          "company": "Chanay, Jeffrey A Esq",
          "date": "2019-02-09",
          "status": "proposal",
          "verified": true,
          "activity": 0,
          "balance": 82429
      },
      {
          "name": "Art Venere",
          "company": "Chemel, James L Cpa",
          "date": "2017-05-13",
          "status": "qualified",
          "verified": false,
          "activity": 63,
          "balance": 28334
      },
      {
          "name": "Lenna Paprocki",
          "company": "Feltz Printing Service",
          "date": "2020-09-15",
          "status": "new",
          "verified": false,
          "activity": 37,
          "balance": 88521
      },
      {
          "name": "Donette Foller",
          "company": "Printing Dimensions",
          "date": "2016-05-20",
          "status": "proposal",
          "verified": true,
          "activity": 33,
          "balance": 93905
      },
      {
          "name": "Simona Morasca",
          "company": "Chapman, Ross E Esq",
          "date": "2018-02-16",
          "status": "qualified",
          "verified": false,
          "activity": 68,
          "balance": 50041
      },
      {
          "name": "Mitsue Tollner",
          "company": "Morlong Associates",
          "date": "2018-02-19",
          "status": "renewal",
          "verified": true,
          "activity": 54,
          "balance": 58706
      },
      {
          "name": "Leota Dilliard",
          "company": "Commercial Press",
          "date": "2019-08-13",
          "status": "renewal",
          "verified": true,
          "activity": 69,
          "balance": 26640
      },
      {
          "name": "Sage Wieser",
          "company": "Truhlar And Truhlar Attys",
          "date": "2018-11-21",
          "status": "unqualified",
          "verified": true,
          "activity": 76,
          "balance": 65369
      },
      {
          "name": "Kris Marrier",
          "company": "King, Christopher A Esq",
          "date": "2015-07-07",
          "status": "proposal",
          "verified": false,
          "activity": 3,
          "balance": 63451
      },
      {
          "name": "Minna Amigon",
          "company": "Dorl, James J Esq",
          "date": "2018-11-07",
          "status": "qualified",
          "verified": false,
          "activity": 38,
          "balance": 71169
      },
      {
          "name": "Abel Maclead",
          "company": "Rangoni Of Florence",
          "date": "2017-03-11",
          "status": "qualified",
          "verified": true,
          "activity": 87,
          "balance": 96842
      },{
          "name": "Kiley Caldarera",
          "company": "Feiner Bros",
          "date": "2015-10-20",
          "status": "unqualified",
          "verified": false,
          "activity": 80,
          "balance": 92734
      },
      {
          "name": "Graciela Ruta",
          "company": "Buckley Miller & Wright",
          "date": "2016-07-25",
          "status": "negotiation",
          "verified": false,
          "activity": 59,
          "balance": 45250
      },
      {
          "name": "Cammy Albares",
          "company": "Rousseaux, Michael Esq",
          "date": "2019-06-25",
          "status": "new",
          "verified": true,
          "activity": 90,
          "balance": 30236
      },
      {
          "name": "Mattie Poquette",
          "company": "Century Communications",
          "date": "2017-12-12",
          "status": "negotiation",
          "verified": false,
          "activity": 52,
          "balance": 64533
      }
    ];
  }
  
}
