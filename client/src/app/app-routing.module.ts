import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AuthGuard } from './shared/classes/auth.guard';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { OverviewPageComponent } from './pages/overview-page/overview-page.component';
import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';
import { HistoryPageComponent } from './pages/history-page/history-page.component';
import { OrderPageComponent } from './pages/order-page/order-page.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { CategoriesFormComponent } from './pages/categories-page/categories-form/categories-form.component';
import { OrderCategoriesComponent } from './pages/order-page/order-categories/order-categories.component';
import { OrderPositionsComponent } from './pages/order-page/order-positions/order-positions.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { WarehouseComponent } from './pages/warehouse-page/warehouse.component';
import { WarehouseFormComponent } from './pages/warehouse-page/warehouse-form/warehouse-form.component';
import { TiresComponent } from './pages/tires-page/tires.component';
import { TireFormComponent } from './pages/tires-page/tire-form/tire-form.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterPageComponent },
    ],
  },
  {
    path: '',
    component: SiteLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'overview', component: OverviewPageComponent },
      { path: 'analytics', component: AnalyticsPageComponent },
      { path: 'history', component: HistoryPageComponent },
      {
        path: 'order',
        component: OrderPageComponent,
        children: [
          { path: '', component: OrderCategoriesComponent },
          { path: ':id', component: OrderPositionsComponent }
        ],
      },
      { path: 'categories', component: CategoriesPageComponent },
      { path: 'categories/new', component: CategoriesFormComponent },
      { path: 'categories/:id', component: CategoriesFormComponent },
      { path: 'users', component: UsersPageComponent },
      { path: 'warehouses', component: WarehouseComponent },
      { path: 'warehouses/new', component: WarehouseFormComponent },
      { path: 'warehouses/:id', component: WarehouseFormComponent },
      { path: 'warehouses/:mode/:id', component: WarehouseFormComponent },
      { path: 'tires', component: TiresComponent },
      { path: 'tires/new', component: TireFormComponent },
      { path: 'tires/:id', component: TireFormComponent },
      { path: 'tires/:mode/:id', component: TireFormComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
