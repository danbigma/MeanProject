import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, map } from 'rxjs';
import {
  MaterialInstance,
  MaterialService,
} from 'src/app/shared/classes/material.service';
import {
  CurrentUser,
  Tire,
  WarehouseResponse,
} from 'src/app/shared/interfaces';
import { RoleService } from 'src/app/shared/services/role.service';
import { TiresService } from 'src/app/shared/services/tires.service';
import { WarehouseService } from 'src/app/shared/services/warehouse.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tires',
  templateUrl: './tires.component.html',
  styleUrls: ['./tires.component.css'],
})
export class TiresComponent {
  @ViewChild('modal') modalRef!: ElementRef;
  currentUser: CurrentUser = this.roleService.getCurrentUser();
  tires: Tire[] = [];
  oSub!: Subscription;

  modal!: MaterialInstance;

  loading = false;

  tireColumns = [
    { headerKey: 'tire.brand', field: 'brand' },
    { headerKey: 'tire.model', field: 'model' },
    { headerKey: 'tire.size', field: 'size' },
    { headerKey: 'tire.type', field: 'type' },
    { headerKey: 'tire.countryOfOrigin', field: 'countryOfOrigin' },
    {
      headerKey: 'tire.price',
      field: 'price',
      formatter: (price: { amount: any; currency: any }) =>
        `${price.amount} ${price.currency}`,
    },
    { headerKey: 'tire.quantityInStock', field: 'quantityInStock' },
    { headerKey: 'warehouse.title', field: 'warehouseName' }, // Asume que el neumático tiene un campo 'warehouseName'
  ];

  tireToDelete!: Tire;

  constructor(
    private tiresService: TiresService,
    private roleService: RoleService,
    private warehouseService: WarehouseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadTires();
  }

  onEdit(tire: Tire) {
    this.router.navigate([`/tires/${tire._id}`]);
  }

  onView(tire: Tire) {
    this.router.navigate([`/tires/view/${tire._id}`]);
  }

  loadTires() {
    this.oSub = this.tiresService.getAll().subscribe((tires) => {
      // Asumiendo que cada neumático ahora tiene un campo adicional `warehouseInfo`
      // que contiene la información del almacén resultante del `$lookup` en el backend.
      this.tires = tires.map(tire => {
        // Si la información del almacén está presente, la asignamos directamente al neumático.
        if (tire.warehouseInfo) {
          tire.warehouseName = tire.warehouseInfo.name; // Ajusta esto según la estructura de tus datos.
        }
        return tire;
      });
      this.loading = false;
    });
  }
  

  onDelete(tire: Tire) {
    // Guarda el neumático a eliminar en una propiedad para usarlo después
    this.tireToDelete = tire;
    this.modal.open();
  }

  confirmDelete() {
    if (this.tireToDelete && this.tireToDelete._id) {
      this.tiresService.delete(this.tireToDelete._id).subscribe({
        next: () => {
          MaterialService.toast('Neumático eliminado exitosamente');
          this.tires = this.tires.filter(
            (t) => t._id !== this.tireToDelete._id
          );
        },
        error: (error) => {
          MaterialService.toast(error.error.message);
        },
      });
    }
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
