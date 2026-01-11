import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiConfig } from '../config/api.config';

/**
 * Connection Check Service
 * Helps verify if backend services are reachable
 */
@Injectable({
  providedIn: 'root'
})
export class ConnectionCheckService {
  constructor(private http: HttpClient) {}

  /**
   * Check if the gateway is reachable
   */
  checkGatewayConnection(): Observable<boolean> {
    // Try to reach the gateway (even if it returns 404, it means it's reachable)
    return this.http.get(`${ApiConfig.BASE_URL}/actuator/health`, { observe: 'response' })
      .pipe(
        map(() => true),
        catchError((error) => {
          // If we get any response (even 404), the server is reachable
          // Status 0 means connection refused/network error
          if (error.status === 0) {
            return of(false);
          }
          // Any other status means server is reachable
          return of(true);
        })
      );
  }

  /**
   * Get connection status message
   */
  getConnectionStatusMessage(): string {
    return `Trying to connect to: ${ApiConfig.BASE_URL}`;
  }
}

