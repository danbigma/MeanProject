import { Warehouse } from './../../../shared/interfaces';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, of } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { WarehouseService } from 'src/app/shared/services/warehouse.service';

@Component({
  selector: 'app-warehouse-form',
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.css'],
})
export class WarehouseFormComponent {
  form!: FormGroup;
  isNew = true;

  warehouse!: Warehouse;

  constructor(
    private fb: FormBuilder, // Inyecta FormBuilder
    private route: ActivatedRoute,
    private router: Router,
    private warehouseService: WarehouseService
  ) {
    this.form = this.fb.group({
      name: [null, Validators.required],
      location: this.fb.group({
        country: [null, Validators.required],
        city: [null, Validators.required],
        address: [null, Validators.required],
        coordinates: this.fb.group({
          latitude: [null, Validators.required],
          longitude: [null, Validators.required],
        }),
      }),
      capacity: [null, [Validators.required, Validators.min(1)]],
      operationalStatus: [null, Validators.required],
      contactInfo: this.fb.group({
        phoneNumber: [
          null,
          [
            Validators.required,
            Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/),
          ],
        ],
        email: [null, [Validators.required, Validators.email]],
      }),
    });
  }

  ngOnInit() {
    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            return this.warehouseService.getById(params['id']);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (warehouse) => {
          if (warehouse) {
            this.form.patchValue({
              name: warehouse.name,
              location: {
                country: warehouse.location.country,
                city: warehouse.location.city,
                address: warehouse.location.address,
                coordinates: {
                  latitude: warehouse.location.coordinates?.latitude ?? 0,
                  longitude: warehouse.location.coordinates?.longitude ?? 0,
                },
              },
              capacity: warehouse.capacity,
              operationalStatus: warehouse.operationalStatus,
              contactInfo: {
                phoneNumber: warehouse.contactInfo?.phoneNumber,
                email: warehouse.contactInfo?.email,
              },
            });
            MaterialService.updateTextInputs();
            setTimeout(() => this.initializeMaterializeSelect(), 0);
            this.warehouse = warehouse;
          }
          this.form.enable();
        },
        error: (error) => {
          console.error(error); // Ajusta el manejo de errores según tu lógica de aplicación
          // Si estás utilizando un servicio para mostrar toasts o alertas, colócalo aquí.
        },
      });
  }

  ngAfterViewInit(): void {
    this.initializeMaterializeSelect();
  }

  initializeMaterializeSelect() {
    const selects = document.querySelectorAll('select');
    selects.forEach((select) => {
      MaterialService.initSelect(select as HTMLElement); // Asegúrate de hacer un cast a HTMLElement
    });
  }

  onSubmit() {
    let obs$;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.warehouseService.create(this.form.value);
    } else {
      const warehouseId = this.warehouse._id ? this.warehouse._id : '';
      obs$ = this.warehouseService.update(warehouseId, this.form.value);
    }

    obs$.subscribe({
      next: (warehouse) => {
        this.warehouse = warehouse;
        MaterialService.toast(
          this.isNew ? 'Новый склад создан' : 'Изменения сохранены'
        );
        this.form.enable();
        MaterialService.updateTextInputs();
      },
      error: (error) => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      },
    });
  }

  isInvalid(path: string | (string | number)[]): Record<string, boolean> {
    const field = this.form.get(path);
    return { invalid: field != null && field.invalid && field.touched };
  }

  deleteWarehouse() {
    const confirm = window.confirm('Вы уверены что хотите удалить');
    if (confirm && this.warehouse._id) {
      this.warehouseService.delete(this.warehouse._id).subscribe({
        next: (response) => {
          MaterialService.toast(response.message);
        },
        error: (error) => {
          MaterialService.toast(error.error.message);
        },
        complete: () => this.router.navigate(['/warehouses']),
      });
    }
  }
}
