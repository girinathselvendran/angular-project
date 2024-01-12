import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NotificationService } from 'src/app/core/services';
import { UserAuthService } from 'src/app/core/services/user-auth.service';
// import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  public items: any[] = [];
  menus: any = [];
  quickLinkMenus = [];
  showMenu: boolean = false;

  constructor(
    private authService: UserAuthService,
    public notificationService: NotificationService,
    private loaderService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.items = [


      {
        id: 11,
        label: 'Masters',
        icon: 'fa-solid fa-database',
        items: [
          {
            id: 12,
            label: 'Store',
            icon: 'fas fa-map-signs',
            routerLink: ['/master/store'],
            queryParams: { screenId: 13 },
          },
          {
            id: 12,
            label: 'Supplier',
            icon: 'fas fa-map-signs',
            routerLink: ['/master/supplier'],
            queryParams: { screenId: 14 },
          },
          {
            id: 12,
            label: 'Part',
            icon: 'fas fa-map-signs',
            routerLink: ['/master/part'],
            queryParams: { screenId: 15 },
          },
          {
            id: 12,
            label: 'Additional Service',
            icon: 'fas fa-map-signs',
            routerLink: ['/master/additional-service'],
            queryParams: { screenId: 16 },
          },
          {
            id: 12,
            label: 'Terms & Condition',
            icon: 'fas fa-map-signs',
            routerLink: ['/master/terms-and-condition'],
            queryParams: { screenId: 17 },
          },
        ],
      },
      {
        id: 21,
        label: 'Operations',
        icon: 'fas fa-tasks',
        // routerLink: ['/master/uom'],
        // queryParams: { screenId: 18 },
        items: [
          {
            id: 2,
            label: 'Purchase Requisition',
            icon: 'fa fa-user',
            routerLink: ['/operations/purchase-requisition'],
            queryParams: { screenId: 1 },
          },
          {
            id: 3,
            label: 'Purchase Order',
            icon: 'fa fa-user',
            routerLink: ['/operations/purchase-order'],
            queryParams: { screenId: 2 },
          },
          {
            id: 4,
            label: 'Approval',
            icon: 'fa fa-user',
            routerLink: ['/operations/approval'],
            queryParams: { screenId: 3 },
          },
          {
            id: 5,
            label: 'Request For Quote',
            icon: 'fa fa-user',
            routerLink: ['/operations/request-for-quote'],
            queryParams: { screenId: 4 },
          },
          {
            id: 5,
            label: 'Stock Maintenance',
            icon: 'fa fa-user',
            routerLink: ['/operations/stock-maintenance'],
            queryParams: { screenId: 5 },
          },
          {
            id: 6,
            label: 'Goods Receipt',
            icon: 'fas fa-tasks',
            routerLink: ['/operations/goods-receipt'],
            queryParams: { screenId: 6 },
          }
        ],
      }
    ];

    const personaId = this.authService.getCurrentPersonaId();
    this.getMenu(personaId);
  }

  public getMenu(personaId: string): void {
    this.loaderService.start();
    this.authService
      .getMenu(personaId, this.authService.getCurrentCompanyId())
      .subscribe((data: any) => {
        if (data['status'] === true) {
          this.menus = data['response'];
          const gateOperationMenu = this.menus.filter(
            (x: any) => x.screenId === 3
          )[0];
          this.menus = this.menus.filter((x: any) => x.screenId !== 3);
          if (gateOperationMenu) {
            this.quickLinkMenus = gateOperationMenu.menus;
          }
          const repairMenu = this.menus.filter((x: any) => x.screenId === 6)[0];
          this.menus = this.menus.filter((x: any) => x.screenId !== 6);
          if (repairMenu) {
            this.quickLinkMenus = this.quickLinkMenus.concat(repairMenu.menus);
          }
          this.showMenu = true;
          this.loaderService.stop();
        }
      });
  }
}
