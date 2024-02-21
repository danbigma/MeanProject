import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap, of, catchError, finalize, tap } from 'rxjs';
import {
  MaterialDatepicker,
  MaterialService,
} from 'src/app/shared/classes/material.service';
import { TiresService } from 'src/app/shared/services/tires.service'; // Asegúrate de cambiar a TiresService
import { format } from 'date-fns';
import { Tire } from 'src/app/shared/interfaces';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tire-form',
  templateUrl: './tire-form.component.html',
  styleUrls: ['./tire-form.component.css'],
})
export class TireFormComponent implements OnInit, AfterViewInit {
  @ViewChild('datePicker') dateRef?: ElementRef;
  @ViewChild('inputFile') inputRef: ElementRef | undefined;
  @ViewChild('materialboxed') materialBoxedRef!: ElementRef;
  form!: FormGroup;
  isNew = true;
  isValid = true;
  datePicker!: MaterialDatepicker;
  materialBoxInstance: any;
  loading = false;
  isSubmitting = false;
  isReadOnly = false;

  image: File | undefined;
  imagePreview: string | undefined = '';

  tire!: Tire;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tiresService: TiresService,
    private translate: TranslateService
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
        currency: ['USD', Validators.required],
      }),
      quantityInStock: [null, [Validators.required, Validators.min(0)]],
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
                amount: tire.price?.amount,
                currency: tire.price?.currency,
              },
            });
            setTimeout(() => {
              MaterialService.updateTextInputs();
              this.initializeMaterializeSelect();
              this.initMaterializeDatepicker();
              MaterialService.initMaterialbox(this.materialBoxedRef);
            }, 0);
            this.imagePreview = tire.imageSrc;
            this.tire = tire;
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
    if (this.dateRef) {
      this.initializeMaterializeSelect();
      this.initMaterializeDatepicker();
    }
    if (this.materialBoxedRef) {
      this.materialBoxInstance = MaterialService.initMaterialbox(this.materialBoxedRef.nativeElement);
    }
  }

  initMaterializeDatepicker(): void {
    if (this.dateRef) {
      this.datePicker = MaterialService.initDatepicker(
        this.dateRef,
        this.onDatepickerClose.bind(this)
      );
    }
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
    if (!this.form.valid) return;
    this.isSubmitting = true;
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
      ? this.tiresService.create(formValue, this.image)
      : this.tiresService.update(this.tire._id ?? '', formValue, this.image);

    obs$
      .pipe(
        tap((response) => {
          const messageKey = this.isNew ? 'tire.created' : 'tire.saved';
          MaterialService.toast(this.translate.instant(messageKey));
          this.form.enable();
        }),
        catchError((error) => {
          MaterialService.toast(error.error.message);
          return of(null); // Retorna un observable que emite `null` para manejar el error y continuar.
        }),
        finalize(() => {
          setTimeout(() => {
            this.isSubmitting = false;
          }, 3000);
          this.loading = false;
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

  triggerClick() {
    this.inputRef?.nativeElement.click();
  }

  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result?.toString();
    };
    reader.readAsDataURL(file);
  }

  back() {
    this.cancel();
  }

  cancel(): void {
    this.router.navigate(['/tires']);
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
  
  ngOnDestroy(): void {
    if (this.materialBoxInstance) {
      this.materialBoxInstance.destroy();
      this.datePicker.destroy();
    }
  }
}
