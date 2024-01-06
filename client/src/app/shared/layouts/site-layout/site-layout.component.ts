import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  MaterialInstance,
  MaterialService,
} from '../../classes/material.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CurrentUser } from '../../interfaces';
import { Subject, Subscription, takeUntil } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.css'],
})
export class SiteLayoutComponent implements AfterViewInit {
  private destroy$ = new Subject<void>();
  @ViewChild('tooltip') tooltipRef!: ElementRef;
  @ViewChild('floating') floatingRef!: ElementRef;
  tooltip!: MaterialInstance;

  currentUser!: CurrentUser | null;

  timeLogin: string | undefined;

  links = [
    { url: '/overview', name: 'Обзор' },
    { url: '/analytics', name: 'Аналитика' },
    { url: '/history', name: 'История' },
    { url: '/order', name: 'Добавить заказ' },
    { url: '/categories', name: 'Ассортимент' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.currentUserValue
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: CurrentUser | null) => {
        this.currentUser = user;
        this.timeLogin = user?.timeLogin
          ? moment(user?.timeLogin).format('HH:mm:ss DD/MM/YYYY')
          : '';
      });
  }

  ngAfterViewInit() {
    MaterialService.initializeFloatingButton(this.floatingRef);
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
