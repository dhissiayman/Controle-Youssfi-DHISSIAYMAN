import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { AlertComponent } from './shared/components/alert/alert.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MainLayoutComponent,
    LoadingSpinnerComponent,
    AlertComponent
  ],
  template: `
    <app-main-layout>
      <router-outlet></router-outlet>
    </app-main-layout>
    <app-loading-spinner></app-loading-spinner>
    <app-alert></app-alert>
  `
})
export class AppComponent {
  title = 'E-Commerce Management System';
}

