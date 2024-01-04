import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  MaterialInstance,
  MaterialService,
} from '../../shared/classes/material.service';
import { OrderService } from './order.service';
import { Order, OrderPosition } from '../../shared/interfaces';
import { Subject, filter, takeUntil } from 'rxjs';
import { OrdersService } from '../../shared/services/orders.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService],
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef!: ElementRef;
  isRoot!: boolean;
  modal!: MaterialInstance;
  pending = false;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    public order: OrderService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.isRoot = this.router.url === '/order';
      });
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    this.destroy$.next();
    this.destroy$.complete();
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
      list: this.order.list.map((item) => ({ ...item, _id: undefined })),
    };

    this.ordersService
      .create(order)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
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
