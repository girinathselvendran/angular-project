import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { saveAs } from 'file-saver';
import { PurchaseRequisitionService } from 'src/app/operations/purchase-requisition/service/purchase-requisition.service';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor(private loaderService: NgxUiLoaderService,
    private purchaseRequisitionService: PurchaseRequisitionService,
  ) { }
  async generatePdf(htmlContent: HTMLElement, fileName: string): Promise<void> {
    try {
      const canvas = await html2canvas(htmlContent, { scale: 2 });
      const contentHeight = canvas.height;
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      // Set the page height and width based on A4 dimensions
      const pageHeight = pdf.internal.pageSize.getHeight() ;
      const pageWidth = pdf.internal.pageSize.getWidth();
  
      // Calculate the number of pages required
      const numPages = Math.ceil(contentHeight / pageHeight /8);
  
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
  
      pdf.save(`${fileName}.pdf`);

     

      const pdfBlob = pdf.output('blob');

      // Create FormData and append the Blob
      const formData1 = new FormData();
      formData1.append('pdf', pdfBlob, `${fileName}.pdf`);

      // this.purchaseRequisitionService
      //   .uploadFile(formData1)
      //   .subscribe((data: any) => { })

    } catch (error) {
      console.error('Error generating or saving PDF', error);
    } finally {
      this.loaderService.stop();
    }
  }
  
 
}
