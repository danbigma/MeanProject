import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Warehouse } from 'src/app/shared/interfaces';
import { WarehouseService } from 'src/app/shared/services/warehouse.service';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css'],
})
export class WarehouseComponent implements OnInit {
  oSub!: Subscription;
  warehouses: Warehouse[] = [];

  constructor(private warehouseService: WarehouseService) {}

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses() {
    this.oSub = this.warehouseService.getAll().subscribe((warehouses) => {
      this.warehouses = warehouses; // Simplemente asigna el valor en lugar de concatenar
    });
  }

  deleteWarehouse(warehouse: Warehouse) {
    const confirmDelete = window.confirm('Вы уверены что хотите удалить');
    if (confirmDelete && warehouse._id) {
      this.warehouseService.delete(warehouse._id).subscribe({
        next: () => {
          MaterialService.toast('Almacén eliminado exitosamente');
          this.warehouses = this.warehouses.filter(
            (w) => w._id !== warehouse._id
          ); // Actualiza la lista de almacenes
        },
        error: (error) => {
          MaterialService.toast(error.error.message);
        },
      });
    }
  }
}
