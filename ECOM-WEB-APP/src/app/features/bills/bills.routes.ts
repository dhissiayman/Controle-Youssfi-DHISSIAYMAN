import { Routes } from '@angular/router';

export const BILL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./bill-list/bill-list.component').then(m => m.BillListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./bill-detail/bill-detail.component').then(m => m.BillDetailComponent)
  }
];

