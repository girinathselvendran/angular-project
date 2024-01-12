import {
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { DatePipe } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PurchaseRequisitionService } from 'src/app/operations/purchase-requisition/service/purchase-requisition.service';
import { TranslateService } from '@ngx-translate/core';
import { PdfService } from 'src/app/shared/services/pdf/pdf.service';
import { PurchaseRequisitionOutPutData } from '../model/purchase-requisition-model';

@Component({
  selector: 'app-generate-pdf',
  templateUrl: './generate-pdf.component.html',
  styleUrls: ['./generate-pdf.component.css'],
})
export class GeneratePdfComponent {

  pdfData: any ={}

  @ViewChild('pdfContent') pdfContent!: ElementRef;

  generatedBy = this.userAuthService.getCurrentUserName()
  currentDate = new Date();
  generatedDate = this.datePipe.transform(this.currentDate, 'dd-MMM-yyyy');
  pdfFormData: any;

  constructor(
    private pdfService: PdfService,
    private userAuthService: UserAuthService,
    private datePipe: DatePipe,
    private purchaseRequisitionService: PurchaseRequisitionService,
    private translate: TranslateService,
  ) { }

  
  getData(pdfComingData: PurchaseRequisitionOutPutData) {
   this.pdfData = pdfComingData
  
  }
  async downloadPdf(): Promise<void> {
    try {
      const pdfContent = this.pdfContent.nativeElement;
      await this.delay(1000);
    
    
      this.pdfService.generatePdf(pdfContent, 'PurchaseRequisitionOutput_' + this.pdfData.purchaseRequisitionNo || "");

    } catch (err) {
      console.log(err, 'error');
    }

  }

  async generateEmailPdf(): Promise<void> {
    try {

      const pdfContent = this.pdfContent.nativeElement;
      await this.delay(1000);

      this.generateEmail(pdfContent, 'PurchaseRequisitionOutput_' + this.pdfData?.purchaseRequisitionNo  || "");



    } catch (err) {
      console.log(err, 'error');
    }

  }



  async generateEmail(htmlContent: HTMLElement, fileName: string): Promise<void> {
    try {
      const canvas = await html2canvas(htmlContent, { scale: 2 });
      const contentHeight = canvas.height;
      const pdf = new jsPDF('landscape', 'mm', 'a4');

      // Set the page height and width based on A4 dimensions
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();

      // Calculate the number of pages required
      const numPages = Math.ceil(contentHeight / pageHeight / 8);

      // Loop through each page and add the content
      for (let i = 0; i < numPages; i++) {
        // If it's not the first page, add a new page
        if (i > 0) {
          pdf.addPage();
        }

        // Calculate the y-coordinate for the current page
        const yPosition = -i * pageHeight;

        // Add the content to the current page
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          yPosition,
          pageWidth,
          contentHeight / 8
        );
      }
      // pdf.save(`${fileName}.pdf`);

      // canvas.toBlob((blob: any) => {
      //   const formData = new FormData();
      //   formData.append('my-file', blob, 'filename.png');

      //   this.purchaseRequisitionService
      //     .uploadFile(formData, "12342")
      //     .subscribe((data: any) => { })

      // });

      const pdfBlob = pdf.output('blob');

      // Create FormData and append the Blob
      const formData1 = new FormData();
      formData1.append('pdf', pdfBlob, `${fileName}.pdf`);
      this.pdfFormData = formData1;
      this.purchaseRequisitionService.setEmailServiceDate(formData1)

      // this.purchaseRequisitionService
      //   .uploadFile(formData1)
      //   .subscribe((data: any) => { })

    } catch (error) {
      console.error('Error generating or saving PDF', error);
    } finally {
      // this.loaderService.stop();
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
