import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';
import { LoadingService } from '../services/loading.service';

/**
 * HTTP Error Interceptor
 * Intercepts HTTP errors and displays user-friendly messages
 */
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private alertService: AlertService,
    private loadingService: LoadingService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.loadingService.hide();

        let errorMessage = 'An unexpected error occurred';

        // Log error for debugging
        console.error('HTTP Error:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          error: error.error,
          message: error.message
        });

        if (error.error instanceof ErrorEvent) {
          // Client-side error (network error, CORS, etc.)
          const errorMsg = error.error.message || 'Unknown network error';
          
          // Detect CORS errors specifically
          if (errorMsg.includes('CORS') || errorMsg.includes('Access-Control') || errorMsg.includes('cross-origin')) {
            errorMessage = `❌ Erreur CORS détectée: ${errorMsg}

🔧 Solutions:
1. Vérifiez que le Gateway Service a été REDÉMARRÉ après la configuration CORS
2. Vérifiez la configuration CORS dans GatewayServiceApplication.java
3. Videz le cache du navigateur (Ctrl+Shift+R)
4. Vérifiez que l'origine Angular est bien http://localhost:4200`;
          } else {
            errorMessage = `Network error: ${errorMsg}`;
          }
        } else if (error.status === 0) {
          // Status 0 typically means:
          // - CORS error (most common when curl works but browser doesn't)
          // - Network error (server not reachable)
          // - Connection refused
          const url = error.url || request.url;
          const baseUrl = url.split('/api/')[0] || 'http://localhost:8088';
          
          // Since curl/Postman works but Angular doesn't, this is almost certainly CORS
          errorMessage = `❌ Erreur de connexion (Status 0) - Probablement CORS

⚠️  Les requêtes fonctionnent avec curl/Postman mais pas depuis Angular = Problème CORS

🔧 Actions requises:
1. REDÉMARREZ le Gateway Service (arrêtez et relancez)
   cd Gateway-service
   mvn spring-boot:run

2. Vérifiez que CORS est configuré dans GatewayServiceApplication.java

3. Videz le cache du navigateur (Ctrl+Shift+R ou Ctrl+F5)

4. Vérifiez la console du navigateur (F12) pour les détails CORS

URL testée: ${url}
Gateway: ${baseUrl}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 400:
              errorMessage = error.error?.message || 'Bad request. Please check your input.';
              break;
            case 401:
              errorMessage = 'Unauthorized. Please check your credentials.';
              break;
            case 403:
              errorMessage = 'Forbidden. You do not have permission to access this resource.';
              break;
            case 404:
              errorMessage = error.error?.message || `Resource not found: ${error.url}`;
              break;
            case 409:
              errorMessage = error.error?.message || 'Conflict. The resource already exists.';
              break;
            case 500:
              errorMessage = 'Internal server error. Please try again later.';
              break;
            case 503:
              errorMessage = 'Service unavailable. The requested service is not available. Please check that all backend services are running and registered in Eureka.';
              break;
            default:
              errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText || 'Unknown error'}`;
          }
        }

        this.alertService.error(errorMessage);

        return throwError(() => error);
      })
    );
  }
}

