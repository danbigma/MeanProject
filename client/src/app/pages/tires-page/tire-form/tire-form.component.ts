import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, of } from 'rxjs';
import {
  MaterialDatepicker,
  MaterialService,
} from 'src/app/shared/classes/material.service';
import { TiresService } from 'src/app/shared/services/tires.service'; // Asegúrate de cambiar a TiresService
import { format } from 'date-fns';
import { Tire } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-tire-form',
  templateUrl: './tire-form.component.html',
  styleUrls: ['./tire-form.component.css'],
})
export class TireFormComponent {
  @ViewChild('datePicker') dateRef!: ElementRef;
  form!: FormGroup;
  isNew = true;
  isValid = true;
  datePicker!: MaterialDatepicker;
  loading = false;

  tire!: Tire;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tiresService: TiresService // Cambia a TiresService
  ) {
    this.form = this.fb.group({
      brand: [null, Validators.required],
      model: [null, Validators.required],
      size: [null, Validators.required],
      type: [null, Validators.required],
      manufactureDate: [null, Validators.required],
      countryOfOrigin: [null, Validators.required],
      price: this.fb.group({
        amount: [null, [Validators.required, Validators.min(0)]],
        currency: ['USD', Validators.required], // Asume USD como moneda predeterminada
      }),
      quantityInStock: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.loading = true;
    this.form.disable();
    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
            this.loading = false;
            return this.tiresService.getById(params['id']);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (tire) => {
          if (tire) {
            this.form.patchValue({
              ...tire,
              manufactureDate: format(
                new Date(tire.manufactureDate),
                'dd.MM.yyyy'
              ), // Cambiado a formato 'yyyy-MM-dd'
              price: {
                amount: tire.price.amount,
                currency: tire.price.currency,
              },
            });
            MaterialService.updateTextInputs();
            setTimeout(() => this.initializeMaterializeSelect(), 0);
            this.tire = tire;
          }
          this.loading = false;
          this.form.enable();
        },
        error: (error) => console.error(error),
      });
  }

  ngAfterViewInit(): void {
    this.initializeMaterializeSelect();
    this.initMaterializeDatepicker();
  }

  initMaterializeDatepicker() {
    this.datePicker = MaterialService.initDatepicker(
      this.dateRef,
      this.onDatepickerClose.bind(this)
    );
  }

  onDatepickerClose() {
    if (this.datePicker.date) {
      const formattedDate = format(this.datePicker.date, 'dd.MM.yyyy');
      this.form.get('manufactureDate')!.setValue(formattedDate);
    }
  }

  initializeMaterializeSelect() {
    const selects = document.querySelectorAll('select');
    selects.forEach((select) => {
      MaterialService.initSelect(select as HTMLElement); // Asegúrate de hacer un cast a HTMLElement
    });
  }

  isInvalid(path: string | (string | number)[]): Record<string, boolean> {
    const field = this.form.get(path);
    return { invalid: field != null && field.invalid && field.touched };
  }

  onSubmit() {
    this.loading = true;
    this.form.disable();

    // Clonamos los valores del formulario para no modificar el form original
    const formValue = { ...this.form.value };

    // Convertimos la fecha de "DD.MM.YYYY" a un objeto Date de JavaScript
    const manufactureDate = formValue.manufactureDate;
    if (manufactureDate) {
      // Suponiendo que `manufactureDate` es un string con formato "DD.MM.YYYY"
      const [day, month, year] = manufactureDate.split('.').map(Number);
      const dateObject = new Date(year, month - 1, day); // Los meses en JavaScript son 0-indexados
      // Actualizamos el valor de `manufactureDate` en `formValue` con el objeto Date
      formValue.manufactureDate = dateObject;
    }

    let obs$ = this.isNew
      ? this.tiresService.create(formValue)
      : this.tiresService.update(this.tire._id ?? '', formValue);

    obs$.subscribe({
      next: (response) => {
        MaterialService.toast(
          this.isNew ? 'Neumático creado' : 'Neumático actualizado'
        );
        this.form.enable();
        this.loading = false;
        setTimeout(() => MaterialService.updateTextInputs(), 0);
        setTimeout(() => this.initializeMaterializeSelect(), 0);
      },
      error: (error) => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      },
    });
  }

  delete() {
    const confirm = window.confirm('¿Estás seguro de que quieres eliminar?');
    if (confirm && this.tire._id) {
      this.tiresService.delete(this.tire._id).subscribe({
        next: (response) => MaterialService.toast(response.message),
        error: (error) => MaterialService.toast(error.error.message),
        complete: () => this.router.navigate(['/tires']),
      });
    }
  }
}
