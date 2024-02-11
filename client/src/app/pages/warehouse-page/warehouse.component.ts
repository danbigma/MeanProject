import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { CurrentUser, Warehouse } from 'src/app/shared/interfaces';
import { RoleService } from 'src/app/shared/services/role.service';
import { WarehouseService } from 'src/app/shared/services/warehouse.service';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css'],
})
export class WarehouseComponent implements OnInit {
  currentUser: CurrentUser = this.roleService.getCurrentUser();
  oSub!: Subscription;
  warehouses: Warehouse[] = [];

  loading = false;

  warehouseColumns = [
    { headerKey: 'warehouse.name', field: 'name' },
    {
      headerKey: 'warehouse.location',
      field: 'location',
      formatter: (location: { city: any; country: any; }) => `${location.city}, ${location.country}`,
    },
    {
      headerKey: 'warehouse.phoneNumber',
      field: 'contactInfo',
      formatter: (contactInfo: { phoneNumber: any }) => `${contactInfo.phoneNumber}`,
    },
    {
      headerKey: 'warehouse.operationalStatus',
      field: 'operationalStatus',
      conditionalClass: true, // Indica que esta columna usa lógica condicional para las clases
    },
  ];

  constructor(
    private warehouseService: WarehouseService,
    private roleService: RoleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses() {
    this.loading = true;
    this.oSub = this.warehouseService.getAll().subscribe((warehouses) => {
      this.warehouses = warehouses; // Simplemente asigna el valor en lugar de concatenar
      this.loading = false;
    });
  }

  edit(warehouse: Warehouse) {
    this.router.navigate([`/warehouses/${warehouse._id}`]);
  }

  delete(warehouse: Warehouse) {
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
