import { Component } from '@angular/core';

@Component({
  selector: 'app-svg-stock-icon',
  template: `
   <div class="stock-icon">
    <svg
      class="data-charts"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 4H1C0.447715 4 0 4.44772 0 5V15C0 15.5523 0.447715 16 1 16H3C3.55228 16 4 15.5523 4 15V5C4 4.44772 3.55228 4 3 4Z"
        fill="white"
      />
      <path
        d="M9 6H7C6.44772 6 6 6.44772 6 7V15C6 15.5523 6.44772 16 7 16H9C9.55228 16 10 15.5523 10 15V7C10 6.44772 9.55228 6 9 6Z"
        fill="white"
      />
      <path
        d="M15 0H13C12.4477 0 12 0.447715 12 1V15C12 15.5523 12.4477 16 13 16H15C15.5523 16 16 15.5523 16 15V1C16 0.447715 15.5523 0 15 0Z"
        fill="white"
      />
    </svg>
</div>
  `,
})
export class SvgStockIconComponent { }
