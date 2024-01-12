import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { RequestForQuoteOutputPrintData } from '../model/request-for-quote_model';
import { PdfService } from 'src/app/shared/services/pdf/pdf.service';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { RequestForQuoteService } from '../service/request-for-quote.service';
@Component({
  selector: 'app-generate-rfq-pdf',
  templateUrl: './generate-rfq-pdf.component.html',
  styleUrls: ['./generate-rfq-pdf.component.css']
})
export class GenerateRfqPdfComponent {
  pdfData: any = {};
  @ViewChild('pdfContent') pdfContent!: ElementRef;


  constructor(
    private pdfService: PdfService,
    private userAuthService: UserAuthService,
    private datePipe: DatePipe,
    private requestForQuoteService: RequestForQuoteService,
    private translate: TranslateService
  ) { }
  generatedBy = this.userAuthService.getCurrentUserName();
  currentDate = new Date();
  generatedDate = this.datePipe.transform(this.currentDate, 'dd-MMM-yyyy');
  pdfFormData: any;


  getData(pdfComingData: RequestForQuoteOutputPrintData) {
    this.pdfData = pdfComingData
   

  }
  async downloadPdf(): Promise<void> {
    try {
      const pdfContent = this.pdfContent.nativeElement;
      await this.delay(1000);
      this.pdfService.generatePdf(pdfContent, 'RequestForQuoteOutput_' + this.pdfData?.supplierCode || "");
    } catch (err) {
      console.error('Error generating or saving PDF', err);
    }
  }


  async generateEmailPdf(): Promise<void> {
    try {
      const pdfContent = this.pdfContent.nativeElement;
      await this.delay(1000);
      this.generateEmail(
        pdfContent,
        'RequestForQuoteOutput_' + this.pdfData?.supplierCode || ""
      );

    } catch (err) {
    }
  }
  async generateEmail(
    htmlContent: HTMLElement,
    fileName: string
  ): Promise<void> {
    try {
      const canvas = await html2canvas(htmlContent, { scale: 2 });
      const contentHeight = canvas.height;
      const pdf = new jsPDF('landscape', 'mm', 'a4');

      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();

      const numPages = Math.ceil(contentHeight / pageHeight / 8);

      for (let i = 0; i < numPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        const yPosition = -i * pageHeight;

        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          yPosition,
          pageWidth,
          contentHeight / 8
        );
      }

      const pdfBlob = pdf.output('blob');

      const formData1 = new FormData();
      formData1.append('pdf', pdfBlob, `${fileName}.pdf`);
      this.pdfFormData = formData1;
      this.requestForQuoteService.setEmailServiceDate(formData1);
    } catch (error) {
      console.error('Error generating or saving PDF', error);
    } finally {
    }
  }

  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}


