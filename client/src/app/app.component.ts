import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ConnectivityService } from '../app/shared/services/connectivity.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <div *ngIf="!isOnline" class="offline-notification">
      Estás desconectado. Algunas características pueden no estar disponibles.
    </div>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  isOnline: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(
    private auth: AuthService,
    private translate: TranslateService,
    private connectivityService: ConnectivityService
  ) {
    this.initializeTranslation();
  }

  ngOnInit() {
    this.checkAuthToken();
    this.connectivityService.isOnline
      .pipe(takeUntil(this.destroy$))
      .subscribe((online) => (this.isOnline = online));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeTranslation() {
    const userLang = navigator.language.split('-')[0];
    this.translate.setDefaultLang('en');
    this.translate.use(userLang);
  }

  private checkAuthToken() {
    const tokenKey = 'auth-token';
    const potentialToken = localStorage.getItem(tokenKey);
    if (potentialToken) {
      this.auth.setToken(potentialToken);
    }
  }
}
