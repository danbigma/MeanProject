import {
  Component,
  OnInit,
  Input,
  Inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormGroupConfig } from '../../interfaces';
import { ActivatedRoute } from '@angular/router';
import { switchMap, of } from 'rxjs';
import { ENTITY_SERVICE_TOKEN } from '../../classes/entity-service.token';
import {
  MaterialDatepicker,
  MaterialService,
} from '../../classes/material.service';

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.css'],
})
export class GenericFormComponent implements OnInit {
  @Input() entityConfig: FormGroupConfig = {}; // Asegura la inicialización adecuada
  form!: FormGroup;

  isNew = true;
  isValid = true;

  @ViewChild('datePicker') dateRef!: ElementRef;
  datePicker!: MaterialDatepicker;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    @Inject(ENTITY_SERVICE_TOKEN) private entityService: any // Inyección del servicio genérico
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadEntityData();
  }

  initializeForm() {
    if (this.safeEntityConfig) {
      this.form = this.createGroup(this.safeEntityConfig);
    }
  }

  getFields(key: string): FormGroupConfig | undefined {
    return this.safeEntityConfig[key]?.type === 'group'
      ? this.safeEntityConfig[key].fields
      : undefined;
  }

  loadEntityData() {
    this.route.params
      .pipe(
        switchMap((params) => {
          if (params['id']) {
            this.isNew = false;
            return this.entityService.getById(params['id']);
          }
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.updateFormData(data);
        }
      });
  }

  updateFormData(data: any) {
    this.form.patchValue({ ...data });
    setTimeout(() => {
      this.initializeMaterializeSelect();
      MaterialService.updateTextInputs(); // Asegúrate de que esta función exista y sea adecuada para tu versión de Materialize
    });
  }

  createGroup(config: FormGroupConfig): FormGroup {
    const group = this.fb.group({});
    Object.keys(config).forEach((key) => {
      const field = config[key];
      if (field.type === 'group' && field.fields) {
        group.addControl(key, this.createGroup(field.fields));
      } else {
        group.addControl(key, this.fb.control('')); // Aquí puedes agregar lógica para validadores y valores iniciales
      }
    });
    return group;
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value); // Aquí manejas la lógica de envío, como enviar los datos a un servicio
    }
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // En un método o getter que accede a entityConfig
  get safeEntityConfig(): FormGroupConfig {
    return this.entityConfig!;
  }

  initializeMaterializeSelect() {
    const selects = document.querySelectorAll('select');
    selects.forEach((select) => {
      MaterialService.initSelect(select as HTMLElement); // Asegúrate de hacer un cast a HTMLElement
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
}
