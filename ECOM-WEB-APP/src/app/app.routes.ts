import { Routes } from '@angular/router';

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
    loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCT_ROUTES)
  },
  {
    path: 'bills',
    loadChildren: () => import('./features/bills/bills.routes').then(m => m.BILL_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/customers'
  }
];

