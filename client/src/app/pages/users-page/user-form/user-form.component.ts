import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, of, tap, catchError, finalize } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Role, User } from 'src/app/shared/interfaces';
import { UsersService } from 'src/app/shared/services/users.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent {
  form!: FormGroup;
  isNew = true;
  user!: User;
  loading = false;
  isSubmitting = false;
  isReadOnly = false;

  roles = Object.values(Role); // Convertir el enum Role en un array

  constructor(
    private fb: FormBuilder, // Inyecta FormBuilder
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService,
    private translate: TranslateService
  ) {
    this.form = this.fb.group({
      email: [null, Validators.required],
      role: [null, Validators.required],
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
            return this.usersService.getById(id);
          }
          return of(null);
        })
      )
      .subscribe({
        next: (user) => {
          if (user) {
            this.form.patchValue(user);
            setTimeout(() => {
              this.initializeMaterializeSelect();
              MaterialService.updateTextInputs();
            }, 0);
            this.user = user;
            if (this.isReadOnly) {
              this.form.disable();
            }
          } else {
            this.form.enable();
            const passwordControl = this.fb.control('', [
              Validators.required,
              Validators.minLength(8),
            ]);
            this.form.addControl('password', passwordControl);
          }
          this.loading = false;
        },
        error: (error) => {
          MaterialService.toast(error.error.message);
          this.back();
        },
      });
  }

  onSubmit() {
    if (!this.form.valid) return;
  
    this.isSubmitting = true;
    this.loading = true;
    this.form.disable();
  
    // Extraer valores del formulario
    const email = this.form.get('email')?.value as string;
    const password = this.form.get('password')?.value as string;
    const role = this.form.get('role')?.value as string;

    let obs$;

    if(this.isNew) {
      obs$ = this.usersService.create(email, password, role)
    } else {
      const userId = this.user._id ? this.user._id : '';
      obs$ = this.usersService.update(userId, this.form.value);
    }
  
    // Llamar a UsersService.create con los argumentos individuales
    obs$.pipe(
      tap((user) => {
        this.user = user;
        const messageKey = this.isNew ? 'user.created' : 'user.saved';
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
    ).subscribe();
  
    setTimeout(() => {
      this.back();
    }, 1500);
  }
  

  ngAfterViewInit(): void {
    this.initializeMaterializeSelect();
  }

  initializeMaterializeSelect() {
    const selects = document.querySelectorAll('select');
    selects.forEach((select) => {
      MaterialService.initSelect(select as HTMLElement);
    });
  }

  back() {
    this.cancel();
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }

  isInvalid(path: string | (string | number)[]): Record<string, boolean> {
    const field = this.form.get(path);
    return { invalid: field != null && field.invalid && field.touched };
  }

  deleteUser() {}
}
