import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  MaterialInstance,
  MaterialService,
} from '../../classes/material.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CurrentUser } from '../../interfaces';
import { Subject, takeUntil } from 'rxjs';
import { format } from 'date-fns';
import { RoleService } from '../../services/role.service';

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
    { url: '/overview', name: 'menu.overview', icon: 'dashboard' },
    { url: '/analytics', name: 'menu.analytics', icon: 'analytics' },
    { url: '/history', name: 'menu.history', icon: 'history' },
    { url: '/order', name: 'menu.order', icon: 'add_shopping_cart' },
    { url: '/categories', name: 'menu.stock', icon: 'category' },
    { url: '/warehouses', name: 'menu.warehouses', icon: 'store' },
    { url: '/tires', name: 'menu.tires', icon: 'format_list_bulleted' },
    // Añade más enlaces según sea necesario
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private roleService: RoleService,
    private elRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.auth.currentUserValue
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: CurrentUser | null) => {
        this.currentUser = user;
        if (user) {
          this.roleService.setCurrentUser(user); // Actualiza el usuario en RoleService
          this.timeLogin = user.timeLogin
            ? format(new Date(user.timeLogin), 'HH:mm:ss dd/MM/yyyy')
            : '';
        }
      });
      if (this.isAdmin()) {
        this.links.push({ url: '/users', name: 'menu.users', icon: 'people' });
      }
  }

  // Usar el método isAdmin de RoleService
  isAdmin(): boolean {
    if (this.currentUser) {
      return this.roleService.isAdmin(this.currentUser);
    }
    return false;
  }

  getLoginTooltip(): string {
    return 'Login at: ' + this.timeLogin;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      MaterialService.initializeFloatingButton(this.floatingRef);
      this.tooltip = MaterialService.initTooltip(this.tooltipRef);
      const sidenavElems = this.elRef.nativeElement.querySelectorAll('.sidenav');
      MaterialService.initSidenav(sidenavElems);
    }, 0);
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
