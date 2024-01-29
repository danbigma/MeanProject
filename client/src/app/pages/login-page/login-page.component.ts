import { MaterialService } from '../../shared/classes/material.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit, OnDestroy {
  loading = false;

  form!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(4)]],
    });
  
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.handleQueryParams(params);
        this.auth.logout();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleQueryParams(params: Params) {
    const messages: { [key: string]: string } = {
      'registered': 'Ahora puedes iniciar sesión con tus credenciales.',
      'accessDenied': 'Por favor, inicia sesión para continuar.',
      'sessionFailed': 'Tu sesión ha expirado, por favor inicia sesión de nuevo.'
    };
  
    Object.keys(messages).forEach(key => {
      if (params[key as keyof typeof messages]) {
        MaterialService.toast(messages[key as keyof typeof messages]);
      }
    });
  }

  onSubmit() {
    this.form.disable();
    this.loading = true;
    const user = this.form.value;

    this.auth
      .login(user)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/overview'])
        },
        error: (e) => {
          MaterialService.toast(e.error.message);
          this.loading = false;
          this.form.enable();
          // Limpiar parámetros de consulta al permanecer en la página de inicio de sesión
          this.router.navigate([], {
            queryParams: {},
            relativeTo: this.route // Asegúrate de inyectar 'private route: ActivatedRoute' en el constructor
          });
        },
      });
  }
}
