import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

import { ConnectivityService } from '../app/shared/services/connectivity.service';
import { Subscription } from 'rxjs';

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
export class AppComponent implements OnInit {
  isOnline: boolean = true;
  private onlineSub!: Subscription;

  constructor(
    private auth: AuthService,
    private translate: TranslateService,
    private connectivityService: ConnectivityService
  ) {
    this.initializeTranslation();
  }

  ngOnInit() {
    this.checkAuthToken();
    this.onlineSub = this.connectivityService.isOnline.subscribe((online) => {
      this.isOnline = online;
    });
  }

  ngOnDestroy() {
    if (this.onlineSub) {
      this.onlineSub.unsubscribe();
    }
  }

  private initializeTranslation() {
    const userLang = navigator.language.split('-')[0]; // Obtener idioma del navegador
    this.translate.setDefaultLang('en'); // Establece el idioma por defecto
    this.translate.use(userLang); // Usa el idioma del navegador si está disponible, de lo contrario usa 'en'
  }

  private checkAuthToken() {
    const potentialToken = localStorage.getItem('auth-token');
    if (potentialToken) {
      this.auth.setToken(potentialToken);
    }
  }
}
