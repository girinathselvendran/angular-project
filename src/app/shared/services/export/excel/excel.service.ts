import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as Excel from "exceljs";
import * as fs from 'file-saver';
import moment from 'moment';
// import { format } from 'util';
// import { DepotService } from '@app/admin/container-depot/depot/services/depot.service';
// import { AuthService } from '@app/core/services/auth.service';
// import { Workbook } from 'exceljs';
// import {companyLogo1} from '../../../../../assets/img/iDepoLogo.png'
import { UserAuthService } from 'src/app/core/services/user-auth.service';

// declare var companyLogo1: any;
var companyLogo1: any = 'data:image/png;base64,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'
declare var defaultDepoLogo: any;
// company logo is loaded from base64Convert file
let retVal: boolean;

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  jsondata: any = [];
  loop = 0;
  depoLogo: any;
  constructor(
    private userAuth: UserAuthService,
    private translate: TranslateService,
    // private depotservice: DepotService, private authService: AuthService
  ) {

    // this.depotservice.GetDepotLogo(this.authService.getCurrentCompanyId()).subscribe(data => {
    //   if (data['status'] === true) {
    //     this.depoLogo = data['response'];
    //   }
    // });
  }
  getDepotLogo() {
    // this.depotservice.GetDepotLogo(this.authService.getCurrentCompanyId()).subscribe(data => {
    //   if (data['status'] === true) {
    //     this.depoLogo = data['response'];
    //   }
    // });
    this.depoLogo = companyLogo1;
  }
  public exportAsExcelFile(dt: any, excelFileName: string, isFiltered: any): boolean {


    retVal = true;
    this.loop = 0;
    this.jsondata = dt.columns.map( (value: any) => {
      return { "key": value.field, "width": value.width, "headername": this.translate.instant(value.header) };
    });
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(excelFileName, {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 }
    });

    // header data bind
    worksheet.getCell('B1').value = excelFileName;

    // worksheet.addRow(['Generated By: ' + this.authService.getCurrentUserName().toUpperCase()]);
    worksheet.addRow(['Generated By: ' + this.userAuth.getCurrentUserName().toUpperCase()]);
    const strArray: string[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const dateTime = new Date();
    const month = strArray[dateTime.getMonth() as number];
    // 
    const day = moment().format('DD');
    const year = moment().format('YYYY');
    const dateString = day + "-" + (month) + "-" + year;
    worksheet.addRow(['Generated Date: ' + dateString]);
    worksheet.getRow(5).values = this.jsondata.map((header: any) => header.headername);
    const logo = workbook.addImage({
      base64: companyLogo1,
      extension: 'png',
    });

    const CustomerLogo = workbook.addImage({
      base64: this.depoLogo != null ? this.depoLogo : companyLogo1,
      extension: 'png',
    });

    worksheet.addImage(CustomerLogo, 'A1:A1');
    const imagecell = worksheet.getCell('A1');
    imagecell.font = { family: 4, size: 50 };



    const row = worksheet.getRow(1);
    row.height = 60;
    // column width bind

    this.jsondata.forEach((column: { width: any; headername: string | any[]; }) => {
      column.width = column.headername.length < 28 ? 28 : column.headername.length;
    });
    worksheet.columns = this.jsondata;
    const headerRow = worksheet.getRow(5);


    const totalCellCount = headerRow.cellCount;
    if (totalCellCount < 3) {
      worksheet.addImage(logo, 'C1:C1');
      worksheet.getCell('B1:B1').font = { size: 16, bold: true };
      worksheet.getCell('B1:B1').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.mergeCells('B1:B1');

    } else {
      const logoaddress = worksheet.getRow(5).getCell(totalCellCount).address.replace(/\d+$/, '1');
      const Mergecellrangeaddress = worksheet.getRow(5).getCell(totalCellCount - 1).address.replace(/\d+$/, '1');
      worksheet.addImage(logo, logoaddress + ':' + logoaddress);
      worksheet.getCell(logoaddress + ':' + logoaddress).alignment = { vertical: 'middle', horizontal: 'left' };
      worksheet.getCell('B1:' + Mergecellrangeaddress).font = { size: 16, bold: true };
      worksheet.getCell('B1:' + Mergecellrangeaddress).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      worksheet.mergeCells('B1:' + Mergecellrangeaddress);
    }
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cccccc' },
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    // row data bind
    let rowData = [];
    if (dt.filteredValue !== undefined && dt.filteredValue != null) {
      rowData = dt.filteredValue;
    } else {
      rowData = dt.value;
    }
    const cellAddress: any = [];
    rowData.forEach((data: { exchnG_RT: string | number | boolean | Date | Excel.CellErrorValue | Excel.CellRichTextValue | Excel.CellHyperlinkValue | Excel.CellFormulaValue | Excel.CellSharedFormulaValue | null | undefined; }) => {
      const celldata = worksheet.addRow(data);
      celldata.eachCell({ includeEmpty: true }, (cell, number) => {
        if (cell.value === data.exchnG_RT) {
          cellAddress.push(cell.address);
        }
        celldata.alignment = { wrapText: true };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
      this.loop = this.loop + 1;

      if (this.loop === rowData.length - 1 || this.loop === 1) {
        retVal = false;
      }
    });
    cellAddress.forEach((element: string | number) => {
      worksheet.getCell(element).alignment = { horizontal: 'right' };
    });
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      fs.saveAs(blob, excelFileName + '.xlsx');
    });
    return retVal;
  }
  public exportAsExcelTemplateFile(values: any[], excelFileName: string, columns: any[]): boolean {

    retVal = true;
    this.loop = 0;
    this.jsondata = columns.map( (value: { field: any; width: any; header: any; }) => {
      return { "key": value.field, "width": value.width, "headername": this.translate.instant(value.header) };
    });
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(excelFileName, {
      pageSetup: { fitToPage: true, fitToHeight: 5, fitToWidth: 7 }
    });
    worksheet.getRow(1).values = this.jsondata.map((header: { headername: any; }) => header.headername);
    this.jsondata.forEach((column: { width: any; headername: string | any[]; }) => {
      column.width = column.headername.length < 28 ? 28 : column.headername.length;
    });
    worksheet.columns = this.jsondata;
    const headerRow = worksheet.getRow(1);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cccccc' },
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // row data bind
    let rowData = [];
    // if (dt.filteredValue !== undefined && dt.filteredValue != null) {
    //   rowData = dt.filteredValue;
    // } else {
    rowData = values;
    // }
    const cellAddress: any = [];
    rowData.forEach((data: { exchnG_RT: string | number | boolean | Date | Excel.CellErrorValue | Excel.CellRichTextValue | Excel.CellHyperlinkValue | Excel.CellFormulaValue | Excel.CellSharedFormulaValue | null | undefined; }) => {
      const celldata = worksheet.addRow(data);
      celldata.eachCell({ includeEmpty: true }, (cell, number) => {
        if (cell.value === data.exchnG_RT) {
          cellAddress.push(cell.address);
        }
        if (cell.value === 'Both') {
          cell.value = 'Failure';
        }
        celldata.alignment = { wrapText: true };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        if (number == 45) // Error Message For PreAdviceImportEquipment Error File
        {
          cell.font = { color: { argb: "00ff4558" } };
        }
      });
      this.loop = this.loop + 1;

      if (this.loop === rowData.length - 1 || this.loop === 1) {
        retVal = false;
      }
    });
    cellAddress.forEach((element: string | number) => {
      worksheet.getCell(element).alignment = { horizontal: 'right' };
    });
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      fs.saveAs(blob, excelFileName + '.xlsx');
    });
    return retVal;
  }
}
