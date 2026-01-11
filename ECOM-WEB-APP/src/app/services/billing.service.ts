import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Bill } from '../models/bill.model';
import { ApiConfig } from '../config/api.config';

/**
 * Billing Service
 * Handles all HTTP operations for Bill entity
 * Maps to Billing Service REST endpoints via API Gateway
 * Gateway routes /api/bills/** to BILLING-SERVICE
 */
@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  /**
   * Get bill by ID
   * GET /api/bills/{id} (via gateway)
   * Gateway rewrites to /bills/{id} and forwards to BILLING-SERVICE
   * Returns bill with populated customer and product items
   * Throws error if bill not found (404)
   */
  getBillById(id: number): Observable<Bill> {
    return this.http.get<Bill>(`${ApiConfig.BILLS_ENDPOINT}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return throwError(() => new Error('Bill not found'));
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Get all bills
   * GET /api/bills (via gateway)
   * Gateway rewrites to /bills and forwards to BILLING-SERVICE
   * Returns list of all bills with populated customer and product items
   */
  getAllBills(): Observable<Bill[]> {
    console.log('Fetching bills from:', ApiConfig.BILLS_ENDPOINT);
    return this.http.get<Bill[]>(ApiConfig.BILLS_ENDPOINT).pipe(
      // Ensure we always return an array, even if response is null/undefined
      map(response => {
        console.log('Raw response in service:', response);
        if (Array.isArray(response)) {
          console.log('Response is array, length:', response.length);
          return response;
        }
        // Handle wrapped responses
        if (response && typeof response === 'object') {
          const wrapped = (response as any)._embedded?.bills || 
                         (response as any).content || 
                         (response as any).data;
          const result = Array.isArray(wrapped) ? wrapped : [];
          console.log('Extracted wrapped array, length:', result.length);
          return result;
        }
        console.log('Response is null/undefined, returning empty array');
        return [];
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error in getAllBills service:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Generate bills for all customers
   * POST /api/bills/generate (via gateway)
   * Gateway rewrites to /bills/generate and forwards to BILLING-SERVICE
   * Creates bills automatically for all existing customers with all existing products
   * No need to restart the billing service!
   */
  generateBills(): Observable<any> {
    const url = `${ApiConfig.BILLS_ENDPOINT}/generate`;
    console.log('Generating bills at URL:', url);
    console.log('HTTP Options:', this.httpOptions);
    return this.http.post<any>(url, {}, this.httpOptions);
  }
}

