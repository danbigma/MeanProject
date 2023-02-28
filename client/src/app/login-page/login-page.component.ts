import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  form!: FormGroup;
  aSub!: Subscription;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
      ]),
    });

    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
      } else if (params['accessDenied']) {
      }
    });
  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();
    const user = {
      email: this.form.value.email,
      password: this.form.value.password,
    };
    // or this.form.value
    this.aSub = this.auth.login(user).subscribe({
      next: (v) => this.router.navigate(['/overview']),
      error: (e) => {
        console.error(e);
        this.form.enable();
      },
      complete: () => console.info('complete'),
    });
  }
}