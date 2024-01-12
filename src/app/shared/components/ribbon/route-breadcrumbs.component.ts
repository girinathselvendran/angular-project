import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, NavigationEnd} from "@angular/router";
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'sa-route-breadcrumbs',
  template: `
        <ol class="breadcrumb">
           <li *ngFor="let item of items">{{item}}</li>
        </ol>
  `,
  styles: []
})
export class RouteBreadcrumbsComponent implements OnInit, OnDestroy {

  public items: Array<string> = [];
  private sub:any;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.extract(this.router.routerState.root)
    this.sub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    )

      .subscribe(v => {
        this.items = [];
        this.extract(this.router.routerState.root)
      });

  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }


  extract(route:any) {
    const pageTitle = route.data.value['pageTitle'];
    
    
    if (pageTitle && this.items.indexOf(pageTitle) === -1) {
      if (route.data.value['pageTitle'] !== 'Home') {
        this.items.push(route.data.value['pageTitle']);
      }
    }
    if (route.children) {
      route.children.forEach((it: any) => {
        this.extract(it);
      });
    }
  }


}
