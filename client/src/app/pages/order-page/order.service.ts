import { Injectable } from '@angular/core';
import { OrderPosition, Position } from 'src/app/shared/interfaces';

@Injectable()
export class OrderService {
  public list: OrderPosition[] = [];
  public price = 0;

  add(position: Position) {
    const orderPosition: OrderPosition = {
      ...position,
      quantity: position.quantity ?? 0,
    };

    const candidateIndex = this.list.findIndex(
      (p) => p._id === orderPosition._id
    );

    const newList =
      candidateIndex > -1
        ? this.list.map((p, index) =>
            index === candidateIndex
              ? { ...p, quantity: p.quantity + orderPosition.quantity }
              : p
          )
        : [...this.list, orderPosition];

    this.updateState(newList);
  }

  remove(orderPosition: OrderPosition) {
    const newList = this.list.filter((p) => p._id !== orderPosition._id);
    this.updateState(newList);
  }

  clear() {
    this.updateState([]);
  }

  private updateState(newList: OrderPosition[]) {
    this.list = newList;
    this.computePrice();
  }

  private computePrice() {
    this.price = this.list.reduce(
      (total, item) => total + item.quantity * item.cost,
      0
    );
  }
}
