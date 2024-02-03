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
import { FormGroupConfig, Tire } from 'src/app/shared/interfaces';

const entityConfig: FormGroupConfig = {
  brand: {
    type: 'input',
    label: 'Marca',
    name: 'brand',
    class: "col s6",
    validators: [Validators.required],
  },
  model: {
    type: 'input',
    label: 'Modelo',
    name: 'model',
    class: "col s6",
    validators: [Validators.required],
  },
  size: {
    type: 'input',
    label: 'Tamaño',
    name: 'size',
    class: "col s6",
    validators: [Validators.required],
  },
  type: {
    type: 'input',
    label: 'Tipo',
    name: 'type',
    class: "col s6",
    validators: [Validators.required],
  },
  manufactureDate: {
    type: 'text',
    label: 'Fecha de Fabricación',
    name: 'manufactureDate',
    class: "col s6",
    dataPpicker: true,
    validators: [Validators.required],
  },
  countryOfOrigin: {
    type: 'input',
    label: 'País de Origen',
    name: 'countryOfOrigin',
    class: "col s6",
    validators: [Validators.required],
  },
  price: {
    type: 'group',
    label: 'Precio', // Este label es opcional y puede no ser necesario según tu implementación
    name: 'price',
    fields: {
      amount: {
        type: 'input',
        label: 'Monto',
        name: 'amount',
        class: "col s6",
        validators: [Validators.required, Validators.min(0)],
      },
      currency: {
        type: 'select',
        label: 'Moneda',
        name: 'currency',
        class: "col s6",
        validators: [Validators.required],
        options: [
          { value: 'USD', label: 'USD' },
          { value: 'EUR', label: 'EUR' },
          // Agregar más opciones según sea necesario
        ],
      },
    },
  },
  quantityInStock: {
    type: 'input',
    label: 'Cantidad en Stock',
    name: 'quantityInStock',
    class: "col s6",
    validators: [Validators.required, Validators.min(0)],
  },
};

@Component({
  selector: 'app-tire-form',
  templateUrl: './tire-form.component.html',
  styleUrls: ['./tire-form.component.css'],
})
export class TireFormComponent {
  @ViewChild('datePicker') dateRef!: ElementRef;
  form!: FormGroup;
  isNew = true;

  entityConfig: FormGroupConfig = entityConfig;

  isValid = true;

  datePicker!: MaterialDatepicker;

  tire!: Tire; // Usa una interfaz adecuada para Tire si está disponible

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
    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;
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
          this.form.enable();
        },
        error: (error) => console.error(error),
      });
  }

  ngAfterViewInit(): void {
    this.initializeMaterializeSelect();
    this.datePicker = MaterialService.initDatepicker(
      this.dateRef,
      this.validate.bind(this)
    );
  }

  validate() {
    if (!this.datePicker.date) {
      this.isValid = true;
      return;
    }
  }

  initializeMaterializeSelect() {
    const selects = document.querySelectorAll('select');
    selects.forEach((select) => {
      MaterialService.initSelect(select as HTMLElement); // Asegúrate de hacer un cast a HTMLElement
    });
  }

  onSubmit() {
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
