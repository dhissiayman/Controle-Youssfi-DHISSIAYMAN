import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AlertService, Alert } from '../../../services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alert-container">
      <div
        *ngFor="let alert of alerts$ | async"
        [class]="'alert alert-' + alert.type"
        (click)="removeAlert(alert.id)"
      >
        <span class="alert-message">{{ alert.message }}</span>
        <button class="alert-close" (click)="removeAlert(alert.id); $event.stopPropagation()">×</button>
      </div>
    </div>
  `,
  styles: [`
    .alert-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      max-width: 400px;
    }

    .alert {
      padding: 12px 20px;
      border-radius: 4px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .alert-error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .alert-info {
      background-color: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }

    .alert-warning {
      background-color: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }

    .alert-message {
      flex: 1;
    }

    .alert-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      margin-left: 10px;
      opacity: 0.7;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .alert-close:hover {
      opacity: 1;
    }
  `]
})
export class AlertComponent {
  alerts$: Observable<Alert[]>;

  constructor(private alertService: AlertService) {
    this.alerts$ = this.alertService.alerts$;
  }

  removeAlert(id: number): void {
    this.alertService.removeAlert(id);
  }
}

