import { Warehouse } from './../../../shared/interfaces';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, of, catchError, finalize, tap } from 'rxjs';
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
  loading = false;
  isSubmitting = false;
  isReadOnly = false;

  constructor(
    private fb: FormBuilder, // Inyecta FormBuilder
    private route: ActivatedRoute,
    private router: Router,
    private warehouseService: WarehouseService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      name: [null, Validators.required],
      location: this.fb.group({
        country: [null, Validators.required],
        city: [null, Validators.required],
        address: [null, Validators.required],
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
    this.loading = true;
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          const id = params['id'];
          const mode = params['mode'];
          if (id) {
            this.isNew = false;
            if (mode === 'view') {
              this.isReadOnly = true;
            }
            return this.warehouseService.getById(id);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (warehouse) => {
          if (warehouse) {
            this.form.patchValue(warehouse);
            setTimeout(() => {
              this.initializeMaterializeSelect();
              MaterialService.updateTextInputs();
            }, 0);
            this.warehouse = warehouse;
            if (this.isReadOnly) {
              this.form.disable();
            }
          } else {
            this.form.enable();
          }
          this.loading = false;
        },
        error: (error) => MaterialService.toast(error.error.message),
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
    if (!this.form.valid) return;

    this.isSubmitting = true;
    this.loading = true;

    let obs$;
    this.form.disable();

    if (this.isNew) {
      obs$ = this.warehouseService.create(this.form.value);
    } else {
      const warehouseId = this.warehouse._id ? this.warehouse._id : '';
      obs$ = this.warehouseService.update(warehouseId, this.form.value);
    }

    obs$
      .pipe(
        tap((warehouse) => {
          this.warehouse = warehouse;
          const messageKey = this.isNew
            ? 'warehouse.created'
            : 'warehouse.saved';
          MaterialService.toast(this.translate.instant(messageKey));
        }),
        catchError((error) => {
          MaterialService.toast(error.error.message);
          return of(null); // Retorna un observable que emite `null` para que la cadena no se rompa
        }),
        finalize(() => {
          setTimeout(() => {
            this.isSubmitting = false;
          }, 3000);
          this.loading = false;
          this.form.enable();
          setTimeout(() => {
            this.initializeMaterializeSelect();
            MaterialService.updateTextInputs();
          }, 0);
        })
      )
      .subscribe();
    setTimeout(() => {
      this.back();
    }, 1500);
  }

  back() {
    this.cancel();
  }

  cancel(): void {
    this.router.navigate(['/warehouses']);
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
