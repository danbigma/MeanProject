import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  MaterialInstance,
  MaterialService,
} from '../../shared/classes/material.service';
import { OrderService } from './order.service';
import { Order, OrderPosition } from '../../shared/interfaces';
import { Subscription } from 'rxjs';
import { OrdersService } from '../../shared/services/orders.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService],
})
export class OrderPageComponent {
  @ViewChild('modal') modalRef!: ElementRef;
  isRoot!: boolean;
  oSub!: Subscription;
  modal!: MaterialInstance;
  pending = false;

  constructor(
    private router: Router,
    public order: OrderService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  open() {
    this.modal.open();
  }

  cancel() {
    this.modal.close();
  }

  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition);
  }

  submit() {
    this.pending = true;

    const order: Order = {
      list: this.order.list.map((item) => {
        delete item._id;
        return item;
      }),
    };

    this.oSub = this.ordersService.create(order).subscribe({
      next: (newOrder) => {
        MaterialService.toast(`Заказ №${newOrder.order} был добавлен.`);
        this.order.clear();
      },
      error: (error) => MaterialService.toast(error.error.message),
      complete: () => {
        this.modal.close();
        this.pending = false;
      },
    });
  }
}
