import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PositionsService } from '../../../shared/services/positions.service';
import { Observable } from 'rxjs/index';
import { Position } from '../../../shared/interfaces';
import { switchMap, map } from 'rxjs/operators';
import { OrderService } from '../order.service';
import { MaterialService } from '../../../shared/classes/material.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css'],
})
export class OrderPositionsComponent implements OnInit {
  positions$!: Observable<Position[]>;

  constructor(
    private route: ActivatedRoute,
    private positionsService: PositionsService,
    private order: OrderService
  ) {}

  ngOnInit() {
    this.positions$ = this.route.params.pipe(
      switchMap((params: Params) => this.positionsService.fetch(params['id'])),
      map((positions: Position[]) =>
        positions.map((position) => ({
          ...position,
          quantity: 1, // Evitar la mutación directa del objeto
        }))
      )
    );
  }

  addToOrder(position: Position) {
    MaterialService.toast(`Добавлено x${position.quantity}`);
    this.order.add({ ...position }); // Evitar la mutación directa del objeto
  }
}
