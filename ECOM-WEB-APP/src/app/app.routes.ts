import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/customers',
    pathMatch: 'full'
  },
  {
    path: 'customers',
    loadChildren: () => import('./features/customers/customers.routes').then(m => m.CUSTOMER_ROUTES)
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCT_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'bills',
    loadChildren: () => import('./features/bills/bills.routes').then(m => m.BILL_ROUTES),
    canActivate: [AuthGuard]
  },
  {
    path: 'suppliers',
    loadComponent: () => import('./features/suppliers/supplier.component').then(m => m.SupplierComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'analytics',
    loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/customers'
  }
];

