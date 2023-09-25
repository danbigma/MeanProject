import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  MaterialInstance,
  MaterialService,
} from '../shared/classes/material.service';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';
import { Order } from '../shared/interfaces';

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css'],
})
export class HistoryPageComponent {
  @ViewChild('tooltip') tooltipRef!: ElementRef;
  tooltip!: MaterialInstance;
  isFilterVisible = false;
  oSub!: Subscription;

  orders: Order[] = [];

  offset = 0;
  limit = STEP;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.fetch();
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  private fetch() {
    const params = {
      offset: this.offset,
      limit: this.limit,
    };
    this.oSub = this.ordersService.fetch(params).subscribe((orders) => {
      this.orders = orders;
    });
  }
}
