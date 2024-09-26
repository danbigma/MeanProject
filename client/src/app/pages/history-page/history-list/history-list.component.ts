import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';
import { Order } from '../../../shared/interfaces';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css'],
})
export class HistoryListComponent {
  @ViewChild('modal') modalRef!: ElementRef;
  @Input() orders!: Order[];

  modal!: MaterialInstance;

  selectedOrder!: Order;

  ngOnInit(): void {
    
  }

  computerPrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0);
  }

  selectOrder(order: Order) {
    this.selectedOrder = order;
    this.modal.open();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  close() {
    this.modal.close();
  }
}
