import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Alert message types
 */
export type AlertType = 'success' | 'error' | 'info' | 'warning';

/**
 * Alert message model
 */
export interface Alert {
  id: number;
  type: AlertType;
  message: string;
  duration?: number; // Duration in milliseconds, undefined means persistent
}

/**
 * Alert Service
 * Manages toast/alert messages for user feedback
 */
@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$: Observable<Alert[]> = this.alertsSubject.asObservable();
  private alertIdCounter = 0;

  /**
   * Show a success alert
   */
  success(message: string, duration: number = 5000): void {
    this.addAlert('success', message, duration);
  }

  /**
   * Show an error alert
   */
  error(message: string, duration?: number): void {
    this.addAlert('error', message, duration);
  }

  /**
   * Show an info alert
   */
  info(message: string, duration: number = 5000): void {
    this.addAlert('info', message, duration);
  }

  /**
   * Show a warning alert
   */
  warning(message: string, duration: number = 5000): void {
    this.addAlert('warning', message, duration);
  }

  /**
   * Add an alert
   */
  private addAlert(type: AlertType, message: string, duration?: number): void {
    const alert: Alert = {
      id: this.alertIdCounter++,
      type,
      message,
      duration
    };

    const alerts = [...this.alertsSubject.value, alert];
    this.alertsSubject.next(alerts);

    // Auto-remove after duration if specified
    if (duration) {
      setTimeout(() => {
        this.removeAlert(alert.id);
      }, duration);
    }
  }

  /**
   * Remove an alert by ID
   */
  removeAlert(id: number): void {
    const alerts = this.alertsSubject.value.filter(alert => alert.id !== id);
    this.alertsSubject.next(alerts);
  }

  /**
   * Clear all alerts
   */
  clear(): void {
    this.alertsSubject.next([]);
  }
}

